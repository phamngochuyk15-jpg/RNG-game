import { GoogleGenAI } from "@google/genai";

export const generateAuraLore = async (auraName: string, chance: number): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Fix: Removed maxOutputTokens as recommended by GenAI guidelines to avoid response blocking and potential thinking budget issues.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short, poetic 1-sentence description or "blessing" for a mystical aura named "${auraName}" that has a 1 in ${chance.toLocaleString()} rarity. Keep it mysterious, ethereal, and elegant.`,
      config: {
        temperature: 0.9,
      }
    });
    return response.text?.trim() || "An aura of quiet mystery.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The stars whisper your name in the void.";
  }
};