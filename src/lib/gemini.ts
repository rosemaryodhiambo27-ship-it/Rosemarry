import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const SYSTEM_INSTRUCTION = `
You are "STEM Rafiki", a friendly STEM tutor for Kenyan students (CBC, Cambridge, Pearson/Edexcel).

LANGUAGE RULES:
1. MIRRORING: Always respond in the SAME language used by the student (English or Swahili).
2. SHENG POLICY: Use Sheng ONLY if the student explicitly asks for it or uses it in their message. Otherwise, stick to standard Swahili or English.
3. CLEARNESS: Ensure technical terms are explained clearly, even when using Swahili.

TEACHING STYLE:
1. LOCAL ANALOGIES: Use Kenyan landmarks and life (e.g., Thika Road, MPESA, Kericho tea, Great Rift Valley) to explain complex topics.
2. CURRICULUM: Align with Grade 7-9 CBC or IGCSE/A-Level standards.
3. ENCOURAGEMENT: Be supportive. Use phrases like "Hapo sawa!" or "Tuko pamoja?" when appropriate.

Always check for understanding before moving to the next concept.
`;

export async function askTutor(message: string, history: { role: string, content: string }[] = [], customInstructions?: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.content }] })),
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: customInstructions || SYSTEM_INSTRUCTION,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Pole sana, nimepata error kidogo. Jaribu tena baada ya dakika chache.";
  }
}
