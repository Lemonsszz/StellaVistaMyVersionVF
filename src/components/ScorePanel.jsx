// src/components/ScorePanel.jsx
import { calcularScore, getColorSemforo } from '../utils/astroLogic';

const getEstado = (score) => {
  if (score >= 75) return { label: 'Condiciones óptimas', shadow: 'shadow-neu-sky',  border: 'border-astro-sky/20' };
  if (score >= 45) return { label: 'Condiciones parciales', shadow: 'shadow-neu-horizon', border: 'border-astro-horizon/20' };
  return                  { label: 'Condiciones adversas', shadow: 'shadow-neu-nebula', border: 'border-astro-nebula/20' };
};

const getColorScore = (score) => {
  if (score >= 75) return 'text-astro-sky';
  if (score >= 45) return 'text-astro-horizon';
  return 'text-astro-nebula';
};

export const ScorePanel = ({ data, isLoading }) => {
  if (isLoading) return (
    <div className="p-4 border-b border-neu-border">
      <p className="text-[9px] tracking-[0.18em] uppercase text-astro-dim mb-4">
        Score nocturno
      </p>
      <p className="text-[10px] text-astro-muted animate-pulse tracking-widest">
        SINCRONIZANDO...
      </p>
    </div>
  );

  if (!data) return (
    <div className="p-4 border-b border-neu-border">
      <p className="text-[9px] tracking-[0.18em] uppercase text-astro-dim mb-4">
        Score nocturno
      </p>
      <p className="text-[10px] text-astro-horizon tracking-widest">
        SIN DATOS
      </p>
    </div>
  );

  const score = calcularScore(data);
  const { label, shadow, border } = getEstado(score);
  const colorScore = getColorScore(score);

  return (
    <div className={`
      m-3 p-4 rounded-xl
      bg-neu-raised border ${border}
      ${shadow}
      transition-all duration-700
    `}>
      {/* Label */}
      <p className="text-[9px] tracking-[0.18em] uppercase text-astro-dim mb-3">
        Score nocturno
      </p>

      {/* Número principal */}
      <div className="flex items-baseline gap-1 mb-1">
        <span className={`text-5xl font-bold leading-none transition-colors duration-700 ${colorScore}`}>
          {score}
        </span>
        <span className={`text-sm transition-colors duration-700 ${colorScore} opacity-50`}>
          /100
        </span>
      </div>

      {/* Estado textual */}
      <p className="text-[10px] text-astro-muted tracking-widest uppercase mt-1">
        {label}
      </p>

      {/* Barra de progreso */}
      <div className="mt-4 h-1 rounded-full bg-neu-sunken shadow-neu-inset overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            score >= 75 ? 'bg-astro-sky' :
            score >= 45 ? 'bg-astro-horizon' :
            'bg-astro-nebula'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Grid de métricas */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {[
          { key: 'Nubes',    val: `${data.nubosidad}%`          },
          { key: 'Lunar',    val: `${Math.round(data.faseLunar)}%`   },
          { key: 'Viento',   val: `${Math.round(data.jetstream)} km/h` },
          { key: 'Altitud',  val: `${data.altitud} m`               },
        ].map(({ key, val }) => (
          <div
            key={key}
            className="bg-neu-sunken rounded-lg p-2 shadow-neu-inset"
          >
            <p className="text-[8px] uppercase tracking-[0.14em] text-astro-dim mb-1">{key}</p>
            <p className="text-[11px] text-astro-text font-medium">{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
};