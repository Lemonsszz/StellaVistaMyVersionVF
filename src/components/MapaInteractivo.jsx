// src/components/MapaInteractivo.jsx
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getAllBortleZonesGeoJSON } from '../data/boliviaBortleZones';
import { SITIOS_RECOMENDADOS_GEOJSON } from '../data/sitiosRecomendados';
import { useAstroStore } from '../store/useAstroStore';
import * as Astronomy from 'astronomy-engine';
import { PLANETAS } from '../data/catalogoAstronomico';

const BORTLE_SOURCE_DATA = getAllBortleZonesGeoJSON();

// Rampa violeta de 4 niveles, con saltos de luminación amplios para que las
// zonas se distingan entre sí sobre el mapa oscuro.
const bortleFillColor = [
  'step',
  ['get', 'bortle'],
  '#4338ca',
  3, '#8b5cf6',
  5, '#d946ef',
  7, '#f0abfc',
];

const bortleLineColor = [
  'step',
  ['get', 'bortle'],
  '#818cf8',
  3, '#a78bfa',
  5, '#e879f9',
  7, '#f5d0fe',
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
      5, 0.32,
      8, 0.28,
      11, 0.22,
    ],
  },
};

const LAYER_BORTLE_LINE = {
  id: 'contaminacion-luminica-bortle-bordes',
  type: 'line',
  source: 'bortle-zones-source',
  paint: {
    'line-color': bortleLineColor,
    'line-opacity': 0.62,
    'line-width': [
      'interpolate',
      ['linear'],
      ['zoom'],
      5, 0.9,
      10, 2.2,
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
    'circle-color': '#c084fc',
    'circle-opacity': 0.92,
    'circle-stroke-width': 1.5,
    'circle-stroke-color': '#e0e7ff',
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
    'text-color': '#e0e7ff',
    'text-halo-color': '#05060d',
    'text-halo-width': 1.5,
  },
};

export const MapaInteractivo = ({
  onClic,
  mapRef,
  eventoSeleccionado,
  mostrarInfoPunto,
}) => {
  const { coordinates, layers } = useAstroStore();
  const mapKey = 'ECRGZxLvLb4HTx76OnDg';
  const ahora = new Date();
  const observer = new Astronomy.Observer(coordinates.lat, coordinates.lng, 0);
  const planetasVisibles = PLANETAS.flatMap(({ key, label }) => {
    try {
      const equatorial = Astronomy.Equator(key, ahora, observer, true, true);
      const horizontal = Astronomy.Horizon(
        ahora,
        observer,
        equatorial.ra,
        equatorial.dec,
        'normal'
      );
      return horizontal.altitude >= 5 ? [label] : [];
    } catch {
      return [];
    }
  });

  return (
    <div className="relative w-full h-full">
      {/* Tinte violeta: solo afecta el tono, conserva luminancia y contraste.
          pointer-events-none deja intactos clic, zoom y arrastre del mapa. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[#6d28d9] opacity-[0.16] mix-blend-color"
      />

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
        <Source id="sitios-source" type="geojson" data={SITIOS_RECOMENDADOS_GEOJSON}>
          <Layer {...LAYER_SITIOS_CIRCULOS} />
          <Layer {...LAYER_SITIOS_LABELS} />
        </Source>
      )}
      

      <Marker longitude={coordinates.lng} latitude={coordinates.lat} anchor="bottom">
        <div className="flex flex-col items-center">
          {mostrarInfoPunto && (
            <div
              key={`${coordinates.lat}:${coordinates.lng}`}
              className="pointer-events-none mb-2 max-w-[260px] animate-data-refresh rounded-xl border border-purple-300/25 bg-cosmos-950/95 px-3 py-2 text-center font-sans shadow-[0_8px_24px_rgba(0,0,0,0.55)] backdrop-blur-md"
            >
              <p className="text-[9px] font-mono tracking-[0.08em] text-ink-300">
                LAT {coordinates.lat.toFixed(4)} · LNG {coordinates.lng.toFixed(4)}
              </p>
              <p className="mt-1 text-[10px] text-purple-100">
                Visibles:{' '}
                {planetasVisibles.length > 0
                  ? planetasVisibles.join(', ')
                  : 'ningún planeta'}
              </p>
            </div>
          )}
          <div className="relative flex items-center justify-center">
            <span className="absolute w-7 h-7 rounded-full bg-purple-500/20 animate-ping" />
            <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-purple-400 shadow-[0_0_16px_rgba(192,132,252,0.9)]" />
          </div>
          <div className="w-px h-3 bg-gradient-to-b from-purple-400/80 to-transparent" />
        </div>
      </Marker>
            {eventoSeleccionado?.mapLocation && (
        <Marker
          longitude={eventoSeleccionado.mapLocation.longitude}
          latitude={eventoSeleccionado.mapLocation.latitude}
          anchor="bottom"
        >
          <div className="flex flex-col items-center">
            <div className="px-3 py-2 rounded-xl bg-cosmos-900/90 backdrop-blur-md border border-purple-400/30 shadow-[0_10px_30px_rgba(0,0,0,0.6)] text-ink-100 text-xs whitespace-nowrap font-sans">
              {eventoSeleccionado.icono && `${eventoSeleccionado.icono} `}
              {eventoSeleccionado.titulo}
            </div>

            <div className="w-3 h-3 rounded-full bg-purple-300 border-2 border-white shadow-[0_0_14px_rgba(192,132,252,0.9)] mt-1" />
          </div>
        </Marker>
        
        
)}

      </Map>
    </div>
  );
};
