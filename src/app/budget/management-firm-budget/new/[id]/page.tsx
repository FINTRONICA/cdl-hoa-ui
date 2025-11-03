'use client'

import { Suspense, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

import BudgetStepperWrapper from '@/components/organisms/BudgetStepper/ManagementFirmBudget'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { GlobalError, GlobalLoading } from '@/components/atoms'
import { managementFirmBudgetService } from '@/services/api/budget/managementFirmBudgetService'
import type { BudgetData } from '@/types/budget'
import { useBudgetLabels } from '@/hooks/budget/useBudgetLabels'
import { BUDGET_LABELS } from '@/constants/mappings/budgetLabels'

function BudgetWithIdContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { getLabel } = useBudgetLabels('EN')

  const mode = searchParams?.get('mode')
  const isViewMode = mode === 'view'

  const [budget, setBudget] = useState<BudgetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBudget = async () => {
      const id = params?.id as string | undefined
      if (!id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const result = await managementFirmBudgetService.getBudgetById(id)
        setBudget(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load budget data')
      } finally {
        setLoading(false)
      }
    }

    loadBudget()
  }, [params?.id])

  const title = isViewMode
    ? getLabel(
        BUDGET_LABELS.PAGE_TITLE,
        'EN',
        BUDGET_LABELS.FALLBACKS.PAGE_TITLE
      )
    : getLabel(
        BUDGET_LABELS.PAGE_TITLE,
        'EN',
        BUDGET_LABELS.FALLBACKS.PAGE_TITLE
      )

  const subtitle = isViewMode
    ? getLabel(
        BUDGET_LABELS.PAGE_SUBTITLE,
        'EN',
        BUDGET_LABELS.FALLBACKS.PAGE_SUBTITLE
      )
    : getLabel(
        BUDGET_LABELS.PAGE_SUBTITLE,
        'EN',
        BUDGET_LABELS.FALLBACKS.PAGE_SUBTITLE
      )

  if (loading) {
    return (
      <DashboardLayout title={title} subtitle={subtitle}>
        <div className="bg-[#FFFFFFBF] rounded-2xl flex flex-col h-full">
          <GlobalLoading fullHeight />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title={title} subtitle={subtitle}>
        <div className="bg-[#FFFFFFBF] rounded-2xl flex flex-col h-full">
          <GlobalError
            error={error}
            title="Error loading budget details"
            onRetry={() => window.location.reload()}
            fullHeight
          />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={title} subtitle={subtitle}>
      <div className="px-3">
        {budget && (
          <div className="flex items-start py-2 mb-4 gap-7 px-7">
            <div className="flex flex-col min-w-[200px] gap-1">
              <label className="font-sans text-[12px] text-[#4A5565]">
                {getLabel(
                  BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_FIRM_GROUP_NAME,
                  'EN',
                  BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_FIRM_GROUP_NAME
                )}
              </label>
              <span className="font-outfit text-[16px] text-[#1E2939]">
                {budget.managementFirmGroupName || 'N/A'}
              </span>
            </div>
            <div className="flex flex-col min-w-[200px] gap-1">
              <label className="font-sans text-[12px] text-[#4A5565]">
                {getLabel(
                  BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_TITLE,
                  'EN',
                  BUDGET_LABELS.FALLBACKS.FORM_FIELDS.BUDGET_PERIOD_TITLE
                )}
              </label>
              <span className="font-outfit text-[16px] text-[#1E2939]">
                {budget.budgetPeriodTitle || 'N/A'}
              </span>
            </div>
          </div>
        )}

        <BudgetStepperWrapper isReadOnly={isViewMode} />
      </div>
    </DashboardLayout>
  )
}

export default function BudgetWithIdPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BudgetWithIdContent />
    </Suspense>
  )
}
