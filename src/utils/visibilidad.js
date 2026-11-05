// src/utils/visibilidad.js
// Estado de visibilidad compartido por el panel lateral y las fichas de planeta.

export const getVisibilidad = (altitud) => {
  if (altitud >= 20) {
    return {
      label: 'VISIBLE',
      clase: 'text-ethereal-lavender bg-purple-400/10 border-purple-300/25',
      dot: 'bg-ethereal-lavender shadow-[0_0_8px_#e0e7ff]',
      color: '#e0e7ff',
    };
  }
  if (altitud >= 5) {
    return {
      label: 'BAJO',
      clase: 'text-ethereal-purple bg-purple-500/10 border-purple-400/30',
      dot: 'bg-ethereal-purple shadow-[0_0_8px_#c084fc]',
      color: '#c084fc',
    };
  }
  return {
    label: 'NO VISIBLE',
    clase: 'text-violet-400/80 bg-violet-500/[0.06] border-violet-400/15',
    dot: 'bg-violet-500/60',
    color: '#6d5f8f',
  };
};
