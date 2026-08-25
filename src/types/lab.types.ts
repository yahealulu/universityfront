export type Lab = {
  id: string
  name: string
  phone: string
  address: string
  totalRequests: number
  activeRequests: number
}

export type LabUpsertInput = {
  name: string
  phone: string
  address: string
}
