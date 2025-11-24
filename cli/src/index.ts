#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, extname, basename, join } from 'path';

const program = new Command();

interface ConvertOptions {
  out?: string;
  mode?: 'logo-clean' | 'icon' | 'illustration' | 'auto';
  apiKey?: string;
  apiUrl?: string;
  quality?: 'low' | 'medium' | 'high';
  colors?: number;
}

interface TextureOptions {
  out?: string;
  mode?: 'MATCAP' | 'PBR';
  quality?: 'FAST' | 'HIGH';
  resolution?: '1K' | '2K';
  apiKey?: string;
  apiUrl?: string;
}

async function convertImageToSvg(
  inputPath: string,
  options: ConvertOptions
): Promise<string> {
  const apiUrl = options.apiUrl || process.env.VECTORCRAFT_API_URL || 'http://localhost:3001/api';
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

  const response = await fetch(`${apiUrl}/vector/convert`, {
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

async function generateTexture(
  prompt: string,
  options: TextureOptions
): Promise<{ albedo: Buffer; normal?: Buffer; roughness?: Buffer }> {
  const apiUrl = options.apiUrl || process.env.VECTORCRAFT_API_URL || 'http://localhost:3001/api';
  const apiKey = options.apiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'API key required. Set GEMINI_API_KEY environment variable or use --api-key option.'
    );
  }

  const response = await fetch(`${apiUrl}/texture/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt,
      mode: options.mode || 'MATCAP',
      quality: options.quality || 'FAST',
      resolution: options.resolution || '1K'
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API request failed: ${error}`);
  }

  const result = await response.json();
  
  // Helper to decode base64 data URI
  const decode = (dataUri: string) => {
    const base64 = dataUri.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(base64, 'base64');
  };

  return {
    albedo: decode(result.albedo),
    normal: result.normal ? decode(result.normal) : undefined,
    roughness: result.roughness ? decode(result.roughness) : undefined
  };
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
  .description('VectorCraft AI CLI - Convert images to SVG and Generate Textures')
  .version('1.0.0');

program
  .command('convert <input>')
  .description('Convert an image to SVG')
  .option('-o, --out <path>', 'Output SVG file path')
  .option('-m, --mode <mode>', 'Conversion mode: logo-clean, icon, illustration, auto', 'auto')
  .option('-k, --api-key <key>', 'API key (or set GEMINI_API_KEY env var)')
  .option('-u, --api-url <url>', 'API URL (default: http://localhost:3001/api)')
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
  .command('texture <prompt>')
  .description('Generate a PBR or MatCap texture')
  .option('-o, --out <dir>', 'Output directory (defaults to current dir)')
  .option('-m, --mode <mode>', 'Mode: MATCAP or PBR', 'MATCAP')
  .option('-q, --quality <quality>', 'Quality: FAST or HIGH', 'FAST')
  .option('-r, --resolution <res>', 'Resolution: 1K or 2K', '1K')
  .option('-k, --api-key <key>', 'API key (or set GEMINI_API_KEY env var)')
  .option('-u, --api-url <url>', 'API URL (default: http://localhost:3001/api)')
  .action(async (prompt: string, options: TextureOptions) => {
    const spinner = ora(`Generating ${options.mode} texture for "${prompt}"...`).start();

    try {
      const result = await generateTexture(prompt, options);
      const outDir = options.out ? resolve(options.out) : process.cwd();
      
      if (!existsSync(outDir)) {
        mkdirSync(outDir, { recursive: true });
      }

      const safePrompt = prompt.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 30);
      
      // Save Albedo
      const albedoPath = join(outDir, `${safePrompt}_albedo.png`);
      writeFileSync(albedoPath, result.albedo);
      
      let message = chalk.green(`✓ Generated successfully!\n`) +
                    chalk.gray(`  Output: ${outDir}\n`);

      if (options.mode === 'PBR' && result.normal && result.roughness) {
        const normalPath = join(outDir, `${safePrompt}_normal.png`);
        const roughnessPath = join(outDir, `${safePrompt}_roughness.png`);
        writeFileSync(normalPath, result.normal);
        writeFileSync(roughnessPath, result.roughness);
        message += chalk.gray(`  Files:  ${safePrompt}_{albedo,normal,roughness}.png`);
      } else {
        message += chalk.gray(`  File:   ${safePrompt}_albedo.png`);
      }

      spinner.succeed(message);
    } catch (error) {
      spinner.fail(chalk.red(`Generation failed: ${(error as Error).message}`));
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

// Handle default action (backward compatibility for converting just by providing a file)
if (process.argv.length > 2 && !['convert', 'texture', 'batch', '--help', '-h', '--version', '-V'].includes(process.argv[2])) {
  // If the first argument is a file, treat it as a convert command
  const args = [...process.argv];
  args.splice(2, 0, 'convert');
  program.parse(args);
} else {
  program.parse();
}
