import { apiClient } from '@/lib/apiClient'
import {
  buildApiUrl,
  buildPaginationParams,
  API_ENDPOINTS,
} from '@/constants/apiEndpoints'
import type { PaginatedResponse } from '@/types'
import type {
  ApiDocumentResponse,
  PaginatedDocumentResponse,
} from '@/components/organisms/DeveloperStepper/developerTypes'

// Task Status DTO interface
export interface TaskStatusDTO {
  id: number
  code: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  deleted: boolean
  enabled: boolean
}

// Asset Register (Management Firm) types - NEW API uses 'ar' prefix
// Properties map to Asset Register/Management Firm data
export interface BuildPartner {
  id: number
  arDeveloperId: string // Management Firm ID
  arCifrera: string | null // Management Firm CIF
  arDeveloperRegNo: string // Registration Number
  arName: string | null // Management Firm Name
  arMasterName: string | null // Master Management Firm
  arNameLocal: string | null // Local Name
  arOnboardingDate: string | null // Onboarding Date
  arContactAddress: string | null // Contact Address
  arContactTel: string | null // Contact Telephone
  arPoBox: string | null // PO Box
  arMobile: string | null // Mobile Number
  arFax: string | null // Fax Number
  arEmail: string | null // Email Address
  arLicenseNo: string | null // License Number
  arLicenseExpDate: string | null // License Expiry Date
  arWorldCheckFlag: string | null // World Check Status
  arWorldCheckRemarks: string | null // World Check Remarks
  arMigratedData: boolean | null // Migrated Data Flag
  arremark: string | null // Additional Notes
  arRegulatorDTO: unknown | null // Regulatory Authority
  arActiveStatusDTO: unknown | null // Active Status
  assetRegisterBeneficiaryDTOS: unknown[] | null // Beneficiaries
  assetRegisterContactDTOS: unknown[] | null // Contacts
  taskStatusDTO: TaskStatusDTO | null // Task Status
}

// Create Management Firm request - NEW API uses 'ar' prefix
export interface CreateBuildPartnerRequest {
  arName: string // Management Firm Name
  arDeveloperId: string // Management Firm ID
  arCifrera: string // Management Firm CIF
  arNameLocal?: string // Local Name
  arWorldCheckFlag?: string // World Check Status
  arContactAddress?: string // Contact Address
  arContactTel?: string // Contact Telephone
  arEmail?: string // Email Address
  arMobile?: string // Mobile Number
  arLicenseNo?: string // License Number
  arLicenseExpDate?: string // License Expiry Date
}

// Update Management Firm request - NEW API uses 'ar' prefix
export interface UpdateBuildPartnerRequest {
  arName?: string // Management Firm Name
  arDeveloperId?: string // Management Firm ID
  arCifrera?: string // Management Firm CIF
  arNameLocal?: string // Local Name
  arWorldCheckFlag?: string // World Check Status
  arContactAddress?: string // Contact Address
  arContactTel?: string // Contact Telephone
  arEmail?: string // Email Address
  arMobile?: string // Mobile Number
  arLicenseNo?: string // License Number
  arLicenseExpDate?: string // License Expiry Date
}

export interface BuildPartnerFilters {
  status?:
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'IN_PROGRESS'
    | 'DRAFT'
    | 'INITIATED'
  name?: string
  developerId?: string
}

export interface BuildPartnerLabel {
  id: string
  key: string
  value: string
  language: string
  category: string
}

// Step-specific response types
export interface StepSaveResponse {
  success: boolean
  message: string
  stepId?: string
  nextStep?: number
  data?: unknown
}

export interface StepValidationResponse {
  isValid: boolean
  errors?: string[]
  warnings?: string[]
}

// Asset Register (Management Firm) form data types
// NEW API uses 'ar' prefix
export interface BuildPartnerDetailsData {
  arName: string // Management Firm Name
  arDeveloperId: string // Management Firm ID
  arCifrera: string // Management Firm CIF
  arNameLocal: string // Local Name
  arWorldCheckFlag?: string // World Check Status
}

// UI-friendly BuildPartner interface for table display
export interface BuildPartnerUIData {
  id: string
  name: string
  developerId: string
  developerCif: string
  localeNames: string
  status: string
  registrationDate?: string | undefined
  lastUpdated?: string | undefined
  contactPerson?: string | undefined
  documents?:
    | Array<{
        name: string
        type: string
        url: string
      }>
    | undefined
}

// Utility function to map API BuildPartner to UI BuildPartnerUIData
export const mapBuildPartnerToUIData = (
  apiData: BuildPartner
): BuildPartnerUIData => {
  const mapApiStatus = (taskStatusDTO: TaskStatusDTO | null): string => {
    if (!taskStatusDTO) {
      return 'INITIATED'
    }

    // Use the code from taskStatusDTO directly as it matches our new status options
    return taskStatusDTO.code || 'INITIATED'
  }

  return {
    id: apiData.id.toString(),
    name: apiData.arName || 'N/A',
    developerId: apiData.arDeveloperId || 'N/A',
    developerCif: apiData.arCifrera || 'N/A',
    localeNames: apiData.arNameLocal || '---',
    status: mapApiStatus(apiData.taskStatusDTO),
    registrationDate: apiData.arOnboardingDate || undefined,
    lastUpdated: apiData.arOnboardingDate || undefined,
    contactPerson: apiData.arContactAddress || undefined,
  }
}

// Management Firm contact data - NEW API uses 'arc' prefix (Asset Register Contact)
export interface BuildPartnerContactData {
  arcFirstName: string // Contact First Name
  arcLastName: string // Contact Last Name
  arcContactEmail: string // Contact Email
  arcContactAddressLine1: string // Address Line 1
  arcContactAddressLine2: string // Address Line 2
  arcContactPoBox: string // PO Box
  arcCountryMobCode: string // Country Mobile Code
  arcContactTelNo: string // Telephone Number
  arcContactMobNo: string // Mobile Number
  arcContactFaxNo: string // Fax Number
}

// Management Firm fees structure data
export interface BuildPartnerFeesData {
  feeStructure: {
    setupFee: number // Setup Fee
    transactionFee: number // Transaction Fee
    monthlyFee: number // Monthly Fee
  }
  collectionMethod: 'automatic' | 'manual' // Collection Method
  paymentTerms: string // Payment Terms
}

// Management Firm individual fee data - NEW API uses 'ar' prefix
export interface BuildPartnerIndividualFeeData {
  arFeeCategoryDTO: {
    id: number // Fee Category ID
  }
  arFeeFrequencyDTO: {
    id: number // Fee Frequency ID
  }
  arAccountTypeDTO: {
    id: number // Account Type ID
  }
  debitAmount: number // Debit Amount
  totalAmount: number // Total Amount
  feeCollectionDate: string // Fee Collection Date
  feeNextRecoveryDate: string // Next Recovery Date
  feePercentage: number // Fee Percentage
  vatPercentage: number // VAT Percentage
  arFeeCurrencyDTO: {
    id: number // Currency ID
  }
}

// API Response interface for fee data - NEW API uses 'ar' prefix
export interface BuildPartnerFeeResponse {
  id: number
  debitAmount?: number
  totalAmount?: number
  feeCollectionDate?: string
  feeNextRecoveryDate?: string
  feePercentage?: number
  vatPercentage?: number
  feeCollected?: any
  arFeeCategoryDTO?: {
    id?: number
    settingKey?: string
    settingValue?: string
    languageTranslationId?: {
      id?: number
      configId?: string
      configValue?: string
      content?: string | null
      status?: string | null
      enabled?: boolean
      deleted?: boolean | null
    }
    remarks?: string | null
    status?: string | null
    enabled?: boolean
    deleted?: boolean | null
  }
  arFeeFrequencyDTO?: {
    id?: number
    settingKey?: string
    settingValue?: string
    languageTranslationId?: {
      id?: number
      configId?: string
      configValue?: string
      content?: string | null
      status?: string | null
      enabled?: boolean
      deleted?: boolean | null
    }
    remarks?: string | null
    status?: string | null
    enabled?: boolean
    deleted?: boolean | null
  }
  arFeeCurrencyDTO?: {
    id?: number
    settingKey?: string
    settingValue?: string
    languageTranslationId?: {
      id?: number
      configId?: string
      configValue?: string
      content?: string | null
      status?: string | null
      enabled?: boolean
      deleted?: boolean | null
    }
    remarks?: string | null
    status?: string | null
    enabled?: boolean
    deleted?: boolean | null
  }
}

// UI-friendly FeeData interface for table display
export interface FeeUIData extends Record<string, unknown> {
  id: string
  feeType: string
  frequency: string
  debitAmount: string
  feeToBeCollected: string
  nextRecoveryDate: string
  feePercentage: string
  amount: string
  vatPercentage: string
  currency: string
}

// Management Firm beneficiary data - NEW API uses 'arb' prefix (Asset Register Beneficiary)
export interface BuildPartnerBeneficiaryData {
  arbBeneficiaryId: string // Beneficiary Reference ID
  arbBeneficiaryType: string // Payment Transfer Mode
  arbName: string // Beneficiary Full Name
  arbBankName: string // Beneficiary Bank Name
  arbSwiftCode: string // SWIFT / BIC Code
  arbRoutingCode: string // Bank Routing Number
  arbAccountNumber: string // Bank Account Number
  enabled: boolean // Active Status
}

// Management Firm beneficiary API response - NEW API uses 'arb' prefix
export interface BuildPartnerBeneficiaryResponse {
  id: number // Beneficiary ID
  arbBeneficiaryId: string // Beneficiary Reference ID
  arbBeneficiaryType: string // Payment Transfer Mode
  arbName: string // Beneficiary Full Name
  arbBankName: string // Beneficiary Bank Name
  arbSwiftCode: string // SWIFT / BIC Code
  arbRoutingCode?: string // Bank Routing Number
  arbAccountNumber: string // Bank Account Number
  assetRegisterId?: number // Management Firm ID
  createdAt?: string // Created Date
  updatedAt?: string // Updated Date
  status?: string // Status
  enabled?: boolean // Active Status
}

// Update Management Firm beneficiary request - NEW API uses 'arb' prefix
export interface UpdateBuildPartnerBeneficiaryData {
  arbBeneficiaryId?: string // Beneficiary Reference ID
  arbBeneficiaryType?: string // Payment Transfer Mode
  arbName?: string // Beneficiary Full Name
  arbBankName?: string // Beneficiary Bank Name
  arbSwiftCode?: string // SWIFT / BIC Code
  arbRoutingCode?: string // Bank Routing Number
  arbAccountNumber?: string // Bank Account Number
}

// Management Firm review/submission data
export interface BuildPartnerReviewData {
  reviewData: unknown // Review Data
  termsAccepted: boolean // Terms Accepted Flag
}

// Customer Details API Response Types
export interface CustomerDetailsResponse {
  customerId: string
  cif: string
  name: {
    firstName: string
    shortName: string
  }
  type: string
  contact: {
    preferredEmail: string
    preferredPhone: string
    address: {
      line1: string
      line2: string
      city: string
      state: string
      country: string
      pinCode: string
    }
  }
}

export class BuildPartnerService {
  async getBuildPartners(
    page = 0,
    size = 20,
    filters?: BuildPartnerFilters
  ): Promise<PaginatedResponse<BuildPartner>> {
    // Map UI filter names to API field names
    const apiFilters: Record<string, string> = {}
    if (filters) {
      if (filters.status) {
        // Map UI status values to API status values
        const statusMapping: Record<string, string> = {
          Approved: 'CLEAR',
          'In Review': 'PENDING',
          Rejected: 'REJECTED',
          Incomplete: 'INCOMPLETE',
        }
        apiFilters.arWorldCheckFlag =
          statusMapping[filters.status] || filters.status
      }
      if (filters.name) {
        apiFilters.arName = filters.name
      }
      if (filters.developerId) {
        apiFilters.arDeveloperId = filters.developerId
      }
    }

    const params = {
      ...buildPaginationParams(page, size),
      ...apiFilters,
    }
    const queryString = new URLSearchParams(params).toString()
    const url = `${buildApiUrl(API_ENDPOINTS.ASSET_REGISTER.FIND_ALL)}&${queryString}`

    try {
      const result = await apiClient.get<PaginatedResponse<BuildPartner>>(url)

      return result
    } catch (error) {
      throw error
    }
  }

  async getBuildPartner(id: string): Promise<BuildPartner> {
    try {
      const url = buildApiUrl(API_ENDPOINTS.ASSET_REGISTER.GET_BY_ID(id))

      const result = await apiClient.get<BuildPartner>(url)

      return result
    } catch (error) {
      throw error
    }
  }

  async getBuildPartnerContact(id: string): Promise<unknown> {
    try {
      const url = buildApiUrl(API_ENDPOINTS.ASSET_REGISTER_CONTACT.GET_BY_ID(id))

      const result = await apiClient.get(url)

      return result
    } catch (error) {
      throw error
    }
  }

  async getBuildPartnerFees(id: string): Promise<BuildPartnerFeeResponse[]> {
    try {
      const url = buildApiUrl(API_ENDPOINTS.ASSET_REGISTER_FEES.GET_BY_ID(id))
      const result = await apiClient.get(url)

      // Handle different response formats
      let feeArray: BuildPartnerFeeResponse[] = []
      if (Array.isArray(result)) {
        feeArray = result as BuildPartnerFeeResponse[]
      } else if (result && typeof result === 'object' && 'content' in result) {
        feeArray = Array.isArray((result as any).content)
          ? ((result as any).content as BuildPartnerFeeResponse[])
          : []
      }
      return feeArray
    } catch (error) {
      throw error
    }
  }

  // Get fees with UI transformation
  async getBuildPartnerFeesUIData(id: string): Promise<FeeUIData[]> {
    try {
      const feeResponse = await this.getBuildPartnerFees(id)

      const transformedFees = this.transformFeeResponseToUIData(feeResponse)

      return transformedFees
    } catch (error) {
      throw error
    }
  }

  async getBuildPartnerByCif(cif: string): Promise<BuildPartner> {
    try {
      const params = { arCifrera: cif }
      const queryString = new URLSearchParams(params).toString()
      const url = `${buildApiUrl(API_ENDPOINTS.ASSET_REGISTER.FIND_ALL)}&${queryString}`

      const result = await apiClient.get<PaginatedResponse<BuildPartner>>(url)

      if (result?.content && result.content.length > 0) {
        const buildPartner = result.content[0]
        if (buildPartner) {
          return buildPartner
        }
      }
      throw new Error(`No management firm found with CIF: ${cif}`)
    } catch (error) {
      throw error
    }
  }

  // Get customer details by CIF from core bank API
  async getCustomerDetailsByCif(cif: string): Promise<CustomerDetailsResponse> {
    try {
      const url = buildApiUrl(API_ENDPOINTS.CUSTOMER_DETAILS.GET_BY_CIF(cif))

      const result = await apiClient.get<CustomerDetailsResponse>(url)

      if (result) {
        return result
      }
      throw new Error(`No customer details found with CIF: ${cif}`)
    } catch (error) {
      throw error
    }
  }

  async createBuildPartner(
    data: CreateBuildPartnerRequest
  ): Promise<BuildPartner> {
    try {
      const result = await apiClient.post<BuildPartner>(
        buildApiUrl(API_ENDPOINTS.ASSET_REGISTER_CREATE.DETAILS_SAVE),
        data
      )

      return result
    } catch (error) {
      throw error
    }
  }

  async updateBuildPartner(
    id: string,
    updates: UpdateBuildPartnerRequest
  ): Promise<BuildPartner> {
    try {
      const result = await apiClient.put<BuildPartner>(
        buildApiUrl(API_ENDPOINTS.ASSET_REGISTER.UPDATE(id)),
        updates
      )

      return result
    } catch (error) {
      throw error
    }
  }

  async deleteBuildPartner(id: string): Promise<void> {
    try {

      await apiClient.delete<string>(
        buildApiUrl(API_ENDPOINTS.ASSET_REGISTER.SOFT_DELETE(id))
      )
    } catch (error) {
      throw error
    }
  }

  async getBuildPartnerLabels(): Promise<BuildPartnerLabel[]> {
    return apiClient.get<BuildPartnerLabel[]>(
      buildApiUrl(API_ENDPOINTS.APP_LANGUAGE_TRANSLATION.ASSET_REGISTER)
    )
  }

  // Build Partner form save methods
  async saveBuildPartnerDetails(
    data: BuildPartnerDetailsData,
    isEditing = false,
    developerId?: string
  ): Promise<StepSaveResponse> {

    if (isEditing && developerId) {
      // Use PUT for editing existing details - include buildPartnerDTO in data
      const url = buildApiUrl(API_ENDPOINTS.ASSET_REGISTER.UPDATE(developerId))
      const requestData = {
        ...data,
        id: parseInt(developerId),
      }

      const response = await apiClient.put<StepSaveResponse>(url, requestData)
      return response
    } else {
      // Use POST for creating new details
      const url = buildApiUrl(API_ENDPOINTS.ASSET_REGISTER_CREATE.DETAILS_SAVE)

      const response = await apiClient.post<StepSaveResponse>(url, data)
      return response
    }
  }

  async saveBuildPartnerContact(
    data: BuildPartnerContactData,
    isEditing = false,
    developerId?: string
  ): Promise<StepSaveResponse> {

    if (isEditing && developerId) {
      // Use POST for editing existing contact - add id to existing buildPartnerDTO structure
      const url = buildApiUrl(API_ENDPOINTS.ASSET_REGISTER_CREATE.CONTACT_SAVE)
      const requestData = {
        ...data,
        buildPartnerDTO: { id: parseInt(developerId) },
      }

      const response = await apiClient.post<StepSaveResponse>(url, requestData)
      return response
    } else {
      // Use POST for creating new contact
      const url = buildApiUrl(API_ENDPOINTS.ASSET_REGISTER_CREATE.CONTACT_SAVE)

      const response = await apiClient.post<StepSaveResponse>(url, data)
      return response
    }
  }

  async saveBuildPartnerFees(
    data: BuildPartnerFeesData,
    isEditing = false,
    developerId?: string
  ): Promise<StepSaveResponse> {

    if (isEditing && developerId) {
      // Use POST for editing existing fees - wrap data with isEditing and developerId
      const url = buildApiUrl(API_ENDPOINTS.ASSET_REGISTER_CREATE.FEES_SAVE)
      const requestData = {
        data: {
          ...data,
          buildPartnerDTO: { id: parseInt(developerId) },
        },
        isEditing: false,
        developerId: developerId,
      }

      const response = await apiClient.post<StepSaveResponse>(url, requestData)
      return response
    } else {
      // Use POST for creating new fees - send data directly
      const url = buildApiUrl(API_ENDPOINTS.ASSET_REGISTER_CREATE.FEES_SAVE)

      const response = await apiClient.post<StepSaveResponse>(url, data)
      return response
    }
  }

  async saveBuildPartnerIndividualFee(
    data: BuildPartnerIndividualFeeData,
    isEditing = false,
    developerId?: string
  ): Promise<unknown> {

    try {
      if (isEditing && developerId) {
        // Use POST for editing existing individual fee - wrap data with isEditing and developerId
        const requestData = {
          data: {
            ...data,
            buildPartnerDTO: { id: parseInt(developerId) },
          },
          isEditing: false,
          developerId: developerId,
        }

        const result = await apiClient.post(
          buildApiUrl(API_ENDPOINTS.ASSET_REGISTER_FEES.SAVE),
          requestData
        )
        return result
      } else {
        // Use POST for creating new individual fee - send data directly

        const result = await apiClient.post(
          buildApiUrl(API_ENDPOINTS.ASSET_REGISTER_FEES.SAVE),
          data
        )
        return result
      }
    } catch (error) {
      throw error
    }
  }

  async saveBuildPartnerBeneficiary(
    data: BuildPartnerBeneficiaryData,
    isEditing = false,
    developerId?: string
  ): Promise<StepSaveResponse> {

    if (isEditing && developerId) {
      // Use POST for editing existing beneficiary - add id to existing buildPartnerDTO structure
      const url = buildApiUrl(
        API_ENDPOINTS.ASSET_REGISTER_CREATE.BENEFICIARY_SAVE
      )
      const requestData = {
        ...data,
        buildPartnerDTO: { id: parseInt(developerId) },
      }

      const response = await apiClient.post<StepSaveResponse>(url, requestData)
      return response
    } else {
      // Use POST for creating new beneficiary
      const url = buildApiUrl(
        API_ENDPOINTS.ASSET_REGISTER_CREATE.BENEFICIARY_SAVE
      )

      const response = await apiClient.post<StepSaveResponse>(url, data)
      return response
    }
  }

  async getBuildPartnerBeneficiaries(
    buildPartnerId?: string
  ): Promise<BuildPartnerBeneficiaryResponse[] | undefined> {
    try {
      if (!buildPartnerId) {
        return []
      }

      const url = buildApiUrl(
        API_ENDPOINTS.ASSET_REGISTER_BENEFICIARY.GET_BY_ID(buildPartnerId)
      )

      const response =
        await apiClient.get<BuildPartnerBeneficiaryResponse[]>(url)

      return response || []
    } catch (error) {
      throw error
    }
  }

  // Get a specific beneficiary by ID
  async getBuildPartnerBeneficiary(
    id: string
  ): Promise<BuildPartnerBeneficiaryResponse> {
    try {
      const url = buildApiUrl(
        API_ENDPOINTS.ASSET_REGISTER_BENEFICIARY.GET_BY_ID(id)
      )
      const response = await apiClient.get<BuildPartnerBeneficiaryResponse>(url)

      return response
    } catch (error) {
      throw error
    }
  }

  // Update a beneficiary
  async updateBuildPartnerBeneficiary(
    id: string,
    data: UpdateBuildPartnerBeneficiaryData
  ): Promise<BuildPartnerBeneficiaryResponse> {
    try {
      const url = buildApiUrl(
        API_ENDPOINTS.ASSET_REGISTER_BENEFICIARY.UPDATE(id)
      )

      const response = await apiClient.put<BuildPartnerBeneficiaryResponse>(
        url,
        data
      )

      return response
    } catch (error) {
      throw error
    }
  }

  // Delete a beneficiary
  async deleteBuildPartnerBeneficiary(id: string): Promise<void> {
    try {
      const url = buildApiUrl(
        API_ENDPOINTS.ASSET_REGISTER_BENEFICIARY.DELETE(id)
      )

      await apiClient.delete(url)
    } catch (error) {
      throw error
    }
  }

  async saveBuildPartnerReview(
    data: BuildPartnerReviewData
  ): Promise<StepSaveResponse> {
    const url = buildApiUrl(API_ENDPOINTS.ASSET_REGISTER_CREATE.REVIEW_SAVE)
    return apiClient.post<StepSaveResponse>(url, data)
  }

  // Get uploaded documents for any entity with configurable module
  async getBuildPartnerDocuments(
    entityId: string,
    module: string = 'BUILD_PARTNER',
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedDocumentResponse> {
    try {
      // Build URL with query parameters to filter by module and recordId, plus pagination
      const params = new URLSearchParams({
        'module.equals': module,
        'recordId.equals': entityId,
        page: page.toString(),
        size: size.toString(),
      })
      const url = `${buildApiUrl(API_ENDPOINTS.REAL_ESTATE_DOCUMENT.GET_ALL)}?${params.toString()}`

      const result = await apiClient.get<PaginatedDocumentResponse>(url)

      // Return the full paginated response
      return (
        result || {
          content: [],
          page: {
            size: size,
            number: page,
            totalElements: 0,
            totalPages: 0,
          },
        }
      )
    } catch (error) {
      throw error
    }
  }

  // Document upload method with configurable module
  async uploadBuildPartnerDocument(
    file: File,
    entityId: string,
    documentType?: string,
    module: string = 'BUILD_PARTNER'
  ): Promise<ApiDocumentResponse> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      // Build URL with query parameters following the API specification
      const params = new URLSearchParams({
        module: module,
        recordId: entityId,
        storageType: 'LOCAL',
      })

      // Add document type if provided
      if (documentType) {
        params.append('documentType', documentType)
      }

      const url = `${buildApiUrl(API_ENDPOINTS.REAL_ESTATE_DOCUMENT.UPLOAD)}?${params.toString()}`

      // Override Content-Type header to let browser set it automatically for FormData
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data' as const,
        },
      }

      const result = await apiClient.post<ApiDocumentResponse>(
        url,
        formData,
        config
      )

      return result
    } catch (error) {
      throw error
    }
  }

  // Step data retrieval and validation methods
  async getStepData(step: number, developerId?: string): Promise<unknown> {
    let url = buildApiUrl(
      API_ENDPOINTS.ASSET_REGISTER_CREATE.GET_STEP_DATA(step)
    )

    // Add developer ID as query parameter if provided
    if (developerId) {
      url += `?developerId=${encodeURIComponent(developerId)}`
    }

    return apiClient.get(url)
  }

  async validateStep(
    step: number,
    data: unknown
  ): Promise<StepValidationResponse> {
    const url = buildApiUrl(
      API_ENDPOINTS.ASSET_REGISTER_CREATE.VALIDATE_STEP(step)
    )
    return apiClient.post<StepValidationResponse>(url, data)
  }

  // Utility method to transform API response to UI-friendly format
  transformToUIData(
    apiResponse: PaginatedResponse<BuildPartner>
  ): PaginatedResponse<BuildPartnerUIData> {
    return {
      content: apiResponse.content.map((item) => mapBuildPartnerToUIData(item)),
      page: apiResponse.page,
    }
  }

  // Utility method to get UI-friendly data directly
  async getBuildPartnersUIData(
    page = 0,
    size = 20,
    filters?: BuildPartnerFilters
  ): Promise<PaginatedResponse<BuildPartnerUIData>> {
    const apiResponse = await this.getBuildPartners(page, size, filters)
    return this.transformToUIData(apiResponse)
  }

  // Data mapping functions for beneficiaries
  mapBeneficiaryToUI(
    apiData: BuildPartnerBeneficiaryResponse
  ): Record<string, unknown> {
    return {
      id: apiData.id.toString(),
      arbBeneficiaryId: apiData.arbBeneficiaryId,
      arbBeneficiaryType: apiData.arbBeneficiaryType,
      arbName: apiData.arbName,
      arbBankName: apiData.arbBankName,
      arbSwiftCode: apiData.arbSwiftCode,
      arbRoutingCode: apiData.arbRoutingCode || '',
      arbAccountNumber: apiData.arbAccountNumber,
      assetRegisterId: apiData.assetRegisterId,
      createdAt: apiData.createdAt,
      updatedAt: apiData.updatedAt,
      status: apiData.status,
      enabled: apiData.enabled,
    }
  }

  mapUIToBeneficiaryAPI(
    uiData: Record<string, unknown>
  ): UpdateBuildPartnerBeneficiaryData {
    return {
      arbBeneficiaryId: uiData.arbBeneficiaryId as string,
      arbBeneficiaryType: uiData.arbBeneficiaryType as string,
      arbName: uiData.arbName as string,
      arbBankName: uiData.arbBankName as string,
      arbSwiftCode: uiData.arbSwiftCode as string,
      arbRoutingCode: uiData.arbRoutingCode as string,
      arbAccountNumber: uiData.arbAccountNumber as string,
    }
  }

  mapFormToBeneficiaryAPI(
    formData: Record<string, unknown>
  ): BuildPartnerBeneficiaryData {
    return {
      arbBeneficiaryId: (formData.arbBeneficiaryId as string) || '',
      arbBeneficiaryType: (formData.arbBeneficiaryType as string) || 'RTGS',
      arbName: (formData.arbName as string) || '',
      arbBankName: (formData.arbBankName as string) || '',
      arbSwiftCode: (formData.arbSwiftCode as string) || '',
      arbRoutingCode: (formData.arbRoutingCode as string) || '',
      arbAccountNumber: (formData.arbAccountNumber as string) || '',
      enabled: true,
    }
  }

  /**
   * Search management firms by name with pagination
   * Used for autocomplete functionality
   */
  async searchBuildPartners(
    query: string,
    page = 0,
    size = 20
  ): Promise<BuildPartner[]> {
    try {
      if (!query || query.trim().length === 0) {
        return []
      }

      const params = {
        ...buildPaginationParams(page, size),
        'arName.contains': query.trim(),
        'deleted.equals': 'false',
        'enabled.equals': 'true',
      }
      const url = `${buildApiUrl(API_ENDPOINTS.ASSET_REGISTER.FIND_ALL)}&${new URLSearchParams(params).toString()}`
      const response = await apiClient.get(url)
      // Handle both single object and paginated response formats
      let buildPartners: BuildPartner[] = []
      
      if (Array.isArray(response)) {
        // Direct array response
        buildPartners = response
      } else if (response && typeof response === 'object') {
        if ('content' in response && Array.isArray(response.content)) {
          // Paginated response format
          buildPartners = response.content
        } else if ('id' in response || 'arName' in response) {
          // Single object response - wrap in array
          buildPartners = [response as BuildPartner]
        }
      }
      
      return buildPartners
    } catch {
      throw new Error('Failed to search management firms')
    }
  }
  // Data mapping functions for fees
  mapFeeResponseToUIData(apiData: BuildPartnerFeeResponse): FeeUIData {
   

    const mapped = {
      id: apiData.id.toString(),
      feeType:
        apiData.arFeeCategoryDTO?.languageTranslationId?.configValue ||
        apiData.arFeeCategoryDTO?.settingValue ||
        '',
      frequency:
        apiData.arFeeFrequencyDTO?.languageTranslationId?.configValue ||
        apiData.arFeeFrequencyDTO?.settingValue ||
        '',
      debitAmount: apiData.debitAmount?.toString() || '',
      feeToBeCollected: apiData.feeCollectionDate || '',
      nextRecoveryDate: apiData.feeNextRecoveryDate || '',
      feePercentage: apiData.feePercentage?.toString() || '',
      amount: apiData.totalAmount?.toString() || '',
      vatPercentage: apiData.vatPercentage?.toString() || '',
      currency:
        apiData.arFeeCurrencyDTO?.languageTranslationId?.configValue ||
        apiData.arFeeCurrencyDTO?.settingValue ||
        '',
    }

    return mapped
  }

  // Transform fee API response to UI-friendly format
  transformFeeResponseToUIData(
    apiResponse: BuildPartnerFeeResponse[]
  ): FeeUIData[] {
    return apiResponse.map((item) => this.mapFeeResponseToUIData(item))
  }
}

export const buildPartnerService = new BuildPartnerService()
