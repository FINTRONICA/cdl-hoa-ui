'use client'

import { Suspense } from 'react'

import BudgetStepperWrapper from '@/components/organisms/BudgetStepper/ManagementFirmBudget'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { useBudgetLabels } from '@/hooks/budget/useBudgetLabels'
import { BUDGET_LABELS } from '@/constants/mappings/budgetLabels'

function NewBudgetContent() {
  const { getLabel } = useBudgetLabels('EN')
  return (
    <DashboardLayout
      title={getLabel(
        BUDGET_LABELS.PAGE_TITLE,
        'EN',
        BUDGET_LABELS.FALLBACKS.PAGE_TITLE
      )}
      subtitle={getLabel(
        BUDGET_LABELS.PAGE_SUBTITLE,
        'EN',
        BUDGET_LABELS.FALLBACKS.PAGE_SUBTITLE
      )}
    >
      <div className="px-3">
        <BudgetStepperWrapper />
      </div>
    </DashboardLayout>
  )
}

export default function NewBudgetPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewBudgetContent />
    </Suspense>
  )
}
