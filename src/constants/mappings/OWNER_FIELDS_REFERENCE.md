# Owner Fields Reference

This document provides a comprehensive reference for all Owner-related fields, replacing "Investor" with "Owner" throughout the application.

## Owner Label Mappings

All owner-related labels use the prefix `CDL_OWN_` followed by a descriptive identifier.

---

## Field Definitions

### 1. Owner Name (English)
- **Constant**: `CDL_OWN_OWNER_NAME_ENGLISH`
- **Label**: "Owner Name (English)"
- **Data Type**: String
- **Field Type**: Text Field
- **Input Type**: User Input
- **Validation Rules**:
  1. Mandatory (Alphabets)
  2. Alphabet (50,0)

---

### 2. Owner Name (Arabic)
- **Constant**: `CDL_OWN_OWNER_NAME_ARABIC`
- **Label**: "Owner Name (Arabic)"
- **Data Type**: String
- **Field Type**: Text Field
- **Input Type**: User Input
- **Validation Rules**:
  1. Optional (Arabic Alphabets only)
  2. Arabic Alphabets (50,0)

---

### 3. Ownership Percentage
- **Constant**: `CDL_OWN_OWNERSHIP_PERCENTAGE`
- **Label**: "Ownership Percentage"
- **Data Type**: Number
- **Field Type**: Text Field
- **Input Type**: User Input
- **Validation Rules**:
  1. Optional
  2. Percentage (3,2)

---

### 4. Owner ID Type
- **Constant**: `CDL_OWN_ID_TYPE`
- **Label**: "Owner ID Type"
- **Data Type**: String
- **Field Type**: Dropdown
- **Input Type**: User Selection
- **Validation Rules**:
  1. Mandatory
  2. Dropdown values:
     - `CDL_OWN_ID_TYPE_PASSPORT`: "Passport"
     - `CDL_OWN_ID_TYPE_EMIRATES_ID`: "Emirates ID"
     - `CDL_OWN_ID_TYPE_TRADE_LICENSE`: "Trade License"

---

### Reserve Percentage
- **Constant**: `CDL_OWN_RESERVE_PERCENTAGE`
- **Label**: "Reserve Percentage"
- **Data Type**: Number
- **Field Type**: Text Field
- **Input Type**: User Input
- **Validation Rules**:
  1. Optional
  2. If provided, System to consider "Reserve Percentage" at owner level

---

### 5. ID Expiry Date
- **Constant**: `CDL_OWN_ID_EXPIRY_DATE`
- **Label**: "ID Expiry Date"
- **Data Type**: Date
- **Field Type**: Calendar
- **Input Type**: User Selection
- **Validation Rules**:
  1. Optional
  2. Cannot be a past date

---

### 6. ID Number
- **Constant**: `CDL_OWN_ID_NUMBER`
- **Label**: "ID Number"
- **Data Type**: String
- **Field Type**: Text Field
- **Input Type**: User Input
- **Validation Rules**:
  1. Mandatory
  2. Alphanumeric (20,0)

---

### Owner/unit Mollak ID
- **Constant**: `CDL_OWN_UNIT_MOLLAK_ID`
- **Label**: "Owner/unit Mollak ID"
- **Data Type**: String
- **Field Type**: Text Field
- **Input Type**: User Input
- **Validation Rules**:
  1. Optional
  2. Alphanumeric (20,0)

---

### 7. Owner Contact No
- **Constant**: `CDL_OWN_CONTACT_NO`
- **Label**: "Owner Contact no"
- **Data Type**: String
- **Field Type**: Text Field
- **Input Type**: User Input
- **Validation Rules**:
  1. Mandatory
  2. Alphanumeric (-20,0)

---

### 8. Owner Type
- **Constant**: `CDL_OWN_TYPE`
- **Label**: "Owner Type"
- **Data Type**: String
- **Field Type**: Dropdown
- **Input Type**: User Selection
- **Validation Rules**:
  1. Mandatory
  2. Dropdown values:
     - `CDL_OWN_TYPE_JOINT`: "Joint"
     - `CDL_OWN_TYPE_COMPANY`: "Company"
     - `CDL_OWN_TYPE_INDIVIDUAL`: "Individual"

---

### 9. Nationality
- **Constant**: `CDL_OWN_NATIONALITY`
- **Label**: "Nationality"
- **Data Type**: String
- **Field Type**: Dropdown
- **Input Type**: User Selection
- **Validation Rules**:
  1. Optional
  2. Dropdown values: Standard list of all countries

---

### 10. Owner Email Address
- **Constant**: `CDL_OWN_EMAIL`
- **Label**: "Owner Email Address"
- **Data Type**: String
- **Field Type**: Text Field
- **Input Type**: User Input
- **Validation Rules**:
  1. Optional
  2. All characters (50,0)

---

### 11. Floor
- **Constant**: `CDL_OWN_FLOOR`
- **Label**: "Floor"
- **Data Type**: String
- **Field Type**: Text Field
- **Input Type**: User Input
- **Validation Rules**:
  1. Optional
  2. Alphanumeric (15,0)

---

### 12. No of Bedroom
- **Constant**: `CDL_OWN_NO_OF_BEDROOM`
- **Label**: "No of Bedroom"
- **Data Type**: String
- **Field Type**: Text Field
- **Input Type**: User Input
- **Validation Rules**:
  1. Optional
  2. Alphanumeric (15,0)

---

## Joint Owner 2 Fields

### 13. Joint Owner 2 Name
- **Constant**: `CDL_OWN_JOINT_OWNER_2_NAME`
- **Label**: "Joint Owner 2 Name"
- **Data Type**: String
- **Field Type**: Text Field
- **Input Type**: User Input
- **Validation Rules**:
  1. Mandatory only if Owner type is Joint
  2. Alphanumeric (50,0)

---

### 14. Nationality of Joint Owner 2
- **Constant**: `CDL_OWN_JOINT_OWNER_2_NATIONALITY`
- **Label**: "Nationality of Joint owner 2"
- **Data Type**: String
- **Field Type**: Dropdown
- **Input Type**: User Selection
- **Validation Rules**:
  1. Optional
  2. Dropdown values: Standard list of all countries

---

### 15. ID NO of Joint Owner 2
- **Constant**: `CDL_OWN_JOINT_OWNER_2_ID_NO`
- **Label**: "ID NO of Joint Owner 2"
- **Data Type**: String
- **Field Type**: Text Field
- **Input Type**: User Input
- **Validation Rules**:
  1. Non-Mandatory
  2. Text length 15

---

### 16. (ID) Date of Expiry of Joint Owner 2
- **Constant**: `CDL_OWN_JOINT_OWNER_2_ID_EXPIRY`
- **Label**: "(ID) Date of Expiry of Joint Owner 2"
- **Data Type**: Date
- **Field Type**: Calendar
- **Input Type**: Calendar
- **Validation Rules**:
  1. Optional
  2. Cannot be a past date

---

## Joint Owner 3 Fields

### 17. Joint Owner 3 Name
- **Constant**: `CDL_OWN_JOINT_OWNER_3_NAME`
- **Label**: "Joint Owner 3 Name"
- **Data Type**: String
- **Field Type**: Text Field
- **Input Type**: User Input
- **Validation Rules**:
  1. Optional
  2. Alphanumeric (50,0)

---

### 18. Nationality of Joint Owner 3
- **Constant**: `CDL_OWN_JOINT_OWNER_3_NATIONALITY`
- **Label**: "Nationality of Joint owner 3"
- **Data Type**: String
- **Field Type**: Dropdown
- **Input Type**: User Selection
- **Validation Rules**:
  1. Optional
  2. Dropdown values: Standard list of all countries

---

### 19. ID NO of Joint Owner 3
- **Constant**: `CDL_OWN_JOINT_OWNER_3_ID_NO`
- **Label**: "ID NO of Joint Owner 3"
- **Data Type**: String
- **Field Type**: Text Field
- **Input Type**: User Input
- **Validation Rules**:
  1. Optional
  2. Alphanumeric (20,0)

---

### 20. (ID) Date of Expiry of Joint Owner 3
- **Constant**: `CDL_OWN_JOINT_OWNER_3_ID_EXPIRY`
- **Label**: "(ID) Date of Expiry of Joint Owner 3"
- **Data Type**: Date
- **Field Type**: Calendar
- **Input Type**: Calendar
- **Validation Rules**:
  1. Optional
  2. Cannot be a past date

---

## Joint Owner 4 Fields

### 21. Joint Owner 4 Name
- **Constant**: `CDL_OWN_JOINT_OWNER_4_NAME`
- **Label**: "Joint Owner 4 Name"
- **Data Type**: String
- **Field Type**: Text Field
- **Input Type**: User Input
- **Validation Rules**:
  1. Optional
  2. Alphanumeric (50,0)

---

### 22. Nationality of Joint Owner 4
- **Constant**: `CDL_OWN_JOINT_OWNER_4_NATIONALITY`
- **Label**: "Nationality of Joint owner 4"
- **Data Type**: String
- **Field Type**: Dropdown
- **Input Type**: User Selection
- **Validation Rules**:
  1. Optional
  2. Dropdown values: Standard list of all countries

---

### 23. ID NO of Joint Owner 4
- **Constant**: `CDL_OWN_JOINT_OWNER_4_ID_NO`
- **Label**: "ID NO of Joint Owner 4"
- **Data Type**: String
- **Field Type**: Text Field
- **Input Type**: User Input
- **Validation Rules**:
  1. Optional
  2. Alphanumeric (20,0)

---

### 24. (ID) Date of Expiry of Joint Owner 4
- **Constant**: `CDL_OWN_JOINT_OWNER_4_ID_EXPIRY`
- **Label**: "(ID) Date of Expiry of Joint Owner 4"
- **Data Type**: Date
- **Field Type**: Calendar
- **Input Type**: Calendar
- **Validation Rules**:
  1. Optional
  2. Cannot be a past date

---

## Joint Owner 5 Fields

### 25. Joint Owner 5 Name
- **Constant**: `CDL_OWN_JOINT_OWNER_5_NAME`
- **Label**: "Joint Owner 5 Name"
- **Data Type**: String
- **Field Type**: Text Field
- **Input Type**: User Input
- **Validation Rules**:
  1. Optional
  2. Alphanumeric (50,0)

---

### 26. Nationality of Joint Owner 5
- **Constant**: `CDL_OWN_JOINT_OWNER_5_NATIONALITY`
- **Label**: "Nationality of Joint owner 5"
- **Data Type**: String
- **Field Type**: Dropdown
- **Input Type**: User Selection
- **Validation Rules**:
  1. Optional
  2. Dropdown values: Standard list of all countries

---

### 27. ID NO of Joint Owner 5
- **Constant**: `CDL_OWN_JOINT_OWNER_5_ID_NO`
- **Label**: "ID NO of Joint Owner 5"
- **Data Type**: String
- **Field Type**: Text Field
- **Input Type**: User Input
- **Validation Rules**:
  1. Optional
  2. Alphanumeric (20,0)

---

### 28. (ID) Date of Expiry of Joint Owner 5
- **Constant**: `CDL_OWN_JOINT_OWNER_5_ID_EXPIRY`
- **Label**: "(ID) Date of Expiry of Joint Owner 5"
- **Data Type**: Date
- **Field Type**: Calendar
- **Input Type**: Calendar
- **Validation Rules**:
  1. Optional
  2. Cannot be a past date

---

## Usage Example

```typescript
import { OWNER_LABELS, getOwnerLabel } from '@/constants/mappings/ownerMapping'

// Using the constant directly
const label = OWNER_LABELS.CDL_OWN_OWNER_NAME_ENGLISH // "Owner Name (English)"

// Using the utility function
const dynamicLabel = getOwnerLabel('CDL_OWN_OWNER_NAME_ENGLISH') // "Owner Name (English)"

// Getting labels by category
import { getOwnerLabelsByCategory } from '@/constants/mappings/ownerMapping'
const basicInfoLabels = getOwnerLabelsByCategory('basic_info')
```

## Data Type Reference

| TypeScript Type | Description | Validation Example |
|----------------|-------------|-------------------|
| `string` | Text/alphanumeric | Length constraints (50,0) |
| `number` | Numeric values | Percentage (3,2) = 3 digits, 2 decimals |
| `date` | Date values | Cannot be past date |
| `dropdown` | Predefined options | Must match dropdown values |

## Categories

The owner fields are organized into the following categories:
- `basic_info`: Basic owner information
- `identification`: ID and documentation
- `contact`: Contact details
- `owner_type`: Owner type classification
- `location`: Location-related fields
- `joint_owner_2` through `joint_owner_5`: Joint ownership details

---

**Note**: All "Investor" references have been replaced with "Owner" throughout the system.


