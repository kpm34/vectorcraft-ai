# VectorCraft AI API

Production-ready REST API for Vector Studio and Texture Studio workflows.

## Quick Start

```bash
# Install dependencies
cd api
npm install

# Set environment variables
export GEMINI_API_KEY="your-api-key-here"
export PORT=3001  # Optional, defaults to 3001

# Start server
npm run dev
```

## Architecture

The API is organized into two main endpoint groups:

- **Vector Studio** (`/api/vector/*`) - Image to SVG conversion and web screenshot tools
- **Texture Studio** (`/api/texture/*`) - AI-powered MatCap and PBR texture generation

## Base URL

```
http://localhost:3001  # Development
https://api.vectorcraft.ai  # Production
```

## Authentication

All API requests require a Gemini API key passed in the `Authorization` header:

```
Authorization: Bearer YOUR_GEMINI_API_KEY
```

## Rate Limiting

- **Window**: 60 seconds
- **Max Requests**: 10 requests per IP
- **Response**: 429 Too Many Requests with `retryAfter` field

---

## Endpoints

### Health & Status

#### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "uptime": 12345.67
}
```

#### `GET /api/status`

API status and available endpoints.

**Response:**
```json
{
  "status": "operational",
  "version": "1.0.0",
  "endpoints": {
    "vector": {
      "convert": "/api/vector/convert",
      "screenshot": "/api/vector/screenshot"
    },
    "texture": {
      "generate": "/api/texture/generate"
    },
    "health": "/health"
  }
}
```

---

## Vector Studio Endpoints

### `POST /api/vector/convert`

Convert raster images (PNG, JPG, JPEG) to optimized SVG.

**Request Body:**
```json
{
  "image": "base64_encoded_image_data",
  "mimeType": "image/png",
  "mode": "logo-clean",
  "complexity": "low",
  "quality": "medium",
  "maxColors": 8
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | string | Yes | Base64-encoded image data |
| `mimeType` | string | Yes | MIME type (image/png, image/jpeg, image/webp) |
| `mode` | string | No | Conversion mode (see below) |
| `complexity` | string | No | `low`, `medium`, `high` |
| `quality` | string | No | `low`, `medium`, `high` |
| `maxColors` | number | No | Maximum colors (1-32, default: 8) |

**Modes:**

- `logo-clean` - Minimal colors, clean paths, small file size
- `icon` - Simple shapes, consistent stroke width, grid-aligned
- `illustration` - Detailed artwork, gradients, high fidelity
- `auto` - Automatically detect best mode

**Response:**
```json
{
  "svg": "<svg>...</svg>",
  "metadata": {
    "mode": "logo-clean",
    "colors": 8,
    "fileSize": 1234
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/vector/convert \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "image": "iVBORw0KGgoAAAA...",
    "mimeType": "image/png",
    "mode": "logo-clean",
    "maxColors": 4
  }'
```

---

### `POST /api/vector/screenshot`

Capture webpage screenshots for conversion to design layers.

**Request Body:**
```json
{
  "url": "https://example.com",
  "width": 1440,
  "height": 900,
  "fullPage": true,
  "waitUntil": "networkidle",
  "timeout": 30000,
  "selector": "#main-content"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | URL to capture |
| `width` | number | No | Viewport width (default: 1440) |
| `height` | number | No | Viewport height (default: 900) |
| `fullPage` | boolean | No | Capture full scrollable page (default: true) |
| `waitUntil` | string | No | `load`, `domcontentloaded`, `networkidle` |
| `timeout` | number | No | Max wait time in ms (default: 30000) |
| `selector` | string | No | CSS selector to capture specific element |

**Response:**
```json
{
  "image": "data:image/png;base64,...",
  "metadata": {
    "width": 1440,
    "height": 2400,
    "url": "https://example.com"
  }
}
```

---

## Texture Studio Endpoints

### `POST /api/texture/generate`

Generate AI-powered MatCap or PBR texture sets.

**Request Body:**
```json
{
  "prompt": "brushed steel with blue tint",
  "mode": "MATCAP",
  "quality": "FAST",
  "resolution": "1K"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Material description |
| `mode` | string | Yes | `MATCAP` or `PBR` |
| `quality` | string | No | `FAST` or `HIGH` (default: FAST) |
| `resolution` | string | No | `1K` or `2K` (default: 1K) |

**Modes:**

- **MATCAP** (Material Capture)
  - Single sphere on black background
  - Baked lighting and reflections
  - Fast rendering in 3D applications
  - Returns: albedo only

- **PBR** (Physically Based Rendering)
  - Seamless, tileable texture patterns
  - Separate material channels
  - Industry-standard workflow
  - Returns: albedo, normal, roughness

**Response (MATCAP):**
```json
{
  "albedo": "data:image/png;base64,...",
  "metadata": {
    "mode": "MATCAP",
    "resolution": "1K",
    "timestamp": 1234567890
  }
}
```

**Response (PBR):**
```json
{
  "albedo": "data:image/png;base64,...",
  "normal": "data:image/png;base64,...",
  "roughness": "data:image/png;base64,...",
  "metadata": {
    "mode": "PBR",
    "resolution": "1K",
    "timestamp": 1234567890
  }
}
```

**Example (MatCap):**
```bash
curl -X POST http://localhost:3001/api/texture/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "prompt": "polished chrome with rainbow reflections",
    "mode": "MATCAP",
    "quality": "HIGH",
    "resolution": "2K"
  }'
```

**Example (PBR):**
```bash
curl -X POST http://localhost:3001/api/texture/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "prompt": "weathered brick wall with moss",
    "mode": "PBR",
    "quality": "FAST",
    "resolution": "1K"
  }'
```

---

## Error Responses

All endpoints return standard error responses:

**400 Bad Request:**
```json
{
  "error": "Bad Request",
  "message": "Missing required field: prompt"
}
```

**429 Too Many Requests:**
```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Try again later.",
  "retryAfter": 45
}
```

**500 Internal Server Error:**
```json
{
  "error": "Conversion Failed",
  "message": "Failed to extract SVG from AI response"
}
```

---

## Testing

Run the comprehensive workflow test:

```bash
# From project root
./test-api-workflow.sh
```

This tests:
- ✅ Health & status checks
- ✅ Vector Studio SVG conversion (logo & icon modes)
- ✅ Texture Studio MatCap generation
- ✅ Texture Studio PBR generation (albedo, normal, roughness)

---

## Models Used

### Gemini 2.5 Flash Image (`gemini-2.5-flash-image`)
- **Use**: Fast quality mode, 1K resolution
- **Best for**: Rapid prototyping, batch generation
- **Speed**: ~3-5 seconds per texture

### Gemini 3 Pro Image Preview (`gemini-3-pro-image-preview`)
- **Use**: High quality mode, 2K resolution
- **Best for**: Production assets, high-detail work
- **Speed**: ~10-15 seconds per texture
- **Features**: Supports 2K image size parameter

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `PORT` | No | Server port (default: 3001) |
| `NODE_ENV` | No | `development` or `production` |

---

## Development

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

---

## Production Deployment

### Vercel

```bash
vercel --prod
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment

Ensure `GEMINI_API_KEY` is set in your deployment environment:
- Vercel: Project Settings → Environment Variables
- Docker: `-e GEMINI_API_KEY=xxx`
- Kubernetes: ConfigMap or Secret

---

## License

MIT
