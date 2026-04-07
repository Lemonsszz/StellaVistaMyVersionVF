import { create } from 'zustand'

export const useAstroStore = create((set) => ({
  coordinates: { lat: -17.9561, lng: -67.1184 }, 
  setCoordinates: (newCoords) => set({ coordinates: newCoords }),
  isRedMode: false,
  toggleRedMode: () => set((state) => ({ isRedMode: !state.isRedMode })),
}))