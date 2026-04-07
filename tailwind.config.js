/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'astro-red': '#ff0000',
        'astro-dark': '#0a0a0a',
      }
    },
  },
  plugins: [],
}
