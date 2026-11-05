// src/components/ObservacionesGuardadasPanel.jsx
import { useState, useEffect } from 'react';
import { BookmarkCheck, Trash2, Navigation } from 'lucide-react';

const STORAGE_KEY = 'stellavista-bitacora';

export const ObservacionesGuardadasPanel = ({ onIrAlMapa }) => {
  const [registros, setRegistros] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const cargarRegistros = () => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setRegistros(data);
    } catch {
      setRegistros([]);
    }
  };

  // Sincronizar si cambia el localStorage en otra pestaña/componente
  useEffect(() => {
    window.addEventListener('storage', cargarRegistros);
    return () => window.removeEventListener('storage', cargarRegistros);
  }, []);

  const eliminar = (id) => {
    const actualizados = registros.filter((reg) => reg.id !== id);
    setRegistros(actualizados);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados));
  };

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-ethereal-purple shadow-[0_0_10px_#c084fc]" />
          <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-400 flex items-center gap-2">
            <BookmarkCheck size={14} className="text-purple-300" />
            Lugares guardados / Visitas
          </h2>
        </div>
        <p className="mt-1.5 ml-3.5 text-xs text-ink-400">Puntos guardados para observación astronómica</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {registros.length === 0 ? (
          <div className="text-center py-8 text-ink-400 text-sm">
            <p>No tienes lugares guardados todavía.</p>
            <p className="text-xs mt-1 opacity-75">Agrega observaciones desde la Bitácora astronómica.</p>
          </div>
        ) : (
          registros.map((reg) => (
            <div 
              key={reg.id} 
              className="p-3 rounded-xl border border-white/[0.05] bg-white/[0.02] flex flex-col gap-2 hover:border-purple-400/25 hover:bg-white/[0.035] transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-200 border border-purple-500/20">
                    {reg.objeto}
                  </span>
                  <h4 className="text-sm font-medium text-white mt-1.5">{reg.lugar}</h4>
                </div>
                
                <button
                  onClick={() => eliminar(reg.id)}
                  className="text-ink-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition-colors"
                  title="Eliminar registro"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {reg.notas && (
                <p className="text-[11px] text-ink-300 bg-white/[0.02] border border-white/[0.04] p-2 rounded-lg">
                  {reg.notas}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[10px] font-mono text-ink-500">
                <span>{reg.fecha}</span>
                
{reg.lat !== null && reg.lng !== null && (
  <button
    onClick={() => onIrAlMapa(reg.lat, reg.lng)}
    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-purple-500/15 hover:border-purple-400/25 text-purple-200 border border-white/[0.06] transition-colors font-mono"
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
