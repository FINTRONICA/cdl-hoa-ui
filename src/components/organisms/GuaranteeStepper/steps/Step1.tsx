'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
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
import { FormError } from '../../../atoms/FormError'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { idService } from '../../../../services/api/developerIdService'
import { useApplicationSettings } from '../../../../hooks/useApplicationSettings'
import { BuildPartnerService } from '../../../../services/api/buildPartnerService'
import { useRealEstateAssets } from '../../../../hooks/useRealEstateAssets'
import { useEnabledFinancialInstitutionsDropdown } from '../../../../hooks/useFinancialInstitutions'
import { useSuretyBondTranslationsByPattern } from '../../../../hooks/useSuretyBondTranslations'
import { useSuretyBond } from '../../../../hooks/useSuretyBonds'
import dayjs from 'dayjs'

interface Step1Props {
  savedId?: string | null
  isEditMode?: boolean
  isViewMode?: boolean
}

const Step1 = ({ savedId, isEditMode, isViewMode }: Step1Props) => {

  const { control, setValue, watch, trigger, formState: { errors } } = useFormContext()

  const [guaranteeRefId, setGuaranteeRefId] = useState<string>('')
  const [isGeneratingId, setIsGeneratingId] = useState<boolean>(false)
  const [developerNames, setDeveloperNames] = useState<string[]>([])
  const [realEstateAssets, setRealEstateAssets] = useState<any[]>([])

  const { data: guaranteeTypes, loading: guaranteeTypesLoading } =
    useApplicationSettings('SURETY_BOND_TYPE')
  const { data: guaranteeStatuses, loading: guaranteeStatusesLoading } =
    useApplicationSettings('SURETY_BOND_STATUS')

  const {
    dropdownOptions: issuerBankOptions,
    loading: issuerBanksLoading,
    hasMore: hasMoreBanks,
    loadMore: loadMoreBanks,
    totalElements: totalBanks,
  } = useEnabledFinancialInstitutionsDropdown()


  const { translations: sbTranslations, loading: sbTranslationsLoading } =
    useSuretyBondTranslationsByPattern('CDL_SB_')


  const {
    suretyBond,
    loading: suretyBondLoading,
    error: suretyBondError,
  } = useSuretyBond((isEditMode || isViewMode) && savedId ? savedId : '')

  
  const { assets, loading: assetsLoading } = useRealEstateAssets(0, 20)


  useEffect(() => {
    const fetchDeveloperNames = async () => {
      try {
        const service = new BuildPartnerService()
        const res = await service.getBuildPartners(0, 100)
        const partners = res?.content || []
        const names = partners
          .map((bp: any) => bp.bpName)
          .filter((name: string | null) => !!name)
        setDeveloperNames(names)
      } catch (e) {
        setDeveloperNames([])
      }
    }
    fetchDeveloperNames()
  }, [])

  
  useEffect(() => {
    if (assets.length > 0) {
      setRealEstateAssets(assets)
    }
  }, [assets])

 
  const handleGenerateGuaranteeRefId = async () => {
    try {
      setIsGeneratingId(true)
      const newIdResponse = idService.generateNewId('GUA')
      setGuaranteeRefId(newIdResponse.id)
      setValue('guaranteeRefNo', newIdResponse.id, { shouldValidate: true })
      trigger('guaranteeRefNo')
    } catch (error) {
      throw error
    } finally {
      setIsGeneratingId(false)
    }
  }


  useEffect(() => {
    const currentId = watch('guaranteeRefNo')
    if (currentId && currentId !== guaranteeRefId) {
      setGuaranteeRefId(currentId)
    }
  }, [watch, guaranteeRefId])


  const getTranslatedLabel = (configId: string, fallback: string): string => {
    if (sbTranslationsLoading || !sbTranslations.length) {
      return fallback
    }

    const translation = sbTranslations.find((t) => t.configId === configId)
    return translation?.configValue || fallback
  }


  useEffect(() => {
    if (
      (isEditMode || isViewMode) &&
      savedId &&
      suretyBond &&
      !suretyBondLoading
    ) {
      try {
        const refNumber = suretyBond.suretyBondReferenceNumber || ''
        setValue('guaranteeRefNo', refNumber)
        setGuaranteeRefId(refNumber)
        setValue(
          'guaranteeType',
          suretyBond.suretyBondTypeDTO?.id?.toString() || ''
        )
        setValue(
          'guaranteeDate',
          suretyBond.suretyBondDate ? dayjs(suretyBond.suretyBondDate) : null
        )
        setValue('projectCif', '') 
        setValue(
          'projectName',
          suretyBond.realEstateAssestDTO?.id?.toString() || ''
        )
        setValue(
          'developerName',
          suretyBond.buildPartnerDTO?.id?.toString() || ''
        )
        setValue('openEndedGuarantee', suretyBond.suretyBondOpenEnded || false)
        setValue('projectCompletionDate', null) 
        setValue('noOfAmendments', suretyBond.suretyBondNoOfAmendment || '')
        setValue(
          'guaranteeExpirationDate',
          suretyBond.suretyBondExpirationDate
            ? dayjs(suretyBond.suretyBondExpirationDate)
            : null
        )
        setValue(
          'guaranteeAmount',
          (suretyBond.suretyBondAmount || 0).toString()
        )
        setValue(
          'suretyBondNewReadingAmendment',
          suretyBond.suretyBondNewReadingAmendment || ''
        )
        setValue('issuerBank', suretyBond.issuerBankDTO?.id?.toString() || '')
        setValue('status', '')
      } catch (error) {
        throw error
      }
    }
  }, [isEditMode, isViewMode, savedId, suretyBond, suretyBondLoading, setValue])


  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'projectName' && value.projectName) {
        const selectedAsset = realEstateAssets.find(
          (asset) => asset.id === parseInt(value.projectName)
        )
        if (selectedAsset) {
          
          if (selectedAsset.reaCif) {
            setValue('projectCif', selectedAsset.reaCif, { shouldValidate: true })
            trigger('projectCif')
          }
          
          if (selectedAsset.reaCompletionDate) {
            setValue(
              'projectCompletionDate',
              dayjs(selectedAsset.reaCompletionDate),
              { shouldValidate: true }
            )
            trigger('projectCompletionDate')
          }
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setValue, realEstateAssets])


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
    },
    '& .MuiSelect-icon': {
      color: '#64748B',
      fontSize: '20px',
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

  const StyledCalendarIcon = (props: any) => (
    <CalendarTodayOutlinedIcon
      {...props}
      sx={{
        width: '18px',
        height: '20px',
        position: 'relative',
        padding: '1px',
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
    required = false
  ) => {
    return (
      <Grid key={name} size={{ xs: 12, md: gridSize }}>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <>
              <TextField
                {...field}
                label={label}
                required={required}
                fullWidth
                disabled={!!isViewMode}
                error={!!errors[name] && !isViewMode}
                InputLabelProps={{ 
                  sx: {
                    ...getLabelSx(),
                    '& .MuiFormLabel-asterisk': {
                      color: '#6A7282 !important',
                      fontSize: 'inherit',
                      fontWeight: 'bold',
                    },
                    ...(!!errors[name] && !isViewMode && {
                      color: '#d32f2f',
                      '&.Mui-focused': {
                        color: '#d32f2f',
                      },
                      '&.MuiFormLabel-filled': {
                        color: '#d32f2f',
                      },
                    }),
                  }
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
                      '& fieldset': {
                        borderColor: '#E5E7EB',
                      },
                      '&:hover fieldset': {
                        borderColor: '#E5E7EB',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#E5E7EB',
                      },
                    },
                  }),
                 
                  ...(!!errors[name] && !isViewMode && {
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
              <FormError 
                error={errors[name]?.message as string} 
                touched={true}
              />
            </>
          )}
        />
      </Grid>
    )
  }

  const renderGuaranteeRefIdField = (
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
                required={required}
                value={guaranteeRefId}
                onChange={(e) => {
                  setGuaranteeRefId(e.target.value)
                  field.onChange(e)
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ mr: 0 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<RefreshIcon />}
                        onClick={handleGenerateGuaranteeRefId}
                        disabled={isGeneratingId || !!isViewMode}
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
                InputLabelProps={{ 
                  sx: {
                    ...getLabelSx(),
                    '& .MuiFormLabel-asterisk': {
                      color: '#6A7282 !important',
                      fontSize: 'inherit',
                      fontWeight: 'bold',
                    },
                  }
                }}
                sx={{
                  ...commonFieldStyles,
                  
                  ...(!!errors[name] && !isViewMode && {
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
              <FormError 
                error={errors[name]?.message as string} 
                touched={true}
              />
            </>
          )}
      />
    </Grid>
  )

  const renderSelectField = (
    name: string,
    label: string,
    options: any[],
    gridSize = 6,
    required = false
  ) => {
    return (
      <Grid key={name} size={{ xs: 12, md: gridSize }}>
        <Controller
          name={name}
          control={control}
          defaultValue={''}
          render={({ field }) => (
            <>
              <FormControl 
                fullWidth 
                error={!!errors[name] && !isViewMode}
                sx={{
                  '& .MuiFormLabel-asterisk': {
                    color: '#6A7282 !important',
                  },
                }}
              >
              <InputLabel 
                required={required}
                sx={{
                  ...getLabelSx(),
                  '& .MuiFormLabel-asterisk': {
                    color: '#6A7282 !important',
                    fontSize: 'inherit',
                    fontWeight: 'bold',
                  },
                  '&.MuiInputLabel-root .MuiFormLabel-asterisk': {
                    color: '#6A7282 !important',
                  },
                  '&.MuiFormLabel-root .MuiFormLabel-asterisk': {
                    color: '#6A7282 !important',
                  },
                  '&.MuiInputLabel-asterisk': {
                    color: '#6A7282 !important',
                  },
                  ...(!!errors[name] && !isViewMode && {
                    color: '#d32f2f',
                    '&.Mui-focused': {
                      color: '#d32f2f',
                    },
                  }),
                }}
              >
                {label}
              </InputLabel>
              <Select
                {...field}
                label={label}
                required={required}
                disabled={!!isViewMode}
                sx={{
                  ...selectStyles,
                  ...valueSx,
                  ...(isViewMode && {
                    backgroundColor: '#F9FAFB',
                    color: '#6B7280',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E5E7EB',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E5E7EB',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
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
                    border: '1px solid #2563eb',
                  },
                 
                  ...(!!errors[name] && !isViewMode && {
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
                IconComponent={isViewMode ? () => null : KeyboardArrowDownIcon}
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
                {options.map((opt, index) => {
                  
                  if (opt.settingValue === '__LOAD_MORE__') {
                    return (
                      <MenuItem
                        key={opt.id || `option-${index}`}
                        value=""
                        onClick={loadMoreBanks}
                        sx={{
                          fontSize: '14px',
                          fontFamily:
                            'Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          color: '#2563EB',
                          fontWeight: 'bold',
                          backgroundColor: '#EBF4FF',
                          '&:hover': {
                            backgroundColor: '#DBEAFE',
                            color: '#1D4ED8',
                          },
                        }}
                      >
                        {opt.displayName}
                        {hasMoreBanks && (
                          <span
                            style={{
                              marginLeft: '8px',
                              fontSize: '12px',
                              color: '#6B7280',
                            }}
                          >
                            (
                            {totalBanks -
                              issuerBankOptions.filter(
                                (o: any) =>
                                  o.settingValue !== '__LOAD_MORE__' &&
                                  o.settingValue !== '__LOADING__'
                              ).length}{' '}
                            more)
                          </span>
                        )}
                      </MenuItem>
                    )
                  }

                  if (opt.settingValue === '__LOADING__') {
                    return (
                      <MenuItem
                        key={opt.id || `option-${index}`}
                        value=""
                        disabled
                        sx={{
                          fontSize: '14px',
                          fontFamily:
                            'Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          color: '#6B7280',
                        }}
                      >
                        {opt.displayName}
                      </MenuItem>
                    )
                  }

                  return (
                    <MenuItem
                      key={opt.id || opt || `option-${index}`}
                      value={String(opt.id || opt.settingValue || opt || '')}
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
                      {opt.displayName || opt.name || opt}
                    </MenuItem>
                  )
                })}
              </Select>
              </FormControl>
              <FormError 
                error={errors[name]?.message as string} 
                touched={true}
              />
            </>
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
      <div className="text-sm">{label}</div>
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
                disabled={!!isViewMode}
                sx={{
                  color: isViewMode ? '#D1D5DB' : '#CAD5E2',
                  '&.Mui-checked': {
                    color: isViewMode ? '#9CA3AF' : '#2563EB',
                  },
                }}
              />
            }
            label="Yes"
            sx={{
              '& .MuiFormControlLabel-label': {
                fontFamily: 'Outfit, sans-serif',
                fontStyle: 'normal',
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '0.5px',
                verticalAlign: 'middle',
                color: isViewMode ? '#6B7280' : 'inherit',
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
    required: boolean = false
  ) => {
    return (
      <Grid key={name} size={{ xs: 12, md: gridSize }}>
        <Controller
          name={name}
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <>
              <DatePicker
              label={label}
              value={field.value}
              onChange={field.onChange}
              format="DD/MM/YYYY"
              disabled={!!isViewMode}
              slots={{
                openPickerIcon: isViewMode ? () => null : StyledCalendarIcon,
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: required,
                  error: !!errors[name] && !isViewMode,
                  helperText: '',
                  sx: {
                    ...datePickerStyles,
                    ...(isViewMode && {
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#F9FAFB',
                        color: '#6B7280',
                        '& fieldset': {
                          borderColor: '#E5E7EB',
                        },
                        '&:hover fieldset': {
                          borderColor: '#E5E7EB',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#E5E7EB',
                        },
                      },
                    }),
                    
                    ...(!!errors[name] && !isViewMode && {
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#d32f2f',
                        },
                        '&:hover fieldset': {
                          borderColor: '#d32f2f',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#d32f2f',
                        },
                      },
                    }),
                  },
                  InputLabelProps: { 
                    required: required,
                    sx: {
                      ...getLabelSx(),
                      '& .MuiFormLabel-asterisk': {
                        color: '#6A7282 !important',
                        fontSize: 'inherit',
                        fontWeight: 'bold',
                      },
                      '&.MuiInputLabel-root .MuiFormLabel-asterisk': {
                        color: '#6A7282 !important',
                      },
                      '&.MuiFormLabel-root .MuiFormLabel-asterisk': {
                        color: '#6A7282 !important',
                      },
                      '&.MuiInputLabel-asterisk': {
                        color: '#6A7282 !important',
                      },
                      ...(!!errors[name] && !isViewMode && {
                        color: '#d32f2f',
                        '&.Mui-focused': {
                          color: '#d32f2f',
                        },
                      }),
                    }
                  },
                  InputProps: {
                    sx: {
                      ...valueSx,
                      ...(isViewMode && {
                        color: '#6B7280',
                      }),
                    },
                    style: { height: '46px' },
                  },
                },
              }}
              />
              <FormError 
                error={errors[name]?.message as string} 
                touched={true}
              />
            </>
          )}
        />
      </Grid>
    )
  }

  
  if ((isEditMode || isViewMode) && suretyBondLoading) {
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
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
            >
              <Box textAlign="center">
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {getTranslatedLabel(
                    'CDL_SB_LOADING',
                    'Loading...'
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getTranslatedLabel(
                    'CDL_SB_LOADING_DESC',
                    'Please wait while we fetch the data'
                  )}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </LocalizationProvider>
    )
  }

 
  if ((isEditMode || isViewMode) && suretyBondError) {
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
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
            >
              <Box textAlign="center">
                <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                  {getTranslatedLabel(
                    'CDL_SB_ERROR',
                    'Error Loading Surety Bond'
                  )}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {suretyBondError}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => window.location.reload()}
                  sx={{ textTransform: 'none' }}
                >
                  {getTranslatedLabel('CDL_SB_RETRY', 'Try Again')}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </LocalizationProvider>
    )
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
          <Grid container rowSpacing={4} columnSpacing={2}>
            {renderGuaranteeRefIdField(
              'guaranteeRefNo',
              getTranslatedLabel(
                'CDL_SB_REF_NO',
                'Surety Bond Ref No'
              ),
              6,
              true
            )}
            {renderSelectField(
              'guaranteeType',
              getTranslatedLabel('CDL_SB_TYPE', 'Surety Bond Type'),
              guaranteeTypesLoading
                ? [{ id: 'loading', displayName: 'Loading...' }]
                : guaranteeTypes || [],
              6,
              true
            )}
            {renderDatePickerField(
              'guaranteeDate',
              getTranslatedLabel('CDL_SB_DATE', 'Surety Bond Date'),
              6,
              true
            )}
            {renderTextField(
              'projectCif',
              getTranslatedLabel('CDL_SB_BPA_CIF', 'Build Partner Assets  CIF'),
              6,
              '',
              true
            )}
            {renderSelectField(
              'projectName',
              getTranslatedLabel('CDL_SB_BPA_NAME', 'Build Partner Assets Name'),
              assetsLoading
                ? [{ id: 'loading', displayName: 'Loading...' }]
                : realEstateAssets.length > 0
                  ? realEstateAssets
                      .filter(
                        (asset) => asset.reaName && asset.reaName.trim() !== ''
                      )
                      .map((asset) => ({
                        id: asset.id,
                        displayName: asset.reaName,
                      }))
                  : [
                      {
                        id: 'no-projects',
                        displayName: 'No Build Partner Assets available',
                      },
                    ],
              6,
              true
            )}
            {renderSelectField(
              'developerName',
              getTranslatedLabel('CDL_SB_BP_NAME', 'Build Partner Name'),
              developerNames.length > 0
                ? developerNames.map((name) => ({
                    id: name,
                    displayName: name,
                  }))
                : [{ id: 'loading', displayName: 'Loading...' }],
              6,
              true
            )}
            {renderCheckboxField(
              'openEndedGuarantee',
              getTranslatedLabel('CDL_SB_OPEN_ENDED', 'Open Ended'),
              3
            )}
            {renderDatePickerField(
              'projectCompletionDate',
              getTranslatedLabel(
                'CDL_SB_BPA_COMPLETION_DATE',
                'Completion Date'
              ),
              3,
              !!watch('openEndedGuarantee')
            )}
            {renderTextField(
              'noOfAmendments',
              getTranslatedLabel('CDL_SB_NO_OF_AMEND', 'No Of Amendments'),
              3
            )}
            {renderDatePickerField(
              'guaranteeExpirationDate',
              getTranslatedLabel(
                'CDL_SB_EXPIARY_DATE',
                'Expiry Date'
              ),
              3,
              !watch('openEndedGuarantee')
            )}
            {renderTextField(
              'guaranteeAmount',
              getTranslatedLabel('CDL_SB_AMOUNT', 'Amount'),
              4,
              '',
              true
            )}
            {renderTextField(
              'suretyBondNewReadingAmendment',
              getTranslatedLabel(
                'CDL_SB_NEW_READING',
                'New Reading(Amendments)'
              ),
              4,
              ''
            )}
            {renderSelectField(
              'issuerBank',
              getTranslatedLabel('CDL_SB_BANK', 'Issuer Bank'),
              issuerBanksLoading
                ? [{ id: 'loading', displayName: 'Loading...' }]
                : issuerBankOptions.length > 0
                  ? issuerBankOptions.map((option: any) => ({
                      id: option.id,
                      displayName: option.displayName,
                      settingValue: option.settingValue,
                    }))
                  : [{ id: 'no-banks', displayName: 'No banks available' }],
              4,
              true
            )}
            {renderSelectField(
              'status',
              getTranslatedLabel('CDL_SB_STATUS', 'Status'),
              guaranteeStatusesLoading
                ? [
                    {
                      id: 'loading',
                      displayName: 'Loading...',
                    },
                  ]
                : guaranteeStatuses || [],
              4
            )}
          </Grid>
        </CardContent>
      </Card>
    </LocalizationProvider>
  )
}

export default Step1
