import React from 'react';
import {
  ArrowLeft,
  Plug,
  Download,
  ExternalLink,
  Code,
  Box,
  FileCode,
  Puzzle,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface PluginsPageProps {
  onNavigateHome: () => void;
}

const PluginsPage: React.FC<PluginsPageProps> = ({ onNavigateHome }) => {
  const plugins = [
    {
      name: 'Blender Add-on',
      icon: Box,
      color: 'cta-orange',
      description: 'Import SVG as curves and apply AI-generated textures directly in Blender',
      version: 'v1.2.0',
      compatibility: 'Blender 3.0+',
      features: [
        'Import SVG files as Blender curves',
        'One-click texture application',
        'Material library integration',
        'Batch import support'
      ],
      downloadUrl: '#',
      docsUrl: '#'
    },
    {
      name: 'Figma Plugin',
      icon: Layers,
      color: 'accent-teal',
      description: 'Export optimized SVGs from Figma designs with automatic cleanup',
      version: 'v2.1.0',
      compatibility: 'Figma',
      features: [
        'One-click SVG export',
        'Automatic path optimization',
        'Icon normalization',
        'Batch export support'
      ],
      downloadUrl: '#',
      docsUrl: '#'
    },
    {
      name: 'VSCode Extension',
      icon: Code,
      color: 'accent-green',
      description: 'Preview and edit SVG files inline with live rendering',
      version: 'v1.5.1',
      compatibility: 'VSCode 1.60+',
      features: [
        'Inline SVG preview',
        'Code formatting',
        'Path visualization',
        'Export to React/Vue'
      ],
      downloadUrl: '#',
      docsUrl: '#'
    },
    {
      name: 'Unity Package',
      icon: Puzzle,
      color: 'cta-orange',
      description: 'Material importer for Unity with PBR texture support',
      version: 'v1.0.3',
      compatibility: 'Unity 2020+',
      features: [
        'Drag-and-drop import',
        'PBR material setup',
        'Texture optimization',
        'Shader integration'
      ],
      downloadUrl: '#',
      docsUrl: '#'
    }
  ];

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
          <Plug className="text-cta-orange" size={32} />
          <h1 className="text-5xl font-sans font-bold text-charcoal">Plugins & Integrations</h1>
        </div>
        <p className="text-xl text-text-primary/70 max-w-2xl">
          Extend VectorCraft AI with official plugins for your favorite design and development tools.
        </p>
      </section>

      {/* Plugin Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {plugins.map((plugin) => {
            const IconComponent = plugin.icon;
            return (
              <div
                key={plugin.name}
                className="p-8 rounded-2xl bg-white border border-charcoal/10 hover:border-cta-orange/30 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-${plugin.color}/10`}>
                      <IconComponent className={`text-${plugin.color}`} size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-sans font-semibold text-charcoal">{plugin.name}</h3>
                      <p className="text-sm text-text-primary/60">{plugin.version}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-charcoal/5 text-xs font-mono text-text-primary/60">
                    {plugin.compatibility}
                  </span>
                </div>

                {/* Description */}
                <p className="text-text-primary/70 mb-6">
                  {plugin.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {plugin.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className={`text-${plugin.color} mt-0.5 flex-shrink-0`} />
                      <span className="text-sm text-text-primary/70">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-charcoal/10">
                  <a
                    href={plugin.downloadUrl}
                    className="flex-1 px-4 py-2 bg-cta-orange text-white rounded-lg hover:bg-cta-orange-hover transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download
                  </a>
                  <a
                    href={plugin.docsUrl}
                    className="px-4 py-2 bg-white border border-charcoal/20 text-charcoal rounded-lg hover:border-charcoal/40 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    Docs
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-sans font-bold text-charcoal mb-8 flex items-center gap-2">
          <Sparkles className="text-cta-orange" size={24} />
          Coming Soon
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/50 border border-charcoal/10">
            <h3 className="font-semibold text-charcoal mb-2">Adobe XD Plugin</h3>
            <p className="text-sm text-text-primary/60">Export optimized SVGs from Adobe XD</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/50 border border-charcoal/10">
            <h3 className="font-semibold text-charcoal mb-2">Sketch Plugin</h3>
            <p className="text-sm text-text-primary/60">Streamlined SVG export workflow</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/50 border border-charcoal/10">
            <h3 className="font-semibold text-charcoal mb-2">Unreal Engine</h3>
            <p className="text-sm text-text-primary/60">Material and texture importer</p>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto bg-white rounded-3xl shadow-sm my-8 mb-16">
        <h2 className="text-2xl font-sans font-bold text-charcoal mb-6 flex items-center gap-2">
          <FileCode className="text-accent-green" size={24} />
          Build Your Own Plugin
        </h2>
        <p className="text-text-primary/70 mb-6">
          Use our Plugin SDK to create custom integrations for your workflow. Full TypeScript support with comprehensive documentation.
        </p>

        <div className="bg-code-bg rounded-xl p-6 font-mono text-sm text-white/80 mb-6">
          <div className="text-accent-green mb-2">$ npm install @vectorcraft/plugin-sdk</div>
          <div className="text-text-primary/40 mt-4">// Initialize plugin</div>
          <div className="text-white">import {'{ VectorCraftPlugin }'} from '@vectorcraft/plugin-sdk';</div>
          <div className="text-white mt-2">const plugin = new VectorCraftPlugin({'{'}name: 'My Plugin'{'}'});</div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#"
            className="px-6 py-3 bg-cta-orange text-white rounded-lg hover:bg-cta-orange-hover transition-colors font-medium flex items-center gap-2"
          >
            <Code size={16} />
            View SDK Docs
          </a>
          <a
            href="#"
            className="px-6 py-3 bg-white border border-charcoal/20 text-charcoal rounded-lg hover:border-charcoal/40 transition-colors font-medium flex items-center gap-2"
          >
            Example Plugins
            <ExternalLink size={14} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default PluginsPage;
