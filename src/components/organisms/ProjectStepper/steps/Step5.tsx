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
import { Pencil, Trash2 } from 'lucide-react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
  compactFieldStyles,
  compactLabelSx,
  compactValueSx,
  cardStyles,
} from '../styles'

import { usePaymentPlans, useSaveProjectPaymentPlan, useDeletePaymentPlan } from '@/hooks/useProjects'
import { useProjectLabels } from '@/hooks/useProjectLabels'

interface Step5Props {
  paymentPlan: PaymentPlanData[]
  onPaymentPlanChange: (paymentPlan: PaymentPlanData[]) => void
  projectId?: string
  isViewMode?: boolean
}

const Step5: React.FC<Step5Props> = ({ paymentPlan, onPaymentPlanChange, projectId, isViewMode = false }) => {

  const safePaymentPlan = paymentPlan || []

  const { getLabel } = useProjectLabels()

  const { data: existingPaymentPlans } = usePaymentPlans(projectId || '')
  const savePaymentPlanMutation = useSaveProjectPaymentPlan()
  const deletePaymentPlanMutation = useDeletePaymentPlan()

  const [editModeRows, setEditModeRows] = React.useState<Record<number, boolean>>({})

 
  const validateField = (fieldName: string, value: string | number) => {
    try {
      if (fieldName.includes('installmentPercentage')) {
        if (!value || value === '') return 'Installment Percentage is required'
        if (typeof value === 'string' && value.length > 5) return 'Installment Percentage must be maximum 5 characters'
        if (typeof value === 'string' && !/^[0-9]+(\.[0-9]{1,2})?$/.test(value)) {
          return 'Installment Percentage must be a valid number (e.g., 25 or 25.5)'
        }
      }
      if (fieldName.includes('projectCompletionPercentage')) {
        if (!value || value === '') return 'Project Completion Percentage is required'
        if (typeof value === 'string' && value.length > 5) return 'Project Completion Percentage must be maximum 5 characters'
        if (typeof value === 'string' && !/^[0-9]+(\.[0-9]{1,2})?$/.test(value)) {
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
      const shouldLoadData = safePaymentPlan.length === 0 || 
        (safePaymentPlan.length !== existingPaymentPlans.length) ||
        (safePaymentPlan.length > 0 && existingPaymentPlans.length > 0 && 
         safePaymentPlan[0]?.installmentNumber !== existingPaymentPlans[0]?.reappInstallmentNumber)
      
      if (shouldLoadData) {
        const transformedPlans = existingPaymentPlans.map((plan: any) => ({
          id: plan.id, 
          installmentNumber: plan.reappInstallmentNumber,
          installmentPercentage: plan.reappInstallmentPercentage?.toString() || '',
          projectCompletionPercentage: plan.reappProjectCompletionPercentage?.toString() || '',
        }))
        
        // Load the data into the form
        onPaymentPlanChange(transformedPlans)
        
        // Clear edit mode states - existing plans should be displayed as "saved" (disabled)
        // This ensures they show with disabled fields and edit icons
        setEditModeRows({})
      }
    }
  }, [existingPaymentPlans, safePaymentPlan.length, onPaymentPlanChange])
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
    safePaymentPlan.forEach(plan => {
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
    
    const nextInstallmentNumber = existingNumbers.length > 0 
      ? Math.max(...existingNumbers) + 1
      : 1

    const newIndex = safePaymentPlan.length
    
    // Mark the new row as editable
    setEditModeRows(prev => ({ ...prev, [newIndex]: true }))
    
    onPaymentPlanChange([
      ...safePaymentPlan,
      {
        installmentNumber: nextInstallmentNumber,
        installmentPercentage: '',
        projectCompletionPercentage: '',
      },
    ])
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
    setEditModeRows(prev => {
      const newState = { ...prev }
      delete newState[index]
      return newState
    })
    
    onPaymentPlanChange(reorderedPlan)
  }

  // Phase 2 & 3: Enable edit mode for a specific row
  const enableEditMode = (index: number) => {
    setEditModeRows(prev => ({ ...prev, [index]: true }))
  }

  // Phase 3: Save individual payment plan row
  const saveIndividualPaymentPlan = async (plan: PaymentPlanData, index: number) => {
    if (!projectId) {
     
      return
    }

    // Validate the row data
    const installmentError = validateField(`installmentPercentage${index}`, plan.installmentPercentage)
    const completionError = validateField(`projectCompletionPercentage${index}`, plan.projectCompletionPercentage)
    
    if (installmentError || completionError) {
      
      return
    }

    try {
  
      const isEdit = !!plan.id
      
      await savePaymentPlanMutation.mutateAsync({
        projectId: projectId,
        data: plan,
        isEdit: isEdit 
      })
      
      setEditModeRows(prev => {
        const newState = { ...prev }
        delete newState[index]
        return newState
      })
      
  
      
    } catch (error) {
      
    }
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
                {getLabel('CDL_BPA_ADD_INSTALLMENT', 'Add New Installment')}
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
                    {getLabel('CDL_BPA_INSTALLMENT_NO', 'Installment Sequence Number')}
                  </TableCell>
                  <TableCell sx={compactValueSx}>
                    {getLabel('CDL_BPA_INSTALLMENT_PER', 'Installment Percentage (%)')}
                  </TableCell>
                  <TableCell sx={compactValueSx}>
                    {getLabel('CDL_BPA_PROJ_COM_PER', 'Asset Completion Percentage (%)')}
                  </TableCell>
                  <TableCell sx={compactValueSx}>
                    {getLabel('CDL_BPA_ACTION', 'Action')}
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
                        placeholder={getLabel('CDL_BPA_INSTALLMENT_PER', 'Installment Percentage')}
                        value={plan.installmentPercentage}
                        onChange={(e) =>
                          handlePaymentPlanChange(
                            index,
                            'installmentPercentage',
                            e.target.value
                          )
                        }
                        error={!!validateField(`installmentPercentage${index}`, plan.installmentPercentage)}
                        helperText={validateField(`installmentPercentage${index}`, plan.installmentPercentage)}
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
                        placeholder={getLabel('CDL_BPA_PROJ_COM_PER', 'Project Completion Percentage')}
                        value={plan.projectCompletionPercentage}
                        onChange={(e) =>
                          handlePaymentPlanChange(
                            index,
                            'projectCompletionPercentage',
                            e.target.value
                          )
                        }
                        error={!!validateField(`projectCompletionPercentage${index}`, plan.projectCompletionPercentage)}
                        helperText={validateField(`projectCompletionPercentage${index}`, plan.projectCompletionPercentage)}
                        InputLabelProps={{ sx: compactLabelSx }}
                        InputProps={{ sx: compactValueSx }}
                        sx={compactFieldStyles}
                      />
                    </TableCell>
                    <TableCell>
                      {!isViewMode && (
                        <div className="flex items-center space-x-2">
                          {isRowInEditMode ? (
                            // Show Save/Update button when in edit mode
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => saveIndividualPaymentPlan(plan, index)}
                              disabled={savePaymentPlanMutation.isPending}
                              sx={{
                                fontFamily: 'Outfit, sans-serif',
                                fontWeight: 500,
                                fontSize: '14px',
                                textTransform: 'none',
                                minWidth: '70px',
                              }}
                            >
                              {savePaymentPlanMutation.isPending 
                                ? (plan.id ? 'Updating...' : 'Saving...') 
                                : (plan.id ? 'Update' : 'Save')
                              }
                            </Button>
                          ) : (
                            // Show Edit icon when not in edit mode
                            <button
                              onClick={() => enableEditMode(index)}
                              className="p-1 transition-colors rounded cursor-pointer hover:bg-blue-50"
                              aria-label="Edit"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4 text-blue-600 hover:text-blue-800" />
                            </button>
                          )}
                          <button
                            onClick={() => deletePaymentPlan(index)}
                            className="p-1 transition-colors rounded cursor-pointer hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Delete"
                            title="Delete"
                            disabled={deletePaymentPlanMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 text-red-600 hover:text-red-800" />
                          </button>
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
