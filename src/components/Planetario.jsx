// src/components/Planetario.jsx
import { useEffect, useRef, useState } from 'react';
import * as Astronomy from 'astronomy-engine';
import { useAstroStore } from '../store/useAstroStore';

const ESTRELLAS_BRILLANTES = [
  { nombre: 'Sirio',      ra: 6.7525,  dec: -16.7161 },
  { nombre: 'Canopus',    ra: 6.3992,  dec: -52.6957 },
  { nombre: 'Rigil Kent', ra: 14.6600, dec: -60.8350 },
  { nombre: 'Arturo',     ra: 14.2610, dec: 19.1822  },
  { nombre: 'Vega',       ra: 18.6157, dec: 38.7836  },
  { nombre: 'Capella',    ra: 5.2781,  dec: 45.9980  },
  { nombre: 'Rigel',      ra: 5.2423,  dec: -8.2016  },
  { nombre: 'Proción',    ra: 7.6553,  dec: 5.2250   },
  { nombre: 'Achernar',   ra: 1.6286,  dec: -57.2367 },
  { nombre: 'Betelgeuse', ra: 5.9195,  dec: 7.4071   },
  { nombre: 'Hadar',      ra: 14.0637, dec: -60.3730 },
  { nombre: 'Altair',     ra: 19.8463, dec: 8.8683   },
  { nombre: 'Aldebaran',  ra: 4.5987,  dec: 16.5093  },
  { nombre: 'Antares',    ra: 16.4901, dec: -26.4320 },
  { nombre: 'Espiga',     ra: 13.4199, dec: -11.1613 },
  { nombre: 'Pollux',     ra: 7.7553,  dec: 28.0262  },
  { nombre: 'Fomalhaut',  ra: 22.9608, dec: -29.6223 },
  { nombre: 'Mimosa',     ra: 12.7953, dec: -59.6888 },
  { nombre: 'Deneb',      ra: 20.6905, dec: 45.2803  },
  { nombre: 'Acrux',      ra: 12.4433, dec: -63.0990 },
];

const PLANETAS_CANVAS = [
  { key: 'Jupiter', label: 'J', color: '#fbbf24' },
  { key: 'Saturn',  label: 'S', color: '#a78bfa' },
  { key: 'Mars',    label: 'M', color: '#fb923c' },
  { key: 'Venus',   label: 'V', color: '#7ecfff' },
];

const altAzACanvas = (alt, az, cx, cy, radio) => {
  if (alt < 0) return null;
  const r   = radio * (1 - alt / 90);
  const ang = (az - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(ang),
    y: cy + r * Math.sin(ang),
  };
};

const dibujarCielo = (canvas, coordinates, ahora) => {
  const ctx    = canvas.getContext('2d');
  const W      = canvas.width;
  const H      = canvas.height;
  const cx     = W / 2;
  const cy     = H / 2;
  const radio  = Math.min(cx, cy) - 24;
  const obs    = new Astronomy.Observer(coordinates.lat, coordinates.lng, 0);

  ctx.clearRect(0, 0, W, H);

  // Fondo circular
  const gradFondo = ctx.createRadialGradient(cx, cy, 0, cx, cy, radio);
  gradFondo.addColorStop(0,   '#1a1638');
  gradFondo.addColorStop(0.7, '#0b0d1d');
  gradFondo.addColorStop(1,   '#05060d');
  ctx.beginPath();
  ctx.arc(cx, cy, radio, 0, Math.PI * 2);
  ctx.fillStyle = gradFondo;
  ctx.fill();

  // Círculos de altitud — 30°, 60°
  [30, 60].forEach(alt => {
    const r = radio * (1 - alt / 90);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(129, 140, 248, 0.20)';
    ctx.lineWidth   = 0.5;
    ctx.stroke();
    ctx.fillStyle   = '#727997';
    ctx.font        = '9px Space Grotesk, monospace';
    ctx.fillText(`${alt}°`, cx + r + 3, cy);
  });

  // Líneas cardinales
  const cardinales = [
    { label: 'N', az: 0   },
    { label: 'E', az: 90  },
    { label: 'S', az: 180 },
    { label: 'O', az: 270 },
  ];
  cardinales.forEach(({ label, az }) => {
    const ang = (az - 90) * (Math.PI / 180);
    const x1  = cx + (radio * 0.88) * Math.cos(ang);
    const y1  = cy + (radio * 0.88) * Math.sin(ang);
    const x2  = cx + radio * Math.cos(ang);
    const y2  = cy + radio * Math.sin(ang);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'rgba(129, 140, 248, 0.24)';
    ctx.lineWidth   = 0.5;
    ctx.stroke();
    const xL = cx + (radio + 14) * Math.cos(ang);
    const yL = cy + (radio + 14) * Math.sin(ang);
    ctx.fillStyle  = '#727997';
    ctx.font       = '10px Space Grotesk, monospace';
    ctx.textAlign  = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, xL, yL);
  });

  // Borde del horizonte
  ctx.beginPath();
  ctx.arc(cx, cy, radio, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth   = 1.5;
  ctx.stroke();

  // Estrellas brillantes
  ESTRELLAS_BRILLANTES.forEach(({ nombre, ra, dec }) => {
    try {
      const hor = Astronomy.Horizon(ahora, obs, ra, dec, 'normal');
      const pos = altAzACanvas(hor.altitude, hor.azimuth, cx, cy, radio);
      if (!pos) return;

      // Brillo basado en altitud
      const opacidad = 0.4 + (hor.altitude / 90) * 0.6;
      const tamaño   = 1.5 + (hor.altitude / 90) * 1.5;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, tamaño, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(224, 231, 255, ${opacidad})`;
      ctx.fill();

      // Nombre solo para estrellas sobre 20°
      if (hor.altitude > 20) {
        ctx.fillStyle    = 'rgba(154, 160, 191, 0.85)';
        ctx.font         = '8px Space Grotesk, monospace';
        ctx.textAlign    = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(nombre, pos.x + 4, pos.y);
      }
    } catch { /* estrella fuera de rango */ }
  });

  // Planetas
  PLANETAS_CANVAS.forEach(({ key, label, color }) => {
    try {
      const eq  = Astronomy.Equator(key, ahora, obs, true, true);
      const hor = Astronomy.Horizon(ahora, obs, eq.ra, eq.dec, 'normal');
      const pos = altAzACanvas(hor.altitude, hor.azimuth, cx, cy, radio);
      if (!pos) return;

      // Halo
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = `${color}18`;
      ctx.fill();

      // Punto planeta
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Label
      ctx.fillStyle    = color;
      ctx.font         = 'bold 9px Space Grotesk, monospace';
      ctx.textAlign    = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, pos.x + 7, pos.y);
    } catch { /* planeta fuera de rango */ }
  });

  // Cruz central — cenit
  ctx.strokeStyle = 'rgba(129, 140, 248, 0.24)';
  ctx.lineWidth   = 0.5;
  ctx.beginPath(); ctx.moveTo(cx - 6, cy); ctx.lineTo(cx + 6, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - 6); ctx.lineTo(cx, cy + 6); ctx.stroke();
};

export const Planetario = ({ onCerrar }) => {
  const canvasRef              = useRef(null);
  const animRef                = useRef(null);
  const { coordinates }        = useAstroStore();
  const [horaSimulada, setHora] = useState(new Date());
  const [offset, setOffset]    = useState(0); // horas adelantadas

  useEffect(() => {
    const fecha = new Date();
    fecha.setHours(fecha.getHours() + offset);
    // La hora simulada es estado derivado del offset; se sincroniza en el efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHora(fecha);
  }, [offset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const redimensionar = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      dibujarCielo(canvas, coordinates, horaSimulada);
    };

    redimensionar();
    window.addEventListener('resize', redimensionar);

    // Refresco cada minuto
    animRef.current = setInterval(() => {
      if (offset === 0) {
        const ahora = new Date();
        setHora(ahora);
        dibujarCielo(canvas, coordinates, ahora);
      }
    }, 60000);

    return () => {
      window.removeEventListener('resize', redimensionar);
      clearInterval(animRef.current);
    };
  }, [coordinates, horaSimulada, offset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    dibujarCielo(canvas, coordinates, horaSimulada);
  }, [horaSimulada, coordinates]);

  return (
    <div className="fixed inset-0 bg-cosmos-950 z-50 flex flex-col font-sans text-ink-300">

      {/* Header */}
      <div className="flex items-center px-4 h-12 border-b border-white/[0.04] bg-cosmos-950/70 backdrop-blur-xl shrink-0">
        <span className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-purple-200">
          <span className="w-1.5 h-1.5 rounded-full bg-ethereal-purple shadow-[0_0_10px_#c084fc]" />
          Planetario — {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
        </span>

        {/* Control de tiempo */}
        <div className="ml-8 flex items-center gap-3">
          <span className="text-[9px] font-mono text-ink-500 uppercase tracking-[0.16em]">Hora</span>
          <button
            onClick={() => setOffset(o => Math.max(o - 1, -12))}
            className="w-7 h-7 rounded-full bg-white/[0.03] border border-white/[0.08] text-ink-300 text-xs hover:text-purple-200 hover:border-purple-400/30 transition-all"
          >−</button>
          <span className="text-[11px] font-mono text-ink-100 tabular-nums min-w-[80px] text-center">
            {horaSimulada.toLocaleTimeString('es-BO', {
              hour: '2-digit', minute: '2-digit', timeZone: 'America/La_Paz'
            })}
          </span>
          <button
            onClick={() => setOffset(o => Math.min(o + 1, 12))}
            className="w-7 h-7 rounded-full bg-white/[0.03] border border-white/[0.08] text-ink-300 text-xs hover:text-purple-200 hover:border-purple-400/30 transition-all"
          >+</button>
          {offset !== 0 && (
            <button
              onClick={() => setOffset(0)}
              className="text-[9px] font-mono text-astro-horizon uppercase tracking-[0.16em] hover:text-white transition-colors"
            >
              Ahora
            </button>
          )}
        </div>

        {/* Leyenda */}
        <div className="ml-auto flex items-center gap-4 mr-4">
          {PLANETAS_CANVAS.map(({ color, key }) => (
            <span key={key} className="flex items-center gap-1.5 text-[9px] font-mono text-ink-500">
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
              {key}
            </span>
          ))}
          <span className="flex items-center gap-1.5 text-[9px] font-mono text-ink-500">
            <span className="w-2 h-2 rounded-full bg-astro-text opacity-60" />
            Estrellas
          </span>
        </div>

        {/* Cerrar */}
        <button
          onClick={onCerrar}
          className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.08] text-ink-400 hover:text-white hover:border-purple-400/30 transition-all text-sm"
        >
          ✕
        </button>
      </div>

      {/* Canvas */}
      <div className="relative flex-1 flex items-center justify-center p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.08),transparent_60%)]" />
        <canvas
          ref={canvasRef}
          className="relative w-full h-full max-w-3xl max-h-[600px] shadow-[0_0_80px_-20px_rgba(168,85,247,0.35)]"
          style={{ borderRadius: '50%' }}
        />
      </div>

    </div>
  );
};