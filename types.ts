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

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}