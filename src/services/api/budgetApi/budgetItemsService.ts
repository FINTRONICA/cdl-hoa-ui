import { apiClient } from '@/lib/apiClient'
import { buildApiUrl, API_ENDPOINTS } from '@/constants/apiEndpoints'
import { BudgetItemRequest, BudgetItemResponse } from '@/constants/mappings/budgetMapper'

// Re-export types from mapper
export type { BudgetItemRequest, BudgetItemResponse } from '@/constants/mappings/budgetMapper'

// ---------- Service ----------
class BudgetItemsService {
  async getBudgetItemsById(
    id: number
  ): Promise<BudgetItemResponse> {
    const url = buildApiUrl(
      API_ENDPOINTS.BUDGET_ITEM.GET_BY_ID(id.toString())
    )
    const data = await apiClient.get<BudgetItemResponse>(url)
    return data
  }

  async updateBudgetItems(
    id: number,
    payload: Partial<BudgetItemRequest>
  ): Promise<BudgetItemResponse> {
    const url = buildApiUrl(
      API_ENDPOINTS.BUDGET_ITEM.UPDATE(id.toString())
    )
    const response = await apiClient.put<BudgetItemResponse>(url, payload)
    return response
  }

  async deleteBudgetItems(id: number): Promise<void> {
    const url = buildApiUrl(
      API_ENDPOINTS.BUDGET_ITEM.DELETE(id.toString())
    )
    await apiClient.delete(url)
  }

  async createBudgetItems(
    payload: BudgetItemRequest
  ): Promise<BudgetItemResponse> {
    const url = buildApiUrl(API_ENDPOINTS.BUDGET_ITEM.SAVE)
    const response = await apiClient.post<BudgetItemResponse>(url, payload)
    return response
  }

  async getBudgetItemsByBudgetCategoryId(
    budgetCategoryId: number
  ): Promise<BudgetItemResponse[]> {
    const url = buildApiUrl(API_ENDPOINTS.BUDGET_ITEM.GET_ALL)
    const fullUrl = `${url}&budgetCategoryDTO.id.equals=${budgetCategoryId}&page=0&size=1000`
    const response = await apiClient.get<{ content: BudgetItemResponse[] }>(fullUrl)
    return Array.isArray(response) ? response : (response.content || [])
  }
}

// Export service instance
export const budgetItemsService = new BudgetItemsService()
export { BudgetItemsService }
