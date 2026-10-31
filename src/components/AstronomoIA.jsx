// src/components/AstronomoIA.jsx
import { Sparkles, Send } from "lucide-react";
import { useState } from "react";
import { preguntarGemini } from "../services/gemini";

export function AstronomoIA() {
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensajes, setMensajes] = useState([]);

  const enviarPregunta = async () => {
    if (!mensaje.trim() || cargando) return;

    const pregunta = mensaje.trim();

    setMensaje("");
    setCargando(true);

    // Mostrar inmediatamente la pregunta del usuario
    setMensajes((prev) => [
      ...prev,
      {
        tipo: "usuario",
        texto: pregunta,
      },
    ]);
    setMensajes((prev) => [
      ...prev,
      {
        tipo: "ia",
        texto: "",
      },
    ]);

    try {
      await preguntarGemini(pregunta, (texto) => {
        setMensajes((prev) => {
          const nuevos = [...prev];
          const ultimo = nuevos[nuevos.length - 1];

          if (ultimo?.tipo === "ia") {
            ultimo.texto = texto;
          } else {
            nuevos.push({
              tipo: "ia",
              texto: texto,
            });
          }

          return nuevos;
        });
      });
    } catch (error) {
      console.error("ERROR GEMINI:", error);

      setMensajes((prev) => [
        ...prev,
        {
          tipo: "ia",
          texto: "No pude obtener una respuesta.",
        },
      ]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0d16] overflow-hidden">
      {/* Cabecera del panel de IA */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 shrink-0">
        <div className="p-1.5 rounded-lg bg-purple-500/15">
          <Sparkles size={16} className="text-purple-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Astrónomo IA</h3>
          <p className="text-[10px] text-gray-400">Asistente astronómico</p>
        </div>
      </div>

      {/* Mensajes scrollable */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        <div className="rounded-xl bg-white/5 border border-white/5 p-3">
          <p className="text-xs text-gray-300 leading-relaxed">
            Hola, Soy el Astrónomo IA de STELLAVISTA.
          </p>
          <p className="mt-2 text-xs text-gray-400 leading-relaxed">
            Puedo ayudarte a interpretar las condiciones astronómicas y planificar tus observaciones.
          </p>
        </div>

        {mensajes.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.tipo === "usuario" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={
                msg.tipo === "usuario"
                  ? "max-w-[85%] rounded-xl bg-purple-500/20 border border-purple-500/20 px-3 py-2 text-xs text-gray-200 leading-relaxed whitespace-pre-line"
                  : "max-w-[85%] rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-xs text-gray-300 leading-relaxed whitespace-pre-line"
              }
            >
              {msg.texto}
            </div>
          </div>
        ))}

        {cargando && mensajes[mensajes.length - 1]?.tipo !== "ia" && (
          <div className="text-xs text-purple-400 flex items-center gap-1.5 pt-1">
            <Sparkles size={13} className="animate-spin" /> Analizando...
          </div>
        )}
      </div>

      {/* Input de envío */}
      <div className="p-3 border-t border-white/10 bg-[#0b0d16] shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                enviarPregunta();
              }
            }}
            placeholder="Pregúntame algo..."
            className="
              flex-1
              bg-white/5
              border border-white/10
              rounded-lg
              px-3 py-2.5
              text-xs text-white
              placeholder:text-gray-500
              outline-none
              focus:border-purple-500/50
            "
          />

          <button
            onClick={enviarPregunta}
            disabled={cargando || !mensaje.trim()}
            className="
              p-2.5 rounded-lg
              bg-purple-500/80
              hover:bg-purple-500
              disabled:opacity-40
              disabled:cursor-not-allowed
              text-white
              transition
            "
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}