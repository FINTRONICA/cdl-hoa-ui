'use client'

import { useState, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react'
import {
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material'
import { Controller, useFormContext } from 'react-hook-form'
import { useBudgetManagementFirmLabelsApi } from '@/hooks/useBudgetManagementFirmLabelsApi'
import { useAppStore } from '@/store'
import { budgetService } from '@/services/api/budgetApi/budgetService'
import { buildPartnerService } from '@/services/api/buildPartnerService'
import { realEstateAssetService } from '@/services/api/projectService'
import { BudgetCategoryService } from '@/services/api/budgetApi/budgetCategoryService'
import { BudgetStep1Schema } from '@/lib/validation/budgetSchemas'
import { BUDGET_LABELS } from '@/constants/mappings/budgetLabels'
import { FormError } from '@/components/atoms/FormError'
import type { BudgetRequest } from '@/constants/mappings/budgetMapper'
import type { BuildPartner } from '@/services/api/buildPartnerService'
import type { RealEstateAsset } from '@/services/api/projectService'
import type { BudgetCategoryUIData } from '@/services/api/budgetApi/budgetCategoryService'

interface Step1Props {
  onSaveAndNext?: (data: { id: number }) => void
  budgetId?: number | null
  isEditMode?: boolean
  isViewMode?: boolean
}

export interface Step1Ref {
  handleSaveAndNext: () => Promise<void>
}

const Step1 = forwardRef<Step1Ref, Step1Props>(
  (
    { onSaveAndNext, budgetId, isEditMode, isViewMode = false },
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

    // Dropdown data state
    const [assetRegisterOptions, setAssetRegisterOptions] = useState<{ id: number; displayName: string; settingValue: string }[]>([])
    const [managementFirmOptions, setManagementFirmOptions] = useState<{ id: number; displayName: string; settingValue: string }[]>([])
    const [budgetCategoryOptions, setBudgetCategoryOptions] = useState<{ id: number; displayName: string; settingValue: string }[]>([])
    const [loadingAssetRegisters, setLoadingAssetRegisters] = useState(true)
    const [loadingManagementFirms, setLoadingManagementFirms] = useState(true)
    const [loadingBudgetCategories, setLoadingBudgetCategories] = useState(true)

    const [isFormInitialized, setIsFormInitialized] = useState(false)
    const [isLoadingBudget, setIsLoadingBudget] = useState(false)

    // Fetch Asset Registers (Build Partners)
    useEffect(() => {
      const fetchAssetRegisters = async () => {
        try {
          setLoadingAssetRegisters(true)
          const response = await buildPartnerService.getBuildPartners(0, 1000)
          
          if (!response || !response.content || !Array.isArray(response.content)) {
            setAssetRegisterOptions([])
            return
          }

          const options = response.content
            .filter((item: BuildPartner) => item && item.id)
            .map((item: BuildPartner) => ({
              id: item.id,
              displayName: item.arName || item.arProjectName || `Asset Register ${item.id}`,
              settingValue: item.id.toString(),
            }))
          
          setAssetRegisterOptions(options)
        } catch (error) {
          console.error('[Step1] Error fetching asset registers:', error)
          setAssetRegisterOptions([])
        } finally {
          setLoadingAssetRegisters(false)
        }
      }
      fetchAssetRegisters()
    }, [])

    // Fetch Management Firms (Real Estate Assets/Projects)
    useEffect(() => {
      const fetchManagementFirms = async () => {
        try {
          setLoadingManagementFirms(true)
          const response = await realEstateAssetService.getProjects(0, 1000)
          
          // Handle both array response and paginated response
          let dataArray: RealEstateAsset[] = []
          
          if (Array.isArray(response)) {
            // Direct array response
            dataArray = response
          } else if (response && typeof response === 'object' && 'content' in response) {
            // Paginated response with content property
            const paginatedResponse = response as { content?: RealEstateAsset[] }
            dataArray = Array.isArray(paginatedResponse.content) ? paginatedResponse.content : []
          } else {
            setManagementFirmOptions([])
            return
          }

          const options = dataArray
            .filter((item: RealEstateAsset) => item && item.id && item.mfName)
            .map((item: RealEstateAsset) => ({
              id: item.id,
              displayName: item.mfName || `Management Firm ${item.id}`,
              settingValue: item.id.toString(),
            }))
          
          setManagementFirmOptions(options)
        } catch (error) {
          console.error('[Step1] Error fetching management firms:', error)
          setManagementFirmOptions([])
        } finally {
          setLoadingManagementFirms(false)
        }
      }
      fetchManagementFirms()
    }, [])

    // Fetch Budget Categories
    useEffect(() => {
      const fetchBudgetCategories = async () => {
        try {
          setLoadingBudgetCategories(true)
          const response = await BudgetCategoryService.getBudgetCategories(0, 1000)
          
          if (!response || !response.content || !Array.isArray(response.content)) {
            setBudgetCategoryOptions([])
            return
          }

          const options = response.content
            .filter((item: BudgetCategoryUIData) => item && item.id)
            .map((item: BudgetCategoryUIData) => ({
              id: item.id,
              displayName: item.categoryName || item.serviceName || `Budget Category ${item.id}`,
              settingValue: item.id.toString(),
            }))
          
          setBudgetCategoryOptions(options)
        } catch (error) {
          console.error('[Step1] Error fetching budget categories:', error)
          setBudgetCategoryOptions([])
        } finally {
          setLoadingBudgetCategories(false)
        }
      }
      fetchBudgetCategories()
    }, [])

    // Load existing budget data in edit mode
    useEffect(() => {
      const loadBudgetData = async () => {
        if (isEditMode && budgetId && !isFormInitialized) {
          try {
            setIsLoadingBudget(true)
            const budgetData = await budgetService.getBudgetById(budgetId)
            
            // Debug: Log the budget data received from backend
            console.log('[Step1] Budget data loaded from backend:', {
              id: budgetData.id,
              assetRegisterDTO: budgetData.assetRegisterDTO,
              managementFirmDTO: budgetData.managementFirmDTO,
              budgetCategoriesDTOS: budgetData.budgetCategoriesDTOS,
            })
            
            // Set form values from loaded data
            if (budgetData.assetRegisterDTO?.id) {
              console.log('[Step1] Setting assetRegisterId to:', budgetData.assetRegisterDTO.id.toString())
              setValue('assetRegisterId', budgetData.assetRegisterDTO.id.toString())
            } else {
              console.warn('[Step1] assetRegisterDTO is null or missing id')
            }
            if (budgetData.managementFirmDTO?.id) {
              console.log('[Step1] Setting managementFirmId to:', budgetData.managementFirmDTO.id.toString())
              setValue('managementFirmId', budgetData.managementFirmDTO.id.toString())
            } else {
              console.warn('[Step1] managementFirmDTO is null or missing id')
            }
            setValue('budgetId', budgetData.budgetId || '')
            setValue('budgetName', budgetData.budgetName || '')
            setValue('budgetPeriodCode', budgetData.budgetPeriodCode || '')
            setValue('propertyGroupId', budgetData.propertyGroupId?.toString() || '')
            setValue('propertyManagerEmail', budgetData.propertyManagerEmail || '')
            setValue('masterCommunityName', budgetData.masterCommunityName || '')
            setValue('masterCommunityNameLocale', budgetData.masterCommunityNameLocale || '')
            setValue('isActive', budgetData.isActive ?? true)

        setIsFormInitialized(true)
          } catch (error) {
            console.error('Error loading budget data:', error)
          } finally {
            setIsLoadingBudget(false)
          }
        }
      }

      loadBudgetData()
    }, [isEditMode, budgetId, isFormInitialized, setValue])

    const handleSaveAndNext = useCallback(async () => {
      try {
        // Trigger validation
        const fieldsToValidate = [
          'assetRegisterId',
          'managementFirmId',
          'budgetId',
          'budgetName',
          'budgetPeriodCode',
          'propertyGroupId',
          'propertyManagerEmail',
          'masterCommunityName',
        ] as const
        
        const isValid = await trigger(fieldsToValidate as unknown as string[])
        
        // Get form values
        const formValues = {
          assetRegisterId: watch('assetRegisterId'),
          managementFirmId: watch('managementFirmId'),
          budgetId: watch('budgetId'),
          budgetName: watch('budgetName'),
          budgetPeriodCode: watch('budgetPeriodCode'),
          propertyGroupId: watch('propertyGroupId'),
          propertyManagerEmail: watch('propertyManagerEmail'),
          masterCommunityName: watch('masterCommunityName'),
          masterCommunityNameLocale: watch('masterCommunityNameLocale'),
          isActive: watch('isActive') ?? true,
        }

        // Debug: Log form values to verify they're being captured
        console.log('[Step1] Form values before validation:', {
          assetRegisterId: formValues.assetRegisterId,
          managementFirmId: formValues.managementFirmId,
          assetRegisterIdType: typeof formValues.assetRegisterId,
          managementFirmIdType: typeof formValues.managementFirmId,
        })

        // Validate with Zod
        const zodResult = BudgetStep1Schema.safeParse(formValues)
        
        if (!isValid || !zodResult.success) {
          clearErrors(fieldsToValidate as unknown as string[])
          
          if (!zodResult.success) {
            zodResult.error.issues.forEach((issue) => {
              const field = (issue.path?.[0] as string) || ''
              if (field) {
                setError(field as keyof typeof errors, {
                  type: 'manual',
                  message: issue.message,
                })
              }
            })
          }
          
          await trigger(fieldsToValidate as unknown as string[])
          
          if (!zodResult.success && zodResult.error.issues.length > 0) {
            const firstError = zodResult.error.issues[0]
            if (firstError) {
            const firstErrorField = (firstError.path?.[0] as string) || ''
            if (firstErrorField) {
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
          
          throw new Error('Please fill all required fields correctly')
        }
        
        // Parse and validate IDs
        const assetRegisterId = formValues.assetRegisterId 
          ? parseInt(formValues.assetRegisterId.toString(), 10) 
          : null
        const managementFirmId = formValues.managementFirmId 
          ? parseInt(formValues.managementFirmId.toString(), 10) 
          : null

        // Debug: Log parsed IDs
        console.log('[Step1] Parsed IDs:', {
          assetRegisterId,
          managementFirmId,
          assetRegisterIdValid: assetRegisterId && !isNaN(assetRegisterId) && assetRegisterId > 0,
          managementFirmIdValid: managementFirmId && !isNaN(managementFirmId) && managementFirmId > 0,
        })

        // Validate IDs are valid numbers
        if (!assetRegisterId || isNaN(assetRegisterId) || assetRegisterId <= 0) {
          throw new Error('Asset Register ID is required and must be a valid number')
        }
        if (!managementFirmId || isNaN(managementFirmId) || managementFirmId <= 0) {
          throw new Error('Management Firm ID is required and must be a valid number')
        }

        // Prepare payload
        const payload: BudgetRequest = {
          ...(isEditMode && budgetId ? { id: budgetId } : {}), // Include id for updates
          budgetId: formValues.budgetId,
          budgetName: formValues.budgetName,
          isActive: formValues.isActive,
          budgetPeriodCode: formValues.budgetPeriodCode,
          propertyGroupId: parseInt(formValues.propertyGroupId?.toString() || '0', 10) || 0,
          propertyManagerEmail: formValues.propertyManagerEmail,
          masterCommunityName: formValues.masterCommunityName,
          masterCommunityNameLocale: formValues.masterCommunityNameLocale || '',
          createdBy: '', // Will be set by backend
          enabled: true,
          deleted: false,
          assetRegisterDTO: {
            id: assetRegisterId,
          },
          managementFirmDTO: {
            id: managementFirmId,
          },
          budgetCategoriesDTOS: [], // Will be added in Step 2
        }

        // Debug: Log final payload
        console.log('[Step1] Final payload being sent:', JSON.stringify(payload, null, 2))

        let response
        if (isEditMode && budgetId) {
          // Update existing budget
          response = await budgetService.updateBudget(budgetId, payload)
              } else {
          // Create new budget
          response = await budgetService.createBudget(payload)
        }

        if (onSaveAndNext && response.id) {
          onSaveAndNext({ id: response.id })
            }
          } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to save budget'
        throw new Error(errorMessage)
      }
    }, [watch, trigger, setError, clearErrors, isEditMode, budgetId, onSaveAndNext])

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

    const renderTextField = (
      name: string,
      configId: string,
      fallbackLabel: string,
      gridMd = 6,
      disabled = false,
      required = false
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
                  fullWidth
                  disabled={disabled || isViewMode || isLoadingBudget}
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
                  disabled={loading || isViewMode || isLoadingBudget}
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
            {/* Asset Register Dropdown */}
            {renderSelectField(
              'assetRegisterId',
              BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_FIRM_GROUP_NAME,
              'Asset Register',
              assetRegisterOptions,
                6,
                true,
              loadingAssetRegisters
            )}

            {/* Management Firm Dropdown */}
            {renderSelectField(
              'managementFirmId',
              BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_COMPANY_NAME,
              'Management Firm',
              managementFirmOptions,
                6,
                true,
              loadingManagementFirms
              )}

            {/* Budget ID */}
              {renderTextField(
              'budgetId',
              BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_CODE,
              'Budget ID',
              6,
              false,
                true
              )}

            {/* Budget Name */}
              {renderTextField(
              'budgetName',
              BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_TITLE,
              'Budget Name',
              6,
              false,
                true
              )}

            {/* Budget Period Code */}
              {renderTextField(
              'budgetPeriodCode',
              BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_CODE,
              'Budget Period Code',
              6,
              false,
                true
              )}

            {/* Property Group ID */}
              {renderTextField(
              'propertyGroupId',
              BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_FIRM_GROUP_ID,
              'Property Group ID',
              6,
              false,
                true
              )}

            {/* Property Manager Email */}
              {renderTextField(
              'propertyManagerEmail',
              BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_FIRM_MANAGER_EMAIL,
              'Property Manager Email',
              6,
              false,
                true
              )}

            {/* Master Community Name */}
              {renderTextField(
              'masterCommunityName',
              BUDGET_LABELS.FORM_FIELDS.MASTER_COMMUNITY_NAME,
              'Master Community Name',
              6,
              false,
                true
              )}

            {/* Master Community Name (Local) */}
              {renderTextField(
              'masterCommunityNameLocale',
              BUDGET_LABELS.FORM_FIELDS.MASTER_COMMUNITY_LOCAL_NAME,
              'Master Community Name (Local)',
              6,
                false,
                false
              )}

            {/* Budget Category Dropdown */}
            {renderSelectField(
              'budgetCategoryId',
              BUDGET_LABELS.FORM_FIELDS.SERVICE_CHARGE_GROUP_NAME,
              'Budget Category',
              budgetCategoryOptions,
              6,
                false,
              loadingBudgetCategories
            )}
            </Grid>
          </CardContent>
        </Card>
    )
  }
)

Step1.displayName = 'Step1'

export default Step1
