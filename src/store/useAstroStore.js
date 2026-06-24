import { create } from 'zustand'

export const useAstroStore = create((set) => ({
  // Coordenadas
  coordinates: { lat: -17.9561, lng: -67.1184 },
  setCoordinates: (newCoords) => set({ coordinates: newCoords }),

  // Modo nocturno
  isRedMode: false,
  toggleRedMode: () => set((state) => ({ isRedMode: !state.isRedMode })),

  // Capas del mapa
  layers: {
    contaminacionLuminica: true,
    nubosidad: false,
    sitiosRecomendados: true,
  },
  toggleLayer: (layerName) => set((state) => ({
    layers: {
      ...state.layers,
      [layerName]: !state.layers[layerName],
    }
  })),
}))
