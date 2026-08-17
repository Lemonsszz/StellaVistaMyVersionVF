
//https://api.maptiler.com/maps/dataviz-dark/style.json?key=${mapKey}`
// src/App.jsx
// src/App.jsx
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useState, useRef } from 'react';
import { useAstroStore } from './store/useAstroStore';
import { useCondicionesNocturnas } from './hooks/useCondicionesNocturnas';
import { Topbar }      from './components/Topbar';
import { ScorePanel }  from './components/ScorePanel';
import { LayerControl } from './components/LayerControl';
import { CoordsPanel } from './components/CoordsPanel';
import { AstroPanel }  from './components/AstroPanel';
import { ForecastBar } from './components/ForecastBar';
import { MapaInteractivo } from './components/MapaInteractivo';
import { IntroWindow } from './components/IntroWindow';
import  EventosAstronomicos  from './components/EventosAstronomicos';

const INTRO_SESSION_KEY = 'stellavista:intro-complete';

function App() {
  const { coordinates, setCoordinates, isRedMode } = useAstroStore();
  const { data, isLoading } = useCondicionesNocturnas();
  const mapKey = "ECRGZxLvLb4HTx76OnDg";
  const [introVisible, setIntroVisible] = useState(() => {
    return sessionStorage.getItem(INTRO_SESSION_KEY) !== 'true';
  });
  const mapRef = useRef(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  // Modo nocturno — aplica filtro rojo a toda la app
  useEffect(() => {
    document.documentElement.classList.toggle('astro-red', isRedMode);
  }, [isRedMode]);

  const manejaClic = (evento) => {
    const { lng, lat } = evento.lngLat;
    setCoordinates({ lat, lng });
  };

  const completarIntro = () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
    setIntroVisible(false);
  };

  return (
    <div className="w-screen h-screen bg-neu-base flex flex-col overflow-hidden font-mono">

      {/* FILA 1 — Topbar */}
      <Topbar coordinates={coordinates} />

      {/* FILA 2 — Contenido principal */}
      <div className="flex flex-1 overflow-hidden">

        {/* COLUMNA IZQUIERDA */}
        <aside className="w-64 bg-neu-base border-r border-neu-border flex flex-col shrink-0 overflow-y-auto">
          <ScorePanel data={data} isLoading={isLoading} />
          <LayerControl />
          <CoordsPanel altitud={data?.altitud} bortleInfo={data?.bortleInfo} />
        </aside>

        {/* MAPA CENTRAL */}
        <main className="flex-1 relative overflow-hidden">
          
            <MapaInteractivo
              onClic={manejaClic}
              mapRef={mapRef}
              eventoSeleccionado={eventoSeleccionado}
            />
            <EventosAstronomicos
              onVerEnMapa={(evento) => {
                setEventoSeleccionado(evento);

                if (evento?.mapLocation && mapRef.current) {
                  mapRef.current.flyTo({
                    center: [
                      evento.mapLocation.longitude,
                      evento.mapLocation.latitude,
                    ],
                    zoom: evento.mapLocation.zoom || 5,
                    duration: 2000,
                  });
                }
              }}
            />

          
        </main>

        {/* COLUMNA DERECHA */}
        <AstroPanel
          faseLunar={data?.faseLunar ?? 0}
          lunaFase={data?.lunaFase   ?? 0}
        />

      </div>

      {/* FILA 3 — Pronóstico */}
      <ForecastBar forecast={data?.forecast} dataActual={data} />

      {introVisible && (
        <IntroWindow onComplete={completarIntro} />
      )}

    </div>
  );
}

export default App;
