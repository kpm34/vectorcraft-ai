import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  // Fallback to Vite env var if process.env is not populated (client-side)
  const apiKey = process.env.API_KEY || import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing. AI features may fail.");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const processSvgWithAi = async (
  currentSvgContent: string,
  prompt: string
): Promise<string> => {
  const ai = getAiClient();
  
  const systemInstruction = `
    You are an expert Vector Graphics Engineer and SVG optimizer.
    Your goal is to manipulate SVG code based on user requests.
    
    Rules:
    1. Return ONLY valid standard SVG code.
    2. Do not wrap the output in markdown code blocks (no \`\`\`xml or \`\`\`svg).
    3. Do not add any conversational text. Just the code.
    4. If the user asks to "smooth" or "clean", optimize the paths using Bezier curves and minimize control points while preserving the shape.
    5. Maintain the viewBox if possible, unless asked to change.
    6. Ensure all tags are properly closed.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Here is the current SVG code:
        ${currentSvgContent}

        User Instruction: ${prompt}
      `,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    let result = response.text;
    if (!result) return currentSvgContent;

    // Cleanup: Remove any accidental markdown if the model ignores instructions
    result = result.replace(/```svg/g, '').replace(/```xml/g, '').replace(/```/g, '').trim();
    
    // Basic validation check
    if (!result.includes('<svg')) {
      throw new Error("Invalid SVG response from AI");
    }

    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export interface VectorizeConfig {
  mode?: 'logo-clean' | 'icon' | 'illustration' | 'auto';
  complexity: 'low' | 'medium' | 'high';
  maxColors?: number;
  removeBackground?: boolean;
}

export const bitmapToSvg = async (
  base64Data: string, 
  mimeType: string,
  config: VectorizeConfig = { complexity: 'medium', removeBackground: false }
): Promise<string> => {
  const ai = getAiClient();
  const maxColors = config.maxColors || 16;
  const mode = config.mode || 'auto';
  
  const basePrompt = 'Convert this image to clean, optimized SVG code.';
  
  let stylePrompt = "";
  
  // Mode-specific prompting (Matching the Backend API logic)
  switch (mode) {
    case 'logo-clean':
      stylePrompt = `${basePrompt} This is a logo - prioritize clean paths, minimal colors (max ${maxColors}), and small file size. Remove any background. Use simple geometric shapes where possible.`;
      break;
    case 'icon':
      stylePrompt = `${basePrompt} This is an icon - create simple, recognizable shapes with consistent stroke width. Normalize to a square viewBox. Use no more than ${maxColors} colors. Ensure grid alignment.`;
      break;
    case 'illustration':
      stylePrompt = `${basePrompt} This is detailed artwork/sketch - preserve details, trace lines accurately, use gradients if needed, and allow up to ${maxColors} colors. Maintain visual fidelity to the original.`;
      break;
    case 'auto':
    default:
      // Legacy/Fallback logic based on complexity
      if (config.complexity === 'low') {
         stylePrompt = "Create a minimal, low-detail, icon-style SVG. Use very few colors (flat), simple geometric shapes, and thick clear strokes if needed. Avoid noise.";
      } else if (config.complexity === 'high') {
         stylePrompt = "Create a highly detailed vector illustration. Capture fine details, use varied line weights, and a richer color palette. Try to match the original image closely.";
      } else {
         stylePrompt = "Convert this image into a clean, flat SVG vector illustration. Balance detail with simplicity.";
      }
      break;
  }

  const bgPrompt = config.removeBackground 
    ? "Do not include any background rectangle or fill. The background should be transparent." 
    : "";

  const systemInstruction = `
    You are an expert SVG Vectorizer.
    Convert the provided raster image into a clean, simplified Scalable Vector Graphics (SVG) file.
    
    Rules:
    1. Output ONLY valid SVG code.
    2. Use <path> elements primarily.
    3. ${stylePrompt}
    4. ${bgPrompt}
    5. Do not use <image> tags to embed the raster. 
    6. Do not include markdown backticks or explanations. Just the raw SVG string.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: "Vectorize this image."
          }
        ]
      },
      config: {
        systemInstruction: systemInstruction
      }
    });

    let result = response.text;
    if (!result) throw new Error("No response from AI");

    // cleanup
    result = result.replace(/```svg/g, '').replace(/```xml/g, '').replace(/```/g, '').trim();
    
    if (!result.includes('<svg')) {
       // Fallback if it returned just paths without wrapper
       return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${result}</svg>`;
    }

    return result;
  } catch (error) {
    console.error("Gemini Vectorization Error:", error);
    throw error;
  }
};
