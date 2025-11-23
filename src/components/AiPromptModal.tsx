import React, { useState } from 'react';
import { X, Wand2, Loader2 } from 'lucide-react';

interface AiPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const AiPromptModal: React.FC<AiPromptModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div className="flex items-center gap-2 text-indigo-400 font-medium">
            <Wand2 size={18} />
            <span>Gemini Smart Edit</span>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-zinc-400 text-sm mb-4">
            Describe how you want to modify the SVG. You can ask to recolor, smooth paths, change shapes, or add artistic effects.
          </p>
          
          <form onSubmit={handleSubmit}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Change all red lines to blue', 'Make the lines smoother and thicker', 'Add a sunset gradient background'..."
              className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none placeholder:text-zinc-600"
              autoFocus
            />
            
            <div className="flex justify-end gap-3 mt-4">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                {isLoading ? 'Processing...' : 'Generate Edit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiPromptModal;
