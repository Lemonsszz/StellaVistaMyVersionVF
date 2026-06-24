const EARTH_RADIUS_KM = 6371;
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const irregularityFactor = (sourceId, ringIndex, stepIndex) => {
  const seed = hashString(`${sourceId}-${ringIndex}`);
  const waveA = Math.sin((stepIndex + seed) * 1.618);
  const waveB = Math.cos((stepIndex * 3 + seed) * 0.731);
  return 1 + ((waveA * 0.06) + (waveB * 0.025));
};

export const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const dLat = (lat2 - lat1) * DEG_TO_RAD;
  const dLng = (lng2 - lng1) * DEG_TO_RAD;
  const rLat1 = lat1 * DEG_TO_RAD;
  const rLat2 = lat2 * DEG_TO_RAD;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const generateCirclePolygon = (
  centerLat,
  centerLng,
  radiusKm,
  steps = 96,
  options = {}
) => {
  const coordinates = [];
  const centerLatRad = centerLat * DEG_TO_RAD;
  const centerLngRad = centerLng * DEG_TO_RAD;
  const sourceId = options.sourceId ?? 'circle';
  const ringIndex = options.ringIndex ?? 0;
  const irregular = options.irregular !== false;

  for (let i = 0; i < steps; i++) {
    const bearing = (2 * Math.PI * i) / steps;
    const adjustedRadius = irregular
      ? radiusKm * irregularityFactor(sourceId, ringIndex, i)
      : radiusKm;
    const angularDistance = adjustedRadius / EARTH_RADIUS_KM;

    const lat = Math.asin(
      Math.sin(centerLatRad) * Math.cos(angularDistance) +
      Math.cos(centerLatRad) * Math.sin(angularDistance) * Math.cos(bearing)
    );

    const lng =
      centerLngRad +
      Math.atan2(
        Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(centerLatRad),
        Math.cos(angularDistance) - Math.sin(centerLatRad) * Math.sin(lat)
      );

    coordinates.push([lng * RAD_TO_DEG, lat * RAD_TO_DEG]);
  }

  coordinates.push(coordinates[0]);
  return {
    type: 'Polygon',
    coordinates: [coordinates],
  };
};

const createFeature = (source, ring, ringIndex) => ({
  type: 'Feature',
  properties: {
    id: `${source.id}-b${ring.bortle}-r${ringIndex}`,
    sourceId: source.id,
    sourceName: source.name,
    department: source.department,
    bortle: ring.bortle,
    confidence: ring.confidence,
    method: 'generated-light-source-ring',
    radiusKm: ring.radiusKm,
    description:
      'Modelo geoespacial estimado para prototipo, calibrable con mediciones SQM, observacion de campo o datasets cientificos preprocesados.',
    priority: source.priority,
  },
  geometry: generateCirclePolygon(source.lat, source.lng, ring.radiusKm, 72, {
    sourceId: source.id,
    ringIndex,
  }),
});

export const generateBortleZonesFromSources = (lightSources) => ({
  type: 'FeatureCollection',
  features: lightSources
    .flatMap((source) =>
      source.rings.map((ring, ringIndex) => createFeature(source, ring, ringIndex))
    )
    .sort((a, b) => a.properties.bortle - b.properties.bortle),
});

export const getDominantLightSource = (lat, lng, lightSources) => {
  const candidates = lightSources
    .map((source) => ({
      ...source,
      distanceKm: getDistanceKm(lat, lng, source.lat, source.lng),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return candidates[0] ?? null;
};

export const getBortleFromLightSources = (lat, lng, lightSources) => {
  const matches = [];

  for (const source of lightSources) {
    const distanceKm = getDistanceKm(lat, lng, source.lat, source.lng);

    for (const ring of source.rings) {
      if (distanceKm <= ring.radiusKm) {
        matches.push({
          bortle: ring.bortle,
          confidence: ring.confidence,
          sourceName: source.name,
          sourceId: source.id,
          department: source.department,
          priority: source.priority,
          method: 'generated-light-source-ring',
          radiusKm: ring.radiusKm,
          distanceKm,
          source,
        });
      }
    }
  }

  if (!matches.length) return null;

  return matches.sort((a, b) => {
    const priorityA = a.priority === 'oruro-precision' ? 1 : 0;
    const priorityB = b.priority === 'oruro-precision' ? 1 : 0;
    if (priorityA !== priorityB) return priorityB - priorityA;
    if (a.bortle !== b.bortle) return b.bortle - a.bortle;
    return a.distanceKm - b.distanceKm;
  })[0];
};
