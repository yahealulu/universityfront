import type { SettingsPayload } from '@/types/settings.types'

/** Seed: Sun–Thu on, Fri–Sat off; hours 10:00–17:00. */
export const seedSettings: SettingsPayload = {
  clinic: {
    name: 'Astro Clinics',
    phone: '+1 234 567 8900',
    address: '123 Medical Center Blvd, Suite 100',
    logoUrl: '/logo-astroclinics.png',
  },
  workDays: {
    sun: true,
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: false,
    sat: false,
  },
  workHours: {
    startTime: '10:00',
    endTime: '17:00',
  },
}
