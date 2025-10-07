import { apiClient } from '@/lib/apiClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { getAuthCookies } from '@/utils/cookieUtils'

// Types for Fee dropdown responses
export interface FeeCategoryResponse {
  id: number
  settingKey: string
  settingValue: string
  languageTranslationId: {
    id: number
    configId: string        // Stable identifier (e.g., "CDL_UNIT_REG_FEE")
    configValue: string     // Display value (e.g., "Unit Registration Fee")
    content: string | null
    status: string | null
    enabled: boolean
  }
  remarks: string | null
  status: string | null
  enabled: boolean
}

export interface FeeDropdownOption {
  id: number
  configId: string         // Stable identifier for mapping
  configValue: string      // Display value
  settingValue: string     // Backend value
  enabled: boolean
}

export type ProcessedFeeDropdowns = Record<string, FeeDropdownOption[]>

const ERROR_MESSAGE = 'Failed to fetch fee dropdown data'

export class FeeDropdownService {
  /**
   * Fetch fee categories from the API
   */
  static async fetchFeeCategories(): Promise<FeeCategoryResponse[]> {
    try {
      const { token } = getAuthCookies()
      
      if (!token) {
        throw new Error('Authentication token not found')
      }
      
      const categories = await apiClient.get<FeeCategoryResponse[]>(
        API_ENDPOINTS.FEE_DROPDOWNS.CATEGORIES,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      console.log('✅ FeeDropdownService: Fee categories fetched successfully')
      console.log('📊 Fee Categories API Response:', categories)
      return categories
    } catch (error) {
      console.error('❌ FeeDropdownService: Error fetching fee categories:', error)
      throw new Error(ERROR_MESSAGE)
    }
  }

  /**
   * Fetch fee frequencies from the API
   */
  static async fetchFeeFrequencies(): Promise<FeeCategoryResponse[]> {
    try {
      const { token } = getAuthCookies()
      
      if (!token) {
        throw new Error('Authentication token not found')
      }
      
      const frequencies = await apiClient.get<FeeCategoryResponse[]>(
        API_ENDPOINTS.FEE_DROPDOWNS.FREQUENCIES,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      console.log('✅ FeeDropdownService: Fee frequencies fetched successfully')
      console.log('📊 Fee Frequencies API Response:', frequencies)
      return frequencies
    } catch (error) {
      console.error('❌ FeeDropdownService: Error fetching fee frequencies:', error)
      throw new Error(ERROR_MESSAGE)
    }
  }

  /**
   * Fetch debit account types from the API
   */
  static async fetchDebitAccountTypes(): Promise<FeeCategoryResponse[]> {
    try {
      const { token } = getAuthCookies()
      
      if (!token) {
        throw new Error('Authentication token not found')
      }
      
      const debitAccounts = await apiClient.get<FeeCategoryResponse[]>(
        API_ENDPOINTS.FEE_DROPDOWNS.DEBIT_ACCOUNTS,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      console.log('✅ FeeDropdownService: Debit account types fetched successfully')
      console.log('📊 Debit Account Types API Response:', debitAccounts)
      return debitAccounts
    } catch (error) {
      console.error('❌ FeeDropdownService: Error fetching debit account types:', error)
      throw new Error(ERROR_MESSAGE)
    }
  }

  /**
   * Fetch currencies from the API
   */
  static async fetchCurrencies(): Promise<FeeCategoryResponse[]> {
    try {
      const { token } = getAuthCookies()
      
      if (!token) {
        throw new Error('Authentication token not found')
      }
      
      const currencies = await apiClient.get<FeeCategoryResponse[]>(
        API_ENDPOINTS.FEE_DROPDOWNS.CURRENCIES,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      console.log('✅ FeeDropdownService: Currencies fetched successfully')
      console.log('📊 Currencies API Response:', currencies)
      return currencies
    } catch (error) {
      console.error('❌ FeeDropdownService: Error fetching currencies:', error)
      throw new Error(ERROR_MESSAGE)
    }
  }

  /**
   * Fetch countries from the API
   */
  static async fetchCountries(): Promise<FeeCategoryResponse[]> {
    try {
      const { token } = getAuthCookies()
      
      if (!token) {
        throw new Error('Authentication token not found')
      }
      
      const countries = await apiClient.get<FeeCategoryResponse[]>(
        API_ENDPOINTS.FEE_DROPDOWNS.COUNTRIES,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      console.log('✅ FeeDropdownService: Countries fetched successfully')
      console.log('📊 Countries API Response:', countries)
      return countries
    } catch (error) {
      console.error('❌ FeeDropdownService: Error fetching countries:', error)
      throw new Error(ERROR_MESSAGE)
    }
  }


  /**
   * Process and transform raw API response to dropdown format
   */
  static processFeeCategories(categories: FeeCategoryResponse[]): FeeDropdownOption[] {
    return categories
      .filter(category => category.enabled)
      .map(category => ({
        id: category.id,
        configId: category.languageTranslationId.configId,
        configValue: category.languageTranslationId.configValue,
        settingValue: category.settingValue,
        enabled: category.enabled
      }))
  }

  /**
   * Process and transform raw API response to dropdown format (generic method)
   */
  static processDropdownOptions(options: FeeCategoryResponse[]): FeeDropdownOption[] {
    return options
      .filter(option => option.enabled)
      .map(option => ({
        id: option.id,
        configId: option.languageTranslationId.configId,
        configValue: option.languageTranslationId.configValue,
        settingValue: option.settingValue,
        enabled: option.enabled
      }))
  }

  /**
   * Get display label with fallback mechanism
   */
  static getDisplayLabel(
    option: FeeDropdownOption,
    fallbackValue?: string
  ): string {
    // Priority: configValue -> fallbackValue -> formatted configId
    if (option.configValue && option.configValue.trim()) {
      return option.configValue.trim()
    }
    
    if (fallbackValue && fallbackValue.trim()) {
      return fallbackValue.trim()
    }
    
    return this.formatConfigId(option.configId)
  }

  /**
   * Format configId to readable text (fallback)
   */
  private static formatConfigId(configId: string): string {
    return configId
      .replace(/^CDL_/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  /**
   * Get option by ID
   */
  static getOptionById(options: FeeDropdownOption[], id: number): FeeDropdownOption | undefined {
    return options.find(option => option.id === id)
  }

  /**
   * Get option by configId
   */
  static getOptionByConfigId(options: FeeDropdownOption[], configId: string): FeeDropdownOption | undefined {
    return options.find(option => option.configId === configId)
  }

  /**
   * Check if dropdown options are available
   */
  static hasOptions(options: FeeDropdownOption[]): boolean {
    return options && options.length > 0
  }
}
