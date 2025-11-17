'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material'
import { FormProvider, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Step1Component, { type Step1Ref } from './steps/Step1'
import Step2 from './steps/Step2'

import { MASTER_BUDGET_LABELS } from '@/constants/mappings/budgetLabels'
import DocumentUploadFactory from '@/components/organisms/DocumentUpload/DocumentUploadFactory'
import { useBudgetLabelsWithCache } from '@/hooks/budget/useBudgetLabelsWithCache'
import { budgetCategoryService } from '@/services/api/budgetApi/budgetCategoryService'

import {
  budgetMasterStep1Schema,
  type BudgetMasterStep1FormValues,
} from '@/lib/budgetSchemas';

interface MasterBudgetStepperWrapperProps {
  isReadOnly?: boolean;
}

const defaultValues: BudgetMasterStep1FormValues = {
  chargeTypeId: '',
  chargeType: '',
  groupNameId: '',
  groupName: '',
  categoryCode: '',
  categoryName: '',
  categorySubCode: '',
  categorySubName: '',
  categorySubToSubCode: '',
  categorySubToSubName: '',
  serviceCode: '',
  serviceName: '',
  provisionalBudgetCode: '',
}

const mapFormToPayload = (values: BudgetMasterStep1FormValues) => ({
  chargeTypeId: Number(values.chargeTypeId),
  chargeType: values.chargeType,
  serviceChargeGroupName: values.groupName, // Map groupName to serviceChargeGroupName for API
  categoryCode: values.categoryCode,
  categoryName: values.categoryName,
  categorySubCode: values.categorySubCode,
  categorySubName: values.categorySubName,
  categorySubToSubCode: values.categorySubToSubCode,
  categorySubToSubName: values.categorySubToSubName,
  serviceCode: values.serviceCode,
  serviceName: values.serviceName,
  provisionalBudgetCode: values.provisionalBudgetCode,
  enabled: true,
  deleted: false,
})

function MasterBudgetStepperContent({ isReadOnly = false }: MasterBudgetStepperWrapperProps) {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { getLabel } = useBudgetLabelsWithCache('EN')

  const [activeStep, setActiveStep] = useState(0)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const step1Ref = React.useRef<Step1Ref>(null)

  const methods = useForm<BudgetMasterStep1FormValues>({
    defaultValues,
    resolver: zodResolver(
      budgetMasterStep1Schema
    ) as Resolver<BudgetMasterStep1FormValues>,
    mode: 'onChange',
  })

  const steps = useMemo(
    () => [
      getLabel(
        MASTER_BUDGET_LABELS.STEPS.DETAILS,
        'EN',
        MASTER_BUDGET_LABELS.FALLBACKS.STEPS.DETAILS
      ),
      getLabel(
        MASTER_BUDGET_LABELS.STEPS.DOCUMENTS,
        'EN',
        MASTER_BUDGET_LABELS.FALLBACKS.STEPS.DOCUMENTS
      ),
      getLabel(
        MASTER_BUDGET_LABELS.STEPS.REVIEW,
        'EN',
        MASTER_BUDGET_LABELS.FALLBACKS.STEPS.REVIEW
      ),
    ],
    [getLabel]
  )

  useEffect(() => {
    const id = params?.id as string | undefined
    if (id) {
      setSavedId(id)
      setIsEditMode(true)
    } else {
      setSavedId(null)
      setIsEditMode(false)
    }
  }, [params?.id])

  useEffect(() => {
     const stepParam = searchParams?.get('step')
     if (stepParam) {
       const parsed = Number(stepParam)
       if (!Number.isNaN(parsed) && parsed >= 0 && parsed < steps.length) {
         setActiveStep(parsed)
       }
     }
  }, [searchParams, steps])

  const updateURL = useCallback(
    (step: number, id?: string | null) => {
      if (id && step >= 0) {
        // For edit mode, use /budget/budget-master/{id}?editing=true
        const queryParam = isReadOnly ? '?mode=view' : '?editing=true'
        router.push(`/budget/budget-master/${id}${queryParam}`)
      } else if (step === 0) {
        // For new mode, use /budget/budget-master/new
        router.push('/budget/budget-master/new')
      }
    },
    [router, isReadOnly]
  )

  const handleAsyncStep = async (stepRef: {
    handleSaveAndNext: () => Promise<void>
  }) => {
    try {
      console.log('[Index] handleAsyncStep called')
      setIsSaving(true)
      await stepRef.handleSaveAndNext()
      console.log('[Index] handleSaveAndNext completed successfully')
      return true
    } catch (error) {
      console.error('[Index] handleAsyncStep error:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save data'
      setErrorMessage(errorMessage)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const navigateToNextStep = (targetId?: string) => {
    const nextStep = activeStep + 1
    if (nextStep < steps.length) {
    setActiveStep(nextStep)
      updateURL(nextStep, targetId || savedId)
    }
  }

  const handleStep1SaveAndNext = (data: { id: string }) => {
    console.log('[Index] handleStep1SaveAndNext called with data:', data)
    if (data && data.id) {
      setSavedId(data.id)
      setIsEditMode(true)
      setSuccessMessage('Master budget saved successfully. Proceed to document upload.')
      // Navigation is handled by navigateToNextStep() in handleNext
    }
  }

  const handleNext = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent form submission
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    console.log('[Index] handleNext called', { 
      activeStep, 
      isReadOnly, 
      hasStep1Ref: !!step1Ref.current,
      step1RefCurrent: step1Ref.current,
      hasHandleSaveAndNext: !!(step1Ref.current?.handleSaveAndNext)
    })
    
    if (isReadOnly) {
      navigateToNextStep()
      return
    }

    if (activeStep === 0) {
      if (!step1Ref.current) {
        console.error('[Index] step1Ref.current is null! Cannot save.')
        setErrorMessage('Form is not ready. Please wait a moment and try again.')
        return
      }
      
      if (!step1Ref.current.handleSaveAndNext) {
        console.error('[Index] step1Ref.current.handleSaveAndNext is not available!')
        setErrorMessage('Save function is not available. Please refresh the page.')
        return
      }
      
      console.log('[Index] Calling handleAsyncStep for step 0')
      const success = await handleAsyncStep(step1Ref.current)
      console.log('[Index] handleAsyncStep result:', success)
      if (success) {
        navigateToNextStep()
      }
      return
    }

    if (activeStep === 1) {
      navigateToNextStep()
      return
    }

    navigateToNextStep()
  }

  const handleBack = () => {
    const prevStep = activeStep - 1
    if (prevStep >= 0) {
    setActiveStep(prevStep)
      updateURL(prevStep, savedId)
    }
  }

  const handleReset = () => {
    setActiveStep(0)
    setSavedId(null)
    setIsEditMode(false)
    methods.reset(defaultValues)
    router.push('/budget/budget-master')
  }


  const handleEdit = () => {
    if (!savedId) {
      setErrorMessage('No master budget ID found to edit.')
      return
    }

    setActiveStep(0)
    updateURL(0, savedId)
    setSuccessMessage('Returned to master budget details.')
  }

  const handleEditDocuments = () => {
    if (!savedId) {
      setErrorMessage('No master budget ID found to manage documents.')
      return
    }

    setActiveStep(1)
    updateURL(1, savedId)
  }

  const onSubmit = () => {
    // Empty handler - actual submission handled by handleSubmit
  }

  const handleSubmit = async () => {
    try {
      setErrorMessage(null)
      setSuccessMessage(null)
      setIsSubmitting(true)

      if (!savedId) {
        setErrorMessage('Please save the master budget details before submitting.')
        setIsSubmitting(false)
        return
      }

      const values = methods.getValues()
      const payload = mapFormToPayload(values)
      // Include id in payload for update
      const updatePayload = {
        ...payload,
        id: Number(savedId),
      }
      await budgetCategoryService.updateBudgetCategory(Number(savedId), updatePayload as any)

      setSuccessMessage('Master budget submitted successfully!')
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        router.push('/budget/budget-master')
      }, 1500)
    } catch (error) {
      const errorData = error as {
        response?: { data?: { message?: string } }
        message?: string
      }
      const errorMsg =
        errorData?.response?.data?.message ||
        errorData?.message ||
        'Failed to submit master budget. Please try again.'
      setErrorMessage(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }


  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Step1Component
            ref={step1Ref}
            key={`${savedId ?? 'new'}-${activeStep}`}
            onSaveAndNext={handleStep1SaveAndNext}
            savedId={savedId}
            isEditMode={isEditMode}
            isReadOnly={isReadOnly}
            refreshKey={activeStep}
          />
        )
      case 1:
        if (!savedId) {
          return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="error">
                {getLabel(
                  MASTER_BUDGET_LABELS.DOCUMENTS.SAVE_HEADING,
                  'EN',
                  MASTER_BUDGET_LABELS.FALLBACKS.DOCUMENTS.SAVE_HEADING
                )}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {getLabel(
                  MASTER_BUDGET_LABELS.DOCUMENTS.SAVE_MESSAGE,
                  'EN',
                  MASTER_BUDGET_LABELS.FALLBACKS.DOCUMENTS.SAVE_MESSAGE
                )}
              </Typography>
            </Box>
          )
        }

        return (
          <DocumentUploadFactory
            type="BUDGET"
            entityId={savedId}
            isOptional
            isReadOnly={isReadOnly}
            onDocumentsChange={(documents) => {
              methods.setValue('documents', documents)
            }}
          />
        )
      case 2:
        return (
          <Step2
            key={`step2-${savedId || 'new'}-${activeStep}`}
            onEdit={handleEdit}
            onEditDocuments={handleEditDocuments}
            isReadOnly={isReadOnly}
          />
        )
      default:
        return null
    }
  }


  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Box
          sx={{
            width: '100%',
            backgroundColor: '#FFFFFFBF',
            borderRadius: '16px',
            paddingTop: '16px',
            border: '1px solid #FFFFFF',
            position: 'relative',
          }}
        >
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '12px',
                      lineHeight: '100%',
                      letterSpacing: '0.36px',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      textTransform: 'uppercase',
                    }}
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box
            key={`step-${activeStep}-${savedId}`}
            sx={{ my: 4, backgroundColor: '#FFFFFFBF', boxShadow: 'none' }}
          >
            {getStepContent(activeStep)}

              <Box
                display="flex"
                justifyContent="space-between"
              sx={{ backgroundColor: '#FFFFFFBF', mt: 3, mx: 6, mb: 2 }}
            >
              <Button
                type="button"
                onClick={handleReset}
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: 0,
                }}
              >
                Cancel
              </Button>
              <Box>
                {activeStep !== 0 && (
                  <Button
                    type="button"
                    onClick={handleBack}
                    sx={{
                      width: '114px',
                      height: '36px',
                      gap: '6px',
                      opacity: 1,
                      paddingTop: '2px',
                      paddingRight: '3px',
                      paddingBottom: '2px',
                      paddingLeft: '3px',
                      borderRadius: '6px',
                      backgroundColor: '#DBEAFE',
                      color: '#155DFC',
                      border: 'none',
                      mr: 2,
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 500,
                      fontStyle: 'normal',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: 0,
                    }}
                    variant="outlined"
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={
                    activeStep === steps.length - 1
                      ? isReadOnly
                        ? () => router.push('/budget/budget-master')
                        : handleSubmit
                      : handleNext
                  }
                  variant="contained"
                  disabled={
                    isSaving ||
                    (activeStep === steps.length - 1 && isSubmitting)
                  }
                  sx={{
                    width: '114px',
                    height: '36px',
                    gap: '6px',
                    opacity: 1,
                    paddingTop: '2px',
                    paddingRight: '3px',
                    paddingBottom: '2px',
                    paddingLeft: '3px',
                    borderRadius: '6px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    boxShadow: 'none',
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 500,
                    fontStyle: 'normal',
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: 0,
                  }}
                >
                  {isSaving || isSubmitting
                    ? activeStep === steps.length - 1
                      ? 'Submitting...'
                      : 'Saving...'
                    : activeStep === steps.length - 1
                      ? isReadOnly
                        ? 'Close'
                        : 'Submit'
                      : isReadOnly
                        ? 'Next'
                        : 'Save and Next'}
                </Button>
              </Box>
            </Box>

            {/* Error and Success Notifications */}
            <Snackbar
              open={!!errorMessage}
              autoHideDuration={6000}
              onClose={() => setErrorMessage(null)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert
                onClose={() => setErrorMessage(null)}
                severity="error"
                sx={{ width: '100%' }}
              >
                {errorMessage}
              </Alert>
            </Snackbar>
            <Snackbar
              open={!!successMessage}
              autoHideDuration={3000}
              onClose={() => setSuccessMessage(null)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert
                onClose={() => setSuccessMessage(null)}
                severity="success"
                sx={{ width: '100%' }}
              >
                {successMessage}
              </Alert>
            </Snackbar>
          </Box>
        </Box>
      </form>
    </FormProvider>
  )
}

export default function MasterBudgetStepperWrapper({
  isReadOnly = false,
}: MasterBudgetStepperWrapperProps = {}) {
  return <MasterBudgetStepperContent isReadOnly={isReadOnly} />
}

