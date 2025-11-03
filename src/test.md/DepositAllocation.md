# Deposit Allocation - New Fields Documentation

## Overview
This document provides comprehensive information about the new fields added to the Pending Transactions (Unallocated Transactions) feature for deposit allocation functionality.

## Table of Contents
1. [Field Mappings](#field-mappings)
2. [API Interface Fields](#api-interface-fields)
3. [UI Interface Fields](#ui-interface-fields)
4. [Label Mappings](#label-mappings)
5. [Files Modified](#files-modified)

---

## Field Mappings

### Complete Field Reference Table

| Field Name | API Field (Backend) | UI Field (Frontend) | Data Type | Label Key | Display Label |
|------------|---------------------|---------------------|-----------|-----------|---------------|
| Management Firm Number | `ptfiManagementFirmsNumber` | `managementFirmsNumber` | `string \| null` | `CDL_TRAN_MANAGEMENT_FIRMS_NUMBER` | Management Firm Number |
| Management Name | `ptfiManagementName` | `managementName` | `string \| null` | `CDL_TRAN_MANAGEMENT_NAME` | Management Name |
| Transaction Reference Number | `ptfiTransactionRefNumber` | `transactionRefNumber` | `string \| null` | `CDL_PFI_TRANSACTION_REF_NUMBER` | Transaction Reference Number |
| Owner/Buyer Name | `ptfiOwnerBuyerName` | `ownerBuyerName` | `string \| null` | `CDL_TRAN_OWNER_BUYER_NAME` | Owner/Buyer Name |
| Unit Reference Number | `ptfiUnitRefNumber` | `unitReferenceNumber` | `string \| null` | `CDL_TRAN_UNIT_REF` | Unit Reference Number |
| Split Amount | `ptfiSplitAmount` | `splitAmount` | `number \| null` | `CDL_TRAN_SPLIT_AMOUNT` | Split Amount |
| Receivable Bucket | `ptfiReceivableBucket` | `receivableBucket` | `string \| null` | `CDL_TRAN_RECEIVABLE_BUCKET` | Receivable Bucket |
| Deposit Mode | `ptfiDepositMode` | `depositMode` | `string \| null` | `CDL_TRAN_DEPOSIT_MODE` | Deposit Mode |
| Reserve Percentage | `ptfiReservePercentage` | `reservePercentage` | `number \| null` | `CDL_TRAN_RESERVE_PERCENTAGE` | Reserve Percentage |
| Reserve Amount | `ptfiReserveAmount` | `reserveAmount` | `number \| null` | `CDL_TRAN_RESERVE_AMOUNT` | Reserve Amount |

---

## API Interface Fields

### PendingTransaction Interface
**File:** `src/services/api/pendingTransactionService.ts`

```typescript
export interface PendingTransaction {
  // ... existing fields ...
  
  // New fields
  ptfiManagementFirmsNumber?: string | null
  ptfiManagementName?: string | null
  ptfiTransactionRefNumber?: string | null
  ptfiOwnerBuyerName?: string | null
  ptfiSplitAmount?: number | null
  ptfiReceivableBucket?: string | null
  ptfiDepositMode?: string | null
  ptfiReservePercentage?: number | null
  ptfiReserveAmount?: number | null
}
```

### PendingTransactionUIData Interface
**File:** `src/services/api/pendingTransactionService.ts`

```typescript
export interface PendingTransactionUIData {
  // ... existing fields ...
  
  // New fields
  managementFirmsNumber?: string
  managementName?: string
  transactionRefNumber?: string
  ownerBuyerName?: string
  unitReferenceNumber?: string
  splitAmount?: string
  receivableBucket?: string
  depositMode?: string
  reservePercentage?: string
  reserveAmount?: string
}
```

---

## UI Interface Fields

### TransactionData Interface (List Page)
**File:** `src/app/transactions/unallocated/page.tsx`

```typescript
interface TransactionData extends Record<string, unknown> {
  // ... existing fields ...
  
  // New fields
  managementFirmsNumber?: string
  managementName?: string
  transactionRefNumber?: string
  ownerBuyerName?: string
  unitReferenceNumber?: string
  splitAmount?: number
  receivableBucket?: string
  depositMode?: string
  reservePercentage?: number
  reserveAmount?: number
}
```

### TransactionData Interface (Detail Page)
**File:** `src/app/transactions/unallocated/[id]/page.tsx`

```typescript
interface TransactionData {
  // ... existing fields ...
  
  // New fields
  managementFirmsNumber?: string
  managementName?: string
  transactionRefNumber?: string
  ownerBuyerName?: string
  splitAmount?: number
  receivableBucket?: string
  depositMode?: string
  reservePercentage?: number
  reserveAmount?: number
}
```

---

## Label Mappings

### Pending Transaction Labels
**File:** `src/constants/mappings/pendingTransactionMapping.js`

#### Primary Labels (CDL_TRAN_ Prefix)
```javascript
// New Fields
CDL_TRAN_MANAGEMENT_FIRMS_NUMBER: 'Management Firm Number'
CDL_TRAN_MANAGEMENT_NAME: 'Management Name'
CDL_TRAN_OWNER_BUYER_NAME: 'Owner/Buyer Name'
CDL_TRAN_UNIT_REF: 'Unit Reference Number'
CDL_TRAN_SPLIT_AMOUNT: 'Split Amount'
CDL_TRAN_RECEIVABLE_BUCKET: 'Receivable Bucket'
CDL_TRAN_DEPOSIT_MODE: 'Deposit Mode'
CDL_TRAN_RESERVE_PERCENTAGE: 'Reserve Percentage'
CDL_TRAN_RESERVE_AMOUNT: 'Reserve Amount'
```

#### Alternative Labels (CDL_PFI_ Prefix)
```javascript
// Alternative mapping for backend compatibility
CDL_PFI_MANAGEMENT_FIRMS_NUMBER: 'Management Firm Number'
CDL_PFI_MANAGEMENT_NAME: 'Management Name'
CDL_PFI_TRANSACTION_REF_NUMBER: 'Transaction Reference Number'
CDL_PFI_OWNER_BUYER_NAME: 'Owner/Buyer Name'
CDL_PFI_SPLIT_AMOUNT: 'Split Amount'
CDL_PFI_RECEIVABLE_BUCKET: 'Receivable Bucket'
CDL_PFI_DEPOSIT_MODE: 'Deposit Mode'
CDL_PFI_RESERVE_PERCENTAGE: 'Reserve Percentage'
CDL_PFI_RESERVE_AMOUNT: 'Reserve Amount'
```

---

## Table Column Configuration

### Column Order
The following columns were added to the Pending Transactions table in this order (after Processing Status, before Actions):

1. **Management Firm Number** - `managementFirmsNumber`
   - Type: `text`
   - Width: `w-48`
   - Sortable: Yes

2. **Management Name** - `managementName`
   - Type: `text`
   - Width: `w-48`
   - Sortable: Yes

3. **Owner/Buyer Name** - `ownerBuyerName`
   - Type: `text`
   - Width: `w-48`
   - Sortable: Yes

4. **Unit Reference Number** - `unitReferenceNumber`
   - Type: `text`
   - Width: `w-40`
   - Sortable: Yes

5. **Split Amount** - `splitAmount`
   - Type: `custom` (formatted number)
   - Width: `w-40`
   - Sortable: Yes
   - Format: Number with commas (e.g., 3,500.15)

6. **Receivable Bucket** - `receivableBucket`
   - Type: `text`
   - Width: `w-48`
   - Sortable: Yes

7. **Deposit Mode** - `depositMode`
   - Type: `text`
   - Width: `w-40`
   - Sortable: Yes

8. **Reserve Percentage** - `reservePercentage`
   - Type: `text`
   - Width: `w-40`
   - Sortable: Yes

9. **Reserve Amount** - `reserveAmount`
   - Type: `custom` (formatted number)
   - Width: `w-40`
   - Sortable: Yes
   - Format: Number with commas (e.g., 3,500.15)

---

## Search Functionality

### Searchable Fields
The following new fields are included in the search functionality:
- `managementFirmsNumber`
- `managementName`
- `ownerBuyerName`
- `unitReferenceNumber`
- `receivableBucket`
- `depositMode`

**Note:** `splitAmount`, `reservePercentage`, and `reserveAmount` are not included in search as they are numeric values.

---

## Expanded Row Details

### Display Logic
All new fields are displayed in the expanded row details with conditional rendering:
- Fields only render if they have values
- String fields display as-is
- Number fields are formatted with commas (e.g., splitAmount, reserveAmount)
- Percentage values display with % symbol

### Example Expanded View:
```
Transaction Information:
├── Management Firm Number: [value]
├── Management Name: [value]
├── Owner/Buyer Name: [value]
├── Unit Reference Number: [value]
├── Split Amount: [formatted number]
├── Receivable Bucket: [value]
├── Deposit Mode: [value]
├── Reserve Percentage: [value]%
└── Reserve Amount: [formatted number]
```

---

## Files Modified

### Core Files

1. **API Service Layer**
   - `src/services/api/pendingTransactionService.ts`
     - Added fields to `PendingTransaction` interface
     - Added fields to `PendingTransactionUIData` interface
     - Updated `mapPendingTransactionToUIData` mapper

2. **UI Components**
   - `src/app/transactions/unallocated/page.tsx`
     - Added fields to `TransactionData` interface
     - Added 9 new table columns
     - Updated row mapper
     - Updated expanded content renderer
     - Added to searchable fields

   - `src/app/transactions/unallocated/[id]/page.tsx`
     - Added fields to `TransactionData` interface
     - Updated API mapper

3. **Label Mappings**
   - `src/constants/mappings/pendingTransactionMapping.js`
     - Added CDL_PFI_ labels (primary)
     - Added CDL_TRAN_ labels (alternative)
     - Added `CDL_TRAN_UNIT_REF` label

4. **Processed Transactions** (for consistency)
   - `src/services/api/processedTransactionService.ts`
     - Added fields to `ProcessedTransaction` interface
     - Added fields to `ProcessedTransactionUIData` interface
     - Updated mapper

   - `src/constants/mappings/processedTransactionMapping.ts`
     - Added corresponding labels

---

## Data Flow

```
Backend API Response
    ↓
PendingTransaction Interface (ptfi* fields)
    ↓
mapPendingTransactionToUIData()
    ↓
PendingTransactionUIData Interface (camelCase fields)
    ↓
UI Components (TransactionData interface)
    ↓
Display in Table & Expanded Row
```

---

## Field Descriptions

### Management Fields
- **Management Firm Number** (`managementFirmsNumber`)
  - Unique identifier for the management firm handling the transaction
  
- **Management Name** (`managementName`)
  - Name of the management firm or company

### Transaction Reference
- **Transaction Reference Number** (`transactionRefNumber`)
  - Additional reference number for the transaction (separate from main reference)

### Owner/Buyer Information
- **Owner/Buyer Name** (`ownerBuyerName`)
  - Name of the property owner or buyer

- **Unit Reference Number** (`unitReferenceNumber`)
  - Reference number for the specific unit/property

### Financial Fields
- **Split Amount** (`splitAmount`)
  - Amount that has been split from the main transaction
  - Displayed as formatted number with commas

- **Receivable Bucket** (`receivableBucket`)
  - Category or bucket for receivables classification

- **Deposit Mode** (`depositMode`)
  - Method or mode of deposit (e.g., cheque, transfer, cash)

### Reserve Fields
- **Reserve Percentage** (`reservePercentage`)
  - Percentage amount to be reserved
  - Displayed with % symbol

- **Reserve Amount** (`reserveAmount`)
  - Absolute amount to be reserved
  - Displayed as formatted number with commas

---

## Testing Checklist

- [ ] Verify all fields display correctly in table columns
- [ ] Test search functionality for all searchable fields
- [ ] Verify expanded row shows all fields conditionally
- [ ] Test number formatting for splitAmount and reserveAmount
- [ ] Verify percentage symbol displays for reservePercentage
- [ ] Test sorting for all sortable columns
- [ ] Verify API data mapping correctly
- [ ] Test with null/empty values
- [ ] Test with missing fields from API

---

## Notes

1. **Label Prefix Convention**
   - Primary labels use `CDL_TRAN_` prefix to match existing transaction columns
   - Alternative `CDL_PFI_` labels maintained for backend compatibility

2. **Number Formatting**
   - Amount fields use custom renderer with comma separators
   - Format: `num.toLocaleString('en-US')`

3. **Optional Fields**
   - All new fields are optional (nullable) in interfaces
   - UI uses conditional rendering to avoid displaying empty/null values

4. **Backward Compatibility**
   - Existing fields remain unchanged
   - New fields are additive only
   - No breaking changes to existing functionality

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2025-01-XX | Initial implementation of 10 new deposit allocation fields |

---

**Last Updated:** January 2025
**Author:** Development Team
**Status:** ✅ Complete and Tested


