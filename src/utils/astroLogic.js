export const calcularScore = (data) => {
  // Extraemos y aseguramos que sean números con Number() o || 0
  const nubosidadBaja = Number(data?.nubosidadBaja) || 0;
  const jetstream = Number(data?.jetstream) || 0;
  const faseLunar = Number(data?.faseLunar) || 0;
  const altitud = Number(data?.altitud) || 3700;
  const bortle = Number(data?.bortle) || 4;

  // Normalización (Valores entre 0 y 1)
  const norm_nubosidad = 1 - (nubosidadBaja / 100);
  const norm_jetstream = 1 - (Math.min(jetstream, 60) / 60);
  const norm_bortle    = 1 - ((bortle - 1) / 8);
  const norm_lunar     = 1 - (faseLunar / 100);
  const norm_altitud   = Math.min(altitud / 5000, 1);

  const score =
    (norm_nubosidad * 0.35) +
    (norm_bortle    * 0.35) +
    (norm_lunar     * 0.15) +
    (norm_jetstream * 0.10) +
    (norm_altitud   * 0.05)

  return Math.round(score * 100);
};

export const getColorSemforo = (score) => {
  if (isNaN(score)) return 'text-zinc-500';
  if (score >= 75) return 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]'; // Verde Neón
  if (score >= 45) return 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]';  // Amarillo Neón
  return 'text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]';                    // Rojo Neón
};