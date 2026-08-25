import { create } from 'zustand'

/** Dev placeholder tenant — never shown as a user-facing clinic name */
const DEV_PLACEHOLDER_CLINIC_ID = '00000000-0000-4000-8000-000000000001'

type ClinicState = {
  activeClinicId: string | null
  setActiveClinicId: (id: string | null) => void
}

const shouldUseDevTenant =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCKS === 'true'

export const useClinicStore = create<ClinicState>((set) => ({
  activeClinicId: shouldUseDevTenant ? DEV_PLACEHOLDER_CLINIC_ID : null,
  setActiveClinicId: (id) => set({ activeClinicId: id }),
}))
