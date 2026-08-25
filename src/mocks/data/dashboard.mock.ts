import {
  AppointmentStatus,
  type DashboardStats,
  type ExpenseCategory,
  type RevenueChartPoint,
  type TodayAppointment,
  type TopDoctor,
} from '@/types/dashboard.types'

export const mockDashboardStats: DashboardStats = {
  totalRevenue: 1000,
  totalExpenses: 2000,
  netProfit: 600,
  profitMargin: 56.2,
  revenueChange: 5.9,
  expensesChange: 5.9,
  netProfitChange: 5.9,
  marginChange: 5.9,
}

export const mockTopDoctors: TopDoctor[] = [
  {
    id: 'd1',
    rank: 1,
    name: 'Dr. Ahmad Al-Hassan',
    treatmentCount: 32,
    revenue: 2600,
  },
  {
    id: 'd2',
    rank: 2,
    name: 'Dr. Sara Mohammed',
    treatmentCount: 28,
    revenue: 2600,
  },
  {
    id: 'd3',
    rank: 3,
    name: 'Dr. Omar Khalil',
    treatmentCount: 24,
    revenue: 2600,
  },
  {
    id: 'd4',
    rank: 4,
    name: 'Dr. Fatima Abbas',
    treatmentCount: 21,
    revenue: 2600,
  },
  {
    id: 'd5',
    rank: 5,
    name: 'Dr. Youssef Ibrahim',
    treatmentCount: 18,
    revenue: 2600,
  },
]

export const mockTodayAppointments: TodayAppointment[] = [
  {
    id: 'a1',
    time: '11:00',
    patientName: 'Maria Garcia',
    patientId: 'PT-1234',
    doctorName: 'Dr. Doctor Name',
    status: AppointmentStatus.Scheduled,
  },
  {
    id: 'a2',
    time: '12:00',
    patientName: 'Maria Garcia',
    patientId: 'PT-1234',
    doctorName: 'Dr. Doctor Name',
    status: AppointmentStatus.Scheduled,
  },
  {
    id: 'a3',
    time: '12:30',
    patientName: 'Maria Garcia',
    patientId: 'PT-1234',
    doctorName: 'Dr. Doctor Name',
    status: AppointmentStatus.Scheduled,
  },
  {
    id: 'a4',
    time: '13:00',
    patientName: 'Maria Garcia',
    patientId: 'PT-1234',
    doctorName: 'Dr. Doctor Name',
    status: AppointmentStatus.Scheduled,
  },
  {
    id: 'a5',
    time: '13:30',
    patientName: 'Maria Garcia',
    patientId: 'PT-1234',
    doctorName: 'Dr. Doctor Name',
    status: AppointmentStatus.Scheduled,
  },
]

export const mockExpenseCategories: ExpenseCategory[] = [
  { id: 'ec-doctors', label: 'Doctors', amount: 350, percentage: 3.0 },
  { id: 'ec-labs', label: 'Labs', amount: 850, percentage: 7.3 },
  { id: 'ec-supplies', label: 'Supplies', amount: 1200, percentage: 10.3 },
  { id: 'ec-rents', label: 'Rents', amount: 5000, percentage: 42.7 },
  { id: 'ec-general', label: 'General', amount: 2500, percentage: 21.4 },
  { id: 'ec-others', label: 'Others', amount: 1800, percentage: 15.4 },
]

export const mockRevenueChart: RevenueChartPoint[] = [
  { month: 'Jan', revenue: 95000, expenses: 72000 },
  { month: 'Feb', revenue: 110000, expenses: 68000 },
  { month: 'Mar', revenue: 88000, expenses: 91000 },
  { month: 'Apr', revenue: 125000, expenses: 79000 },
  { month: 'May', revenue: 102000, expenses: 85000 },
  { month: 'Jun', revenue: 118000, expenses: 77000 },
]
