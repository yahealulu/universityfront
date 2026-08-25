export type LabRequestStatus = 'pending' | 'delivered' | 'canceled'

export type LabRequest = {
  id: string
  labId: string
  labName: string
  patientId: string
  patientName: string
  patientCode: string
  workTypeId: string
  workTypeLabel: string
  quantity: number
  requestDate: string
  costUsd: number | null
  status: LabRequestStatus
  notes: string
}

export type LabRequestUpsertInput = {
  labId: string
  patientId: string
  workTypeId: string
  quantity: number
  costUsd: number | null
  notes: string
  requestDate: string
  status?: LabRequestStatus
}

export type LabRequestsMetaPayload = {
  labs: { id: string; name: string }[]
  patients: { id: string; displayName: string; patientCode: string }[]
  workTypes: { id: string; label: string }[]
}
