# Step1.tsx Fields Comparison Chart

## Overview
This document compares the current implementation in Step1.tsx with the code you provided, showing what exists, what's new, and what needs to be updated.

---

## Field Comparison Matrix

| # | Field Name | Field Type | Current Status | Your Code Status | Differences | Action Required |
|---|------------|------------|----------------|------------------|-------------|-----------------|
| **SECTION 1: BASIC FIELDS** |
| 1 | `vaucherReferenceNumber` | PaymentRefIdField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 2 | `assetRegisterName` | SelectField | ✅ EXISTS | ✅ EXISTS | **Data source differs** | ⚠️ **UPDATE NEEDED** |
| 3 | `managementFirmName` | TextField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 4 | `managementFirmAccountStatus` | SelectField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| **SECTION 2: ACCOUNT BALANCE FIELDS** |
| 5 | `escrowAccount` | AccountBalanceField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 6 | `retentionAccount` (corporateAccount2) | AccountBalanceField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| **SECTION 3: PAYMENT TYPE & INVOICE** |
| 7 | `paymentType` | SelectField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 8 | `paymentSubType` | SelectField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 9 | `hoaApprovalNumber` | TextField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 10 | `hoaApprovalDate` | DatePickerField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 11 | `invoiceRef` | TextField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 12 | `invoiceCurrency` | SelectField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 13 | `invoiceValue` | TextField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 14 | `invoiceDate` | DatePickerField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| **SECTION 4: AMOUNT DETAILS** |
| 15 | `specialRate` | CheckboxField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 16 | `corporateAmount` | CheckboxField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 17 | `RT03` | TextField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 18 | `totalEligibleAmount` | TextField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 19 | `amountPaid` | TextField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 20 | `capExceeded` | CheckboxField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 21 | `totalAmountPaid` | TextField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 22 | `paymentCurrency` | SelectField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 23 | `debitCreditToEscrow` | TextField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 24 | `currentEligibleAmount` | TextField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 25 | `debitFromRetention` | TextField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 26 | `totalPayoutAmount` | TextField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 27 | `amountInTransit` | TextField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| **SECTION 5: BUDGET DETAILS - DROPDOWN FIELDS** |
| 28 | `budgetYear` | SelectField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 29 | `budgetCategory` | SelectField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 30 | `budgetSubCategory` | SelectField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 31 | `budgetServiceName` | SelectField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| **SECTION 6: BUDGET DETAILS - CHECKBOX FIELDS** |
| 32 | `provisionalBudget` | CheckboxField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 33 | `HOAExemption` | CheckboxField | ✅ EXISTS | ⚠️ ISSUE | **Trailing space in your code!** | ⚠️ **FIX NEEDED** |
| **SECTION 7: BUDGET DETAILS - AUTO-POPULATE FIELDS** |
| 34 | `categoryCode` (renderAccountBalanceField) | AccountBalanceField | ✅ EXISTS | ⚠️ DIFFERENT | **Parameter names differ** | ⚠️ **UPDATE NEEDED** |
| 35 | `subCategoryCode` (renderAccountBalanceField) | AccountBalanceField | ✅ EXISTS | ⚠️ DIFFERENT | **Parameter names differ** | ⚠️ **UPDATE NEEDED** |
| 36 | `serviceCode` (renderAccountBalanceField) | AccountBalanceField | ✅ EXISTS | ⚠️ DIFFERENT | **Parameter names differ** | ⚠️ **UPDATE NEEDED** |
| 37 | `provisionalBudgetCode` (renderAccountBalanceField) | AccountBalanceField | ✅ EXISTS | ⚠️ DIFFERENT | **Parameter names differ** | ⚠️ **UPDATE NEEDED** |
| 38 | `availableBudgetAmount` (renderAccountBalanceField) | AccountBalanceField | ✅ EXISTS | ⚠️ DIFFERENT | **Parameter names differ** | ⚠️ **UPDATE NEEDED** |
| 39 | `utilizedBudgetAmount` (renderAccountBalanceField) | AccountBalanceField | ✅ EXISTS | ⚠️ DIFFERENT | **Parameter names differ** | ⚠️ **UPDATE NEEDED** |
| 40 | `invoiceBudgetAmount` (renderAccountBalanceField) | AccountBalanceField | ✅ EXISTS | ⚠️ DIFFERENT | **Parameter names differ** | ⚠️ **UPDATE NEEDED** |
| **SECTION 8: BENEFICIARY DETAILS** |
| 41 | `voucherDTO.benVoucher` | Controller (Select) | ✅ EXISTS | ⚠️ ENHANCED | **Needs validation, data source, onChange handler** | ⚠️ **MAJOR UPDATE** |
| 42 | `voucherDTO.benVoucherName` | Controller (TextField) | ✅ EXISTS | ⚠️ ENHANCED | **Needs defaultValue from sanitizedData** | ⚠️ **UPDATE NEEDED** |
| 43 | `buildPartnerDTO.bpName` | Controller (TextField) | ✅ EXISTS | ⚠️ ENHANCED | **Needs defaultValue from sanitizedData** | ⚠️ **UPDATE NEEDED** |
| 44 | `voucherDTO.benVoucherSwiftCode` | Controller (TextField) | ✅ EXISTS | ⚠️ ENHANCED | **Needs defaultValue from sanitizedData** | ⚠️ **UPDATE NEEDED** |
| 45 | `voucherDTO.benVoucherRoutingCode` | Controller (TextField) | ✅ EXISTS | ⚠️ ENHANCED | **Needs defaultValue from sanitizedData** | ⚠️ **UPDATE NEEDED** |
| 46 | `voucherDTO.benVoucherAccountNumber` | Controller (TextField) | ✅ EXISTS | ⚠️ ENHANCED | **Field name differs: your code has `/IBAN`** | ⚠️ **UPDATE NEEDED** |
| **SECTION 9: FINAL FIELDS** |
| 47 | `engineerFeePayment` | SelectField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |
| 48 | `routinfSortcode` | TextField | ✅ EXISTS | ✅ EXISTS | None | ✅ No change |

---

## Detailed Differences

### 🔴 **CRITICAL DIFFERENCES (Must Fix)**

#### 1. **assetRegisterName - Data Source**
**Current Code:**
```tsx
projectAssets.map((asset) => ({
  id: asset.id,
  displayName: asset.reaName,
}))
```

**Your Code:**
```tsx
assetRegisterNames
```

**Issue:** Your code references `assetRegisterNames` which doesn't exist. Current uses `projectAssets`.

**Fix Required:** 
- Option A: Define `assetRegisterNames` variable
- Option B: Keep current `projectAssets.map(...)` approach
- Option C: Create `assetRegisterNames` from `projectAssets`

---

#### 2. **Budget AccountBalanceField - Parameter Names**

**Current Code (CORRECT - camelCase):**
```tsx
{renderAccountBalanceField(
  'categoryCode',           // ✅ camelCase
  'categoryCode',           // ✅ camelCase
  getLabel(...),
  'categoryName',           // ✅ camelCase
  'Current Balance...',
  6,
  true
)}
```

**Your Code (INCORRECT - Mixed case with spaces):**
```tsx
{renderAccountBalanceField(
  'CategoryCode',            // ❌ PascalCase
  'CategoryName',            // ❌ PascalCase
  getLabel(...),
  'CategoryName',            // ❌ PascalCase
  'Current Balance...',
  6,
  true
)}
```

**Issues:**
- ❌ Parameter 1: `'CategoryCode'` should be `'categoryCode'` (camelCase)
- ❌ Parameter 2: `'CategoryName'` should be `'categoryCode'` (same as param 1)
- ❌ Parameter 4: `'CategoryName'` should be `'categoryName'` (camelCase)
- ❌ Spaces in names like `'Provisional Budget Code'` won't work (need camelCase)

**Same issue for:**
- `subCategoryCode` → Your code has `'SubCategoryCode'`, `'SubCategoryName'`
- `serviceCode` → Your code has `'ServiceCode'`, `'ServiceName'`
- `provisionalBudgetCode` → Your code has `'Provisional Budget Code'` (with spaces!)
- Budget amount fields → Your code has spaces in parameter names

**Fix Required:** Use camelCase parameter names to match schema.

---

#### 3. **HOAExemption - Trailing Space**
**Current Code:**
```tsx
'HOAExemption'  // ✅ Correct
```

**Your Code:**
```tsx
'HOAExemption '  // ❌ Has trailing space!
```

**Issue:** Trailing space will cause field name mismatch.

**Fix Required:** Remove trailing space.

---

#### 4. **Beneficiary Details - Enhanced Controller Implementation**

**Current Code (Basic):**
```tsx
<Controller
  name="voucherDTO.benVoucher"
  control={control}
  defaultValue=""
  render={({ field, fieldState: { error } }) => (
    <FormControl ...>
      <Select {...field} disabled={isReadOnly}>
        <MenuItem value="" disabled>-- Select --</MenuItem>
        {/* TODO: Add voucher data options here */}
      </Select>
    </FormControl>
  )}
/>
```

**Your Code (Enhanced with Validation & Data):**
```tsx
<Controller
  name="voucherDTO.benVoucher"
  control={control}
  defaultValue={sanitizedData?.voucherDTO?.benVoucher || ''}
  rules={{
    validate: (value: any) =>
      validateStep1Field('voucherDTO.benVoucher', value),
  }}
  render={({ field }) => (
    <FormControl
      error={!!errors.buildPartnerDTO?.benVoucher}  // ⚠️ Note: errors.buildPartnerDTO
      ...
    >
      <Select
        {...field}
        disabled={isViewMode || isVoucherLoading}
        onChange={(e) => {
          field.onChange(e)
          handleVoucherBeneficiaryDetailsChange(e.target.value as string)
        }}
      >
        {isDevelopersLoading ? (
          <MenuItem disabled>Loading...</MenuItem>
        ) : (
          VoucherData?.content?.map((voucher) => (
            <MenuItem key={voucher.id} value={voucher.benVoucher || ''}>
              {voucher.benVoucher || 'No CIF'}-{voucher.bpName || 'No Name'}
            </MenuItem>
          )) || []
        )}
      </Select>
      {errors.voucherDTO?.benVoucher && (
        <Typography variant="caption" color="error">
          {errors.voucherDTO.benVoucher.message}
        </Typography>
      )}
    </FormControl>
  )}
/>
```

**Key Differences:**
1. ✅ **defaultValue from sanitizedData** - For prepopulation
2. ✅ **rules with validateStep1Field** - Custom validation
3. ✅ **handleVoucherBeneficiaryDetailsChange** - onChange handler for auto-population
4. ✅ **VoucherData?.content?.map()** - Actual data source for dropdown
5. ✅ **Loading state** - `isVoucherLoading`, `isDevelopersLoading`
6. ⚠️ **Error path issue** - Your code has `errors.buildPartnerDTO?.benVoucher` but should be `errors.voucherDTO?.benVoucher`

**Missing in Current:**
- `sanitizedData` variable/state
- `validateStep1Field` function
- `handleVoucherBeneficiaryDetailsChange` function
- `VoucherData` variable/state
- `isVoucherLoading` state
- `isDevelopersLoading` state
- `errors` object access pattern

---

#### 5. **Beneficiary Account Number Field Name**
**Current Code:**
```tsx
name="voucherDTO.benVoucherAccountNumber"
```

**Your Code:**
```tsx
name="voucherDTO.benVoucherAccountNumber/IBAN"
label={getLabel('CDL_BEN_VOUCHER_ACCOUNT_NUMBER/IBAN', ...)}
```

**Issue:** Field names cannot contain `/` character in React Hook Form paths.

**Fix Required:** 
- Use `name="voucherDTO.benVoucherAccountNumber"` (current is correct)
- Update label to show "Beneficiary Account Number/IBAN" in display only

---

## Summary Chart

### ✅ Fields That Match Perfectly (31 fields)
- All basic fields (1-27)
- Budget dropdown fields (28-31)
- Final fields (47-48)

### ⚠️ Fields That Need Updates (17 fields)

| Category | Count | Fields |
|----------|-------|--------|
| **Data Source Issues** | 1 | `assetRegisterName` |
| **Parameter Name Issues** | 7 | All budget AccountBalanceField parameters |
| **Field Name Issues** | 2 | `HOAExemption` (trailing space), `benVoucherAccountNumber/IBAN` |
| **Enhanced Implementation Needed** | 6 | All Beneficiary Details fields need enhanced Controller |
| **Missing Functions/Variables** | Multiple | `sanitizedData`, `validateStep1Field`, `handleVoucherBeneficiaryDetailsChange`, `VoucherData`, loading states |

---

## Component Comparison

### ✅ Components That Already Exist

| Component | Status | Notes |
|-----------|--------|-------|
| `renderPaymentRefIdField` | ✅ EXISTS | Perfect match |
| `renderTextField` | ✅ EXISTS | Perfect match |
| `renderSelectField` | ✅ EXISTS | Perfect match |
| `renderDatePickerField` | ✅ EXISTS | Perfect match |
| `renderCheckboxField` | ✅ EXISTS | Perfect match |
| `renderAccountBalanceField` | ✅ EXISTS | Perfect match (but parameters need fixing) |
| `Controller` (from react-hook-form) | ✅ EXISTS | Needs enhancement |

### ⚠️ Components/Methods Needed (From Your Code)

| Component/Method | Purpose | Status |
|------------------|---------|--------|
| `sanitizedData` | Prepopulate form from saved data | ❌ MISSING |
| `validateStep1Field` | Custom field validation | ❌ MISSING |
| `handleVoucherBeneficiaryDetailsChange` | Auto-populate beneficiary fields | ❌ MISSING |
| `VoucherData` | Voucher dropdown data source | ❌ MISSING |
| `isVoucherLoading` | Loading state for vouchers | ❌ MISSING |
| `isDevelopersLoading` | Loading state for developers | ❌ MISSING |
| `errors` | Error object from form validation | ❌ MISSING (or needs access pattern) |
| `assetRegisterNames` | Asset register dropdown data | ❌ MISSING (or use `projectAssets`) |

---

## Action Items Summary

### 🔴 **HIGH PRIORITY (Must Fix)**

1. **Fix Budget AccountBalanceField Parameters**
   - Change `'CategoryCode'` → `'categoryCode'`
   - Change `'CategoryName'` → `'categoryCode'` (first param should match second)
   - Change `'CategoryName'` (balance field) → `'categoryName'`
   - Remove spaces: `'Provisional Budget Code'` → `'provisionalBudgetCode'`
   - Apply to all 7 budget AccountBalanceField calls

2. **Fix HOAExemption Field Name**
   - Remove trailing space: `'HOAExemption '` → `'HOAExemption'`

3. **Fix Beneficiary Account Number Field Name**
   - Remove `/IBAN` from field name: `'voucherDTO.benVoucherAccountNumber/IBAN'` → `'voucherDTO.benVoucherAccountNumber'`
   - Keep `/IBAN` only in label display

4. **Add Enhanced Beneficiary Controller Implementation**
   - Add `sanitizedData` state/variable
   - Add `validateStep1Field` function
   - Add `handleVoucherBeneficiaryDetailsChange` function
   - Add `VoucherData` state (from API)
   - Add loading states
   - Fix error path (`errors.buildPartnerDTO` → `errors.voucherDTO`)

### 🟡 **MEDIUM PRIORITY (Should Fix)**

5. **Fix assetRegisterName Data Source**
   - Define `assetRegisterNames` OR
   - Keep current `projectAssets.map(...)` approach

6. **Update All Beneficiary Fields with defaultValue from sanitizedData**
   - `voucherDTO.benVoucherName`
   - `buildPartnerDTO.bpName`
   - `voucherDTO.benVoucherSwiftCode`
   - `voucherDTO.benVoucherRoutingCode`
   - `voucherDTO.benVoucherAccountNumber`

---

## Code Comparison Examples

### Example 1: Budget Field (WRONG vs CORRECT)

**❌ Your Code (WRONG):**
```tsx
{renderAccountBalanceField(
  'CategoryCode',           // ❌ PascalCase
  'CategoryName',           // ❌ Wrong - should be categoryCode
  getLabel(...),
  'CategoryName',           // ❌ PascalCase
  'Current Balance in Category Name*',
  6,
  true
)}
```

**✅ Current Code (CORRECT):**
```tsx
{renderAccountBalanceField(
  'categoryCode',           // ✅ camelCase
  'categoryCode',           // ✅ Matches first param
  getLabel(...),
  'categoryName',           // ✅ camelCase for balance field
  'Current Balance in Category Name*',
  6,
  true
)}
```

### Example 2: Beneficiary Field (BASIC vs ENHANCED)

**✅ Current Code (BASIC - Works but needs enhancement):**
```tsx
<Controller
  name="voucherDTO.benVoucher"
  control={control}
  defaultValue=""
  render={({ field, fieldState: { error } }) => (
    <FormControl fullWidth error={!!error} required={true}>
      <Select {...field} disabled={isReadOnly}>
        <MenuItem value="" disabled>-- Select --</MenuItem>
        {/* TODO: Add voucher data */}
      </Select>
    </FormControl>
  )}
/>
```

**✅ Your Code (ENHANCED - Better implementation):**
```tsx
<Controller
  name="voucherDTO.benVoucher"
  control={control}
  defaultValue={sanitizedData?.voucherDTO?.benVoucher || ''}
  rules={{
    validate: (value: any) =>
      validateStep1Field('voucherDTO.benVoucher', value),
  }}
  render={({ field }) => (
    <FormControl
      fullWidth
      error={!!errors.voucherDTO?.benVoucher}  // ⚠️ Fix: was buildPartnerDTO
      required={true}
    >
      <Select
        {...field}
        disabled={isViewMode || isVoucherLoading}
        onChange={(e) => {
          field.onChange(e)
          handleVoucherBeneficiaryDetailsChange(e.target.value as string)
        }}
      >
        {isDevelopersLoading ? (
          <MenuItem disabled>Loading...</MenuItem>
        ) : (
          VoucherData?.content?.map((voucher) => (
            <MenuItem key={voucher.id} value={voucher.benVoucher || ''}>
              {voucher.benVoucher || 'No CIF'}-{voucher.bpName || 'No Name'}
            </MenuItem>
          )) || []
        )}
      </Select>
    </FormControl>
  )}
/>
```

---

## Statistics

```
Total Fields Analyzed: 48
├── ✅ Perfect Match: 31 fields (64.6%)
├── ⚠️ Needs Updates: 17 fields (35.4%)
│   ├── Data Source: 1 field
│   ├── Parameter Names: 7 fields
│   ├── Field Names: 2 fields
│   └── Implementation: 6 fields
└── ❌ Missing Components: 8 items
    ├── Functions: 3
    ├── Variables/State: 5
```

---

## Recommendations

### Quick Fixes (Can apply immediately)
1. ✅ Remove trailing space from `HOAExemption`
2. ✅ Fix budget AccountBalanceField parameter names to camelCase
3. ✅ Fix `benVoucherAccountNumber` field name (remove `/IBAN`)

### Requires Additional Work
4. ⚠️ Add voucher data fetching and state management
5. ⚠️ Add `sanitizedData` for prepopulation
6. ⚠️ Add validation and onChange handlers
7. ⚠️ Add loading states

### Decision Needed
8. ❓ Decide on `assetRegisterNames` vs `projectAssets.map(...)`

---

*Last Updated: [Current Date]*
*Version: 1.0*

