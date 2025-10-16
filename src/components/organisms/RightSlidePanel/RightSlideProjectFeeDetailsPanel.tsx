import React, { useState } from 'react'
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
import { zodResolver } from '@hookform/resolvers/zod'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { useSaveProjectIndividualFee, useUpdateProjectIndividualFee } from '@/hooks/useProjects'
import {
  projectFeeValidationSchema,
  feeDetailsFormValidationSchema,
  type FeeDetailsFormData,
} from '@/lib/validation/feeSchemas'
import { convertDatePickerToZonedDateTime } from '@/utils'
import { useFeeDropdownLabels } from '@/hooks/useFeeDropdowns'
import { getFeeCategoryLabel } from '@/constants/mappings/feeDropdownMapping'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import { useProjectLabels } from '@/hooks/useProjectLabels'
import dayjs from 'dayjs'

interface RightSlidePanelProps {
  isOpen: boolean
  onClose: () => void
  onFeeAdded?: (fee: any) => void
  title?: string
  editingFee?: any
  projectId?: string
  buildPartnerId?: string
}

// Use the FeeDetailsFormData type from validation schema

export const RightSlideProjectFeeDetailsPanel: React.FC<
  RightSlidePanelProps
> = ({ isOpen, onClose, onFeeAdded, editingFee, projectId }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Add dynamic labels hook
  const { getLabel } = useProjectLabels()

  const addFeeMutation = useSaveProjectIndividualFee()
  const updateFeeMutation = useUpdateProjectIndividualFee()

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

  const {
    control,
    handleSubmit,
    reset,
    trigger,
  } = useForm<FeeDetailsFormData>({
    resolver: zodResolver(feeDetailsFormValidationSchema),
    mode: 'onChange', // Validate on every change
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
  })


  // Reset form when editing fee changes
  React.useEffect(() => {
    if (editingFee) {

      // Map display values back to IDs for editing
      const feeCategory = feeCategories.find(
        (category: unknown) =>
          (category as { configValue: string }).configValue === editingFee.FeeType
      )
      const feeFrequency = feeFrequencies.find(
        (frequency: unknown) =>
          (frequency as { configValue: string }).configValue === editingFee.Frequency
      )
      const debitAccount = debitAccounts.find(
        (account: unknown) =>
          (account as { configValue: string }).configValue === editingFee.DebitAccount
      )
      const currency = currencies.find(
        (curr: unknown) =>
          (curr as { configValue: string }).configValue === editingFee.Currency
      )

      const resetData = {
        feeType: (feeCategory as { id?: number })?.id?.toString() || editingFee.FeeType || '',
        frequency: (feeFrequency as { id?: number })?.id?.toString() || editingFee.Frequency || '',
        debitAmount: editingFee.DebitAmount || '',
        debitAccount: (debitAccount as { id?: number })?.id?.toString() || editingFee.DebitAccount || '',
        feeToBeCollected: editingFee.Feetobecollected ? dayjs(editingFee.Feetobecollected) : null,
        nextRecoveryDate: editingFee.NextRecoveryDate ? dayjs(editingFee.NextRecoveryDate) : null,
        feePercentage: editingFee.FeePercentage || '',
        vatPercentage: editingFee.VATPercentage || '',
        currency: (currency as { id?: number })?.id?.toString() || editingFee.Currency || '',
        totalAmount: editingFee.Amount || '',
      }

      reset(resetData)
    } else {
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
  }, [editingFee, reset, feeCategories, feeFrequencies, debitAccounts, currencies])

  const onSubmit = async (data: FeeDetailsFormData) => {
    try {
      setErrorMessage(null)
      setSuccessMessage(null)
      
      // Check if dropdown data is still loading
      if (dropdownsLoading) {
        setErrorMessage('Please wait for dropdown options to load before submitting.')
        return
      }
      
      // Validate form fields individually to provide better error messages
      const isValid = await trigger()
      
      if (!isValid) {
        // Get specific validation errors
        const errors = []
        if (!data.feeType) errors.push('Fee Category is required')
        if (!data.frequency) errors.push('Frequency is required')
        if (!data.debitAccount) errors.push('Debit Account is required')
        if (!data.feeToBeCollected) errors.push('Fee Collection Date is required')
        if (!data.debitAmount) errors.push('Amount is required')
        if (!data.totalAmount) errors.push('Total Amount is required')
        
        if (errors.length > 0) {
          setErrorMessage(`Please fill in the required fields: ${errors.join(', ')}`)
        }
        return
      }
      const feeData = {
        // Include ID for updates
        ...(editingFee?.id && { id: parseInt(editingFee.id.toString()) }),
        reafCategoryDTO: {
          id: parseInt(data.feeType) || 0,
        },
        reafFrequencyDTO: {
          id: parseInt(data.frequency) || 0,
        },
        reafAccountTypeDTO: {
          id: parseInt(data.debitAccount) || 0,
        },
        reafDebitAmount:
          parseFloat(data.debitAmount?.replace(/,/g, '') || '0') || 0,
        reafTotalAmount:
          parseFloat(data.totalAmount?.replace(/,/g, '') || '0') || 0,
        reafCollectionDate: data.feeToBeCollected
          ? convertDatePickerToZonedDateTime(
            (data.feeToBeCollected as any).format('YYYY-MM-DD')
          )
          : '',
        reafNextRecoveryDate: data.nextRecoveryDate
          ? convertDatePickerToZonedDateTime(
            (data.nextRecoveryDate as any).format('YYYY-MM-DD')
          )
          : '',
        reafFeePercentage:
          parseFloat(data.feePercentage?.replace(/%/g, '') || '0') || 0,
        reafVatPercentage:
          parseFloat(data.vatPercentage?.replace(/%/g, '') || '0') || 0,
        reafCurrencyDTO: {
          id: parseInt(data.currency || '0') || 0,
        },
        realEstateAssestDTO: {
          id: projectId ? parseInt(projectId) : undefined,
        },
      }

      const validationResult = projectFeeValidationSchema.safeParse(feeData)
      if (!validationResult.success) {
        const errorMessages = validationResult.error.issues.map(
          (issue) => issue.message
        )

        const feeTypeErrors = validationResult.error.issues.filter(
          (issue) =>
            issue.path.some(
              (path) =>
                typeof path === 'string' &&
                (path.includes('reafCategoryDTO') || path.includes('feeType'))
            ) ||
            issue.message.toLowerCase().includes('fee') ||
            issue.message.toLowerCase().includes('category')
        )

        if (feeTypeErrors.length > 0) {
        }

        setErrorMessage(errorMessages.join(', '))
        return
      }

      if (editingFee?.id) {
        // Update existing fee using PUT
        await updateFeeMutation.mutateAsync({ id: editingFee.id.toString(), feeData })
        setSuccessMessage('Fee updated successfully!')
      } else {
        // Add new fee using POST
        await addFeeMutation.mutateAsync(feeData)
        setSuccessMessage('Fee added successfully!')
      }

      if (onFeeAdded) {
        // Convert dropdown IDs to display names
        const feeTypeLabel =
          feeCategories.find((cat) => cat.id === parseInt(data.feeType))
            ?.configValue || `Fee Type ${data.feeType}`
        const frequencyLabel =
          feeFrequencies.find((freq) => freq.id === parseInt(data.frequency))
            ?.configValue || `Frequency ${data.frequency}`

        // Get display labels for currency and debit account
        const currencyLabel = currencies.find((curr) => curr.id === parseInt(data.currency))?.configValue || `Currency ${data.currency}`
        const debitAccountLabel = debitAccounts.find((acc) => acc.id === parseInt(data.debitAccount))?.configValue || `Account ${data.debitAccount}`

        const feeForForm = {
          // Map to table column names with display labels
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
              ).format('MMM DD, YYYY')
              : '',
          NextRecoveryDate:
            data.nextRecoveryDate &&
              (data.nextRecoveryDate as { isValid?: boolean }).isValid
              ? (
                data.nextRecoveryDate as {
                  format: (format: string) => string
                }
              ).format('MMM DD, YYYY')
              : '',
          FeePercentage: data.feePercentage,
          VATPercentage: data.vatPercentage,
          Amount: data.totalAmount,
          Currency: currencyLabel,
          DebitAccount: debitAccountLabel,
          // Keep original fields for reference
          feeType: data.feeType,
          frequency: data.frequency,
          debitAccount: data.debitAccount,
          currency: data.currency,
          debitAmount: data.debitAmount,
          feeToBeCollected: data.feeToBeCollected,
          nextRecoveryDate: data.nextRecoveryDate,
          feePercentage: data.feePercentage,
          vatPercentage: data.vatPercentage,
          totalAmount: data.totalAmount,
          realEstateAssetDTO: {
            id: projectId ? parseInt(projectId) : undefined,
          },
        }

        onFeeAdded(feeForForm)
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
          : 'Failed to add fee. Please try again.'
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
        borderColor: '#EF4444',
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderColor: '#DC2626',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#EF4444',
        borderWidth: '2px',
      },
    },
  }

  const selectStyles = {
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
    },
    '& .MuiSelect-icon': {
      color: '#475569',
      fontSize: '20px',
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
    name: keyof FeeDetailsFormData,
    label: string,
    defaultValue = '',
    gridSize: number = 6,
    required = false,
    maxLength?: number
  ) => (
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
            required={required}
            error={!!error}
            helperText={error?.message}
            inputProps={{ maxLength }}
            InputLabelProps={{ sx: labelSx }}
            InputProps={{ sx: valueSx }}
            sx={error ? errorFieldStyles : commonFieldStyles}
          />
        )}
      />
    </Grid>
  )

  const renderApiSelectField = (
    name: keyof FeeDetailsFormData,
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
        defaultValue={''}
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth error={!!error} required={required}>
            <InputLabel sx={labelSx}>
              {loading ? `Loading...` : label}
            </InputLabel>
            <Select
              {...field}
              input={
                <OutlinedInput
                  label={loading ? `Loading...` : label}
                />
              }
              label={loading ? `Loading...` : label}
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
            {error && (
              <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.75 }}>
                {error.message}
              </Box>
            )}
          </FormControl>
        )}
      />
    </Grid>
  )

  const renderDatePickerField = (
    name: keyof FeeDetailsFormData,
    label: string,
    gridSize: number = 6,
    required = false
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        defaultValue={null}
        render={({ field, fieldState: { error } }) => (
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
                required,
                error: !!error,
                helperText: error?.message,
                sx: error ? errorFieldStyles : commonFieldStyles,
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
          {getLabel('CDL_BPA_ADD_FEE_DETAILS', 'Add Project Fee Details')}
          <IconButton onClick={handleClose}>
            <CancelOutlinedIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            {/* Show error if dropdowns fail to load */}
            {dropdownsError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to load dropdown options. Please refresh the page.
              </Alert>
            )}
            
            {/* Show form validation errors */}
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Grid container rowSpacing={4} columnSpacing={2} mt={3}>
              {/* Fee Category * - Mandatory Dropdown */}
              {renderApiSelectField(
                'feeType',
                getLabel('CDL_BPA_FEE_CATEGORY', 'Fee Category'),
                feeCategories,
                6,
                true, // Required
                categoriesLoading
              )}
              {renderApiSelectField(
                'frequency',
                getLabel('CDL_BPA_FREQUENCY', 'Frequency'),
                feeFrequencies,
                6,
                true, // Required
                frequenciesLoading
              )}
              {renderApiSelectField(
                'currency',
                getLabel('CDL_BPA_CURRENCY', 'Currency'),
                currencies,
                6,
                false, // Not required
                currenciesLoading
              )}
              {renderApiSelectField(
                'debitAccount',
                getLabel('CDL_BPA_DEBIT_ACCOUNT', 'Debit Account'),
                debitAccounts,
                6,
                true, // Required
                accountsLoading
              )}
              {renderDatePickerField(
                'feeToBeCollected',
                getLabel('CDL_BPA_FEE_COLLECTION_DATE', 'Fee Collection Date'),
                6,
                true // Required
              )}
              {renderDatePickerField(
                'nextRecoveryDate',
                getLabel('CDL_BPA_NEXT_RECOVERY_DATE', 'Next Recovery Date'),
                6,
                false // Not required
              )}
              {renderTextField(
                'feePercentage',
                getLabel('CDL_BPA_FEE_PERCENTAGE', 'Fee Percentage'),
                '2%',
                6,
                false // Not required
              )}
              {renderTextField(
                'debitAmount',
                getLabel('CDL_BPA_AMOUNT', 'Amount'),
                '50,000',
                6,
                true, // Required
                10 // Max length
              )}

              {/* VAT Percentage - Optional */}
              {renderTextField(
                'vatPercentage',
                getLabel('CDL_BPA_VAT_PERCENTAGE', 'VAT Percentage'),
                '18%',
                6,
                false // Not required
              )}

              {/* Total Amount - Required */}
              {renderTextField(
                'totalAmount',
                getLabel('CDL_BPA_TOTAL_AMOUNT', 'Total Amount'),
                '50,000',
                12,
                true // Required
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
                  {getLabel('CDL_BPA_CANCEL', 'Cancel')}
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
                    ? getLabel('CDL_BPA_ADDING', 'Adding...')
                    : getLabel('CDL_BPA_ADD', 'Add')
                  }
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
