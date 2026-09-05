import { create } from 'zustand'

type ClinicState = {
  activeClinicId: string | null
  setActiveClinicId: (id: string | null) => void
}

export const useClinicStore = create<ClinicState>((set) => ({
  activeClinicId: null,
  setActiveClinicId: (id) => set({ activeClinicId: id }),
}))
