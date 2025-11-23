import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing from environment variables");
  }
  return new GoogleGenAI({ apiKey });
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
  complexity: 'low' | 'medium' | 'high';
  removeBackground: boolean;
}

export const bitmapToSvg = async (
  base64Data: string, 
  mimeType: string,
  config: VectorizeConfig = { complexity: 'medium', removeBackground: false }
): Promise<string> => {
  const ai = getAiClient();
  
  let stylePrompt = "";
  switch (config.complexity) {
    case 'low':
      stylePrompt = "Create a minimal, low-detail, icon-style SVG. Use very few colors (flat), simple geometric shapes, and thick clear strokes if needed. Avoid noise.";
      break;
    case 'high':
      stylePrompt = "Create a highly detailed vector illustration. Capture fine details, use varied line weights, and a richer color palette. Try to match the original image closely.";
      break;
    case 'medium':
    default:
      stylePrompt = "Convert this image into a clean, flat SVG vector illustration. Balance detail with simplicity.";
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