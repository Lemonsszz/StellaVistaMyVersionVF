import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA(
      {
        registerType: 'autoUpdate',
        mainifest:{
          name: 'StellaView GIS',
          short_name: 'StellaView',
          description: 'Encuentra el cielo perfecto para observar estrellas hoy.',
          theme_color: '#000000',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            }
          ]
        }
      }
    )
  ],
})
