
//https://api.maptiler.com/maps/dataviz-dark/style.json?key=${mapKey}`
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAstroStore } from './store/useAstroStore';
import { useCondicionesNocturnas } from './hooks/useCondicionesNocturnas';
import { calcularScore, getColorSemforo } from './utils/astroLogic';

function App() {
  const { coordinates, setCoordinates } = useAstroStore();
  const { data, isLoading } = useCondicionesNocturnas();
  
  const mapKey = "ECRGZxLvLb4HTx76OnDg";

  const manejaClic = (evento) => {
    const { lng, lat } = evento.lngLat;
    setCoordinates({ lat, lng });
  };

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden">
      {/* CORRECCIÓN: El componente Map se cierra con /> */}
      <Map
        initialViewState={{
          longitude: coordinates.lng,
          latitude: coordinates.lat,
          zoom: 12
        }}
        mapStyle={`https://api.maptiler.com/maps/dataviz-dark/style.json?key=${mapKey}`}
        onClick={manejaClic}
      />

      {/* PANEL DE CONTROL UNIFICADO */}
      <div className="absolute top-6 left-6 w-80 p-6 bg-zinc-950/90 text-white rounded-2xl border border-zinc-800 backdrop-blur-xl shadow-2xl z-10">
        <h1 className="text-xl font-black tracking-tighter text-blue-400 italic font-serif">STELLAVIEW GIS 🛰️</h1>
        
        <div className="mt-2 mb-4 py-2 border-b border-zinc-800">
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Coordenadas Actuales</p>
          <p className="text-xs font-bold text-zinc-300">📍 {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}</p>
        </div>

        {/* Lógica de estados corregida */}
        {data ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Calidad de Cielo</span>
              <span className={`text-6xl font-black transition-all duration-500 ${getColorSemforo(calcularScore(data))}`}>
                {calcularScore(data)}%
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-[11px] border-t border-zinc-800 pt-4">
              <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                <p className="text-zinc-500 uppercase font-bold mb-1">Cielo</p>
                <p className="text-white font-mono font-bold">☁️ {data.nubosidadBaja}% Nubes</p>
              </div>
              <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                <p className="text-zinc-500 uppercase font-bold mb-1">Lunar</p>
                <p className="text-white font-mono font-bold">🌕 {Math.round(data.faseLunar)}% Ilum.</p>
              </div>
              <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                <p className="text-zinc-500 uppercase font-bold mb-1">Atmósfera</p>
                <p className="text-white font-mono font-bold">💨 {Math.round(data.jetstream)} km/h</p>
              </div>
              <div className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                <p className="text-zinc-500 uppercase font-bold mb-1">Elevación</p>
                <p className="text-white font-mono font-bold">🏔️ {data.altitud} m</p>
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div className="py-10 text-center">
            <p className="text-sm text-zinc-500 animate-pulse font-mono">SINCRONIZANDO...</p>
          </div>
        ) : (
          <p className="text-red-400 text-sm py-4">Fallo de conexión o coordenadas inválidas</p>
        )}
              {/* Botón de Modo Rojo */}
      <button 
        onClick={() => document.documentElement.classList.toggle('astro-red')}
        className="w-full mt-6 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-red-950/30 transition-colors"
      >
        Activar el Modo Nocturno
      </button>
      </div>

    </div>
  );
}

export default App;