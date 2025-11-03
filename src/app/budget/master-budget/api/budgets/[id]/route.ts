import { NextRequest, NextResponse } from 'next/server'

import { type MasterBudgetData } from '@/types/budget'

import { masterBudgetsStore } from '../store'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const budget = masterBudgetsStore.get(params.id)

  if (!budget) {
    return NextResponse.json({ message: 'Master Budget not found' }, { status: 404 })
  }

  return NextResponse.json({ budget })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const existing = masterBudgetsStore.get(params.id)

  if (!existing) {
    return NextResponse.json({ message: 'Master Budget not found' }, { status: 404 })
  }

  const body = (await request.json()) as Partial<MasterBudgetData>

  const updated = {
    ...existing,
    ...body,
    chargeTypeId: Number(body.chargeTypeId ?? existing.chargeTypeId),
    updatedAt: new Date().toISOString(),
  }

  masterBudgetsStore.set(params.id, updated)

  return NextResponse.json({ budget: updated })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!masterBudgetsStore.has(params.id)) {
    return NextResponse.json({ message: 'Master Budget not found' }, { status: 404 })
  }

  masterBudgetsStore.delete(params.id)

  return NextResponse.json({ success: true })
}

