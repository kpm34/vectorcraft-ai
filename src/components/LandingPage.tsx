import React from 'react';
import {
  ArrowRight,
  Box,
  Terminal,
  PenTool,
  CheckCircle2,
  Triangle,
  Layers,
  Wand2,
  Download,
  Code,
  Zap,
  Grid3x3,
  FileImage,
  Palette,
  BookOpen,
  Plug,
  ChevronDown,
  Play
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToCanvas: () => void;
  onNavigateToTexture?: () => void;
  onNavigateToDocs?: () => void;
  onNavigateToPlugins?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToCanvas,
  onNavigateToTexture,
  onNavigateToDocs,
  onNavigateToPlugins
}) => {
  // State for Showcase Carousel
  const [activeShowcaseIndex, setActiveShowcaseIndex] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

  const showcaseItems = [
     { category: 'Fashion & Apparel', title: 'Denim Fabric', prompt: 'Blue denim fabric texture', image: '/assets/examples/blue_denim_fabric_texture_albedo.png', type: 'MatCap' },
     { category: 'Architecture', title: 'Mahogany Wood', prompt: 'Polished mahogany wood texture', image: '/assets/examples/polished_mahogany_wood_texture_albedo.png', type: 'MatCap' },
     { category: 'Automotive', title: 'Carbon Fiber', prompt: 'Carbon fiber hexagonal pattern', image: '/assets/examples/carbon_fiber_hexagonal_pattern_albedo.png', type: 'MatCap' },
     { category: 'Game Design', title: 'Chrome Metal', prompt: 'Polished chrome metal finish', image: '/assets/examples/chrome-texture.png', type: 'MatCap' },
     { category: 'Abstract Art', title: 'Tiger Pattern', prompt: 'Realistic tiger fur pattern', image: '/assets/examples/tiger-texture.png', type: 'PBR Albedo' }
  ];

  React.useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveShowcaseIndex((prev) => (prev + 1) % showcaseItems.length);
    }, 3000); // Cycle every 3 seconds
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div className="min-h-screen bg-warm-bg text-text-primary font-body selection:bg-cta-orange/20 overflow-x-hidden">

      {/* Navigation - Minimal with Docs & Plugins */}
      <nav className="fixed top-0 w-full z-50 border-b border-charcoal/10 bg-warm-bg/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cta-orange rounded-sm rotate-45"></div>
              <span className="font-sans font-semibold text-charcoal tracking-tight">VectorCraft</span>
            </div>

            {/* Navigation Links - Left Side */}
            <div className="hidden md:flex items-center gap-6">
              {onNavigateToDocs && (
                <button
                  onClick={onNavigateToDocs}
                  className="text-sm text-text-primary/60 hover:text-text-primary transition-colors flex items-center gap-1"
                >
                  <BookOpen size={14} />
                  Docs
                </button>
              )}
              {onNavigateToPlugins && (
                <button
                  onClick={onNavigateToPlugins}
                  className="text-sm text-text-primary/60 hover:text-text-primary transition-colors flex items-center gap-1"
                >
                  <Plug size={14} />
                  Plugins
                </button>
              )}
            </div>
          </div>

          {/* Right Side - Studio Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                console.log('Vector Studio clicked');
                onNavigateToCanvas();
              }}
              className="text-sm font-medium text-text-primary/60 hover:text-text-primary transition-colors"
            >
              Vector Studio
            </button>
            {onNavigateToTexture && (
              <button
                onClick={() => {
                  console.log('Texture Studio clicked');
                  onNavigateToTexture();
                }}
                className="text-sm font-medium text-text-primary/60 hover:text-text-primary transition-colors"
              >
                Texture Studio
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Minimalist */}
      <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto relative">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-cta-orange/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal/5 border border-charcoal/10 text-[10px] font-mono text-cta-orange uppercase tracking-wider">
              v2.0 Beta
            </div>

            <h1 className="text-6xl md:text-7xl font-sans font-bold text-charcoal tracking-tight leading-none">
              Vector Tools.<br/>
              <span className="text-text-primary/40">Texture Tools.</span>
            </h1>

            <p className="text-xl text-text-primary/70 max-w-md font-light">
              Clean SVGs and AI-generated textures for modern 3D pipelines.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => {
                  console.log('Hero CTA: Vector Studio clicked');
                  onNavigateToCanvas();
                }}
                className="group px-8 py-4 bg-cta-orange text-white rounded-xl font-medium hover:bg-cta-orange-hover transition-all flex items-center gap-2 shadow-lg shadow-cta-orange/25"
              >
                <PenTool size={16} />
                Vector Studio
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              {onNavigateToTexture && (
                <button
                  onClick={() => {
                    console.log('Hero CTA: Texture Studio clicked');
                    onNavigateToTexture();
                  }}
                  className="group px-8 py-4 bg-white border border-charcoal/20 text-charcoal rounded-xl font-medium hover:border-accent-teal hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Palette size={16} />
                  Texture Studio
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>

          {/* Hero Graphic: Vector Before/After */}
          <div className="relative h-auto w-full hidden md:flex items-center justify-center">
             <div className="bg-white rounded-2xl border border-charcoal/10 p-8 shadow-lg h-full flex flex-col justify-center relative overflow-hidden w-full max-w-md">
                 <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Grid3x3 size={120} />
                 </div>

                 <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative z-10">
                    {/* Before */}
                    <div className="text-center group">
                       <div className="w-32 h-32 bg-gray-50 rounded-xl flex items-center justify-center mb-4 border border-charcoal/5 relative overflow-hidden">
                          {/* Raster Image */}
                          <img 
                             src="/assets/examples/bear-raster.png" 
                             alt="Raster Input" 
                             className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity grayscale contrast-125"
                             onError={(e) => {
                                // Fallback to placeholder if image not found
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                             }}
                          />
                          {/* Fallback Placeholder (hidden by default if img loads) */}
                          <div className="hidden w-16 h-16 rounded-full bg-charcoal/80 blur-[2px] scale-95"></div>
                          
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm">
                             <span className="text-xs font-mono text-red-500 font-bold">RASTER PNG</span>
                          </div>
                       </div>
                       <p className="font-mono text-xs text-charcoal/40 uppercase tracking-widest">Original Sketch</p>
                    </div>

                    <ArrowRight className="text-charcoal/20 rotate-90 md:rotate-0" size={32} />

                    {/* After */}
                    <div className="text-center group">
                       <div className="w-32 h-32 bg-indigo-50/50 rounded-xl flex items-center justify-center mb-4 border border-indigo-100 relative overflow-hidden">
                          {/* Vector Image */}
                          <img 
                             src="/assets/examples/bear-vector.svg" 
                             alt="Vector Output" 
                             className="w-full h-full object-contain p-2 drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                             onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                             }}
                          />
                          {/* Fallback SVG (hidden by default) */}
                          <svg viewBox="0 0 100 100" className="hidden w-20 h-20 drop-shadow-md">
                             <circle cx="50" cy="50" r="40" className="fill-cta-orange" />
                             <path d="M30 50 L45 65 L70 35" className="stroke-white stroke-[8] fill-none stroke-linecap-round stroke-linejoin-round" />
                          </svg>
                          
                          <div className="absolute inset-0 border-2 border-indigo-500/10 rounded-xl pointer-events-none"></div>
                       </div>
                       <p className="font-mono text-xs text-accent-teal uppercase tracking-widest font-bold">Vector SVG</p>
                    </div>
                 </div>
                 
                 <div className="mt-8 text-center">
                    <p className="text-text-primary/60 mx-auto text-sm italic">
                       "Hand-drawn sketch to clean SVG in seconds."
                    </p>
                 </div>
             </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs font-mono text-text-primary/40 uppercase tracking-wider">Scroll</span>
          <ChevronDown size={20} className="text-text-primary/40" />
        </div>
      </section>

      {/* Showcase Section: See It In Action */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-sans font-bold text-charcoal mb-4">See It In Action</h2>
          <p className="text-text-primary/70">Generate professional textures for any industry</p>
        </div>

        <div className="max-w-6xl mx-auto">
           {/* Horizontal Feature Showcase */}
           <div className="grid lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-charcoal/10 shadow-xl overflow-hidden">
              
              {/* Left: Prompt Selector List */}
              <div className="lg:col-span-4 flex flex-col bg-gray-50/50 h-full border-r border-charcoal/5">
                 {showcaseItems.map((item, idx) => {
                    const isActive = idx === activeShowcaseIndex;

                    return (
                       <div 
                          key={idx} 
                          onClick={() => { setActiveShowcaseIndex(idx); setIsAutoPlaying(false); }}
                          className={`p-6 border-b border-charcoal/5 cursor-pointer transition-all hover:bg-white ${isActive ? 'bg-white border-l-4 border-l-cta-orange shadow-sm z-10' : 'border-l-4 border-l-transparent opacity-60 hover:opacity-100'}`}
                       >
                          <div className="flex items-center justify-between mb-1">
                             <h4 className={`font-semibold text-sm ${isActive ? 'text-charcoal' : 'text-text-primary/70'}`}>{item.category}</h4>
                             {isActive && <ArrowRight size={14} className="text-cta-orange" />}
                          </div>
                          <p className="text-xs font-mono text-text-primary/50 truncate">"{item.prompt}"</p>
                       </div>
                    );
                 })}
              </div>

              {/* Right: Large Preview Area */}
              <div className="lg:col-span-8 p-8 lg:p-12 flex flex-col items-center justify-center min-h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-100 via-white to-white">
                 
                 <div className="relative w-full max-w-md aspect-square">
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-cta-orange/5 blur-3xl rounded-full transform scale-110"></div>
                    
                    <div className="relative z-10 group">
                       {/* Main Image Card */}
                       <div key={activeShowcaseIndex} className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-charcoal/5 transform transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
                          <img 
                             src={showcaseItems[activeShowcaseIndex].image} 
                             alt={showcaseItems[activeShowcaseIndex].title} 
                             className="w-full h-full object-cover"
                             onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/222/fff?text=Generating...';
                             }}
                          />
                          
                          {/* Overlay Info */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-md border-t border-charcoal/5 translate-y-2 group-hover:translate-y-0 transition-transform">
                             <div className="flex items-center justify-between mb-2">
                                <div className="flex gap-2">
                                   <span className="px-2 py-1 rounded-md bg-charcoal text-white text-[10px] font-mono uppercase">{showcaseItems[activeShowcaseIndex].type}</span>
                                   <span className="px-2 py-1 rounded-md bg-charcoal/5 text-charcoal text-[10px] font-mono">1K</span>
                                </div>
                                <Download size={16} className="text-charcoal/40 hover:text-cta-orange cursor-pointer transition-colors" />
                             </div>
                             <p className="font-mono text-xs text-charcoal/60">Prompt used:</p>
                             <p className="text-sm font-medium text-charcoal">"{showcaseItems[activeShowcaseIndex].prompt}"</p>
                          </div>
                       </div>

                       {/* Floating '3D Sphere' Badge (Visual flair) */}
                       <div key={`badge-${activeShowcaseIndex}`} className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-full shadow-xl border border-charcoal/5 flex items-center justify-center p-1 animate-[bounce_4s_infinite]">
                          <div className="w-full h-full rounded-full overflow-hidden bg-charcoal/5 relative">
                             <img 
                                src={showcaseItems[activeShowcaseIndex].image} 
                                className="w-full h-full object-cover opacity-80"
                                style={{ filter: 'contrast(1.2) brightness(1.1)' }}
                             />
                             <div className="absolute inset-0 shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.2),inset_4px_4px_10px_rgba(255,255,255,0.5)] rounded-full pointer-events-none"></div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <p className="mt-8 text-sm text-text-primary/40 text-center max-w-sm">
                    *Actual output from our Gemini-powered texture engine.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* Features Grid - Minimal */}
      <section className="py-24 border-y border-charcoal/10 bg-charcoal/5">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
               {/* Card 1 */}
               <div className="p-8 rounded-2xl bg-white border border-charcoal/10 hover:border-cta-orange/30 transition-all duration-200 group shadow-sm hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5">
                  <PenTool className="text-cta-orange mb-6 group-hover:scale-110 transition-transform" size={32} />
                  <h3 className="text-xl font-sans font-semibold text-charcoal mb-2">Vector Studio</h3>
                  <p className="text-text-primary/60 text-sm">Draw, clean, and optimize vector paths.</p>
               </div>

               {/* Card 2 */}
               <div className="p-8 rounded-2xl bg-white border border-charcoal/10 hover:border-cta-orange/30 transition-all duration-200 group shadow-sm hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5">
                  <Box className="text-accent-teal mb-6 group-hover:scale-110 transition-transform" size={32} />
                  <h3 className="text-xl font-sans font-semibold text-charcoal mb-2">Texture Studio</h3>
                  <p className="text-text-primary/60 text-sm">Generate MatCaps & PBR maps via prompt.</p>
               </div>

               {/* Card 3 */}
               <div className="p-8 rounded-2xl bg-white border border-charcoal/10 hover:border-cta-orange/30 transition-all duration-200 group shadow-sm hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5">
                  <Terminal className="text-accent-green mb-6 group-hover:scale-110 transition-transform" size={32} />
                  <h3 className="text-xl font-sans font-semibold text-charcoal mb-2">Dev Tools</h3>
                  <p className="text-text-primary/60 text-sm">CLI & API for automated pipelines.</p>
               </div>
            </div>
         </div>
      </section>

      {/* The Workflow */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center">
           <h2 className="text-2xl font-sans font-bold text-charcoal mb-12">The Workflow</h2>

           <div className="flex flex-col md:flex-row items-center gap-6 text-text-primary/60 text-sm font-mono">
              <span className="px-6 py-3 border border-charcoal/20 bg-white rounded-lg shadow-sm">INPUT</span>
              <ArrowRight size={16} className="rotate-90 md:rotate-0 text-cta-orange" />
              <span className="px-6 py-3 border border-cta-orange/30 text-cta-orange bg-cta-orange/10 rounded-lg shadow-[0_0_20px_rgba(255,107,53,0.15)]">VECTORCRAFT</span>
              <ArrowRight size={16} className="rotate-90 md:rotate-0 text-cta-orange" />
              <span className="px-6 py-3 border border-charcoal/20 bg-white rounded-lg shadow-sm">ENGINE</span>
           </div>
        </div>
      </section>

      {/* CHAPTER 1: VECTOR STUDIO - Technical Deep Dive */}
      <section id="vector-studio" className="py-32 border-y border-charcoal/10 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cta-orange/10 border border-cta-orange/20 text-[10px] font-mono text-cta-orange uppercase tracking-wider mb-6">
                  Chapter 1
               </div>
               <h2 className="text-4xl md:text-5xl font-sans font-bold text-charcoal mb-4">Vector Studio</h2>
               <p className="text-text-primary/70 text-lg max-w-2xl mx-auto">
                  Production-ready SVG editing with AI-powered optimization and developer exports
               </p>
            </div>

            {/* Technical Features Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
               {/* Feature 1: Drawing Engine */}
               <div className="p-8 rounded-2xl bg-charcoal border border-charcoal shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                     <PenTool className="text-cta-orange" size={24} />
                     <h3 className="text-xl font-sans font-semibold text-white">Canvas Drawing Engine</h3>
                  </div>
                  <p className="text-white/70 mb-4">
                     Browser-native HTML5 Canvas rendering with sub-pixel precision.
                  </p>
                  <ul className="space-y-2 text-sm text-white/60">
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-cta-orange mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Pen Tool:</strong> Bézier curve support with node manipulation</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-cta-orange mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Shape Tools:</strong> Rectangle, circle, polygon primitives</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-cta-orange mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Live Preview:</strong> Real-time SVG path generation</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-cta-orange mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Undo/Redo:</strong> Full history stack with state snapshots</span>
                     </li>
                  </ul>
               </div>

               {/* Feature 2: AI Vectorization */}
               <div className="p-8 rounded-2xl bg-charcoal border border-charcoal shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                     <Wand2 className="text-accent-teal" size={24} />
                     <h3 className="text-xl font-semibold text-white">AI Vectorization</h3>
                  </div>
                  <p className="text-white/70 mb-4">
                     Gemini-powered raster-to-vector conversion with intelligent tracing.
                  </p>
                  <ul className="space-y-2 text-sm text-white/60">
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Smart Tracing:</strong> Edge detection with color quantization</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Path Simplification:</strong> Reduces nodes by up to 70%</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Logo Mode:</strong> Optimized for clean, geometric shapes</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Batch Processing:</strong> Convert entire folders at once</span>
                     </li>
                  </ul>
               </div>

               {/* Feature 3: SVG Optimization */}
               <div className="p-8 rounded-2xl bg-charcoal border border-charcoal shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                     <Zap className="text-cta-orange" size={24} />
                     <h3 className="text-xl font-semibold text-white">SVG Optimizer</h3>
                  </div>
                  <p className="text-white/70 mb-4">
                     SVGO-based compression with production-ready output.
                  </p>
                  <ul className="space-y-2 text-sm text-white/60">
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-cta-orange mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Removes Metadata:</strong> Strips Adobe/Figma artifacts</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-cta-orange mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Path Merging:</strong> Combines redundant paths</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-cta-orange mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Decimal Precision:</strong> Configurable coordinate rounding</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-cta-orange mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Size Reduction:</strong> Average 40-60% smaller files</span>
                     </li>
                  </ul>
               </div>

               {/* Feature 4: Icon Normalization */}
               <div className="p-8 rounded-2xl bg-charcoal border border-charcoal shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                     <Grid3x3 className="text-accent-green" size={24} />
                     <h3 className="text-xl font-semibold text-white">Icon Normalization</h3>
                  </div>
                  <p className="text-white/70 mb-4">
                     Standardize icon systems with automated viewBox and padding.
                  </p>
                  <ul className="space-y-2 text-sm text-white/60">
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-green mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">ViewBox Normalization:</strong> 24x24, 32x32, or custom grids</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-green mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Auto-Centering:</strong> Optical alignment with padding control</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-green mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Stroke Width Locking:</strong> Enforce 1px, 1.5px, or 2px strokes</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-green mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Batch Normalize:</strong> Process entire icon sets at once</span>
                     </li>
                  </ul>
               </div>
            </div>

            {/* Visual Demo */}
            <div className="bg-white/50 rounded-2xl aspect-video border border-charcoal/10 flex items-center justify-center relative overflow-hidden group shadow-sm">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cta-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <svg viewBox="0 0 100 100" className="w-32 h-32 stroke-cta-orange fill-none stroke-2 drop-shadow-lg">
                   <path d="M50 10 L90 90 L10 90 Z" />
                   <circle cx="50" cy="50" r="15" className="fill-cta-orange/10 stroke-cta-orange" />
                   {/* Nodes */}
                   <circle cx="50" cy="10" r="2" className="fill-charcoal stroke-none" />
                   <circle cx="90" cy="90" r="2" className="fill-charcoal stroke-none" />
                   <circle cx="10" cy="90" r="2" className="fill-charcoal stroke-none" />
               </svg>
            </div>
         </div>
      </section>

      {/* CHAPTER 2: TEXTURE STUDIO - Technical Deep Dive */}
      <section id="texture-studio" className="py-32 bg-charcoal/5">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal border border-white/10 text-[10px] font-mono text-accent-teal uppercase tracking-wider mb-6">
                  Chapter 2
               </div>
               <h2 className="text-4xl md:text-5xl font-bold text-charcoal font-sans mb-4">Texture Studio</h2>
               <p className="text-text-primary/70 text-lg max-w-2xl mx-auto">
                  AI-powered MatCap and PBR texture generation for 3D workflows
               </p>
            </div>

            {/* Technical Features Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
               {/* Feature 1: MatCap Generation */}
               <div className="p-8 rounded-2xl bg-charcoal border border-charcoal shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                     <Palette className="text-accent-teal" size={24} />
                     <h3 className="text-xl font-semibold text-white">MatCap Generator</h3>
                  </div>
                  <p className="text-white/70 mb-4">
                     Gemini-powered material capture textures for real-time 3D rendering.
                  </p>
                  <ul className="space-y-2 text-sm text-white/60">
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Prompt-Based:</strong> "Chrome", "Clay", "Velvet" - instant results</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Spherical Mapping:</strong> Optimized for sphere UV projection</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">1K/2K Resolution:</strong> Fast 1K generation, upscale to 2K</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Live Preview:</strong> Real-time 3D sphere preview with Three.js</span>
                     </li>
                  </ul>
               </div>

               {/* Feature 2: PBR Texture Generation */}
               <div className="p-8 rounded-2xl bg-charcoal border border-charcoal shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                     <Layers className="text-cta-orange" size={24} />
                     <h3 className="text-xl font-semibold text-white">PBR Texture Maps</h3>
                  </div>
                  <p className="text-white/70 mb-4">
                     Complete physically-based rendering texture sets from a single prompt.
                  </p>
                  <ul className="space-y-2 text-sm text-white/60">
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-cta-orange mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Albedo (Diffuse):</strong> Base color map via Gemini Image Gen</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-cta-orange mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Normal Map:</strong> Auto-generated from albedo with Sobel filtering</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-cta-orange mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Roughness Map:</strong> Luminance-based roughness extraction</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-cta-orange mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Seamless Tiling:</strong> Edge-blended for repeating textures</span>
                     </li>
                  </ul>
               </div>

               {/* Feature 3: 3D Preview Engine */}
               <div className="p-8 rounded-2xl bg-charcoal border border-charcoal shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                     <Box className="text-accent-teal" size={24} />
                     <h3 className="text-xl font-semibold text-white">Real-Time 3D Preview</h3>
                  </div>
                  <p className="text-white/70 mb-4">
                     Interactive Three.js viewport with camera controls and lighting.
                  </p>
                  <ul className="space-y-2 text-sm text-white/60">
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">React Three Fiber:</strong> Declarative 3D rendering with React</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Geometry Options:</strong> Sphere, box, torus, plane primitives</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Orbit Controls:</strong> 360° rotation and zoom navigation</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">HDR Lighting:</strong> Environment maps for realistic reflection</span>
                     </li>
                  </ul>
               </div>

               {/* Feature 4: Export & Integration */}
               <div className="p-8 rounded-2xl bg-charcoal border border-charcoal shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                     <Download className="text-accent-green" size={24} />
                     <h3 className="text-xl font-semibold text-white">Export Pipeline</h3>
                  </div>
                  <p className="text-white/70 mb-4">
                     One-click export to Blender, Unity, Unreal, and web frameworks.
                  </p>
                  <ul className="space-y-2 text-sm text-white/60">
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-green mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">PNG Export:</strong> Individual maps (albedo, normal, roughness)</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-green mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Blender Integration:</strong> Direct import to Shader Editor</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-green mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">GLB Packaging:</strong> Baked textures in 3D format</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-green mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Three.js Code:</strong> Copy-paste ready React components</span>
                     </li>
                  </ul>
               </div>
            </div>

            {/* Visual Demo */}
            <div className="bg-white/50 rounded-2xl aspect-square border border-charcoal/10 flex items-center justify-center relative shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-teal/5 to-transparent"></div>
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-charcoal/90 to-charcoal border border-charcoal shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent-teal/20 to-transparent mix-blend-overlay"></div>
                </div>
            </div>
         </div>
      </section>

      {/* CHAPTER 3: DEV TOOLS - Technical Deep Dive */}
      <section id="dev-tools" className="py-32 border-y border-charcoal/10 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal border border-white/10 text-[10px] font-mono text-accent-green uppercase tracking-wider mb-6">
                  Chapter 3
               </div>
               <h2 className="text-4xl md:text-5xl font-bold text-charcoal font-sans mb-4">Dev Tools</h2>
               <p className="text-text-primary/70 text-lg max-w-2xl mx-auto">
                  CLI, API, and plugins for seamless integration into your development workflow
               </p>
            </div>

            {/* Technical Features Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
               {/* Feature 1: CLI Tool */}
               <div className="p-8 rounded-2xl bg-charcoal border border-charcoal shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                     <Terminal className="text-accent-green" size={24} />
                     <h3 className="text-xl font-semibold text-white">Command-Line Interface</h3>
                  </div>
                  <p className="text-white/70 mb-4">
                     npm-installable CLI for batch processing and CI/CD integration.
                  </p>
                  <ul className="space-y-2 text-sm text-white/60">
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-green mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Batch Convert:</strong> <code className="text-cta-orange">vectorcraft convert ./assets/*.png</code></span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-green mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">SVG Optimize:</strong> <code className="text-cta-orange">vectorcraft optimize --recursive ./icons</code></span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-green mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Icon Normalize:</strong> <code className="text-cta-orange">vectorcraft normalize --viewbox 24</code></span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-green mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Watch Mode:</strong> Auto-process on file changes</span>
                     </li>
                  </ul>
               </div>

               {/* Feature 2: REST API */}
               <div className="p-8 rounded-2xl bg-charcoal border border-charcoal shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                     <Code className="text-accent-teal" size={24} />
                     <h3 className="text-xl font-semibold text-white">REST API</h3>
                  </div>
                  <p className="text-white/70 mb-4">
                     Vercel-hosted serverless endpoints for on-demand processing.
                  </p>
                  <ul className="space-y-2 text-sm text-white/60">
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">POST /api/vectorize:</strong> Raster to vector conversion</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">POST /api/optimize:</strong> SVG compression and cleanup</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">POST /api/texture:</strong> AI texture generation (MatCap/PBR)</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Rate Limiting:</strong> API key-based quotas</span>
                     </li>
                  </ul>
               </div>

               {/* Feature 3: Framework Plugins */}
               <div className="p-8 rounded-2xl bg-charcoal border border-charcoal shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                     <Plug className="text-accent-teal" size={24} />
                     <h3 className="text-xl font-semibold text-white">Framework Plugins</h3>
                  </div>
                  <p className="text-white/70 mb-4">
                     First-party integrations for popular design and 3D tools.
                  </p>
                  <ul className="space-y-2 text-sm text-white/60">
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Blender Add-on:</strong> Import SVG as curves, apply textures</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Figma Plugin:</strong> Export optimized SVGs from designs</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">VSCode Extension:</strong> Preview and edit SVGs inline</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-accent-teal mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Unity Package:</strong> Material importer for textures</span>
                     </li>
                  </ul>
               </div>

               {/* Feature 4: Code Exports */}
               <div className="p-8 rounded-2xl bg-charcoal border border-charcoal shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                     <FileImage className="text-cta-orange" size={24} />
                     <h3 className="text-xl font-semibold text-white">Developer Exports</h3>
                  </div>
                  <p className="text-white/70 mb-4">
                     Framework-ready code generation for modern web stacks.
                  </p>
                  <ul className="space-y-2 text-sm text-white/60">
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-cta-orange mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">React/Vue Components:</strong> TSX/JSX with TypeScript types</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-cta-orange mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Sprite Sheet:</strong> Combined SVG with symbol references</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-cta-orange mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">Icon Font:</strong> Webfont generation (.woff, .woff2)</span>
                     </li>
                     <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-cta-orange mt-0.5 flex-shrink-0" />
                        <span><strong className="text-white/90">JSON Manifest:</strong> Icon metadata for dynamic loading</span>
                     </li>
                  </ul>
               </div>
            </div>

            {/* Terminal Demo */}
            <div className="max-w-4xl mx-auto">
               <div className="bg-charcoal border border-white/10 rounded-xl p-6 font-mono text-sm text-text-primary/70 shadow-xl">
                  <div className="flex gap-2 mb-4 opacity-50">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="space-y-2">
                    <div><span className="text-accent-green">$</span> npm install -g vectorcraft-cli</div>
                    <div className="text-text-primary/40">✓ Installed vectorcraft@2.0.0</div>
                    <div className="mt-4"><span className="text-accent-green">$</span> vectorcraft convert ./assets/*.png --output ./svg</div>
                    <div className="text-text-primary/40">Processing 12 files...</div>
                    <div className="text-text-primary/40">✓ logo.png → logo.svg (3.2KB → 1.1KB)</div>
                    <div className="text-text-primary/40">✓ icon-home.png → icon-home.svg (1.8KB → 0.4KB)</div>
                    <div className="text-text-primary/40">✓ Done in 2.3s</div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 border-t border-charcoal/10 text-center bg-white">
         <h2 className="text-3xl font-sans font-bold text-charcoal mb-4">Ready to Create?</h2>
         <p className="text-text-primary/60 mb-8 max-w-md mx-auto">
           Start building production-ready assets with VectorCraft AI
         </p>
         <div className="flex flex-wrap items-center justify-center gap-4">
           <button
             onClick={onNavigateToCanvas}
             className="px-8 py-4 bg-cta-orange text-white rounded-xl font-medium hover:bg-cta-orange-hover transition-colors shadow-lg shadow-cta-orange/25 flex items-center gap-2"
           >
             <PenTool size={16} />
             Vector Studio
           </button>
           {onNavigateToTexture && (
             <button
               onClick={onNavigateToTexture}
               className="px-8 py-4 bg-white border border-charcoal/20 text-charcoal rounded-xl font-medium hover:border-accent-teal hover:shadow-lg transition-all flex items-center gap-2"
             >
               <Palette size={16} />
               Texture Studio
             </button>
           )}
         </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-charcoal/10 bg-warm-bg">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-cta-orange rounded-sm rotate-45"></div>
                <span className="font-sans font-semibold text-charcoal tracking-tight">VectorCraft</span>
              </div>
              <p className="text-sm text-text-primary/60">
                Lightweight vector workstation for logos, icons, and 3D textures.
              </p>
            </div>

            {/* Product Column */}
            <div>
              <h3 className="font-sans font-semibold text-charcoal mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={onNavigateToCanvas} className="text-text-primary/60 hover:text-cta-orange transition-colors">
                    Vector Studio
                  </button>
                </li>
                <li>
                  <button onClick={onNavigateToTexture} className="text-text-primary/60 hover:text-cta-orange transition-colors">
                    Texture Studio
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => document.getElementById('dev-tools')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-text-primary/60 hover:text-cta-orange transition-colors"
                  >
                    Dev Tools
                  </button>
                </li>
                <li>
                  <button onClick={onNavigateToPlugins} className="text-text-primary/60 hover:text-cta-orange transition-colors">
                    Plugins
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="font-sans font-semibold text-charcoal mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={onNavigateToDocs} className="text-text-primary/60 hover:text-cta-orange transition-colors">
                    Documentation
                  </button>
                </li>
                <li>
                  <a href="#" className="text-text-primary/60 hover:text-cta-orange transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-primary/60 hover:text-cta-orange transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-primary/60 hover:text-cta-orange transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h3 className="font-sans font-semibold text-charcoal mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-text-primary/60 hover:text-cta-orange transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-primary/60 hover:text-cta-orange transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-primary/60 hover:text-cta-orange transition-colors">
                    License
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-charcoal/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-text-primary/40">
              © 2025 VectorCraft AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-text-primary/40 hover:text-charcoal transition-colors">
                Twitter
              </a>
              <a href="#" className="text-xs text-text-primary/40 hover:text-charcoal transition-colors">
                GitHub
              </a>
              <a href="#" className="text-xs text-text-primary/40 hover:text-charcoal transition-colors">
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
