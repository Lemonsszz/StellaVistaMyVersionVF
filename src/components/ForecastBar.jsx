// src/components/ForecastBar.jsx
import { calcularScore } from '../utils/astroLogic';

const getColorFranja = (score) => {
  // Mismos umbrales de siempre; solo cambia la gama cromática a violetas.
  if (score >= 75) return {
    texto:  'text-ethereal-lavender',
    barra:  'bg-gradient-to-r from-ethereal-indigo to-ethereal-lavender',
    glow:   'shadow-[0_0_20px_-8px_rgba(224,231,255,0.55)]',
    border: 'border-purple-300/30',
  };
  if (score >= 45) return {
    texto:  'text-ethereal-purple',
    barra:  'bg-gradient-to-r from-violet-600 to-ethereal-purple',
    glow:   'shadow-[0_0_20px_-8px_rgba(192,132,252,0.45)]',
    border: 'border-purple-400/25',
  };
  return {
    texto:  'text-violet-500',
    barra:  'bg-gradient-to-r from-violet-800 to-violet-500',
    glow:   'shadow-[0_0_18px_-8px_rgba(139,92,246,0.35)]',
    border: 'border-violet-500/20',
  };
};

export const ForecastBar = ({ forecast, dataActual }) => {
  if (!forecast?.length) return null;

  return (
    <footer className="animate-data-refresh shrink-0 px-4 pb-4 pt-2 font-sans">
      <div className="glass-card rounded-2xl p-3 shadow-glow-dock flex items-center gap-4">
        {/* Etiqueta del dock */}
        <div className="flex items-center gap-3 pl-1 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-ethereal-purple shadow-[0_0_10px_#c084fc]" />
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-400">
            Pronóstico nocturno
          </p>
        </div>

        <div className="grid gap-2 flex-1" style={{ gridTemplateColumns: `repeat(${forecast.length}, 1fr)` }}>
          {forecast.map(({ hora, nubosidad, jetstream }) => {
            // Calculamos score por franja usando datos parciales
            const scoreFranja = calcularScore({
              nubosidad,
              jetstream,
              faseLunar: dataActual?.faseLunar ?? 0,
              altitud:   dataActual?.altitud   ?? 3700,
              bortle:    dataActual?.bortle    ?? 4,
            });

            const { texto, barra, glow, border } = getColorFranja(scoreFranja);

            return (
              <div
                key={hora}
                className={`
                  ${glow} bg-white/[0.02] rounded-xl border ${border}
                  flex flex-col items-center justify-between gap-1
                  p-2 transition-all duration-300
                  hover:bg-white/[0.06] hover:-translate-y-0.5
                  cursor-default
                `}
              >
                {/* Hora */}
                <p className="text-[9px] font-mono text-ink-500 tracking-[0.14em] tabular-nums">
                  {hora}
                </p>

                {/* Score */}
                <p className={`text-base font-mono font-medium tabular-nums leading-none ${texto}`}>
                  {scoreFranja}
                </p>

                {/* Barra vertical */}
                <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${barra}`}
                    style={{ width: `${scoreFranja}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
};
