# Manual Payment Fields Changes Documentation

## Overview
This document tracks all changes made to the Manual Payment Step1 form fields. Old fields have been hidden/removed and new fields have been added as per requirements.

## Changes Summary

### Files Modified
1. `src/constants/mappings/manualPaymentLabels.ts` - Added new field label mappings
2. `src/lib/validation/manualPaymentSchemas.ts` - Updated validation schema with new fields
3. `src/components/organisms/ManualPaymentStepper/steps/Step1.tsx` - Updated UI with new fields

---

## Old Fields Hidden/Removed

### Removed Fields:
- `tasReference` - Replaced by `vaucherReferenceNumber`
- `developerName` - Removed (old structure)
- `developerId` - Removed (old structure)
- `projectName` - Replaced by `assetRegisterName`
- `projectId` - Removed (old structure)
- `projectStatus` - Replaced by `managementFirmAccountStatus`
- `corporateAccount1` / `retentionAccount1` - Removed (old account structure)
- `paymentType1` / `paymentSubType1` - Replaced by `hoaApprovalNumber` / `hoaApprovalDate`
- `engineerApprovedAmount` - Removed
- `amountPaid1` - Removed
- `totalAmountPaid1` - Replaced by `paymentCurrency`
- `vatCapExceeded3` / `vatCapExceeded4` - Removed
- `delRefNo` / `ppcNo` - Removed
- Various unit cancellation fields (unitNo, towerName, unitStatus, etc.) - Removed
- Various payment execution fields (bankCharges, paymentMode, etc.) - Moved/reorganized

---

## New Fields Added

### 1. Basic Information Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `vaucherReferenceNumber` | PaymentRefId | Yes | Voucher Reference Number (replaces tasReference) |
| `assetRegisterName` | Select | Yes | Asset Register Name (replaces projectName) |
| `managementFirmName` | Text | Yes | Management Firm Name |
| `managementFirmAccountStatus` | Select | Yes | Management Firm Account Status (replaces projectStatus) |

### 2. Account Balance Fields (Kept/Modified)
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `escrowAccount` | AccountBalance | Yes | Escrow Account with balance fetch |
| `subConstructionAccount` | AccountBalance | Yes | Sub-Construction Account balance (read-only) |
| `retentionAccount` | AccountBalance | Yes | Retention Account with balance fetch (renamed from corporateAccount2) |
| `retentionAccount2` | AccountBalance | Yes | Retention Account balance (read-only) |

### 3. Payment Type & Approval Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `paymentType` | Select | Yes | Payment Type (kept) |
| `paymentSubType` | Select | No | Payment Sub-Type (kept) |
| `hoaApprovalNumber` | Text | Yes | HOA Approval Number (replaces paymentType1/regularApprovalRef) |
| `hoaApprovalDate` | Date | Yes | HOA Approval Date (replaces paymentSubType1/regularApprovalDate) |

### 4. Invoice Fields (Kept)
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `invoiceRef` | Text | Yes | Invoice Reference Number |
| `invoiceCurrency` | Select | Yes | Invoice Currency |
| `invoiceValue` | Text | Yes | Invoice Total Value |
| `invoiceDate` | Date | No | Invoice Date |

### 5. Amount & Eligibility Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `specialRate` | Checkbox | No | Special Exchange Rate (moved earlier) |
| `corporateAmount` | Checkbox | No | Corporate Payment (moved earlier) |
| `RT03` | Text | Yes | RT03 Reference |
| `totalEligibleAmount` | Text | Yes | Total Eligible Payment Amount |
| `amountPaid` | Text | No | Amount Paid Against Invoice |
| `capExceeded` | Checkbox | No | Capital Limit Exceeded (renamed from amountPaid1) |
| `totalAmountPaid` | Text | No | Total Paid for Payment Type |
| `paymentCurrency` | Select | Yes | Payment Currency (renamed from totalAmountPaid1) |
| `debitCreditToEscrow` | Text | No | Escrow Account Debit / Credit |
| `currentEligibleAmount` | Text | No | Current Eligible Payment Amount |
| `debitFromRetention` | Text | No | Retention Account Debit Amount |
| `totalPayoutAmount` | Text | No | Total Disbursement Amount |
| `amountInTransit` | Text | No | Amount in Transit |

### 6. Budget Details Section (NEW)
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `budgetYear` | Select | Yes | Budget Year |
| `budgetCategory` | Select | Yes | Budget Category |
| `budgetSubCategory` | Select | Yes | Budget Sub Category |
| `budgetServiceName` | Select | Yes | Budget Service Name |
| `provisionalBudget` | Checkbox | No | Provisional Budget |
| `HOAExemption` | Checkbox | No | HOA Exemption |

#### Auto-Populated Budget Fields:
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `CategoryCode` / `CategoryName` | AccountBalance | Yes | Category Code with auto-populated name |
| `SubCategoryCode` / `SubCategoryName` | AccountBalance | Yes | Sub Category Code with auto-populated name |
| `ServiceCode` / `ServiceName` | AccountBalance | Yes | Service Code with auto-populated name |
| `Provisional Budget Code` / `Provisional Budget Name` | AccountBalance | Yes | Provisional Budget Code with auto-populated name |
| `Available Budget Amount` | AccountBalance | Yes | Available Budget Amount (read-only) |
| `Utilized Budget Amount` | AccountBalance | Yes | Utilized Budget Amount (read-only) |
| `Invoice Budget Amount` | AccountBalance | Yes | Invoice Budget Amount (read-only) |

### 7. Beneficiary Details Section (NEW)
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `voucherDTO.benVoucher` | Select | Yes | Beneficiary Account (dropdown) |
| `voucherDTO.benVoucherName` | Text | Yes | Beneficiary Name (auto-filled, disabled) |
| `buildPartnerDTO.bpName` | Text | Yes | Beneficiary Bank Name (auto-filled, disabled) |
| `voucherDTO.benVoucherSwiftCode` | Text | Yes | Beneficiary Swift Code (auto-filled, disabled) |
| `voucherDTO.benVoucherRoutingCode` | Text | Yes | Beneficiary Routing Code (auto-filled, disabled) |
| `voucherDTO.benVoucherAccountNumber` | Text | Yes | Beneficiary Account Number/IBAN (auto-filled, disabled) |
| `engineerFeePayment` | Select | No | Transaction Type |
| `routinfSortcode` | Text | Yes | Routing Sort Code |

### 8. Narration Fields (Kept)
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `narration1` | Text | No | Payment Narration |
| `narration2` | Text | No | Additional Narration 1 |
| `remarks` | Text | No | Additional Narration 2 / Remarks |

---

## Field Mappings Object

```typescript
export const MANUAL_PAYMENT_FIELD_MAPPINGS = {
  // Old to New Field Mappings
  oldToNew: {
    tasReference: 'vaucherReferenceNumber',
    projectName: 'assetRegisterName',
    projectStatus: 'managementFirmAccountStatus',
    paymentType1: 'hoaApprovalNumber',
    paymentSubType1: 'hoaApprovalDate',
    totalAmountPaid1: 'paymentCurrency',
    amountPaid1: 'capExceeded',
    corporateAccount2: 'corporateAccount2', // Kept but renamed context
    retentionAccount2: 'retentionAccount2', // Kept
  },
  
  // Removed Fields (for reference)
  removed: [
    'developerName',
    'developerId',
    'projectId',
    'corporateAccount1',
    'retentionAccount1',
    'engineerApprovedAmount',
    'vatCapExceeded3',
    'vatCapExceeded4',
    'delRefNo',
    'ppcNo',
    'unitNo',
    'towerName',
    'unitStatus',
    'amountReceived',
    'Forfeit',
    'Refundtounitholder',
    'Transfertootherunit',
    'forfeitAmount',
    'regulatorApprovalRef',
    // Various payment execution fields
  ],
  
  // New Fields
  newFields: [
    'vaucherReferenceNumber',
    'assetRegisterName',
    'managementFirmName',
    'managementFirmAccountStatus',
    'hoaApprovalNumber',
    'hoaApprovalDate',
    'RT03',
    'capExceeded',
    'paymentCurrency',
    // Budget Details
    'budgetYear',
    'budgetCategory',
    'budgetSubCategory',
    'budgetServiceName',
    'provisionalBudget',
    'HOAExemption',
    'CategoryCode',
    'CategoryName',
    'SubCategoryCode',
    'SubCategoryName',
    'ServiceCode',
    'ServiceName',
    'Provisional Budget Code',
    'Provisional Budget Name',
    'Available Budget Amount',
    'Utilized Budget Amount',
    'Invoice Budget Amount',
    // Beneficiary Details
    'voucherDTO.benVoucher',
    'voucherDTO.benVoucherName',
    'buildPartnerDTO.bpName',
    'voucherDTO.benVoucherSwiftCode',
    'voucherDTO.benVoucherRoutingCode',
    'voucherDTO.benVoucherAccountNumber',
    'routinfSortcode',
  ],
}
```

---

## Label Config IDs

All new fields have been added to `MANUAL_PAYMENT_LABELS.FORM_FIELDS`:
- `VAUCHER_REFERENC_NUMBER`
- `ASSET_REGISTER_NAME`
- `MANAGEMENT_FIRM_NAME`
- `MANAGEMENT_FIRM_ACCOUNT_STATUS`
- `HOA_APPROVAL_NUMBER`
- `HOA_APPROVAL_DATE`
- `RT03`
- `BUDGET_YEAR`
- `BUDGET_CATEGORY`
- `BUDGET_SUB_CATEGORY`
- `BUDGET_SERVICE_NAME`
- `PROVISIONAL_BUDGET`
- `HOA_EXEMPTION`
- `CATEGORY_CODE`
- `SUB_CATEGORY_CODE`
- `SERVICE_CODE`
- `PROVISIONAL_BUDGET_CODE`
- `AVAILABLE_BUDGET_AMOUNT`
- `UTILIZED_BUDGET_AMOUNT`
- `INVOICE_BUDGET_AMOUNT`
- `ROUTINF_SORTCODE`
- `BEN_VOUCHER_ACCOUNT`
- `BEN_VOUCHER_NAME`
- `BEN_VOUCHER_BANK_NAME`
- `BEN_VOUCHER_SWIFT_CODE`
- `BEN_VOUCHER_ROUTING_CODE`
- `BEN_VOUCHER_ACCOUNT_NUMBER`

---

## Validation Schema Updates

The validation schema (`manualPaymentStep1Schema`) has been updated to:
1. Comment out old field validations
2. Add validations for all new fields
3. Update field types and requirements as needed

Key validation changes:
- `vaucherReferenceNumber`: Required, non-empty trimmed string
- `assetRegisterName`: Required, ID (string or number)
- `managementFirmName`: Required, max 100 characters
- `hoaApprovalNumber`: Required, max 50 characters
- `hoaApprovalDate`: Required date value
- `RT03`: Required, max 50 characters
- `paymentCurrency`: Required ID (replaces totalAmountPaid1)
- Budget fields: All required IDs/strings
- Beneficiary fields: Mixed required/optional with proper nested structure

---

## Section Organization

### New Section Structure:
1. **General Details** (New Fields)
   - Voucher Reference Number
   - Asset Register Name
   - Management Firm Name
   - Management Firm Account Status
   - Account Balances (Escrow, Retention)

2. **Expense Type**
   - Payment Type
   - Payment Sub-Type
   - HOA Approval Number
   - HOA Approval Date
   - Invoice Details

3. **Amount Details**
   - Special Rate / Corporate Amount checkboxes
   - RT03
   - Total Eligible Amount
   - Amount Paid
   - Cap Exceeded checkbox
   - Total Amount Paid
   - Payment Currency
   - Debit/Credit amounts

4. **Budget Details** (NEW SECTION)
   - Budget Year, Category, Sub Category, Service Name
   - Provisional Budget / HOA Exemption checkboxes
   - Auto-populated budget fields with fetch buttons

5. **Beneficiary Details** (NEW SECTION)
   - Beneficiary Account dropdown
   - Auto-filled beneficiary information fields
   - Transaction Type
   - Routing Sort Code

6. **Narration** (Kept)
   - Narration 1, 2
   - Remarks

---

## Notes

1. **Auto-populated Fields**: Several beneficiary fields are auto-filled when the beneficiary account is selected. These fields are disabled in the UI.

2. **Account Balance Fields**: Account balance fields use the `renderAccountBalanceField` helper which includes a "Fetch Account Balance" button that calls the API.

3. **Nested Object Fields**: Beneficiary fields use nested object notation (e.g., `voucherDTO.benVoucher`) which requires special handling in form state and validation.

4. **TODO Items**:
   - Add voucher data options to beneficiary account dropdown
   - Implement beneficiary account selection handler to auto-fill related fields
   - Connect budget dropdowns to actual data sources (currently using boolYnOptions as placeholder)
   - Update Step2.tsx to display new fields in review section
   - Update prepopulation logic in Step1.tsx for edit mode
   - Update form data mapper to handle new field structure

---

## Migration Checklist

- [x] Update label mappings
- [x] Update validation schema
- [x] Update Step1.tsx UI
- [ ] Update Step2.tsx review section
- [ ] Update prepopulation logic
- [ ] Update form data mapper
- [ ] Update API payload mapping
- [ ] Test all new fields
- [ ] Verify validation rules
- [ ] Test beneficiary auto-population
- [ ] Test budget field auto-population

---

## Questions / Follow-ups Needed

1. What data source should be used for `assetRegisterName` dropdown?
2. What data source should be used for budget dropdowns (year, category, sub-category, service name)?
3. What API endpoint provides voucher beneficiary data for the dropdown?
4. How should beneficiary auto-population work when an account is selected?
5. Should budget fields auto-populate based on selected budget category/sub-category?

---

## Validation Handling

### Nested Object Validation
**Important**: For nested objects like `voucherDTO` and `buildPartnerDTO`, the validation schema uses nested zod objects:

```typescript
// Schema (correct approach)
voucherDTO: z.object({
  benVoucher: ManualPaymentPrimitives.idRequired,
  benVoucherName: z.string().optional().nullable(),
  // ...
}),
```

**In React Hook Form**, use dot notation for field names:
```typescript
<Controller name="voucherDTO.benVoucher" control={control} />
```

React Hook Form automatically resolves the nested path and validates against the nested schema.

### Field Names with Spaces
Fields with spaces in their names have been converted to camelCase:
- `'Provisional Budget Code'` → `provisionalBudgetCode`
- `'Available Budget Amount'` → `availableBudgetAmount`

**Reason**: Zod schemas cannot use field names with spaces.

### Required vs Optional
- `voucherDTO`: **Required** (because `benVoucher` inside is required)
- `buildPartnerDTO`: **Optional** (can be null/undefined)
- Budget fields: Mixed required/optional based on business rules

For detailed validation information, see `MANUAL_PAYMENT_VALIDATION_CHANGES.md`.

---

*Last Updated: [Current Date]*
*Version: 1.0*

