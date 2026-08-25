import type { Invoice } from '@/types/invoice.types'
import type {
  ClinicalHistorySummary,
  DentalChartState,
  PatientAppointmentRow,
  PatientDetailPayload,
  PatientListItem,
  PatientProfile,
  PatientTreatment,
  ToothStatusKey,
} from '@/types/patient.types'

const demoInvoices: Invoice[] = [
  {
    id: 'inv-demo-1',
    invoiceNumber: 'IN-123460',
    patientId: 'pt-demo',
    patientName: 'Michael Smith',
    patientRecordId: '0123456789',
    treatmentTitle: 'Crown preparation',
    treatmentSubtitle: 'Restorative',
    invoiceDate: '2026-02-05',
    total: 1000,
    notes: 'Crown prep visit.',
    payments: [{ id: 'pay-demo-1', invoiceId: 'inv-demo-1', paidAt: '2026-02-06', amount: 250 }],
  },
  {
    id: 'inv-demo-2',
    invoiceNumber: 'IN-123461',
    patientId: 'pt-demo',
    patientName: 'Michael Smith',
    patientRecordId: '0123456789',
    treatmentTitle: 'Root canal',
    treatmentSubtitle: 'Endodontics',
    invoiceDate: '2026-02-10',
    total: 500,
    notes: '',
    payments: [],
  },
  {
    id: 'inv-demo-3',
    invoiceNumber: 'IN-123462',
    patientId: 'pt-demo',
    patientName: 'Michael Smith',
    patientRecordId: '0123456789',
    treatmentTitle: 'Routine cleaning',
    treatmentSubtitle: 'Preventive',
    invoiceDate: '2026-01-12',
    total: 300,
    notes: '',
    payments: [{ id: 'pay-demo-2', invoiceId: 'inv-demo-3', paidAt: '2026-01-12', amount: 300 }],
  },
]

const demoTreatments: PatientTreatment[] = [
  {
    id: 'tr-demo-1',
    category: 'Category',
    treatmentType: 'Treatment Type',
    toothLabel: 'Tooth 34',
    toothFdiId: '34',
    date: '2026-02-05',
    notes:
      'Description Text Description Text Description Text Description Text Description Text Description Text',
    price: 1000,
    paid: 250,
    remaining: 150,
    stages: [
      {
        id: 'st-demo-3',
        stageNumber: 3,
        date: '2026-02-05',
        description:
          'Description Text Description Text Description Text Description Text Description Text Description Text',
      },
      {
        id: 'st-demo-2',
        stageNumber: 2,
        date: '2026-02-04',
        description:
          'Description Text Description Text Description Text Description Text Description Text Description Text',
      },
      {
        id: 'st-demo-1',
        stageNumber: 1,
        date: '2026-02-03',
        description:
          'Description Text Description Text Description Text Description Text Description Text Description Text',
      },
    ],
  },
  {
    id: 'tr-demo-2',
    category: 'Preventive',
    treatmentType: 'Cleaning',
    toothLabel: 'General',
    date: '2026-01-10',
    notes: 'Routine cleaning.',
    price: 120,
    paid: 120,
    remaining: 0,
    stages: [],
  },
]

const defaultTeethAdult = (): Record<string, ToothStatusKey> => {
  const teeth: Record<string, ToothStatusKey> = {}
  const upper = [
    [18, 17, 16, 15, 14, 13, 12, 11],
    [21, 22, 23, 24, 25, 26, 27, 28],
  ]
  const lower = [
    [48, 47, 46, 45, 44, 43, 42, 41],
    [31, 32, 33, 34, 35, 36, 37, 38],
  ]
  const all = [...upper.flat(), ...lower.flat()]
  for (const n of all) {
    teeth[String(n)] = 'natural'
  }
  teeth['16'] = 'filling'
  teeth['12'] = 'extracted'
  teeth['27'] = 'crown'
  teeth['24'] = 'decay'
  teeth['41'] = 'decay'
  teeth['33'] = 'decay'
  teeth['44'] = 'previous'
  teeth['38'] = 'filling'
  teeth['47'] = 'implant'
  return teeth
}

const defaultTeethChild = (): Record<string, ToothStatusKey> => {
  const teeth: Record<string, ToothStatusKey> = {}
  for (let i = 51; i <= 55; i++) teeth[String(i)] = 'natural'
  for (let i = 61; i <= 65; i++) teeth[String(i)] = 'natural'
  for (let i = 71; i <= 75; i++) teeth[String(i)] = 'natural'
  for (let i = 81; i <= 85; i++) teeth[String(i)] = 'natural'
  teeth['55'] = 'filling'
  teeth['52'] = 'extracted'
  teeth['64'] = 'decay'
  teeth['84'] = 'previous'
  teeth['81'] = 'crown'
  teeth['73'] = 'implant'
  return teeth
}

export const clinicalHistoryDiseaseOptions = [
  { id: 'd1', labelKey: 'patients.clinicalHistory.diseases.d1' },
  { id: 'd2', labelKey: 'patients.clinicalHistory.diseases.d2' },
  { id: 'd3', labelKey: 'patients.clinicalHistory.diseases.d3' },
  { id: 'd4', labelKey: 'patients.clinicalHistory.diseases.d4' },
  { id: 'd5', labelKey: 'patients.clinicalHistory.diseases.d5' },
  { id: 'd6', labelKey: 'patients.clinicalHistory.diseases.d6' },
  { id: 'd7', labelKey: 'patients.clinicalHistory.diseases.d7' },
  { id: 'd8', labelKey: 'patients.clinicalHistory.diseases.d8' },
  { id: 'd9', labelKey: 'patients.clinicalHistory.diseases.d9' },
  { id: 'd10', labelKey: 'patients.clinicalHistory.diseases.d10' },
] as const

const demoClinicalHistory: ClinicalHistorySummary = {
  diseaseIds: ['d1', 'd2', 'd3', 'd4'],
  otherDiseases: '',
  takesMedicinesRegularly: true,
  medicinesNote: '',
  hasDrugAllergies: true,
  allergiesNote: '',
  hadPreviousSurgery: true,
  surgeriesNote: '',
  pregnant: false,
  smokes: true,
  drinksAlcohol: false,
}

export const buildDemoDetail = (): PatientDetailPayload => {
  const profile: PatientProfile = {
    id: 'pt-demo',
    name: "Michael Smith",
    patientCode: '0123456789',
    genderLabelKey: 'male',
    bloodType: 'A+',
    ageYears: 32,
    contact: {
      email: 'michael.smith@clinic.com',
      phone: '+963-947523985',
      address: '24/2/2026',
    },
    activities: {
      lastVisit: '2026-02-05',
      nextVisit: '2026-02-05',
    },
    files: [
      {
        id: 'file-demo-1',
        name: 'Company Registration.pdf',
        uploadedAt: '2026-01-01',
      },
    ],
  }

  const appointments: PatientAppointmentRow[] = [
    {
      id: 'apt-demo-1',
      date: '2026-02-05',
      time: '13:00',
      doctorName: 'Dr. Doctor Name',
      doctorSpecialization: 'Specialization',
      treatmentType: 'Treatment Type',
      treatmentCategory: 'Category',
      statusKey: 'scheduled',
      notes: 'Follow-up',
    },
    {
      id: 'apt-demo-2',
      date: '2026-02-05',
      time: '13:00',
      doctorName: 'Dr. Doctor Name',
      doctorSpecialization: 'Specialization',
      treatmentType: 'Treatment Type',
      treatmentCategory: 'Category',
      statusKey: 'scheduled',
      notes: '',
    },
    {
      id: 'apt-demo-3',
      date: '2026-02-05',
      time: '13:00',
      doctorName: 'Dr. Doctor Name',
      doctorSpecialization: 'Specialization',
      treatmentType: 'Treatment Type',
      treatmentCategory: 'Category',
      statusKey: 'scheduled',
      notes: '',
    },
  ]

  const dentalChart: DentalChartState = {
    mode: 'adult',
    teeth: defaultTeethAdult(),
  }

  return {
    profile,
    appointments,
    invoicesSummary: { totalInvoiced: 1800, totalPaid: 550, totalRemaining: 1250 },
    invoices: demoInvoices,
    dentalChart,
    treatments: demoTreatments,
    clinicalHistory: demoClinicalHistory,
  }
}

export const seedPatientList: PatientListItem[] = [
  {
    id: 'pt-demo',
    name: "Michael Smith",
    patientCode: '0123456789',
    phone: '+963-947523985',
    email: 'michael.smith@clinic.com',
    lastVisit: '2026-02-05',
    nextVisit: '2026-02-05',
    ageYears: 32,
    genderLabelKey: 'male',
  },
  {
    id: 'pt-p-2',
    name: 'Sara Johnson',
    patientCode: '1122334455',
    phone: '+963-911111111',
    email: 'sara.j@clinic.com',
    lastVisit: '2026-01-20',
    nextVisit: '2026-03-01',
    ageYears: 28,
    genderLabelKey: 'female',
  },
  {
    id: 'pt-p-3',
    name: 'Omar Hassan',
    patientCode: '2233445566',
    phone: '+963-922222222',
    email: 'omar.h@clinic.com',
    lastVisit: '2026-01-15',
    nextVisit: '2026-02-28',
    ageYears: 41,
    genderLabelKey: 'male',
  },
  {
    id: 'pt-p-4',
    name: 'Layla Karim',
    patientCode: '3344556677',
    phone: '+963-933333333',
    email: 'layla.k@clinic.com',
    lastVisit: '2025-12-10',
    nextVisit: '2026-02-15',
    ageYears: 35,
    genderLabelKey: 'female',
  },
  {
    id: 'pt-p-5',
    name: 'John Doe',
    patientCode: '4455667788',
    phone: '+1-555-0101',
    email: 'john.doe@clinic.com',
    lastVisit: '2026-02-01',
    nextVisit: '2026-02-20',
    ageYears: 45,
    genderLabelKey: 'male',
  },
  {
    id: 'pt-p-6',
    name: 'Amira Said',
    patientCode: '5566778899',
    phone: '+963-944759214',
    email: 'amira.s@clinic.com',
    lastVisit: '2026-01-28',
    nextVisit: '2026-02-12',
    ageYears: 29,
    genderLabelKey: 'female',
  },
  {
    id: 'pt-p-7',
    name: 'Karim Nasser',
    patientCode: '6677889900',
    phone: '+963-955123456',
    email: 'karim.n@clinic.com',
    lastVisit: '2026-02-02',
    nextVisit: '2026-02-18',
    ageYears: 52,
    genderLabelKey: 'male',
  },
  {
    id: 'pt-p-8',
    name: 'Nour El-Din',
    patientCode: '7788990011',
    phone: '+963-966234567',
    email: 'nour.e@clinic.com',
    lastVisit: '2025-11-30',
    nextVisit: '2026-03-05',
    ageYears: 19,
    genderLabelKey: 'other',
  },
  {
    id: 'pt-p-9',
    name: 'Hana Malik',
    patientCode: '8899001122',
    phone: '+963-977345678',
    email: 'hana.m@clinic.com',
    lastVisit: '2026-02-04',
    nextVisit: '2026-02-25',
    ageYears: 37,
    genderLabelKey: 'female',
  },
  {
    id: 'pt-p-10',
    name: 'Youssef Ali',
    patientCode: '9900112233',
    phone: '+963-988456789',
    email: 'youssef.a@clinic.com',
    lastVisit: '2026-01-05',
    nextVisit: '2026-02-22',
    ageYears: 24,
    genderLabelKey: 'male',
  },
  {
    id: 'pt-p-11',
    name: 'Rania Haddad',
    patientCode: '0011223344',
    phone: '+963-999567890',
    email: 'rania.h@clinic.com',
    lastVisit: '2025-10-20',
    nextVisit: '2026-03-10',
    ageYears: 44,
    genderLabelKey: 'female',
  },
  {
    id: 'pt-p-12',
    name: 'Fadi Khoury',
    patientCode: '1122334450',
    phone: '+963-900678901',
    email: 'fadi.k@clinic.com',
    lastVisit: '2026-02-06',
    nextVisit: '2026-02-14',
    ageYears: 33,
    genderLabelKey: 'male',
  },
  {
    id: 'pt-p-13',
    name: 'Maya Rahal',
    patientCode: '2233445560',
    phone: '+963-911789012',
    email: 'maya.r@clinic.com',
    lastVisit: '2026-01-12',
    nextVisit: '2026-04-01',
    ageYears: 26,
    genderLabelKey: 'female',
  },
  {
    id: 'pt-p-14',
    name: 'Samir Obeid',
    patientCode: '3344556670',
    phone: '+963-922890123',
    email: 'samir.o@clinic.com',
    lastVisit: '2025-12-22',
    nextVisit: '2026-02-28',
    ageYears: 58,
    genderLabelKey: 'male',
  },
  {
    id: 'pt-p-15',
    name: 'Dina Fares',
    patientCode: '4455667780',
    phone: '+963-933901234',
    email: 'dina.f@clinic.com',
    lastVisit: '2026-02-07',
    nextVisit: '2026-03-15',
    ageYears: 31,
    genderLabelKey: 'female',
  },
]

const minimalDetail = (
  row: PatientListItem,
  overrides: Partial<PatientDetailPayload> = {}
): PatientDetailPayload => {
  const base = buildDemoDetail()
  return {
    ...base,
    profile: {
      ...base.profile,
      id: row.id,
      name: row.name,
      patientCode: row.patientCode,
      genderLabelKey: row.genderLabelKey,
      ageYears: row.ageYears,
      contact: {
        email: row.email,
        phone: row.phone,
        address: '—',
      },
      activities: {
        lastVisit: row.lastVisit,
        nextVisit: row.nextVisit,
      },
    },
    invoices: [],
    treatments: [],
    clinicalHistory: null,
    ...overrides,
  }
}

/** Static seed for MSW initial clone — demo patient fully populated; others minimal. */
const seedPatientDetailsFromList = (): Record<string, PatientDetailPayload> => {
  const map: Record<string, PatientDetailPayload> = {
    'pt-demo': buildDemoDetail(),
  }
  for (const row of seedPatientList) {
    if (row.id === 'pt-demo') continue
    map[row.id] = minimalDetail(row)
  }
  return map
}

export const seedPatientDetails: Record<string, PatientDetailPayload> = seedPatientDetailsFromList()

const cloneInvoiceEmbed = (i: Invoice): Invoice => ({
  ...i,
  payments: i.payments.map((p) => ({ ...p })),
})

/**
 * Invoices embedded only on patient detail payloads (e.g. inv-demo-1) must also exist in the
 * global MSW invoice list so GET /api/invoices/:id used by InvoiceDetailsModal can resolve them.
 */
export const getAllSeedPatientInvoices = (): Invoice[] =>
  Object.values(seedPatientDetails).flatMap((d) => d.invoices.map(cloneInvoiceEmbed))

export const deepCloneDetail = (id: string): PatientDetailPayload => {
  const base = seedPatientDetails[id]
  if (!base) {
    return JSON.parse(JSON.stringify(buildDemoDetail())) as PatientDetailPayload
  }
  return JSON.parse(JSON.stringify(base)) as PatientDetailPayload
}

export const applyDentalMode = (
  _chart: DentalChartState,
  mode: DentalChartState['mode']
): DentalChartState => ({
  mode,
  teeth: mode === 'adult' ? defaultTeethAdult() : defaultTeethChild(),
})
