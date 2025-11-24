import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { captureScreenshot, ScreenshotOptions } from './screenshot.js';
import {
  GeminiClient,
  retryWithBackoff,
  extractImageData as extractImageDataUtil,
  GEMINI_CONFIG
} from './geminiUtils.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('ERROR: GEMINI_API_KEY environment variable is required');
  process.exit(1);
}

const genAI = GeminiClient.getInstance(API_KEY);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting (simple in-memory)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function rateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  let record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + windowMs };
    requestCounts.set(ip, record);
  }

  if (record.count >= maxRequests) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Try again later.',
      retryAfter: Math.ceil((record.resetTime - now) / 1000)
    });
  }

  record.count++;
  next();
}

// Types
interface ConvertRequest {
  image: string; // base64 encoded
  mimeType: string;
  mode?: 'logo-clean' | 'icon' | 'illustration' | 'auto';
  complexity?: 'low' | 'medium' | 'high';
  quality?: 'low' | 'medium' | 'high';
  maxColors?: number;
}

interface ConvertResponse {
  svg: string;
  metadata?: {
    mode: string;
    colors: number;
    fileSize: number;
  };
}

// API Routes

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'operational',
    version: '1.0.0',
    endpoints: {
      vector: {
        convert: '/api/vector/convert',
        screenshot: '/api/vector/screenshot'
      },
      texture: {
        generate: '/api/texture/generate'
      },
      health: '/health'
    }
  });
});

// ====================
// VECTOR STUDIO ENDPOINTS
// ====================

app.post('/api/vector/convert', rateLimit, async (req: Request, res: Response) => {
  try {
    const {
      image,
      mimeType,
      mode = 'auto',
      complexity = 'medium',
      quality = 'medium',
      maxColors = 8
    }: ConvertRequest = req.body;

    // Validate request
    if (!image || !mimeType) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: image, mimeType'
      });
    }

    if (!mimeType.startsWith('image/')) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid mimeType. Must be image/*'
      });
    }

    // Generate SVG using Gemini with retry logic
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = buildPrompt(mode, complexity, maxColors);

    const result = await retryWithBackoff(
      async () => {
        return await model.generateContent([
          prompt,
          {
            inlineData: {
              data: image,
              mimeType
            }
          }
        ]);
      },
      'SVG Conversion'
    );

    const responseText = result.response.text();
    const svg = extractSvg(responseText);

    if (!svg) {
      throw new Error('Failed to extract SVG from AI response');
    }

    const response: ConvertResponse = {
      svg,
      metadata: {
        mode,
        colors: maxColors,
        fileSize: Buffer.byteLength(svg, 'utf8')
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({
      error: 'Conversion Failed',
      message: (error as Error).message
    });
  }
});

app.post('/api/vector/screenshot', rateLimit, async (req: Request, res: Response) => {
  try {
    const {
      url,
      width = 1440,
      height = 900,
      fullPage = true,
      waitUntil = 'networkidle',
      timeout = 30000,
      selector
    }: ScreenshotOptions & { url: string } = req.body;

    // Validate URL
    if (!url) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required field: url'
      });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid URL format'
      });
    }

    // Capture screenshot
    const result = await captureScreenshot({
      url,
      width,
      height,
      fullPage,
      waitUntil,
      timeout,
      selector
    });

    res.json(result);
  } catch (error) {
    console.error('Screenshot error:', error);
    res.status(500).json({
      error: 'Screenshot Failed',
      message: (error as Error).message
    });
  }
});

// ====================
// TEXTURE STUDIO ENDPOINTS
// ====================

interface TextureGenerateRequest {
  prompt: string;
  mode: 'MATCAP' | 'PBR';
  quality: 'FAST' | 'HIGH';
  resolution?: '1K' | '2K';
}

interface TextureGenerateResponse {
  albedo: string; // Base64 data URI
  normal?: string; // Base64 data URI (PBR only)
  roughness?: string; // Base64 data URI (PBR only)
  metadata: {
    mode: string;
    resolution: string;
    timestamp: number;
  };
}

app.post('/api/texture/generate', rateLimit, async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      mode = 'MATCAP',
      quality = 'FAST',
      resolution = '1K'
    }: TextureGenerateRequest = req.body;

    // Validate request
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required field: prompt'
      });
    }

    if (!['MATCAP', 'PBR'].includes(mode)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid mode. Must be MATCAP or PBR'
      });
    }

    // Select model based on quality/resolution
    const modelName = (quality === 'HIGH' || resolution === '2K')
      ? 'gemini-3-pro-image-preview'
      : 'gemini-2.5-flash-image';

    console.log(`[Texture] Generating ${mode} texture: "${prompt}" using ${modelName} at ${resolution}`);

    const model = genAI.getGenerativeModel({ model: modelName });

    // Generate albedo/base texture with retry logic
    const albedoPrompt = mode === 'MATCAP'
      ? `A high-quality 3D material capture (MatCap) sphere of ${prompt}. The image should be a single perfectly round sphere centered on a pitch black background, showcasing the lighting, reflection, and material properties cleanly. No other objects or background details.`
      : `A high-quality, seamless, top-down, flat texture pattern of ${prompt}. Even lighting, no shadows from external objects, tileable, 4k texture quality.`;

    const albedoResult = await retryWithBackoff(
      async () => await model.generateContent([albedoPrompt]),
      `${mode} Albedo Generation`
    );
    const albedoData = extractImageDataUtil(albedoResult.response);

    if (!albedoData) {
      throw new Error('Failed to generate albedo texture');
    }

    const response: TextureGenerateResponse = {
      albedo: `data:image/png;base64,${albedoData}`,
      metadata: {
        mode,
        resolution,
        timestamp: Date.now()
      }
    };

    // Generate normal and roughness maps for PBR mode with retry logic
    if (mode === 'PBR') {
      // Normal map
      const normalPrompt = `A seamless normal map texture for ${prompt}. Purple/blue tones representing surface normals, tileable, high detail.`;
      const normalResult = await retryWithBackoff(
        async () => await model.generateContent([normalPrompt]),
        'PBR Normal Map Generation'
      );
      const normalData = extractImageDataUtil(normalResult.response);
      if (normalData) {
        response.normal = `data:image/png;base64,${normalData}`;
      }

      // Roughness map
      const roughnessPrompt = `A seamless roughness/specular map texture for ${prompt}. Grayscale image showing surface roughness variation, tileable, high contrast.`;
      const roughnessResult = await retryWithBackoff(
        async () => await model.generateContent([roughnessPrompt]),
        'PBR Roughness Map Generation'
      );
      const roughnessData = extractImageDataUtil(roughnessResult.response);
      if (roughnessData) {
        response.roughness = `data:image/png;base64,${roughnessData}`;
      }
    }

    console.log(`[Texture] Successfully generated ${mode} texture`);
    res.json(response);
  } catch (error) {
    console.error('[Texture] Generation error:', error);
    res.status(500).json({
      error: 'Texture Generation Failed',
      message: (error as Error).message
    });
  }
});

// Helper functions

function buildPrompt(mode: string, complexity: string, maxColors: number): string {
  const basePrompt = 'Convert this image to clean, optimized SVG code.';

  const modePrompts: Record<string, string> = {
    'logo-clean': `${basePrompt} This is a logo - prioritize clean paths, minimal colors (max ${maxColors}), and small file size. Remove any background. Use simple geometric shapes where possible.`,
    'icon': `${basePrompt} This is an icon - create simple, recognizable shapes with consistent stroke width. Normalize to a square viewBox. Use no more than ${maxColors} colors. Ensure grid alignment.`,
    'illustration': `${basePrompt} This is detailed artwork - preserve details, use gradients if needed, and allow up to ${maxColors} colors. Maintain visual fidelity.`,
    'auto': `${basePrompt} Analyze the image and choose the best vectorization approach. Use up to ${maxColors} colors and optimize for ${complexity} complexity.`
  };

  return modePrompts[mode] || modePrompts['auto'];
}

function extractSvg(text: string): string | null {
  // Try to extract SVG from markdown code blocks
  const codeBlockMatch = text.match(/```(?:svg|xml)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // Try to find raw SVG
  const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/i);
  if (svgMatch) {
    return svgMatch[0];
  }

  return null;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 VectorCraft API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 Status: http://localhost:${PORT}/api/status`);
  console.log(`\n🎨 Vector Studio Endpoints:`);
  console.log(`   • Convert: http://localhost:${PORT}/api/vector/convert`);
  console.log(`   • Screenshot: http://localhost:${PORT}/api/vector/screenshot`);
  console.log(`\n🖼️  Texture Studio Endpoints:`);
  console.log(`   • Generate: http://localhost:${PORT}/api/texture/generate`);
});

export default app;
