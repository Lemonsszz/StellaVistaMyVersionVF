// src/components/MapaInteractivo.jsx
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getAllBortleZonesGeoJSON } from '../data/boliviaBortleZones';
import { useAstroStore } from '../store/useAstroStore';

const SITIOS_RECOMENDADOS = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { nombre: 'Sajama', score: 94 }, geometry: { type: 'Point', coordinates: [-68.8833, -18.1167] } },
    { type: 'Feature', properties: { nombre: 'Parque Sajama', score: 94 }, geometry: { type: 'Point', coordinates: [-68.9833, -18.0667] } },
    { type: 'Feature', properties: { nombre: 'Salar de Coipasa', score: 88 }, geometry: { type: 'Point', coordinates: [-68.7, -19.1833] } },
    { type: 'Feature', properties: { nombre: 'Chipaya', score: 86 }, geometry: { type: 'Point', coordinates: [-68.05, -19.0] } },
    { type: 'Feature', properties: { nombre: 'Pampa Aullagas', score: 83 }, geometry: { type: 'Point', coordinates: [-67.5, -19.0] } },
    { type: 'Feature', properties: { nombre: 'Volcan Tunupa', score: 87 }, geometry: { type: 'Point', coordinates: [-67.9167, -19.2] } },
    { type: 'Feature', properties: { nombre: 'Salinas de Garci Mendoza', score: 85 }, geometry: { type: 'Point', coordinates: [-67.6667, -19.6333] } },
    { type: 'Feature', properties: { nombre: 'Coipasa', score: 86 }, geometry: { type: 'Point', coordinates: [-68.175, -19.275] } },
    { type: 'Feature', properties: { nombre: 'Curahuara de Carangas', score: 84 }, geometry: { type: 'Point', coordinates: [-68.4333, -17.8667] } },
    { type: 'Feature', properties: { nombre: 'Turco', score: 82 }, geometry: { type: 'Point', coordinates: [-68.2, -18.1833] } },
    { type: 'Feature', properties: { nombre: 'Corque', score: 81 }, geometry: { type: 'Point', coordinates: [-67.6833, -18.3333] } },
    { type: 'Feature', properties: { nombre: 'Huachacalla', score: 85 }, geometry: { type: 'Point', coordinates: [-68.25, -18.8] } },
    { type: 'Feature', properties: { nombre: 'Andamarca', score: 80 }, geometry: { type: 'Point', coordinates: [-67.5167, -18.7833] } },
    { type: 'Feature', properties: { nombre: 'Belen de Andamarca', score: 80 }, geometry: { type: 'Point', coordinates: [-67.65, -18.8167] } },
    { type: 'Feature', properties: { nombre: 'Lago Uru Uru', score: 75 }, geometry: { type: 'Point', coordinates: [-67.0833, -17.9333] } },
    { type: 'Feature', properties: { nombre: 'Lago Poopo', score: 79 }, geometry: { type: 'Point', coordinates: [-67.0833, -18.75] } },
    { type: 'Feature', properties: { nombre: 'Santiago de Huari', score: 78 }, geometry: { type: 'Point', coordinates: [-66.7833, -19.2167] } },
    { type: 'Feature', properties: { nombre: 'Santuario de Quillacas', score: 79 }, geometry: { type: 'Point', coordinates: [-66.95, -19.2333] } },
    { type: 'Feature', properties: { nombre: 'Salar de Uyuni', score: 90 }, geometry: { type: 'Point', coordinates: [-67.4891, -20.1338] } },
    { type: 'Feature', properties: { nombre: 'Laguna Colorada', score: 93 }, geometry: { type: 'Point', coordinates: [-67.7706, -22.2086] } },
    { type: 'Feature', properties: { nombre: 'Laguna Verde', score: 92 }, geometry: { type: 'Point', coordinates: [-67.7903, -22.7942] } },
    { type: 'Feature', properties: { nombre: 'Reserva Eduardo Avaroa', score: 92 }, geometry: { type: 'Point', coordinates: [-67.5, -22.5] } },
    { type: 'Feature', properties: { nombre: 'Valle de la Luna', score: 68 }, geometry: { type: 'Point', coordinates: [-68.093, -16.567] } },
    { type: 'Feature', properties: { nombre: 'Copacabana', score: 72 }, geometry: { type: 'Point', coordinates: [-69.086, -16.166] } },
    { type: 'Feature', properties: { nombre: 'Isla del Sol', score: 82 }, geometry: { type: 'Point', coordinates: [-69.055, -16.036] } },
    { type: 'Feature', properties: { nombre: 'Toro Toro', score: 84 }, geometry: { type: 'Point', coordinates: [-65.761, -18.133] } },
    { type: 'Feature', properties: { nombre: 'Samaipata', score: 77 }, geometry: { type: 'Point', coordinates: [-63.874, -18.18] } },
    { type: 'Feature', properties: { nombre: 'Noel Kempff Mercado', score: 91 }, geometry: { type: 'Point', coordinates: [-60.866, -14.267] } },
    { type: 'Feature', properties: { nombre: 'Madidi', score: 90 }, geometry: { type: 'Point', coordinates: [-67.75, -14.0] } },
    { type: 'Feature', properties: { nombre: 'Serrania del Aguarague', score: 82 }, geometry: { type: 'Point', coordinates: [-63.783, -21.75] } },
  ],
};

const BORTLE_SOURCE_DATA = getAllBortleZonesGeoJSON();

const bortleFillColor = [
  'step',
  ['get', 'bortle'],
  '#2d1b69',
  3, '#2563eb',
  5, '#facc15',
  7, '#f43f5e',
  8, '#db2777',
];

const bortleLineColor = [
  'step',
  ['get', 'bortle'],
  '#4c1d95',
  3, '#38bdf8',
  5, '#fb923c',
  7, '#f43f5e',
  8, '#db2777',
];

const LAYER_BORTLE_FILL = {
  id: 'contaminacion-luminica-bortle',
  type: 'fill',
  source: 'bortle-zones-source',
  paint: {
    'fill-color': bortleFillColor,
    'fill-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      5, 0.13,
      8, 0.11,
      11, 0.08,
    ],
  },
};

const LAYER_BORTLE_LINE = {
  id: 'contaminacion-luminica-bortle-bordes',
  type: 'line',
  source: 'bortle-zones-source',
  paint: {
    'line-color': bortleLineColor,
    'line-opacity': 0.26,
    'line-width': [
      'interpolate',
      ['linear'],
      ['zoom'],
      5, 0.4,
      10, 1.2,
    ],
  },
};

const LAYER_SITIOS_CIRCULOS = {
  id: 'sitios-circulos',
  type: 'circle',
  source: 'sitios-source',
  paint: {
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      5, 5,
      9, 8,
      12, 10,
    ],
    'circle-color': '#a78bfa',
    'circle-opacity': 0.9,
    'circle-stroke-width': 1.5,
    'circle-stroke-color': '#dbdce6',
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

export const MapaInteractivo = ({
  onClic,
  mapRef,
  eventoSeleccionado,
}) => {
  const { coordinates, layers } = useAstroStore();
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
      {layers.contaminacionLuminica && (
        <Source id="bortle-zones-source" type="geojson" data={BORTLE_SOURCE_DATA}>
          <Layer {...LAYER_BORTLE_FILL} />
          <Layer {...LAYER_BORTLE_LINE} />
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
          <div className="w-4 h-4 rounded-full bg-astro-blue border-2 border-neu-base shadow-neu-sm" />
          <div className="w-px h-3 bg-astro-nebula opacity-70" />
        </div>
      </Marker>
            {eventoSeleccionado?.mapLocation && (
        <Marker
          longitude={eventoSeleccionado.mapLocation.longitude}
          latitude={eventoSeleccionado.mapLocation.latitude}
          anchor="bottom"
        >
          <div className="flex flex-col items-center">
            <div className="px-3 py-2 rounded-lg bg-black/90 border border-white/20 shadow-xl text-white text-xs whitespace-nowrap">
              {eventoSeleccionado.icono} {eventoSeleccionado.titulo}
            </div>

            <div className="w-3 h-3 rounded-full bg-yellow-400 border-2 border-white shadow-lg mt-1" />
          </div>
        </Marker>
)}
    </Map>
  );
};
