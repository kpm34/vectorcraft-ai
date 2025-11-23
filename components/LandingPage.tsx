import React from 'react';
import { Sparkles, Zap, Code, FileImage, Wand2, Download, Grid3x3, Layers, BoxSelect, Package } from 'lucide-react';

interface LandingPageProps {
  onNavigateToCanvas: () => void;
}

function LandingPage({ onNavigateToCanvas }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                VectorCraft AI
              </h1>
              <p className="text-xs text-zinc-500">Lightweight Vector Workstation</p>
            </div>
          </div>
          <button
            onClick={onNavigateToCanvas}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
          >
            Launch Workstation
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8">
          <Layers size={16} className="text-indigo-400" />
          <span className="text-sm text-indigo-300">For Front-End Devs & UI Designers</span>
        </div>

        <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          A Lightweight Vector
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Workstation
          </span>
        </h2>

        <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto">
          For logos, icons, and makers. Create, optimize, and export production-ready vector assets
          with built-in icon normalization and developer tooling.
        </p>

        <button
          onClick={onNavigateToCanvas}
          className="group px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl shadow-indigo-500/50"
        >
          <span className="flex items-center gap-3">
            Open Workstation
            <Wand2 size={24} className="group-hover:rotate-12 transition-transform" />
          </span>
        </button>

        <p className="text-zinc-500 text-sm mt-4">No signup • Runs in browser • Free forever</p>
      </section>

      {/* Use Cases */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="text-center p-6">
            <div className="text-4xl mb-3">🎨</div>
            <h4 className="font-bold text-lg mb-2">Logos & Brand Assets</h4>
            <p className="text-zinc-500 text-sm">Create and optimize logos for any platform</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">📦</div>
            <h4 className="font-bold text-lg mb-2">Icons & UI Assets</h4>
            <p className="text-zinc-500 text-sm">Build consistent icon systems for products</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">⚡</div>
            <h4 className="font-bold text-lg mb-2">Production Ready</h4>
            <p className="text-zinc-500 text-sm">Export optimized code for any framework</p>
          </div>
        </div>
      </section>

      {/* Icon System Toolkit */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
            <Grid3x3 size={16} className="text-purple-400" />
            <span className="text-sm text-purple-300">Icon System Toolkit</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Built for Front-End Developers
          </h3>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Professional tools for creating production-ready icon systems and vector assets
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Icon Normalization */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-indigo-500/50 transition-colors">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-5">
              <BoxSelect size={28} className="text-indigo-400" />
            </div>
            <h4 className="text-2xl font-bold mb-3">Icon Normalization</h4>
            <ul className="space-y-3 text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">✓</span>
                <span><strong className="text-white">Normalize viewBox</strong> - Standardize dimensions across icon sets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">✓</span>
                <span><strong className="text-white">Auto-center</strong> - Perfectly center icons in their viewBox</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">✓</span>
                <span><strong className="text-white">Enforce stroke width & padding</strong> - Consistent visual weight</span>
              </li>
            </ul>
          </div>

          {/* Developer Exports */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-purple-500/50 transition-colors">
            <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-5">
              <Code size={28} className="text-purple-400" />
            </div>
            <h4 className="text-2xl font-bold mb-3">Developer-Ready Exports</h4>
            <ul className="space-y-3 text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">✓</span>
                <span><strong className="text-white">React/Vue components</strong> - Drop-in JSX/TSX files</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">✓</span>
                <span><strong className="text-white">Sprite sheet</strong> - Single SVG for all icons</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">✓</span>
                <span><strong className="text-white">Optional icon font</strong> - Web font generation</span>
              </li>
            </ul>
          </div>

          {/* AI Vectorization */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-pink-500/50 transition-colors">
            <div className="w-14 h-14 bg-pink-500/10 rounded-xl flex items-center justify-center mb-5">
              <Wand2 size={28} className="text-pink-400" />
            </div>
            <h4 className="text-2xl font-bold mb-3">AI Vectorization</h4>
            <ul className="space-y-3 text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-1">✓</span>
                <span><strong className="text-white">PNG/JPG to SVG</strong> - Convert raster logos to vectors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-1">✓</span>
                <span><strong className="text-white">Smart tracing</strong> - AI-powered path optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-1">✓</span>
                <span><strong className="text-white">Instant results</strong> - No cloud processing delays</span>
              </li>
            </ul>
          </div>

          {/* SVG Optimizer */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-green-500/50 transition-colors">
            <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-5">
              <Zap size={28} className="text-green-400" />
            </div>
            <h4 className="text-2xl font-bold mb-3">Free SVG Optimizer</h4>
            <ul className="space-y-3 text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span><strong className="text-white">Reduce file size</strong> - Remove unnecessary metadata</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span><strong className="text-white">Clean output</strong> - Production-ready SVG code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span><strong className="text-white">Batch processing</strong> - Optimize entire icon sets</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-3xl p-12 md:p-16 text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Your Icon System?
          </h3>
          <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto">
            Join front-end developers and UI designers using VectorCraft AI for production-ready vector assets.
          </p>
          <button
            onClick={onNavigateToCanvas}
            className="px-12 py-6 bg-white text-zinc-900 hover:bg-zinc-100 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl"
          >
            Launch Workstation
          </button>
          <p className="text-zinc-500 text-sm mt-6">
            Free forever • No account needed • Works offline
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center text-zinc-500">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-zinc-400">VectorCraft AI</div>
              <div className="text-xs text-zinc-600">Lightweight Vector Workstation</div>
            </div>
          </div>
          <p className="text-sm max-w-2xl mx-auto">
            A lightweight vector workstation for logos, icons, and makers. Icon normalization, SVG optimization,
            and developer-ready exports (React, Vue, JSX). Free SVG converter with AI vectorization.
          </p>
          <p className="text-xs mt-4">© 2025 VectorCraft AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
