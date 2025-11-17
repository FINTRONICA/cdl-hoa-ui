'use client'

import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react'
import { investorIdService } from '../../../../services/api/investorIdService'
import { capitalPartnerService } from '../../../../services/api/capitalPartnerService'
import { useGetEnhanced } from '@/hooks/useApiEnhanced'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { CapitalPartnerResponse } from '@/types/capitalPartner'
import {
  mapStep1ToCapitalPartnerPayload,
  type Step1FormData,
} from '../../../../utils/capitalPartnerMapper'
import { Refresh as RefreshIcon } from '@mui/icons-material'
import {
  useInvestorTypes,
  useInvestorIdTypes,
  useCountries,
} from '../../../../hooks/useApplicationSettings1'
import { useCapitalPartnerLabelsApi } from '@/hooks/useCapitalPartnerLabelsApi'
import { useAppStore } from '@/store'

import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { Controller, useFormContext } from 'react-hook-form'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { CapitalPartnerStep1Schema } from '@/lib/validation'

interface Step1Props {
  onSaveAndNext?: (data: any) => void
  isEditMode?: boolean
  ownerRegistryId?: number | null
  isViewMode?: boolean
}

export interface Step1Ref {
  handleSaveAndNext: () => Promise<void>
}

const Step1 = forwardRef<Step1Ref, Step1Props>(
  (
    { onSaveAndNext, isEditMode, ownerRegistryId, isViewMode = false },
    ref
  ) => {
    const {
      control,
      watch,
      setValue,
      trigger,
      formState: { errors },
      setError,
      clearErrors,
    } = useFormContext()

    // Get labels from API
    const { getLabel } = useCapitalPartnerLabelsApi()
    const currentLanguage = useAppStore((state) => state.language)

    const [investorId, setInvestorId] = useState<string>('')
    const [isGeneratingId, setIsGeneratingId] = useState<boolean>(false)
    const {
      data: investorTypes,
      loading: loadingInvestorTypes,
      error: investorTypesError,
    } = useInvestorTypes()
    const {
      data: idTypes,
      loading: loadingIdTypes,
      error: idTypesError,
    } = useInvestorIdTypes()
    const {
      data: countries,
      loading: loadingCountries,
      error: countriesError,
    } = useCountries()

    // Load existing data when in edit mode
    const {
      data: existingCapitalPartnerData,
      isLoading: isLoadingExistingData,
    } = useGetEnhanced<CapitalPartnerResponse>(
      API_ENDPOINTS.OWNER_REGISTRY.GET_BY_ID(
        (ownerRegistryId || 0).toString()
      ),
      {},
      {
        enabled: Boolean(isEditMode && ownerRegistryId),
        // Disable caching to always fetch fresh data
        gcTime: 0,
        staleTime: 0,
        // Always refetch when component mounts
        refetchOnMount: 'always',
        refetchOnWindowFocus: false,
      }
    )

    // Pre-populate form when existing data is loaded
    useEffect(() => {
      if (isEditMode && existingCapitalPartnerData && !isLoadingExistingData) {
        setValue(
          'investorType',
          existingCapitalPartnerData.investorTypeDTO?.settingValue || ''
        )
        setValue(
          'investorId',
          existingCapitalPartnerData.ownerRegistryId || ''
        )
        setValue(
          'investorFirstName',
          existingCapitalPartnerData.ownerRegistryName || ''
        )
        setValue(
          'investorMiddleName',
          existingCapitalPartnerData.ownerRegistryMiddleName || ''
        )
        setValue(
          'investorLastName',
          existingCapitalPartnerData.ownerRegistryLastName || ''
        )
        setValue(
          'arabicName',
          existingCapitalPartnerData.ownerRegistryLocaleName || ''
        )
        setValue(
          'ownership',
          existingCapitalPartnerData.ownerRegistryOwnershipPercentage?.toString() ||
            ''
        )
        setValue(
          'investorIdType',
          existingCapitalPartnerData.documentTypeDTO?.settingValue || ''
        )
        setValue(
          'idNumber',
          existingCapitalPartnerData.ownerRegistryIdNo || ''
        )
        setValue(
          'idExpiryDate',
          existingCapitalPartnerData.idExpiaryDate
            ? dayjs(existingCapitalPartnerData.idExpiaryDate)
            : null
        )
        setValue(
          'nationality',
          existingCapitalPartnerData.countryOptionDTO?.settingValue || ''
        )
        setValue(
          'accountContact',
          existingCapitalPartnerData.ownerRegistryTelephoneNo || ''
        )
        setValue(
          'mobileNumber',
          existingCapitalPartnerData.ownerRegistryMobileNo || ''
        )
        setValue('email', existingCapitalPartnerData.ownerRegistryEmail || '')

        // Set investorId state for the UI
        const ownerRegistryIdValue = existingCapitalPartnerData.ownerRegistryId || ''
        setInvestorId(ownerRegistryIdValue)
        setValue('investorId', ownerRegistryIdValue)
      }
    }, [
      existingCapitalPartnerData,
      isLoadingExistingData,
      isEditMode,
      setValue,
    ])

    React.useEffect(() => {
      const currentId = watch('investorId')
      if (currentId && currentId !== investorId) {
        setInvestorId(currentId)
      }
    }, [watch, investorId])
    const handleGenerateNewId = async () => {
      try {
        setIsGeneratingId(true)
        const newIdResponse = investorIdService.generateNewId()
        setInvestorId(newIdResponse.id)
        // Update RHF state and re-validate so any prior error clears immediately
        setValue('investorId', newIdResponse.id, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        })
        await trigger('investorId')
      } catch (error) {
      } finally {
        setIsGeneratingId(false)
      }
    }
    const handleSaveAndNext = async () => {
      try {

        // Build current form data for schema validation and payload mapping
        const formData: Step1FormData = {
          investorType: watch('investorType'),
          investorId: watch('investorId'),
          investorFirstName: watch('investorFirstName'),
          investorMiddleName: watch('investorMiddleName'),
          investorLastName: watch('investorLastName'),
          arabicName: watch('arabicName'),
          ownership: watch('ownership'),
          investorIdType: watch('investorIdType'),
          idNumber: watch('idNumber'),
          idExpiryDate: watch('idExpiryDate'),
          nationality: watch('nationality'),
          accountContact: watch('accountContact'),
          mobileNumber: watch('mobileNumber'),
          email: watch('email'),
        }

        // First, trigger React Hook Form validation to show field-level errors
        const fieldsToValidate = [
          'investorType',
          'investorId',
          'investorFirstName',
          'investorIdType',
          'idNumber',
        ] as const
        
        // Trigger validation for all required fields
        const isValid = await trigger(fieldsToValidate as unknown as any[])
        
        // Validate with Zod to get specific error messages
        const zodResult = CapitalPartnerStep1Schema.safeParse(formData)
        
        if (!isValid || !zodResult.success) {
          // Clear existing errors first
          clearErrors(fieldsToValidate as unknown as any)
          
          // Set errors from Zod validation for better error messages
          if (!zodResult.success) {
            zodResult.error.issues.forEach((issue) => {
              const field = (issue.path?.[0] as string) || ''
              if (field) {
                setError(field as any, {
                  type: 'manual',
                  message: issue.message,
                })
              }
            })
          }
          
          // Also trigger validation again to show React Hook Form errors
          await trigger(fieldsToValidate as unknown as any[])
          
          // Scroll to first error field to make it visible
          if (!zodResult.success && zodResult.error.issues.length > 0) {
            const firstError = zodResult.error.issues[0]
            if (firstError) {
              const firstErrorField = (firstError.path?.[0] as string) || ''
              if (firstErrorField) {
              // Try to find the field element by name or ID
              const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement
              if (element) {
                setTimeout(() => {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  element.focus()
                }, 100)
              }
              }
            }
          }
          
          // Throw error to prevent navigation and show error message
          throw new Error('Please fill all required fields correctly')
        }
        
        // Final validation trigger to ensure all errors are cleared
        await trigger()

        const payload = mapStep1ToCapitalPartnerPayload(
          formData,
          investorTypes,
          idTypes,
          countries
        )
        let response
        if (isEditMode && ownerRegistryId) {
          const updatePayload = {
            ...payload,
            id: ownerRegistryId,
          }

          if (existingCapitalPartnerData) {
            updatePayload.ownerRegistryUnitDTO =
              existingCapitalPartnerData.ownerRegistryUnitDTO

            updatePayload.ownerRegistryBankInfoDTOS =
              existingCapitalPartnerData.ownerRegistryBankInfoDTOS

            if (existingCapitalPartnerData.taskStatusDTO?.id) {
              updatePayload.taskStatusDTO = {
                id: existingCapitalPartnerData.taskStatusDTO.id,
              }
            }

            updatePayload.deleted = existingCapitalPartnerData.deleted ?? false
            updatePayload.enabled =
              (existingCapitalPartnerData as any).enabled ?? true
          }

          response = await capitalPartnerService.updateCapitalPartner(
            ownerRegistryId,
            updatePayload
          )
        } else {
          // Create new capital partner
          response = await capitalPartnerService.createCapitalPartner(payload)
        }

        if (onSaveAndNext) {
          onSaveAndNext(response)
        }
      } catch (error) {
        throw error
      }
    }
    useImperativeHandle(
      ref,
      () => ({
        handleSaveAndNext,
      }),
      [handleSaveAndNext]
    )
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
      },
    }

    const getLabelSx = () => ({
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
      '&.MuiFormLabel-filled': {
        color: '#374151',
      },
    })

    const valueSx = {
      color: '#1E2939',
      fontFamily: 'Outfit',
      fontWeight: 400,
      fontStyle: 'normal',
      fontSize: '14px',
      letterSpacing: 0,
      wordBreak: 'break-word',
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
      configId: string,
      fallbackLabel: string,
      defaultValue = '',
      required = false
    ) => {
      const label = getLabel(configId, currentLanguage, fallbackLabel)
      return (
        <Grid key={name} size={{ xs: 12, md: 6 }}>
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
              <>
                <TextField
                  {...field}
                  label={label}
                  fullWidth
                  required={required}
                  disabled={isViewMode}
                  error={!!errors[name] && !isViewMode}
                  helperText={errors[name]?.message as string}
                  InputLabelProps={{
                    sx: {
                      ...getLabelSx(),
                      ...(!!errors[name] &&
                        !isViewMode && {
                          color: '#d32f2f',
                          '&.Mui-focused': { color: '#d32f2f' },
                          '&.MuiFormLabel-filled': { color: '#d32f2f' },
                        }),
                    },
                  }}
                  InputProps={{
                    sx: {
                      ...valueSx,
                      ...(isViewMode && {
                        backgroundColor: '#F9FAFB',
                        color: '#6B7280',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#E5E7EB',
                        },
                      }),
                    },
                  }}
                  sx={{
                    ...commonFieldStyles,
                    ...(isViewMode && {
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#E5E7EB' },
                        '&:hover fieldset': { borderColor: '#E5E7EB' },
                        '&.Mui-focused fieldset': { borderColor: '#E5E7EB' },
                      },
                    }),
                    ...(!!errors[name] &&
                      !isViewMode && {
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#d32f2f',
                            borderWidth: '1px',
                          },
                          '&:hover fieldset': {
                            borderColor: '#d32f2f',
                            borderWidth: '1px',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#d32f2f',
                            borderWidth: '1px',
                          },
                        },
                      }),
                  }}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e)
                    if (errors[name]) {
                      clearErrors(name as any)
                    }
                    trigger(name as any)
                  }}
                  onBlur={() => {
                    field.onBlur()
                    trigger(name as any)
                  }}
                />
              </>
            )}
          />
        </Grid>
      )
    }

    const renderInvestorIdField = (
      name: string,
      label: string,
      gridSize: number = 6,
      required: boolean = false
    ) => (
      <Grid key={name} size={{ xs: 12, md: gridSize }}>
        <Controller
          name={name}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <>
              <TextField
                {...field}
                fullWidth
                label={label}
                value={investorId}
                required={required}
                disabled={isViewMode}
                error={!!errors[name] && !isViewMode}
                helperText={errors[name]?.message as string}
                onChange={(e) => {
                  setInvestorId(e.target.value)
                  field.onChange(e)
                  if (errors[name]) {
                    clearErrors(name as any)
                  }
                  trigger(name as any)
                }}
                onBlur={() => {
                  field.onBlur()
                  trigger(name as any)
                }}
                InputProps={{
                  endAdornment: !isViewMode ? (
                    <InputAdornment position="end" sx={{ mr: 0 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<RefreshIcon />}
                        onClick={handleGenerateNewId}
                        disabled={
                          isGeneratingId || isViewMode || (isEditMode ?? false)
                        }
                        sx={{
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          textTransform: 'none',
                          background: '#2563EB',
                          '&:hover': { background: '#1D4ED8' },
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
                  ) : undefined,
                  sx: valueSx,
                }}
                InputLabelProps={{ sx: getLabelSx() }}
                sx={{
                  ...commonFieldStyles,
                  ...(!!errors[name] &&
                    !isViewMode && {
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#d32f2f',
                          borderWidth: '1px',
                        },
                        '&:hover fieldset': {
                          borderColor: '#d32f2f',
                          borderWidth: '1px',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#d32f2f',
                          borderWidth: '1px',
                        },
                      },
                    }),
                }}
              />
            </>
          )}
        />
      </Grid>
    )

    // Render function for API-driven dropdowns
    const renderApiSelectField = (
      name: string,
      configId: string,
      fallbackLabel: string,
      options: { id: number; displayName: string; settingValue: string }[],
      gridSize: number = 6,
      _required = false,
      loading = false
    ) => {
      const label = getLabel(configId, currentLanguage, fallbackLabel)
      return (
        <Grid key={name} size={{ xs: 12, md: gridSize }}>
          <Controller
            name={name}
            control={control}
            rules={{}}
            defaultValue={''}
            render={({ field }) => (
              <>
                <FormControl
                  fullWidth
                  error={!!errors[name] && !isViewMode}
                  required={_required}
                  sx={{
                    '& .MuiFormLabel-asterisk': { color: '#6A7282 !important' },
                  }}
                >
                  <InputLabel sx={getLabelSx()}>
                    {loading ? `Loading...` : label}
                  </InputLabel>
                  <Select
                    {...field}
                    label={loading ? `Loading...` : label}
                    sx={{
                      ...selectStyles,
                      ...valueSx,
                      ...(isViewMode && {
                        backgroundColor: '#F9FAFB',
                        color: '#6B7280',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#E5E7EB',
                        },
                      }),
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
                      ...(!!errors[name] &&
                        !isViewMode && {
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #d32f2f',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #d32f2f',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #d32f2f',
                          },
                        }),
                    }}
                    IconComponent={KeyboardArrowDownIcon}
                    disabled={loading || isViewMode}
                    value={field.value || ''}
                    onChange={(e) => {
                      field.onChange(e)
                      if (errors[name]) {
                        clearErrors(name as any)
                      }
                      trigger(name as any)
                    }}
                    onBlur={() => {
                      field.onBlur()
                      trigger(name as any)
                    }}
                  >
                    {options.map((option) => (
                      <MenuItem key={option.id} value={option.settingValue}>
                        {option.displayName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors[name] && (
                    <FormHelperText error>{errors[name]?.message as string}</FormHelperText>
                  )}
                </FormControl>
              </>
            )}
          />
        </Grid>
      )
    }

    const getFallbackOptions = (key: string) => {
      switch (key) {
        case 'investorType':
          return [
            { id: 1, displayName: 'Individual', settingValue: 'CP_INDIVIDUAL' },
            { id: 2, displayName: 'Company', settingValue: 'CP_COMPANY' },
            { id: 3, displayName: 'Joint', settingValue: 'CP_JOINT' },
          ]
        case 'investorIdType':
          return [
            { id: 1, displayName: 'Passport', settingValue: 'PASSPORT' },
            { id: 2, displayName: 'National ID', settingValue: 'NATIONAL_ID' },
          ]
        case 'nationality':
          return [
            { id: 1, displayName: 'India', settingValue: 'AS_COUNTRY_INDIA' },
            { id: 2, displayName: 'Dubai', settingValue: 'AS_COUNTRY_DUBAI' },
            {
              id: 3,
              displayName: 'Abu Dhabi',
              settingValue: 'AS_COUNTRY_ABU_DHABI',
            },
            {
              id: 4,
              displayName: 'South Africa',
              settingValue: 'AS_COUNTRY_SA',
            },
            { id: 5, displayName: 'USA', settingValue: 'AS_COUNTRY_USA' },
          ]
        default:
          return []
      }
    }

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
            {(investorTypesError || idTypesError || countriesError) && (
              <Box
                sx={{
                  mb: 2,
                  p: 1,
                  bgcolor: '#fef2f2',
                  borderRadius: 1,
                  border: '1px solid #ef4444',
                }}
              >
                <Typography variant="body2" color="error">
                  ⚠️ Failed to load some dropdown options. Using fallback
                  values.
                </Typography>
              </Box>
            )}

            <Grid container rowSpacing={4} columnSpacing={2}>
              {renderApiSelectField(
                'investorType',
                'CDL_OWNER_TYPE',
                'Owner Registry Type',
                investorTypes?.length
                  ? investorTypes
                  : getFallbackOptions('investorType'),
                6,
                true,
                loadingInvestorTypes
              )}
              {renderInvestorIdField(
                'investorId',
                getLabel('CDL_OWNER_REFID', currentLanguage, 'Owner Registry ID'),
                6,
                true
              )}
              {renderTextField(
                'investorFirstName',
                'CDL_OWNER_FIRSTNAME',
                'Owner Registry Name',
                '',
                true
              )}
              {renderTextField(
                'investorMiddleName',
                'CDL_OWNER_MIDDLENAME',
                'Owner Registry Middle Name'
              )}
              {renderTextField(
                'investorLastName',
                'CDL_OWNER_LASTNAME',
                'Owner Registry Last Name'
              )}
              {renderTextField(
                'arabicName',
                'CDL_OWNER_LOCALE_NAME',
                'Arabic Name'
              )}
              {renderTextField(
                'ownership',
                'CDL_OWNER_OWNERSHIP',
                'Ownership Percentage'
              )}
              {renderApiSelectField(
                'investorIdType',
                'CDL_OWNER_ID_TYPE',
                'Owner Registry ID Type',
                idTypes?.length
                  ? idTypes
                  : getFallbackOptions('investorIdType'),
                6,
                true,
                loadingIdTypes
              )}
              {renderTextField('idNumber', 'CDL_OWNER_DOC_NO', 'ID No.', '', true)}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="idExpiryDate"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <>
                      <DatePicker
                        label={getLabel(
                          'CDL_OWNER_ID_EXP',
                          currentLanguage,
                          'ID Expiry Date'
                        )}
                        value={field.value}
                        onChange={(newValue) => {
                          field.onChange(newValue)
                          if (errors.idExpiryDate) {
                            clearErrors('idExpiryDate' as any)
                          }
                          trigger('idExpiryDate' as any)
                        }}
                        onClose={() => {
                          field.onBlur()
                          trigger('idExpiryDate' as any)
                        }}
                        format="DD/MM/YYYY"
                        disabled={isViewMode}
                        slots={{ openPickerIcon: StyledCalendarIcon }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.idExpiryDate && !isViewMode,
                            helperText: errors.idExpiryDate?.message as string,
                            sx: {
                              ...datePickerStyles,
                              ...(!!errors.idExpiryDate &&
                                !isViewMode && {
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#d32f2f' },
                                    '&:hover fieldset': {
                                      borderColor: '#d32f2f',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#d32f2f',
                                    },
                                  },
                                }),
                            },
                            InputLabelProps: { sx: getLabelSx() },
                            InputProps: {
                              sx: valueSx,
                              style: { height: '46px' },
                            },
                          },
                        }}
                      />
                    </>
                  )}
                />
              </Grid>
              {renderApiSelectField(
                'nationality',
                'CDL_OWNER_NATIONALITY',
                'Nationality',
                countries?.length
                  ? countries
                  : getFallbackOptions('nationality'),
                6,
                false,
                loadingCountries
              )}
              {renderTextField(
                'accountContact',
                'CDL_OWNER_TELEPHONE',
                'Account Contact Number',
                ''
              )}
              {renderTextField(
                'mobileNumber',
                'CDL_OWNER_MOBILE',
                'Mobile Number',
                ''
              )}
              {renderTextField('email', 'CDL_OWNER_EMAIL', 'Email Address', '')}
            </Grid>
          </CardContent>
        </Card>
      </LocalizationProvider>
    )
  }
)

Step1.displayName = 'Step1'

export default Step1
