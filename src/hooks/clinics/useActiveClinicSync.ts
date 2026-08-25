import { useEffect, useMemo } from 'react'

import { useClinicsList } from '@/hooks/clinics/useClinicsList'
import { useClinicStore } from '@/store/clinic.store'

/**
 * Keeps `activeClinicId` aligned with the loaded clinic list and exposes the current label for the shell header.
 */
export const useActiveClinicSync = () => {
  const { data: clinics, isLoading } = useClinicsList()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)
  const setActiveClinicId = useClinicStore((s) => s.setActiveClinicId)

  useEffect(() => {
    if (!clinics?.length) return
    const exists = activeClinicId && clinics.some((c) => c.id === activeClinicId)
    if (!exists) {
      setActiveClinicId(clinics[0]!.id)
    }
  }, [clinics, activeClinicId, setActiveClinicId])

  const activeClinicName = useMemo(() => {
    if (!clinics?.length) return null
    const id = activeClinicId && clinics.some((c) => c.id === activeClinicId) ? activeClinicId : clinics[0]!.id
    return clinics.find((c) => c.id === id)?.name ?? null
  }, [clinics, activeClinicId])

  return { activeClinicName, isLoading }
}
