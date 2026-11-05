import { useEffect, useState } from 'react';
import Galaxy from './Galaxy';
import introHtml from '../../new_components/intro.html?raw';

// Paleta de estrellas del fondo Galaxy (máx. 4 colores).
// Lilac White, azul cósmico, lavanda e iris rosado.
const GALAXY_STAR_COLORS = ['#f4f0ff', '#9cb2ff', '#9382ff', '#e59cff'];

export const IntroWindow = ({ onComplete, onLeaving }) => {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'stellavista:intro-complete') {
        onComplete();
        return;
      }

      // El portal avisa cuando arranca el warp (pantalla ya cubierta).
      // Aprovechamos para montar el dashboard detras y congelar Galaxy.
      if (event.data?.type === 'stellavista:intro-leaving') {
        setLeaving(true);
        onLeaving?.();
        return;
      }

      // El portal vive dentro de un iframe; reenviamos el puntero al fondo
      // Galaxy para que la repulsión de estrellas y el clickWarp funcionen.
      if (event.data?.type === 'stellavista:pointer') {
        const { event: type, x, y, pointerType } = event.data;

        if (type === 'pointerleave') {
          document.documentElement.dispatchEvent(
            new PointerEvent('pointerleave', { bubbles: false })
          );
          return;
        }

        window.dispatchEvent(
          new PointerEvent(type, {
            clientX: x,
            clientY: y,
            pointerType: pointerType || 'mouse',
            bubbles: true,
          })
        );
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onComplete, onLeaving]);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ backgroundColor: '#030014' }}
    >
      {/* Fondo Galaxy: estrellas interactivas con repulsión y warp al click */}
      <div className="absolute inset-0" aria-hidden="true">
        <Galaxy
          density={0.9}
          glowIntensity={0.3}
          flareIntensity={0.9}
          starSpeed={0.4}
          starSize={1.35}
          layers={2}
          fps={30}
          dpr={0.7}
          opacity={0.95}
          disableAnimation={leaving}
          mouseRepulsion
          clickWarp
          starColors={GALAXY_STAR_COLORS}
        />
      </div>

      <iframe
        title="Intro StellaVista"
        srcDoc={introHtml}
        className="relative z-10 w-full h-full border-0 bg-transparent"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
};
