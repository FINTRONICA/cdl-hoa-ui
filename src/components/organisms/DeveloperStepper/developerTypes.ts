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

// Management Firm Data - NEW API uses 'ar' prefix
export interface BuildPartnerData {
  id: number
  arDeveloperId: string // Management Firm ID
  arCifrera: string | null // Management Firm CIF
  arDeveloperRegNo: string // Registration Number
  arName: string | null // Management Firm Name
  arMasterName: string | null // Master Management Firm
  arNameLocal: string | null // Local Name
  arOnboardingDate: string | null // Onboarding Date
  arContactAddress: string | null // Contact Address
  arContactTel: string | null // Contact Telephone
  arPoBox: string | null // PO Box
  arMobile: string | null // Mobile Number
  arFax: string | null // Fax Number
  arEmail: string | null // Email Address
  arLicenseNo: string | null // License Number
  arLicenseExpDate: string | null // License Expiry Date
  arWorldCheckFlag: boolean | null // World Check Status
  arWorldCheckRemarks: string | null // World Check Remarks
  arMigratedData: boolean | null // Migrated Data Flag
  arremark: string | null // Additional Notes
  arRegulatorDTO: unknown | null // Regulatory Authority
  arActiveStatusDTO: unknown | null // Active Status
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
  // Step 1: Management Firm Details (NEW API uses 'ar' prefix)
  arDeveloperId: string // Management Firm ID
  arCifrera: string // Management Firm CIF
  arDeveloperRegNo: string // Registration Number
  arName: string // Management Firm Name
  arMasterName: string // Master Management Firm
  arNameLocal: string // Local Name
  arOnboardingDate: Dayjs | null // Onboarding Date
  arContactAddress: string // Contact Address
  arContactTel: string // Contact Telephone
  arPoBox: string // PO Box
  arMobile: string // Mobile Number
  arFax: string // Fax Number
  arEmail: string // Email Address
  arLicenseNo: string // License Number
  arLicenseExpDate: Dayjs | null // License Expiry Date
  arWorldCheckFlag: boolean // World Check Status
  arWorldCheckRemarks: string // World Check Remarks
  arMigratedData: boolean // Migrated Data Flag
  arremark: string // Additional Notes
  arRegulatorDTO: {
    id: number // Regulatory Authority ID
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
