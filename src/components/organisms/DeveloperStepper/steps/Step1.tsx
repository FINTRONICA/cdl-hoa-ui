import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
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
import { getBuildPartnerLabel } from '../../../../constants/mappings/buildPartnerMapping'
import { useBuildPartnerLabelsWithCache } from '@/hooks/useBuildPartnerLabelsWithCache'
import { useAppStore } from '@/store'
import { BuildPartnerService } from '../../../../services/api/buildPartnerService'
import { developerIdService } from '../../../../services/api/developerIdService'
import { useDeveloperDropdownLabels } from '../../../../hooks/useDeveloperDropdowns'
import { getDeveloperDropdownLabel } from '../../../../constants/mappings/developerDropdownMapping'
import { validateDeveloperField } from '../../../../lib/validation/developerSchemas'
import type { DeveloperDropdownOption } from '@/services/api/developerDropdownService'

interface Step1Props {
  isReadOnly?: boolean
  developerId?: string | undefined
}

const Step1 = ({ isReadOnly = false, developerId }: Step1Props) => {
  // Check if we're in edit mode (existing developer)
  const isEditMode = !!developerId
  const { control, watch, setValue } = useFormContext()

  // State for developer ID generation
  const [generatedId, setGeneratedId] = useState<string>('')
  const [isGeneratingId, setIsGeneratingId] = useState<boolean>(false)

  // Developer dropdown data
  const {
    regulatoryAuthorities,
    isLoading: dropdownsLoading,
    error: dropdownsError,
    getDisplayLabel,
  } = useDeveloperDropdownLabels()

  // Dynamic label support (Phase 1: foundation)
  const { data: buildPartnerLabels, getLabel } =
    useBuildPartnerLabelsWithCache()
  const currentLanguage = useAppStore((state) => state.language) || 'EN'

  const getBuildPartnerLabelDynamic = useCallback(
    (configId: string): string => {
      const fallback = getBuildPartnerLabel(configId)

      if (buildPartnerLabels) {
        return getLabel(configId, currentLanguage, fallback)
      }
      return fallback
    },
    [buildPartnerLabels, currentLanguage, getLabel]
  )

  // Initialize developer ID from form value
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'arDeveloperId' && value.arDeveloperId) {
        setGeneratedId(value.arDeveloperId)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // Handle Fetch Details button click
  const handleFetchDetails = async () => {
    const currentCif = watch('arCifrera')
    if (!currentCif) {
      return
    }

    try {
      const buildPartnerService = new BuildPartnerService()
      const customerDetails =
        await buildPartnerService.getCustomerDetailsByCif(currentCif)

      // Populate only the name fields from customer details and clear validation errors
      const customerName = customerDetails?.name ?? {}

      if (customerName.firstName !== undefined) {
        setValue('arName', customerName.firstName, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }

      if (customerName.shortName !== undefined) {
        setValue('arNameLocal', customerName.shortName, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      if (customerName.companyNumber !== undefined) {
        setValue('arCompanyNumber', customerName.companyNumber ?? '', {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      if (customerName.property !== undefined) {
        setValue('arProjectName', customerName.property ?? '', {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      if (customerName.masterDeveloper !== undefined) {
        setValue('arMasterDeveloper', customerName.masterDeveloper ?? '', {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      if (customerName.masterCommunity !== undefined) {
        setValue('arMasterCommunity', customerName.masterCommunity ?? '', {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
    } catch {
      // You might want to show a user-friendly error message here
    }
  }

  // Function to generate new developer ID
  const handleGenerateNewId = async () => {
    try {
      setIsGeneratingId(true)
      const newIdResponse = developerIdService.generateNewId()
      setGeneratedId(newIdResponse.id)
      setValue('arDeveloperId', newIdResponse.id, {
        shouldValidate: true,
        shouldDirty: true,
      })
    } catch {
      // Handle error silently
    } finally {
      setIsGeneratingId(false)
    }
  }

  // Prepopulate regulator in edit mode based on existing details
  useEffect(() => {
    if (!isEditMode || !developerId) return

    const currentId = watch('arRegulatorDTO.id')
    if (currentId) return

    const loadExisting = async () => {
      try {
        const svc = new BuildPartnerService()
        const details = await svc.getBuildPartner(developerId)
        const regulatorData = details?.arRegulatorDTO
        let regulatorId: number | string | undefined
        if (
          regulatorData &&
          typeof regulatorData === 'object' &&
          'id' in regulatorData
        ) {
          regulatorId = (regulatorData as { id?: number | string }).id
        }
        if (
          regulatorId !== undefined &&
          regulatorId !== null &&
          regulatorId !== ''
        ) {
          setValue('arRegulatorDTO.id', regulatorId, {
            shouldValidate: true,
            shouldDirty: false,
          })
        }
      } catch {
        // ignore; leave empty if fetch fails
      }
    }

    loadExisting()
  }, [isEditMode, developerId, setValue, watch])

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
    defaultValue = '',
    gridSize: number = 6,
    disabled = false,
    required = false
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue === undefined ? '' : defaultValue}
        rules={{
          required: required ? `${label} is required` : false,
          validate: (value: unknown) => validateDeveloperField(0, name, value),
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label={label}
            fullWidth
            required={required}
            disabled={disabled || isReadOnly}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            InputLabelProps={{ sx: labelSx }}
            InputProps={{ sx: valueSx }}
            sx={{
              ...commonFieldStyles,
              ...(disabled && {
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#F5F5F5',
                  '& fieldset': {
                    borderColor: '#E0E0E0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#E0E0E0',
                  },
                },
              }),
            }}
          />
        )}
      />
    </Grid>
  )

  // New render function for API-driven dropdowns
  const renderApiSelectField = (
    name: string,
    label: string,
    options: DeveloperDropdownOption[],
    gridSize: number = 6,
    loading = false,
    required = false
  ) => {
    return (
      <Grid key={name} size={{ xs: 12, md: gridSize }}>
        <Controller
          name={name}
          control={control}
          rules={{
            required: required ? `${label} is required` : false,
            validate: (value: unknown) => {
              // First check if required and empty
              if (
                required &&
                (!value ||
                  value === '' ||
                  value === null ||
                  value === undefined)
              ) {
                return `${label} is required`
              }
              // Then run additional validation
              const validationResult = validateDeveloperField(0, name, value)
              // validateDeveloperField returns true if valid, or an error message string if invalid
              return validationResult
            },
          }}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth error={!!error} required={required}>
              <InputLabel sx={labelSx}>
                {loading ? `Loading...` : label}
              </InputLabel>
              <Select
                {...field}
                value={field.value || ''}
                input={<OutlinedInput label={loading ? `Loading...` : label} />}
                label={loading ? `Loading...` : label}
                sx={{ ...selectStyles, ...valueSx }}
                IconComponent={KeyboardArrowDownIcon}
                disabled={loading || isReadOnly}
              >
                {options.map((option) => (
                  <MenuItem key={option.configId} value={option.id}>
                    {getDisplayLabel(
                      option,
                      getDeveloperDropdownLabel(option.configId || '')
                    )}
                  </MenuItem>
                ))}
              </Select>
              {error && (
                <FormHelperText
                  error
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '12px',
                    marginLeft: '14px',
                    marginRight: '14px',
                    marginTop: '4px',
                  }}
                >
                  {error?.message?.toString()}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      </Grid>
    )
  }

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
                checked={field.value === true}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={isReadOnly}
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

  const renderDatePickerField = (
    name: string,
    label: string,
    gridSize: number = 6,
    required = false
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        defaultValue={null}
        rules={{
          required: required ? `${label} is required` : false,
        }}
        render={({ field, fieldState }) => (
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
                required: required,
                error: !!fieldState.error,
                helperText: fieldState.error?.message,
                sx: datePickerStyles,
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

  const renderTextFieldWithButton = (
    name: string,
    label: string,
    buttonText: string,
    gridSize: number = 6,
    required = false
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        rules={{
          required: required ? `${label} is required` : false,
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            fullWidth
            label={label}
            required={required}
            disabled={isReadOnly}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    size="small"
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
                    onClick={handleFetchDetails}
                    disabled={isReadOnly}
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

  const renderDeveloperIdField = (
    name: string,
    label: string,
    gridSize: number = 6,
    required = false
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        rules={{
          required: required ? `${label} is required` : false,
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            fullWidth
            label={label}
            required={required}
            value={field.value || generatedId}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            onChange={(e) => {
              setGeneratedId(e.target.value)
              field.onChange(e)
            }}
            disabled={isReadOnly || isEditMode}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: 0 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={handleGenerateNewId}
                    disabled={isGeneratingId || isReadOnly || isEditMode}
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
            InputLabelProps={{ sx: labelSx }}
            sx={{
              ...commonFieldStyles,
              ...((isReadOnly || isEditMode) && {
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#F5F5F5',
                  '& fieldset': {
                    borderColor: '#E0E0E0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#E0E0E0',
                  },
                },
              }),
            }}
          />
        )}
      />
    </Grid>
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
          {/* Show error if dropdowns fail to load */}
          {dropdownsError && (
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
                ⚠️ Failed to load dropdown options. Using fallback values.
              </Typography>
            </Box>
          )}

          <Grid container rowSpacing={4} columnSpacing={2}>
            {/* Updated: Changed from arDeveloperId to arDeveloperId */}
            {renderDeveloperIdField(
              'arDeveloperId',
              getBuildPartnerLabelDynamic('CDL_AR_ID'),
              6,
              true
            )}
            {/* Updated: Changed from arCifrera to arCifrera */}
            {renderTextFieldWithButton(
              'arCifrera',
              getBuildPartnerLabelDynamic('CDL_AR_CIF'),
              'Fetch Details',
              6,
              true
            )}
            {/* Updated: Changed from arDeveloperRegNo to arDeveloperRegNo */}
            {renderTextField(
              'arDeveloperRegNo',
              getBuildPartnerLabelDynamic('CDL_AR_REGNO'),
              '',
              6,
              false,
              true
            )}
            {/* Updated: Changed from arOnboardingDate to arOnboardingDate */}
            {renderDatePickerField(
              'arOnboardingDate',
              getBuildPartnerLabelDynamic('CDL_AR_REGDATE'),
              6,
              true
            )}
            {/* Updated: Changed from arName to arName */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="arName"
                control={control}
                defaultValue=""
                rules={{
                  required: `${getBuildPartnerLabelDynamic('CDL_AR_NAME')} is required`,
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={`${getBuildPartnerLabelDynamic('CDL_AR_NAME')}`}
                    fullWidth
                    required={true}
                    disabled={true}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
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
            </Grid>
            {/* Updated: Changed from arNameLocal to arNameLocal */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="arNameLocal"
                control={control}
                defaultValue=""
                rules={{
                  required: `${getBuildPartnerLabelDynamic('CDL_AR_NAME_LOCALE')} is required`,
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={`${getBuildPartnerLabelDynamic('CDL_AR_NAME_LOCALE')}`}
                    fullWidth
                    required={true}
                    disabled={true}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
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
            </Grid>
            {/* NEW FIELDS - Asset Register specific fields */}
            {/* Updated: Using dynamic labels for new AR fields */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="arProjectName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={getBuildPartnerLabelDynamic('CDL_AR_PROJECT')}
                    fullWidth
                    required={true}
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
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="arCompanyNumber"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={getBuildPartnerLabelDynamic('CDL_AR_COMPANY_NUMBER')}
                    fullWidth
                    required={true}
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
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="arMasterCommunity"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={getBuildPartnerLabelDynamic(
                      'CDL_AR_MASTER_COMMUNITY'
                    )}
                    fullWidth
                    required={true}
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
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="arMasterDeveloper"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={getBuildPartnerLabelDynamic(
                      'CDL_AR_MASTER_DEVELOPER'
                    )}
                    fullWidth
                    required={true}
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
            </Grid>

            {/* END NEW FIELDS */}
            {/* Updated: Changed from arMasterName to arMasterName */}
            {renderTextField(
              'arMasterName',
              getBuildPartnerLabelDynamic('CDL_AR_MASTER')
            )}
            {/* Updated: Changed from arRegulatorDTO.id to arRegulatorDTO.id */}
            {renderApiSelectField(
              'arRegulatorDTO.id',
              getBuildPartnerLabelDynamic('CDL_AR_REGULATORY_AUTHORITY'),
              regulatoryAuthorities,
              6,
              dropdownsLoading,
              true
            )}
            {/* Updated: Changed from arContactAddress to arContactAddress */}
            {renderTextField(
              'arContactAddress',
              getBuildPartnerLabelDynamic('CDL_AR_ADDRESS'),
              '',
              12,
              false,
              false
            )}
            {/* Updated: Changed from arMobile to arMobile */}
            {renderTextField(
              'arMobile',
              getBuildPartnerLabelDynamic('CDL_AR_MOBILE'),
              '',
              4,
              false,
              false
            )}
            {/* Updated: Changed from arEmail to arEmail */}
            {renderTextField(
              'arEmail',
              getBuildPartnerLabelDynamic('CDL_AR_EMAIL'),
              '',
              4,
              false,
              false
            )}
            {/* Updated: Changed from arFax to arFax */}
            {renderTextField(
              'arFax',
              getBuildPartnerLabelDynamic('CDL_AR_FAX'),
              '',
              4,
              false,
              false
            )}
            {/* Updated: Changed from arLicenseNo to arLicenseNo */}
            {renderTextField(
              'arLicenseNo',
              getBuildPartnerLabelDynamic('CDL_AR_LICENSE'),
              '',
              6,
              false,
              true
            )}
            {/* Updated: Changed from arLicenseExpDate to arLicenseExpDate */}
            {renderDatePickerField(
              'arLicenseExpDate',
              getBuildPartnerLabelDynamic('CDL_AR_LICENSE_VALID'),
              6,
              true
            )}
            {/* Updated: Changed from arWorldCheckFlag to arWorldCheckFlag */}
            {renderCheckboxField(
              'arWorldCheckFlag',
              getBuildPartnerLabelDynamic('CDL_AR_WORLD_STATUS'),
              3
            )}
            {/* Updated: Changed from arMigratedData to arMigratedData */}
            {renderCheckboxField('arMigratedData', 'Migrated Data', 3)}
            {/* Updated: Changed from arWorldCheckRemarks to arWorldCheckRemarks */}
            {renderTextField(
              'arWorldCheckRemarks',
              getBuildPartnerLabelDynamic('CDL_AR_WORLD_REMARKS')
            )}
            {/* Updated: Changed from arremark to arRemark */}
            {renderTextField(
              'arRemark',
              getBuildPartnerLabelDynamic('CDL_AR_NOTES')
            )}
            {/* Updated: Changed from arContactTel to arContactTel */}
            {renderTextField('arContactTel', 'Account Contact Number')}
          </Grid>
        </CardContent>
      </Card>
    </LocalizationProvider>
  )
}

export default Step1
