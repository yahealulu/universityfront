import type { ExpenseListItem, ExpensesSummary } from '@/types/expense.types'

const iso = (y: number, m: number, d: number) =>
  new Date(Date.UTC(y, m - 1, d)).toISOString()

export const seedExpenses: ExpenseListItem[] = [
  {
    id: 'exp-1',
    date: iso(2026, 2, 23),
    title: 'Expense Title',
    category: 'labs',
    description: 'Description Text Description Text lorem ipsum dolor sit amet.',
    amount: 1000,
  },
  {
    id: 'exp-2',
    date: iso(2026, 2, 22),
    title: 'Lab supplies order',
    category: 'labs',
    description: 'Monthly consumables for lab work.',
    amount: 450,
  },
  {
    id: 'exp-3',
    date: iso(2026, 2, 21),
    title: 'Doctor payout batch',
    category: 'doctors',
    description: 'Scheduled doctor compensation.',
    amount: 600,
  },
  {
    id: 'exp-4',
    date: iso(2026, 2, 20),
    title: 'Office utilities',
    category: 'others',
    description: 'Electricity and water.',
    amount: 400,
  },
  {
    id: 'exp-5',
    date: iso(2026, 2, 19),
    title: 'Equipment rental',
    category: 'labs',
    description: 'Portable scanner rental.',
    amount: 320,
  },
  {
    id: 'exp-6',
    date: iso(2026, 2, 18),
    title: 'Staff training',
    category: 'others',
    description: 'CPR certification course fees.',
    amount: 280,
  },
  {
    id: 'exp-7',
    date: iso(2026, 2, 17),
    title: 'Sterilization service',
    category: 'labs',
    description: 'Weekly sterilization pickup.',
    amount: 150,
  },
  {
    id: 'exp-8',
    date: iso(2026, 2, 16),
    title: 'Locum doctor',
    category: 'doctors',
    description: 'Weekend coverage.',
    amount: 900,
  },
  {
    id: 'exp-9',
    date: iso(2026, 2, 15),
    title: 'Software subscription',
    category: 'others',
    description: 'Practice management SaaS.',
    amount: 199,
  },
  {
    id: 'exp-10',
    date: iso(2026, 2, 14),
    title: 'Imaging consumables',
    category: 'labs',
    description: 'X-ray films and shields.',
    amount: 510,
  },
  {
    id: 'exp-11',
    date: iso(2026, 2, 13),
    title: 'Hygienist bonus',
    category: 'doctors',
    description: 'Performance bonus Q1.',
    amount: 350,
  },
  {
    id: 'exp-12',
    date: iso(2026, 2, 12),
    title: 'Misc repairs',
    category: 'others',
    description: 'Chair hydraulics maintenance.',
    amount: 175,
  },
]

export const computeExpensesSummary = (rows: ExpenseListItem[]): ExpensesSummary => {
  let labPayments = 0
  let doctorPayments = 0
  let others = 0
  for (const e of rows) {
    if (e.category === 'labs') labPayments += e.amount
    else if (e.category === 'doctors') doctorPayments += e.amount
    else others += e.amount
  }
  const totalExpenses = labPayments + doctorPayments + others
  return { labPayments, totalExpenses, doctorPayments, others }
}
