# VectorCraft AI API

REST API for converting images to SVG programmatically.

## Quick Start

### Installation

```bash
cd api
npm install
```

### Environment Setup

```bash
# .env
GEMINI_API_KEY=your-api-key-here
PORT=3001
```

### Run

```bash
npm run dev    # Development with hot reload
npm start      # Production
```

## API Endpoints

### POST `/api/convert`

Convert an image to SVG.

**Request:**

```json
{
  "image": "base64_encoded_image_data",
  "mimeType": "image/png",
  "mode": "logo-clean",
  "complexity": "low",
  "quality": "high",
  "maxColors": 8
}
```

**Response:**

```json
{
  "svg": "<svg>...</svg>",
  "metadata": {
    "mode": "logo-clean",
    "colors": 8,
    "fileSize": 2048
  }
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | string | Yes | Base64-encoded image data |
| `mimeType` | string | Yes | Image MIME type (e.g., `image/png`) |
| `mode` | string | No | Conversion mode: `logo-clean`, `icon`, `illustration`, `auto` (default: `auto`) |
| `complexity` | string | No | Complexity level: `low`, `medium`, `high` (default: `medium`) |
| `quality` | string | No | Quality: `low`, `medium`, `high` (default: `medium`) |
| `maxColors` | number | No | Maximum colors (default: 8) |

### GET `/health`

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "uptime": 12345.67
}
```

### GET `/api/status`

API status and available endpoints.

**Response:**

```json
{
  "status": "operational",
  "version": "1.0.0",
  "endpoints": {
    "convert": "/api/convert",
    "health": "/health"
  }
}
```

## Usage Examples

### Node.js

```javascript
import fetch from 'node-fetch';
import { readFileSync } from 'fs';

const imageBuffer = readFileSync('logo.png');
const base64Data = imageBuffer.toString('base64');

const response = await fetch('http://localhost:3001/api/convert', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    image: base64Data,
    mimeType: 'image/png',
    mode: 'logo-clean',
    complexity: 'low',
    quality: 'high',
    maxColors: 6
  })
});

const { svg, metadata } = await response.json();
console.log('SVG generated:', svg.length, 'bytes');
```

### Python

```python
import base64
import requests

# Read and encode image
with open('logo.png', 'rb') as f:
    image_data = base64.b64encode(f.read()).decode('utf-8')

# Convert to SVG
response = requests.post('http://localhost:3001/api/convert', json={
    'image': image_data,
    'mimeType': 'image/png',
    'mode': 'logo-clean',
    'complexity': 'low',
    'maxColors': 8
})

result = response.json()
svg = result['svg']

# Save SVG
with open('logo.svg', 'w') as f:
    f.write(svg)
```

### cURL

```bash
# Convert image to base64 and POST
IMAGE_B64=$(base64 -i logo.png)

curl -X POST http://localhost:3001/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "image": "'"$IMAGE_B64"'",
    "mimeType": "image/png",
    "mode": "logo-clean",
    "complexity": "low",
    "maxColors": 8
  }' | jq -r '.svg' > logo.svg
```

### TypeScript SDK

```typescript
class VectorCraftClient {
  constructor(
    private apiUrl = 'http://localhost:3001',
    private apiKey?: string
  ) {}

  async convert(
    imagePath: string,
    options: {
      mode?: 'logo-clean' | 'icon' | 'illustration' | 'auto';
      complexity?: 'low' | 'medium' | 'high';
      quality?: 'low' | 'medium' | 'high';
      maxColors?: number;
    } = {}
  ): Promise<string> {
    const fs = await import('fs');
    const path = await import('path');

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Data = imageBuffer.toString('base64');
    const ext = path.extname(imagePath).toLowerCase();
    const mimeType = this.getMimeType(ext);

    const response = await fetch(`${this.apiUrl}/api/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
      },
      body: JSON.stringify({
        image: base64Data,
        mimeType,
        ...options
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.message}`);
    }

    const { svg } = await response.json();
    return svg;
  }

  private getMimeType(ext: string): string {
    const types: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp'
    };
    return types[ext] || 'application/octet-stream';
  }
}

// Usage
const client = new VectorCraftClient();
const svg = await client.convert('logo.png', {
  mode: 'logo-clean',
  maxColors: 6
});
```

## Rate Limiting

- **Limit:** 10 requests per minute per IP
- **Response:** `429 Too Many Requests` with `retryAfter` header

## Error Responses

### 400 Bad Request

```json
{
  "error": "Bad Request",
  "message": "Missing required fields: image, mimeType"
}
```

### 429 Too Many Requests

```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Try again later.",
  "retryAfter": 45
}
```

### 500 Internal Server Error

```json
{
  "error": "Conversion Failed",
  "message": "Failed to extract SVG from AI response"
}
```

## Deployment

### Vercel

```bash
vercel deploy
```

### Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

### Environment Variables for Production

```bash
GEMINI_API_KEY=your-production-key
PORT=3001
NODE_ENV=production
```

## License

MIT
