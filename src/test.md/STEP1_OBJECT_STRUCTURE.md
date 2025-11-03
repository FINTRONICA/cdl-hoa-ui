# Step1 Object Structure Documentation

This document provides a comprehensive overview of the object structure used in Manual Payment Step1 component.

**Last Updated:** Based on the new field structure implemented in Step1.tsx

---

## Quick Reference

### Files Updated:
- ✅ `src/components/organisms/ManualPaymentStepper/manualPaymentTypes.ts` - Updated TypeScript interfaces
- ✅ `src/components/organisms/ManualPaymentStepper/index.tsx` - Default values object
- ✅ `src/lib/validation/manualPaymentSchemas.ts` - Zod validation schema
- ✅ `src/components/organisms/ManualPaymentStepper/steps/Step1.tsx` - Form fields using this structure

---

## Simple Object for Step1 (Copy-Paste Ready)

Use this object structure directly in your code:

```typescript
// Complete Step1 Object Structure
const step1FormObject = {
  // ========== Basic Information ==========
  vaucherReferenceNumber: '',
  assetRegisterName: '',
  managementFirmName: '',
  managementFirmAccountStatus: null,
  
  // ========== Account Balances ==========
  escrowAccount: '',
  subConstructionAccount: '',
  retentionAccount: '',
  
  // ========== Payment Type ==========
  paymentType: '',
  paymentSubType: null,
  
  // ========== HOA Approval ==========
  hoaApprovalNumber: '',
  hoaApprovalDate: null,
  
  // ========== Invoice Details ==========
  invoiceRef: '',
  invoiceCurrency: '',
  invoiceValue: '',
  invoiceDate: null,
  
  // ========== Checkboxes ==========
  specialRate: false,
  corporateAmount: false,
  
  // ========== RT03 ==========
  RT03: '',
  
  // ========== Amount Details ==========
  totalEligibleAmount: '',
  amountPaid: '',
  capExceeded: false,
  totalAmountPaid: '',
  paymentCurrency: '',
  debitCreditToEscrow: '',
  currentEligibleAmount: '',
  debitFromRetention: '',
  totalPayoutAmount: '',
  amountInTransit: '',
  
  // ========== Budget Details - Dropdowns ==========
  budgetYear: '',
  budgetCategory: '',
  budgetSubCategory: '',
  budgetServiceName: '',
  
  // ========== Budget Details - Checkboxes ==========
  provisionalBudget: false,
  HOAExemption: false,
  
  // ========== Budget Details - Auto-populate ==========
  categoryCode: '',
  categoryName: '',
  subCategoryCode: '',
  subCategoryName: '',
  serviceCode: '',
  serviceName: '',
  provisionalBudgetCode: '',
  provisionalBudgetName: '',
  availableBudgetAmount: '',
  utilizedBudgetAmount: '',
  invoiceBudgetAmount: '',
  
  // ========== Beneficiary Details (Nested Objects) ==========
  voucherDTO: {
    benVoucher: '',
    benVoucherName: '',
    benVoucherSwiftCode: '',
    benVoucherRoutingCode: '',
    benVoucherAccountNumber: '',
  },
  
  buildPartnerDTO: {
    bpName: '',
  },
  
  // ========== Transaction Type and Routing ==========
  engineerFeePayment: '',
  routinfSortcode: '',
  
  // ========== Narration ==========
  narration1: '',
  narration2: '',
  remarks: '',
}
```

**Usage Example:**
```typescript
// In Step1.tsx or any component
const formValues = watch() // Get all form values
const step1Data: ManualPaymentStep1Fields = formValues as ManualPaymentStep1Fields

// Or initialize with default values
const initialStep1Data: ManualPaymentStep1Fields = step1FormObject
```

---

## TypeScript Interfaces

### Core Interfaces

#### `ManualPaymentStep1Fields`
Complete interface for all Step1 form fields including new fields.

#### `VoucherDTO`
Interface for beneficiary voucher details (nested object).

#### `BuildPartnerDTO`
Interface for build partner bank name details (nested object).

#### `ProjectData`
Main interface that extends `ProjectDetailsData` and `ManualPaymentStep1Fields`, used by the form.

---

## Complete Object Structure

### Step1 Default Values Object

This is the object structure used to initialize the form in `ManualPaymentStepper/index.tsx`:

```typescript
const step1DefaultValues = {
  // ============================================
  // NEW FIELDS - Primary Structure
  // ============================================
  
  // Basic Information
  vaucherReferenceNumber: '',
  assetRegisterName: '',
  managementFirmName: '',
  managementFirmAccountStatus: null,
  
  // Account Balances
  escrowAccount: '',
  subConstructionAccount: '',
  retentionAccount: '',
  
  // Payment Type
  paymentType: '',
  paymentSubType: null,
  
  // HOA Approval
  hoaApprovalNumber: '',
  hoaApprovalDate: null,
  
  // Invoice Details
  invoiceRef: '',
  invoiceCurrency: '',
  invoiceValue: '',
  invoiceDate: null,
  
  // Checkboxes
  specialRate: false,
  corporateAmount: false,
  
  // RT03
  RT03: '',
  
  // Amount Details
  totalEligibleAmount: '',
  amountPaid: '',
  capExceeded: false,
  totalAmountPaid: '',
  paymentCurrency: '',
  debitCreditToEscrow: '',
  currentEligibleAmount: '',
  debitFromRetention: '',
  totalPayoutAmount: '',
  amountInTransit: '',
  
  // Budget Details - Dropdowns
  budgetYear: '',
  budgetCategory: '',
  budgetSubCategory: '',
  budgetServiceName: '',
  
  // Budget Details - Checkboxes
  provisionalBudget: false,
  HOAExemption: false,
  
  // Budget Details - Auto-populate Fields
  categoryCode: '',
  categoryName: '',
  subCategoryCode: '',
  subCategoryName: '',
  serviceCode: '',
  serviceName: '',
  provisionalBudgetCode: '',
  provisionalBudgetName: '',
  availableBudgetAmount: '',
  utilizedBudgetAmount: '',
  invoiceBudgetAmount: '',
  
  // Beneficiary Details - Nested Objects
  voucherDTO: {
    benVoucher: '',
    benVoucherName: '',
    benVoucherSwiftCode: '',
    benVoucherRoutingCode: '',
    benVoucherAccountNumber: '',
  },
  
  buildPartnerDTO: {
    bpName: '',
  },
  
  // Transaction Type and Routing
  engineerFeePayment: '',
  routinfSortcode: '',
  
  // Narration
  narration1: '',
  narration2: '',
  remarks: '',
  
  // ============================================
  // OLD FIELDS - Kept for Backward Compatibility
  // ============================================
  sectionId: '',
  developerId: '',
  developerName: '',
  masterDeveloperName: '',
  projectName: '',
  projectLocation: '',
  projectAccountCif: '',
  projectStatus: '',
  projectAccountStatusDate: null,
  projectRegistrationDate: null,
  projectStartDate: null,
  projectCompletionDate: null,
  retention: '5.00',
  additionalRetention: '8.00',
  totalRetention: '13.00',
  retentionEffectiveStartDate: dayjs('2022-03-31'),
  projectManagementExpenses: '5.00',
  marketingExpenses: '10.00',
  realEstateBrokerExpense: '',
  advertisingExpense: '',
  landOwnerName: '',
  projectCompletionPercentage: '',
  currency: 'AED',
  actualConstructionCost: '',
  noOfUnits: '12',
  specialApproval: '',
  managedBy: 'erm_checker1,erm_checker1,erm_checker1',
  backupRef: 'Master ENBD_robust_maker1',
  relationshipManager: '',
  assistantRelationshipManager: '',
  teamLeaderName: '',
  
  // Unit Cancellation Fields (Optional)
  unitNo: null,
  towerName: null,
  unitStatus: null,
  amountReceived: null,
  Forfeit: false,
  Refundtounitholder: false,
  Transfertootherunit: false,
  forfeitAmount: null,
  regulatorApprovalRef: null,
  paymentDate: null,
  
  // Additional Payment Fields
  bankCharges: '',
  paymentMode: '',
  uploadDocuments: null,
  engineerFeePayment1: null,
  uploadDocuments1: null,
  EngineerFeePaymentNeeded: false,
  EngineerFeesPayment: null,
  engineerFeePayment2: null,
  uploadDocuments2: '',
  'reviewNote*': false,
  
  // Step 3-7: Additional Steps Data
  accounts: [
    {
      trustAccountNumber: '',
      ibanNumber: '',
      dateOpened: null,
      accountTitle: '',
      currency: 'AED',
    },
  ],
  
  fees: [
    {
      feeType: '',
      frequency: '',
      debitAmount: '',
      feeToBeCollected: '',
      nextRecoveryDate: null,
      feePercentage: '',
      amount: '',
      vatPercentage: '',
    },
  ],
  
  beneficiaries: [
    {
      id: '',
      expenseType: '',
      transferType: '',
      name: '',
      bankName: '',
      swiftCode: '',
      routingCode: '',
      account: '',
    },
  ],
  
  paymentPlan: [
    {
      installmentNumber: 1,
      installmentPercentage: '',
      projectCompletionPercentage: '',
    },
  ],
  
  financialData: {
    projectEstimatedCost: '',
    actualCost: '',
    projectBudget: '',
  },
}
```

---

## Field Categories

### 1. Basic Information Fields (New)
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `vaucherReferenceNumber` | `string` | ✅ Yes | Voucher Reference Number (auto-generated) |
| `assetRegisterName` | `string \| number` | ✅ Yes | Asset Register Name (dropdown - Real Estate Asset ID) |
| `managementFirmName` | `string` | ✅ Yes | Management Firm Name (text input, max 100 chars) |
| `managementFirmAccountStatus` | `string \| number \| null` | ❌ Optional | Management Firm Account Status (dropdown) |

### 2. Account Balance Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `escrowAccount` | `string` | ✅ Yes | Escrow Account Number |
| `subConstructionAccount` | `string \| null` | ❌ Optional | Sub Construction Account Balance (auto-filled) |
| `retentionAccount` | `string \| null` | ❌ Optional | Retention Account Balance (auto-filled) |

### 3. Payment Type Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `paymentType` | `string \| number` | ✅ Yes | Payment Type (dropdown) |
| `paymentSubType` | `string \| number \| null` | ❌ Optional | Payment Sub-Type (dropdown) |

### 4. HOA Approval Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `hoaApprovalNumber` | `string` | ✅ Yes | HOA Approval Number (max 50 chars) |
| `hoaApprovalDate` | `Dayjs \| Date \| string \| null` | ✅ Yes | HOA Approval Date (date picker) |

### 5. Invoice Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `invoiceRef` | `string` | ✅ Yes | Invoice Reference Number (max 15 chars) |
| `invoiceCurrency` | `string \| number` | ✅ Yes | Invoice Currency (dropdown) |
| `invoiceValue` | `string` | ✅ Yes | Invoice Total Value (max 15 chars) |
| `invoiceDate` | `Dayjs \| Date \| string \| null` | ❌ Optional | Invoice Date (date picker) |

### 6. Amount Details Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `specialRate` | `boolean \| null` | ❌ Optional | Special Rate checkbox |
| `corporateAmount` | `boolean \| null` | ❌ Optional | Corporate Amount checkbox |
| `RT03` | `string` | ✅ Yes | RT03 field (max 50 chars) |
| `totalEligibleAmount` | `string \| null` | ❌ Optional | Total Eligible Amount |
| `amountPaid` | `string \| null` | ❌ Optional | Amount Paid against Invoice |
| `capExceeded` | `boolean \| null` | ❌ Optional | Capital Limit Exceeded checkbox |
| `totalAmountPaid` | `string \| null` | ❌ Optional | Total Amount Paid |
| `paymentCurrency` | `string \| number` | ✅ Yes | Payment Currency (dropdown) |
| `debitCreditToEscrow` | `string \| null` | ❌ Optional | Escrow Account Debit/Credit |
| `currentEligibleAmount` | `string \| null` | ❌ Optional | Current Eligible Amount |
| `debitFromRetention` | `string \| null` | ❌ Optional | Retention Account Debit Amount |
| `totalPayoutAmount` | `string \| null` | ❌ Optional | Total Disbursement Amount |
| `amountInTransit` | `string \| null` | ❌ Optional | Amount in Transit |

### 7. Budget Details Fields

#### Budget Dropdown Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `budgetYear` | `string \| number` | ✅ Yes | Budget Year (dropdown) |
| `budgetCategory` | `string \| number` | ✅ Yes | Budget Category (dropdown) |
| `budgetSubCategory` | `string \| number` | ✅ Yes | Budget Sub Category (dropdown) |
| `budgetServiceName` | `string \| number` | ✅ Yes | Budget Service Name (dropdown) |

#### Budget Checkbox Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `provisionalBudget` | `boolean \| null` | ❌ Optional | Provisional Budget checkbox |
| `HOAExemption` | `boolean \| null` | ❌ Optional | HOA Exemption checkbox |

#### Budget Auto-populate Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `categoryCode` | `string` | ✅ Yes | Category Code (max 50 chars) |
| `categoryName` | `string \| null` | ❌ Optional | Category Name (auto-filled, read-only) |
| `subCategoryCode` | `string` | ✅ Yes | Sub Category Code (max 50 chars) |
| `subCategoryName` | `string \| null` | ❌ Optional | Sub Category Name (auto-filled, read-only) |
| `serviceCode` | `string` | ✅ Yes | Service Code (max 50 chars) |
| `serviceName` | `string \| null` | ❌ Optional | Service Name (auto-filled, read-only) |
| `provisionalBudgetCode` | `string` | ✅ Yes | Provisional Budget Code (max 50 chars) |
| `provisionalBudgetName` | `string \| null` | ❌ Optional | Provisional Budget Name (auto-filled, read-only) |
| `availableBudgetAmount` | `string \| null` | ❌ Optional | Available Budget Amount |
| `utilizedBudgetAmount` | `string \| null` | ❌ Optional | Utilized Budget Amount |
| `invoiceBudgetAmount` | `string \| null` | ❌ Optional | Invoice Budget Amount |

### 8. Beneficiary Details Fields (Nested Objects)

#### `voucherDTO` Object
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `benVoucher` | `string \| number` | ✅ Yes | Beneficiary Account (dropdown) |
| `benVoucherName` | `string \| null` | ❌ Optional | Beneficiary Name (auto-filled, read-only) |
| `benVoucherSwiftCode` | `string \| null` | ❌ Optional | Beneficiary Swift Code (auto-filled, read-only) |
| `benVoucherRoutingCode` | `string \| null` | ❌ Optional | Beneficiary Routing Code (auto-filled, read-only) |
| `benVoucherAccountNumber` | `string \| null` | ❌ Optional | Beneficiary Account Number/IBAN (auto-filled, read-only) |

#### `buildPartnerDTO` Object
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `bpName` | `string \| null` | ❌ Optional | Beneficiary Bank Name (auto-filled, read-only) |

### 9. Transaction Type and Routing
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `engineerFeePayment` | `string \| number` | ✅ Yes | Transaction Type (dropdown) |
| `routinfSortcode` | `string` | ✅ Yes | Routing Sort Code (max 50 chars) |

### 10. Narration Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `narration1` | `string \| null` | ❌ Optional | Payment Narration 1 (max 50 chars, alphanumeric only) |
| `narration2` | `string \| null` | ❌ Optional | Payment Narration 2 (max 50 chars, alphanumeric only) |
| `remarks` | `string \| null` | ❌ Optional | Remarks (max 30 chars) |

---

## Nested Object Structure

### Complete Object Example

```typescript
const step1FormData: ManualPaymentStep1Fields = {
  // Basic Information
  vaucherReferenceNumber: 'PAY-2024-001',
  assetRegisterName: '123', // ID from dropdown
  managementFirmName: 'ABC Management Firm',
  managementFirmAccountStatus: '45', // ID from dropdown
  
  // Account Balances
  escrowAccount: 'ACC123456',
  subConstructionAccount: 'AED 100,000.00',
  retentionAccount: 'AED 50,000.00',
  
  // Payment Type
  paymentType: '10', // ID from dropdown
  paymentSubType: '20', // ID from dropdown
  
  // HOA Approval
  hoaApprovalNumber: 'HOA-2024-001',
  hoaApprovalDate: dayjs('2024-01-15'),
  
  // Invoice
  invoiceRef: 'INV-001',
  invoiceCurrency: '5', // ID from dropdown
  invoiceValue: '50000',
  invoiceDate: dayjs('2024-01-10'),
  
  // Checkboxes
  specialRate: false,
  corporateAmount: false,
  
  // RT03
  RT03: 'RT03-12345',
  
  // Amount Details
  totalEligibleAmount: '50000',
  amountPaid: '45000',
  capExceeded: false,
  totalAmountPaid: '45000',
  paymentCurrency: '5', // ID from dropdown
  debitCreditToEscrow: '45000',
  currentEligibleAmount: '5000',
  debitFromRetention: '0',
  totalPayoutAmount: '45000',
  amountInTransit: '0',
  
  // Budget Details - Dropdowns
  budgetYear: '2024',
  budgetCategory: '100',
  budgetSubCategory: '200',
  budgetServiceName: '300',
  
  // Budget Details - Checkboxes
  provisionalBudget: false,
  HOAExemption: true,
  
  // Budget Details - Auto-populate
  categoryCode: 'CAT001',
  categoryName: 'Maintenance',
  subCategoryCode: 'SUBCAT001',
  subCategoryName: 'Building Maintenance',
  serviceCode: 'SVC001',
  serviceName: 'Cleaning Service',
  provisionalBudgetCode: 'PROV001',
  provisionalBudgetName: 'Q1 Budget',
  availableBudgetAmount: '100000',
  utilizedBudgetAmount: '50000',
  invoiceBudgetAmount: '45000',
  
  // Beneficiary Details - Nested Objects
  voucherDTO: {
    benVoucher: 'BEN001', // Selected from dropdown
    benVoucherName: 'ABC Company Ltd',
    benVoucherSwiftCode: 'SWIFT001',
    benVoucherRoutingCode: 'ROUT001',
    benVoucherAccountNumber: 'ACC123456789',
  },
  
  buildPartnerDTO: {
    bpName: 'First National Bank',
  },
  
  // Transaction Type and Routing
  engineerFeePayment: 'TT', // Transaction Type
  routinfSortcode: 'ROUTING001',
  
  // Narration
  narration1: 'Payment for maintenance services',
  narration2: 'Approved by HOA',
  remarks: 'On time payment',
}
```

---

## TypeScript Interface Definitions

### Complete Interface Structure

```typescript
// Beneficiary Voucher DTO
export interface VoucherDTO {
  benVoucher: string | number          // Required
  benVoucherName?: string | null       // Optional, auto-filled
  benVoucherSwiftCode?: string | null // Optional, auto-filled
  benVoucherRoutingCode?: string | null // Optional, auto-filled
  benVoucherAccountNumber?: string | null // Optional, auto-filled
}

// Build Partner DTO (for bank name)
export interface BuildPartnerDTO {
  bpName?: string | null // Optional, auto-filled
}

// Main Step1 Fields Interface
export interface ManualPaymentStep1Fields {
  // Basic Information
  vaucherReferenceNumber: string
  assetRegisterName: string | number
  managementFirmName: string
  managementFirmAccountStatus?: string | number | null
  
  // Account Balances
  escrowAccount: string
  subConstructionAccount?: string | null
  retentionAccount?: string | null
  
  // Payment Type
  paymentType: string | number
  paymentSubType?: string | number | null
  
  // HOA Approval
  hoaApprovalNumber: string
  hoaApprovalDate: Dayjs | Date | string | null
  
  // Invoice
  invoiceRef: string
  invoiceCurrency: string | number
  invoiceValue: string
  invoiceDate?: Dayjs | Date | string | null
  
  // Checkboxes
  specialRate?: boolean | null
  corporateAmount?: boolean | null
  
  // RT03
  RT03: string
  
  // Amount Details
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
  
  // Budget Details
  budgetYear: string | number
  budgetCategory: string | number
  budgetSubCategory: string | number
  budgetServiceName: string | number
  provisionalBudget?: boolean | null
  HOAExemption?: boolean | null
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
  voucherDTO: VoucherDTO              // Required object
  buildPartnerDTO?: BuildPartnerDTO | null // Optional object
  
  // Transaction Type and Routing
  engineerFeePayment: string | number
  routinfSortcode: string
  
  // Narration
  narration1?: string | null
  narration2?: string | null
  remarks?: string | null
  
  // ... other optional fields
}
```

---

## Field Usage by Component

### Fields Rendered in Step1.tsx

1. **Basic Fields Section:**
   - `vaucherReferenceNumber` → `renderPaymentRefIdField`
   - `assetRegisterName` → `renderSelectField`
   - `managementFirmName` → `renderTextField`
   - `managementFirmAccountStatus` → `renderSelectField`

2. **Account Balance Fields:**
   - `escrowAccount` + `subConstructionAccount` → `renderAccountBalanceField`
   - `corporateAccount2` + `retentionAccount2` → `renderAccountBalanceField`

3. **Payment Type Section:**
   - `paymentType` → `renderSelectField`
   - `paymentSubType` → `renderSelectField`
   - `hoaApprovalNumber` → `renderTextField`
   - `hoaApprovalDate` → `renderDatePickerField`

4. **Invoice Section:**
   - `invoiceRef` → `renderTextField`
   - `invoiceCurrency` → `renderSelectField`
   - `invoiceValue` → `renderTextField`
   - `invoiceDate` → `renderDatePickerField`

5. **Amount Details Section:**
   - `specialRate` → `renderCheckboxField`
   - `corporateAmount` → `renderCheckboxField`
   - `RT03` → `renderTextField`
   - `totalEligibleAmount` → `renderTextField`
   - `amountPaid` → `renderTextField`
   - `capExceeded` → `renderCheckboxField`
   - `totalAmountPaid` → `renderTextField`
   - `paymentCurrency` → `renderSelectField`
   - `debitCreditToEscrow` → `renderTextField`
   - `currentEligibleAmount` → `renderTextField`
   - `debitFromRetention` → `renderTextField`
   - `totalPayoutAmount` → `renderTextField`
   - `amountInTransit` → `renderTextField`

6. **Budget Details Section:**
   - Dropdowns: `budgetYear`, `budgetCategory`, `budgetSubCategory`, `budgetServiceName`
   - Checkboxes: `provisionalBudget`, `HOAExemption`
   - Auto-populate pairs: All budget code/name fields via `renderAccountBalanceField`

7. **Beneficiary Details Section:**
   - `voucherDTO.benVoucher` → Custom `Controller` (currently commented out)
   - `voucherDTO.benVoucherName` → Custom `Controller` (read-only, auto-filled)
   - `buildPartnerDTO.bpName` → Custom `Controller` (read-only, auto-filled)
   - `voucherDTO.benVoucherSwiftCode` → Custom `Controller` (read-only, auto-filled)
   - `voucherDTO.benVoucherRoutingCode` → Custom `Controller` (read-only, auto-filled)
   - `voucherDTO.benVoucherAccountNumber` → Custom `Controller` (read-only, auto-filled)
   - `engineerFeePayment` → `renderSelectField` (Transaction Type)
   - `routinfSortcode` → `renderTextField`

---

## Validation Schema Reference

The validation schema is defined in `src/lib/validation/manualPaymentSchemas.ts`:

- **Schema Name:** `manualPaymentStep1Schema`
- **Type Export:** `ManualPaymentStep1Data` (inferred from Zod schema)

All field validations are enforced through this Zod schema, including:
- Required field validation
- Max length constraints
- Type coercion (boolean, number, date)
- Nested object validation for `voucherDTO` and `buildPartnerDTO`

---

## TypeScript Interface Changes Summary

### ✅ Interfaces Updated:

1. **`ManualPaymentStep1Fields`** - NEW interface containing all Step1 fields
   - Includes all new fields: `vaucherReferenceNumber`, `assetRegisterName`, `managementFirmName`, etc.
   - Includes nested objects: `voucherDTO`, `buildPartnerDTO`
   - Includes budget fields, beneficiary fields, and all amount fields

2. **`VoucherDTO`** - NEW interface for beneficiary voucher details
   ```typescript
   export interface VoucherDTO {
     benVoucher: string | number       // Required
     benVoucherName?: string | null
     benVoucherSwiftCode?: string | null
     benVoucherRoutingCode?: string | null
     benVoucherAccountNumber?: string | null
   }
   ```

3. **`BuildPartnerDTO`** - NEW interface for build partner bank name
   ```typescript
   export interface BuildPartnerDTO {
     bpName?: string | null
   }
   ```

4. **`ProjectData`** - UPDATED to include all Step1 fields
   - Changed from `interface` to `type` using intersection type
   - Uses `Omit<ProjectDetailsData, 'paymentType' | 'remarks'>` to avoid conflicts
   - Extends `ManualPaymentStep1Fields` for all Step1 fields
   ```typescript
   export type ProjectData = Omit<ProjectDetailsData, 'paymentType' | 'remarks'> 
     & ManualPaymentStep1Fields 
     & {
       documents?: DocumentItem[]
       accounts: AccountData[]
       fees: FeeData[]
       beneficiaries: BeneficiaryData[]
       paymentPlan: PaymentPlanData[]
       financialData: FinancialData
     }
   ```

### Field Type Conflicts Resolved:
- `paymentType`: `ProjectDetailsData` has `string`, `ManualPaymentStep1Fields` has `string | number` → `ManualPaymentStep1Fields` takes precedence
- `remarks`: `ProjectDetailsData` has `string`, `ManualPaymentStep1Fields` has `string | null` → `ManualPaymentStep1Fields` takes precedence

---

## Complete Object Example with Real Values

### Full Step1 Object Structure

```typescript
const step1CompleteObject: ManualPaymentStep1Fields = {
  // ============================================
  // SECTION 1: Basic Information
  // ============================================
  vaucherReferenceNumber: 'PAY-2024-001',
  assetRegisterName: 123, // Real Estate Asset ID
  managementFirmName: 'ABC Management Firm LLC',
  managementFirmAccountStatus: 45, // Account Status ID
  
  // ============================================
  // SECTION 2: Account Balances
  // ============================================
  escrowAccount: 'ACC-ESCROW-123456',
  subConstructionAccount: 'AED 1,000,000.00', // Auto-filled
  retentionAccount: 'AED 500,000.00', // Auto-filled
  
  // ============================================
  // SECTION 3: Payment Type
  // ============================================
  paymentType: 10, // Payment Type ID
  paymentSubType: 20, // Payment Sub-Type ID
  
  // ============================================
  // SECTION 4: HOA Approval
  // ============================================
  hoaApprovalNumber: 'HOA-APPROVAL-2024-001',
  hoaApprovalDate: dayjs('2024-01-15'),
  
  // ============================================
  // SECTION 5: Invoice Details
  // ============================================
  invoiceRef: 'INV-2024-001',
  invoiceCurrency: 5, // Currency ID (AED)
  invoiceValue: '50000',
  invoiceDate: dayjs('2024-01-10'),
  
  // ============================================
  // SECTION 6: Amount Details
  // ============================================
  specialRate: false,
  corporateAmount: false,
  RT03: 'RT03-12345',
  totalEligibleAmount: '50000',
  amountPaid: '45000',
  capExceeded: false,
  totalAmountPaid: '45000',
  paymentCurrency: 5, // Currency ID (AED)
  debitCreditToEscrow: '45000',
  currentEligibleAmount: '5000',
  debitFromRetention: '0',
  totalPayoutAmount: '45000',
  amountInTransit: '0',
  
  // ============================================
  // SECTION 7: Budget Details
  // ============================================
  // Budget Dropdowns
  budgetYear: '2024',
  budgetCategory: 100,
  budgetSubCategory: 200,
  budgetServiceName: 300,
  
  // Budget Checkboxes
  provisionalBudget: false,
  HOAExemption: true,
  
  // Budget Auto-populate Fields
  categoryCode: 'CAT001',
  categoryName: 'Maintenance Category',
  subCategoryCode: 'SUBCAT001',
  subCategoryName: 'Building Maintenance',
  serviceCode: 'SVC001',
  serviceName: 'Cleaning Service',
  provisionalBudgetCode: 'PROV001',
  provisionalBudgetName: 'Q1 Provisional Budget',
  availableBudgetAmount: '100000',
  utilizedBudgetAmount: '50000',
  invoiceBudgetAmount: '45000',
  
  // ============================================
  // SECTION 8: Beneficiary Details (Nested Objects)
  // ============================================
  voucherDTO: {
    benVoucher: 'BEN-ACCOUNT-001',
    benVoucherName: 'ABC Company Ltd',
    benVoucherSwiftCode: 'SWIFTCODE001',
    benVoucherRoutingCode: 'ROUTING001',
    benVoucherAccountNumber: 'ACC123456789',
  },
  
  buildPartnerDTO: {
    bpName: 'First National Bank',
  },
  
  // ============================================
  // SECTION 9: Transaction Type and Routing
  // ============================================
  engineerFeePayment: 'TT', // Transaction Type
  routinfSortcode: 'ROUTING-SORT-001',
  
  // ============================================
  // SECTION 10: Narration
  // ============================================
  narration1: 'Payment for maintenance services',
  narration2: 'Approved by HOA board',
  remarks: 'On-time payment as per agreement',
}
```

---

## Notes

1. **Nested Objects:** `voucherDTO` is a **required** object because `benVoucher` inside it is required. `buildPartnerDTO` is optional.

2. **Auto-populated Fields:** Many fields are auto-filled when related fields are selected (e.g., beneficiary fields auto-fill when `benVoucher` is selected).

3. **Backward Compatibility:** Old field names (e.g., `tasReference`, `developerName`, `projectName`) are still supported in the codebase but are not used in Step1 anymore.

4. **Date Fields:** Date fields accept `Dayjs` objects, `Date` objects, or ISO strings.

5. **Dropdown Fields:** Dropdown fields accept either string IDs or numeric IDs from the backend.

6. **Type Safety:** The `ProjectData` type now uses intersection types to properly combine `ProjectDetailsData` and `ManualPaymentStep1Fields` without conflicts.

7. **Default Values:** All fields have default values defined in `ManualPaymentStepper/index.tsx` `defaultValues` object.

