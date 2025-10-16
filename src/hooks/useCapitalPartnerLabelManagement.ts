import { useState } from 'react'
import { CapitalPartnerLabelsService } from '@/services/api/capitalPartnerLabelsService'

export interface LabelUpdateRequest {
  configId: string
  newValue: string
  language?: string
}

export function useCapitalPartnerLabelManagement() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateLabel = async (labelId: number, newValue: string) => {
    try {
      setIsUpdating(true)
      setError(null)
      
      const response = await CapitalPartnerLabelsService.updateLabel(labelId, newValue)
      
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update label'
      setError(errorMessage)
      throw err
    } finally {
      setIsUpdating(false)
    }
  }

  const createLabel = async (
    configId: string,
    configValue: string,
    languageCode: string = 'EN'
  ) => {
    try {
      setIsUpdating(true)
      setError(null)
      
      const response = await CapitalPartnerLabelsService.createLabel(
        configId,
        configValue,
        languageCode
      )
      
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create label'
      setError(errorMessage)
      throw err
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    updateLabel,
    createLabel,
    isUpdating,
    error,
    clearError: () => setError(null)
  }
}
