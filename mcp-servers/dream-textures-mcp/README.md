# Dream Textures MCP Server

MCP server that exposes Blender's Dream Textures plugin for AI-powered PBR texture generation.

## Features

- **Generate complete PBR texture sets** (Albedo, Normal, Roughness, Metallic, AO) from text prompts
- **Generate individual maps** for fine-grained control
- **Refine existing textures** using img2img
- **Local AI generation** - No API costs, works offline (requires Dream Textures model)

## Prerequisites

1. **Blender 3.0+** with Dream Textures add-on installed
2. **Dream Textures** with Stable Diffusion model downloaded
3. **Python** 3.10+ (comes with Blender)

## Installation

```bash
cd mcp-servers/dream-textures-mcp
npm install
npm run build
```

## Usage

### Start Blender Bridge

```bash
# Start Blender headless with the bridge script
blender --background --python blender_bridge.py
```

This starts an HTTP API on `http://127.0.0.1:5555`

### Start MCP Server

```bash
# In another terminal
npm start
```

### Test via MCP Client

```typescript
import { MCPClient } from '@modelcontextprotocol/sdk/client/index.js';

const client = new MCPClient();
await client.connect({
  command: 'node',
  args: ['./dist/index.js']
});

// Generate PBR texture set
const result = await client.callTool({
  name: 'generate_pbr_texture',
  arguments: {
    prompt: 'brushed steel with scratches',
    resolution: 1024,
    maps: ['albedo', 'normal', 'roughness', 'metallic']
  }
});

console.log(result); // Base64 encoded PNGs
```

## Available Tools

### `generate_pbr_texture`
Generate complete PBR texture set from text prompt

**Arguments:**
- `prompt` (string): Material description
- `resolution` (number): 512 | 1024 | 2048 | 4096
- `maps` (array): Which maps to generate (default: albedo, normal, roughness, metallic)
- `seed` (number): Random seed (-1 for random)
- `steps` (number): Diffusion steps (default: 20)

**Returns:** JSON with base64 encoded PNGs for each map

### `generate_single_map`
Generate a single PBR texture map

**Arguments:**
- `prompt` (string): Material description
- `map_type` (string): albedo | normal | roughness | metallic | ao
- `resolution` (number): Texture size
- `seed` (number): Random seed
- `steps` (number): Diffusion steps

### `refine_texture`
Refine existing texture using img2img

**Arguments:**
- `base_texture` (string): Base64 PNG of texture to refine
- `prompt` (string): Modification description (e.g., "add scratches")
- `strength` (number): How much to change (0-1, default: 0.5)
- `resolution` (number): Output size
- `steps` (number): Diffusion steps

### `check_blender_status`
Check if Blender and Dream Textures are ready

**Returns:** Blender version, Dream Textures status, Python version

## Configuration

Set `BLENDER_API_URL` environment variable to change the Blender bridge URL (default: http://127.0.0.1:5555)

## Troubleshooting

### "Dream Textures addon not found"
- Install Dream Textures in Blender: Edit > Preferences > Add-ons > Install
- Download Stable Diffusion model in Dream Textures settings

### "Connection refused to Blender API"
- Make sure Blender is running with `blender --background --python blender_bridge.py`
- Check that port 5555 is not in use

### "Out of VRAM"
- Lower resolution (use 512 or 1024 instead of 2048)
- Reduce diffusion steps
- Close other GPU-heavy applications

## License

MIT
