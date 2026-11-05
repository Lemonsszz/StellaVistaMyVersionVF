import { useEffect, useRef } from 'react';
import planetarioHtml from '../../StellaVista.html?raw';
import { useAstroStore } from '../store/useAstroStore';

export const Planetario = ({ onCerrar }) => {
  const iframeRef = useRef(null);
  const { coordinates } = useAstroStore();
  const lat = coordinates.lat.toString();
  const lng = coordinates.lng.toString();
  const srcDoc = planetarioHtml
    .replace(
      'id="lat" type="number" step=".01" value="-17.8633"',
      `id="lat" type="number" step=".01" value="${lat}"`
    )
    .replace(
      'id="lon" type="number" step=".01" value="-66.3136"',
      `id="lon" type="number" step=".01" value="${lng}"`
    )
    .replace(
      'value="-17.8633,-66.3136"',
      `value="${lat},${lng}"`
    );

  useEffect(() => {
    const handleMessage = (event) => {
      if (
        event.source === iframeRef.current?.contentWindow &&
        event.data?.type === 'stellavista:close-planetario'
      ) {
        onCerrar();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onCerrar]);

  return (
    <iframe
      ref={iframeRef}
      title="Navegador estelar StellaVista"
      srcDoc={srcDoc}
      className="fixed inset-0 z-50 h-full w-full border-0 bg-cosmos-950"
      sandbox="allow-scripts allow-same-origin"
    />
  );
};
