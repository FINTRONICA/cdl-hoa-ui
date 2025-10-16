# Owner Mapping Implementation Summary

## Overview
This document summarizes the implementation of Owner-related constants and mappings, replacing "Investor" with "Owner" throughout the system.

## Created Files

### 1. `/src/constants/mappings/ownerMapping.ts`
**Purpose**: Main label mapping file for all Owner-related constants

**Key Features**:
- All constants use the `CDL_OWN_` prefix
- Each constant includes detailed comments with:
  - Data type (string, number, date)
  - Field type (text field, dropdown, calendar)
  - Input type (user input, user selection)
  - Validation rules (mandatory/optional, length constraints)
- Includes 28 field mappings covering:
  - Basic owner information
  - Identification details
  - Contact information
  - Joint owners (up to 5 additional owners)

**Example Constants**:
```typescript
'CDL_OWN_OWNER_NAME_ENGLISH': 'Owner Name (English)' 
// string, text field, user input, mandatory (alphabets), alphabet (50,0)

'CDL_OWN_ID_TYPE': 'Owner ID Type' 
// string, dropdown, user selection, mandatory, dropdown values: Passport, Emirates ID, Trade License
```

**Utility Functions**:
- `getOwnerLabel(configId: string)`: Get label by config ID
- `getOwnerLabelsByCategory(category: string)`: Get labels grouped by category

**Categories**:
- `basic_info`: Basic owner information
- `identification`: ID and documentation
- `contact`: Contact details
- `owner_type`: Owner type classification
- `location`: Location-related fields
- `joint_owner_2` through `joint_owner_5`: Joint ownership details

---

### 2. `/src/constants/mappings/types/owner.ts`
**Purpose**: TypeScript interfaces and enums for Owner data

**Key Components**:
- `OwnerData` interface: Complete owner data structure with all 28 fields
- `OwnerIdType` enum: ID type options (Passport, Emirates ID, Trade License)
- `OwnerType` enum: Owner type options (Joint, Company, Individual)

**Features**:
- All fields include inline comments with data types and validation rules
- Optional fields marked with `?`
- Supports up to 5 joint owners

---

### 3. `/src/constants/mappings/ownerMapper.ts`
**Purpose**: Maps API responses to UI-friendly data structures

**Key Components**:
- `OwnerResponse` interface: API response structure
- `OwnerUIData` interface: UI data structure
- `mapOwnerResponseToOwnerData()`: Mapping function with error handling

**Features**:
- Safe fallback values for missing data
- Status mapping from API task status
- Comprehensive error handling with console logging
- All fields include inline comments

---

### 4. `/src/constants/mappings/OWNER_FIELDS_REFERENCE.md`
**Purpose**: Comprehensive documentation for all Owner fields

**Contents**:
- Detailed field-by-field documentation
- Each field includes:
  - Constant name
  - Label text
  - Data type
  - Field type
  - Input type
  - Complete validation rules
- Usage examples
- Data type reference table
- Categories explanation

---

### 5. Updated `/src/constants/index.ts`
**Changes**:
- Added `owner: 'owner'` to `USER_ROLES`
- Added `OWNER: 'OwnerUpload.xlsx'` to `TEMPLATE_FILES`
- Exported all owner-related mappings and types:
  ```typescript
  export { OWNER_LABELS, getOwnerLabel, getOwnerLabelsByCategory }
  export { mapOwnerResponseToOwnerData }
  export type { OwnerData, OwnerIdType, OwnerType }
  export type { OwnerResponse, OwnerUIData }
  ```

---

## Field Mappings Summary

| # | Field Name | Constant | Data Type | Field Type | Mandatory/Optional |
|---|------------|----------|-----------|------------|-------------------|
| 1 | Owner Name (English) | `CDL_OWN_OWNER_NAME_ENGLISH` | string | Text Field | Mandatory |
| 2 | Owner Name (Arabic) | `CDL_OWN_OWNER_NAME_ARABIC` | string | Text Field | Optional |
| 3 | Ownership Percentage | `CDL_OWN_OWNERSHIP_PERCENTAGE` | number | Text Field | Optional |
| 4 | Owner ID Type | `CDL_OWN_ID_TYPE` | string | Dropdown | Mandatory |
| - | Reserve Percentage | `CDL_OWN_RESERVE_PERCENTAGE` | number | Text Field | Optional |
| 5 | ID Expiry Date | `CDL_OWN_ID_EXPIRY_DATE` | date | Calendar | Optional |
| 6 | ID Number | `CDL_OWN_ID_NUMBER` | string | Text Field | Mandatory |
| - | Owner/unit Mollak ID | `CDL_OWN_UNIT_MOLLAK_ID` | string | Text Field | Optional |
| 7 | Owner Contact No | `CDL_OWN_CONTACT_NO` | string | Text Field | Mandatory |
| 8 | Owner Type | `CDL_OWN_TYPE` | string | Dropdown | Mandatory |
| 9 | Nationality | `CDL_OWN_NATIONALITY` | string | Dropdown | Optional |
| 10 | Owner Email Address | `CDL_OWN_EMAIL` | string | Text Field | Optional |
| 11 | Floor | `CDL_OWN_FLOOR` | string | Text Field | Optional |
| 12 | No of Bedroom | `CDL_OWN_NO_OF_BEDROOM` | string | Text Field | Optional |
| 13-16 | Joint Owner 2 Fields | `CDL_OWN_JOINT_OWNER_2_*` | various | various | Conditional/Optional |
| 17-20 | Joint Owner 3 Fields | `CDL_OWN_JOINT_OWNER_3_*` | various | various | Optional |
| 21-24 | Joint Owner 4 Fields | `CDL_OWN_JOINT_OWNER_4_*` | various | various | Optional |
| 25-28 | Joint Owner 5 Fields | `CDL_OWN_JOINT_OWNER_5_*` | various | various | Optional |

---

## Usage Examples

### 1. Using Owner Labels
```typescript
import { OWNER_LABELS } from '@/constants/mappings/ownerMapping'

const label = OWNER_LABELS.CDL_OWN_OWNER_NAME_ENGLISH
// Output: "Owner Name (English)"
```

### 2. Using Utility Functions
```typescript
import { getOwnerLabel, getOwnerLabelsByCategory } from '@/constants/mappings/ownerMapping'

// Get single label
const label = getOwnerLabel('CDL_OWN_OWNER_NAME_ENGLISH')

// Get labels by category
const basicInfoLabels = getOwnerLabelsByCategory('basic_info')
```

### 3. Using Owner Types
```typescript
import { OwnerData, OwnerIdType, OwnerType } from '@/constants/mappings/types/owner'

const ownerData: OwnerData = {
  owner: 'John Doe',
  ownerId: 'OWN-001',
  idType: OwnerIdType.PASSPORT,
  idNumber: 'AB123456',
  contactNo: '+971501234567',
  ownerType: OwnerType.INDIVIDUAL,
  // ... other fields
}
```

### 4. Mapping API Responses
```typescript
import { mapOwnerResponseToOwnerData } from '@/constants/mappings/ownerMapper'
import type { OwnerResponse } from '@/constants/mappings/ownerMapper'

const apiResponse: OwnerResponse = {
  id: 1,
  ownerName: 'John Doe',
  // ... other API fields
}

const uiData = mapOwnerResponseToOwnerData(apiResponse)
```

---

## Validation Rules Summary

### Text Length Constraints
- Alphabet fields: `(50,0)` - 50 characters max
- Alphanumeric fields: `(20,0)` or `(15,0)` - 20 or 15 characters max
- Email: `(50,0)` - 50 characters max

### Special Validations
- **Owner Name (English)**: Alphabets only, mandatory
- **Owner Name (Arabic)**: Arabic alphabets only, optional
- **Ownership Percentage**: Percentage format `(3,2)` - 3 digits, 2 decimals
- **ID Expiry Date**: Cannot be a past date
- **Joint Owner 2 Name**: Mandatory only if Owner Type is "Joint"

### Dropdown Options

**Owner ID Type**:
- Passport
- Emirates ID
- Trade License

**Owner Type**:
- Joint
- Company
- Individual

**Nationality**: Standard list of all countries

---

## Key Changes from Investor to Owner

1. **Prefix Change**: `CDL_INV_*` → `CDL_OWN_*`
2. **Label Text**: "Investor" → "Owner"
3. **File Names**: 
   - `investorMapping.ts` → `ownerMapping.ts`
   - `investor.ts` → `owner.ts`
   - `investorMapper.ts` → `ownerMapper.ts`
4. **Interface Names**: `InvestorData` → `OwnerData`
5. **Function Names**: `mapInvestorToData` → `mapOwnerResponseToOwnerData`
6. **Template File**: `InvesterUpload.xlsx` → `OwnerUpload.xlsx`
7. **User Role**: Added `owner: 'owner'` alongside existing `investor: 'investor'`

---

## Integration Points

### Where to Use These Constants

1. **Form Components**: Use `OWNER_LABELS` for form field labels
2. **Validation**: Reference the inline comments for validation rules
3. **API Integration**: Use `mapOwnerResponseToOwnerData` to transform API responses
4. **TypeScript Types**: Import `OwnerData` for type safety
5. **Dropdowns**: Use `OwnerIdType` and `OwnerType` enums for dropdown options

### Example Component Integration
```typescript
import { OWNER_LABELS, OwnerData, OwnerType } from '@/constants'

export const OwnerForm = () => {
  return (
    <form>
      <label>{OWNER_LABELS.CDL_OWN_OWNER_NAME_ENGLISH}</label>
      <input type="text" maxLength={50} required />
      
      <label>{OWNER_LABELS.CDL_OWN_TYPE}</label>
      <select required>
        <option value={OwnerType.INDIVIDUAL}>Individual</option>
        <option value={OwnerType.COMPANY}>Company</option>
        <option value={OwnerType.JOINT}>Joint</option>
      </select>
      
      {/* More fields... */}
    </form>
  )
}
```

---

## Notes

- All linter checks passed with no errors
- TypeScript types are fully typed and exported
- Comments follow the format: `// data_type, field_type, validation_rules`
- The existing `investor.ts` file remains for backward compatibility
- All constants are immutable using `as const`

---

## Next Steps

1. **Update UI Components**: Replace investor references with owner constants
2. **Update API Services**: Use owner mapper functions for data transformation
3. **Update Forms**: Implement validation rules as specified in comments
4. **Testing**: Test all owner-related forms and data flows
5. **Migration**: Consider gradual migration from investor to owner terminology
6. **Documentation**: Share the OWNER_FIELDS_REFERENCE.md with the team

---

**Date Created**: October 16, 2025  
**Status**: ✅ Complete  
**Files Modified**: 2  
**Files Created**: 4


