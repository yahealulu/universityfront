import type {
  DoctorDetailStats,
  DoctorFull,
  DoctorListItem,
  DoctorPayment,
  DoctorTreatment,
} from '@/types/doctor.types'

export const DOCTOR_MAX_SLOTS = 10

export const seedSpecialties = [
  { id: 'sp-gen', label: 'General Dentistry' },
  { id: 'sp-ortho', label: 'Orthodontics' },
  { id: 'sp-perio', label: 'Periodontics' },
  { id: 'sp-oral', label: 'Oral Surgery' },
  { id: 'sp-endo', label: 'Endodontics' },
] as const

export type DoctorRecord = DoctorFull & {
  detailStats: DoctorDetailStats
}

const iso = (y: number, m: number, d: number) =>
  new Date(Date.UTC(y, m - 1, d)).toISOString()

const mkDoctor = (
  id: string,
  username: string,
  firstName: string,
  lastName: string,
  specialtyId: string,
  specialtyLabel: string,
  phone: string,
  commissionPercent: number,
  certificateNumber: string | null,
  email: string,
  registeredAt: string,
  metrics: {
    treatmentsThisMonth: number
    revenueThisMonth: number
    outstandingThisMonth: number
  },
  detailStats: DoctorDetailStats
): DoctorRecord => ({
  id,
  username,
  firstName,
  lastName,
  name: `Dr. ${firstName} ${lastName}`,
  specialtyId,
  specialtyLabel,
  specialization: specialtyLabel,
  phone,
  commissionPercent,
  certificateNumber,
  email,
  registeredAt,
  hasAllClinics: false,
  clinicIds: [],
  treatmentsThisMonth: metrics.treatmentsThisMonth,
  revenueThisMonth: metrics.revenueThisMonth,
  outstandingThisMonth: metrics.outstandingThisMonth,
  detailStats,
})

/** 7 doctors => 3 slots remaining (max 10). */
export const seedDoctorRecords: DoctorRecord[] = [
  mkDoctor(
    'dr-1',
    'michael.smith',
    'Michael',
    'Smith',
    'sp-gen',
    'General Dentistry',
    '+963944759214',
    15,
    'CERT-10001',
    'michael.smith@clinic.com',
    iso(2026, 2, 24),
    { treatmentsThisMonth: 32, revenueThisMonth: 1000, outstandingThisMonth: 250 },
    {
      totalTreatments: 32,
      totalRevenue: 1000,
      outstandingPayments: 600,
      remainingPayments: 400,
    }
  ),
  mkDoctor(
    'dr-2',
    'sarah.johnson',
    'Sarah',
    'Johnson',
    'sp-ortho',
    'Orthodontics',
    '+963933112233',
    12,
    null,
    'sarah.johnson@clinic.com',
    iso(2025, 11, 5),
    { treatmentsThisMonth: 18, revenueThisMonth: 820, outstandingThisMonth: 120 },
    {
      totalTreatments: 18,
      totalRevenue: 820,
      outstandingPayments: 200,
      remainingPayments: 150,
    }
  ),
  mkDoctor(
    'dr-3',
    'omar.hassan',
    'Omar',
    'Hassan',
    'sp-perio',
    'Periodontics',
    '+962791234567',
    18,
    'CERT-22002',
    'omar.hassan@clinic.com',
    iso(2025, 8, 12),
    { treatmentsThisMonth: 24, revenueThisMonth: 640, outstandingThisMonth: 90 },
    {
      totalTreatments: 24,
      totalRevenue: 640,
      outstandingPayments: 150,
      remainingPayments: 80,
    }
  ),
  mkDoctor(
    'dr-4',
    'emily.davis',
    'Emily',
    'Davis',
    'sp-oral',
    'Oral Surgery',
    '+971501112233',
    20,
    null,
    'emily.davis@clinic.com',
    iso(2026, 1, 3),
    { treatmentsThisMonth: 12, revenueThisMonth: 2100, outstandingThisMonth: 400 },
    {
      totalTreatments: 12,
      totalRevenue: 2100,
      outstandingPayments: 400,
      remainingPayments: 300,
    }
  ),
  mkDoctor(
    'dr-5',
    'youssef.karim',
    'Youssef',
    'Karim',
    'sp-endo',
    'Endodontics',
    '+966501234567',
    14,
    'CERT-33001',
    'youssef.karim@clinic.com',
    iso(2025, 6, 20),
    { treatmentsThisMonth: 40, revenueThisMonth: 1500, outstandingThisMonth: 0 },
    {
      totalTreatments: 40,
      totalRevenue: 1500,
      outstandingPayments: 0,
      remainingPayments: 0,
    }
  ),
  mkDoctor(
    'dr-6',
    'layla.mansour',
    'Layla',
    'Mansour',
    'sp-gen',
    'General Dentistry',
    '+961711223344',
    16,
    null,
    'layla.mansour@clinic.com',
    iso(2025, 9, 1),
    { treatmentsThisMonth: 22, revenueThisMonth: 780, outstandingThisMonth: 180 },
    {
      totalTreatments: 22,
      totalRevenue: 780,
      outstandingPayments: 180,
      remainingPayments: 100,
    }
  ),
  mkDoctor(
    'dr-7',
    'ahmed.rashid',
    'Ahmed',
    'Rashid',
    'sp-ortho',
    'Orthodontics',
    '+963947523985',
    12,
    'CERT-44099',
    'ahmed.rashid@clinic.com',
    iso(2026, 1, 15),
    { treatmentsThisMonth: 28, revenueThisMonth: 950, outstandingThisMonth: 310 },
    {
      totalTreatments: 28,
      totalRevenue: 950,
      outstandingPayments: 310,
      remainingPayments: 200,
    }
  ),
]

export const seedPayments: DoctorPayment[] = [
  {
    id: 'dp-1',
    doctorId: 'dr-1',
    paymentNumber: 'P-123456',
    paidAt: iso(2026, 2, 23),
    amount: 1000,
    paymentMethod: 'Cash',
  },
  {
    id: 'dp-2',
    doctorId: 'dr-1',
    paymentNumber: 'P-123457',
    paidAt: iso(2026, 2, 20),
    amount: 250,
    paymentMethod: 'Card',
  },
  {
    id: 'dp-3',
    doctorId: 'dr-2',
    paymentNumber: 'P-223401',
    paidAt: iso(2026, 2, 18),
    amount: 500,
    paymentMethod: '',
  },
  {
    id: 'dp-4',
    doctorId: 'dr-3',
    paymentNumber: 'P-323100',
    paidAt: iso(2026, 2, 15),
    amount: 300,
    paymentMethod: 'Transfer',
  },
]

export const seedTreatments: DoctorTreatment[] = [
  {
    id: 'dtr-1',
    doctorId: 'dr-1',
    date: iso(2026, 2, 5),
    treatmentTitle: 'Treatment Type',
    category: 'Category',
    toothArea: 'Tooth 34',
    patientName: 'Patient Name',
    price: 1000,
    paid: 250,
    remaining: 150,
  },
  {
    id: 'dtr-2',
    doctorId: 'dr-1',
    date: iso(2026, 2, 1),
    treatmentTitle: 'Crown',
    category: 'Restorative',
    toothArea: 'Tooth 12',
    patientName: 'Ahmed Al-Rashid',
    price: 800,
    paid: 800,
    remaining: 0,
  },
  {
    id: 'dtr-3',
    doctorId: 'dr-2',
    date: iso(2026, 1, 28),
    treatmentTitle: 'Braces adjustment',
    category: 'Orthodontics',
    toothArea: 'Both',
    patientName: 'Fatima Al-Zahra',
    price: 400,
    paid: 200,
    remaining: 200,
  },
]

export const toListItem = (d: DoctorFull): DoctorListItem => ({
  id: d.id,
  name: d.name,
  specialization: d.specialization,
  phone: d.phone,
  treatmentsThisMonth: d.treatmentsThisMonth,
  revenueThisMonth: d.revenueThisMonth,
  outstandingThisMonth: d.outstandingThisMonth,
})

export const toDoctorFull = (r: DoctorRecord): DoctorFull => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip mock-only field from API shape
  const { detailStats, ...rest } = r
  return rest
}
