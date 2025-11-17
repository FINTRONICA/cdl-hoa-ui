'use client'
import { Suspense } from 'react'
import BudgetMasterStepperWrapper from '@/components/organisms/BudgetStepper/MasterBudget/Index'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { useBudgetLabelsWithCache } from '@/hooks/budget/useBudgetLabelsWithCache'
import { MASTER_BUDGET_LABELS } from '@/constants/mappings/budgetLabels'

function BudgetMasterContent() {
  const { getLabel } = useBudgetLabelsWithCache('EN')

  const pageTitle = getLabel(
    MASTER_BUDGET_LABELS.PAGE_TITLE,
    'EN',
    MASTER_BUDGET_LABELS.FALLBACKS.PAGE_TITLE
  )
  const pageSubtitle = getLabel(
    MASTER_BUDGET_LABELS.PAGE_SUBTITLE,
    'EN',
    MASTER_BUDGET_LABELS.FALLBACKS.PAGE_SUBTITLE
  )

  return (
    <DashboardLayout title={pageTitle} subtitle={pageSubtitle}>
      <div className="px-3">
        <BudgetMasterStepperWrapper />
      </div>
    </DashboardLayout>
  )
}

export default function NewBudgetMasterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BudgetMasterContent />
    </Suspense>
  )
}
