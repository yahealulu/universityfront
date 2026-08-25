export interface DashboardStats {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  revenueChange: number
  expensesChange: number
  netProfitChange: number
  marginChange: number
}

export interface TopDoctor {
  id: string
  rank: number
  name: string
  treatmentCount: number
  revenue: number
  avatarUrl?: string
}

export interface TodayAppointment {
  id: string
  time: string
  patientName: string
  patientId: string
  doctorName: string
  status: AppointmentStatus
}

export enum AppointmentStatus {
  Scheduled = 'scheduled',
  InProgress = 'in_progress',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export interface ExpenseCategory {
  id: string
  label: string
  amount: number
  percentage: number
}

export interface RevenueChartPoint {
  month: string
  revenue: number
  expenses: number
}
