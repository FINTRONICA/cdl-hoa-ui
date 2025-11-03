import { NextRequest, NextResponse } from 'next/server'

import { type BudgetManagementFirmData } from '@/types/budget'

import { budgetsStore } from '../store'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const budget = budgetsStore.get(params.id)

  if (!budget) {
    return NextResponse.json({ message: 'Budget not found' }, { status: 404 })
  }

  return NextResponse.json({ budget })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const existing = budgetsStore.get(params.id)

  if (!existing) {
    return NextResponse.json({ message: 'Budget not found' }, { status: 404 })
  }

  const body = (await request.json()) as Partial<BudgetManagementFirmData>

  const updated = {
    ...existing,
    ...body,
    totalCost: Number(body.totalCost ?? existing.totalCost),
    vatAmount: Number(body.vatAmount ?? existing.vatAmount),
    budgetPeriodFrom: body.budgetPeriodFrom ?? existing.budgetPeriodFrom,
    budgetPeriodTo: body.budgetPeriodTo ?? existing.budgetPeriodTo,
    updatedAt: new Date().toISOString(),
  }

  budgetsStore.set(params.id, updated)

  return NextResponse.json({ budget: updated })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!budgetsStore.has(params.id)) {
    return NextResponse.json({ message: 'Budget not found' }, { status: 404 })
  }

  budgetsStore.delete(params.id)

  return NextResponse.json({ success: true })
}

