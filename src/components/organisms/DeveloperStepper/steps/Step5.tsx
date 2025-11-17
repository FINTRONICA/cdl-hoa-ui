'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Checkbox,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { useParams } from 'next/navigation'
import {
  buildPartnerService,
  type BuildPartner,
  type BuildPartnerBeneficiaryResponse,
  type BuildPartnerContactResponse,
  type BuildPartnerFeeResponse,
} from '@/services/api/buildPartnerService'
import type { ApiDocumentResponse } from '../developerTypes'
import { formatDate } from '@/utils'
import { GlobalLoading } from '@/components/atoms'
import { useBuildPartnerLabelsWithCache } from '@/hooks/useBuildPartnerLabelsWithCache'
import { getBuildPartnerLabel } from '@/constants/mappings/buildPartnerMapping'
import { useAppStore } from '@/store'

const labelSx = {
  color: '#6B7280',
  fontFamily: 'Outfit, sans-serif',
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '16px',
  letterSpacing: 0,
  marginBottom: '4px',
}

const valueSx = {
  color: '#1F2937',
  fontFamily: 'Outfit, sans-serif',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  letterSpacing: 0,
  wordBreak: 'break-word',
}

const fieldBoxSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
  marginBottom: '16px',
}

const renderDisplayField = (
  label: string,
  value: string | number | null = '-'
) => (
  <Box sx={fieldBoxSx}>
    <Typography sx={labelSx}>{label}</Typography>
    <Typography sx={valueSx}>{value || '-'}</Typography>
  </Box>
)

const renderCheckboxField = (label: string, checked: boolean) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
    <Checkbox checked={checked} disabled sx={{ p: 0, pr: 1 }} />
    <Typography sx={valueSx}>{label}</Typography>
  </Box>
)

// Data interfaces
interface ContactData {
  arcFirstName: string
  arcLastName: string
  arcContactEmail: string
  arcContactAddressLine1: string
  arcContactAddressLine2: string
  arcContactPoBox: string
  arcCountryMobCode: string
  arcContactTelNo: string
  arcContactMobNo: string
  arcContactFaxNo: string
}

interface FeeData {
  bpFeeCategoryDTO?: { languageTranslationId?: { configValue?: string } }
  bpFeeFrequencyDTO?: { languageTranslationId?: { configValue?: string } }
  bpAccountTypeDTO?: {
    languageTranslationId?: { configValue?: string }
    settingValue?: string
  }
  debitAmount?: number
  feeCollectionDate?: string
  feeNextRecoveryDate?: string
  feePercentage?: number
  totalAmount?: number
  vatPercentage?: number
  bpFeeCurrencyDTO?: { languageTranslationId?: { configValue?: string } }
}

interface DocumentData {
  id: string
  fileName: string
  documentType: string
  uploadDate: string
  fileSize: number
}

const hasContentArray = <T,>(
  value: unknown
): value is { content: T[] } => {
  if (!value || typeof value !== 'object') {
    return false
  }
  const content = (value as { content?: unknown }).content
  return Array.isArray(content)
}

const isBeneficiaryResponse = (
  value: unknown
): value is BuildPartnerBeneficiaryResponse => {
  return (
    !!value &&
    typeof value === 'object' &&
    'bpbBeneficiaryId' in value
  )
}

const getRegulatorLabel = (regulator: unknown): string | null => {
  if (!regulator || typeof regulator !== 'object') {
    return null
  }

  const translation = (regulator as {
    languageTranslationId?: { configValue?: string }
    settingValue?: string
  }).languageTranslationId?.configValue

  if (translation) {
    return translation
  }

  return (regulator as { settingValue?: string }).settingValue ?? null
}

type BeneficiaryDisplay = BuildPartnerBeneficiaryResponse & {
  bpbTransferTypeDTO?: {
    languageTranslationId?: { configValue?: string }
  }
}

interface Step5Props {
  developerId?: string | undefined
  onEditStep?: ((stepNumber: number) => void) | undefined
  isReadOnly?: boolean
}

const Step5 = ({ developerId, onEditStep, isReadOnly = false }: Step5Props) => {
  const params = useParams()
  const buildPartnerId = developerId || (params.id as string)

  const [buildPartnerDetails, setBuildPartnerDetails] =
    useState<BuildPartner | null>(null)
  const [contactData, setContactData] = useState<ContactData[]>([])
  const [feeData, setFeeData] = useState<FeeData[]>([])
  const [beneficiaryData, setBeneficiaryData] = useState<BeneficiaryDisplay[]>(
    []
  )
  const [documentData, setDocumentData] = useState<DocumentData[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dynamic labels helper (same as other steps)
  const { data: buildPartnerLabels, getLabel } = useBuildPartnerLabelsWithCache()
  const currentLanguage = useAppStore((state) => state.language) || 'EN'
  const getBuildPartnerLabelDynamic = useCallback(
    (configId: string): string => {
      const fallback = getBuildPartnerLabel(configId)
      return buildPartnerLabels ? getLabel(configId, currentLanguage, fallback) : fallback
    },
    [buildPartnerLabels, currentLanguage, getLabel]
  )

  useEffect(() => {
    const fetchAllData = async () => {
      if (!buildPartnerId) {
        setError('Build Partner ID is required')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Fetch all data in parallel

        const [details, contacts, fees, beneficiaries, documents] =
          await Promise.allSettled([
            buildPartnerService.getBuildPartner(buildPartnerId),
            buildPartnerService.getBuildPartnerContact(buildPartnerId),
            buildPartnerService.getBuildPartnerFees(buildPartnerId),
            buildPartnerService.getBuildPartnerBeneficiaries(buildPartnerId),
            buildPartnerService.getBuildPartnerDocuments(
              buildPartnerId,
              'ASSET_REGISTER'
            ),
          ])

        // Extract values from Promise.allSettled results
        const detailsResult =
          details.status === 'fulfilled' ? details.value : null
        const contactsResult =
          contacts.status === 'fulfilled' ? contacts.value : null
        const feesResult = fees.status === 'fulfilled' ? fees.value : null
        const beneficiariesResult =
          beneficiaries.status === 'fulfilled' ? beneficiaries.value : null
        const documentsResult =
          documents.status === 'fulfilled' ? documents.value : null


        setBuildPartnerDetails(detailsResult as BuildPartner)

        // Handle paginated responses for contacts
        let contactArray: BuildPartnerContactResponse[] = []
        if (hasContentArray<BuildPartnerContactResponse>(contactsResult)) {
          contactArray = contactsResult.content
        } else if (Array.isArray(contactsResult)) {
          contactArray = contactsResult as BuildPartnerContactResponse[]
        }
        const normalizedContacts: ContactData[] = contactArray.map(
          (contact) => ({
            id: contact.id,
            arcContactName: contact.arcContactName ?? null,
            arcFirstName: contact.arcFirstName ?? null,
            arcLastName: contact.arcLastName ?? null,
            arcContactEmail: contact.arcContactEmail ?? null,
            arcContactAddress: contact.arcContactAddress ?? null,
            arcContactAddressLine1: contact.arcContactAddressLine1 ?? null,
            arcContactAddressLine2: contact.arcContactAddressLine2 ?? null,
            arcContactPoBox: contact.arcContactPoBox ?? null,
            arcCountryMobCode: contact.arcCountryMobCode ?? null,
            arcContactTelCode: contact.arcContactTelCode ?? null,
            arcContactTelNo: contact.arcContactTelNo ?? null,
            arcContactMobNo: contact.arcContactMobNo ?? null,
            arcContactFaxNo: contact.arcContactFaxNo ?? null,
            enabled: contact.enabled ?? false,
            workflowStatus: contact.workflowStatus ?? null,
            deleted: contact.deleted ?? null,
            assetRegisterDTO: contact.assetRegisterDTO
              ? {
                  id: contact.assetRegisterDTO.id,
                  enabled: (contact.assetRegisterDTO as { enabled?: boolean })
                    .enabled,
                  deleted: (contact.assetRegisterDTO as { deleted?: boolean })
                    .deleted,
                }
              : undefined,
          })
        )
        setContactData(normalizedContacts)

        // Handle paginated responses for fees
        let feeArray: BuildPartnerFeeResponse[] = []
        if (hasContentArray<BuildPartnerFeeResponse>(feesResult)) {
          feeArray = feesResult.content
        } else if (Array.isArray(feesResult)) {
          feeArray = feesResult as BuildPartnerFeeResponse[]
        }
        const normalizedFees: FeeData[] = feeArray.map((fee) => {
          const normalized: FeeData = {}

          if (fee.debitAmount !== undefined) {
            normalized.debitAmount = fee.debitAmount
          }
          if (fee.feeCollectionDate) {
            normalized.feeCollectionDate = fee.feeCollectionDate
          }
          if (fee.feeNextRecoveryDate) {
            normalized.feeNextRecoveryDate = fee.feeNextRecoveryDate
          }
          if (fee.feePercentage !== undefined) {
            normalized.feePercentage = fee.feePercentage
          }
          if (fee.totalAmount !== undefined) {
            normalized.totalAmount = fee.totalAmount
          }
          if (fee.vatPercentage !== undefined) {
            normalized.vatPercentage = fee.vatPercentage
          }

          const categoryValue =
            fee.bpFeeCategoryDTO?.languageTranslationId?.configValue
          if (categoryValue) {
            normalized.bpFeeCategoryDTO = {
              languageTranslationId: { configValue: categoryValue },
            }
          }

          const frequencyValue =
            fee.bpFeeFrequencyDTO?.languageTranslationId?.configValue
          if (frequencyValue) {
            normalized.bpFeeFrequencyDTO = {
              languageTranslationId: { configValue: frequencyValue },
            }
          }

          const currencyValue =
            fee.bpFeeCurrencyDTO?.languageTranslationId?.configValue
          if (currencyValue) {
            normalized.bpFeeCurrencyDTO = {
              languageTranslationId: { configValue: currencyValue },
            }
          }

          const accountTranslation =
            fee.bpAccountTypeDTO?.languageTranslationId?.configValue
          const accountSetting = fee.bpAccountTypeDTO?.settingValue
          if (accountTranslation || accountSetting) {
            const accountDto: NonNullable<FeeData['bpAccountTypeDTO']> = {}
            if (accountTranslation) {
              accountDto.languageTranslationId = {
                configValue: accountTranslation,
              }
            }
            if (accountSetting) {
              accountDto.settingValue = accountSetting
            }
            normalized.bpAccountTypeDTO = accountDto
          }

          return normalized
        })
        setFeeData(normalizedFees)

        // Handle different possible beneficiary response formats
        let beneficiaryArray: BeneficiaryDisplay[] = []
        if (hasContentArray<BeneficiaryDisplay>(beneficiariesResult)) {
          beneficiaryArray = beneficiariesResult.content
        } else if (Array.isArray(beneficiariesResult)) {
          beneficiaryArray =
            beneficiariesResult as BeneficiaryDisplay[]
        } else if (isBeneficiaryResponse(beneficiariesResult)) {
          beneficiaryArray = [beneficiariesResult]
        }
        setBeneficiaryData(beneficiaryArray)

        // Handle paginated responses for documents
        let documentArray: ApiDocumentResponse[] = []
        if (hasContentArray<ApiDocumentResponse>(documentsResult)) {
          documentArray = documentsResult.content
        } else if (Array.isArray(documentsResult)) {
          documentArray = documentsResult as ApiDocumentResponse[]
        }

        setDocumentData(
          documentArray.map((doc) => ({
            id: doc.id?.toString() || '',
            fileName: doc.documentName || '',
            documentType:
              doc.documentTypeDTO?.languageTranslationId?.configValue || '',
            uploadDate: doc.uploadDate || '',
            fileSize: Number(doc.documentSize ?? 0),
          }))
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [buildPartnerId])

  // Render contact fields with actual API data
  const renderContactFields = (
    contact: ContactData,
    title: string,
    isLast: boolean
  ) => {
    const fields = [
      {
        label: getBuildPartnerLabelDynamic('CDL_AR_AUTH_NAME'),
        value:
          `${contact.arcFirstName || ''} ${contact.arcLastName || ''}`.trim() ||
          '',
        gridSize: 6,
      },
      {
        label: getBuildPartnerLabelDynamic('CDL_AR_EMAIL_ADDRESS'),
        value: contact.arcContactEmail || ' ',
        gridSize: 6,
      },
      {
        label: getBuildPartnerLabelDynamic('CDL_AR_BUSINESS_ADDRESS'),
        value:
          `${contact.arcContactAddressLine1 || ''} ${contact.arcContactAddressLine2 || ''}`.trim() ||
          '',
        gridSize: 6,
      },
      {
        label: getBuildPartnerLabelDynamic('CDL_AR_POBOX'),
        value: contact.arcContactPoBox || '',
        gridSize: 6,
      },
      {
        label: getBuildPartnerLabelDynamic('CDL_AR_COUNTRY_CODE'),
        value: contact.arcCountryMobCode || '',
        gridSize: 3,
      },
      {
        label: getBuildPartnerLabelDynamic('CDL_AR_TELEPHONE_NUMBER'),
        value: contact.arcContactTelNo || '',
        gridSize: 3,
      },
      {
        label: getBuildPartnerLabelDynamic('CDL_AR_MOBILE_NUMBER'),
        value: contact.arcContactMobNo || '',
        gridSize: 3,
      },
      { label: getBuildPartnerLabelDynamic('CDL_AR_FAX_NUMBER'), value: contact.arcContactFaxNo || '', gridSize: 3 },
    ]
    return (
      <Box sx={{ mb: 0 }}>
        <Typography
          sx={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 500,
            fontStyle: 'normal',
            fontSize: '16px',
            lineHeight: '28px',
            letterSpacing: '0.15px',
            verticalAlign: 'middle',
            mb: 2,
          }}
        >
          {title}
        </Typography>
        <Grid container spacing={3}>
          {fields.map((field, idx) => (
            <Grid
              size={{ xs: 12, md: field.gridSize || 6 }}
              key={`${title}-${idx}`}
            >
              {renderDisplayField(
                field.label,
                field.value as string | number | null
              )}
            </Grid>
          ))}
        </Grid>
        {!isLast && <Divider sx={{ mb: 0, mt: 4 }} />}
      </Box>
    )
  }

  // Render fee fields with actual API data
  const renderFeeFields = (fee: FeeData, title: string, isLast: boolean) => {
    const fields = [
      {
        label: getBuildPartnerLabelDynamic('CDL_BP_FEES_TYPE'),
        value: fee.bpFeeCategoryDTO?.languageTranslationId?.configValue || '',
        gridSize: 6,
      },
      {
        label: getBuildPartnerLabelDynamic('CDL_BP_FEES_FREQUENCY'),
        value: fee.bpFeeFrequencyDTO?.languageTranslationId?.configValue || '',
        gridSize: 6,
      },
      {
        label: getBuildPartnerLabelDynamic('CDL_BP_FEES_ACCOUNT'),
        value:
          fee.bpAccountTypeDTO?.languageTranslationId?.configValue ||
          fee.bpAccountTypeDTO?.settingValue ||
          '',
        gridSize: 6,
      },
      {
        label: getBuildPartnerLabelDynamic('CDL_BP_FEES_AMOUNT'),
        value: fee.debitAmount?.toString() || '',
        gridSize: 6,
      },
      {
        label: getBuildPartnerLabelDynamic('CDL_BP_FEES_TOTAL'),
        value: fee.feeCollectionDate
          ? formatDate(fee.feeCollectionDate, 'DD/MM/YYYY')
          : '',
        gridSize: 6,
      },
      {
        label: getBuildPartnerLabelDynamic('CDL_BP_FEES_DATE'),
        value: fee.feeNextRecoveryDate
          ? formatDate(fee.feeNextRecoveryDate, 'DD/MM/YYYY')
          : '',
        gridSize: 6,
      },
      {
        label: getBuildPartnerLabelDynamic('CDL_BP_FEES_RATE'),
        value: fee.feePercentage?.toString() || '',
        gridSize: 6,
      },
      {
        label: getBuildPartnerLabelDynamic('CDL_BP_FEES_TOTAL_AMOUNT'),
        value: fee.totalAmount?.toString() || '',
        gridSize: 6,
      },
      {
        label: getBuildPartnerLabelDynamic('CDL_BP_FEES_VAT'),
        value: fee.vatPercentage?.toString() || '',
        gridSize: 6,
      },
      {
        label: getBuildPartnerLabelDynamic('CDL_BP_FEES_CURRENCY'),
        value: fee.bpFeeCurrencyDTO?.languageTranslationId?.configValue || '',
        gridSize: 6,
      },
    ]
    return (
      <Box sx={{ mb: 0 }}>
        <Typography
          sx={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 500,
            fontStyle: 'normal',
            fontSize: '16px',
            lineHeight: '28px',
            letterSpacing: '0.15px',
            verticalAlign: 'middle',
            mb: 2,
          }}
        >
          {title}
        </Typography>
        <Grid container spacing={3}>
          {fields.map((field, idx) => (
            <Grid
              size={{ xs: 12, md: field.gridSize || 6 }}
              key={`${title}-${idx}`}
            >
              {renderDisplayField(
                field.label,
                field.value as string | number | null
              )}
            </Grid>
          ))}
        </Grid>
        {!isLast && <Divider sx={{ mb: 0, mt: 4 }} />}
      </Box>
    )
  }

  // Render beneficiary fields with actual API data
  const renderBeneficiaryFields = (
    beneficiary: BeneficiaryDisplay,
    title: string,
    isLast: boolean
  ) => {
    const fields = [
      {
        label: getBuildPartnerLabelDynamic('CDL_BP_BENE_PAYMODE'),
        value: beneficiary?.bpbTransferTypeDTO?.languageTranslationId?.configValue || 
               beneficiary.bpbBeneficiaryType || '',
        gridSize: 6,
      },
      {
        label: getBuildPartnerLabelDynamic('CDL_BP_BENE_REF'),
        value: beneficiary.bpbBeneficiaryId || '',
        gridSize: 6,
      },
      { label: getBuildPartnerLabelDynamic('CDL_BP_BENE_NAME'), value: beneficiary.bpbName || '', gridSize: 6 },
      { label: getBuildPartnerLabelDynamic('CDL_BP_BENE_BANK'), value: beneficiary.bpbBankName || '', gridSize: 6 },
      {
        label: getBuildPartnerLabelDynamic('CDL_BP_BENE_ACCOUNT'),
        value: beneficiary.bpbAccountNumber || '',
        gridSize: 6,
      },
      {
        label: getBuildPartnerLabelDynamic('CDL_BP_BENE_BIC'),
        value: beneficiary.bpbSwiftCode || '',
        gridSize: 6,
      },
      {
        label: getBuildPartnerLabelDynamic('CDL_BP_BENE_ROUTING'),
        value: beneficiary.bpbRoutingCode || '',
        gridSize: 6,
      },
    ]
    return (
      <Box sx={{ mb: 0 }}>
        <Typography
          sx={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 500,
            fontStyle: 'normal',
            fontSize: '16px',
            lineHeight: '28px',
            letterSpacing: '0.15px',
            verticalAlign: 'middle',
            mb: 2,
          }}
        >
          {title}
        </Typography>
        <Grid container spacing={3}>
          {fields.map((field, idx) => (
            <Grid
              size={{ xs: 12, md: field.gridSize || 6 }}
              key={`${title}-${idx}`}
            >
              {renderDisplayField(
                field.label,
                field.value as string | number | null
              )}
            </Grid>
          ))}
        </Grid>
        {!isLast && <Divider sx={{ mb: 0, mt: 4 }} />}
      </Box>
    )
  }

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: '#FFFFFFBF',
          borderRadius: '16px',
          margin: '0 auto',
          width: '100%',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <GlobalLoading fullHeight className="min-h-[400px]" />
      </Box>
    )
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    )
  }

  // No data state
  if (!buildPartnerDetails) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No build partner details found.</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Card
        sx={{
          boxShadow: 'none',
          backgroundColor: '#FFFFFF',
          width: '100%',
          margin: '0 auto',
          mb: 3,
          border: '1px solid #E5E7EB',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: '24px',
                color: '#1E2939',
              }}
            >
              {getBuildPartnerLabelDynamic('CDL_AR_DETAILS')}
            </Typography>
            {!isReadOnly && (
              <Button
                startIcon={<EditIcon />}
                variant="outlined"
                onClick={() => {
                  
                  onEditStep?.(0)
                }}
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#6B7280',
                  borderColor: '#D1D5DB',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#9CA3AF',
                    backgroundColor: '#F9FAFB',
                  },
                }}
              >
                Edit
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 3, borderColor: '#E5E7EB' }} />
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDisplayField(
                getBuildPartnerLabelDynamic('CDL_AR_ID'),
                buildPartnerDetails.arDeveloperId
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDisplayField(
                getBuildPartnerLabelDynamic('CDL_AR_CIF'),
                buildPartnerDetails.arCifrera
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDisplayField(
                getBuildPartnerLabelDynamic('CDL_AR_REGNO'),
                buildPartnerDetails.arDeveloperRegNo
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDisplayField(
                getBuildPartnerLabelDynamic('CDL_AR_REGDATE'),
                buildPartnerDetails.arOnboardingDate
                  ? formatDate(
                      buildPartnerDetails.arOnboardingDate,
                      'DD/MM/YYYY'
                    )
                  : ' '
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDisplayField(
                getBuildPartnerLabelDynamic('CDL_AR_NAME'),
                buildPartnerDetails.arName
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDisplayField(
                getBuildPartnerLabelDynamic('CDL_AR_NAME_LOCALE'),
                buildPartnerDetails.arNameLocal
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDisplayField(
                getBuildPartnerLabelDynamic('CDL_AR_MASTER'),
                buildPartnerDetails.arMasterName
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDisplayField(
                getBuildPartnerLabelDynamic('CDL_AR_PROJECT'),
                buildPartnerDetails.arProjectName || 'N/A'
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDisplayField(
                getBuildPartnerLabelDynamic('CDL_AR_MASTER_DEVELOPER'),
                buildPartnerDetails.arMasterDeveloper || 'N/A'
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDisplayField(
                getBuildPartnerLabelDynamic('CDL_AR_MASTER_COMMUNITY'),
                buildPartnerDetails.arMasterCommunity || 'N/A'
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDisplayField(
                getBuildPartnerLabelDynamic('CDL_AR_COMPANY_NUMBER'),
                buildPartnerDetails.arCompanyNumber || 'N/A'
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDisplayField(
                getBuildPartnerLabelDynamic('CDL_AR_REGULATORY_AUTHORITY'),
                getRegulatorLabel(buildPartnerDetails.arRegulatorDTO)
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              {renderDisplayField(
                getBuildPartnerLabelDynamic('CDL_AR_ADDRESS'),
                buildPartnerDetails.arContactAddress
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              {renderDisplayField(getBuildPartnerLabelDynamic('CDL_AR_MOBILE'), buildPartnerDetails.arMobile)}
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              {renderDisplayField(getBuildPartnerLabelDynamic('CDL_AR_EMAIL'), buildPartnerDetails.arEmail)}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDisplayField(getBuildPartnerLabelDynamic('CDL_AR_FAX'), buildPartnerDetails.arFax)}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDisplayField(
                getBuildPartnerLabelDynamic('CDL_AR_LICENSE'),
                buildPartnerDetails.arLicenseNo
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDisplayField(
                getBuildPartnerLabelDynamic('CDL_AR_LICENSE_VALID'),
                buildPartnerDetails.arLicenseExpDate
                  ? formatDate(
                      buildPartnerDetails.arLicenseExpDate,
                      'DD/MM/YYYY'
                    )
                  : ' '
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              {renderCheckboxField(
                getBuildPartnerLabelDynamic('CDL_AR_WORLD_STATUS'),
                buildPartnerDetails.arWorldCheckFlag === true ||
                  buildPartnerDetails.arWorldCheckFlag === 'true'
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              {renderCheckboxField(
                'Migrated Data',
                buildPartnerDetails.arMigratedData === true
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDisplayField(
                getBuildPartnerLabelDynamic('CDL_AR_WORLD_REMARKS'),
                buildPartnerDetails.arWorldCheckRemarks
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDisplayField(getBuildPartnerLabelDynamic('CDL_AR_NOTES'), buildPartnerDetails.arRemark)}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {renderDisplayField(
                'Account Contact Number',
                buildPartnerDetails.arContactTel
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Submitted Documents Section */}
      {documentData.length > 0 && (
        <Card
          sx={{
            boxShadow: 'none',
            backgroundColor: '#FFFFFF',
            width: '100%',
            margin: '0 auto',
            mb: 3,
            border: '1px solid #E5E7EB',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: '24px',
                  color: '#1E2939',
                }}
              >
                Submitted Documents
              </Typography>
              {!isReadOnly && (
                <Button
                  startIcon={<EditIcon />}
                  variant="outlined"
                  onClick={() => {
                    onEditStep?.(1)
                  }}
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#6B7280',
                    borderColor: '#D1D5DB',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#9CA3AF',
                      backgroundColor: '#F9FAFB',
                    },
                  }}
                >
                  Edit
                </Button>
              )}
            </Box>
            <TableContainer
              component={Paper}
              sx={{ boxShadow: 'none', border: '1px solid #E5E7EB' }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                    <TableCell
                      sx={{
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#374151',
                        borderBottom: '1px solid #E5E7EB',
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#374151',
                        borderBottom: '1px solid #E5E7EB',
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#374151',
                        borderBottom: '1px solid #E5E7EB',
                      }}
                    >
                      Type
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documentData.map((doc, index) => (
                    <TableRow
                      key={doc.id || index}
                      sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}
                    >
                      <TableCell
                        sx={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          color: '#374151',
                          borderBottom: '1px solid #E5E7EB',
                        }}
                      >
                        {doc.fileName}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          color: '#374151',
                          borderBottom: '1px solid #E5E7EB',
                        }}
                      >
                        {formatDate(doc.uploadDate, 'DD/MM/YYYY')}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          color: '#374151',
                          borderBottom: '1px solid #E5E7EB',
                        }}
                      >
                        {doc.documentType}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Contact Details Section */}
      {contactData.length > 0 && (
        <Card
          sx={{
            boxShadow: 'none',
            backgroundColor: '#FFFFFF',
            width: '100%',
            margin: '0 auto',
            mb: 3,
            border: '1px solid #E5E7EB',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: '24px',
                  color: '#1E2939',
                }}
              >
              {getBuildPartnerLabelDynamic('CDL_AR_CONTACT')}
              </Typography>
              {!isReadOnly && (
                <Button
                  startIcon={<EditIcon />}
                  variant="outlined"
                  onClick={() => {
              
                    onEditStep?.(2)
                  }}
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#6B7280',
                    borderColor: '#D1D5DB',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#9CA3AF',
                      backgroundColor: '#F9FAFB',
                    },
                  }}
                >
                  Edit
                </Button>
              )}
            </Box>
            <Divider sx={{ mb: 3, borderColor: '#E5E7EB' }} />
            <Grid container spacing={3}>
              {contactData.map((contact, index) => (
                <Grid size={{ xs: 12 }} key={index}>
                  {renderContactFields(
                    contact,
                    `Contact ${index + 1}`,
                    index === contactData.length - 1
                  )}
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Fee Details Section */}
      {feeData.length > 0 && (
        <Card
          sx={{
            boxShadow: 'none',
            backgroundColor: '#FFFFFF',
            width: '100%',
            margin: '0 auto',
            mb: 3,
            border: '1px solid #E5E7EB',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: '24px',
                  color: '#1E2939',
                }}
              >
              {getBuildPartnerLabelDynamic('CDL_BP_FEES')}
              </Typography>
              {!isReadOnly && (
                <Button
                  startIcon={<EditIcon />}
                  variant="outlined"
                  onClick={() => {
          
                    onEditStep?.(3)
                  }}
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#6B7280',
                    borderColor: '#D1D5DB',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#9CA3AF',
                      backgroundColor: '#F9FAFB',
                    },
                  }}
                >
                  Edit
                </Button>
              )}
            </Box>
            <Divider sx={{ mb: 3, borderColor: '#E5E7EB' }} />
            <Grid container spacing={3}>
              {feeData.map((fee, index) => (
                <Grid size={{ xs: 12 }} key={index}>
                  {renderFeeFields(
                    fee,
                    `Fee ${index + 1}`,
                    index === feeData.length - 1
                  )}
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Beneficiary Details Section */}
      {beneficiaryData.length > 0 && (
        <Card
          sx={{
            boxShadow: 'none',
            backgroundColor: '#FFFFFF',
            width: '100%',
            margin: '0 auto',
            mb: 3,
            border: '1px solid #E5E7EB',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: '24px',
                  color: '#1E2939',
                }}
              >
                {getBuildPartnerLabelDynamic('CDL_BP_BENE_INFO')}
              </Typography>
              {!isReadOnly && (
                <Button
                  startIcon={<EditIcon />}
                  variant="outlined"
                  onClick={() => {
            
                    onEditStep?.(4)
                  }}
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#6B7280',
                    borderColor: '#D1D5DB',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#9CA3AF',
                      backgroundColor: '#F9FAFB',
                    },
                  }}
                >
                  Edit
                </Button>
              )}
            </Box>
            <Divider sx={{ mb: 3, borderColor: '#E5E7EB' }} />
            <Grid container spacing={3}>
              {beneficiaryData.map((beneficiary, index) => (
                <Grid size={{ xs: 12 }} key={beneficiary.id || index}>
                  {renderBeneficiaryFields(
                    beneficiary,
                    `Beneficiary ${index + 1}`,
                    index === beneficiaryData.length - 1
                  )}
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default Step5
