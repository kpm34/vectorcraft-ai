import { GoogleGenAI } from "@google/genai";
import { TextureMode, ModelQuality } from "../types/types";

export const generateTextureImage = async (
  prompt: string,
  mode: TextureMode,
  quality: ModelQuality,
  resolution: '1K' | '2K' = '1K'
): Promise<string> => {
  // Always initialize with the latest key from process.env
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error('No API key found. Please set GEMINI_API_KEY environment variable.');
  }

  const ai = new GoogleGenAI({ apiKey });

  // Force Pro model if resolution is 2K, otherwise use selected quality
  const modelName = (quality === ModelQuality.HIGH || resolution === '2K')
    ? 'gemini-3-pro-image-preview'
    : 'gemini-2.5-flash-image';

  console.log(`Using model: ${modelName}, mode: ${mode}, quality: ${quality}, resolution: ${resolution}`);

  // Construct a specialized prompt based on the mode
  let finalPrompt = "";
  if (mode === TextureMode.MATCAP) {
    finalPrompt = `A high-quality 3D material capture (MatCap) sphere of ${prompt}. The image should be a single perfectly round sphere centered on a pitch black background, showcasing the lighting, reflection, and material properties cleanly. No other objects or background details.`;
  } else {
    finalPrompt = `A high-quality, seamless, top-down, flat texture pattern of ${prompt}. Even lighting, no shadows from external objects, tileable, 2-4k texture quality.`;
  }

  // Config for image generation
  const imageConfig: any = {
    aspectRatio: "1:1",
  };

  // imageSize is only supported by Gemini 3 Pro
  if (modelName === 'gemini-3-pro-image-preview') {
    imageConfig.imageSize = resolution;
  }

  console.log('Image config:', imageConfig);

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

    console.log('Gemini API Response:', JSON.stringify(response, null, 2));

    // Extract image from response
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      console.error('No candidates in response');
      throw new Error("No candidates found in API response. The model may have blocked the request.");
    }

    const parts = candidates[0]?.content?.parts;
    if (!parts || parts.length === 0) {
      console.error('No parts in candidate');
      throw new Error("No content parts found in API response.");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        console.log('Found image data, size:', part.inlineData.data.length);
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    // Log what we actually got
    console.error('Response parts:', JSON.stringify(parts, null, 2));
    throw new Error("No image data found in response. Check console for details.");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    if (error instanceof Error) {
      throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw error;
  }
};