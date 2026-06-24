import { ORURO_CENTER, oruroBortleZones } from '../data/oruroBortleZones';

const FALLBACK_SOURCE = 'fallback-distance-model';

const BORTLE_LABELS = {
  1: 'Cielo oscuro excelente',
  2: 'Altiplano alejado',
  3: 'Buen cielo rural',
  4: 'Cielo rural cercano',
  5: 'Transicion rural/periurbana',
  6: 'Periferia urbana',
  7: 'Urbano contaminado',
  8: 'Nucleo urbano brillante',
  9: 'Centro urbano extremo',
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

const safeNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const pointInRing = (lng, lat, ring) => {
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];

    const intersects =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi || Number.EPSILON) + xi;

    if (intersects) inside = !inside;
  }

  return inside;
};

const pointInPolygon = (lng, lat, coordinates) => {
  if (!coordinates?.length || !pointInRing(lng, lat, coordinates[0])) {
    return false;
  }

  for (let i = 1; i < coordinates.length; i++) {
    if (pointInRing(lng, lat, coordinates[i])) return false;
  }

  return true;
};

const pointInFeature = (lat, lng, feature) => {
  const { type, coordinates } = feature.geometry ?? {};

  if (type === 'Polygon') {
    return pointInPolygon(lng, lat, coordinates);
  }

  if (type === 'MultiPolygon') {
    return coordinates.some((polygon) => pointInPolygon(lng, lat, polygon));
  }

  return false;
};

const haversineKm = (from, to) => {
  const earthRadiusKm = 6371;
  const toRad = (degrees) => degrees * (Math.PI / 180);
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const getBortleLabel = (bortle) =>
  BORTLE_LABELS[Math.round(safeNumber(bortle, 5))] ?? 'Cielo estimado';

export const getBortleColor = (bortle) =>
  BORTLE_COLORS[Math.round(safeNumber(bortle, 5))] ?? '#5a7090';

const normalizeZone = (properties) => {
  const bortle = Math.min(9, Math.max(1, Math.round(safeNumber(properties.bortle, 5))));

  return {
    bortle,
    label: properties.label ?? getBortleLabel(bortle),
    sqmRange: properties.sqmRange ?? 'Sin rango SQM calibrado',
    confidence: properties.confidence ?? 'baja',
    source: properties.source ?? 'Modelo local Oruro v1',
    method: properties.method ?? 'polygon-zone',
    description:
      properties.description ??
      'Modelo local estimado para prototipo; reemplazable por mediciones SQM o dataset cientifico calibrado',
  };
};

const getFallbackZone = (lat, lng) => {
  const distanceKm = haversineKm(ORURO_CENTER, { lat, lng });

  if (distanceKm <= 4) {
    return {
      bortle: 8,
      label: getBortleLabel(8),
      sqmRange: '18.0-18.8 mag/arcsec^2',
      confidence: 'baja',
      source: FALLBACK_SOURCE,
      method: 'haversine-distance',
      description: 'Estimacion por distancia al centro urbano de Oruro para prototipo offline.',
    };
  }

  if (distanceKm <= 12) {
    return {
      bortle: 6,
      label: getBortleLabel(6),
      sqmRange: '18.9-19.4 mag/arcsec^2',
      confidence: 'baja',
      source: FALLBACK_SOURCE,
      method: 'haversine-distance',
      description: 'Estimacion por distancia al centro urbano de Oruro para prototipo offline.',
    };
  }

  if (distanceKm <= 35) {
    return {
      bortle: 4,
      label: getBortleLabel(4),
      sqmRange: '19.5-20.4 mag/arcsec^2',
      confidence: 'baja',
      source: FALLBACK_SOURCE,
      method: 'haversine-distance',
      description: 'Estimacion por distancia al centro urbano de Oruro para prototipo offline.',
    };
  }

  return {
    bortle: 2,
    label: getBortleLabel(2),
    sqmRange: '21.4-21.8 mag/arcsec^2',
    confidence: 'baja',
    source: FALLBACK_SOURCE,
    method: 'haversine-distance',
    description: 'Estimacion por distancia al centro urbano de Oruro para prototipo offline.',
  };
};

export const getBortleZoneForCoordinates = (lat, lng) => {
  const safeLat = safeNumber(lat, ORURO_CENTER.lat);
  const safeLng = safeNumber(lng, ORURO_CENTER.lng);

  const matches = oruroBortleZones.features
    .filter((feature) => pointInFeature(safeLat, safeLng, feature))
    .map((feature) => normalizeZone(feature.properties));

  if (matches.length) {
    return matches.sort((a, b) => b.bortle - a.bortle)[0];
  }

  return getFallbackZone(safeLat, safeLng);
};

export const getBortleForCoordinates = (lat, lng) =>
  getBortleZoneForCoordinates(lat, lng);

export const explainBortleSource = (zone) => {
  const safeZone = zone ?? getFallbackZone(ORURO_CENTER.lat, ORURO_CENTER.lng);
  return `${safeZone.source} / ${safeZone.method} / confianza ${safeZone.confidence}`;
};
