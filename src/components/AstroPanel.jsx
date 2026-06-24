// src/components/AstroPanel.jsx
import { useEffect, useRef } from 'react';
import * as Astronomy from 'astronomy-engine';
import { useAstroStore } from '../store/useAstroStore';
import { useState } from 'react';
import { Planetario } from './Planetario';
import { SolarSystemWindow } from './SolarSystemWindow';

const PLANETAS = [
  { key: 'Jupiter', label: 'Júpiter' },
  { key: 'Saturn',  label: 'Saturno' },
  { key: 'Mars',    label: 'Marte'   },
  { key: 'Venus',   label: 'Venus'   },
  { key: 'Mercury', label: 'Mercurio'},
];

const OBJETOS_PROFUNDOS = [
  { nombre: 'M42 — Orión',       ra: 83.82,  dec: -5.39  },
  { nombre: 'M45 — Pléyades',    ra: 56.75,  dec: 24.12  },
  { nombre: 'M31 — Andrómeda',   ra: 10.68,  dec: 41.27  },
  { nombre: 'M8  — Laguna',      ra: 270.92, dec: -24.38 },
  { nombre: 'M22 — Cúmulo Sag.', ra: 279.10, dec: -23.90 },
  { nombre: 'NGC 104 — 47 Tuc',  ra: 6.02,   dec: -72.08 },
];

const getVisibilidad = (altitud) => {
  if (altitud >= 20) return { label: 'VISIBLE',   clase: 'text-astro-sky    bg-astro-sky/10    border-astro-sky/20'    };
  if (altitud >= 5)  return { label: 'BAJO',      clase: 'text-astro-horizon bg-astro-horizon/10 border-astro-horizon/20' };
  return               { label: 'NO VISIBLE', clase: 'text-astro-dim    bg-neu-sunken      border-transparent'     };
};

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
    ctx.fillStyle = '#1a1d35';
    ctx.fill();

    // Parte iluminada
    const esCreciente = fase < 0.5;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI / 2, (3 * Math.PI) / 2);
    ctx.closePath();
    ctx.fillStyle = '#c8d8f0';
    ctx.fill();
    ctx.restore();

    // Máscara que define la fase
    const escala = Math.cos(2 * Math.PI * fase);
    ctx.save();
    ctx.globalCompositeOperation = esCreciente ? 'destination-out' : 'source-over';
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.abs(escala) * r, r, 0, Math.PI / 2, (3 * Math.PI) / 2);
    ctx.closePath();
    ctx.fillStyle = esCreciente ? 'rgba(0,0,0,1)' : '#1a1d35';
    ctx.fill();
    ctx.restore();

    // Borde exterior
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#3a4a60';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [fraccion, fase]);

  return (
    <canvas
      ref={canvasRef}
      width={64}
      height={64}
      className="rounded-full"
    />
  );
};

export const AstroPanel = ({ faseLunar, lunaFase }) => {
  const { coordinates } = useAstroStore();
  const ahora    = new Date();
  const observer = new Astronomy.Observer(coordinates.lat, coordinates.lng, 0);

  // Calcular planetas
  const planetas = PLANETAS.map(({ key, label }) => {
    try {
      const equatorial = Astronomy.Equator(key, ahora, observer, true, true);
      const horizontal = Astronomy.Horizon(ahora, observer, equatorial.ra, equatorial.dec, 'normal');
      return {
        label,
        altitud: Math.round(horizontal.altitude),
        azimut:  Math.round(horizontal.azimuth),
      };
    } catch {
      return { label, altitud: -90, azimut: 0 };
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
  
  return (
    <aside className="w-56 bg-neu-base border-l border-neu-border flex flex-col shrink-0 overflow-y-auto">

      {/* Luna */}
      <div className="mx-3 mt-3 mb-2">
        <p className="text-[9px] tracking-[0.18em] uppercase text-astro-dim mb-2">
          Fase lunar
        </p>
        <div className="bg-neu-raised border border-neu-border rounded-xl shadow-neu-sm p-3 flex items-center gap-3">
          <LunaCanvas fraccion={faseLunar / 100} fase={lunaFase ?? 0} />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-astro-text font-medium">{nombreFase}</p>
            <p className="text-[9px] text-astro-dim mt-0.5">{Math.round(faseLunar)}% iluminación</p>
            <div className="mt-2 h-1 rounded-full bg-neu-sunken shadow-neu-inset overflow-hidden">
              <div
                className="h-full rounded-full bg-astro-text transition-all duration-700"
                style={{ width: `${faseLunar}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Planetas */}
      <div className="mx-3 mb-2">
        <p className="text-[9px] tracking-[0.18em] uppercase text-astro-dim mb-2">
          Planetas visibles
        </p>
        <div className="bg-neu-raised border border-neu-border rounded-xl shadow-neu-sm overflow-hidden">
          {planetas.map(({ label, altitud, azimut }, i) => {
            const { label: visLabel, clase } = getVisibilidad(altitud);
            return (
              <div
                key={label}
                className={`
                  flex items-center justify-between px-3 py-2 text-[10px]
                  ${i < planetas.length - 1 ? 'border-b border-neu-border' : ''}
                `}
              >
                <div>
                  <p className="text-astro-text">{label}</p>
                  {altitud >= 5 && (
                    <p className="text-astro-dim text-[8px]">
                      Alt {altitud}° · Az {azimut}°
                    </p>
                  )}
                </div>
                <span className={`text-[8px] px-1.5 py-0.5 rounded border tracking-wide ${clase}`}>
                  {visLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Espacio profundo */}
      <div className="mx-3 mb-3">
        <p className="text-[9px] tracking-[0.18em] uppercase text-astro-dim mb-2">
          Espacio profundo
        </p>
        <div className="bg-neu-raised border border-neu-border rounded-xl shadow-neu-sm overflow-hidden">
          {objetosProfundos.map(({ nombre, altitud }, i) => {
            const { label: visLabel, clase } = getVisibilidad(altitud);
            return (
              <div
                key={nombre}
                className={`
                  flex items-center justify-between px-3 py-2 text-[10px]
                  ${i < objetosProfundos.length - 1 ? 'border-b border-neu-border' : ''}
                `}
              >
                <p className="text-astro-text truncate flex-1 mr-2">{nombre}</p>
                <span className={`text-[8px] px-1.5 py-0.5 rounded border tracking-wide shrink-0 ${clase}`}>
                  {visLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
              <div className="mx-3 mb-3 mt-auto">
      <button
        onClick={() => setPlanetarioAbierto(true)}
        className="w-full py-2.5 rounded-xl bg-neu-raised border border-neu-border shadow-neu-sm text-[9px] tracking-[0.15em] uppercase text-astro-sky hover:text-astro-sky/80 transition-colors"
      >
        Abrir planetario
      </button>
      <button
        onClick={() => setSistemaSolarAbierto(true)}
        className="w-full mt-2 py-2.5 rounded-xl bg-neu-raised border border-neu-border shadow-neu-sm text-[9px] tracking-[0.15em] uppercase text-astro-horizon hover:text-astro-horizon/80 transition-colors"
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
