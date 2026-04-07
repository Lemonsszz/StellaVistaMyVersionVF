import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAstroStore } from './store/useAstroStore'; // Traemos tu "cerebro"

function App() {
  // Conectamos con el Store que creamos antes
  const { coordinates, setCoordinates } = useAstroStore();
  const mapKey = import.meta.env.VITE_MAPTILER_KEY;
  
  if (!mapKey) {
  console.error("VITE_MAPTILER_KEY no encontrada en .env");
}

  // Función que se activa al hacer clic en el mapa
  const manejaClic = (evento) => {
    const { lng, lat } = evento.lngLat;
    setCoordinates({ lat, lng });
    console.log("Coordenadas capturadas:", lat, lng);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Map
        initialViewState={{
          longitude: coordinates.lng,
          latitude: coordinates.lat,
          zoom: 5
        }}
        
        mapStyle={`https://api.maptiler.com/maps/dataviz-dark/style.json?key=${mapKey}`}
        onClick={manejaClic}
      />

      {/* Panel de Control de StellaView */}
      <div style={{ 
        position: 'absolute', top: 20, left: 20, color: 'white', 
        background: 'rgba(10, 10, 10, 0.85)', padding: '20px',
        borderRadius: '12px', fontFamily: 'sans-serif',
        border: '1px solid #333', backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }}>
        <strong style={{ fontSize: '20px', color: '#4facfe' }}>StellaView GIS</strong> 🌌
        <div style={{ marginTop: '15px', fontSize: '14px', color: '#ccc' }}>
          <p>📍 <strong>Lat:</strong> {coordinates.lat.toFixed(4)}</p>
          <p>📍 <strong>Lng:</strong> {coordinates.lng.toFixed(4)}</p>
        </div>
        <p style={{ 
          fontSize: '11px', marginTop: '10px', 
          color: '#ffcc00', textTransform: 'uppercase', letterSpacing: '1px' 
        }}>
          ● Sistema de coordenadas activo
        </p>
      </div>
    </div>
  );
}

export default App;
