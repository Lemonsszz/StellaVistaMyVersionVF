# Contexto para ChatGPT Pro - StellaVista GIS

## Proposito del documento

Este archivo resume lo que ChatGPT Pro debe saber para ayudar a sacar adelante StellaVista GIS sin perder tiempo redescubriendo el proyecto. Incluye arquitectura, stack, componentes, flujo de datos, estado actual, problemas conocidos, prioridades y recomendaciones de trabajo.

## Resumen del proyecto

StellaVista GIS es una aplicacion web frontend para encontrar y evaluar lugares de observacion astronomica. La idea central es combinar mapa GIS, clima, contaminacion luminica, fase lunar, visibilidad planetaria y simulaciones visuales para ayudar al usuario a decidir donde y cuando observar el cielo.

Actualmente funciona como una SPA hecha con React y Vite. No hay backend propio. La app consume servicios externos desde el navegador y calcula gran parte de la logica astronomica localmente.

## Objetivo de producto

StellaVista debe sentirse como un panel de observatorio astronomico: tecnico, oscuro, preciso, inmersivo y orientado a tomar decisiones.

La experiencia deseada:

- El usuario entra y ve una intro inmersiva.
- Luego accede al dashboard principal.
- Puede seleccionar coordenadas en un mapa.
- El sistema calcula condiciones nocturnas y score de observacion.
- Puede ver fase lunar, planetas visibles, objetos de cielo profundo y pronostico.
- Puede abrir herramientas de pantalla completa como planetario y sistema solar.

## Stack tecnologico

### Runtime y build

- Vite
- React 19
- React DOM
- JavaScript con modulos ES
- Tailwind CSS 4
- PostCSS
- ESLint
- vite-plugin-pwa

### Estado y datos

- Zustand para estado global.
- TanStack React Query para fetching y cache.
- Fetch nativo del navegador para APIs externas.

### GIS y mapas

- MapLibre GL.
- react-map-gl con backend MapLibre.
- MapTiler para estilo base del mapa.
- NASA GIBS / VIIRS como tiles raster de contaminacion luminica.

### Astronomia

- astronomy-engine para posiciones de planetas y conversiones alt-az.
- SunCalc para iluminacion y fase lunar.
- Canvas 2D para luna y planetario.
- BabylonJS dentro de HTML embebido para sistema solar.

## Scripts disponibles

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

En PowerShell puede fallar `npm` por politica de ejecucion. Usar:

```bash
npm.cmd run dev
npm.cmd run build
npm.cmd run lint
```

Para levantar Vite directamente:

```bash
node node_modules/vite/bin/vite.js --host 127.0.0.1
```

## Estructura relevante

```txt
src/
  App.jsx
  main.jsx
  index.css
  App.css
  store/
    useAstroStore.js
  hooks/
    useCondicionesNocturnas.js
  utils/
    astroLogic.js
  components/
    Topbar.jsx
    ScorePanel.jsx
    LayerControl.jsx
    CoordsPanel.jsx
    AstroPanel.jsx
    ForecastBar.jsx
    MapaInteractivo.jsx
    Planetario.jsx
    IntroWindow.jsx
    SolarSystemWindow.jsx
    StellariumView.jsx
new_components/
  intro.html
  index.html
public/
  favicon.svg
  icons.svg
```

## Arquitectura actual

La app es cliente-cientrica.

`main.jsx` monta React y envuelve `App` con `QueryClientProvider`.

`App.jsx` compone el layout principal:

- topbar superior
- sidebar izquierdo
- mapa central
- sidebar derecho astronomico
- barra inferior de pronostico
- intro fullscreen al inicio

`useAstroStore.js` guarda estado global:

- coordenadas activas
- modo nocturno rojo
- capas del mapa

`useCondicionesNocturnas.js` consulta Open-Meteo cuando cambian las coordenadas. Devuelve:

- nubosidad
- jetstream
- altitud
- fase lunar
- fase numerica lunar
- bortle fijo
- forecast horario

`astroLogic.js` calcula el score nocturno.

## Flujo principal de datos

1. El usuario hace clic en el mapa.
2. `MapaInteractivo` recibe el evento de MapLibre.
3. `App.jsx` extrae `lat` y `lng`.
4. `setCoordinates` actualiza Zustand.
5. `useCondicionesNocturnas` reejecuta la query de Open-Meteo.
6. `ScorePanel`, `ForecastBar`, `CoordsPanel` y `AstroPanel` muestran datos derivados.
7. `AstroPanel` recalcula planetas y objetos de cielo profundo usando `astronomy-engine`.

## Componentes principales

### `App.jsx`

Responsable de la pantalla principal y del estado local `introVisible`.

Actualmente muestra `IntroWindow` al entrar. Cuando la intro termina, se oculta mediante `onComplete`.

### `IntroWindow.jsx`

Monta `new_components/intro.html` como `iframe` usando `?raw`.

Escucha:

```js
postMessage({ type: 'stellavista:intro-complete' })
```

Cuando recibe ese mensaje, llama `onComplete`.

### `new_components/intro.html`

HTML autocontenido con:

- canvas de estrellas, polvo, nebulosas y meteoros
- pantalla de bienvenida
- input de nombre
- animacion de letras
- OVNI y rayo tractor
- transicion warp
- flash final

Originalmente redirigia a `dashboard.html`. Fue ajustado para avisar al padre si corre dentro de iframe. Mantiene redirect como fallback cuando se abre independiente.

### `MapaInteractivo.jsx`

Mapa principal con MapLibre.

Capas implementadas:

- mapa base MapTiler
- contaminacion luminica VIIRS NASA GIBS
- sitios recomendados en GeoJSON local
- marcador de coordenada activa

Capas declaradas pero no implementadas visualmente:

- nubosidad

### `ScorePanel.jsx`

Muestra score nocturno y metricas.

Estados:

- `>= 75`: condiciones optimas
- `>= 45`: condiciones parciales
- `< 45`: condiciones adversas

### `ForecastBar.jsx`

Muestra hasta 8 franjas futuras a partir del forecast horario de Open-Meteo. Recalcula score por franja.

### `AstroPanel.jsx`

Panel derecho. Calcula:

- fase lunar
- planetas visibles
- objetos de cielo profundo

Tambien abre:

- `Planetario`
- `SolarSystemWindow`

### `Planetario.jsx`

Ventana fullscreen de cielo local en canvas 2D.

Incluye:

- circulos de altitud
- cardinales
- estrellas brillantes
- planetas
- simulacion horaria con offset de -12 a +12

### `SolarSystemWindow.jsx`

Monta `new_components/index.html` como `iframe`.

Se comporta como una ventana fullscreen, similar al planetario.

### `new_components/index.html`

Sistema solar BabylonJS autocontenido. Usa CDN:

- `https://cdn.babylonjs.com/babylon.js`
- `https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js`
- `https://cdn.babylonjs.com/gui/babylon.gui.min.js`

Incluye:

- sol
- planetas
- orbitas
- cometa Halley
- particulas
- panel de configuracion
- controles de velocidad, escala, FOV y visualizacion

### `StellariumView.jsx`

Existe pero no parece integrado actualmente.

Problema importante:

```js
const stellariumUrl = `https://stellarium-web.org{coordinates.lat}&lng=${coordinates.lng}&fov=70&live=true`;
```

La URL esta mal formada. Si se integra, debe corregirse antes.

## APIs y fuentes externas

### Open-Meteo

Usado para clima y pronostico.

Endpoint:

```txt
https://api.open-meteo.com/v1/forecast
```

Parametros actuales:

```txt
latitude
longitude
current=cloud_cover,wind_speed_200hPa
hourly=cloud_cover,wind_speed_200hPa
forecast_days=1
timezone=auto
```

### MapTiler

Usado como mapa base:

```txt
https://api.maptiler.com/maps/dataviz-dark/style.json?key=...
```

Problema: la clave esta hardcodeada en componentes, aunque existe `.env`.

### NASA GIBS / VIIRS

Tile raster:

```txt
https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_DayNightBand_ENCC/default/2023-11-01/GoogleMapsCompatible/{z}/{y}/{x}.jpg
```

Problema: la fecha esta fija.

### BabylonJS CDN

Usado solo dentro de `new_components/index.html`.

### Google Fonts

La app principal usa JetBrains Mono desde `index.html`.

La intro usa Orbitron e Inter desde su propio HTML.

## Variables de entorno

Archivo `.env` actual:

```env
VITE_MAPTILER_KEY=...
VITE_OPENWEATHER_KEY=tu_llave_aqui
VITE_ASTRONOMY_API_KEY=tu_llave_aqui
VITE_MAP_STYLE_URL=
```

Estado:

- `VITE_MAPTILER_KEY` existe, pero la app no lo usa correctamente.
- `VITE_OPENWEATHER_KEY` no se usa.
- `VITE_ASTRONOMY_API_KEY` no se usa.
- `VITE_MAP_STYLE_URL` no se usa.

Recomendacion: mover toda configuracion externa a `import.meta.env`.

## ADN visual

La app usa una estetica:

- fondo espacial oscuro
- panels neumorficos
- texto monoespaciado
- datos compactos
- acentos celestes, violetas y naranjas

Tipografia principal:

```css
"JetBrains Mono", "Space Mono", monospace
```

Colores principales:

```css
neu-base:   #0d0f1a
neu-raised: #111520
neu-sunken: #090b14
neu-border: #1e2040
neu-glow:   #1a1d35
neu-shadow: #06070f

astro-sky:     #7ecfff
astro-blue:    #4a9eff
astro-deep:    #2d6be4
astro-nebula:  #a78bfa
astro-void:    #7c3aed
astro-horizon: #fb923c
astro-ember:   #f59e0b
astro-text:    #c8d8f0
astro-muted:   #5a7090
astro-dim:     #3a4a60
```

Modo nocturno:

```css
.astro-red {
  filter: sepia(1) hue-rotate(-50deg) saturate(4) brightness(0.7);
}
```

## Logica de score

Archivo: `src/utils/astroLogic.js`

Ponderaciones:

- nubosidad: 35%
- bortle: 35%
- fase lunar: 15%
- jetstream: 10%
- altitud: 5%

Limitaciones:

- `bortle` es fijo en `4`.
- altitud tiene fallback `3700`.
- no hay modelo real de contaminacion luminica por coordenada.
- no hay calibracion cientifica formal documentada.

## Estado actual de build y lint

`npm.cmd run build` pasa correctamente.

`npm.cmd run lint` falla con errores preexistentes:

- `postcss.config.js`: import sin uso.
- `src/App.jsx`: `mapKey` sin uso.
- `src/components/ForecastBar.jsx`: variable `i` sin uso.
- `src/components/MapaInteractivo.jsx`: `useEffect` y `useCallback` sin uso.
- `src/components/Planetario.jsx`: `setState` sincronico dentro de effect.
- `src/components/Planetario.jsx`: `label` sin uso.
- `src/components/ScorePanel.jsx`: `getColorSemforo` importado sin uso.
- `src/main.jsx`: `createRoot` importado sin uso.

Los componentes `IntroWindow` y `SolarSystemWindow` no agregaron errores de lint.

## Problemas conocidos

### Codificacion de texto

Hay mojibake en varios archivos:

```txt
ContaminaciÃ³n
PronÃ³stico
JÃºpiter
OriÃ³n
```

Esto indica problemas de encoding en strings y comentarios. Debe normalizarse a UTF-8.

### Configuracion PWA

En `vite.config.js` aparece:

```js
mainifest: {
```

Debe ser:

```js
manifest: {
```

### Claves hardcodeadas

MapTiler key esta en codigo. Debe ir por `.env`.

### README generico

`README.md` aun es el de plantilla React + Vite. Falta documentacion real.

### `App.css`

Parece contener estilos de plantilla no usados.

### Capa de nubosidad incompleta

La UI tiene toggle de nubosidad, pero `MapaInteractivo` no dibuja capa de nubes.

### Sistema solar embebido

`new_components/index.html` depende de CDN BabylonJS. Si no hay internet, no carga.

### Intro embebida

La intro corre dentro de iframe. Es una solucion practica para preservar el HTML autocontenido. A futuro convendria convertirla a componente React si se quiere integracion fina.

### Seguridad de iframes

Los iframes usan sandbox, pero tambien `allow-same-origin` para compatibilidad. Si se endurece seguridad, probar cuidadosamente.

## Prioridades recomendadas

### Prioridad 1 - Limpieza tecnica

1. Corregir errores de lint.
2. Corregir encoding a UTF-8.
3. Corregir `manifest` en PWA.
4. Mover claves a `.env`.
5. Eliminar imports, variables y CSS muerto.

### Prioridad 2 - Producto base

1. Mejorar README.
2. Implementar estados de error y loading mas claros.
3. Hacer persistente la decision de omitir intro, por ejemplo con `localStorage`.
4. Agregar boton para reabrir intro desde topbar o ajustes.
5. Mejorar responsive del dashboard principal.

### Prioridad 3 - Datos cientificos

1. Reemplazar Bortle fijo por dato real o aproximacion documentada.
2. Implementar capa visual de nubosidad.
3. Actualizar o parametrizar fecha de VIIRS.
4. Mejorar modelo de score con transparencia para usuario.
5. Agregar calibracion por horizonte, luna sobre el horizonte y hora astronomica.

### Prioridad 4 - Experiencias inmersivas

1. Integrar sistema solar como componente React o lazy iframe.
2. Mejorar planetario con mas catalogo estelar.
3. Corregir o retirar `StellariumView`.
4. Agregar controles consistentes entre planetario y sistema solar.

### Prioridad 5 - Calidad

1. Tests unitarios para `calcularScore`.
2. Tests de componentes principales.
3. Tests e2e para flujo: intro -> dashboard -> click mapa -> paneles actualizados -> abrir ventanas.
4. Validacion visual desktop/mobile.

## Recomendaciones al pedir ayuda a ChatGPT Pro

Cuando se use ChatGPT Pro, conviene darle este archivo y pedir tareas concretas.

Buenos prompts:

```txt
Lee CONTEXTO_CHATGPT_PRO.md y propon una ruta de trabajo de 5 dias para estabilizar StellaVista sin cambiar el alcance visual.
```

```txt
Con base en CONTEXTO_CHATGPT_PRO.md, corrige los errores de lint sin cambiar comportamiento.
```

```txt
Con base en CONTEXTO_CHATGPT_PRO.md, convierte la key de MapTiler a variable de entorno y deja fallback controlado.
```

```txt
Con base en CONTEXTO_CHATGPT_PRO.md, diseña una implementacion realista para la capa de nubosidad en el mapa.
```

```txt
Con base en CONTEXTO_CHATGPT_PRO.md, normaliza los textos mojibake a UTF-8 y conserva el estilo visual.
```

## Cosas que ChatGPT Pro debe evitar

- No reescribir toda la app desde cero.
- No introducir backend sin razon clara.
- No cambiar la identidad visual por una landing page generica.
- No eliminar `new_components` sin migrar primero sus funciones.
- No hacer refactors grandes antes de corregir lint y encoding.
- No mover secretos reales al repositorio.
- No tocar comportamiento astronomico sin explicar supuestos.

## Estrategia tecnica recomendada

Trabajar en iteraciones pequenas:

1. Primero estabilizar.
2. Luego documentar.
3. Luego mejorar datos.
4. Luego ampliar visuales.
5. Finalmente empaquetar como PWA pulida.

Cada cambio deberia pasar:

```bash
npm.cmd run build
npm.cmd run lint
```

Mientras lint este fallando por deuda existente, cada PR o cambio debe indicar si agrego nuevos errores o solo mantiene los conocidos.

## Estado mental del proyecto

StellaVista ya tiene una idea potente: no es solo un mapa, es un cockpit astronomico. El camino mas sano no es agregar mas efectos primero, sino convertir lo que ya existe en una base confiable:

- datos mas honestos
- UI consistente
- errores visibles
- configuracion limpia
- documentacion clara
- experiencias fullscreen bien integradas

Con esa base, el proyecto puede crecer hacia una herramienta real para observacion astronomica amateur y turismo astronomico.

