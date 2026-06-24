import { BOLIVIA_LIGHT_SOURCES } from '../data/boliviaLightSources';
import {
  getBortleFromLightSources,
  getDistanceKm,
  getDominantLightSource,
} from './bortleZoneGenerator';

const MODEL_SOURCE = 'Modelo Bolivia-Oruro v1';

const BORTLE_LABELS = {
  1: 'Cielo oscuro excelente',
  2: 'Cielo oscuro altoandino',
  3: 'Buen cielo rural',
  4: 'Cielo rural / transicion',
  5: 'Rural/periurbano',
  6: 'Periferia urbana',
  7: 'Urbano contaminado',
  8: 'Centro urbano brillante',
  9: 'Centro urbano extremo',
};

const SQM_RANGES = {
  1: '21.8-22.0 mag/arcsec^2',
  2: '21.4-21.8 mag/arcsec^2',
  3: '21.0-21.4 mag/arcsec^2',
  4: '20.4-21.0 mag/arcsec^2',
  5: '19.5-20.4 mag/arcsec^2',
  6: '18.9-19.5 mag/arcsec^2',
  7: '18.0-18.9 mag/arcsec^2',
  8: '17.0-18.0 mag/arcsec^2',
  9: '<17.0 mag/arcsec^2',
};

const BORTLE_COLORS = {
  1: '#2d1b69',
  2: '#4c1d95',
  3: '#2563eb',
  4: '#38bdf8',
  5: '#facc15',
  6: '#fb923c',
  7: '#f43f5e',
  8: '#db2777',
  9: '#a21caf',
};

const ORURO_BOUNDS = {
  minLat: -19.9,
  maxLat: -17.2,
  minLng: -68.8,
  maxLng: -66.4,
};

const safeNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clampBortle = (value) =>
  Math.min(9, Math.max(1, Math.round(safeNumber(value, 3))));

const isNearOruroDepartment = (lat, lng) =>
  lat >= ORURO_BOUNDS.minLat &&
  lat <= ORURO_BOUNDS.maxLat &&
  lng >= ORURO_BOUNDS.minLng &&
  lng <= ORURO_BOUNDS.maxLng;

export const getBortleLabel = (bortle) =>
  BORTLE_LABELS[clampBortle(bortle)] ?? 'Cielo estimado';

export const getBortleColor = (bortle) =>
  BORTLE_COLORS[clampBortle(bortle)] ?? '#5a7090';

const getFallbackDarkSky = (lat, lng) => {
  const dominantSource = getDominantLightSource(lat, lng, BOLIVIA_LIGHT_SOURCES);
  const distanceKm = dominantSource
    ? getDistanceKm(lat, lng, dominantSource.lat, dominantSource.lng)
    : undefined;

  const bortle = distanceKm === undefined
    ? 2
    : distanceKm > 110
      ? 2
      : distanceKm > 65
        ? 3
        : 4;

  return {
    bortle,
    label: getBortleLabel(bortle),
    sqmRange: SQM_RANGES[bortle],
    confidence: 'baja',
    source: MODEL_SOURCE,
    method: 'distance-fallback-dark-sky',
    sourceName: dominantSource?.name ?? 'Sin fuente cercana',
    dominantSource: dominantSource?.name ?? 'Sin fuente cercana',
    distanceKm,
    description:
      'Estimacion de cielo oscuro por distancia a fuentes urbanas/mineras catalogadas.',
  };
};

const normalizeMatch = (match, lat, lng) => {
  const bortle = clampBortle(match.bortle);
  const nearOruro = isNearOruroDepartment(lat, lng);
  const modelScope = match.priority === 'oruro-precision' || nearOruro
    ? 'Oruro precision v1'
    : 'Bolivia general v1';

  return {
    bortle,
    label: getBortleLabel(bortle),
    sqmRange: SQM_RANGES[bortle],
    confidence: match.confidence ?? 'baja',
    source: MODEL_SOURCE,
    method: match.method ?? 'generated-light-source-ring',
    sourceName: match.sourceName,
    dominantSource: match.sourceName,
    sourceId: match.sourceId,
    department: match.department,
    distanceKm: Number(match.distanceKm?.toFixed(1)),
    radiusKm: match.radiusKm,
    priority: match.priority,
    modelScope,
    description:
      'Estimacion por distancia a fuente urbana/minera cercana. Modelo geoespacial estimado para prototipo, calibrable con mediciones SQM, observacion de campo o datasets cientificos preprocesados.',
  };
};

export const getBortleZoneForCoordinates = (lat, lng) => {
  const safeLat = safeNumber(lat, -17.9647);
  const safeLng = safeNumber(lng, -67.1060);

  const preciseSources = BOLIVIA_LIGHT_SOURCES.filter(
    (source) => source.priority === 'oruro-precision'
  );
  const nationalSources = BOLIVIA_LIGHT_SOURCES.filter(
    (source) => source.priority !== 'oruro-precision'
  );

  const preciseMatch = isNearOruroDepartment(safeLat, safeLng)
    ? getBortleFromLightSources(safeLat, safeLng, preciseSources)
    : null;

  if (preciseMatch) {
    return normalizeMatch(preciseMatch, safeLat, safeLng);
  }

  const nationalMatch = getBortleFromLightSources(
    safeLat,
    safeLng,
    nationalSources
  );

  if (nationalMatch) {
    return normalizeMatch(nationalMatch, safeLat, safeLng);
  }

  return getFallbackDarkSky(safeLat, safeLng);
};

export const getBortleForCoordinates = (lat, lng) =>
  getBortleZoneForCoordinates(lat, lng);

export const explainBortleSource = (zone) => {
  const safeZone = zone ?? getFallbackDarkSky(-17.9647, -67.1060);
  const distance = Number.isFinite(safeZone.distanceKm)
    ? `, ${safeZone.distanceKm} km`
    : '';

  return `${safeZone.sourceName ?? safeZone.dominantSource} (${safeZone.method}${distance})`;
};
