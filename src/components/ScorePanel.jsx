// src/components/ScorePanel.jsx
import { calcularScore } from '../utils/astroLogic';
import { getBortleColor, getBortleLabel } from '../utils/bortleModel';

const getEstado = (score) => {
  if (score >= 75) return { label: 'Condiciones óptimas', shadow: 'shadow-neu-sky',    border: 'border-purple-300/25' };
  if (score >= 45) return { label: 'Condiciones parciales', shadow: 'shadow-neu-nebula', border: 'border-purple-400/25' };
  return                  { label: 'Condiciones adversas', shadow: 'shadow-neu-nebula', border: 'border-violet-500/20' };
};

const getColorScore = (score) => {
  if (score >= 75) return 'text-ethereal-lavender';
  if (score >= 45) return 'text-ethereal-purple';
  return 'text-violet-300';
};

const getGradientBarra = (score) => {
  if (score >= 75) return 'bg-gradient-to-r from-ethereal-indigo to-ethereal-lavender';
  if (score >= 45) return 'bg-gradient-to-r from-violet-600 to-ethereal-purple';
  return 'bg-gradient-to-r from-violet-800 to-violet-400';
};

const EtiquetaCabecera = ({ children }) => (
  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-400">
    {children}
  </p>
);

export const ScorePanel = ({ data, isLoading, isError, onRetry }) => {
  if (isLoading) return (
    <section className="glass-card glass-card-hover animate-card-rise shrink-0 rounded-2xl p-5">
      <EtiquetaCabecera>Score nocturno</EtiquetaCabecera>
      <p className="mt-4 text-[10px] text-ink-400 animate-pulse tracking-[0.18em] uppercase font-mono">
        SINCRONIZANDO...
      </p>
    </section>
  );

  if (!data) return (
    <section className="glass-card glass-card-hover animate-card-rise shrink-0 rounded-2xl p-5">
      <EtiquetaCabecera>Score nocturno</EtiquetaCabecera>
      <p className={`mt-4 text-[10px] tracking-[0.18em] uppercase font-mono ${isError ? 'text-rose-300' : 'text-astro-horizon'}`}>
        {isError ? 'SIN CONEXIÓN' : 'SIN DATOS'}
      </p>
      {isError && onRetry && (
        <button
          onClick={() => onRetry()}
          className="mt-3 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-purple-400/25 text-[10px] font-mono uppercase tracking-[0.14em] text-purple-200 hover:bg-purple-500/10 transition-colors"
        >
          Reintentar
        </button>
      )}
    </section>
  );

  const score = calcularScore(data);
  const { label, shadow, border } = getEstado(score);
  const colorScore = getColorScore(score);
  const bortleInfo = data.bortleInfo ?? {
    bortle: data.bortle ?? 4,
    label: getBortleLabel(data.bortle ?? 4),
    confidence: 'baja',
    source: 'fallback-ui',
  };
  const bortleColor = getBortleColor(bortleInfo.bortle);
  const distanceText = Number.isFinite(bortleInfo.distanceKm)
    ? `, ${bortleInfo.distanceKm} km`
    : '';

  return (
    <section className={`
      glass-card glass-card-hover animate-card-rise shrink-0
      relative rounded-2xl p-4 overflow-hidden
      border ${border} ${shadow}
      transition-all duration-700
    `}>
      {/* Halo decorativo */}
      <div className="pointer-events-none absolute -top-16 -right-12 w-36 h-36 rounded-full bg-purple-500/[0.07] blur-3xl" />

      {/* Label */}
      <EtiquetaCabecera>Score nocturno</EtiquetaCabecera>

      {/* Número principal */}
      <div className="mt-2 flex items-baseline gap-2 mb-1">
        <span className={`text-5xl font-mono font-light tracking-tight leading-none transition-colors duration-700 ${colorScore}`}>
          {score}
        </span>
        <span className="text-xl font-mono font-light text-ink-500">/100</span>
      </div>

      {/* Estado textual */}
      <p className="text-xs text-ink-400 tracking-wide mt-1">
        {label}
      </p>

      {/* Barra de progreso */}
      <div className="mt-4 mb-4 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${getGradientBarra(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Grid de métricas */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { key: 'Nubes',    val: `${data.nubosidad}%`          },
          { key: 'Lunar',    val: `${Math.round(data.faseLunar)}%`   },
          { key: 'Viento',   val: `${Math.round(data.jetstream)} km/h` },
          { key: 'Altitud',  val: `${data.altitud} m`               },
          { key: 'Bortle',   val: `${bortleInfo.bortle}`             },
        ].map(({ key, val }) => (
          <div
            key={key}
            className="glass-tile glass-tile-hover rounded-xl p-2"
          >
            <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-ink-500 mb-1">{key}</p>
            <p
              className="text-sm font-mono font-medium text-ink-100"
              style={key === 'Bortle' ? { color: bortleColor } : undefined}
            >
              {val}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-2.5 glass-tile rounded-xl p-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] text-ink-200 font-medium truncate">
            Bortle {bortleInfo.bortle} - {bortleInfo.label}
          </p>
          <span className="text-[8px] font-mono uppercase tracking-[0.14em] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-200 border border-purple-500/20 shrink-0">
            {bortleInfo.confidence}
          </span>
        </div>
        <p className="mt-1.5 text-[9px] leading-relaxed text-ink-400 font-mono">
          Dominante: {bortleInfo.sourceName ?? bortleInfo.dominantSource ?? 'sin fuente'}{distanceText}
        </p>
        <p className="mt-1 text-[9px] leading-relaxed text-ink-500 font-mono">
          Modelo: {bortleInfo.modelScope ?? bortleInfo.source} - {bortleInfo.method}
        </p>
        <p className="mt-1 text-[9px] leading-relaxed text-ink-500 font-mono">
          Estimacion local para prototipo. Calibrable con mediciones SQM.
        </p>
      </div>
    </section>
  );
};
