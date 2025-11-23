import React, { useState } from 'react';
import { Puzzle, Code, Box, Palette, Download, Terminal, Zap, Link as LinkIcon, Package, Settings } from 'lucide-react';

export const PluginsPage: React.FC = () => {
  const [activePlugin, setActivePlugin] = useState<'blender' | 'cli' | 'api' | 'npm'>('blender');

  const plugins = [
    { id: 'blender' as const, label: 'Blender Plugin', icon: Box, status: 'Available' },
    { id: 'cli' as const, label: 'CLI Tool', icon: Terminal, status: 'Available' },
    { id: 'api' as const, label: 'REST API', icon: Code, status: 'Available' },
    { id: 'npm' as const, label: 'NPM Package', icon: Package, status: 'Available' },
  ];

  return (
    <div className="flex h-full w-full bg-neutral-950 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-neutral-900 border-r border-neutral-800 p-6 overflow-y-auto">
        <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Integrations</h2>
        <div className="space-y-2">
          {plugins.map((plugin) => (
            <button
              key={plugin.id}
              onClick={() => setActivePlugin(plugin.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                activePlugin === plugin.id
                  ? 'bg-purple-600 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <plugin.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{plugin.label}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${
                activePlugin === plugin.id ? 'bg-purple-700' : 'bg-neutral-800'
              }`}>
                {plugin.status}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
          <h3 className="text-xs font-bold text-neutral-400 uppercase mb-2">Resources</h3>
          <div className="space-y-2 text-xs text-neutral-300">
            <a href="#" className="block hover:text-purple-400">Plugin Source Code</a>
            <a href="#" className="block hover:text-purple-400">API Documentation</a>
            <a href="#" className="block hover:text-purple-400">Integration Examples</a>
            <a href="#" className="block hover:text-purple-400">Support Forum</a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-12">
          {activePlugin === 'blender' && <BlenderPlugin />}
          {activePlugin === 'cli' && <CLITool />}
          {activePlugin === 'api' && <APISection />}
          {activePlugin === 'npm' && <NPMPackage />}
        </div>
      </div>
    </div>
  );
};

const BlenderPlugin = () => (
  <div className="space-y-8">
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
          <Box className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Blender Plugin</h1>
          <p className="text-neutral-400">MatCap import and PBR material assignment for Blender 3.0+</p>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
      <h3 className="font-bold text-lg mb-3">Overview</h3>
      <p className="text-sm text-neutral-400 leading-relaxed">
        The MatCap Studio Blender plugin enables one-click import of generated MatCaps and PBR textures directly into Blender's shader editor. Supports automatic node setup, material assignment, and batch import workflows.
      </p>
    </div>

    <div>
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
        <Download className="w-5 h-5 text-green-400" />
        Installation
      </h3>
      <div className="space-y-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Step 1: Download Plugin</h4>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 mb-3 overflow-x-auto">
{`# Clone repository
git clone https://github.com/matcap-studio/blender-plugin.git
cd blender-plugin

# Or download ZIP
wget https://github.com/matcap-studio/blender-plugin/archive/main.zip`}
          </pre>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Step 2: Install in Blender</h4>
          <ol className="space-y-2 text-sm text-neutral-400">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">1.</span>
              <span>Open Blender → Edit → Preferences → Add-ons</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">2.</span>
              <span>Click "Install" button → Navigate to <code className="text-purple-300 bg-neutral-800 px-1 rounded">matcap_studio.zip</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">3.</span>
              <span>Enable "MatCap Studio Import" checkbox</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">4.</span>
              <span>Configure API endpoint in addon preferences (optional)</span>
            </li>
          </ol>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Step 3: Verify Installation</h4>
          <p className="text-sm text-neutral-400 mb-2">Check that the plugin loaded successfully:</p>
          <div className="space-y-2 text-xs text-neutral-400">
            <div>• 3D Viewport sidebar (N) → MatCap Studio panel should appear</div>
            <div>• File → Import → MatCap Texture (.png) should be available</div>
            <div>• Shader Editor → Add → MatCap Studio nodes should be listed</div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
        <Palette className="w-5 h-5 text-pink-400" />
        Usage
      </h3>
      <div className="space-y-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Import MatCap</h4>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-neutral-300 mb-3 overflow-x-auto">
{`# Python API
import bpy
from matcap_studio import import_matcap

# Import matcap and assign to active object
import_matcap(
    filepath="/path/to/matcap.png",
    assign_to_active=True
)

# Batch import directory
import_matcap_directory(
    directory="/path/to/matcaps/",
    create_library=True  # Add to asset browser
)`}
          </pre>
          <p className="text-xs text-neutral-400">MatCaps are automatically converted to Shader Editor nodes with proper Normal mapping for view-dependent shading.</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Import PBR Texture Set</h4>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-neutral-300 mb-3 overflow-x-auto">
{`# Import full PBR set (albedo, normal, roughness)
from matcap_studio import import_pbr_set

import_pbr_set(
    albedo="/path/to/albedo.png",
    normal="/path/to/normal.png",
    roughness="/path/to/roughness.png",
    material_name="MyMaterial",
    assign_to_active=True
)

# Auto-detects maps from directory naming convention
import_pbr_auto(
    directory="/path/to/textures/",
    material_name="AutoPBR"
)`}
          </pre>
          <p className="text-xs text-neutral-400">Creates Principled BSDF node with all maps connected: Albedo → Base Color, Normal → Normal, Roughness → Roughness</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">UI Panel (3D Viewport Sidebar)</h4>
          <div className="space-y-2 text-sm text-neutral-400">
            <div className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span><strong className="text-white">Quick Import:</strong> Drag-and-drop MatCap/PBR files from file browser</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span><strong className="text-white">Library Browser:</strong> Browse imported materials, preview thumbnails</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span><strong className="text-white">Live Generation:</strong> Enter prompt, generate directly from Blender (requires API key)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span><strong className="text-white">Batch Operations:</strong> Apply material to multiple objects, export material library</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
      <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
        <Settings className="w-5 h-5" />
        Advanced Features
      </h4>
      <div className="grid grid-cols-2 gap-4 text-sm text-neutral-300">
        <div>
          <div className="font-semibold text-white mb-1">Material Presets</div>
          <div className="text-neutral-400 text-xs">Save shader node setups as reusable presets, share across projects</div>
        </div>
        <div>
          <div className="font-semibold text-white mb-1">UV Unwrap Integration</div>
          <div className="text-neutral-400 text-xs">Auto-unwrap objects when assigning PBR textures, smart seam detection</div>
        </div>
        <div>
          <div className="font-semibold text-white mb-1">Asset Browser Sync</div>
          <div className="text-neutral-400 text-xs">Imported materials appear in Blender 3.0+ Asset Browser with tags</div>
        </div>
        <div>
          <div className="font-semibold text-white mb-1">Batch Rendering</div>
          <div className="text-neutral-400 text-xs">Render material swatches for library preview, automated thumbnail generation</div>
        </div>
      </div>
    </div>
  </div>
);

const CLITool = () => (
  <div className="space-y-8">
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center border border-green-500/30">
          <Terminal className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">CLI Tool</h1>
          <p className="text-neutral-400">Command-line interface for batch generation and automation</p>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-6">
      <h3 className="font-bold text-lg mb-3">Overview</h3>
      <p className="text-sm text-neutral-400 leading-relaxed">
        The MatCap Studio CLI enables headless texture generation, batch processing, and CI/CD integration for automated asset pipelines.
      </p>
    </div>

    <div>
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
        <Download className="w-5 h-5 text-green-400" />
        Installation
      </h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 overflow-x-auto">
{`# Install globally via npm
npm install -g @matcap-studio/cli

# Or via pip
pip install matcap-studio-cli

# Verify installation
matcap-studio --version
# Output: matcap-studio v1.0.0`}
        </pre>
      </div>
    </div>

    <div>
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
        <Code className="w-5 h-5 text-blue-400" />
        Commands
      </h3>
      <div className="space-y-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Generate Single MatCap</h4>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 mb-3 overflow-x-auto">
{`matcap-studio generate \\
  --prompt "brushed copper with teal patina" \\
  --mode matcap \\
  --quality high \\
  --resolution 2K \\
  --output ./output/copper_matcap.png`}
          </pre>
          <div className="text-xs text-neutral-400 space-y-1">
            <div><code className="text-purple-300">--prompt</code> Description of material (required)</div>
            <div><code className="text-purple-300">--mode</code> matcap | pbr (default: matcap)</div>
            <div><code className="text-purple-300">--quality</code> fast | high (default: high)</div>
            <div><code className="text-purple-300">--resolution</code> 1K | 2K (default: 1K)</div>
            <div><code className="text-purple-300">--output</code> Output file path (default: ./matcap_{timestamp}.png)</div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Batch Generation from JSON</h4>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 mb-3 overflow-x-auto">
{`# materials.json
[
  { "prompt": "brushed aluminum", "mode": "matcap", "resolution": "2K" },
  { "prompt": "cracked desert mud", "mode": "pbr", "quality": "high" },
  { "prompt": "iridescent beetle shell", "mode": "matcap" }
]

# Execute batch
matcap-studio batch \\
  --config materials.json \\
  --output-dir ./batch_output/ \\
  --parallel 3`}
          </pre>
          <p className="text-xs text-neutral-400">Processes JSON array of generation configs. <code className="text-purple-300">--parallel</code> controls concurrent requests (default: 1).</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Upscale Existing Texture</h4>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 mb-3 overflow-x-auto">
{`matcap-studio upscale \\
  --input ./matcap_1K.png \\
  --prompt "brushed copper" \\
  --output ./matcap_2K.png`}
          </pre>
          <p className="text-xs text-neutral-400">Re-generates at 2K resolution using same prompt. Requires original prompt for consistency.</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Generate PBR Set</h4>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 mb-3 overflow-x-auto">
{`matcap-studio generate \\
  --prompt "sci-fi metal plating" \\
  --mode pbr \\
  --output-dir ./pbr_set/

# Creates:
# ./pbr_set/albedo.png
# ./pbr_set/normal.png
# ./pbr_set/roughness.png
# ./pbr_set/metadata.json`}
          </pre>
          <p className="text-xs text-neutral-400">PBR mode outputs directory with all maps. Normal and roughness auto-generated client-side.</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Configuration</h4>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 mb-3 overflow-x-auto">
{`# Set API key
matcap-studio config set GEMINI_API_KEY your_api_key_here

# View current config
matcap-studio config list

# Reset to defaults
matcap-studio config reset`}
          </pre>
          <p className="text-xs text-neutral-400">Config stored in <code className="text-purple-300">~/.matcap-studio/config.json</code></p>
        </div>
      </div>
    </div>

    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
      <h4 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
        <Zap className="w-5 h-5" />
        CI/CD Integration Example
      </h4>
      <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-neutral-300 overflow-x-auto">
{`# .github/workflows/generate-textures.yml
name: Generate Game Textures
on:
  workflow_dispatch:
    inputs:
      material_config:
        description: 'Path to materials.json'
        required: true

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install MatCap Studio CLI
        run: npm install -g @matcap-studio/cli
      - name: Generate Textures
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
        run: |
          matcap-studio batch \\
            --config \${{ github.event.inputs.material_config }} \\
            --output-dir ./assets/textures/ \\
            --parallel 5
      - name: Upload Artifacts
        uses: actions/upload-artifact@v2
        with:
          name: generated-textures
          path: ./assets/textures/`}
      </pre>
    </div>
  </div>
);

const APISection = () => (
  <div className="space-y-8">
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
          <Code className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">REST API</h1>
          <p className="text-neutral-400">HTTP API for programmatic texture generation</p>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6">
      <h3 className="font-bold text-lg mb-3">Base URL</h3>
      <code className="text-sm text-blue-300">https://api.matcap-studio.com/v1</code>
      <p className="text-xs text-neutral-400 mt-2">All requests require <code className="text-purple-300">Authorization: Bearer YOUR_API_KEY</code> header</p>
    </div>

    <div>
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
        <LinkIcon className="w-5 h-5 text-green-400" />
        Endpoints
      </h3>
      <div className="space-y-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2 py-1 bg-green-600/20 border border-green-500/30 rounded text-xs font-mono text-green-400">POST</span>
            <code className="text-sm text-purple-300">/generate</code>
          </div>
          <p className="text-sm text-neutral-400 mb-4">Generate MatCap or PBR texture set</p>

          <h5 className="text-xs font-bold text-neutral-400 uppercase mb-2">Request Body</h5>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 mb-4 overflow-x-auto">
{`{
  "prompt": "brushed copper with teal patina",
  "mode": "matcap",              // "matcap" | "pbr"
  "quality": "high",             // "fast" | "high"
  "resolution": "2K",            // "1K" | "2K"
  "return_format": "base64"     // "base64" | "url"
}`}
          </pre>

          <h5 className="text-xs font-bold text-neutral-400 uppercase mb-2">Response (MatCap Mode)</h5>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-blue-400 mb-4 overflow-x-auto">
{`{
  "id": "gen_abc123",
  "mode": "matcap",
  "resolution": "2K",
  "albedo": "data:image/png;base64,iVBORw0KG...",
  "timestamp": 1699564800,
  "model_used": "gemini-3-pro-image-preview"
}`}
          </pre>

          <h5 className="text-xs font-bold text-neutral-400 uppercase mb-2">Response (PBR Mode)</h5>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-blue-400 overflow-x-auto">
{`{
  "id": "gen_xyz789",
  "mode": "pbr",
  "resolution": "1K",
  "albedo": "data:image/png;base64,iVBORw0KG...",
  "normal": "data:image/png;base64,iVBORw0KG...",
  "roughness": "data:image/png;base64,iVBORw0KG...",
  "timestamp": 1699564800,
  "model_used": "gemini-2.5-flash-image"
}`}
          </pre>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-xs font-mono text-blue-400">POST</span>
            <code className="text-sm text-purple-300">/upscale</code>
          </div>
          <p className="text-sm text-neutral-400 mb-4">Upscale existing texture to 2K</p>

          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 mb-4 overflow-x-auto">
{`{
  "generation_id": "gen_abc123",    // Original generation ID
  "prompt": "brushed copper",       // Must match original
  "target_resolution": "2K"
}`}
          </pre>

          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-blue-400 overflow-x-auto">
{`{
  "id": "gen_abc123_upscaled",
  "original_id": "gen_abc123",
  "resolution": "2K",
  "albedo": "data:image/png;base64,iVBORw0KG...",
  "normal": "data:image/png;base64,iVBORw0KG...",
  "roughness": "data:image/png;base64,iVBORw0KG..."
}`}
          </pre>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2 py-1 bg-yellow-600/20 border border-yellow-500/30 rounded text-xs font-mono text-yellow-400">GET</span>
            <code className="text-sm text-purple-300">/history</code>
          </div>
          <p className="text-sm text-neutral-400 mb-4">Retrieve generation history</p>

          <h5 className="text-xs font-bold text-neutral-400 uppercase mb-2">Query Parameters</h5>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 mb-4 overflow-x-auto">
{`GET /history?limit=10&offset=0&mode=matcap`}
          </pre>

          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-blue-400 overflow-x-auto">
{`{
  "total": 156,
  "limit": 10,
  "offset": 0,
  "results": [
    {
      "id": "gen_abc123",
      "prompt": "brushed copper",
      "mode": "matcap",
      "resolution": "2K",
      "timestamp": 1699564800,
      "thumbnail_url": "https://cdn.matcap-studio.com/thumb/abc123.jpg"
    },
    // ... more results
  ]
}`}
          </pre>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2 py-1 bg-yellow-600/20 border border-yellow-500/30 rounded text-xs font-mono text-yellow-400">GET</span>
            <code className="text-sm text-purple-300">/download/:id</code>
          </div>
          <p className="text-sm text-neutral-400 mb-4">Download specific texture by generation ID</p>

          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 mb-2 overflow-x-auto">
{`GET /download/gen_abc123?type=albedo&format=png`}
          </pre>
          <p className="text-xs text-neutral-400">Returns binary PNG data with appropriate content-type header</p>
        </div>
      </div>
    </div>

    <div>
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
        <Code className="w-5 h-5 text-pink-400" />
        Code Examples
      </h3>
      <div className="space-y-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">JavaScript / TypeScript</h4>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 overflow-x-auto">
{`const response = await fetch('https://api.matcap-studio.com/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'iridescent beetle shell',
    mode: 'matcap',
    quality: 'high',
    resolution: '2K'
  })
});

const data = await response.json();
console.log('Generated:', data.albedo.substring(0, 50) + '...');`}
          </pre>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Python</h4>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 overflow-x-auto">
{`import requests
import base64

response = requests.post(
    'https://api.matcap-studio.com/v1/generate',
    headers={'Authorization': 'Bearer YOUR_API_KEY'},
    json={
        'prompt': 'cracked desert mud',
        'mode': 'pbr',
        'quality': 'fast',
        'resolution': '1K'
    }
)

data = response.json()

# Decode and save albedo
with open('albedo.png', 'wb') as f:
    f.write(base64.b64decode(data['albedo'].split(',')[1]))`}
          </pre>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">cURL</h4>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 overflow-x-auto">
{`curl -X POST https://api.matcap-studio.com/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "brushed aluminum",
    "mode": "matcap",
    "quality": "high",
    "resolution": "1K"
  }'`}
          </pre>
        </div>
      </div>
    </div>

    <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
      <h4 className="font-bold text-red-400 mb-3">Error Codes</h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-3">
          <code className="text-red-300 font-mono text-xs">400</code>
          <div className="flex-1 text-neutral-400">Invalid request parameters (missing prompt, invalid mode, etc.)</div>
        </div>
        <div className="flex items-start gap-3">
          <code className="text-red-300 font-mono text-xs">401</code>
          <div className="flex-1 text-neutral-400">Unauthorized - invalid or missing API key</div>
        </div>
        <div className="flex items-start gap-3">
          <code className="text-red-300 font-mono text-xs">429</code>
          <div className="flex-1 text-neutral-400">Rate limit exceeded (100 requests/hour on free tier)</div>
        </div>
        <div className="flex items-start gap-3">
          <code className="text-red-300 font-mono text-xs">500</code>
          <div className="flex-1 text-neutral-400">Internal server error - AI generation failed</div>
        </div>
      </div>
    </div>
  </div>
);

const NPMPackage = () => (
  <div className="space-y-8">
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-red-600/20 flex items-center justify-center border border-red-500/30">
          <Package className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">NPM Package</h1>
          <p className="text-neutral-400">JavaScript/TypeScript SDK for Node.js and browser</p>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl p-6">
      <h3 className="font-bold text-lg mb-3">Installation</h3>
      <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 overflow-x-auto">
{`npm install @matcap-studio/sdk
# or
yarn add @matcap-studio/sdk
# or
pnpm add @matcap-studio/sdk`}
      </pre>
    </div>

    <div>
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
        <Code className="w-5 h-5 text-blue-400" />
        Usage
      </h3>
      <div className="space-y-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Basic Setup</h4>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 overflow-x-auto">
{`import { MatCapStudio } from '@matcap-studio/sdk';

const studio = new MatCapStudio({
  apiKey: process.env.MATCAP_API_KEY,
  // Optional configuration
  baseURL: 'https://api.matcap-studio.com/v1',
  timeout: 60000,  // 60 seconds
  retryAttempts: 3
});`}
          </pre>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Generate MatCap</h4>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 overflow-x-auto">
{`const matcap = await studio.generate({
  prompt: 'brushed copper with teal patina',
  mode: 'matcap',
  quality: 'high',
  resolution: '2K'
});

console.log('Generation ID:', matcap.id);
console.log('Albedo data:', matcap.albedo);

// Save to file (Node.js)
await matcap.saveAlbedo('./copper.png');`}
          </pre>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Generate PBR Texture Set</h4>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 overflow-x-auto">
{`const pbr = await studio.generate({
  prompt: 'cracked desert mud',
  mode: 'pbr',
  quality: 'fast',
  resolution: '1K'
});

// Access individual maps
console.log('Albedo:', pbr.albedo);
console.log('Normal:', pbr.normal);
console.log('Roughness:', pbr.roughness);

// Save all maps (Node.js)
await pbr.saveAll('./output/', {
  prefix: 'desert_mud',
  format: 'png'
});
// Creates: desert_mud_albedo.png, desert_mud_normal.png, desert_mud_roughness.png`}
          </pre>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Upscale Texture</h4>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 overflow-x-auto">
{`const original = await studio.generate({
  prompt: 'iridescent beetle shell',
  mode: 'matcap',
  resolution: '1K'
});

const upscaled = await studio.upscale({
  generationId: original.id,
  prompt: original.prompt,
  targetResolution: '2K'
});

console.log('Upscaled from', original.resolution, 'to', upscaled.resolution);`}
          </pre>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Batch Generation</h4>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 overflow-x-auto">
{`const materials = [
  { prompt: 'brushed aluminum', mode: 'matcap' },
  { prompt: 'cracked leather', mode: 'pbr' },
  { prompt: 'polished marble', mode: 'matcap' }
];

const results = await studio.batchGenerate(materials, {
  parallel: 3,  // Generate 3 at a time
  onProgress: (completed, total) => {
    console.log(\`Progress: \${completed}/\${total}\`);
  },
  onError: (index, error) => {
    console.error(\`Failed to generate material \${index}:\`, error);
  }
});

console.log(\`Generated \${results.length} materials\`);`}
          </pre>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">History & Downloads</h4>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 overflow-x-auto">
{`// Get generation history
const history = await studio.getHistory({
  limit: 20,
  offset: 0,
  mode: 'matcap'
});

console.log(\`Found \${history.total} generations\`);

// Download specific generation
const texture = await studio.download('gen_abc123', 'albedo');
await texture.save('./downloaded.png');`}
          </pre>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">TypeScript Types</h4>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-blue-400 overflow-x-auto">
{`import type {
  GenerateOptions,
  MatCapResult,
  PBRResult,
  TextureMode,
  QualityLevel,
  Resolution
} from '@matcap-studio/sdk';

const options: GenerateOptions = {
  prompt: 'sci-fi metal plating',
  mode: 'pbr' as TextureMode,
  quality: 'high' as QualityLevel,
  resolution: '2K' as Resolution
};

const result: PBRResult = await studio.generate(options);`}
          </pre>
        </div>
      </div>
    </div>

    <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
      <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
        <Zap className="w-5 h-5" />
        React Integration Example
      </h4>
      <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-neutral-300 overflow-x-auto">
{`import { MatCapStudio } from '@matcap-studio/sdk';
import { useState } from 'react';

function MaterialGenerator() {
  const [studio] = useState(() => new MatCapStudio({
    apiKey: import.meta.env.VITE_MATCAP_API_KEY
  }));
  const [texture, setTexture] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async (prompt) => {
    setLoading(true);
    try {
      const result = await studio.generate({
        prompt,
        mode: 'matcap',
        quality: 'high'
      });
      setTexture(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => generate('brushed copper')}>
        Generate
      </button>
      {texture && <img src={texture.albedo} alt="MatCap" />}
    </div>
  );
}`}
      </pre>
    </div>
  </div>
);
