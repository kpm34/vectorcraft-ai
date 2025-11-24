
import { Point, PathData, ShapeType } from '../lib/types/types';

// Convert an array of points to a standard SVG path string using straight lines
export const pointsToLinedPath = (points: Point[]): string => {
  if (points.length === 0) return '';
  const d = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  return d;
};

// Calculate squared distance from a point p to the line segment p1-p2
export const getSqSegDist = (p: Point, p1: Point, p2: Point) => {
  let x = p1.x, y = p1.y, dx = p2.x - x, dy = p2.y - y;
  if (dx !== 0 || dy !== 0) {
    const t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) { x = p2.x; y = p2.y; }
    else if (t > 0) { x += dx * t; y += dy * t; }
  }
  return (p.x - x) ** 2 + (p.y - y) ** 2;
};

// Calculate distance from point to path (min distance to any segment)
export const getDistanceToPath = (point: Point, pathPoints: Point[]): number => {
  if (pathPoints.length < 2) return Infinity;
  let minSqDist = Infinity;
  for (let i = 0; i < pathPoints.length - 1; i++) {
    const d = getSqSegDist(point, pathPoints[i], pathPoints[i+1]);
    if (d < minSqDist) minSqDist = d;
  }
  return Math.sqrt(minSqDist);
};

export const getBoundingBox = (points: Point[]) => {
  if (points.length === 0) return { x: 0, y: 0, w: 0, h: 0 };
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
};

// Get bounding box for multiple paths combined
export const getCombinedBoundingBox = (paths: PathData[]) => {
  const allPoints = paths.flatMap(p => p.points);
  return getBoundingBox(allPoints);
};

export const rotatePoint = (point: Point, center: Point, angleRad: number): Point => {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: center.x + (dx * cos - dy * sin),
    y: center.y + (dx * sin + dy * cos)
  };
};

export const scalePoint = (point: Point, origin: Point, scaleX: number, scaleY: number): Point => {
  return {
    x: origin.x + (point.x - origin.x) * scaleX,
    y: origin.y + (point.y - origin.y) * scaleY
  };
};

// Approximate text bounding box for hit testing
export const getTextDimensions = (text: string, fontSize: number, fontFamily: string) => {
  // Heuristic approximation since we don't have canvas context here
  // Average aspect ratio for many fonts is around 0.6
  const avgCharWidth = fontSize * 0.6; 
  const width = text.length * avgCharWidth;
  const height = fontSize; // Line height approx
  return { width, height };
};

export const isPointInPolygon = (point: Point, vs: Point[]) => {
    // ray-casting algorithm
    const x = point.x, y = point.y;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i].x, yi = vs[i].y;
        const xj = vs[j].x, yj = vs[j].y;
        
        const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};

// Check if path intersects rect (simplified: check bounds overlap)
export const isPathInRect = (pathPoints: Point[], rect: {x: number, y: number, w: number, h: number}) => {
    const bounds = getBoundingBox(pathPoints);
    const rRight = rect.x + rect.w;
    const rBottom = rect.y + rect.h;
    const bRight = bounds.x + bounds.w;
    const bBottom = bounds.y + bounds.h;
    
    // No intersection
    if (bounds.x > rRight || bRight < rect.x || bounds.y > rBottom || bBottom < rect.y) return false;
    
    return true;
};

// Circle-Segment intersection
// Returns t values [0, 1] where intersection occurs
const getCircleSegmentIntersections = (
  p1: Point,
  p2: Point,
  center: Point,
  radius: number
): number[] => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const a = dx * dx + dy * dy;
  const b = 2 * (dx * (p1.x - center.x) + dy * (p1.y - center.y));
  const c = (p1.x - center.x) ** 2 + (p1.y - center.y) ** 2 - radius * radius;

  const det = b * b - 4 * a * c;
  if (det < 0) return []; // No intersection

  const t1 = (-b - Math.sqrt(det)) / (2 * a);
  const t2 = (-b + Math.sqrt(det)) / (2 * a);

  const intersections: number[] = [];
  if (t1 >= 0 && t1 <= 1) intersections.push(t1);
  if (t2 >= 0 && t2 <= 1) intersections.push(t2);
  
  return intersections.sort((a, b) => a - b);
};

// Ramer-Douglas-Peucker simplification algorithm
const simplifyPoints = (points: Point[], tolerance: number): Point[] => {
  if (points.length <= 2) return points;
  const sqTolerance = tolerance * tolerance;
  
  let maxSqDist = 0;
  let index = 0;
  
  for (let i = 1; i < points.length - 1; i++) {
    const sqDist = getSqSegDist(points[i], points[0], points[points.length - 1]);
    if (sqDist > maxSqDist) {
      maxSqDist = sqDist;
      index = i;
    }
  }
  
  if (maxSqDist > sqTolerance) {
    const left = simplifyPoints(points.slice(0, index + 1), tolerance);
    const right = simplifyPoints(points.slice(index), tolerance);
    return [...left.slice(0, -1), ...right];
  }
  
  return [points[0], points[points.length - 1]];
};

// Moving average smoothing to reduce jitter while preserving general form
const smoothPointsAverage = (points: Point[], iterations: number): Point[] => {
  if (points.length < 3) return points;
  if (iterations <= 0) return points;

  let currentPoints = [...points];
  
  for (let iter = 0; iter < iterations; iter++) {
    const nextPoints = [currentPoints[0]]; // Keep start
    
    for (let i = 1; i < currentPoints.length - 1; i++) {
      const prev = currentPoints[i - 1];
      const curr = currentPoints[i];
      const next = currentPoints[i + 1];
      
      // Weighted average (Gaussian-like kernel)
      nextPoints.push({
        x: 0.25 * prev.x + 0.5 * curr.x + 0.25 * next.x,
        y: 0.25 * prev.y + 0.5 * curr.y + 0.25 * next.y
      });
    }
    
    nextPoints.push(currentPoints[currentPoints.length - 1]); // Keep end
    currentPoints = nextPoints;
  }
  
  return currentPoints;
};

// Convert an array of points to a smoothed Quadratic Bezier SVG path string
export const pointsToSmoothedPath = (points: Point[], smoothingFactor: number = 0): string => {
  if (points.length < 2) return '';
  
  // If smoothing is explicitly 0 (used for Geometric Shapes), return straight lines.
  if (smoothingFactor === 0) {
    return pointsToLinedPath(points);
  }
  
  let processingPoints = points;

  if (smoothingFactor > 0) {
    // 1. Apply Moving Average Smoothing
    const iterations = Math.ceil(smoothingFactor);
    processingPoints = smoothPointsAverage(processingPoints, iterations);

    // 2. Apply Simplification (RDP)
    const tolerance = 0.5 + (smoothingFactor * 0.1);
    processingPoints = simplifyPoints(processingPoints, tolerance);
  }

  if (processingPoints.length < 2) return '';
  if (processingPoints.length === 2) return pointsToLinedPath(processingPoints);

  // 3. Generate Quadratic Bezier Curves through midpoints
  const first = processingPoints[0];
  let d = `M ${first.x} ${first.y}`;

  for (let i = 1; i < processingPoints.length - 1; i++) {
    const p0 = processingPoints[i];
    const p1 = processingPoints[i + 1];
    const midX = (p0.x + p1.x) / 2;
    const midY = (p0.y + p1.y) / 2;
    d += ` Q ${p0.x} ${p0.y} ${midX} ${midY}`;
  }

  // Link the last two points
  const last = processingPoints[processingPoints.length - 1];
  d += ` L ${last.x} ${last.y}`;

  return d;
};

export const bakePath = (path: PathData): PathData => {
  // If already baked (smoothing 0) or text, return as is.
  if (path.type === 'text') return path;
  if (path.smoothing === 0) return path;

  const d = pointsToSmoothedPath(path.points, path.smoothing || 0);
  if (!d) return path;

  // Setup DOM elements for measuring
  const div = document.createElement('div');
  div.style.cssText = 'position:absolute;visibility:hidden;width:0;height:0;pointer-events:none;';
  document.body.appendChild(div);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  div.appendChild(svg);
  
  const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathEl.setAttribute("d", d);
  svg.appendChild(pathEl);

  const len = pathEl.getTotalLength();
  const points: Point[] = [];
  
  // Step size: balance performance vs quality. 2px is quite detailed.
  const step = 2; 
  
  for (let i = 0; i < len; i += step) {
     const p = pathEl.getPointAtLength(i);
     points.push({ x: p.x, y: p.y });
  }
  // Make sure we get the very end
  const last = pathEl.getPointAtLength(len);
  points.push({ x: last.x, y: last.y });

  document.body.removeChild(div);

  return {
    ...path,
    points,
    smoothing: 0, // Baked
    style: path.style // Preserve style (crayon etc)
  };
};

// Erase parts of a path that are inside the eraser circle
// Returns an array of new paths (can be 0 if fully erased, 1 if touched/unaffected, or >1 if split)
export const eraseFromPath = (path: PathData, center: Point, radius: number): PathData[] => {
  // Ignore text for now - eraser only works on vector paths
  if (path.type === 'text') return [path];

  // Optimization: Check if path is even close to the eraser
  const bbox = getBoundingBox(path.points);
  // Add padding for stroke width?
  const padding = (path.strokeWidth || 1) + radius; 
  
  if (
    center.x + radius < bbox.x - padding ||
    center.x - radius > bbox.x + bbox.w + padding ||
    center.y + radius < bbox.y - padding ||
    center.y - radius > bbox.y + bbox.h + padding
  ) {
    return [path];
  }

  // Bake path if it has smoothing, to prevent distortion of the curve
  let targetPath = path;
  if (path.smoothing && path.smoothing > 0) {
      targetPath = bakePath(path);
  }

  const radiusSq = radius * radius;
  const newPaths: PathData[] = [];
  let currentPoints: Point[] = [];

  const startNewPath = () => {
    if (currentPoints.length >= 2) {
      newPaths.push({
        ...targetPath,
        id: targetPath.id + '-' + Math.random().toString(36).substr(2, 5),
        points: [...currentPoints]
      });
    }
    currentPoints = [];
  };

  const points = targetPath.points;
  if (points.length < 2) return [targetPath];

  // Start with the first point
  let isPrevInside = (points[0].x - center.x) ** 2 + (points[0].y - center.y) ** 2 < radiusSq;
  if (!isPrevInside) {
    currentPoints.push(points[0]);
  }

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    
    // Skip zero length segments to avoid division by zero in intersection calc
    if (Math.abs(p1.x - p2.x) < 0.001 && Math.abs(p1.y - p2.y) < 0.001) {
       continue;
    }

    // Check intersection with segment
    const intersections = getCircleSegmentIntersections(p1, p2, center, radius);
    const isNextInside = (p2.x - center.x) ** 2 + (p2.y - center.y) ** 2 < radiusSq;

    if (intersections.length === 0) {
      if (!isPrevInside) {
         currentPoints.push(p2);
      }
    } else {
      // Intersections found
      for (const t of intersections) {
        const ix = p1.x + t * (p2.x - p1.x);
        const iy = p1.y + t * (p2.y - p1.y);
        
        if (currentPoints.length > 0) {
           currentPoints.push({x: ix, y: iy});
           startNewPath(); // Cut
        } else {
           currentPoints.push({x: ix, y: iy});
        }
      }
      
      if (!isNextInside) {
        currentPoints.push(p2);
      }
    }
    
    isPrevInside = isNextInside;
  }
  
  // Close any remaining path
  startNewPath();

  if (newPaths.length === 1 && newPaths[0].points.length === targetPath.points.length) {
     return [targetPath];
  }

  return newPaths;
};

export const parseSvgToPaths = (svgString: string): { paths: PathData[], viewBox: { x: number, y: number, w: number, h: number } | null } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgRoot = doc.querySelector('svg');
  
  if (!svgRoot) return { paths: [], viewBox: null };

  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.visibility = 'hidden';
  container.style.pointerEvents = 'none';
  container.style.width = '0px';
  container.style.height = '0px';
  container.style.overflow = 'hidden';
  
  document.body.appendChild(container);
  
  const svgInstance = svgRoot.cloneNode(true) as SVGSVGElement;
  container.appendChild(svgInstance);

  const extractedPaths: PathData[] = [];
  
  const elements = svgInstance.querySelectorAll('path, circle, rect, ellipse, line, polyline, polygon');
  
  elements.forEach((el, index) => {
     if (el instanceof SVGGeometryElement) {
        const len = el.getTotalLength();
        if (len < 0.1) return;
        
        let step = 4; 
        if (len < 100) step = 2;
        if (len > 2000) step = 10;

        const points: Point[] = [];
        const ctm = el.getCTM(); 
        
        for (let i = 0; i <= len; i += step) {
           const p = el.getPointAtLength(i);
           if (ctm) {
             points.push({
               x: p.x * ctm.a + p.y * ctm.c + ctm.e,
               y: p.x * ctm.b + p.y * ctm.d + ctm.f
             });
           } else {
             points.push({ x: p.x, y: p.y });
           }
        }
        
        const last = el.getPointAtLength(len);
        if (ctm) {
           points.push({
             x: last.x * ctm.a + last.y * ctm.c + ctm.e,
             y: last.x * ctm.b + last.y * ctm.d + ctm.f
           });
        } else {
           points.push({ x: last.x, y: last.y });
        }

        const style = window.getComputedStyle(el);
        
        let strokeColor = '#000000';
        let fillColor = 'none';

        if (style.stroke && style.stroke !== 'none') {
          strokeColor = style.stroke;
        }
        
        if (style.fill && style.fill !== 'none') {
          fillColor = style.fill;
        } else if (!style.stroke) {
           // If no stroke and no fill explicitly set, some SVGs default to black fill
           // But here we'll check computed style
           if (style.fill === '#000000' || style.fill === 'rgb(0, 0, 0)') {
              fillColor = '#000000';
           }
        }

        const strokeWidth = parseFloat(style.strokeWidth) || 1;

        extractedPaths.push({
           id: `imported-${index}-${Date.now()}`,
           type: 'path',
           points,
           color: strokeColor,
           fillColor: fillColor,
           strokeWidth: strokeWidth,
           smoothing: 0,
           style: 'solid'
        });
     }
  });

  let viewBox = null;
  if (svgInstance.viewBox && svgInstance.viewBox.baseVal) {
    const vb = svgInstance.viewBox.baseVal;
    if (vb.width > 0 && vb.height > 0) {
      viewBox = { x: vb.x, y: vb.y, w: vb.width, h: vb.height };
    }
  }
  
  if (!viewBox) {
    const w = parseFloat(svgInstance.getAttribute('width') || '0');
    const h = parseFloat(svgInstance.getAttribute('height') || '0');
    if (w > 0 && h > 0) {
      viewBox = { x: 0, y: 0, w, h };
    }
  }

  document.body.removeChild(container);

  return { paths: extractedPaths, viewBox };
};

export const getShapePoints = (type: ShapeType, start: Point, end: Point): Point[] => {
  const points: Point[] = [];
  let minX = Math.min(start.x, end.x);
  let minY = Math.min(start.y, end.y);
  let width = Math.abs(end.x - start.x);
  let height = Math.abs(end.y - start.y);
  
  if (type === 'square' || type === 'circle') {
    const size = Math.max(width, height);
    width = size;
    height = size;
    if (end.x < start.x) minX = start.x - size;
    else minX = start.x;
    
    if (end.y < start.y) minY = start.y - size;
    else minY = start.y;
  }

  const cx = minX + width / 2;
  const cy = minY + height / 2;

  if (type === 'rectangle' || type === 'square') {
    points.push({ x: minX, y: minY });
    points.push({ x: minX + width, y: minY });
    points.push({ x: minX + width, y: minY + height });
    points.push({ x: minX, y: minY + height });
    points.push({ x: minX, y: minY }); 
  } else if (type === 'ellipse' || type === 'circle') {
     const steps = 60;
     for (let i = 0; i <= steps; i++) {
       const theta = (i / steps) * Math.PI * 2;
       points.push({
         x: cx + (width / 2) * Math.cos(theta),
         y: cy + (height / 2) * Math.sin(theta)
       });
     }
  } else if (type === 'triangle') {
     points.push({ x: cx, y: minY }); 
     points.push({ x: minX + width, y: minY + height }); 
     points.push({ x: minX, y: minY + height }); 
     points.push({ x: cx, y: minY }); 
  } else if (type === 'star') {
      const outerRadius = Math.min(width, height) / 2;
      const innerRadius = outerRadius * 0.4;
      const steps = 10;
      for (let i = 0; i <= steps; i++) {
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const theta = (i / steps) * Math.PI * 2 - Math.PI / 2;
        points.push({
           x: cx + r * Math.cos(theta),
           y: cy + r * Math.sin(theta)
        });
      }
  } else if (type === 'line') {
      points.push(start);
      points.push(end);
  }
  
  return points;
};
