#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, extname, basename } from 'path';

const program = new Command();

interface ConvertOptions {
  out?: string;
  mode?: 'logo-clean' | 'icon' | 'illustration' | 'auto';
  apiKey?: string;
  apiUrl?: string;
  quality?: 'low' | 'medium' | 'high';
  colors?: number;
}

async function convertImageToSvg(
  inputPath: string,
  options: ConvertOptions
): Promise<string> {
  const apiUrl = options.apiUrl || process.env.VECTORCRAFT_API_URL || 'https://api.vectorcraft.ai';
  const apiKey = options.apiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'API key required. Set GEMINI_API_KEY environment variable or use --api-key option.'
    );
  }

  // Read input file
  const imageBuffer = readFileSync(inputPath);
  const base64Data = imageBuffer.toString('base64');
  const mimeType = getMimeType(inputPath);

  // Prepare request
  const complexity = options.mode === 'logo-clean' || options.mode === 'icon' ? 'low' :
                     options.mode === 'illustration' ? 'high' : 'medium';

  const response = await fetch(`${apiUrl}/convert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      image: base64Data,
      mimeType,
      mode: options.mode || 'auto',
      complexity,
      quality: options.quality || 'medium',
      maxColors: options.colors || 8
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API request failed: ${error}`);
  }

  const result = await response.json();
  return result.svg;
}

function getMimeType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

function getOutputPath(inputPath: string, outputPath?: string): string {
  if (outputPath) return outputPath;

  const dir = resolve(inputPath, '..');
  const name = basename(inputPath, extname(inputPath));
  return resolve(dir, `${name}.svg`);
}

program
  .name('svgify')
  .description('VectorCraft AI CLI - Convert images to SVG')
  .version('1.0.0');

program
  .argument('<input>', 'Input image file (PNG, JPG, JPEG)')
  .option('-o, --out <path>', 'Output SVG file path')
  .option('-m, --mode <mode>', 'Conversion mode: logo-clean, icon, illustration, auto', 'auto')
  .option('-k, --api-key <key>', 'API key (or set GEMINI_API_KEY env var)')
  .option('-u, --api-url <url>', 'API URL (default: https://api.vectorcraft.ai)')
  .option('-q, --quality <quality>', 'Quality: low, medium, high', 'medium')
  .option('-c, --colors <number>', 'Max colors to extract', '8')
  .action(async (input: string, options: ConvertOptions) => {
    const spinner = ora('Converting image to SVG...').start();

    try {
      // Validate input file
      const inputPath = resolve(input);
      if (!existsSync(inputPath)) {
        spinner.fail(chalk.red(`Input file not found: ${input}`));
        process.exit(1);
      }

      // Determine output path
      const outputPath = getOutputPath(inputPath, options.out);

      // Convert
      spinner.text = `Converting ${chalk.cyan(basename(inputPath))} with mode: ${chalk.yellow(options.mode || 'auto')}`;
      const svg = await convertImageToSvg(inputPath, options);

      // Write output
      writeFileSync(outputPath, svg, 'utf-8');

      spinner.succeed(
        chalk.green(`✓ Converted successfully!\n`) +
        chalk.gray(`  Input:  ${inputPath}\n`) +
        chalk.gray(`  Output: ${outputPath}\n`) +
        chalk.gray(`  Mode:   ${options.mode || 'auto'}`)
      );
    } catch (error) {
      spinner.fail(chalk.red(`Conversion failed: ${(error as Error).message}`));
      process.exit(1);
    }
  });

program
  .command('batch <pattern>')
  .description('Convert multiple images matching a glob pattern')
  .option('-o, --out <dir>', 'Output directory')
  .option('-m, --mode <mode>', 'Conversion mode', 'auto')
  .action(async (pattern: string, options: ConvertOptions) => {
    console.log(chalk.yellow('Batch conversion coming soon!'));
    console.log(chalk.gray(`Pattern: ${pattern}`));
  });

program.parse();
