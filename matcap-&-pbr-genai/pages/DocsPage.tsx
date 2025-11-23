import React, { useState } from 'react';
import { Book, Zap, Layers, Terminal, Code, Cpu, Palette, Box, Download, Keyboard } from 'lucide-react';

export const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'intro' | 'matcap' | 'canvas'>('intro');

  const sections = [
    { id: 'intro' as const, label: 'Introduction', icon: Book },
    { id: 'matcap' as const, label: 'MatCap Studio', icon: Palette },
    { id: 'canvas' as const, label: 'VectorCraft Canvas', icon: Layers },
  ];

  return (
    <div className="flex h-full w-full bg-neutral-950 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-neutral-900 border-r border-neutral-800 p-6 overflow-y-auto">
        <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Documentation</h2>
        <div className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeSection === section.id
                  ? 'bg-purple-600 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <section.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{section.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
          <h3 className="text-xs font-bold text-neutral-400 uppercase mb-2">Quick Links</h3>
          <div className="space-y-2 text-xs text-neutral-300">
            <a href="#" className="block hover:text-purple-400">API Reference</a>
            <a href="#" className="block hover:text-purple-400">GitHub Repository</a>
            <a href="#" className="block hover:text-purple-400">Video Tutorials</a>
            <a href="#" className="block hover:text-purple-400">Community Discord</a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-12">
          {activeSection === 'intro' && <IntroSection />}
          {activeSection === 'matcap' && <MatCapSection />}
          {activeSection === 'canvas' && <CanvasSection />}
        </div>
      </div>
    </div>
  );
};

const IntroSection = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        Introduction
      </h1>
      <p className="text-neutral-400 text-lg leading-relaxed">
        MatCap Studio is a professional AI-powered texture generation platform combining advanced material capture techniques with procedural rendering workflows.
      </p>
    </div>

    <div className="grid grid-cols-2 gap-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
            <Palette className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="font-bold text-lg">MatCap Generation</h3>
        </div>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Generate material capture spheres with baked lighting, reflections, and surface properties using Gemini AI models.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-pink-600/20 flex items-center justify-center border border-pink-500/30">
            <Box className="w-5 h-5 text-pink-400" />
          </div>
          <h3 className="font-bold text-lg">PBR Textures</h3>
        </div>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Generate complete PBR texture sets with auto-generated normal and roughness maps from albedo inputs.
        </p>
      </div>
    </div>

    <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        Core Features
      </h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-neutral-300">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>Gemini 3 Pro & 2.5 Flash models</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>1K/2K resolution with upscaling</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>Real-time 3D preview (Three.js)</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-neutral-300">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
            <span>Auto-generated normal maps</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
            <span>Procedural roughness synthesis</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
            <span>Multi-geometry preview modes</span>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
        <Terminal className="w-5 h-5 text-green-400" />
        Getting Started
      </h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
        <div>
          <h4 className="font-semibold text-purple-400 mb-2">1. Configure API Key</h4>
          <p className="text-sm text-neutral-400 mb-2">Set your Gemini API key in environment variables:</p>
          <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 overflow-x-auto">
            GEMINI_API_KEY=your_api_key_here
          </pre>
        </div>

        <div>
          <h4 className="font-semibold text-purple-400 mb-2">2. Select Generation Mode</h4>
          <p className="text-sm text-neutral-400">
            Choose between <span className="text-purple-300 font-mono">MatCap</span> (baked lighting spheres) or <span className="text-purple-300 font-mono">PBR</span> (full texture sets)
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-purple-400 mb-2">3. Generate Materials</h4>
          <p className="text-sm text-neutral-400">
            Enter descriptive prompts like "brushed copper", "iridescent beetle shell", or "cracked desert mud"
          </p>
        </div>
      </div>
    </div>

    <div>
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
        <Cpu className="w-5 h-5 text-blue-400" />
        Technical Architecture
      </h3>
      <div className="space-y-3 text-sm text-neutral-400">
        <div className="flex items-start gap-3 bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <Code className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-white mb-1">Frontend</h4>
            <p>React 19 + TypeScript + Vite, Three.js WebGL rendering, React Three Fiber + Drei</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <Code className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-white mb-1">AI Models</h4>
            <p>Gemini 3 Pro (high quality, 2K support), Gemini 2.5 Flash (fast generation)</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <Code className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-white mb-1">Image Processing</h4>
            <p>Client-side canvas-based normal map generation, edge detection algorithms, procedural roughness synthesis</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MatCapSection = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        MatCap Studio
      </h1>
      <p className="text-neutral-400 text-lg leading-relaxed">
        Material Capture (MatCap) technology for real-time 3D rendering with baked lighting and reflections.
      </p>
    </div>

    <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
      <h3 className="font-bold text-lg mb-4">What is MatCap?</h3>
      <p className="text-sm text-neutral-400 leading-relaxed mb-4">
        MatCap (Material Capture) is a shading technique that uses a single texture image of a sphere with pre-baked lighting to simulate complex materials in real-time. The texture encodes how light interacts with a material from all viewing angles, making it extremely efficient for real-time rendering.
      </p>
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
          <div className="font-semibold text-purple-300 mb-1">Performance</div>
          <div className="text-neutral-400">Single texture lookup, no lighting calculations</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
          <div className="font-semibold text-purple-300 mb-1">Quality</div>
          <div className="text-neutral-400">Baked reflections, subsurface scattering, complex lighting</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
          <div className="font-semibold text-purple-300 mb-1">Use Cases</div>
          <div className="text-neutral-400">Game assets, AR/VR, mobile 3D, web applications</div>
        </div>
      </div>
    </div>

    <div>
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
        <Keyboard className="w-5 h-5 text-yellow-400" />
        Keyboard Shortcuts
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Generate Texture</span>
            <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs font-mono text-purple-300">Ctrl + Enter</kbd>
          </div>
          <p className="text-xs text-neutral-500">Trigger generation with current prompt</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Upscale to 2K</span>
            <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs font-mono text-purple-300">Ctrl + U</kbd>
          </div>
          <p className="text-xs text-neutral-500">Enhance current texture to 2K resolution</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Toggle Mode</span>
            <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs font-mono text-purple-300">Ctrl + M</kbd>
          </div>
          <p className="text-xs text-neutral-500">Switch between MatCap and PBR modes</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Cycle Geometry</span>
            <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs font-mono text-purple-300">G</kbd>
          </div>
          <p className="text-xs text-neutral-500">Rotate through preview geometries</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Download All</span>
            <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs font-mono text-purple-300">Ctrl + D</kbd>
          </div>
          <p className="text-xs text-neutral-500">Export all texture maps as PNG</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Focus Prompt</span>
            <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs font-mono text-purple-300">/</kbd>
          </div>
          <p className="text-xs text-neutral-500">Jump to prompt input field</p>
        </div>
      </div>
    </div>

    <div>
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
        <Box className="w-5 h-5 text-pink-400" />
        Generation Features
      </h3>
      <div className="space-y-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Quality Models</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-20 font-mono text-xs text-purple-300 mt-0.5">HIGH</div>
              <div className="flex-1 text-neutral-400">
                <div className="font-medium text-white mb-1">Gemini 3 Pro Image Preview</div>
                <div>Best quality, supports 2K resolution, complex material understanding, longer generation time (~8-15s)</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-20 font-mono text-xs text-pink-300 mt-0.5">FAST</div>
              <div className="flex-1 text-neutral-400">
                <div className="font-medium text-white mb-1">Gemini 2.5 Flash Image</div>
                <div>Rapid generation, 1K resolution, good material fidelity, quick iteration (~2-5s)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Resolution Options</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-mono text-xs text-purple-300 mb-2">1K (1024×1024)</div>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Default generation resolution. Fast, efficient for web/mobile, supports both quality models.
              </p>
            </div>
            <div>
              <div className="font-mono text-xs text-pink-300 mb-2">2K (2048×2048)</div>
              <p className="text-neutral-400 text-xs leading-relaxed">
                High-resolution output. Requires Gemini 3 Pro, ideal for print/high-DPI displays, upscale from 1K available.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Preview Geometries</h4>
          <div className="grid grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-neutral-800 rounded-lg p-3">
              <div className="w-12 h-12 mx-auto mb-2 bg-purple-600/20 rounded-full border border-purple-500/30" />
              <div className="font-medium text-white">Sphere</div>
              <div className="text-neutral-500 mt-1">Default MatCap</div>
            </div>
            <div className="bg-neutral-800 rounded-lg p-3">
              <div className="w-12 h-12 mx-auto mb-2 bg-pink-600/20 rounded border border-pink-500/30" />
              <div className="font-medium text-white">Box</div>
              <div className="text-neutral-500 mt-1">Planar surfaces</div>
            </div>
            <div className="bg-neutral-800 rounded-lg p-3">
              <div className="w-12 h-12 mx-auto mb-2 bg-blue-600/20 rounded-full border-4 border-transparent" style={{borderColor: 'rgba(59, 130, 246, 0.3)'}} />
              <div className="font-medium text-white">Torus</div>
              <div className="text-neutral-500 mt-1">Curved edges</div>
            </div>
            <div className="bg-neutral-800 rounded-lg p-3">
              <div className="w-12 h-12 mx-auto mb-2 bg-green-600/20 rounded border border-green-500/30" />
              <div className="font-medium text-white">Plane</div>
              <div className="text-neutral-500 mt-1">Flat texture</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
        <Download className="w-5 h-5 text-green-400" />
        Technical Use Cases
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <h4 className="font-semibold text-purple-400 mb-2">Game Development</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
              <span>Mobile/web games requiring low draw calls</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
              <span>Stylized materials for NPCs and props</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
              <span>Rapid prototyping of material concepts</span>
            </li>
          </ul>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <h4 className="font-semibold text-pink-400 mb-2">3D Art & Rendering</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
              <span>Concept art material studies</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
              <span>Blender/Maya shader references</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
              <span>Non-photoreal rendering (NPR) workflows</span>
            </li>
          </ul>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <h4 className="font-semibold text-blue-400 mb-2">Web & Interactive</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
              <span>WebGL product configurators</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
              <span>AR material preview (8th Wall, AR.js)</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
              <span>Three.js/Babylon.js scene optimization</span>
            </li>
          </ul>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <h4 className="font-semibold text-green-400 mb-2">Design & Prototyping</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
              <span>UI/UX material mockups</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
              <span>Industrial design material exploration</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
              <span>Texture library creation for teams</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
      <h4 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
        <Zap className="w-5 h-5" />
        Pro Tips
      </h4>
      <div className="space-y-2 text-sm text-neutral-300">
        <div className="flex items-start gap-2">
          <span className="text-yellow-400 font-bold">1.</span>
          <span>Use descriptive material names: "brushed aluminum" > "metal", "iridescent beetle shell" > "shiny"</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-yellow-400 font-bold">2.</span>
          <span>Generate at 1K first, then upscale to 2K only when satisfied with the result (saves API costs)</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-yellow-400 font-bold">3.</span>
          <span>Test on sphere geometry first to see full material properties before switching to other shapes</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-yellow-400 font-bold">4.</span>
          <span>For PBR mode, normal/roughness maps are auto-generated client-side (no extra API cost)</span>
        </div>
      </div>
    </div>
  </div>
);

const CanvasSection = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        VectorCraft Canvas
      </h1>
      <p className="text-neutral-400 text-lg leading-relaxed">
        SVG-based vector editing with parametric design workflows and programmatic control.
      </p>
    </div>

    <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
      <h3 className="font-bold text-lg mb-4">What is VectorCraft Canvas?</h3>
      <p className="text-sm text-neutral-400 leading-relaxed mb-4">
        VectorCraft Canvas is a parametric vector design environment that combines traditional SVG editing with code-driven workflows. It allows designers and developers to create resolution-independent graphics with mathematical precision and programmatic control.
      </p>
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
          <div className="font-semibold text-purple-300 mb-1">SVG Native</div>
          <div className="text-neutral-400">True vector output, infinite scalability, web-ready exports</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
          <div className="font-semibold text-purple-300 mb-1">Parametric</div>
          <div className="text-neutral-400">Math-based shapes, constraint systems, live parameter editing</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
          <div className="font-semibold text-purple-300 mb-1">Code-Driven</div>
          <div className="text-neutral-400">TypeScript API, scripting workflows, batch operations</div>
        </div>
      </div>
    </div>

    <div>
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
        <Keyboard className="w-5 h-5 text-yellow-400" />
        Canvas Shortcuts
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Pan Canvas</span>
            <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs font-mono text-purple-300">Space + Drag</kbd>
          </div>
          <p className="text-xs text-neutral-500">Navigate around workspace</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Zoom</span>
            <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs font-mono text-purple-300">Ctrl + Scroll</kbd>
          </div>
          <p className="text-xs text-neutral-500">Zoom in/out at cursor position</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Rectangle Tool</span>
            <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs font-mono text-purple-300">R</kbd>
          </div>
          <p className="text-xs text-neutral-500">Activate rectangle creation</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Circle Tool</span>
            <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs font-mono text-purple-300">C</kbd>
          </div>
          <p className="text-xs text-neutral-500">Activate circle creation</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Pen Tool</span>
            <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs font-mono text-purple-300">P</kbd>
          </div>
          <p className="text-xs text-neutral-500">Draw custom paths with Bézier curves</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Selection Tool</span>
            <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs font-mono text-purple-300">V</kbd>
          </div>
          <p className="text-xs text-neutral-500">Select and transform objects</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Duplicate</span>
            <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs font-mono text-purple-300">Ctrl + D</kbd>
          </div>
          <p className="text-xs text-neutral-500">Duplicate selected objects</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Group</span>
            <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs font-mono text-purple-300">Ctrl + G</kbd>
          </div>
          <p className="text-xs text-neutral-500">Group selected objects</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Boolean Union</span>
            <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs font-mono text-purple-300">Ctrl + Shift + U</kbd>
          </div>
          <p className="text-xs text-neutral-500">Combine selected shapes</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-300">Export SVG</span>
            <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs font-mono text-purple-300">Ctrl + E</kbd>
          </div>
          <p className="text-xs text-neutral-500">Export canvas as optimized SVG</p>
        </div>
      </div>
    </div>

    <div>
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
        <Layers className="w-5 h-5 text-pink-400" />
        Core Features
      </h3>
      <div className="space-y-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Parametric Shapes</h4>
          <div className="space-y-3 text-sm text-neutral-400">
            <div className="flex items-start gap-3">
              <div className="w-24 font-mono text-xs text-purple-300 mt-0.5">Rectangle</div>
              <div className="flex-1">Width, height, corner radius (individual or uniform), rotation, skew transforms</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-24 font-mono text-xs text-purple-300 mt-0.5">Circle/Ellipse</div>
              <div className="flex-1">Radius (uniform), radiusX/radiusY (ellipse), start/end angles for arcs</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-24 font-mono text-xs text-purple-300 mt-0.5">Polygon</div>
              <div className="flex-1">Side count (3-100), inner radius for star shapes, rotation offset</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-24 font-mono text-xs text-purple-300 mt-0.5">Path</div>
              <div className="flex-1">Bézier curves with control points, smooth/sharp nodes, path operations (union, subtract)</div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Boolean Operations</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-mono text-xs text-purple-300 mb-2">Union</div>
              <p className="text-neutral-400 text-xs">Combine multiple shapes into single path, removes overlapping areas</p>
            </div>
            <div>
              <div className="font-mono text-xs text-pink-300 mb-2">Subtract</div>
              <p className="text-neutral-400 text-xs">Remove top shape from bottom shape, creates cutouts and holes</p>
            </div>
            <div>
              <div className="font-mono text-xs text-blue-300 mb-2">Intersect</div>
              <p className="text-neutral-400 text-xs">Keep only overlapping areas, useful for clipping masks</p>
            </div>
            <div>
              <div className="font-mono text-xs text-green-300 mb-2">Exclude</div>
              <p className="text-neutral-400 text-xs">Inverse of intersect, removes overlapping regions</p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Fill & Stroke System</h4>
          <div className="space-y-3 text-sm text-neutral-400">
            <div className="flex items-start gap-3">
              <div className="w-28 font-mono text-xs text-purple-300 mt-0.5">Solid Colors</div>
              <div className="flex-1">RGB, HSL, hex input with alpha channel, color picker with presets</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-28 font-mono text-xs text-purple-300 mt-0.5">Gradients</div>
              <div className="flex-1">Linear/radial gradients, multiple color stops, angle/position control, gradient editor</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-28 font-mono text-xs text-purple-300 mt-0.5">Stroke</div>
              <div className="flex-1">Width, cap style (butt/round/square), join style (miter/round/bevel), dash patterns</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-28 font-mono text-xs text-purple-300 mt-0.5">Patterns</div>
              <div className="flex-1">Repeating patterns, texture fills, custom pattern definitions</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
        <Code className="w-5 h-5 text-green-400" />
        Technical Use Cases
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <h4 className="font-semibold text-purple-400 mb-2">Logo & Icon Design</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
              <span>Resolution-independent brand assets</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
              <span>Parametric icon families with consistent proportions</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
              <span>Export to multiple sizes without quality loss</span>
            </li>
          </ul>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <h4 className="font-semibold text-pink-400 mb-2">UI/UX Prototyping</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
              <span>Component libraries with live parameters</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
              <span>Design system tokens → SVG automation</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
              <span>Interactive wireframes and mockups</span>
            </li>
          </ul>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <h4 className="font-semibold text-blue-400 mb-2">Data Visualization</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
              <span>Programmatic chart/graph generation</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
              <span>Real-time data binding to shapes</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
              <span>Infographic templates with variable data</span>
            </li>
          </ul>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <h4 className="font-semibold text-green-400 mb-2">Print & Web Export</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
              <span>CMYK-safe vector exports for print</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
              <span>Optimized SVG for web (SVGO integration)</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
              <span>React component export from designs</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div>
      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
        <Terminal className="w-5 h-5 text-blue-400" />
        Scripting API
      </h3>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <p className="text-sm text-neutral-400 mb-4">
          VectorCraft Canvas exposes a TypeScript API for programmatic control of the canvas. Access via browser console or custom scripts.
        </p>
        <div className="space-y-4">
          <div>
            <div className="text-xs text-neutral-500 mb-2">Create parametric rectangle</div>
            <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 overflow-x-auto">
{`canvas.createRect({
  x: 100, y: 100,
  width: 200, height: 150,
  cornerRadius: 20,
  fill: '#FF6B6B',
  stroke: '#C92A2A',
  strokeWidth: 2
});`}
            </pre>
          </div>
          <div>
            <div className="text-xs text-neutral-500 mb-2">Generate pattern with loop</div>
            <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 overflow-x-auto">
{`for (let i = 0; i < 10; i++) {
  canvas.createCircle({
    x: 50 + i * 40,
    y: 200,
    radius: 15 + i * 2,
    fill: \`hsl(\${i * 36}, 70%, 60%)\`
  });
}`}
            </pre>
          </div>
          <div>
            <div className="text-xs text-neutral-500 mb-2">Boolean operations</div>
            <pre className="bg-black border border-neutral-700 rounded p-3 text-xs text-green-400 overflow-x-auto">
{`const rect = canvas.createRect({ x: 0, y: 0, width: 100, height: 100 });
const circle = canvas.createCircle({ x: 50, y: 50, radius: 60 });
const result = canvas.boolean.subtract(rect, circle);`}
            </pre>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
      <h4 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
        <Zap className="w-5 h-5" />
        Canvas Pro Tips
      </h4>
      <div className="space-y-2 text-sm text-neutral-300">
        <div className="flex items-start gap-2">
          <span className="text-yellow-400 font-bold">1.</span>
          <span>Use parametric shapes over freehand drawing for easier iteration and responsive design</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-yellow-400 font-bold">2.</span>
          <span>Group related objects (Ctrl+G) to maintain hierarchy and enable batch transformations</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-yellow-400 font-bold">3.</span>
          <span>Boolean operations are destructive - duplicate shapes (Ctrl+D) before combining</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-yellow-400 font-bold">4.</span>
          <span>Export SVG with "Optimize" option enabled to reduce file size by 40-60%</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-yellow-400 font-bold">5.</span>
          <span>Use the scripting API for repetitive tasks - batch create 100+ objects in milliseconds</span>
        </div>
      </div>
    </div>
  </div>
);
