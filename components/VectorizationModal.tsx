import React, { useState } from 'react';
import { X, Image as ImageIcon, Layers, Zap } from 'lucide-react';
import { VectorizeConfig } from '../services/gemini';

interface VectorizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (config: VectorizeConfig) => void;
  fileName: string;
}

const VectorizationModal: React.FC<VectorizationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  fileName 
}) => {
  const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium');
  const [removeBackground, setRemoveBackground] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div className="flex items-center gap-2 text-indigo-400 font-medium">
            <ImageIcon size={18} />
            <span>Vectorize Image</span>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="text-sm text-zinc-400">
            Configuring settings for: <span className="text-zinc-200 font-medium">{fileName}</span>
          </div>

          {/* Complexity Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Layers size={16} />
              Detail Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setComplexity('low')}
                className={`p-3 rounded-lg border text-sm transition-all ${complexity === 'low' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-750'}`}
              >
                <div className="font-medium mb-1">Icon</div>
                <div className="text-[10px] opacity-70">Simple shapes, flat colors</div>
              </button>
              <button
                onClick={() => setComplexity('medium')}
                className={`p-3 rounded-lg border text-sm transition-all ${complexity === 'medium' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-750'}`}
              >
                <div className="font-medium mb-1">Art</div>
                <div className="text-[10px] opacity-70">Balanced detail</div>
              </button>
              <button
                onClick={() => setComplexity('high')}
                className={`p-3 rounded-lg border text-sm transition-all ${complexity === 'high' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-750'}`}
              >
                <div className="font-medium mb-1">Detailed</div>
                <div className="text-[10px] opacity-70">Rich paths & strokes</div>
              </button>
            </div>
          </div>

          {/* Background Toggle */}
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${removeBackground ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600'}`}>
                  {removeBackground && <Zap size={12} className="text-white" />}
                </div>
                <div className="text-sm text-zinc-300">Remove Background</div>
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={removeBackground} 
                onChange={(e) => setRemoveBackground(e.target.checked)} 
              />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={() => onConfirm({ complexity, removeBackground })}
              className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/20"
            >
              Start Vectorizing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VectorizationModal;