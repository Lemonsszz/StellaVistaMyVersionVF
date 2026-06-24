# Modelo Bortle Bolivia-Oruro v1

## Que es

Este modelo estima contaminacion luminica/Bortle para StellaVista GIS usando fuentes de luz urbanas, rurales, mineras y de corredores poblados. Genera halos/anillos geoespaciales alrededor de esas fuentes para producir una capa visual local, liviana y offline.

El modelo prioriza utilidad de prototipo y demostracion visual. La precision cientifica depende de calibracion posterior.

Nota oficial:

> Modelo geoespacial estimado para prototipo, calibrable con mediciones SQM, observacion de campo o datasets cientificos preprocesados.

## Archivos principales

- `boliviaLightSources.js`: catalogo editable de fuentes de luz.
- `bortleZoneGenerator.js`: genera circulos/halos GeoJSON con irregularidad deterministica.
- `boliviaBortleZones.js`: separa zonas Bolivia general y Oruro precision.
- `bortleModel.js`: resuelve el Bortle dinamico para una coordenada.

## Cobertura

Bolivia tiene cobertura general con fuentes urbanas principales como La Paz / El Alto, Cochabamba, Santa Cruz, Sucre, Potosi, Tarija, Trinidad, Cobija y ciudades intermedias.

Oruro tiene mayor precision mediante fuentes departamentales:

- Oruro ciudad
- Vinto
- Caracollo
- Eucaliptus
- Toledo
- Huanuni
- Machacamarca
- Poopo
- Pazna
- Antequera
- Challapata
- Santiago de Huari
- Santuario de Quillacas
- Salinas de Garci Mendoza
- Sabaya
- Coipasa
- Curahuara de Carangas
- Turco
- Corque
- Huachacalla
- Chipaya
- Andamarca
- Belen de Andamarca
- Pampa Aullagas

## Como funciona

Cada fuente define anillos:

```js
rings: [
  { radiusKm: 3, bortle: 8, confidence: 'media-alta' },
  { radiusKm: 8, bortle: 7, confidence: 'media' },
  { radiusKm: 18, bortle: 6, confidence: 'media' },
]
```

El generador transforma esos anillos en Features GeoJSON. Los circulos tienen una irregularidad pequena, deterministica y estable para evitar halos demasiado perfectos.

## Resolucion por coordenada

`getBortleForCoordinates(lat, lng)` devuelve siempre un objeto seguro:

```js
{
  bortle: 5,
  label: 'Rural/periurbano',
  sqmRange: '19.5-20.4 mag/arcsec^2',
  confidence: 'media-baja',
  source: 'Modelo Bolivia-Oruro v1',
  method: 'generated-light-source-ring',
  sourceName: 'Challapata',
  dominantSource: 'Challapata',
  distanceKm: 8.2,
  description: 'Estimacion por distancia a fuente urbana/minera cercana'
}
```

Reglas de superposicion:

- Gana el Bortle mas alto.
- En empate gana la fuente mas cercana.
- Si la coordenada esta cerca del departamento de Oruro, las fuentes `oruro-precision` tienen prioridad.
- Si no hay fuente cercana, se usa `distance-fallback-dark-sky`.

## Dependencias

No depende de API externa.

No usa LightPollutionMap en vivo.

No usa NASA GIBS ni VIIRS en vivo para calcular Bortle.

No usa GeoTIFF pesado.

Funciona offline como prototipo liviano.

## Uso en StellaVista

Bortle se usa como variable del score nocturno, no como verdad absoluta en tiempo real. Actualmente pesa 35% en `calcularScore`.

La capa MapLibre se divide en:

- `Bortle Bolivia`: modelo nacional estimado por fuentes de luz.
- `Bortle Oruro precision`: zonificacion mas detallada para Oruro.

## Como ajustar radios de Oruro

Editar `src/data/boliviaLightSources.js` y buscar la fuente deseada.

Ejemplo:

```js
{
  id: 'challapata',
  name: 'Challapata',
  rings: [
    { radiusKm: 3.5, bortle: 7, confidence: 'media' },
    { radiusKm: 10, bortle: 6, confidence: 'media' },
    { radiusKm: 24, bortle: 5, confidence: 'media-baja' },
    { radiusKm: 45, bortle: 4, confidence: 'baja' },
  ],
}
```

Para hacer la fuente mas influyente, aumentar `radiusKm` o subir `bortle` en el anillo correspondiente. Para hacerla mas local, reducir radios.

## Como agregar una ciudad o pueblo

Agregar un objeto en `BOLIVIA_LIGHT_SOURCES`:

```js
{
  id: 'nuevo-pueblo',
  name: 'Nuevo Pueblo',
  department: 'Oruro',
  lat: -18.1234,
  lng: -67.1234,
  type: 'town',
  priority: 'oruro-precision',
  intensity: 0.4,
  baseBortle: 5,
  rings: [
    { radiusKm: 1.5, bortle: 5, confidence: 'media' },
    { radiusKm: 4, bortle: 4, confidence: 'media-baja' },
    { radiusKm: 10, bortle: 3, confidence: 'baja' },
  ],
  notes: 'Descripcion corta de la fuente',
}
```

Usar `priority: 'oruro-precision'` para fuentes detalladas del departamento de Oruro. Usar `priority: 'bolivia-general'` para cobertura nacional.

## Mejoras futuras

1. Importar asentamientos OSM/HOTOSM.
2. Usar limites ADM1/ADM2/ADM3.
3. Calibrar con mediciones SQM.
4. Preprocesar datasets cientificos en QGIS.
5. Reemplazar radios estimados por poligonos reales.
6. Ajustar pesos del score con validacion observacional.
