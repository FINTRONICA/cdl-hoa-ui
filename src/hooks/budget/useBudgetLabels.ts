import { useCallback } from 'react'

import { getBudgetLabels } from '@/constants/mappings/budgetLabels'

export interface UseBudgetLabelsResult {
  getLabel: (configId: string, languageCode?: string, fallback?: string) => string
}

export const useBudgetLabels = (
  languageCode: string = 'EN'
): UseBudgetLabelsResult => {
  const getLabel = useCallback(
    (configId: string, _language: string = languageCode, fallback?: string) => {
      const label = getBudgetLabels(configId)
      if (label && label !== configId) {
        return label
      }
      return fallback || configId
    },
    [languageCode]
  )

  return { getLabel }
}


