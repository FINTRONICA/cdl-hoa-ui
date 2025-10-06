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

// export interface ChargeDetails {
//   chargeTypeId: number; // Mandatory, Numeric (10,0)
//   chargeType: string; // Mandatory, Alphanumeric (50,0)
//   groupName: string; // Mandatory, Alphanumeric (50,0)
//   categoryCode: string; // Mandatory, All Characters (50,0)
//   categoryName: string; // Mandatory, Alphanumeric (50,0)
//   categorySubCode: string; // Mandatory, All Characters (50,0)
//   categorySubName: string; // Mandatory, Alphanumeric (50,0)
//   serviceName: string; // Mandatory, Alphanumeric (50,0)
//   serviceCode: string; // Mandatory, All Characters (50,0)
//   provisionalBudgetCode: string; // Mandatory, All Characters (50,0)
// }
