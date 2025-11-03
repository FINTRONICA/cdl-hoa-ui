'use client'

import { Suspense, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

import MasterBudgetStepperWrapper from '@/components/organisms/BudgetStepper/MasterBudget'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { GlobalError, GlobalLoading } from '@/components/atoms'
import { masterBudgetService } from '@/services/api/budget/masterBudgetService'
import type { MasterBudgetData } from '@/types/budget'
import { useBudgetLabels } from '@/hooks/budget/useBudgetLabels'
import { MASTER_BUDGET_LABELS } from '@/constants/mappings/budgetLabels'

function MasterBudgetWithIdContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { getLabel } = useBudgetLabels('EN')

  const mode = searchParams?.get('mode')
  const isViewMode = mode === 'view'

  const [budget, setBudget] = useState<MasterBudgetData | null>(null)
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
        const result = await masterBudgetService.getBudgetById(id)
        setBudget(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load master budget data')
      } finally {
        setLoading(false)
      }
    }

    loadBudget()
  }, [params?.id])

  const title = getLabel(
    MASTER_BUDGET_LABELS.PAGE_TITLE,
    'EN',
    MASTER_BUDGET_LABELS.FALLBACKS.PAGE_TITLE
  )

  const subtitle = getLabel(
    MASTER_BUDGET_LABELS.PAGE_SUBTITLE,
    'EN',
    MASTER_BUDGET_LABELS.FALLBACKS.PAGE_SUBTITLE
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
            title="Error loading master budget details"
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
                  MASTER_BUDGET_LABELS.FORM_FIELDS.CHARGE_TYPE,
                  'EN',
                  MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CHARGE_TYPE
                )}
              </label>
              <span className="font-outfit text-[16px] text-[#1E2939]">
                {budget.chargeType || 'N/A'}
              </span>
            </div>
            <div className="flex flex-col min-w-[200px] gap-1">
              <label className="font-sans text-[12px] text-[#4A5565]">
                {getLabel(
                  MASTER_BUDGET_LABELS.FORM_FIELDS.GROUP_NAME,
                  'EN',
                  MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.GROUP_NAME
                )}
              </label>
              <span className="font-outfit text-[16px] text-[#1E2939]">
                {budget.groupName || 'N/A'}
              </span>
            </div>
          </div>
        )}

        <MasterBudgetStepperWrapper isReadOnly={isViewMode} />
      </div>
    </DashboardLayout>
  )
}

export default function MasterBudgetWithIdPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MasterBudgetWithIdContent />
    </Suspense>
  )
}

