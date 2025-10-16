import { useCallback, useEffect } from 'react'
import {
  Step1,
  Step2,
  Step5,
  DocumentUploadStep,
  LazyStepWrapper,
  preloadNextStep,
} from './lazyComponents'
import { StepContentProps } from './types'

export const useStepContentRenderer = ({
  developerId,
  methods,
  activeStep,
  onEditStep,
  isReadOnly = false,
}: StepContentProps & { isReadOnly?: boolean }) => {
  // Preload next step for better performance
  useEffect(() => {
    if (activeStep !== undefined) {
      preloadNextStep(activeStep)
    }
  }, [activeStep])

  const getStepContent = useCallback(
    (step: number) => {
      const stepComponents = {
        0: () => (
          <LazyStepWrapper>
            <Step1 isReadOnly={isReadOnly} />
          </LazyStepWrapper>
        ),
        1: () => (
          <LazyStepWrapper>
            <DocumentUploadStep
              buildPartnerId={developerId || ''}
              onDocumentsChange={(documents) =>
                methods.setValue('documents', documents)
              }
              isOptional={true}
              isReadOnly={isReadOnly}
            />
          </LazyStepWrapper>
        ),
        2: () => {
          const watchedContactData = methods.watch('contactData')
          return (
            <LazyStepWrapper>
              <Step2
                contactData={watchedContactData}
                onFeesChange={(contactData) => {
                  methods.setValue('contactData', contactData)
                }}
                buildPartnerId={developerId || ''}
                isReadOnly={isReadOnly}
              />
            </LazyStepWrapper>
          )
        },
        3: () => (
          <LazyStepWrapper>
            <Step5
              developerId={developerId}
              onEditStep={onEditStep || undefined}
              isReadOnly={isReadOnly}
            />
          </LazyStepWrapper>
        ),
      }

      const StepComponent = stepComponents[step as keyof typeof stepComponents]
      return StepComponent ? StepComponent() : null
    },
    [developerId, methods, isReadOnly, onEditStep]
  )

  return {
    getStepContent,
  }
}
