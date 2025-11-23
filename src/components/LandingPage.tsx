import React from 'react';
import { Sparkles, Zap, Code, FileImage, Wand2, Download, Grid3x3, Layers, BoxSelect, Package, Terminal, Rocket, Palette, Box, Gauge } from 'lucide-react';

interface LandingPageProps {
  onNavigateToCanvas: () => void;
}

function LandingPage({ onNavigateToCanvas }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-grey-bg-900 text-bone-100">
      {/* Header */}
      <header className="border-b border-grey-bg-700 bg-grey-bg-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-grey-bg-700 rounded-lg flex items-center justify-center">
              <Sparkles size={24} className="text-bone-200" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-bone-50">
                VectorCraft AI
              </h1>
              <p className="text-xs text-bone-400">Lightweight Vector Workstation</p>
            </div>
          </div>
          <button
            onClick={onNavigateToCanvas}
            className="px-6 py-2 bg-grey-bg-700 hover:bg-grey-bg-700/80 text-bone-50 rounded-lg font-semibold transition-colors"
          >
            Launch Workstation
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-grey-bg-700/50 border border-grey-bg-700 rounded-full mb-8">
          <Layers size={16} className="text-bone-200" />
          <span className="text-sm text-bone-200">For Front-End Devs & UI Designers</span>
        </div>

        <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-bone-50">
          A Lightweight Vector
          <br />
          <span className="text-bone-100">
            Workstation
          </span>
        </h2>

        <p className="text-xl md:text-2xl text-bone-300 mb-12 max-w-3xl mx-auto">
          For logos, icons, and makers. Create, optimize, and export production-ready vector assets
          with built-in icon normalization and developer tooling.
        </p>

        <button
          onClick={onNavigateToCanvas}
          className="group px-10 py-5 bg-grey-bg-700 hover:bg-grey-bg-700/80 text-bone-50 rounded-xl font-bold text-lg transition-all transform hover:scale-105"
        >
          <span className="flex items-center gap-3">
            Open Workstation
            <Wand2 size={24} className="group-hover:rotate-12 transition-transform" />
          </span>
        </button>

        <p className="text-bone-400 text-sm mt-4">No signup • Runs in browser • Free forever</p>
      </section>

      {/* Use Cases */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-grey-bg-700 rounded-lg flex items-center justify-center">
              <Palette size={24} className="text-bone-200" />
            </div>
            <h4 className="font-bold text-lg mb-2 text-bone-50">Logos & Brand Assets</h4>
            <p className="text-bone-400 text-sm">Create and optimize logos for any platform</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-grey-bg-700 rounded-lg flex items-center justify-center">
              <Box size={24} className="text-bone-200" />
            </div>
            <h4 className="font-bold text-lg mb-2 text-bone-50">Icons & UI Assets</h4>
            <p className="text-bone-400 text-sm">Build consistent icon systems for products</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-grey-bg-700 rounded-lg flex items-center justify-center">
              <Gauge size={24} className="text-bone-200" />
            </div>
            <h4 className="font-bold text-lg mb-2 text-bone-50">Production Ready</h4>
            <p className="text-bone-400 text-sm">Export optimized code for any framework</p>
          </div>
        </div>
      </section>

      {/* HTML to Design Feature */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-grey-bg-800 border border-grey-bg-700 rounded-3xl p-12 md:p-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-grey-bg-700/50 border border-grey-bg-700 rounded-full mb-6">
              <Wand2 size={16} className="text-bone-200" />
              <span className="text-sm text-bone-200">New: HTML to Design</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-bone-50">
              Import Any Website as SVG
            </h3>
            <p className="text-xl text-bone-200 max-w-3xl mx-auto mb-8">
              Capture any URL as a reference layer, then trace over it or extract assets as vectors.
              Perfect for recreating designs, extracting logos, and building design systems from live sites.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-grey-bg-700/30 rounded-xl p-6 border border-grey-bg-700">
              <h4 className="text-lg font-bold mb-4 text-bone-50">How it works:</h4>
              <ol className="space-y-3 text-bone-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-grey-bg-700 text-bone-200 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span>Enter any website URL</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-grey-bg-700 text-bone-200 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span>We capture a full-page screenshot</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-grey-bg-700 text-bone-200 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <span>Screenshot appears as locked background layer</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-grey-bg-700 text-bone-200 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <span>Draw over it or crop sections to vectorize</span>
                </li>
              </ol>
            </div>

            <div className="bg-grey-bg-700/30 rounded-xl p-6 border border-grey-bg-700">
              <h4 className="text-lg font-bold mb-4 text-bone-50">Use cases:</h4>
              <ul className="space-y-3 text-bone-300">
                <li className="flex items-start gap-2">
                  <span className="text-bone-200 mt-1">—</span>
                  <span><strong className="text-bone-50">Extract logos</strong> from any website for client work</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bone-200 mt-1">—</span>
                  <span><strong className="text-bone-50">Recreate UI elements</strong> as clean SVG components</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bone-200 mt-1">—</span>
                  <span><strong className="text-bone-50">Build design systems</strong> from existing sites</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bone-200 mt-1">—</span>
                  <span><strong className="text-bone-50">Reference designs</strong> while creating new assets</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Icon System Toolkit */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-grey-bg-700/50 border border-grey-bg-700 rounded-full mb-6">
            <Grid3x3 size={16} className="text-bone-200" />
            <span className="text-sm text-bone-200">Icon System Toolkit</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-bone-50">
            Built for Front-End Developers
          </h3>
          <p className="text-bone-300 text-lg max-w-2xl mx-auto">
            Professional tools for creating production-ready icon systems and vector assets
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Icon Normalization */}
          <div className="bg-grey-bg-800 border border-grey-bg-700 rounded-2xl p-8 hover:border-grey-bg-700/80 transition-colors">
            <div className="w-14 h-14 bg-grey-bg-700 rounded-xl flex items-center justify-center mb-5">
              <BoxSelect size={28} className="text-bone-200" />
            </div>
            <h4 className="text-2xl font-bold mb-3 text-bone-50">Icon Normalization</h4>
            <ul className="space-y-3 text-bone-300">
              <li className="flex items-start gap-2">
                <span className="text-bone-200 mt-1">—</span>
                <span><strong className="text-bone-50">Normalize viewBox</strong> - Standardize dimensions across icon sets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bone-200 mt-1">—</span>
                <span><strong className="text-bone-50">Auto-center</strong> - Perfectly center icons in their viewBox</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bone-200 mt-1">—</span>
                <span><strong className="text-bone-50">Enforce stroke width & padding</strong> - Consistent visual weight</span>
              </li>
            </ul>
          </div>

          {/* Developer Exports */}
          <div className="bg-grey-bg-800 border border-grey-bg-700 rounded-2xl p-8 hover:border-grey-bg-700/80 transition-colors">
            <div className="w-14 h-14 bg-grey-bg-700 rounded-xl flex items-center justify-center mb-5">
              <Code size={28} className="text-bone-200" />
            </div>
            <h4 className="text-2xl font-bold mb-3 text-bone-50">Developer-Ready Exports</h4>
            <ul className="space-y-3 text-bone-300">
              <li className="flex items-start gap-2">
                <span className="text-bone-200 mt-1">—</span>
                <span><strong className="text-bone-50">React/Vue components</strong> - Drop-in JSX/TSX files</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bone-200 mt-1">—</span>
                <span><strong className="text-bone-50">Sprite sheet</strong> - Single SVG for all icons</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bone-200 mt-1">—</span>
                <span><strong className="text-bone-50">Optional icon font</strong> - Web font generation</span>
              </li>
            </ul>
          </div>

          {/* AI Vectorization */}
          <div className="bg-grey-bg-800 border border-grey-bg-700 rounded-2xl p-8 hover:border-grey-bg-700/80 transition-colors">
            <div className="w-14 h-14 bg-grey-bg-700 rounded-xl flex items-center justify-center mb-5">
              <Wand2 size={28} className="text-bone-200" />
            </div>
            <h4 className="text-2xl font-bold mb-3 text-bone-50">AI Vectorization</h4>
            <ul className="space-y-3 text-bone-300">
              <li className="flex items-start gap-2">
                <span className="text-bone-200 mt-1">—</span>
                <span><strong className="text-bone-50">PNG/JPG to SVG</strong> - Convert raster logos to vectors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bone-200 mt-1">—</span>
                <span><strong className="text-bone-50">Smart tracing</strong> - AI-powered path optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bone-200 mt-1">—</span>
                <span><strong className="text-bone-50">Instant results</strong> - No cloud processing delays</span>
              </li>
            </ul>
          </div>

          {/* SVG Optimizer */}
          <div className="bg-grey-bg-800 border border-grey-bg-700 rounded-2xl p-8 hover:border-grey-bg-700/80 transition-colors">
            <div className="w-14 h-14 bg-grey-bg-700 rounded-xl flex items-center justify-center mb-5">
              <Zap size={28} className="text-bone-200" />
            </div>
            <h4 className="text-2xl font-bold mb-3 text-bone-50">Free SVG Optimizer</h4>
            <ul className="space-y-3 text-bone-300">
              <li className="flex items-start gap-2">
                <span className="text-bone-200 mt-1">—</span>
                <span><strong className="text-bone-50">Reduce file size</strong> - Remove unnecessary metadata</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bone-200 mt-1">—</span>
                <span><strong className="text-bone-50">Clean output</strong> - Production-ready SVG code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bone-200 mt-1">—</span>
                <span><strong className="text-bone-50">Batch processing</strong> - Optimize entire icon sets</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CLI + API Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-grey-bg-700/50 border border-grey-bg-700 rounded-full mb-6">
            <Terminal size={16} className="text-bone-200" />
            <span className="text-sm text-bone-200">For Developers & Teams</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-bone-50">
            CLI + API Integration
          </h3>
          <p className="text-bone-300 text-lg max-w-2xl mx-auto">
            Integrate VectorCraft into your workflow, CI/CD pipelines, and SaaS products
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* CLI */}
          <div className="bg-grey-bg-800 border border-grey-bg-700 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-grey-bg-700 rounded-xl flex items-center justify-center">
                <Terminal size={24} className="text-bone-200" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-bone-50">CLI Tool</h4>
                <p className="text-sm text-bone-400">Command-line interface</p>
              </div>
            </div>

            <div className="bg-grey-bg-900 rounded-lg p-4 mb-4 font-mono text-sm overflow-x-auto">
              <div className="text-bone-300"># Install globally</div>
              <div className="text-bone-100">npm install -g @vectorcraft/cli</div>
              <div className="mt-3 text-bone-300"># Convert image to SVG</div>
              <div className="text-bone-100">svgify logo.png --mode logo-clean</div>
            </div>

            <ul className="space-y-2 text-sm text-bone-300">
              <li className="flex items-start gap-2">
                <span className="text-bone-200 mt-1">—</span>
                <span>Script bulk conversions in your build process</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bone-200 mt-1">—</span>
                <span>Automate asset pipelines with npm scripts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bone-200 mt-1">—</span>
                <span>Integrate into CI/CD workflows (GitHub Actions, etc.)</span>
              </li>
            </ul>
          </div>

          {/* API */}
          <div className="bg-grey-bg-800 border border-grey-bg-700 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-grey-bg-700 rounded-xl flex items-center justify-center">
                <Rocket size={24} className="text-bone-200" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-bone-50">REST API</h4>
                <p className="text-sm text-bone-400">Programmatic access</p>
              </div>
            </div>

            <div className="bg-grey-bg-900 rounded-lg p-4 mb-4 font-mono text-sm overflow-x-auto">
              <div className="text-bone-300">POST /api/convert</div>
              <div className="text-bone-400 mt-2">{'{'}</div>
              <div className="text-bone-100 ml-4">"image": "base64...",</div>
              <div className="text-bone-100 ml-4">"mode": "logo-clean"</div>
              <div className="text-bone-400">{'}'}</div>
            </div>

            <ul className="space-y-2 text-sm text-bone-300">
              <li className="flex items-start gap-2">
                <span className="text-bone-200 mt-1">—</span>
                <span>Embed SVG conversion in your SaaS platform</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bone-200 mt-1">—</span>
                <span>Power user-facing features silently</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bone-200 mt-1">—</span>
                <span>Process images at scale with rate-limited API</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Use Cases */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-grey-bg-800/50 border border-grey-bg-700 rounded-xl p-6 text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-grey-bg-700 rounded-lg flex items-center justify-center">
              <Package size={20} className="text-bone-200" />
            </div>
            <h5 className="font-bold mb-2 text-bone-50">SaaS Integration</h5>
            <p className="text-sm text-bone-400">Integrate silent SVG conversion into your app</p>
          </div>
          <div className="bg-grey-bg-800/50 border border-grey-bg-700 rounded-xl p-6 text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-grey-bg-700 rounded-lg flex items-center justify-center">
              <Layers size={20} className="text-bone-200" />
            </div>
            <h5 className="font-bold mb-2 text-bone-50">Agency Workflows</h5>
            <p className="text-sm text-bone-400">Script bulk jobs for client assets</p>
          </div>
          <div className="bg-grey-bg-800/50 border border-grey-bg-700 rounded-xl p-6 text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-grey-bg-700 rounded-lg flex items-center justify-center">
              <Code size={20} className="text-bone-200" />
            </div>
            <h5 className="font-bold mb-2 text-bone-50">Build Pipelines</h5>
            <p className="text-sm text-bone-400">Bake into your CI/CD and asset builds</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="bg-grey-bg-800 border border-grey-bg-700 rounded-3xl p-12 md:p-16 text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-6 text-bone-50">
            Ready to Build Your Icon System?
          </h3>
          <p className="text-xl text-bone-200 mb-10 max-w-2xl mx-auto">
            Join front-end developers and UI designers using VectorCraft AI for production-ready vector assets.
          </p>
          <button
            onClick={onNavigateToCanvas}
            className="px-12 py-6 bg-bone-50 text-grey-bg-900 hover:bg-bone-100 rounded-xl font-bold text-xl transition-all transform hover:scale-105"
          >
            Launch Workstation
          </button>
          <p className="text-bone-400 text-sm mt-6">
            Free forever • No account needed • Works offline
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-grey-bg-700 bg-grey-bg-800/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center text-bone-300">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-grey-bg-700 rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-bone-200" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-bone-100">VectorCraft AI</div>
              <div className="text-xs text-bone-400">Lightweight Vector Workstation</div>
            </div>
          </div>
          <p className="text-sm max-w-2xl mx-auto">
            A lightweight vector workstation for logos, icons, and makers. Icon normalization, SVG optimization,
            and developer-ready exports (React, Vue, JSX). Free SVG converter with AI vectorization.
          </p>
          <p className="text-xs mt-4 text-bone-400">© 2025 VectorCraft AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
