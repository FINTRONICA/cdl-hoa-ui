import type { CapitalPartnerResponse } from '@/services/api/capitalPartnerService'
import { CapitalPartnerUIData } from '@/services/api/capitalPartnerService'

export const mapCapitalPartnerToInvestorData = (
  cp: CapitalPartnerResponse
): CapitalPartnerUIData => {
  try {
    const mapApiStatus = (taskStatusDTO: any | null): string => {
      if (!taskStatusDTO) {
        return 'INITIATED'
      }

      return taskStatusDTO.code || 'INITIATED'
    }

    // Extract build partner data from nested structure
    const buildPartnerData =
      cp.ownerRegistryUnitDTO?.managementFirmDTO?.assetRegisterDTO

    return {
      id: cp.id,
      investor: cp.ownerRegistryName ?? '-',
      investorId: cp.ownerRegistryId ?? '-',
      developerName: cp.ownerRegistryLocaleName ?? '-',
      developerIdRera: cp.ownerRegistryIdNo ?? '-',
      developerCif: cp.ownerRegistryOwnershipPercentage?.toString() ?? '-',
      projectName:
        cp.ownerRegistryUnitDTO?.managementFirmDTO?.mfName ?? '-',
      projectCIF: cp.ownerRegistryUnitDTO?.managementFirmDTO?.mfCif ?? '-',
      unitNumber: cp.ownerRegistryUnitDTO?.unitRefId ?? '-',
      approvalStatus: mapApiStatus(cp.taskStatusDTO),
      buildPartnerName: buildPartnerData?.arName ?? '-',
      buildPartnerCif: buildPartnerData?.arCifrera ?? '-',
      buildPartnerId: buildPartnerData?.arDeveloperId ?? '-',
    }
  } catch (error) {
    console.error('Error mapping capital partner data:', error, cp)
    // Return a safe fallback object
    return {
      id: cp.id || 0,
      investor: '-',
      investorId: '-',
      developerName: '-',
      developerIdRera: '-',
      developerCif: '-',
      projectName: '-',
      projectCIF: '-',
      unitNumber: '-',
      approvalStatus: 'INITIATED',
      buildPartnerName: '-',
      buildPartnerCif: '-',
      buildPartnerId: '-',
    }
  }
}
