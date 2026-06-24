export const BORTLE_MODEL_NOTE =
  'Modelo local estimado para prototipo; reemplazable por mediciones SQM o dataset cientifico calibrado';

export const oruroBortleZones = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'oruro-core',
        label: 'Nucleo urbano de Oruro',
        bortle: 8,
        sqmRange: '18.0-18.8 mag/arcsec^2',
        confidence: 'media',
        source: 'Modelo local Oruro v1',
        method: 'polygon-zone',
        description: `${BORTLE_MODEL_NOTE}. Zona central con mayor brillo urbano esperado.`,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-67.1530, -17.9250],
          [-67.0820, -17.9250],
          [-67.0780, -17.9880],
          [-67.1520, -17.9910],
          [-67.1710, -17.9600],
          [-67.1530, -17.9250],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'oruro-periphery',
        label: 'Periferia urbana',
        bortle: 6,
        sqmRange: '18.9-19.4 mag/arcsec^2',
        confidence: 'media',
        source: 'Modelo local Oruro v1',
        method: 'polygon-zone',
        description: `${BORTLE_MODEL_NOTE}. Anillo periurbano con transicion entre ciudad y altiplano.`,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-67.2150, -17.8720],
          [-67.0250, -17.8680],
          [-67.0120, -18.0400],
          [-67.2140, -18.0540],
          [-67.2550, -17.9600],
          [-67.2150, -17.8720],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'oruro-near-rural',
        label: 'Cielo rural cercano',
        bortle: 4,
        sqmRange: '19.5-20.4 mag/arcsec^2',
        confidence: 'media',
        source: 'Modelo local Oruro v1',
        method: 'polygon-zone',
        description: `${BORTLE_MODEL_NOTE}. Rural cercano con influencia luminica urbana todavia perceptible.`,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-67.4200, -17.7200],
          [-66.8200, -17.7200],
          [-66.8000, -18.2100],
          [-67.4300, -18.2300],
          [-67.5400, -17.9700],
          [-67.4200, -17.7200],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'oruro-far-altiplano',
        label: 'Altiplano alejado',
        bortle: 2,
        sqmRange: '21.4-21.8 mag/arcsec^2',
        confidence: 'baja',
        source: 'Modelo local Oruro v1',
        method: 'polygon-zone',
        description: `${BORTLE_MODEL_NOTE}. Area amplia de altiplano con menor influencia urbana estimada.`,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-68.1000, -17.2500],
          [-66.2500, -17.2500],
          [-66.1800, -18.8200],
          [-68.2200, -18.9000],
          [-68.4200, -17.9800],
          [-68.1000, -17.2500],
        ]],
      },
    },
  ],
};

export const ORURO_CENTER = {
  lat: -17.9561,
  lng: -67.1184,
};
