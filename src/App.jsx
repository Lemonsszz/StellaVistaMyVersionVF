import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAstroStore } from './store/useAstroStore';
import { useCondicionesNocturnas } from './hooks/useCondicionesNocturnas';
import { calcularScore, getColorSemforo } from './utils/astroLogic';

function App() {
  const { coordinates, setCoordinates } = useAstroStore();
  const { data, isLoading, isError } = useCondicionesNocturnas();
  
  // Usamos el MapKey directamente para evitar errores de .env por ahora
  const mapKey = "ECRGZxLvLb4HTx76OnDg";

  const manejaClic = (evento) => {
    const { lng, lat } = evento.lngLat;
    setCoordinates({ lat, lng });
  };

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden">
      <Map
        initialViewState={{
          longitude: coordinates.lng,
          latitude: coordinates.lat,
          zoom: 12
        }}
        // CORRECCIÓN DE SINTAXIS: Usamos backticks y ${}
        mapStyle={`https://api.maptiler.com/maps/dataviz-dark/style.json?key=${mapKey}`}
        onClick={manejaClic}
      />

      {/* PANEL DE CONTROL UNIFICADO */}
      <div className="absolute top-6 left-6 w-80 p-6 bg-zinc-950/90 text-white rounded-2xl border border-zinc-800 backdrop-blur-xl shadow-2xl">
        <h1 className="text-xl font-black tracking-tighter text-blue-400 italic">STELLAVISTA GIS 🛰️</h1>
        
        <div className="mt-2 mb-4 py-2 border-b border-zinc-800">
           <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Coordenadas Actuales</p>
           <p className="text-xs font-bold text-zinc-300">📍 {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}</p>
        </div>

        {isLoading ? (
          <div className="py-10 text-center">
            <p className="text-sm text-zinc-500 animate-pulse">SINCRONIZANDO SATÉLITES...</p>
          </div>
        ) : isError ? (
          <p className="text-red-400 text-sm py-4">Fallo en la conexión API</p>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Calidad de Cielo</span>
              <span className={`text-5xl font-black ${getColorSemforo(calcularScore(data))}`}>
                {calcularScore(data)}%
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-[11px] border-t border-zinc-800 pt-4">
              <div className="bg-zinc-900/50 p-2 rounded-lg">
                <p className="text-zinc-500 uppercase font-bold mb-1">Cielo</p>
                <p className="text-white font-mono">☁️ {data?.nubosidadBaja}% Nubes</p>
              </div>
              <div className="bg-zinc-900/50 p-2 rounded-lg">
                <p className="text-zinc-500 uppercase font-bold mb-1">Lunar</p>
                <p className="text-white font-mono">🌕 {Math.round(data?.faseLunar)}% Ilum.</p>
              </div>
              <div className="bg-zinc-900/50 p-2 rounded-lg">
                <p className="text-zinc-500 uppercase font-bold mb-1">Atmósfera</p>
                <p className="text-white font-mono">💨 {Math.round(data?.jetstream)} km/h</p>
              </div>
              <div className="bg-zinc-900/50 p-2 rounded-lg">
                <p className="text-zinc-500 uppercase font-bold mb-1">Elevación</p>
                <p className="text-white font-mono">🏔️ {data?.altitud} m</p>
              </div>
            </div>

            <p className="text-[9px] text-zinc-600 text-center uppercase tracking-tighter">
              ● Datos actualizados vía Open-Meteo & SunCalc
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;