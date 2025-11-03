import { NextRequest, NextResponse } from 'next/server'

import { type BudgetManagementFirmData } from '@/types/budget'

import {
  budgetsStore,
  createBudgetResponse,
  generateId,
  normalizeBudgetPayload,
} from './store'

export async function GET() {
  const budgets = Array.from(budgetsStore.values())
  return NextResponse.json({ budgets })
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<BudgetManagementFirmData>

  const id = generateId()
  const data = normalizeBudgetPayload(body, id)

  budgetsStore.set(id, data)

  return NextResponse.json(createBudgetResponse(data), { status: 201 })
}

