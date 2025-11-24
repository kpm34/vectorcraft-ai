import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuration
export const GEMINI_CONFIG = {
  maxRetries: 3,
  initialRetryDelay: 1000, // 1 second
  maxRetryDelay: 10000, // 10 seconds
  timeout: 60000, // 60 seconds
  backoffMultiplier: 2,
};

// Error types
export enum GeminiErrorType {
  RATE_LIMIT = 'RATE_LIMIT',
  TIMEOUT = 'TIMEOUT',
  NO_CANDIDATES = 'NO_CANDIDATES',
  NO_IMAGE_DATA = 'NO_IMAGE_DATA',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  UNKNOWN = 'UNKNOWN'
}

export interface GeminiError extends Error {
  type: GeminiErrorType;
  retryable: boolean;
  originalError?: any;
}

// Classify errors for retry logic
export function classifyError(error: any): GeminiError {
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
  // No candidates
  else if (message.includes('no candidates')) {
    type = GeminiErrorType.NO_CANDIDATES;
    retryable = false;
  }

  const geminiError = new Error(error.message) as GeminiError;
  geminiError.type = type;
  geminiError.retryable = retryable;
  geminiError.originalError = error;

  return geminiError;
}

// Calculate exponential backoff delay
export function calculateDelay(attemptNumber: number): number {
  const delay = Math.min(
    GEMINI_CONFIG.initialRetryDelay * Math.pow(GEMINI_CONFIG.backoffMultiplier, attemptNumber),
    GEMINI_CONFIG.maxRetryDelay
  );
  // Add jitter to prevent thundering herd
  const jitter = Math.random() * 0.3 * delay;
  return delay + jitter;
}

// Sleep utility
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Timeout wrapper
export async function withTimeout<T>(
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
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = GEMINI_CONFIG.maxRetries
): Promise<T> {
  let lastError: GeminiError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Gemini] Attempt ${attempt + 1}/${maxRetries + 1} for ${operationName}`);

      const result = await withTimeout(
        operation(),
        GEMINI_CONFIG.timeout,
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

// Singleton client with connection pooling
export class GeminiClient {
  private static instance: GoogleGenerativeAI | null = null;
  private static apiKey: string | null = null;

  static getInstance(apiKey?: string): GoogleGenerativeAI {
    const key = apiKey || process.env.GEMINI_API_KEY || process.env.API_KEY;

    if (!key) {
      throw new Error('No API key found. Please set GEMINI_API_KEY environment variable.');
    }

    // Recreate client if API key changed
    if (this.apiKey !== key || !this.instance) {
      console.log('[Gemini] Creating new client instance');
      this.apiKey = key;
      this.instance = new GoogleGenerativeAI(key);
    }

    return this.instance;
  }

  static reset(): void {
    console.log('[Gemini] Resetting client instance');
    this.instance = null;
    this.apiKey = null;
  }
}

// Extract image data helper
export function extractImageData(response: any): string | null {
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
