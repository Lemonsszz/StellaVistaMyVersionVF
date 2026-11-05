import { useState } from "react";
import { ChevronDown, ChevronUp, CalendarDays, Clock, MapPin } from "lucide-react";
import { eventosAstronomicos } from "../data/eventosAstronomicos";
import { Sparkles } from "lucide-react";
import { Gauge } from "lucide-react";
import { AnimatedPresence } from "./AnimatedPresence";

const nombresMeses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function EventosAstronomicos({ onVerEnMapa }) {
  const [abierto, setAbierto] = useState(false);

  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth();
  const eventos = eventosAstronomicos[mesActual] || [];

  return (
    <div
      className="absolute inset-x-4 top-4 bottom-20 z-20 flex min-h-0 flex-col pointer-events-none font-sans sm:left-auto sm:right-4 sm:w-[360px] max-[900px]:fixed max-[900px]:left-auto max-[900px]:top-16 max-[900px]:bottom-28 max-[900px]:right-4 max-[900px]:w-[min(360px,calc(100vw-2rem))]"
    >
      
      {/* CABECERA */}
      <button
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-controls="eventos-astronomicos-panel"
        className="w-full flex items-center justify-between gap-3
        rounded-2xl glass-card
        px-5 py-3 text-left
        hover:border-purple-400/25 hover:bg-white/[0.02]
        transition-all duration-300 pointer-events-auto group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 group-hover:bg-purple-500/15 transition-colors">
            <Sparkles size={18} strokeWidth={1.8} />
          </div>

          <div className="text-left">
            <p className="font-medium text-sm text-white">
              Eventos astronómicos
            </p>

            <p className="text-[10px] font-mono tracking-[0.14em] uppercase text-ink-400 mt-0.5">
              {nombresMeses[mesActual]} {fechaActual.getFullYear()}
            </p>
          </div>
        </div>

        <span className="text-ink-400 group-hover:text-purple-200 transition-colors">
          {abierto ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </span>
      </button>

      {/* CONTENIDO */}
      <AnimatedPresence
        id="eventos-astronomicos-panel"
        show={abierto}
        mode="expand"
        className="min-h-0 pointer-events-auto"
        duration={480}
      >
        <div className="flex h-full min-h-0 flex-col pt-2">
          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain
            rounded-2xl glass-card
            p-3"
          >
          {eventos.length === 0 ? (
            <div className="text-center text-ink-400 py-8">
              <div className="text-4xl mb-3">🔭</div>

              <p className="text-sm">
                No hay eventos registrados para este mes.
              </p>
            </div>
          ) : (
            <div className="space-y-3">

              {eventos.slice(0, 3).map((evento) => (
                <article
                  key={evento.id}
                  className="overflow-hidden rounded-xl
                  bg-white/[0.02] border border-white/[0.05]
                  hover:border-purple-400/20 hover:bg-white/[0.035]
                  transition-all duration-300"
                >

                  {/* IMAGEN */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={evento.imagen}
                      alt={evento.titulo}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-cosmos-950/80 via-transparent to-transparent pointer-events-none" />

                    <div
                      className="absolute bottom-3 left-3 flex items-center gap-1.5
                      rounded-full bg-black/60 backdrop-blur-md
                      border border-white/10 px-2.5 py-1
                      text-[10px] font-mono text-purple-200"
                    >
                      {evento.icono} {evento.tipo}
                    </div>
                  </div>

                  {/* INFORMACIÓN */}
                  <div className="p-4 text-white">

                    <h3 className="font-semibold text-sm">
                      {evento.titulo}
                    </h3>

                    <div className="mt-3 space-y-2 text-[11px] font-mono text-ink-400">

                      <div className="flex items-center gap-2">
                        <CalendarDays size={14} className="text-purple-300/80" />
                        {evento.fecha}
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-purple-300/80" />
                        {evento.horario}
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="mt-0.5 text-purple-300/80" />
                        <span>{evento.visibilidad}</span>
                      </div>

                    </div>

                    {/* IMPORTANCIA */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gauge
                          size={15}
                          strokeWidth={1.7}
                          className="text-purple-400"
                        />

                        <span className="text-[11px] text-ink-400">
                          Importancia
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Barra */}
                        <div className="w-20 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-ethereal-indigo to-ethereal-purple transition-all"
                            style={{
                              width: `${(evento.importancia / 5) * 100}%`,
                            }}
                          />
                        </div>

                        {/* Nivel */}
                        <span className="text-[10px] font-mono text-ink-400 min-w-[20px]">
                          {evento.importancia}/5
                        </span>

                        {/* Reloj */}
                        <Clock
                          size={15}
                          strokeWidth={1.7}
                          className="text-ink-500"
                          title={evento.horario}
                        />
                      </div>
                    </div>
                  {/* DESCRIPCIÓN */}
                  <p className="mt-3 text-[11px] leading-relaxed text-ink-400">
                    {evento.descripcion}
                  </p>

                  {/* VISIBILIDAD */}
                  <div className="mt-3 rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                    <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-ink-500 mb-1">
                        Visibilidad
                    </p>

                    <p className="text-[11px] text-ink-300 leading-relaxed">
                      {evento.visibilidad}
                    </p>
                  </div>
                  

                  {/* RECOMENDACIÓN */}
                  <div className="mt-2 rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                    <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-ink-500 mb-1">
                        Recomendación
                    </p>

                    <p className="text-[11px] text-ink-300 leading-relaxed">
                      {evento.recomendacion}
                    </p>
                  </div>

                  {/* BOTÓN */}
                <button
                  onClick={() => onVerEnMapa?.(evento)}
                  className="
                    mt-4 w-full
                    flex items-center justify-center gap-2
                    rounded-xl
                    bg-gradient-to-r from-purple-500/25 to-indigo-500/25
                    hover:from-purple-500/35 hover:to-indigo-500/35
                    border border-purple-400/30
                    py-2.5
                    text-[11px] font-mono font-medium tracking-[0.08em] text-purple-100
                    shadow-glow-subtle
                    hover:-translate-y-0.5
                    active:translate-y-0
                    transition-all duration-300
                  "
                >
                  Explorar en el mapa
                </button>
                  </div>
                </article>
              ))}

              </div>
          )}
          </div>
        </div>
      </AnimatedPresence>
    </div>
  );
}

//ENTREGA FINAL 11/10/2026
