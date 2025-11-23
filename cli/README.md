# VectorCraft AI CLI

Convert images to SVG from the command line.

## Installation

```bash
npm install -g @vectorcraft/cli
```

## Usage

### Basic Conversion

```bash
svgify input.png
```

This will create `input.svg` in the same directory.

### Specify Output

```bash
svgify logo.png --out assets/logo.svg
```

### Logo Mode (Clean, Optimized)

```bash
svgify company-logo.png --mode logo-clean
```

### Icon Mode (Simple, Sharp)

```bash
svgify icon.png --mode icon --out dist/icon.svg
```

### Illustration Mode (Detailed, Complex)

```bash
svgify artwork.jpg --mode illustration --quality high --colors 16
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-o, --out <path>` | Output SVG file path | `{input}.svg` |
| `-m, --mode <mode>` | Conversion mode: `logo-clean`, `icon`, `illustration`, `auto` | `auto` |
| `-k, --api-key <key>` | API key (or set `GEMINI_API_KEY` env var) | - |
| `-u, --api-url <url>` | API URL | `https://api.vectorcraft.ai` |
| `-q, --quality <quality>` | Quality: `low`, `medium`, `high` | `medium` |
| `-c, --colors <number>` | Max colors to extract | `8` |

## Environment Variables

```bash
export GEMINI_API_KEY="your-api-key-here"
export VECTORCRAFT_API_URL="https://api.vectorcraft.ai"  # Optional
```

## Examples

### Logo Conversion

```bash
svgify brand-logo.png --mode logo-clean --out logo.svg
```

### Batch Icon Conversion

```bash
for file in icons/*.png; do
  svgify "$file" --mode icon --out "dist/$(basename "$file" .png).svg"
done
```

### Build Pipeline Integration

```bash
# package.json
{
  "scripts": {
    "build:icons": "svgify src/icon.png --out public/icon.svg --mode icon",
    "prebuild": "npm run build:icons"
  }
}
```

### CI/CD Usage

```yaml
# .github/workflows/build.yml
- name: Convert assets to SVG
  run: |
    npm install -g @vectorcraft/cli
    svgify assets/logo.png --mode logo-clean --out public/logo.svg
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

## Modes

### `logo-clean`
Optimized for logos and brand assets:
- Minimal colors
- Clean paths
- Small file size
- Sharp edges

### `icon`
Optimized for UI icons:
- Simple shapes
- Consistent stroke width
- Normalized viewBox
- Grid-aligned

### `illustration`
Optimized for detailed artwork:
- More colors
- Complex gradients
- High fidelity
- Larger file size

### `auto`
Automatically detects the best mode based on image characteristics.

## API Integration

For programmatic usage, use the API directly:

```typescript
import fetch from 'node-fetch';
import { readFileSync } from 'fs';

const imageBuffer = readFileSync('logo.png');
const base64Data = imageBuffer.toString('base64');

const response = await fetch('https://api.vectorcraft.ai/convert', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
  },
  body: JSON.stringify({
    image: base64Data,
    mimeType: 'image/png',
    mode: 'logo-clean',
    complexity: 'low',
    quality: 'high',
    maxColors: 8
  })
});

const { svg } = await response.json();
```

## License

MIT
