import { GoogleGenAI } from "@google/genai";
import { TextureMode, ModelQuality } from "../types/types";

// Configuration
const CONFIG = {
  maxRetries: 3,
  initialRetryDelay: 1000, // 1 second
  maxRetryDelay: 10000, // 10 seconds
  timeout: 60000, // 60 seconds
  backoffMultiplier: 2,
};

// Error types for better handling
enum GeminiErrorType {
  RATE_LIMIT = 'RATE_LIMIT',
  TIMEOUT = 'TIMEOUT',
  NO_CANDIDATES = 'NO_CANDIDATES',
  NO_IMAGE_DATA = 'NO_IMAGE_DATA',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  UNKNOWN = 'UNKNOWN'
}

interface GeminiError extends Error {
  type: GeminiErrorType;
  retryable: boolean;
  originalError?: any;
}

// Retry-able error detection
function classifyError(error: any): GeminiError {
  const message = error?.message?.toLowerCase() || '';
  const status = error?.status || error?.statusCode;

  let type = GeminiErrorType.UNKNOWN;
  let retryable = false;

  // Rate limiting
  if (status === 429 || message.includes('rate limit') || message.includes('quota')) {
    type = GeminiErrorType.RATE_LIMIT;
    retryable = true;
  }
  // Timeout
  else if (message.includes('timeout') || message.includes('timed out')) {
    type = GeminiErrorType.TIMEOUT;
    retryable = true;
  }
  // Network errors
  else if (
    message.includes('network') ||
    message.includes('econnreset') ||
    message.includes('enotfound') ||
    message.includes('econnrefused') ||
    status === 502 ||
    status === 503 ||
    status === 504
  ) {
    type = GeminiErrorType.NETWORK;
    retryable = true;
  }
  // Authentication
  else if (status === 401 || status === 403 || message.includes('api key')) {
    type = GeminiErrorType.AUTHENTICATION;
    retryable = false;
  }
  // No candidates (content filtered)
  else if (message.includes('no candidates')) {
    type = GeminiErrorType.NO_CANDIDATES;
    retryable = false;
  }
  // No image data
  else if (message.includes('no image data')) {
    type = GeminiErrorType.NO_IMAGE_DATA;
    retryable = false;
  }

  const geminiError = new Error(error.message) as GeminiError;
  geminiError.type = type;
  geminiError.retryable = retryable;
  geminiError.originalError = error;

  return geminiError;
}

// Exponential backoff delay
function calculateDelay(attemptNumber: number): number {
  const delay = Math.min(
    CONFIG.initialRetryDelay * Math.pow(CONFIG.backoffMultiplier, attemptNumber),
    CONFIG.maxRetryDelay
  );
  // Add jitter to prevent thundering herd
  const jitter = Math.random() * 0.3 * delay;
  return delay + jitter;
}

// Sleep utility
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Timeout wrapper
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  operationName: string
): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(`${operationName} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutHandle!);
    return result;
  } catch (error) {
    clearTimeout(timeoutHandle!);
    throw error;
  }
}

// Main retry logic wrapper
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = CONFIG.maxRetries
): Promise<T> {
  let lastError: GeminiError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Gemini] Attempt ${attempt + 1}/${maxRetries + 1} for ${operationName}`);

      const result = await withTimeout(
        operation(),
        CONFIG.timeout,
        operationName
      );

      if (attempt > 0) {
        console.log(`[Gemini] ✓ ${operationName} succeeded after ${attempt} retries`);
      }

      return result;
    } catch (error) {
      lastError = classifyError(error);

      console.error(`[Gemini] Attempt ${attempt + 1} failed:`, {
        type: lastError.type,
        message: lastError.message,
        retryable: lastError.retryable
      });

      // Don't retry on last attempt or non-retryable errors
      if (attempt === maxRetries || !lastError.retryable) {
        break;
      }

      const delay = calculateDelay(attempt);
      console.log(`[Gemini] Retrying in ${Math.round(delay)}ms...`);
      await sleep(delay);
    }
  }

  // All retries failed
  console.error(`[Gemini] ✗ ${operationName} failed after ${maxRetries + 1} attempts`);
  throw lastError || new Error(`${operationName} failed after all retries`);
}

// Singleton AI client with connection pooling
class GeminiClient {
  private static instance: GoogleGenAI | null = null;
  private static apiKey: string | null = null;

  static getInstance(): GoogleGenAI {
    const currentApiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

    if (!currentApiKey) {
      throw new Error('No API key found. Please set GEMINI_API_KEY environment variable.');
    }

    // Recreate client if API key changed
    if (this.apiKey !== currentApiKey || !this.instance) {
      console.log('[Gemini] Creating new client instance');
      this.apiKey = currentApiKey;
      this.instance = new GoogleGenAI({ apiKey: currentApiKey });
    }

    return this.instance;
  }

  static reset(): void {
    console.log('[Gemini] Resetting client instance');
    this.instance = null;
    this.apiKey = null;
  }
}

// Extract image data with better error handling
function extractImageData(response: any): string | null {
  try {
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      return null;
    }

    const parts = candidates[0]?.content?.parts;
    if (!parts || parts.length === 0) {
      return null;
    }

    for (const part of parts) {
      if (part.inlineData?.data) {
        return part.inlineData.data;
      }
    }

    return null;
  } catch (error) {
    console.error('[Gemini] Error extracting image data:', error);
    return null;
  }
}

// Main texture generation function with retry logic
export const generateTextureImage = async (
  prompt: string,
  mode: TextureMode,
  quality: ModelQuality,
  resolution: '1K' | '2K' = '1K',
  referenceImage?: string | null
): Promise<string> => {
  // Validate inputs
  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Prompt cannot be empty');
  }

  const ai = GeminiClient.getInstance();

  // Select model
  const modelName = (quality === ModelQuality.HIGH || resolution === '2K')
    ? 'gemini-3-pro-image-preview'
    : 'gemini-2.5-flash-image';

  console.log(`[Gemini] Starting generation:`, {
    model: modelName,
    mode,
    quality,
    resolution,
    promptLength: prompt.length,
    hasReferenceImage: !!referenceImage
  });

  // Build intelligent system prompt that analyzes image + text
  const buildAnalysisPrompt = (): string => {
    const baseInstruction = mode === TextureMode.MATCAP
      ? "Generate a high-quality 3D material capture (MatCap) sphere on a pitch black background."
      : "Generate a high-quality, seamless, tileable texture pattern with even lighting and no shadows.";

    if (referenceImage) {
      // Multimodal: Image + Text prompt
      return `${baseInstruction}

REFERENCE IMAGE ANALYSIS:
- Carefully analyze the reference image provided
- Extract key visual elements: colors, patterns, surface details, lighting characteristics
- Identify material properties: glossiness, roughness, metallic qualities, transparency

USER REQUEST:
${prompt}

TASK:
1. Analyze the reference image to understand the visual style and material properties
2. Combine the reference image's characteristics with the user's text description
3. Generate a new texture that blends both inputs harmoniously
4. Maintain the essence of the reference while incorporating the user's creative direction

${mode === TextureMode.MATCAP
  ? "OUTPUT: A single perfectly round sphere centered on pitch black background, showcasing the combined material properties cleanly. No other objects or background details."
  : "OUTPUT: A seamless, top-down, flat texture pattern that is tileable and ready for 3D use. 4k texture quality."
}`;
    } else {
      // Text-only prompt (original behavior)
      return mode === TextureMode.MATCAP
        ? `A high-quality 3D material capture (MatCap) sphere of ${prompt}. The image should be a single perfectly round sphere centered on a pitch black background, showcasing the lighting, reflection, and material properties cleanly. No other objects or background details.`
        : `A high-quality, seamless, top-down, flat texture pattern of ${prompt}. Even lighting, no shadows from external objects, tileable, 4k texture quality.`;
    }
  };

  const finalPrompt = buildAnalysisPrompt();

  // Image config
  const imageConfig: any = {
    aspectRatio: "1:1",
  };

  if (modelName === 'gemini-3-pro-image-preview') {
    imageConfig.imageSize = resolution;
  }

  // Generation operation with retry
  const response = await retryWithBackoff(
    async () => {
      // Build content parts (text + optional image)
      const contentParts: any[] = [{ text: finalPrompt }];

      // Add reference image if provided
      if (referenceImage) {
        // Extract base64 data from data URI
        const base64Data = referenceImage.includes('base64,')
          ? referenceImage.split('base64,')[1]
          : referenceImage;

        // Detect MIME type from data URI
        const mimeType = referenceImage.match(/data:([^;]+);/)?.[1] || 'image/png';

        contentParts.push({
          inlineData: {
            data: base64Data,
            mimeType
          }
        });

        console.log(`[Gemini] Including reference image (${mimeType}, ${Math.round(base64Data.length / 1024)}KB)`);
      }

      return await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: contentParts,
        },
        config: {
          imageConfig,
        },
      });
    },
    `Generate ${mode} texture`,
    CONFIG.maxRetries
  );

  // Extract image data
  const candidates = response.candidates;
  if (!candidates || candidates.length === 0) {
    console.error('[Gemini] No candidates in response');
    throw new Error("No candidates found. The model may have blocked the request due to safety filters.");
  }

  const parts = candidates[0]?.content?.parts;
  if (!parts || parts.length === 0) {
    console.error('[Gemini] No content parts in response');
    throw new Error("No content parts found in API response.");
  }

  // Find image data
  for (const part of parts) {
    if (part.inlineData?.data) {
      const dataSize = part.inlineData.data.length;
      console.log(`[Gemini] ✓ Image generated successfully (${Math.round(dataSize / 1024)}KB base64)`);
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  // No image data found
  console.error('[Gemini] Response structure:', JSON.stringify(parts, null, 2));
  throw new Error("No image data found in response. The model may have returned text instead of an image.");
};

// Health check function
export async function checkGeminiConnection(): Promise<{
  status: 'ok' | 'error';
  message: string;
  latency?: number;
}> {
  try {
    const startTime = Date.now();
    const ai = GeminiClient.getInstance();

    // Simple test request
    await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: 'Test connection' }],
      },
    });

    const latency = Date.now() - startTime;

    return {
      status: 'ok',
      message: 'Gemini API connection successful',
      latency
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error?.message || 'Unknown error'
    };
  }
}

// Reset connection (useful for troubleshooting)
export function resetGeminiConnection(): void {
  GeminiClient.reset();
}
