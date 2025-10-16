'use client'

import React, { useState } from 'react'
import {
  Box,
  TextField,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AccountData } from '../types'
import { Controller, useFormContext } from 'react-hook-form'
import { useProjectLabels } from '@/hooks/useProjectLabels'
import { useCurrencies } from '@/hooks/useFeeDropdowns'
import {
  useValidateBankAccount,
  useSaveMultipleBankAccounts,
} from '@/hooks/useBankAccount'
import { BankAccountData } from '@/types/bankAccount'
import dayjs from 'dayjs'
import {
  commonFieldStyles,
  datePickerStyles,
  errorFieldStyles,
  labelSx,
  valueSx,
  cardStyles,
  calendarIconSx,
} from '../styles'
import {
  ACCOUNT_TYPES,
  ACCOUNT_LABELS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../constants'
import { validateAccountField } from '../validation/accountZodSchema'

interface Step2Props {
  accounts: AccountData[]
  onAccountsChange: (accounts: AccountData[]) => void
  projectId?: string
  isViewMode?: boolean
}

const Step2: React.FC<Step2Props> = ({ projectId, isViewMode = false }) => {
  
  const { getLabel } = useProjectLabels()

  const {
    data: currencies = [],
    isLoading: currenciesLoading,
    error: currenciesError,
  } = useCurrencies()

  const validateBankAccount = useValidateBankAccount()
  const saveMultipleBankAccounts = useSaveMultipleBankAccounts()

  const { control, watch, setValue, formState: { errors } } = useFormContext<{
    accounts: AccountData[]
    // Account validation fields
    trustAccountNumber?: string
    trustAccountIban?: string
    trustAccountOpenedDate?: any
    trustAccountTitle?: string
    retentionAccountNumber?: string
    retentionAccountIban?: string
    retentionAccountOpenedDate?: any
    retentionAccountTitle?: string
    subConstructionAccountNumber?: string
    subConstructionAccountIban?: string
    subConstructionAccountOpenedDate?: any
    subConstructionAccountTitle?: string
    corporateAccountNumber?: string
    corporateAccountIban?: string
    corporateAccountOpenedDate?: any
    corporateAccountTitle?: string
    accountCurrency?: string
  }>()

  const [errorIndex, setErrorIndex] = useState<number | null>(null)
  const [successIndexes, setSuccessIndexes] = useState<number[]>([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'error'
  )
  const [validatedAccounts, setValidatedAccounts] = useState<BankAccountData[]>(
    []
  )
  const [validatingIndex, setValidatingIndex] = useState<number | null>(null)

  const validateAccount = async (account: AccountData, index: number) => {
    if (!account.trustAccountNumber) {
      setErrorIndex(index)
      setSuccessIndexes(prev => prev.filter(i => i !== index))
      setSnackbarMessage('Account number is required for validation')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
      return false
    }

    try {
      setValidatingIndex(index)
      setErrorIndex(null)
      const validationResponse = await validateBankAccount.mutateAsync(
        account.trustAccountNumber
      )

      const dateOpened = dayjs.unix(
        validationResponse.details.lastStatementDate / 1000
      )

      const accountType = ACCOUNT_TYPES[index] || 'TRUST'

     
 
      const bankAccountData: BankAccountData = {
        accountType: accountType,
        accountNumber: validationResponse.accountNumber,
        ibanNumber: validationResponse.details.iban,
        dateOpened: dateOpened.format('YYYY-MM-DD'),
        accountTitle: validationResponse.name,
        currencyCode: validationResponse.currencyCode,
        isValidated: true,
        realEstateAssestDTO: {
          id: projectId ? parseInt(projectId) : 9007199254740991, // Use project ID from Step 1, fallback to default
        },
      }

      // Add to validated accounts array
      setValidatedAccounts((prev) => {
        const newAccounts = [...prev]
        newAccounts[index] = bankAccountData
        return newAccounts
      })

   

      setValue(`accounts.${index}.ibanNumber`, validationResponse.details.iban)
      setValue(`accounts.${index}.dateOpened`, dateOpened)
      setValue(`accounts.${index}.accountTitle`, validationResponse.name)
      setValue(`accounts.${index}.currency`, validationResponse.currencyCode)

      setSuccessIndexes(prev => [...prev.filter(i => i !== index), index])
      setSnackbarMessage(SUCCESS_MESSAGES.STEP_SAVED)
      setSnackbarSeverity('success')
      setSnackbarOpen(true)

      return true
    } catch (error) {
      setErrorIndex(index)
     
      setSuccessIndexes(prev => prev.filter(i => i !== index))
      setSnackbarMessage(ERROR_MESSAGES.VALIDATION_FAILED)
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
      return false
    } finally {
      setValidatingIndex(null)
    }
  }

  // Function to save all validated accounts
  const saveAllValidatedAccounts = async () => {
    const accountsToSave = validatedAccounts.filter(
      (account) => account && account.isValidated
    )

    if (accountsToSave.length === 0) {
      setSnackbarMessage(ERROR_MESSAGES.NO_VALIDATED_ACCOUNTS)
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
      return false
    }

    try {
      await saveMultipleBankAccounts.mutateAsync(accountsToSave)
      setSnackbarMessage(SUCCESS_MESSAGES.ACCOUNTS_SAVED)
      setSnackbarSeverity('success')
      setSnackbarOpen(true)
      return true
    } catch (error) {
      setSnackbarMessage(ERROR_MESSAGES.ACCOUNT_SAVE_FAILED)
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
      return false
    }
  }

  React.useEffect(() => {
    ;(window as any).saveStep2Accounts = saveAllValidatedAccounts
    ;(window as any).step2ValidatedAccounts = validatedAccounts
  }, [validatedAccounts])

  const StyledCalendarIcon = (
    props: React.ComponentProps<typeof CalendarTodayOutlinedIcon>
  ) => <CalendarTodayOutlinedIcon {...props} sx={calendarIconSx} />

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={cardStyles}>
        <CardContent>
          {/* Show error if currencies fail to load */}
          {currenciesError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load currency options. Please refresh the page.
            </Alert>
          )}

          {/* Show info if using fallback currencies */}
          {!currenciesLoading &&
            !currenciesError &&
            currencies.length === 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Using default currency options. API data not available.
              </Alert>
            )}

          {ACCOUNT_LABELS.map((_, index) => {
            return (
              <Box key={index} mb={4}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name={`accounts.${index}.trustAccountNumber`}
                      control={control}
                      defaultValue=""
                      rules={{
                        validate: (value: any) => validateAccountField('trustAccountNumber', value)
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          disabled={isViewMode}
                          required={index === 0 || index === 1} 
                          label={getLabel('CDL_BPA_ACC_NO', index === 0 ? 'Trust Account Number' : index === 1 ? 'Retention Account Number' : index === 2 ? 'Sub Construction Account Number' : 'Corporate Account Number')}
                          error={!!errors.accounts?.[index]?.trustAccountNumber}
                          helperText={(errors.accounts?.[index]?.trustAccountNumber?.message as string) || 'Manual entry - Numerical only (max 15 digits)'}
                          inputProps={{ maxLength: 15 }}
                          InputLabelProps={{ sx: labelSx }}
                          InputProps={{ sx: valueSx }}
                          sx={errors.accounts?.[index]?.trustAccountNumber ? errorFieldStyles : commonFieldStyles}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name={`accounts.${index}.ibanNumber`}
                      control={control}
                      defaultValue=""
                      rules={{
                        validate: (value: any) => validateAccountField('trustAccountIban', value)
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          disabled={isViewMode}
                          required={index === 0 || index === 1} // Required for Trust and Retention
                          label={getLabel('CDL_BPA_ACC_IBAN', 'IBAN Number')}
                          error={!!errors.accounts?.[index]?.ibanNumber}
                          helperText={(errors.accounts?.[index]?.ibanNumber?.message as string) || 'Fetched from core banking'}
                          inputProps={{ maxLength: 25 }}
                          InputLabelProps={{ sx: labelSx }}
                          InputProps={{ sx: valueSx }}
                          sx={errors.accounts?.[index]?.ibanNumber ? errorFieldStyles : commonFieldStyles}
                        />
                      )}
                    />
                  </Grid>

                  {/* Date Opened */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Controller
                      name={`accounts.${index}.dateOpened`}
                      control={control}
                      defaultValue={null}
                      rules={{
                        validate: (value: any) => validateAccountField('trustAccountOpenedDate', value)
                      }}
                      render={({ field }) => (
                        <DatePicker
                          disabled={isViewMode}
                          label={getLabel('CDL_BPA_ACC_OPENDATE', 'Date Opened')}
                          value={field.value}
                          onChange={field.onChange}
                          format="DD/MM/YYYY"
                          slots={{
                            openPickerIcon: StyledCalendarIcon,
                          }}
                          slotProps={{
                            textField: {
                              required: index === 0 || index === 1, // Required for Trust and Retention
                              fullWidth: true,
                              error: !!errors.accounts?.[index]?.dateOpened,
                              helperText: (errors.accounts?.[index]?.dateOpened?.message as string) || 'Fetched from core banking',
                              sx: errors.accounts?.[index]?.dateOpened ? errorFieldStyles : datePickerStyles,
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

                  {/* Account Title */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Controller
                      name={`accounts.${index}.accountTitle`}
                      control={control}
                      defaultValue=""
                      rules={{
                        validate: (value: any) => validateAccountField('trustAccountTitle', value)
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          disabled={isViewMode}
                          required={index === 0 || index === 1} 
                          label={getLabel('CDL_BPA_ACC_NAME', 'Account Title')}
                          error={!!errors.accounts?.[index]?.accountTitle}
                          helperText={(errors.accounts?.[index]?.accountTitle?.message as string) || 'Fetched from core banking'}
                          inputProps={{ maxLength: 100 }}
                          InputLabelProps={{ sx: labelSx }}
                          InputProps={{ sx: valueSx }}
                          sx={errors.accounts?.[index]?.accountTitle ? errorFieldStyles : commonFieldStyles}
                        />
                      )}
                    />
                  </Grid>

                  {/* Currency + Validate */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box display="flex" alignItems="center">
                      <Controller
                        name={`accounts.${index}.currency`}
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value: any) => validateAccountField('accountCurrency', value)
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            disabled={isViewMode}
                            required={index === 0 || index === 1}
                            label={
                              currenciesLoading
                                ? 'Loading...'
                                : getLabel('CDL_BPA_ACC_CUR', 'Account Currency')
                            }
                            placeholder="Enter currency code"
                            error={!!errors.accounts?.[index]?.currency}
                            helperText={errors.accounts?.[index]?.currency?.message}
                            InputLabelProps={{ sx: labelSx }}
                            InputProps={{ sx: valueSx }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                },
                              },
                            }}
                          />
                        )}
                      />
                      <Button
                        variant="contained"
                        startIcon={
                          errorIndex === index ? (
                            <HighlightOffOutlinedIcon
                              sx={{ fontSize: 20, mt: '1px' }}
                            />
                          ) : successIndexes.includes(index) ? (
                            <VerifiedOutlinedIcon
                              sx={{ fontSize: 20, mt: '1px' }}
                            />
                          ) : null
                        }
                        sx={{
                          ml: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                          textTransform: 'none',
                          boxShadow: 'none',

                          fontFamily: 'Outfit, sans-serif',
                          fontWeight: 500,
                          fontStyle: 'normal',
                          fontSize: '14px',
                          lineHeight: '20px',
                          letterSpacing: '0px',

                          backgroundColor:
                            errorIndex === index
                              ? '#FEE2E2'
                              : successIndexes.includes(index)
                                ? '#D1FAE5'
                                : '#E6F0FF',
                          color:
                            errorIndex === index
                              ? '#EF4444'
                              : successIndexes.includes(index)
                                ? '#059669'
                                : '#2563EB',
                          minWidth: '120px',
                          height: '40px',
                          '& .MuiButton-startIcon': {
                            marginRight: '8px',
                          },
                          '&:hover': {
                            backgroundColor:
                              errorIndex === index
                                ? '#FECACA'
                                : successIndexes.includes(index)
                                  ? '#A7F3D0'
                                  : '#D0E3FF',
                          },
                        }}
                        onClick={() =>
                          validateAccount(watch(`accounts.${index}`), index)
                        }
                        disabled={isViewMode || validatingIndex === index}
                      >
                        {validatingIndex === index
                          ? 'Validating...'
                          : errorIndex === index
                            ? 'Invalidate'
                            : successIndexes.includes(index)
                              ? 'Validated'
                              : 'Validate'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>

                {index < ACCOUNT_LABELS.length - 1 && (
                  <Divider sx={{ my: 3, mt: 4, mb: 4 }} />
                )}
              </Box>
            )
          })}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%', fontFamily: 'Outfit, sans-serif' }}
          iconMapping={{
            success: <span style={{ fontSize: '1.2rem' }}></span>,
            error: <span style={{ fontSize: '1.2rem' }}></span>,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  )
}

export default Step2
