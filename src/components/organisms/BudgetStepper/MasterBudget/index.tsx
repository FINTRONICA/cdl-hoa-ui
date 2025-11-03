'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'
import { FormProvider, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Step1 from './steps/Step1'
import Step2 from './steps/Step2'
import { MasterBudgetDataProvider, useMasterBudgetData } from './steps/BudgetDataProvider'
import { useBudgetLabels } from '@/hooks/budget/useBudgetLabels'
import { MASTER_BUDGET_LABELS } from '@/constants/mappings/budgetLabels'
import DocumentUploadFactory from '@/components/organisms/DocumentUpload/DocumentUploadFactory'
import { GlobalLoading } from '@/components/atoms'
import { masterBudgetService } from '@/services/api/budget/masterBudgetService'
import {
  budgetMasterStep1Schema,
  type BudgetMasterStep1FormValues,
} from '@/lib/validation/budgetSchemas'

interface MasterBudgetStepperWrapperProps {
  isReadOnly?: boolean
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
  groupName: values.groupName,
  categoryCode: values.categoryCode,
  categoryName: values.categoryName,
  categorySubCode: values.categorySubCode,
  categorySubName: values.categorySubName,
  categorySubToSubCode: values.categorySubToSubCode,
  categorySubToSubName: values.categorySubToSubName,
  serviceCode: values.serviceCode,
  serviceName: values.serviceName,
  provisionalBudgetCode: values.provisionalBudgetCode,
})

function MasterBudgetStepperContent({ isReadOnly = false }: MasterBudgetStepperWrapperProps) {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { isInitialLoading } = useMasterBudgetData()
  const { getLabel } = useBudgetLabels('EN')

  const [activeStep, setActiveStep] = useState(0)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const navigateToStep = useCallback(
    (stepIndex: number, targetId?: string | null) => {
      const id = targetId ?? savedId
      const query = `?step=${stepIndex}`
      if (id) {
        router.push(`/budget/master-budget/new/${id}${query}`)
      } else {
        router.push(`/budget/master-budget/new${query}`)
      }
    },
    [router, savedId]
  )

  const handleNext = () => {
    const nextStep = Math.min(activeStep + 1, steps.length - 1)
    setActiveStep(nextStep)
    navigateToStep(nextStep)
    toast.success(`Moved to ${steps[nextStep]} step.`)
  }

  const handleBack = () => {
    const prevStep = Math.max(activeStep - 1, 0)
    setActiveStep(prevStep)
    navigateToStep(prevStep)
  }

  const handleReset = () => {
    setActiveStep(0)
    setSavedId(null)
    setIsEditMode(false)
    methods.reset(defaultValues)
    router.push('/budget/master-budget')
  }

  const handleSaveAndNext = async () => {
    try {
      setIsSaving(true)
      const values = methods.getValues()
      const payload = mapFormToPayload(values)
      const response = await masterBudgetService.createBudget(payload)

      setSavedId(response.id)
      setIsEditMode(true)
      setActiveStep(1)
      navigateToStep(1, response.id)

      toast.success('Master budget saved successfully. Proceed to document upload.')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save master budget details'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!savedId) {
      toast.error('No saved master budget found to update.')
      return
    }

    try {
      setIsSaving(true)
      const values = methods.getValues()
      const payload = mapFormToPayload(values)
      await masterBudgetService.updateBudget(savedId, payload)

      setActiveStep(1)
      navigateToStep(1)
      toast.success('Master budget updated successfully.')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update master budget details'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = () => {
    if (!savedId) {
      toast.error('No master budget ID found to edit.')
      return
    }

    setActiveStep(0)
    navigateToStep(0)
    toast.success('Returned to master budget details.')
  }

  const handleEditDocuments = () => {
    if (!savedId) {
      toast.error('No master budget ID found to manage documents.')
      return
    }

    setActiveStep(1)
    navigateToStep(1)
  }

  const onSubmit = async () => {
    if (!savedId) {
      toast.error('Please save the master budget details before submitting.')
      return
    }

    try {
      setIsSubmitting(true)
      const values = methods.getValues()
      const payload = mapFormToPayload(values)
      await masterBudgetService.updateBudget(savedId, payload)

      toast.success('Master budget submitted successfully!')
      router.push('/budget/master-budget')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit master budget.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const onError = (errors: Record<string, unknown>) => {
    const messages = Object.values(errors)
    if (messages.length > 0) {
      toast.error('Please resolve the highlighted errors before continuing.')
    }
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Step1
            key={`${savedId ?? 'new'}-${activeStep}`}
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
            title={getLabel(
              MASTER_BUDGET_LABELS.DOCUMENTS.TITLE,
              'EN',
              MASTER_BUDGET_LABELS.FALLBACKS.DOCUMENTS.TITLE
            )}
            description={getLabel(
              MASTER_BUDGET_LABELS.DOCUMENTS.DESCRIPTION,
              'EN',
              MASTER_BUDGET_LABELS.FALLBACKS.DOCUMENTS.DESCRIPTION
            )}
          />
        )
      case 2:
        return (
          <Step2
            onEdit={handleEdit}
            onEditDocuments={handleEditDocuments}
            isReadOnly={isReadOnly}
          />
        )
      default:
        return null
    }
  }

  const primaryButtonLabel = useMemo(() => {
    if (activeStep === 0) {
      return isSaving
        ? 'Saving...'
        : isEditMode
          ? 'Update & Continue'
          : 'Save & Continue'
    }

    if (activeStep === steps.length - 1) {
      return isSubmitting ? 'Submitting...' : 'Submit Master Budget'
    }

    return 'Continue'
  }, [activeStep, isEditMode, isSaving, isSubmitting, steps.length])

  const isPrimaryDisabled = useMemo(() => {
    if (activeStep === 0) return isSaving
    if (activeStep === steps.length - 1) return isSubmitting
    return false
  }, [activeStep, isSaving, isSubmitting, steps.length])

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
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
                  <Typography variant="caption" sx={{ textTransform: 'uppercase' }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ my: 4, backgroundColor: '#FFFFFFBF', position: 'relative' }}>
            {isInitialLoading ? (
              <GlobalLoading fullHeight className="min-h-[320px]" />
            ) : (
              getStepContent(activeStep)
            )}

            {!isReadOnly && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 3, mx: 6, mb: 2, p: 2, backgroundColor: '#FFFFFFBF' }}
              >
                <Button variant="outlined" onClick={handleReset} disabled={isSaving || isSubmitting}>
                  Cancel
                </Button>

                <Box display="flex" gap={2}>
                  {activeStep > 0 && (
                    <Button variant="outlined" onClick={handleBack}>
                      Back
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    disabled={isPrimaryDisabled}
                    onClick={() => {
                      if (activeStep === 0) {
                        methods.handleSubmit(async () => {
                          if (isEditMode) {
                            await handleUpdate()
                          } else {
                            await handleSaveAndNext()
                          }
                        }, onError)()
                        return
                      }

                      if (activeStep === steps.length - 1) {
                        methods.handleSubmit(onSubmit, onError)()
                        return
                      }

                      handleNext()
                    }}
                  >
                    {primaryButtonLabel}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </form>
    </FormProvider>
  )
}

export default function MasterBudgetStepperWrapper({
  isReadOnly = false,
}: MasterBudgetStepperWrapperProps = {}) {
  return (
    <MasterBudgetDataProvider>
      <MasterBudgetStepperContent isReadOnly={isReadOnly} />
    </MasterBudgetDataProvider>
  )
}

