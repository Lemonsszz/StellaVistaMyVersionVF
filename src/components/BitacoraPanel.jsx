// src/components/BitacoraPanel.jsx
import { useState } from 'react';
import { NotebookPen, Trash2, MapPin, Save } from 'lucide-react';
import { useAstroStore } from '../store/useAstroStore';
import './BitacoraPanel.css';

const STORAGE_KEY = 'stellavista-bitacora';

export const BitacoraPanel = ({ onClose }) => {
  const { coordinates } = useAstroStore();

  const [registros, setRegistros] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const [objeto, setObjeto] = useState('Luna');
  const [lugar, setLugar] = useState('');
  const [fecha, setFecha] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [notas, setNotas] = useState('');

  const guardar = (e) => {
    e.preventDefault();

    const lugarPorDefecto = coordinates
      ? `Zona (${coordinates.lat.toFixed(2)}, ${coordinates.lng.toFixed(2)})`
      : 'Lugar sin nombre';

    const nuevo = {
      id: crypto.randomUUID(),
      objeto,
      lugar: lugar.trim() || lugarPorDefecto,
      fecha,
      notas: notas.trim(),
      lat: coordinates?.lat ?? null,
      lng: coordinates?.lng ?? null,
      creado: new Date().toISOString(),
    };

    const actualizados = [nuevo, ...registros];
    setRegistros(actualizados);
    
    // Guardamos en localStorage y disparamos un evento para que otras vistas se actualicen al instante
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados));
    window.dispatchEvent(new Event('storage'));

    setLugar('');
    setNotas('');
  };

  const eliminar = (id) => {
    const actualizados = registros.filter((registro) => registro.id !== id);
    setRegistros(actualizados);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="bitacora-container">
      <form className="bitacora-form" onSubmit={guardar}>
        <label>
          Objeto observado
          <select value={objeto} onChange={(e) => setObjeto(e.target.value)}>
            <option>Luna</option>
            <option>Júpiter</option>
            <option>Saturno</option>
            <option>Marte</option>
            <option>Venus</option>
            <option>Estrellas</option>
            <option>Vía Láctea</option>
            <option>Lluvia de meteoros</option>
            <option>Otro</option>
          </select>
        </label>

        <label>
          Lugar de observación
          <input
            value={lugar}
            onChange={(e) => setLugar(e.target.value)}
            placeholder="Ej. Oruro, Sajama..."
          />
        </label>

        <label>
          Fecha
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </label>

        <div className="bitacora-coords">
          <MapPin size={17} />
          <div>
            <strong>Ubicación del mapa</strong>
            <p>
              {coordinates
                ? `${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}`
                : 'Selecciona un punto en el mapa'}
            </p>
          </div>
        </div>

        <label>
          Notas de observación
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Condiciones del cielo, brillo, equipo utilizado..."
            rows={3}
          />
        </label>

        <button className="bitacora-save" type="submit">
          <Save size={17} /> Guardar observación
        </button>
      </form>
    </div>
  );
};