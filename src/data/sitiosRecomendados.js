// src/data/sitiosRecomendados.js
// Fuente unica de los sitios que se dibujan en el mapa y que tambien usa
// el Astronomo IA para recomendar lugares de observacion.

export const SITIOS_RECOMENDADOS = [
  { nombre: 'Sajama', score: 94, lat: -18.1167, lng: -68.8833, departamento: 'Oruro' },
  { nombre: 'Parque Sajama', score: 94, lat: -18.0667, lng: -68.9833, departamento: 'Oruro' },
  { nombre: 'Salar de Coipasa', score: 88, lat: -19.1833, lng: -68.7, departamento: 'Oruro' },
  { nombre: 'Chipaya', score: 86, lat: -19.0, lng: -68.05, departamento: 'Oruro' },
  { nombre: 'Pampa Aullagas', score: 83, lat: -19.0, lng: -67.5, departamento: 'Oruro' },
  { nombre: 'Volcan Tunupa', score: 87, lat: -19.2, lng: -67.9167, departamento: 'Oruro' },
  { nombre: 'Salinas de Garci Mendoza', score: 85, lat: -19.6333, lng: -67.6667, departamento: 'Oruro' },
  { nombre: 'Coipasa', score: 86, lat: -19.275, lng: -68.175, departamento: 'Oruro' },
  { nombre: 'Curahuara de Carangas', score: 84, lat: -17.8667, lng: -68.4333, departamento: 'Oruro' },
  { nombre: 'Turco', score: 82, lat: -18.1833, lng: -68.2, departamento: 'Oruro' },
  { nombre: 'Corque', score: 81, lat: -18.3333, lng: -67.6833, departamento: 'Oruro' },
  { nombre: 'Huachacalla', score: 85, lat: -18.8, lng: -68.25, departamento: 'Oruro' },
  { nombre: 'Andamarca', score: 80, lat: -18.7833, lng: -67.5167, departamento: 'Oruro' },
  { nombre: 'Belen de Andamarca', score: 80, lat: -18.8167, lng: -67.65, departamento: 'Oruro' },
  { nombre: 'Lago Uru Uru', score: 75, lat: -17.9333, lng: -67.0833, departamento: 'Oruro' },
  { nombre: 'Lago Poopo', score: 79, lat: -18.75, lng: -67.0833, departamento: 'Oruro' },
  { nombre: 'Santiago de Huari', score: 78, lat: -19.2167, lng: -66.7833, departamento: 'Oruro' },
  { nombre: 'Santuario de Quillacas', score: 79, lat: -19.2333, lng: -66.95, departamento: 'Oruro' },
  { nombre: 'Salar de Uyuni', score: 90, lat: -20.1338, lng: -67.4891, departamento: 'Potosi' },
  { nombre: 'Laguna Colorada', score: 93, lat: -22.2086, lng: -67.7706, departamento: 'Potosi' },
  { nombre: 'Laguna Verde', score: 92, lat: -22.7942, lng: -67.7903, departamento: 'Potosi' },
  { nombre: 'Reserva Eduardo Avaroa', score: 92, lat: -22.5, lng: -67.5, departamento: 'Potosi' },
  { nombre: 'Valle de la Luna', score: 68, lat: -16.567, lng: -68.093, departamento: 'La Paz' },
  { nombre: 'Copacabana', score: 72, lat: -16.166, lng: -69.086, departamento: 'La Paz' },
  { nombre: 'Isla del Sol', score: 82, lat: -16.036, lng: -69.055, departamento: 'La Paz' },
  { nombre: 'Toro Toro', score: 84, lat: -18.133, lng: -65.761, departamento: 'Potosi' },
  { nombre: 'Samaipata', score: 77, lat: -18.18, lng: -63.874, departamento: 'Santa Cruz' },
  { nombre: 'Noel Kempff Mercado', score: 91, lat: -14.267, lng: -60.866, departamento: 'Santa Cruz' },
  { nombre: 'Madidi', score: 90, lat: -14.0, lng: -67.75, departamento: 'La Paz' },
  { nombre: 'Serrania del Aguarague', score: 82, lat: -21.75, lng: -63.783, departamento: 'Tarija' },
];

export const SITIOS_RECOMENDADOS_GEOJSON = {
  type: 'FeatureCollection',
  features: SITIOS_RECOMENDADOS.map(({ nombre, score, lat, lng, departamento }) => ({
    type: 'Feature',
    properties: { nombre, score, departamento },
    geometry: { type: 'Point', coordinates: [lng, lat] },
  })),
};

export const getSitiosDeOruro = () =>
  SITIOS_RECOMENDADOS.filter((sitio) => sitio.departamento === 'Oruro');
