// src/components/MapaInteractivo.jsx
import { useRef } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { oruroBortleZones } from '../data/oruroBortleZones';
import { useAstroStore } from '../store/useAstroStore';

const SITIOS_RECOMENDADOS = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { nombre: 'Lago Uru Uru', score: 82 },
      geometry: { type: 'Point', coordinates: [-67.0833, -17.9333] },
    },
    {
      type: 'Feature',
      properties: { nombre: 'Sajama', score: 91 },
      geometry: { type: 'Point', coordinates: [-68.8833, -18.1167] },
    },
    {
      type: 'Feature',
      properties: { nombre: 'Salar de Coipasa', score: 88 },
      geometry: { type: 'Point', coordinates: [-68.7, -19.1833] },
    },
    {
      type: 'Feature',
      properties: { nombre: 'Lago Poopo', score: 79 },
      geometry: { type: 'Point', coordinates: [-67.0833, -18.75] },
    },
    {
      type: 'Feature',
      properties: { nombre: 'Parque Sajama', score: 94 },
      geometry: { type: 'Point', coordinates: [-68.9833, -18.0667] },
    },
    {
      type: 'Feature',
      properties: { nombre: 'Volcan Tunupa', score: 87 },
      geometry: { type: 'Point', coordinates: [-67.9167, -19.2] },
    },
    {
      type: 'Feature',
      properties: { nombre: 'Pampa Aullagas', score: 83 },
      geometry: { type: 'Point', coordinates: [-67.5, -19.0] },
    },
  ],
};

const BORTLE_SOURCE_DATA = {
  ...oruroBortleZones,
  features: [...oruroBortleZones.features].sort(
    (a, b) => a.properties.bortle - b.properties.bortle
  ),
};

const LAYER_BORTLE_FILL = {
  id: 'oruro-bortle-fill',
  type: 'fill',
  source: 'oruro-bortle-source',
  paint: {
    'fill-color': [
      'step',
      ['get', 'bortle'],
      '#2d1b69',
      3, '#2563eb',
      5, '#facc15',
      7, '#f43f5e',
      8, '#db2777',
    ],
    'fill-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      7, 0.26,
      11, 0.16,
    ],
  },
};

const LAYER_BORTLE_LINE = {
  id: 'oruro-bortle-line',
  type: 'line',
  source: 'oruro-bortle-source',
  paint: {
    'line-color': [
      'step',
      ['get', 'bortle'],
      '#4c1d95',
      3, '#38bdf8',
      5, '#fb923c',
      7, '#f43f5e',
      8, '#db2777',
    ],
    'line-opacity': 0.85,
    'line-width': [
      'interpolate',
      ['linear'],
      ['zoom'],
      6, 0.8,
      10, 1.8,
    ],
  },
};

const LAYER_VIIRS = {
  id: 'viirs-luminica',
  type: 'raster',
  source: 'viirs-source',
  paint: {
    'raster-opacity': 0.6,
    'raster-hue-rotate': 200,
  },
};

const LAYER_SITIOS_CIRCULOS = {
  id: 'sitios-circulos',
  type: 'circle',
  source: 'sitios-source',
  paint: {
    'circle-radius': 8,
    'circle-color': '#fb923c',
    'circle-opacity': 0.85,
    'circle-stroke-width': 1.5,
    'circle-stroke-color': '#0d0f1a',
  },
};

const LAYER_SITIOS_LABELS = {
  id: 'sitios-labels',
  type: 'symbol',
  source: 'sitios-source',
  layout: {
    'text-field': ['get', 'nombre'],
    'text-font': ['Open Sans Regular'],
    'text-size': 10,
    'text-offset': [0, 1.4],
    'text-anchor': 'top',
  },
  paint: {
    'text-color': '#c8d8f0',
    'text-halo-color': '#0d0f1a',
    'text-halo-width': 1.5,
  },
};

export const MapaInteractivo = ({ onClic }) => {
  const { coordinates, layers } = useAstroStore();
  const mapRef = useRef(null);
  const mapKey = 'ECRGZxLvLb4HTx76OnDg';

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: coordinates.lng,
        latitude: coordinates.lat,
        zoom: 8,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle={`https://api.maptiler.com/maps/dataviz-dark/style.json?key=${mapKey}`}
      onClick={onClic}
      cursor="crosshair"
    >
      {layers.bortleLocal && (
        <Source id="oruro-bortle-source" type="geojson" data={BORTLE_SOURCE_DATA}>
          <Layer {...LAYER_BORTLE_FILL} />
          <Layer {...LAYER_BORTLE_LINE} />
        </Source>
      )}

      {layers.contaminacionLuminica && (
        <Source
          id="viirs-source"
          type="raster"
          tiles={[
            'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_DayNightBand_ENCC/default/2023-11-01/GoogleMapsCompatible/{z}/{y}/{x}.jpg',
          ]}
          tileSize={256}
          attribution="NASA GIBS / VIIRS DNB"
        >
          <Layer {...LAYER_VIIRS} />
        </Source>
      )}

      {layers.sitiosRecomendados && (
        <Source id="sitios-source" type="geojson" data={SITIOS_RECOMENDADOS}>
          <Layer {...LAYER_SITIOS_CIRCULOS} />
          <Layer {...LAYER_SITIOS_LABELS} />
        </Source>
      )}

      <Marker longitude={coordinates.lng} latitude={coordinates.lat} anchor="bottom">
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-astro-sky border-2 border-neu-base shadow-neu-sm" />
          <div className="w-px h-3 bg-astro-sky opacity-60" />
        </div>
      </Marker>
    </Map>
  );
};
