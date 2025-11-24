// ============================================
// Texture Studio Types
// ============================================

export enum TextureMode {
  MATCAP = 'MATCAP',
  PBR = 'PBR'
}

export enum ModelQuality {
  FAST = 'FAST', // gemini-2.5-flash-image
  HIGH = 'HIGH'  // gemini-3-pro-image-preview
}

export interface GeneratedTextureSet {
  id: string;
  mode: TextureMode;
  prompt: string;
  albedo: string; // Base64 data URI
  normal?: string; // Base64 data URI (PBR only)
  roughness?: string; // Base64 data URI (PBR only)
  timestamp: number;
  resolution?: '1K' | '2K';
}

export interface GenerationConfig {
  prompt: string;
  mode: TextureMode;
  quality: ModelQuality;
}

// ============================================
// SVG Editor Types
// ============================================

export enum Tool {
  SELECT = 'SELECT',
  PEN = 'PEN',
  PENCIL = 'PENCIL',
  CRAYON = 'CRAYON',
  SHAPE = 'SHAPE',
  TEXT = 'TEXT',
  FILL = 'FILL',
  ERASER = 'ERASER',
  HAND = 'HAND',
  LASSO = 'LASSO'
}

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'polygon';

export interface Point {
  x: number;
  y: number;
}

export interface PathData {
  id: string;
  points: Point[];
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  closed?: boolean;
  style?: 'solid' | 'crayon';
  type?: 'text';
  text?: string;
  fontSize?: number;
  fontFamily?: string;
}

// ============================================
// Global Types
// ============================================

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}