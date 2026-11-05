# Guía para llevar STELLAVISTA GIS a otra computadora

Esta guía explica cómo copiar el proyecto completo y seguir trabajando en otra PC sin perder configuración.

## 1. Qué debes instalar en la computadora nueva

| Herramienta | Para qué sirve | Versión recomendada |
| --- | --- | --- |
| Node.js (incluye npm) | Ejecutar Vite, React y las dependencias | Node 20.19+ o Node 22.12+ (LTS) |
| Git (opcional, recomendado) | Clonar el proyecto y llevar historial de cambios | Última versión |
| Visual Studio Code (opcional) | Editar el código cómodamente | Última versión |

Descarga Node.js desde <https://nodejs.org/>. Al instalar, deja marcada la opción de agregar Node al PATH.

Verifica en una terminal nueva:

```bash
node -v
npm -v
```

Si `npm` no funciona en PowerShell por la política de ejecución, usa `npm.cmd` en lugar de `npm`.

## 2. Qué archivos debes copiar

### Opción A — Copiar la carpeta (USB, disco externo o ZIP)

Copia la carpeta completa del proyecto, pero **no copies** estas carpetas:

- `node_modules/` → se vuelve a instalar en la PC nueva.
- `dist/` → es solo la compilación; se genera de nuevo.
- `.git/` → opcional. Si quieres conservar el historial, sí cópiala.

Sí debes copiar:

- `src/`
- `public/`
- `new_components/`
- `index.html`
- `package.json`
- `package-lock.json`
- `vite.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `eslint.config.js`
- `jsconfig.json`
- `components.json`
- `README.md` y esta guía

### Importante: el archivo `.env`

El archivo `.env` está en `.gitignore`, así que **no viaja con Git** y algunos ZIP lo ocultan. Debes copiarlo manualmente o crearlo de nuevo en la PC nueva.

Contenido mínimo:

```env
VITE_GEMINI_API_KEY=tu_clave_de_gemini
```

Opcionalmente puedes fijar el modelo:

```env
VITE_GEMINI_MODEL=gemini-3.5-flash-lite
```

Si no pones `VITE_GEMINI_MODEL`, el proyecto usa el modelo configurado por defecto en `src/services/gemini.js`.

### Opción B — Usar Git (recomendado)

Si el proyecto ya está en GitHub, GitLab o similar:

```bash
git clone URL_DEL_REPOSITORIO
cd stellavista-gis-my
```

Luego crea el `.env` manualmente, porque no está en el repositorio.

Si todavía no está en Git y quieres subirlo:

```bash
git add .
git commit -m "Contexto GIS para Astronomo IA"
git remote add origin URL_DEL_REPOSITORIO
git push -u origin main
```

Antes de subirlo, confirma que `.env` no se esté subiendo:

```bash
git status
```

## 3. Instalar dependencias

Abre una terminal dentro de la carpeta del proyecto y ejecuta:

```bash
npm ci
```

`npm ci` instala exactamente las versiones de `package-lock.json`. Si falla, usa:

```bash
npm install
```

> **Nota importante:** este proyecto tiene un conflicto de versiones entre
> `vite@8` y `vite-plugin-pwa@1.2` (que aún declara soporte hasta Vite 7). Si
> `npm ci` o `npm install` terminan con `ERESOLVE`, ejecuta:
>
> ```bash
> npm install --legacy-peer-deps
> ```
>
> Ese comando es el que se usó para instalar las dependencias del proyecto,
> incluyendo `gsap` (la animación de los planetas).

En PowerShell, si `npm` está bloqueado:

```powershell
npm.cmd ci
```

o habilita scripts para tu usuario:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## 4. Ejecutar el proyecto

```bash
npm run dev
```

La terminal mostrará una dirección parecida a:

```text
http://localhost:5173
```

Ábrela en el navegador. Cada cambio en el código se recarga automáticamente.

Para probar la versión compilada:

```bash
npm run build
npm run preview
```

## 5. Servicios externos que usa el proyecto

| Servicio | Uso | ¿Necesita clave? |
| --- | --- | --- |
| Google Gemini | Respuestas del Astrónomo IA | Sí: `VITE_GEMINI_API_KEY` |
| Open-Meteo | Clima y pronóstico | No |
| MapTiler | Mapa base | Sí, pero está fija en el código actualmente |
| NASA GIBS / VIIRS | Capas satelitales | No |
| CDN de BabylonJS | Sistema solar embebido | No, pero requiere internet |

Notas:

- Sin internet, el mapa base, el clima y la IA pueden no cargar.
- La clave de MapTiler está actualmente dentro de `src/components/MapaInteractivo.jsx`. Si vas a publicar el proyecto, conviene moverla a `.env` y restringirla en el panel de MapTiler.
- Después de cambiar `.env`, detén y vuelve a iniciar `npm run dev`, porque Vite lee las variables al arrancar.

## 6. Qué NO se transfiere automáticamente

- `localStorage` y `sessionStorage` del navegador: son datos locales de cada equipo. La app los usa para caché y para recordar si ya se vio la intro.
- La clave `.env`.
- Los `node_modules`.
- La carpeta `dist`.

No pasa nada si no se copian: la app se reconstruye y vuelve a generar su caché.

## 7. Checklist rápida en la PC nueva

1. Instalar Node.js 20.19+ o 22.12+.
2. Copiar o clonar el proyecto sin `node_modules`.
3. Crear el archivo `.env` con `VITE_GEMINI_API_KEY`.
4. Abrir la terminal en la carpeta del proyecto.
5. Ejecutar `npm ci` (o `npm install --legacy-peer-deps` si hay conflicto de versiones).
6. Ejecutar `npm run dev`.
7. Abrir `http://localhost:5173`.
8. Probar el mapa, seleccionar un punto y abrir el Astrónomo IA.
9. Probar las 3 preguntas sugeridas.
10. Ejecutar `npm run build` para confirmar que compila.

## 8. Problemas comunes

### `npm` no se reconoce

Node.js no está instalado o la terminal se abrió antes de instalarlo. Cierra y vuelve a abrir la terminal. Si sigue fallando, reinstala Node marcando la opción de PATH.

### `vite` no se encuentra

Falta instalar dependencias:

```bash
npm install
```

### El mapa aparece en blanco

Revisa la conexión a internet y la clave de MapTiler. La clave está en `MapaInteractivo.jsx` en la versión actual.

### El Astrónomo IA responde con error de clave

Revisa que exista `.env` en la raíz del proyecto, que la variable se llame exactamente `VITE_GEMINI_API_KEY` y que hayas reiniciado `npm run dev`.

### PowerShell bloquea `npm.ps1`

Usa `npm.cmd` o cambia la política de ejecución con el comando indicado arriba.

### El puerto 5173 está ocupado

Vite elegirá otro puerto automáticamente o puedes ejecutar:

```bash
npm run dev -- --port 5174
```

## 9. Publicarlo después (opcional)

Cuando quieras dejar de trabajar solo en local:

1. Ejecuta `npm run build`.
2. Sube la carpeta `dist/` a un hosting estático (Vercel, Netlify, Cloudflare Pages o similar).
3. Configura `VITE_GEMINI_API_KEY` como variable de entorno en el hosting.
4. Si publicas el proyecto, restringe la clave de MapTiler y no subas `.env` al repositorio.

Con eso puedes seguir desarrollando en cualquier computadora y, más adelante, publicar la app sin cambiar la estructura del proyecto.
