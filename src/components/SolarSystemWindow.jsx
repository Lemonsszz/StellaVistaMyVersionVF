import solarSystemHtml from '../../new_components/index.html?raw';

export const SolarSystemWindow = ({ onCerrar }) => {
  return (
    <div className="fixed inset-0 bg-cosmos-950 z-50 flex flex-col font-sans text-ink-300">
      <div className="flex items-center px-4 h-12 border-b border-white/[0.04] bg-cosmos-950/70 backdrop-blur-xl shrink-0">
        <span className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-purple-200">
          <span className="w-1.5 h-1.5 rounded-full bg-ethereal-purple shadow-[0_0_10px_#c084fc]" />
          Sistema solar
        </span>

        <span className="ml-4 text-[9px] font-mono tracking-[0.16em] uppercase text-ink-500">
          BabylonJS - simulador orbital
        </span>

        <button
          onClick={onCerrar}
          className="ml-auto w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.08] text-ink-400 hover:text-white hover:border-purple-400/30 transition-all text-sm"
        >
          x
        </button>
      </div>

      <iframe
        title="Sistema Solar StellaVista"
        srcDoc={solarSystemHtml}
        className="flex-1 w-full border-0 bg-black"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};
