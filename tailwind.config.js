/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neu: {
          base:   '#0d0f1a', // vacío profundo — fondo universal
          raised: '#111520', // elevado — paneles
          sunken: '#090b14', // hundido — inputs, displays
          border: '#1e2040', // borde sutil violáceo
          glow:   '#1a1d35', // sombra clara neumórfica
          shadow: '#06070f', // sombra oscura neumórfica
        },
        astro: {
          // Celestes y azules — estrellas, datos primarios
          sky:     '#7ecfff', // celeste brillante
          blue:    '#4a9eff', // azul medio — acento principal
          deep:    '#2d6be4', // azul profundo

          // Morados — nebulosas, acentos secundarios
          nebula:  '#a78bfa', // violeta suave
          void:    '#7c3aed', // violeta profundo

          // Naranjas — alertas, horizonte, estrellas frías
          horizon: '#fb923c', // naranja horizonte
          ember:   '#f59e0b', // ámbar cálido

          // Neutros de texto
          text:    '#c8d8f0', // texto principal — celeste muy apagado
          muted:   '#5a7090', // texto secundario
          dim:     '#3a4a60', // texto terciario / labels
        }
      },
      boxShadow: {
        'neu':         '-4px -4px 8px #1a1d35, 4px 4px 8px #06070f',
        'neu-sm':      '-2px -2px 5px #1a1d35, 2px 2px 5px #06070f',
        'neu-lg':      '-6px -6px 14px #1a1d35, 6px 6px 14px #06070f',
        'neu-inset':   'inset -2px -2px 5px #1a1d35, inset 2px 2px 5px #06070f',
        'neu-pressed': 'inset -1px -1px 3px #1a1d35, inset 1px 1px 3px #06070f',
        // Acentos con color
        'neu-sky':     '-4px -4px 8px #1a1d35, 4px 4px 8px #06070f, 0 0 20px rgba(126,207,255,0.10)',
        'neu-nebula':  '-4px -4px 8px #1a1d35, 4px 4px 8px #06070f, 0 0 20px rgba(167,139,250,0.10)',
        'neu-horizon': '-4px -4px 8px #1a1d35, 4px 4px 8px #06070f, 0 0 20px rgba(251,146,60,0.10)',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}