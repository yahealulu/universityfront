import { useEffect, useMemo } from 'react'

import { useClinicsList } from '@/hooks/clinics/useClinicsList'
import { useAuthStore } from '@/store/auth.store'
import { useClinicStore } from '@/store/clinic.store'
import { isOwnerRole } from '@/utils/permissions'

/**
 * Keeps `activeClinicId` aligned with accessible clinics.
 * Owners load clinics from API; staff use clinics from auth session.
 */
export const useActiveClinicSync = () => {
  const role = useAuthStore((s) => s.role)
  const authClinics = useAuthStore((s) => s.clinics)
  const isOwner = isOwnerRole(role)
  const { data: apiClinics, isLoading: isApiLoading } = useClinicsList({ enabled: isOwner })

  const clinics = isOwner ? (apiClinics ?? []) : authClinics
  const isLoading = isOwner ? isApiLoading : false

  const activeClinicId = useClinicStore((s) => s.activeClinicId)
  const setActiveClinicId = useClinicStore((s) => s.setActiveClinicId)

  useEffect(() => {
    if (!clinics.length) return
    const exists = activeClinicId && clinics.some((c) => c.id === activeClinicId)
    if (!exists) {
      setActiveClinicId(clinics[0]!.id)
    }
  }, [clinics, activeClinicId, setActiveClinicId])

  const activeClinicName = useMemo(() => {
    if (!clinics.length) return null
    const id =
      activeClinicId && clinics.some((c) => c.id === activeClinicId) ? activeClinicId : clinics[0]!.id
    return clinics.find((c) => c.id === id)?.name ?? null
  }, [clinics, activeClinicId])

  return { clinics, activeClinicName, isLoading }
}
