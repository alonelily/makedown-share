import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

export const enhanceMarkdown = async (content: string, instruction: string): Promise<string> => {
  const ai = getClient();
  
  // Using gemini-3-flash-preview as per guidelines for text tasks
  const model = "gemini-3-flash-preview";

  const prompt = `
    You are an expert technical editor and Markdown specialist.
    Your task is to improve the following Markdown text based on this instruction: "${instruction}".
    
    Rules:
    1. Output ONLY the improved Markdown content. Do not add conversational text.
    2. Preserve the original meaning and structure unless asked to restructure.
    3. Ensure all Markdown syntax is valid and standard.
    
    Input Markdown:
    ${content}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    if (response.text) {
      return response.text;
    }
    
    throw new Error("No response from AI");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};