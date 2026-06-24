import solarSystemHtml from '../../new_components/index.html?raw';

export const SolarSystemWindow = ({ onCerrar }) => {
  return (
    <div className="fixed inset-0 bg-neu-base z-50 flex flex-col font-mono">
      <div className="flex items-center px-4 h-10 border-b border-neu-border shrink-0 bg-neu-base">
        <span className="text-[9px] tracking-[0.18em] uppercase text-astro-sky">
          Sistema solar
        </span>

        <span className="ml-4 text-[9px] tracking-[0.14em] uppercase text-astro-dim">
          BabylonJS - simulador orbital
        </span>

        <button
          onClick={onCerrar}
          className="ml-auto w-7 h-7 rounded bg-neu-raised border border-neu-border shadow-neu-sm text-astro-muted hover:text-astro-text transition-colors text-sm"
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
