import React, { useState, useEffect } from 'react'
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
  FormHelperText,
  Button,
  Drawer,
  Box,
  InputAdornment,
  Alert,
  Snackbar,
  CircularProgress,
  Typography,
  OutlinedInput,
} from '@mui/material'
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material'
import { Controller, useForm } from 'react-hook-form'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
  useSaveBuildPartnerBeneficiary,
  useBuildPartnerBeneficiaryById,
} from '@/hooks/useBuildPartners'
import { useValidationStatus } from '@/hooks/useValidation'
import { validateAndSanitizeBeneficiaryData } from '@/lib/validation/beneficiarySchemas'
import { DeveloperStep5Schema } from '@/lib/validation/developerSchemas'

interface BeneficiaryFormData {
  bpbBeneficiaryId: string
  bpbBeneficiaryType: string | number
  bpbName: string
  bpbBankName: string | number
  bpbSwiftCode: string
  bpbRoutingCode: string
  bpbAccountNumber: string
}

interface RightSlidePanelProps {
  isOpen: boolean
  onClose: () => void
  onBeneficiaryAdded?: (beneficiary: BeneficiaryFormData) => void
  onBeneficiaryUpdated?: (
    beneficiary: BeneficiaryFormData,
    index: number
  ) => void
  title?: string
  mode?: 'add' | 'edit'
  beneficiaryData?: any
  beneficiaryIndex?: number
  editingBeneficiary?: BeneficiaryFormData | null
  bankNames?: unknown[]
  beneficiaryTypes?: unknown[]
  buildPartnerId?: string
  dropdownsLoading?: boolean
  dropdownsError?: unknown
}

export const RightSlideBeneficiaryDetailsPanel: React.FC<
  RightSlidePanelProps
> = ({
  isOpen,
  onClose,
  onBeneficiaryAdded,
  onBeneficiaryUpdated,
  title,
  mode = 'add',
  beneficiaryData,
  beneficiaryIndex,
  editingBeneficiary,
  bankNames: propBankNames,
  beneficiaryTypes: propBeneficiaryTypes,
  buildPartnerId,
  dropdownsLoading: propDropdownsLoading,
  dropdownsError: propDropdownsError,
}) => {
  // Use beneficiaryData if provided (new prop), otherwise fall back to editingBeneficiary (legacy)
  const dataToEdit = beneficiaryData || editingBeneficiary
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Toast state
  const [toasts, setToasts] = useState<
    Array<{
      id: string
      message: string
      type: 'success' | 'error'
      timestamp: number
    }>
  >([])

  const addBeneficiaryMutation = useSaveBuildPartnerBeneficiary()

  // Fetch full beneficiary data when in edit mode
  const { data: apiBeneficiaryData } = useBuildPartnerBeneficiaryById(
    mode === 'edit' && dataToEdit?.id ? dataToEdit.id : null
  )

  // Toast utility functions
  const addToast = (message: string, type: 'success' | 'error') => {
    const newToast = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: Date.now(),
    }
    setToasts((prev) => [...prev, newToast])

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id))
    }, 4000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  // Use props if available, otherwise fallback to static data
  const bankNames = propBankNames || [
    { id: 1, configId: 'SBI', configValue: 'SBI' },
    { id: 2, configId: 'HDFC', configValue: 'HDFC' },
    { id: 3, configId: 'ICICI', configValue: 'ICICI' },
    { id: 4, configId: 'Axis Bank', configValue: 'Axis Bank' },
  ]

  const beneficiaryTypes = propBeneficiaryTypes || [
    { id: 1, configId: 'Individual', configValue: 'Individual' },
    { id: 2, configId: 'Company', configValue: 'Company' },
  ]

  const dropdownsLoading = propDropdownsLoading || false
  const dropdownsError = propDropdownsError || null

  // Validation hooks
  const {
    isAccountValidating,
    accountValidationResult,
    accountValidationError,
    validateAccount,
    resetAccountValidation,
    isSwiftValidating,
    swiftValidationResult,
    swiftValidationError,
    validateSwift,
    resetSwiftValidation,
  } = useValidationStatus()

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<BeneficiaryFormData>({
    defaultValues: {
      bpbBeneficiaryId: dataToEdit?.bpbBeneficiaryId || '',
      bpbBeneficiaryType: dataToEdit?.bpbBeneficiaryType || '',
      bpbName: dataToEdit?.bpbName || '',
      bpbBankName: dataToEdit?.bpbBankName || '',
      bpbSwiftCode: dataToEdit?.bpbSwiftCode || '',
      bpbRoutingCode: dataToEdit?.bpbRoutingCode || '',
      bpbAccountNumber: dataToEdit?.bpbAccountNumber || '',
    },
    mode: 'onChange', // Enable real-time validation
  })

  // Reset form when editing beneficiary changes
  React.useEffect(() => {
    if (isOpen && mode === 'edit' && (apiBeneficiaryData || dataToEdit)) {
      // Use API data if available, otherwise use table data
      const dataToUse: any = apiBeneficiaryData || dataToEdit

      // Wait for dropdowns to load
      if (dropdownsLoading) {
        return
      }

      // Map display values back to IDs for editing
      const beneficiaryType = beneficiaryTypes.find(
        (type: unknown) =>
          (type as { configValue: string }).configValue ===
          dataToUse.bpbBeneficiaryType
      )
      const bankName = bankNames.find(
        (bank: unknown) =>
          (bank as { configValue: string }).configValue ===
          dataToUse.bpbBankName
      )

      reset({
        bpbBeneficiaryId: dataToUse.bpbBeneficiaryId || '',
        bpbBeneficiaryType:
          (beneficiaryType as { id?: string })?.id ||
          dataToUse.bpbBeneficiaryType ||
          '',
        bpbName: dataToUse.bpbName || '',
        bpbBankName:
          (bankName as { id?: string })?.id || dataToUse.bpbBankName || '',
        bpbSwiftCode: dataToUse.bpbSwiftCode || '',
        bpbRoutingCode: dataToUse.bpbRoutingCode || '',
        bpbAccountNumber: dataToUse.bpbAccountNumber || '',
      })
    } else if (!isOpen) {
      reset({
        bpbBeneficiaryId: '',
        bpbBeneficiaryType: '',
        bpbName: '',
        bpbBankName: '',
        bpbSwiftCode: '',
        bpbRoutingCode: '',
        bpbAccountNumber: '',
      })
    }
  }, [
    isOpen,
    mode,
    apiBeneficiaryData,
    dataToEdit,
    bankNames,
    beneficiaryTypes,
    dropdownsLoading,
    reset,
  ])

  // Watch for validation results and show toasts
  useEffect(() => {
    if (accountValidationResult) {
      if (accountValidationResult.isValid) {
        addToast(
          `Account validation successful: ${accountValidationResult.message}`,
          'success'
        )
      } else {
        addToast(
          `Account validation failed: ${accountValidationResult.message}`,
          'error'
        )
      }
    }
  }, [accountValidationResult])

  useEffect(() => {
    if (swiftValidationResult) {
      if (swiftValidationResult.isValid) {
        addToast(
          `SWIFT/BIC validation successful: ${swiftValidationResult.message}`,
          'success'
        )
      } else {
        addToast(
          `SWIFT/BIC validation failed: ${swiftValidationResult.message}`,
          'error'
        )
      }
    }
  }, [swiftValidationResult])

  useEffect(() => {
    if (accountValidationError) {
      addToast(
        `Account validation error: ${accountValidationError.message}`,
        'error'
      )
    }
  }, [accountValidationError])

  useEffect(() => {
    if (swiftValidationError) {
      addToast(
        `SWIFT/BIC validation error: ${swiftValidationError.message}`,
        'error'
      )
    }
  }, [swiftValidationError  ])

  // Validation function using DeveloperStep5Schema
  const validateBeneficiaryField = (
    fieldName: string,
    _value: any,
    allValues: BeneficiaryFormData
  ) => {
    try {
      // Skip validation for dropdown fields since they come from backend
      const dropdownFields = ['bpbBeneficiaryType', 'bpbBankName']
      if (dropdownFields.includes(fieldName)) {
        return true
      }

      // Transform form data to match DeveloperStep5Schema format
      const beneficiaryForValidation = {
        beneficiaries: [{
          id: allValues.bpbBeneficiaryId,
          transferType: allValues.bpbBeneficiaryType,
          name: allValues.bpbName,
          bankName: allValues.bpbBankName,
          account: allValues.bpbAccountNumber,
          swiftCode: allValues.bpbSwiftCode,
          routingCode: allValues.bpbRoutingCode || '',
          buildPartnerDTO: {
            id: buildPartnerId ? parseInt(buildPartnerId) : undefined,
          },
        }]
      }

      // Validate using DeveloperStep5Schema
      const result = DeveloperStep5Schema.safeParse(beneficiaryForValidation)

      if (result.success) {
        return true
      } else {
        // Map form field names to schema field names
        const fieldMapping: Record<string, string> = {
          bpbBeneficiaryId: 'id',
          bpbBeneficiaryType: 'transferType',
          bpbName: 'name',
          bpbBankName: 'bankName',
          bpbAccountNumber: 'account',
          bpbSwiftCode: 'swiftCode',
          bpbRoutingCode: 'routingCode',
        }

        const schemaFieldName = fieldMapping[fieldName]
        if (!schemaFieldName) return true

        // Find the specific field error
        const fieldError = result.error.issues.find(
          (issue) =>
            issue.path.includes('beneficiaries') &&
            issue.path.includes(0) &&
            issue.path.includes(schemaFieldName)
        )

        return fieldError ? fieldError.message : true
      }
    } catch (error) {
      return true // Return true on error to avoid blocking the form
    }
  }

  const onSubmit = async (data: BeneficiaryFormData) => {
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
        // Get specific validation errors for text fields only
        const errors = []
        if (!data.bpbBeneficiaryId) errors.push('Beneficiary ID is required')
        if (!data.bpbBeneficiaryType) errors.push('Beneficiary Type is required')
        if (!data.bpbName) errors.push('Name is required')
        if (!data.bpbBankName) errors.push('Bank is required')
        if (!data.bpbAccountNumber) errors.push('Account Number is required')
        if (!data.bpbSwiftCode) errors.push('SWIFT Code is required')
        
        if (errors.length > 0) {
          setErrorMessage(`Please fill in the required fields: ${errors.join(', ')}`)
        }
        return
      }

      // Validate and sanitize form data
      const validatedData = validateAndSanitizeBeneficiaryData(data)

      const isEditing =
        mode === 'edit' && (dataToEdit?.id || (apiBeneficiaryData as any)?.id)
      const beneficiaryId = isEditing
        ? (apiBeneficiaryData as any)?.id || dataToEdit?.id
        : undefined

      let beneficiaryData: any

      if (isEditing && apiBeneficiaryData) {
        // For updates, use the complete API data structure and update only the changed fields
        beneficiaryData = {
          ...(apiBeneficiaryData as any), // Include all original fields
          bpbBeneficiaryId: validatedData.bpbBeneficiaryId,
          bpbBeneficiaryType: validatedData.bpbBeneficiaryType,
          bpbName: validatedData.bpbName,
          bpbBankName: validatedData.bpbBankName,
          bpbSwiftCode: validatedData.bpbSwiftCode,
          bpbRoutingCode: validatedData.bpbRoutingCode || '',
          bpbAccountNumber: validatedData.bpbAccountNumber,
          // Simplify buildPartnerDTO to just the ID
          buildPartnerDTO: [
            {
              id:
                (apiBeneficiaryData as any).buildPartnerDTO?.[0]?.id ||
                (buildPartnerId ? parseInt(buildPartnerId) : undefined),
            },
          ],
        }
      } else {
        // For new beneficiaries, use the standard structure
        beneficiaryData = {
          bpbBeneficiaryId: validatedData.bpbBeneficiaryId,
          bpbBeneficiaryType: validatedData.bpbBeneficiaryType,
          bpbName: validatedData.bpbName,
          bpbBankName: validatedData.bpbBankName,
          bpbSwiftCode: validatedData.bpbSwiftCode,
          bpbRoutingCode: validatedData.bpbRoutingCode || '',
          bpbAccountNumber: validatedData.bpbAccountNumber,
          enabled: true,
          buildPartnerDTO: [
            {
              id: buildPartnerId ? parseInt(buildPartnerId) : undefined,
            },
          ],
        }
      }

      // Debug: Log the payload being sent
      console.log('🔄 Beneficiary payload:', {
        isEditing,
        beneficiaryId,
        payload: beneficiaryData,
      })

      await addBeneficiaryMutation.mutateAsync({
        data: beneficiaryData,
        isEditing: isEditing,
        developerId: buildPartnerId,
        beneficiaryId: beneficiaryId,
      } as any)

      setSuccessMessage(
        isEditing
          ? 'Beneficiary updated successfully!'
          : 'Beneficiary added successfully!'
      )

      // Map IDs to display values for the callback
      const beneficiaryType = beneficiaryTypes.find(
        (type: unknown) =>
          (type as { id: string }).id === data.bpbBeneficiaryType
      )
      const bankName = bankNames.find(
        (bank: unknown) => (bank as { id: string }).id === data.bpbBankName
      )

      const beneficiaryForForm = {
        bpbBeneficiaryId: validatedData.bpbBeneficiaryId,
        bpbBeneficiaryType:
          (beneficiaryType as { configValue?: string })?.configValue ||
          String(data.bpbBeneficiaryType),
        bpbName: validatedData.bpbName,
        bpbBankName:
          (bankName as { configValue?: string })?.configValue ||
          String(data.bpbBankName),
        bpbSwiftCode: validatedData.bpbSwiftCode,
        bpbRoutingCode: validatedData.bpbRoutingCode || '',
        bpbAccountNumber: validatedData.bpbAccountNumber,
        enabled: true,
      }

      // Call appropriate callback based on mode
      if (
        mode === 'edit' &&
        onBeneficiaryUpdated &&
        beneficiaryIndex !== null &&
        beneficiaryIndex !== undefined
      ) {
        onBeneficiaryUpdated(beneficiaryForForm, beneficiaryIndex)
      } else if (onBeneficiaryAdded) {
        onBeneficiaryAdded(beneficiaryForForm)
      }

      // Reset form and close after a short delay
      setTimeout(() => {
        reset()
        onClose()
      }, 1500)
    } catch (error: unknown) {
      let errorMessage = 'Failed to add beneficiary. Please try again.'

      if (error instanceof Error) {
        // Handle validation errors
        if (error.message.includes('validation')) {
          errorMessage = 'Please check your input and try again.'
        } else {
          errorMessage = error.message
        }
      }

      setErrorMessage(errorMessage)
    }
  }

  const handleClose = () => {
    reset()
    setErrorMessage(null)
    setSuccessMessage(null)
    resetAccountValidation()
    resetSwiftValidation()
    onClose()
  }

  // Validation functions
  const handleValidateAccount = (accountNumber: string) => {
    if (!accountNumber.trim()) {
      setErrorMessage('Please enter an account number to validate')
      return
    }

    validateAccount({
      accountNumber: accountNumber.trim(),
    })
  }

  const handleValidateBIC = (swiftCode: string) => {
    if (!swiftCode.trim()) {
      setErrorMessage('Please enter a SWIFT/BIC code to validate')
      return
    }

    validateSwift({
      swiftCode: swiftCode.trim(),
    })
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
    name: keyof BeneficiaryFormData,
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
          validate: (value, formValues) => validateBeneficiaryField(name, value, formValues)
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label={label}
            fullWidth
            required={required}
            error={!!errors[name]}
            helperText={errors[name]?.message?.toString() || ''}
            InputLabelProps={{ sx: labelSx }}
            InputProps={{ sx: valueSx }}
            sx={errors[name] ? errorFieldStyles : commonFieldStyles}
          />
        )}
      />
    </Grid>
  )

  // New render function for API-driven dropdowns
  const renderApiSelectField = (
    name: keyof BeneficiaryFormData,
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
          validate: (value, formValues) => validateBeneficiaryField(name, value, formValues)
        }}
        defaultValue={''}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors[name]} required={required}>
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
                  {(option as { configValue?: string }).configValue}
                </MenuItem>
              ))}
            </Select>
            {errors[name] && (
              <FormHelperText error>
                {errors[name]?.message?.toString()}
              </FormHelperText>
            )}
          </FormControl>
        )}
      />
    </Grid>
  )

  const renderTextFieldWithButton = (
    name: keyof BeneficiaryFormData,
    label: string,
    buttonText: string,
    gridSize: number = 6,
    required = false
  ) => {
    const isAccountField = name === 'bpbAccountNumber'
    const isSwiftField = name === 'bpbSwiftCode'
    const isValidating = isAccountField
      ? isAccountValidating
      : isSwiftValidating
    const validationResult = isAccountField
      ? accountValidationResult
      : swiftValidationResult

    return (
      <Grid key={name} size={{ xs: 12, md: gridSize }}>
        <Controller
          name={name}
          control={control}
          defaultValue=""
          rules={{
            validate: (value, formValues) => validateBeneficiaryField(name, value, formValues)
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label={label}
              required={required}
              error={
                !!errors[name] ||
                !!(validationResult && !validationResult.isValid)
              }
              helperText={
                errors[name]?.message?.toString() ||
                (validationResult && !validationResult.isValid
                  ? validationResult.message
                  : '') ||
                (validationResult && validationResult.isValid
                  ? '✓ Valid'
                  : '') ||
                ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      disabled={
                        isValidating || !String(field.value || '').trim()
                      }
                      sx={{
                        color: validationResult?.isValid
                          ? '#059669'
                          : '#2563EB',
                        borderRadius: '24px',
                        textTransform: 'none',
                        background: validationResult?.isValid
                          ? '#D1FAE5'
                          : 'var(--UIColors-Blue-100, #DBEAFE)',
                        boxShadow: 'none',
                        '&:hover': {
                          background: validationResult?.isValid
                            ? '#A7F3D0'
                            : '#D0E3FF',
                          boxShadow: 'none',
                        },
                        '&:disabled': {
                          background: '#F3F4F6',
                          color: '#9CA3AF',
                        },
                        minWidth: '120px',
                        height: '36px',
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 500,
                        fontStyle: 'normal',
                        fontSize: '14px',
                        lineHeight: '24px',
                        letterSpacing: '0.5px',
                        verticalAlign: 'middle',
                      }}
                      onClick={() => {
                        const fieldValue = String(field.value || '')
                        if (isAccountField) {
                          handleValidateAccount(fieldValue)
                        } else if (isSwiftField) {
                          handleValidateBIC(fieldValue)
                        }
                      }}
                    >
                      {isValidating ? (
                        <CircularProgress size={16} sx={{ color: 'inherit' }} />
                      ) : validationResult?.isValid ? (
                        '✓ Valid'
                      ) : (
                        buttonText
                      )}
                    </Button>
                  </InputAdornment>
                ),
                sx: valueSx,
              }}
              InputLabelProps={{ sx: labelSx }}
              sx={
                errors[name] || (validationResult && !validationResult.isValid)
                  ? errorFieldStyles
                  : commonFieldStyles
              }
            />
          )}
        />
      </Grid>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
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
          {mode === 'edit'
            ? 'Edit Beneficiary Details'
            : 'Add Beneficiary Details'}
          <IconButton onClick={onClose}>
            <CancelOutlinedIcon />
          </IconButton>
        </DialogTitle>

        {/* Toast Notifications */}
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            maxWidth: 400,
          }}
        >
          {toasts.map((toast) => (
            <Box
              key={toast.id}
              sx={{
                backgroundColor:
                  toast.type === 'success' ? '#4caf50' : '#f44336',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minWidth: '300px',
                animation: 'slideInRight 0.3s ease-out',
              }}
            >
              <Typography variant="body2" sx={{ flex: 1 }}>
                {toast.message}
              </Typography>
              <IconButton
                size="small"
                onClick={() => removeToast(toast.id)}
                sx={{ color: 'white', ml: 1 }}
              >
                ×
              </IconButton>
            </Box>
          ))}
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            {/* Show error if dropdowns fail to load */}
            {dropdownsError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to load dropdown options. Please refresh the page.
              </Alert>
            )}

            <Grid container rowSpacing={4} columnSpacing={2} mt={3}>
              {title === 'Beneficiary' ? (
                <>
                  {renderTextField(
                    'bpbBeneficiaryId',
                    'Beneficiary ID',
                    '1234',
                    6,
                    true
                  )}
                  {renderApiSelectField(
                    'bpbBeneficiaryType',
                    'Beneficiary Type',
                    beneficiaryTypes.length > 0 ? beneficiaryTypes : [],
                    6,
                    true,
                    dropdownsLoading
                  )}
                </>
              ) : (
                <>
                  {renderApiSelectField(
                    'bpbBeneficiaryType',
                    'Beneficiary Type',
                    beneficiaryTypes.length > 0 ? beneficiaryTypes : [],
                    6,
                    true,
                    dropdownsLoading
                  )}
                  {renderTextField(
                    'bpbBeneficiaryId',
                    'Beneficiary ID',
                    '1234',
                    6,
                    true
                  )}
                </>
              )}

              {renderTextField('bpbName', 'Name', '', 6, true)}

              {title === 'Beneficiary' ? (
                <>
                  {renderApiSelectField(
                    'bpbBankName',
                    'Bank',
                    bankNames.length > 0 ? bankNames : [],
                    6,
                    true,
                    dropdownsLoading
                  )}
                </>
              ) : (
                <>{renderTextField('bpbBankName', 'Bank', 'SBI', 6, true)}</>
              )}

              {renderTextField(
                'bpbRoutingCode',
                'Routing Code',
                '',
                title === 'Beneficiary' ? 12 : 6,
                false
              )}
              {renderTextFieldWithButton(
                'bpbAccountNumber',
                'Account Number/IBAN',
                'Validate Account',
                12,
                true
              )}
              {renderTextFieldWithButton(
                'bpbSwiftCode',
                'Swift/BIC',
                'Validate BIC',
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
                  disabled={
                    addBeneficiaryMutation.isPending || dropdownsLoading
                  }
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 500,
                    fontStyle: 'normal',
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: 0,
                  }}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  type="submit"
                  disabled={
                    addBeneficiaryMutation.isPending || dropdownsLoading
                  }
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 500,
                    fontStyle: 'normal',
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: 0,
                    backgroundColor: '#2563EB',
                    color: '#fff',
                  }}
                >
                  {addBeneficiaryMutation.isPending
                    ? mode === 'edit'
                      ? 'Updating...'
                      : 'Adding...'
                    : mode === 'edit'
                      ? 'Update'
                      : 'Add'}
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
