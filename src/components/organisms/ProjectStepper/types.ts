import { Dayjs } from 'dayjs'

export interface ProjectDetailsData {
  // API fields matching the JSON payload exactly
  mfId: string
  mfId: string
  mfName: string
  mfLocation: string
  mfReraNumber: string
  mfAccoutStatusDate: Dayjs | null
  mfRegistrationDate: Dayjs | null
  mfStartDate: Dayjs | null
  mfCompletionDate: Dayjs | null
  mfRetentionPercent: string
  mfPercentComplete: string
  mfConstructionCost: number
  mfAccStatusDate: Dayjs | null
  mfNoOfUnits: number
  mfRemarks: string
  mfSpecialApproval: string
  mfManagedBy: string
  mfBackupUser: string
  mfAdditionalRetentionPercent: string
  mfTotalRetentionPercent: string
  mfRetentionEffectiveDate: Dayjs | null
  mfManagementExpenses: string
  mfMarketingExpenses: string
  mfTeamLeadName: string
  mfRelationshipManagerName: string
  mfAssestRelshipManagerName: string
  mfRealEstateBrokerExp: number
  mfAdvertisementExp: number
  mfLandOwnerName: string

  // New fields from table specifications
  unitReferenceNumber?: string
  unitNumber?: string
  unitStatus?: string
  towerBuildingName?: string
  unitPlotSize?: string
  propertyId?: string
  unitIban?: string
  unitRegistrationFee?: string
  nameOfAgent?: string
  agentNationalId?: string
  grossSalePrice?: string
  salePrice?: string
  vatApplicable?: boolean
  deedNumber?: string
  agreementNumber?: string
  agreementDate?: Dayjs | null
  salePurchaseAgreement?: boolean
  projectPaymentPlan?: boolean
  paymentPlanSelection?: string
  worldCheck?: string
  amountPaidToDeveloperWithinEscrow?: string
  amountPaidToDeveloperOutOfEscrow?: string
  totalAmountPaid?: string
  reservationBookingForm?: boolean
  unitAreaSize?: string
  forfeitAmount?: string
  refundAmount?: string
  transferredAmount?: string
  additionalRemarks?: string

  // DTO objects matching API structure exactly
  assetRegisterDTO: {
    id: number
    arCifrera?: string
    arName?: string
    arMasterName?: string
  }
  mfStatusDTO: {
    id: number
  }
  mfTypeDTO: {
    id: number
  }
  mfAccountStatusDTO: {
    id: number
  }
  mfConstructionCostCurrencyDTO: {
    id: number
  }
  mfBlockPaymentTypeDTO: {
    id: number
  }

  // Additional fields
  status: string | null
}

export interface AccountData {
  id?: number | null
  trustAccountNumber: string
  ibanNumber: string
  dateOpened: Dayjs | null
  accountTitle: string
  currency: string
}

export interface FeeData {
  id?: string
  feeType: string
  frequency: string
  debitAmount: string
  feeToBeCollected: string
  nextRecoveryDate: Dayjs | string | null
  feePercentage: string
  amount: string
  vatPercentage: string
  currency: string
  debitAccount: string
  enabled?: boolean
  deleted?: boolean
  display?: {
    feeType: string
    frequency: string
    currency: string
    debitAccount: string
  }
}

export interface BeneficiaryData {
  id: string
  beneficiaryId: string
  beneficiaryType: string
  name: string
  bankName: string
  swiftCode: string
  routingCode: string
  accountNumber: string
  // Normalized aliases to support legacy mf-prefixed fields
  mfBeneficiaryId?: string
  mfBeneficiaryType?: string
  mfName?: string
  mfBankName?: string
  mfSwiftCode?: string
  mfRoutingCode?: string
  mfAccountNumber?: string
}

export interface PaymentPlanData {
  id?: number // Add ID for existing payment plans
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
  mfId: any
  mfId: any
  mfName: any
  mfLocation: any
  mfReraNumber: any
  mfStartDate: any
  mfCompletionDate: any
  mfRegistrationDate: any
  mfAccoutStatusDate: any
  mfConstructionCost: any
  mfNoOfUnits: any
  mfRemarks: any
  mfSpecialApproval: any
  mfManagedBy: any
  mfTeamLeadName: any
  mfRelationshipManagerName: any
  mfAssestRelshipManagerName: any
  mfLandOwnerName: any
  mfRetentionPercent: any
  mfAdditionalRetentionPercent: any
  mfTotalRetentionPercent: any
  mfRetentionEffectiveDate: any
  mfManagementExpenses: any
  mfMarketingExpenses: any
  mfRealEstateBrokerExp: any
  mfAdvertisementExp: any
  mfPercentComplete: any
  // Step 2: Documents (NEW)
  documents?: DocumentItem[]

  // Step 3: Account Details
  accounts: AccountData[]

  // Step 4: Fee Details
  fees: FeeData[]

  // Step 5: Beneficiary Details
  beneficiaries: BeneficiaryData[]

  // Step 6: Payment Plan
  paymentPlan: PaymentPlanData[]

  // Step 7: Financial (extensive financial data)
  financialData: FinancialData

  // Step 8: Project Closure
  closureData: {
    totalIncomeFund: string
    totalPayment: string
  }
}

// Import DocumentItem type
import { DocumentItem } from '../DeveloperStepper/developerTypes'
