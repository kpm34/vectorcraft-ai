import React, { useState } from 'react';
import { X, Copy, Check, Code, FileCode, Braces, Sparkles, Play, Scissors, Package } from 'lucide-react';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  svgContent: string;
}

type TabType = 'svg' | 'jsx' | 'react' | 'animate' | 'reveal' | 'mask' | 'tokens';
type RevealStyle = 'line-draw' | 'fade-sequence' | 'scale-in' | 'wipe';
type MaskFormat = 'clip-path' | 'svg-mask' | 'svg-clip-path';

const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose, svgContent }) => {
  const [activeTab, setActiveTab] = useState<TabType>('svg');
  const [copied, setCopied] = useState(false);

  // Animation settings
  const [duration, setDuration] = useState(2);
  const [revealStyle, setRevealStyle] = useState<RevealStyle>('line-draw');
  const [maskFormat, setMaskFormat] = useState<MaskFormat>('clip-path');

  if (!isOpen) return null;

  const getAnimateCode = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const paths = doc.querySelectorAll('path');

    let animatedSvg = svgContent;
    let cssRules = '';

    paths.forEach((path, i) => {
      const pathLength = (path as SVGPathElement).getTotalLength?.() || 1000;
      const pathId = `animated-path-${i}`;

      // Add IDs and animation classes
      animatedSvg = animatedSvg.replace(
        path.outerHTML,
        path.outerHTML.replace('<path', `<path id="${pathId}" class="animated-stroke"`)
      );

      cssRules += `
#${pathId} {
  stroke-dasharray: ${pathLength};
  stroke-dashoffset: ${pathLength};
  animation: draw-${i} ${duration}s ease-out forwards;
  animation-delay: ${i * 0.1}s;
}

@keyframes draw-${i} {
  to {
    stroke-dashoffset: 0;
  }
}
`;
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Animated Vector Graphic</title>
  <style>
    body {
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #1a1a1a;
    }

    svg {
      max-width: 90vw;
      max-height: 90vh;
    }
    ${cssRules}
  </style>
</head>
<body>
  ${animatedSvg}

  <!-- Alternative: GSAP Animation (uncomment to use) -->
  <!--
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script>
    const paths = document.querySelectorAll('path');
    paths.forEach((path, i) => {
      const length = path.getTotalLength();
      gsap.fromTo(path,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: ${duration}, delay: i * 0.1, ease: "power2.out" }
      );
    });
  </script>
  -->
</body>
</html>`;
  };

  const getRevealCode = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');
    const children = svgEl ? Array.from(svgEl.children) : [];

    let cssRules = '';
    let animatedSvg = svgContent;

    switch (revealStyle) {
      case 'line-draw':
        children.forEach((child, i) => {
          if (child.tagName === 'path') {
            const path = child as SVGPathElement;
            const length = path.getTotalLength?.() || 1000;
            const id = `reveal-${i}`;

            animatedSvg = animatedSvg.replace(
              child.outerHTML,
              child.outerHTML.replace(child.tagName.toLowerCase(), `${child.tagName.toLowerCase()} id="${id}" class="reveal-stroke"`)
            );

            cssRules += `
#${id} {
  stroke-dasharray: ${length};
  stroke-dashoffset: ${length};
  animation: reveal-draw ${duration}s ease-out forwards ${i * 0.15}s;
}
`;
          }
        });

        cssRules += `
@keyframes reveal-draw {
  to { stroke-dashoffset: 0; }
}
`;
        break;

      case 'fade-sequence':
        children.forEach((child, i) => {
          const id = `fade-${i}`;
          animatedSvg = animatedSvg.replace(
            child.outerHTML,
            child.outerHTML.replace(child.tagName.toLowerCase(), `${child.tagName.toLowerCase()} id="${id}" class="fade-in"`)
          );

          cssRules += `
#${id} {
  opacity: 0;
  animation: fadeIn ${duration * 0.5}s ease-out forwards ${i * 0.2}s;
}
`;
        });

        cssRules += `
@keyframes fadeIn {
  to { opacity: 1; }
}
`;
        break;

      case 'scale-in':
        children.forEach((child, i) => {
          const id = `scale-${i}`;
          animatedSvg = animatedSvg.replace(
            child.outerHTML,
            child.outerHTML.replace(child.tagName.toLowerCase(), `${child.tagName.toLowerCase()} id="${id}" class="scale-in" style="transform-origin: center"`)
          );

          cssRules += `
#${id} {
  opacity: 0;
  transform: scale(0);
  animation: scaleIn ${duration * 0.6}s cubic-bezier(0.34, 1.56, 0.64, 1) forwards ${i * 0.1}s;
}
`;
        });

        cssRules += `
@keyframes scaleIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}
`;
        break;

      case 'wipe':
        animatedSvg = animatedSvg.replace('<svg', '<svg class="wipe-reveal"');
        cssRules = `
.wipe-reveal {
  clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
  animation: wipeIn ${duration}s ease-out forwards;
}

@keyframes wipeIn {
  to {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
}
`;
        break;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Logo Reveal - ${revealStyle}</title>
  <style>
    body {
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #0a0a0a;
    }

    svg {
      max-width: 600px;
      max-height: 600px;
    }
    ${cssRules}
  </style>
</head>
<body>
  ${animatedSvg}
</body>
</html>`;
  };

  const getMaskCode = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');

    if (!svgEl) return '/* Invalid SVG */';

    const viewBox = svgEl.getAttribute('viewBox') || '0 0 100 100';
    const paths = Array.from(doc.querySelectorAll('path, circle, rect, polygon, ellipse'));

    if (maskFormat === 'clip-path') {
      // CSS clip-path format
      let pathData = '';
      paths.forEach(el => {
        if (el.tagName === 'path') {
          pathData = el.getAttribute('d') || '';
        }
      });

      return `/* CSS Clip-Path */
.masked-element {
  clip-path: path('${pathData}');
}

/* Example Usage */
img.masked {
  clip-path: path('${pathData}');
  width: 400px;
  height: 400px;
  object-fit: cover;
}

<!-- HTML Example -->
<img src="your-image.jpg" class="masked" alt="Masked Image" />

/* Note: For better browser support, consider using an inline SVG mask */`;
    }

    if (maskFormat === 'svg-mask') {
      // SVG <mask> element
      const maskContent = paths.map(el => el.outerHTML).join('\n    ');

      return `<!-- SVG Mask Definition -->
<svg width="0" height="0" style="position: absolute;">
  <defs>
    <mask id="custom-mask" maskUnits="objectBoundingBox">
      <rect width="100%" height="100%" fill="white"/>
      ${maskContent}
    </mask>
  </defs>
</svg>

<!-- Apply mask to any element -->
<img src="your-image.jpg" style="mask: url(#custom-mask); -webkit-mask: url(#custom-mask);" />

<!-- Or use in CSS -->
<style>
  .masked-image {
    mask: url(#custom-mask);
    -webkit-mask: url(#custom-mask);
    mask-size: cover;
    -webkit-mask-size: cover;
  }
</style>`;
    }

    if (maskFormat === 'svg-clip-path') {
      // SVG <clipPath> element
      const clipContent = paths.map(el => el.outerHTML).join('\n    ');

      return `<!-- SVG Clip-Path Definition -->
<svg width="0" height="0" style="position: absolute;">
  <defs>
    <clipPath id="custom-clip" clipPathUnits="objectBoundingBox">
      ${clipContent}
    </clipPath>
  </defs>
</svg>

<!-- Apply clip-path to image -->
<svg viewBox="${viewBox}" width="400" height="400">
  <image href="your-image.jpg" width="100%" height="100%" clip-path="url(#custom-clip)" />
</svg>

<!-- Or apply to any SVG element -->
<svg viewBox="${viewBox}" width="400" height="400">
  <rect width="100%" height="100%" fill="url(#pattern)" clip-path="url(#custom-clip)" />
</svg>`;
    }

    return '/* Select a mask format above */';
  };

  const getTokensCode = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');

    if (!svgEl) return '{}';

    const viewBox = svgEl.getAttribute('viewBox') || '0 0 1920 1080';
    const paths = Array.from(doc.querySelectorAll('path'));
    const texts = Array.from(doc.querySelectorAll('text'));

    // Extract colors
    const colors = new Set<string>();
    [...paths, ...texts].forEach(el => {
      const stroke = el.getAttribute('stroke');
      const fill = el.getAttribute('fill');
      if (stroke && stroke !== 'none') colors.add(stroke);
      if (fill && fill !== 'none') colors.add(fill);
    });

    const tokens = {
      meta: {
        name: 'VectorCraft Design System',
        version: '1.0.0',
        generated: new Date().toISOString(),
      },
      viewBox: viewBox,
      colors: {
        palette: Array.from(colors).reduce((acc, color, i) => {
          acc[`color-${i + 1}`] = color;
          return acc;
        }, {} as Record<string, string>)
      },
      icons: paths.map((path, i) => ({
        id: `icon-${i + 1}`,
        name: `Icon ${i + 1}`,
        path: path.getAttribute('d'),
        stroke: path.getAttribute('stroke') || 'currentColor',
        strokeWidth: path.getAttribute('stroke-width') || '2',
        fill: path.getAttribute('fill') || 'none',
      })),
      texts: texts.map((text, i) => ({
        id: `text-${i + 1}`,
        content: text.textContent,
        fontSize: text.getAttribute('font-size') || '16',
        fontFamily: text.getAttribute('font-family') || 'sans-serif',
        fill: text.getAttribute('fill') || '#000000',
      }))
    };

    // Generate preview HTML
    const previewHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Design System Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0a0a0a;
      color: #e4e4e7;
      padding: 2rem;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { font-size: 2rem; margin-bottom: 2rem; color: #a78bfa; }
    h2 { font-size: 1.5rem; margin: 2rem 0 1rem; color: #c4b5fd; }

    .color-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 3rem;
    }
    .color-card {
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
    }
    .color-swatch {
      width: 100%;
      height: 80px;
      border-radius: 6px;
      margin-bottom: 0.5rem;
      border: 1px solid #3f3f46;
    }
    .color-name { font-size: 0.875rem; color: #a1a1aa; }
    .color-value { font-family: monospace; font-size: 0.75rem; color: #71717a; }

    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 1.5rem;
    }
    .icon-card {
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 8px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }
    .icon-card svg {
      width: 64px;
      height: 64px;
    }
    .icon-name {
      font-size: 0.75rem;
      color: #a1a1aa;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎨 Design System Preview</h1>

    <h2>Color Palette</h2>
    <div class="color-grid">
${Array.from(colors).map((color, i) => `      <div class="color-card">
        <div class="color-swatch" style="background: ${color};"></div>
        <div class="color-name">Color ${i + 1}</div>
        <div class="color-value">${color}</div>
      </div>`).join('\n')}
    </div>

    <h2>Icons (${paths.length})</h2>
    <div class="icon-grid">
${paths.map((path, i) => `      <div class="icon-card">
        <svg viewBox="${viewBox}" fill="none" stroke="currentColor">
          ${path.outerHTML}
        </svg>
        <div class="icon-name">Icon ${i + 1}</div>
      </div>`).join('\n')}
    </div>
  </div>
</body>
</html>`;

    return `// Design Tokens (tokens.json)
${JSON.stringify(tokens, null, 2)}

/*
 * Save the HTML below as preview.html to see your design system
 */

/*
${previewHTML}
*/`;
  };

  const getFormattedCode = () => {
    let code = svgContent.trim();

    // Handle new tabs
    if (activeTab === 'animate') return getAnimateCode();
    if (activeTab === 'reveal') return getRevealCode();
    if (activeTab === 'mask') return getMaskCode();
    if (activeTab === 'tokens') return getTokensCode();

    // Original tabs (SVG, JSX, React)
    if (activeTab === 'jsx' || activeTab === 'react') {
      code = code
        .replace(/class="/g, 'className="')
        .replace(/stroke-width="/g, 'strokeWidth="')
        .replace(/stroke-linecap="/g, 'strokeLinecap="')
        .replace(/stroke-linejoin="/g, 'strokeLinejoin="')
        .replace(/fill-rule="/g, 'fillRule="')
        .replace(/clip-rule="/g, 'clipRule="')
        .replace(/stroke-miterlimit="/g, 'strokeMiterlimit="')
        .replace(/xmlns:xlink="/g, 'xmlnsXlink="');
    }

    if (activeTab === 'react') {
      return `import React from 'react';\n\nconst VectorGraphic = (props) => (\n  ${code.replace('<svg', '<svg {...props}')}\n);\n\nexport default VectorGraphic;`;
    }

    return code;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFormattedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabClass = (tab: TabType) =>
    `flex-1 pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`;

  const activeBar = (
    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full" />
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-3xl shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div className="flex items-center gap-2 text-zinc-200 font-medium">
            <Code size={18} />
            <span>Export Code</span>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-4 pt-4 border-b border-zinc-800 flex gap-2 overflow-x-auto">
          <button onClick={() => setActiveTab('svg')} className={tabClass('svg')}>
            <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
              <Code size={14} /> SVG
            </div>
            {activeTab === 'svg' && activeBar}
          </button>
          <button onClick={() => setActiveTab('jsx')} className={tabClass('jsx')}>
            <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
              <FileCode size={14} /> JSX
            </div>
            {activeTab === 'jsx' && activeBar}
          </button>
          <button onClick={() => setActiveTab('react')} className={tabClass('react')}>
            <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
              <Braces size={14} /> React
            </div>
            {activeTab === 'react' && activeBar}
          </button>
          <button onClick={() => setActiveTab('animate')} className={tabClass('animate')}>
            <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
              <Sparkles size={14} /> Animate
            </div>
            {activeTab === 'animate' && activeBar}
          </button>
          <button onClick={() => setActiveTab('reveal')} className={tabClass('reveal')}>
            <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
              <Play size={14} /> Reveal
            </div>
            {activeTab === 'reveal' && activeBar}
          </button>
          <button onClick={() => setActiveTab('mask')} className={tabClass('mask')}>
            <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
              <Scissors size={14} /> Mask
            </div>
            {activeTab === 'mask' && activeBar}
          </button>
          <button onClick={() => setActiveTab('tokens')} className={tabClass('tokens')}>
            <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
              <Package size={14} /> Tokens
            </div>
            {activeTab === 'tokens' && activeBar}
          </button>
        </div>

        {/* Settings Panel (for animate & reveal tabs) */}
        {(activeTab === 'animate' || activeTab === 'reveal') && (
          <div className="px-6 py-3 bg-zinc-950/50 border-b border-zinc-800 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-3">
              <label className="text-zinc-400">Duration:</label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-32"
              />
              <span className="text-zinc-300 font-mono w-12">{duration}s</span>
            </div>

            {activeTab === 'reveal' && (
              <div className="flex items-center gap-3">
                <label className="text-zinc-400">Style:</label>
                <select
                  value={revealStyle}
                  onChange={(e) => setRevealStyle(e.target.value as RevealStyle)}
                  className="bg-zinc-800 text-zinc-300 border border-zinc-700 rounded px-2 py-1 text-xs"
                >
                  <option value="line-draw">Line Draw</option>
                  <option value="fade-sequence">Fade Sequence</option>
                  <option value="scale-in">Scale In</option>
                  <option value="wipe">Wipe</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Settings Panel (for mask tab) */}
        {activeTab === 'mask' && (
          <div className="px-6 py-3 bg-zinc-950/50 border-b border-zinc-800 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-3">
              <label className="text-zinc-400">Format:</label>
              <select
                value={maskFormat}
                onChange={(e) => setMaskFormat(e.target.value as MaskFormat)}
                className="bg-zinc-800 text-zinc-300 border border-zinc-700 rounded px-3 py-1.5 text-xs"
              >
                <option value="clip-path">CSS clip-path</option>
                <option value="svg-mask">SVG &lt;mask&gt;</option>
                <option value="svg-clip-path">SVG &lt;clipPath&gt;</option>
              </select>
            </div>
          </div>
        )}

        {/* Code Display */}
        <div className="p-0 flex-1 overflow-hidden relative group">
          <textarea
            readOnly
            value={getFormattedCode()}
            className="w-full h-full bg-zinc-950 p-4 text-xs font-mono text-zinc-400 focus:outline-none resize-none"
            spellCheck={false}
          />

          <div className="absolute top-4 right-4">
             <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-lg text-xs font-medium"
             >
               {copied ? <Check size={14} /> : <Copy size={14} />}
               {copied ? 'Copied!' : 'Copy Code'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeExportModal;
