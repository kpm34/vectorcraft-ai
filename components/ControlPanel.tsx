import React from 'react';
import { TextureMode, ModelQuality, GeneratedTextureSet } from '../types';
import { Wand2, Download, Layers, Circle, Box as BoxIcon, Aperture, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

interface ControlPanelProps {
  isGenerating: boolean;
  isUpscaling?: boolean;
  onGenerate: () => void;
  onUpscale?: () => void;
  geometryType: 'sphere' | 'box' | 'torus' | 'plane';
  setGeometryType: (t: 'sphere' | 'box' | 'torus' | 'plane') => void;
  currentTexture: GeneratedTextureSet | null;
  
  // Controlled State
  prompt: string;
  setPrompt: (s: string) => void;
  mode: TextureMode;
  setMode: (m: TextureMode) => void;
  quality: ModelQuality;
  setQuality: (q: ModelQuality) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  isGenerating, 
  isUpscaling = false,
  onGenerate, 
  onUpscale,
  geometryType, 
  setGeometryType,
  currentTexture,
  prompt,
  setPrompt,
  mode,
  setMode,
  quality,
  setQuality
}) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  const handleDownload = (type: 'albedo' | 'normal' | 'roughness') => {
    if (!currentTexture) return;
    const data = type === 'albedo' ? currentTexture.albedo : type === 'normal' ? currentTexture.normal : currentTexture.roughness;
    if (!data) return;

    const link = document.createElement('a');
    link.href = data;
    link.download = `${type}_map_${currentTexture.resolution || '1K'}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-96 bg-neutral-950 border-r border-neutral-800 flex flex-col h-full overflow-y-auto shrink-0 z-20">
      <div className="p-6 border-b border-neutral-800">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 flex items-center gap-2">
          <Aperture className="text-purple-500" />
          TextureGen AI
        </h1>
        <p className="text-neutral-400 text-xs mt-1">MatCap & Procedural PBR Generator</p>
      </div>

      <div className="p-6 space-y-8 flex-1">
        {/* Generation Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Generation Mode</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-900 rounded-lg">
              <button
                type="button"
                onClick={() => setMode(TextureMode.MATCAP)}
                className={`text-sm py-2 rounded-md transition-colors ${mode === TextureMode.MATCAP ? 'bg-neutral-800 text-white shadow' : 'text-neutral-500 hover:text-white'}`}
              >
                MatCap
              </button>
              <button
                type="button"
                onClick={() => setMode(TextureMode.PBR)}
                className={`text-sm py-2 rounded-md transition-colors ${mode === TextureMode.PBR ? 'bg-neutral-800 text-white shadow' : 'text-neutral-500 hover:text-white'}`}
              >
                PBR Texture
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === TextureMode.MATCAP ? "e.g., iridescent beetle shell, brushed copper..." : "e.g., cracked desert mud, sci-fi metal plating..."}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-sm text-white placeholder-neutral-500 focus:ring-2 focus:ring-purple-500 focus:outline-none min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium text-neutral-300">Quality Model</label>
             <select 
               value={quality} 
               onChange={(e) => setQuality(e.target.value as ModelQuality)}
               className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
             >
                <option value={ModelQuality.HIGH}>Gemini 3 Pro (High Quality)</option>
                <option value={ModelQuality.FAST}>Gemini 2.5 Flash (Fast)</option>
             </select>
          </div>

          <button
            type="submit"
            disabled={isGenerating || isUpscaling || !prompt.trim()}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
            {isGenerating ? "Dreaming..." : "Generate Texture"}
          </button>
        </form>

        {/* View Settings */}
        <div className="space-y-4 pt-6 border-t border-neutral-800">
           <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Preview Settings</h3>
           <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'sphere', icon: Circle },
                { id: 'box', icon: BoxIcon },
                { id: 'torus', icon: Aperture },
                { id: 'plane', icon: Layers }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setGeometryType(item.id as any)}
                  className={`p-3 rounded-lg flex items-center justify-center transition-colors ${geometryType === item.id ? 'bg-purple-600/20 text-purple-400 border border-purple-500/50' : 'bg-neutral-900 text-neutral-500 hover:bg-neutral-800'}`}
                >
                  <item.icon className="w-5 h-5" />
                </button>
              ))}
           </div>
        </div>

        {/* Action / Downloads */}
        {currentTexture && (
           <div className="space-y-4 pt-6 border-t border-neutral-800 animate-in fade-in slide-in-from-bottom-4">
             <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                Downloads
                <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                    {currentTexture.resolution || '1K'}
                </span>
             </h3>
             
             {/* Upscale Action */}
             {onUpscale && currentTexture.resolution !== '2K' && (
                <button
                  onClick={onUpscale}
                  disabled={isUpscaling}
                  className="w-full bg-gradient-to-r from-pink-900/50 to-purple-900/50 hover:from-pink-900/70 hover:to-purple-900/70 border border-purple-500/30 text-purple-100 p-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                   {isUpscaling ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                   {isUpscaling ? "Upscaling to 2K..." : "Enhance Material (Upscale to 2K)"}
                </button>
             )}
             
             {currentTexture.resolution === '2K' && (
                <div className="w-full bg-green-900/20 border border-green-500/30 text-green-200 p-2 rounded-lg flex items-center justify-center gap-2 text-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    High Resolution Active
                </div>
             )}

             <button onClick={() => handleDownload('albedo')} className="w-full flex items-center justify-between p-3 bg-neutral-900 hover:bg-neutral-800 rounded-lg group transition-colors">
                <span className="text-sm text-neutral-300">{currentTexture.mode === TextureMode.MATCAP ? 'MatCap Image' : 'Albedo Map'}</span>
                <Download className="w-4 h-4 text-neutral-500 group-hover:text-white" />
             </button>

             {currentTexture.mode === TextureMode.PBR && (
               <>
                <button onClick={() => handleDownload('normal')} className="w-full flex items-center justify-between p-3 bg-neutral-900 hover:bg-neutral-800 rounded-lg group transition-colors">
                    <span className="text-sm text-neutral-300">Normal Map</span>
                    <Download className="w-4 h-4 text-neutral-500 group-hover:text-white" />
                </button>
                <button onClick={() => handleDownload('roughness')} className="w-full flex items-center justify-between p-3 bg-neutral-900 hover:bg-neutral-800 rounded-lg group transition-colors">
                    <span className="text-sm text-neutral-300">Roughness Map</span>
                    <Download className="w-4 h-4 text-neutral-500 group-hover:text-white" />
                </button>
               </>
             )}
           </div>
        )}
      </div>
    </div>
  );
};