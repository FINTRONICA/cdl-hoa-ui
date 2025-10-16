'use client'

import { useCapitalPartnerLabelsApi } from '@/hooks/useCapitalPartnerLabelsApi'
import { useAppStore } from '@/store'
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
} from 'react'
import { capitalPartnerPaymentPlanService } from '../../../../services/api/capitalPartnerPaymentPlanService'
import { useGetEnhanced } from '@/hooks/useApiEnhanced'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { PaymentPlanResponse } from '@/types/capitalPartner'
import dayjs from 'dayjs'
import {
  mapStep3ToCapitalPartnerPaymentPlanPayload,
  type Step3FormData,
} from '../../../../utils/capitalPartnerPaymentPlanMapper'

import {
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { PaymentPlanData, OwnerData } from '../investorsTypes'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import { useFormContext } from 'react-hook-form'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { RightSlideAddMultipleOwnersPanel } from '../../RightSlidePanel/ RightSlideAddMultipleOwnersPanel'
import { useDeleteConfirmation } from '@/store/confirmationDialogStore'

const valueSx = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#333',
  lineHeight: 1.4,
}

interface Step3Props {
  paymentPlan: PaymentPlanData[]
  onPaymentPlanChange: (paymentPlan: PaymentPlanData[]) => void
  onSaveAndNext?: (data: unknown) => void
  capitalPartnerId?: number | null
  isEditMode?: boolean
  isViewMode?: boolean
  owners?: OwnerData[]
  onOwnersChange?: (owners: OwnerData[]) => void
}

export interface Step3Ref {
  handleSaveAndNext: () => Promise<void>
}

const Step3 = forwardRef<Step3Ref, Step3Props>(
  (
    {
      paymentPlan,
      onPaymentPlanChange,
      onSaveAndNext,
      capitalPartnerId,
      isEditMode,
      isViewMode = false,
      owners = [],
      onOwnersChange,
    },
    ref
  ) => {
    const [saveError, setSaveError] = useState<string | null>(null)
    const [currentExistingPaymentPlanData, setCurrentExistingPaymentPlanData] =
      useState<PaymentPlanResponse[]>([])

    // Owner panel state
    const [isOwnerPanelOpen, setIsOwnerPanelOpen] = useState(false)
    const [ownerEditMode, setOwnerEditMode] = useState<'add' | 'edit'>('add')
    const [selectedOwner, setSelectedOwner] = useState<OwnerData | null>(null)
    const [selectedOwnerIndex, setSelectedOwnerIndex] = useState<number | null>(null)

    const { watch, setValue } = useFormContext()
    const { getLabel } = useCapitalPartnerLabelsApi()
    const currentLanguage = useAppStore((state) => state.language)
    const confirmDelete = useDeleteConfirmation()

    // Load existing payment plan data when in edit mode
    const {
      data: existingPaymentPlanData,
      isLoading: isLoadingExistingPaymentPlan,
    } = useGetEnhanced<PaymentPlanResponse[]>(
      `${API_ENDPOINTS.CAPITAL_PARTNER_PAYMENT_PLAN.GET_ALL}?capitalPartnerId.equals=${capitalPartnerId || 0}`,
      {},
      {
        enabled: Boolean(isEditMode && capitalPartnerId),
      }
    )

    // Update current existing payment plan data when fetched data changes
    useEffect(() => {
      if (existingPaymentPlanData) {
        setCurrentExistingPaymentPlanData([...existingPaymentPlanData])
      }
    }, [existingPaymentPlanData])

    // Pre-populate form when existing data is loaded
    useEffect(() => {
      if (
        isEditMode &&
        existingPaymentPlanData &&
        existingPaymentPlanData.length > 0 &&
        !isLoadingExistingPaymentPlan
      ) {
        // Map existing payment plan data to the form format
        const mappedPaymentPlan: PaymentPlanData[] =
          existingPaymentPlanData.map((plan, index) => {
            // Set the installment date in the form
            if (plan.cpppInstallmentDate) {
              setValue(
                `installmentDate${index}`,
                dayjs(plan.cpppInstallmentDate)
              )
            }

            return {
              installmentNumber: plan.cpppInstallmentNumber || index + 1,
              installmentPercentage: '',
              projectCompletionPercentage:
                plan.cpppBookingAmount?.toString() || '',
            }
          })

        // Update the payment plan state
        onPaymentPlanChange(mappedPaymentPlan)
      }
    }, [
      existingPaymentPlanData,
      isLoadingExistingPaymentPlan,
      isEditMode,
      setValue,
      onPaymentPlanChange,
    ])


    const handleSaveAndNext = useCallback(async () => {
      try {
        setSaveError(null)

        if (!capitalPartnerId) {
          setSaveError('Capital Partner ID is required from Step1')
          throw new Error('Capital Partner ID is required from Step1')
        }

        const installmentDates: { [key: string]: unknown } = {}
        paymentPlan.forEach((_, index) => {
          const dateKey = `installmentDate${index}`
          installmentDates[dateKey] = watch(dateKey)
        })

        const formData: Step3FormData = {
          paymentPlan: paymentPlan,
          installmentDates: installmentDates,
        }

        const payloadArray = mapStep3ToCapitalPartnerPaymentPlanPayload(
          formData,
          capitalPartnerId
        )

        const responses = []
        for (let i = 0; i < payloadArray.length; i++) {
          const payload = payloadArray[i]
          let response

          if (
            isEditMode &&
            currentExistingPaymentPlanData &&
            currentExistingPaymentPlanData.length > i
          ) {
            // Update existing payment plan
            const existingPaymentPlanId = currentExistingPaymentPlanData[i]?.id
            if (existingPaymentPlanId) {
              // Add the id to the payload for update requests
              const updatePayload = {
                ...payload,
                id: existingPaymentPlanId,
              }
              response =
                await capitalPartnerPaymentPlanService.updateCapitalPartnerPaymentPlan(
                  existingPaymentPlanId,
                  updatePayload
                )
            } else {
              // Fallback to create if no existing ID
              response =
                await capitalPartnerPaymentPlanService.createCapitalPartnerPaymentPlan(
                  payload
                )
            }
          } else {
            // Create new payment plan
            response =
              await capitalPartnerPaymentPlanService.createCapitalPartnerPaymentPlan(
                payload
              )
          }
          responses.push(response)
        }

        if (onSaveAndNext) {
          onSaveAndNext(responses)
        }
      } catch (error) {
        setSaveError(
          error instanceof Error ? error.message : 'Failed to save data'
        )
        throw error
      }
    }, [capitalPartnerId, paymentPlan, watch, onSaveAndNext, isEditMode, currentExistingPaymentPlanData])
    useImperativeHandle(
      ref,
      () => ({
        handleSaveAndNext,
      }),
      [handleSaveAndNext]
    )

    // Owner management functions
    const addOwner = () => {
      setOwnerEditMode('add')
      setSelectedOwner(null)
      setSelectedOwnerIndex(null)
      setIsOwnerPanelOpen(true)
    }

    const handleOwnerAdded = (newOwner: unknown) => {
      const updatedOwners = [...owners, newOwner as OwnerData]
      onOwnersChange?.(updatedOwners)
    }

    const handleOwnerUpdated = (updatedOwner: unknown, index: number) => {
      const updatedOwners = [...owners]
      updatedOwners[index] = updatedOwner as OwnerData
      onOwnersChange?.(updatedOwners)
    }

    const handleEditOwner = (owner: OwnerData, index: number) => {
      setOwnerEditMode('edit')
      setSelectedOwner(owner)
      setSelectedOwnerIndex(index)
      setIsOwnerPanelOpen(true)
    }

    const handleDeleteOwner = (owner: OwnerData, index: number) => {
      confirmDelete({
        itemName: `owner: ${owner.name}`,
        onConfirm: () => {
          const updatedOwners = owners.filter((_, i) => i !== index)
          onOwnersChange?.(updatedOwners)
        },
      })
    }

    const handleCloseOwnerPanel = () => {
      setIsOwnerPanelOpen(false)
      setOwnerEditMode('add')
      setSelectedOwner(null)
      setSelectedOwnerIndex(null)
    }


    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Card
          sx={{
            boxShadow: 'none',
            backgroundColor: '#FFFFFFBF',
            width: '94%',
            margin: '0 auto',
          }}
        >
          <CardContent>
            {saveError && (
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
                  ⚠️456 {saveError} mkmkmkmk
                </Typography>
              </Box>
            )}
            <Box display="flex" justifyContent="end" alignItems="center" mb={2}>
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineOutlinedIcon />}
                onClick={addOwner}
                disabled={isViewMode}
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '0.5px',
                  verticalAlign: 'middle',
                }}
              >
                {getLabel(
                  'CDL_OWN_ADD_JOINT_OWNER',
                  currentLanguage,
                  'Add New Joint Owner'
                )}
              </Button>
            </Box>
            <TableContainer
              component={Paper}
              sx={{ boxShadow: 'none', borderRadius: '8px' }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={valueSx}>
                      {getLabel('CDL_OWN_NAME', currentLanguage, 'Name')}
                    </TableCell>
                    <TableCell sx={valueSx}>
                      {getLabel('CDL_OWN_ADDRESS', currentLanguage, 'Address')}
                    </TableCell>
                    <TableCell sx={valueSx}>
                      {getLabel('CDL_OWN_EMAIL', currentLanguage, 'Email ID')}
                    </TableCell>
                    <TableCell sx={valueSx}>
                      {getLabel('CDL_OWN_COUNTRY_CODE', currentLanguage, 'Country Code')}
                    </TableCell>
                    <TableCell sx={valueSx}>
                      {getLabel('CDL_OWN_MOBILE', currentLanguage, 'Mobile No')}
                    </TableCell>
                    <TableCell sx={valueSx}>
                      {getLabel('CDL_OWN_TELEPHONE', currentLanguage, 'Telephone No')}
                    </TableCell>
                    <TableCell sx={valueSx}>
                      {getLabel('CDL_OWN_DOC_NO', currentLanguage, 'ID Number')}
                    </TableCell>
                    <TableCell sx={valueSx}>
                      {getLabel('CDL_OWN_ID_EXP', currentLanguage, 'ID Expiry Date')}
                    </TableCell>
                    <TableCell sx={valueSx}>
                      {getLabel('CDL_CP_ACTION', currentLanguage, 'Action')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {owners.map((owner, index) => (
                    <TableRow key={index}>
                      <TableCell>{owner.name}</TableCell>
                      <TableCell>{owner.address}</TableCell>
                      <TableCell>{owner.email}</TableCell>
                      <TableCell>{owner.countrycode}</TableCell>
                      <TableCell>{owner.mobileno}</TableCell>
                      <TableCell>{owner.telephoneno}</TableCell>
                      <TableCell>{owner.idNumber}</TableCell>
                      <TableCell>{owner.idExpiryDate}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditOwner(owner, index)}
                          disabled={isViewMode}
                          sx={{ mr: 1 }}
                        >
                          <Typography variant="body2" color="primary">
                            Edit
                          </Typography>
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteOwner(owner, index)}
                          disabled={isViewMode}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        <RightSlideAddMultipleOwnersPanel
          isOpen={isOwnerPanelOpen}
          onClose={handleCloseOwnerPanel}
          onContactAdded={handleOwnerAdded}
          onContactUpdated={handleOwnerUpdated}
          buildPartnerId={capitalPartnerId?.toString()}
          mode={ownerEditMode}
          {...(selectedOwner && { contactData: selectedOwner })}
          {...(selectedOwnerIndex !== null && {
            contactIndex: selectedOwnerIndex,
          })}
        />
      </LocalizationProvider>
    )
  }
)

Step3.displayName = 'Step3'

export default Step3
