import { useQuery, keepPreviousData } from '@tanstack/react-query';
import SunCalc from 'suncalc';
import { useAstroStore } from '../store/useAstroStore';
import { getBortleForCoordinates } from '../utils/bortleModel';

const CACHE_KEY = 'stellavista:ultimas-condiciones';
const CACHE_MAX_AGE = 1000 * 60 * 60 * 12;

// Guardamos la última respuesta válida para que el score aparezca al instante
// y no se quede vacío si la API tarda o falla puntualmente.
const readCache = (lat, lng) => {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (!cached?.data || !Number.isFinite(cached.savedAt)) return undefined;
    if (Date.now() - cached.savedAt > CACHE_MAX_AGE) return undefined;

    const sameSpot =
      Math.abs(cached.lat - lat) < 0.001 &&
      Math.abs(cached.lng - lng) < 0.001;

    return sameSpot ? cached : undefined;
  } catch {
    return undefined;
  }
};

const writeCache = (lat, lng, data) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ lat, lng, data, savedAt: Date.now() })
    );
  } catch {
    // localStorage puede no estar disponible; no afecta la consulta.
  }
};

export const useCondicionesNocturnas = () => {
  const { coordinates } = useAstroStore();
  const { lat, lng } = coordinates;
  const cached = readCache(lat, lng);

  return useQuery({
    queryKey: ['clima-astro', lat, lng],
    queryFn: async () => {
      // Si no hay coordenadas, no hacemos nada
      if (!lat || !lng) return null;

      try {
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
        const result = {
          nubosidad: data.current?.cloud_cover ?? 0,
          jetstream: data.current?.wind_speed_200hPa ?? 0,
          altitud: data.elevation ?? 3700,
          faseLunar: (luna.fraction * 100) || 0,
          lunaFase: luna.phase,
          bortle: bortleInfo.bortle,
          bortleInfo,
          forecast,
        };

        writeCache(lat, lng, result);
        return result;
      } catch (err) {
        console.error("Error en Fetch:", err);
        throw err; // React Query reintenta y expone isError para el botón Reintentar
      }
    },
    enabled: !!lat && !!lng,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: keepPreviousData,
    initialData: cached?.data,
    initialDataUpdatedAt: cached?.savedAt,
  });
};
