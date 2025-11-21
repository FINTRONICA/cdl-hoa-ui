'use client'

import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
} from 'react'
import { useGetEnhanced } from '@/hooks/useApiEnhanced'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import {
  budgetCategoryService,
  type BudgetCategoryResponse,
} from '@/services/api/budgetApi/budgetCategoryService'
import { useBudgetLabelsWithCache } from '@/hooks/budget/useBudgetLabelsWithCache'
import { useAppStore } from '@/store'
import { MASTER_BUDGET_LABELS } from '@/constants/mappings/budgetLabels'
import { budgetMasterStep1Schema } from '@/lib/budgetSchemas'
import { Refresh as RefreshIcon } from '@mui/icons-material'
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { useBudgetManagementFirmLabelsApi } from '@/hooks/useBudgetManagementFirmLabelsWithCache'

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

    // State for ID generation
    const [generatedId, setGeneratedId] = React.useState<string>('')
    const [isGeneratingId, setIsGeneratingId] = React.useState(false)

    // Get labels from API
    const { getLabel } = useBudgetLabelsWithCache('EN')
    const currentLanguage = useAppStore((state) => state.language)

    const { data: existingBudgetData, isLoading: isLoadingExistingData } =
      useGetEnhanced<BudgetCategoryResponse>(
        API_ENDPOINTS.BUDGET_CATEGORY.GET_BY_ID((savedId || 0).toString()),
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
    // ✅ FIX: Initialize generatedId from form value (following DeveloperStepper pattern)
    useEffect(() => {
      const subscription = watch((value, { name }) => {
        if (name === 'chargeTypeId' && value.chargeTypeId) {
          setGeneratedId(value.chargeTypeId)
        }
      })
      return () => subscription.unsubscribe()
    }, [watch])

    // ✅ FIX: Also watch chargeTypeId directly to ensure generatedId stays in sync (following DeveloperStepper pattern)
    const chargeTypeIdValue = watch('chargeTypeId')
    useEffect(() => {
      if (chargeTypeIdValue && chargeTypeIdValue !== generatedId) {
        setGeneratedId(chargeTypeIdValue)
      }
    }, [chargeTypeIdValue, generatedId])

    // Generate new budget category ID
    const handleGenerateNewId = async () => {
      try {
        setIsGeneratingId(true)
        // ✅ FIX: Generate a numeric ID for chargeTypeId (API expects number, not string)
        // Use timestamp + random component to ensure uniqueness
        const numericId = Date.now() + Math.floor(Math.random() * 1000) // Timestamp + random 0-999
        const idString = numericId.toString()
        setGeneratedId(idString)
        setValue('chargeTypeId', idString, {
          shouldValidate: true,
          shouldDirty: true,
        })
        console.log('[Step1] ✅ Generated numeric chargeTypeId:', numericId)
      } catch {
        // Handle error silently
      } finally {
        setIsGeneratingId(false)
      }
    }
    const { labels: budgetCategoryLabels, getLabel: getBudgetCategoryLabel } =
      useBudgetManagementFirmLabelsApi()
    const getBudgetCategoryLabelDynamic = useCallback(
      (configId: string): string => {
        const fallback = getBudgetCategoryLabel(configId)
        if (budgetCategoryLabels) {
          return getLabel(configId, currentLanguage, fallback)
        }
        return fallback
      },
      [budgetCategoryLabels, currentLanguage, getLabel, getBudgetCategoryLabel]
    )
    // ✅ FIX: Pre-populate form when existing data is loaded (following DeveloperStepper pattern)
    useEffect(() => {
      if (isEditMode && existingBudgetData && !isLoadingExistingData) {
        // ✅ FIX: Handle null chargeTypeId - if null, try to generate one or leave empty
        // The API returns chargeTypeId as null, so we need to handle this case
        const chargeTypeIdValue =
          existingBudgetData.chargeTypeId?.toString() || ''

        // If chargeTypeId is null from API, we should still try to display it if it exists in the form
        // But since API returns null, we'll leave it empty and let user generate if needed
        if (!chargeTypeIdValue && existingBudgetData.id) {
          // If we have an ID but no chargeTypeId, we could potentially use the ID
          // But for now, we'll leave it empty as the API doesn't provide it
          console.log(
            '[Step1] ⚠️ chargeTypeId is null in API response for id:',
            existingBudgetData.id
          )
        }

        // ✅ FIX: Set generatedId first, then set form value (following DeveloperStepper pattern)
        setGeneratedId(chargeTypeIdValue)
        // Use setValue with shouldValidate and shouldDirty to ensure the field updates properly
        setValue('chargeTypeId', chargeTypeIdValue, {
          shouldValidate: true,
          shouldDirty: false, // Don't mark as dirty when loading existing data
        })
        setValue('chargeType', existingBudgetData.chargeType || '')
        setValue(
          'groupNameId',
          existingBudgetData.serviceChargeGroupId?.toString() || ''
        )
        setValue('groupName', existingBudgetData.serviceChargeGroupName || '')
        setValue('categoryCode', existingBudgetData.categoryCode || '')
        setValue('categoryName', existingBudgetData.categoryName || '')
        setValue('categorySubCode', existingBudgetData.categorySubCode || '')
        setValue('categorySubName', existingBudgetData.categorySubName || '')
        setValue(
          'categorySubToSubCode',
          existingBudgetData.categorySubToSubCode || ''
        )
        setValue(
          'categorySubToSubName',
          existingBudgetData.categorySubToSubName || ''
        )
        setValue('serviceCode', existingBudgetData.serviceCode || '')
        setValue('serviceName', existingBudgetData.serviceName || '')
        setValue(
          'provisionalBudgetCode',
          existingBudgetData.provisionalBudgetCode || ''
        )

        console.log('[Step1] ✅ Form populated with existing data')
        console.log(
          '[Step1] existingBudgetData.chargeTypeId:',
          existingBudgetData.chargeTypeId
        )
        console.log(
          '[Step1] chargeTypeIdValue (after processing):',
          chargeTypeIdValue
        )
        console.log('[Step1] generatedId (set to):', chargeTypeIdValue)
      }
    }, [existingBudgetData, isLoadingExistingData, isEditMode, setValue])
    const handleSaveAndNext = useCallback(async (): Promise<void> => {
      try {
        // ✅ FIX: Get fresh form values
        let formValues = watch()

        // ✅ FIX: Get chargeTypeId from multiple sources (form value, generatedId state, or watch again)
        // Check all possible sources to ensure we capture the ID
        const chargeTypeIdFromForm = formValues.chargeTypeId
        const chargeTypeIdFromState = generatedId
        const chargeTypeIdFromWatch = watch('chargeTypeId')

        console.log('[Step1] ===== Checking chargeTypeId sources =====')
        console.log('[Step1] chargeTypeIdFromForm:', chargeTypeIdFromForm)
        console.log('[Step1] chargeTypeIdFromState:', chargeTypeIdFromState)
        console.log('[Step1] chargeTypeIdFromWatch:', chargeTypeIdFromWatch)

        // ✅ FIX: Use the first available value
        let finalChargeTypeId =
          chargeTypeIdFromForm ||
          chargeTypeIdFromState ||
          chargeTypeIdFromWatch ||
          ''

        // ✅ FIX: Ensure chargeTypeId is generated before saving (if not in edit mode)
        if (!isEditMode && !finalChargeTypeId) {
          // Auto-generate ID if not present
          try {
            console.log(
              '[Step1] ⚠️ chargeTypeId is missing, auto-generating...'
            )
            // ✅ FIX: Generate a numeric ID for chargeTypeId (API expects number, not string)
            // Use timestamp + random component to ensure uniqueness
            const numericId = Date.now() + Math.floor(Math.random() * 1000) // Timestamp + random 0-999
            const newId = numericId.toString()
            setGeneratedId(newId)
            setValue('chargeTypeId', newId, {
              shouldValidate: true,
              shouldDirty: true,
            })
            console.log(
              '[Step1] ✅ Auto-generated numeric chargeTypeId:',
              numericId,
              'as string:',
              newId
            )
            // ✅ FIX: Update finalChargeTypeId immediately with the new ID
            finalChargeTypeId = newId
            // ✅ FIX: Re-watch to get updated form values after setValue
            formValues = watch()
            // Also update the formValues object directly to ensure it's used
            formValues.chargeTypeId = newId
            console.log(
              '[Step1] ✅ Updated finalChargeTypeId to:',
              finalChargeTypeId
            )
            console.log(
              '[Step1] ✅ Updated formValues.chargeTypeId to:',
              formValues.chargeTypeId
            )
          } catch (error) {
            console.error(
              '[Step1] ❌ Failed to auto-generate chargeTypeId:',
              error
            )
            setError('chargeTypeId', {
              type: 'manual',
              message: 'Please generate a Category ID before saving',
            })
            throw new Error('Please generate a Category ID before saving')
          }
        }

        const fieldsToValidate = [
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

        const isValid = await trigger(
          fieldsToValidate as unknown as Array<string>
        )
        const zodResult = budgetMasterStep1Schema.safeParse(formValues)

        if (!isValid || !zodResult.success) {
          clearErrors(fieldsToValidate as unknown as Array<string>)

          if (!zodResult.success) {
            zodResult.error.issues.forEach((issue) => {
              const field = (issue.path?.[0] as string) || ''
              if (field) {
                setError(field as keyof typeof formValues, {
                  type: 'manual',
                  message: issue.message,
                })
              }
            })
          }

          await trigger(fieldsToValidate as unknown as Array<string>)

          if (!zodResult.success && zodResult.error.issues.length > 0) {
            const firstError = zodResult.error.issues[0]
            if (firstError) {
              const firstErrorField = (firstError.path?.[0] as string) || ''
              if (firstErrorField) {
                const element = document.querySelector(
                  `[name="${firstErrorField}"]`
                ) as HTMLElement
                if (element) {
                  setTimeout(() => {
                    element.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })
                    element.focus()
                  }, 100)
                }
              }
            }
          }

          throw new Error('Please fill all required fields correctly')
        }

        await trigger()

        // ✅ FIX: Use finalChargeTypeId which was set above (either from form, generatedId, or auto-generated)
        // Re-check all sources one more time to ensure we have the ID
        const chargeTypeIdToSend =
          finalChargeTypeId ||
          formValues.chargeTypeId ||
          generatedId ||
          watch('chargeTypeId') ||
          ''

        // ✅ FIX: Keep as string (API expects string, not number)
        // Ensure it's a valid non-empty string
        const chargeTypeIdString =
          chargeTypeIdToSend &&
          chargeTypeIdToSend !== '' &&
          chargeTypeIdToSend !== 'null' &&
          chargeTypeIdToSend !== 'undefined'
            ? chargeTypeIdToSend.toString()
            : null

        console.log('[Step1] ===== Creating Budget Category =====')
        console.log('[Step1] finalChargeTypeId:', finalChargeTypeId)
        console.log('[Step1] formValues.chargeTypeId:', formValues.chargeTypeId)
        console.log('[Step1] generatedId:', generatedId)
        console.log('[Step1] chargeTypeIdToSend:', chargeTypeIdToSend)
        console.log('[Step1] chargeTypeIdString (final):', chargeTypeIdString)
        console.log('[Step1] All formValues:', formValues)

        // ✅ FIX: Validate that chargeTypeId is present before creating
        if (!isEditMode && !chargeTypeIdString) {
          console.error(
            '[Step1] ❌ chargeTypeId is still null/empty after auto-generation attempt'
          )
          setError('chargeTypeId', {
            type: 'manual',
            message:
              'Category ID is required. Please generate an ID before saving.',
          })
          throw new Error(
            'Category ID is required. Please generate an ID before saving.'
          )
        }

        const payload: Record<string, unknown> = {
          // ✅ FIX: Always include chargeTypeId as STRING (API expects string, not number)
          chargeTypeId: chargeTypeIdString,
          chargeType: formValues.chargeType,
          serviceChargeGroupId: formValues.groupNameId
            ? Number(formValues.groupNameId)
            : 0,
          serviceChargeGroupName: formValues.groupName,
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

        console.log('[Step1] Final payload:', JSON.stringify(payload, null, 2))

        let response: BudgetCategoryResponse
        if (isEditMode && savedId) {
          const updatePayload = {
            ...payload,
            id: Number(savedId),
          }
          response = await budgetCategoryService.updateBudgetCategory(
            Number(savedId),
            updatePayload as Parameters<
              typeof budgetCategoryService.updateBudgetCategory
            >[1]
          )
          if (onSaveAndNext) {
            onSaveAndNext({ id: savedId })
          }
        } else {
          response = await budgetCategoryService.createBudgetCategory(
            payload as Parameters<
              typeof budgetCategoryService.createBudgetCategory
            >[0] as never
          )
          if (onSaveAndNext) {
            onSaveAndNext({ id: response.id.toString() })
          }
        }
      } catch (error) {
        throw error
      }
    }, [
      watch,
      trigger,
      clearErrors,
      setError,
      setValue,
      isEditMode,
      savedId,
      onSaveAndNext,
      generatedId,
    ])

    useImperativeHandle(ref, () => {
      return {
        handleSaveAndNext,
      }
    }, [handleSaveAndNext])

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

    const labelSx = {
      color: '#374151',
      fontFamily: 'Outfit',
      fontWeight: 500,
      fontStyle: 'normal',
      fontSize: '13px',
      letterSpacing: '0.025em',
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

    const renderBudgetCategoryIdField = (
      name: string,
      label: string,
      gridSize: number = 6
    ) => (
      <Grid key={name} size={{ xs: 12, md: gridSize }}>
        <Controller
          name={name}
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              label={label}
              // ✅ FIX: Use field.value || generatedId (following DeveloperStepper pattern exactly)
              value={field.value || generatedId}
              error={!!fieldState.error}
              helperText={fieldState.error?.message?.toString()}
              onChange={(e) => {
                // ✅ FIX: Update both generatedId and field value (following DeveloperStepper pattern)
                setGeneratedId(e.target.value)
                field.onChange(e)
              }}
              disabled={Boolean(isReadOnly || isEditMode)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ mr: 0 }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={handleGenerateNewId}
                      disabled={Boolean(
                        isGeneratingId || isReadOnly || isEditMode
                      )}
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

    const renderTextField = (
      name: string,
      label: string,
      defaultValue = '',
      required = false
    ) => {
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
                      clearErrors(name as keyof typeof errors)
                    }
                    trigger(name)
                  }}
                  onBlur={() => {
                    field.onBlur()
                    trigger(name)
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

              getBudgetCategoryLabelDynamic(
                MASTER_BUDGET_LABELS.FORM_FIELDS.CHARGE_TYPE_ID
              ),
              '',

              true
            )}
            {/* {renderBudgetCategoryIdField(
                'chargeTypeId',
                getBudgetCategoryLabelDynamic(MASTER_BUDGET_LABELS.FORM_FIELDS.CHARGE_TYPE_ID) ,
                6
              )} */}
            {renderTextField(
              'chargeType',
              getBudgetCategoryLabelDynamic(
                MASTER_BUDGET_LABELS.FORM_FIELDS.CHARGE_TYPE
              ),
              '',
              true
            )}
            {renderTextField(
              'groupName',
              getBudgetCategoryLabelDynamic(
                MASTER_BUDGET_LABELS.FORM_FIELDS.GROUP_NAME
              ),
              '',
              true
            )}
            {renderTextField(
              'categoryCode',
              getBudgetCategoryLabelDynamic(
                MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_CODE
              ),
              '',
              true
            )}
            {renderTextField(
              'categoryName',
              getBudgetCategoryLabelDynamic(
                MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_NAME
              ),
              '',
              true
            )}
            {renderTextField(
              'categorySubCode',
              getBudgetCategoryLabelDynamic(
                MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_CODE
              ),
              '',
              true
            )}
            {renderTextField(
              'categorySubName',
              getBudgetCategoryLabelDynamic(
                MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_NAME
              ),
              '',
              true
            )}
            {renderTextField(
              'categorySubToSubCode',
              getBudgetCategoryLabelDynamic(
                MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_TO_SUB_CODE
              ),
              '',
              true
            )}
            {renderTextField(
              'categorySubToSubName',
              getBudgetCategoryLabelDynamic(
                MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_TO_SUB_NAME
              ),
              '',
              true
            )}
            {renderTextField(
              'serviceCode',
              getBudgetCategoryLabelDynamic(
                MASTER_BUDGET_LABELS.FORM_FIELDS.SERVICE_CODE
              ),
              '',
              true
            )}
            {renderTextField(
              'serviceName',
              getBudgetCategoryLabelDynamic(
                MASTER_BUDGET_LABELS.FORM_FIELDS.SERVICE_NAME
              ),
              '',
              true
            )}
            {renderTextField(
              'provisionalBudgetCode',
              getBudgetCategoryLabelDynamic(
                MASTER_BUDGET_LABELS.FORM_FIELDS.PROVISIONAL_BUDGET_CODE
              ),
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
