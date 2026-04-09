// src/components/Topbar.jsx
import { useAstroStore } from '../store/useAstroStore';

export const Topbar = ({ coordinates }) => {
  const { isRedMode, toggleRedMode } = useAstroStore();

  return (
    <header className="w-full h-10 bg-neu-base flex items-center px-4 gap-4 border-b border-neu-border shadow-neu-sm font-mono">
      
      {/* Logo */}
      <span className="text-xs font-bold tracking-[0.18em] uppercase text-astro-sky">
        StellaVista
      </span>

      <div className="w-px h-4 bg-neu-border" />

      {/* Coordenadas */}
      <span className="text-[10px] tracking-widest text-astro-dim">
        LAT <span className="text-astro-text">{coordinates.lat.toFixed(4)}</span>
        &nbsp;&nbsp;
        LNG <span className="text-astro-text">{coordinates.lng.toFixed(4)}</span>
      </span>

      {/* Derecha */}
      <div className="ml-auto flex items-center gap-3"></div>

      {/* Botón modo nocturno */}
      <button
        onClick={toggleRedMode}
        className={`
          flex items-center gap-2 px-3 py-1 rounded-lg text-[9px]
          tracking-[0.12em] uppercase border transition-all duration-300
          ${isRedMode
            ? 'bg-red-950/40 border-red-900/50 text-red-400 shadow-neu-sm'
            : 'bg-neu-raised border-neu-border text-astro-dim shadow-neu-sm hover:text-astro-text'
          }
        `}
      >
          <span className={`w-1.5 h-1.5 rounded-full ${isRedMode ? 'bg-red-400 animate-pulse' : 'bg-astro-dim'}`} />
          Modo nocturno
        </button>

      {/* Status — empujado a la derecha */}
      <div className="ml-auto flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-astro-sky animate-pulse" />
        <span className="text-[9px] tracking-[0.15em] uppercase text-astro-dim">
          Datos en vivo
        </span>
      </div>

    </header>
  );
};