# Modelo Bortle Local para Oruro

## Que es

Este directorio contiene un modelo local estimado de contaminacion luminica para Oruro, Bolivia. El modelo asigna una clase Bortle aproximada segun la coordenada seleccionada en el mapa.

La fuente principal es `oruroBortleZones.js`, un GeoJSON liviano con poligonos zonales:

- nucleo urbano
- periferia urbana
- rural cercana
- altiplano alejado

## Alcance

Este modelo es una estimacion zonal para prototipo. No es una medicion exacta de campo, no representa el cielo en tiempo real y no debe presentarse como verdad cientifica calibrada.

La nota oficial del modelo es:

> Modelo local estimado para prototipo; reemplazable por mediciones SQM o dataset cientifico calibrado.

## Dependencias

No depende de APIs externas.

No usa Light Pollution Map.

No usa NASA GIBS ni VIIRS en vivo para calcular Bortle.

No usa GeoTIFF pesado.

Funciona offline como prototipo liviano.

## Como se usa

`src/utils/bortleModel.js` expone funciones para consultar el modelo:

- `getBortleForCoordinates(lat, lng)`
- `getBortleZoneForCoordinates(lat, lng)`
- `getBortleLabel(bortle)`
- `getBortleColor(bortle)`
- `explainBortleSource(zone)`

Si una coordenada cae dentro de un poligono, se usa la zona del GeoJSON. Si no cae en ningun poligono, se aplica un fallback por distancia al centro de Oruro usando haversine.

## Uso en el score

Bortle se usa como variable del score nocturno, no como verdad absoluta en tiempo real. Actualmente pesa 35% dentro de `calcularScore`.

## Como reemplazarlo por datos reales

Este modelo puede ser reemplazado por:

1. Mediciones SQM de campo.
2. Observaciones ciudadanas tipo Globe at Night.
3. Dataset cientifico preprocesado, calibrado y recortado para Oruro.

La idea es conservar la misma interfaz de `bortleModel.js` para que los paneles y el score no tengan que cambiar.
