// src/services/zonaObservacion.js
// Calcula las mejores zonas del catalogo para observar un planeta concreto.
// Combina la calidad del cielo del sitio, la altura actual del planeta y la
// distancia desde la ubicacion seleccionada en el mapa.

import * as Astronomy from 'astronomy-engine';
import { SITIOS_RECOMENDADOS } from '../data/sitiosRecomendados';

const RADIO_TIERRA_KM = 6371;
const aRadianes = (grados) => (grados * Math.PI) / 180;

const distanciaKm = (desde, sitio) => {
  const dLat = aRadianes(sitio.lat - desde.lat);
  const dLng = aRadianes(sitio.lng - desde.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(desde.lat)) *
      Math.cos(aRadianes(sitio.lat)) *
      Math.sin(dLng / 2) ** 2;
  return 2 * RADIO_TIERRA_KM * Math.asin(Math.sqrt(h));
};

const calcularZona = (sitio, planetKey, desde, ahora) => {
  try {
    const observer = new Astronomy.Observer(sitio.lat, sitio.lng, 0);
    const equatorial = Astronomy.Equator(planetKey, ahora, observer, true, true);
    const horizontal = Astronomy.Horizon(
      ahora,
      observer,
      equatorial.ra,
      equatorial.dec,
      'normal'
    );

    const altitud = Math.round(horizontal.altitude);
    const azimut = Math.round(horizontal.azimuth);
    const distancia = distanciaKm(desde, sitio);

    // 70 % calidad del cielo + 30 % altura del planeta, con una penalizacion
    // acotada por traslado. Asi no siempre gana el sitio mas lejano.
    const puntaje = Math.round(
      sitio.score + Math.max(0, altitud) * 0.4 - Math.min(distancia / 30, 30)
    );

    return {
      ...sitio,
      altitud,
      azimut,
      distanciaKm: Math.round(distancia),
      puntaje,
    };
  } catch {
    return null;
  }
};

export const getZonasParaPlaneta = (
  planetKey,
  desde,
  ahora = new Date(),
  limite = 3
) => {
  const zonas = SITIOS_RECOMENDADOS.map((sitio) =>
    calcularZona(sitio, planetKey, desde, ahora)
  ).filter(Boolean);

  const sobreHorizonte = zonas.filter((zona) => zona.altitud > 0);
  const base = sobreHorizonte.length ? sobreHorizonte : zonas;

  return base
    .sort((a, b) => b.puntaje - a.puntaje || b.score - a.score)
    .slice(0, limite);
};

export const getMejorZonaParaPlaneta = (planetKey, desde, ahora = new Date()) =>
  getZonasParaPlaneta(planetKey, desde, ahora, 1)[0] ?? null;
