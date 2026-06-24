import { useQuery } from '@tanstack/react-query';
import SunCalc from 'suncalc';
import { useAstroStore } from '../store/useAstroStore';
import { getBortleForCoordinates } from '../utils/bortleModel';

export const useCondicionesNocturnas = () => {
  const { coordinates } = useAstroStore();

  return useQuery({
    queryKey: ['clima-astro', coordinates.lat, coordinates.lng],
    queryFn: async () => {
      // Si no hay coordenadas, no hacemos nada
      if (!coordinates.lat || !coordinates.lng) return null;

      try {
        const { lat, lng } = coordinates;
        const bortleInfo = getBortleForCoordinates(lat, lng);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=cloud_cover,wind_speed_200hPa&hourly=cloud_cover,wind_speed_200hPa&forecast_days=1&timezone=auto`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error API');
        
        const data = await res.json();
        
        const luna = SunCalc.getMoonIllumination(new Date());

        // Construimos el pronóstico horario — próximas 8 horas


        const ahora = new Date();
        
        const forecast = data.hourly.time
          .map((tiempo, i) => ({
            hora:      tiempo.slice(11, 16), // "HH:MM"
            nubosidad: data.hourly.cloud_cover[i],
            jetstream: data.hourly.wind_speed_200hPa[i],
          }))
          .filter(({ hora }) => {
            // Solo horas desde ahora en adelante
            const [h, m] = hora.split(':').map(Number);
            const horaItem = new Date();
            horaItem.setHours(h, m, 0, 0);
            return horaItem >= ahora;
          })
          .slice(0, 8); // máximo 8 franjas

        // IMPORTANTE: Estructura exacta que espera App.jsx
        return {
          nubosidad: data.current?.cloud_cover ?? 0,
          jetstream: data.current?.wind_speed_200hPa ?? 0,
          altitud: data.elevation ?? 3700,
          faseLunar: (luna.fraction * 100) || 0,
          lunaFase: luna.phase,
          bortle: bortleInfo.bortle,
          bortleInfo,
          forecast,
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
