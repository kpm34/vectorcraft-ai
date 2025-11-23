import React from 'react';
import { Sparkles, Zap, Code, FileImage, Wand2, Download } from 'lucide-react';

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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              VectorCraft AI
            </h1>
          </div>
          <button
            onClick={onNavigateToCanvas}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
          >
            Launch Editor
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8">
          <Sparkles size={16} className="text-indigo-400" />
          <span className="text-sm text-indigo-300">AI-Powered Vector Graphics</span>
        </div>

        <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Convert Images to SVG
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            In Seconds
          </span>
        </h2>

        <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto">
          Free online SVG converter and editor. Transform PNG, JPG, JPEG to scalable vector graphics with AI.
          Perfect for logos, icons, and illustrations.
        </p>

        <button
          onClick={onNavigateToCanvas}
          className="group px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl shadow-indigo-500/50"
        >
          <span className="flex items-center gap-3">
            Start Creating Free
            <Wand2 size={24} className="group-hover:rotate-12 transition-transform" />
          </span>
        </button>

        <p className="text-zinc-500 text-sm mt-4">No signup required • Works in your browser • Completely free</p>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Everything You Need for Vector Graphics
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* PNG to SVG */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-indigo-500/50 transition-colors">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-5">
              <FileImage size={28} className="text-indigo-400" />
            </div>
            <h4 className="text-2xl font-bold mb-3">PNG to SVG</h4>
            <p className="text-zinc-400 leading-relaxed">
              Convert PNG images to scalable vector graphics instantly. Perfect for logos and icons that need to scale perfectly.
            </p>
          </div>

          {/* JPG/JPEG to SVG */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-purple-500/50 transition-colors">
            <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-5">
              <FileImage size={28} className="text-purple-400" />
            </div>
            <h4 className="text-2xl font-bold mb-3">JPG/JPEG to SVG</h4>
            <p className="text-zinc-400 leading-relaxed">
              Transform JPEG and JPG photos into crisp vector graphics. AI-powered vectorization handles complex images.
            </p>
          </div>

          {/* Logo to SVG */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-pink-500/50 transition-colors">
            <div className="w-14 h-14 bg-pink-500/10 rounded-xl flex items-center justify-center mb-5">
              <Sparkles size={28} className="text-pink-400" />
            </div>
            <h4 className="text-2xl font-bold mb-3">Logo to SVG</h4>
            <p className="text-zinc-400 leading-relaxed">
              Convert your logo to SVG format for unlimited scaling. Maintains quality at any size, perfect for web and print.
            </p>
          </div>

          {/* SVG Optimizer */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-green-500/50 transition-colors">
            <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-5">
              <Zap size={28} className="text-green-400" />
            </div>
            <h4 className="text-2xl font-bold mb-3">Free SVG Optimizer</h4>
            <p className="text-zinc-400 leading-relaxed">
              Optimize and compress your SVG files for faster loading. Reduces file size while maintaining quality.
            </p>
          </div>

          {/* SVG to JSX */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-colors">
            <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-5">
              <Code size={28} className="text-cyan-400" />
            </div>
            <h4 className="text-2xl font-bold mb-3">SVG to JSX Converter</h4>
            <p className="text-zinc-400 leading-relaxed">
              Export SVG as React JSX components. Perfect for developers building modern web applications.
            </p>
          </div>

          {/* Export Options */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-orange-500/50 transition-colors">
            <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mb-5">
              <Download size={28} className="text-orange-400" />
            </div>
            <h4 className="text-2xl font-bold mb-3">Multiple Export Formats</h4>
            <p className="text-zinc-400 leading-relaxed">
              Download as SVG, PNG, PDF, or React/Vue/HTML code. One tool for all your export needs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-3xl p-12 md:p-16 text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Create Beautiful Vectors?
          </h3>
          <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto">
            Join thousands of designers and developers using VectorCraft AI for free vector graphics creation.
          </p>
          <button
            onClick={onNavigateToCanvas}
            className="px-12 py-6 bg-white text-zinc-900 hover:bg-zinc-100 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl"
          >
            Launch Free Editor Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center text-zinc-500">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-semibold text-zinc-400">VectorCraft AI</span>
          </div>
          <p className="text-sm">
            Free online SVG converter and editor. Convert PNG, JPG, JPEG to SVG. Optimize SVG files. Export to JSX.
          </p>
          <p className="text-xs mt-4">© 2025 VectorCraft AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
