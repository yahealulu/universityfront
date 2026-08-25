/** Expense row category (matches filter pills Labs / Doctors / Others) */
export type ExpenseRowCategory = 'labs' | 'doctors' | 'others'

export type ExpenseCategoryFilter = 'all' | ExpenseRowCategory

export type ExpenseListItem = {
  id: string
  date: string
  title: string
  category: ExpenseRowCategory
  description: string
  amount: number
}

export type ExpensesSummary = {
  labPayments: number
  totalExpenses: number
  doctorPayments: number
  others: number
}

export type ExpensesListPayload = {
  expenses: ExpenseListItem[]
}

export type ExpenseCreateInput = {
  title: string
  category: ExpenseRowCategory
  amount: number
  description: string
  date: string
}

export type ExpenseUpdateInput = ExpenseCreateInput
