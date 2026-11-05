// src/components/AstroPanel.jsx
import { useEffect, useRef, useState } from 'react';
import * as Astronomy from 'astronomy-engine';
import { ChevronDown } from 'lucide-react';
import { useAstroStore } from '../store/useAstroStore';
import { Planetario } from './Planetario';
import { SolarSystemWindow } from './SolarSystemWindow';
import { OBJETOS_PROFUNDOS, PLANETAS } from '../data/catalogoAstronomico';
import { PLANETAS_INFO } from '../data/planetasInfo';
import { getVisibilidad } from '../utils/visibilidad';
import BubbleMenu from './BubbleMenu';
import { PlanetaDetalle } from './PlanetaDetalle';

// Canvas de la luna
const LunaCanvas = ({ fraccion, fase }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r  = cx - 4;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo — disco oscuro
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = '#14172e';
    ctx.fill();

    // Parte iluminada
    const esCreciente = fase < 0.5;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI / 2, (3 * Math.PI) / 2);
    ctx.closePath();
    ctx.fillStyle = '#e0e7ff';
    ctx.fill();
    ctx.restore();

    // Máscara que define la fase
    const escala = Math.cos(2 * Math.PI * fase);
    ctx.save();
    ctx.globalCompositeOperation = esCreciente ? 'destination-out' : 'source-over';
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.abs(escala) * r, r, 0, Math.PI / 2, (3 * Math.PI) / 2);
    ctx.closePath();
    ctx.fillStyle = esCreciente ? 'rgba(0,0,0,1)' : '#14172e';
    ctx.fill();
    ctx.restore();

    // Borde exterior
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [fraccion, fase]);

  return (
    <canvas
      ref={canvasRef}
      width={64}
      height={64}
      className="rounded-full shrink-0 shadow-[0_0_22px_-6px_rgba(224,231,255,0.45)]"
    />
  );
};

export const AstroPanel = ({ faseLunar, lunaFase, onIrAZona }) => {
  const { coordinates } = useAstroStore();
  const ahora    = new Date();
  const observer = new Astronomy.Observer(coordinates.lat, coordinates.lng, 0);

  // Calcular planetas
  const planetas = PLANETAS.map(({ key, label }) => {
    try {
      const equatorial = Astronomy.Equator(key, ahora, observer, true, true);
      const horizontal = Astronomy.Horizon(ahora, observer, equatorial.ra, equatorial.dec, 'normal');
      return {
        key,
        label,
        altitud: Math.round(horizontal.altitude),
        azimut:  Math.round(horizontal.azimuth),
      };
    } catch {
      return { key, label, altitud: -90, azimut: 0 };
    }
  });

  // Calcular objetos de espacio profundo
  const objetosProfundos = OBJETOS_PROFUNDOS.map(({ nombre, ra, dec }) => {
    try {
      const horizontal = Astronomy.Horizon(ahora, observer, ra / 15, dec, 'normal');
      return {
        nombre,
        altitud: Math.round(horizontal.altitude),
      };
    } catch {
      return { nombre, altitud: -90 };
    }
  });

  const nombreFase = (() => {
    const f = lunaFase ?? 0;
    if (f < 0.03 || f > 0.97) return 'Luna nueva';
    if (f < 0.22) return 'Creciente inicial';
    if (f < 0.28) return 'Cuarto creciente';
    if (f < 0.47) return 'Gibosa creciente';
    if (f < 0.53) return 'Luna llena';
    if (f < 0.72) return 'Gibosa menguante';
    if (f < 0.78) return 'Cuarto menguante';
    return 'Menguante final';
  })();
  const [planetarioAbierto, setPlanetarioAbierto] = useState(false);
  const [sistemaSolarAbierto, setSistemaSolarAbierto] = useState(false);
  const [planetasAbiertos, setPlanetasAbiertos] = useState(false);
  const [planetaSeleccionado, setPlanetaSeleccionado] = useState(null);

  const planetaActivo =
    planetas.find((planeta) => planeta.key === planetaSeleccionado) ?? null;
  const planetasSobreHorizonte = planetas.filter(
    (planeta) => planeta.altitud >= 5
  ).length;

  const itemsPlanetas = planetas.map(({ key, label, altitud, azimut }, i) => {
    const visibilidad = getVisibilidad(altitud);
    const info = PLANETAS_INFO[key];

    return {
      key,
      label,
      altitud,
      azimut,
      rotation: i % 2 === 0 ? -6 : 6,
      meta: `${visibilidad.label} · ALT ${altitud}° · AZ ${azimut}°`,
      color: info?.color ?? '#c084fc',
      colorSuave: info?.colorSuave ?? '#e0e7ff',
      hoverStyles: {
        bgColor: info?.color ?? '#c084fc',
        textColor: '#05060d',
      },
    };
  });

  return (
    <aside className="w-56 bg-transparent border-l border-white/[0.04] flex flex-col shrink-0 overflow-y-auto gap-3 p-3 font-sans">

      {/* Luna */}
      <section className="glass-card glass-card-hover animate-card-rise rounded-2xl p-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-400 mb-3">
          Fase lunar
        </p>
        <div className="flex items-center gap-3">
          <LunaCanvas fraccion={faseLunar / 100} fase={lunaFase ?? 0} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white">{nombreFase}</p>
            <p className="text-[10px] font-mono text-ink-400 mt-0.5">{Math.round(faseLunar)}% iluminación</p>
            <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-ethereal-indigo to-ethereal-lavender transition-all duration-700"
                style={{ width: `${faseLunar}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Planetas — disparador del menu de burbujas */}
      <section className="glass-card animate-card-rise overflow-hidden rounded-2xl">
        <button
          type="button"
          onClick={() => setPlanetasAbiertos((abierto) => !abierto)}
          aria-expanded={planetasAbiertos}
          aria-haspopup="dialog"
          className="group w-full p-4 text-left transition-colors duration-300 hover:bg-white/[0.035]"
        >
          <span className="flex items-center justify-between gap-3">
            <span className="min-w-0">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-400">
                Planetas visibles
              </span>
              <span className="flex flex-wrap items-center gap-1.5">
                {planetas.map(({ key, label, altitud }) => {
                  const info = PLANETAS_INFO[key];
                  const sobreHorizonte = altitud >= 5;
                  return (
                    <span
                      key={key}
                      title={`${label}: ${altitud}°`}
                      className="h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-125"
                      style={{
                        background: info?.color ?? '#c084fc',
                        boxShadow: sobreHorizonte
                          ? `0 0 8px ${info?.color ?? '#c084fc'}`
                          : 'none',
                        opacity: sobreHorizonte ? 1 : 0.32,
                      }}
                    />
                  );
                })}
                <span className="ml-1 font-mono text-[9px] uppercase tracking-[0.08em] text-ink-500">
                  {planetasSobreHorizonte} sobre el horizonte
                </span>
              </span>
            </span>
            <ChevronDown
              size={16}
              className={`shrink-0 text-ink-500 transition-all duration-300 group-hover:text-ethereal-purple ${
                planetasAbiertos ? 'rotate-180 text-ethereal-purple' : ''
              }`}
            />
          </span>
          <span className="mt-2 block font-mono text-[8px] uppercase tracking-[0.16em] text-ink-600 transition-colors duration-300 group-hover:text-ethereal-purple/80">
            {planetasAbiertos
              ? 'Cerrar panel de planetas'
              : 'Toca para desplegar los planetas'}
          </span>
        </button>
      </section>

      <BubbleMenu
        open={planetasAbiertos}
        items={itemsPlanetas}
        onClose={() => setPlanetasAbiertos(false)}
        onSelect={(item) => {
          setPlanetasAbiertos(false);
          setPlanetaSeleccionado(item.key);
        }}
        title="Planetas visibles"
        subtitle="Etiquetas del cielo de ahora mismo. Elige un planeta para ver su ficha, sus datos y la mejor zona de observación."
      />

      {planetaActivo && (
        <PlanetaDetalle
          key={planetaActivo.key}
          planeta={planetaActivo}
          onCerrar={() => setPlanetaSeleccionado(null)}
          onIrAZona={onIrAZona}
        />
      )}

      {/* Espacio profundo */}
      <section className="glass-card glass-card-hover animate-card-rise rounded-2xl p-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-400 mb-2">
          Espacio profundo
        </p>
        <div className="space-y-1.5">
          {objetosProfundos.map(({ nombre, altitud }) => {
            const { label: visLabel, clase } = getVisibilidad(altitud);
            return (
              <div
                key={nombre}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.03] hover:border-purple-400/20 hover:bg-white/[0.04] transition-all duration-300"
              >
                <p className="text-[11px] text-ink-200 truncate flex-1">{nombre}</p>
                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-full border tracking-[0.06em] shrink-0 ${clase}`}>
                  {visLabel}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={() => setPlanetarioAbierto(true)}
          className="w-full py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-[10px] font-mono tracking-[0.16em] uppercase text-ethereal-lavender hover:bg-white/[0.06] hover:border-purple-400/30 hover:-translate-y-0.5 transition-all duration-300"
        >
          Abrir planetario
        </button>
        <button
          onClick={() => setSistemaSolarAbierto(true)}
          className="w-full py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-[10px] font-mono tracking-[0.16em] uppercase text-ethereal-purple hover:bg-white/[0.06] hover:border-purple-400/30 hover:-translate-y-0.5 transition-all duration-300"
        >
          Abrir sistema solar
        </button>
      </div>

      {planetarioAbierto && (
        <Planetario onCerrar={() => setPlanetarioAbierto(false)} />
      )}
      {sistemaSolarAbierto && (
        <SolarSystemWindow onCerrar={() => setSistemaSolarAbierto(false)} />
      )}
    </aside>
  );
};
