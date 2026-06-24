// src/components/LayerControl.jsx
import { useAstroStore } from '../store/useAstroStore';

const LAYERS = [
  {
    key: 'bortleLocal',
    label: 'Bortle local Oruro',
    description: 'Modelo offline por zonas',
    dot: 'bg-astro-sky',
  },
  {
    key: 'contaminacionLuminica',
    label: 'VIIRS historico',
    description: 'Raster NASA de apoyo',
    dot: 'bg-astro-nebula',
  },
  {
    key: 'nubosidad',
    label: 'Nubosidad',
    description: 'Cobertura nubosa actual',
    dot: 'bg-astro-sky',
  },
  {
    key: 'sitiosRecomendados',
    label: 'Sitios recomendados',
    description: 'Puntos optimos de observacion',
    dot: 'bg-astro-horizon',
  },
];

const BORTLE_LEGEND = [
  { color: '#4c1d95', label: 'Bortle 1-2: cielo oscuro' },
  { color: '#38bdf8', label: 'Bortle 3-4: buen cielo rural' },
  { color: '#fb923c', label: 'Bortle 5-6: transicion / periurbano' },
  { color: '#db2777', label: 'Bortle 7-9: urbano contaminado' },
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
              <div className={`
                w-2 h-2 rounded-full shrink-0 transition-all duration-300
                ${isActive ? dot : 'bg-astro-dim'}
              `} />

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

      {layers.bortleLocal && (
        <div className="mt-3 bg-neu-sunken rounded-xl shadow-neu-inset border border-neu-border/40 p-3">
          <p className="text-[8px] tracking-[0.16em] uppercase text-astro-dim mb-2">
            Leyenda Bortle
          </p>
          {BORTLE_LEGEND.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2 mb-1 last:mb-0">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-[8px] text-astro-muted leading-tight">
                {label}
              </span>
            </div>
          ))}
          <p className="mt-2 text-[8px] text-astro-dim leading-snug">
            Modelo local para prototipo - Oruro
          </p>
        </div>
      )}
    </div>
  );
};
