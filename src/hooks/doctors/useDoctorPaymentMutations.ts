import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query'

import { doctorsApi } from '@/api/modules/doctors.api'
import { queryKeys } from '@/constants/queryKeys'
import type { DoctorPaymentUpsertInput } from '@/types/doctor.types'
import { useClinicStore } from '@/store/clinic.store'

const invalidateDetail = (queryClient: QueryClient, clinicId: string, doctorId: string) => {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.doctors.detail(clinicId, doctorId),
  })
  void queryClient.invalidateQueries({
    queryKey: queryKeys.doctors.list(clinicId),
  })
}

export const useCreateDoctorPayment = (doctorId: string) => {
  const queryClient = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useMutation({
    mutationFn: (body: DoctorPaymentUpsertInput) =>
      doctorsApi.createPayment(doctorId, body),
    onSuccess: () => {
      if (activeClinicId) {
        invalidateDetail(queryClient, activeClinicId, doctorId)
      }
    },
  })
}

export const useUpdateDoctorPayment = (doctorId: string) => {
  const queryClient = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useMutation({
    mutationFn: ({
      paymentId,
      body,
    }: {
      paymentId: string
      body: DoctorPaymentUpsertInput
    }) => doctorsApi.updatePayment(doctorId, paymentId, body),
    onSuccess: () => {
      if (activeClinicId) {
        invalidateDetail(queryClient, activeClinicId, doctorId)
      }
    },
  })
}

export const useDeleteDoctorPayment = (doctorId: string) => {
  const queryClient = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useMutation({
    mutationFn: (paymentId: string) => doctorsApi.deletePayment(doctorId, paymentId),
    onSuccess: () => {
      if (activeClinicId) {
        invalidateDetail(queryClient, activeClinicId, doctorId)
      }
    },
  })
}
