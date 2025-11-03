import {
  type MasterBudgetData,
  type MasterBudgetSaveResponse,
} from '@/types/budget'

const globalStoreKey = '__escrow_master_budget_store__'

const getStore = () => {
  if (!(globalThis as any)[globalStoreKey]) {
    ;(globalThis as any)[globalStoreKey] = new Map<string, MasterBudgetData>()
  }
  return (globalThis as any)[globalStoreKey] as Map<string, MasterBudgetData>
}

export const masterBudgetsStore = getStore()

export const generateId = () => crypto.randomUUID()

export const buildReference = (id: string) =>
  `MBUD-${id.slice(0, 8).toUpperCase()}`

export const normalizeMasterBudgetPayload = (
  payload: Partial<MasterBudgetData>,
  id: string
): MasterBudgetData => {
  const now = new Date().toISOString()

  return {
    id,
    chargeTypeId: Number(payload.chargeTypeId ?? 0),
    chargeType: payload.chargeType ?? '',
    groupName: payload.groupName ?? '',
    categoryCode: payload.categoryCode ?? '',
    categoryName: payload.categoryName ?? '',
    categorySubCode: payload.categorySubCode ?? '',
    categorySubName: payload.categorySubName ?? '',
    categorySubToSubCode: payload.categorySubToSubCode ?? '',
    categorySubToSubName: payload.categorySubToSubName ?? '',
    serviceName: payload.serviceName ?? '',
    serviceCode: payload.serviceCode ?? '',
    provisionalBudgetCode: payload.provisionalBudgetCode ?? '',
    documents: [],
    createdAt: now,
    updatedAt: now,
  }
}

export const createMasterBudgetResponse = (
  data: MasterBudgetData
): MasterBudgetSaveResponse => ({
  id: data.id!,
  referenceCode: buildReference(data.id!),
  data,
})

