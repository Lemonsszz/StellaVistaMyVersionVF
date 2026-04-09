import { useQuery } from '@tanstack/react-query';
import SunCalc from 'suncalc';
import { useAstroStore } from '../store/useAstroStore';

export const useCondicionesNocturnas = () => {
  const { coordinates } = useAstroStore();

  return useQuery({
    // La Query Key depende de las coordenadas
    queryKey: ['clima-astro', coordinates.lat, coordinates.lng],
    
    queryFn: async () => {
      // VALIDACIÓN: Si no hay coordenadas, no disparamos la petición
      if (!coordinates.lat || !coordinates.lng) return null;

      const url = `,https://open-meteo.com{coordinates.lat}&longitude=${coordinates.lng}&current=cloud_cover_low,wind_speed_200hPa&timezone=auto`; //api.open-meteo.com/v1/fore
      
      const res = await fetch(url);
      const data = await res.json();

      const luna = SunCalc.getMoonIllumination(new Date());

      return {
        nubosidadBaja: data.current.cloud_cover_low,
        jetstream: data.current.wind_speed_200hPa,
        altitud: 3700, // Ponemos la base de Oruro fija por ahora para evitar el error 400
        faseLunar: luna.fraction * 100,
        bortle: 4 
      };
    },
    // IMPORTANTE: Solo habilitar la query si tenemos coordenadas
    enabled: !!coordinates.lat && !!coordinates.lng,
    staleTime: 1000 * 60 * 5, 
  });
};
