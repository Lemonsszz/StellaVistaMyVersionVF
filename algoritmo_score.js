export function calcularScore({ nubosidadBaja, jetstream, bortle, faseLunar, altitud }) {

  const norm_nubosidad = 1 - (nubosidadBaja / 100) //nubosidad (0-100%)
  const norm_jetstream = 1 - (Math.min(jetstream, 60) / 60) //velocidad del viento (condición máx. 60km/h)
  const norm_bortle    = 1 - ((bortle - 1) / 8) //escala 1-9
  const norm_lunar     = 1 - (faseLunar / 100) // 
  const norm_altitud   = altitud / 7000

  const score =
    (norm_nubosidad * 0.35) +
    (norm_bortle    * 0.35) +
    (norm_lunar     * 0.15) +
    (norm_jetstream * 0.10) +
    (norm_altitud   * 0.05)

  return score
}