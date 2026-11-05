import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const model = import.meta.env.VITE_GEMINI_MODEL || "gemini-3.5-flash-lite";

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const construirContents = (pregunta, historial) => {
  const contents = historial
    .filter(
      (mensaje) =>
        mensaje?.texto?.trim() &&
        !mensaje.error &&
        (mensaje.tipo === "usuario" || mensaje.tipo === "ia")
    )
    .map((mensaje) => ({
      role: mensaje.tipo === "usuario" ? "user" : "model",
      parts: [{ text: mensaje.texto }],
    }));

  contents.push({
    role: "user",
    parts: [{ text: pregunta }],
  });

  return contents;
};

export async function preguntarGemini(pregunta, onChunk, opciones = {}) {
  const { systemInstruction, historial = [] } = opciones;

  if (!ai) {
    throw new Error(
      "Falta configurar VITE_GEMINI_API_KEY en el archivo .env del proyecto."
    );
  }

  const response = await ai.models.generateContentStream({
    model,
    contents: construirContents(pregunta, historial),
    config: {
      systemInstruction,
      temperature: 0.35,
      maxOutputTokens: 900,
    },
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
