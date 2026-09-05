export type DoctorListItem = {
  id: string
  name: string
  specialization: string
  phone: string
  treatmentsThisMonth: number
  revenueThisMonth: number
  outstandingThisMonth: number
}

export type DoctorQuota = {
  max: number
  remaining: number
}

export type DoctorsListPayload = {
  doctors: DoctorListItem[]
  quota: DoctorQuota
}

export type DoctorFull = {
  id: string
  username: string
  firstName: string
  lastName: string
  name: string
  specialtyId: string
  specialtyLabel: string
  specialization: string
  phone: string
  commissionPercent: number
  certificateNumber: string | null
  email: string
  registeredAt: string
  hasAllClinics?: boolean
  clinicIds?: string[]
  treatmentsThisMonth: number
  revenueThisMonth: number
  outstandingThisMonth: number
}

export type DoctorDetailStats = {
  totalTreatments: number
  totalRevenue: number
  outstandingPayments: number
  remainingPayments: number
}

export type DoctorPayment = {
  id: string
  doctorId: string
  paymentNumber: string
  paidAt: string
  amount: number
  paymentMethod: string
}

export type DoctorTreatment = {
  id: string
  doctorId: string
  date: string
  treatmentTitle: string
  category: string
  toothArea: string
  patientName: string
  price: number
  paid: number
  remaining: number
}

export type DoctorDetailPayload = {
  doctor: DoctorFull
  stats: DoctorDetailStats
  payments: DoctorPayment[]
  treatments: DoctorTreatment[]
}

export type DoctorCreateInput = {
  username: string
  password: string
  firstName: string
  lastName: string
  specialtyId: string
  phone: string
  commissionPercent: number
  certificateNumber: string | null
  hasAllClinics?: boolean
  clinicIds?: string[]
}

export type DoctorUpdateInput = {
  firstName: string
  lastName: string
  specialtyId: string
  phone: string
  commissionPercent: number
  certificateNumber: string | null
  hasAllClinics?: boolean
  clinicIds?: string[]
}

export type DoctorsMetaPayload = {
  specialties: { id: string; label: string }[]
}

export type DoctorPaymentUpsertInput = {
  paidAt: string
  amount: number
  paymentMethod?: string
}
