import { apiClient } from '@/lib/apiClient'
import { getAuthCookies } from '@/utils/cookieUtils'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { CAPITAL_PARTNER_LABELS } from '@/constants/mappings/capitalPartnerMapping'

export interface CapitalPartnerLabelResponse {
  id: number
  configId: string
  configValue: string
  content: string | null
  appLanguageCode: {
    id: number
    languageCode: string
    nameKey: string
    nameNativeValue: string
    deleted: boolean
    enabled: boolean
    rtl: boolean
  }
  applicationModuleDTO: {
    id: number
    moduleName: string
    moduleCode: string
    moduleDescription: string
    deleted: boolean
    enabled: boolean
    active: boolean
  }
  status: string | null
  enabled: boolean
  deleted: boolean | null
}

export type ProcessedCapitalPartnerLabels = Record<string, Record<string, string>>

const DEFAULT_LANGUAGE = 'EN'

export class CapitalPartnerLabelsService {
  /**
   * Fetch owner registry labels from the API
   */
  static async fetchLabels(): Promise<CapitalPartnerLabelResponse[]> {
    try {
      const { token } = getAuthCookies()
      
      if (!token) {
        throw new Error('Authentication token not found')
      }
      
      const labels = await apiClient.get<CapitalPartnerLabelResponse[]>(API_ENDPOINTS.APP_LANGUAGE_TRANSLATION.OWNER_REGISTRY, {
        headers: { Authorization: `Bearer ${token}` }
      })
  
      
      return labels
    } catch (error) {
     
      throw new Error('Failed to fetch owner registry labels')
    }
  }

  /**
   * Process raw API response into organized format
   */
  static processLabels(labels: CapitalPartnerLabelResponse[]): ProcessedCapitalPartnerLabels {
    
    return labels.reduce((processed, { configId, configValue, appLanguageCode }) => {
      if (!processed[configId]) {
        processed[configId] = {}
      }
      processed[configId][appLanguageCode.languageCode] = configValue
      return processed
    }, {} as ProcessedCapitalPartnerLabels)
  }

  /**
   * Get label value with language fallback
   */
  static getLabel(
    labels: ProcessedCapitalPartnerLabels,
    configId: string,
    language: string,
    fallback: string
  ): string {
    const languageLabels = labels[configId]
    const apiLabel = languageLabels?.[language] || languageLabels?.[DEFAULT_LANGUAGE]
    
    // If API label exists, use it
    if (apiLabel) {
      return apiLabel
    }
    
    // Fallback to local mapping
    const localLabel = CAPITAL_PARTNER_LABELS[configId]
    if (localLabel) {
      return localLabel
    }
    
    // Final fallback
    return fallback
  }

  /**
   * Check if labels are available
   */
  static hasLabels(labels: ProcessedCapitalPartnerLabels): boolean {
    return labels && Object.keys(labels).length > 0
  }

  /**
   * Get available languages from labels
   */
  static getAvailableLanguages(labels: ProcessedCapitalPartnerLabels): string[] {
    const languages = new Set<string>()
    Object.values(labels).forEach(languageLabels => {
      Object.keys(languageLabels).forEach(language => {
        languages.add(language)
      })
    })
    return Array.from(languages)
  }
}
