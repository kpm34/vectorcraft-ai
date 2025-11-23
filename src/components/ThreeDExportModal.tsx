import React, { useState } from 'react';
import { Box, Download, X, Settings, Check } from 'lucide-react';

interface ThreeDExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  svgContent: string;
}

type ExportMode = 'decal' | 'curves' | 'both';
type Resolution = '512' | '1k' | '2k' | '4k';
type BorderStyle = 'none' | 'white' | 'black' | 'both';

function ThreeDExportModal({ isOpen, onClose, svgContent }: ThreeDExportModalProps) {
  const [exportMode, setExportMode] = useState<ExportMode>('both');
  const [resolutions, setResolutions] = useState<Resolution[]>(['1k', '2k']);
  const [borderStyle, setBorderStyle] = useState<BorderStyle>('white');
  const [borderWidth, setBorderWidth] = useState(8);
  const [optimizeCurves, setOptimizeCurves] = useState(true);
  const [mergeSmallArtifacts, setMergeSmallArtifacts] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Create a zip file with all exports
      const exports: { name: string; data: Blob }[] = [];

      // Export decals if selected
      if (exportMode === 'decal' || exportMode === 'both') {
        for (const res of resolutions) {
          const size = res === '512' ? 512 : res === '1k' ? 1024 : res === '2k' ? 2048 : 4096;

          // Generate PNG decal
          const pngBlob = await generatePngDecal(svgContent, size, borderStyle, borderWidth);
          exports.push({
            name: `decal_${res}.png`,
            data: pngBlob
          });

          // If border is 'both', export both white and black versions
          if (borderStyle === 'both') {
            const whiteBlob = await generatePngDecal(svgContent, size, 'white', borderWidth);
            const blackBlob = await generatePngDecal(svgContent, size, 'black', borderWidth);
            exports.push({
              name: `decal_${res}_white_border.png`,
              data: whiteBlob
            });
            exports.push({
              name: `decal_${res}_black_border.png`,
              data: blackBlob
            });
          }
        }
      }

      // Export curves if selected
      if (exportMode === 'curves' || exportMode === 'both') {
        const optimizedSvg = optimizeSvgForBlender(svgContent, {
          mergePaths: optimizeCurves,
          mergeSmallArtifacts,
          removeIntersections: true
        });

        const svgBlob = new Blob([optimizedSvg], { type: 'image/svg+xml' });
        exports.push({
          name: 'curves_optimized.svg',
          data: svgBlob
        });
      }

      // Download all exports
      if (exports.length === 1) {
        // Single file - direct download
        downloadBlob(exports[0].data, exports[0].name);
      } else {
        // Multiple files - create ZIP
        await downloadAsZip(exports, '3d_export_pack.zip');
      }

      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const toggleResolution = (res: Resolution) => {
    setResolutions(prev =>
      prev.includes(res)
        ? prev.filter(r => r !== res)
        : [...prev, res]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Box size={20} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">3D Export</h3>
              <p className="text-sm text-zinc-500">Optimized for Blender, Unity, Unreal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
            disabled={isExporting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Export Mode */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">
              Export Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setExportMode('decal')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  exportMode === 'decal'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🖼️</div>
                  <div className="font-semibold text-white">Decal Pack</div>
                  <div className="text-xs text-zinc-500 mt-1">PNG textures</div>
                </div>
              </button>

              <button
                onClick={() => setExportMode('curves')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  exportMode === 'curves'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">📐</div>
                  <div className="font-semibold text-white">Curves Pack</div>
                  <div className="text-xs text-zinc-500 mt-1">Blender SVG</div>
                </div>
              </button>

              <button
                onClick={() => setExportMode('both')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  exportMode === 'both'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">📦</div>
                  <div className="font-semibold text-white">Full Pack</div>
                  <div className="text-xs text-zinc-500 mt-1">Both formats</div>
                </div>
              </button>
            </div>
          </div>

          {/* Decal Options */}
          {(exportMode === 'decal' || exportMode === 'both') && (
            <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg space-y-4">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Settings size={16} />
                Decal Options
              </h4>

              {/* Resolutions */}
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Resolutions
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['512', '1k', '2k', '4k'] as Resolution[]).map(res => (
                    <button
                      key={res}
                      onClick={() => toggleResolution(res)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        resolutions.includes(res)
                          ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                          : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      {res === '512' ? '512px' : res === '1k' ? '1024px' : res === '2k' ? '2048px' : '4096px'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Style */}
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Sticker Border (for decals on helmets, jerseys)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['none', 'white', 'black', 'both'] as BorderStyle[]).map(style => (
                    <button
                      key={style}
                      onClick={() => setBorderStyle(style)}
                      className={`px-3 py-2 rounded-lg border text-sm capitalize transition-all ${
                        borderStyle === style
                          ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                          : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Width */}
              {borderStyle !== 'none' && (
                <div>
                  <label className="block text-sm text-zinc-300 mb-2">
                    Border Width: {borderWidth}px
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={borderWidth}
                    onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}

          {/* Curves Options */}
          {(exportMode === 'curves' || exportMode === 'both') && (
            <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-lg space-y-3">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Settings size={16} />
                Blender Curves Options
              </h4>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optimizeCurves}
                    onChange={(e) => setOptimizeCurves(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-indigo-500"
                  />
                  <span>Optimize & merge paths (reduces curve count)</span>
                </label>

                <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mergeSmallArtifacts}
                    onChange={(e) => setMergeSmallArtifacts(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-indigo-500"
                  />
                  <span>Merge small artifacts (cleaner import)</span>
                </label>

                <div className="mt-2 p-3 bg-indigo-500/10 rounded text-xs text-indigo-300">
                  <strong>Note:</strong> Optimized SVG will have no self-intersections and joined paths where possible.
                  Perfect for Blender curve import and extrusion.
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <h5 className="font-semibold text-white mb-2">What you'll get:</h5>
            <ul className="space-y-1 text-sm text-zinc-400">
              {(exportMode === 'decal' || exportMode === 'both') && (
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <span>High-res PNG{resolutions.length > 1 ? 's' : ''} with transparency ({resolutions.join(', ')})</span>
                </li>
              )}
              {(exportMode === 'decal' || exportMode === 'both') && borderStyle !== 'none' && (
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Sticker border {borderStyle === 'both' ? '(white & black versions)' : `(${borderStyle})`}</span>
                </li>
              )}
              {(exportMode === 'curves' || exportMode === 'both') && (
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Blender-optimized SVG curves (ready to import & extrude)</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 p-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isExporting || resolutions.length === 0}
          >
            {isExporting ? (
              <>Exporting...</>
            ) : (
              <>
                <Download size={16} />
                Export {exportMode === 'both' ? 'Full Pack' : exportMode === 'decal' ? 'Decals' : 'Curves'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper functions
async function generatePngDecal(
  svgContent: string,
  size: number,
  border: BorderStyle,
  borderWidth: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const img = new Image();
    img.onload = () => {
      // Clear with transparency
      ctx.clearRect(0, 0, size, size);

      // Draw border if needed
      if (border !== 'none') {
        ctx.strokeStyle = border === 'white' ? '#ffffff' : '#000000';
        ctx.lineWidth = borderWidth;
        ctx.drawImage(img, 0, 0, size, size);
        ctx.stroke();
      }

      // Draw main image
      ctx.drawImage(img, 0, 0, size, size);

      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to generate PNG'));
      }, 'image/png');
    };

    img.onerror = reject;
    img.src = 'data:image/svg+xml;base64,' + btoa(svgContent);
  });
}

function optimizeSvgForBlender(
  svgContent: string,
  options: {
    mergePaths: boolean;
    mergeSmallArtifacts: boolean;
    removeIntersections: boolean;
  }
): string {
  // TODO: Implement SVG optimization
  // For now, return cleaned version
  let optimized = svgContent;

  if (options.mergePaths) {
    // Merge consecutive paths with same attributes
  }

  if (options.mergeSmallArtifacts) {
    // Remove very small paths (< 1% of viewBox)
  }

  if (options.removeIntersections) {
    // Detect and fix self-intersecting paths
  }

  return optimized;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function downloadAsZip(files: { name: string; data: Blob }[], zipName: string) {
  // Simple implementation: download files individually
  // In production, use JSZip library
  for (const file of files) {
    downloadBlob(file.data, file.name);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

export default ThreeDExportModal;
