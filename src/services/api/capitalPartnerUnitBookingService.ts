import { apiClient } from '@/lib/apiClient'
import { buildApiUrl, API_ENDPOINTS } from '@/constants/apiEndpoints'

// ---------- Request DTO ----------
export interface CapitalPartnerUnitBookingRequest {
  owrubAmountPaid?: number
  owrubAreaSize?: number
  owrubForFeitAmount?: number
  owrubDldAmount?: number
  owrubRefundAmount?: number
  owrubRemarks?: string
  owrubTransferredAmount?: number
  capitalPartnerUnitDTOS?: Array<{ id: number }>
  deleted?: boolean
}

// ---------- Response DTO ----------
export interface CapitalPartnerUnitBookingResponse {
  id: number
  owrubAmountPaid?: number
  owrubAreaSize?: number
  owrubForFeitAmount?: number
  owrubDldAmount?: number
  owrubRefundAmount?: number
  owrubRemarks?: string
  owrubTransferredAmount?: number
  capitalPartnerUnitDTOS?: Array<{ id: number }>
  deleted: boolean
  createdAt?: string
  updatedAt?: string
}

// ---------- Service ----------
class CapitalPartnerUnitBookingService {
  async getCapitalPartnerUnitBookingById(
    id: number
  ): Promise<CapitalPartnerUnitBookingResponse> {
    const url = buildApiUrl(
      API_ENDPOINTS.OWNER_REGISTRY_UNIT_BOOKING.GET_BY_ID(id.toString())
    )
    const data = await apiClient.get<CapitalPartnerUnitBookingResponse>(url)
    return data
  }

  async updateCapitalPartnerUnitBooking(
    id: number,
    payload: Partial<CapitalPartnerUnitBookingRequest>
  ): Promise<CapitalPartnerUnitBookingResponse> {
    const url = buildApiUrl(
      API_ENDPOINTS.OWNER_REGISTRY_UNIT_BOOKING.UPDATE(id.toString())
    )
    const response = await apiClient.put(url, payload)
    return response as CapitalPartnerUnitBookingResponse
  }

  async deleteCapitalPartnerUnitBooking(id: number): Promise<void> {
    const url = buildApiUrl(
      API_ENDPOINTS.OWNER_REGISTRY_UNIT_BOOKING.DELETE(id.toString())
    )
    await apiClient.delete(url)
  }

  async createCapitalPartnerUnitBooking(
    payload: any
  ): Promise<CapitalPartnerUnitBookingResponse> {
    const url = buildApiUrl(API_ENDPOINTS.OWNER_REGISTRY_UNIT_BOOKING.SAVE)
    const response = await apiClient.post(url, payload)
    return response as CapitalPartnerUnitBookingResponse
  }
}

// Export service instance
export const capitalPartnerUnitBookingService =
  new CapitalPartnerUnitBookingService()
export { CapitalPartnerUnitBookingService }
