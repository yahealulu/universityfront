import type { SecretaryFull, SecretaryListItem } from '@/types/secretary.types'

export const SECRETARY_MAX_SLOTS = 10

export const MASKED_PASSWORD_DISPLAY = '••••••••'

export type SecretaryRecord = SecretaryFull & {
  /** Mock only — never expose in real APIs */
  passwordMock: string
}

const mkSecretary = (
  id: string,
  username: string,
  firstName: string,
  lastName: string,
  phone: string,
  salary: number,
  passwordMock: string
): SecretaryRecord => ({
  id,
  username,
  firstName,
  lastName,
  name: `${firstName} ${lastName}`,
  phone,
  salary,
  passwordMock,
})

/** 7 secretaries => 3 slots remaining (max 10). */
export const seedSecretaryRecords: SecretaryRecord[] = [
  mkSecretary('sec-1', 'nurse.amy', 'Amy', 'Rivera', '+963944759214', 1200, 'mock-pw-1'),
  mkSecretary('sec-2', 'nurse.ben', 'Ben', 'Omar', '+963933112233', 1150, 'mock-pw-2'),
  mkSecretary('sec-3', 'desk.lina', 'Lina', 'Haddad', '+963911223344', 1300, 'mock-pw-3'),
  mkSecretary('sec-4', 'front.mira', 'Mira', 'Saeed', '+963922334455', 1180, 'mock-pw-4'),
  mkSecretary('sec-5', 'nurse.tarek', 'Tarek', 'Nasser', '+963944001122', 1250, 'mock-pw-5'),
  mkSecretary('sec-6', 'desk.sara', 'Sara', 'Fouad', '+963955667788', 1220, 'mock-pw-6'),
  mkSecretary('sec-7', 'nurse.karim', 'Karim', 'Zaki', '+963966778899', 1190, 'mock-pw-7'),
]

export const toListItem = (r: SecretaryRecord): SecretaryListItem => ({
  id: r.id,
  name: r.name,
  phone: r.phone,
  username: r.username,
  passwordDisplay: MASKED_PASSWORD_DISPLAY,
})

export const toSecretaryFull = (r: SecretaryRecord): SecretaryFull => ({
  id: r.id,
  username: r.username,
  firstName: r.firstName,
  lastName: r.lastName,
  name: r.name,
  phone: r.phone,
  salary: r.salary,
})
