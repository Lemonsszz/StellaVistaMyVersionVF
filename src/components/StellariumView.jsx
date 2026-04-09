import { useAstroStore } from '../store/useAstroStore';

export const StellariumView = () => {
  const { coordinates } = useAstroStore();

  // Construimos la URL dinámica:
  // fov: campo de visión (70 es estándar)
  // live: true para que se mueva con el tiempo real
  const stellariumUrl = `https://stellarium-web.org{coordinates.lat}&lng=${coordinates.lng}&fov=70&live=true`;

  return (
    <div className="absolute bottom-6 right-6 w-80 h-52 bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl z-20 group">
      {/* Título del Widget */}
      <div className="absolute top-0 left-0 w-full p-2 bg-zinc-900/80 backdrop-blur-md flex justify-between items-center border-b border-zinc-800 z-30">
        <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400 ml-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
          Vista en Tiempo Real
        </span>
      </div>

      {/* El iframe de Stellarium */}
      <iframe
        src={stellariumUrl}
        className="w-full h-full pt-8 grayscale-[0.3] contrast-[1.1]"
        frameBorder="0"
        scrolling="no"
        allow="none"
      ></iframe>

      {/* Overlay de interacción (Opcional: para que no robe el scroll del mapa) */}
      <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-blue-500/30 transition-colors rounded-2xl"></div>
    </div>
  );
};
