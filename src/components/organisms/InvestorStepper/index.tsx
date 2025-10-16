'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material'
import { FormProvider, useForm, type Resolver, type ResolverResult } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CapitalPartnerStep1Schema,
  CapitalPartnerStep2Schema,
  CapitalPartnerStep4Schema,
  type CapitalPartnerStep1Data,
  type CapitalPartnerStep2Data,
} from '@/lib/validation/capitalPartnerSchemas'

import Step1, { type Step1Ref } from './steps/Step1'
import Step2, { type Step2Ref } from './steps/Step2'
import Step3, { type Step3Ref } from './steps/Step3'
import Step5 from './steps/Step5'
import DocumentUploadFactory from '../DocumentUpload/DocumentUploadFactory'
import { DocumentItem } from '../DeveloperStepper/developerTypes'
import { OwnerData, PaymentPlanData } from './investorsTypes'


type CapitalPartnerFormData = CapitalPartnerStep1Data &
  CapitalPartnerStep2Data & {
    // Add other step data types as needed
    documents?: DocumentItem[]
    paymentPlan?: PaymentPlanData[]
    owners?: OwnerData[]
  }
import { useCreateDeveloperWorkflowRequest } from '@/hooks/workflow'
import { useCapitalPartnerLabelsApi } from '@/hooks/useCapitalPartnerLabelsApi'
import { useAppStore } from '@/store'

// Step configuration with config IDs for dynamic labels
const stepConfigs = [
  { key: 'basic', configId: 'CDL_OWN_BASIC_INFO' },
  { key: 'documents', configId: 'CDL_OWN_DOCUMENTS' },
  { key: 'unit', configId: 'CDL_OWN_UNIT_DETAILS' },
  { key: 'payment', configId: 'CDL_OWN_JOINT_OWNER_DETAILS' },
  { key: 'review', configId: 'CDL_OWN_REVIEW' },
]

// Fallback step labels
const fallbackSteps = [
  'Basic Details',
  'Documents',
  'Unit Details',
  'Joint Owner Details',
  'Review',
]

interface InvestorsStepperWrapperProps {
  initialCapitalPartnerId?: number | null
  initialStep?: number
  isViewMode?: boolean
}

export default function InvestorsStepperWrapper({
  initialCapitalPartnerId = null,
  initialStep = 0,
  isViewMode = false,
}: InvestorsStepperWrapperProps = {}) {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  // Get labels from API
  const { getLabel } = useCapitalPartnerLabelsApi()
  const currentLanguage = useAppStore((state) => state.language)

  const [activeStep, setActiveStep] = useState(initialStep)
  const [isSaving, setIsSaving] = useState(false)
  const [capitalPartnerId, setCapitalPartnerId] = useState<number | null>(
    initialCapitalPartnerId
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Create dynamic step labels
  const steps = stepConfigs.map((config, index) =>
    getLabel(config.configId, currentLanguage, fallbackSteps[index])
  )

  const isEditMode = Boolean(capitalPartnerId)
  const step1Ref = useRef<Step1Ref>(null)
  const step2Ref = useRef<Step2Ref>(null)
  const step3Ref = useRef<Step3Ref>(null)

  // Keep active step in a ref so the resolver can react to step changes without remounting the form
  const activeStepRef = useRef(activeStep)
  useEffect(() => {
    activeStepRef.current = activeStep
  }, [activeStep])

  const dynamicResolver: Resolver<CapitalPartnerFormData> = useCallback(
    async (
      values: CapitalPartnerFormData,
      context: unknown,
      options: Parameters<Resolver<CapitalPartnerFormData>>[2]
    ) => {
      const step = activeStepRef.current
      switch (step) {
        case 0:
          return (
            zodResolver(CapitalPartnerStep1Schema) as unknown as Resolver<CapitalPartnerFormData>
          )(values, context, options)
        case 2:
          return (
            zodResolver(CapitalPartnerStep2Schema) as unknown as Resolver<CapitalPartnerFormData>
          )(values, context, options)
        case 4:
          return (
            zodResolver(CapitalPartnerStep4Schema) as unknown as Resolver<CapitalPartnerFormData>
          )(values, context, options)
        default:
 
          return { values, errors: {} } as ResolverResult<CapitalPartnerFormData>
      }
    },
    []
  )

  const updateURL = (step: number, id?: number | null) => {
    if (id && step >= 0) {
      const stepParam = `step=${step + 1}`
      const modeParam = isViewMode ? '&mode=view' : ''
      router.push(`/investors/new/${id}?${stepParam}${modeParam}`)
    } else if (step === 0) {
      router.push('/investors/new')
    }
  }
  const createCapitalPartnerWorkflowRequest =
    useCreateDeveloperWorkflowRequest()

  useEffect(() => {
    const stepFromUrl = searchParams.get('step')
    if (stepFromUrl) {
      const stepNumber = parseInt(stepFromUrl) - 1
      if (
        stepNumber !== activeStep &&
        stepNumber >= 0 &&
        stepNumber < steps.length
      ) {
        setActiveStep(stepNumber)
      }
    }
  }, [searchParams, activeStep, steps.length])

  useEffect(() => {
    if (params.id && !capitalPartnerId) {
      setCapitalPartnerId(parseInt(params.id as string))
    }
  }, [params.id, capitalPartnerId])

  const methods = useForm<CapitalPartnerFormData>({
    resolver: dynamicResolver,
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      // Step 1: Capital Partner Basic Info
      investorType: '',
      investorFirstName: '',
      investorMiddleName: '',
      investorLastName: '',
      arabicName: '',
      investorId: '',
      investorIdType: '',
      idNumber: '',
      ownership: '',
      idExpiryDate: null,
      nationality: '',
      accountContact: '',
      mobileNumber: '',
      email: '',
     
      
      // Additional fields for other steps
      documents: [],
      paymentPlan: [],
      owners: [],
    },
  })

  const handleAsyncStep = async (stepRef: {
    handleSaveAndNext: () => Promise<void>
  }) => {
    
    try {
      setIsSaving(true)
      
      await stepRef.handleSaveAndNext()
    } catch {
      return false
    } finally {
      setIsSaving(false)
    }
    return true
  }

  const navigateToNextStep = () => {
    const nextStep = activeStep + 1
    if (nextStep < steps.length) {
      setActiveStep(nextStep)
      updateURL(nextStep, capitalPartnerId)
    }
  }

  const handleNext = async () => {

    if (isViewMode) {
      navigateToNextStep()
      return
    }

    if (activeStep === 0 && step1Ref.current) {
      await handleAsyncStep(step1Ref.current)
      return
    }

    if (activeStep === 1) {
      navigateToNextStep()
      return
    }

    if (activeStep === 2 && step2Ref.current) {
    
      await handleAsyncStep(step2Ref.current)
      return
    }

    if (activeStep === 3 && step3Ref.current) {
 
      await handleAsyncStep(step3Ref.current)
      return
    }

    navigateToNextStep()
  }

  const handleBack = () => {
    const prevStep = activeStep - 1
    if (prevStep >= 0) {
      setActiveStep(prevStep)
      updateURL(prevStep, capitalPartnerId)
    }
  }

  const handleReset = () => {
    setActiveStep(0)
    setCapitalPartnerId(null)
    setIsSaving(false)
    setErrorMessage(null)
    setSuccessMessage(null)
    methods.reset()
    router.push('/investors')
  }

  const onSubmit = () => {}

  const handleStep1SaveAndNext = (data: { id: number }) => {
    if (data && data.id) {
      const nextStep = activeStep + 1
      setCapitalPartnerId(data.id)
      setActiveStep(nextStep)
      updateURL(nextStep, data.id)
    }
  }

  const handleStep2SaveAndNext = () => {
    const nextStep = activeStep + 1
    if (nextStep < steps.length) {
      setActiveStep(nextStep)
      updateURL(nextStep, capitalPartnerId)
    }
  }

  const handleStep3SaveAndNext = () => {
    const nextStep = activeStep + 1
    if (nextStep < steps.length) {
      setActiveStep(nextStep)
      updateURL(nextStep, capitalPartnerId)
    }
  }

  const handleDocumentsChange = useCallback(
    (documents: DocumentItem[]) => {
      methods.setValue('documents', documents)
    },
    [methods]
  )

  const handlePaymentPlanChange = useCallback(
    (paymentPlan: CapitalPartnerFormData['paymentPlan']) => {
      methods.setValue('paymentPlan', paymentPlan)
    },
    [methods]
  )

  const handleOwnersChange = useCallback(
    (owners: OwnerData[]) => {
      methods.setValue('owners', owners)
    },
    [methods]
  )

  const handleSubmit = async () => {
    try {
      setErrorMessage(null)
      setSuccessMessage(null)
      setIsSaving(true)
      const capitalPartnerIdForWorkflow = capitalPartnerId?.toString()
      if (!capitalPartnerIdForWorkflow) {
        setErrorMessage(
          'Capital Partner ID not found. Please complete Step 1 first.'
        )
        setIsSaving(false)
        return
      }
      const step1Data = methods.getValues()
      await createCapitalPartnerWorkflowRequest.mutateAsync({
        referenceId: capitalPartnerIdForWorkflow,
        payloadData: { ...step1Data } as Record<string, unknown>,
        referenceType: 'CAPITAL_PARTNER',
        moduleName: 'CAPITAL_PARTNER',
        actionKey: 'CREATE',
      })
      setSuccessMessage(
        'Capital Partner registration submitted successfully! Workflow request created.'
      )
      router.push('/investors')
    } catch (error) {
      const errorData = error as {
        response?: { data?: { message?: string } }
        message?: string
      }
      const errorMessage =
        errorData?.response?.data?.message ||
        errorData?.message ||
        'Failed to submit workflow request. Please try again.'
      setErrorMessage(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Step1
            ref={step1Ref}
            onSaveAndNext={handleStep1SaveAndNext}
            isEditMode={isEditMode}
            capitalPartnerId={capitalPartnerId}
            isViewMode={isViewMode}
          />
        )
      case 1:
        return (
          <DocumentUploadFactory
            type="INVESTOR"
            entityId={capitalPartnerId?.toString() || ''}
            isOptional={true}
            onDocumentsChange={handleDocumentsChange}
            formFieldName="documents"
          />
        )
      case 2:
        return (
          <Step2
            ref={step2Ref}
            capitalPartnerId={capitalPartnerId}
            onSaveAndNext={handleStep2SaveAndNext}
            isEditMode={isEditMode}
            isViewMode={isViewMode}
          />
        )
      case 3:
        return (
          <Step3
            ref={step3Ref}
            paymentPlan={methods.watch('paymentPlan') || []}
            onPaymentPlanChange={handlePaymentPlanChange}
            owners={(methods.watch('owners') as OwnerData[]) || []}
            onOwnersChange={handleOwnersChange}
            capitalPartnerId={capitalPartnerId}
            onSaveAndNext={handleStep3SaveAndNext}
            isEditMode={isEditMode}
            isViewMode={isViewMode}
          />
        )
      case 4:
        return (
          <Step5 
            capitalPartnerId={capitalPartnerId} 
            isViewMode={isViewMode}
            owners={(methods.watch('owners') as OwnerData[]) || []}
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

          <Box sx={{ my: 4, backgroundColor: '#FFFFFFBF', boxShadow: 'none' }}>
            {getStepContent(activeStep)}

            <Box
              display="flex"
              justifyContent="space-between"
              sx={{ backgroundColor: '#FFFFFFBF', mt: 3, mx: 6, mb: 2 }}
            >
              <Button
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
                {activeStep !== 0 && activeStep !== steps.length - 1 && (
                  <Button
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
                  onClick={
                    activeStep === steps.length - 1
                      ? isViewMode
                        ? () => router.push('/investors')
                        : handleSubmit
                      : handleNext
                  }
                  variant="contained"
                  disabled={
                    (activeStep === steps.length - 1 && isSaving) ||
                    createCapitalPartnerWorkflowRequest.isPending
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
                  {isSaving || createCapitalPartnerWorkflowRequest.isPending
                    ? activeStep === steps.length - 1
                      ? 'Submitting...'
                      : 'Saving...'
                    : activeStep === steps.length - 1
                      ? isViewMode
                        ? 'Close'
                        : 'Submit'
                      : isViewMode
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
