'use client'

import { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import {
  useUnitStatuses,
  usePropertyIds,
} from '../../../../hooks/useApplicationSettings1'
import { useCapitalPartnerLabelsApi } from '@/hooks/useCapitalPartnerLabelsApi'
import { useAppStore } from '@/store'
import {
  useRealEstateAssets,
  transformRealEstateAssetsForDropdown,
} from '../../../../hooks/useRealEstateAssets1'
import { useGetEnhanced } from '@/hooks/useApiEnhanced'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import {
  CapitalPartnerUnitResponse,
  CapitalPartnerUnitPurchaseResponse,
} from '@/types/capitalPartner'
import { capitalPartnerUnitService } from '../../../../services/api/capitalPartnerUnitService'
import { capitalPartnerUnitBookingService } from '../../../../services/api/capitalPartnerUnitBookingService'
import { capitalPartnerUnitPurchaseService } from '../../../../services/api/capitalPartnerUnitPurchaseService'
import {
  mapStep2ToCapitalPartnerUnitPayload,
  type Step2FormData,
} from '../../../../utils/capitalPartnerUnitMapper'

import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from '@mui/material'
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material'
import { Controller, useFormContext } from 'react-hook-form'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { CapitalPartnerStep2Schema } from '@/lib/validation/capitalPartnerSchemas'
import { FormError } from '../../../atoms/FormError'

interface Step2Props {
  onSaveAndNext?: (data: any) => void
  capitalPartnerId?: number | null
  isEditMode?: boolean
  isViewMode?: boolean
}

export interface Step2Ref {
  handleSaveAndNext: () => Promise<void>
}

const Step2 = forwardRef<Step2Ref, Step2Props>(
  (
    { onSaveAndNext, capitalPartnerId, isEditMode, isViewMode = false },
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

    const { getLabel } = useCapitalPartnerLabelsApi()
    const currentLanguage = useAppStore((state) => state.language)

    const [selectedProject, setSelectedProject] = useState<any>(null)
    const [isFormInitialized, setIsFormInitialized] = useState<boolean>(false)

    useEffect(() => {
      setIsFormInitialized(false)
      setSelectedProject(null)
    }, [isEditMode, capitalPartnerId])
    const { data: unitStatuses, loading: loadingUnitStatuses } =
      useUnitStatuses()
    const { data: propertyIds, loading: loadingPropertyIds } = usePropertyIds()
    const { data: realEstateAssets, loading: loadingProjects } =
      useRealEstateAssets()

    const projectOptions =
      transformRealEstateAssetsForDropdown(realEstateAssets)

    const {
      data: existingUnitData,
      isLoading: isLoadingExistingUnit,
      error: errorLoadingUnit,
    } = useGetEnhanced<CapitalPartnerUnitResponse[]>(
      `${API_ENDPOINTS.CAPITAL_PARTNER_UNIT.GET_ALL}?capitalPartnerId.equals=${capitalPartnerId || 0}`,
      {},
      {
        enabled: Boolean(isEditMode && capitalPartnerId),
      }
    )

    const unitId =
      existingUnitData && existingUnitData.length > 0
        ? existingUnitData[0]?.id
        : null
    const isUnitDataReady =
      !isLoadingExistingUnit && !errorLoadingUnit && !!unitId

    const {
      data: existingUnitPurchaseData,
      isLoading: isLoadingExistingPurchase,
    } = useGetEnhanced<CapitalPartnerUnitPurchaseResponse[]>(
      `${API_ENDPOINTS.CAPITAL_PARTNER_UNIT_PURCHASE.GET_ALL}?capitalPartnerUnitId.equals=${unitId || 0}`,
      {},
      {
        enabled: Boolean(isEditMode && isUnitDataReady && unitId),
      }
    )

    const {
      data: existingUnitBookingData,
      isLoading: isLoadingExistingBooking,
    } = useGetEnhanced<any[]>(
      `${API_ENDPOINTS.CAPITAL_PARTNER_UNIT_BOOKING.GET_ALL}?capitalPartnerUnitId.equals=${unitId || 0}`,
      {},
      {
        enabled: Boolean(isEditMode && isUnitDataReady && unitId),
      }
    )

    useEffect(() => {
      if (
        isEditMode &&
        existingUnitData &&
        existingUnitData.length > 0 &&
        !isLoadingExistingUnit &&
        !isLoadingExistingPurchase &&
        !isLoadingExistingBooking &&
        !isFormInitialized &&
        projectOptions.length > 0 &&
        propertyIds &&
        propertyIds.length > 0
      ) {
        const unitData = existingUnitData[0]
        if (!unitData) return

        const purchaseData =
          existingUnitPurchaseData && existingUnitPurchaseData.length > 0
            ? existingUnitPurchaseData[0]
            : null

        const projectOption = projectOptions.find(
          (project) => project.projectId === unitData.realEstateAssestDTO?.reaId
        )

        if (projectOption) {
          setSelectedProject(projectOption)
          setValue('projectNameDropdown', projectOption.settingValue)
          setValue('projectId', projectOption.projectId)
          setValue('developerIdInput', projectOption.developerId)
          setValue('developerNameInput', projectOption.developerName)
        }

        setValue('floor', unitData.floor || '')
        setValue('bedroomCount', unitData.noofBedroom || '')
        setValue('unitNoQaqood', unitData.unitRefId || '')
        setValue('unitStatus', unitData.unitStatusDTO?.settingValue || '')
        setValue('buildingName', unitData.towerName || '')
        setValue('plotSize', unitData.unitPlotSize || '')
        const propertyIdOption = propertyIds?.find(
          (property) => property.id === unitData.propertyIdDTO?.id
        )
        setValue('propertyId', propertyIdOption?.settingValue || '')
        setValue('unitIban', unitData.virtualAccNo || '')

        if (purchaseData) {
          setValue(
            'registrationFees',
            purchaseData.cpupUnitRegistrationFee?.toString() || ''
          )
          setValue('agentName', purchaseData.cpupAgentName || '')
          setValue('agentNationalId', purchaseData.cpupAgentId || '')
          setValue(
            'grossSalePrice',
            purchaseData.cpupGrossSaleprice?.toString() || ''
          )
          setValue('VatApplicable', purchaseData.cpupVatApplicable || false)
          setValue(
            'SalesPurchaseAgreement',
            purchaseData.cpupSalePurchaseAgreement || false
          )
          setValue(
            'ProjectPaymentPlan',
            purchaseData.cpupProjectPaymentPlan || false
          )
          setValue('salePrice', purchaseData.cpupSalePrice?.toString() || '')
          setValue('deedNo', purchaseData.cpupDeedNo || '')
          setValue('contractNo', purchaseData.cpupAgreementNo || '')
          setValue(
            'agreementDate',
            purchaseData.cpupAgreementDate
              ? dayjs(purchaseData.cpupAgreementDate)
              : null
          )
          setValue(
            'ModificationFeeNeeded',
            purchaseData.cpupModificationFeeNeeded || false
          )
          setValue(
            'ReservationBookingForm',
            purchaseData.cpupReservationBookingForm || false
          )
          setValue('OqoodPaid', purchaseData.cpupOqoodPaid || false)
          setValue('worldCheck', purchaseData.cpupWorldCheck || false)
          setValue(
            'paidInEscrow',
            purchaseData.cpupAmtPaidToDevInEscorw?.toString() || ''
          )
          setValue(
            'paidOutEscrow',
            purchaseData.cpupAmtPaidToDevOutEscorw?.toString() || ''
          )
          setValue(
            'totalPaid',
            purchaseData.cpupTotalAmountPaid?.toString() || ''
          )
          setValue('qaqoodAmount', purchaseData.cpupOqoodAmountPaid || '')
          setValue('unitAreaSize', purchaseData.cpupUnitAreaSize || '')
          setValue('forfeitAmount', purchaseData.cpupForfeitAmount || '')
          setValue('dldAmount', purchaseData.cpupDldAmount || '')
          setValue('refundAmount', purchaseData.cpupRefundAmount || '')
          setValue(
            'transferredAmount',
            purchaseData.cpupTransferredAmount || ''
          )
          setValue('unitRemarks', purchaseData.cpupRemarks || '')
        }

        setIsFormInitialized(true)
      }
    }, [
      existingUnitData,
      existingUnitPurchaseData,
      existingUnitBookingData,
      isLoadingExistingUnit,
      isLoadingExistingPurchase,
      isLoadingExistingBooking,
      isEditMode,
      setValue,
      projectOptions,
      propertyIds,
      isFormInitialized,
    ])
    const handleProjectSelection = (projectId: string) => {
      const selectedProjectData = projectOptions.find(
        (project) => project.settingValue === projectId
      )

      if (selectedProjectData) {
        setSelectedProject(selectedProjectData)
        setValue('projectId', selectedProjectData.projectId, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        })
        setValue('developerIdInput', selectedProjectData.developerId, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        })
        setValue('developerNameInput', selectedProjectData.developerName, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        })
        // Clear any prior manual errors for these auto-filled fields
        clearErrors([
          'projectId',
          'developerIdInput',
          'developerNameInput',
        ] as unknown as any)
      }
    }
    const handleSaveAndNext = async () => {
      console.log('inside step 2 handle save and next')
      try {
        // Validate required fields first so UI shows errors immediately
        const requiredValid = await (async () => {
          try {
            const result = CapitalPartnerStep2Schema.safeParse({
              projectNameDropdown: watch('projectNameDropdown'),
              projectId: watch('projectId'),
              developerIdInput: watch('developerIdInput'),
              developerNameInput: watch('developerNameInput'),
              unitNoQaqood: watch('unitNoQaqood'),
              unitStatus: watch('unitStatus'),
              plotSize: watch('plotSize'),
              propertyId: watch('propertyId'),
            })
            if (!result.success) {
              const fieldsToCheck = [
                'projectNameDropdown',
                'projectId',
                'developerIdInput',
                'developerNameInput',
                'unitNoQaqood',
                'unitStatus',
                'plotSize',
                'propertyId',
              ] as const
              clearErrors(fieldsToCheck as unknown as any)
              result.error.issues.forEach((issue) => {
                const field = (issue.path?.[0] as string) || ''
                if (field) {
                  setError(field as any, {
                    type: 'manual',
                    message: issue.message,
                  })
                }
              })
              return false
            }
            return true
          } catch {
            return false
          }
        })()
        if (!requiredValid) {
          throw new Error('Please fill all required fields')
        }
        if (!capitalPartnerId) {
          throw new Error('Capital Partner ID is required from Step1')
        }
        const formData: Step2FormData = {
          projectNameDropdown: watch('projectNameDropdown'),
          projectId: watch('projectId'),
          developerIdInput: watch('developerIdInput'),
          developerNameInput: watch('developerNameInput'),
          floor: watch('floor'),
          bedroomCount: watch('bedroomCount'),
          unitNoQaqood: watch('unitNoQaqood'),
          unitStatus: watch('unitStatus'),
          buildingName: watch('buildingName'),
          plotSize: watch('plotSize'),
          propertyId: watch('propertyId'),
          unitIban: watch('unitIban'),
          registrationFees: watch('registrationFees'),
          agentName: watch('agentName'),
          agentNationalId: watch('agentNationalId'),
          grossSalePrice: watch('grossSalePrice'),
          VatApplicable: watch('VatApplicable'),
          SalesPurchaseAgreement: watch('SalesPurchaseAgreement'),
          ProjectPaymentPlan: watch('ProjectPaymentPlan'),
          salePrice: watch('salePrice'),
          deedNo: watch('deedNo'),
          contractNo: watch('contractNo'),
          agreementDate: watch('agreementDate'),
          ModificationFeeNeeded: watch('ModificationFeeNeeded'),
          ReservationBookingForm: watch('ReservationBookingForm'),
          OqoodPaid: watch('OqoodPaid'),
          worldCheck: watch('worldCheck'),
          paidInEscrow: watch('paidInEscrow'),
          paidOutEscrow: watch('paidOutEscrow'),
          totalPaid: watch('totalPaid'),
          qaqoodAmount: watch('qaqoodAmount'),
          unitAreaSize: watch('unitAreaSize'),
          forfeitAmount: watch('forfeitAmount'),
          dldAmount: watch('dldAmount'),
          refundAmount: watch('refundAmount'),
          transferredAmount: watch('transferredAmount'),
          unitRemarks: watch('unitRemarks'),
        }
        console.log('am i here?')
        console.log('scheemma', CapitalPartnerStep2Schema)
        const zodResult = CapitalPartnerStep2Schema.safeParse(formData)
        console.log('zodResult', zodResult)
        if (!zodResult.success) {
          const fieldsToCheck = [
            'projectNameDropdown',
            'projectId',
            'developerIdInput',
            'developerNameInput',
            'unitNoQaqood',
            'unitStatus',
            'plotSize',
            'propertyId',
          ] as const
          clearErrors(fieldsToCheck as unknown as any)
          zodResult.error.issues.forEach((issue) => {
            const field = (issue.path?.[0] as string) || ''
            if (field) {
              setError(field as any, { type: 'manual', message: issue.message })
            }
          })
          throw new Error('Please fix validation errors')
        } else {
          clearErrors()
        }
        const { unitPayload, bookingPayload, purchasePayload } =
          mapStep2ToCapitalPartnerUnitPayload(
            formData,
            capitalPartnerId,
            unitStatuses,
            selectedProject,
            propertyIds
          )
        let unitResponse
        let existingUnitId = null

        if (isEditMode && existingUnitData && existingUnitData.length > 0) {
          existingUnitId = existingUnitData[0]?.id
          if (existingUnitId) {
            const updateUnitPayload = {
              ...unitPayload,
              id: existingUnitId,
            }
            unitResponse =
              await capitalPartnerUnitService.updateCapitalPartnerUnit(
                existingUnitId,
                updateUnitPayload
              )
          } else {
            unitResponse =
              await capitalPartnerUnitService.createCapitalPartnerUnit(
                unitPayload
              )
          }
        } else {
          unitResponse =
            await capitalPartnerUnitService.createCapitalPartnerUnit(
              unitPayload
            )
        }

        const finalUnitId = existingUnitId || unitResponse.id

        let bookingResponse = null
        let purchaseResponse = null
        if (Object.keys(bookingPayload).length > 0) {
          const bookingPayloadWithId = {
            ...bookingPayload,
            capitalPartnerUnitDTOS: [
              {
                id: finalUnitId,
              },
            ],
          }

          try {
            bookingResponse =
              await capitalPartnerUnitBookingService.createCapitalPartnerUnitBooking(
                bookingPayloadWithId
              )
          } catch (error) {}
        }
        if (Object.keys(purchasePayload).length > 0) {
          const purchasePayloadWithId = {
            ...purchasePayload,
            capitalPartnerUnitDTO: {
              id: finalUnitId,
              capitalPartnerDTOS: [
                {
                  id: capitalPartnerId,
                },
              ],
            },
          }

          try {
            if (
              isEditMode &&
              existingUnitPurchaseData &&
              existingUnitPurchaseData.length > 0
            ) {
              const existingPurchaseId = existingUnitPurchaseData[0]?.id
              if (existingPurchaseId) {
                const updatePurchasePayload = {
                  ...purchasePayloadWithId,
                  id: existingPurchaseId,
                }
                purchaseResponse =
                  await capitalPartnerUnitPurchaseService.updateCapitalPartnerUnitPurchase(
                    existingPurchaseId,
                    updatePurchasePayload
                  )
              } else {
                purchaseResponse =
                  await capitalPartnerUnitPurchaseService.createCapitalPartnerUnitPurchase(
                    purchasePayloadWithId
                  )
              }
            } else {
              purchaseResponse =
                await capitalPartnerUnitPurchaseService.createCapitalPartnerUnitPurchase(
                  purchasePayloadWithId
                )
            }
          } catch (error) {}
        }
        if (onSaveAndNext) {
          onSaveAndNext({ unitResponse, bookingResponse, purchaseResponse })
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
      configId: string,
      fallbackLabel: string,
      defaultValue = '',
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
            defaultValue={defaultValue}
            render={({ field }) => (
              <>
                <TextField
                  {...field}
                  label={label}
                  fullWidth
                  disabled={disabled || isViewMode}
                  error={!!errors[name]}
                  InputLabelProps={{ sx: labelSx }}
                  InputProps={{ sx: valueSx }}
                  sx={commonFieldStyles}
                  required={required}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e)
                    if (errors[name]) {
                      clearErrors(name as any)
                    }
                    // re-validate this field to update resolver-based errors
                    trigger(name as any)
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

    const renderApiSelectField = (
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
                  onChange={field.onChange}
                >
                  {options.map((option) => (
                    <MenuItem key={option.id} value={option.settingValue}>
                      {option.displayName}
                    </MenuItem>
                  ))}
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

    const renderProjectSelectField = (
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
                    handleProjectSelection(e.target.value as string)
                  }}
                >
                  {options.map((option) => (
                    <MenuItem key={option.id} value={option.settingValue}>
                      {option.displayName}
                    </MenuItem>
                  ))}
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

    const getFallbackOptions = (key: string) => {
      switch (key) {
        case 'unitStatus':
          return [
            { id: 1, displayName: 'Active', settingValue: 'ACTIVE' },
            { id: 2, displayName: 'Inactive', settingValue: 'INACTIVE' },
          ]
        case 'propertyId':
          return [
            { id: 1, displayName: 'Property 1', settingValue: '1' },
            { id: 2, displayName: 'Property 2', settingValue: '2' },
            { id: 3, displayName: 'Property 3', settingValue: '3' },
          ]
        default:
          return []
      }
    }
    const renderCheckboxField = (
      name: string,
      configId: string,
      fallbackLabel: string,
      gridSize: number = 6
    ) => {
      const label = getLabel(configId, currentLanguage, fallbackLabel)
      return (
        <Grid key={name} size={{ xs: 12, md: gridSize }}>
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
                    disabled={isViewMode}
                    onChange={(e) => field.onChange(e.target.checked)}
                    sx={{
                      color: '#CAD5E2',
                      '&.Mui-checked': {
                        color: '#2563EB',
                      },
                    }}
                  />
                }
                label={label}
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
    }

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/** Inline field errors + a small top banner for save errors. */}
        <Card
          sx={{
            boxShadow: 'none',
            backgroundColor: '#FFFFFFBF',
            width: '84%',
            margin: '0 auto',
          }}
        >
          <CardContent>
            {/* Removed top banner error; rely on inline field errors for consistency with Step 1 */}
            <Grid container rowSpacing={4} columnSpacing={2}>
              {renderProjectSelectField(
                'projectNameDropdown',
                'CDL_OWN_PROPERTY_NAME',
                'Property Name',
                projectOptions,
                6,
                true,
                loadingProjects
              )}
              {renderTextField(
                'projectId',
                'CDL_OWN_PROPERTY_ID',
                'Property ID*',
                '',
                6,
                !selectedProject,
                true
              )}
              {renderTextField(
                'developerIdInput',
                'CDL_OWN_MF_ID',
                'Managing Firm ID*',
                '',
                6,
                !selectedProject,
                true
              )}
              {renderTextField(
                'developerNameInput',
                'CDL_OWN_MF_NAME',
                'Managing Firm Name*',
                '',
                6,
                !selectedProject,
                true
              )}
              {renderTextField('floor', 'CDL_OWN_FLOOR', 'Floor', '', 3)}
              {renderTextField(
                'bedroomCount',
                'CDL_OWN_NOOF_BED',
                'No. of Bedroom',
                '',
                3
              )}
              {renderTextField(
                'unitNoQaqood',
                'CDL_OWN_UNIT_NUMBER',
                'Unit no. Qaqood format',
                '',
                3,
                false,
                false
              )}
              {renderApiSelectField(
                'unitStatus',
                'CDL_OWN_UNIT_STATUS',
                'Unit Status*',
                unitStatuses?.length
                  ? unitStatuses
                  : getFallbackOptions('unitStatus'),
                3,
                true,
                loadingUnitStatuses
              )}
              {renderTextField(
                'buildingName',
                'CDL_OWN_BUILDING_NAME',
                'Building Name',
                '',
                6,
                false,
                watch('propertyId') === '3'
              )}
              {renderTextField(
                'plotSize',
                'CDL_OWN_PLOT_SIZE',
                'Plot Size*',
                '',
                6,
                false,
                true
              )}
              {renderApiSelectField(
                'propertyId',
                'CDL_OWN_PROP_NUMBER',
                'Property ID*',
                propertyIds?.length
                  ? propertyIds
                  : getFallbackOptions('propertyId'),
                6,
                true,
                loadingPropertyIds
              )}

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="unitIban"
                  control={control}
                  defaultValue={''}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      disabled={isViewMode}
                      label={getLabel(
                        'CDL_OWN_UNIT_IBAN',
                        currentLanguage,
                        'Unit IBAN'
                      )}
                      value={field.value || ''}
                      onChange={field.onChange}
                      InputProps={{
                        endAdornment: !isViewMode ? (
                          <InputAdornment position="end">
                            <Button
                              variant="contained"
                              sx={{
                                color: '#2563EB',
                                borderRadius: '24px',
                                textTransform: 'none',
                                background: 'var(--UIColors-Blue-100, #DBEAFE)',

                                boxShadow: 'none',
                                '&:hover': {
                                  background: '#D0E3FF',
                                  boxShadow: 'none',
                                },
                                minWidth: '120px',
                                height: '36px',

                                fontFamily: 'Outfit, sans-serif',
                                fontWeight: 500,
                                fontStyle: 'normal',
                                fontSize: '14px',
                                lineHeight: '24px',
                                letterSpacing: '0.5px',
                                verticalAlign: 'middle',
                              }}
                              onClick={() => {}}
                            >
                              Fetch VA Number
                            </Button>
                          </InputAdornment>
                        ) : undefined,
                        sx: valueSx,
                      }}
                      InputLabelProps={{ sx: labelSx }}
                      sx={commonFieldStyles}
                    />
                  )}
                />
              </Grid>

              {renderTextField(
                'registrationFees',
                'CDL_OWN_REG_FEE',
                'Unit Registration Fees',
                '',
                3,
                false,
                false
              )}
              {renderTextField(
                'agentName',
                'CDL_OWN_AGENT_NAME',
                'Agent Name',
                '',
                3,
                false,
                false
              )}
              {renderTextField(
                'agentNationalId',
                'CDL_OWN_AGENT_ID',
                'Agent National ID',
                '',
                3,
                false,
                false
              )}
              {renderTextField(
                'grossSalePrice',
                'CDL_OWN_GROSS_PRICE',
                'Gross Sale Price',
                '',
                3,
                false,
                false
              )}

              {[
                {
                  name: 'VatApplicable',
                  configId: 'CDL_OWN_VAT_APPLICABLE',
                  fallbackLabel: 'VAT Applicable',
                },
                {
                  name: 'SalesPurchaseAgreement',
                  configId: 'CDL_OWN_SALES_PURCHASE_AGREEMENT',
                  fallbackLabel: 'Sales Purchase Agreement',
                },
                {
                  name: 'ProjectPaymentPlan',
                  configId: 'CDL_OWN_PROJECT_PAYMENT_PLAN',
                  fallbackLabel: 'Project Payment Plan',
                },
              ].map(({ name, configId, fallbackLabel }) => (
                <Grid size={{ xs: 12, md: 4 }} key={name}>
                  <FormControlLabel
                    control={
                      <Controller
                        name={name}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            {...field}
                            checked={!!field.value}
                            disabled={isViewMode}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        )}
                      />
                    }
                    label={getLabel(configId, currentLanguage, fallbackLabel)}
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
                </Grid>
              ))}

              {renderTextField(
                'salePrice',
                'CDL_OWN_NET_PRICE',
                'Sale Price',
                '',
                3
              )}
              {renderTextField(
                'deedNo',
                'CDL_OWN_DEED_REF_NO',
                'Deed No',
                '',
                3
              )}
              {renderTextField(
                'contractNo',
                'CDL_OWN_CONTRACT_NO',
                'Contract No',
                '',
                3
              )}
              <Grid size={{ xs: 12, md: 3 }}>
                <Controller
                  name="agreementDate"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <DatePicker
                      label={getLabel(
                        'CDL_OWN_AGREEMENT_DATE',
                        currentLanguage,
                        'Agreement Date'
                      )}
                      disabled={isViewMode}
                      value={field.value || null}
                      onChange={(newValue) => field.onChange(newValue)}
                      format="DD/MM/YYYY"
                      slots={{
                        openPickerIcon: StyledCalendarIcon,
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.agreementDate,
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
              {[
                'ModificationFeeNeeded',
                'ReservationBookingForm',
                'OqoodPaid',
              ].map((name) => (
                <Grid size={{ xs: 12, md: 4 }} key={name}>
                  <FormControlLabel
                    control={
                      <Controller
                        name={name}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            {...field}
                            checked={!!field.value}
                            disabled={isViewMode}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        )}
                      />
                    }
                    label={name.replace(/([A-Z])/g, ' $1')}
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
                </Grid>
              ))}
              {renderCheckboxField(
                'worldCheck',
                'CDL_OWN_WORLD_STATUS',
                'World Check',
                6
              )}
              {renderTextField(
                'paidInEscrow',
                'CDL_OWN_WITH_ESCROW',
                'Amount Paid to  Management Company/Developer (AED)  within Escrow',
                '',
                6
              )}
              {renderTextField(
                'paidOutEscrow',
                'CDL_OWN_OUTSIDE_ESCROW',
                'Amount Paid to Management Company/Developer (AED) out of Escrow',
                '',
                6
              )}
              {renderTextField(
                'totalPaid',
                'CDL_OWN_PARTNER_PAYMENT',
                'Total Amount Paid',
                '',
                6
              )}
              {renderTextField(
                'qaqoodAmount',
                'CDL_OWN_OQOOD_PAID',
                'Qaqood Amount Paid',
                '',
                3
              )}
              {renderTextField(
                'unitAreaSize',
                'CDL_OWN_UNIT_AREA',
                'Unit Area Size',
                '',
                3
              )}
              {renderTextField(
                'forfeitAmount',
                'CDL_OWN_FROFEIT_AMT',
                'Forfeit Amount',
                '',
                3
              )}
              {renderTextField(
                'dldAmount',
                'CDL_OWN_DLD_FEE',
                'Dld Amount',
                '',
                3
              )}
              {renderTextField(
                'refundAmount',
                'CDL_OWN_REFUND_AMOUNT',
                'Refund Amount',
                '',
                6
              )}
              {renderTextField(
                'transferredAmount',
                'CDL_OWN_TRANS_AMT',
                'Transferred Amount',
                '',
                6
              )}
              {renderTextField(
                'unitRemarks',
                'CDL_OWN_REMARKS',
                'Remarks',
                '',
                12
              )}
            </Grid>
          </CardContent>
        </Card>
      </LocalizationProvider>
    )
  }
)

Step2.displayName = 'Step2'

export default Step2
