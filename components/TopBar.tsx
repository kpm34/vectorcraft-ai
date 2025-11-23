import React from 'react';
import { Undo, Redo, Trash2 } from 'lucide-react';

interface TopBarProps {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo
}) => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-2 rounded-xl shadow-2xl flex items-center gap-2 z-50">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`p-2 rounded-lg transition-colors ${!canUndo ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
        title="Undo"
      >
        <Undo size={20} />
      </button>
      
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`p-2 rounded-lg transition-colors ${!canRedo ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
        title="Redo"
      >
        <Redo size={20} />
      </button>

      <div className="w-px h-6 bg-zinc-800 mx-1"></div>

      <button
        onClick={onClear}
        className="p-2 rounded-lg text-zinc-400 hover:bg-red-900/30 hover:text-red-400 transition-colors"
        title="Clear Canvas"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default TopBar;