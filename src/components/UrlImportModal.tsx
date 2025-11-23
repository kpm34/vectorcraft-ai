import React, { useState } from 'react';
import { Globe, X, Loader2, CheckCircle2 } from 'lucide-react';

interface UrlImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (screenshotData: string, metadata: any) => void;
}

function UrlImportModal({ isOpen, onClose, onImport }: UrlImportModalProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullPage, setFullPage] = useState(true);
  const [width, setWidth] = useState(1440);
  const [height, setHeight] = useState(900);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL (including http:// or https://)');
      return;
    }

    setIsLoading(true);

    try {
      // Call API to capture screenshot
      const response = await fetch('http://localhost:3001/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          width,
          height,
          fullPage,
          waitUntil: 'networkidle',
          timeout: 30000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to capture screenshot');
      }

      const result = await response.json();

      // Pass screenshot data to parent
      onImport(result.screenshot, result.metadata);

      // Reset and close
      setUrl('');
      setIsLoading(false);
      onClose();
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  const exampleUrls = [
    'https://stripe.com',
    'https://linear.app',
    'https://vercel.com',
    'https://github.com'
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
              <Globe size={20} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Import from URL</h3>
              <p className="text-sm text-zinc-500">Capture any website as a reference layer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Website URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
          </div>

          {/* Quick Examples */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Quick examples:
            </label>
            <div className="flex flex-wrap gap-2">
              {exampleUrls.map((exampleUrl) => (
                <button
                  key={exampleUrl}
                  type="button"
                  onClick={() => setUrl(exampleUrl)}
                  className="px-3 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md transition-colors"
                  disabled={isLoading}
                >
                  {exampleUrl.replace('https://', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Width (px)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Height (px)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="fullPage"
              checked={fullPage}
              onChange={(e) => setFullPage(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-indigo-500 focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <label htmlFor="fullPage" className="text-sm text-zinc-300">
              Capture full page (scrollable height)
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
            <p className="text-sm text-indigo-300">
              <strong>💡 Tip:</strong> The screenshot will be imported as a locked background layer.
              You can trace over it, or use the crop tool to vectorize specific sections like logos and icons.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Capturing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Import Screenshot
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UrlImportModal;
