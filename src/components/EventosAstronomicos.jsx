import { useState } from "react";
import { ChevronDown, ChevronUp, CalendarDays, Clock, MapPin , Star} from "lucide-react";
import { eventosAstronomicos } from "../data/eventosAstronomicos";
import { Sparkles } from "lucide-react";
import { Gauge } from "lucide-react";

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
                className="absolute top-4 right-4 z-20 w-[360px] flex flex-col"
                style={{
                  bottom: "48px",
                }}
              >
      
      {/* CABECERA */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center justify-between 
        rounded-xl bg-black/80 backdrop-blur-md
        border border-white/10 px-4 py-3
        text-white shadow-xl hover:bg-black/90 transition"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <Sparkles size={22} strokeWidth={1.8} />
          </div>

          <div className="text-left">
            <p className="font-semibold text-sm">
              Eventos astronómicos
            </p>

            <p className="text-xs text-gray-400">
              {nombresMeses[mesActual]} {fechaActual.getFullYear()}
            </p>
          </div>
        </div>

        {abierto ? (
          <ChevronUp size={20} />
        ) : (
          <ChevronDown size={20} />
        )}
      </button>

      {/* CONTENIDO */}
      {abierto && (
        <div
          className="mt-2 max-h-[75vh] overflow-y-auto
          rounded-xl bg-black/85 backdrop-blur-md
          border border-white/10 shadow-2xl p-3"
        >
          {eventos.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl mb-3">🔭</div>

              <p className="text-sm">
                No hay eventos registrados para este mes.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {eventos.slice(0, 3).map((evento) => (
                <article
                  key={evento.id}
                  className="overflow-hidden rounded-xl
                  bg-white/5 border border-white/10
                  hover:bg-white/10 transition"
                >

                  {/* IMAGEN */}
                  <div className="relative h-40">
                    <img
                      src={evento.imagen}
                      alt={evento.titulo}
                      className="w-full h-full object-cover"
                    />

                    <div
                      className="mt-2 flex-1 min-h-0 overflow-y-auto
                      rounded-xl /85 backdrop-blur-md
                      border border-white/10"
                    >
                      {evento.icono} {evento.tipo}
                    </div>
                  </div>

                  {/* INFORMACIÓN */}
                  <div className="p-4 text-white">

                    <h3 className="font-bold text-base">
                      {evento.titulo}
                    </h3>

                    <div className="mt-3 space-y-2 text-xs text-gray-300">

                      <div className="flex items-center gap-2">
                        <CalendarDays size={14} />
                        {evento.fecha}
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {evento.horario}
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="mt-0.5" />
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

                        <span className="text-xs text-gray-400">
                          Importancia
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Barra */}
                        <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-purple-400 transition-all"
                            style={{
                              width: `${(evento.importancia / 5) * 100}%`,
                            }}
                          />
                        </div>

                        {/* Nivel */}
                        <span className="text-[10px] text-gray-400 min-w-[20px]">
                          {evento.importancia}/5
                        </span>

                        {/* Reloj */}
                        <Clock
                          size={15}
                          strokeWidth={1.7}
                          className="text-gray-400"
                          title={evento.horario}
                        />
                      </div>
                    </div>
                  {/* DESCRIPCIÓN */}
                  <p className="mt-3 text-xs leading-relaxed text-gray-300">
                    {evento.descripcion}
                  </p>

                  {/* VISIBILIDAD */}
                  <div className="mt-3 rounded-lg bg-white/5 border border-white/10 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                        Visibilidad
                    </p>

                    <p className="text-xs text-gray-300 leading-relaxed">
                      {evento.visibilidad}
                    </p>
                  </div>

                  {/* RECOMENDACIÓN */}
                  <div className="mt-2 rounded-lg bg-white/5 border border-white/10 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                        Recomendación
                    </p>

                    <p className="text-xs text-gray-300 leading-relaxed">
                      {evento.recomendacion}
                    </p>
                  </div>

                  {/* BOTÓN */}
                <button
                  onClick={() => onVerEnMapa?.(evento)}
                  className="
                    mt-4 w-full
                    flex items-center justify-center gap-2
                    rounded-lg
                    bg-gradient-to-r from-indigo-500/80 to-purple-500/80
                    hover:from-indigo-500 hover:to-purple-500
                    border border-white/20
                    py-2.5
                    text-xs font-semibold text-white
                    shadow-lg shadow-indigo-500/20
                    hover:shadow-indigo-500/40
                    hover:scale-[1.02]
                    active:scale-[0.98]
                    transition-all duration-200
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
      )}
    </div>
  );
}