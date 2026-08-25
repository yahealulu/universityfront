import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query'

import { patientsApi } from '@/api/modules/patients.api'
import { queryKeys } from '@/constants/queryKeys'
import type { CreateInvoiceInput } from '@/types/invoice.types'
import type {
  CreatePatientInput,
  CreateTreatmentStageInput,
  PatchDentalChartInput,
  PatientDetailPayload,
  UpsertClinicalHistoryInput,
} from '@/types/patient.types'
import { useClinicStore } from '@/store/clinic.store'

const invalidatePatientLists = (qc: QueryClient, cid: string) => {
  void qc.invalidateQueries({ queryKey: queryKeys.patients.scope(cid) })
}

export const useCreatePatient = () => {
  const qc = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)
  const cid = activeClinicId ?? '__none__'

  return useMutation({
    mutationFn: (body: CreatePatientInput) => patientsApi.create(body),
    onSuccess: () => {
      invalidatePatientLists(qc, cid)
    },
  })
}

export const useDeletePatient = () => {
  const qc = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)
  const cid = activeClinicId ?? '__none__'

  return useMutation({
    mutationFn: (id: string) => patientsApi.delete(id),
    onSuccess: (_data, id) => {
      invalidatePatientLists(qc, cid)
      void qc.removeQueries({ queryKey: queryKeys.patients.detail(cid, id) })
    },
  })
}

export const usePatchPatientProfile = (patientId: string) => {
  const qc = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)
  const cid = activeClinicId ?? '__none__'

  return useMutation({
    mutationFn: (body: Partial<PatientDetailPayload['profile']>) =>
      patientsApi.patchProfile(patientId, body),
    onSuccess: () => {
      invalidatePatientLists(qc, cid)
      void qc.invalidateQueries({ queryKey: queryKeys.patients.detail(cid, patientId) })
    },
  })
}

export const usePatchDentalChart = (patientId: string) => {
  const qc = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)
  const cid = activeClinicId ?? '__none__'

  return useMutation({
    mutationFn: (body: PatchDentalChartInput) => patientsApi.patchDentalChart(patientId, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.patients.detail(cid, patientId) })
    },
  })
}

export const useAddTreatmentStage = (patientId: string) => {
  const qc = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)
  const cid = activeClinicId ?? '__none__'

  return useMutation({
    mutationFn: (input: CreateTreatmentStageInput) =>
      patientsApi.addTreatmentStage(patientId, input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.patients.detail(cid, patientId) })
    },
  })
}

export const usePutClinicalHistory = (patientId: string) => {
  const qc = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)
  const cid = activeClinicId ?? '__none__'

  return useMutation({
    mutationFn: (body: UpsertClinicalHistoryInput) =>
      patientsApi.putClinicalHistory(patientId, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.patients.detail(cid, patientId) })
    },
  })
}

export const useDeletePatientFile = (patientId: string) => {
  const qc = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)
  const cid = activeClinicId ?? '__none__'

  return useMutation({
    mutationFn: (fileId: string) => patientsApi.deleteFile(patientId, fileId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.patients.detail(cid, patientId) })
    },
  })
}

export const useDeletePatientAppointment = (patientId: string) => {
  const qc = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)
  const cid = activeClinicId ?? '__none__'

  return useMutation({
    mutationFn: (appointmentId: string) => patientsApi.deleteAppointment(patientId, appointmentId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.patients.detail(cid, patientId) })
    },
  })
}

export const useCreatePatientInvoice = (patientId: string) => {
  const qc = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)
  const cid = activeClinicId ?? '__none__'

  return useMutation({
    mutationFn: (body: CreateInvoiceInput) => patientsApi.createInvoice(patientId, body),
    onSuccess: () => {
      invalidatePatientLists(qc, cid)
      void qc.invalidateQueries({ queryKey: queryKeys.patients.detail(cid, patientId) })
    },
  })
}
