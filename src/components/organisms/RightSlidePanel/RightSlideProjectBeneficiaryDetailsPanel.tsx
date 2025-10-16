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
  Alert,
  Snackbar,
} from '@mui/material'
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useSaveProjectIndividualBeneficiary, useUpdateProjectIndividualBeneficiary } from '@/hooks/useProjects'
import { useValidationStatus } from '@/hooks/useValidation'
import { useProjectLabels } from '@/hooks/useProjectLabels'
import { 
  projectBeneficiaryFormValidationSchema,
  type ProjectBeneficiaryFormData
} from '@/lib/validation/projectBeneficiary.schema'

interface RightSlidePanelProps {
  isOpen: boolean
  onClose: () => void
  onBeneficiaryAdded?: (beneficiary: any) => void
  title?: string
  editingBeneficiary?: any
  bankNames?: unknown[]
  beneficiaryTypes?: unknown[]
  projectId?: string
  buildPartnerId?: string
  dropdownsLoading?: boolean
  dropdownsError?: unknown
}

export const RightSlideProjectBeneficiaryDetailsPanel: React.FC<
  RightSlidePanelProps
> = ({
  isOpen,
  onClose,
  onBeneficiaryAdded,
  editingBeneficiary,
  bankNames: propBankNames,
  beneficiaryTypes: propBeneficiaryTypes,
  projectId,
  dropdownsLoading: propDropdownsLoading,
  dropdownsError: propDropdownsError,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [toasts, setToasts] = useState<
    Array<{
      id: string
      message: string
      type: 'success' | 'error'
      timestamp: number
    }>
  >([])

  const addBeneficiaryMutation = useSaveProjectIndividualBeneficiary()
  const updateBeneficiaryMutation = useUpdateProjectIndividualBeneficiary()

 
  const { getLabel } = useProjectLabels()


  const addToast = (message: string, type: 'success' | 'error') => {
    const newToast = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: Date.now(),
    }
    setToasts((prev) => [...prev, newToast])

   
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id))
    }, 4000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

 
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

 
  const {
    accountValidationResult,
    accountValidationError,
    resetAccountValidation,
    swiftValidationResult,
    swiftValidationError,
    resetSwiftValidation,
  } = useValidationStatus()

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<ProjectBeneficiaryFormData>({
    resolver: zodResolver(projectBeneficiaryFormValidationSchema),
    mode: 'onChange', // Validate on every change
    defaultValues: {
      reaBeneficiaryId: editingBeneficiary?.reaBeneficiaryId || '',
      reaBeneficiaryType: editingBeneficiary?.reaBeneficiaryType || '',
      reaName: editingBeneficiary?.reaName || '',
      reaBankName: editingBeneficiary?.reaBankName || '',
      reaSwiftCode: editingBeneficiary?.reaSwiftCode || '',
      reaRoutingCode: editingBeneficiary?.reaRoutingCode || '',
      reaAccountNumber: editingBeneficiary?.reaAccountNumber || '',
    },
  })

  // Reset form when editing beneficiary changes
  React.useEffect(() => {
    if (editingBeneficiary) {
      // Map display values back to IDs for editing
      const beneficiaryType = beneficiaryTypes.find(
        (type: unknown) =>
          (type as { configValue: string }).configValue ===
          editingBeneficiary.reaBeneficiaryType
      )
      const bankName = bankNames.find(
        (bank: unknown) =>
          (bank as { configValue: string }).configValue ===
          editingBeneficiary.reaBankName
      )

      reset({
        reaBeneficiaryId: editingBeneficiary.reaBeneficiaryId || '',
        reaBeneficiaryType:
          (beneficiaryType as { id?: string })?.id?.toString() ||
          editingBeneficiary.reaBeneficiaryType ||
          '',
        reaName: editingBeneficiary.reaName || '',
        reaBankName:
          (bankName as { id?: string })?.id?.toString() ||
          editingBeneficiary.reaBankName ||
          '',
        reaSwiftCode: editingBeneficiary.reaSwiftCode || '',
        reaRoutingCode: editingBeneficiary.reaRoutingCode || '',
        reaAccountNumber: editingBeneficiary.reaAccountNumber || '',
      })
    } else {
      reset({
        reaBeneficiaryId: '',
        reaBeneficiaryType: '',
        reaName: '',
        reaBankName: '',
        reaSwiftCode: '',
        reaRoutingCode: '',
        reaAccountNumber: '',
      })
    }
  }, [editingBeneficiary, reset])

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
  }, [swiftValidationError])

  const onSubmit = async (data: ProjectBeneficiaryFormData) => {
    
    try {
      setErrorMessage(null)
      setSuccessMessage(null)

      // Trigger validation to highlight required fields
      const isValid = await trigger()
      
      if (!isValid) {
        return
      }

      const beneficiaryData = {
        // Include ID for updates
        ...(editingBeneficiary?.id && { id: parseInt(editingBeneficiary.id.toString()) }),
        reabBeneficiaryId: data.reaBeneficiaryId,
        reabTranferTypeDTO: {
          id: parseInt(data.reaBeneficiaryType.toString()) || 0,
        },
        reabName: data.reaName,
        reabBank: 
          data.reaBankName,
        reabSwift: data.reaSwiftCode,
        reabRoutingCode: data.reaRoutingCode,
        reabBeneAccount: data.reaAccountNumber,
        realEstateAssestDTO: [ {
          id: projectId ? parseInt(projectId) : undefined,
        }
          
      ],
      }

      if (editingBeneficiary?.id) {
        // Update existing beneficiary using PUT
        await updateBeneficiaryMutation.mutateAsync({ 
          id: editingBeneficiary.id.toString(), 
          beneficiaryData 
        })
        setSuccessMessage('Beneficiary updated successfully!')
      } else {
        // Add new beneficiary using POST
        await addBeneficiaryMutation.mutateAsync(beneficiaryData)
        setSuccessMessage('Beneficiary added successfully!')
      }

      if (onBeneficiaryAdded) {
      
        const beneficiaryTypeLabel =
          (beneficiaryTypes.find(
            (type: unknown) =>
              (type as { id: string }).id === data.reaBeneficiaryType
          ) as { configValue: string })?.configValue || `Type ${data.reaBeneficiaryType}`
        const bankNameLabel =
          (bankNames.find(
            (bank: unknown) =>
              (bank as { id: string }).id === data.reaBankName.toString()
          ) as { configValue: string })?.configValue || `Bank ${data.reaBankName}`

        const beneficiaryForForm = {
          // Map to table column names with display labels
          reaBeneficiaryId: data.reaBeneficiaryId,
          reaBeneficiaryType: beneficiaryTypeLabel,
          reaName: data.reaName,
          reaBankName: bankNameLabel,
          reaSwiftCode: data.reaSwiftCode,
          reaRoutingCode: data.reaRoutingCode,
          reaAccountNumber: data.reaAccountNumber,
          // Keep original fields for reference
          reaBeneficiaryTypeId: data.reaBeneficiaryType,
          reaBankNameId: data.reaBankName,
          realEstateAssetDTO: {
            id: projectId ? parseInt(projectId) : undefined,
          },
        }

        onBeneficiaryAdded(beneficiaryForForm)
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
          : 'Failed to add beneficiary. Please try again.'
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
    name: keyof ProjectBeneficiaryFormData,
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

  const renderSelectField = (
    name: keyof ProjectBeneficiaryFormData,
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
              label={loading ? `Loading...` : label}
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
          {getLabel('CDL_BPA_ADD_BENEFICIARY_DETAILS', 'Add Project Beneficiary Details')}
          <IconButton onClick={handleClose}>
            <CancelOutlinedIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={(e) => {
          
          handleSubmit(onSubmit)(e)
        }}>
          <DialogContent dividers>
            {/* Show error if dropdowns fail to load */}
            {dropdownsError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to load dropdown options. Please refresh the page.
              </Alert>
            )}

            <Grid container rowSpacing={4} columnSpacing={2} mt={3}>
              {renderTextField(
                'reaBeneficiaryId',
                getLabel('CDL_BPA_BENEFICIARY_ID', 'Beneficiary ID'),
                '',
                6,
                true, // Required
                16 // Max length
              )}
              {renderSelectField(
                'reaBeneficiaryType',
                getLabel('CDL_BPA_TRANSFER_TYPE', 'Transfer Type'),
                beneficiaryTypes,
                6,
                true, // Required
                dropdownsLoading
              )}
              {renderTextField(
                'reaName', 
                getLabel('CDL_BPA_BENEFICIARY_NAME', 'Beneficiary Name'), 
                '', 
                12, 
                true, // Required
                35 // Max length
              )}
              {renderSelectField(
                'reaBankName',
                getLabel('CDL_BPA_BENEFICIARY_BANK', 'Beneficiary Bank'),
                bankNames,
                6,
                true, // Required
                dropdownsLoading
              )}
              {renderTextField(
                'reaSwiftCode', 
                getLabel('CDL_BPA_SWIFT_CODE', 'SWIFT Code'), 
                '', 
                6, 
                true // Required
              )}
              {renderTextField(
                'reaRoutingCode', 
                getLabel('CDL_BPA_ROUTING_CODE', 'Routing Code'), 
                '', 
                6, 
                true, // Required
                10 // Max length
              )}
              {renderTextField(
                'reaAccountNumber',
                getLabel('CDL_BPA_ACCOUNT_NUMBER', 'Account Number/IBAN'),
                '',
                6,
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
                  disabled={
                    addBeneficiaryMutation.isPending || updateBeneficiaryMutation.isPending || dropdownsLoading
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
                  {getLabel('CDL_BPA_CANCEL', 'Cancel')}
                </Button>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  type="submit"
                  disabled={
                    addBeneficiaryMutation.isPending || updateBeneficiaryMutation.isPending || dropdownsLoading
                  }
                  onClick={() => {
                    
                  }}
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
                  {(addBeneficiaryMutation.isPending || updateBeneficiaryMutation.isPending)
                    ? (editingBeneficiary?.id ? getLabel('CDL_BPA_UPDATING', 'Updating...') : getLabel('CDL_BPA_ADDING', 'Adding...'))
                    : (editingBeneficiary?.id ? getLabel('CDL_BPA_UPDATE', 'Update') : getLabel('CDL_BPA_ADD', 'Add'))
                  }
                </Button>
              </Grid>
            </Grid>
          </Box>
        </form>

        {/* Toast Notifications */}
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {toasts.map((toast) => (
            <Alert
              key={toast.id}
              severity={toast.type}
              onClose={() => removeToast(toast.id)}
              sx={{
                minWidth: 300,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
            >
              {toast.message}
            </Alert>
          ))}
        </Box>

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
