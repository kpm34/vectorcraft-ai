import React, { useState, useEffect } from 'react';
import { Viewer3D } from './components/Viewer3D';
import { ControlPanel } from './components/ControlPanel';
import { GeneratedTextureSet, GenerationConfig, TextureMode, ModelQuality } from './types';
import { generateTextureImage } from './services/geminiService';
import { generateNormalMap, generateRoughnessMap } from './services/imageProcessing';
import { Aperture, ArrowRight, Lock, Sparkles } from 'lucide-react';

export default function App() {
  const [hasApiKey, setHasApiKey] = useState(false);
  
  // Lifted state for "Live Preview" functionality
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<TextureMode>(TextureMode.MATCAP);
  const [quality, setQuality] = useState<ModelQuality>(ModelQuality.HIGH);
  const [geometryType, setGeometryType] = useState<'sphere' | 'box' | 'torus' | 'plane'>('sphere');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [currentTexture, setCurrentTexture] = useState<GeneratedTextureSet | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      } else {
        setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  const handleKeySelection = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const processMaps = async (albedo: string, mode: TextureMode, resolution: '1K' | '2K') => {
    let normal: string | undefined;
    let roughness: string | undefined;

    if (mode === TextureMode.PBR) {
      // Adjust strength slightly based on resolution for better finish
      const strength = resolution === '2K' ? 3.5 : 2.5; 
      const [nMap, rMap] = await Promise.all([
        generateNormalMap(albedo, strength),
        generateRoughnessMap(albedo, true)
      ]);
      normal = nMap;
      roughness = rMap;
    }
    return { normal, roughness };
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    try {
      // Default to 1K for initial generation to be snappy, unless user really wants high quality start
      // But keeping consistent with user choice.
      const resolution = '1K'; 
      const albedo = await generateTextureImage(prompt, mode, quality, resolution);
      const { normal, roughness } = await processMaps(albedo, mode, resolution);

      setCurrentTexture({
        id: crypto.randomUUID(),
        mode,
        prompt,
        albedo,
        normal,
        roughness,
        timestamp: Date.now(),
        resolution
      });

    } catch (e: any) {
      const msg = e.message || "Failed to generate texture.";
      setError(msg);
      if (msg.includes("Requested entity was not found") || msg.includes("403")) {
        setHasApiKey(false);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpscale = async () => {
    if (!currentTexture || !prompt) return;
    
    setIsUpscaling(true);
    setError(null);

    try {
      // Force 2K resolution
      const resolution = '2K';
      const albedo = await generateTextureImage(prompt, currentTexture.mode, ModelQuality.HIGH, resolution);
      const { normal, roughness } = await processMaps(albedo, currentTexture.mode, resolution);

      setCurrentTexture({
        ...currentTexture,
        id: crypto.randomUUID(),
        albedo,
        normal,
        roughness,
        resolution,
        timestamp: Date.now()
      });
    } catch (e: any) {
      setError("Upscale failed: " + e.message);
    } finally {
      setIsUpscaling(false);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-neutral-950 text-white p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-neutral-950 to-neutral-950 z-0" />
        <div className="z-10 max-w-lg text-center space-y-8">
           <div className="flex justify-center mb-6">
             <div className="relative">
               <div className="absolute inset-0 blur-xl bg-purple-500/30 rounded-full" />
               <Aperture className="w-20 h-20 text-purple-400 relative z-10" />
             </div>
           </div>
           
           <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
             TextureGen AI
           </h1>
           <p className="text-neutral-400 text-lg leading-relaxed">
             Create professional MatCaps and seamless PBR textures instantly using Gemini 3 Pro.
           </p>

           <div className="pt-8">
             <button 
               onClick={handleKeySelection}
               className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 bg-purple-600 rounded-full hover:bg-purple-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 focus:ring-offset-neutral-900"
             >
               <Sparkles className="w-5 h-5 mr-2" />
               Connect API Key
               <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover:translate-x-1 transition-transform" />
             </button>
           </div>
           
           <p className="text-xs text-neutral-600 pt-4">
             Requires a valid Google Cloud Project API Key with Gemini enabled.<br/>
             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-neutral-400">Billing Information</a>
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-black text-white font-sans overflow-hidden">
      <ControlPanel 
        isGenerating={isGenerating}
        isUpscaling={isUpscaling}
        onGenerate={handleGenerate}
        onUpscale={handleUpscale}
        geometryType={geometryType}
        setGeometryType={setGeometryType}
        currentTexture={currentTexture}
        // Passed state
        prompt={prompt}
        setPrompt={setPrompt}
        mode={mode}
        setMode={setMode}
        quality={quality}
        setQuality={setQuality}
      />

      <div className="flex-1 relative h-full">
        {/* Pass user selected mode if no texture exists yet, to allow previewing lighting setup */}
        <Viewer3D 
          albedo={currentTexture?.albedo}
          normal={currentTexture?.normal}
          roughness={currentTexture?.roughness}
          mode={currentTexture?.mode || mode}
          geometryType={geometryType}
        />

        {!currentTexture && !isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 p-8 rounded-2xl text-center max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-500">
              <Sparkles className="w-10 h-10 text-purple-500 mx-auto mb-4 opacity-80" />
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Imagine</h2>
              <p className="text-neutral-400">
                Enter a prompt in the sidebar to generate custom PBR textures or MatCaps.
              </p>
            </div>
          </div>
        )}

        {error && (
           <div className="absolute bottom-6 left-6 right-6 mx-auto max-w-lg bg-red-900/90 backdrop-blur-sm border border-red-700 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-5 z-50">
             <div className="flex items-center gap-3">
               <Lock className="w-5 h-5 text-red-300" />
               <span className="text-sm font-medium">{error}</span>
             </div>
             <button onClick={() => setError(null)} className="text-red-200 hover:text-white hover:bg-red-800/50 p-1 rounded-md transition-colors">✕</button>
           </div>
        )}
      </div>
    </div>
  );
}