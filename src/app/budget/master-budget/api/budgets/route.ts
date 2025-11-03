import { NextRequest, NextResponse } from 'next/server'

import { type MasterBudgetData } from '@/types/budget'

import {
  masterBudgetsStore,
  createMasterBudgetResponse,
  generateId,
  normalizeMasterBudgetPayload,
} from './store'

export async function GET() {
  const budgets = Array.from(masterBudgetsStore.values())
  return NextResponse.json({ budgets })
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<MasterBudgetData>

  const id = generateId()
  const data = normalizeMasterBudgetPayload(body, id)

  masterBudgetsStore.set(id, data)

  return NextResponse.json(createMasterBudgetResponse(data), { status: 201 })
}

