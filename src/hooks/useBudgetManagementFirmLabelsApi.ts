import { useCallback, useMemo } from 'react'
import { BudgetLabelsService, ProcessedBudgetLabels } from '@/services/api/budgetApi/budgetLabelsService'
import { useAppStore } from '@/store'

// Hook that reads from Zustand store (labels are pre-loaded by ComplianceProvider)
// No API calls are made here to avoid duplicate requests
export function useBudgetManagementFirmLabelsApi() {
  // Read labels from Zustand store (already loaded by ComplianceProvider)
  const budgetLabels = useAppStore((state) => state.budgetLabels)
  const budgetLabelsLoading = useAppStore((state) => state.budgetLabelsLoading)
  const budgetLabelsError = useAppStore((state) => state.budgetLabelsError)

  // Labels are already loaded by ComplianceProvider, no need to fetch
  const labels = budgetLabels as ProcessedBudgetLabels | null
  const isLoading = budgetLabelsLoading
  const error = budgetLabelsError

  const getLabel = useCallback(
    (configId: string, language: string = 'EN', fallback?: string): string => {
      if (!labels) {
        return fallback || configId
      }
      return BudgetLabelsService.getLabel(labels, configId, language, fallback || configId)
    },
    [labels]
  )

  const hasLabels = useCallback(() => {
    return BudgetLabelsService.hasLabels(labels || {})
  }, [labels])

  const getAvailableLanguages = useCallback(() => {
    return BudgetLabelsService.getAvailableLanguages(labels || {})
  }, [labels])

  return useMemo(
    () => ({
      labels,
      isLoading,
      error,
      isError: !!error,
      isSuccess: !!labels && !error,
      refetch: async () => {
        // Labels are managed by ComplianceProvider, refetch is a no-op
        // If refresh is needed, it should be done through ComplianceProvider
        return Promise.resolve({ data: labels })
      },
      getLabel,
      hasLabels,
      getAvailableLanguages,
    }),
    [labels, isLoading, error, getLabel, hasLabels, getAvailableLanguages]
  )
}

