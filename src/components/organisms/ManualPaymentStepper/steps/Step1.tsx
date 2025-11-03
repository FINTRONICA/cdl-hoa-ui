import React, { useState, useEffect, useMemo } from 'react'
import dayjs from 'dayjs'
import { useManualPaymentData } from '../ManualPaymentDataProvider'
import { idService } from '../../../../services/api/developerIdService'
import { useManualPaymentLabelsWithCache } from '../../../../hooks/useManualPaymentLabelsWithCache'
import { VOUCHER_LABELS } from '../../../../constants/mappings/manualPaymentLabels'
// State for developer names

import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { Controller, useFormContext } from 'react-hook-form'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { fundEgressService } from '../../../../services/api/fundEgressService'
// import { toast } from 'react-hot-toast' // Not used in this component
import { FormError } from '../../../atoms/FormError'
import { getFieldMaxLength } from '@/lib/validation'

interface Step1Props {
  savedId?: string | null
  isEditMode?: boolean
  onDataLoaded?: () => void
  isReadOnly?: boolean
  refreshKey?: number
}

const Step1 = ({
  savedId,
  isEditMode,
  onDataLoaded,
  isReadOnly = false,
  refreshKey,
}: Step1Props) => {
  // Form context
  const { control, setValue, watch, trigger, formState: { errors } } = useFormContext()

  // Get dynamic labels
  const { getLabel } = useManualPaymentLabelsWithCache('EN')

  // Get shared data from provider
  const sharedData = useManualPaymentData()

  // State for payment reference ID generation
  const [paymentRefId, setPaymentRefId] = useState<string>('')
  const [isGeneratingId, setIsGeneratingId] = useState<boolean>(false)

  // Extract data from shared provider
  const {
    paymentTypes,
    paymentSubTypes,
    currencies,
    // depositModes, // Removed - not used in new structure
    // paymentModes, // Removed - not used in new structure
    transferTypes,
    buildAssetAccountStatuses,
    boolYnOptions,
    realEstateAssets,
    buildPartners,
    accountBalances,
  } = sharedData

  // Destructure account balance functions
  const {
    balances,
    loadingStates,
    errors: accountErrors,
    fetchBalance,
  } = accountBalances

  // State to store additional developer/project data from prepopulated data
  const [additionalDeveloperNames, setAdditionalDeveloperNames] = useState<
    string[]
  >([])
  const [additionalProjectAssets, setAdditionalProjectAssets] = useState<
    { id: number; reaName: string; reaId: string }[]
  >([])

  // Memoize developer names from build partners data + any additional names
  const developerNames = useMemo(() => {
    const baseNames =
      buildPartners.data && buildPartners.data.length > 0
        ? buildPartners.data
            .map((bp: any) => bp.bpName)
            .filter((name: string | null) => !!name)
        : []

    // Combine base names with additional names, removing duplicates
    const allNames = [...baseNames, ...additionalDeveloperNames]
    return [...new Set(allNames)].filter(Boolean)
  }, [buildPartners.data, additionalDeveloperNames])

  // Memoize project assets from real estate assets data + any additional assets
  const projectAssets = useMemo(() => {
    const baseAssets =
      realEstateAssets.data && realEstateAssets.data.length > 0
        ? realEstateAssets.data
        : []

    // Combine base assets with additional assets, removing duplicates by ID
    const allAssets = [...baseAssets, ...additionalProjectAssets]
    const uniqueAssets = allAssets.reduce((acc: any[], asset: any) => {
      if (!acc.find((a: any) => a.id === asset.id)) {
        acc.push(asset)
      }
      return acc
    }, [])

    return uniqueAssets
  }, [realEstateAssets.data, additionalProjectAssets])

  // Create assetRegisterNames from projectAssets (for dropdown)
  const assetRegisterNames = useMemo(() => {
    return projectAssets.map((asset) => ({
      id: asset.id,
      displayName: asset.reaName,
    }))
  }, [projectAssets])

  // State for voucher data and beneficiary details
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [VoucherData, setVoucherData] = useState<{ content?: Array<{ id: number; benVoucher?: string; bpName?: string; benVoucherName?: string; benVoucherSwiftCode?: string; benVoucherRoutingCode?: string; benVoucherAccountNumber?: string }> } | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isVoucherLoading, setIsVoucherLoading] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDevelopersLoading, setIsDevelopersLoading] = useState<boolean>(false)

  // State for sanitized data (for prepopulation)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sanitizedData, setSanitizedData] = useState<{ voucherDTO?: { benVoucher?: string; benVoucherName?: string; benVoucherBankName?: string; benVoucherSwiftCode?: string; benVoucherRoutingCode?: string; benVoucherAccountNumber?: string } } | null>(null)

  // Validation function for Step1 fields
  const validateStep1Field = (fieldName: string, value: unknown): string | boolean => {
    if (!value || value === '' || value === null || value === undefined) {
      return `${fieldName} is required`
    }
    return true
  }

  // Handle voucher beneficiary details change
  const handleVoucherBeneficiaryDetailsChange = (voucherId: string) => {
    if (!voucherId || !VoucherData?.content) return

    const selectedVoucher = VoucherData.content.find(
      (v: { id?: number; benVoucher?: string }) => v.benVoucher === voucherId || v.id?.toString() === voucherId
    )

    if (selectedVoucher) {
      setValue('voucherDTO.benVoucherName', selectedVoucher.benVoucherName || '', {
        shouldDirty: true,
        shouldTouch: true,
      })
      setValue('buildPartnerDTO.bpName', selectedVoucher.bpName || '', {
        shouldDirty: true,
        shouldTouch: true,
      })
      setValue('voucherDTO.benVoucherSwiftCode', selectedVoucher.benVoucherSwiftCode || '', {
        shouldDirty: true,
        shouldTouch: true,
      })
      setValue('voucherDTO.benVoucherRoutingCode', selectedVoucher.benVoucherRoutingCode || '', {
        shouldDirty: true,
        shouldTouch: true,
      })
      setValue('voucherDTO.benVoucherAccountNumber', selectedVoucher.benVoucherAccountNumber || '', {
        shouldDirty: true,
        shouldTouch: true,
      })
    }
  }

  // State to track if prepopulation has been attempted
  const [prepopulationAttempted, setPrepopulationAttempted] =
    useState<boolean>(false)

  // Extract prepopulation into a stable callback so we can reuse on refreshKey changes
  const prepopulateData = React.useCallback(async () => {
    if (isEditMode && savedId) {
      if (isEditMode && savedId && !prepopulationAttempted) {
        try {
          const savedData = await fundEgressService.getFundEgressById(savedId)

          // Map the saved data to form format - comprehensive field mapping
          const formData: any = {
            // Basic Payment Information (old field - kept for compatibility)
            tasReference: savedData.fePaymentRefNumber || '',
            
            // New fields - map from API response
            vaucherReferenceNumber: savedData.fePaymentRefNumber || '',
            assetRegisterName: savedData.realEstateAssestDTO?.id?.toString() || '',
            managementFirmName: savedData.buildPartnerDTO?.bpName || '',
            managementFirmAccountStatus: ((savedData.realEstateAssestDTO?.reaAccountStatusDTO as any)?.id?.toString()) || null,

            // Developer Information (old fields - kept for compatibility)
            developerName: savedData.buildPartnerDTO?.bpName || '',
            developerId: savedData.buildPartnerDTO?.bpDeveloperId || '',

            // Project Information (old fields - kept for compatibility)
            projectName: savedData.realEstateAssestDTO?.id?.toString() || '',
            projectId: savedData.realEstateAssestDTO?.reaId || '',

            // Narrations and Remarks
            narration1: savedData.feNarration1 || '',
            narration2: savedData.feNarration2 || '',
            remarks: savedData.feRemark || '',

            // Payment Type Information (use expenseTypeDTO instead of voucherPaymentTypeDTO)
            paymentType:
              (savedData.expenseTypeDTO as any)?.id?.toString() ||
              savedData.voucherPaymentTypeDTO?.id?.toString() ||
              '',
            paymentSubType:
              (savedData.expenseSubTypeDTO as any)?.id?.toString() ||
              savedData.voucherPaymentSubTypeDTO?.id?.toString() ||
              '',

            // HOA Approval fields (new)
            hoaApprovalNumber: savedData.feReraApprovedRefNo || '',
            hoaApprovalDate: savedData.feReraApprovedDate && savedData.feReraApprovedDate !== ''
              ? dayjs(savedData.feReraApprovedDate)
              : null,
            
            // RT03 field (new)
            RT03: (savedData as any)?.feRtZeroThree || '',
            
            // Routing sort code (new)
            routinfSortcode: (savedData as any)?.feRoutingSortCode || '',
            
            // Regular approval ref (old field - kept for compatibility, maps to feReraApprovedRefNo)
            paymentType1: savedData.feReraApprovedRefNo || '',

            // Payment Details (map to actual Step 1 field names)
            paymentMode: savedData.paymentModeDTO?.id?.toString() || '',
            invoiceCurrency: savedData.invoiceCurrencyDTO?.id?.toString() || '',
            // UI field name for Payment Currency is totalAmountPaid1
            totalAmountPaid1:
              savedData.paymentCurrencyDTO?.id?.toString() || '',
            // UI field name for Charge Mode is bankCharges
            bankCharges: savedData.chargedCodeDTO?.id?.toString() || '',
            // UI field name for Transaction Type is engineerFeePayment
            engineerFeePayment:
              savedData.transactionTypeDTO?.id?.toString() || '',

            // Financial Fields
            invoiceRef: savedData.feInvoiceRefNo || '',
            invoiceValue: savedData.feInvoiceValue?.toString() || '',
            invoiceDate:
              savedData.feInvoiceDate && savedData.feInvoiceDate !== ''
                ? dayjs(savedData.feInvoiceDate)
                : null,
            paymentDate:
              savedData.fePaymentDate && savedData.fePaymentDate !== ''
                ? dayjs(savedData.fePaymentDate)
                : null,
            paymentAmount: savedData.fePaymentAmount?.toString() || '',
            totalAmountPaid: savedData.feTotalAmountPaid?.toString() || '',

            // Account Balances (prepopulate the read-only balance fields)
            subConstructionAccount:
              savedData.feCurBalInEscrowAcc !== undefined && savedData.feCurBalInEscrowAcc !== null
                ? String(savedData.feCurBalInEscrowAcc)
                : '',
            retentionAccount:
              savedData.feSubConsAccBalance !== undefined && savedData.feSubConsAccBalance !== null
                ? String(savedData.feSubConsAccBalance)
                : '',
            retentionAccount1:
              savedData.feCorporateAccBalance !== undefined && savedData.feCorporateAccBalance !== null
                ? String(savedData.feCorporateAccBalance)
                : '',
            retentionAccount2:
              savedData.feCurBalInRetentionAcc !== undefined && savedData.feCurBalInRetentionAcc !== null
                ? String(savedData.feCurBalInRetentionAcc)
                : '',

            // Debit/Credit Amounts
            debitCreditToEscrow:
              savedData.feDebitFromEscrow?.toString() || '',
            debitFromRetention:
              savedData.feDebitFromRetention?.toString() || '',

            // Engineer Fee Information (using correct field names)
            engineerApprovedAmount:
              savedData.feEngineerApprovedAmt?.toString() || '',
            // UI field: EngineerFeesPayment
            EngineerFeesPayment:
              savedData.feCorporatePaymentEngFee?.toString() || '',

            // Additional Financial Fields (using correct field names)
            totalEligibleAmount:
              savedData.feTotalEligibleAmtInv?.toString() || '',
            amountPaid: savedData.feAmtPaidAgainstInv?.toString() || '',
            // Capital Limit Exceeded
            amountPaid1: savedData.feCapExcedded || '',
            currentEligibleAmount:
              savedData.feCurEligibleAmt?.toString() || '',
            totalPayoutAmount: savedData.feTotalPayoutAmt?.toString() || '',
            amountInTransit: savedData.feAmountInTransit?.toString() || '',
            // Indicative Rate (UI field name is vatCapExceeded3)
            vatCapExceeded3: savedData.feIndicativeRate?.toString() || '',
            // UI fields for amounts below
            uploadDocuments:
              savedData.feAmountToBeReleased?.toString() || '',
            uploadDocuments1: savedData.feBeneVatPaymentAmt?.toString() || '',
            // Corporate Certification Fees → vatCapExceeded4
            vatCapExceeded4: savedData.feCorpCertEngFee?.toString() || '',

            // Deal Reference No.
            delRefNo: savedData.feDealRefNo || '',
            // PPC Number
            ppcNo: savedData.fePpcNumber?.toString() || '',

            // Payout to be made from CBS
            uploadDocuments2:
              (savedData.payoutToBeMadeFromCbsDTO as any)?.id?.toString() || '',

            // Boolean Flags
            corporateAmount: !!savedData.feCorporatePayment,
            specialRate: !!savedData.feSpecialRate,
            EngineerFeePaymentNeeded: !!savedData.feIsEngineerFee,
            forFeit: savedData.feForFeit ? 'true' : 'false',
            refundToUnitHolder: savedData.feRefundToUnitHolder
              ? 'true'
              : 'false',
            transferToOtherUnit: savedData.feTransferToOtherUnit
              ? 'true'
              : 'false',
            docVerified: savedData.feDocVerified ? 'true' : 'false',

            // Forfeit Amount
            forFeitAmt: savedData.feForFeitAmt?.toString() || '',

            // Date Fields
            unitTransferAppDate:
              savedData.feUnitTransferAppDate &&
              savedData.feUnitTransferAppDate !== ''
                ? dayjs(savedData.feUnitTransferAppDate)
                : null,
            paymentSubType1:
              savedData.feReraApprovedDate &&
              savedData.feReraApprovedDate !== ''
                ? dayjs(savedData.feReraApprovedDate)
                : null, // Regular approval date
            engineerFeePayment1:
              savedData.feBeneDateOfPayment &&
              savedData.feBeneDateOfPayment !== ''
                ? dayjs(savedData.feBeneDateOfPayment)
                : null, // Payment date
            // Bank Charges (numeric input field)
            engineerFeePayment2: savedData.fbbankCharges?.toString() || '',
          }

          // Pre-populate Build Partner/Project Account Status
          try {
            const accountStatusDTO = (savedData.realEstateAssestDTO as any)?.reaAccountStatusDTO
            
            if (accountStatusDTO && Array.isArray(buildAssetAccountStatuses.data) && buildAssetAccountStatuses.data.length > 0) {
              // Try to match by ID first (most reliable)
              let matched = null
              if (accountStatusDTO.id) {
                matched = buildAssetAccountStatuses.data.find(
                  (opt: any) => opt?.id === accountStatusDTO.id || String(opt?.id) === String(accountStatusDTO.id)
                )
              }
              
              // If no ID match, try to match by label/value
              if (!matched) {
                const statusLabel =
                  accountStatusDTO?.languageTranslationId?.configValue ||
                  accountStatusDTO?.settingValue ||
                  accountStatusDTO?.name ||
                  accountStatusDTO?.configValue ||
                  ''
                
                if (statusLabel) {
                  matched = buildAssetAccountStatuses.data.find(
                    (opt: any) =>
                      opt?.languageTranslationId?.configValue === statusLabel ||
                      opt?.settingValue === statusLabel ||
                      opt?.name === statusLabel ||
                      opt?.configValue === statusLabel
                  )
                }
              }
              
              if (matched?.id) {
                setValue('projectStatus', String(matched.id), {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: false,
                })
              }
            }
          } catch (error) {
            console.error('Error prepopulating projectStatus:', error)
          }

          // Add developer name to additional names if not in current list
          if (
            formData.developerName &&
            !developerNames.includes(formData.developerName)
          ) {
            setAdditionalDeveloperNames((prev) => [
              ...prev,
              formData.developerName,
            ])
          }

            // Add project asset to additional assets if not in current list (by ID)
          // Use new field (assetRegisterName) or old field (projectName)
          const assetId = formData.assetRegisterName || formData.projectName
          if (savedData.realEstateAssestDTO && assetId) {
            const projectId = parseInt(String(assetId))
            const existingAsset = projectAssets.find(
              (asset: any) => asset.id === projectId
            )

            if (!existingAsset) {
              const newAsset = {
                id: savedData.realEstateAssestDTO.id,
                reaName: savedData.realEstateAssestDTO.reaName,
                reaId: savedData.realEstateAssestDTO.reaId,
              }
              setAdditionalProjectAssets((prev) => [...prev, newAsset])
            }
          }
          
          // Prepopulate beneficiary fields if available from API
          if ((savedData as any)?.voucherDTO) {
            formData.voucherDTO = {
              benVoucher: (savedData as any).voucherDTO.benVoucher || '',
              benVoucherName: (savedData as any).voucherDTO.benVoucherName || '',
              benVoucherSwiftCode: (savedData as any).voucherDTO.benVoucherSwiftCode || '',
              benVoucherRoutingCode: (savedData as any).voucherDTO.benVoucherRoutingCode || '',
              benVoucherAccountNumber: (savedData as any).voucherDTO.benVoucherAccountNumber || '',
            }
          }
          
          if ((savedData as any)?.buildPartnerDTO?.bpName) {
            formData.buildPartnerDTO = {
              bpName: (savedData as any).buildPartnerDTO.bpName || '',
            }
          }

          // Set form values - force update even if field exists
          Object.entries(formData).forEach(([key, value]) => {
            if (value) {
              // Only set non-empty values
              setValue(key as any, value, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: false,
              })

              // Handle payment reference ID for both old and new field names
              if (key === 'tasReference' || key === 'vaucherReferenceNumber') {
                setPaymentRefId(String(value || ''))
              }
            }
          })

          // Mark prepopulation as attempted to prevent multiple attempts
          setPrepopulationAttempted(true)

          if (onDataLoaded) {
            onDataLoaded()
          }
        } catch (error) {
          setPrepopulationAttempted(true) // Still mark as attempted to prevent retries

          // Still notify parent even if there's an error, to stop loading state
          if (onDataLoaded) {
            onDataLoaded()
          }
        }
      }
    }
  }, [isEditMode, savedId, prepopulationAttempted, developerNames, projectAssets, onDataLoaded, setValue, trigger])

  // Handle data prepopulation when in edit mode
  useEffect(() => {

    // Run prepopulation when:
    // 1. We're in edit mode
    // 2. We have a saved ID
    // 3. We haven't attempted prepopulation yet
    // 4. Either initial data is loaded OR we have some data to work with
    if (isEditMode && savedId && !prepopulationAttempted) {
      // Wait a bit for shared data to load, but don't wait forever
      const timeoutId = setTimeout(
        () => {
          prepopulateData()
        },
        sharedData.isInitialLoading ? 1000 : 100
      ) // 1s if loading, 100ms if data ready

      return () => clearTimeout(timeoutId)
    }

    // Return empty cleanup function if conditions not met
    return () => {}
  }, [
    isEditMode,
    savedId,
    setValue,
    sharedData.isInitialLoading,
    prepopulationAttempted,
    onDataLoaded,
    prepopulateData,
  ])

  // Refresh-from-API when coming back to Step 1 (refreshKey changes)
  useEffect(() => {
    if (!isEditMode || !savedId) return
    // Reset and refetch on step re-entry
    setPrepopulationAttempted(false)
    const t = setTimeout(() => {
      prepopulateData()
    }, sharedData.isInitialLoading ? 1000 : 0)
    return () => clearTimeout(t)
  }, [refreshKey])

  // Reset prepopulation flag and additional data when savedId changes
  useEffect(() => {
    setPrepopulationAttempted(false)
    setAdditionalDeveloperNames([])
    setAdditionalProjectAssets([])
  }, [savedId])

  // Function to generate new payment reference ID
  const handleGeneratePaymentRefId = async () => {
    try {
      setIsGeneratingId(true)
      const newIdResponse = idService.generateNewId('PAY')
      const newId = newIdResponse.id

      // Update both state and form value
      setPaymentRefId(newId)
      setValue('vaucherReferenceNumber', newId, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
      // Ensure validation errors are cleared immediately
      await trigger('vaucherReferenceNumber' as any)
    } catch {
      // Error handling can be added here if needed
    } finally {
      setIsGeneratingId(false)
    }
  }

  // Watch for developer name changes and auto-populate developer ID
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'developerName' && value.developerName) {
        const selectedPartner = buildPartners.data.find(
          (bp: any) => bp.bpName === value.developerName
        )
        if (selectedPartner) {
          setValue('developerId', selectedPartner.bpDeveloperId, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          })
          // Clear any existing validation error for developerId immediately
          trigger('developerId' as any)
        }
      }

      // Watch for project name changes and auto-populate project ID
      if (name === 'projectName' && value.projectName) {
        const selectedAsset = projectAssets.find(
          (asset: any) => asset.id === parseInt(value.projectName)
        )
        if (selectedAsset) {
          setValue('projectId', selectedAsset.reaId, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          })
          // Clear any existing validation error for projectId immediately
          trigger('projectId' as any)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setValue, buildPartners, projectAssets])

  // Re-attempt ID population when build partners data becomes available
  useEffect(() => {
    const currentDeveloperName = watch('developerName')
    const currentProjectName = watch('projectName')

    // Try to populate developer ID if we have a name but no ID
    if (
      currentDeveloperName &&
      !watch('developerId') &&
      buildPartners.data.length > 0
    ) {
      const selectedPartner = buildPartners.data.find(
        (bp: any) => bp.bpName === currentDeveloperName
      )
      if (selectedPartner) {
        setValue('developerId', selectedPartner.bpDeveloperId, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        })
        trigger('developerId' as any)
      }
    }

    // Try to populate project ID if we have a project ID value but no project ID field
    if (currentProjectName && !watch('projectId') && projectAssets.length > 0) {
      const selectedAsset = projectAssets.find(
        (asset: any) => asset.id === parseInt(currentProjectName)
      )
      if (selectedAsset) {
        setValue('projectId', selectedAsset.reaId, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        })
        trigger('projectId' as any)
      }
    }
  }, [buildPartners.data, projectAssets, watch, setValue])

  // Initialize payment reference ID from form value and keep in sync
  React.useEffect(() => {
    const currentId = watch('vaucherReferenceNumber')
    if (currentId !== paymentRefId) {
      setPaymentRefId(currentId || '')
    }
  }, [watch, paymentRefId])

  // Update form value when paymentRefId state changes (for generate button)
  React.useEffect(() => {
    const currentFormValue = watch('vaucherReferenceNumber')
    if (paymentRefId && paymentRefId !== currentFormValue) {
      setValue('vaucherReferenceNumber', paymentRefId, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false,
      })
    }
  }, [paymentRefId, watch, setValue])

  // Common styles for form components
  const commonFieldStyles = {
    '& .MuiOutlinedInput-root': {
      height: '46px',
      borderRadius: '8px',
      '& fieldset': {
        borderColor: '#CAD5E2',
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderColor: '#CAD5E2',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2563EB',
      },
      '&.Mui-error fieldset': {
        borderColor: '#DC2626',
        borderWidth: '2px',
      },
    },
  }

  const selectStyles = {
    height: '48px',
    '& .MuiOutlinedInput-root': {
      height: '48px',
      borderRadius: '12px',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease-in-out',
      '& fieldset': {
        borderColor: '#E2E8F0',
        borderWidth: '1.5px',
        transition: 'border-color 0.2s ease-in-out',
      },
      '&:hover fieldset': {
        borderColor: '#3B82F6',
        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2563EB',
        borderWidth: '2px',
        boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
      },
      '&.Mui-error fieldset': {
        borderColor: '#DC2626',
        borderWidth: '2px',
        boxShadow: 'none',
      },
    },
    '& .MuiSelect-icon': {
      color: '#64748B',
      fontSize: '20px !important',
      transition: 'color 0.2s ease-in-out',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    '&:hover .MuiSelect-icon': {
      color: '#3B82F6',
    },
    '&.Mui-focused .MuiSelect-icon': {
      color: '#2563EB',
    },
  }

  const datePickerStyles = {
    height: '46px',
    '& .MuiOutlinedInput-root': {
      height: '46px',
      borderRadius: '8px',
      '& fieldset': {
        borderColor: '#CAD5E2',
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderColor: '#CAD5E2',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2563EB',
      },
      '&.Mui-error fieldset': {
        borderColor: '#DC2626',
        borderWidth: '2px',
      },
    },
  }

  const errorFieldStyles = {
    '& .MuiOutlinedInput-root': {
      height: '46px',
      borderRadius: '8px',
      '& fieldset': {
        borderColor: '#DC2626',
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: '#DC2626',
        borderWidth: '2px',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#DC2626',
        borderWidth: '2px',
      },
    },
  }

  const labelSx = {
    color: '#374151',
    fontFamily:
      'Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: 500,
    fontStyle: 'normal',
    fontSize: '13px',
    letterSpacing: '0.025em',
    marginBottom: '4px',
    '&.Mui-focused': {
      color: '#2563EB',
    },
    '&.Mui-error': {
      color: '#DC2626',
    },
    '&.MuiFormLabel-filled': {
      color: '#374151',
    },
  }

  const valueSx = {
    color: '#111827',
    fontFamily:
      'Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    letterSpacing: '0.01em',
    wordBreak: 'break-word',
    '& .MuiSelect-select': {
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'center',
    },
  }

  const StyledCalendarIcon = (
    props: React.ComponentProps<typeof CalendarTodayOutlinedIcon>
  ) => (
    <CalendarTodayOutlinedIcon
      {...props}
      sx={{
        width: '18px',
        height: '20px',
        position: 'relative',
        top: '2px',
        left: '3px',
        transform: 'rotate(0deg)',
        opacity: 1,
      }}
    />
  )
  const renderTextField = (
    name: string,
    label: string,
    gridSize = 6,
    defaultValue = '',
    isRequired = false,
    disabled = false
  ) => {
    return (
      <Grid key={name} size={{ xs: 12, md: gridSize }}>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label={label}
              fullWidth
              error={!!error}
              helperText={error?.message}
              disabled={disabled || isReadOnly}
              required={isRequired && !isReadOnly}
              InputLabelProps={{ sx: labelSx }}
              InputProps={{ sx: valueSx }}
              sx={commonFieldStyles}
              onChange={(e) => {
                const value = e.target.value
                const maxLen = getFieldMaxLength(name)
                // Let user type freely but trigger validation on over-limit for fields with max length
                if (maxLen && value.length > maxLen) {
                  field.onChange(value)
                  // Trigger schema validation immediately so Zod shows "Max 15 characters"
                  // @ts-expect-error - Accessing internal form state for validation trigger
                  if ((control as any)._formState) {
                    trigger(name as any)
                  }
                } else {
                  field.onChange(value)
                }
              }}
            />
          )}
        />
      </Grid>
    )
  }

  const renderSelectField = (
    name: string,
    label: string,
    options: any[],
    gridSize = 6,
    isRequired = true,
    isLoading = false,
    disabled = false
  ) => {
    return (
      <Grid key={name} size={{ xs: 12, md: gridSize }}>
        <Controller
          name={name}
          control={control}
          defaultValue={''}
          render={({ field, fieldState: { error } }) => (
            <FormControl
              fullWidth
              error={!!error}
              aria-invalid={!!error}
              required={isRequired && !isReadOnly}
            >
              <InputLabel sx={labelSx} required={isRequired && !isReadOnly}>
                {label}
              </InputLabel>
              <Select
                {...field}
                label={label}
                sx={{
                  ...selectStyles,
                  ...valueSx,
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #9ca3af',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: '2px solid #2563eb',
                  },
                }}
                disabled={disabled || isLoading || isReadOnly}
                IconComponent={KeyboardArrowDownIcon}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #E5E7EB',
                      marginTop: '8px',
                      minHeight: '120px',
                      maxHeight: '300px',
                      overflow: 'auto',
                      '& .MuiMenuItem-root': {
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontFamily:
                          'Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        color: '#374151',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: '#F3F4F6',
                          color: '#111827',
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#EBF4FF',
                          color: '#2563EB',
                          fontWeight: 500,
                          '&:hover': {
                            backgroundColor: '#DBEAFE',
                          },
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  -- Select --
                </MenuItem>
                {options.map((option, index) => (
                  <MenuItem
                    key={option.id || option || `option-${index}`}
                    value={option.id || option || ''}
                    sx={{
                      fontSize: '14px',
                      fontFamily:
                        'Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      color: '#374151',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: '#F3F4F6',
                        color: '#111827',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#EBF4FF',
                        color: '#2563EB',
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: '#DBEAFE',
                        },
                      },
                    }}
                  >
                    {option.displayName ||
                      option.name ||
                      (typeof option === 'string' ? option : '')}
                  </MenuItem>
                ))}
              </Select>
              <FormError error={error?.message || ''} touched={true} />
            </FormControl>
          )}
        />
      </Grid>
    )
  }

  const renderDatePickerField = (
    name: string,
    label: string,
    gridSize: number = 6,
    isRequired = false
  ) => {
    return (
      <Grid key={name} size={{ xs: 12, md: gridSize }}>
        <Controller
          name={name}
          control={control}
          defaultValue={null}
          render={({ field, fieldState: { error } }) => (
            <DatePicker
              label={label}
              value={field.value}
              onChange={field.onChange}
              format="DD/MM/YYYY"
              disabled={isReadOnly}
              slots={{
                openPickerIcon: StyledCalendarIcon,
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error?.message,
                  sx: datePickerStyles,
                  required: isRequired && !isReadOnly,
                  InputLabelProps: { sx: labelSx },
                  InputProps: {
                    sx: valueSx,
                    style: { height: '46px' },
                  },
                },
              }}
            />
          )}
        />
      </Grid>
    )
  }

  // Unused function - kept for potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderTextFieldWithButton = (
    name: string,
    label: string,
    buttonText: string,
    gridSize: number = 6,
    isRequired: boolean = false
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            fullWidth
            label={label}
            error={!!error}
            helperText={error?.message}
            required={isRequired && !isReadOnly}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<RefreshIcon />}
                    disabled={isReadOnly}
                    sx={{
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      textTransform: 'none',
                      background: '#2563EB',
                      '&:hover': {
                        background: '#1D4ED8',
                      },
                      minWidth: '100px',
                      height: '32px',
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 500,
                      fontStyle: 'normal',
                      fontSize: '11px',
                      lineHeight: '14px',
                      letterSpacing: '0.3px',
                      px: 1,
                    }}
                    onClick={() => {}}
                  >
                    {buttonText}
                  </Button>
                </InputAdornment>
              ),
              sx: valueSx,
            }}
            InputLabelProps={{ sx: labelSx }}
            sx={commonFieldStyles}
          />
        )}
      />
    </Grid>
  )

  const renderCheckboxField = (
    name: string,
    label?: string,
    gridSize: number = 6
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={!!field.value}
                sx={{
                  color: '#CAD5E2',
                  '&.Mui-checked': {
                    color: '#2563EB',
                  },
                }}
              />
            }
            label={
              label ??
              name
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase())
            }
            sx={{
              '& .MuiFormControlLabel-label': {
                fontFamily: 'Outfit, sans-serif',
                fontStyle: 'normal',
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '0.5px',
                verticalAlign: 'middle',
              },
            }}
          />
        )}
      />
    </Grid>
  )

  const renderPaymentRefIdField = (
    name: string,
    label: string,
    gridSize: number = 6,
    isRequired: boolean = false
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            fullWidth
            label={label}
            value={field.value || paymentRefId} // Use form value first, fallback to state
            disabled={isReadOnly} // Disable in view mode
            onChange={(e) => {
              const newValue = e.target.value
              setPaymentRefId(newValue)
              field.onChange(newValue) // Update form value
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: 0 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={handleGeneratePaymentRefId}
                    disabled={isGeneratingId || isReadOnly}
                    sx={{
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      textTransform: 'none',
                      background: '#2563EB',
                      '&:hover': {
                        background: '#1D4ED8',
                      },
                      minWidth: '100px',
                      height: '32px',
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 500,
                      fontStyle: 'normal',
                      fontSize: '11px',
                      lineHeight: '14px',
                      letterSpacing: '0.3px',
                      px: 1,
                    }}
                  >
                    {isGeneratingId ? 'Generating...' : 'Generate ID'}
                  </Button>
                </InputAdornment>
              ),
              sx: valueSx,
            }}
            error={!!error}
            helperText={error?.message}
            required={isRequired && !isReadOnly}
            InputLabelProps={{ sx: labelSx }}
            sx={commonFieldStyles}
          />
        )}
      />
    </Grid>
  )

  const renderAccountBalanceField = (
    accountKey: string,
    accountFieldName: string,
    accountLabel: string,
    balanceFieldName: string,
    balanceLabel: string,
    gridSize: number = 6,
    isRequired: boolean = false
  ) => (
    <>
      <Grid key={accountFieldName} size={{ xs: 12, md: gridSize }}>
        <Controller
          name={accountFieldName}
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label={accountLabel}
              disabled={isReadOnly} // Disable in view mode
              error={!!error}
              helperText={error?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<RefreshIcon />}
                      sx={{
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        textTransform: 'none',
                        background: '#2563EB',
                        '&:hover': {
                          background: '#1D4ED8',
                        },
                        minWidth: '100px',
                        height: '32px',
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 500,
                        fontStyle: 'normal',
                        fontSize: '11px',
                        lineHeight: '14px',
                        letterSpacing: '0.3px',
                        px: 1,
                      }}
                      onClick={async () => {
                        const isValid = await trigger(accountFieldName as any, {
                          shouldFocus: true,
                        })
                        if (!isValid) return
                        if (field.value) {
                          fetchBalance(accountKey, field.value)
                        }
                      }}
                      disabled={
                        loadingStates[accountKey] || !field.value || isReadOnly
                      }
                    >
                      {loadingStates[accountKey]
                        ? 'Loading...'
                        : 'Fetch Account Balance'}
                    </Button>
                  </InputAdornment>
                ),
                sx: valueSx,
              }}
              required={isRequired && !isReadOnly}
              InputLabelProps={{ sx: labelSx }}
              sx={commonFieldStyles}
            />
          )}
        />
      </Grid>
      <Grid key={balanceFieldName} size={{ xs: 12, md: gridSize }}>
        <Controller
          name={balanceFieldName}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label={balanceLabel}
              value={
                balances[accountKey]
                  ? `${balances[accountKey]?.currencyCode} ${balances[accountKey]?.details?.transferLimits?.creditTransfer || '0'}`
                  : field.value
              }
              onChange={(e) => field.onChange(e)}
              disabled={true}
              InputLabelProps={{ sx: labelSx }}
              InputProps={{ sx: valueSx }}
              sx={{
                ...commonFieldStyles,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#F5F5F5',
                  '& fieldset': {
                    borderColor: '#E0E0E0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#E0E0E0',
                  },
                },
              }}
            />
          )}
        />
        {accountErrors[accountKey] && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 0.5, ml: 1.75 }}
          >
            {String(accountErrors[accountKey])}
          </Typography>
        )}
      </Grid>
    </>
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card
        sx={{
          boxShadow: 'none',
          backgroundColor: '#FFFFFFBF',
          width: '84%',
          margin: '0 auto',
        }}
      >
        <CardContent>
          <Grid container rowSpacing={4} columnSpacing={2}>
            {/* OLD FIELDS - HIDDEN */}
            {/* {renderPaymentRefIdField(
              'tasReference',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.TAS_REFERENCE,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.TAS_REFERENCE
              ),
              6,
              true
            )} */}
            {/* {renderSelectField('developerName', ...)} */}
            {/* {renderTextField('developerId', ...)} */}
            {/* {renderSelectField('projectName', ...)} */}
            {/* {renderTextField('projectId', ...)} */}
            {/* {renderSelectField('projectStatus', ...)} */}
            {/* {renderAccountBalanceField('subConstruction', 'corporateAccount', ...)} */}
            {/* {renderAccountBalanceField('corporate', 'corporateAccount1', ...)} */}

            {/* NEW FIELDS START */}
            {renderPaymentRefIdField(
              'vaucherReferenceNumber',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.VAUCHER_REFERENC_NUMBER,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.VAUCHER_REFERENC_NUMBER
              ),
              6,
              true
            )}
            {renderSelectField(
              'assetRegisterName',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.ASSET_REGISTER_NAME,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.ASSET_REGISTER_NAME
              ),
              assetRegisterNames,
              6,
              true
            )}
            {renderTextField(
              'managementFirmName',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.MANAGEMENT_FIRM_NAME,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_FIRM_NAME
              ),
              6,
              '',
              true
            )}
            {renderSelectField(
              'managementFirmAccountStatus',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.MANAGEMENT_FIRM_ACCOUNT_STATUS,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_FIRM_ACCOUNT_STATUS
              ),
              buildAssetAccountStatuses.data,
              6,
              true
            )}

            {/* FETCH DATA AUTOMATICALLY FROM API */}
            {renderAccountBalanceField(
              'escrow',
              'escrowAccount',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.ESCROW_ACCOUNT,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.ESCROW_ACCOUNT
              ),
              'subConstructionAccount',
              'Current Balance in Escrow Account*',
              6,
              true
            )}
            {renderAccountBalanceField(
              'retention',
              'corporateAccount2',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.RETENTION_ACCOUNT,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.RETENTION_ACCOUNT
              ),
              'retentionAccount2',
              'Current Balance in Retention Account*',
              6,
              true
            )}
            {/* END OF FETCH DATA AUTOMATICALLY FROM API */}

            <Grid size={{ xs: 12 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#1E2939',
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
                  VOUCHER_LABELS.SECTION_TITLES.EXPENSE_TYPE,
                  'EN',
                  VOUCHER_LABELS.FALLBACKS.SECTION_TITLES.EXPENSE_TYPE
                )}
              </Typography>
            </Grid>

            {renderSelectField(
              'paymentType',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.PAYMENT_TYPE,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.PAYMENT_TYPE
              ),
              paymentTypes.data || [],
              6,
              true
            )}
            {renderSelectField(
              'paymentSubType',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.PAYMENT_SUB_TYPE,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.PAYMENT_SUB_TYPE
              ),
              paymentSubTypes.data || [],
              6,
              false
            )}
            {renderTextField(
              'hoaApprovalNumber',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.HOA_APPROVAL_NUMBER,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.HOA_APPROVAL_NUMBER
              ),
              6,
              '',
              true
            )}
            {renderDatePickerField(
              'hoaApprovalDate',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.HOA_APPROVAL_DATE,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS
                  .HOA_APPROVAL_DATE
              ),
              6,
              true
            )}
            {renderTextField(
              'invoiceRef',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.INVOICE_REF,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.INVOICE_REF
              ),
              3,
              '',
              true
            )}
            {renderSelectField(
              'invoiceCurrency',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.INVOICE_CURRENCY,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.INVOICE_CURRENCY
              ),
              currencies.data || [],
              3,
              true
            )}
            {renderTextField(
              'invoiceValue',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.INVOICE_VALUE,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.INVOICE_VALUE
              ),
              3,
              '',
              true
            )}
            {renderDatePickerField(
              'invoiceDate',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.INVOICE_DATE,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.INVOICE_DATE
              ),
              3
            )}

            <Grid size={{ xs: 12 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#1E2939',
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
                  VOUCHER_LABELS.SECTION_TITLES.AMOUNT_DETAILS,
                  'EN',
                  VOUCHER_LABELS.FALLBACKS.SECTION_TITLES.AMOUNT_DETAILS
                )}
              </Typography>
            </Grid>

            {renderCheckboxField(
              'specialRate',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.SPECIAL_RATE,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.SPECIAL_RATE
              ),
              3
            )}
            {renderCheckboxField(
              'corporateAmount',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.CORPORATE_AMOUNT,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.CORPORATE_AMOUNT
              ),
              3
            )}

            {/* RT03 */}
            {renderTextField(
              'RT03',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.RT03,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.RT03
              ),
              12,
              '',
              true
            )}
            {renderTextField(
              'totalEligibleAmount',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.TOTAL_ELIGIBLE_AMOUNT,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS
                  .TOTAL_ELIGIBLE_AMOUNT
              ),
              6,
              '',
              true
            )}
            {/* END OF Total Eligible Amount */}
            {/* Amount Paid against Invoice Amount */}
            {renderTextField(
              'amountPaid',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.AMOUNT_PAID,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.AMOUNT_PAID
              )
            )}
            {/* END OF Amount Paid against Invoice Amount */}

            {renderCheckboxField(
              'capExceeded',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.CAP_EXCEEDED,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.CAP_EXCEEDED
              ),
              3
            )}
            {renderTextField(
              'totalAmountPaid',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.TOTAL_AMOUNT_PAID,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.TOTAL_AMOUNT_PAID
              ),
              6
            )}
            {renderSelectField(
              'paymentCurrency',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.PAYMENT_CURRENCY,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.PAYMENT_CURRENCY
              ),
              currencies.data,
              3
            )}
            {renderTextField(
              'debitCreditToEscrow',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.DEBIT_CREDIT_ESCROW,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.DEBIT_CREDIT_ESCROW
              ),
              3
            )}
            {renderTextField(
              'currentEligibleAmount',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.CURRENT_ELIGIBLE_AMOUNT,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS
                  .CURRENT_ELIGIBLE_AMOUNT
              ),
              3
            )}
            {renderTextField(
              'debitFromRetention',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.DEBIT_FROM_RETENTION,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.DEBIT_FROM_RETENTION
              ),
              3
            )}
            {renderTextField(
              'totalPayoutAmount',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.TOTAL_PAYOUT_AMOUNT,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.TOTAL_PAYOUT_AMOUNT
              ),
              3
            )}
            {renderTextField(
              'amountInTransit',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.AMOUNT_IN_TRANSIT,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.AMOUNT_IN_TRANSIT
              ),
              3
            )}
            {/* END NEW FIELD END */}
            {/* BUDGET DETAILS START */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#1E2939',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '18px',
                  lineHeight: '28px',
                  letterSpacing: '0.15px',
                  verticalAlign: 'middle',
                }}
              >
                Budget Details
              </Typography>
            </Grid>
            {/* BUDGER DROP DOWN FIELDS START */}
            {renderSelectField(
              'budgetYear',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.BUDGET_YEAR,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.BUDGET_YEAR
              ),
              boolYnOptions.data || [],
              6,
              true
            )}
            {renderSelectField(
              'budgetCategory',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.BUDGET_CATEGORY,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.BUDGET_CATEGORY
              ),
              boolYnOptions.data || [],
              6,
              true
            )}
            {renderSelectField(
              'budgetSubCategory',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.BUDGET_SUB_CATEGORY,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.BUDGET_SUB_CATEGORY
              ),
              boolYnOptions.data || [],
              6,
              true
            )}
            {renderSelectField(
              'budgetServiceName',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.BUDGET_SERVICE_NAME,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.BUDGET_SERVICE_NAME
              ),
              boolYnOptions.data || [],
              6,
              true
            )}
            {/* BUDGER DROP DOWN FIELDS END */}

            {/* CHECKBOX FIELDS START */}
            {renderCheckboxField(
              'provisionalBudget',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.PROVISIONAL_BUDGET,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.PROVISIONAL_BUDGET
              ),
              6
            )}
            {renderCheckboxField(
              'HOAExemption',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.HOA_EXEMPTION,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.HOA_EXEMPTION
              ),
              6
            )}
            {/* CHECKBOX FIELDS END */}
            {/* AUTO POPULATE BUDGET DETAILS START */}

            {renderAccountBalanceField(
              'categoryCode',
              'categoryCode',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.CATEGORY_CODE,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_CODE
              ),
              'categoryName',
              'Current Balance in Category Name*',
              6,
              true
            )}

            {renderAccountBalanceField(
              'subCategoryCode',
              'subCategoryCode',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.SUB_CATEGORY_CODE,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.SUB_CATEGORY_CODE
              ),
              'subCategoryName',
              'Current Balance in Sub Category Name*',
              6,
              true
            )}
            {renderAccountBalanceField(
              'serviceCode',
              'serviceCode',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.SERVICE_CODE,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_CODE
              ),
              'serviceName',
              'Current Balance in Service Name*',
              6,
              true
            )}
            {renderAccountBalanceField(
              'provisionalBudgetCode',
              'provisionalBudgetCode',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.PROVISIONAL_BUDGET_CODE,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS
                  .PROVISIONAL_BUDGET_CODE
              ),
              'provisionalBudgetName',
              'Current Balance in Provisional Budget Name*',
              6,
              true
            )}
            {renderAccountBalanceField(
              'availableBudget',
              'availableBudgetAmount',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.AVAILABLE_BUDGET_AMOUNT,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS
                  .AVAILABLE_BUDGET_AMOUNT
              ),
              'availableBudgetAmount',
              'Current Balance in Available Budget Amount*',
              6,
              true
            )}

            {renderAccountBalanceField(
              'utilizedBudget',
              'utilizedBudgetAmount',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.UTILIZED_BUDGET_AMOUNT,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS
                  .UTILIZED_BUDGET_AMOUNT
              ),
              'utilizedBudgetAmount',
              'Current Balance in Utilized Budget Amount*',
              6,
              true
            )}

            {renderAccountBalanceField(
              'invoiceBudget',
              'invoiceBudgetAmount',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.INVOICE_BUDGET_AMOUNT,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS
                  .INVOICE_BUDGET_AMOUNT
              ),
              'invoiceBudgetAmount',
              'Current Balance in Invoice Budget Amount*',
              6,
              true
            )}
            {/* AUTO POPULATE BUDGET DETAILS END */}

            {/* BUDGET DETAILS END */}

            {/* BENEFICIARY DETAILS START */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#1E2939',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '18px',
                  lineHeight: '28px',
                  letterSpacing: '0.15px',
                  verticalAlign: 'middle',
                }}
              >
                Beneficiary Details
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              {/* <Controller
                name="voucherDTO.benVoucher"
                control={control}
                defaultValue={sanitizedData?.voucherDTO?.benVoucher || ''}
                rules={{
                  validate: (value: unknown) =>
                    validateStep1Field('voucherDTO.benVoucher', value),
                }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={!!(errors as any)?.voucherDTO?.benVoucher}
                    required={true}
                    sx={
                      (errors as any)?.voucherDTO?.benVoucher
                        ? errorFieldStyles
                        : commonFieldStyles
                    }
                  >
                    <InputLabel sx={labelSx}>
                      {getLabel(
                        VOUCHER_LABELS.FORM_FIELDS.BEN_VOUCHER_ACCOUNT,
                        'EN',
                        VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.BEN_VOUCHER_ACCOUNT
                      )}
                    </InputLabel>
                    <Select
                      {...field}
                      disabled={isReadOnly || isVoucherLoading}
                      label={getLabel(
                        VOUCHER_LABELS.FORM_FIELDS.BEN_VOUCHER_ACCOUNT,
                        'EN',
                        VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.BEN_VOUCHER_ACCOUNT
                      )}
                      sx={{
                        ...selectStyles,
                        ...valueSx,
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid #9ca3af',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          border: '2px solid #2563eb',
                        },
                      }}
                      IconComponent={KeyboardArrowDownIcon}
                      onChange={(e) => {
                        field.onChange(e)
                        handleVoucherBeneficiaryDetailsChange(
                          e.target.value as string
                        )
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 300,
                          },
                        },
                      }}
                    >
                      {isDevelopersLoading ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : VoucherData?.content && VoucherData.content.length > 0 ? (
                        VoucherData.content.map((voucher: { id?: number; benVoucher?: string; bpName?: string }) => (
                          <MenuItem
                            key={voucher.id || voucher.benVoucher}
                            value={voucher.benVoucher || ''}
                          >
                            {voucher.benVoucher || 'No CIF'} - {voucher.bpName || 'No Name'}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No beneficiary accounts available</MenuItem>
                      )}
                    </Select>
                    {(errors as any)?.voucherDTO?.benVoucher && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 1.75 }}
                      >
                        {(errors as any).voucherDTO.benVoucher.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              /> */}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="voucherDTO.benVoucherName"
                control={control}
                defaultValue={sanitizedData?.voucherDTO?.benVoucherName || ''}
                rules={{
                  validate: (value: unknown) =>
                    validateStep1Field('voucherDTO.benVoucherName', value),
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    disabled={true}
                    label={getLabel(
                      VOUCHER_LABELS.FORM_FIELDS.BEN_VOUCHER_NAME,
                      'EN',
                      VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.BEN_VOUCHER_NAME
                    )}
                    required={true}
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                    helperText="Auto-filled when Beneficiary Account is selected"
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="buildPartnerDTO.bpName"
                control={control}
                defaultValue={
                  sanitizedData?.voucherDTO?.benVoucherBankName || ''
                }
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    disabled={true}
                    label={getLabel(
                      VOUCHER_LABELS.FORM_FIELDS.BEN_VOUCHER_BANK_NAME,
                      'EN',
                      VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.BEN_VOUCHER_BANK_NAME
                    )}
                    required={true}
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                    helperText="Auto-filled when Beneficiary Account is selected"
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="voucherDTO.benVoucherSwiftCode"
                control={control}
                defaultValue={
                  sanitizedData?.voucherDTO?.benVoucherSwiftCode || ''
                }
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    disabled={true}
                    label={getLabel(
                      VOUCHER_LABELS.FORM_FIELDS.BEN_VOUCHER_SWIFT_CODE,
                      'EN',
                      VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.BEN_VOUCHER_SWIFT_CODE
                    )}
                    required={true}
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                    helperText="Auto-filled when Beneficiary Swift Code is selected"
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="voucherDTO.benVoucherRoutingCode"
                control={control}
                defaultValue={
                  sanitizedData?.voucherDTO?.benVoucherRoutingCode || ''
                }
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    disabled={true}
                    label={getLabel(
                      VOUCHER_LABELS.FORM_FIELDS.BEN_VOUCHER_ROUTING_CODE,
                      'EN',
                      VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.BEN_VOUCHER_ROUTING_CODE
                    )}
                    required={true}
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                    helperText="Auto-filled when Beneficiary Routing Code is selected"
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="voucherDTO.benVoucherAccountNumber"
                control={control}
                defaultValue={
                  sanitizedData?.voucherDTO?.benVoucherAccountNumber || ''
                }
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    disabled={true}
                    label={getLabel(
                      VOUCHER_LABELS.FORM_FIELDS.BEN_VOUCHER_ACCOUNT_NUMBER,
                      'EN',
                      VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.BEN_VOUCHER_ACCOUNT_NUMBER
                    )}
                    required={true}
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                    helperText="Auto-filled when Beneficiary Account Number/IBAN is selected"
                  />
                )}
              />
            </Grid>
            {renderSelectField(
              'engineerFeePayment',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.TRANSACTION_TYPE,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.TRANSACTION_TYPE
              ),
              transferTypes.data,
              6,
              false
            )}
            {renderTextField(
              'routinfSortcode',
              getLabel(
                VOUCHER_LABELS.FORM_FIELDS.ROUTINF_SORTCODE,
                'EN',
                VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.ROUTINF_SORTCODE
              ),
              6,
              '',
              true
            )}

            {/* BENEFICIARY DETAILS END */}
          </Grid>
        </CardContent>
      </Card>
    </LocalizationProvider>
  )
}

export default Step1
