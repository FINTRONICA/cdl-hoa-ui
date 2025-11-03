import { Dayjs } from 'dayjs'

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

export interface FeeData {
  feeType: string
  frequency: string
  debitAmount: string
  feeToBeCollected: string
  nextRecoveryDate: Dayjs | null
  feePercentage: string
  amount: string
  vatPercentage: string
}

export interface BeneficiaryData {
  id: string
  expenseType: string
  transferType: string
  name: string
  bankName: string
  swiftCode: string
  routingCode: string
  account: string
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

// New interfaces for Step1 fields
export interface VoucherDTO {
  benVoucher: string | number
  benVoucherName?: string | null
  benVoucherSwiftCode?: string | null
  benVoucherRoutingCode?: string | null
  benVoucherAccountNumber?: string | null
}

export interface BuildPartnerDTO {
  bpName?: string | null
}

export interface ManualPaymentStep1Fields {
  // Basic Information Fields
  vaucherReferenceNumber: string
  assetRegisterName: string | number
  managementFirmName: string
  managementFirmAccountStatus?: string | number | null
  
  // Account Balance Fields
  escrowAccount: string
  subConstructionAccount?: string | null
  retentionAccount?: string | null
  
  // Payment Type Fields
  paymentType: string | number
  paymentSubType?: string | number | null
  
  // HOA Approval Fields
  hoaApprovalNumber: string
  hoaApprovalDate: Dayjs | Date | string | null
  
  // Invoice Fields
  invoiceRef: string
  invoiceCurrency: string | number
  invoiceValue: string
  invoiceDate?: Dayjs | Date | string | null
  
  // Checkbox Fields
  specialRate?: boolean | null
  corporateAmount?: boolean | null
  
  // RT03 Field
  RT03: string
  
  // Amount Fields
  totalEligibleAmount?: string | null
  amountPaid?: string | null
  capExceeded?: boolean | null
  totalAmountPaid?: string | null
  paymentCurrency: string | number
  debitCreditToEscrow?: string | null
  currentEligibleAmount?: string | null
  debitFromRetention?: string | null
  totalPayoutAmount?: string | null
  amountInTransit?: string | null
  
  // Budget Details Fields
  budgetYear: string | number
  budgetCategory: string | number
  budgetSubCategory: string | number
  budgetServiceName: string | number
  provisionalBudget?: boolean | null
  HOAExemption?: boolean | null
  
  // Budget Auto-populate Fields
  categoryCode: string
  categoryName?: string | null
  subCategoryCode: string
  subCategoryName?: string | null
  serviceCode: string
  serviceName?: string | null
  provisionalBudgetCode: string
  provisionalBudgetName?: string | null
  availableBudgetAmount?: string | null
  utilizedBudgetAmount?: string | null
  invoiceBudgetAmount?: string | null
  
  // Beneficiary Details - Nested Objects
  voucherDTO: VoucherDTO
  buildPartnerDTO?: BuildPartnerDTO | null
  
  // Transaction Type and Routing
  engineerFeePayment: string | number
  routinfSortcode: string
  
  // Narration Fields
  narration1?: string | null
  narration2?: string | null
  remarks?: string | null
  
  // Unit Cancellation Fields (Optional)
  unitNo?: string | null
  towerName?: string | null
  unitStatus?: string | null
  amountReceived?: number | null
  Forfeit?: boolean | null
  Refundtounitholder?: boolean | null
  Transfertootherunit?: boolean | null
  forfeitAmount?: number | null
  regulatorApprovalRef?: string | null
  paymentDate?: Dayjs | Date | string | null
  
  // Additional Payment Fields
  bankCharges?: string | number
  paymentMode?: string | number
  uploadDocuments?: number | null
  engineerFeePayment1?: Dayjs | Date | string | null
  uploadDocuments1?: number | null
  EngineerFeePaymentNeeded?: boolean | null
  EngineerFeesPayment?: number | null
  engineerFeePayment2?: number | null
  uploadDocuments2?: string | number | null
  'reviewNote*'?: boolean | null
}

// ProjectData combines ProjectDetailsData and ManualPaymentStep1Fields
// Using intersection type to handle overlapping fields (paymentType, remarks, etc.)
// The ManualPaymentStep1Fields takes precedence for Step1 form fields
export type ProjectData = Omit<ProjectDetailsData, 'paymentType' | 'remarks'> & ManualPaymentStep1Fields & {
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
}

// Import DocumentItem type
import { DocumentItem } from '../DeveloperStepper/developerTypes'
