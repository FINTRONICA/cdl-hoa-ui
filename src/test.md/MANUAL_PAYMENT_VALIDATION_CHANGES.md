# Manual Payment Validation Changes

## Overview
This document details all validation changes made for the new manual payment fields structure.

---

## Validation Schema Structure

### Nested Objects
The validation schema now uses proper nested objects for DTOs instead of dot-notation strings:

**Before (INCORRECT):**
```typescript
'voucherDTO.benVoucher': ManualPaymentPrimitives.idRequired,
'buildPartnerDTO.bpName': z.string().optional().nullable(),
```

**After (CORRECT):**
```typescript
// voucherDTO is required because benVoucher inside is required
voucherDTO: z.object({
  benVoucher: ManualPaymentPrimitives.idRequired,
  benVoucherName: z.string().optional().nullable(),
  benVoucherSwiftCode: z.string().optional().nullable(),
  benVoucherRoutingCode: z.string().optional().nullable(),
  benVoucherAccountNumber: z.string().optional().nullable(),
}), // Required object

// buildPartnerDTO is optional
buildPartnerDTO: z.object({
  bpName: z.string().optional().nullable(),
}).optional().nullable(),
```

### React Hook Form Field Names
In React Hook Form's Controller components, we use dot notation for nested fields:
```typescript
<Controller
  name="voucherDTO.benVoucher"  // Dot notation for nested field
  control={control}
  // ...
/>
```

This works correctly with zod's nested object schema because React Hook Form automatically handles the nested path resolution.

---

## Field Name Changes

### Budget Fields - Space to CamelCase
Budget fields with spaces in their names have been converted to camelCase for proper validation:

| Old Name (Invalid) | New Name (Valid) | Schema Field |
|-------------------|------------------|--------------|
| `'Provisional Budget Code'` | `provisionalBudgetCode` | `provisionalBudgetCode` |
| `'Provisional Budget Name'` | `provisionalBudgetName` | `provisionalBudgetName` |
| `'Available Budget Amount'` | `availableBudgetAmount` | `availableBudgetAmount` |
| `'Utilized Budget Amount'` | `utilizedBudgetAmount` | `utilizedBudgetAmount` |
| `'Invoice Budget Amount'` | `invoiceBudgetAmount` | `invoiceBudgetAmount` |

**Reason**: Zod schemas cannot use field names with spaces. JavaScript object keys with spaces require bracket notation which doesn't work well with form validation.

---

## Validation Rules

### Required Fields
All new required fields use appropriate validation primitives:

```typescript
// Text fields (required)
vaucherReferenceNumber: ManualPaymentPrimitives.nonEmptyTrimmed,
managementFirmName: ManualPaymentPrimitives.nonEmptyTrimmedMax(100),
hoaApprovalNumber: ManualPaymentPrimitives.nonEmptyTrimmedMax(50),
RT03: ManualPaymentPrimitives.nonEmptyTrimmedMax(50),

// ID/Dropdown fields (required)
assetRegisterName: ManualPaymentPrimitives.idRequired,
managementFirmAccountStatus: ManualPaymentPrimitives.idOptional,
paymentType: ManualPaymentPrimitives.idRequired,
paymentCurrency: ManualPaymentPrimitives.idRequired,

// Date fields (required)
hoaApprovalDate: ManualPaymentPrimitives.dateValue,
```

### Optional Fields
Optional fields are properly marked:

```typescript
// Optional with nullable
managementFirmAccountStatus: ManualPaymentPrimitives.idOptional,
paymentSubType: ManualPaymentPrimitives.idOptional,
invoiceDate: ManualPaymentPrimitives.dateValue.optional().nullable(),

// Optional boolean fields
specialRate: z.coerce.boolean().optional().nullable(),
corporateAmount: z.coerce.boolean().optional().nullable(),
provisionalBudget: z.coerce.boolean().optional().nullable(),
HOAExemption: z.coerce.boolean().optional().nullable(),
```

### Nested Object Fields
Nested objects can be optional/nullable as a whole, with internal fields being required:

```typescript
voucherDTO: z.object({
  benVoucher: ManualPaymentPrimitives.idRequired, // Required if voucherDTO exists
  benVoucherName: z.string().optional().nullable(),
  // ...
}).optional().nullable(), // Entire object can be null/undefined
```

---

## Validation Primitives Used

### ManualPaymentPrimitives

1. **nonEmptyTrimmed**: Required non-empty string (trimmed)
   ```typescript
   vaucherReferenceNumber: ManualPaymentPrimitives.nonEmptyTrimmed
   ```

2. **nonEmptyTrimmedMax(len)**: Required string with max length
   ```typescript
   managementFirmName: ManualPaymentPrimitives.nonEmptyTrimmedMax(100)
   hoaApprovalNumber: ManualPaymentPrimitives.nonEmptyTrimmedMax(50)
   RT03: ManualPaymentPrimitives.nonEmptyTrimmedMax(50)
   ```

3. **idRequired**: Required ID (string or number) for dropdowns
   ```typescript
   assetRegisterName: ManualPaymentPrimitives.idRequired
   paymentType: ManualPaymentPrimitives.idRequired
   paymentCurrency: ManualPaymentPrimitives.idRequired
   ```

4. **idOptional**: Optional ID (string or number or null)
   ```typescript
   managementFirmAccountStatus: ManualPaymentPrimitives.idOptional
   paymentSubType: ManualPaymentPrimitives.idOptional
   ```

5. **dateValue**: Required date (Dayjs object)
   ```typescript
   hoaApprovalDate: ManualPaymentPrimitives.dateValue
   ```

6. **trimmedMax(len)**: Optional string with max length
   ```typescript
   totalEligibleAmount: ManualPaymentPrimitives.trimmedMax(15).optional().nullable()
   ```

7. **backendDropdownRequired**: Required dropdown value (string or number)
   ```typescript
   engineerFeePayment: ManualPaymentPrimitives.backendDropdownRequired
   ```

---

## Form Field Name Mapping

### Step1.tsx Field Names → Schema Fields

| Form Field Name | Schema Field | Validation Type |
|----------------|--------------|-----------------|
| `vaucherReferenceNumber` | `vaucherReferenceNumber` | Required, non-empty |
| `assetRegisterName` | `assetRegisterName` | Required, ID |
| `managementFirmName` | `managementFirmName` | Required, max 100 chars |
| `managementFirmAccountStatus` | `managementFirmAccountStatus` | Optional, ID |
| `escrowAccount` | `escrowAccount` | Required, non-empty |
| `subConstructionAccount` | `subConstructionAccount` | Optional |
| `retentionAccount2` | `retentionAccount` | Optional |
| `paymentType` | `paymentType` | Required, ID |
| `paymentSubType` | `paymentSubType` | Optional, ID |
| `hoaApprovalNumber` | `hoaApprovalNumber` | Required, max 50 chars |
| `hoaApprovalDate` | `hoaApprovalDate` | Required, date |
| `invoiceRef` | `invoiceRef` | Required, max 15 chars |
| `invoiceCurrency` | `invoiceCurrency` | Required, ID |
| `invoiceValue` | `invoiceValue` | Required, max 15 chars |
| `invoiceDate` | `invoiceDate` | Optional, date |
| `specialRate` | `specialRate` | Optional, boolean |
| `corporateAmount` | `corporateAmount` | Optional, boolean |
| `RT03` | `RT03` | Required, max 50 chars |
| `totalEligibleAmount` | `totalEligibleAmount` | Optional, max 15 chars |
| `amountPaid` | `amountPaid` | Optional, max 15 chars |
| `capExceeded` | `capExceeded` | Optional, boolean |
| `totalAmountPaid` | `totalAmountPaid` | Optional, max 15 chars |
| `paymentCurrency` | `paymentCurrency` | Required, ID |
| `debitCreditToEscrow` | `debitCreditToEscrow` | Optional, max 15 chars |
| `currentEligibleAmount` | `currentEligibleAmount` | Optional, max 15 chars |
| `debitFromRetention` | `debitFromRetention` | Optional, max 15 chars |
| `totalPayoutAmount` | `totalPayoutAmount` | Optional, max 15 chars |
| `amountInTransit` | `amountInTransit` | Optional, max 15 chars |
| `budgetYear` | `budgetYear` | Required, ID |
| `budgetCategory` | `budgetCategory` | Required, ID |
| `budgetSubCategory` | `budgetSubCategory` | Required, ID |
| `budgetServiceName` | `budgetServiceName` | Required, ID |
| `provisionalBudget` | `provisionalBudget` | Optional, boolean |
| `HOAExemption` | `HOAExemption` | Optional, boolean |
| `categoryCode` | `categoryCode` | Required, max 50 chars |
| `categoryName` | `categoryName` | Optional |
| `subCategoryCode` | `subCategoryCode` | Required, max 50 chars |
| `subCategoryName` | `subCategoryName` | Optional |
| `serviceCode` | `serviceCode` | Required, max 50 chars |
| `serviceName` | `serviceName` | Optional |
| `provisionalBudgetCode` | `provisionalBudgetCode` | Required, max 50 chars |
| `provisionalBudgetName` | `provisionalBudgetName` | Optional |
| `availableBudgetAmount` | `availableBudgetAmount` | Optional |
| `utilizedBudgetAmount` | `utilizedBudgetAmount` | Optional |
| `invoiceBudgetAmount` | `invoiceBudgetAmount` | Optional |
| `voucherDTO.benVoucher` | `voucherDTO.benVoucher` | Required, ID (if voucherDTO exists) |
| `voucherDTO.benVoucherName` | `voucherDTO.benVoucherName` | Optional |
| `buildPartnerDTO.bpName` | `buildPartnerDTO.bpName` | Optional |
| `voucherDTO.benVoucherSwiftCode` | `voucherDTO.benVoucherSwiftCode` | Optional |
| `voucherDTO.benVoucherRoutingCode` | `voucherDTO.benVoucherRoutingCode` | Optional |
| `voucherDTO.benVoucherAccountNumber` | `voucherDTO.benVoucherAccountNumber` | Optional |
| `engineerFeePayment` | `engineerFeePayment` | Required, dropdown |
| `routinfSortcode` | `routinfSortcode` | Required, max 50 chars |
| `narration1` | `narration1` | Optional, max 50 chars, alphanumeric |
| `narration2` | `narration2` | Optional, max 50 chars, alphanumeric |
| `remarks` | `remarks` | Optional, max 30 chars |

---

## Nested Object Validation

### How It Works
1. **Schema Definition**: Define nested objects in zod schema
   ```typescript
   voucherDTO: z.object({
     benVoucher: ManualPaymentPrimitives.idRequired,
     benVoucherName: z.string().optional().nullable(),
   }).optional().nullable(),
   ```

2. **Form Field Name**: Use dot notation in Controller
   ```typescript
   <Controller
     name="voucherDTO.benVoucher"
     control={control}
   />
   ```

3. **Validation**: React Hook Form + zodResolver automatically validates nested paths
   - Path `voucherDTO.benVoucher` validates against `schema.voucherDTO.benVoucher`
   - If `voucherDTO` is null/undefined, nested validation is skipped
   - If `voucherDTO` exists, `benVoucher` must be valid

### Required Nested Object Validation
```typescript
// voucherDTO is required (object must exist) - no .optional().nullable()
// benVoucher inside is required (must have a value)
voucherDTO: z.object({
  benVoucher: ManualPaymentPrimitives.idRequired, // Required
  benVoucherName: z.string().optional().nullable(),
}), // Required object - form will not submit if voucherDTO is missing

// If we wanted voucherDTO to be optional, we would add:
// voucherDTO: z.object({...}).optional().nullable(),
```

**Current Implementation**: `voucherDTO` is **required** because `benVoucher` is required. The form will not submit if `voucherDTO` is missing or if `benVoucher` is empty.

---

## Account Balance Fields

Account balance fields use two form fields:
1. **Account Code/Number Field**: Editable input with fetch button
2. **Balance Display Field**: Read-only display of fetched balance

**Example:**
```typescript
renderAccountBalanceField(
  'categoryCode',        // accountKey (for balance fetching)
  'categoryCode',        // accountFieldName (form field for input)
  'Category Code Label', // accountLabel
  'categoryName',       // balanceFieldName (form field for display)
  'Balance Label',      // balanceLabel
  6,                    // gridSize
  true                  // isRequired
)
```

**Validation:**
- `categoryCode` (input field): Required, max 50 characters
- `categoryName` (balance display): Optional, read-only

---

## Validation Error Messages

Error messages come from validation schema:

| Validation | Error Message |
|------------|---------------|
| `nonEmptyTrimmed` | "Required field" |
| `nonEmptyTrimmedMax(50)` | "Required field" or "Max 50 characters" |
| `idRequired` | "Required field" |
| `dateValue` | "Select a date" |
| `trimmedMax(15)` with optional | "Max 15 characters" (only if field has value) |
| Regex validation (narration) | "Only alphanumeric characters allowed" |

---

## Removed/Old Fields

Old fields that were removed/commented out in validation:
- `tasReference` → Replaced by `vaucherReferenceNumber`
- `developerName` → Removed
- `developerId` → Removed
- `projectName` → Replaced by `assetRegisterName`
- `projectId` → Removed
- `projectStatus` → Replaced by `managementFirmAccountStatus`
- `paymentType1` → Replaced by `hoaApprovalNumber`
- `paymentSubType1` → Replaced by `hoaApprovalDate`
- `totalAmountPaid1` → Replaced by `paymentCurrency`
- Various other old fields

---

## Testing Validation

### Test Required Fields
1. Submit form with empty required fields
2. Verify error messages appear
3. Fill required fields
4. Verify errors clear

### Test Nested Objects
1. Test with `voucherDTO` as null → Should pass validation
2. Test with `voucherDTO` object but `benVoucher` empty → Should fail
3. Test with `voucherDTO` object and `benVoucher` filled → Should pass

### Test Field Lengths
1. Enter text exceeding max length
2. Verify "Max X characters" error appears
3. Reduce to valid length
4. Verify error clears

### Test Date Fields
1. Leave date field empty (if required)
2. Verify "Select a date" error
3. Select valid date
4. Verify error clears

---

## Migration Notes

### Default Values
Update default values in `ManualPaymentStepper/index.tsx`:

```typescript
defaultValues: {
  vaucherReferenceNumber: '',
  assetRegisterName: '',
  managementFirmName: '',
  managementFirmAccountStatus: null,
  hoaApprovalNumber: '',
  hoaApprovalDate: null,
  RT03: '',
  paymentCurrency: '',
  budgetYear: '',
  budgetCategory: '',
  budgetSubCategory: '',
  budgetServiceName: '',
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
  // ...
}
```

### Form Data Mapping
When mapping form data to API payload:
- Access nested fields: `formData.voucherDTO?.benVoucher`
- Handle optional nested objects: Check if object exists before accessing properties

---

## Summary

**Key Changes:**
1. ✅ Converted dot-notation strings to nested zod objects
2. ✅ Converted space-separated field names to camelCase
3. ✅ Added proper validation rules for all new fields
4. ✅ Maintained React Hook Form dot notation for nested fields
5. ✅ Properly marked required vs optional fields
6. ✅ Used appropriate validation primitives

**Validation Schema**: `src/lib/validation/manualPaymentSchemas.ts`
**Form Component**: `src/components/organisms/ManualPaymentStepper/steps/Step1.tsx`

---

*Last Updated: [Current Date]*
*Version: 1.0*

