import { GoogleGenAI, Type } from "@google/genai";
import { Product, InventoryStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

export const suggestProductDetails = async (productName: string): Promise<any> => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found. Mocking response.");
    return {
        description: `High-quality ${productName} perfect for everyday use.`,
        category: "General",
        suggestedPrice: 29.99
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Generate a concise marketing description (max 2 sentences), a general retail category, and a suggested retail price (number only) for a product named "${productName}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            suggestedPrice: { type: Type.NUMBER },
          },
          required: ["description", "category", "suggestedPrice"],
        },
      },
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini suggestProductDetails error:", error);
    throw error;
  }
};

export const analyzeInventoryTrends = async (products: Product[]): Promise<string> => {
   if (!process.env.API_KEY) return "AI Insights unavailable (Missing API Key).";

   // Summarize data to save tokens
   const summary = products.map(p => `${p.name} (${p.category}): Stock ${p.stock}, Price $${p.price}`).join('\n');
   
   try {
     const response = await ai.models.generateContent({
       model: MODEL_NAME,
       contents: `Analyze this inventory list and provide 3 short, actionable bullet points for the store manager regarding stock levels, pricing balance, or potential merchandising gaps. Keep it under 100 words.\n\n${summary}`,
     });
     return response.text || "No insights generated.";
   } catch (error) {
     console.error("Gemini analyzeInventoryTrends error:", error);
     return "Could not generate insights at this time.";
   }
}
