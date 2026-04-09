import { useQuery } from '@tanstack/react-query';
import SunCalc from 'suncalc';
import { useAstroStore } from '../store/useAstroStore';

export const useCondicionesNocturnas = () => {
  const { coordinates } = useAstroStore();

  return useQuery({
    queryKey: ['clima-astro', coordinates.lat, coordinates.lng],
    queryFn: async () => {
      // Si no hay coordenadas, no hacemos nada
      if (!coordinates.lat || !coordinates.lng) return null;

      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lng}&current=cloud_cover_low,wind_speed_200hPa&timezone=auto`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error API');
        
        const data = await res.json();
        const luna = SunCalc.getMoonIllumination(new Date());

        // IMPORTANTE: Estructura exacta que espera App.jsx
        return {
          nubosidadBaja: data.current?.cloud_cover_low ?? 0,
          jetstream: data.current?.wind_speed_200hPa ?? 0,
          altitud: data.elevation ?? 3700,
          faseLunar: (luna.fraction * 100) || 0
        };
      } catch (err) {
        console.error("Error en Fetch:", err);
        return null; // Si falla el fetch, devolvemos null para que App.jsx lo maneje
      }
    },
    enabled: !!coordinates.lat,
    staleTime: 1000 * 60 * 5,
  });
};
