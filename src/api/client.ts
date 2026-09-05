import axios from 'axios'

import { useAuthStore } from '@/store/auth.store'
import { useClinicStore } from '@/store/clinic.store'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? ''

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  const clinicId = useClinicStore.getState().activeClinicId

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (clinicId) {
    config.headers['X-Clinic-ID'] = clinicId
  }

  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)
