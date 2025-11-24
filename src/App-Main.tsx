import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import MatcapStudio from './App';
import SVGEditor from './App-SVG-Editor';
import DocsPage from './components/DocsPage';
import PluginsPage from './components/PluginsPage';
import { Palette, PenTool } from 'lucide-react';

type View = 'landing' | 'texture' | 'vector' | 'docs' | 'plugins';

export default function AppMain() {
  const [currentView, setCurrentView] = useState<View>('landing');

  // Enhanced logging for debugging
  const handleViewChange = (newView: View, source: string) => {
    console.log(`[App-Main] View change: ${currentView} → ${newView} (source: ${source})`);
    setCurrentView(newView);
  };

  // Persistent top navigation (only shown when not on landing)
  const renderNav = () => {
    if (currentView === 'landing') return null;

    return (
      <nav className="fixed top-0 w-full z-50 border-b border-charcoal/10 bg-warm-bg/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleViewChange('landing', 'top-nav-logo')}
              className="flex items-center gap-2"
            >
              <div className="w-3 h-3 bg-cta-orange rounded-sm rotate-45"></div>
              <span className="font-sans font-semibold text-charcoal tracking-tight">VectorCraft</span>
            </button>

            {/* Editor Switcher */}
            <div className="hidden md:flex items-center gap-2 bg-charcoal/5 rounded-lg p-1">
              <button
                onClick={() => handleViewChange('vector', 'top-nav-switcher')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  currentView === 'vector'
                    ? 'bg-white text-charcoal shadow-sm'
                    : 'text-text-primary/60 hover:text-text-primary'
                }`}
              >
                <PenTool size={14} />
                Vector Studio
              </button>
              <button
                onClick={() => handleViewChange('texture', 'top-nav-switcher')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  currentView === 'texture'
                    ? 'bg-white text-charcoal shadow-sm'
                    : 'text-text-primary/60 hover:text-text-primary'
                }`}
              >
                <Palette size={14} />
                Texture Studio
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage
            onNavigateToCanvas={() => handleViewChange('vector', 'landing-cta-vector')}
            onNavigateToTexture={() => handleViewChange('texture', 'landing-cta-texture')}
            onNavigateToDocs={() => handleViewChange('docs', 'landing-nav-docs')}
            onNavigateToPlugins={() => handleViewChange('plugins', 'landing-nav-plugins')}
          />
        );
      case 'texture':
        return (
          <div className={currentView !== 'landing' ? 'pt-16' : ''}>
            <MatcapStudio />
          </div>
        );
      case 'vector':
        return (
          <div className={currentView !== 'landing' ? 'pt-16' : ''}>
            <SVGEditor />
          </div>
        );
      case 'docs':
        return (
          <div className="pt-16">
            <DocsPage onNavigateHome={() => handleViewChange('landing', 'docs-nav-home')} />
          </div>
        );
      case 'plugins':
        return (
          <div className="pt-16">
            <PluginsPage onNavigateHome={() => handleViewChange('landing', 'plugins-nav-home')} />
          </div>
        );
      default:
        return (
          <LandingPage
            onNavigateToCanvas={() => handleViewChange('vector', 'landing-cta-vector-default')}
            onNavigateToTexture={() => handleViewChange('texture', 'landing-cta-texture-default')}
            onNavigateToDocs={() => handleViewChange('docs', 'landing-nav-docs-default')}
            onNavigateToPlugins={() => handleViewChange('plugins', 'landing-nav-plugins-default')}
          />
        );
    }
  };

  return (
    <>
      {renderNav()}
      {renderContent()}
    </>
  );
}
