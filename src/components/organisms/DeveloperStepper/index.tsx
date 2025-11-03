'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Alert,
  Snackbar,
} from '@mui/material'
import { FormProvider } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useBuildPartnerStepStatus, useBuildPartnerStepManager } from '@/hooks'
import { useCreateWorkflowRequest } from '@/hooks/workflow'
import { useBuildPartnerLabelsWithCache } from '@/hooks/useBuildPartnerLabelsWithCache'
import { getBuildPartnerLabel } from '@/constants/mappings/buildPartnerMapping'
import { useAppStore } from '@/store'

// import { STEP_LABELS } from './constants' // replaced by dynamic labels
import { StepperProps } from './types'
import {
  useStepNotifications,
  useStepDataProcessing,
  useStepForm,
  useStepValidation,
} from './hooks'
import { useStepContentRenderer } from './stepRenderer'
import { transformStepData, useStepDataTransformers } from './transformers'

export default function DeveloperStepperWrapper({
  developerId,
  initialStep = 0,
  isViewMode: propIsViewMode,
}: StepperProps = {}) {
  const [activeStep, setActiveStep] = useState(initialStep)
  const [isEditingMode, setIsEditingMode] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if we're in view mode (read-only)
  // Use prop if provided, otherwise read from URL params (backward compatibility)
  const mode = searchParams.get('mode')
  const isViewMode = propIsViewMode !== undefined ? propIsViewMode : mode === 'view'

  const notifications = useStepNotifications()
  const dataProcessing = useStepDataProcessing()
  const { methods, formState, setShouldResetForm } = useStepForm(
    developerId,
    activeStep
  )
  const stepManager = useBuildPartnerStepManager()
  const validation = useStepValidation()
  const createWorkflowRequest = useCreateWorkflowRequest()
  const transformers = useStepDataTransformers()

  // Dynamic step labels (API-driven with fallback to static mapping)
  const { data: buildPartnerLabels, getLabel } = useBuildPartnerLabelsWithCache()
  const currentLanguage = useAppStore((state) => state.language) || 'EN'

  const getBuildPartnerLabelDynamic = useCallback(
    (configId: string): string => {
      const fallback = getBuildPartnerLabel(configId)
      if (buildPartnerLabels) {
        return getLabel(configId, currentLanguage, fallback)
      }
      return fallback
    },
    [buildPartnerLabels, currentLanguage, getLabel]
  )

  // Define steps array (direct mapping for clarity)
  const steps = useMemo(
    () => [
      getBuildPartnerLabelDynamic('CDL_BP_DETAILS'),
      'Documents (Optional)',
      getBuildPartnerLabelDynamic('CDL_BP_CONTACT'),
      getBuildPartnerLabelDynamic('CDL_BP_FEES'),
      getBuildPartnerLabelDynamic('CDL_BP_BENE_INFO'),
      'Review',
    ],
    [getBuildPartnerLabelDynamic]
  )

  // Edit navigation handler
  const handleEditStep = useCallback(
    (stepNumber: number) => {
      setActiveStep(stepNumber)
      setIsEditingMode(true) // Set editing mode when coming from review
      setShouldResetForm(true)
      notifications.showSuccess(`Now editing step ${stepNumber + 1} data`)
    },
    [setShouldResetForm, notifications]
  )

  const stepRenderer = useStepContentRenderer({
    activeStep,
    developerId: developerId || '',
    methods,
    onEditStep: handleEditStep,
    isReadOnly: isViewMode,
  })

  const { data: stepStatus } = useBuildPartnerStepStatus(developerId || '')

  // Set editing mode based on URL parameter
  useEffect(() => {
    const editing = searchParams.get('editing')
    if (editing === 'true') {
      setIsEditingMode(true)
    }
  }, [searchParams])

  // Helper function to build mode parameter for navigation (matching capital partner pattern)
  const getModeParam = useCallback(() => {
    if (isViewMode) return '?mode=view'
    if (isEditingMode) return '?editing=true'
    return ''
  }, [isViewMode, isEditingMode])

  useEffect(() => {
    if (
      dataProcessing.shouldProcessStepData(
        stepStatus,
        developerId,
        formState.shouldResetForm
      )
    ) {
      try {
        const processedData = dataProcessing.processStepDataForForm({
          activeStep,
          stepStatus,
        })
        methods.reset(processedData)
        setShouldResetForm(false)
      } catch (error) {
        throw error
      }
    }
  }, [activeStep, stepStatus, developerId, setShouldResetForm])

  const handleSaveAndNext = async () => {
    try {
      notifications.clearNotifications()

      // In view mode, just navigate without saving
      if (isViewMode) {
        const nextStep = activeStep + 1
        if (nextStep < steps.length) {
          const nextUrlStep = nextStep + 1
          router.push(
            `/build-partner/${developerId}/step/${nextUrlStep}?mode=view`
          )
        } else {
          router.push('/build-partner')
        }
        return
      }

      // Documents (Optional), Contact, Fees, and Beneficiary steps don't need API call here - items are saved when "Add" is clicked
      if (
        activeStep === 1 ||
        activeStep === 2 ||
        activeStep === 3 ||
        activeStep === 4
      ) {
        // For these steps, just navigate to next step without API call
        const nextStep = activeStep + 1
        if (nextStep < steps.length) {
          // Convert 0-based activeStep to 1-based URL step
          const nextUrlStep = nextStep + 1
          router.push(`/build-partner/${developerId}/step/${nextUrlStep}${getModeParam()}`)
        } else {
          router.push('/build-partner')
        }
        return
      }

      // Review step (step 5) - complete the process and submit workflow request
      if (activeStep === 5) {
        try {
          // Get the developer ID from step status
          const developerIdFromStatus =
            stepStatus?.stepData?.step1?.id?.toString()

          if (!developerIdFromStatus) {
            notifications.showError(
              'Developer ID not found. Please complete Step 1 first.'
            )
            return
          }

          // Get step1 form data for workflow request
          const step1Data = stepStatus?.stepData?.step1

          if (!step1Data) {
            notifications.showError(
              'Developer data not found. Please complete Step 1 first.'
            )
            return
          }

          // Submit workflow request with only step1 data (cast to Step1Data type)
          // await createWorkflowRequest.mutateAsync({
          //   developerId: developerIdFromStatus,
          //   step1Data: step1Data as any // Type assertion since the data structure matches
          // });

          await createWorkflowRequest.mutateAsync({
            referenceId: developerIdFromStatus,
            referenceType: 'BUILD_PARTNER',
            moduleName: 'BUILD_PARTNER',
            actionKey: 'CREATE',
            amount: 0,
            currency: 'USD',
            payloadJson: step1Data as unknown as Record<string, unknown>, // Developer step1 data structure
          })

          notifications.showSuccess(
            'Developer registration submitted successfully! Workflow request created.'
          )
          router.push('/build-partner')
        } catch (error) {
          console.log(error)
          const errorData = error as {
            response?: { data?: { message?: string } }
            message?: string
          }
          const errorMessage =
            errorData?.response?.data?.message ||
            errorData?.message ||
            'Failed to submit workflow request. Please try again.'
          notifications.showError(errorMessage)
        }
        return
      }

      const isFormValid = await methods.trigger()

      if (!isFormValid) {
        return
      }

      // All other steps make API calls
      const currentFormData = methods.getValues()
      const stepSpecificData = transformStepData(
        activeStep + 1,
        currentFormData,
        transformers
      )

      // Enhanced validation with client-side and server-side validation
      const validationResult = await validation.validateStepData(
        activeStep,
        stepSpecificData
      )

      if (!validationResult.isValid) {
        if (validationResult.source !== 'client') {
          const errorPrefix = 'Server validation failed'
          notifications.showError(
            `${errorPrefix}: ${validationResult.errors?.join(', ')}`
          )
        }
        return
      }

      // Call the API to save the current step
      const saveResponse = await stepManager.saveStep(
        activeStep + 1,
        stepSpecificData,
        isEditingMode,
        developerId
      )

      notifications.showSuccess('Step saved successfully!')

      // Navigate to next step
      if (activeStep < steps.length - 1) {
        // For Step 1, we need to get the developer ID from the API response and navigate to dynamic route
        if (activeStep === 0) {
          // Step 1 just saved, get the developer ID from the API response
          const savedDeveloperId =
            (saveResponse as any)?.data?.id || (saveResponse as any)?.id

          if (savedDeveloperId) {
            // Navigate to Step 2 using the dynamic route with the ID from backend
            router.push(`/build-partner/${savedDeveloperId}/step/2${getModeParam()}`)
          } else {
            // Fallback to local state if no developer ID
            setActiveStep((prev) => prev + 1)
          }
        } else if (developerId) {
          // For other steps, use the existing developer ID
          const nextStep = activeStep + 1
          router.push(`/build-partner/${developerId}/step/${nextStep + 1}${getModeParam()}`)
        } else {
          // Fallback to local state
          setActiveStep((prev) => prev + 1)
        }
      } else {
        // If this is the last step, redirect to build-partner list
        router.push('/build-partner')
        notifications.showSuccess('All steps completed successfully!')
      }
    } catch (error: unknown) {
      console.error('Error saving step:', error)
      const errorData = error as {
        response?: { data?: { message?: string } }
        message?: string
      }
      const errorMessage =
        errorData?.response?.data?.message ||
        errorData?.message ||
        'Failed to save step. Please try again.'
      notifications.showError(errorMessage)
    }
  }

  const handleBack = () => {
    if (activeStep > 0) {
      const previousStep = activeStep - 1
      setActiveStep(previousStep)
      // Navigate to the previous step URL with mode parameter
      router.push(
        `/build-partner/${developerId}/step/${previousStep + 1}${getModeParam()}`
      )
    }
  }

  // Reset editing mode when starting fresh (no developerId)
  useEffect(() => {
    if (!developerId) {
      setIsEditingMode(false)
    }
  }, [developerId])

  return (
    <FormProvider {...methods}>
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>{stepRenderer.getStepContent(activeStep)}</Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 3,
            mx: 6,
            mb: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => router.push('/build-partner')}
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
                onClick={handleBack}
                variant="outlined"
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
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleSaveAndNext}
              variant="contained"
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
              {isViewMode
                ? activeStep === steps.length - 1
                  ? 'Done'
                  : 'Next'
                : activeStep === steps.length - 1
                  ? 'Complete'
                  : 'Save and Next'}
            </Button>
          </Box>
        </Box>

        {/* Error and Success Notifications */}
        <Snackbar
          open={!!notifications.notifications.error}
          autoHideDuration={6000}
          onClose={notifications.clearNotifications}
        >
          <Alert
            onClose={notifications.clearNotifications}
            severity="error"
            sx={{ width: '100%' }}
          >
            {notifications.notifications.error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!notifications.notifications.success}
          autoHideDuration={6000}
          onClose={notifications.clearNotifications}
        >
          <Alert
            onClose={notifications.clearNotifications}
            severity="success"
            sx={{ width: '100%' }}
          >
            {notifications.notifications.success}
          </Alert>
        </Snackbar>
      </Box>
    </FormProvider>
  )
}
