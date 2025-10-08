# API Interface Changes Guide
**Owner Registry Label Migration: CDL_CP → CDL_OWR**

---

## Overview

This document details all interface changes related to the Owner Registry label migration. It's crucial to understand that **backend API contracts remain unchanged** - only frontend label references have been updated.

---

## Table of Contents

1. [Label Interface Changes](#label-interface-changes)
2. [API Request/Response Interfaces](#api-requestresponse-interfaces)
3. [Frontend-Only Changes](#frontend-only-changes)
4. [Migration Impact Matrix](#migration-impact-matrix)
5. [Code Examples](#code-examples)

---

## Label Interface Changes

### Label Mapping Interface

**File**: `src/constants/mappings/capitalPartnerMapping.js`

#### Complete Label Mapping Changes

| Old Label Key | New Label Key | Label Value |
|---------------|---------------|-------------|
| `CDL_CP` | `CDL_OWR` | Owner Registry |
| `CDL_CP_NEW` | `CDL_OWR_NEW` | Register New Owner Registry |
| `CDL_CP_BASIC_INFO` | `CDL_OWR_BASIC_INFO` | Owner Registry Basic Information |
| `CDL_CP_TYPE` | `CDL_OWR_TYPE` | Owner Registry Type |
| `CDL_CP_FIRSTNAME` | `CDL_OWR_FIRSTNAME` | (empty string) |
| `CDL_CP_REFID` | `CDL_OWR_REFID` | Owner Registry Reference ID |
| `CDL_CP_MIDDLENAME` | `CDL_OWR_MIDDLENAME` | Middle Name |
| `CDL_CP_LASTNAME` | `CDL_OWR_LASTNAME` | Last Name |
| `CDL_CP_LOCALE_NAME` | `CDL_OWR_LOCALE_NAME` | Local Language Name |
| `CDL_CP_OWNERSHIP` | `CDL_OWR_OWNERSHIP` | Ownership Share (%) |
| `CDL_CP_ID_TYPE` | `CDL_OWR_ID_TYPE` | Identification Document Type |
| `CDL_CP_DOC_NO` | `CDL_OWR_DOC_NO` | Identification Document Number |
| `CDL_CP_ID_EXP` | `CDL_OWR_ID_EXP` | Identification Expiry Date |
| `CDL_CP_NATIONALITY` | `CDL_OWR_NATIONALITY` | Nationality |
| `CDL_CP_TELEPHONE` | `CDL_OWR_TELEPHONE` | Account Contact Telephone |
| `CDL_CP_MOBILE` | `CDL_OWR_MOBILE` | Primary Mobile Number |
| `CDL_CP_EMAIL` | `CDL_OWR_EMAIL` | Owner Registry Email Address |

### Unit Details Labels

| Old Label Key | New Label Key | Label Value |
|---------------|---------------|-------------|
| `CDL_CP_UNIT_DETAILS` | `CDL_OWR_UNIT_DETAILS` | Asset Unit Details |
| `CDL_CP_FLOOR` | `CDL_OWR_FLOOR` | Floor Number |
| `CDL_CP_NOOF_BED` | `CDL_OWR_NOOF_BED` | Number of Bedrooms |
| `CDL_CP_UNIT_NUMBER` | `CDL_OWR_UNIT_NUMBER` | Unit Number (Oqood Format) |
| `CDL_CP_UNIT_STATUS` | `CDL_OWR_UNIT_STATUS` | Unit Status |
| `CDL_CP_BUILDING_NAME` | `CDL_OWR_BUILDING_NAME` | Building Name |
| `CDL_CP_PLOT_SIZE` | `CDL_OWR_PLOT_SIZE` | Plot Size (sq. m./sq. ft.) |
| `CDL_CP_PROP_NUMBER` | `CDL_OWR_PROP_NUMBER` | Property Identification Number |
| `CDL_CP_UNIT_IBAN` | `CDL_OWR_UNIT_IBAN` | Unit IBAN |
| `CDL_CP_REG_FEE` | `CDL_OWR_REG_FEE` | Unit Registration Fee |
| `CDL_CP_AGENT_NAME` | `CDL_OWR_AGENT_NAME` | Agent Full Name |
| `CDL_CP_AGENT_ID` | `CDL_OWR_AGENT_ID` | Agent National Identification Number |

### Pricing & Legal Labels

| Old Label Key | New Label Key | Label Value |
|---------------|---------------|-------------|
| `CDL_CP_NET_PRICE` | `CDL_OWR_NET_PRICE` | Net Sale Price |
| `CDL_CP_GROSS_PRICE` | `CDL_OWR_GROSS_PRICE` | Gross Sale Price |
| `CDL_CP_VAT_APPLICABLE` | `CDL_OWR_VAT_APPLICABLE` | VAT Applicability |
| `CDL_CP_DEED_REF_NO` | `CDL_OWR_DEED_REF_NO` | Deed Reference Number |
| `CDL_CP_CONTRACT_NO` | `CDL_OWR_CONTRACT_NO` | Contract Number |
| `CDL_CP_AGREEMENT_DATE` | `CDL_OWR_AGREEMENT_DATE` | Agreement Execution Date |
| `CDL_CP_SPA` | `CDL_OWR_SPA` | Sale & Purchase Agreement (SPA) |

### Payment & Banking Labels

| Old Label Key | New Label Key | Label Value |
|---------------|---------------|-------------|
| `CDL_CP_PAYMENT_PLAN` | `CDL_OWR_PAYMENT_PLAN` | Asset Payment Plan |
| `CDL_CP_SEQ_NO` | `CDL_OWR_SEQ_NO` | Installment Sequence Number |
| `CDL_CP_DUE_DATE` | `CDL_OWR_DUE_DATE` | Installment Due Date |
| `CDL_CP_BOOKING_AMOUNT` | `CDL_OWR_BOOKING_AMOUNT` | Initial Booking Payment |
| `CDL_CP_BANK_DETAILS` | `CDL_OWR_BANK_DETAILS` | Banking & Payment Details |
| `CDL_CP_PAY_MODE` | `CDL_OWR_PAY_MODE` | Payment Method |
| `CDL_CP_ACCOUNT_NUMBER` | `CDL_OWR_ACCOUNT_NUMBER` | Bank Account Number |
| `CDL_CP_PAYEE_NAME` | `CDL_OWR_PAYEE_NAME` | Payee Full Name |
| `CDL_CP_PAYEE_ADDRESS` | `CDL_OWR_PAYEE_ADDRESS` | Payee Address |
| `CDL_CP_BANK_NAME` | `CDL_OWR_BANK_NAME` | Bank Name |
| `CDL_CP_BANK_ADDRESS` | `CDL_OWR_BANK_ADDRESS` | Bank Address |
| `CDL_CP_ROUTING_CODE` | `CDL_OWR_ROUTING_CODE` | Routing Number |
| `CDL_CP_BIC_CODE` | `CDL_OWR_BIC_CODE` | SWIFT / BIC Code |

### Additional Payment Information

| Old Label Key | New Label Key | Label Value |
|---------------|---------------|-------------|
| `CDL_CP_WITH_ESCROW` | `CDL_OWR_WITH_ESCROW` | Amount Paid to Build Partner (Within Escrow) |
| `CDL_CP_OUTSIDE_ESCROW` | `CDL_OWR_OUTSIDE_ESCROW` | Amount Paid to Build Partner (Outside Escrow) |
| `CDL_CP_PARTNER_PAYMENT` | `CDL_OWR_PARTNER_PAYMENT` | Total Owner Registry Payment |
| `CDL_CP_BOOKING` | `CDL_OWR_BOOKING` | Reservation & Booking Form |
| `CDL_CP_OQOOD_STATUS` | `CDL_OWR_OQOOD_STATUS` | Oqood Paid Status |
| `CDL_CP_OQOOD_PAID` | `CDL_OWR_OQOOD_PAID` | Oqood Amount Paid |
| `CDL_CP_UNIT_AREA` | `CDL_OWR_UNIT_AREA` | Unit Area Measurement |
| `CDL_CP_FORFEIT_AMT` | `CDL_OWR_FORFEIT_AMT` | Forfeited Amount |
| `CDL_CP_DLD_FEE` | `CDL_OWR_DLD_FEE` | Dubai Land Department Fee |
| `CDL_CP_REFUND_AMOUNT` | `CDL_OWR_REFUND_AMOUNT` | Refund Amount |
| `CDL_CP_REMARKS` | `CDL_OWR_REMARKS` | Additional Remarks |
| `CDL_CP_TRANS_AMT` | `CDL_OWR_TRANS_AMT` | Transferred Amount |

### New Labels Added

| Label Key | Label Value |
|-----------|-------------|
| `CDL_OWR_BP_NAME` | Build Partner Name |
| `CDL_OWR_BP_ID` | Build Partner ID |
| `CDL_OWR_BP_CIF` | Build Partner CIF |
| `CDL_OWR_BPA_NAME` | Project Name |
| `CDL_OWR_BPA_CIF` | Project CIF |
| `CDL_OWR_DOCUMENTS` | Documents |
| `CDL_OWR_REVIEW` | Review |
| `CDL_OWR_ADD_PAYMENT_PLAN` | Add Payment Plan |
| `CDL_OWR_INSTALLMENT_NUMBER` | Installment Number |
| `CDL_OWR_INSTALLMENT_DATE` | Installment Date |
| `CDL_OWR_ACTION` | Action |
| `CDL_OWR_AMOUNT` | Amount |
| `CDL_OWR_PROJECT_NAME` | Project Name |
| `CDL_OWR_APPROVAL_STATUS` | Approval Status |
| `CDL_OWR_SALES_PURCHASE_AGREEMENT` | Sales Purchase Agreement |
| `CDL_OWR_PROJECT_PAYMENT_PLAN` | Project Payment Plan |
| `CDL_OWR_MODIFICATION_FEE_NEEDED` | Modification Fee Needed |
| `CDL_OWR_RESERVATION_BOOKING_FORM` | Reservation Booking Form |
| `CDL_OWR_BENEFICIARY_ROUTING_CODE` | Beneficiary Routing Code |

---

## API Request/Response Interfaces

### ⚠️ IMPORTANT: No Changes to API Contracts

All API interfaces remain **100% unchanged**. The migration only affects UI label display.

### Capital Partner Service Interfaces

#### Request DTO - UNCHANGED ✅
```typescript
export interface CapitalPartnerRequest {
  capitalPartnerId: string              // ✅ No change
  capitalPartnerName: string             // ✅ No change
  capitalPartnerMiddleName?: string      // ✅ No change
  capitalPartnerLastName: string         // ✅ No change
  capitalPartnerOwnershipPercentage?: number  // ✅ No change
  capitalPartnerIdNo?: string            // ✅ No change
  capitalPartnerTelephoneNo?: string     // ✅ No change
  capitalPartnerMobileNo?: string        // ✅ No change
  capitalPartnerEmail?: string           // ✅ No change
  capitalPartnerOwnerNumber?: number     // ✅ No change
  isCurrent?: boolean                    // ✅ No change
  idExpiaryDate?: string                 // ✅ No change
  capitalPartnerLocaleName?: string      // ✅ No change
  documentTypeDTO?: OptionDTO            // ✅ No change
  countryOptionDTO?: OptionDTO           // ✅ No change
  investorTypeDTO?: OptionDTO            // ✅ No change
  capitalPartnerBankInfoDTOS?: any[]     // ✅ No change
  capitalPartnerUnitDTO?: any            // ✅ No change
  deleted?: boolean                      // ✅ No change
  taskStatusDTO?: TaskStatusDTO | null   // ✅ No change
}
```

#### Response DTO - UNCHANGED ✅
```typescript
export interface CapitalPartnerResponse {
  id: number                              // ✅ No change
  capitalPartnerId: string                // ✅ No change
  capitalPartnerName: string              // ✅ No change
  capitalPartnerMiddleName: string        // ✅ No change
  capitalPartnerLastName: string          // ✅ No change
  capitalPartnerOwnershipPercentage: number  // ✅ No change
  capitalPartnerIdNo: string              // ✅ No change
  capitalPartnerTelephoneNo: string       // ✅ No change
  capitalPartnerMobileNo: string          // ✅ No change
  capitalPartnerEmail: string             // ✅ No change
  capitalPartnerOwnerNumber: number       // ✅ No change
  isCurrent: boolean                      // ✅ No change
  idExpiaryDate: string                   // ✅ No change
  capitalPartnerLocaleName: string        // ✅ No change
  capitalPartnerUnitDTO: any              // ✅ No change
  documentTypeDTO: OptionDTO              // ✅ No change
  countryOptionDTO: OptionDTO             // ✅ No change
  investorTypeDTO: OptionDTO              // ✅ No change
  taskStatusDTO: TaskStatusDTO | null     // ✅ No change
}
```

### Unit Service Interfaces - UNCHANGED ✅

```typescript
export interface CapitalPartnerUnitRequest {
  unitRefId?: string                      // ✅ No change
  altUnitRefId?: string                   // ✅ No change
  name?: string                           // ✅ No change
  isResale?: boolean                      // ✅ No change
  resaleDate?: string                     // ✅ No change
  unitSysId?: string                      // ✅ No change
  otherFormatUnitNo?: string              // ✅ No change
  virtualAccNo?: string                   // ✅ No change
  towerName?: string                      // ✅ No change
  unitPlotSize?: string                   // ✅ No change
  floor?: string                          // ✅ No change
  noofBedroom?: string                    // ✅ No change
  // ... all other fields unchanged
}
```

### Bank Info Interfaces - UNCHANGED ✅

```typescript
export interface CapitalPartnerBankInfoRequest {
  cpbiPayeeName?: string                  // ✅ No change
  cpbiPayeeAddress?: string               // ✅ No change
  cpbiBankName?: string                   // ✅ No change
  cpbiBankAddress?: string                // ✅ No change
  cpbiBicCode?: string                    // ✅ No change
  cpbiBeneRoutingCode?: string            // ✅ No change
  cpbiAccountNumber?: string              // ✅ No change
  cpbiIban?: string                       // ✅ No change
  // ... all other fields unchanged
}
```

### Payment Plan Interfaces - UNCHANGED ✅

```typescript
export interface CapitalPartnerPaymentPlanRequest {
  cpppInstallmentNumber?: number          // ✅ No change
  cpppInstallmentDate?: string            // ✅ No change
  cpppBookingAmount?: number              // ✅ No change
  capitalPartnerDTO?: {                   // ✅ No change
    id: number
  }
  deleted?: boolean                       // ✅ No change
}
```

---

## Frontend-Only Changes

### Component Label Usage

#### Before Migration:
```typescript
// Step1.tsx
const label = getLabel('CDL_CP_TYPE', currentLanguage, 'Investor Type*')
```

#### After Migration:
```typescript
// Step1.tsx
const label = getLabel('CDL_OWR_TYPE', currentLanguage, 'Investor Type*')
```

### Table Column Configuration

#### Before Migration:
```typescript
const columns = [
  {
    key: 'investor',
    label: getLabel('CDL_CP_FIRSTNAME'),
    type: 'text' as const,
  },
  {
    key: 'investorId',
    label: getLabel('CDL_CP_REFID'),
    type: 'text' as const,
  },
]
```

#### After Migration:
```typescript
const columns = [
  {
    key: 'investor',
    label: getLabel('CDL_OWR_FIRSTNAME'),
    type: 'text' as const,
  },
  {
    key: 'investorId',
    label: getLabel('CDL_OWR_REFID'),
    type: 'text' as const,
  },
]
```

---

## Migration Impact Matrix

| Component Type | Impact Level | Changes Required |
|----------------|--------------|------------------|
| **API Interfaces** | 🟢 None | No changes needed |
| **API Endpoints** | 🟢 None | No changes needed |
| **API Request Bodies** | 🟢 None | No changes needed |
| **API Response Bodies** | 🟢 None | No changes needed |
| **Service Classes** | 🟡 Low | Comment updates only |
| **Mapper Functions** | 🟢 None | No changes needed |
| **UI Components** | 🟠 High | Label key updates |
| **Label Mapping File** | 🟠 High | All keys updated |
| **Type Definitions** | 🟢 None | No changes needed |

**Legend**:
- 🟢 None/Low: No impact or minimal comment changes
- 🟡 Medium: Some updates required
- 🟠 High: Significant updates required

---

## Code Examples

### Example 1: Using Labels in Components

#### Before:
```typescript
import { useCapitalPartnerLabelsApi } from '@/hooks/useCapitalPartnerLabelsApi'

const { getLabel } = useCapitalPartnerLabelsApi()
const currentLanguage = useAppStore((state) => state.language)

// Getting labels
const typeLabel = getLabel('CDL_CP_TYPE', currentLanguage, 'Investor Type')
const nameLabel = getLabel('CDL_CP_FIRSTNAME', currentLanguage, 'Name')
const emailLabel = getLabel('CDL_CP_EMAIL', currentLanguage, 'Email')
```

#### After:
```typescript
import { useCapitalPartnerLabelsApi } from '@/hooks/useCapitalPartnerLabelsApi'

const { getLabel } = useCapitalPartnerLabelsApi()
const currentLanguage = useAppStore((state) => state.language)

// Getting labels - only key changed
const typeLabel = getLabel('CDL_OWR_TYPE', currentLanguage, 'Investor Type')
const nameLabel = getLabel('CDL_OWR_FIRSTNAME', currentLanguage, 'Name')
const emailLabel = getLabel('CDL_OWR_EMAIL', currentLanguage, 'Email')
```

### Example 2: Direct Label Mapping Access

#### Before:
```javascript
import { CAPITAL_PARTNER_LABELS } from '@/constants/mappings/capitalPartnerMapping'

const type = CAPITAL_PARTNER_LABELS['CDL_CP_TYPE']
const email = CAPITAL_PARTNER_LABELS['CDL_CP_EMAIL']
```

#### After:
```javascript
import { CAPITAL_PARTNER_LABELS } from '@/constants/mappings/capitalPartnerMapping'

const type = CAPITAL_PARTNER_LABELS['CDL_OWR_TYPE']
const email = CAPITAL_PARTNER_LABELS['CDL_OWR_EMAIL']
```

### Example 3: API Service Usage (NO CHANGE)

#### Before & After (Identical):
```typescript
import { capitalPartnerService } from '@/services/api/capitalPartnerService'

// Create request - NO CHANGE
const payload = {
  capitalPartnerId: 'INV-001',          // ✅ Same
  capitalPartnerName: 'John Doe',        // ✅ Same
  capitalPartnerEmail: 'john@example.com' // ✅ Same
}

// API call - NO CHANGE
const response = await capitalPartnerService.createCapitalPartner(payload)

// Response handling - NO CHANGE
console.log(response.capitalPartnerId)  // ✅ Same
console.log(response.capitalPartnerName) // ✅ Same
```

---

## Backward Compatibility

### Breaking Changes
❌ **Old label keys will not work**: 
- Any hardcoded `CDL_CP_*` references will fail to resolve
- Custom components using old keys need updates

### Non-Breaking Changes
✅ **API calls continue to work**:
- All API request/response structures unchanged
- Existing integrations require no changes
- Backend services unaffected

### Recommended Fallback (Optional)

If backward compatibility is critical, add fallback logic:

```javascript
export const getCapitalPartnerLabel = (configId) => {
  // Try new format first
  let label = CAPITAL_PARTNER_LABELS[configId]
  
  // Fallback to old format if not found
  if (!label && configId.startsWith('CDL_CP_')) {
    const newKey = configId.replace('CDL_CP_', 'CDL_OWR_')
    label = CAPITAL_PARTNER_LABELS[newKey]
  }
  
  return label || configId
}
```

---

## Testing Interface Changes

### Unit Tests
```typescript
describe('Label Migration', () => {
  it('should return correct label for new OWR keys', () => {
    const label = getCapitalPartnerLabel('CDL_OWR_TYPE')
    expect(label).toBe('Owner Registry Type')
  })
  
  it('should not find old CP keys', () => {
    const label = CAPITAL_PARTNER_LABELS['CDL_CP_TYPE']
    expect(label).toBeUndefined()
  })
})
```

### Integration Tests
```typescript
describe('API Integration', () => {
  it('should create capital partner with unchanged interface', async () => {
    const payload = {
      capitalPartnerId: 'TEST-001',
      capitalPartnerName: 'Test User',
      capitalPartnerEmail: 'test@example.com'
    }
    
    const response = await capitalPartnerService.createCapitalPartner(payload)
    
    // Interface unchanged
    expect(response).toHaveProperty('capitalPartnerId')
    expect(response).toHaveProperty('capitalPartnerName')
  })
})
```

---

## Summary

### What Changed ✏️
- Frontend label keys: `CDL_CP_*` → `CDL_OWR_*`
- Label display values: "Capital Partner" → "Owner Registry"
- Component label references updated
- Service class comments updated

### What Didn't Change ✅
- API request interfaces
- API response interfaces
- API endpoints
- Database schemas
- Backend service contracts
- Field names in DTOs
- Mapper function logic

---

## Reference Links

- [VERIFICATION_REPORT.md](./VERIFICATION_REPORT.md) - Complete verification results
- [BACKEND_API_MIGRATION_GUIDE.md](./BACKEND_API_MIGRATION_GUIDE.md) - Backend considerations
- [INTERFACE_CHANGES_SUMMARY.md](./INTERFACE_CHANGES_SUMMARY.md) - Quick reference summary

---

**Document Version**: 1.0.0  
**Last Updated**: October 8, 2025  
**Status**: Complete
