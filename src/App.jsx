// src/App.jsx
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useState, useRef } from 'react';
import { useAstroStore } from './store/useAstroStore';
import { useCondicionesNocturnas } from './hooks/useCondicionesNocturnas';
import { Topbar }    from './components/Topbar';
import { ScorePanel }  from './components/ScorePanel';
import { LayerControl } from './components/LayerControl';
import { CoordsPanel } from './components/CoordsPanel';
import { AstroPanel }  from './components/AstroPanel';
import { ForecastBar } from './components/ForecastBar';
import { MapaInteractivo } from './components/MapaInteractivo';
import { IntroWindow } from './components/IntroWindow';
import  EventosAstronomicos  from './components/EventosAstronomicos';
import { AstronomoIA } from './components/AstronomoIA';
import { NotebookPen, Bot, ChevronUp, X, BookmarkCheck } from 'lucide-react';
import { BitacoraPanel } from './components/BitacoraPanel';
import { ObservacionesGuardadasPanel } from './components/ObservacionesGuardadasPanel';

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
  
  // Estado para controlar cuál panel flotante está activo: 'ninguno' | 'bitacora' | 'guardados' | 'ia'
  const [panelActivo, setPanelActivo] = useState('ninguno');
  // Estado para abrir/cerrar el menú desplegable del botón principal
  const [menuDesplegableAbierto, setMenuDesplegableAbierto] = useState(false);
  

  // Modo nocturno — aplica fi  ltro rojo a toda la app
  useEffect(() => {
    document.documentElement.classList.toggle('astro-red', isRedMode);
  }, [isRedMode]);

const manejaClic = (evento) => {
    const { lng, lat } = evento.lngLat;
    setCoordinates({ lat, lng });
    setEventoSeleccionado(null); // <--- Limpia el indicador/marcador anterior al hacer clic en el mapa
  };
//  const manejaClic = (evento) => {
   // const { lng, lat } = evento.lngLat;
    //setCoordinates({ lat, lng });
  //};
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

          {/* CONTENEDOR INFERIOR IZQUIERDO */}
          <div className="absolute bottom-6 left-6 z-50 flex flex-col items-start gap-2">
            
            {/* 3. PANEL ACTIVO (Bitácora, Lugares Guardados o Astrónomo IA) */}
            {panelActivo !== 'ninguno' && (
              <div 
                className={`rounded-xl border border-neu-border bg-neu-base shadow-2xl mb-2 flex flex-col relative overflow-hidden transition-all duration-200 ${
                  panelActivo === 'ia' 
                    ? 'w-[340px] h-[400px] max-w-[calc(100vw-3rem)]'  
                    : 'w-[380px] h-[460px] max-w-[calc(100vw-3rem)]'   
                }`}
              >
                
                {/* Botón de cierre absoluto */}
                <button
                  onClick={() => setPanelActivo('ninguno')}
                  className="absolute top-3 right-3 z-30 text-gray-400 hover:text-white p-1.5 rounded-md bg-neu-base/90 hover:bg-neu-border/50 transition-colors border border-neu-border/60 shadow"
                  title="Cerrar panel"
                >
                  <X size={16} />
                </button>

                <div className="w-full h-full flex flex-col overflow-hidden">
                  {panelActivo === 'bitacora' && (
                    <div className="p-4 overflow-y-auto h-full">
                      <BitacoraPanel
                        onClose={() => setPanelActivo('ninguno')}
                      />
                    </div>
                  )}
{panelActivo === 'guardados' && (
  <div className="p-4 overflow-y-auto h-full">
    <ObservacionesGuardadasPanel 
      onIrAlMapa={(lat, lng) => {
        // Reutilizamos el evento seleccionado o creamos un marcador temporal centrado
        const puntoSimulado = {
          mapLocation: { latitude: lat, longitude: lng, zoom: 10 },
          titulo: "Lugar guardado"
        };
        setEventoSeleccionado(puntoSimulado);

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: 10,
            duration: 2000,
          });
        }
        setPanelActivo('ninguno');
      }}
    />
  </div>
)}

                  {panelActivo === 'ia' && (
                    <div className="w-full h-full flex flex-col [&>*]:flex-1 [&>*]:overflow-hidden [&>*]:flex [&>*]:flex-col">
                      <AstronomoIA />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. MENÚ DESPLEGABLE (Opciones de herramientas) */}
            {menuDesplegableAbierto && panelActivo === 'ninguno' && (
              <div className="w-64 rounded-xl border border-neu-border bg-neu-base p-2 shadow-2xl flex flex-col gap-1 mb-2">
                <button
                  onClick={() => {
                    setPanelActivo('bitacora');
                    setMenuDesplegableAbierto(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-left rounded-lg text-gray-300 hover:bg-neu-border/20 hover:text-white transition-colors"
                >
                  <NotebookPen size={16} />
                  Bitácora astronómica
                </button>

                <button
                  onClick={() => {
                    setPanelActivo('guardados');
                    setMenuDesplegableAbierto(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-left rounded-lg text-gray-300 hover:bg-neu-border/20 hover:text-white transition-colors"
                >
                  <BookmarkCheck size={16} />
                  Lugares guardados / Visitas
                </button>

                <button
                  onClick={() => {
                    setPanelActivo('ia');
                    setMenuDesplegableAbierto(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-left rounded-lg text-gray-300 hover:bg-neu-border/20 hover:text-white transition-colors"
                >
                  <Bot size={16} />
                  Astrónomo IA
                </button>
              </div>
            )}

            {/* 1. BARRA DE CONTROL INFERIOR */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (panelActivo !== 'ninguno') {
                    setPanelActivo('ninguno');
                  } else {
                    setMenuDesplegableAbierto(!menuDesplegableAbierto);
                  }
                }}
                className="flex items-center gap-2 rounded-xl border border-neu-border bg-neu-base px-4 py-3 text-sm font-semibold text-white shadow-2xl hover:bg-neu-border/25 transition-all cursor-pointer"
              >
                <NotebookPen size={18} />
                <span>{panelActivo !== 'ninguno' ? 'Cerrar panel' : 'Herramientas'}</span>
                <ChevronUp size={16} className={`transition-transform duration-200 ${menuDesplegableAbierto || panelActivo !== 'ninguno' ? 'rotate-180' : ''}`} />
              </button>

              {/* Pestañas de cambio rápido */}
              {panelActivo !== 'ninguno' && (
                <div className="flex bg-neu-base border border-neu-border rounded-xl p-1 shadow-2xl items-center gap-1">
                  <button
                    onClick={() => setPanelActivo('bitacora')}
                    className={`px-2.5 py-2 text-xs rounded-lg transition-colors flex items-center gap-1 font-mono ${
                      panelActivo === 'bitacora' ? 'bg-neu-border/40 text-white font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                    title="Bitácora"
                  >
                    <NotebookPen size={14} />
                  </button>
                  <button
                    onClick={() => setPanelActivo('guardados')}
                    className={`px-2.5 py-2 text-xs rounded-lg transition-colors flex items-center gap-1 font-mono ${
                      panelActivo === 'guardados' ? 'bg-neu-border/40 text-white font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                    title="Lugares guardados"
                  >
                    <BookmarkCheck size={14} />
                  </button>
                  <button
                    onClick={() => setPanelActivo('ia')}
                    className={`px-2.5 py-2 text-xs rounded-lg transition-colors flex items-center gap-1 font-mono ${
                      panelActivo === 'ia' ? 'bg-neu-border/40 text-white font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                    title="Astrónomo IA"
                  >
                    <Bot size={14} />
                  </button>
                </div>
              )}
            </div>

          </div>

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