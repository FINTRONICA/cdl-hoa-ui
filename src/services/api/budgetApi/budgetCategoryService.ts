import { apiClient } from '@/lib/apiClient'
import { buildApiUrl, API_ENDPOINTS } from '@/constants/apiEndpoints'
import type { PaginatedResponse } from '@/types'
import { mapBudgetCategoryToBudgetCategoryData } from '@/constants/mappings/budgetLabels'

// DTO interfaces based on API response
export interface BudgetDTO {
  id: number
  budgetId: string
  budgetName: string
  isActive: boolean
  budgetPeriodCode: string
  propertyGroupId: number
  propertyManagerEmail: string
  masterCommunityName: string
  masterCommunityNameLocale: string
  createdBy: string
  enabled: boolean
  deleted: boolean
  assetRegisterDTO?: any
  managementFirmDTO?: any
  budgetCategoriesDTOS?: string[]
}

export interface BudgetItemDTO {
  id: number
  subCategoryCode: string
  subCategoryName: string
  subCategoryNameLocale: string
  serviceCode: string
  provisionalServiceCode: string
  serviceName: string
  serviceNameLocale: string
  totalBudget: number
  availableBudget: number
  utilizedBudget: number
  enabled: boolean
  deleted: boolean
  budgetCategoryDTO?: string
}

// Task Status DTO interface
export interface TaskStatusDTO {
  id: number
  code: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  deleted: boolean
  enabled: boolean
}

// ---------- Request DTO ----------
export interface BudgetCategoryRequest {

    id: number,
    serviceChargeGroupId: number,
    serviceChargeGroupName: string,
    serviceChargeGroupNameLocale: string,
    usageLocale: string,
    serviceName: string,
    serviceCode: string,
    provisionalBudgetCode: string,
    chargeTypeId: number,
    chargeType: string,
    usage: string,
    budgetPeriodFrom: string,
    budgetPeriodTo: string,
    budgetPeriodTitle: string,
    categoryCode: string,
    categoryName: string,
    categoryNameLocale: string,
    categorySubCode: string,
    categorySubName: string,
    categorySubToSubCode: string,
    categorySubToSubName: string,
    vatAmount: number,
    enabled: true,
    deleted: true,
    budgetDTO: BudgetDTO,
    budgetItemDTOS: BudgetItemDTO[],
}

export interface OptionDTO {
  id: number
  enabled?: boolean
}

// ---------- Response DTO ----------
export interface BudgetCategoryResponse {
  id: number
  serviceChargeGroupId: number
  serviceChargeGroupName: string
  serviceChargeGroupNameLocale: string
  usageLocale: string
  serviceName: string
  serviceCode: string
  provisionalBudgetCode: string
  chargeTypeId: number
  chargeType: string
  usage: string
  budgetPeriodFrom: string
  budgetPeriodTo: string
  budgetPeriodTitle: string
  categoryCode: string
  categoryName: string
  categoryNameLocale: string
  categorySubCode: string
  categorySubName: string
  categorySubToSubCode: string
  categorySubToSubName: string
  vatAmount: number
  enabled: boolean
  deleted: boolean
  budgetDTO?: BudgetDTO
  budgetItemDTOS?: BudgetItemDTO[]
  createdAt?: string
  updatedAt?: string
}

// ---------- UI Model ----------
export interface BudgetCategoryUIData extends Record<string, unknown> {
  id: number
  serviceChargeGroupId: number
  serviceChargeGroupName: string
  serviceChargeGroupNameLocale: string
  usageLocale: string
  serviceName: string
  serviceCode: string
  provisionalBudgetCode: string
  chargeTypeId: number
  chargeType: string
  usage: string
  budgetPeriodFrom: string
  budgetPeriodTo: string
  budgetPeriodTitle: string
  categoryCode: string
  categoryName: string
  categoryNameLocale: string
  categorySubCode: string
  categorySubName: string
  categorySubToSubCode: string
  categorySubToSubName: string
  vatAmount: number
  enabled: boolean
  deleted: boolean
  createdAt?: string
  updatedAt?: string
}

// ---------- Service ----------
class BudgetCategoryService {
  static async getBudgetCategories(
    page = 0,
    size = 20
  ): Promise<PaginatedResponse<BudgetCategoryUIData>> {
    try {
      const baseUrl = buildApiUrl(API_ENDPOINTS.BUDGET_CATEGORY.GET_ALL)
      // The endpoint already has query params, so we append with &
      const url = `${baseUrl}&page=${page}&size=${size}`
      console.log('[BudgetCategoryService] getBudgetCategories - Full URL:', url)
      console.log('[BudgetCategoryService] getBudgetCategories - Base URL:', baseUrl)
      console.log('[BudgetCategoryService] getBudgetCategories - Page:', page, 'Size:', size)
      console.log('[BudgetCategoryService] getBudgetCategories - About to call apiClient.get...')

      const data =
        await apiClient.get<PaginatedResponse<BudgetCategoryResponse>>(url)
      console.log('[BudgetCategoryService] getBudgetCategories - API response received:', data)
      console.log('[BudgetCategoryService] getBudgetCategories - Response type:', typeof data)
      console.log('[BudgetCategoryService] getBudgetCategories - Has content?', !!(data as any)?.content)

      // Handle different response formats
      if ((data as any).content && Array.isArray((data as any).content)) {
        // Spring Boot style pagination response
        const content = (data as any).content.map(
          mapBudgetCategoryToBudgetCategoryData
        )
        const pageInfo = (data as any).page || {}

        const result = {
          content,
          page: {
            size: pageInfo.size || size,
            number: pageInfo.number || page,
            totalElements: pageInfo.totalElements || content.length,
            totalPages:
              pageInfo.totalPages ||
              Math.ceil((pageInfo.totalElements || content.length) / size),
          },
        }

        return result
      } else if (Array.isArray(data)) {
        // Simple array response (fallback)
        const mappedData = (data as any).map(mapBudgetCategoryToBudgetCategoryData)
        return {
          content: mappedData,
          page: {
            size: mappedData.length,
            number: 0,
            totalElements: mappedData.length,
            totalPages: 1,
          },
        }
      }

      // Empty response
      return {
        content: [],
        page: {
          size: size,
          number: page,
          totalElements: 0,
          totalPages: 0,
        },
      }
    } catch (error) {
      console.error('Error in getBudgetCategories service:', error)
      throw error
    }
  }

  async getBudgetCategoryById(id: number): Promise<BudgetCategoryResponse> {
    const url = buildApiUrl(
      API_ENDPOINTS.BUDGET_CATEGORY.GET_BY_ID(id.toString())
    )
    console.log('[BudgetCategoryService] getBudgetCategoryById - Calling API:', url)
    console.log('[BudgetCategoryService] getBudgetCategoryById - ID:', id)
    try {
      const data = await apiClient.get<BudgetCategoryResponse>(url)
      console.log('[BudgetCategoryService] getBudgetCategoryById - API response:', data)
      return data
    } catch (error) {
      console.error('[BudgetCategoryService] getBudgetCategoryById - API error:', error)
      throw error
    }
  }

  async updateBudgetCategory(
    id: number,
    payload: Partial<BudgetCategoryRequest>
  ): Promise<BudgetCategoryResponse> {
    const url = buildApiUrl(API_ENDPOINTS.BUDGET_CATEGORY.UPDATE(id.toString()))
    const response = await apiClient.put(url, payload)
    return response as BudgetCategoryResponse
  }

  static async deleteBudgetCategory(id: number): Promise<void> {
    const url = buildApiUrl(
      API_ENDPOINTS.BUDGET_CATEGORY.SOFT_DELETE(id.toString())
    )
    await apiClient.delete(url)
  }

  async createBudgetCategory(payload: any): Promise<BudgetCategoryResponse> {
    const url = buildApiUrl(API_ENDPOINTS.BUDGET_CATEGORY.SAVE)
    const response = await apiClient.post(url, payload)
    return response as BudgetCategoryResponse
  }
}

// Export service instance
export const budgetCategoryService = new BudgetCategoryService()
export { BudgetCategoryService }
