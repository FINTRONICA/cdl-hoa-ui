import {
  type BudgetData,
  type BudgetFormOptions,
  type BudgetManagementFirmData,
  type BudgetSaveResponse,
} from '@/types/budget'

interface ApiListResponse<T> {
  budgets: T[]
}

interface ApiOptionsResponse {
  options: BudgetFormOptions
}

interface ApiBudgetResponse {
  budget: BudgetData
}

const BASE_PATH = '/budget/management-firm-budget/api'

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(errorText || response.statusText)
  }
  return (await response.json()) as T
}

const jsonRequest = async <T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> => {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  })

  return handleResponse<T>(response)
}

export const managementFirmBudgetService = {
  async getFormOptions(): Promise<BudgetFormOptions> {
    const result = await jsonRequest<ApiOptionsResponse>(
      `${BASE_PATH}/form-options`
    )
    return result.options
  },

  async listBudgets(): Promise<BudgetData[]> {
    const result = await jsonRequest<ApiListResponse<BudgetData>>(
      `${BASE_PATH}/budgets`
    )
    return result.budgets
  },

  async getBudgetById(id: string): Promise<BudgetData> {
    const result = await jsonRequest<ApiBudgetResponse>(
      `${BASE_PATH}/budgets/${id}`
    )
    return result.budget
  },

  async createBudget(
    payload: Partial<BudgetManagementFirmData>
  ): Promise<BudgetSaveResponse> {
    return jsonRequest<BudgetSaveResponse>(`${BASE_PATH}/budgets`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async updateBudget(
    id: string,
    payload: Partial<BudgetManagementFirmData>
  ): Promise<BudgetData> {
    const result = await jsonRequest<ApiBudgetResponse>(
      `${BASE_PATH}/budgets/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    )
    return result.budget
  },
}

export default managementFirmBudgetService

