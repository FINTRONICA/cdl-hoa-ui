'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import {
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'

import { toast } from 'react-hot-toast'

import { useBudgetData } from './BudgetDataProvider'
import { managementFirmBudgetService } from '@/services/api/budget/managementFirmBudgetService'
import type { BudgetData, BudgetDropdownOption } from './BudgetType'
import type { BudgetManagementFirmStep1FormValues } from '@/lib/validation/budgetSchemas'
import { useBudgetLabels } from '@/hooks/budget/useBudgetLabels'
import { BUDGET_LABELS } from '@/constants/mappings/budgetLabels'
import { FormError } from '@/components/atoms/FormError'
import { getFieldMaxLength } from '@/lib/validation'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material'
import { Controller, useFormContext } from 'react-hook-form'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
interface BudgetStep1Props {
  savedId?: string | null
  isEditMode?: boolean
  onDataLoaded?: () => void
  isReadOnly?: boolean
  refreshKey?: number
}

const BudgetStep1: React.FC<BudgetStep1Props> = ({
  savedId,
  isEditMode = false,
  onDataLoaded,
  isReadOnly = false,
  refreshKey,
}) => {
  const {
    control,
    setValue,
    watch,
    reset,
    trigger,
  } = useFormContext<BudgetManagementFirmStep1FormValues>()
  const { options } = useBudgetData()
  const { getLabel } = useBudgetLabels('EN')
  const labelFor = useCallback(
    (configId: string, fallback: string) =>
      getLabel(configId, 'EN', fallback),
    [getLabel]
  )
  const [isFetching, setIsFetching] = useState(false)

  const budgetPeriodOptions = useMemo<BudgetDropdownOption[]>(
    () =>
      options.budgetPeriods.map((period) => ({
        id: period.code,
        label: `${period.code} - ${period.title}`,
      })),
    [options.budgetPeriods]
  )

  const managementFirmGroupId = watch('managementFirmGroupId')
  const serviceChargeGroupId = watch('serviceChargeGroupId')
  const categoryCode = watch('categoryCode')
  const subCategoryCode = watch('subCategoryCode')
  const serviceCode = watch('serviceCode')
  const budgetPeriodCode = watch('budgetPeriodCode')

  useEffect(() => {
    const syncGroupFields = () => {
      if (managementFirmGroupId) {
        const match = options.managementFirmGroups.find(
          (item) => item.id === managementFirmGroupId
        )
        if (match) {
          setValue('managementFirmGroupName', match.label, {
            shouldDirty: false,
            shouldTouch: true,
          })
          setValue('managementFirmGroupLocalName', match.description ?? match.label, {
            shouldDirty: false,
            shouldTouch: true,
          })
        }
      }
    }

    syncGroupFields()
  }, [managementFirmGroupId, options.managementFirmGroups, setValue])

  useEffect(() => {
    const syncServiceChargeGroup = () => {
      if (serviceChargeGroupId) {
        const match = options.serviceChargeGroups.find(
          (item) => item.id === serviceChargeGroupId
        )
        if (match) {
          setValue('serviceChargeGroupName', match.label, {
            shouldDirty: false,
            shouldTouch: true,
          })
          setValue('serviceChargeGroupLocalName', match.description ?? match.label, {
            shouldDirty: false,
            shouldTouch: true,
          })
        }
      }
    }

    syncServiceChargeGroup()
  }, [options.serviceChargeGroups, serviceChargeGroupId, setValue])

  useEffect(() => {
    const syncCategory = () => {
      if (categoryCode) {
        const match = options.categories.find((item) => item.id === categoryCode)
        if (match) {
          setValue('categoryName', match.label, {
            shouldDirty: false,
            shouldTouch: true,
          })
          setValue('categoryLocalName', match.description ?? match.label, {
            shouldDirty: false,
            shouldTouch: true,
          })
        }
      }
    }

    syncCategory()
  }, [categoryCode, options.categories, setValue])

  useEffect(() => {
    const syncSubCategory = () => {
      if (subCategoryCode) {
        const match = options.subCategories.find((item) => item.id === subCategoryCode)
        if (match) {
          setValue('subCategoryName', match.label, {
            shouldDirty: false,
            shouldTouch: true,
          })
          setValue('subCategoryLocalName', match.description ?? match.label, {
            shouldDirty: false,
            shouldTouch: true,
          })
        }
      }
    }

    syncSubCategory()
  }, [options.subCategories, setValue, subCategoryCode])

  useEffect(() => {
    const syncService = () => {
      if (serviceCode) {
        const match = options.services.find((item) => item.id === serviceCode)
        if (match) {
          setValue('serviceName', match.label, {
            shouldDirty: false,
            shouldTouch: true,
          })
          setValue('serviceLocalName', match.description ?? match.label, {
            shouldDirty: false,
            shouldTouch: true,
          })
        }
      }
    }

    syncService()
  }, [options.services, serviceCode, setValue])

  useEffect(() => {
    const syncBudgetPeriod = () => {
      if (budgetPeriodCode) {
        const match = options.budgetPeriods.find((item) => item.code === budgetPeriodCode)
        if (match) {
          setValue('budgetPeriodTitle', match.title, {
            shouldDirty: false,
            shouldTouch: true,
          })
          setValue('budgetPeriodFrom', match.from ? dayjs(match.from) : null, {
            shouldDirty: false,
            shouldTouch: true,
          })
          setValue('budgetPeriodTo', match.to ? dayjs(match.to) : null, {
            shouldDirty: false,
            shouldTouch: true,
          })
        }
      }
    }

    syncBudgetPeriod()
  }, [budgetPeriodCode, options.budgetPeriods, setValue])

  useEffect(() => {
    const fetchBudget = async () => {
      if (!isEditMode || !savedId) {
        onDataLoaded?.()
        return
      }

      try {
        setIsFetching(true)
        const budget = await managementFirmBudgetService.getBudgetById(savedId)
        applyBudgetToForm(budget)
      } catch {
        toast.error('Failed to load budget details. Please retry.')
      } finally {
        setIsFetching(false)
        onDataLoaded?.()
      }
    }

    fetchBudget()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, savedId, refreshKey])

  const applyBudgetToForm = (budget: BudgetData) => {
    const values = {
      managementFirmGroupId: budget.managementFirmGroupId,
      managementFirmGroupName: budget.managementFirmGroupName,
      managementFirmGroupLocalName: budget.managementFirmGroupLocalName,
      masterCommunityName: budget.masterCommunityName,
      masterCommunityLocalName: budget.masterCommunityLocalName,
      managementCompanyId: budget.managementCompanyId,
      managementCompanyName: budget.managementCompanyName,
      managementCompanyLocalName: budget.managementCompanyLocalName,
      managementFirmManagerEmail: budget.managementFirmManagerEmail,
      serviceChargeGroupId: budget.serviceChargeGroupId,
      serviceChargeGroupName: budget.serviceChargeGroupName,
      serviceChargeGroupLocalName: budget.serviceChargeGroupLocalName,
      budgetPeriodCode: budget.budgetPeriodCode,
      budgetPeriodTitle: budget.budgetPeriodTitle,
      budgetPeriodFrom: budget.budgetPeriodFrom ? dayjs(budget.budgetPeriodFrom) : null,
      budgetPeriodTo: budget.budgetPeriodTo ? dayjs(budget.budgetPeriodTo) : null,
      categoryCode: budget.categoryCode,
      categoryName: budget.categoryName,
      categoryLocalName: budget.categoryLocalName,
      subCategoryCode: budget.subCategoryCode,
      subCategoryName: budget.subCategoryName,
      subCategoryLocalName: budget.subCategoryLocalName,
      serviceCode: budget.serviceCode,
      serviceName: budget.serviceName,
      serviceLocalName: budget.serviceLocalName,
      totalCost: String(budget.totalCost),
      vatAmount: String(budget.vatAmount),
      documents: [],
    } as BudgetManagementFirmStep1FormValues

    reset(values, { keepDefaultValues: true })
  }

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
  name: keyof BudgetManagementFirmStep1FormValues,
  label: string,
  gridSize = 6,
  defaultValue = '',
  isRequired = false,
  disabled = false
) => (
  <Grid key={name as string} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label={label}
            value={field.value ?? defaultValue}
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
              const maxLen = getFieldMaxLength(name as string)
              field.onChange(value)
              if (maxLen && value.length > maxLen) {
                void trigger(name)
              }
            }}
          />
        )}
      />
  </Grid>
)

const renderSelectField = (
  name: keyof BudgetManagementFirmStep1FormValues,
  label: string,
  optionsList: Array<BudgetDropdownOption | string>,
  gridSize = 6,
  isRequired = true,
  isLoading = false,
  disabled = false
) => (
  <Grid key={name as string} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
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
            <Select<string>
              {...field}
              value={(field.value as string) ?? ''}
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
              {optionsList.map((option, index) => {
                const optionValue =
                  typeof option === 'string' ? option : option.id
                const optionLabel =
                  typeof option === 'string' ? option : option.label

                return (
                <MenuItem
                  key={optionValue ?? `option-${index}`}
                  value={optionValue ?? ''}
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
                  {optionLabel}
                </MenuItem>
                )
              })}
            </Select>
            <FormError error={error?.message || ''} touched={true} />
          </FormControl>
        )}
      />
  </Grid>
)

const renderDatePickerField = (
  name: keyof BudgetManagementFirmStep1FormValues,
  label: string,
  gridSize = 6,
  isRequired = false,
  disabled = false
) => (
  <Grid key={name as string} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            label={label}
            value={field.value as Dayjs | null}
            onChange={field.onChange}
            format="DD/MM/YYYY"
            disabled={disabled || isReadOnly}
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
        <CardContent sx={{ px: { xs: 2, md: 6 }, py: { xs: 3, md: 4 } }}>
          {isFetching && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Loading saved budget details...
            </Typography>
          )}

          <Grid container rowSpacing={4} columnSpacing={2}>
            {renderSelectField(
              'managementFirmGroupId',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_FIRM_GROUP_ID,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_FIRM_GROUP_ID
              ),
              options.managementFirmGroups,
              6,
              true
            )}
            {renderTextField(
              'managementFirmGroupName',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_FIRM_GROUP_NAME,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_FIRM_GROUP_NAME
              ),
              6,
              '',
              true
            )}
            {renderTextField(
              'managementFirmGroupLocalName',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_FIRM_GROUP_LOCAL_NAME,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_FIRM_GROUP_LOCAL_NAME
              ),
              6,
              '',
              true
            )}
            {renderTextField(
              'masterCommunityName',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.MASTER_COMMUNITY_NAME,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MASTER_COMMUNITY_NAME
              ),
              6,
              '',
              true
            )}
            {renderTextField(
              'masterCommunityLocalName',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.MASTER_COMMUNITY_LOCAL_NAME,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MASTER_COMMUNITY_LOCAL_NAME
              ),
              6,
              '',
              true
            )}
            {renderTextField(
              'managementCompanyId',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_COMPANY_ID,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_COMPANY_ID
              )
            )}
            {renderTextField(
              'managementCompanyName',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_COMPANY_NAME,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_COMPANY_NAME
              )
            )}
            {renderTextField(
              'managementCompanyLocalName',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_COMPANY_LOCAL_NAME,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_COMPANY_LOCAL_NAME
              )
            )}
            {renderTextField(
              'managementFirmManagerEmail',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_FIRM_MANAGER_EMAIL,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_FIRM_MANAGER_EMAIL
              )
            )}

            {renderSelectField(
              'serviceChargeGroupId',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.SERVICE_CHARGE_GROUP_ID,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_CHARGE_GROUP_ID
              ),
              options.serviceChargeGroups,
              6,
              true
            )}
            {renderTextField(
              'serviceChargeGroupName',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.SERVICE_CHARGE_GROUP_NAME,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_CHARGE_GROUP_NAME
              ),
              6,
              '',
              true
            )}
            {renderTextField(
              'serviceChargeGroupLocalName',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.SERVICE_CHARGE_GROUP_LOCAL_NAME,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_CHARGE_GROUP_LOCAL_NAME
              ),
              6,
              '',
              true
            )}

            {renderSelectField(
              'budgetPeriodCode',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_CODE,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.BUDGET_PERIOD_CODE
              ),
              budgetPeriodOptions,
              3,
              true
            )}
            {renderTextField(
              'budgetPeriodTitle',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_TITLE,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.BUDGET_PERIOD_TITLE
              ),
              3,
              '',
              true
            )}
            {renderDatePickerField(
              'budgetPeriodFrom',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_FROM,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.BUDGET_PERIOD_FROM
              ),
              3,
              true
            )}
            {renderDatePickerField(
              'budgetPeriodTo',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_TO,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.BUDGET_PERIOD_TO
              ),
              3,
              true
            )}

            {renderSelectField(
              'categoryCode',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.CATEGORY_CODE,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_CODE
              ),
              options.categories,
              6,
              true
            )}
            {renderTextField(
              'categoryName',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.CATEGORY_NAME,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_NAME
              ),
              6,
              '',
              true
            )}
            {renderTextField(
              'categoryLocalName',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.CATEGORY_LOCAL_NAME,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_LOCAL_NAME
              ),
              6,
              '',
              true
            )}

            {renderSelectField(
              'subCategoryCode',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.SUB_CATEGORY_CODE,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SUB_CATEGORY_CODE
              ),
              options.subCategories,
              6,
              true
            )}
            {renderTextField(
              'subCategoryName',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.SUB_CATEGORY_NAME,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SUB_CATEGORY_NAME
              ),
              6,
              '',
              true
            )}
            {renderTextField(
              'subCategoryLocalName',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.SUB_CATEGORY_LOCAL_NAME,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SUB_CATEGORY_LOCAL_NAME
              ),
              6,
              '',
              true
            )}

            {renderSelectField(
              'serviceCode',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.SERVICE_CODE,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_CODE
              ),
              options.services,
              6,
              true
            )}
            {renderTextField(
              'serviceName',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.SERVICE_NAME,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_NAME
              ),
              6,
              '',
              true
            )}
            {renderTextField(
              'serviceLocalName',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.SERVICE_LOCAL_NAME,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_LOCAL_NAME
              ),
              6,
              '',
              true
            )}

            {renderTextField(
              'totalCost',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.TOTAL_COST,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.TOTAL_COST
              )
            )}
            {renderTextField(
              'vatAmount',
              labelFor(
                BUDGET_LABELS.FORM_FIELDS.VAT_AMOUNT,
                BUDGET_LABELS.FALLBACKS.FORM_FIELDS.VAT_AMOUNT
              )
            )}
          </Grid>
        </CardContent>
      </Card>
    </LocalizationProvider>
  )
}

export default BudgetStep1
