import { apiClient } from '@/lib/apiClient'
import { buildApiUrl, API_ENDPOINTS } from '@/constants/apiEndpoints'

// ---------- Request DTO ----------
export interface CapitalPartnerUnitPurchaseRequest {
  owruPurchaseDate?: string
  owrupSaleRate?: number
  owruPurchasePrice?: number
  owrupUnitRegistrationFee?: number
  owrupAgentName?: string
  owrupAgentId?: string
  owrupGrossSaleprice?: number
  owrupVatApplicable?: boolean
  owrupDeedNo?: string
  owrupAgreementNo?: string
  owrupAgreementDate?: string
  owrupSalePurchaseAgreement?: boolean
  owrupWorldCheck?: boolean
  owrupAmtPaidToDevInEscorw?: number
  owrupAmtPaidToDevOutEscorw?: number
  owrupTotalAmountPaid?: number
  owrupUnitIban?: string
  owrupOqood?: boolean
  owrupOqoodPaid?: boolean
  owrupOqoodAmountPaid?: number
  owrupUnitAreaSize?: number
  owrupForfeitAmount?: number
  owrupDldAmount?: number
  owrupRefundAmount?: number
  owrupRemarks?: string
  owrupTransferredAmount?: number
  owrupUnitNoOtherFormat?: string
  owrupSalePrice?: number
  owrupProjectPaymentPlan?: boolean
  owrupReservationBookingForm?: boolean
  owrupModificationFeeNeeded?: boolean
  owrupCreditCurrencyDTO?: any
  owruPurchasePriceCurrencyDTO?: any
  capitalPartnerUnitDTO?: {
    id: number
    capitalPartnerDTOS?: Array<{ id: number }>
  }
  deleted?: boolean
}

// ---------- Response DTO ----------
export interface CapitalPartnerUnitPurchaseResponse {
  id: number
  owruPurchaseDate?: string
  owrupSaleRate?: number
  owruPurchasePrice?: number
  owrupUnitRegistrationFee?: number
  owrupAgentName?: string
  owrupAgentId?: string
  owrupGrossSaleprice?: number
  owrupVatApplicable?: boolean
  owrupDeedNo?: string
  owrupAgreementNo?: string
  owrupAgreementDate?: string
  owrupSalePurchaseAgreement?: boolean
  owrupWorldCheck?: boolean
  owrupAmtPaidToDevInEscorw?: number
  owrupAmtPaidToDevOutEscorw?: number
  owrupTotalAmountPaid?: number
  owrupUnitIban?: string
  owrupOqood?: boolean
  owrupOqoodPaid?: boolean
  owrupOqoodAmountPaid?: number
  owrupUnitAreaSize?: number
  owrupForfeitAmount?: number
  owrupDldAmount?: number
  owrupRefundAmount?: number
  owrupRemarks?: string
  owrupTransferredAmount?: number
  owrupUnitNoOtherFormat?: string
  owrupSalePrice?: number
  owrupProjectPaymentPlan?: boolean
  owrupReservationBookingForm?: boolean
  owrupModificationFeeNeeded?: boolean
  owrupCreditCurrencyDTO?: any
  owruPurchasePriceCurrencyDTO?: any
  capitalPartnerUnitDTO?: {
    id: number
    capitalPartnerDTOS?: Array<{ id: number }>
  }
  deleted: boolean
  createdAt?: string
  updatedAt?: string
}

// ---------- Service ----------
class CapitalPartnerUnitPurchaseService {
  async getCapitalPartnerUnitPurchaseById(
    id: number
  ): Promise<CapitalPartnerUnitPurchaseResponse> {
    const url = buildApiUrl(
      API_ENDPOINTS.OWNER_REGISTRY_UNIT_PURCHASE.GET_BY_ID(id.toString())
    )
    const data = await apiClient.get<CapitalPartnerUnitPurchaseResponse>(url)
    return data
  }

  async updateCapitalPartnerUnitPurchase(
    id: number,
    payload: Partial<CapitalPartnerUnitPurchaseRequest>
  ): Promise<CapitalPartnerUnitPurchaseResponse> {
    const url = buildApiUrl(
      API_ENDPOINTS.OWNER_REGISTRY_UNIT_PURCHASE.UPDATE(id.toString())
    )
    const response = await apiClient.put(url, payload)
    return response as CapitalPartnerUnitPurchaseResponse
  }

  async deleteCapitalPartnerUnitPurchase(id: number): Promise<void> {
    const url = buildApiUrl(
      API_ENDPOINTS.OWNER_REGISTRY_UNIT_PURCHASE.DELETE(id.toString())
    )
    await apiClient.delete(url)
  }

  async createCapitalPartnerUnitPurchase(
    payload: any
  ): Promise<CapitalPartnerUnitPurchaseResponse> {
    const url = buildApiUrl(API_ENDPOINTS.OWNER_REGISTRY_UNIT_PURCHASE.SAVE)
    const response = await apiClient.post(url, payload)
    return response as CapitalPartnerUnitPurchaseResponse
  }
}

// Export service instance
export const capitalPartnerUnitPurchaseService =
  new CapitalPartnerUnitPurchaseService()
export { CapitalPartnerUnitPurchaseService }
