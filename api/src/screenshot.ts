import { chromium, Browser, Page } from 'playwright';

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  return browser;
}

export interface ScreenshotOptions {
  url: string;
  width?: number;
  height?: number;
  fullPage?: boolean;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
  timeout?: number;
  selector?: string; // Capture specific element
}

export interface ScreenshotResult {
  screenshot: string; // base64
  metadata: {
    url: string;
    width: number;
    height: number;
    timestamp: number;
  };
}

export async function captureScreenshot(
  options: ScreenshotOptions
): Promise<ScreenshotResult> {
  const browser = await getBrowser();
  const page: Page = await browser.newPage({
    viewport: {
      width: options.width || 1440,
      height: options.height || 900
    }
  });

  try {
    // Navigate to URL
    await page.goto(options.url, {
      waitUntil: options.waitUntil || 'networkidle',
      timeout: options.timeout || 30000
    });

    // Wait for any animations to settle
    await page.waitForTimeout(1000);

    let screenshot: Buffer;

    if (options.selector) {
      // Capture specific element
      const element = await page.locator(options.selector);
      screenshot = await element.screenshot({
        type: 'png'
      });
    } else {
      // Capture full page or viewport
      screenshot = await page.screenshot({
        type: 'png',
        fullPage: options.fullPage ?? true
      });
    }

    const base64Screenshot = screenshot.toString('base64');
    const dimensions = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight
    }));

    await page.close();

    return {
      screenshot: base64Screenshot,
      metadata: {
        url: options.url,
        width: dimensions.width,
        height: dimensions.height,
        timestamp: Date.now()
      }
    };
  } catch (error) {
    await page.close();
    throw error;
  }
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

// Cleanup on process exit
process.on('SIGINT', async () => {
  await closeBrowser();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeBrowser();
  process.exit(0);
});
