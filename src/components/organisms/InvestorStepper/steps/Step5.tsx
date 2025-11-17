'use client'

import { useCapitalPartnerLabelsApi } from '@/hooks/useCapitalPartnerLabelsApi'
import { useAppStore } from '@/store'
import React from 'react'
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
import { useRouter } from 'next/navigation'
import { useGetEnhanced } from '@/hooks/useApiEnhanced'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import {
  CapitalPartnerResponse,
  PaymentPlanResponse,
  BankDetailsResponse,
  CapitalPartnerUnitResponse,
  CapitalPartnerUnitPurchaseResponse,
} from '@/types/capitalPartner'
import { GlobalLoading } from '@/components/atoms'
import { useTranslatedBasicDetails } from '@/hooks/useTranslatedBasicDetails'
import {
  DocumentItem,
  ApiDocumentResponse,
  PaginatedDocumentResponse,
} from '../../DeveloperStepper/developerTypes'
import { buildPartnerService } from '@/services/api/buildPartnerService'
import { mapApiToDocumentItem } from '../../DocumentUpload/configs/buildPartnerConfig'

const labelSx = {
  color: '#6A7282',
  fontFamily: 'Outfit',
  fontWeight: 400,
  fontStyle: 'normal',
  fontSize: '12px',
  letterSpacing: 0,
}

const valueSx = {
  color: '#1E2939',
  fontFamily: 'Outfit',
  fontWeight: 400,
  fontStyle: 'normal',
  fontSize: '14px',
  letterSpacing: 0,
  wordBreak: 'break-word',
}

const fieldBoxSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
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

const SectionLoader = ({ sectionName }: { sectionName: string }) => (
  <Box
    sx={{
      backgroundColor: '#FFFFFFBF',
      borderRadius: '16px',
      margin: '0 auto',
      width: '100%',
      height: '120px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    aria-label={`${sectionName} loading`}
    role="status"
  >
    <GlobalLoading fullHeight className="min-h-[120px]" />
  </Box>
)

const SectionError = ({
  sectionName,
  error,
}: {
  sectionName: string
  error: Error
}) => (
  <Box
    sx={{
      border: '1px solid #FECACA',
      borderRadius: 1,
      backgroundColor: '#FEF2F2',
      p: 2,
    }}
  >
    <Alert severity="error" sx={{ backgroundColor: 'transparent', p: 0 }}>
      Failed to load {sectionName}: {error.message}
    </Alert>
  </Box>
)

interface Step5Props {
  ownerRegistryId?: number | null
  isViewMode?: boolean
}

const Step5: React.FC<Step5Props> = ({
  ownerRegistryId,
  isViewMode = false,
}) => {
  const router = useRouter()
  const { getLabel } = useCapitalPartnerLabelsApi()
  const currentLanguage = useAppStore((state) => state.language)

  const handleEditBasicDetails = () => {
    if (ownerRegistryId) {
      router.push(`/capital-partner/${ownerRegistryId}/step/1`)
    }
  }

  const handleEditUnitDetails = () => {
    if (ownerRegistryId) {
      router.push(`/capital-partner/${ownerRegistryId}/step/3`)
    }
  }

  const handleEditPaymentPlan = () => {
    if (ownerRegistryId) {
      router.push(`/capital-partner/${ownerRegistryId}/step/4`)
    }
  }

  const handleEditBankDetails = () => {
    if (ownerRegistryId) {
      router.push(`/capital-partner/${ownerRegistryId}/step/5`)
    }
  }

  const {
    data: capitalPartnerData,
    isLoading: isLoadingBasic,
    error: errorBasic,
  } = useGetEnhanced<CapitalPartnerResponse>(
    API_ENDPOINTS.OWNER_REGISTRY.GET_BY_ID(ownerRegistryId?.toString() || ''),
    {},
    {
      enabled: !!ownerRegistryId,
      // Disable caching to always fetch fresh data
      gcTime: 0,
      staleTime: 0,
      // Always refetch when component mounts
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
    }
  )
  const {
    data: paymentPlanData,
    isLoading: isLoadingPayment,
    error: errorPayment,
  } = useGetEnhanced<PaymentPlanResponse[]>(
    `${API_ENDPOINTS.OWNER_REGISTRY_PAYMENT_PLAN.GET_ALL}?ownerRegistryId.equals=${ownerRegistryId}&deleted.equals=false&enabled.equals=true`,
    {},
    {
      enabled: !!ownerRegistryId,
      // Disable caching to always fetch fresh data
      gcTime: 0,
      staleTime: 0,
      // Always refetch when component mounts
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
    }
  )
  const {
    data: bankDetailsData,
    isLoading: isLoadingBank,
    error: errorBank,
  } = useGetEnhanced<BankDetailsResponse[]>(
    `${API_ENDPOINTS.OWNER_REGISTRY_BANK_INFO.GET_ALL}?ownerRegistryId.equals=${ownerRegistryId}`,
    {},
    {
      enabled: !!ownerRegistryId,
      // Disable caching to always fetch fresh data
      gcTime: 0,
      staleTime: 0,
      // Always refetch when component mounts
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
    }
  )
  const {
    data: unitDetailsData,
    isLoading: isLoadingUnit,
    error: errorUnit,
  } = useGetEnhanced<CapitalPartnerUnitResponse[]>(
    ownerRegistryId
      ? `${API_ENDPOINTS.OWNER_REGISTRY_UNIT.GET_ALL}?ownerRegistryId.equals=${ownerRegistryId}`
      : '',
    {},
    {
      enabled: !!ownerRegistryId,
      // Disable caching to always fetch fresh data
      gcTime: 0,
      staleTime: 0,
      // Always refetch when component mounts
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
    }
  )
  const unitId =
    unitDetailsData && unitDetailsData.length > 0
      ? unitDetailsData[0]?.id
      : null
  const isUnitDetailsReady = !isLoadingUnit && !errorUnit && !!unitId
  const {
    data: unitPurchaseData,
    isLoading: isLoadingPurchase,
    error: errorPurchase,
  } = useGetEnhanced<CapitalPartnerUnitPurchaseResponse[]>(
    `${API_ENDPOINTS.OWNER_REGISTRY_UNIT_PURCHASE.GET_ALL}?capitalPartnerUnitId.equals=${unitId || 0}`,
    {},
    {
      enabled: isUnitDetailsReady && !!unitId,
      // Disable caching to always fetch fresh data
      gcTime: 0,
      staleTime: 0,
      // Always refetch when component mounts
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
    }
  )
  const {
    investorType: translatedInvestorType,
    investorIdType: translatedInvestorIdType,
    nationality: translatedNationality,
    unitStatus: translatedUnitStatus,
    payMode: translatedPayMode,
    loading: loadingTranslations,
  } = useTranslatedBasicDetails(
    capitalPartnerData,
    unitDetailsData,
    bankDetailsData
  )
  const sectionLoadingStates = {
    basicDetails: isLoadingBasic,
    unitDetails: Boolean(
      isLoadingUnit || (isUnitDetailsReady && isLoadingPurchase)
    ),
    paymentPlan: isLoadingPayment,
    bankDetails: isLoadingBank,
  }
  const sectionErrorStates = {
    basicDetails: errorBasic,
    unitDetails: errorUnit || errorPurchase,
    paymentPlan: errorPayment,
    bankDetails: errorBank,
  }
  const [documents, setDocuments] = React.useState<DocumentItem[]>([])
  const [isLoadingDocuments, setIsLoadingDocuments] = React.useState(false)
  const [documentsError, setDocumentsError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (!ownerRegistryId) {
      setDocuments([])
      setDocumentsError(null)
      return
    }

    const loadDocuments = async () => {
      setIsLoadingDocuments(true)
      setDocumentsError(null)

      try {
        const response = await buildPartnerService.getBuildPartnerDocuments(
          ownerRegistryId.toString(),
          'OWNER_REGISTRY',
          0,
          50
        )

        let apiDocuments: ApiDocumentResponse[] = []

        if (Array.isArray(response)) {
          apiDocuments = response as ApiDocumentResponse[]
        } else if (response && 'content' in response) {
          const paginated = response as PaginatedDocumentResponse
          apiDocuments = paginated?.content ?? []
        }

        const mappedDocuments = apiDocuments.map(mapApiToDocumentItem)
        setDocuments(mappedDocuments)
      } catch (error) {
        setDocumentsError(
          error instanceof Error
            ? error
            : new Error('Failed to load documents')
        )
      } finally {
        setIsLoadingDocuments(false)
      }
    }

    loadDocuments()
  }, [ownerRegistryId])
  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }
  const formatDocumentDate = (
    dateValue?: Date | string | null
  ): string => {
    if (!dateValue) return '-'
    if (dateValue instanceof Date) {
      return dateValue.toLocaleDateString()
    }
    return formatDate(dateValue)
  }
  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
    }).format(amount)
  }
  const getBankDetailsFields = () => {
    if (!bankDetailsData || bankDetailsData.length === 0) return []

    const bankData = bankDetailsData[0]
    if (!bankData) return []

    return [
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_PAY_MODE', currentLanguage, 'Pay Mode'),
        value: loadingTranslations ? 'Loading...' : translatedPayMode,
      },
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_PAYEE_NAME', currentLanguage, 'Payee Name'),
        value: bankData.ownbiPayeeName || '-',
      },
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_BANK_NAME', currentLanguage, 'Bank Name'),
        value: bankData.ownbiBankName || '-',
      },
      {
        gridSize: 6,
        label: getLabel(
          'CDL_OWNER_ROUTING_CODE',
          currentLanguage,
          'Beneficiary Routing Code'
        ),
        value: bankData.ownbiBeneRoutingCode || '-',
      },
      {
        gridSize: 6,
        label: getLabel(
          'CDL_OWNER_ACCOUNT_NUMBER',
          currentLanguage,
          'Account Number'
        ),
        value: bankData.ownbiAccountNumber || '-',
      },
      {
        gridSize: 6,
        label: getLabel(
          'CDL_OWNER_PAYEE_ADDRESS',
          currentLanguage,
          'Payee Address'
        ),
        value: bankData.ownbiPayeeAddress || '-',
      },
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_BANK_ADDRESS', currentLanguage, 'Bank Address'),
        value: bankData.ownbiBankAddress || '-',
      },
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_BIC_CODE', currentLanguage, 'BIC'),
        value: bankData.ownbiBicCode || '-',
      },
    ]
  }

  const bankDetailsFields = getBankDetailsFields()
  const getBasicFields = () => {
    if (!capitalPartnerData) return []

    return [
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_TYPE', currentLanguage, 'Investor Type*'),
        value: loadingTranslations ? 'Loading...' : translatedInvestorType,
      },
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_REFID', currentLanguage, 'Investor ID*'),
        value: capitalPartnerData.ownerRegistryId || '-',
      },
      {
        gridSize: 3,
        label: getLabel('CDL_OWNER_FIRSTNAME', currentLanguage, 'Investor Name*'),
        value: capitalPartnerData.ownerRegistryName || '-',
      },
      {
        gridSize: 3,
        label: getLabel('CDL_OWNER_MIDDLENAME', currentLanguage, 'Middle Name*'),
        value: capitalPartnerData.ownerRegistryMiddleName || '-',
      },
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_LASTNAME', currentLanguage, 'Last Name*'),
        value: capitalPartnerData.ownerRegistryLastName || '-',
      },
      {
        gridSize: 12,
        label: getLabel('CDL_OWNER_LOCALE_NAME', currentLanguage, 'Arabic Name'),
        value: capitalPartnerData.ownerRegistryLocaleName || '-',
      },
      {
        gridSize: 6,
        label: getLabel(
          'CDL_OWNER_OWNERSHIP',
          currentLanguage,
          'Ownership Percentage'
        ),
        value:
          capitalPartnerData.ownerRegistryOwnershipPercentage?.toString() ||
          '-',
      },
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_ID_TYPE', currentLanguage, 'Investor ID Type*'),
        value: loadingTranslations ? 'Loading...' : translatedInvestorIdType,
      },
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_DOC_NO', currentLanguage, 'ID No.'),
        value: capitalPartnerData.ownerRegistryIdNo || '-',
      },
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_ID_EXP', currentLanguage, 'ID Expiry Date'),
        value: formatDate(capitalPartnerData.idExpiaryDate),
      },
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_NATIONALITY', currentLanguage, 'Nationality*'),
        value: loadingTranslations ? 'Loading...' : translatedNationality,
      },
      {
        gridSize: 6,
        label: getLabel(
          'CDL_OWNER_TELEPHONE',
          currentLanguage,
          'Account Contact Number'
        ),
        value: capitalPartnerData.ownerRegistryTelephoneNo || '-',
      },
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_MOBILE', currentLanguage, 'Mobile Number'),
        value: capitalPartnerData.ownerRegistryMobileNo || '-',
      },
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_EMAIL', currentLanguage, 'Email Address'),
        value: capitalPartnerData.ownerRegistryEmail || '-',
      },
    ]
  }

  const basicFields = getBasicFields()
  const getUnitFields = (
    purchaseData?: CapitalPartnerUnitPurchaseResponse | null
  ) => {
    if (!unitDetailsData || unitDetailsData.length === 0) return []

    const unitData = unitDetailsData[0]
    if (!unitData) return []
    const managementFirm = unitData.managementFirmDTO
    const assetRegister = managementFirm?.assetRegisterDTO

    return [
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_UNIT_MF_NAME', currentLanguage, 'Management Firm Name*'),
        value: managementFirm?.mfName || '-',
      },
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_UNIT_MF_ID', currentLanguage, 'Management Firm ID*'),
        value:
          managementFirm?.mfId ||
          managementFirm?.mfId ||
          managementFirm?.id?.toString() ||
          '-',
      },
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_UNIT_AR_ID', currentLanguage, 'Asset Register ID*'),
        value:
          assetRegister?.arDeveloperRegNo ||
          assetRegister?.arDeveloperId ||
          managementFirm?.mfReraNumber ||
          '-',
      },
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_UNIT_AR_NAME', currentLanguage, 'Asset Register Name*'),
        value:
          assetRegister?.arName ||
          assetRegister?.arMasterName ||
          managementFirm?.mfManagedBy ||
          '-',
      },
      {
        gridSize: 3,
        label: getLabel('CDL_OWNER_UNIT_FLOOR', currentLanguage, 'Floor'),
        value: unitData.floor || '-',
      },
      {
        gridSize: 3,
        label: getLabel('CDL_OWNER_UNIT_NOOF_BED', currentLanguage, 'No. of Bedroom'),
        value: unitData.noofBedroom || '-',
      },
      {
        gridSize: 3,
        label: getLabel(
          'CDL_OWNER_UNIT_NUMBER',
          currentLanguage,
          'Unit no. Oqood format*'
        ),
        value: unitData.unitRefId || '-',
      },
      {
        gridSize: 3,
        label: getLabel('CDL_OWNER_UNIT_STATUS', currentLanguage, 'Unit Status*'),
        value: loadingTranslations ? 'Loading...' : translatedUnitStatus,
      },
      {
        gridSize: 6,
        label: getLabel(
          'CDL_OWNER_UNIT_BUILDING_NAME',
          currentLanguage,
          'Building Name'
        ),
        value: unitData.towerName || '-',
      },
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_UNIT_PLOT_SIZE', currentLanguage, 'Plot Size*'),
        value: unitData.unitPlotSize || '-',
      },
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_UNIT_PROP_NUMBER', currentLanguage, 'Property ID*'),
        value:
          unitData.propertyIdDTO?.languageTranslationId?.configValue ||
          unitData.propertyIdDTO?.settingValue ||
          '-',
      },
      {
        gridSize: 6,
        label: getLabel('CDL_OWNER_UNIT_IBAN', currentLanguage, 'Unit IBAN'),
        value: unitData.virtualAccNo || '-',
      },
      {
        gridSize: 3,
        label: getLabel(
          'CDL_OWNER_UNIT_REG_FEE',
          currentLanguage,
          'Unit Registration Fees'
        ),
        value: purchaseData?.ownupUnitRegistrationFee
          ? formatCurrency(purchaseData.ownupUnitRegistrationFee)
          : '0.00',
      },
      {
        gridSize: 3,
        label: getLabel('CDL_OWNER_UNIT_AGENT_NAME', currentLanguage, 'Agent Name'),
        value: purchaseData?.ownupAgentName || '-',
      },
      {
        gridSize: 3,
        label: getLabel(
          'CDL_OWNER_UNIT_AGENT_ID',
          currentLanguage,
          'Agent National ID'
        ),
        value: purchaseData?.ownupAgentId || '-',
      },
      {
        gridSize: 3,
        label: getLabel(
          'CDL_OWNER_UNIT_GROSS_PRICE',
          currentLanguage,
          'Gross Sale Price'
        ),
        value: purchaseData?.ownupGrossSaleprice
          ? formatCurrency(purchaseData.ownupGrossSaleprice)
          : '246,578.00',
      },
    ]
  }

  const purchaseDataForUnitFields =
    unitPurchaseData && unitPurchaseData.length > 0 ? unitPurchaseData[0] : null

  const unitFields = getUnitFields(purchaseDataForUnitFields)
  const getCheckboxAndAdditionalFields = () => {
    if (!unitDetailsData || unitDetailsData.length === 0) {
      return {
        checkboxFieldsRow1: [
          {
            label: getLabel(
              'CDL_OWNER_UNIT_VAT_APPLICABLE',
              currentLanguage,
              'VAT Applicable'
            ),
            checked: false,
          },
          {
            label: getLabel(
              'CDL_OWNER_UNIT_SPA',
              currentLanguage,
              'Sale Purchase Agreement'
            ),
            checked: false,
          },
          {
            label: getLabel(
              'CDL_OWNER_UNIT_PAYMENT_PLAN',
              currentLanguage,
              'Project Payment Plan'
            ),
            checked: false,
          },
        ],
        checkboxFieldsRow2: [
          {
            gridSize: 3,
            label: getLabel('CDL_OWNER_UNIT_NET_PRICE', currentLanguage, 'Sale Price'),
            value: '-',
          },
          {
            gridSize: 3,
            label: getLabel('CDL_OWNER_UNIT_DEED_REF_NO', currentLanguage, 'Deed No'),
            value: '-',
          },
          {
            gridSize: 3,
            label: getLabel(
              'CDL_OWNER_UNIT_CONTRACT_NO',
              currentLanguage,
              'Contract No'
            ),
            value: '-',
          },
          {
            gridSize: 3,
            label: getLabel(
              'CDL_OWNER_UNIT_AGREEMENT_DATE',
              currentLanguage,
              'Agreement Date'
            ),
            value: '-',
          },
        ],
        checkboxFieldsRow3: [
          {
            label: getLabel(
              'CDL_OWNER_MODIFICATION_FEE_NEEDED',
              currentLanguage,
              'Modification Fee Needed'
            ),
            checked: false,
          },
          {
            label: getLabel(
              'CDL_OWNER_RESERVATION_BOOKING_FORM',
              currentLanguage,
              'Reservation Booking Form'
            ),
            checked: false,
          },
          {
            label: getLabel('CDL_OWNER_UNIT_OQOOD_PAID', currentLanguage, 'Oqood Paid'),
            checked: false,
          },
        ],
        remainingFields: [
          {
            gridSize: 6,
            label: getLabel(
              'CDL_OWNER_UNIT_WORLD_STATUS',
              currentLanguage,
              'World Check'
            ),
            value: 'No',
          },
          {
            gridSize: 6,
            label: getLabel(
              'CDL_OWNER_UNIT_WITH_ESCROW',
              currentLanguage,
              'Amount Paid to Developer within Escrow'
            ),
            value: '-',
          },
          {
            gridSize: 6,
            label: getLabel(
              'CDL_OWNER_UNIT_OUTSIDE_ESCROW',
              currentLanguage,
              'Amount Paid to Developer out of Escrow'
            ),
            value: '-',
          },
          {
            gridSize: 6,
            label: getLabel(
              'CDL_OWNER_UNIT_PARTNER_PAYMENT',
              currentLanguage,
              'Total Amount Paid'
            ),
            value: '-',
          },
          {
            gridSize: 3,
            label: getLabel(
              'CDL_OWNER_UNIT_OQOOD_PAID',
              currentLanguage,
              'Oqood Amount Paid'
            ),
            value: '-',
          },
          {
            gridSize: 3,
            label: getLabel(
              'CDL_OWNER_UNIT_AREA',
              currentLanguage,
              'Unit Area Size'
            ),
            value: '-',
          },
          {
            gridSize: 3,
            label: getLabel(
              'CDL_OWNER_FORFEIT_AMOUNT',
              currentLanguage,
              'Forfeit Amount'
            ),
            value: '-',
          },
          {
            gridSize: 3,
            label: getLabel('CDL_OWNER_UNIT_DLD_FEE', currentLanguage, 'Dld Amount'),
            value: '-',
          },
          {
            gridSize: 6,
            label: getLabel(
              'CDL_OWNER_UNIT_REFUND_AMOUNT',
              currentLanguage,
              'Refund Amount'
            ),
            value: '-',
          },
          {
            gridSize: 6,
            label: getLabel(
              'CDL_OWNER_UNIT_TRANS_AMT',
              currentLanguage,
              'Transferred Amount'
            ),
            value: '-',
          },
          {
            gridSize: 12,
            label: getLabel('CDL_OWNER_UNIT_REMARKS', currentLanguage, 'Remarks'),
            value: '-',
          },
        ],
      }
    }

    const unitData = unitDetailsData[0]
    if (!unitData) {
      return {
        checkboxFieldsRow1: [
          {
            label: getLabel(
              'CDL_OWNER_UNIT_VAT_APPLICABLE',
              currentLanguage,
              'VAT Applicable'
            ),
            checked: false,
          },
          {
            label: getLabel(
              'CDL_OWNER_UNIT_SPA',
              currentLanguage,
              'Sale Purchase Agreement'
            ),
            checked: false,
          },
          {
            label: getLabel(
              'CDL_OWNER_UNIT_PAYMENT_PLAN',
              currentLanguage,
              'Project Payment Plan'
            ),
            checked: false,
          },
        ],
        checkboxFieldsRow2: [
          {
            gridSize: 3,
            label: getLabel('CDL_OWNER_UNIT_NET_PRICE', currentLanguage, 'Sale Price'),
            value: '-',
          },
          {
            gridSize: 3,
            label: getLabel('CDL_OWNER_UNIT_DEED_REF_NO', currentLanguage, 'Deed No'),
            value: '-',
          },
          {
            gridSize: 3,
            label: getLabel(
              'CDL_OWNER_UNIT_CONTRACT_NO',
              currentLanguage,
              'Contract No'
            ),
            value: '-',
          },
          {
            gridSize: 3,
            label: getLabel(
              'CDL_OWNER_UNIT_AGREEMENT_DATE',
              currentLanguage,
              'Agreement Date'
            ),
            value: '-',
          },
        ],
        checkboxFieldsRow3: [
          {
            label: getLabel(
              'CDL_OWNER_MODIFICATION_FEE_NEEDED',
              currentLanguage,
              'Modification Fee Needed'
            ),
            checked: false,
          },
          {
            label: getLabel(
              'CDL_OWNER_RESERVATION_BOOKING_FORM',
              currentLanguage,
              'Reservation Booking Form'
            ),
            checked: false,
          },
          {
            label: getLabel('CDL_OWNER_UNIT_OQOOD_PAID', currentLanguage, 'Oqood Paid'),
            checked: false,
          },
        ],
        remainingFields: [
          {
            gridSize: 6,
            label: getLabel(
              'CDL_OWNER_UNIT_WORLD_STATUS',
              currentLanguage,
              'World Check'
            ),
            value: 'No',
          },
          {
            gridSize: 6,
            label: getLabel(
              'CDL_OWNER_UNIT_WITH_ESCROW',
              currentLanguage,
              'Amount Paid to Developer within Escrow'
            ),
            value: '-',
          },
          {
            gridSize: 6,
            label: getLabel(
              'CDL_OWNER_UNIT_OUTSIDE_ESCROW',
              currentLanguage,
              'Amount Paid to Developer out of Escrow'
            ),
            value: '-',
          },
          {
            gridSize: 6,
            label: getLabel(
              'CDL_OWNER_UNIT_PARTNER_PAYMENT',
              currentLanguage,
              'Total Amount Paid'
            ),
            value: '-',
          },
          {
            gridSize: 3,
            label: getLabel(
              'CDL_OWNER_UNIT_OQOOD_PAID',
              currentLanguage,
              'Oqood Amount Paid'
            ),
            value: '-',
          },
          {
            gridSize: 3,
            label: getLabel(
              'CDL_OWNER_UNIT_AREA',
              currentLanguage,
              'Unit Area Size'
            ),
            value: '-',
          },
          {
            gridSize: 3,
            label: getLabel(
              'CDL_OWNER_FORFEIT_AMOUNT',
              currentLanguage,
              'Forfeit Amount'
            ),
            value: '-',
          },
          {
            gridSize: 3,
            label: getLabel('CDL_OWNER_UNIT_DLD_FEE', currentLanguage, 'Dld Amount'),
            value: '-',
          },
          {
            gridSize: 6,
            label: getLabel(
              'CDL_OWNER_UNIT_REFUND_AMOUNT',
              currentLanguage,
              'Refund Amount'
            ),
            value: '-',
          },
          {
            gridSize: 6,
            label: getLabel(
              'CDL_OWNER_UNIT_TRANS_AMT',
              currentLanguage,
              'Transferred Amount'
            ),
            value: '-',
          },
          {
            gridSize: 12,
            label: getLabel('CDL_OWNER_UNIT_REMARKS', currentLanguage, 'Remarks'),
            value: '-',
          },
        ],
      }
    }

    const purchaseData =
      unitPurchaseData && unitPurchaseData.length > 0
        ? unitPurchaseData[0]
        : null

    return {
      checkboxFieldsRow1: [
        {
          label: getLabel(
            'CDL_OWNER_UNIT_VAT_APPLICABLE',
            currentLanguage,
            'VAT Applicable'
          ),
          checked: purchaseData?.ownupVatApplicable || false,
        },
        {
          label: getLabel(
            'CDL_OWNER_UNIT_SPA',
            currentLanguage,
            'Sale Purchase Agreement'
          ),
          checked: purchaseData?.ownupSalePurchaseAgreement || false,
        },
        {
          label: getLabel(
            'CDL_OWNER_UNIT_PAYMENT_PLAN',
            currentLanguage,
            'Project Payment Plan'
          ),
          checked: purchaseData?.ownupProjectPaymentPlan || false,
        },
      ],
      checkboxFieldsRow2: [
        {
          gridSize: 3,
          label: getLabel('CDL_OWNER_UNIT_NET_PRICE', currentLanguage, 'Sale Price'),
          value: purchaseData?.ownupSalePrice
            ? formatCurrency(purchaseData.ownupSalePrice)
            : '-',
        },
        {
          gridSize: 3,
          label: getLabel('CDL_OWNER_UNIT_DEED_REF_NO', currentLanguage, 'Deed No'),
          value: purchaseData?.ownupDeedNo || '-',
        },
        {
          gridSize: 3,
          label: getLabel('CDL_OWNER_UNIT_CONTRACT_NO', currentLanguage, 'Contract No'),
          value: purchaseData?.ownupAgreementNo || '-',
        },
        {
          gridSize: 3,
          label: getLabel(
            'CDL_OWNER_UNIT_AGREEMENT_DATE',
            currentLanguage,
            'Agreement Date'
          ),
          value: purchaseData?.ownupAgreementDate
            ? formatDate(purchaseData.ownupAgreementDate)
            : '-',
        },
      ],
      checkboxFieldsRow3: [
        {
          label: getLabel(
            'CDL_OWNER_UNIT_FEE_REQ',
            currentLanguage,
            'Modification Fee Needed'
          ),
          checked: purchaseData?.ownupModificationFeeNeeded || false,
        },
        {
          label: getLabel(
            'CDL_OWNER_UNIT_BOOKING',
            currentLanguage,
            'Reservation Booking Form'
          ),
          checked: purchaseData?.ownupReservationBookingForm || false,
        },
        {
          label: getLabel('CDL_OWNER_UNIT_OQOOD_PAID', currentLanguage, 'Oqood Paid'),
          checked: purchaseData?.ownupOqoodPaid || false,
        },
      ],
      remainingFields: [
        {
          gridSize: 6,
          label: getLabel(
            'CDL_OWNER_UNIT_WORLD_STATUS',
            currentLanguage,
            'World Check'
          ),
          value: purchaseData?.ownupWorldCheck ? 'Yes' : 'No',
        },
        {
          gridSize: 6,
          label: getLabel(
            'CDL_OWNER_UNIT_WITH_ESCROW',
            currentLanguage,
            'Amount Paid to Developer within Escrow'
          ),
          value: purchaseData?.ownupAmtPaidToDevInEscorw
            ? formatCurrency(purchaseData.ownupAmtPaidToDevInEscorw)
            : '-',
        },
        {
          gridSize: 6,
          label: getLabel(
            'CDL_OWNER_UNIT_OUTSIDE_ESCROW',
            currentLanguage,
            'Amount Paid to Developer out of Escrow'
          ),
          value: purchaseData?.ownupAmtPaidToDevOutEscorw
            ? formatCurrency(purchaseData.ownupAmtPaidToDevOutEscorw)
            : '-',
        },
        {
          gridSize: 6,
          label: getLabel(
            'CDL_OWNER_UNIT_PARTNER_PAYMENT',
            currentLanguage,
            'Total Amount Paid'
          ),
          value: purchaseData?.ownupTotalAmountPaid
            ? formatCurrency(purchaseData.ownupTotalAmountPaid)
            : '-',
        },
        {
          gridSize: 3,
          label: getLabel(
            'CDL_OWNER_UNIT_OQOOD_PAID',
            currentLanguage,
            'Oqood Amount Paid'
          ),
          value: purchaseData?.ownupOqoodAmountPaid || '-',
        },
        {
          gridSize: 3,
          label: getLabel(
            'CDL_OWNER_UNIT_AREA',
            currentLanguage,
            'Unit Area Size'
          ),
          value: purchaseData?.ownupUnitAreaSize || '-',
        },
        {
          gridSize: 3,
          label: getLabel(
            'CDL_OWNER_FORFEIT_AMOUNT',
            currentLanguage,
            'Forfeit Amount'
          ),
          value: purchaseData?.ownupForfeitAmount || '-',
        },
        {
          gridSize: 3,
          label: getLabel('CDL_OWNER_UNIT_DLD_FEE', currentLanguage, 'Dld Amount'),
          value: purchaseData?.ownupDldAmount || '-',
        },
        {
          gridSize: 6,
          label: getLabel(
            'CDL_OWNER_UNIT_REFUND_AMOUNT',
            currentLanguage,
            'Refund Amount'
          ),
          value: purchaseData?.ownupRefundAmount || '-',
        },
        {
          gridSize: 6,
          label: getLabel(
            'CDL_OWNER_UNIT_TRANS_AMT',
            currentLanguage,
            'Transferred Amount'
          ),
          value: purchaseData?.ownupTransferredAmount || '-',
        },
        {
          gridSize: 12,
          label: getLabel('CDL_OWNER_UNIT_REMARKS', currentLanguage, 'Remarks'),
          value: purchaseData?.ownupRemarks || '-',
        },
      ],
    }
  }

  const {
    checkboxFieldsRow1,
    checkboxFieldsRow2,
    checkboxFieldsRow3,
    remainingFields,
  } = getCheckboxAndAdditionalFields()
  const renderSectionContent = (
    sectionName: string,
    isLoading: boolean,
    error: Error | null,
    content: React.ReactNode
  ) => {
    if (isLoading) {
      return <SectionLoader sectionName={sectionName} />
    }
    if (error) {
      return <SectionError sectionName={sectionName} error={error} />
    }
    return content
  }

  return (
    <Card
      sx={{
        boxShadow: 'none',
        backgroundColor: '#FFFFFFBF',
        width: '94%',
        margin: '0 auto',
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 500,
              fontStyle: 'normal',
              fontSize: '18px',
              lineHeight: '28px',
              letterSpacing: '0.15px',
              verticalAlign: 'middle',
            }}
          >
            {getLabel('CDL_OWNER_BASIC_INFO', currentLanguage, 'Basic Details')}
          </Typography>
          {!isViewMode && (
            <Button
              startIcon={<EditIcon />}
              onClick={handleEditBasicDetails}
              sx={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 500,
                fontStyle: 'normal',
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '0.5px',
                verticalAlign: 'middle',
              }}
            >
              Edit
            </Button>
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />
        {renderSectionContent(
          getLabel('CDL_OWNER_BASIC_INFO', currentLanguage, 'Basic Details'),
          sectionLoadingStates.basicDetails,
          sectionErrorStates.basicDetails,
          <Grid container spacing={3}>
            {basicFields.map((field, idx) => (
              <Grid size={{ xs: 12, md: field.gridSize }} key={`basic-${idx}`}>
                {renderDisplayField(field.label, field.value)}
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>

      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 500,
              fontStyle: 'normal',
              fontSize: '18px',
              lineHeight: '28px',
              letterSpacing: '0.15px',
              verticalAlign: 'middle',
            }}
          >
            {getLabel(
              'CDL_OWNER_DOCUMENTS',
              currentLanguage,
              'Submitted Documents'
            )}
          </Typography>
          {!isViewMode && ownerRegistryId && (
            <Button
              startIcon={<EditIcon />}
              onClick={() => router.push(`/capital-partner/${ownerRegistryId}/step/2`)}
              sx={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 500,
                fontStyle: 'normal',
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '0.5px',
                verticalAlign: 'middle',
              }}
            >
              Edit
            </Button>
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />
        {renderSectionContent(
          getLabel('CDL_OWNER_DOCUMENTS', currentLanguage, 'Submitted Documents'),
          isLoadingDocuments,
          documentsError,
          documents.length > 0 ? (
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
                  {documents.map((doc) => (
                    <TableRow
                      key={doc.id}
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
                        {doc.name || 'Document'}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          color: '#374151',
                          borderBottom: '1px solid #E5E7EB',
                        }}
                      >
                        {formatDocumentDate(doc.uploadDate)}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          color: '#374151',
                          borderBottom: '1px solid #E5E7EB',
                        }}
                      >
                        {doc.classification || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography
              sx={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px',
                color: '#6A7282',
              }}
            >
              {getLabel(
                'CDL_OWNER_NO_DOCUMENTS',
                currentLanguage,
                'No documents uploaded.'
              )}
            </Typography>
          )
        )}
      </CardContent>

      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 500,
              fontStyle: 'normal',
              fontSize: '18px',
              lineHeight: '28px',
              letterSpacing: '0.15px',
              verticalAlign: 'middle',
            }}
          >
            {getLabel('CDL_OWNER_UNIT_DETAILS', currentLanguage, 'Unit Details')}
          </Typography>
          {!isViewMode && (
            <Button
              startIcon={<EditIcon />}
              onClick={handleEditUnitDetails}
              sx={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 500,
                fontStyle: 'normal',
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '0.5px',
                verticalAlign: 'middle',
              }}
            >
              Edit
            </Button>
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />
        {renderSectionContent(
          getLabel('CDL_OWNER_UNIT_DETAILS', currentLanguage, 'Unit Details'),
          sectionLoadingStates.unitDetails,
          sectionErrorStates.unitDetails,
          <Grid container spacing={3}>
            {unitFields.map((field, idx) => (
              <Grid size={{ xs: 12, md: field.gridSize }} key={`unit-${idx}`}>
                {renderDisplayField(field.label, field.value)}
              </Grid>
            ))}
            {checkboxFieldsRow1.map((field, idx) => (
              <Grid size={{ xs: 12, md: 4 }} key={`checkbox-row1-${idx}`}>
                {renderCheckboxField(field.label, field.checked)}
              </Grid>
            ))}
            {checkboxFieldsRow2.map((field, idx) => (
              <Grid
                size={{ xs: 12, md: field.gridSize }}
                key={`unit-checkbox-row2-${idx}`}
              >
                {renderDisplayField(field.label, field.value)}
              </Grid>
            ))}
            {checkboxFieldsRow3.map((field, idx) => (
              <Grid size={{ xs: 12, md: 4 }} key={`checkbox-row3-${idx}`}>
                {renderCheckboxField(field.label, field.checked)}
              </Grid>
            ))}
            {remainingFields.map((field, idx) => (
              <Grid
                size={{ xs: 12, md: field.gridSize }}
                key={`unit-remaining-${idx}`}
              >
                {renderDisplayField(field.label, field.value)}
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>

      {/* Payment Plan Section */}
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 500,
              fontStyle: 'normal',
              fontSize: '18px',
              lineHeight: '28px',
              letterSpacing: '0.15px',
              verticalAlign: 'middle',
            }}
          >
            {getLabel('CDL_OWNER_UNIT_PAYMENT_PLAN', currentLanguage, 'Payment Plan')}
          </Typography>
          {!isViewMode && (
            <Button
              startIcon={<EditIcon />}
              onClick={handleEditPaymentPlan}
              sx={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 500,
                fontStyle: 'normal',
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '0.5px',
                verticalAlign: 'middle',
              }}
            >
              Edit
            </Button>
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />
        {renderSectionContent(
          getLabel('CDL_OWNER_UNIT_PAYMENT_PLAN', currentLanguage, 'Payment Plan'),
          sectionLoadingStates.paymentPlan,
          sectionErrorStates.paymentPlan,
          paymentPlanData && paymentPlanData.length > 0 ? (
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <th
                      style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#6A7282',
                        fontFamily: 'Outfit, sans-serif',
                      }}
                    >
                      {getLabel(
                        'CDL_OWNER_SEQ_NO',
                        currentLanguage,
                        'Installment Number'
                      )}
                    </th>
                    <th
                      style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#6A7282',
                        fontFamily: 'Outfit, sans-serif',
                      }}
                    >
                      {getLabel(
                        'CDL_OWNER_DUE_DATE',
                        currentLanguage,
                        'Installment Date'
                      )}
                    </th>
                    <th
                      style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#6A7282',
                        fontFamily: 'Outfit, sans-serif',
                      }}
                    >
                      {getLabel(
                        'CDL_OWNER_UNIT_BOOKING_AMOUNT',
                        currentLanguage,
                        'Booking Amount'
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paymentPlanData.map((plan, index) => (
                    <tr
                      key={plan.id || index}
                      style={{ borderBottom: '1px solid #F3F4F6' }}
                    >
                      <td
                        style={{
                          padding: '12px',
                          fontSize: '14px',
                          color: '#1E2939',
                          fontFamily: 'Outfit, sans-serif',
                        }}
                      >
                        {plan.ownppInstallmentNumber || '-'}
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          fontSize: '14px',
                          color: '#1E2939',
                          fontFamily: 'Outfit, sans-serif',
                        }}
                      >
                        {plan.ownppInstallmentDate
                          ? formatDate(plan.ownppInstallmentDate)
                          : '-'}
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          fontSize: '14px',
                          color: '#1E2939',
                          fontFamily: 'Outfit, sans-serif',
                        }}
                      >
                        {plan.ownppBookingAmount
                          ? formatCurrency(plan.ownppBookingAmount)
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          ) : (
            <Typography
              sx={{
                color: '#6A7282',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px',
                textAlign: 'center',
                py: 2,
              }}
            >
              No payment plan data available
            </Typography>
          )
        )}
      </CardContent>

      {/* Bank Details Section */}
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 500,
              fontStyle: 'normal',
              fontSize: '18px',
              lineHeight: '28px',
              letterSpacing: '0.15px',
              verticalAlign: 'middle',
            }}
          >
            {getLabel('CDL_OWNER_BANK_DETAILS', currentLanguage, 'Bank Details')}
          </Typography>
          {!isViewMode && (
            <Button
              startIcon={<EditIcon />}
              onClick={handleEditBankDetails}
              sx={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 500,
                fontStyle: 'normal',
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '0.5px',
                verticalAlign: 'middle',
              }}
            >
              Edit
            </Button>
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />
        {renderSectionContent(
          getLabel('CDL_OWNER_BANK_DETAILS', currentLanguage, 'Bank Details'),
          sectionLoadingStates.bankDetails,
          sectionErrorStates.bankDetails,
          bankDetailsFields.length > 0 ? (
            <Grid container spacing={3}>
              {bankDetailsFields.map((field, idx) => (
                <Grid size={{ xs: 12, md: field.gridSize }} key={`bank-${idx}`}>
                  {renderDisplayField(field.label, field.value)}
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              sx={{
                color: '#6A7282',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px',
                textAlign: 'center',
                py: 2,
              }}
            >
              No bank details available
            </Typography>
          )
        )}
      </CardContent>
    </Card>
  )
}

export default Step5
export type { Step5Props }
