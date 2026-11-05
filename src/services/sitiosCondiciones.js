// src/services/sitiosCondiciones.js
// Consulta Open-Meteo para todos los sitios recomendados en una sola
// peticion. Asi el Astronomo IA puede comparar condiciones en vivo y no
// solo el score base del mapa.

import SunCalc from 'suncalc';
import { SITIOS_RECOMENDADOS } from '../data/sitiosRecomendados';
import { calcularScore } from '../utils/astroLogic';
import { getBortleForCoordinates } from '../utils/bortleModel';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

const toNumberOrNull = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const buildUrl = (sitios) => {
  const latitudes = sitios.map((sitio) => sitio.lat.toFixed(4)).join(',');
  const longitudes = sitios.map((sitio) => sitio.lng.toFixed(4)).join(',');

  return `${OPEN_METEO_URL}?latitude=${latitudes}&longitude=${longitudes}&current=cloud_cover,wind_speed_200hPa&timezone=auto&forecast_days=1`;
};

export const fetchCondicionesSitios = async (sitios = SITIOS_RECOMENDADOS) => {
  const iluminacionLunar = (SunCalc.getMoonIllumination(new Date()).fraction ?? 0) * 100;
  let respuestas = [];

  try {
    const res = await fetch(buildUrl(sitios));
    if (!res.ok) throw new Error(`Open-Meteo respondio ${res.status}`);

    const payload = await res.json();
    respuestas = Array.isArray(payload) ? payload : [payload];
  } catch (error) {
    console.warn('No se pudieron obtener condiciones de los sitios:', error);
  }

  const sitiosConCondiciones = sitios.map((sitio, index) => {
    const bortleInfo = getBortleForCoordinates(sitio.lat, sitio.lng);
    const respuesta = respuestas[index];

    const nubosidad = toNumberOrNull(respuesta?.current?.cloud_cover);
    const jetstream = toNumberOrNull(respuesta?.current?.wind_speed_200hPa);
    const altitud = toNumberOrNull(respuesta?.elevation);

    const tieneClima = nubosidad !== null && jetstream !== null;
    const scoreAhora = tieneClima
      ? calcularScore({
          nubosidad,
          jetstream,
          faseLunar: iluminacionLunar,
          altitud: altitud ?? 3700,
          bortle: bortleInfo.bortle,
        })
      : null;

    return {
      ...sitio,
      bortle: bortleInfo.bortle,
      bortleLabel: bortleInfo.label,
      fuenteLuz: bortleInfo.sourceName ?? bortleInfo.dominantSource ?? 'sin fuente',
      nubosidad: nubosidad === null ? null : Math.round(nubosidad),
      jetstream: jetstream === null ? null : Math.round(jetstream),
      altitud: altitud === null ? null : Math.round(altitud),
      scoreAhora,
      tieneDatosEnVivo: tieneClima,
    };
  });

  return {
    sitios: sitiosConCondiciones,
    actualizadoEn: new Date().toISOString(),
    conDatosEnVivo: sitiosConCondiciones.some((sitio) => sitio.tieneDatosEnVivo),
  };
};
