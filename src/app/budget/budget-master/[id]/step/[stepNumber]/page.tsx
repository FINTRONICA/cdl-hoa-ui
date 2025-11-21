'use client'

import { Suspense, useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import BudgetMasterStepperWrapper from '@/components/organisms/BudgetStepper/MasterBudget/Index'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { useBudgetLabelsWithCache } from '@/hooks/budget/useBudgetLabelsWithCache'
import { MASTER_BUDGET_LABELS } from '@/constants/mappings/budgetLabels'
import { masterBudgetService } from '@/services/api/budgetApi/budgetService'
import { GlobalLoading } from '@/components/atoms'
import type { MasterBudgetData } from '@/types/budget'

function BudgetMasterStepPageContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { getLabel } = useBudgetLabelsWithCache('EN')

  const budgetId = params.id as string
  const stepNumber = params.stepNumber as string
  const mode = searchParams.get('mode')
  const editing = searchParams.get('editing')
  const isViewMode = mode === 'view'
  const isEditingMode = editing === 'true'

  const [budgetData, setBudgetData] = useState<MasterBudgetData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Calculate initial step (stepNumber is 1-based, we need 0-based)
  const initialStep = stepNumber ? Math.max(0, parseInt(stepNumber) - 1) : 0

  // Fetch budget data when component mounts
  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await masterBudgetService.getBudgetById(budgetId)
        setBudgetData(data)
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch master budget data'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    if (budgetId) {
      fetchBudgetData()
    } else {
      setIsLoading(false)
    }
  }, [budgetId])

  const pageTitle = getLabel(
    MASTER_BUDGET_LABELS.PAGE_TITLE,
    'EN',
    MASTER_BUDGET_LABELS.FALLBACKS.PAGE_TITLE
  )

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout title={pageTitle} subtitle="">
        <div className="bg-[#FFFFFFBF] rounded-2xl flex flex-col h-full">
          <GlobalLoading fullHeight />
        </div>
      </DashboardLayout>
    )
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout
        title={pageTitle}
        subtitle="Error loading master budget details"
      >
        <div className="p-6 text-red-600">
          <p>Error: {error}</p>
          <button
            onClick={() => router.push('/budget/budget-master')}
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Back to Master Budgets
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title={pageTitle}
      subtitle={
        isViewMode
          ? 'View Master Budget details and configuration (Read-only)'
          : isEditingMode
            ? 'Edit Master Budget details and configuration'
            : 'Manage your Master Budget details and configuration'
      }
    >
      <div className="px-3">
        <BudgetMasterStepperWrapper
          initialBudgetId={budgetId}
          initialStep={initialStep}
          isReadOnly={isViewMode}
        />
      </div>
    </DashboardLayout>
  )
}

export default function BudgetMasterStepPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout
          title={MASTER_BUDGET_LABELS.FALLBACKS.PAGE_TITLE}
          subtitle=""
        >
          <div className="bg-[#FFFFFFBF] rounded-2xl flex flex-col h-full">
            <GlobalLoading fullHeight />
          </div>
        </DashboardLayout>
      }
    >
      <BudgetMasterStepPageContent />
    </Suspense>
  )
}

