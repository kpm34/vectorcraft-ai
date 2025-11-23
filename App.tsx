
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Toolbar from './components/Toolbar';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import AiPromptModal from './components/AiPromptModal';
import VectorizationModal from './components/VectorizationModal';
import CodeExportModal from './components/CodeExportModal';
import UrlImportModal from './components/UrlImportModal';
import LandingPage from './components/LandingPage';
import { Tool, PathData, Point, ShapeType } from './types';
import { 
  pointsToLinedPath, 
  pointsToSmoothedPath, 
  parseSvgToPaths, 
  getShapePoints, 
  getDistanceToPath, 
  isPathInRect, 
  isPointInPolygon, 
  getBoundingBox, 
  eraseFromPath, 
  getTextDimensions,
  getCombinedBoundingBox,
  rotatePoint,
  scalePoint
} from './utils/geometry';
import { processSvgWithAi, bitmapToSvg, VectorizeConfig } from './services/gemini';
import { Upload, Copy, Trash2, RotateCw, FlipHorizontal } from 'lucide-react';

function App() {
  // View State
  const [showLanding, setShowLanding] = useState<boolean>(true);

  const [tool, setTool] = useState<Tool>(Tool.SELECT);
  const [shapeType, setShapeType] = useState<ShapeType>('rectangle');
  const [color, setColor] = useState<string>('#000000'); // Default to black for light canvas
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [eraserSize, setEraserSize] = useState<number>(40); // Default eraser size (increased for better visibility)
  const [smoothingLevel, setSmoothingLevel] = useState<number>(3); // Default smoothing intensity
  
  // Text Properties
  const [fontSize, setFontSize] = useState<number>(24);
  const [fontFamily, setFontFamily] = useState<string>('sans-serif');
  const [textAlign, setTextAlign] = useState<'start' | 'middle' | 'end'>('start');
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  
  const [paths, setPaths] = useState<PathData[]>([]);
  const [undoStack, setUndoStack] = useState<PathData[][]>([]);
  const [redoStack, setRedoStack] = useState<PathData[][]>([]);
  const [backgroundSvg, setBackgroundSvg] = useState<string>('');
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  
  // Drawing State
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const shapeStartRef = useRef<Point | null>(null);
  
  // Selection & Transform State
  const [selectedPathIds, setSelectedPathIds] = useState<Set<string>>(new Set());
  const [selectionRect, setSelectionRect] = useState<{ start: Point; current: Point } | null>(null);
  const [lassoPoints, setLassoPoints] = useState<Point[]>([]);
  
  // Transformation Logic
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale' | 'none'>('none');
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const transformStartRef = useRef<Point | null>(null); // Mouse start position
  const originalPathsRef = useRef<PathData[]>([]); // Snapshot of paths at start of drag
  const selectionBoundsRef = useRef<{x:number, y:number, w:number, h:number} | null>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Panning State
  const [isPanning, setIsPanning] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const viewBoxStartRef = useRef({ x: 0, y: 0, w: 1920, h: 1080 });

  // Cursor State for Eraser
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // AI State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [loadingText, setLoadingText] = useState('Processing...');

  // Vectorization Modal State
  const [isVecModalOpen, setIsVecModalOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // Code Export State
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // URL Import State
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);

  // Viewport / Zoom State
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 1920, h: 1080 });

  const svgRef = useRef<SVGSVGElement>(null);
  const CANVAS_BG_COLOR = '#f3f4f6'; // Matches bg-gray-100

  // --- Derived State ---
  useEffect(() => {
    const colors = new Set(paths.map(p => p.color));
    // Filter out eraser color/bg color if present
    if (colors.has(CANVAS_BG_COLOR)) colors.delete(CANVAS_BG_COLOR);
    setExtractedColors(Array.from(colors));
  }, [paths]);

  // --- Logic Helpers ---

  const saveStateToUndo = useCallback(() => {
    setUndoStack(prev => [...prev, paths]);
    setRedoStack([]); // Clear redo stack when new action is taken
  }, [paths]);

  const duplicateSelected = useCallback(() => {
    if (selectedPathIds.size === 0) return;

    saveStateToUndo();

    const newPaths: PathData[] = [];
    const newSelectedIds = new Set<string>();
    const offset = 20 * (viewBox.w / (svgRef.current?.clientWidth || 1000)); // Dynamic offset based on zoom

    paths.forEach(p => {
      if (selectedPathIds.has(p.id)) {
        const newId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
        const newPoints = p.points.map(pt => ({ x: pt.x + offset, y: pt.y + offset }));

        newPaths.push({
          ...p,
          id: newId,
          points: newPoints
        });
        newSelectedIds.add(newId);
      }
    });

    setPaths(prev => [...prev, ...newPaths]);
    setSelectedPathIds(newSelectedIds);
    setContextMenu(null);
  }, [paths, selectedPathIds, saveStateToUndo, viewBox.w]);

  const flipSelected = useCallback(() => {
    if (selectedPathIds.size === 0) return;

    saveStateToUndo();

    // Get the combined bounding box of all selected items
    const selectedPaths = paths.filter(p => selectedPathIds.has(p.id));
    const bounds = getCombinedBoundingBox(selectedPaths);

    // Calculate the center X coordinate
    const centerX = bounds.x + bounds.w / 2;
    const center = { x: centerX, y: bounds.y + bounds.h / 2 };

    // Flip all selected paths horizontally (scale X by -1)
    setPaths(prev => prev.map(p => {
      if (selectedPathIds.has(p.id)) {
        return {
          ...p,
          points: p.points.map(pt => scalePoint(pt, center, -1, 1))
        };
      }
      return p;
    }));

    setContextMenu(null);
  }, [paths, selectedPathIds, saveStateToUndo]);

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if we are typing in the textarea
      if (editingTextId) return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedPathIds.size > 0) {
        saveStateToUndo();
        setPaths(prev => prev.filter(p => !selectedPathIds.has(p.id)));
        setSelectedPathIds(new Set());
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        duplicateSelected();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPathIds, paths, editingTextId, saveStateToUndo, duplicateSelected]);


  // --- Selection Property Sync ---
  // When toolbar properties change, update the selected paths
  useEffect(() => {
    if (selectedPathIds.size > 0 && transformMode === 'none') {
      setPaths(prev => prev.map(p => {
        if (selectedPathIds.has(p.id)) {
          if (p.type === 'text') {
             return { ...p, fontSize, fontFamily, align: textAlign, color };
          } else {
             // For shapes/lines, update stroke properties
             return { 
               ...p, 
               color, 
               strokeWidth, 
               smoothing: smoothingLevel,
               style: tool === Tool.CRAYON ? 'crayon' : tool === Tool.PEN ? 'solid' : p.style
             };
          }
        }
        return p;
      }));
    }
  }, [strokeWidth, color, fontSize, fontFamily, textAlign, smoothingLevel, selectedPathIds, transformMode]);


  // --- Zoom / Wheel Handling ---

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (!svgRef.current) return;

    const { deltaY, clientX, clientY } = e;
    const svgRect = svgRef.current.getBoundingClientRect();
    
    // Limit max/min zoom if desired, but infinite is fine for now
    // deltaY > 0 is zooming out, < 0 is zooming in
    const zoomIntensity = 0.001; // Sensitivity
    // Using exponential zoom for smoothness
    const zoomFactor = Math.exp(deltaY * zoomIntensity);
    
    setViewBox(prev => {
      // Cursor position relative to the SVG element in pixels
      const dx = clientX - svgRect.left;
      const dy = clientY - svgRect.top;

      // Cursor position as a percentage of the displayed size
      // We use the rect size because that's what the mouse is interacting with
      const qx = dx / svgRect.width;
      const qy = dy / svgRect.height;

      // Calculate new dimensions
      const newW = prev.w * zoomFactor;
      const newH = prev.h * zoomFactor;

      // Calculate new XY to keep the cursor at the same relative position in the ViewBox
      const newX = prev.x + (prev.w - newW) * qx;
      const newY = prev.y + (prev.h - newH) * qy;

      return { x: newX, y: newY, w: newW, h: newH };
    });
  }, []);

  // Attach non-passive listener for wheel to prevent browser zoom/scroll
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    
    svg.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      svg.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // --- Utility: Coordinate Mapping ---

  const getCoordinates = (e: React.PointerEvent | React.MouseEvent): Point => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d
    };
  };
  
  const svgToScreen = (point: Point): Point => {
     if (!svgRef.current) return { x: 0, y: 0 };
     const CTM = svgRef.current.getScreenCTM();
     if (!CTM) return { x: 0, y: 0 };
     return {
        x: point.x * CTM.a + CTM.e,
        y: point.y * CTM.d + CTM.f
     };
  };

  const getZoomScale = () => {
    if (!svgRef.current) return 1;
    const rect = svgRef.current.getBoundingClientRect();
    return rect.width / viewBox.w;
  };

  // Helper to find which path is under the cursor
  const getPathAtPoint = (point: Point) => {
    // Iterate reverse to hit the topmost element first
    for (let i = paths.length - 1; i >= 0; i--) {
       const path = paths[i];
       
       if (path.type === 'text') {
          const dims = getTextDimensions(path.text || '', path.fontSize || 16, path.fontFamily || 'sans-serif');
          let x = path.points[0].x;
          let y = path.points[0].y - dims.height; 
          if (path.align === 'middle') x -= dims.width / 2;
          if (path.align === 'end') x -= dims.width;

          if (point.x >= x - 5 && point.x <= x + dims.width + 5 && 
              point.y >= y - 5 && point.y <= y + dims.height + 5) {
             return path.id;
          }
       } else {
         const bounds = getBoundingBox(path.points);
         const strokePadding = (path.strokeWidth || 3) / 2 + 5; 
         
         // Broad phase check
         if (point.x >= bounds.x - strokePadding && point.x <= bounds.x + bounds.w + strokePadding &&
             point.y >= bounds.y - strokePadding && point.y <= bounds.y + bounds.h + strokePadding) {
               
               // Hit test logic:
               // 1. If hitting the stroke (outline)
               const dist = getDistanceToPath(point, path.points);
               if (dist <= strokePadding) {
                 return path.id;
               }

               // 2. If hitting the fill (body)
               //    We check fill if: 
               //    (a) The tool is FILL (want to fill inside)
               //    (b) The tool is SELECT/HAND/etc and the path already HAS a fill.
               const hasFill = path.fillColor && path.fillColor !== 'none' && path.fillColor !== 'transparent';
               const shouldCheckFill = tool === Tool.FILL || hasFill;

               if (shouldCheckFill) {
                 if (isPointInPolygon(point, path.points)) {
                   return path.id;
                 }
               }
         }
       }
    }
    return null;
  };

  // --- Interaction Handlers ---

  const handlePointerDown = (e: React.PointerEvent) => {
    // Close context menu if open
    if (contextMenu) setContextMenu(null);

    // If editing text, let the blur event handle saving
    if (editingTextId) return;

    // Check if clicking on a transform handle
    const target = e.target as SVGElement;
    const handleType = target.getAttribute('data-handle');
    
    if (handleType && tool === Tool.SELECT && selectedPathIds.size > 0) {
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      
      saveStateToUndo();
      setTransformMode(handleType === 'rotate' ? 'rotate' : 'scale');
      setActiveHandle(handleType);
      
      const point = getCoordinates(e);
      transformStartRef.current = point;
      
      // Store initial state of paths for non-destructive transforms
      originalPathsRef.current = JSON.parse(JSON.stringify(paths));
      
      // Store initial bounding box
      const selectedPaths = paths.filter(p => selectedPathIds.has(p.id));
      selectionBoundsRef.current = getCombinedBoundingBox(selectedPaths);
      
      return;
    }

    e.currentTarget.setPointerCapture(e.pointerId);
    
    // Allow panning with Middle Mouse Button (1) OR if Hand tool is active (Left Click 0)
    const isMiddleMouse = e.button === 1;
    const isHandToolAction = tool === Tool.HAND && e.button === 0;

    if (isMiddleMouse || isHandToolAction) {
      if (isMiddleMouse) e.preventDefault(); // Prevent default MMB scroll behavior
      setIsPanning(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      viewBoxStartRef.current = { ...viewBox };
    } else if (e.button === 0) {
      const point = getCoordinates(e);

      // Handle Eraser
      if (tool === Tool.ERASER) {
        saveStateToUndo();
        setIsDrawing(true); // Reuse isDrawing flag for erasing state
        const radius = eraserSize / 2;
        setPaths(prev => prev.flatMap(p => eraseFromPath(p, point, radius)));
        return;
      }

      // Handle Fill Tool
      if (tool === Tool.FILL) {
        const hitId = getPathAtPoint(point);
        if (hitId) {
          saveStateToUndo();
          setPaths(prev => prev.map(p => 
            p.id === hitId ? { ...p, fillColor: color } : p
          ));
        }
        return;
      }

      // Handle Text Tool
      if (tool === Tool.TEXT) {
        const hitId = getPathAtPoint(point);
        const clickedText = paths.find(p => p.id === hitId && p.type === 'text');

        if (clickedText) {
          setEditingTextId(clickedText.id);
          // Sync toolbar with selected text props
          setFontSize(clickedText.fontSize || 24);
          setFontFamily(clickedText.fontFamily || 'sans-serif');
          setTextAlign(clickedText.align || 'start');
          setColor(clickedText.color);
        } else {
           // Create new text
           saveStateToUndo();
           const newTextId = Date.now().toString();
           const newText: PathData = {
              id: newTextId,
              type: 'text',
              points: [point],
              color: color,
              strokeWidth: 1, 
              text: 'Type here',
              fontSize: fontSize,
              fontFamily: fontFamily,
              align: textAlign
           };
           setPaths(prev => [...prev, newText]);
           setEditingTextId(newTextId);
        }
        return;
      }

      // Handle Selection & Moving
      if (tool === Tool.SELECT || tool === Tool.LASSO) {
        
        const hitPathId = getPathAtPoint(point);

        if (hitPathId) {
          saveStateToUndo();
          setTransformMode('translate');
          transformStartRef.current = point;
          
          if (e.shiftKey) {
            setSelectedPathIds(prev => {
              const next = new Set(prev);
              if (next.has(hitPathId)) next.delete(hitPathId);
              else next.add(hitPathId);
              return next;
            });
          } else {
            if (!selectedPathIds.has(hitPathId)) {
               setSelectedPathIds(new Set([hitPathId]));
            }
          }
          
          // Sync Toolbar with Selected Item Properties
          const path = paths.find(p => p.id === hitPathId);
          if (path) {
             setColor(path.color);
             if (path.type === 'text') {
                setFontSize(path.fontSize || 24);
                setFontFamily(path.fontFamily || 'sans-serif');
                setTextAlign(path.align || 'start');
             } else {
                setStrokeWidth(path.strokeWidth);
                if (path.smoothing !== undefined) setSmoothingLevel(path.smoothing);
             }
          }

        } else {
          if (!e.shiftKey) setSelectedPathIds(new Set());
          
          if (tool === Tool.SELECT) {
             setSelectionRect({ start: point, current: point });
          } else {
             setLassoPoints([point]);
          }
        }
        return;
      }
      
      // Handle Drawing (Pen, Shape, Crayon)
      setIsDrawing(true);
      
      if (tool === Tool.SHAPE) {
        shapeStartRef.current = point;
        setCurrentPoints(getShapePoints(shapeType, point, point));
      } else {
        // Freehand drawing (Pen / Crayon)
        setCurrentPoints([point]);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Always track cursor for custom eraser
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    const point = getCoordinates(e);

    if (isPanning) {
      // Panning Logic - works for Hand tool OR Middle Mouse Drag
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      
      // Calculate scale factor based on current viewbox vs screen size
      const scaleX = viewBoxStartRef.current.w / rect.width;
      const scaleY = viewBoxStartRef.current.h / rect.height;

      setViewBox({
        ...viewBoxStartRef.current,
        x: viewBoxStartRef.current.x - dx * scaleX,
        y: viewBoxStartRef.current.y - dy * scaleY
      });
    } else if (transformMode === 'translate' && transformStartRef.current) {
       // Moving Selected Paths (Translation)
       const dx = point.x - transformStartRef.current.x;
       const dy = point.y - transformStartRef.current.y;

       setPaths(prev => prev.map(p => {
         if (selectedPathIds.has(p.id)) {
           return {
             ...p,
             points: p.points.map(pt => ({ x: pt.x + dx, y: pt.y + dy }))
           };
         }
         return p;
       }));

       transformStartRef.current = point;

    } else if (transformMode === 'rotate' && selectionBoundsRef.current && originalPathsRef.current.length > 0) {
      // Rotating
      const bounds = selectionBoundsRef.current;
      const center = { x: bounds.x + bounds.w / 2, y: bounds.y + bounds.h / 2 };
      
      const startAngle = Math.atan2(transformStartRef.current!.y - center.y, transformStartRef.current!.x - center.x);
      const currentAngle = Math.atan2(point.y - center.y, point.x - center.x);
      const angleDelta = currentAngle - startAngle;

      // Apply rotation to ORIGINAL points to avoid compounding errors
      setPaths(currentPaths => {
        const nextPaths = [...currentPaths];
        originalPathsRef.current.forEach(origPath => {
           if (selectedPathIds.has(origPath.id)) {
              // Find index in current state
              const idx = nextPaths.findIndex(p => p.id === origPath.id);
              if (idx !== -1) {
                 nextPaths[idx] = {
                   ...origPath,
                   points: origPath.points.map(p => rotatePoint(p, center, angleDelta))
                 };
              }
           }
        });
        return nextPaths;
      });

    } else if (transformMode === 'scale' && selectionBoundsRef.current && originalPathsRef.current.length > 0) {
      // Scaling
      const bounds = selectionBoundsRef.current;
      const handle = activeHandle;
      
      // Determine origin (fixed point) based on handle
      // If dragging Top-Left, origin is Bottom-Right, etc.
      let originX = bounds.x;
      let originY = bounds.y;
      
      // This is a simplified scaling relative to the opposite corner
      // Ideally we want to track which handle is active to set the origin correctly
      // But for simplicity in this logic, we'll implement simple scaling relative to center or bounds
      
      let baseX = bounds.x;
      let baseY = bounds.y;
      let baseW = bounds.w;
      let baseH = bounds.h;
      
      // Calculate new width/height based on mouse delta
      // Note: This logic assumes simple stretching. 
      // A more robust implementation handles flipping.
      
      let newW = baseW;
      let newH = baseH;
      
      // Determine origin for scaling
      let scaleOrigin = { x: bounds.x + bounds.w / 2, y: bounds.y + bounds.h / 2 };
      
      if (handle === 'nw') { scaleOrigin = { x: bounds.x + bounds.w, y: bounds.y + bounds.h }; }
      else if (handle === 'ne') { scaleOrigin = { x: bounds.x, y: bounds.y + bounds.h }; }
      else if (handle === 'sw') { scaleOrigin = { x: bounds.x + bounds.w, y: bounds.y }; }
      else if (handle === 'se') { scaleOrigin = { x: bounds.x, y: bounds.y }; }

      // Calculate ratios
      // This is a naive implementation: distance ratio
      // Better: Project mouse onto diagonal vectors
      
      const startDistX = transformStartRef.current!.x - scaleOrigin.x;
      const startDistY = transformStartRef.current!.y - scaleOrigin.y;
      
      const curDistX = point.x - scaleOrigin.x;
      const curDistY = point.y - scaleOrigin.y;
      
      const scaleX = startDistX !== 0 ? curDistX / startDistX : 1;
      const scaleY = startDistY !== 0 ? curDistY / startDistY : 1;
      
      // Constrain aspect ratio if shift key? (Optional)
      
      setPaths(currentPaths => {
        const nextPaths = [...currentPaths];
        originalPathsRef.current.forEach(origPath => {
           if (selectedPathIds.has(origPath.id)) {
              const idx = nextPaths.findIndex(p => p.id === origPath.id);
              if (idx !== -1) {
                 nextPaths[idx] = {
                   ...origPath,
                   points: origPath.points.map(p => scalePoint(p, scaleOrigin, scaleX, scaleY))
                 };
              }
           }
        });
        return nextPaths;
      });

    } else if (selectionRect) {
       // Box Selection Drag
       setSelectionRect(prev => prev ? { ...prev, current: point } : null);
    } else if (lassoPoints.length > 0) {
       // Lasso Selection Drag
       setLassoPoints(prev => [...prev, point]);
    } else if (isDrawing) {
      
      if (tool === Tool.ERASER) {
         // Real Erasing Logic
         const radius = eraserSize / 2;
         setPaths(prev => prev.flatMap(p => eraseFromPath(p, point, radius)));
         return;
      }

      // Drawing
      if (tool === Tool.SHAPE && shapeStartRef.current) {
        const shapePoints = getShapePoints(shapeType, shapeStartRef.current, point);
        setCurrentPoints(shapePoints);
      } else {
        // Freehand drawing
        setCurrentPoints(prev => [...prev, point]);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    if (isPanning) {
      setIsPanning(false);
    } else if (transformMode !== 'none') {
      setTransformMode('none');
      setActiveHandle(null);
      transformStartRef.current = null;
      selectionBoundsRef.current = null;
      originalPathsRef.current = [];
    } else if (selectionRect) {
      // Commit Box Selection
      const r = selectionRect;
      const x = Math.min(r.start.x, r.current.x);
      const y = Math.min(r.start.y, r.current.y);
      const w = Math.abs(r.current.x - r.start.x);
      const h = Math.abs(r.current.y - r.start.y);
      
      const newSelected = new Set(selectedPathIds);
      
      paths.forEach(p => {
         if (p.type === 'text') {
             // Simplified center point check for text box selection
             const px = p.points[0].x;
             const py = p.points[0].y;
             if (px >= x && px <= x + w && py >= y && py <= y + h) {
                newSelected.add(p.id);
             }
         } else if (isPathInRect(p.points, {x, y, w, h})) {
            newSelected.add(p.id);
         }
      });
      
      setSelectedPathIds(newSelected);
      setSelectionRect(null);

    } else if (lassoPoints.length > 0) {
      // Commit Lasso Selection
      const newSelected = new Set(selectedPathIds);
      const closedLasso = [...lassoPoints, lassoPoints[0]];
      
      paths.forEach(p => {
         if (p.type === 'text') {
             if (isPointInPolygon(p.points[0], closedLasso)) {
               newSelected.add(p.id);
             }
         } else {
            const bounds = getBoundingBox(p.points);
            const center = { x: bounds.x + bounds.w/2, y: bounds.y + bounds.h/2 };
            if (isPointInPolygon(center, closedLasso)) {
               newSelected.add(p.id);
            }
         }
      });
      
      setSelectedPathIds(newSelected);
      setLassoPoints([]);

    } else if (isDrawing) {
      setIsDrawing(false);
      
      // If we were drawing a new path (not erasing), commit it
      if (tool !== Tool.ERASER && tool !== Tool.FILL && currentPoints.length > 1) {
        saveStateToUndo();
        
        const isGeometric = tool === Tool.SHAPE;
        
        const newPath: PathData = {
          id: Date.now().toString(),
          type: 'path',
          points: currentPoints,
          color: color, 
          strokeWidth: strokeWidth,
          smoothing: isGeometric ? 0 : smoothingLevel,
          style: tool === Tool.CRAYON ? 'crayon' : 'solid',
          fillColor: 'none'
        };
        
        setPaths(prev => [...prev, newPath]);
      }
      setCurrentPoints([]);
      shapeStartRef.current = null;
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const point = getCoordinates(e);
    const hitId = getPathAtPoint(point);

    if (hitId) {
      // If we clicked something not selected, select it exclusively
      if (!selectedPathIds.has(hitId)) {
        setSelectedPathIds(new Set([hitId]));
        
        // Sync toolbar
        const path = paths.find(p => p.id === hitId);
        if (path) {
          setColor(path.color);
          if (path.type === 'text') {
             setFontSize(path.fontSize || 24);
             setFontFamily(path.fontFamily || 'sans-serif');
             setTextAlign(path.align || 'start');
          } else {
             setStrokeWidth(path.strokeWidth);
             if (path.smoothing !== undefined) setSmoothingLevel(path.smoothing);
          }
        }
      }
      setContextMenu({ x: e.clientX, y: e.clientY });
    } else {
      // If clicking empty space but we have a selection, show menu for the selection?
      // Or just close menu if open. 
      if (selectedPathIds.size > 0) {
         // Optional: allow context menu for existing selection even if not clicking directly on it
         setContextMenu({ x: e.clientX, y: e.clientY });
      } else {
         setContextMenu(null);
      }
    }
  };

  // --- Text Handling ---
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!editingTextId) return;
    const newVal = e.target.value;
    setPaths(prev => prev.map(p => 
      p.id === editingTextId ? { ...p, text: newVal } : p
    ));
  };
  
  const handleTextBlur = () => {
    setEditingTextId(null);
  };
  
  // --- Undo/Redo/Clear ---

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, paths]); // Push current state to redo
    setPaths(previous);
    setUndoStack(prev => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, paths]); // Push current state to undo
    setPaths(next);
    setRedoStack(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    saveStateToUndo();
    setPaths([]);
    setSelectedPathIds(new Set());
    setBackgroundSvg('');
  };

  // --- File Handling (Upload & Drop) ---

  const handleImportedSvg = (content: string) => {
    try {
      const { paths: extractedPaths, viewBox: extractedViewBox } = parseSvgToPaths(content);
        
      if (extractedPaths.length > 0) {
         setPaths(prev => [...prev, ...extractedPaths]);
         
         if (extractedViewBox) {
           setViewBox(extractedViewBox);
         }
         
         setBackgroundSvg('');
      } else {
         const parser = new DOMParser();
         const doc = parser.parseFromString(content, 'image/svg+xml');
         const svgElement = doc.querySelector('svg');
         
         if (svgElement) {
            const innerContent = svgElement.innerHTML;
            if (svgElement.viewBox.baseVal && svgElement.viewBox.baseVal.width > 0) {
               setViewBox({ 
                 x: svgElement.viewBox.baseVal.x,
                 y: svgElement.viewBox.baseVal.y,
                 w: svgElement.viewBox.baseVal.width,
                 h: svgElement.viewBox.baseVal.height
               });
            }
            setBackgroundSvg(innerContent);
         }
      }
    } catch (e) {
      console.error("Error parsing SVG", e);
    }
  };

  const handleVectorizeConfirm = (config: VectorizeConfig) => {
    if (!pendingFile) return;
    setIsVecModalOpen(false);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = (e.target?.result as string).split(',')[1];
      setLoadingText(config.complexity === 'low' ? 'Creating Icon...' : 'Vectorizing Art...');
      setIsAiProcessing(true);
      
      try {
        const svgContent = await bitmapToSvg(base64Data, pendingFile.type, config);
        saveStateToUndo();
        handleImportedSvg(svgContent);
      } catch (error) {
        alert("Failed to vectorize image.");
      } finally {
        setIsAiProcessing(false);
        setPendingFile(null);
      }
    };
    reader.readAsDataURL(pendingFile);
  };

  const processFile = (file: File) => {
    if (!file) return;

    if (file.type.startsWith('image/') && !file.type.includes('svg')) {
      setPendingFile(file);
      setIsVecModalOpen(true);
      return;
    }
    
    if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        if (!content) return;
        saveStateToUndo();
        handleImportedSvg(content);
      };
      reader.readAsText(file);
      return;
    }
    
    console.warn('Unsupported file type');
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // --- Drag & Drop Handlers ---

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // --- Export ---

  const getFullSvgString = useCallback(() => {
    if (!svgRef.current) return '';
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgRef.current);
    
    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    return source;
  }, []);

  const handleDownload = () => {
    const svgString = getFullSvgString();
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vectorcraft_drawing.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Client Features ---
  
  const handleSmoothingChange = (level: number) => {
    setSmoothingLevel(level);
  };

  const handleSmoothAll = () => {
    saveStateToUndo();
    setPaths(prev => prev.map(p => ({
      ...p,
      smoothing: smoothingLevel > 0 ? smoothingLevel : 1
    })));
  };

  // --- AI Processing ---
  
  const handleAiSubmit = async (prompt: string) => {
    setLoadingText('Gemini is refining your vector...');
    setIsAiProcessing(true);
    setIsAiModalOpen(false);

    try {
      const currentSvg = getFullSvgString();
      const newSvgContent = await processSvgWithAi(currentSvg, prompt);

      saveStateToUndo();
      handleImportedSvg(newSvgContent);

    } catch (error) {
      alert("Failed to process with AI. Please check your API Key or try again.");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleUrlImport = (screenshotData: string, metadata: any) => {
    // Create an image element from the base64 screenshot
    const img = new Image();
    img.onload = () => {
      // Convert to SVG background image
      const svgBackground = `<image href="data:image/png;base64,${screenshotData}" x="0" y="0" width="${metadata.width}" height="${metadata.height}" />`;

      saveStateToUndo();
      setBackgroundSvg(svgBackground);

      // Adjust viewBox to fit the screenshot
      setViewBox({
        x: 0,
        y: 0,
        w: metadata.width,
        h: metadata.height
      });
    };
    img.src = `data:image/png;base64,${screenshotData}`;
  };

  // Eraser visual size
  const eraserPixelSize = eraserSize * getZoomScale();

  const getCursorClass = () => {
    if (isPanning) return 'cursor-grabbing';
    if (tool === Tool.HAND) return 'cursor-grab';
    if (tool === Tool.ERASER) return 'cursor-none';
    if (tool === Tool.FILL) return 'cursor-copy'; // Paint bucket proxy
    if (tool === Tool.CRAYON) return 'cursor-crosshair';
    if (tool === Tool.SELECT) {
      if (activeHandle) return 'cursor-grabbing'; // When dragging handle
      return 'cursor-default';
    } 
    if (tool === Tool.LASSO) return 'cursor-crosshair';
    if (tool === Tool.SHAPE) return 'cursor-crosshair';
    if (tool === Tool.TEXT) return 'cursor-text';
    return 'cursor-crosshair';
  }

  // Find currently editing text object
  const editingTextObj = paths.find(p => p.id === editingTextId);

  // Calculate Selection Bounding Box for the UI Overlay
  const selectionBounds = React.useMemo(() => {
     if (selectedPathIds.size === 0) return null;
     const selectedPaths = paths.filter(p => selectedPathIds.has(p.id));
     return getCombinedBoundingBox(selectedPaths);
  }, [paths, selectedPathIds]);

  // Helper for handles (render constants)
  const handleSize = 8 / getZoomScale();
  const rotationHandleDist = 20 / getZoomScale();

  // Show landing page if user hasn't entered the editor yet
  if (showLanding) {
    return <LandingPage onNavigateToCanvas={() => setShowLanding(false)} />;
  }

  return (
    <div
      className="w-screen h-screen bg-zinc-950 overflow-hidden flex flex-col relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => setContextMenu(null)} // Close menu on general click
      onContextMenu={(e) => e.preventDefault()} // Prevent default browser menu globally
    >
      
      {/* Drag Overlay */}
      {isDragging && (
         <div className="absolute inset-0 z-[100] bg-indigo-900/80 backdrop-blur-md flex items-center justify-center border-4 border-indigo-500 border-dashed m-6 rounded-3xl pointer-events-none animate-in fade-in duration-200">
            <div className="text-center text-indigo-100">
              <Upload size={80} className="mx-auto mb-6 text-indigo-400 animate-bounce" />
              <h2 className="text-4xl font-bold mb-3">Drop File Here</h2>
              <p className="text-indigo-300 text-lg">SVG, PNG, or JPG supported</p>
            </div>
         </div>
      )}

      <TopBar
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onUrlImport={() => setIsUrlModalOpen(true)}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
      />

      <Toolbar 
        currentTool={tool}
        setTool={setTool}
        currentShapeType={shapeType}
        setShapeType={setShapeType}
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        eraserSize={eraserSize}
        setEraserSize={setEraserSize}
        smoothingLevel={smoothingLevel}
        setSmoothingLevel={handleSmoothingChange} 
        // Text Props
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        textAlign={textAlign}
        setTextAlign={setTextAlign}
        onAiEdit={() => setIsAiModalOpen(true)}
        onSmoothAll={handleSmoothAll}
        isAiLoading={isAiProcessing}
        extractedColors={extractedColors}
      />

      <Footer 
        onUpload={handleUpload}
        onDownload={handleDownload}
        onExportCode={() => setIsCodeModalOpen(true)}
      />

      <AiPromptModal 
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSubmit={handleAiSubmit}
        isLoading={isAiProcessing}
      />

      <VectorizationModal 
        isOpen={isVecModalOpen}
        onClose={() => { setIsVecModalOpen(false); setPendingFile(null); }}
        onConfirm={handleVectorizeConfirm}
        fileName={pendingFile?.name || 'Image'}
      />

      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        svgContent={getFullSvgString()}
      />

      <UrlImportModal
        isOpen={isUrlModalOpen}
        onClose={() => setIsUrlModalOpen(false)}
        onImport={handleUrlImport}
      />

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-1 z-[60] min-w-[160px] animate-in fade-in zoom-in-95 duration-100"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => duplicateSelected()}
            className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2"><Copy size={14} /> Duplicate</span>
            <span className="text-zinc-600 text-xs font-mono group-hover:text-zinc-500">Ctrl+D</span>
          </button>

          <button
            onClick={() => flipSelected()}
            className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2 group"
          >
            <FlipHorizontal size={14} /> Flip Horizontal
          </button>

          <div className="h-px bg-zinc-800 my-1"></div>

          <button
            onClick={() => {
               saveStateToUndo();
               setPaths(prev => prev.filter(p => !selectedPathIds.has(p.id)));
               setSelectedPathIds(new Set());
               setContextMenu(null);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 flex items-center justify-between group"
          >
             <span className="flex items-center gap-2"><Trash2 size={14} /> Delete</span>
             <span className="text-zinc-600 text-xs font-mono group-hover:text-red-300/50">Del</span>
          </button>
        </div>
      )}

      {/* Canvas Area */}
      <div className="flex-1 relative bg-gray-100 overflow-hidden">
        
        {/* Custom Eraser Cursor */}
        {tool === Tool.ERASER && (
          <div 
            className="pointer-events-none absolute border border-zinc-500 rounded-full z-50 -translate-x-1/2 -translate-y-1/2 bg-white/20"
            style={{
              width: `${eraserPixelSize}px`,
              height: `${eraserPixelSize}px`,
              left: cursorPos.x,
              top: cursorPos.y,
            }}
          />
        )}
        
        {/* Text Input Overlay */}
        {editingTextId && editingTextObj && (
           <textarea
             autoFocus
             value={editingTextObj.text}
             onChange={handleTextChange}
             onBlur={handleTextBlur}
             style={{
               position: 'absolute',
               left: svgToScreen(editingTextObj.points[0]).x,
               top: svgToScreen(editingTextObj.points[0]).y - (editingTextObj.fontSize || 24),
               fontSize: (editingTextObj.fontSize || 24) * getZoomScale(),
               fontFamily: editingTextObj.fontFamily,
               color: editingTextObj.color,
               background: 'transparent',
               border: '1px dashed #3b82f6',
               outline: 'none',
               padding: 0,
               margin: 0,
               resize: 'none',
               overflow: 'hidden',
               whiteSpace: 'pre',
               transformOrigin: 'top left',
               minWidth: '50px',
               zIndex: 60,
               textAlign: editingTextObj.align || 'start',
               // Offset based on alignment
               transform: editingTextObj.align === 'middle' ? 'translateX(-50%)' : editingTextObj.align === 'end' ? 'translateX(-100%)' : 'none'
             }}
             className="shadow-none focus:ring-0"
           />
        )}

        <svg
          ref={svgRef}
          className={`w-full h-full touch-none ${getCursorClass()}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onContextMenu={handleContextMenu}
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="crayon" x="-20%" y="-20%" width="140%" height="140%">
               <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
               <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>

          {/* Background / Uploaded Layer */}
          {backgroundSvg && <g dangerouslySetInnerHTML={{ __html: backgroundSvg }} />}

          {/* Paths & Text Layer */}
          {paths.map((path) => (
            <React.Fragment key={path.id}>
               
               {/* --- TEXT RENDER --- */}
               {path.type === 'text' && editingTextId !== path.id ? (
                 <text
                   x={path.points[0].x}
                   y={path.points[0].y}
                   fill={path.color}
                   fontSize={path.fontSize || 24}
                   fontFamily={path.fontFamily || 'sans-serif'}
                   textAnchor={path.align || 'start'}
                   style={{ userSelect: 'none', pointerEvents: 'none' }} // Let container handle events
                   className={`${selectedPathIds.has(path.id) && transformMode === 'none' ? 'drop-shadow-[0_0_2px_rgba(59,130,246,0.8)]' : ''}`}
                 >
                   {path.text}
                 </text>
               ) : null}

               {/* --- PATH RENDER --- */}
               {path.type !== 'text' && (
                 <>
                  {selectedPathIds.has(path.id) && transformMode === 'none' && (
                    <path
                      d={pointsToSmoothedPath(path.points, path.smoothing !== undefined ? path.smoothing : smoothingLevel)}
                      stroke="#3b82f6"
                      strokeWidth={path.strokeWidth + 4}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.5"
                    />
                  )}
                  <path
                    d={pointsToSmoothedPath(path.points, path.smoothing !== undefined ? path.smoothing : smoothingLevel)}
                    stroke={path.color}
                    strokeWidth={path.strokeWidth}
                    fill={path.fillColor || 'none'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={path.style === 'crayon' ? 'url(#crayon)' : undefined}
                    data-id={path.id}
                  />
                 </>
               )}
            </React.Fragment>
          ))}

          {/* Active Drawing Path (For Pen/Shape) */}
          {isDrawing && currentPoints.length > 0 && tool !== Tool.ERASER && tool !== Tool.TEXT && tool !== Tool.FILL && (
             <path
             d={pointsToLinedPath(currentPoints)}
             stroke={color}
             strokeWidth={strokeWidth}
             fill="none"
             strokeLinecap="round"
             strokeLinejoin="round"
             filter={tool === Tool.CRAYON ? 'url(#crayon)' : undefined}
             className="opacity-80"
           />
          )}

          {/* Selection Rect Overlay (Dragging to Select) */}
          {selectionRect && (
            <rect
              x={Math.min(selectionRect.start.x, selectionRect.current.x)}
              y={Math.min(selectionRect.start.y, selectionRect.current.y)}
              width={Math.abs(selectionRect.current.x - selectionRect.start.x)}
              height={Math.abs(selectionRect.current.y - selectionRect.start.y)}
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3b82f6"
              strokeWidth={2 / getZoomScale()}
              strokeDasharray={5 / getZoomScale()}
            />
          )}

          {/* Lasso Overlay */}
          {lassoPoints.length > 0 && (
            <polygon 
              points={lassoPoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3b82f6"
              strokeWidth={2 / getZoomScale()}
              strokeDasharray={5 / getZoomScale()}
            />
          )}

          {/* TRANSFORM HANDLES OVERLAY */}
          {selectionBounds && tool === Tool.SELECT && (
             <g>
                {/* Bounding Box Rect */}
                <rect 
                  x={selectionBounds.x} 
                  y={selectionBounds.y} 
                  width={selectionBounds.w} 
                  height={selectionBounds.h}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={1 / getZoomScale()}
                />
                
                {/* Corner Resize Handles */}
                <rect x={selectionBounds.x - handleSize/2} y={selectionBounds.y - handleSize/2} width={handleSize} height={handleSize} fill="white" stroke="#3b82f6" strokeWidth={1/getZoomScale()} data-handle="nw" className="cursor-nw-resize" />
                <rect x={selectionBounds.x + selectionBounds.w - handleSize/2} y={selectionBounds.y - handleSize/2} width={handleSize} height={handleSize} fill="white" stroke="#3b82f6" strokeWidth={1/getZoomScale()} data-handle="ne" className="cursor-ne-resize" />
                <rect x={selectionBounds.x + selectionBounds.w - handleSize/2} y={selectionBounds.y + selectionBounds.h - handleSize/2} width={handleSize} height={handleSize} fill="white" stroke="#3b82f6" strokeWidth={1/getZoomScale()} data-handle="se" className="cursor-se-resize" />
                <rect x={selectionBounds.x - handleSize/2} y={selectionBounds.y + selectionBounds.h - handleSize/2} width={handleSize} height={handleSize} fill="white" stroke="#3b82f6" strokeWidth={1/getZoomScale()} data-handle="sw" className="cursor-sw-resize" />

                {/* Rotation Handle */}
                <line 
                  x1={selectionBounds.x + selectionBounds.w / 2} 
                  y1={selectionBounds.y} 
                  x2={selectionBounds.x + selectionBounds.w / 2} 
                  y2={selectionBounds.y - rotationHandleDist} 
                  stroke="#3b82f6" 
                  strokeWidth={1 / getZoomScale()} 
                />
                <circle 
                  cx={selectionBounds.x + selectionBounds.w / 2} 
                  cy={selectionBounds.y - rotationHandleDist} 
                  r={handleSize / 1.5} 
                  fill="white" 
                  stroke="#3b82f6" 
                  strokeWidth={1 / getZoomScale()}
                  data-handle="rotate"
                  className="cursor-alias"
                />
             </g>
          )}

        </svg>
      </div>

      {/* Loading Overlay */}
      {isAiProcessing && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-indigo-400 font-mono animate-pulse">{loadingText}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
