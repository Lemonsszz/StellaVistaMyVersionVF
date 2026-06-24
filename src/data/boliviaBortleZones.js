import { BOLIVIA_LIGHT_SOURCES } from './boliviaLightSources';
import { generateBortleZonesFromSources } from '../utils/bortleZoneGenerator';

const boliviaSources = BOLIVIA_LIGHT_SOURCES.filter(
  (source) => source.priority !== 'oruro-precision'
);

const oruroSources = BOLIVIA_LIGHT_SOURCES.filter(
  (source) => source.priority === 'oruro-precision'
);

export const boliviaBortleZonesGeoJSON =
  generateBortleZonesFromSources(boliviaSources);

export const oruroBortleZonesGeoJSON =
  generateBortleZonesFromSources(oruroSources);

export const getAllBortleZonesGeoJSON = () => ({
  type: 'FeatureCollection',
  features: [
    ...boliviaBortleZonesGeoJSON.features,
    ...oruroBortleZonesGeoJSON.features,
  ],
});
