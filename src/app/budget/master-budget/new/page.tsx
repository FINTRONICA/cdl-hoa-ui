'use client'

import { Suspense } from 'react'

import MasterBudgetStepperWrapper from '@/components/organisms/BudgetStepper/MasterBudget'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { useBudgetLabels } from '@/hooks/budget/useBudgetLabels'
import { MASTER_BUDGET_LABELS } from '@/constants/mappings/budgetLabels'

function NewMasterBudgetContent() {
  const { getLabel } = useBudgetLabels('EN')
  return (
    <DashboardLayout
      title={getLabel(
        MASTER_BUDGET_LABELS.PAGE_TITLE,
        'EN',
        MASTER_BUDGET_LABELS.FALLBACKS.PAGE_TITLE
      )}
      subtitle={getLabel(
        MASTER_BUDGET_LABELS.PAGE_SUBTITLE,
        'EN',
        MASTER_BUDGET_LABELS.FALLBACKS.PAGE_SUBTITLE
      )}
    >
      <div className="px-3">
        <MasterBudgetStepperWrapper />
      </div>
    </DashboardLayout>
  )
}

export default function NewMasterBudgetPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewMasterBudgetContent />
    </Suspense>
  )
}

