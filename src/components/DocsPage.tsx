import React from 'react';
import {
  ArrowLeft,
  BookOpen,
  Code,
  Terminal,
  FileCode,
  Sparkles,
  Box,
  PenTool,
  Palette,
  Download,
  ChevronRight
} from 'lucide-react';

interface DocsPageProps {
  onNavigateHome: () => void;
}

const DocsPage: React.FC<DocsPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="min-h-screen bg-warm-bg text-text-primary font-body">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 max-w-7xl mx-auto border-b border-charcoal/10">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-text-primary/60 hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-cta-orange" size={32} />
          <h1 className="text-5xl font-sans font-bold text-charcoal">Documentation</h1>
        </div>
        <p className="text-xl text-text-primary/70 max-w-2xl">
          Everything you need to know about VectorCraft AI - from quick starts to advanced workflows.
        </p>
      </section>

      {/* Quick Links */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-sans font-bold text-charcoal mb-8">Quick Start</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <a
            href="#vector-guide"
            className="p-6 rounded-2xl bg-white border border-charcoal/10 hover:border-cta-orange/30 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <PenTool className="text-cta-orange" size={24} />
              <ChevronRight className="text-text-primary/40 group-hover:text-cta-orange group-hover:translate-x-1 transition-all" size={20} />
            </div>
            <h3 className="text-xl font-sans font-semibold text-charcoal mb-2">Vector Studio Guide</h3>
            <p className="text-text-primary/60 text-sm">
              Learn to draw, optimize, and export production-ready SVGs
            </p>
          </a>

          <a
            href="#texture-guide"
            className="p-6 rounded-2xl bg-white border border-charcoal/10 hover:border-accent-teal/30 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <Palette className="text-accent-teal" size={24} />
              <ChevronRight className="text-text-primary/40 group-hover:text-accent-teal group-hover:translate-x-1 transition-all" size={20} />
            </div>
            <h3 className="text-xl font-sans font-semibold text-charcoal mb-2">Texture Studio Guide</h3>
            <p className="text-text-primary/60 text-sm">
              Generate AI-powered MatCaps and PBR texture sets
            </p>
          </a>

          <a
            href="#cli-api"
            className="p-6 rounded-2xl bg-white border border-charcoal/10 hover:border-accent-green/30 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <Terminal className="text-accent-green" size={24} />
              <ChevronRight className="text-text-primary/40 group-hover:text-accent-green group-hover:translate-x-1 transition-all" size={20} />
            </div>
            <h3 className="text-xl font-sans font-semibold text-charcoal mb-2">Dev Tools & CLI</h3>
            <p className="text-text-primary/60 text-sm">
              Automate workflows with CLI tools and API integration
            </p>
          </a>
        </div>
      </section>

      {/* Vector Studio Documentation */}
      <section id="vector-guide" className="py-16 px-6 max-w-7xl mx-auto bg-white rounded-3xl shadow-sm my-8">
        <h2 className="text-3xl font-sans font-bold text-charcoal mb-8 flex items-center gap-3">
          <PenTool className="text-cta-orange" size={28} />
          Vector Studio
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-charcoal mb-3">Getting Started</h3>
            <div className="bg-charcoal/5 rounded-xl p-6 space-y-3 text-sm">
              <p className="text-text-primary/80">
                <strong>1. Choose a Tool:</strong> Select from Pen, Pencil, Crayon, or Shape tools in the toolbar
              </p>
              <p className="text-text-primary/80">
                <strong>2. Draw on Canvas:</strong> Click and drag to create vector paths
              </p>
              <p className="text-text-primary/80">
                <strong>3. Customize:</strong> Adjust stroke, fill, and styling in the properties panel
              </p>
              <p className="text-text-primary/80">
                <strong>4. Export:</strong> Download as optimized SVG, React component, or Vue component
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-charcoal mb-3">Tools Reference</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-charcoal/10">
                <h4 className="font-semibold text-charcoal mb-2">Pen Tool</h4>
                <p className="text-sm text-text-primary/70">Create precise Bézier curves with node-level control</p>
              </div>
              <div className="p-4 rounded-lg border border-charcoal/10">
                <h4 className="font-semibold text-charcoal mb-2">Pencil Tool</h4>
                <p className="text-sm text-text-primary/70">Freehand drawing with automatic path smoothing</p>
              </div>
              <div className="p-4 rounded-lg border border-charcoal/10">
                <h4 className="font-semibold text-charcoal mb-2">Shape Tool</h4>
                <p className="text-sm text-text-primary/70">Rectangle, circle, triangle, and polygon primitives</p>
              </div>
              <div className="p-4 rounded-lg border border-charcoal/10">
                <h4 className="font-semibold text-charcoal mb-2">Text Tool</h4>
                <p className="text-sm text-text-primary/70">Add editable text with custom fonts and sizes</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-charcoal mb-3">AI Vectorization</h3>
            <div className="bg-code-bg rounded-xl p-6 font-mono text-sm text-white/80">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-cta-orange" size={16} />
                <span className="text-cta-orange">Convert PNG/JPG to SVG</span>
              </div>
              <div className="space-y-1 text-white/60">
                <div>1. Upload raster image (PNG/JPG)</div>
                <div>2. AI detects edges and traces paths</div>
                <div>3. Simplifies nodes by up to 70%</div>
                <div>4. Export clean, optimized SVG</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Texture Studio Documentation */}
      <section id="texture-guide" className="py-16 px-6 max-w-7xl mx-auto bg-white rounded-3xl shadow-sm my-8">
        <h2 className="text-3xl font-sans font-bold text-charcoal mb-8 flex items-center gap-3">
          <Palette className="text-accent-teal" size={28} />
          Texture Studio
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-charcoal mb-3">Generate Textures</h3>
            <div className="bg-charcoal/5 rounded-xl p-6 space-y-3 text-sm">
              <p className="text-text-primary/80">
                <strong>MatCap Mode:</strong> Generate spherical material captures for real-time rendering (chrome, clay, velvet, etc.)
              </p>
              <p className="text-text-primary/80">
                <strong>PBR Mode:</strong> Generate physically-based rendering texture sets (albedo, normal, roughness)
              </p>
              <p className="text-text-primary/80">
                <strong>Quality:</strong> Choose between Fast (1K) or High (2K) resolution output
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-charcoal mb-3">Example Prompts</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-accent-teal/10 border border-accent-teal/20">
                <p className="font-mono text-sm text-charcoal">"Polished chrome with subtle scratches"</p>
              </div>
              <div className="p-4 rounded-lg bg-accent-teal/10 border border-accent-teal/20">
                <p className="font-mono text-sm text-charcoal">"Rough concrete with weathering"</p>
              </div>
              <div className="p-4 rounded-lg bg-accent-teal/10 border border-accent-teal/20">
                <p className="font-mono text-sm text-charcoal">"Soft velvet fabric material"</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-charcoal mb-3">Export Options</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-charcoal/10 text-center">
                <Download className="text-accent-teal mx-auto mb-2" size={24} />
                <h4 className="font-semibold text-charcoal mb-1">PNG Files</h4>
                <p className="text-xs text-text-primary/70">Individual texture maps</p>
              </div>
              <div className="p-4 rounded-lg border border-charcoal/10 text-center">
                <Box className="text-accent-teal mx-auto mb-2" size={24} />
                <h4 className="font-semibold text-charcoal mb-1">GLB Package</h4>
                <p className="text-xs text-text-primary/70">Baked 3D format</p>
              </div>
              <div className="p-4 rounded-lg border border-charcoal/10 text-center">
                <Code className="text-accent-teal mx-auto mb-2" size={24} />
                <h4 className="font-semibold text-charcoal mb-1">Three.js Code</h4>
                <p className="text-xs text-text-primary/70">Ready-to-use React</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLI Documentation */}
      <section id="cli-api" className="py-16 px-6 max-w-7xl mx-auto bg-white rounded-3xl shadow-sm my-8 mb-16">
        <h2 className="text-3xl font-sans font-bold text-charcoal mb-8 flex items-center gap-3">
          <Terminal className="text-accent-green" size={28} />
          CLI & API
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-charcoal mb-3">Installation</h3>
            <div className="bg-code-bg rounded-xl p-4 font-mono text-sm text-white/80">
              <div className="text-accent-green">$</div>
              <div className="ml-4">npm install -g vectorcraft-cli</div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-charcoal mb-3">Common Commands</h3>
            <div className="space-y-3">
              <div className="bg-code-bg rounded-xl p-4 font-mono text-sm text-white/80">
                <div className="text-text-primary/40 mb-1"># Convert PNG to SVG</div>
                <div className="text-white">vectorcraft convert input.png --output output.svg</div>
              </div>
              <div className="bg-code-bg rounded-xl p-4 font-mono text-sm text-white/80">
                <div className="text-text-primary/40 mb-1"># Optimize SVG files</div>
                <div className="text-white">vectorcraft optimize *.svg --recursive</div>
              </div>
              <div className="bg-code-bg rounded-xl p-4 font-mono text-sm text-white/80">
                <div className="text-text-primary/40 mb-1"># Normalize icon viewBox</div>
                <div className="text-white">vectorcraft normalize icons/ --viewbox 24</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-charcoal mb-3">API Endpoints</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-charcoal/10">
                <code className="text-sm font-mono text-cta-orange">POST /api/vectorize</code>
                <p className="text-sm text-text-primary/70 mt-1">Convert raster images to vector SVG</p>
              </div>
              <div className="p-4 rounded-lg border border-charcoal/10">
                <code className="text-sm font-mono text-accent-teal">POST /api/texture</code>
                <p className="text-sm text-text-primary/70 mt-1">Generate AI textures from prompts</p>
              </div>
              <div className="p-4 rounded-lg border border-charcoal/10">
                <code className="text-sm font-mono text-accent-green">POST /api/optimize</code>
                <p className="text-sm text-text-primary/70 mt-1">Optimize and compress SVG files</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DocsPage;
