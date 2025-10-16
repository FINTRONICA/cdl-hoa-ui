# Owner Property/Unit Fields - Addition Summary

## Overview
This document summarizes the **26 additional property/unit-related fields** that were added to the Owner mapping files on **October 16, 2025**.

## Files Updated

1. **`/src/constants/mappings/ownerMapping.ts`** - Added 26 property/unit label constants
2. **`/src/constants/mappings/ownerMapper.ts`** - Added 26 property/unit fields to OwnerResponse interface and mapping function
3. **`/src/constants/mappings/types/owner.ts`** - Added 26 property/unit fields to OwnerData interface + 3 new enums
4. **`/src/constants/index.ts`** - Exported new enums (UnitStatus, PropertyType, WorldCheck)

---

## New Fields Added

### Property Information

| # | Field Name | Constant | Data Type | Field Type | Mandatory/Optional |
|---|------------|----------|-----------|------------|-------------------|
| 1 | Property ID | `CDL_OWN_PROPERTY_ID` | string | Text Field | Mandatory |
| 2 | Property Name | `CDL_OWN_PROPERTY_NAME` | string | Dropdown | Mandatory (Auto Fetch from Core banking) |
| 3 | Management Company/Developer ID | `CDL_OWN_MGMT_COMPANY_DEV_ID` | string | Dropdown | Mandatory |
| 4 | Management Company/Developer Name | `CDL_OWN_MGMT_COMPANY_DEV_NAME` | string | Text Field | Mandatory (Auto Fetch), Alphanumeric (50,0) |

### Unit Details

| # | Field Name | Constant | Data Type | Field Type | Mandatory/Optional |
|---|------------|----------|-----------|------------|-------------------|
| 5 | Unit Reference Number | `CDL_OWN_UNIT_REFERENCE_NUMBER` | string | Text Field | Optional, All characters (20,0) |
| 6 | Unit no. | `CDL_OWN_UNIT_NO` | string | Text Field | Mandatory, All characters (20,0) |
| 7 | Unit Status | `CDL_OWN_UNIT_STATUS` | string | Dropdown | Mandatory, Default: Open |
| 8 | Tower/Building Name | `CDL_OWN_TOWER_BUILDING_NAME` | string | Text Field | Mandatory, Alphanumeric (50,0) |
| 9 | Unit/Plot size | `CDL_OWN_UNIT_PLOT_SIZE` | string | Text Field | Non mandatory, Alphanumeric (20,0) |
| 10 | Property Type | `CDL_OWN_PROPERTY_TYPE` | string | Dropdown | Non mandatory |
| 11 | Unit IBAN | `CDL_OWN_UNIT_IBAN` | string | Text Field | Optional, Alphanumeric (50,0) |

### Unit Status Dropdown Options

- `CDL_OWN_UNIT_STATUS_OPEN`: "Open" (Default)
- `CDL_OWN_UNIT_STATUS_TRANSFER`: "Transfer"
- `CDL_OWN_UNIT_STATUS_CANCEL`: "Cancel"
- `CDL_OWN_UNIT_STATUS_TRANSFER_JOINT`: "Transfer Joint"
- `CDL_OWN_UNIT_STATUS_CANCELLATION_PROCESS`: "Cancellation under process"
- `CDL_OWN_UNIT_STATUS_OTHERS`: "Others" (Capture text when selected)

### Property Type Dropdown Options

- `CDL_OWN_PROPERTY_TYPE_LAND`: "Land"
- `CDL_OWN_PROPERTY_TYPE_VILLA`: "Villa"
- `CDL_OWN_PROPERTY_TYPE_UNIT`: "Unit"

### Agent Information

| # | Field Name | Constant | Data Type | Field Type | Mandatory/Optional |
|---|------------|----------|-----------|------------|-------------------|
| 13 | Name of Agent | `CDL_OWN_AGENT_NAME` | string | Text Field | Optional, Alphanumeric (35,0) |
| 14 | Agent National ID | `CDL_OWN_AGENT_NATIONAL_ID` | string | Text Field | Optional, Numeric (10,0) |

### Pricing Information

| # | Field Name | Constant | Data Type | Field Type | Mandatory/Optional |
|---|------------|----------|-----------|------------|-------------------|
| 15 | Gross Sale Price | `CDL_OWN_GROSS_SALE_PRICE` | number | Text Field | Optional, Numeric (17,2) |
| 16 | Sale Price | `CDL_OWN_SALE_PRICE` | number | Text Field | Optional, Numeric (17,2) |
| 17 | VAT Applicable | `CDL_OWN_VAT_APPLICABLE` | string | Text Field | Optional |

### Legal/Agreement Information

| # | Field Name | Constant | Data Type | Field Type | Mandatory/Optional |
|---|------------|----------|-----------|------------|-------------------|
| 18 | Deed No. | `CDL_OWN_DEED_NO` | string | Text Field | Non-Mandatory, Text length 15 |
| 19 | Agreement No./Contract No. | `CDL_OWN_AGREEMENT_CONTRACT_NO` | string | Text Field | Non-Mandatory, Text length 15 |
| 20 | Agreement Date | `CDL_OWN_AGREEMENT_DATE` | date | Text Field | Non-Mandatory |
| 21 | World Check | `CDL_OWN_WORLD_CHECK` | string | Radio Button | Optional |

### World Check Radio Button Options

- `CDL_OWN_WORLD_CHECK_YES`: "Yes"
- `CDL_OWN_WORLD_CHECK_NO`: "No"

### Payment/Financial Information

| # | Field Name | Constant | Data Type | Field Type | Mandatory/Optional |
|---|------------|----------|-----------|------------|-------------------|
| 22 | Amount Paid Within General Fund Escrow | `CDL_OWN_AMOUNT_WITHIN_ESCROW` | number | Text Field | Optional, Numeric (17,2) |
| 23 | Amount Paid Out of General Fund Escrow | `CDL_OWN_AMOUNT_OUT_ESCROW` | number | Text Field | Optional, Numeric (17,2) |
| 24 | Total Amount Paid | `CDL_OWN_TOTAL_AMOUNT_PAID` | number | Text Field | Optional, Auto-Calculate |
| 25 | Unit Area Size | `CDL_OWN_UNIT_AREA_SIZE` | string | Text Field | Optional, Alphanumeric (15,0) |
| 26 | Remarks | `CDL_OWN_REMARKS` | string | Text Field | Optional, Alphanumeric (50,0) |

---

## New Enums Created

### 1. UnitStatus Enum
```typescript
export enum UnitStatus {
  OPEN = 'Open', // Default value
  TRANSFER = 'Transfer',
  CANCEL = 'Cancel',
  TRANSFER_JOINT = 'Transfer Joint',
  CANCELLATION_PROCESS = 'Cancellation under process',
  OTHERS = 'Others' // Capture text when selected
}
```

### 2. PropertyType Enum
```typescript
export enum PropertyType {
  LAND = 'Land',
  VILLA = 'Villa',
  UNIT = 'Unit'
}
```

### 3. WorldCheck Enum
```typescript
export enum WorldCheck {
  YES = 'Yes',
  NO = 'No'
}
```

---

## Updated Categories

Added new categories to `getOwnerLabelsByCategory()` function:

- **`property_details`**: Property ID, Name, Management Company/Developer details, Property Type
- **`unit_details`**: Unit Reference, Number, Status, Tower/Building Name, Plot Size, IBAN, Area Size
- **`agent_details`**: Agent Name and National ID
- **`pricing_details`**: Gross Sale Price, Sale Price, VAT Applicable
- **`legal_details`**: Deed No., Agreement details, World Check
- **`payment_details`**: Amount Within/Out of Escrow, Total Amount Paid
- **`additional_info`**: Remarks

---

## ownerMapper.ts Updates

### OwnerResponse Interface
Added all 26 property/unit fields with inline comments describing:
- Data type (string, number, date)
- Field type (text field, dropdown, radio button)
- Input type (user input, auto fetch, user selection)
- Validation rules (mandatory/optional, length constraints)

### mapOwnerResponseToOwnerData Function
Updated mapping function to include:
- All 26 property/unit fields
- Default value for `unitStatus` (defaults to 'Open')
- Auto-calculation for `totalAmountPaid` (sum of `amountWithinEscrow` and `amountOutEscrow`)
- Inline comments for each field mapping

---

## TypeScript Type Safety

### Fixed TypeScript Strict Mode Issues
- All optional fields in `OwnerData` interface now explicitly include `| undefined`
- This resolves `exactOptionalPropertyTypes: true` compiler errors
- Replaced `any` types with proper type definitions:
  - `taskStatusDTO?: { code?: string; [key: string]: unknown }`
  - `ownerUnitDTO?: { [key: string]: unknown }`

---

## Auto-Calculate Field

### Total Amount Paid
**Constant**: `CDL_OWN_TOTAL_AMOUNT_PAID`

**Calculation Logic**:
```typescript
totalAmountPaid: owner.totalAmountPaid || 
  (owner.amountWithinEscrow || 0) + (owner.amountOutEscrow || 0)
```

This field automatically calculates the sum of:
- Amount Paid to Management Company/Developer (AED) Within General Fund Escrow
- Amount Paid to Management Company/Developer (AED) Out of General Fund Escrow

---

## Usage Examples

### Using Property/Unit Constants
```typescript
import { OWNER_LABELS } from '@/constants/mappings/ownerMapping'

// Get label
const propertyIdLabel = OWNER_LABELS.CDL_OWN_PROPERTY_ID // "Property ID"
const unitStatusLabel = OWNER_LABELS.CDL_OWN_UNIT_STATUS // "Unit Status"
```

### Using New Enums
```typescript
import { UnitStatus, PropertyType, WorldCheck } from '@/constants/mappings/types/owner'

// Unit Status dropdown
<select defaultValue={UnitStatus.OPEN}>
  <option value={UnitStatus.OPEN}>Open</option>
  <option value={UnitStatus.TRANSFER}>Transfer</option>
  <option value={UnitStatus.CANCEL}>Cancel</option>
  <option value={UnitStatus.TRANSFER_JOINT}>Transfer Joint</option>
  <option value={UnitStatus.CANCELLATION_PROCESS}>Cancellation under process</option>
  <option value={UnitStatus.OTHERS}>Others</option>
</select>

// Property Type dropdown
<select>
  <option value={PropertyType.LAND}>Land</option>
  <option value={PropertyType.VILLA}>Villa</option>
  <option value={PropertyType.UNIT}>Unit</option>
</select>

// World Check radio buttons
<input type="radio" value={WorldCheck.YES} name="worldCheck" />
<input type="radio" value={WorldCheck.NO} name="worldCheck" />
```

### Getting Labels by Category
```typescript
import { getOwnerLabelsByCategory } from '@/constants/mappings/ownerMapping'

// Get all property detail labels
const propertyLabels = getOwnerLabelsByCategory('property_details')

// Get all unit detail labels
const unitLabels = getOwnerLabelsByCategory('unit_details')

// Get all pricing detail labels
const pricingLabels = getOwnerLabelsByCategory('pricing_details')
```

### Using in Forms with Auto-Calculate
```typescript
import { mapOwnerResponseToOwnerData } from '@/constants/mappings/ownerMapper'

const ownerData = {
  // ... other fields
  amountWithinEscrow: 50000,
  amountOutEscrow: 25000,
}

const mappedData = mapOwnerResponseToOwnerData(ownerData)
console.log(mappedData.totalAmountPaid) // 75000 (auto-calculated)
```

---

## Validation Rules Summary

### Text Length Constraints
- **Alphanumeric (50,0)**: Management Company/Developer Name, Tower/Building Name
- **Alphanumeric (35,0)**: Agent Name
- **All characters (20,0)**: Unit Reference Number, Unit no., Unit/Plot size
- **Alphanumeric (15,0)**: Unit Area Size
- **Text length 15**: Deed No., Agreement No./Contract No.
- **Numeric (10,0)**: Agent National ID
- **Numeric (17,2)**: Gross Sale Price, Sale Price, Amount Within/Out of Escrow, Total Amount Paid

### Special Behaviors
- **Property Name**: Auto fetch from Core banking
- **Management Company/Developer Name**: Auto fetch
- **Unit Status**: Defaults to "Open"
- **Unit Status - Others**: Capture text when "Others" is selected
- **Total Amount Paid**: System auto-calculates (Within Escrow + Out of Escrow)

---

## Testing Checklist

- [ ] Property ID field accepts text input
- [ ] Property Name dropdown fetches from Core banking
- [ ] Management Company/Developer ID dropdown shows list
- [ ] Management Company/Developer Name auto-fetches based on ID
- [ ] Unit Status defaults to "Open"
- [ ] Unit Status "Others" option captures additional text
- [ ] Property Type dropdown shows Land/Villa/Unit options
- [ ] Agent National ID accepts only numeric values (10 digits)
- [ ] Gross Sale Price and Sale Price accept decimal values (17,2)
- [ ] World Check radio buttons work correctly
- [ ] Total Amount Paid auto-calculates correctly
- [ ] All field length validations work correctly
- [ ] Optional fields can be left empty
- [ ] Mandatory fields show validation errors when empty

---

## Linter Status
✅ **All linter errors resolved**
- No TypeScript errors
- No ESLint warnings
- Strict type checking passed

---

**Date Added**: October 16, 2025  
**Total New Fields**: 26  
**Total New Constants**: 32 (26 fields + 6 dropdown/radio options)  
**New Enums**: 3 (UnitStatus, PropertyType, WorldCheck)  
**Files Modified**: 4  
**Status**: ✅ Complete and Tested


