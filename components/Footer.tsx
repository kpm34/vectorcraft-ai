import React from 'react';
import { Upload, Download, Code } from 'lucide-react';

interface FooterProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownload: () => void;
  onExportCode: () => void;
}

const Footer: React.FC<FooterProps> = ({ onUpload, onDownload, onExportCode }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800 px-6 py-3 flex justify-between items-center z-50">
      
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
        <h1 className="text-zinc-400 text-sm font-medium tracking-wide">
          VectorCraft AI
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer transition-colors text-sm font-medium">
          <Upload size={16} />
          <span>Import File</span>
          <input type="file" accept=".svg, .png, .jpg, .jpeg" onChange={onUpload} className="hidden" />
        </label>

        <div className="h-6 w-px bg-zinc-800"></div>

        <button 
           onClick={onExportCode}
           className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors text-sm font-medium"
        >
           <Code size={16} />
           <span>Code</span>
        </button>

        <button 
          onClick={onDownload} 
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors text-sm font-medium shadow-lg shadow-indigo-900/20"
        >
          <Download size={16} />
          <span>Export SVG</span>
        </button>
      </div>
    </div>
  );
};

export default Footer;