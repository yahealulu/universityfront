import { http, HttpResponse } from 'msw'

import { computeExpensesSummary, seedExpenses } from '@/mocks/data/expenses.mock'
import { getTenantId, getTenantOrdinal } from '@/mocks/handlers/utils'
import type { ExpenseCreateInput, ExpenseListItem, ExpenseUpdateInput } from '@/types/expense.types'

const json = <T>(data: T) =>
  HttpResponse.json({ success: true as const, data })

const parsePath = (request: Request) => {
  const pathname = new URL(request.url).pathname.replace(/\/$/, '')
  return pathname.split('/').filter(Boolean)
}

type ExpensesState = {
  expenses: ExpenseListItem[]
}

const byTenant = new Map<string, ExpensesState>()

const getState = (request: Request): ExpensesState => {
  const tenantId = getTenantId(request)
  const cached = byTenant.get(tenantId)
  if (cached) return cached
  const ord = getTenantOrdinal(tenantId)
  const seeded: ExpensesState = {
    expenses: seedExpenses.map((e, idx) => ({
      ...e,
      id: `${e.id}-c${ord + 1}`,
      title: `${e.title} C${ord + 1}`,
      amount: e.amount + ord * 40 + idx * 5,
    })),
  }
  byTenant.set(tenantId, seeded)
  return seeded
}

const isExpensesListGet = ({ request }: { request: Request }) => {
  if (request.method !== 'GET') return false
  const parts = parsePath(request)
  return parts.length === 2 && parts[0] === 'api' && parts[1] === 'expenses'
}

const isExpensesSummaryGet = ({ request }: { request: Request }) => {
  if (request.method !== 'GET') return false
  const parts = parsePath(request)
  return (
    parts.length === 3 && parts[0] === 'api' && parts[1] === 'expenses' && parts[2] === 'summary'
  )
}

const isExpenseDetailGet = ({ request }: { request: Request }) => {
  if (request.method !== 'GET') return false
  const parts = parsePath(request)
  return (
    parts.length === 3 &&
    parts[0] === 'api' &&
    parts[1] === 'expenses' &&
    Boolean(parts[2]) &&
    parts[2] !== 'summary'
  )
}

const isExpensesPost = ({ request }: { request: Request }) => {
  if (request.method !== 'POST') return false
  const parts = parsePath(request)
  return parts.length === 2 && parts[0] === 'api' && parts[1] === 'expenses'
}

const isExpensePatch = ({ request }: { request: Request }) => {
  if (request.method !== 'PATCH') return false
  const parts = parsePath(request)
  return parts.length === 3 && parts[0] === 'api' && parts[1] === 'expenses' && Boolean(parts[2])
}

const isExpenseDelete = ({ request }: { request: Request }) => {
  if (request.method !== 'DELETE') return false
  const parts = parsePath(request)
  return parts.length === 3 && parts[0] === 'api' && parts[1] === 'expenses' && Boolean(parts[2])
}

export const expensesHandlers = [
  http.get(isExpensesListGet, ({ request }) => {
    const state = getState(request)
    return json({ expenses: state.expenses.map((e) => ({ ...e })) })
  }),

  http.get(isExpensesSummaryGet, ({ request }) => {
    const state = getState(request)
    return json(computeExpensesSummary(state.expenses))
  }),

  http.get(isExpenseDetailGet, ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const id = parts[2] as string
    const row = state.expenses.find((e) => e.id === id)
    if (!row) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    return json({ ...row })
  }),

  http.post(isExpensesPost, async ({ request }) => {
    const state = getState(request)
    const body = (await request.json()) as ExpenseCreateInput
    const id = `exp-${crypto.randomUUID()}`
    const row: ExpenseListItem = {
      id,
      date: body.date,
      title: body.title,
      category: body.category,
      description: body.description,
      amount: body.amount,
    }
    state.expenses.push(row)
    return json(row)
  }),

  http.patch(isExpensePatch, async ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const id = parts[2] as string
    const idx = state.expenses.findIndex((e) => e.id === id)
    if (idx === -1) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    const body = (await request.json()) as ExpenseUpdateInput
    const updated: ExpenseListItem = {
      ...state.expenses[idx]!,
      date: body.date,
      title: body.title,
      category: body.category,
      description: body.description,
      amount: body.amount,
    }
    state.expenses[idx] = updated
    return json(updated)
  }),

  http.delete(isExpenseDelete, ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const id = parts[2] as string
    const idx = state.expenses.findIndex((e) => e.id === id)
    if (idx === -1) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    state.expenses.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
