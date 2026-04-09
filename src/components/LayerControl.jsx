// src/components/LayerControl.jsx
import { useAstroStore } from '../store/useAstroStore';

const LAYERS = [
  {
    key: 'contaminacionLuminica',
    label: 'Contaminación lumínica',
    description: 'Índice Bortle por zona',
    color: 'astro-nebula',
    dot: 'bg-astro-nebula',
  },
  {
    key: 'nubosidad',
    label: 'Nubosidad',
    description: 'Cobertura nubosa actual',
    color: 'astro-sky',
    dot: 'bg-astro-sky',
  },
  {
    key: 'sitiosRecomendados',
    label: 'Sitios recomendados',
    description: 'Puntos óptimos de observación',
    color: 'astro-horizon',
    dot: 'bg-astro-horizon',
  },
];

export const LayerControl = () => {
  const { layers, toggleLayer } = useAstroStore();

  return (
    <div className="mx-3 mb-3">
      <p className="text-[9px] tracking-[0.18em] uppercase text-astro-dim mb-3">
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
                  ? 'bg-neu-raised border-neu-border shadow-neu-sm'
                  : 'bg-neu-sunken border-transparent shadow-neu-inset opacity-50'
                }
              `}
            >
              {/* Indicador de color */}
              <div className={`
                w-2 h-2 rounded-full shrink-0 transition-all duration-300
                ${isActive ? dot : 'bg-astro-dim'}
              `} />

              {/* Texto */}
              <div className="flex-1 min-w-0">
                <p className={`
                  text-[11px] font-medium tracking-wide transition-colors duration-300
                  ${isActive ? 'text-astro-text' : 'text-astro-dim'}
                `}>
                  {label}
                </p>
                <p className="text-[9px] text-astro-dim truncate">
                  {description}
                </p>
              </div>

              {/* Toggle visual */}
              <div className={`
                relative w-8 h-4 rounded-full shrink-0
                transition-all duration-300
                ${isActive
                  ? 'bg-neu-raised shadow-neu-sm border border-neu-border'
                  : 'bg-neu-sunken shadow-neu-inset border border-transparent'
                }
              `}>
                <div className={`
                  absolute top-0.5 w-3 h-3 rounded-full
                  transition-all duration-300
                  ${isActive
                    ? 'left-4 bg-astro-sky'
                    : 'left-0.5 bg-astro-dim'
                  }
                `} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};