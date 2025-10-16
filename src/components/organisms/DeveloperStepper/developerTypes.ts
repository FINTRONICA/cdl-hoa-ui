import { Dayjs } from 'dayjs'

export interface DocumentItem {
  id: string
  name: string
  size: number
  type: string
  uploadDate: Date
  status: 'uploading' | 'completed' | 'error' | 'failed'
  progress?: number
  file?: File
  url?: string
  classification?: string
}

// API response interface for documents
export interface ApiDocumentResponse {
  id: number
  rea: string | null
  documentName: string
  content: string | null
  location: string
  module: string
  recordId: number | string
  storageType: string
  uploadDate: string
  documentSize: string
  validityDate: string | null
  version: number
  eventDetail: string | null
  documentType?: {
    id: number
    settingKey: string
    settingValue: string
    remarks: string | null
    enabled: boolean
    deleted: boolean | null
  } | null
  documentTypeDTO?: {
    id: number
    settingKey: string
    settingValue: string
    languageTranslationId: {
      id: number
      configId: string
      configValue: string
      content: string | null
      status: string | null
      enabled: boolean
      deleted: boolean | null
    } | null
    remarks: string | null
    status: string | null
    enabled: boolean
    deleted: boolean | null
  } | null
  enabled: boolean
  deleted: boolean | null
}

// Paginated response for document list
export interface PaginatedDocumentResponse {
  content: ApiDocumentResponse[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

export interface BuildPartnerData {
  id: number
  arID: string
  arCifrera: string | null
  arDeveloperRegNo: string
  arName: string | null
  arNameLocal: string | null
  arCompanyName: string | null
  arProjectName: string | null
  arMasterDeveloper: string | null
  arMasterCommunity: string | null
  arOnboardingDate: string | null
  arTradeLicenseNo: string | null
  arTradeLicenseExpDate: string | null
  arWorldCheckFlag: boolean | null
  arWorldCheckRemarks: string | null
  arMigratedData: boolean | null
  arRemark: string | null
  arRegulatorDTO: unknown | null
  arActiveStatusDTO: unknown | null
}

export interface ProjectDetailsData {
  sectionId: string
  developerId: string
  developerName: string
  masterDeveloperName: string
  projectName: string
  projectLocation: string
  projectAccountCif: string
  projectStatus: string
  projectAccountStatusDate: Dayjs | null
  projectRegistrationDate: Dayjs | null
  projectStartDate: Dayjs | null
  projectCompletionDate: Dayjs | null
  retention: string
  additionalRetention: string
  totalRetention: string
  retentionEffectiveStartDate: Dayjs | null
  projectManagementExpenses: string
  marketingExpenses: string
  realEstateBrokerExpense: string
  advertisingExpense: string
  landOwnerName: string
  projectCompletionPercentage: string
  currency: string
  actualConstructionCost: string
  noOfUnits: string
  remarks: string
  specialApproval: string
  paymentType: string
  managedBy: string
  backupRef: string
  relationshipManager: string
  assistantRelationshipManager: string
  teamLeaderName: string
}

export interface AccountData {
  trustAccountNumber: string
  ibanNumber: string
  dateOpened: Dayjs | null
  accountTitle: string
  currency: string
}

export interface ContactData extends Record<string, unknown> {
  id?: number | string
  name: string
  address: string
  email: string
  pobox: string
  countrycode: string
  mobileno: string
  telephoneno: string
  fax: string
  buildPartnerDTO?: {
    id: number
  }
}

export interface FeeData extends Record<string, unknown> {
  id?: number | string
  feeType: string
  frequency: string
  debitAmount: string
  feeToBeCollected: string
  nextRecoveryDate: Dayjs | null
  feePercentage: string
  amount: string
  vatPercentage: string
  buildPartnerDTO?: {
    id: number
  }
}

export interface BeneficiaryData extends Record<string, unknown> {
  id: string
  transferType: string
  name: string
  bankName: string
  swiftCode: string
  routingCode: string
  account: string
  buildPartnerDTO?: {
    id: number
  }
}

export interface PaymentPlanData {
  installmentNumber: number
  installmentPercentage: string
  projectCompletionPercentage: string
}

export interface FinancialData {
  projectEstimatedCost: string
  actualCost: string
  projectBudget: string
}

export interface ProjectData extends ProjectDetailsData {
  // Step 1: Asset Register Details
  arID: string
  arCifrera: string
  arDeveloperRegNo: string
  arName: string
  arNameLocal: string
  arCompanyName: string
  arProjectName: string
  arMasterDeveloper: string
  arMasterCommunity: string
  arOnboardingDate: Dayjs | null
  arTradeLicenseNo: string
  arTradeLicenseExpDate: Dayjs | null
  arWorldCheckFlag: boolean
  arWorldCheckRemarks: string
  arMigratedData: boolean
  arRemark: string
  arRegulatorDTO: {
    id: number
  }

  // Step 2: Documents (Optional)
  documents: DocumentItem[]

  // Step 3: Account Details
  contactData: ContactData[]
  accounts: AccountData[]

  // Step 4: Fee Details
  fees: FeeData[]

  // Step 5: Beneficiary Details
  beneficiaries: BeneficiaryData[]

  // Step 6: Payment Plan
  paymentPlan: PaymentPlanData[]

  // Step 7: Financial (extensive financial data)
  financialData: FinancialData
}
