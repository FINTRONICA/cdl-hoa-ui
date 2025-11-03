import React, { useState, useCallback } from 'react'
import {
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Drawer,
  Box,
  Alert,
  Snackbar,
  OutlinedInput,
} from '@mui/material'
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material'
import { Controller, useForm } from 'react-hook-form'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import {
  useSaveBuildPartnerIndividualFee,
  useBuildPartnerFeeById,
} from '@/hooks/useBuildPartners'
import { feeValidationSchema } from '@/lib/validation'
import { DeveloperStep4Schema } from '@/lib/validation/developerSchemas'
import { convertDatePickerToZonedDateTime } from '@/utils'
import { useFeeDropdownLabels } from '@/hooks/useFeeDropdowns'
import { getFeeCategoryLabel } from '@/constants/mappings/feeDropdownMapping'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import dayjs from 'dayjs'
import { useBuildPartnerLabelsWithCache } from '@/hooks/useBuildPartnerLabelsWithCache'
import { getBuildPartnerLabel } from '@/constants/mappings/buildPartnerMapping'
import { useAppStore } from '@/store'
import { FormError } from '../../atoms/FormError'

interface RightSlidePanelProps {
  isOpen: boolean
  onClose: () => void
  onFeeAdded?: (fee: FeeFormData) => void
  onFeeUpdated?: (fee: FeeFormData, index: number) => void
  title?: string
  buildPartnerId?: string
  mode?: 'add' | 'edit'
  feeData?: any
  feeIndex?: number
}

interface FeeFormData {
  feeType: string
  frequency: string
  debitAmount: string
  debitAccount: string
  feeToBeCollected: unknown
  nextRecoveryDate: unknown
  feePercentage: string
  vatPercentage: string
  currency: string
  totalAmount: string
}

export const RightSlideFeeDetailsPanel: React.FC<RightSlidePanelProps> = ({
  isOpen,
  onClose,
  onFeeAdded,
  onFeeUpdated,
  buildPartnerId,
  mode = 'add',
  feeData,
  feeIndex,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const addFeeMutation = useSaveBuildPartnerIndividualFee()


  const { data: apiFeeData } = useBuildPartnerFeeById(
    mode === 'edit' && feeData?.id ? feeData.id : null
  )

  const {
    feeCategories,
    feeFrequencies,
    currencies,
    debitAccounts,
    isLoading: dropdownsLoading,
    categoriesLoading,
    frequenciesLoading,
    currenciesLoading,
    accountsLoading,
    error: dropdownsError,
    getDisplayLabel,
  } = useFeeDropdownLabels()


  const { data: buildPartnerLabels, getLabel } = useBuildPartnerLabelsWithCache()
  const currentLanguage = useAppStore((state) => state.language) || 'EN'
  const getBuildPartnerLabelDynamic = useCallback(
    (configId: string): string => {
      const fallback = getBuildPartnerLabel(configId)
      return buildPartnerLabels ? getLabel(configId, currentLanguage, fallback) : fallback
    },
    [buildPartnerLabels, currentLanguage, getLabel]
  )

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<FeeFormData>({
    defaultValues: {
      feeType: '',
      frequency: '',
      debitAmount: '',
      debitAccount: '',
      feeToBeCollected: null,
      nextRecoveryDate: null,
      feePercentage: '',
      vatPercentage: '',
      currency: '',
      totalAmount: '',
    },
    mode: 'onChange', 
  })

 
  React.useEffect(() => {
    if (isOpen && mode === 'edit' && (apiFeeData || feeData)) {
      const dataToUse: any = apiFeeData || feeData

      
      if (
        categoriesLoading ||
        frequenciesLoading ||
        currenciesLoading ||
        accountsLoading
      ) {
        return
      }

      try {
        
        const feeTypeId =
          dataToUse.bpFeeCategoryDTO?.id?.toString() ||
          feeCategories
            .find(
              (cat) =>
                cat.configValue === dataToUse.feeType ||
                cat.id?.toString() === dataToUse.feeType
            )
            ?.id?.toString() ||
          dataToUse.feeType ||
          ''

        const frequencyId =
          dataToUse.bpFeeFrequencyDTO?.id?.toString() ||
          feeFrequencies
            .find(
              (freq) =>
                freq.configValue === dataToUse.frequency ||
                freq.id?.toString() === dataToUse.frequency
            )
            ?.id?.toString() ||
          dataToUse.frequency ||
          ''

        const currencyId =
          dataToUse.bpFeeCurrencyDTO?.id?.toString() ||
          currencies
            .find(
              (curr) =>
                curr.configValue === dataToUse.currency ||
                curr.id?.toString() === dataToUse.currency
            )
            ?.id?.toString() ||
          dataToUse.currency ||
          ''

        const debitAccountId =
          dataToUse.bpAccountTypeDTO?.id?.toString() ||
          (dataToUse.debitAccount
            ? debitAccounts
                .find(
                  (acc) =>
                    acc.configValue === dataToUse.debitAccount ||
                    acc.id?.toString() === dataToUse.debitAccount
                )
                ?.id?.toString() || dataToUse.debitAccount
            : '')

       
        const feeCollectionDate =
          dataToUse.feeCollectionDate || dataToUse.feeToBeCollected || ''
        const feeToBeCollectedDate =
          feeCollectionDate && feeCollectionDate !== ''
            ? dayjs(feeCollectionDate, 'MMM DD, YYYY').isValid()
              ? dayjs(feeCollectionDate, 'MMM DD, YYYY')
              : dayjs(feeCollectionDate).isValid()
                ? dayjs(feeCollectionDate)
                : null
            : null

        const nextRecoveryDate =
          dataToUse.feeNextRecoveryDate || dataToUse.nextRecoveryDate || ''
        const nextRecoveryDateParsed =
          nextRecoveryDate && nextRecoveryDate !== ''
            ? dayjs(nextRecoveryDate, 'MMM DD, YYYY').isValid()
              ? dayjs(nextRecoveryDate, 'MMM DD, YYYY')
              : dayjs(nextRecoveryDate).isValid()
                ? dayjs(nextRecoveryDate)
                : null
            : null

        const formValues = {
          feeType: feeTypeId,
          frequency: frequencyId,
          debitAmount:
            dataToUse.debitAmount?.toString() || dataToUse.DebitAmount || '',
          debitAccount: debitAccountId,
          feeToBeCollected: feeToBeCollectedDate,
          nextRecoveryDate: nextRecoveryDateParsed,
          feePercentage:
            dataToUse.feePercentage?.toString() ||
            dataToUse.FeePercentage ||
            '',
          vatPercentage:
            dataToUse.vatPercentage?.toString() ||
            dataToUse.VATPercentage ||
            '',
          currency: currencyId,
          totalAmount:
            dataToUse.totalAmount?.toString() || dataToUse.Amount || '',
        }

        reset(formValues)
      } catch (error) {
        console.error('❌ Error populating fee form:', error)
      }
    } else if (isOpen && mode === 'add') {
      reset({
        feeType: '',
        frequency: '',
        debitAmount: '',
        debitAccount: '',
        feeToBeCollected: null,
        nextRecoveryDate: null,
        feePercentage: '',
        vatPercentage: '',
        currency: '',
        totalAmount: '',
      })
    }
  }, [
    isOpen,
    mode,
    feeData,
    apiFeeData,
    reset,
    feeCategories,
    feeFrequencies,
    currencies,
    debitAccounts,
    categoriesLoading,
    frequenciesLoading,
    currenciesLoading,
    accountsLoading,
  ])


  const validateFeeField = (
    fieldName: string,
    value: any,
    allValues: FeeFormData
  ) => {
    try {
      // First check for required fields with simple validation
      const requiredFields: Record<string, string> = {
        feeType: getBuildPartnerLabelDynamic('CDL_BP_FEES_TYPE_REQUIRED'),
        frequency: getBuildPartnerLabelDynamic('CDL_BP_FEES_FREQ_REQUIRED'),
        debitAccount: getBuildPartnerLabelDynamic('CDL_BP_FEES_ACCOUNT_REQUIRED'),
        feeToBeCollected: getBuildPartnerLabelDynamic('CDL_BP_FEES_COLLECTION_DATE_REQUIRED'),
        debitAmount: getBuildPartnerLabelDynamic('CDL_BP_FEES_DEBIT_AMOUNT_REQUIRED'),
        totalAmount: getBuildPartnerLabelDynamic('CDL_BP_FEES_TOTAL_REQUIRED'),
        vatPercentage: getBuildPartnerLabelDynamic('CDL_BP_FEES_VAT_REQUIRED'),
        currency: getBuildPartnerLabelDynamic('CDL_BP_FEES_CURRENCY_REQUIRED'),
      }

      // Check if this is a required field and if it's empty
      if (requiredFields[fieldName]) {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return requiredFields[fieldName]
        }
      }
      
      const feeForValidation = {
        fees: [{
          feeType: allValues.feeType,
          frequency: allValues.frequency,
          debitAmount: allValues.debitAmount,
          feeToBeCollected: allValues.feeToBeCollected,
          nextRecoveryDate: allValues.nextRecoveryDate,
          feePercentage: allValues.feePercentage,
          amount: allValues.totalAmount,
          vatPercentage: allValues.vatPercentage,
          currency: allValues.currency,
        }]
      }

    
      const result = DeveloperStep4Schema.safeParse(feeForValidation)

      if (result.success) {
        return true
      } else {
      
        const fieldMapping: Record<string, string> = {
          feeType: 'feeType',
          frequency: 'frequency',
          debitAmount: 'debitAmount',
          feeToBeCollected: 'feeToBeCollected',
          nextRecoveryDate: 'nextRecoveryDate',
          feePercentage: 'feePercentage',
          totalAmount: 'amount',
          vatPercentage: 'vatPercentage',
          currency: 'currency',
        }

        const schemaFieldName = fieldMapping[fieldName]
        if (!schemaFieldName) return true

      
        const fieldError = result.error.issues.find(
          (issue) =>
            issue.path.includes('fees') &&
            issue.path.includes(0) &&
            issue.path.includes(schemaFieldName)
        )

        return fieldError ? fieldError.message : true
      }
    } catch (error) {
      return true 
    }
  }

  const onSubmit = async (data: FeeFormData) => {
    try {
      setErrorMessage(null)
      setSuccessMessage(null)
      
      
      if (dropdownsLoading) {
        setErrorMessage(getBuildPartnerLabelDynamic('CDL_COMMON_SUBMIT_WAIT'))
        return
      }
      
     
      const isValid = await trigger()
      
      if (!isValid) {
        
        const errors = [] as string[]
        if (!data.feeType) errors.push(getBuildPartnerLabelDynamic('CDL_BP_FEES_TYPE_REQUIRED'))
        if (!data.frequency) errors.push(getBuildPartnerLabelDynamic('CDL_BP_FEES_FREQ_REQUIRED'))
        if (!data.debitAccount) errors.push(getBuildPartnerLabelDynamic('CDL_BP_FEES_ACCOUNT_REQUIRED'))
        if (!data.feeToBeCollected) errors.push(getBuildPartnerLabelDynamic('CDL_BP_FEES_COLLECTION_DATE_REQUIRED'))
        if (!data.debitAmount) errors.push(getBuildPartnerLabelDynamic('CDL_BP_FEES_DEBIT_AMOUNT_REQUIRED'))
        if (!data.totalAmount) errors.push(getBuildPartnerLabelDynamic('CDL_BP_FEES_TOTAL_REQUIRED'))

        if (errors.length > 0) {
          setErrorMessage(`${getBuildPartnerLabelDynamic('CDL_COMMON_REQUIRED_FIELDS_PREFIX')} ${errors.join(', ')}`)
        }
        return
      }

      const isEditing = mode === 'edit'
      const feePayload: any = {
        ...(isEditing && feeData?.id && { id: feeData.id }),
        bpFeeCategoryDTO: {
          id: parseInt(data.feeType) || 0,
        },
        bpFeeFrequencyDTO: {
          id: parseInt(data.frequency) || 0,
        },
        bpAccountTypeDTO: {
          id: parseInt(data.debitAccount) || 0,
        },
        debitAmount: parseFloat(data.debitAmount?.replace(/,/g, '')) || 0,
        totalAmount: parseFloat(data.totalAmount?.replace(/,/g, '')) || 0,
        feeCollectionDate: data.feeToBeCollected
          ? convertDatePickerToZonedDateTime(
              (data.feeToBeCollected as any).format('YYYY-MM-DD')
            )
          : '',
        feeNextRecoveryDate: data.nextRecoveryDate
          ? convertDatePickerToZonedDateTime(
              (data.nextRecoveryDate as any).format('YYYY-MM-DD')
            )
          : '',
        feePercentage: parseFloat(data.feePercentage?.replace(/%/g, '')) || 0,
        vatPercentage: parseFloat(data.vatPercentage?.replace(/%/g, '')) || 0,
        bpFeeCurrencyDTO: {
          id: parseInt(data.currency) || 0,
        },
        buildPartnerDTO: {
          id: buildPartnerId ? parseInt(buildPartnerId) : undefined,
        },
      }

    
      if (isEditing && apiFeeData) {
        const apiData = apiFeeData as any
        feePayload.status = apiData.status !== undefined ? apiData.status : null
        feePayload.enabled =
          apiData.enabled !== undefined ? apiData.enabled : false
        feePayload.deleted =
          apiData.deleted !== undefined ? apiData.deleted : null
      }

      const validationResult = feeValidationSchema.safeParse(feePayload)
      if (!validationResult.success) {
        const errorMessages = validationResult.error.issues.map(
          (issue) => issue.message
        )

        setErrorMessage(errorMessages.join(', '))
        return
      }

      await addFeeMutation.mutateAsync({
        data: feePayload,
        isEditing: isEditing,
        developerId: buildPartnerId,
      })

      setSuccessMessage(
        isEditing
          ? getBuildPartnerLabelDynamic('CDL_BP_FEES_UPDATE_SUCCESS')
          : getBuildPartnerLabelDynamic('CDL_BP_FEES_ADD_SUCCESS')
      )

      if (onFeeAdded || onFeeUpdated) {
        
        const feeTypeOption = feeCategories.find(
          (cat) => cat.id?.toString() === data.feeType
        )
        const feeTypeLabel =
          feeTypeOption?.configValue || `Fee Type ${data.feeType}`

        const frequencyOption = feeFrequencies.find(
          (freq) => freq.id?.toString() === data.frequency
        )
        const frequencyLabel =
          frequencyOption?.configValue || `Frequency ${data.frequency}`

        const currencyOption = currencies.find(
          (curr) => curr.id?.toString() === data.currency
        )
        const currencyLabel =
          currencyOption?.configValue || `Currency ${data.currency}`

        const accountOption = debitAccounts.find(
          (acc) => acc.id?.toString() === data.debitAccount
        )
        const accountLabel =
          accountOption?.configValue || `Account ${data.debitAccount}`

        const feeForForm = {
          ...(isEditing && feeData?.id && { id: feeData.id }),
          
          FeeType: feeTypeLabel,
          Frequency: frequencyLabel,
          DebitAmount: data.debitAmount,
          Feetobecollected:
            data.feeToBeCollected &&
            (data.feeToBeCollected as { isValid?: boolean }).isValid
              ? (
                  data.feeToBeCollected as {
                    format: (format: string) => string
                  }
                ).format('DD/MM/YYYY')
              : '',
          NextRecoveryDate:
            data.nextRecoveryDate &&
            (data.nextRecoveryDate as { isValid?: boolean }).isValid
              ? (
                  data.nextRecoveryDate as {
                    format: (format: string) => string
                  }
                ).format('DD/MM/YYYY')
              : '',
          FeePercentage: data.feePercentage,
          VATPercentage: data.vatPercentage,
          Amount: data.totalAmount,
     
          feeType: feeTypeLabel,
          frequency: frequencyLabel,
          debitAccount: accountLabel,
          currency: currencyLabel,
          buildPartnerDTO: {
            id: buildPartnerId ? parseInt(buildPartnerId) : undefined,
          },
        }

        // Call appropriate callback based on mode
        if (isEditing && onFeeUpdated && feeIndex !== undefined) {
          onFeeUpdated(feeForForm, feeIndex)
        } else if (!isEditing && onFeeAdded) {
          onFeeAdded(feeForForm)
        }
      }

      // Reset form and close after a short delay
      setTimeout(() => {
        reset()
        onClose()
      }, 1500)
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : getBuildPartnerLabelDynamic('CDL_BP_FEES_ADD_FAILED')
      setErrorMessage(errorMessage)
    }
  }

  const handleClose = () => {
    reset()
    setErrorMessage(null)
    setSuccessMessage(null)
    onClose()
  }

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
    },
  }

  const errorFieldStyles = {
    '& .MuiOutlinedInput-root': {
      height: '46px',
      borderRadius: '8px',
      '& fieldset': {
        borderColor: 'red',
        borderWidth: '1px',
      },
    },
  }

  const selectStyles = {
    height: '46px',
    borderRadius: '8px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#CAD5E2',
      borderWidth: '1px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#CAD5E2',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#2563EB',
    },
    '& .MuiSelect-icon': {
      color: '#666',
    },
  }

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

  const renderTextField = (
    name: keyof FeeFormData,
    label: string,
    defaultValue = '',
    gridSize: number = 6,
    required = false
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{
          validate: (value, formValues) => validateFeeField(name, value, formValues)
        }}
        render={({ field }) => (
          <>
            <TextField
              {...field}
              label={label}
              fullWidth
              required={required}
              error={!!errors[name]}
              InputLabelProps={{ sx: labelSx }}
              InputProps={{ sx: valueSx }}
              sx={errors[name] ? errorFieldStyles : commonFieldStyles}
            />
            <FormError error={(errors[name]?.message as string) || ''} touched={true} />
          </>
        )}
      />
    </Grid>
  )

  // New render function for API-driven dropdowns
  const renderApiSelectField = (
    name: keyof FeeFormData,
    label: string,
    options: unknown[],
    gridSize: number = 6,
    required = false,
    loading = false
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        rules={{
          validate: (value, formValues) => validateFeeField(name, value, formValues)
        }}
        defaultValue={''}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors[name]} required={required}>
            <InputLabel sx={labelSx}>
              {loading ? getBuildPartnerLabelDynamic('CDL_COMMON_LOADING') : label}
            </InputLabel>
            <Select
              {...field}
              input={
                <OutlinedInput
                  label={loading ? getBuildPartnerLabelDynamic('CDL_COMMON_LOADING') : label}
                />
              }
              label={loading ? getBuildPartnerLabelDynamic('CDL_COMMON_LOADING') : label}
              sx={{ ...selectStyles, ...valueSx }}
              IconComponent={KeyboardArrowDownIcon}
              disabled={loading}
            >
              {options.map((option) => (
                <MenuItem
                  key={(option as { configId?: string }).configId}
                  value={(option as { id?: string }).id}
                >
                  {getDisplayLabel(
                    option as any,
                    getFeeCategoryLabel(
                      (option as { configId?: string }).configId
                    )
                  )}
                </MenuItem>
              ))}
            </Select>
            <FormError error={(errors[name]?.message as string) || ''} touched={true} />
          </FormControl>
        )}
      />
    </Grid>
  )

  const renderDatePickerField = (
    name: keyof FeeFormData,
    label: string,
    gridSize: number = 6,
    required = false
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        rules={{
          validate: (value, formValues) => validateFeeField(name, value, formValues)
        }}
        defaultValue={null}
        render={({ field }) => (
          <>
            <DatePicker
              label={label}
              value={(field.value as any) || null}
              onChange={field.onChange}
              format="DD/MM/YYYY"
              slots={{
                openPickerIcon: CalendarTodayOutlinedIcon,
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: required,
                  error: !!errors[name],
                  sx: errors[name] ? errorFieldStyles : commonFieldStyles,
                  InputLabelProps: { sx: labelSx },
                  InputProps: {
                    sx: valueSx,
                    style: { height: '46px' },
                  },
                },
              }}
            />
            <FormError error={(errors[name]?.message as string) || ''} touched={true} />
          </>
        )}
      />
    </Grid>
  )

  // Don't render the drawer content until we're ready
  if (mode === 'edit' && !feeData) {
    return null
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 460,
            borderRadius: 3,
            backgroundColor: 'white',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 500,
            fontStyle: 'normal',
            fontSize: '20px',
            lineHeight: '28px',
            letterSpacing: '0.15px',
            verticalAlign: 'middle',
          }}
        >
          {mode === 'edit' ? getBuildPartnerLabelDynamic('CDL_BP_FEES_EDIT') : getBuildPartnerLabelDynamic('CDL_BP_FEES_ADD')}
          <IconButton onClick={handleClose}>
            <CancelOutlinedIcon />
          </IconButton>
        </DialogTitle>

        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            {/* Show error if dropdowns fail to load */}
            {dropdownsError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {getBuildPartnerLabelDynamic('CDL_COMMON_DROPDOWNS_LOAD_FAILED')}
              </Alert>
            )}

            <Grid container rowSpacing={4} columnSpacing={2} mt={3}>
              {renderApiSelectField(
                'feeType',
                getBuildPartnerLabelDynamic('CDL_BP_FEES_TYPE'),
                feeCategories,
                6,
                true,
                categoriesLoading
              )}
              {renderApiSelectField(
                'frequency',
                getBuildPartnerLabelDynamic('CDL_BP_FEES_FREQUENCY'),
                feeFrequencies,
                6,
                true,
                frequenciesLoading
              )}
              {renderApiSelectField(
                'debitAccount',
                getBuildPartnerLabelDynamic('CDL_BP_FEES_ACCOUNT'),
                debitAccounts,
                6,
                true,
                accountsLoading
              )}
              {renderDatePickerField(
                'feeToBeCollected',
                getBuildPartnerLabelDynamic('CDL_BP_FEES_TOTAL'),
                6,
                true
              )}
              {renderDatePickerField(
                'nextRecoveryDate',
                getBuildPartnerLabelDynamic('CDL_BP_FEES_DATE'),
                6,
                false
              )}
              {renderTextField(
                'feePercentage',
                getBuildPartnerLabelDynamic('CDL_BP_FEES_RATE'),
                '2%',
                6,
                false
              )}
              {renderTextField(
                'debitAmount',
                getBuildPartnerLabelDynamic('CDL_BP_FEES_AMOUNT'),
                '50,000',
                6,
                true
              )}
              {renderTextField(
                'vatPercentage',
                getBuildPartnerLabelDynamic('CDL_BP_FEES_VAT'),
                '18%',
                6,
                true
              )}
              {renderApiSelectField(
                'currency',
                getBuildPartnerLabelDynamic('CDL_BP_FEES_CURRENCY'),
                currencies,
                6,
                true,
                currenciesLoading
              )}
              {renderTextField(
                'totalAmount',
                getBuildPartnerLabelDynamic('CDL_BP_FEES_TOTAL_AMOUNT'),
                '50,000',
                12,
                true
              )}
            </Grid>
          </DialogContent>

          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 2,
            }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleClose}
                  disabled={addFeeMutation.isPending || dropdownsLoading}
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 500,
                    fontStyle: 'normal',
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '0.01em',
                    borderRadius: '8px',
                    borderColor: '#CAD5E2',
                    color: '#475569',
                    textTransform: 'none',
                    height: '44px',
                    '&:hover': {
                      borderColor: '#CAD5E2',
                      backgroundColor: '#F8FAFC',
                    },
                  }}
                >
                  {getBuildPartnerLabelDynamic('CDL_BP_FEES_CANCEL')}
                </Button>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={addFeeMutation.isPending || dropdownsLoading}
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 500,
                    fontStyle: 'normal',
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '0.01em',
                    borderRadius: '8px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    textTransform: 'none',
                    height: '44px',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#1D4ED8',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    },
                    '&:disabled': {
                      backgroundColor: '#94A3B8',
                      color: '#FFFFFF',
                    },
                  }}
                >
                  {addFeeMutation.isPending
                    ? mode === 'edit'
                      ? getBuildPartnerLabelDynamic('CDL_COMMON_UPDATING')
                      : getBuildPartnerLabelDynamic('CDL_COMMON_ADDING')
                    : mode === 'edit'
                      ? getBuildPartnerLabelDynamic('CDL_BP_FEES_UPDATE')
                      : getBuildPartnerLabelDynamic('CDL_BP_FEES_SAVE')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </form>

        {/* Error and Success Notifications */}
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={6000}
          onClose={() => setErrorMessage(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setErrorMessage(null)}
            severity="error"
            sx={{ width: '100%' }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSuccessMessage(null)}
            severity="success"
            sx={{ width: '100%' }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Drawer>
    </LocalizationProvider>
  )
}
