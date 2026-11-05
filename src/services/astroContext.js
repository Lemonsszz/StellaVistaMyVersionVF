// src/services/astroContext.js
// Construye el contexto GIS/astronomico que recibe Gemini en cada mensaje.
// La idea es que el Astronomo IA no responda como un chatbot generico, sino
// como parte de STELLAVISTA: conoce el punto activo, el clima, el modelo
// Bortle, los sitios recomendados, los eventos y lo que se ve en el cielo.

import * as Astronomy from 'astronomy-engine';
import SunCalc from 'suncalc';
import { eventosAstronomicos } from '../data/eventosAstronomicos';
import { OBJETOS_PROFUNDOS, PLANETAS } from '../data/catalogoAstronomico';
import { SITIOS_RECOMENDADOS } from '../data/sitiosRecomendados';
import { calcularScore } from '../utils/astroLogic';
import { getBortleForCoordinates } from '../utils/bortleModel';
import { getDistanceKm } from '../utils/bortleZoneGenerator';

const LOCAL_TIME_ZONE = 'America/La_Paz';
const MODEL_NOTE =
  'El indice Bortle de STELLAVISTA es una estimacion geoespacial del prototipo, calibrable con mediciones SQM, observacion de campo o datasets cientificos.';

const formatoFechaHora = new Intl.DateTimeFormat('es-BO', {
  timeZone: LOCAL_TIME_ZONE,
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const formatoHora = new Intl.DateTimeFormat('es-BO', {
  timeZone: LOCAL_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const getEstadoScore = (score) => {
  if (score >= 75) return 'condiciones optimas';
  if (score >= 45) return 'condiciones parciales';
  return 'condiciones adversas';
};

const getNombreFaseLunar = (fase) => {
  const valor = Number(fase) || 0;
  if (valor < 0.03 || valor > 0.97) return 'Luna nueva';
  if (valor < 0.22) return 'Creciente inicial';
  if (valor < 0.28) return 'Cuarto creciente';
  if (valor < 0.47) return 'Gibosa creciente';
  if (valor < 0.53) return 'Luna llena';
  if (valor < 0.72) return 'Gibosa menguante';
  if (valor < 0.78) return 'Cuarto menguante';
  return 'Menguante final';
};

const getVisibilidad = (altitud) => {
  if (altitud === null || altitud === undefined) return 'sin dato';
  if (altitud >= 20) return 'VISIBLE';
  if (altitud >= 5) return 'BAJO';
  return 'NO VISIBLE';
};

const getCondicionSolar = (altitud) => {
  if (altitud > 0) return 'dia (Sol sobre el horizonte)';
  if (altitud > -6) return 'crepusculo civil';
  if (altitud > -12) return 'crepusculo nautico';
  if (altitud > -18) return 'crepusculo astronomico';
  return 'noche astronomica';
};

const formatearHoraSegura = (fecha) =>
  fecha instanceof Date && !Number.isNaN(fecha.getTime())
    ? formatoHora.format(fecha)
    : 'sin dato';

const valorONoDisponible = (valor) =>
  valor === null || valor === undefined || Number.isNaN(Number(valor))
    ? 'sin dato'
    : valor;

const conUnidad = (valor, unidad) =>
  valor === null || valor === undefined || Number.isNaN(Number(valor))
    ? 'sin dato'
    : `${valor}${unidad}`;

const recortar = (texto, maximo = 220) => {
  if (!texto) return '';
  return texto.length > maximo ? `${texto.slice(0, maximo)}...` : texto;
};

const MESES = {
  enero: 0,
  febrero: 1,
  marzo: 2,
  abril: 3,
  mayo: 4,
  junio: 5,
  julio: 6,
  agosto: 7,
  septiembre: 8,
  octubre: 9,
  noviembre: 10,
  diciembre: 11,
};

const getMesBolivia = (fecha) =>
  Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: LOCAL_TIME_ZONE,
      month: 'numeric',
    }).format(fecha)
  ) - 1;

const getMesEvento = (fecha) => {
  const texto = String(fecha ?? '').toLowerCase();
  const nombreMes = Object.keys(MESES).find((mes) => texto.includes(mes));
  return nombreMes === undefined ? null : MESES[nombreMes];
};

const getEventosCargados = () => {
  const vistos = new Set();

  return Object.values(eventosAstronomicos)
    .flat()
    .filter((evento) => {
      if (!evento?.id || vistos.has(evento.id)) return false;
      vistos.add(evento.id);
      return true;
    });
};

const calcularObservabilidad = (ahora, coordinates) => {
  const observer = new Astronomy.Observer(coordinates.lat, coordinates.lng, 0);

  const planetas = PLANETAS.map(({ key, label }) => {
    try {
      const equatorial = Astronomy.Equator(key, ahora, observer, true, true);
      const horizontal = Astronomy.Horizon(
        ahora,
        observer,
        equatorial.ra,
        equatorial.dec,
        'normal'
      );

      return {
        label,
        altitud: Math.round(horizontal.altitude),
        azimut: Math.round(horizontal.azimuth),
      };
    } catch {
      return { label, altitud: null, azimut: null };
    }
  });

  const objetosProfundos = OBJETOS_PROFUNDOS.map(({ nombre, ra, dec }) => {
    try {
      const horizontal = Astronomy.Horizon(ahora, observer, ra / 15, dec, 'normal');
      return { nombre, altitud: Math.round(horizontal.altitude) };
    } catch {
      return { nombre, altitud: null };
    }
  });

  return { planetas, objetosProfundos };
};

const normalizarSitios = (sitios, coordinates) => {
  const lista = sitios?.length ? sitios : SITIOS_RECOMENDADOS;

  return lista.map((sitio) => {
    const bortleInfo = getBortleForCoordinates(sitio.lat, sitio.lng);

    return {
      ...sitio,
      bortle: sitio.bortle ?? bortleInfo.bortle,
      bortleLabel: sitio.bortleLabel ?? bortleInfo.label,
      fuenteLuz: sitio.fuenteLuz ?? bortleInfo.sourceName ?? 'sin fuente',
      distanciaKm: Math.round(
        getDistanceKm(coordinates.lat, coordinates.lng, sitio.lat, sitio.lng)
      ),
    };
  });
};

const formatearSitio = (sitio) => {
  const scoreBase = valorONoDisponible(sitio.score);
  const scoreAhora =
    sitio.scoreAhora === null || sitio.scoreAhora === undefined
      ? 'sin dato'
      : `${sitio.scoreAhora}/100`;
  const nubosidad =
    sitio.nubosidad === null || sitio.nubosidad === undefined
      ? 'sin dato'
      : `${sitio.nubosidad}%`;
  const jetstream =
    sitio.jetstream === null || sitio.jetstream === undefined
      ? 'sin dato'
      : `${sitio.jetstream} km/h`;
  const altitud =
    sitio.altitud === null || sitio.altitud === undefined
      ? 'sin dato'
      : `${sitio.altitud} m`;

  return `- ${sitio.nombre} (${sitio.departamento}) | ${sitio.lat.toFixed(
    4
  )}, ${sitio.lng.toFixed(4)} | score base ${scoreBase}/100 | Bortle ${
    sitio.bortle
  } | nubes ${nubosidad} | jet ${jetstream} | altitud ${altitud} | score ahora ${scoreAhora} | ${sitio.distanciaKm} km del punto activo`;
};

export const construirContexto = ({
  coordinates,
  data,
  layers,
  sitios,
  eventoSeleccionado,
  ahora = new Date(),
}) => {
  const lat = Number(coordinates?.lat ?? -17.9561);
  const lng = Number(coordinates?.lng ?? -67.1184);
  const punto = { lat, lng };

  const posicionSol = SunCalc.getPosition(ahora, punto.lat, punto.lng);
  const altitudSol = Math.round((posicionSol.altitude * 180) / Math.PI);
  const posicionLuna = SunCalc.getMoonPosition(ahora, punto.lat, punto.lng);
  const altitudLuna = Math.round((posicionLuna.altitude * 180) / Math.PI);
  const horasSol = SunCalc.getTimes(ahora, punto.lat, punto.lng);

  const scoreActual = data ? calcularScore(data) : null;
  const bortleInfo =
    data?.bortleInfo ?? getBortleForCoordinates(punto.lat, punto.lng);
  const bortle = data?.bortle ?? bortleInfo?.bortle;
  const forecast = Array.isArray(data?.forecast) ? data.forecast : [];
  const observabilidad = calcularObservabilidad(ahora, punto);
  const sitiosNormalizados = normalizarSitios(sitios, punto);

  const sitiosOruro = sitiosNormalizados
    .filter((sitio) => sitio.departamento === 'Oruro')
    .sort(
      (a, b) =>
        (b.scoreAhora ?? b.score ?? 0) - (a.scoreAhora ?? a.score ?? 0)
    );

  const otrosSitios = sitiosNormalizados
    .filter((sitio) => sitio.departamento !== 'Oruro')
    .sort(
      (a, b) =>
        (b.scoreAhora ?? b.score ?? 0) - (a.scoreAhora ?? a.score ?? 0)
    );

  const forecastLineas = forecast.map((franja) => {
    const score = calcularScore({
      nubosidad: franja.nubosidad,
      jetstream: franja.jetstream,
      faseLunar: data?.faseLunar ?? 0,
      altitud: data?.altitud ?? 3700,
      bortle: data?.bortle ?? 4,
    });

    return `- ${franja.hora} | nubosidad ${franja.nubosidad}% | jet stream ${Math.round(
      franja.jetstream
    )} km/h | score ${score}/100`;
  });

  const eventos = getEventosCargados();
  const mesActual = getMesBolivia(ahora);
  const mesSiguiente = (mesActual + 1) % 12;
  const mesesRelevantes = new Set([mesActual, mesSiguiente]);

  const formatearEvento = (evento) =>
    `- ${evento.fecha} (${evento.horario}) | ${evento.titulo} | importancia ${
      evento.importancia
    }/5 | Visibilidad: ${recortar(
      evento.visibilidad,
      150
    )} | Recomendacion: ${recortar(evento.recomendacion, 170)}`;

  const eventosRelevantes = eventos
    .filter((evento) => mesesRelevantes.has(getMesEvento(evento.fecha)))
    .map(formatearEvento);

  const otrosEventos = eventos
    .filter((evento) => !mesesRelevantes.has(getMesEvento(evento.fecha)))
    .map(formatearEvento);

  const lineas = [
    '## Identidad del sistema',
    'STELLAVISTA GIS es un cockpit astronomico para decidir donde y cuando observar el cielo en Bolivia, con foco en el departamento de Oruro. El usuario hace clic en un mapa para elegir un punto; la app calcula un score nocturno de 0 a 100, indice Bortle, clima, Luna, planetas y objetos de cielo profundo.',
    'Es una aplicacion frontend (React + Vite) sin backend propio: usa Open-Meteo para clima, astronomy-engine y SunCalc para efemerides, y un modelo geoespacial Bortle local.',
    'Formula del score: 35% nubosidad, 35% Bortle, 15% fase lunar, 10% jet stream y 5% altitud. Umbrales: 75 o mas = condiciones optimas; 45 a 74 = condiciones parciales; menos de 45 = condiciones adversas.',
    '',
    '## Fecha y hora',
    `- Hora local de Bolivia (America/La_Paz, UTC-4): ${formatoFechaHora.format(
      ahora
    )}`,
    `- Hora UTC: ${ahora.toISOString()}`,
    `- Sol: altitud ${altitudSol}° (${getCondicionSolar(altitudSol)})`,
    `- Puesta de sol: ${formatearHoraSegura(horasSol.sunset)} | Inicio de noche astronomica: ${formatearHoraSegura(horasSol.night)} | Amanecer: ${formatearHoraSegura(horasSol.sunrise)}`,
    '',
    '## Punto activo seleccionado en el mapa',
    `- Coordenadas: ${punto.lat.toFixed(4)}, ${punto.lng.toFixed(4)}`,
    `- Altitud: ${conUnidad(data?.altitud, ' m')}`,
    `- Score nocturno actual: ${
      scoreActual === null ? 'sin dato' : `${scoreActual}/100 (${getEstadoScore(scoreActual)})`
    }`,
    `- Nubosidad actual: ${conUnidad(data?.nubosidad, '%')}`,
    `- Jet stream: ${conUnidad(
      data?.jetstream === null || data?.jetstream === undefined
        ? null
        : Math.round(data.jetstream),
      ' km/h'
    )}`,
    `- Luna: ${
      data?.faseLunar === null || data?.faseLunar === undefined
        ? 'sin dato'
        : `${Math.round(data.faseLunar)}% iluminada (${getNombreFaseLunar(
            data.lunaFase
          )}), altitud ${altitudLuna}° (${
            altitudLuna >= 0 ? 'sobre el horizonte' : 'bajo el horizonte'
          })`
    }`,
    `- Bortle: ${valorONoDisponible(bortle)}${
      bortleInfo?.label ? ` - ${bortleInfo.label}` : ''
    }`,
    `- Fuente de luz dominante: ${
      bortleInfo?.sourceName ?? bortleInfo?.dominantSource ?? 'sin dato'
    }${
      Number.isFinite(bortleInfo?.distanceKm)
        ? ` (${bortleInfo.distanceKm} km)`
        : ''
    }`,
    `- Confianza del modelo Bortle: ${bortleInfo?.confidence ?? 'sin dato'}`,
    `- Metodo: ${bortleInfo?.method ?? 'sin dato'}`,
    '',
    '## Pronostico de las proximas horas en el punto activo',
    ...(forecastLineas.length ? forecastLineas : ['- Sin pronostico horario disponible.']),
    '',
    '## Capas activas del mapa',
    `- Contaminacion luminica (modelo Bortle): ${
      layers?.contaminacionLuminica ? 'activa' : 'inactiva'
    }`,
    `- Sitios recomendados: ${layers?.sitiosRecomendados ? 'activa' : 'inactiva'}`,
    `- Nubosidad: ${
      layers?.nubosidad ? 'activa' : 'inactiva (capa aun no implementada)'
    }`,
    '',
    '## Sitios recomendados en Oruro (prioridad para responder)',
    'Cada sitio tiene un score base curado del mapa (no depende del clima) y, si hay datos en vivo, un "score ahora" calculado con nubosidad, jet stream, Luna, altitud y Bortle.',
    ...(sitiosOruro.length
      ? sitiosOruro.map(formatearSitio)
      : ['- Sin sitios de Oruro disponibles.']),
    '',
    '## Otros sitios recomendados de Bolivia',
    ...(otrosSitios.length
      ? otrosSitios.map(formatearSitio)
      : ['- Sin otros sitios disponibles.']),
    '',
    '## Observabilidad ahora desde el punto activo',
    '### Planetas',
    ...observabilidad.planetas.map(
      ({ label, altitud, azimut }) =>
        `- ${label}: altitud ${conUnidad(
          altitud,
          '°'
        )}, azimut ${conUnidad(azimut, '°')} -> ${getVisibilidad(altitud)}`
    ),
    '### Objetos de cielo profundo',
    ...observabilidad.objetosProfundos.map(
      ({ nombre, altitud }) =>
        `- ${nombre}: altitud ${conUnidad(
          altitud,
          '°'
        )} -> ${getVisibilidad(altitud)}`
    ),
    '',
    '## Eventos astronomicos del mes actual y el siguiente',
    ...(eventosRelevantes.length
      ? eventosRelevantes
      : ['- No hay eventos cargados para este mes ni el siguiente.']),
    '## Otros eventos cargados en el sistema (referencia)',
    ...(otrosEventos.length
      ? otrosEventos
      : ['- No hay otros eventos cargados.']),
    '',
    '## Evento enfocado actualmente en el mapa',
    eventoSeleccionado?.titulo
      ? `- ${eventoSeleccionado.titulo}${
          eventoSeleccionado.fecha ? ` | ${eventoSeleccionado.fecha}` : ''
        }`
      : '- Ninguno.',
    '',
    '## Reglas de interpretacion de datos',
    '- "score ahora" usa clima en vivo del sitio + Luna + altitud + Bortle.',
    '- "score base" es el valor curado del mapa y no cambia con el clima.',
    '- "sin dato" significa que la app no tiene esa medicion en este momento; no la inventes.',
    `- ${MODEL_NOTE}`,
  ];

  return lineas.join('\n');
};

export const construirInstruccionSistema = (contexto) => `Eres "Astrónomo IA", el asistente integrado de STELLAVISTA GIS. Ayudas a decidir dónde y cuándo observar el cielo en Bolivia, con foco en Oruro, usando los datos reales de la aplicación.

CÓMO RESPONDER:
- Responde siempre en español, con tono claro, cálido y técnico sin ser académico.
- Usa exclusivamente el contexto entregado. No inventes condiciones, coordenadas, eventos, horarios ni cifras. Si falta un dato, dilo de forma explícita.
- Distingue siempre los datos en vivo ("score ahora", nubosidad actual) de las estimaciones del modelo (Bortle, score base curado).
- Si preguntan por el mejor lugar, compara los sitios de Oruro con "score ahora", nubosidad, Bortle y distancia al punto activo. Recomienda 2 o 3 opciones concretas y explica por qué.
- Si preguntan por el punto seleccionado, interpreta score, nubosidad, Luna, Bortle, jet stream y altitud.
- Ten en cuenta la sección "Fecha y hora": si el Sol está sobre el horizonte, aclara que la observación visual debe esperar a la noche; si la Luna está alta, advierte su impacto en objetos débiles.
- Si preguntan qué observar o por eventos, usa los planetas, objetos de cielo profundo y eventos del contexto. Menciona altura sobre el horizonte y hora local cuando aporte. No afirmes que un evento de la sección "Otros eventos" ocurre este mes; esa sección es solo referencia.
- Si el usuario pregunta por un lugar fuera de Oruro, usa la sección "Otros sitios recomendados de Bolivia".
- Aclara que el índice Bortle es una estimación del prototipo cuando sea relevante; no lo presentes como una medición SQM certificada.
- Sé breve: 2 a 5 párrafos cortos o viñetas. No repitas todo el contexto ni listes todos los sitios.
- No prometas acciones que no puedes hacer (mover el mapa, guardar lugares, abrir capas). Puedes sugerir al usuario que haga clic en el mapa o use las herramientas de la app.
- Cierra con una recomendación práctica cuando sea útil.

CONTEXTO ACTUAL:
${contexto}`;
