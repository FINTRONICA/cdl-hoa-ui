# Backend API Migration Guide
**Owner Registry Label Migration: Frontend Changes Only**

---

## Executive Summary

**⚠️ CRITICAL: This is a FRONTEND-ONLY migration. No backend changes are required.**

The Owner Registry label migration from `CDL_CP` to `CDL_OWR` affects **only frontend display labels**. All backend API contracts, database schemas, and service interfaces remain completely unchanged.

---

## Table of Contents

1. [Backend Impact Assessment](#backend-impact-assessment)
2. [API Contract Verification](#api-contract-verification)
3. [Database Schema Status](#database-schema-status)
4. [Service Layer Analysis](#service-layer-analysis)
5. [Integration Points](#integration-points)
6. [Testing Requirements](#testing-requirements)
7. [Deployment Considerations](#deployment-considerations)

---

## Backend Impact Assessment

### 🟢 No Backend Changes Required

| Backend Component | Status | Action Required |
|-------------------|--------|-----------------|
| **API Endpoints** | ✅ Unchanged | None |
| **Request DTOs** | ✅ Unchanged | None |
| **Response DTOs** | ✅ Unchanged | None |
| **Database Tables** | ✅ Unchanged | None |
| **Database Columns** | ✅ Unchanged | None |
| **Service Classes** | ✅ Unchanged | None |
| **Repository Layer** | ✅ Unchanged | None |
| **Business Logic** | ✅ Unchanged | None |
| **Validation Rules** | ✅ Unchanged | None |
| **Security Policies** | ✅ Unchanged | None |

### Migration Type Classification

```
┌─────────────────────────────────────────┐
│   FRONTEND ONLY MIGRATION               │
│   ================================       │
│                                         │
│   ✅ UI Labels Changed                  │
│   ✅ Display Text Changed               │
│   ✅ Component References Changed       │
│                                         │
│   ❌ API Contracts Unchanged            │
│   ❌ Database Schema Unchanged          │
│   ❌ Backend Code Unchanged             │
└─────────────────────────────────────────┘
```

---

## API Contract Verification

### Capital Partner Endpoints

#### 1. Create Capital Partner
**Endpoint**: `POST /api/capital-partners`

**Request DTO** - ✅ UNCHANGED:
```json
{
  "capitalPartnerId": "string",
  "capitalPartnerName": "string",
  "capitalPartnerMiddleName": "string",
  "capitalPartnerLastName": "string",
  "capitalPartnerEmail": "string",
  "capitalPartnerMobileNo": "string",
  "capitalPartnerTelephoneNo": "string",
  "capitalPartnerIdNo": "string",
  "capitalPartnerLocaleName": "string",
  "capitalPartnerOwnershipPercentage": 0,
  "idExpiaryDate": "2025-10-08T00:00:00.000Z",
  "investorTypeDTO": {
    "id": 0
  },
  "documentTypeDTO": {
    "id": 0
  },
  "countryOptionDTO": {
    "id": 0
  },
  "deleted": false
}
```

**Response DTO** - ✅ UNCHANGED:
```json
{
  "id": 0,
  "capitalPartnerId": "string",
  "capitalPartnerName": "string",
  "capitalPartnerMiddleName": "string",
  "capitalPartnerLastName": "string",
  "capitalPartnerEmail": "string",
  "capitalPartnerMobileNo": "string",
  "capitalPartnerTelephoneNo": "string",
  "capitalPartnerIdNo": "string",
  "capitalPartnerLocaleName": "string",
  "capitalPartnerOwnershipPercentage": 0,
  "idExpiaryDate": "2025-10-08T00:00:00.000Z",
  "investorTypeDTO": {
    "id": 0,
    "settingValue": "string",
    "displayName": "string"
  },
  "documentTypeDTO": {
    "id": 0,
    "settingValue": "string",
    "displayName": "string"
  },
  "countryOptionDTO": {
    "id": 0,
    "settingValue": "string",
    "displayName": "string"
  },
  "taskStatusDTO": null,
  "deleted": false
}
```

#### 2. Get Capital Partner by ID
**Endpoint**: `GET /api/capital-partners/{id}`

**Response** - ✅ UNCHANGED: Same as Create response

#### 3. Update Capital Partner
**Endpoint**: `PUT /api/capital-partners/{id}`

**Request** - ✅ UNCHANGED: Same as Create request plus `id` field

#### 4. Get All Capital Partners (Paginated)
**Endpoint**: `GET /api/capital-partners?page={page}&size={size}`

**Response** - ✅ UNCHANGED:
```json
{
  "content": [/* Array of Capital Partner objects */],
  "page": {
    "size": 20,
    "number": 0,
    "totalElements": 100,
    "totalPages": 5
  }
}
```

#### 5. Delete Capital Partner
**Endpoint**: `DELETE /api/capital-partners/{id}`

**Response** - ✅ UNCHANGED: 204 No Content

---

### Capital Partner Unit Endpoints

#### 1. Create Unit
**Endpoint**: `POST /api/capital-partner-units`

**Request DTO** - ✅ UNCHANGED:
```json
{
  "unitRefId": "string",
  "floor": "string",
  "noofBedroom": "string",
  "towerName": "string",
  "unitPlotSize": "string",
  "virtualAccNo": "string",
  "isResale": false,
  "isModified": true,
  "realEstateAssestDTO": {
    "id": 0
  },
  "unitStatusDTO": {
    "id": 0
  },
  "propertyIdDTO": {
    "id": 0
  },
  "capitalPartnerDTOS": [
    {
      "id": 0
    }
  ],
  "deleted": false
}
```

**Response DTO** - ✅ UNCHANGED: Same structure with added `id` field

---

### Capital Partner Bank Info Endpoints

#### 1. Create Bank Info
**Endpoint**: `POST /api/capital-partner-bank-info`

**Request DTO** - ✅ UNCHANGED:
```json
{
  "cpbiPayeeName": "string",
  "cpbiPayeeAddress": "string",
  "cpbiBankName": "string",
  "cpbiBankAddress": "string",
  "cpbiBicCode": "string",
  "cpbiBeneRoutingCode": "string",
  "cpbiAccountNumber": "string",
  "payModeDTO": {
    "id": 0
  },
  "capitalPartnerDTO": {
    "id": "0"
  },
  "deleted": false
}
```

**Response DTO** - ✅ UNCHANGED: Same structure with added `id` field

---

### Capital Partner Payment Plan Endpoints

#### 1. Create Payment Plan
**Endpoint**: `POST /api/capital-partner-payment-plans`

**Request DTO** - ✅ UNCHANGED:
```json
{
  "cpppInstallmentNumber": 0,
  "cpppInstallmentDate": "2025-10-08T00:00:00.000Z",
  "cpppBookingAmount": 0,
  "capitalPartnerDTO": {
    "id": 0
  },
  "deleted": false
}
```

**Response DTO** - ✅ UNCHANGED: Same structure with added `id` field

---

### Capital Partner Unit Purchase Endpoints

#### 1. Create Unit Purchase
**Endpoint**: `POST /api/capital-partner-unit-purchases`

**Request DTO** - ✅ UNCHANGED:
```json
{
  "cpupUnitRegistrationFee": 0,
  "cpupAgentName": "string",
  "cpupAgentId": "string",
  "cpupGrossSaleprice": 0,
  "cpupVatApplicable": false,
  "cpupSalePurchaseAgreement": false,
  "cpupProjectPaymentPlan": false,
  "cpupSalePrice": 0,
  "cpupDeedNo": "string",
  "cpupAgreementNo": "string",
  "cpupAgreementDate": "2025-10-08T00:00:00.000Z",
  "cpupModificationFeeNeeded": false,
  "cpupReservationBookingForm": false,
  "cpupOqoodPaid": false,
  "cpupWorldCheck": false,
  "cpupAmtPaidToDevInEscorw": 0,
  "cpupAmtPaidToDevOutEscorw": 0,
  "cpupTotalAmountPaid": 0,
  "cpupOqoodAmountPaid": 0,
  "cpupUnitAreaSize": 0,
  "cpupForfeitAmount": 0,
  "cpupDldAmount": 0,
  "cpupRefundAmount": 0,
  "cpupTransferredAmount": 0,
  "cpupRemarks": "string",
  "capitalPartnerUnitDTO": {
    "id": 0,
    "capitalPartnerDTOS": [
      {
        "id": 0
      }
    ]
  },
  "deleted": false
}
```

**Response DTO** - ✅ UNCHANGED: Same structure with added `id` field

---

## Database Schema Status

### ✅ All Tables Unchanged

#### capital_partner Table
```sql
-- NO CHANGES REQUIRED
CREATE TABLE capital_partner (
  id BIGINT PRIMARY KEY,
  capital_partner_id VARCHAR(255),
  capital_partner_name VARCHAR(255),
  capital_partner_middle_name VARCHAR(255),
  capital_partner_last_name VARCHAR(255),
  capital_partner_email VARCHAR(255),
  capital_partner_mobile_no VARCHAR(255),
  capital_partner_telephone_no VARCHAR(255),
  capital_partner_id_no VARCHAR(255),
  capital_partner_locale_name VARCHAR(255),
  capital_partner_ownership_percentage DECIMAL(5,2),
  id_expiary_date TIMESTAMP,
  investor_type_id BIGINT,
  document_type_id BIGINT,
  country_option_id BIGINT,
  deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### capital_partner_unit Table
```sql
-- NO CHANGES REQUIRED
CREATE TABLE capital_partner_unit (
  id BIGINT PRIMARY KEY,
  unit_ref_id VARCHAR(255),
  floor VARCHAR(50),
  noof_bedroom VARCHAR(50),
  tower_name VARCHAR(255),
  unit_plot_size VARCHAR(100),
  virtual_acc_no VARCHAR(255),
  is_resale BOOLEAN,
  is_modified BOOLEAN,
  real_estate_assest_id BIGINT,
  unit_status_id BIGINT,
  property_id BIGINT,
  deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### capital_partner_bank_info Table
```sql
-- NO CHANGES REQUIRED
CREATE TABLE capital_partner_bank_info (
  id BIGINT PRIMARY KEY,
  cpbi_payee_name VARCHAR(255),
  cpbi_payee_address TEXT,
  cpbi_bank_name VARCHAR(255),
  cpbi_bank_address TEXT,
  cpbi_bic_code VARCHAR(50),
  cpbi_bene_routing_code VARCHAR(50),
  cpbi_account_number VARCHAR(100),
  pay_mode_id BIGINT,
  capital_partner_id BIGINT,
  deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### capital_partner_payment_plan Table
```sql
-- NO CHANGES REQUIRED
CREATE TABLE capital_partner_payment_plan (
  id BIGINT PRIMARY KEY,
  cppp_installment_number INT,
  cppp_installment_date TIMESTAMP,
  cppp_booking_amount DECIMAL(15,2),
  capital_partner_id BIGINT,
  deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Service Layer Analysis

### Spring Boot Services - ✅ No Changes Required

#### CapitalPartnerService.java
```java
// NO CHANGES REQUIRED
@Service
public class CapitalPartnerService {
    
    @Autowired
    private CapitalPartnerRepository capitalPartnerRepository;
    
    public CapitalPartnerDTO createCapitalPartner(CapitalPartnerDTO dto) {
        // Existing logic remains unchanged
        CapitalPartner entity = mapToEntity(dto);
        CapitalPartner saved = capitalPartnerRepository.save(entity);
        return mapToDTO(saved);
    }
    
    public CapitalPartnerDTO getCapitalPartnerById(Long id) {
        // Existing logic remains unchanged
        return capitalPartnerRepository.findById(id)
            .map(this::mapToDTO)
            .orElseThrow(() -> new NotFoundException("Capital Partner not found"));
    }
    
    public Page<CapitalPartnerDTO> getAllCapitalPartners(Pageable pageable) {
        // Existing logic remains unchanged
        return capitalPartnerRepository.findAll(pageable)
            .map(this::mapToDTO);
    }
    
    // All other methods remain unchanged
}
```

#### CapitalPartnerUnitService.java
```java
// NO CHANGES REQUIRED
@Service
public class CapitalPartnerUnitService {
    // Existing implementation unchanged
}
```

#### CapitalPartnerBankInfoService.java
```java
// NO CHANGES REQUIRED
@Service
public class CapitalPartnerBankInfoService {
    // Existing implementation unchanged
}
```

---

## Integration Points

### 1. Frontend-Backend Communication

#### Request Flow - ✅ UNCHANGED
```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  Frontend   │ ──POST──>│   Backend   │ ──SQL──>│  Database   │
│  Component  │         │  REST API   │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
      │                       │                       │
      │ Uses CDL_OWR_*       │ Uses capitalPartner*  │ Uses capital_partner_*
      │ for DISPLAY          │ field names           │ column names
      │                       │                       │
      ▼                       ▼                       ▼
   UI Labels              DTO Fields            Table Columns
   (Changed)              (Unchanged)           (Unchanged)
```

#### Example Data Flow:
```typescript
// FRONTEND (Changed)
const label = getLabel('CDL_OWR_TYPE', 'en', 'Type')  // 🔄 Changed
<TextField label={label} name="investorType" />

// Maps to request body (Unchanged)
const payload = {
  investorTypeDTO: { id: 1 },  // ✅ Unchanged
  capitalPartnerName: "John"    // ✅ Unchanged
}

// BACKEND receives (Unchanged)
@PostMapping("/capital-partners")
public CapitalPartnerDTO create(@RequestBody CapitalPartnerDTO dto) {
  // dto.getCapitalPartnerName() ✅ Same field name
  // dto.getInvestorTypeDTO() ✅ Same field name
}

// DATABASE saves (Unchanged)
INSERT INTO capital_partner (
  capital_partner_name,  -- ✅ Same column
  investor_type_id       -- ✅ Same column
) VALUES (?, ?)
```

---

### 2. Third-Party Integrations

#### Workflow System - ✅ No Impact
```typescript
// Workflow request structure unchanged
await createCapitalPartnerWorkflowRequest.mutateAsync({
  referenceId: capitalPartnerIdForWorkflow,  // ✅ Unchanged
  payloadData: { ...formData },              // ✅ Unchanged
  referenceType: 'CAPITAL_PARTNER',          // ✅ Unchanged
  moduleName: 'CAPITAL_PARTNER',             // ✅ Unchanged
  actionKey: 'CREATE'                        // ✅ Unchanged
})
```

#### Document Management - ✅ No Impact
```typescript
// Document entity type unchanged
<DocumentUploadFactory
  type="INVESTOR"                   // ✅ Unchanged
  entityId={capitalPartnerId}       // ✅ Unchanged
  onDocumentsChange={handleChange}  // ✅ Unchanged
/>
```

---

### 3. Language Translation API

#### Translation Endpoint - ⚠️ May Need Update

**Endpoint**: `GET /api/app-language-translation/OWNER_REGISTRY`

**Important**: If your backend serves translation labels, you need to update the configuration IDs:

**Backend Translation Table Update Required**:
```sql
-- Update translation config IDs
UPDATE app_language_translation 
SET config_id = REPLACE(config_id, 'CDL_CP_', 'CDL_OWR_')
WHERE module_code = 'OWNER_REGISTRY';

-- Example updates:
-- CDL_CP_TYPE → CDL_OWR_TYPE
-- CDL_CP_FIRSTNAME → CDL_OWR_FIRSTNAME
-- CDL_CP_EMAIL → CDL_OWR_EMAIL
```

**Translation Table Schema**:
```sql
CREATE TABLE app_language_translation (
  id BIGINT PRIMARY KEY,
  config_id VARCHAR(100),     -- ⚠️ UPDATE THIS
  config_value TEXT,          -- ✅ No change
  language_code VARCHAR(10),  -- ✅ No change
  module_code VARCHAR(50),    -- ✅ No change
  deleted BOOLEAN,
  enabled BOOLEAN
);
```

**Migration Script**:
```sql
-- Backup existing translations
CREATE TABLE app_language_translation_backup AS 
SELECT * FROM app_language_translation 
WHERE module_code = 'OWNER_REGISTRY';

-- Update config IDs
UPDATE app_language_translation 
SET config_id = REPLACE(config_id, 'CDL_CP_', 'CDL_OWR_')
WHERE module_code = 'OWNER_REGISTRY'
  AND config_id LIKE 'CDL_CP_%';

-- Verify the update
SELECT config_id, config_value, language_code 
FROM app_language_translation 
WHERE module_code = 'OWNER_REGISTRY'
ORDER BY config_id;
```

---

## Testing Requirements

### Backend Testing - ✅ Existing Tests Remain Valid

#### 1. Unit Tests
```java
// NO CHANGES REQUIRED
@Test
public void testCreateCapitalPartner() {
    CapitalPartnerDTO dto = new CapitalPartnerDTO();
    dto.setCapitalPartnerId("TEST-001");
    dto.setCapitalPartnerName("Test User");
    
    CapitalPartnerDTO result = capitalPartnerService.createCapitalPartner(dto);
    
    assertNotNull(result.getId());
    assertEquals("TEST-001", result.getCapitalPartnerId());
    assertEquals("Test User", result.getCapitalPartnerName());
}
```

#### 2. Integration Tests
```java
// NO CHANGES REQUIRED
@SpringBootTest
@AutoConfigureMockMvc
public class CapitalPartnerIntegrationTest {
    
    @Test
    public void testCreateCapitalPartnerEndpoint() throws Exception {
        String requestBody = "{ \"capitalPartnerId\": \"TEST-001\", ... }";
        
        mockMvc.perform(post("/api/capital-partners")
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestBody))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.capitalPartnerId").value("TEST-001"));
    }
}
```

### Frontend-Backend Integration Testing

#### API Contract Tests
```typescript
describe('Capital Partner API', () => {
  it('should maintain API contract after label migration', async () => {
    // Create request with unchanged field names
    const payload = {
      capitalPartnerId: 'TEST-001',
      capitalPartnerName: 'Test User',
      capitalPartnerEmail: 'test@example.com'
    }
    
    const response = await capitalPartnerService.createCapitalPartner(payload)
    
    // Verify response structure unchanged
    expect(response).toHaveProperty('id')
    expect(response).toHaveProperty('capitalPartnerId')
    expect(response).toHaveProperty('capitalPartnerName')
    expect(response.capitalPartnerId).toBe('TEST-001')
  })
  
  it('should display correct labels in UI', () => {
    const label = getLabel('CDL_OWR_TYPE', 'en', 'Type')
    expect(label).toContain('Owner Registry')
  })
})
```

---

## Deployment Considerations

### Deployment Sequence

#### Option 1: Frontend-Only Deployment (Recommended)
```
1. ✅ Deploy frontend with new CDL_OWR_ labels
2. ✅ Update translation database (if applicable)
3. ✅ No backend deployment needed
```

#### Option 2: Coordinated Deployment (If Translation DB Update Required)
```
1. ✅ Update translation database with new config IDs
2. ✅ Deploy frontend with new CDL_OWR_ labels
3. ✅ Verify both frontend and translations work together
```

### Pre-Deployment Checklist

- [ ] Frontend build successful
- [ ] No TypeScript/ESLint errors
- [ ] All frontend tests passing
- [ ] Translation database updated (if applicable)
- [ ] Backend tests still passing (no regression)
- [ ] API contracts verified unchanged
- [ ] Rollback plan documented

### Post-Deployment Verification

```bash
# 1. Verify API endpoints still work
curl -X GET https://api.example.com/api/capital-partners/{id}

# 2. Verify response structure unchanged
# Check that all field names are still: capitalPartner*, cpbi*, cppp*, cpup*

# 3. Verify translations (if applicable)
curl -X GET https://api.example.com/api/app-language-translation/OWNER_REGISTRY
# Check that config_ids are: CDL_OWR_*

# 4. Test frontend UI
# Verify all labels display correctly
# Check that forms submit successfully
# Confirm data displays properly in tables
```

---

## Rollback Procedures

### Scenario 1: Frontend Issue Only

```bash
# 1. Rollback frontend deployment
git revert <commit-hash>
npm run build
# Deploy previous version

# 2. No backend rollback needed
```

### Scenario 2: Translation Database Issue

```sql
-- Restore from backup
DELETE FROM app_language_translation 
WHERE module_code = 'OWNER_REGISTRY';

INSERT INTO app_language_translation 
SELECT * FROM app_language_translation_backup;

-- Or revert the update
UPDATE app_language_translation 
SET config_id = REPLACE(config_id, 'CDL_OWR_', 'CDL_CP_')
WHERE module_code = 'OWNER_REGISTRY'
  AND config_id LIKE 'CDL_OWR_%';
```

---

## Performance Impact

### Expected Impact: ✅ NONE

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| API Response Time | X ms | X ms | 0% |
| Database Query Time | Y ms | Y ms | 0% |
| Frontend Render Time | Z ms | Z ms | 0% |
| Memory Usage | A MB | A MB | 0% |
| CPU Usage | B% | B% | 0% |

**Reason**: Only label display strings changed; no logic, queries, or data structures modified.

---

## Security Considerations

### Security Impact: ✅ NONE

- **Authentication**: Unchanged
- **Authorization**: Unchanged
- **Data Validation**: Unchanged
- **SQL Injection Protection**: Unchanged
- **XSS Protection**: Unchanged
- **CSRF Protection**: Unchanged
- **Rate Limiting**: Unchanged

---

## Summary for Backend Team

### ✅ What Backend Team Needs to Know:

1. **No backend code changes required**
2. **All API contracts remain identical**
3. **Database schema unchanged**
4. **Existing tests remain valid**
5. **No performance impact expected**

### ⚠️ Optional Backend Action:

**If your application serves translation labels** from database:
- Update `app_language_translation` table
- Change `config_id` from `CDL_CP_*` to `CDL_OWR_*`
- Use provided SQL migration script

### ✅ Backend Verification Steps:

1. Run existing test suite - should pass without changes
2. Verify API endpoints respond correctly
3. Check database queries execute normally
4. Monitor logs for any errors after frontend deployment

---

## Contact & Support

For backend-related questions:
- Review API contract section
- Check database schema section
- Consult service layer analysis
- Verify no changes needed to your services

**Migration Type**: Frontend Display Only  
**Backend Impact**: None (except optional translation DB update)  
**Document Version**: 1.0.0  
**Last Updated**: October 8, 2025
