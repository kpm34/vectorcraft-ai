import ImageTracer from 'imagetracerjs';

export interface TracerConfig {
  ltres?: number; // Linear error (lower = more detail)
  qtres?: number; // Quadratic error (lower = more detail)
  pathomit?: number; // Remove paths shorter than this
  colorsampling?: number; // 0=disabled, 1=random, 2=deterministic
  numberofcolors?: number;
  mincolorratio?: number;
  colorquantcycles?: number;
  scale?: number;
  simplify?: number; // Custom smoothing
}

export const traceBitmap = (
  base64Data: string,
  config: TracerConfig = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const options = {
      ltres: config.ltres ?? 1,
      qtres: config.qtres ?? 1,
      pathomit: config.pathomit ?? 8,
      colorsampling: config.colorsampling ?? 2, // Deterministic
      numberofcolors: config.numberofcolors ?? 16,
      mincolorratio: config.mincolorratio ?? 0,
      colorquantcycles: config.colorquantcycles ?? 3,
      scale: config.scale ?? 1,
      strokewidth: 1,
      linefilter: true,
      ...config
    };

    try {
      // ImageTracer.imageToSVG takes a URL/URI, callback, and options
      ImageTracer.imageToSVG(
        `data:image/png;base64,${base64Data}`,
        (svgString) => {
          if (!svgString) {
            reject(new Error("Tracing failed to produce SVG"));
            return;
          }
          resolve(svgString);
        },
        options
      );
    } catch (err) {
      reject(err);
    }
  });
};

