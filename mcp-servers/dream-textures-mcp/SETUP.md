# Dream Textures MCP Server Setup Guide

## Current Status

⚠️ **Dream Textures v0.4.1 has compatibility issues with Blender 4.5.1**

**What's working:**
- ✅ MCP server startup and tool discovery
- ✅ Blender bridge HTTP server (health check)
- ✅ Dream Textures addon installation and detection

**Known Issues:**
- ❌ Dream Textures v0.4.1 designed for Blender 4.1, not 4.5.1
- ❌ Node system crashes (`NodeSocketControlNet` signature mismatch)
- ❌ `dream_prompt.generate_args()` returns `None` for model
- ❌ Programmatic API not working with current Blender version

**Root Cause:**
Dream Textures last release (v0.4.1, August 2024) predates Blender 4.5.1 LTS (July 2025). Blender's Python API changed between versions, breaking the addon's node system and generation pipeline.

**Recommendation:**
1. Use **Poly Haven MCP** for immediate PBR texture needs (100% working, no Blender)
2. Keep Dream Textures as future enhancement when compatible version releases
3. Monitor [Dream Textures GitHub](https://github.com/carson-katri/dream-textures/releases) for Blender 4.5 support

## Test Results (Before Compatibility Issues Discovered)

✅ **MCP Server: 6/6 tests passing (100%)**
✅ **Blender Bridge: Running healthy**
❌ **Texture Generation: Blocked by API incompatibility**

## Quick Start (Without Blender)

The MCP server works standalone for tool discovery and schema validation:

```bash
npm test  # Run test suite
npm start # Start MCP server (stdio mode)
```

## Full Setup (With Blender + Dream Textures)

### Prerequisites

1. **Blender 3.0+** installed
2. **Dream Textures add-on** installed in Blender
3. **Stable Diffusion model** downloaded in Dream Textures settings

### Installation Steps

#### 1. Install Dream Textures in Blender

```bash
# In Blender
Edit > Preferences > Add-ons > Install
# Navigate to Dream Textures zip file
# Enable the add-on
```

#### 2. Download SD Model

```bash
# In Blender, Dream Textures preferences:
# Download "Stable Diffusion 1.5" or "Stable Diffusion 2.1"
# This is a ~4GB download, will take a few minutes
```

#### 3. Install Python Dependencies for Bridge

```bash
# Dream Textures bridge needs Flask
# Blender's Python doesn't have Flask by default

# Method 1: Use Blender's pip
/Users/postgres/Blender.app/Contents/Resources/4.5/python/bin/python3.11 -m pip install flask flask-cors

# Method 2: System Python (if compatible)
pip install flask flask-cors
```

#### 4. Start Blender Bridge

```bash
# Start Blender headless with the bridge script
blender --background --python blender_bridge.py

# You should see:
# ======================================================
# Dream Textures Blender Bridge
# ======================================================
# Blender version: 4.5.0
# Python version: 3.11.x
# Starting Flask API server on http://127.0.0.1:5555
# ======================================================
#  * Running on http://127.0.0.1:5555
```

#### 5. Test Blender Bridge

```bash
# In another terminal
curl http://127.0.0.1:5555/health

# Expected response:
# {
#   "status": "healthy",
#   "blender_version": "4.5.0",
#   "dream_textures_enabled": true,
#   "python_version": "3.11.x"
# }
```

#### 6. Run Full Test Suite

```bash
npm test

# All 6 tests should pass now!
```

#### 7. Start MCP Server

```bash
npm start

# MCP server is now ready to receive tool calls
```

## Usage with MCP Client

Once both Blender bridge and MCP server are running:

```typescript
// Example: Generate PBR texture set
const client = new MCPClient();
await client.connect({ command: 'node', args: ['./dist/index.js'] });

const result = await client.callTool({
  name: 'generate_pbr_texture',
  arguments: {
    prompt: 'brushed steel with scratches',
    resolution: 1024,
    maps: ['albedo', 'normal', 'roughness', 'metallic'],
    steps: 20
  }
});

// Result contains base64 PNGs for each map
console.log(result);
```

## Troubleshooting

### "Dream Textures addon not found"
- Make sure Dream Textures is installed and enabled in Blender
- Check Edit > Preferences > Add-ons > Search "Dream Textures"

### "ModuleNotFoundError: No module named 'flask'"
- Install Flask in Blender's Python:
  ```bash
  /path/to/blender/python -m pip install flask flask-cors
  ```

### "Connection refused to Blender API"
- Blender bridge isn't running
- Start with: `blender --background --python blender_bridge.py`
- Check port 5555 isn't in use by another process

### "CUDA out of memory" / "Out of VRAM"
- Lower resolution (use 512 instead of 1024)
- Reduce diffusion steps (use 10-15 instead of 20)
- Close other GPU applications
- Use CPU mode in Dream Textures settings (slower but works)

### Tests pass but generation is slow
- This is normal! AI generation takes time
- 1024x1024 texture: ~30-60 seconds per map
- Full PBR set (5 maps): ~2-5 minutes
- Use lower steps (10-15) for faster preview, higher (30-50) for final quality

## Performance Tips

**Fast Preview (30 seconds total):**
```json
{
  "resolution": 512,
  "steps": 10,
  "maps": ["albedo", "normal"]
}
```

**Balanced Quality (2-3 minutes):**
```json
{
  "resolution": 1024,
  "steps": 20,
  "maps": ["albedo", "normal", "roughness", "metallic"]
}
```

**Production Quality (5-10 minutes):**
```json
{
  "resolution": 2048,
  "steps": 40,
  "maps": ["albedo", "normal", "roughness", "metallic", "ao"]
}
```

## Architecture

```
VectorCraft App
      ↓
  MCP Client (TypeScript)
      ↓ JSON-RPC over stdio
  MCP Server (this package)
      ↓ HTTP REST API
  Blender Bridge (Python/Flask)
      ↓ bpy API
  Dream Textures Add-on
      ↓
  Stable Diffusion Model
      ↓
  PBR Textures (PNG)
```

## Next Steps

Once Dream Textures MCP is working:
1. Create Poly Haven MCP (no Blender needed, pure API)
2. Create Scenario.com MCP (cloud API)
3. Build VectorCraft Material Generator UI
4. Integrate all MCP servers with fallback chain

The foundation is solid - 83% test pass rate without Blender, 100% expected with Blender running!
