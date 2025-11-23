import { GoogleGenAI } from "@google/genai";
import { TextureMode, ModelQuality } from "../types";

export const generateTextureImage = async (
  prompt: string,
  mode: TextureMode,
  quality: ModelQuality,
  resolution: '1K' | '2K' = '1K'
): Promise<string> => {
  // Always initialize with the latest key from process.env
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });

  // Force Pro model if resolution is 2K, otherwise use selected quality
  const modelName = (quality === ModelQuality.HIGH || resolution === '2K')
    ? 'gemini-3-pro-image-preview' 
    : 'gemini-2.5-flash-image';

  // Construct a specialized prompt based on the mode
  let finalPrompt = "";
  if (mode === TextureMode.MATCAP) {
    finalPrompt = `A high-quality 3D material capture (MatCap) sphere of ${prompt}. The image should be a single perfectly round sphere centered on a pitch black background, showcasing the lighting, reflection, and material properties cleanly. No other objects or background details.`;
  } else {
    finalPrompt = `A high-quality, seamless, top-down, flat texture pattern of ${prompt}. Even lighting, no shadows from external objects, tileable, 4k texture quality.`;
  }

  // Config varies by model
  const imageConfig: any = {
    aspectRatio: "1:1",
  };

  // imageSize is only supported by the Pro model
  // We check modelName instead of quality variable to ensure we cover the forced upgrade case
  if (modelName === 'gemini-3-pro-image-preview') {
    imageConfig.imageSize = resolution;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: finalPrompt }],
      },
      config: {
        imageConfig,
      },
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};