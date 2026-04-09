// src/components/CoordsPanel.jsx
import { useAstroStore } from '../store/useAstroStore';

export const CoordsPanel = ({ altitud }) => {
  const { coordinates } = useAstroStore();

  return (
    <div className="mx-3 mb-3">
      <p className="text-[9px] tracking-[0.18em] uppercase text-astro-dim mb-3">
        Coordenadas activas
      </p>

      <div className="bg-neu-raised border border-neu-border rounded-xl shadow-neu-sm p-3">
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'LAT', val: coordinates.lat.toFixed(5) },
            { key: 'LNG', val: coordinates.lng.toFixed(5) },
            { key: 'ALT', val: `${altitud ?? '—'} m`      },
            { key: 'UTC', val: new Date().toLocaleTimeString('es-BO', {
                hour: '2-digit', minute: '2-digit', timeZone: 'America/La_Paz'
              })
            },
          ].map(({ key, val }) => (
            <div
              key={key}
              className="bg-neu-sunken rounded-lg p-2 shadow-neu-inset"
            >
              <p className="text-[8px] uppercase tracking-[0.14em] text-astro-dim mb-1">{key}</p>
              <p className="text-[11px] text-astro-text font-medium tabular-nums">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};