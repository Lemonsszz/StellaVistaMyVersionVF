import { useState } from "react";
import { ChevronDown, ChevronUp, CalendarDays, Clock, MapPin } from "lucide-react";
import { eventosAstronomicos } from "../data/eventosAstronomicos";

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

export default function EventosAstronomicos() {
  const [abierto, setAbierto] = useState(false);

  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth();

  const eventos = eventosAstronomicos[mesActual] || [];

  return (
    <div className="absolute top-4 right-4 z-20 w-[360px]">
      
      {/* CABECERA */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center justify-between 
        rounded-xl bg-black/80 backdrop-blur-md
        border border-white/10 px-4 py-3
        text-white shadow-xl hover:bg-black/90 transition"
      >
        <div className="flex items-center gap-3">
          <div className="text-2xl">🌠</div>

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
                      className="absolute top-2 left-2
                      rounded-lg bg-black/70 backdrop-blur-sm
                      px-2 py-1 text-xs text-white"
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
                    <div className="mt-3">
                      <span className="text-yellow-400 text-sm">
                        {evento.importancia}
                      </span>
                    </div>

                    {/* DESCRIPCIÓN */}
                    <p className="mt-3 text-xs leading-relaxed text-gray-400">
                      {evento.descripcion}
                    </p>

                    {/* BOTÓN */}
                    <button
                      className="mt-4 w-full rounded-lg
                      bg-white/10 hover:bg-white/20
                      border border-white/10
                      py-2 text-xs font-medium
                      transition"
                    >
                      🗺️ Ver en el mapa
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