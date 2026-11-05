// src/components/LayerControl.jsx
import { useAstroStore } from '../store/useAstroStore';

const LAYERS = [
  {
    key: 'contaminacionLuminica',
    label: 'Contaminacion luminica',
    description: 'Modelo Bortle',
    dot: 'bg-astro-sky',
  },
  /*{
    : 'nubosidad',
    label: 'Nubosidad',
    description: 'Cobertura nubosa actual',
    dot: 'bg-astro-sky',
  },*/
  {
    key: 'sitiosRecomendados',
    label: 'Sitios recomendados',
    description: 'Puntos optimos de observacion',
    dot: 'bg-astro-nebula',
  },
];

const BORTLE_LEGEND = [
  { color: '#818cf8', label: 'Bortle 1-2: cielo oscuro' },
  { color: '#a78bfa', label: 'Bortle 3-4: buen cielo rural' },
  { color: '#e879f9', label: 'Bortle 5-6: transicion / periurbano' },
  { color: '#f5d0fe', label: 'Bortle 7-9: urbano contaminado' },
];

export const LayerControl = () => {
  const { layers, toggleLayer } = useAstroStore();

  return (
    <section className="glass-card glass-card-hover animate-card-rise shrink-0 rounded-2xl p-4">
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-400 mb-3">
        Capas del mapa
      </p>

      <div className="flex flex-col gap-2">
        {LAYERS.map(({ key, label, description, dot }) => {
          const isActive = layers[key];

          return (
            <button
              key={key}
              onClick={() => toggleLayer(key)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-xl
                border transition-all duration-300 text-left
                ${isActive
                  ? 'bg-purple-500/[0.08] border-purple-400/25 hover:bg-purple-500/[0.12] shadow-[0_0_26px_-12px_rgba(168,85,247,0.8)]'
                  : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.08] opacity-60'
                }
              `}
            >
              <div className={`
                w-2 h-2 rounded-full shrink-0 transition-all duration-300
                ${isActive ? `${dot} shadow-[0_0_10px_currentColor]` : 'bg-ink-600'}
              `} />

              <div className="flex-1 min-w-0">
                <p className={`
                  text-xs font-medium tracking-wide transition-colors duration-300
                  ${isActive ? 'text-ink-100' : 'text-ink-400'}
                `}>
                  {label}
                </p>
                <p className="text-[10px] font-mono text-ink-500 truncate">
                  {description}
                </p>
              </div>

              <div className={`
                relative w-9 h-5 rounded-full shrink-0
                transition-all duration-300 border
                ${isActive
                  ? 'bg-purple-500/30 border-purple-400/40'
                  : 'bg-white/[0.04] border-white/[0.08]'
                }
              `}>
                <div className={`
                  absolute top-0.5 w-3.5 h-3.5 rounded-full
                  transition-all duration-300
                  ${isActive
                    ? 'left-[18px] bg-purple-200 shadow-[0_0_10px_rgba(192,132,252,0.8)]'
                    : 'left-0.5 bg-ink-600'
                  }
                `} />
              </div>
            </button>
          );
        })}
      </div>

      {layers.contaminacionLuminica && (
        <div className="mt-3 glass-tile rounded-xl p-3">
          <p className="text-[9px] font-mono tracking-[0.16em] uppercase text-ink-500 mb-2">
            Leyenda Bortle
          </p>
          {BORTLE_LEGEND.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2 mb-1.5 last:mb-0">
              <span
                className="w-2 h-2 rounded-full shrink-0 shadow-[0_0_6px_currentColor]"
                style={{ backgroundColor: color, color }}
              />
              <span className="text-[9px] font-mono text-ink-400 leading-tight">
                {label}
              </span>
            </div>
          ))}
          <p className="mt-2 text-[9px] font-mono text-ink-500 leading-snug">
            Modelo local Bolivia-Oruro para prototipo
          </p>
        </div>
      )}
    </section>
  );
};
