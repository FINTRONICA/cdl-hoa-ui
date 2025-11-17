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

function BudgetMasterEditPageContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { getLabel } = useBudgetLabelsWithCache('EN')

  const budgetId = params.id as string
  const mode = searchParams.get('mode')
  const editing = searchParams.get('editing')
  const isViewMode = mode === 'view'
  const isEditingMode = editing === 'true'

  const [budgetData, setBudgetData] = useState<MasterBudgetData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch budget data when component mounts
  useEffect(() => {
    console.log('[BudgetMasterEditPage] useEffect triggered', { budgetId, isViewMode, isEditingMode })
    
    const fetchBudgetData = async () => {
      try {
        console.log('[BudgetMasterEditPage] fetchBudgetData called with budgetId:', budgetId)
        setIsLoading(true)
        setError(null)
        console.log('[BudgetMasterEditPage] Calling masterBudgetService.getBudgetById...')
        const data = await masterBudgetService.getBudgetById(budgetId)
        console.log('[BudgetMasterEditPage] Received data from API:', data)
        setBudgetData(data)
        console.log('[BudgetMasterEditPage] Budget data set successfully')
      } catch (err: unknown) {
        console.error('[BudgetMasterEditPage] Error in fetchBudgetData:', err)
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch master budget data'
        console.error('[BudgetMasterEditPage] Setting error:', errorMessage)
        setError(errorMessage)
      } finally {
        console.log('[BudgetMasterEditPage] Setting isLoading to false')
        setIsLoading(false)
      }
    }

    if (budgetId) {
      console.log('[BudgetMasterEditPage] budgetId exists, calling fetchBudgetData')
      fetchBudgetData()
    } else {
      console.warn('[BudgetMasterEditPage] No budgetId found, skipping fetch')
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
      <div className="flex items-start py-2 gap-7 px-7">
        <div className="flex flex-col min-w-[200px] gap-1">
          <label className="font-sans font-normal text-[12px] leading-[1] tracking-normal text-[#4A5565]">
            {getLabel(
              MASTER_BUDGET_LABELS.FORM_FIELDS.CHARGE_TYPE,
              'EN',
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CHARGE_TYPE
            )}
            *
          </label>
          <span className="font-outfit font-normal text-[16px] leading-[1] tracking-normal align-middle text-[#1E2939]">
            {budgetData?.chargeType || 'N/A'}
          </span>
        </div>
        <div className="flex flex-col min-w-[200px] gap-1">
          <label className="font-sans font-normal text-[12px] leading-[1] tracking-normal text-[#4A5565]">
            {getLabel(
              MASTER_BUDGET_LABELS.FORM_FIELDS.GROUP_NAME,
              'EN',
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.GROUP_NAME
            )}
          </label>
          <span className="font-outfit font-normal text-[16px] leading-[1] tracking-normal align-middle text-[#1E2939]">
            {budgetData?.groupName || 'N/A'}
          </span>
        </div>
      </div>
      <div className="px-3 mt-[10px]">
        <BudgetMasterStepperWrapper
          initialBudgetId={budgetId ? budgetId : null}
          initialStep={0}
          isReadOnly={isViewMode}
        />
      </div>
    </DashboardLayout>
  )
}

export default function BudgetMasterEditPage() {
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
      <BudgetMasterEditPageContent />
    </Suspense>
  )
}

