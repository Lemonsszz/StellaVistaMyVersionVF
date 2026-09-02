import { Sparkles, X, Send } from "lucide-react";
import { useState } from "react";
import { preguntarGemini } from "../services/gemini";

export function AstronomoIA() {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [cargando, setCargando] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState("");
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
const resultado = await preguntarGemini(pregunta, (texto) => {
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
    <>
      {/* Botón flotante */}
      {!abierto && (
        <button
          onClick={() => setAbierto(true)}
          className="
            absolute bottom-6 left-6 z-30
            flex items-center gap-2
            px-4 py-3
            rounded-full
            bg-gradient-to-r from-indigo-500 to-purple-600
            hover:from-indigo-400 hover:to-purple-500
            text-white text-xs font-semibold
            shadow-lg shadow-purple-500/30
            hover:scale-105
            transition-all duration-200
          "
        >
          <Sparkles size={17} />
          Astrónomo IA
        </button>
      )}

      {/* Panel */}
      {abierto && (
        <div
          className="
            absolute bottom-6 left-6 z-30
            w-[360px]
            h-[460px]
            flex flex-col
            rounded-2xl
            bg-[#0b0d16]/95
            backdrop-blur-xl
            border border-white/10
            shadow-2xl shadow-black/50
            overflow-hidden
          "
        >
          {/* Cabecera */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/15">
                <Sparkles size={17} className="text-purple-400" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">
                  Astrónomo IA
                </h3>

                <p className="text-[10px] text-gray-500">
                  Asistente astronómico
                </p>
              </div>
            </div>

            <button
              onClick={() => setAbierto(false)}
              className="text-gray-500 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mensaje inicial */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="rounded-xl bg-white/5 border border-white/5 p-3">
              <p className="text-xs text-gray-300 leading-relaxed">
                Hola, Soy el Astrónomo IA de STELLAVISTA.
              </p>

              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                Puedo ayudarte a interpretar las condiciones astronómicas y
                planificar tus observaciones.
              </p>
              {mensajes.map((msg, index) => (
  <div
    key={index}
    className={`mt-3 flex ${
      msg.tipo === "usuario" ? "justify-end" : "justify-start"
    }`}
  >
    <div
      className={
        msg.tipo === "usuario"
          ? "max-w-[85%] rounded-xl bg-purple-500/20 border border-purple-500/20 px-3 py-2"
          : "max-w-[85%] rounded-xl bg-white/5 border border-white/5 px-3 py-2"
      }
    >
      <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
        {msg.texto}
      </p>
    </div>
  </div>
))}
            </div>

{cargando && mensajes[mensajes.length - 1]?.tipo !== "ia" && (
  <div className="mt-3 text-xs text-purple-400">
    Analizando... ✨
  </div>
)}

          </div>

          {/* Entrada */}
          <div className="p-3 border-t border-white/10">
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
                  placeholder:text-gray-600
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
      )}
    </>
  );
}