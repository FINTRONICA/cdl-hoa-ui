import { useState, useEffect } from 'react'
import {
  realEstateAssetService,
  type RealEstateAsset,
} from '../services/api/realEstateAssetService1'

interface UseRealEstateAssetsReturn {
  data: RealEstateAsset[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook to fetch real estate assets for project dropdown
 */
export const useRealEstateAssets = (): UseRealEstateAssetsReturn => {
  const [data, setData] = useState<RealEstateAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRealEstateAssets = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await realEstateAssetService.findAllRealEstateAssets()
      const firms = Array.isArray(response) ? response : response.content || []
      setData(firms)
    } catch (err) {
      console.error('Error fetching real estate assets:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch real estate assets'
      )
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRealEstateAssets()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchRealEstateAssets,
  }
}

/**
 * Transform real estate asset data for dropdown usage
 */
export const transformRealEstateAssetsForDropdown = (
  assets: RealEstateAsset[]
) => {
  return assets.map((asset) => ({
    id: asset.id,
    displayName:
      asset.mfName ??
      asset.assetRegisterDTO?.arName ??
      asset.mfId ??
      asset.id?.toString() ??
      'Management Firm',
    settingValue: asset.mfId ?? asset.id?.toString() ?? '',
    // Additional data for dependent fields
    projectId: asset.mfId ?? asset.id?.toString() ?? '',
    assetRegisterId:
      asset.assetRegisterDTO?.arDeveloperRegNo ??
      asset.assetRegisterDTO?.arDeveloperId ??
      '',
    assetRegisterName:
      asset.assetRegisterDTO?.arMasterName ??
      asset.assetRegisterDTO?.arName ??
      '',
    managementFirmCif: asset.mfId ?? '',
    // Store the full asset for reference
    fullAsset: asset,
  }))
}
