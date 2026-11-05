// src/components/AstronomoIA.jsx
import { Sparkles, Send, MapPin, Telescope, CalendarDays } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { preguntarGemini } from "../services/gemini";
import { useAstroStore } from "../store/useAstroStore";
import { useCondicionesNocturnas } from "../hooks/useCondicionesNocturnas";
import { fetchCondicionesSitios } from "../services/sitiosCondiciones";
import {
  construirContexto,
  construirInstruccionSistema,
} from "../services/astroContext";

const SUGERENCIAS = [
  {
    Icono: MapPin,
    texto: "¿Cuál es el mejor lugar para observar el cielo a esta hora en Oruro?",
  },
  {
    Icono: Telescope,
    texto:
      "Analiza las condiciones del punto que seleccioné en el mapa y dime si vale la pena observar.",
  },
  {
    Icono: CalendarDays,
    texto:
      "¿Qué eventos astronómicos hay este mes y cuáles puedo ver desde aquí?",
  },
];

const getMensajeError = (error) => {
  const detalle = String(error?.message ?? error ?? "");

  if (detalle.includes("VITE_GEMINI_API_KEY") || /api key/i.test(detalle)) {
    return "Falta configurar la clave de Gemini en el archivo .env (VITE_GEMINI_API_KEY).";
  }

  if (detalle.includes("429") || /quota|rate limit|resource exhausted/i.test(detalle)) {
    return "El servicio de IA alcanzó su límite de consultas. Espera un momento y vuelve a intentarlo.";
  }

  if (/failed to fetch|network|load failed/i.test(detalle)) {
    return "No pude conectar con el servicio de IA. Revisa tu conexión a internet.";
  }

  return "No pude obtener una respuesta. Revisa tu conexión e inténtalo de nuevo.";
};

export function AstronomoIA({ eventoSeleccionado }) {
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensajes, setMensajes] = useState([]);

  const { coordinates, layers } = useAstroStore();
  const { data } = useCondicionesNocturnas();

  const { data: sitiosData } = useQuery({
    queryKey: ["sitios-condiciones", "astronomo-ia"],
    queryFn: () => fetchCondicionesSitios(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchInterval: 1000 * 60 * 10,
    retry: 1,
  });

  const enviarPregunta = async (preguntaSugerida) => {
    const pregunta = (
      typeof preguntaSugerida === "string" ? preguntaSugerida : mensaje
    ).trim();

    if (!pregunta || cargando) return;

    // Guardamos el historial antes de agregar la pregunta actual.
    const historial = mensajes;

    setMensaje("");
    setCargando(true);

    setMensajes((prev) => [
      ...prev,
      { tipo: "usuario", texto: pregunta },
      { tipo: "ia", texto: "" },
    ]);

    try {
      const contexto = construirContexto({
        coordinates,
        data,
        layers,
        sitios: sitiosData?.sitios,
        eventoSeleccionado,
      });

      const respuesta = await preguntarGemini(
        pregunta,
        (texto) => {
          setMensajes((prev) => {
            const nuevos = [...prev];
            const ultimo = nuevos[nuevos.length - 1];

            if (ultimo?.tipo === "ia") {
              ultimo.texto = texto;
            } else {
              nuevos.push({ tipo: "ia", texto });
            }

            return nuevos;
          });
        },
        {
          systemInstruction: construirInstruccionSistema(contexto),
          historial,
        }
      );

      if (!respuesta?.trim()) {
        setMensajes((prev) => {
          const nuevos = [...prev];
          const ultimo = nuevos[nuevos.length - 1];

          if (ultimo?.tipo === "ia") {
            ultimo.texto =
              "No obtuve una respuesta del modelo. Intenta reformular la pregunta.";
            ultimo.error = true;
          }

          return nuevos;
        });
      }
    } catch (error) {
      console.error("ERROR GEMINI:", error);

      setMensajes((prev) => {
        const nuevos = [...prev];
        const ultimo = nuevos[nuevos.length - 1];
        const textoError = getMensajeError(error);

        if (ultimo?.tipo === "ia" && !ultimo.texto) {
          ultimo.texto = textoError;
          ultimo.error = true;
        } else {
          nuevos.push({ tipo: "ia", texto: textoError, error: true });
        }

        return nuevos;
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden font-sans">
      {/* Cabecera del panel de IA */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.06] shrink-0">
        <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <Sparkles size={15} className="text-purple-300" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xs font-medium text-white">Astrónomo IA</h3>
          <p className="text-[10px] font-mono text-ink-500 flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                data
                  ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                  : "bg-amber-400 animate-pulse"
              }`}
            />
            {data ? "Contexto GIS activo" : "Sincronizando contexto"}
          </p>
        </div>
      </div>

      {/* Mensajes scrollable */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-3">
          <p className="text-xs text-ink-300 leading-relaxed">
            Hola, Soy el Astrónomo IA de STELLAVISTA.
          </p>
          <p className="mt-2 text-xs text-ink-400 leading-relaxed">
            Tengo tu punto del mapa, el clima, el índice Bortle, los sitios
            recomendados y los eventos astronómicos a la vista. Pregúntame lo
            que necesites o usa una sugerencia.
          </p>
        </div>

        {mensajes.length === 0 && (
          <div className="space-y-2">
            <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-ink-500">
              Preguntas sugeridas
            </p>

            {SUGERENCIAS.map((sugerencia) => (
              <button
                key={sugerencia.texto}
                onClick={() => enviarPregunta(sugerencia.texto)}
                disabled={cargando}
                className="group w-full flex items-start gap-2 rounded-xl border border-purple-400/15 bg-purple-500/[0.04] px-3 py-2 text-left transition-colors hover:bg-purple-500/[0.09] hover:border-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <sugerencia.Icono
                  size={13}
                  className="mt-0.5 shrink-0 text-purple-300"
                />
                <span className="text-[11px] leading-snug text-ink-300 group-hover:text-ink-100">
                  {sugerencia.texto}
                </span>
              </button>
            ))}
          </div>
        )}

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
                  ? "max-w-[85%] rounded-xl bg-purple-500/15 border border-purple-400/25 px-3 py-2 text-xs text-ink-200 leading-relaxed whitespace-pre-line"
                  : `max-w-[85%] rounded-xl bg-white/[0.02] border px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${
                      msg.error
                        ? "border-rose-400/25 text-rose-200"
                        : "border-white/[0.04] text-ink-300"
                    }`
              }
            >
              {msg.tipo === "ia" && !msg.texto && cargando ? (
                <span className="flex items-center gap-1.5 text-purple-300">
                  <Sparkles size={12} className="animate-spin" />
                  Analizando el contexto...
                </span>
              ) : (
                msg.texto
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input de envío */}
      <div className="p-3 border-t border-white/[0.06] bg-transparent shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                enviarPregunta();
              }
            }}
            placeholder="Pregunta sobre el cielo o tu punto..."
            className="
              flex-1
              bg-white/[0.03]
              border border-white/[0.07]
              rounded-xl
              px-3 py-2.5
              text-xs text-ink-100
              placeholder:text-ink-600
              outline-none
              transition-colors
              focus:border-purple-400/40
              focus:bg-white/[0.045]
            "
          />

          <button
            onClick={() => enviarPregunta()}
            disabled={cargando || !mensaje.trim()}
            className="
              p-2.5 rounded-xl
              bg-gradient-to-r from-purple-500/70 to-indigo-500/70
              hover:from-purple-500 hover:to-indigo-500
              border border-purple-400/30
              disabled:opacity-40
              disabled:cursor-not-allowed
              text-white
              transition-all duration-300
            "
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
