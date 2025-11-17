'use client'

import { forwardRef, useImperativeHandle, useCallback, useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Divider,
} from '@mui/material'
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { Controller, useFormContext } from 'react-hook-form'
import { useBudgetManagementFirmLabelsApi } from '@/hooks/useBudgetManagementFirmLabelsApi'
import { useAppStore } from '@/store'
import { BudgetCategoryService } from '@/services/api/budgetApi/budgetCategoryService'
import { BudgetStep2Schema } from '@/lib/validation/budgetSchemas'
import type { BudgetCategoryUIData } from '@/services/api/budgetApi/budgetCategoryService'
import { BUDGET_LABELS } from '@/constants/mappings/budgetLabels'
import { FormError } from '@/components/atoms/FormError'
import { budgetItemsService } from '@/services/api/budgetApi/budgetItemsService'
import type { BudgetItemRequest } from '@/constants/mappings/budgetMapper'

interface Step2Props {
  onSaveAndNext?: () => void
  budgetId?: number | null
  isEditMode?: boolean
  isViewMode?: boolean
}

export interface Step2Ref {
  handleSaveAndNext: () => Promise<void>
}

const Step2 = forwardRef<Step2Ref, Step2Props>(
  (
    { onSaveAndNext, isViewMode = false },
    ref
  ) => {
    const {
      control,
      watch,
      setValue,
      formState: { errors },
      setError,
      clearErrors,
      trigger,
    } = useFormContext()

    const { getLabel } = useBudgetManagementFirmLabelsApi()
    const currentLanguage = useAppStore((state) => state.language)

    // Budget category dropdown state
    const [budgetCategoryOptions, setBudgetCategoryOptions] = useState<{ id: number; displayName: string; settingValue: string }[]>([])
    const [loadingBudgetCategories, setLoadingBudgetCategories] = useState(true)
    
    // Budget items state
    const budgetItems = watch('budgetItems') || []

    // Fetch Budget Categories
    useEffect(() => {
      const fetchBudgetCategories = async () => {
        try {
          setLoadingBudgetCategories(true)
          const response = await BudgetCategoryService.getBudgetCategories(0, 1000)
          const options = response.content.map((item: BudgetCategoryUIData) => ({
            id: item.id,
            displayName: item.categoryName || item.serviceName || `Budget Category ${item.id}`,
            settingValue: item.id.toString(),
          }))
          setBudgetCategoryOptions(options)
        } catch (error) {
          console.error('Error fetching budget categories:', error)
          setBudgetCategoryOptions([])
        } finally {
          setLoadingBudgetCategories(false)
        }
      }
      fetchBudgetCategories()
    }, [])

    const handleSaveAndNext = useCallback(async () => {
      try {
        // Get form values
        const budgetCategoryId = watch('budgetCategoryId')
        const currentBudgetItems = watch('budgetItems') || []

        // Build fields to validate
        const fieldsToValidate: string[] = ['budgetCategoryId']
        currentBudgetItems.forEach((_: unknown, index: number) => {
          fieldsToValidate.push(`budgetItems.${index}.subCategoryCode`)
          fieldsToValidate.push(`budgetItems.${index}.subCategoryName`)
          fieldsToValidate.push(`budgetItems.${index}.serviceCode`)
          fieldsToValidate.push(`budgetItems.${index}.serviceName`)
          fieldsToValidate.push(`budgetItems.${index}.totalBudget`)
        })

        // Trigger validation
        const isValid = await trigger(fieldsToValidate)

        // Validate with Zod
        const formValues = {
          budgetCategoryId,
          budgetItems: currentBudgetItems || [],
        }

        const zodResult = BudgetStep2Schema.safeParse(formValues)
        
        if (!isValid || !zodResult.success) {
          clearErrors(fieldsToValidate as unknown as string[])
          
          if (!zodResult.success) {
            zodResult.error.issues.forEach((issue) => {
              const path = issue.path || []
              const fieldPath = path.join('.')
              if (fieldPath) {
                setError(fieldPath as keyof typeof errors, {
                  type: 'manual',
                  message: issue.message,
                })
              }
            })
          }
          
          await trigger(fieldsToValidate)
          throw new Error('Please fill all required fields correctly')
        }
        
        // Save budget items if any
        if (currentBudgetItems.length > 0 && budgetCategoryId) {
          const categoryId = parseInt(budgetCategoryId)
          for (const item of currentBudgetItems) {
            const itemData = item as {
              id?: number
              subCategoryCode?: string
              subCategoryName?: string
              subCategoryNameLocale?: string
              serviceCode?: string
              provisionalServiceCode?: string
              serviceName?: string
              serviceNameLocale?: string
              totalBudget?: string | number
              availableBudget?: string | number
              utilizedBudget?: string | number
            }
            
            const payload: BudgetItemRequest = {
              subCategoryCode: itemData.subCategoryCode || '',
              subCategoryName: itemData.subCategoryName || '',
              subCategoryNameLocale: itemData.subCategoryNameLocale || '',
              serviceCode: itemData.serviceCode || '',
              provisionalServiceCode: itemData.provisionalServiceCode || '',
              serviceName: itemData.serviceName || '',
              serviceNameLocale: itemData.serviceNameLocale || '',
              totalBudget: typeof itemData.totalBudget === 'string' ? parseFloat(itemData.totalBudget) || 0 : itemData.totalBudget || 0,
              availableBudget: typeof itemData.availableBudget === 'string' ? parseFloat(itemData.availableBudget) || 0 : itemData.availableBudget || 0,
              utilizedBudget: typeof itemData.utilizedBudget === 'string' ? parseFloat(itemData.utilizedBudget) || 0 : itemData.utilizedBudget || 0,
              enabled: true,
              deleted: false,
              budgetCategoryDTO: {
                id: categoryId,
                enabled: true,
              },
            }

            if (itemData.id) {
              await budgetItemsService.updateBudgetItems(itemData.id, payload)
              } else {
              await budgetItemsService.createBudgetItems(payload)
            }
          }
        }

        if (onSaveAndNext) {
          onSaveAndNext()
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to save budget items'
        throw new Error(errorMessage)
      }
    }, [watch, trigger, setError, clearErrors, onSaveAndNext])

    useImperativeHandle(
      ref,
      () => ({
        handleSaveAndNext,
      }),
      [handleSaveAndNext]
    )

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

    const valueSx = {
      color: '#1E2939',
      fontFamily: 'Outfit',
      fontWeight: 400,
      fontStyle: 'normal',
      fontSize: '14px',
      letterSpacing: 0,
      wordBreak: 'break-word',
    }

    const labelSx = {
      color: '#6A7282',
      fontFamily: 'Outfit',
      fontWeight: 400,
      fontStyle: 'normal',
      fontSize: '12px',
      letterSpacing: 0,
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
      },
    }

    const renderTextField = (
      name: string,
      configId: string,
      fallbackLabel: string,
      gridMd = 6,
      disabled = false,
      required = false,
      type: 'text' | 'number' = 'text'
    ) => {
      const label = getLabel(configId, currentLanguage, fallbackLabel)
      return (
        <Grid size={{ xs: 12, md: gridMd }}>
          <Controller
            name={name}
            control={control}
            rules={required ? { required: `${label} is required` } : {}}
            render={({ field }) => (
              <>
                <TextField
                  {...field}
                  label={label}
                  type={type}
                  fullWidth
                  disabled={disabled || isViewMode}
                  error={!!errors[name]}
                  helperText={errors[name]?.message as string}
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
                  required={required}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e)
                    if (errors[name]) {
                      clearErrors(name as keyof typeof errors)
                    }
                    trigger(name as keyof typeof errors)
                  }}
                  onBlur={() => {
                    field.onBlur()
                    trigger(name as keyof typeof errors)
                  }}
                />
                {errors[name] && (
                  <FormError
                    error={errors[name]?.message as string}
                    touched={true}
                  />
                )}
              </>
            )}
          />
        </Grid>
      )
    }

    const addBudgetItem = () => {
      const currentItems = budgetItems || []
      const newItem = {
        subCategoryCode: '',
        subCategoryName: '',
        subCategoryNameLocale: '',
        serviceCode: '',
        provisionalServiceCode: '',
        serviceName: '',
        serviceNameLocale: '',
        totalBudget: '',
        availableBudget: '',
        utilizedBudget: '',
      }
      setValue('budgetItems', [...currentItems, newItem])
    }

    const removeBudgetItem = (index: number) => {
      const currentItems = budgetItems || []
      const updatedItems = currentItems.filter((_: unknown, i: number) => i !== index)
      setValue('budgetItems', updatedItems)
    }

    const renderSelectField = (
      name: string,
      configId: string,
      fallbackLabel: string,
      options: { id: number; displayName: string; settingValue: string }[],
      gridMd: number = 6,
      required = false,
      loading = false
    ) => {
      const label = getLabel(configId, currentLanguage, fallbackLabel)
      return (
        <Grid size={{ xs: 12, md: gridMd }}>
          <Controller
            name={name}
            control={control}
            rules={required ? { required: `${label} is required` } : {}}
            defaultValue={''}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors[name]} required={required}>
                <InputLabel sx={labelSx} required={required}>
                  {loading ? `Loading...` : label}
                </InputLabel>
                <Select
                  {...field}
                  label={loading ? `Loading...` : label}
                  required={required}
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
                  disabled={loading || isViewMode}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e)
                    if (errors[name]) {
                      clearErrors(name as keyof typeof errors)
                    }
                    trigger(name as keyof typeof errors)
                  }}
                  onBlur={() => {
                    field.onBlur()
                    trigger(name as keyof typeof errors)
                  }}
                >
                  {loading ? (
                    <MenuItem disabled value="">
                      <em>Loading options...</em>
                    </MenuItem>
                  ) : options.length === 0 ? (
                    <MenuItem disabled value="">
                      <em>No options available</em>
                    </MenuItem>
                  ) : (
                    options.map((option) => (
                    <MenuItem key={option.id} value={option.settingValue}>
                      {option.displayName}
                    </MenuItem>
                    ))
                  )}
                </Select>
                  <FormError
                    error={errors[name]?.message as string}
                    touched={true}
                  />
              </FormControl>
            )}
          />
        </Grid>
      )
    }

      return (
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
            {/* Budget Category Dropdown */}
            {renderSelectField(
              'budgetCategoryId',
              BUDGET_LABELS.FORM_FIELDS.SERVICE_CHARGE_GROUP_NAME,
              'Budget Category',
              budgetCategoryOptions,
              12,
                true,
              loadingBudgetCategories
            )}

            {/* Budget Items Section */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ ...labelSx, fontWeight: 600, fontSize: '16px' }}>
                  Budget Items
                </Typography>
                {!isViewMode && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addBudgetItem}
                    sx={{
                      textTransform: 'none',
                      borderColor: '#2563EB',
                      color: '#2563EB',
                      '&:hover': {
                        borderColor: '#1D4ED8',
                        backgroundColor: '#EFF6FF',
                      },
                    }}
                  >
                    Add Budget Item
                  </Button>
                )}
              </Box>
              <Divider sx={{ mb: 3 }} />

              {budgetItems.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ color: '#6A7282', fontSize: '14px' }}>
                    No budget items added. Click &quot;Add Budget Item&quot; to add one.
                  </Typography>
                </Box>
              ) : (
                budgetItems.map((_item: unknown, index: number) => (
                  <Box key={index} sx={{ mb: 4, p: 3, border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#FAFAFA' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ ...labelSx, fontWeight: 600 }}>
                        Budget Item {index + 1}
                      </Typography>
                      {!isViewMode && (
                        <Button
                          variant="text"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => removeBudgetItem(index)}
                          sx={{ textTransform: 'none' }}
                        >
                          Remove
                        </Button>
                      )}
                    </Box>
                    <Grid container rowSpacing={3} columnSpacing={2}>
                      {/* Sub-Category Code */}
              {renderTextField(
                        `budgetItems.${index}.subCategoryCode`,
                        'CDL_BDG_SUB_CATEGORY_CODE',
                        'Sub-Category Code',
                        6,
                        false,
                true
              )}

                      {/* Sub-Category Name */}
              {renderTextField(
                        `budgetItems.${index}.subCategoryName`,
                        'CDL_BDG_SUB_CATEGORY_NAME',
                        'Sub-Category Name',
                        6,
                        false,
                true
              )}

                      {/* Sub-Category Name (Local) */}
              {renderTextField(
                        `budgetItems.${index}.subCategoryNameLocale`,
                        'CDL_BDG_SUB_CATEGORY_NAME_LOCALE',
                        'Sub-Category Name (Local)',
                        6,
                false,
                false
              )}

                      {/* Service Code */}
              {renderTextField(
                        `budgetItems.${index}.serviceCode`,
                        'CDL_BDG_SERVICE_CODE',
                        'Service Code',
                        6,
                false,
                        true
              )}

                      {/* Provisional Service Code */}
              {renderTextField(
                        `budgetItems.${index}.provisionalServiceCode`,
                        'CDL_BDG_PROVISIONAL_SERVICE_CODE',
                        'Provisional Service Code',
                        6,
                false,
                false
              )}

                      {/* Service Name */}
               {renderTextField(
                        `budgetItems.${index}.serviceName`,
                        'CDL_BDG_SERVICE_NAME',
                        'Service Name',
                        6,
                false,
                        true
              )}

                      {/* Service Name (Local) */}
              {renderTextField(
                        `budgetItems.${index}.serviceNameLocale`,
                        'CDL_BDG_SERVICE_NAME_LOCALE',
                        'Service Name (Local)',
                        6,
                false,
                false
              )}

                      {/* Total Budget */}
                {renderTextField(
                        `budgetItems.${index}.totalBudget`,
                        'CDL_BDG_TOTAL_BUDGET',
                        'Total Budget',
                        4,
                false,
                        true,
                        'number'
              )}

                      {/* Available Budget */}
              {renderTextField(
                        `budgetItems.${index}.availableBudget`,
                        'CDL_BDG_AVAILABLE_BUDGET',
                        'Available Budget',
                        4,
                false,
                        false,
                        'number'
              )}

                      {/* Utilized Budget */}
{renderTextField(
                        `budgetItems.${index}.utilizedBudget`,
                        'CDL_BDG_UTILIZED_BUDGET',
                        'Utilized Budget',
                        4,
                false,
                false,
                        'number'
                      )}
                    </Grid>
                  </Box>
                ))
              )}
            </Grid>
            </Grid>
          </CardContent>
        </Card>
    )
  }
)

Step2.displayName = 'Step2'

export default Step2
