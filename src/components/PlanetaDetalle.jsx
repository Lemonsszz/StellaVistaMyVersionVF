// src/components/PlanetaDetalle.jsx
// Ficha de planeta a pantalla casi completa (68 % x 68 %) con fondo opaco.
// Incluye la mejor zona de observacion calculada a partir del catalogo de
// sitios y un boton que vuela el mapa hasta esa zona.

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Clock,
  Compass,
  MapPin,
  Sparkles,
  Telescope,
  X,
} from 'lucide-react';
import { useAstroStore } from '../store/useAstroStore';
import { getInfoPlaneta } from '../data/planetasInfo';
import { getZonasParaPlaneta } from '../services/zonaObservacion';
import { getVisibilidad } from '../utils/visibilidad';

import './PlanetaDetalle.css';

const DIRECCIONES = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];

const direccionDesdeAzimut = (azimut) =>
  DIRECCIONES[Math.round((((azimut % 360) + 360) % 360) / 45) % 8];

const DETALLES = (info) => [
  { label: 'Magnitud', value: info.magnitud },
  { label: 'Distancia al Sol', value: info.distancia },
  { label: 'Diámetro', value: info.diametro },
  { label: 'Día', value: info.dia },
  { label: 'Año', value: info.ano },
  { label: 'Lunas', value: info.lunas },
];

export const PlanetaDetalle = ({ planeta, onCerrar, onIrAZona }) => {
  const { coordinates } = useAstroStore();
  const [ahora] = useState(() => new Date());
  const [zonaElegida, setZonaElegida] = useState(null);
  const cerrarRef = useRef(null);

  const info = getInfoPlaneta(planeta.key);
  const visibilidad = getVisibilidad(planeta.altitud);
  const direccion = direccionDesdeAzimut(planeta.azimut);

  const zonas = useMemo(
    () => getZonasParaPlaneta(planeta.key, coordinates, ahora, 3),
    [planeta.key, coordinates, ahora]
  );

  const zonaActiva =
    zonas.find((zona) => zona.nombre === zonaElegida) ?? zonas[0] ?? null;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    cerrarRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCerrar?.();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCerrar]);

  const esGigante =
    planeta.key === 'Jupiter' || planeta.key === 'Saturn';
  const esSaturno = planeta.key === 'Saturn';

  return (
    <div
      className="fixed inset-0 z-[260] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="planeta-detalle-titulo"
    >
      <button
        type="button"
        className="planeta-detalle-backdrop absolute inset-0 cursor-default"
        onClick={onCerrar}
        aria-label="Cerrar ficha del planeta"
        tabIndex={-1}
      />

      <article className="planeta-detalle-card glass-card animate-card-rise relative flex h-[82vh] w-[94vw] flex-col overflow-hidden rounded-3xl sm:h-[68vh] sm:w-[68vw] sm:min-h-[480px] sm:max-h-[760px] sm:max-w-[1040px]">
        {/* Cabecera */}
        <header className="relative z-10 flex shrink-0 items-start justify-between gap-4 border-b border-white/[0.07] px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="planeta-orbe-wrap hidden sm:block">
              <span
                className="planeta-orbe-glow"
                style={{ background: info.color }}
                aria-hidden="true"
              />
              <span
                className={`planeta-orbe ${esGigante ? 'planeta-orbe--bandas' : ''}`}
                style={{
                  '--orbe-color': info.color,
                  '--orbe-soft': info.colorSuave,
                }}
                aria-hidden="true"
              />
              {esSaturno && (
                <>
                  <span className="planeta-anillo planeta-anillo--atras" aria-hidden="true" />
                  <span className="planeta-anillo planeta-anillo--frente" aria-hidden="true" />
                </>
              )}  
            </div>

            <div className="min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-ethereal-purple/90">
                {info.tipo}
              </p>
              <h2
                id="planeta-detalle-titulo"
                className="mt-1 font-sans text-2xl font-semibold tracking-tight text-white sm:text-3xl"
              >
                {info.label}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[9px] tracking-[0.08em] ${visibilidad.clase}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${visibilidad.dot}`} />
                  {visibilidad.label}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-ink-400">
                  <Compass size={12} className="text-ethereal-indigo" />
                  Alt {planeta.altitud}° · Az {planeta.azimut}° ({direccion})
                </span>
              </div>
            </div>
          </div>

          <button
            ref={cerrarRef}
            type="button"
            onClick={onCerrar}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.04] text-ink-300 transition-all duration-300 hover:border-purple-400/40 hover:bg-purple-500/15 hover:text-white"
            aria-label="Cerrar ficha del planeta"
          >
            <X size={17} />
          </button>
        </header>

        {/* Cuerpo desplazable */}
        <div className="relative z-10 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
            <div className="space-y-5">
              <p className="text-sm leading-relaxed text-ink-200">
                {info.resumen}
              </p>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {DETALLES(info).map(({ label, value }) => (
                  <div
                    key={label}
                    className="glass-tile rounded-xl px-3 py-2.5"
                  >
                    <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink-500">
                      {label}
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-ink-100">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-purple-400/15 bg-purple-500/[0.05] p-4">
                <p className="mb-1.5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ethereal-purple">
                  <Sparkles size={13} />
                  Dato curioso
                </p>
                <p className="text-xs leading-relaxed text-ink-300">{info.dato}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-400">
                  <Telescope size={13} className="text-ethereal-lavender" />
                  Cómo observarlo
                </p>
                <p className="text-xs leading-relaxed text-ink-300">
                  {info.observacion}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-400">
                  <Clock size={13} className="text-ethereal-indigo" />
                  Mejor época
                </p>
                <p className="text-xs leading-relaxed text-ink-300">
                  {info.mejorEpoca}
                </p>
              </div>

              <div className="glass-tile flex items-center justify-between rounded-xl px-3.5 py-2.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-500">
                  Temperatura
                </span>
                <span className="text-[11px] font-medium text-ink-100">
                  {info.temperatura}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mejor zona + accion */}
        {zonaActiva && (
          <footer className="relative z-10 shrink-0 border-t border-white/[0.07] bg-[#070810]/85 px-4 py-3.5 sm:px-7 sm:py-4">
            <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
              <span className="mr-1 font-mono text-[8px] uppercase tracking-[0.18em] text-ink-500">
                Zonas sugeridas
              </span>
              {zonas.map((zona) => {
                const activa = zona.nombre === zonaActiva.nombre;
                return (
                  <button
                    key={`${zona.nombre}-${zona.lat}`}
                    type="button"
                    onClick={() => setZonaElegida(zona.nombre)}
                    className={`rounded-full border px-2.5 py-1 font-mono text-[9px] tracking-[0.04em] transition-all duration-200 ${
                      activa
                        ? 'border-purple-400/40 bg-purple-500/15 text-purple-100'
                        : 'border-white/[0.07] bg-white/[0.02] text-ink-400 hover:border-purple-400/25 hover:text-white'
                    }`}
                    title={`${zona.nombre} · ${zona.departamento}`}
                  >
                    {zona.nombre}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-ink-500">
                  <MapPin size={11} className="text-ethereal-purple" />
                  Mejor zona ahora
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-white">
                  {zonaActiva.nombre}
                  <span className="ml-2 font-mono text-[10px] font-normal text-ink-400">
                    {zonaActiva.departamento} · {zonaActiva.distanciaKm} km
                  </span>
                </p>
                <p className="mt-0.5 font-mono text-[9px] text-ink-500">
                  Score {zonaActiva.score} · Planeta a {zonaActiva.altitud}° (
                  {direccionDesdeAzimut(zonaActiva.azimut)})
                </p>
                {zonaActiva.altitud <= 0 && (
                  <p className="mt-1 font-mono text-[9px] text-amber-300/85">
                    Bajo el horizonte ahora: consulta otra hora para observarlo
                    desde esta zona.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  onCerrar?.();
                  onIrAZona?.(zonaActiva, info.label);
                }}
                className="group flex shrink-0 items-center justify-center gap-2 rounded-xl border border-purple-400/30 bg-purple-500/15 px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.12em] text-purple-100 transition-all duration-300 hover:border-purple-300/50 hover:bg-purple-500/25 hover:shadow-[0_0_30px_-6px_rgba(168,85,247,0.55)]"
              >
                <MapPin size={14} />
                Ir a la mejor zona
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </footer>
        )}
      </article>
    </div>
  );
};
