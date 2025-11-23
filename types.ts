
export interface Point {
  x: number;
  y: number;
}

export interface PathData {
  id: string;
  type?: 'path' | 'text'; // Discriminator
  points: Point[]; // For text, this contains the anchor point [0]
  color: string;
  fillColor?: string; // New: Fill color for the path
  strokeWidth: number;
  smoothing?: number; // Smoothing intensity (0 = none, higher = smoother)
  style?: 'solid' | 'crayon'; // New: Rendering style
  
  // Text specific properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  align?: 'start' | 'middle' | 'end';
}

export enum Tool {
  PEN = 'PEN',
  CRAYON = 'CRAYON', // New Tool
  ERASER = 'ERASER',
  FILL = 'FILL',     // New Tool
  HAND = 'HAND',
  SHAPE = 'SHAPE',
  SELECT = 'SELECT',
  LASSO = 'LASSO',
  TEXT = 'TEXT',
}

export type ShapeType = 'rectangle' | 'square' | 'ellipse' | 'circle' | 'triangle' | 'star' | 'line';

export interface SvgLayer {
  type: 'path' | 'raw';
  content: string | PathData;
  id: string;
}
