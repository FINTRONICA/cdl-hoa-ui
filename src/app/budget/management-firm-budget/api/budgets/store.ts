import {
  type BudgetData,
  type BudgetManagementFirmData,
  type BudgetSaveResponse,
} from '@/types/budget'

const globalStoreKey = '__escrow_budget_store__'

const getStore = () => {
  if (!(globalThis as any)[globalStoreKey]) {
    ;(globalThis as any)[globalStoreKey] = new Map<string, BudgetData>()
  }
  return (globalThis as any)[globalStoreKey] as Map<string, BudgetData>
}

export const budgetsStore = getStore()

export const generateId = () => crypto.randomUUID()

export const buildReference = (id: string) =>
  `BUD-${id.slice(0, 8).toUpperCase()}`

export const normalizeBudgetPayload = (
  payload: Partial<BudgetManagementFirmData>,
  id: string
): BudgetData => {
  const now = new Date().toISOString()

  return {
    id,
    managementFirmGroupId: payload.managementFirmGroupId ?? '',
    managementFirmGroupName: payload.managementFirmGroupName ?? '',
    managementFirmGroupLocalName: payload.managementFirmGroupLocalName ?? '',
    masterCommunityName: payload.masterCommunityName ?? '',
    masterCommunityLocalName: payload.masterCommunityLocalName ?? '',
    managementCompanyId: payload.managementCompanyId ?? '',
    managementCompanyName: payload.managementCompanyName ?? '',
    managementCompanyLocalName: payload.managementCompanyLocalName ?? '',
    managementFirmManagerEmail: payload.managementFirmManagerEmail ?? '',
    serviceChargeGroupId: payload.serviceChargeGroupId ?? '',
    serviceChargeGroupName: payload.serviceChargeGroupName ?? '',
    serviceChargeGroupLocalName: payload.serviceChargeGroupLocalName ?? '',
    budgetPeriodCode: payload.budgetPeriodCode ?? '',
    budgetPeriodTitle: payload.budgetPeriodTitle ?? '',
    budgetPeriodFrom: payload.budgetPeriodFrom ?? null,
    budgetPeriodTo: payload.budgetPeriodTo ?? null,
    categoryCode: payload.categoryCode ?? '',
    categoryName: payload.categoryName ?? '',
    categoryLocalName: payload.categoryLocalName ?? '',
    subCategoryCode: payload.subCategoryCode ?? '',
    subCategoryName: payload.subCategoryName ?? '',
    subCategoryLocalName: payload.subCategoryLocalName ?? '',
    serviceCode: payload.serviceCode ?? '',
    serviceName: payload.serviceName ?? '',
    serviceLocalName: payload.serviceLocalName ?? '',
    totalCost: Number(payload.totalCost ?? 0),
    vatAmount: Number(payload.vatAmount ?? 0),
    documents: [],
    budgetMasterData: [],
    createdAt: now,
    updatedAt: now,
  }
}

export const createBudgetResponse = (data: BudgetData): BudgetSaveResponse => ({
  id: data.id!,
  referenceCode: buildReference(data.id!),
  data,
})

