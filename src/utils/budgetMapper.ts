import { BudgetCategoryResponse } from "@/services/api/budgetApi/budgetCategoryService"

export interface LanguageTranslation {
    id: number
    configId: string
    configValue: string
    content: string | null
    status: string | null
    enabled: boolean
    deleted: boolean | null
  }
  
  export interface DocumentTypeDTO {
    id: number
    settingKey: string
    settingValue: string
    languageTranslationId: LanguageTranslation
    remarks: string | null
    status: string | null
    enabled: boolean
    deleted: boolean | null
  }
  
  export interface CountryOptionDTO {
    id: number
    settingKey: string
    settingValue: string
    languageTranslationId: LanguageTranslation
    remarks: string | null
    status: string | null
    enabled: boolean
    deleted: boolean
  }
  
  export interface BudgetDTO {
    id: number
    settingKey: string
    settingValue: string
    languageTranslationId: LanguageTranslation
    remarks: string | null
    status: string | null
    enabled: boolean
    deleted: boolean | null
  }

  export interface AssetRegisterDTO {
    id: number
    arDeveloperId?: string
    arCifrera?: string
    arDeveloperRegNo?: string
    arName?: string
    arMasterName?: string
    arNameLocal?: string
    arOnboardingDate?: string
    arContactAddress?: string
    arContactTel?: string
    arPoBox?: string
    arMobile?: string
    arFax?: string
    arEmail?: string
    arLicenseNo?: string
    arLicenseExpDate?: string
    arWorldCheckFlag?: string
    arWorldCheckRemarks?: string
    arMigratedData?: boolean
    arRemark?: string
    arProjectName?: string
    arCompanyNumber?: string
    arMasterCommunity?: string
    arMasterDeveloper?: string
    deleted?: boolean
    enabled?: boolean
  }

  export interface ManagementFirmDTO {
    id: number
    mfId?: string
    mfCif?: string
    mfName?: string
    mfNameLocal?: string
    mfLocation?: string
    mfReraNumber?: string
    mfStartDate?: string
    mfCompletionDate?: string
    mfPercentComplete?: string
    mfConstructionCost?: number
    mfAccStatusDate?: string
    mfRegistrationDate?: string
    mfNoOfUnits?: number
    mfRemarks?: string
    mfSpecialApproval?: string
    mfManagedBy?: string
    mfBackupUser?: string
    mfRetentionPercent?: string
    mfAdditionalRetentionPercent?: string
    mfTotalRetentionPercent?: string
    mfRetentionEffectiveDate?: string
    mfManagementExpenses?: string
    mfMarketingExpenses?: string
    mfAccoutStatusDate?: string
    mfTeamLeadName?: string
    mfRelationshipManagerName?: string
    mfAssestRelshipManagerName?: string
    mfRealEstateBrokerExp?: number
    mfAdvertisementExp?: number
    mfLandOwnerName?: string
    assetRegisterDTO?: AssetRegisterDTO
    deleted?: boolean
    enabled?: boolean
  }
  
  export interface BudgetResponse {
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
    assetRegisterDTO: AssetRegisterDTO
    managementFirmDTO: ManagementFirmDTO
    budgetCategoriesDTOS: BudgetCategoryResponse[]
  }

  export interface BudgetRequest {
    id?: number
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
    assetRegisterDTO: { id: number }
    managementFirmDTO: { id: number }
    budgetCategoriesDTOS: Array<{ id: number }>
  }

  export interface BudgetItemResponse {
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
    budgetCategoryDTO?: {
        id: number
        enabled?: boolean
    }
    budgetDTO?: {
        id: number
    } | null
  }

  export interface BudgetItemRequest {
    id?: number
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
    budgetCategoryDTO?: {
        id: number
        enabled?: boolean
    }
    budgetDTO?: {
        id: number
    } | null
  }

  // Mapping function for Budget Response to UI Data
  export function mapBudget(response: BudgetResponse): any {
    return {
      id: response.id,
      budgetId: response.budgetId,
      budgetName: response.budgetName,
      isActive: response.isActive,
      budgetPeriodCode: response.budgetPeriodCode,
      propertyGroupId: response.propertyGroupId,
      propertyManagerEmail: response.propertyManagerEmail,
      masterCommunityName: response.masterCommunityName,
      masterCommunityNameLocale: response.masterCommunityNameLocale,
      createdBy: response.createdBy,
      enabled: response.enabled,
      deleted: response.deleted,
      assetRegisterDTO: response.assetRegisterDTO,
      managementFirmDTO: response.managementFirmDTO,
      budgetCategoriesDTOS: response.budgetCategoriesDTOS || [],
      // UI display fields
      managementFirmGroupName: response.managementFirmDTO?.mfName || '-',
      managementCompanyName: response.managementFirmDTO?.mfName || '-',
      budgetPeriodTitle: response.budgetPeriodCode || '-',
      budgetPeriodRange: `${response.budgetPeriodCode || ''}`,
      serviceChargeGroupName: response.budgetCategoriesDTOS?.[0]?.serviceChargeGroupName || '-',
      totalCostDisplay: response.budgetCategoriesDTOS?.reduce((sum, cat) => sum + (cat.vatAmount || 0), 0) || 0,
    } as any
  }

