'use client'

import React from 'react'
import {
  Box,
  TextField,
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
} from '@mui/material'
import { PaymentPlanData } from '../types'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
  compactFieldStyles,
  compactLabelSx,
  compactValueSx,
  cardStyles,
} from '../styles'

import {
  usePaymentPlans,
  useSaveProjectPaymentPlan,
  useDeletePaymentPlan,
} from '@/hooks/useProjects'
// import { useProjectLabels } from '@/hooks/useProjectLabels'
import { useBuildPartnerAssetLabelsWithUtils } from '@/hooks/useBuildPartnerAssetLabels'

interface Step5Props {
  paymentPlan: PaymentPlanData[]
  onPaymentPlanChange: (paymentPlan: PaymentPlanData[]) => void
  projectId?: string
  isViewMode?: boolean
}

const Step5: React.FC<Step5Props> = ({
  paymentPlan,
  onPaymentPlanChange,
  projectId,
  isViewMode = false,
}) => {
  const safePaymentPlan = paymentPlan || []

  // const { getLabel } = useProjectLabels()
  const { getLabel } = useBuildPartnerAssetLabelsWithUtils()
  const language = 'EN'
  const { data: existingPaymentPlans } = usePaymentPlans(projectId || '')
  const savePaymentPlanMutation = useSaveProjectPaymentPlan()
  const deletePaymentPlanMutation = useDeletePaymentPlan()

  const [editModeRows, setEditModeRows] = React.useState<
    Record<number, boolean>
  >({})
  const [touchedFields, setTouchedFields] = React.useState<
    Record<string, boolean>
  >({})
  const [originalValues, setOriginalValues] = React.useState<
    Record<number, PaymentPlanData>
  >({})

  // Helper function to mark a field as touched
  const markFieldAsTouched = (fieldName: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }))
  }

  // Helper function to check if we should show validation error
  const shouldShowError = (fieldName: string, value: string | number) => {
    // Only show error if field has been touched
    if (!touchedFields[fieldName]) return false
    return !!validateField(fieldName, value)
  }

  // Helper function to get error message
  const getErrorMessage = (fieldName: string, value: string | number) => {
    if (!touchedFields[fieldName]) return ''
    return validateField(fieldName, value) || ''
  }

  const validateField = (fieldName: string, value: string | number) => {
    try {
      if (fieldName.includes('installmentPercentage')) {
        if (!value || value === '') return 'Installment Percentage is required'
        if (typeof value === 'string' && value.length > 5)
          return 'Installment Percentage must be maximum 5 characters'
        if (
          typeof value === 'string' &&
          !/^[0-9]+(\.[0-9]{1,2})?$/.test(value)
        ) {
          return 'Installment Percentage must be a valid number (e.g., 25 or 25.5)'
        }
      }
      if (fieldName.includes('projectCompletionPercentage')) {
        if (!value || value === '')
          return 'Project Completion Percentage is required'
        if (typeof value === 'string' && value.length > 5)
          return 'Project Completion Percentage must be maximum 5 characters'
        if (
          typeof value === 'string' &&
          !/^[0-9]+(\.[0-9]{1,2})?$/.test(value)
        ) {
          return 'Project Completion Percentage must be a valid number (e.g., 25 or 25.5)'
        }
      }
      return null
    } catch (error) {
      return 'Invalid input'
    }
  }

  React.useEffect(() => {
    if (existingPaymentPlans && existingPaymentPlans.length > 0) {
      // Transform server data
      const transformedPlans = existingPaymentPlans.map((plan: any) => ({
        id: plan.id,
        installmentNumber: plan.reappInstallmentNumber,
        installmentPercentage:
          plan.reappInstallmentPercentage?.toString() || '',
        projectCompletionPercentage:
          plan.reappProjectCompletionPercentage?.toString() || '',
      }))

      // Check if we have any local rows that aren't on the server yet (unsaved new rows)
      const localUnsavedRows = safePaymentPlan.filter(
        (localPlan) =>
          !localPlan.id &&
          !transformedPlans.some(
            (serverPlan) =>
              serverPlan.installmentNumber === localPlan.installmentNumber
          )
      )

      // Only load if:
      // 1. Local state is empty (initial load), OR
      // 2. Server has different data (more/less plans, OR different plan IDs)
      // But DON'T load if we have local unsaved rows that would be lost
      const shouldLoadData =
        safePaymentPlan.length === 0 ||
        (localUnsavedRows.length === 0 &&
          (existingPaymentPlans.length !== safePaymentPlan.length ||
            safePaymentPlan.some(
              (plan, idx) => plan.id !== transformedPlans[idx]?.id
            )))

      if (shouldLoadData) {
        // Load the data into the form
        onPaymentPlanChange(transformedPlans)

        // Clear edit mode states - existing plans should be displayed as "saved" (disabled)
        setEditModeRows({})

        // Clear touched fields when loading existing data
        setTouchedFields({})

        // Clear original values when loading fresh data
        setOriginalValues({})
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingPaymentPlans])

  const handlePaymentPlanChange = (
    index: number,
    field: keyof PaymentPlanData,
    value: unknown
  ) => {
    const updatedPaymentPlan = [...safePaymentPlan]
    updatedPaymentPlan[index] = {
      ...updatedPaymentPlan[index],
      [field]: value,
    } as PaymentPlanData
    onPaymentPlanChange(updatedPaymentPlan)
  }

  const addPaymentPlan = () => {
    const existingNumbers: number[] = []
    safePaymentPlan.forEach((plan) => {
      if (plan.installmentNumber) {
        existingNumbers.push(plan.installmentNumber)
      }
    })

    if (existingPaymentPlans && existingPaymentPlans.length > 0) {
      existingPaymentPlans.forEach((plan: any) => {
        if (plan.reappInstallmentNumber) {
          existingNumbers.push(plan.reappInstallmentNumber)
        }
      })
    }

    const nextInstallmentNumber =
      existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1

    const newIndex = safePaymentPlan.length

    const newPlan: PaymentPlanData = {
      installmentNumber: nextInstallmentNumber,
      installmentPercentage: '',
      projectCompletionPercentage: '',
    }

    // Mark the new row as editable
    setEditModeRows((prev) => ({ ...prev, [newIndex]: true }))

    // Store original values for the new row (empty values)
    setOriginalValues((prev) => ({ ...prev, [newIndex]: { ...newPlan } }))

    onPaymentPlanChange([...safePaymentPlan, newPlan])
  }

  const deletePaymentPlan = async (index: number) => {
    const plan = safePaymentPlan[index]

    if (!plan) {
      return
    }

    if (plan.id) {
      try {
        await deletePaymentPlanMutation.mutateAsync(plan.id)
      } catch (error) {
        return
      }
    }

    const updatedPaymentPlan = safePaymentPlan.filter((_, i) => i !== index)

    const reorderedPlan = updatedPaymentPlan.map((plan, idx) => ({
      ...plan,
      installmentNumber: idx + 1,
    }))

    // Clean up state for deleted row
    setEditModeRows((prev) => {
      const newState = { ...prev }
      delete newState[index]
      return newState
    })

    // Clean up touched fields for deleted row
    setTouchedFields((prev) => {
      const newState = { ...prev }
      delete newState[`installmentPercentage${index}`]
      delete newState[`projectCompletionPercentage${index}`]
      return newState
    })

    // Clean up original values for deleted row
    setOriginalValues((prev) => {
      const newState = { ...prev }
      delete newState[index]
      return newState
    })

    onPaymentPlanChange(reorderedPlan)
  }

  // Phase 2 & 3: Enable edit mode for a specific row
  const enableEditMode = (index: number) => {
    // Store the original values before enabling edit mode
    const currentPlan = safePaymentPlan[index]
    if (currentPlan) {
      setOriginalValues((prev) => ({ ...prev, [index]: { ...currentPlan } }))
    }
    setEditModeRows((prev) => ({ ...prev, [index]: true }))
  }

  // Cancel edit and restore original values
  const cancelEdit = (index: number) => {
    const plan = safePaymentPlan[index]

    // If this is a new row (no ID), remove it
    if (!plan?.id) {
      const updatedPaymentPlan = safePaymentPlan.filter((_, i) => i !== index)
      onPaymentPlanChange(updatedPaymentPlan)
    } else {
      // If editing existing row, restore original values
      const originalValue = originalValues[index]
      if (originalValue) {
        const updatedPaymentPlan = [...safePaymentPlan]
        updatedPaymentPlan[index] = { ...originalValue }
        onPaymentPlanChange(updatedPaymentPlan)
      }
    }

    // Clear edit mode
    setEditModeRows((prev) => {
      const newState = { ...prev }
      delete newState[index]
      return newState
    })

    // Clear touched fields for this row
    setTouchedFields((prev) => {
      const newState = { ...prev }
      delete newState[`installmentPercentage${index}`]
      delete newState[`projectCompletionPercentage${index}`]
      return newState
    })

    // Clear original values
    setOriginalValues((prev) => {
      const newState = { ...prev }
      delete newState[index]
      return newState
    })
  }

  // Phase 3: Save individual payment plan row
  const saveIndividualPaymentPlan = async (
    plan: PaymentPlanData,
    index: number
  ) => {
    if (!projectId) {
      return
    }

    // Mark fields as touched when attempting to save
    markFieldAsTouched(`installmentPercentage${index}`)
    markFieldAsTouched(`projectCompletionPercentage${index}`)

    // Validate the row data
    const installmentError = validateField(
      `installmentPercentage${index}`,
      plan.installmentPercentage
    )
    const completionError = validateField(
      `projectCompletionPercentage${index}`,
      plan.projectCompletionPercentage
    )

    if (installmentError || completionError) {
      return
    }

    try {
      const isEdit = !!plan.id

      await savePaymentPlanMutation.mutateAsync({
        projectId: projectId,
        data: plan,
        isEdit: isEdit,
      })

      // Clear edit mode
      setEditModeRows((prev) => {
        const newState = { ...prev }
        delete newState[index]
        return newState
      })

      // Clear touched fields for this row
      setTouchedFields((prev) => {
        const newState = { ...prev }
        delete newState[`installmentPercentage${index}`]
        delete newState[`projectCompletionPercentage${index}`]
        return newState
      })

      // Clear original values for this row
      setOriginalValues((prev) => {
        const newState = { ...prev }
        delete newState[index]
        return newState
      })
    } catch (error) {}
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={cardStyles}>
        <CardContent>
          <Box display="flex" justifyContent="end" alignItems="center" mb={2}>
            {!isViewMode && (
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineOutlinedIcon />}
                onClick={addPaymentPlan}
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
                  'CDL_BPA_ADD_INSTALLMENT',
                  language,
                  'Add New Installment'
                )}
              </Button>
            )}
          </Box>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: 'none', borderRadius: '8px' }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={compactValueSx}>
                    {getLabel(
                      'CDL_BPA_INSTALLMENT_NO',
                      language,
                      'Installment Sequence Number'
                    )}
                  </TableCell>
                  <TableCell sx={compactValueSx}>
                    {getLabel(
                      'CDL_BPA_INSTALLMENT_PER',
                      language,
                      'Installment Percentage (%)'
                    )}
                  </TableCell>
                  <TableCell sx={compactValueSx}>
                    {getLabel(
                      'CDL_BPA_PROJ_COM_PER',
                      language,
                      'Asset Completion Percentage (%)'
                    )}
                  </TableCell>
                  <TableCell sx={compactValueSx}>
                    {getLabel('CDL_BPA_ACTION', language, 'Action')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {safePaymentPlan.map((plan, index) => {
                  const isRowInEditMode = editModeRows[index] || false
                  const isRowDisabled = isViewMode || !isRowInEditMode

                  return (
                    <TableRow key={index}>
                      <TableCell>{plan.installmentNumber}</TableCell>
                      <TableCell>
                        <TextField
                          name={`installmentPercentage${index}`}
                          size="small"
                          disabled={isRowDisabled}
                          fullWidth
                          required
                          placeholder={getLabel(
                            'CDL_BPA_INSTALLMENT_PER',
                            language,
                            'Installment Percentage'
                          )}
                          value={plan.installmentPercentage}
                          onChange={(e) =>
                            handlePaymentPlanChange(
                              index,
                              'installmentPercentage',
                              e.target.value
                            )
                          }
                          onBlur={() =>
                            markFieldAsTouched(`installmentPercentage${index}`)
                          }
                          error={shouldShowError(
                            `installmentPercentage${index}`,
                            plan.installmentPercentage
                          )}
                          helperText={getErrorMessage(
                            `installmentPercentage${index}`,
                            plan.installmentPercentage
                          )}
                          InputLabelProps={{ sx: compactLabelSx }}
                          InputProps={{ sx: compactValueSx }}
                          sx={compactFieldStyles}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name={`bookingAmount${index}`}
                          size="small"
                          fullWidth
                          required
                          disabled={isRowDisabled}
                          placeholder={getLabel(
                            'CDL_BPA_PROJ_COM_PER',
                            language,
                            'Asset Completion Percentage (%)'
                          )}
                          value={plan.projectCompletionPercentage}
                          onChange={(e) =>
                            handlePaymentPlanChange(
                              index,
                              'projectCompletionPercentage',
                              e.target.value
                            )
                          }
                          onBlur={() =>
                            markFieldAsTouched(
                              `projectCompletionPercentage${index}`
                            )
                          }
                          error={shouldShowError(
                            `projectCompletionPercentage${index}`,
                            plan.projectCompletionPercentage
                          )}
                          helperText={getErrorMessage(
                            `projectCompletionPercentage${index}`,
                            plan.projectCompletionPercentage
                          )}
                          InputLabelProps={{ sx: compactLabelSx }}
                          InputProps={{ sx: compactValueSx }}
                          sx={compactFieldStyles}
                        />
                      </TableCell>
                      <TableCell>
                        {!isViewMode && (
                          <div className="flex items-center space-x-2">
                            {isRowInEditMode ? (
                              // Show Check and Cancel icons when in edit mode
                              <>
                                <button
                                  onClick={() =>
                                    saveIndividualPaymentPlan(plan, index)
                                  }
                                  disabled={savePaymentPlanMutation.isPending}
                                  className="p-1 transition-colors rounded cursor-pointer hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                  aria-label="Save"
                                  title="Save"
                                >
                                  <Check className="w-5 h-5 text-green-600 hover:text-green-800" />
                                </button>
                                <button
                                  onClick={() => cancelEdit(index)}
                                  disabled={savePaymentPlanMutation.isPending}
                                  className="p-1 transition-colors rounded cursor-pointer hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                  aria-label="Cancel"
                                  title="Cancel"
                                >
                                  <X className="w-5 h-5 text-red-600 hover:text-red-800" />
                                </button>
                              </>
                            ) : (
                              // Show Edit and Delete icons when not in edit mode
                              <>
                                <button
                                  onClick={() => enableEditMode(index)}
                                  className="p-1 transition-colors rounded cursor-pointer hover:bg-blue-50"
                                  aria-label="Edit"
                                  title="Edit"
                                >
                                  <Pencil className="w-4 h-4 text-blue-600 hover:text-blue-800" />
                                </button>
                                <button
                                  onClick={() => deletePaymentPlan(index)}
                                  className="p-1 transition-colors rounded cursor-pointer hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                  aria-label="Delete"
                                  title="Delete"
                                  disabled={deletePaymentPlanMutation.isPending}
                                >
                                  <Trash2 className="w-4 h-4 text-red-600 hover:text-red-800" />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </LocalizationProvider>
  )
}

export default Step5
