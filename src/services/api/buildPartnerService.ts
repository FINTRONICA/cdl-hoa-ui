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

// Build Partner types - Updated to match API response structure
export interface BuildPartner {
  id: number
  arDeveloperId: string
  arCifrera: string | null
  arDeveloperRegNo: string
  arName: string | null
  arMasterName: string | null
  arNameLocal: string | null
  arOnboardingDate: string | null
  arContactAddress: string | null
  arContactTel: string | null
  arPoBox: string | null
  arMobile: string | null
  arFax: string | null
  arEmail: string | null
  arLicenseNo: string | null
  arLicenseExpDate: string | null
  arWorldCheckFlag: boolean | string | null
  arWorldCheckRemarks: string | null
  arMigratedData: boolean | null
  arRemark: string | null
  arRegulatorDTO: unknown | null
  arActiveStatusDTO: unknown | null
  arProjectName?: string | null
  arCompanyNumber?: string | null
  arMasterCommunity?: string | null
  arMasterDeveloper?: string | null
  buildPartnerBeneficiaryDTOS: unknown[] | null
  buildPartnerContactDTOS: unknown[] | null
  taskStatusDTO: TaskStatusDTO | null
 
}

export interface CreateBuildPartnerRequest {
  arName: string
  arDeveloperId: string
  arCifrera: string
  arNameLocal?: string
  arWorldCheckFlag?: boolean | string
  arContactAddress?: string
  arContactTel?: string
  arEmail?: string
  arMobile?: string
  arLicenseNo?: string
  arLicenseExpDate?: string
  arMasterName?: string
  arProjectName?: string
  arMasterDeveloper?: string
  arMasterCommunity?: string
  arCompanyNumber?: string
}

export interface UpdateBuildPartnerRequest {
  arName?: string
  arDeveloperId?: string
  arCifrera?: string
  arNameLocal?: string
  arWorldCheckFlag?: boolean | string
  arContactAddress?: string
  arContactTel?: string
  arEmail?: string
  arMobile?: string
  arLicenseNo?: string
  arLicenseExpDate?: string
  arMasterName?: string
  arProjectName?: string
  arMasterDeveloper?: string
  arMasterCommunity?: string
  arCompanyNumber?: string
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

// Build Partner form data types
export interface BuildPartnerDetailsData {
  arName: string
  arDeveloperId: string
  arCifrera: string
  arNameLocal: string
  arWorldCheckFlag?: boolean | string
  arDeveloperRegNo?: string
  arMasterName?: string
  arProjectName?: string
  arMasterDeveloper?: string
  arMasterCommunity?: string
  arCompanyNumber?: string
  arOnboardingDate?: string | null
  arContactAddress?: string
  arContactTel?: string
  arPoBox?: string
  arMobile?: string
  arFax?: string
  arEmail?: string
  arLicenseNo?: string
  arLicenseExpDate?: string | null
  arWorldCheckRemarks?: string
  arMigratedData?: boolean
  arRemark?: string
  arRegulatorId?: number | string
  arRegulatorDTO?: {
    id?: number | string | null
  }
}

// UI-friendly BuildPartner interface for table display
export interface BuildPartnerUIData {
  id: string
  name: string
  developerId: string
  developerCif: string
  assetRegisterId: string
  assetRegisterCif: string
  localeNames: string
  arProjectName: string
  arMasterDeveloper: string
  arMasterCommunity: string
  arCompanyNumber: string
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
    assetRegisterId: apiData.arDeveloperId || 'N/A',
    assetRegisterCif: apiData.arCifrera || 'N/A',
    localeNames: apiData.arNameLocal || '---',
    arProjectName: apiData.arProjectName || 'N/A',
    arMasterDeveloper: apiData.arMasterDeveloper || 'N/A',
    arMasterCommunity: apiData.arMasterCommunity || 'N/A',
    arCompanyNumber: apiData.arCompanyNumber || 'N/A',
    status: mapApiStatus(apiData.taskStatusDTO),
    registrationDate: apiData.arOnboardingDate || undefined,
    lastUpdated: apiData.arOnboardingDate || undefined,
    contactPerson: apiData.arContactAddress || undefined,
  }
}

export interface BuildPartnerContactData {
  id?: number | string
  arcFirstName: string
  arcLastName: string
  arcContactEmail: string
  arcContactName?: string | null
  arcContactAddress?: string | null
  arcContactAddressLine1: string
  arcContactAddressLine2: string
  arcContactPoBox: string
  arcCountryMobCode: string
  arcContactTelCode?: string | null
  arcContactTelNo: string
  arcContactMobNo: string
  arcContactFaxNo: string
  enabled?: boolean
  deleted?: boolean | null
  workflowStatus?: string | null
  assetRegisterDTO?: {
    id?: number
    enabled?: boolean
    deleted?: boolean
  }
}

// API Response interface for contact data (includes nested assetRegisterDTO)
export interface BuildPartnerContactResponse {
  id: number
  arcContactName: string | null
  arcFirstName: string
  arcLastName: string
  arcContactTelCode: string | null
  arcContactTelNo: string
  arcCountryMobCode: string
  arcContactMobNo: string
  arcContactEmail: string
  arcContactAddress: string | null
  arcContactAddressLine1: string
  arcContactAddressLine2: string
  arcContactPoBox: string
  arcContactFaxNo: string
  enabled: boolean
  workflowStatus: string | null
  deleted: boolean | null
  assetRegisterDTO?: {
    id: number
    [key: string]: unknown
  }
}

export interface BuildPartnerFeesData {
  feeStructure: {
    setupFee: number
    transactionFee: number
    monthlyFee: number
  }
  collectionMethod: 'automatic' | 'manual'
  paymentTerms: string
  assetRegisterDTO?: {
    id?: number
  }
}

export interface BuildPartnerIndividualFeeData {
  id?: number | string
  bpFeeCategoryDTO: {
    id: number
  }
  bpFeeFrequencyDTO: {
    id: number
  }
  bpAccountTypeDTO: {
    id: number
  }
  debitAmount: number
  totalAmount: number
  feeCollectionDate: string
  feeNextRecoveryDate: string
  feePercentage: number
  vatPercentage: number
  bpFeeCurrencyDTO: {
    id: number
  }
  assetRegisterDTO?: {
    id: number
  }
}

// API Response interface for fee data
export interface BuildPartnerFeeResponse {
  id: number
  debitAmount?: number
  totalAmount?: number
  feeCollectionDate?: string
  feeNextRecoveryDate?: string
  feePercentage?: number
  vatPercentage?: number
  feeCollected?: unknown
  bpFeeCategoryDTO?: {
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
  bpFeeFrequencyDTO?: {
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
  bpAccountTypeDTO?: {
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
  bpFeeCurrencyDTO?: {
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
  debitAccount?: string
  feeToBeCollected: string
  nextRecoveryDate: string
  feePercentage: string
  amount: string
  vatPercentage: string
  currency: string
}

export interface BuildPartnerBeneficiaryData {
  bpbBeneficiaryId: string
  bpbBeneficiaryType: string
  bpbName: string
  bpbBankName: string
  bpbSwiftCode: string
  bpbRoutingCode: string
  bpbAccountNumber: string
  enabled: boolean
}

// API Response interface for beneficiary data
export interface BuildPartnerBeneficiaryResponse {
  id: number
  bpbBeneficiaryId: string
  bpbBeneficiaryType: string
  bpbName: string
  bpbBankName: string
  bpbSwiftCode: string
  bpbRoutingCode?: string
  bpbAccountNumber: string
  buildPartnerId?: number
  createdAt?: string
  updatedAt?: string
  status?: string
  enabled?: boolean
}

// Update request interface for beneficiary
export interface UpdateBuildPartnerBeneficiaryData {
  bpbBeneficiaryId?: string
  bpbBeneficiaryType?: string
  bpbName?: string
  bpbBankName?: string
  bpbSwiftCode?: string
  bpbRoutingCode?: string
  bpbAccountNumber?: string
}

export interface BuildPartnerReviewData {
  reviewData: unknown
  termsAccepted: boolean
}

// Customer Details API Response Types
export interface CustomerDetailsResponse {
  customerId: string
  cif: string
  name: {
    firstName: string
    shortName: string
    companyNumber?: string
    property?: string
    masterDeveloper?: string
    masterCommunity?: string
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
  private normalizeBuildPartner(data: BuildPartner): BuildPartner {
    if (!data) {
      return data
    }

    const legacy = data as unknown as Record<string, unknown>

    data.arDeveloperId =
      data.arDeveloperId ||
      (legacy.arDeveloperId as string | undefined) ||
      data.arDeveloperId
    data.arCifrera =
      data.arCifrera ??
      (legacy.arCifrera as string | null | undefined) ??
      data.arCifrera
    data.arDeveloperRegNo =
      data.arDeveloperRegNo ||
      (legacy.arDeveloperRegNo as string | undefined) ||
      data.arDeveloperRegNo
    data.arName =
      data.arName ||
      (legacy.arName as string | null | undefined) ||
      data.arName
    data.arMasterName =
      data.arMasterName ||
      (legacy.arMasterName as string | null | undefined) ||
      data.arMasterName
    data.arNameLocal =
      data.arNameLocal ||
      (legacy.arNameLocal as string | null | undefined) ||
      data.arNameLocal
    data.arOnboardingDate =
      data.arOnboardingDate ||
      (legacy.arOnboardingDate as string | null | undefined) ||
      data.arOnboardingDate
    data.arContactAddress =
      data.arContactAddress ||
      (legacy.arContactAddress as string | null | undefined) ||
      data.arContactAddress
    data.arContactTel =
      data.arContactTel ||
      (legacy.arContactTel as string | null | undefined) ||
      data.arContactTel
    data.arPoBox =
      data.arPoBox ??
      (legacy.arPoBox as string | null | undefined) ??
      data.arPoBox
    data.arMobile =
      data.arMobile ||
      (legacy.arMobile as string | null | undefined) ||
      data.arMobile
    data.arFax =
      data.arFax ||
      (legacy.arFax as string | null | undefined) ||
      data.arFax
    data.arEmail =
      data.arEmail ||
      (legacy.arEmail as string | null | undefined) ||
      data.arEmail
    data.arLicenseNo =
      data.arLicenseNo ||
      (legacy.arLicenseNo as string | null | undefined) ||
      data.arLicenseNo
    data.arLicenseExpDate =
      data.arLicenseExpDate ||
      (legacy.arLicenseExpDate as string | null | undefined) ||
      data.arLicenseExpDate
    data.arWorldCheckFlag =
      data.arWorldCheckFlag ??
      (legacy.arWorldCheckFlag as boolean | string | null | undefined) ??
      data.arWorldCheckFlag
    data.arWorldCheckRemarks =
      data.arWorldCheckRemarks ||
      (legacy.arWorldCheckRemarks as string | null | undefined) ||
      data.arWorldCheckRemarks
    data.arMigratedData =
      data.arMigratedData ??
      (legacy.arMigratedData as boolean | null | undefined) ??
      data.arMigratedData
    const legacyRemark =
      (legacy.arremark as string | null | undefined) ??
      (legacy.arremark as string | null | undefined)
    if (data.arRemark == null && legacyRemark != null) {
      data.arRemark = legacyRemark
    }
    if (!data.arRegulatorDTO && legacy.arRegulatorDTO) {
      data.arRegulatorDTO = legacy.arRegulatorDTO
    }

    return data
  }

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
    const url = `${buildApiUrl(API_ENDPOINTS.ASSET_REGISTER.GET_ALL)}&${queryString}`

    try {
      const result = await apiClient.get<
        PaginatedResponse<BuildPartner> | BuildPartner[]
      >(url)

      if (Array.isArray(result)) {
        const normalizedContent = result.map((item) =>
          this.normalizeBuildPartner(item)
        )
        return {
          content: normalizedContent,
          page: {
            size: normalizedContent.length,
            number: page,
            totalElements: normalizedContent.length,
            totalPages: 1,
          },
        }
      }

      if (Array.isArray(result?.content)) {
        result.content = result.content.map((item) =>
          this.normalizeBuildPartner(item)
        )
      }

      return result as PaginatedResponse<BuildPartner>
    } catch (error) {
      throw error
    }
  }

  async getBuildPartner(id: string): Promise<BuildPartner> {
    try {
      const url = buildApiUrl(API_ENDPOINTS.ASSET_REGISTER.GET_BY_ID(id))

      const result = await apiClient.get<BuildPartner>(url)

      return this.normalizeBuildPartner(result)
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

  // Get contacts with pagination
  async getBuildPartnerContactsPaginated(
    buildPartnerId: string,
    page = 0,
    size = 20
  ): Promise<PaginatedResponse<BuildPartnerContactResponse>> {
    try {
      const url = buildApiUrl(
        API_ENDPOINTS.ASSET_REGISTER_CONTACT.GET_BY_ID(buildPartnerId)
      )
      const params = buildPaginationParams(page, size)
      const queryString = new URLSearchParams(params).toString()
      const finalUrl = `${url}&${queryString}`

      const result =
        await apiClient.get<PaginatedResponse<BuildPartnerContactResponse>>(
          finalUrl
        )

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
        const paginatedResult =
          result as PaginatedResponse<BuildPartnerFeeResponse>
        feeArray = Array.isArray(paginatedResult.content)
          ? paginatedResult.content
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

  // Get fees with pagination
  async getBuildPartnerFeesPaginated(
    buildPartnerId: string,
    page = 0,
    size = 20
  ): Promise<PaginatedResponse<FeeUIData>> {
    try {
      const url = buildApiUrl(
        API_ENDPOINTS.ASSET_REGISTER_FEES.GET_BY_ID(buildPartnerId)
      )
      const params = buildPaginationParams(page, size)
      const queryString = new URLSearchParams(params).toString()
      const finalUrl = `${url}&${queryString}`

      const result =
        await apiClient.get<PaginatedResponse<BuildPartnerFeeResponse>>(
          finalUrl
        )

      // Transform the fees in the content array
      const transformedContent = result.content.map((fee) =>
        this.mapFeeResponseToUIData(fee)
      )

      return {
        content: transformedContent,
        page: result.page,
      }
    } catch (error) {
      throw error
    }
  }

  async getBuildPartnerByCif(cif: string): Promise<BuildPartner> {
    try {
      const params = { arCifrera: cif }
      const queryString = new URLSearchParams(params).toString()
      const url = `${buildApiUrl(API_ENDPOINTS.ASSET_REGISTER.GET_ALL)}?${queryString}`

      const result = await apiClient.get<PaginatedResponse<BuildPartner>>(url)

      if (result?.content && result.content.length > 0) {
        const firstPartner = result.content[0]
        if (firstPartner) {
          return this.normalizeBuildPartner(firstPartner)
        }
      }
      throw new Error(`No build partner found with CIF: ${cif}`)
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
        buildApiUrl(API_ENDPOINTS.ASSET_REGISTER.SAVE),
        data
      )

      return this.normalizeBuildPartner(result)
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

      return this.normalizeBuildPartner(result)
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
      // Use PUT for editing existing details - include record id in payload
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
    if (isEditing && data.id) {
      // Use PUT for updating existing contact with ID
      const url = buildApiUrl(
        API_ENDPOINTS.ASSET_REGISTER_CONTACT.UPDATE(data.id.toString())
      )
      // Destructure to remove any existing assetRegisterDTO to avoid sending nested data
      const { assetRegisterDTO: _assetRegisterDTO, ...contactDataWithoutAssetRegister } = data
      void _assetRegisterDTO
      const requestData = {
        ...contactDataWithoutAssetRegister,
        // Preserve workflow-related fields from original data
        enabled: true,
        deleted: false,
        workflowStatus: data.workflowStatus ?? null,
        assetRegisterDTO: {
          id: parseInt(developerId || '0'),
          enabled: true,
          deleted: false,
        },
      }

      const response = await apiClient.put<StepSaveResponse>(url, requestData)
      return response
    } else {
      // Use POST for creating new contact
      const url = buildApiUrl(API_ENDPOINTS.ASSET_REGISTER_CREATE.CONTACT_SAVE)
      // Destructure to remove any existing assetRegisterDTO to avoid sending nested data
      const { assetRegisterDTO: _assetRegisterDTO, ...contactDataWithoutAssetRegister } = data
      void _assetRegisterDTO
      const requestData = {
        ...contactDataWithoutAssetRegister,
        assetRegisterDTO: developerId
          ? { id: parseInt(developerId), enabled: true, deleted: false }
          : undefined,
        enabled: true,
        deleted: false,
        workflowStatus: contactDataWithoutAssetRegister.workflowStatus ?? null,
      }

      const response = await apiClient.post<StepSaveResponse>(url, requestData)
      return response
    }
  }

  async deleteBuildPartnerContact(contactId: string | number): Promise<void> {
    const url = buildApiUrl(
      API_ENDPOINTS.ASSET_REGISTER_CONTACT.SOFT_DELETE(contactId.toString())
    )
    await apiClient.delete(url)
  }

  async getBuildPartnerContactById(
    contactId: string
  ): Promise<BuildPartnerContactResponse> {
    const url = buildApiUrl(`/build-partner-contact/${contactId}`)
    const response = await apiClient.get<BuildPartnerContactResponse>(url)
    return response
  }

  async deleteBuildPartnerFee(feeId: string | number): Promise<void> {
    const url = buildApiUrl(
      API_ENDPOINTS.ASSET_REGISTER_FEES.SOFT_DELETE(feeId.toString())
    )
    await apiClient.delete(url)
  }

  async getBuildPartnerFeeById(feeId: string | number): Promise<unknown> {
    const url = buildApiUrl(
      API_ENDPOINTS.ASSET_REGISTER_FEES.GET_FEE_BY_ID(feeId.toString())
    )
    const response = await apiClient.get(url)
    return response
  }

  async saveBuildPartnerFees(
    data: BuildPartnerFeesData,
    isEditing = false,
    developerId?: string
  ): Promise<StepSaveResponse> {
    if (isEditing && developerId) {
      // Use POST for editing existing fees - wrap data with isEditing and developerId
      const url = buildApiUrl(API_ENDPOINTS.ASSET_REGISTER_CREATE.FEES_SAVE)
      // Destructure to remove any existing assetRegisterDTO to avoid sending nested data
      const { assetRegisterDTO: _assetRegisterDTO, ...feesDataWithoutBuildPartner } = data
      void _assetRegisterDTO
      const requestData = {
        data: {
          ...feesDataWithoutBuildPartner,
          assetRegisterDTO: { id: parseInt(developerId) },
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
      const feeId = data.id

      if (isEditing && feeId) {
        // Use PUT for updating existing individual fee
        const url = buildApiUrl(
          API_ENDPOINTS.ASSET_REGISTER_FEES.UPDATE(feeId.toString())
        )
        // Destructure to remove any existing assetRegisterDTO to avoid sending nested data
        const { assetRegisterDTO: _assetRegisterDTO, ...feeDataWithoutBuildPartner } = data
        void _assetRegisterDTO
        const requestData = {
          ...feeDataWithoutBuildPartner,
          enabled: true,
          deleted: false,
          assetRegisterDTO: { id: parseInt(developerId || '0') },
        }

        const result = await apiClient.put(url, requestData)
        return result
      } else {
        // Use POST for creating new individual fee
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
    developerId?: string,
    beneficiaryId?: string | number
  ): Promise<StepSaveResponse> {
    if (isEditing && beneficiaryId) {
      // Use PUT for editing existing beneficiary
      const url = buildApiUrl(
        API_ENDPOINTS.ASSET_REGISTER_BENEFICIARY.UPDATE(String(beneficiaryId))
      )
      // Destructure to remove any existing assetRegisterDTO or buildPartnerId to avoid sending nested data
      const beneficiaryDataClean = { ...data }
      const requestData = {
        ...beneficiaryDataClean,
        enabled: true,
        deleted: false,
        ...(developerId && {
          assetRegisterDTO: [{ id: parseInt(developerId) }],
        }),
      }

      const response = await apiClient.put<StepSaveResponse>(url, requestData)
      return response
    } else {
      // Use POST for creating new beneficiary
      const url = buildApiUrl(
        API_ENDPOINTS.ASSET_REGISTER_CREATE.BENEFICIARY_SAVE
      )
      // Destructure to remove any existing assetRegisterDTO or buildPartnerId to avoid sending nested data
      const beneficiaryDataClean = { ...data }
      const requestData = {
        ...beneficiaryDataClean,
        ...(developerId && {
          assetRegisterDTO: [{ id: parseInt(developerId) }],
        }),
      }

      const response = await apiClient.post<StepSaveResponse>(url, requestData)
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

      const response = await apiClient.get<{
        content: BuildPartnerBeneficiaryResponse[]
        page: {
          size: number
          number: number
          totalElements: number
          totalPages: number
        }
      }>(url)

      return response?.content || []
    } catch (error) {
      throw error
    }
  }

  // Get beneficiaries with pagination
  async getBuildPartnerBeneficiariesPaginated(
    buildPartnerId?: string,
    page = 0,
    size = 20
  ): Promise<PaginatedResponse<BuildPartnerBeneficiaryResponse>> {
    try {
      if (!buildPartnerId) {
        return {
          content: [],
          page: {
            size,
            number: page,
            totalElements: 0,
            totalPages: 0,
          },
        }
      }

      const url = buildApiUrl(
        API_ENDPOINTS.ASSET_REGISTER_BENEFICIARY.GET_BY_ID(buildPartnerId)
      )
      const params = buildPaginationParams(page, size)
      const queryString = new URLSearchParams(params).toString()
      const finalUrl = `${url}&${queryString}`

      const response =
        await apiClient.get<PaginatedResponse<BuildPartnerBeneficiaryResponse>>(
          finalUrl
        )

      return response
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

  // Delete a beneficiary (soft delete)
  async deleteBuildPartnerBeneficiary(id: string): Promise<void> {
    try {
      const url = buildApiUrl(
        API_ENDPOINTS.ASSET_REGISTER_BENEFICIARY.SOFT_DELETE(id)
      )

      await apiClient.delete(url)
    } catch (error) {
      throw error
    }
  }

  // Soft delete a beneficiary
  async softDeleteBuildPartnerBeneficiary(id: string): Promise<void> {
    try {
      const url = buildApiUrl(
        API_ENDPOINTS.ASSET_REGISTER_BENEFICIARY.SOFT_DELETE(id)
      )

      await apiClient.delete(url)
    } catch (error) {
      throw error
    }
  }

  // Get a specific beneficiary by ID for editing
  async getBuildPartnerBeneficiaryById(
    beneficiaryId: string | number
  ): Promise<unknown> {
    const url = buildApiUrl(`/build-partner-beneficiary/${beneficiaryId}`)
    const response = await apiClient.get(url)
    return response
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
    module: string,
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
      const url = `${buildApiUrl(API_ENDPOINTS.MANAGEMENT_FIRMS_DOCUMENT.GET_ALL)}?${params.toString()}`

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
    module: string,
    documentType?: string
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

      const url = `${buildApiUrl(API_ENDPOINTS.MANAGEMENT_FIRMS_DOCUMENT.UPLOAD)}?${params.toString()}`

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
      bpbBeneficiaryId: apiData.bpbBeneficiaryId,
      bpbBeneficiaryType: apiData.bpbBeneficiaryType,
      bpbName: apiData.bpbName,
      bpbBankName: apiData.bpbBankName,
      bpbSwiftCode: apiData.bpbSwiftCode,
      bpbRoutingCode: apiData.bpbRoutingCode || '',
      bpbAccountNumber: apiData.bpbAccountNumber,
      buildPartnerId: apiData.buildPartnerId,
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
      bpbBeneficiaryId: uiData.bpbBeneficiaryId as string,
      bpbBeneficiaryType: uiData.bpbBeneficiaryType as string,
      bpbName: uiData.bpbName as string,
      bpbBankName: uiData.bpbBankName as string,
      bpbSwiftCode: uiData.bpbSwiftCode as string,
      bpbRoutingCode: uiData.bpbRoutingCode as string,
      bpbAccountNumber: uiData.bpbAccountNumber as string,
    }
  }

  mapFormToBeneficiaryAPI(
    formData: Record<string, unknown>
  ): BuildPartnerBeneficiaryData {
    return {
      bpbBeneficiaryId: (formData.bpbBeneficiaryId as string) || '',
      bpbBeneficiaryType: (formData.bpbBeneficiaryType as string) || 'RTGS',
      bpbName: (formData.bpbName as string) || '',
      bpbBankName: (formData.bpbBankName as string) || '',
      bpbSwiftCode: (formData.bpbSwiftCode as string) || '',
      bpbRoutingCode: (formData.bpbRoutingCode as string) || '',
      bpbAccountNumber: (formData.bpbAccountNumber as string) || '',
      enabled: true,
    }
  }

  /**
   * Search build partners by name with pagination
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
      const url = `${buildApiUrl(API_ENDPOINTS.ASSET_REGISTER.SAVE)}?${new URLSearchParams(params).toString()}`
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

      return buildPartners.map((partner) => this.normalizeBuildPartner(partner))
    } catch {
      throw new Error('Failed to search build partners')
    }
  }
  // Data mapping functions for fees
  mapFeeResponseToUIData(apiData: BuildPartnerFeeResponse): FeeUIData {
    const mapped = {
      id: apiData.id.toString(),
      feeType:
        apiData.bpFeeCategoryDTO?.languageTranslationId?.configValue ||
        apiData.bpFeeCategoryDTO?.settingValue ||
        '',
      frequency:
        apiData.bpFeeFrequencyDTO?.languageTranslationId?.configValue ||
        apiData.bpFeeFrequencyDTO?.settingValue ||
        '',
      debitAmount: apiData.debitAmount?.toString() || '',
      debitAccount:
        apiData.bpAccountTypeDTO?.languageTranslationId?.configValue ||
        apiData.bpAccountTypeDTO?.settingValue ||
        '',
      feeToBeCollected: apiData.feeCollectionDate || '',
      nextRecoveryDate: apiData.feeNextRecoveryDate || '',
      feePercentage: apiData.feePercentage?.toString() || '',
      amount: apiData.totalAmount?.toString() || '',
      vatPercentage: apiData.vatPercentage?.toString() || '',
      currency:
        apiData.bpFeeCurrencyDTO?.languageTranslationId?.configValue ||
        apiData.bpFeeCurrencyDTO?.settingValue ||
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
