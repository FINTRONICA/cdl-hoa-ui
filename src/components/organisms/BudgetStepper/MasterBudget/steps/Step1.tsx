'use client'

import React, { useCallback, useEffect, useState } from 'react'
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

import { useMasterBudgetData } from './BudgetDataProvider'
import { masterBudgetService } from '@/services/api/budget/masterBudgetService'
import type { MasterBudgetData, BudgetDropdownOption } from './MasterBudgetType'
import type { BudgetMasterStep1FormValues } from '@/lib/validation/budgetSchemas'
import { useBudgetLabels } from '@/hooks/budget/useBudgetLabels'
import { MASTER_BUDGET_LABELS } from '@/constants/mappings/budgetLabels'
import { FormError } from '@/components/atoms/FormError'
import { getFieldMaxLength } from '@/lib/validation/budgetSchemas'
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material'
import { Controller, useFormContext } from 'react-hook-form'

interface MasterBudgetStep1Props {
  savedId?: string | null
  isEditMode?: boolean
  onDataLoaded?: () => void
  isReadOnly?: boolean
  refreshKey?: number
}

const MasterBudgetStep1: React.FC<MasterBudgetStep1Props> = ({
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
  } = useFormContext<BudgetMasterStep1FormValues>()
  const { options } = useMasterBudgetData()
  const { getLabel } = useBudgetLabels('EN')
  const labelFor = useCallback(
    (configId: string, fallback: string) =>
      getLabel(configId, 'EN', fallback),
    [getLabel]
  )
  const [isFetching, setIsFetching] = useState(false)

  const chargeTypeId = watch('chargeTypeId')
  const groupNameId = watch('groupNameId')
  const categoryCode = watch('categoryCode')
  const categorySubCode = watch('categorySubCode')
  const categorySubToSubCode = watch('categorySubToSubCode')
  const serviceCode = watch('serviceCode')

  useEffect(() => {
    const syncChargeType = () => {
      if (chargeTypeId) {
        const match = options.chargeTypes.find(
          (item) => item.id === chargeTypeId
        )
        if (match) {
          setValue('chargeType', match.label, {
            shouldDirty: false,
            shouldTouch: true,
          })
        }
      }
    }

    syncChargeType()
  }, [chargeTypeId, options.chargeTypes, setValue])

  useEffect(() => {
    const syncGroupName = () => {
      if (groupNameId) {
        const match = options.groupNames.find((item) => item.id === groupNameId)
        if (match) {
          setValue('groupName', match.label, {
            shouldDirty: false,
            shouldTouch: true,
          })
        }
      } else {
        // Clear groupName when groupNameId is cleared
        setValue('groupName', '', {
          shouldDirty: false,
          shouldTouch: true,
        })
      }
    }

    syncGroupName()
  }, [groupNameId, options.groupNames, setValue])

  useEffect(() => {
    const syncCategory = () => {
      if (categoryCode) {
        const match = options.categories.find((item) => item.id === categoryCode)
        if (match) {
          setValue('categoryName', match.label, {
            shouldDirty: false,
            shouldTouch: true,
          })
        }
      }
    }

    syncCategory()
  }, [categoryCode, options.categories, setValue])

  useEffect(() => {
    const syncCategorySub = () => {
      if (categorySubCode) {
        const match = options.categorySubs.find((item) => item.id === categorySubCode)
        if (match) {
          setValue('categorySubName', match.label, {
            shouldDirty: false,
            shouldTouch: true,
          })
        }
      }
    }

    syncCategorySub()
  }, [categorySubCode, options.categorySubs, setValue])

  useEffect(() => {
    const syncCategorySubToSub = () => {
      if (categorySubToSubCode) {
        const match = options.categorySubToSubs.find((item) => item.id === categorySubToSubCode)
        if (match) {
          setValue('categorySubToSubName', match.label, {
            shouldDirty: false,
            shouldTouch: true,
          })
        }
      }
    }

    syncCategorySubToSub()
  }, [categorySubToSubCode, options.categorySubToSubs, setValue])

  useEffect(() => {
    const syncService = () => {
      if (serviceCode) {
        const match = options.services.find((item) => item.id === serviceCode)
        if (match) {
          setValue('serviceName', match.label, {
            shouldDirty: false,
            shouldTouch: true,
          })
        }
      }
    }

    syncService()
  }, [options.services, serviceCode, setValue])

  useEffect(() => {
    const fetchBudget = async () => {
      if (!isEditMode || !savedId) {
        onDataLoaded?.()
        return
      }

      try {
        setIsFetching(true)
        const budget = await masterBudgetService.getBudgetById(savedId)
        applyBudgetToForm(budget)
      } catch {
        toast.error('Failed to load master budget details. Please retry.')
      } finally {
        setIsFetching(false)
        onDataLoaded?.()
      }
    }

    fetchBudget()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, savedId, refreshKey])

  const applyBudgetToForm = (budget: MasterBudgetData) => {
    // Find groupNameId from the groupName label
    const groupNameMatch = options.groupNames.find(
      (item) => item.label === budget.groupName
    )
    
    const values = {
      chargeTypeId: String(budget.chargeTypeId),
      chargeType: budget.chargeType,
      groupNameId: groupNameMatch?.id ?? '',
      groupName: budget.groupName,
      categoryCode: budget.categoryCode,
      categoryName: budget.categoryName,
      categorySubCode: budget.categorySubCode,
      categorySubName: budget.categorySubName,
      categorySubToSubCode: budget.categorySubToSubCode,
      categorySubToSubName: budget.categorySubToSubName,
      serviceCode: budget.serviceCode,
      serviceName: budget.serviceName,
      provisionalBudgetCode: budget.provisionalBudgetCode,
      documents: [],
    } as BudgetMasterStep1FormValues

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

  const renderTextField = (
    name: keyof BudgetMasterStep1FormValues,
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
    name: keyof BudgetMasterStep1FormValues,
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

  return (
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
            Loading saved master budget details...
          </Typography>
        )}

        <Grid container rowSpacing={4} columnSpacing={2}>
          {renderSelectField(
            'chargeTypeId',
            labelFor(
              MASTER_BUDGET_LABELS.FORM_FIELDS.CHARGE_TYPE_ID,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CHARGE_TYPE_ID
            ),
            options.chargeTypes,
            6,
            true
          )}
          {renderTextField(
            'chargeType',
            labelFor(
              MASTER_BUDGET_LABELS.FORM_FIELDS.CHARGE_TYPE,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CHARGE_TYPE
            ),
            6,
            '',
            true
          )}
          {renderSelectField(
            'groupNameId',
            labelFor(
              MASTER_BUDGET_LABELS.FORM_FIELDS.GROUP_NAME,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.GROUP_NAME
            ),
            options.groupNames,
            12,
            true
          )}
          {/* groupName is auto-filled from groupNameId, stored but not displayed */}

          {renderSelectField(
            'categoryCode',
            labelFor(
              MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_CODE,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_CODE
            ),
            options.categories,
            6,
            true
          )}
          {renderTextField(
            'categoryName',
            labelFor(
              MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_NAME,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_NAME
            ),
            6,
            '',
            true
          )}

          {renderSelectField(
            'categorySubCode',
            labelFor(
              MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_CODE,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_SUB_CODE
            ),
            options.categorySubs,
            6,
            true
          )}
          {renderTextField(
            'categorySubName',
            labelFor(
              MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_NAME,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_SUB_NAME
            ),
            6,
            '',
            true
          )}

          {renderSelectField(
            'categorySubToSubCode',
            labelFor(
              MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_TO_SUB_CODE,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_SUB_TO_SUB_CODE
            ),
            options.categorySubToSubs,
            6,
            true
          )}
          {renderTextField(
            'categorySubToSubName',
            labelFor(
              MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_TO_SUB_NAME,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_SUB_TO_SUB_NAME
            ),
            6,
            '',
            true
          )}

          {renderSelectField(
            'serviceCode',
            labelFor(
              MASTER_BUDGET_LABELS.FORM_FIELDS.SERVICE_CODE,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_CODE
            ),
            options.services,
            6,
            true
          )}
          {renderTextField(
            'serviceName',
            labelFor(
              MASTER_BUDGET_LABELS.FORM_FIELDS.SERVICE_NAME,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_NAME
            ),
            6,
            '',
            true
          )}

          {renderTextField(
            'provisionalBudgetCode',
            labelFor(
              MASTER_BUDGET_LABELS.FORM_FIELDS.PROVISIONAL_BUDGET_CODE,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.PROVISIONAL_BUDGET_CODE
            ),
            6,
            '',
            true
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default MasterBudgetStep1

