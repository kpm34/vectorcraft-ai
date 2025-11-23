import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { captureScreenshot, ScreenshotOptions } from './screenshot.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('ERROR: GEMINI_API_KEY environment variable is required');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

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
      convert: '/api/convert',
      health: '/health'
    }
  });
});

app.post('/api/convert', rateLimit, async (req: Request, res: Response) => {
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

    // Generate SVG using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = buildPrompt(mode, complexity, maxColors);

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image,
          mimeType
        }
      }
    ]);

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

app.post('/api/screenshot', rateLimit, async (req: Request, res: Response) => {
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
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/convert`);
});

export default app;
