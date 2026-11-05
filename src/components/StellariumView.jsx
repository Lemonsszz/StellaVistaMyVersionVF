import { useAstroStore } from '../store/useAstroStore';

export const StellariumView = () => {
  const { coordinates } = useAstroStore();

  // Construimos la URL dinámica:
  // fov: campo de visión (70 es estándar)
  // live: true para que se mueva con el tiempo real
  const stellariumUrl = `https://stellarium-web.org{coordinates.lat}&lng=${coordinates.lng}&fov=70&live=true`;

  return (
    <div className="absolute bottom-6 right-6 w-80 h-52 glass-card rounded-2xl overflow-hidden z-20 group">
      {/* Título del Widget */}
      <div className="absolute top-0 left-0 w-full p-2 bg-cosmos-950/70 backdrop-blur-xl flex justify-between items-center border-b border-white/[0.06] z-30">
        <span className="text-[9px] font-mono font-medium uppercase tracking-[0.16em] text-purple-200 ml-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-ethereal-purple rounded-full animate-pulse shadow-[0_0_8px_#c084fc]"></span>
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
      <div className="absolute inset-0 pointer-events-none border border-transparent group-hover:border-purple-400/30 transition-colors rounded-2xl"></div>
    </div>
  );
};
