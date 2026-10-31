// src/components/ObservacionesGuardadasPanel.jsx
import { useState, useEffect } from 'react';
import { BookmarkCheck, Trash2, Navigation } from 'lucide-react';

const STORAGE_KEY = 'stellavista-bitacora';

export const ObservacionesGuardadasPanel = ({ onIrAlMapa }) => {
  const [registros, setRegistros] = useState([]);

  const cargarRegistros = () => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setRegistros(data);
    } catch {
      setRegistros([]);
    }
  };

  // Cargar registros al montar el componente y cada vez que la ventana reciba foco o se abra
  useEffect(() => {
    cargarRegistros();

    // Sincronizar si cambia el localStorage en otra pestaña/componente
    window.addEventListener('storage', cargarRegistros);
    return () => window.removeEventListener('storage', cargarRegistros);
  }, []);

  const eliminar = (id) => {
    const actualizados = registros.filter((reg) => reg.id !== id);
    setRegistros(actualizados);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookmarkCheck size={20} className="text-purple-400" />
          Lugares guardados / Visitas
        </h2>
        <p className="text-xs text-gray-400">Puntos guardados para observación astronómica</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {registros.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            <p>No tienes lugares guardados todavía.</p>
            <p className="text-xs mt-1 opacity-75">Agrega observaciones desde la Bitácora astronómica.</p>
          </div>
        ) : (
          registros.map((reg) => (
            <div 
              key={reg.id} 
              className="p-3 rounded-xl border border-neu-border bg-neu-raised flex flex-col gap-2 shadow-sm hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    {reg.objeto}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">{reg.lugar}</h4>
                </div>
                
                <button
                  onClick={() => eliminar(reg.id)}
                  className="text-gray-400 hover:text-red-400 p-1 transition-colors"
                  title="Eliminar registro"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {reg.notas && (
                <p className="text-xs text-gray-300 bg-neu-sunken p-2 rounded-lg">
                  {reg.notas}
                </p>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-neu-border text-xs text-gray-400">
                <span>{reg.fecha}</span>
                
{reg.lat !== null && reg.lng !== null && (
  <button
    onClick={() => onIrAlMapa(reg.lat, reg.lng)}
    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neu-border/30 hover:bg-purple-600 hover:text-white text-purple-300 transition-colors font-mono"
    title="Ver ubicación en el mapa"
  >
    <Navigation size={13} />
    <span>{reg.lat.toFixed(2)}, {reg.lng.toFixed(2)}</span>
  </button>
)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};