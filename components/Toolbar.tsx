
import React from 'react';
import { 
  Pen, 
  Eraser, 
  Wand2, 
  Activity,
  Hand,
  Square,
  Circle,
  Triangle,
  Star,
  Minus,
  Shapes,
  RectangleHorizontal,
  MousePointer2,
  Lasso,
  Type as TypeIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  PaintBucket,
  Brush
} from 'lucide-react';
import { Tool, ShapeType } from '../types';

interface ToolbarProps {
  currentTool: Tool;
  setTool: (t: Tool) => void;
  currentShapeType: ShapeType;
  setShapeType: (s: ShapeType) => void;
  color: string;
  setColor: (c: string) => void;
  strokeWidth: number;
  setStrokeWidth: (w: number) => void;
  eraserSize: number;
  setEraserSize: (s: number) => void;
  smoothingLevel: number;
  setSmoothingLevel: (l: number) => void;
  
  // Text Props
  fontSize: number;
  setFontSize: (s: number) => void;
  fontFamily: string;
  setFontFamily: (f: string) => void;
  textAlign: 'start' | 'middle' | 'end';
  setTextAlign: (a: 'start' | 'middle' | 'end') => void;

  onAiEdit: () => void;
  onSmoothAll: () => void;
  isAiLoading: boolean;
  extractedColors?: string[];
}

const Toolbar: React.FC<ToolbarProps> = ({
  currentTool,
  setTool,
  currentShapeType,
  setShapeType,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  eraserSize,
  setEraserSize,
  smoothingLevel,
  setSmoothingLevel,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  textAlign,
  setTextAlign,
  onAiEdit,
  onSmoothAll,
  isAiLoading,
  extractedColors = []
}) => {
  
  const defaultColors = ['#000000', '#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];
  
  // Combine default and extracted unique colors, limiting total
  const allColors = Array.from(new Set([...extractedColors, ...defaultColors])).slice(0, 16);

  const shapes: { type: ShapeType; icon: React.ReactNode; label: string }[] = [
    { type: 'rectangle', icon: <RectangleHorizontal size={20} />, label: 'Rectangle' },
    { type: 'square', icon: <Square size={20} />, label: 'Square' },
    { type: 'ellipse', icon: <Circle size={20} className="scale-x-125" />, label: 'Ellipse' },
    { type: 'circle', icon: <Circle size={20} />, label: 'Circle' },
    { type: 'triangle', icon: <Triangle size={20} />, label: 'Triangle' },
    { type: 'star', icon: <Star size={20} />, label: 'Star' },
    { type: 'line', icon: <Minus size={20} />, label: 'Line' },
  ];
  
  const fontFamilies = [
    { value: 'sans-serif', label: 'Sans Serif' },
    { value: 'serif', label: 'Serif' },
    { value: 'monospace', label: 'Monospace' },
    { value: 'cursive', label: 'Cursive' },
    { value: 'fantasy', label: 'Fantasy' },
  ];

  // Show Color and Stroke properties only for Drawing tools (Pen/Shape/Text/Crayon/Fill)
  const showProperties = [Tool.PEN, Tool.SHAPE, Tool.TEXT, Tool.CRAYON, Tool.FILL].includes(currentTool);

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-3 rounded-2xl shadow-2xl flex flex-col gap-4 w-16 items-center z-50">
      
      {/* Tool Selection */}
      <div className="flex flex-col gap-2 pb-3 border-b border-zinc-800 w-full items-center">
        
        {/* Selection Tools */}
        <div className="relative group">
           <button
            onClick={() => setTool(Tool.SELECT)}
            className={`p-2 rounded-lg transition-colors ${currentTool === Tool.SELECT || currentTool === Tool.LASSO ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
            title="Selection Tools"
           >
             {currentTool === Tool.LASSO ? <Lasso size={20} /> : <MousePointer2 size={20} />}
           </button>
           <div className="absolute left-full top-0 pl-2 hidden group-hover:block z-50">
             <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg grid grid-cols-1 gap-1 w-28 shadow-xl">
               <button onClick={() => setTool(Tool.SELECT)} className={`p-2 rounded flex items-center gap-2 hover:bg-zinc-800 ${currentTool === Tool.SELECT ? 'text-indigo-400' : 'text-zinc-400'}`}>
                 <MousePointer2 size={16} /> <span className="text-xs">Box</span>
               </button>
               <button onClick={() => setTool(Tool.LASSO)} className={`p-2 rounded flex items-center gap-2 hover:bg-zinc-800 ${currentTool === Tool.LASSO ? 'text-indigo-400' : 'text-zinc-400'}`}>
                 <Lasso size={16} /> <span className="text-xs">Lasso</span>
               </button>
             </div>
           </div>
        </div>

        <button
          onClick={() => setTool(Tool.HAND)}
          className={`p-2 rounded-lg transition-colors ${currentTool === Tool.HAND ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
          title="Hand Tool (Pan)"
        >
          <Hand size={20} />
        </button>
        <button
          onClick={() => setTool(Tool.PEN)}
          className={`p-2 rounded-lg transition-colors ${currentTool === Tool.PEN ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
          title="Pen Tool"
        >
          <Pen size={20} />
        </button>
        
        {/* Crayon Tool */}
        <button
          onClick={() => setTool(Tool.CRAYON)}
          className={`p-2 rounded-lg transition-colors ${currentTool === Tool.CRAYON ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
          title="Crayon / Shading Tool"
        >
          <Brush size={20} />
        </button>

        {/* Fill Tool */}
        <button
          onClick={() => setTool(Tool.FILL)}
          className={`p-2 rounded-lg transition-colors ${currentTool === Tool.FILL ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
          title="Fill Tool (Bucket)"
        >
          <PaintBucket size={20} />
        </button>

        {/* Text Tool */}
        <button
          onClick={() => setTool(Tool.TEXT)}
          className={`p-2 rounded-lg transition-colors ${currentTool === Tool.TEXT ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
          title="Text Tool"
        >
          <TypeIcon size={20} />
        </button>

        {/* Eraser with dedicated Drawer */}
        <div className="relative group">
          <button
            onClick={() => setTool(Tool.ERASER)}
            className={`p-2 rounded-lg transition-colors ${currentTool === Tool.ERASER ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
            title="Eraser"
          >
            <Eraser size={20} />
          </button>
          {/* Eraser Size Drawer */}
          <div className="absolute left-full top-0 pl-2 hidden group-hover:block z-50">
             <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl w-72">
                <p className="text-xs text-zinc-400 mb-2 font-medium">Eraser Size</p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
                  <input 
                    type="range" 
                    min="5" 
                    max="200" 
                    value={eraserSize} 
                    onChange={(e) => setEraserSize(parseInt(e.target.value))}
                    className="flex-1 accent-indigo-500 h-1 cursor-pointer"
                  />
                  <div className="w-3 h-3 rounded-full bg-zinc-400"></div>
                </div>
                <div className="text-right text-[10px] text-zinc-500 font-mono">{eraserSize}px (SVG Units)</div>
             </div>
          </div>
        </div>

        {/* Shapes Tool */}
        <div className="relative group">
          <button
            onClick={() => setTool(Tool.SHAPE)}
            className={`p-2 rounded-lg transition-colors ${currentTool === Tool.SHAPE ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
            title="Shapes"
          >
            <Shapes size={20} />
          </button>
          {/* Shapes Popup */}
          <div className="absolute left-full top-0 pl-2 hidden group-hover:block z-50">
             <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg grid grid-cols-2 gap-1 w-32 shadow-xl">
                {shapes.map(shape => (
                  <button
                    key={shape.type}
                    onClick={() => {
                      setShapeType(shape.type);
                      setTool(Tool.SHAPE);
                    }}
                    className={`p-2 rounded hover:bg-zinc-800 flex items-center justify-center ${currentShapeType === shape.type && currentTool === Tool.SHAPE ? 'text-indigo-400 bg-zinc-800' : 'text-zinc-400'}`}
                    title={shape.label}
                  >
                    {shape.icon}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Properties */}
      {showProperties && (
        <div className="flex flex-col gap-2 pb-3 border-b border-zinc-800 w-full items-center animate-in fade-in duration-200">
          
          {/* Color Picker (Shared) */}
          <div className="relative group">
            <button className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800" title="Color">
              <div className="w-5 h-5 rounded-full border border-zinc-600" style={{ backgroundColor: color }}></div>
            </button>
            <div className="absolute left-full top-0 pl-2 hidden group-hover:block z-50">
              <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg grid grid-cols-2 gap-1 w-32 shadow-xl">
                {allColors.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setColor(c)} 
                    className="w-8 h-8 rounded-full border border-zinc-700 hover:scale-110 transition-transform"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded-full overflow-hidden cursor-pointer p-0 border-0 col-span-2 mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Text Specific Properties */}
          {currentTool === Tool.TEXT && (
             <div className="relative group flex items-center justify-center w-full">
                <button className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800" title="Text Properties">
                   <span className="font-serif text-sm">Aa</span>
                </button>
                <div className="absolute left-full top-0 pl-2 hidden group-hover:block z-50">
                   <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl w-48 flex flex-col gap-3">
                      
                      {/* Font Family */}
                      <div>
                        <p className="text-xs text-zinc-400 mb-1 font-medium">Font Family</p>
                        <select 
                          value={fontFamily} 
                          onChange={(e) => setFontFamily(e.target.value)}
                          className="w-full bg-zinc-800 text-xs text-white p-1.5 rounded border border-zinc-700 focus:outline-none focus:border-indigo-500"
                        >
                          {fontFamilies.map(f => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Font Size */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs text-zinc-400 font-medium">Size</p>
                          <span className="text-[10px] text-zinc-500">{fontSize}px</span>
                        </div>
                        <input 
                          type="range" 
                          min="8" 
                          max="100" 
                          value={fontSize} 
                          onChange={(e) => setFontSize(parseInt(e.target.value))}
                          className="w-full accent-indigo-500 h-1 cursor-pointer"
                        />
                      </div>

                      {/* Alignment */}
                      <div>
                         <p className="text-xs text-zinc-400 mb-1 font-medium">Align</p>
                         <div className="flex bg-zinc-800 rounded p-0.5">
                            <button onClick={() => setTextAlign('start')} className={`flex-1 p-1 rounded hover:bg-zinc-700 flex justify-center ${textAlign === 'start' ? 'text-indigo-400 bg-zinc-700' : 'text-zinc-500'}`}>
                              <AlignLeft size={14} />
                            </button>
                            <button onClick={() => setTextAlign('middle')} className={`flex-1 p-1 rounded hover:bg-zinc-700 flex justify-center ${textAlign === 'middle' ? 'text-indigo-400 bg-zinc-700' : 'text-zinc-500'}`}>
                              <AlignCenter size={14} />
                            </button>
                            <button onClick={() => setTextAlign('end')} className={`flex-1 p-1 rounded hover:bg-zinc-700 flex justify-center ${textAlign === 'end' ? 'text-indigo-400 bg-zinc-700' : 'text-zinc-500'}`}>
                              <AlignRight size={14} />
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* Stroke Width Slider (Drawing Only) */}
          {(currentTool === Tool.PEN || currentTool === Tool.SHAPE || currentTool === Tool.CRAYON) && (
            <div className="group relative flex items-center justify-center w-full">
               <button className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800" title="Stroke Width">
                  <div className="w-5 h-0.5 bg-current rounded-full" style={{ height: Math.min(strokeWidth, 12) / 2 }}></div>
               </button>
                <div className="absolute left-full top-0 pl-2 hidden group-hover:block z-50">
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl w-40">
                    <p className="text-xs text-zinc-400 mb-2 font-medium">Stroke Width</p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-0.5 w-2 bg-zinc-600"></div>
                      <input 
                        type="range" 
                        min="1" 
                        max="50" 
                        value={strokeWidth} 
                        onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                        className="flex-1 accent-indigo-500 h-1 cursor-pointer"
                      />
                      <div className="h-2 w-2 bg-zinc-400 rounded-full"></div>
                    </div>
                    <div className="text-right text-[10px] text-zinc-500 font-mono">{strokeWidth}px</div>
                  </div>
                </div>
            </div>
          )}
        </div>
      )}

       {/* AI / Magic */}
       <div className="flex flex-col gap-2 w-full items-center">
         {/* Smoothing Tool with Slider */}
         <div className="relative group">
           <button 
             onClick={onSmoothAll} 
             className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-blue-400" 
             title="Smooth Lines (Click to apply)"
           >
            <Activity size={20} />
           </button>
           <div className="absolute left-full top-0 pl-2 hidden group-hover:block z-50">
              <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl w-32">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-zinc-400">Smoothness</span>
                  <span className="text-xs text-indigo-400 font-mono">{smoothingLevel}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="20" 
                  step="0.5"
                  value={smoothingLevel} 
                  onChange={(e) => setSmoothingLevel(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 h-1"
                />
                <p className="text-[10px] text-zinc-500 mt-2">Drag to adjust, click icon to apply</p>
              </div>
           </div>
         </div>

         <button 
           onClick={onAiEdit} 
           className={`p-2 rounded-lg transition-all ${isAiLoading ? 'animate-pulse bg-indigo-900 text-indigo-300' : 'text-indigo-400 hover:bg-zinc-800 hover:text-indigo-300'}`} 
           title="Smart Edit (Gemini)"
           disabled={isAiLoading}
         >
          <Wand2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
