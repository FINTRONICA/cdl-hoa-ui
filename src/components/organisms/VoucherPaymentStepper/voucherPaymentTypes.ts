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

export interface ProjectData extends ProjectDetailsData {
  // Step 2: Account Details
  accounts: AccountData[]

  // Step 3: Fee Details
  fees: FeeData[]

  // Step 4: Beneficiary Details
  beneficiaries: BeneficiaryData[]

  // Step 5: Payment Plan
  paymentPlan: PaymentPlanData[]

  // Step 6: Financial (extensive financial data)
  financialData: FinancialData
} 



// export interface VoucherAndBudgetDetails {
//   // Voucher Details
//   voucherNumber: string; // System Generated
//   developerManagementCompanyName: string; // Dropdown
//   propertyName: string; // Non-Editable
//   projectAccountStatus: string; // Auto-Populate
//   escrowAccountNo: string; // Auto-Populate
//   reserveAccountNo: string; // Auto-Populate
//   currentBalanceInEscrow: number; // Auto-Populate
//   currentBalanceInReserve: number; // Auto-Populate
//   reraApprovalRefNo?: string; // Optional, Alphanumeric(17,2)
//   reraApprovalDate?: Date; // Optional
//   partialPayment: "Yes" | "No"; // Radio Button
//   invoiceRefNo: string; // Alphanumeric (15,0)
//   invoiceValue: number; // Numeric (17,2)
//   invoiceCurrencyType?: string; // Dropdown
//   invoiceDate: Date; // Default current date
//   rt03?: string; // Optional, Alphanumeric (20,2)
//   totalEligibleAmountInvoice?: number; // Optional, Numeric (20,2)
//   amountPaidAgainstInvoice?: number; // Optional, Numeric (15,0)
//   capExceeded?: boolean; // Checkbox
//   totalAmountPaidPaymentType?: number; // Optional, Numeric (20,2)
//   paymentCurrency?: string; // Optional
//   debitFromEscrowAED?: number; // Optional, Numeric (20,2)
//   currentEligibleAmount?: number; // Optional, Numeric (20,2)
//   debitFromReserveAED?: number; // Optional, Numeric (20,2)
//   totalPayoutAmount?: number; // Optional, Numeric (20,2)
//   amountInTransit?: number; // Optional, Numeric (20,2)

//   // Budget Details
//   budgetYear?: string; // Dropdown
//   category?: string; // Dropdown
//   subcategory?: string; // Dropdown
//   categoryCode?: string; // Auto-Populate
//   subcategoryCode?: string; // Auto-Populate
//   serviceName?: string; // Dropdown
//   serviceCode?: string; // Auto-Populate
//   provisionalBudget?: boolean; // Checkbox
//   provisionalBudgetCode?: string; // Auto-Populate
//   availableBudgetAmount?: number; // Auto-Populate
//   utilizedBudgetAmount?: number; // Auto-Populate
//   invoiceAmount?: number; // Auto-Populate
//   reraException?: boolean; // Checkbox

//   // Beneficiary Details
//   beneficiaryAccountNumber?: string; // Auto-Populate
//   beneficiaryName?: string; // Auto-Populate
//   beneficiaryBank?: string; // Auto-Populate
//   beneficiarySwift?: string; // Auto-Populate
//   beneficiaryRoutingCode?: string; // Auto-Populate
//   beneficiaryAccountNoOrIban?: string; // Auto-Populate
//   transferType: "TR" | "TT" | "MC"; // Mandatory Dropdown
//   routingSortCode: string; // Alphanumeric(20,0)
// }
