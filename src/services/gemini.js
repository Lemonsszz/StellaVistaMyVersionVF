import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function preguntarGemini(pregunta, onChunk) {
  const response = await ai.models.generateContentStream({
    model: "gemini-3.5-flash-lite", 
    contents: pregunta,
  });

  let textoCompleto = "";

  for await (const chunk of response) {
    if (chunk.text) {
      textoCompleto += chunk.text;
      onChunk(textoCompleto);
    }
  }

  return textoCompleto;
}