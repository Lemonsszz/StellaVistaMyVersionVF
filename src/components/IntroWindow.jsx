import { useEffect } from 'react';
import introHtml from '../../new_components/intro.html?raw';

export const IntroWindow = ({ onComplete }) => {
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'stellavista:intro-complete') {
        onComplete();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-neu-base">
      <iframe
        title="Intro StellaVista"
        srcDoc={introHtml}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
};
