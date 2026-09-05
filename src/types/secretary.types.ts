export type SecretaryListItem = {
  id: string
  name: string
  phone: string
  username: string
  /** Masked placeholder for UI; never a real password */
  passwordDisplay: string
}

export type SecretaryQuota = {
  max: number
  remaining: number
}

export type SecretariesListPayload = {
  secretaries: SecretaryListItem[]
  quota: SecretaryQuota
}

export type SecretaryFull = {
  id: string
  username: string
  firstName: string
  lastName: string
  name: string
  phone: string
  salary: number
  hasAllClinics?: boolean
  clinicIds?: string[]
}

export type SecretaryCreateInput = {
  username: string
  password: string
  firstName: string
  lastName: string
  phone: string
  salary: number
  hasAllClinics?: boolean
  clinicIds?: string[]
}

export type SecretaryUpdateInput = {
  firstName: string
  lastName: string
  phone: string
  salary: number
  hasAllClinics?: boolean
  clinicIds?: string[]
}
