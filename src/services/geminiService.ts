import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AnalysisResult {
  score: number;
  vibeCheck: string;
  greenFlags: string[];
  redFlags: string[];
}

export async function analyzeMPesaData(rawText: string): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are a "SME Risk Analyst" for the Kenyan hustle economy. 
    Your job is to analyze M-Pesa transaction patterns (which might be raw SMS logs, text descriptions, or JSON) 
    and provide a credit score (0-100) and a "Vibe Check".
    
    The "Vibe Check" must be written in a mix of Sheng and English (Kenyan urban slang). 
    It should be relatable, encouraging but honest.
    
    Look for:
    - Green Flags: Consistent utility payments (KPLC, Nairobi Water), steady Till/Paybill inflows, regular savings, timely Fuliza repayments.
    - Red Flags: Chronic Fuliza cycles without repayment, high gambling activity (Betika, Sportpesa), inconsistent income, frequent reversals.
    
    Output MUST be in JSON format.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER, description: "Credit score from 0 to 100" },
      vibeCheck: { type: Type.STRING, description: "Justification in Sheng/English" },
      greenFlags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of positive behaviors" },
      redFlags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of negative behaviors" }
    },
    required: ["score", "vibeCheck", "greenFlags", "redFlags"]
  };

  try {
    const result = await ai.models.generateContent({
      model,
      contents: [
        { text: `Analyze this M-Pesa transaction data (could be SMS logs or text): ${rawText}` }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema
      }
    });

    const text = result.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
}
