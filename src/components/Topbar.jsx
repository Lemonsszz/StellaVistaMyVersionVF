// src/components/Topbar.jsx
import { useAstroStore } from '../store/useAstroStore';

export const Topbar = ({ coordinates }) => {
  const { isRedMode, toggleRedMode } = useAstroStore();

  return (
    <header className="relative z-30 w-full h-12 flex items-center px-4 gap-4 border-b border-white/[0.04] bg-cosmos-950/60 backdrop-blur-xl font-sans shrink-0">

      {/* Logo */}
      <div className="flex items-center min-w-[210px]">
        <img
          src="/logo-artemis.png"
          alt="Artemis"
          className="h-10 w-[190px] object-contain object-left"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <div className="w-px h-5 bg-white/[0.08]" />

      {/* Coordenadas */}
      <div className="hidden md:flex items-center gap-3 text-[10px] font-mono tracking-[0.18em] text-ink-500">
        <span>
          LAT <span className="text-ink-200">{coordinates.lat.toFixed(4)}</span>
        </span>
        <span className="text-white/20">/</span>
        <span>
          LNG <span className="text-ink-200">{coordinates.lng.toFixed(4)}</span>
        </span>
      </div>

      {/* Botón modo nocturno */}
      <button
        onClick={toggleRedMode}
        className={`
          ml-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full
          text-[10px] font-mono tracking-[0.14em] uppercase
          border transition-all duration-300
          ${isRedMode
            ? 'bg-red-500/15 border-red-400/40 text-red-200 shadow-[0_0_22px_-6px_rgba(248,113,113,0.55)]'
            : 'bg-white/[0.02] border-white/[0.08] text-ink-300 hover:bg-white/[0.06] hover:border-purple-400/25 hover:text-white'
          }
        `}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isRedMode ? 'bg-red-300 animate-pulse' : 'bg-ethereal-purple shadow-[0_0_8px_#c084fc]'}`} />
        Modo nocturno
      </button>

      {/* Status — empujado a la derecha */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06]">
        <span className="w-1.5 h-1.5 rounded-full bg-astro-sky shadow-[0_0_8px_#7ecfff] animate-pulse" />
        <span className="text-[9px] font-mono tracking-[0.16em] uppercase text-ink-400">
          Datos en vivo
        </span>
      </div>

    </header>
  );
};
