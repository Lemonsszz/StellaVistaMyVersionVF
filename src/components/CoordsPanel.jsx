// src/components/CoordsPanel.jsx
import { useAstroStore } from '../store/useAstroStore';
import { explainBortleSource, getBortleForCoordinates } from '../utils/bortleModel';

export const CoordsPanel = ({ altitud, bortleInfo }) => {
  const { coordinates } = useAstroStore();
  const activeBortleInfo = bortleInfo ?? getBortleForCoordinates(coordinates.lat, coordinates.lng);

  return (
    <section className="glass-card glass-card-hover animate-card-rise shrink-0 rounded-2xl p-4">
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-400 mb-3">
        Coordenadas activas
      </p>

      <div className="grid grid-cols-2 gap-2.5">
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
            className="glass-tile glass-tile-hover rounded-xl p-2.5"
          >
            <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-ink-500 mb-1">{key}</p>
            <p className="text-sm font-mono font-medium text-ink-100 tabular-nums">{val}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 border-t border-white/[0.06] pt-3">
        <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-ink-500 mb-1.5">
          Contaminacion luminica
        </p>
        <p className="text-[11px] text-ink-200 font-medium leading-snug">
          Bortle {activeBortleInfo.bortle} - {activeBortleInfo.label}
        </p>
        <p className="mt-1.5 text-[9px] text-ink-400 leading-snug font-mono">
          Dominante: {activeBortleInfo.sourceName ?? activeBortleInfo.dominantSource ?? 'sin fuente'}
        </p>
        <p className="mt-1 text-[9px] text-ink-500 leading-snug font-mono">
          {explainBortleSource(activeBortleInfo)}
        </p>
      </div>
    </section>
  );
};
