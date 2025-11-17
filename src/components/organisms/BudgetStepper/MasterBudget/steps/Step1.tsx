'use client'

import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react'
import { useGetEnhanced } from '@/hooks/useApiEnhanced'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { 
  budgetCategoryService, 
  type BudgetCategoryResponse 
} from '@/services/api/budgetApi/budgetCategoryService'
import { useBudgetLabelsWithCache } from '@/hooks/budget/useBudgetLabelsWithCache'
import { useAppStore } from '@/store'
import { MASTER_BUDGET_LABELS } from '@/constants/mappings/budgetLabels'
import { budgetMasterStep1Schema } from '@/lib/budgetSchemas'

import {
  Card,
  CardContent,
  Grid,
  TextField,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

interface Step1Props {
  onSaveAndNext?: (data: { id: string }) => void
  savedId?: string | null
  isEditMode?: boolean
  isReadOnly?: boolean
  refreshKey?: number
}

export interface Step1Ref {
  handleSaveAndNext: () => Promise<void>
}

const Step1 = forwardRef<Step1Ref, Step1Props>(
  ({ onSaveAndNext, savedId, isEditMode, isReadOnly = false }, ref) => {
    const {
      control,
      watch,
      setValue,
      trigger,
      formState: { errors },
      clearErrors,
      setError,
    } = useFormContext()

    // Get labels from API
    const { getLabel } = useBudgetLabelsWithCache('EN')
    const currentLanguage = useAppStore((state) => state.language)

    const {
      data: existingBudgetData,
      isLoading: isLoadingExistingData,
    } = useGetEnhanced<BudgetCategoryResponse>(
      API_ENDPOINTS.BUDGET_CATEGORY.GET_BY_ID(
        (savedId || 0).toString()
      ),
      {},
      {
        enabled: Boolean(isEditMode && savedId),
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
      if (isEditMode && existingBudgetData && !isLoadingExistingData) {
        setValue('chargeTypeId', existingBudgetData.chargeTypeId?.toString() || '')
        setValue('chargeType', existingBudgetData.chargeType || '')
        setValue('groupNameId', existingBudgetData.serviceChargeGroupId?.toString() || '')
        setValue('groupName', existingBudgetData.serviceChargeGroupName || '')
        setValue('categoryCode', existingBudgetData.categoryCode || '')
        setValue('categoryName', existingBudgetData.categoryName || '')
        setValue('categorySubCode', existingBudgetData.categorySubCode || '')
        setValue('categorySubName', existingBudgetData.categorySubName || '')
        setValue('categorySubToSubCode', existingBudgetData.categorySubToSubCode || '')
        setValue('categorySubToSubName', existingBudgetData.categorySubToSubName || '')
        setValue('serviceCode', existingBudgetData.serviceCode || '')
        setValue('serviceName', existingBudgetData.serviceName || '')
        setValue('provisionalBudgetCode', existingBudgetData.provisionalBudgetCode || '')
      }
    }, [
      existingBudgetData,
      isLoadingExistingData,
      isEditMode,
      setValue,
    ])
    const handleSaveAndNext = async (): Promise<void> => {
      try {
        console.log('[Step1] handleSaveAndNext called')
        // Get form values
        const formValues = watch()
        console.log('[Step1] Form values:', formValues)
        
        // First, trigger React Hook Form validation to show field-level errors
        const fieldsToValidate = [
          'chargeTypeId',
          'chargeType',
          'groupName',
          'categoryCode',
          'categoryName',
          'categorySubCode',
          'categorySubName',
          'categorySubToSubCode',
          'categorySubToSubName',
          'serviceCode',
          'serviceName',
          'provisionalBudgetCode',
        ] as const
        
        // Trigger validation for all required fields
        const isValid = await trigger(fieldsToValidate as unknown as any[])
        console.log('[Step1] React Hook Form validation result:', isValid)
        
        // Validate with Zod schema
        const zodResult = budgetMasterStep1Schema.safeParse(formValues)
        console.log('[Step1] Zod validation result:', {
          success: zodResult.success,
          errors: zodResult.success ? [] : zodResult.error.issues.map(i => ({ path: i.path, message: i.message }))
        })
        
        // Log detailed validation errors for debugging
        if (!zodResult.success) {
          console.error('[Step1] Zod validation errors:', zodResult.error.issues)
          zodResult.error.issues.forEach((issue) => {
            console.error(`[Step1] Validation error - Field: ${issue.path.join('.')}, Message: ${issue.message}, Value: ${JSON.stringify(formValues[issue.path[0] as keyof typeof formValues])}`)
          })
        }

        if (!isValid || !zodResult.success) {
          console.log('[Step1] Validation failed - preventing API call')
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

        // Build payload matching API structure
        const payload: any = {
          chargeTypeId: Number(formValues.chargeTypeId),
          chargeType: formValues.chargeType,
          serviceChargeGroupId: formValues.groupNameId ? Number(formValues.groupNameId) : 0,
          serviceChargeGroupName: formValues.groupName, // Map groupName to serviceChargeGroupName
          categoryCode: formValues.categoryCode,
          categoryName: formValues.categoryName,
          categorySubCode: formValues.categorySubCode,
          categorySubName: formValues.categorySubName,
          categorySubToSubCode: formValues.categorySubToSubCode,
          categorySubToSubName: formValues.categorySubToSubName,
          serviceCode: formValues.serviceCode,
          serviceName: formValues.serviceName,
          provisionalBudgetCode: formValues.provisionalBudgetCode,
          enabled: true,
          deleted: false,
        }

        console.log('[Step1] Payload prepared:', payload)
        let response: BudgetCategoryResponse
        if (isEditMode && savedId) {
          // Update existing budget - include id in payload
          const updatePayload = {
            ...payload,
            id: Number(savedId),
          }
          console.log('[Step1] Updating budget with ID:', savedId)
          console.log('[Step1] Update payload with id:', updatePayload)
          response = await budgetCategoryService.updateBudgetCategory(
            Number(savedId),
            updatePayload
          )
          console.log('[Step1] Update response:', response)
          if (onSaveAndNext) {
            onSaveAndNext({ id: savedId })
          }
        } else {
          // Create new budget
          console.log('[Step1] Creating new budget')
          response = await budgetCategoryService.createBudgetCategory(payload)
          console.log('[Step1] Create response:', response)
          if (onSaveAndNext) {
            onSaveAndNext({ id: response.id.toString() })
          }
        }
      } catch (error) {
        throw error
      }
    }
    useImperativeHandle(
      ref,
      () => {
        console.log('[Step1] useImperativeHandle - exposing handleSaveAndNext')
        return {
          handleSaveAndNext,
        }
      },
      [handleSaveAndNext]
    )
    
    // Debug: Log when component mounts and ref is set
    useEffect(() => {
      console.log('[Step1] Component mounted/updated', {
        isEditMode,
        savedId,
        hasOnSaveAndNext: !!onSaveAndNext
      })
    }, [isEditMode, savedId, onSaveAndNext])
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
                  disabled={isReadOnly}
                  error={!!errors[name] && !isReadOnly}
                  helperText={errors[name]?.message as string}
                  InputLabelProps={{
                    sx: {
                      ...getLabelSx(),
                      ...(!!errors[name] &&
                        !isReadOnly && {
                          color: '#d32f2f',
                          '&.Mui-focused': { color: '#d32f2f' },
                          '&.MuiFormLabel-filled': { color: '#d32f2f' },
                        }),
                    },
                  }}
                  InputProps={{
                    sx: {
                      ...valueSx,
                      ...(isReadOnly && {
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
                    ...(isReadOnly && {
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#E5E7EB' },
                        '&:hover fieldset': { borderColor: '#E5E7EB' },
                        '&.Mui-focused fieldset': { borderColor: '#E5E7EB' },
                      },
                    }),
                    ...(!!errors[name] &&
                      !isReadOnly && {
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
              {renderTextField(
                'chargeTypeId',
                  MASTER_BUDGET_LABELS.FORM_FIELDS.CHARGE_TYPE_ID,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CHARGE_TYPE_ID,
              '',
                true
              )}
              {renderTextField(
                'chargeType',
                  MASTER_BUDGET_LABELS.FORM_FIELDS.CHARGE_TYPE,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CHARGE_TYPE,
                '',
                true
              )}
              {renderTextField(
              'groupName',
                  MASTER_BUDGET_LABELS.FORM_FIELDS.GROUP_NAME,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.GROUP_NAME,
              '',
                true
              )}
              {renderTextField(
                'categoryCode',
                  MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_CODE,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_CODE,
              '',
                true
              )}
              {renderTextField(
                'categoryName',
                  MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_NAME,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_NAME,
                '',
                true
              )}
              {renderTextField(
                'categorySubCode',
                  MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_CODE,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_SUB_CODE,
              '',
                true
              )}
              {renderTextField(
                'categorySubName',
                  MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_NAME,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_SUB_NAME,
                '',
                true
              )}
              {renderTextField(
                'categorySubToSubCode',
                  MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_TO_SUB_CODE,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_SUB_TO_SUB_CODE,
              '',
                true
              )}
              {renderTextField(
                'categorySubToSubName',
                  MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_TO_SUB_NAME,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_SUB_TO_SUB_NAME,
                '',
                true
              )}
              {renderTextField(
                'serviceCode',
                  MASTER_BUDGET_LABELS.FORM_FIELDS.SERVICE_CODE,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_CODE,
              '',
                true
              )}
              {renderTextField(
                'serviceName',
                  MASTER_BUDGET_LABELS.FORM_FIELDS.SERVICE_NAME,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_NAME,
                '',
                true
              )}
              {renderTextField(
                'provisionalBudgetCode',
                  MASTER_BUDGET_LABELS.FORM_FIELDS.PROVISIONAL_BUDGET_CODE,
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.PROVISIONAL_BUDGET_CODE,
                '',
                true
              )}
            </Grid>
          </CardContent>
        </Card>
    )
  }
)

Step1.displayName = 'Step1'

export default Step1
