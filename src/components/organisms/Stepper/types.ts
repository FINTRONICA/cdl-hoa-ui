import { Dayjs } from "dayjs";

export interface PropertyDetailsData {
  propertyId: string; // AutoEscrow Text Field
  propertyReraOrDifcNumber: string; // Text Field
  typeOfEscrow: string; // Dropdown
  propertyAccountCifBank: string; // Text Field
  propertyName: string; // Text Field
  accountType: string; // Dropdown
  propertyType: string; // Dropdown
  propertyLocation: string; // Text Field
  companyNumber: string; // Text Field
  companyName: string; // Text Field
  propertyGroupId: string; // Text Field
  projectName: string; // Text Field
  projectNameArabic: string; // Text Field
  masterCommunityName: string; // Text Field
  masterCommunityNameArabic: string; // Text Field
  developerOrManagementCompanyId: string; // Dropdown
  masterDeveloperName?: string; // Text Field (If applicable)
  propertyStatus: string; // Dropdown
  propertyAccountStatus: string; // Dropdown
  propertyAccountStatusDate: Date | null; // Calendar
  propertyRegistrationDate: Date | null; // Calendar
  propertyStartDateEstimated: Date | null; // Calendar
  propertyCompletionDate: Date | null; // Calenda
  reservePercentage: number; // Text Field
  additionalReservePercentage: number; // Text Field
  totalReservePercentage: number; // Textbox
  reserveAccountEffectiveStartDate: Date | null; // Calendar
  currency: string; // Dropdown
  remarks?: string; // Textbox
  specialApproval?: string; // Textbox
  rmName: string; // Text Box
  assistantRm: string; // Text Box
  paymentTypeToBeBlocked: string; // Dropdown
  teamLeader: string; // Text Field
  accountOwnerBackup: string; // Text Field
  accountOwner: string; // Text Field
  emailNotificationsInternal: string; // Text Field
}

export interface AccountData {
  trustAccountNumber: string;
  ibanNumber: string;
  dateOpened: Dayjs | null;
  accountTitle: string;
  isInterestBearing: boolean;
}

export interface FeeData {
  feeCategory: string; // Dropdown - selected value
  frequency: string; // Dropdown - e.g., Monthly, Quarterly
  vatPercentage: number; // Text Field - assumed numeric
  corporateTax: number; // Text Field - assumed numeric
  amount: number; // Text Field - assumed numeric
  debitAccountType: string; // Dropdown - selected value
  debitAccountNumber: string; // Text Field
  feeCollectionDate: Date; // Calendar - Date Picker
  nextRecoveryDate: Date; // Calendar - Date Picker
}

export interface BeneficiaryData {
  id: string; // Text Field
  transferType: string; // Drop Down - User Selection
  name: string; // Text Field - User Input
  bankName: string; // Text Field - User Input
  routingCode: string; // Text Field - User Input
  tradeLicenseNumber: string; // Text Field - User Input
  placeOfIssue: string; // Text Field - User Input
  tradeLicenseExpiry: Date; // Calendar - Date Picker
  beneficiaryAccountIban: string; // Text Field - User Input
  beneficiarySwift: string; // Text Field - User Input
}

// export interface PaymentPlanData {
//   installmentNumber: number;
//   installmentPercentage: string;
//   projectCompletionPercentage: string;
// }

export interface FinancialData {
  // projectEstimatedCost: string
  projectActualCost: string;
  actualCost: string;
  projectBudget: string;
}

export interface PropertyData extends PropertyDetailsData {
  // Step 2: Account Details
  accounts: AccountData[];

  // Step 3: Fee Details
  fees: FeeData[];

  // Step 4: Beneficiary Details
  beneficiaries: BeneficiaryData[];

  // Step 5: Payment Plan
  // paymentPlan: PaymentPlanData[];

  // Step 6: Financial (extensive financial data)
  financialData: FinancialData;
}
