/**
 * Client-side generation of Normal and Roughness maps from an Albedo image.
 * This avoids needing extra AI calls and ensures the maps line up perfectly pixel-wise.
 */

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const generateNormalMap = async (base64Image: string, strength: number = 2.0): Promise<string> => {
  const img = await loadImage(base64Image);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const width = canvas.width;
  const height = canvas.height;

  const outputData = ctx.createImageData(width, height);
  const output = outputData.data;

  const getGrayscale = (x: number, y: number) => {
    // Clamp coordinates
    const cx = Math.max(0, Math.min(width - 1, x));
    const cy = Math.max(0, Math.min(height - 1, y));
    const idx = (cy * width + cx) * 4;
    // Simple luminance
    return data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Sobel operator-ish approach
      const tl = getGrayscale(x - 1, y - 1);
      const t  = getGrayscale(x, y - 1);
      const tr = getGrayscale(x + 1, y - 1);
      const l  = getGrayscale(x - 1, y);
      const r  = getGrayscale(x + 1, y);
      const bl = getGrayscale(x - 1, y + 1);
      const b  = getGrayscale(x, y + 1);
      const br = getGrayscale(x + 1, y + 1);

      const dX = (tr + 2 * r + br) - (tl + 2 * l + bl);
      const dY = (bl + 2 * b + br) - (tl + 2 * t + tr);
      const dZ = 255 / strength;

      const len = Math.sqrt(dX * dX + dY * dY + dZ * dZ);

      // Normalize to 0-1 range then to 0-255
      const nx = ((dX / len) * 0.5 + 0.5) * 255;
      const ny = ((dY / len) * 0.5 + 0.5) * 255;
      const nz = ((dZ / len) * 0.5 + 0.5) * 255;

      const idx = (y * width + x) * 4;
      output[idx] = nx;
      output[idx + 1] = ny;
      output[idx + 2] = nz;
      output[idx + 3] = 255;
    }
  }

  ctx.putImageData(outputData, 0, 0);
  return canvas.toDataURL("image/png");
};

export const generateRoughnessMap = async (base64Image: string, invert: boolean = true): Promise<string> => {
  const img = await loadImage(base64Image);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    // Luminance
    const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    
    // For roughness, usually high luminance = rough, low = glossy.
    // Sometimes invert is needed depending on material type.
    // We add a contrast curve to make it punchier
    let val = invert ? 255 - lum : lum;
    
    // Contrast boost
    val = (val - 128) * 1.2 + 128; 
    val = Math.max(0, Math.min(255, val));

    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL("image/png");
};