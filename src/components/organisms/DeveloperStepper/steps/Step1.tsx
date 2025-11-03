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

interface Step1Props {
  isReadOnly?: boolean
  developerId?: string | undefined
}

const Step1 = ({ isReadOnly = false, developerId }: Step1Props) => {
  // Check if we're in edit mode (existing developer)
  const isEditMode = !!developerId
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext()

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
  const { data: buildPartnerLabels, getLabel } = useBuildPartnerLabelsWithCache()
  const currentLanguage = useAppStore((state) => state.language) || 'EN'

  const getBuildPartnerLabelDynamic = useCallback(
    (configId: string): string => {
      const fallback = getBuildPartnerLabel(configId)

      if (buildPartnerLabels) {
        return getLabel(
          configId,
          currentLanguage,
          fallback
        )
      }
      return fallback
    },
    [buildPartnerLabels, currentLanguage, getLabel]
  )

  // Initialize developer ID from form value
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'bpDeveloperId' && value.bpDeveloperId) {
        setGeneratedId(value.bpDeveloperId)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // Handle Fetch Details button click
  const handleFetchDetails = async () => {
    const currentCif = watch('bpCifrera')
    if (!currentCif) {
      return
    }

    try {
      const buildPartnerService = new BuildPartnerService()
      const customerDetails =
        await buildPartnerService.getCustomerDetailsByCif(currentCif)

      // Populate only the name fields from customer details and clear validation errors
      setValue('bpName', customerDetails.name.firstName, {
        shouldValidate: true,
        shouldDirty: true,
      })
      setValue('bpNameLocal', customerDetails.name.shortName, {
        shouldValidate: true,
        shouldDirty: true,
      })
    } catch (error) {
      // You might want to show a user-friendly error message here
    }
  }

  // Function to generate new developer ID
  const handleGenerateNewId = async () => {
    try {
      setIsGeneratingId(true)
      const newIdResponse = developerIdService.generateNewId()
      setGeneratedId(newIdResponse.id)
      setValue('bpDeveloperId', newIdResponse.id, {
        shouldValidate: true,
        shouldDirty: true,
      })
    } catch (error) {
      // Handle error silently
    } finally {
      setIsGeneratingId(false)
    }
  }

  // Prepopulate regulator in edit mode based on existing details
  useEffect(() => {
    if (!isEditMode || !developerId) return

    const currentId = watch('bpRegulatorDTO.id')
    if (currentId) return

    const loadExisting = async () => {
      try {
        const svc = new BuildPartnerService()
        const details = await svc.getBuildPartner(developerId)
        const regulatorId = (details as any)?.bpRegulatorDTO?.id
        if (regulatorId) {
          setValue('bpRegulatorDTO.id', regulatorId, {
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
          validate: (value: any) => validateDeveloperField(0, name, value),
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label={label}
            fullWidth
            required={required}
            disabled={disabled || isReadOnly}
            error={!!errors[name]}
            helperText={errors[name]?.message?.toString()}
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
    options: unknown[],
    gridSize: number = 6,
    loading = false,
    required = false
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `${label} is required` : false,
          validate: (value: any) => validateDeveloperField(0, name, value),
        }}
        defaultValue={undefined}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors[name]} required={required}>
            <InputLabel sx={labelSx}>
              {loading ? `Loading...` : label}
            </InputLabel>
            <Select
              {...field}
              input={<OutlinedInput label={loading ? `Loading...` : label} />}
              label={loading ? `Loading...` : label}
              sx={{ ...selectStyles, ...valueSx }}
              IconComponent={KeyboardArrowDownIcon}
              disabled={loading || isReadOnly}
            >
              {options.map((option) => (
                <MenuItem
                  key={(option as { configId?: string }).configId}
                  value={(option as { id?: string }).id}
                >
                  {getDisplayLabel(
                    option as any,
                    getDeveloperDropdownLabel(
                      (option as { configId?: string }).configId || ''
                    )
                  )}
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
        render={({ field }) => (
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
                error: !!errors[name],
                helperText: errors[name]?.message?.toString(),
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
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label={label}
            required={required}
            disabled={isReadOnly}
            error={!!errors[name]}
            helperText={errors[name]?.message?.toString()}
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
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label={label}
            required={required}
            value={field.value || generatedId}
            error={!!errors[name]}
            helperText={errors[name]?.message?.toString()}
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
            {renderDeveloperIdField(
              'bpDeveloperId',
              getBuildPartnerLabelDynamic('CDL_BP_ID'),
              6,
              true
            )}
            {renderTextFieldWithButton(
              'bpCifrera',
              getBuildPartnerLabelDynamic('CDL_BP_CIF'),
              'Fetch Details',
              6,
              true
            )}
            {renderTextField(
              'bpDeveloperRegNo',
              getBuildPartnerLabelDynamic('CDL_BP_REGNO'),
              '',
              6,
              false,
              true
            )}
            {renderDatePickerField(
              'bpOnboardingDate',
              getBuildPartnerLabelDynamic('CDL_BP_REGDATE'),
              6,
              true
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="bpName"
                control={control}
                defaultValue=""
                rules={{
                  required: `${getBuildPartnerLabelDynamic('CDL_BP_NAME')} is required`,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={`${getBuildPartnerLabelDynamic('CDL_BP_NAME')}`}
                    fullWidth
                    required={true}
                    disabled={true}
                    error={!!errors['bpName']}
                    helperText={errors['bpName']?.message?.toString()}
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
                name="bpNameLocal"
                control={control}
                defaultValue=""
                rules={{
                  required: `${getBuildPartnerLabelDynamic('CDL_BP_NAME_LOCALE')} is required`,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={`${getBuildPartnerLabelDynamic('CDL_BP_NAME_LOCALE')}`}
                    fullWidth
                    required={true}
                    disabled={true}
                    error={!!errors['bpNameLocal']}
                    helperText={errors['bpNameLocal']?.message?.toString()}
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
            {renderTextField(
              'bpMasterName',
              getBuildPartnerLabelDynamic('CDL_BP_MASTER')
            )}
            {renderApiSelectField(
              'bpRegulatorDTO.id',
              getBuildPartnerLabelDynamic('CDL_BP_REGULATORY_AUTHORITY'),
              regulatoryAuthorities,
              6,
              dropdownsLoading,
              true
            )}
            {renderTextField(
              'bpContactAddress',
              getBuildPartnerLabelDynamic('CDL_BP_ADDRESS'),
              '',
              12,
              false,
              false
            )}
            {renderTextField(
              'bpMobile',
              getBuildPartnerLabelDynamic('CDL_BP_MOBILE'),
              '',
              4,
              false,
              false
            )}
            {renderTextField(
              'bpEmail',
              getBuildPartnerLabelDynamic('CDL_BP_EMAIL'),
              '',
              4,
              false,
              false
            )}
            {renderTextField(
              'bpFax',
              getBuildPartnerLabelDynamic('CDL_BP_FAX'),
              '',
              4,
              false,
              false
            )}
            {renderTextField(
              'bpLicenseNo',
              getBuildPartnerLabelDynamic('CDL_BP_LICENSE'),
              '',
              6,
              false,
              true
            )}
            {renderDatePickerField(
              'bpLicenseExpDate',
              getBuildPartnerLabelDynamic('CDL_BP_LICENSE_VALID'),
              6,
              true
            )}
            {renderCheckboxField(
              'bpWorldCheckFlag',
              getBuildPartnerLabelDynamic('CDL_BP_WORLD_STATUS'),
              3
            )}
            {renderCheckboxField('bpMigratedData', 'Migrated Data', 3)}
            {renderTextField(
              'bpWorldCheckRemarks',
              getBuildPartnerLabelDynamic('CDL_BP_WORLD_REMARKS')
            )}
            {renderTextField('bpremark', getBuildPartnerLabelDynamic('CDL_BP_NOTES'))}
            {renderTextField('bpContactTel', 'Account Contact Number')}
          </Grid>
        </CardContent>
      </Card>
    </LocalizationProvider>
  )
}

export default Step1
