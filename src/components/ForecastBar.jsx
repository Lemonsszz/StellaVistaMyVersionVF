// src/components/ForecastBar.jsx
import { calcularScore } from '../utils/astroLogic';

const getColorFranja = (score) => {
  if (score >= 75) return {
    texto:  'text-astro-sky',
    barra:  'bg-astro-sky',
    glow:   'shadow-neu-sky',
    border: 'border-astro-sky/20',
  };
  if (score >= 45) return {
    texto:  'text-astro-horizon',
    barra:  'bg-astro-horizon',
    glow:   'shadow-neu-horizon',
    border: 'border-astro-horizon/20',
  };
  return {
    texto:  'text-astro-nebula',
    barra:  'bg-astro-nebula',
    glow:   'shadow-neu-nebula',
    border: 'border-astro-nebula/20',
  };
};

export const ForecastBar = ({ forecast, dataActual }) => {
  if (!forecast?.length) return null;

  return (
    <footer className="h-28 bg-neu-base border-t border-neu-border shrink-0 px-3 py-2">
      <p className="text-[9px] tracking-[0.18em] uppercase text-astro-dim mb-2">
        Pronóstico nocturno
      </p>

      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${forecast.length}, 1fr)` }}>
        {forecast.map(({ hora, nubosidad, jetstream }, i) => {
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
                bg-neu-raised rounded-lg border ${border}
                ${glow} shadow-neu-sm
                flex flex-col items-center justify-between
                p-1.5 transition-all duration-500
              `}
            >
              {/* Hora */}
              <p className="text-[8px] text-astro-dim tracking-widest tabular-nums">
                {hora}
              </p>

              {/* Score */}
              <p className={`text-base font-bold tabular-nums leading-none ${texto}`}>
                {scoreFranja}
              </p>

              {/* Barra vertical */}
              <div className="w-full h-1 bg-neu-sunken rounded-full shadow-neu-inset overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barra}`}
                  style={{ width: `${scoreFranja}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </footer>
  );
};