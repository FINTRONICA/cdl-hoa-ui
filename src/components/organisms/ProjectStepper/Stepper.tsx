'use client'

import React, { useState } from 'react'
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Typography,
  Paper,
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8 } from './steps'
import { ProjectData } from './types'
import DocumentUploadFactory from '../DocumentUpload/DocumentUploadFactory'
import { FormProvider, useForm } from 'react-hook-form'
import { DocumentItem } from '../DeveloperStepper/developerTypes'

const steps = [
  'Management Firms Assest Details',
  'Documents',
  'Account',
  'Fee Details',
  'Beneficiary Details',
  'Payment Plan',
  'Financial',
  'Project Closure',
  'Review',
]

const ProjectDetailsStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [projectData, setProjectData] = useState<ProjectData>({
    mfId: 'PROJ7102',
    mfId: '',
    mfName: '',
    mfLocation: '',
    mfReraNumber: '',
    mfAccoutStatusDate: null,
    mfAccStatusDate: null,
    mfRegistrationDate: null,
    mfStartDate: null,
    mfCompletionDate: null,
    mfRetentionPercent: '5.00',
    mfAdditionalRetentionPercent: '8.00',
    mfTotalRetentionPercent: '13.00',
    mfRetentionEffectiveDate: dayjs('2022-03-31'),
    mfManagementExpenses: '5.00',
    mfMarketingExpenses: '10.00',
    mfRealEstateBrokerExp: 0,
    mfAdvertisementExp: 0,
    mfLandOwnerName: '',
    mfPercentComplete: '',
    mfConstructionCost: 0,
    mfNoOfUnits: 12,
    mfRemarks: '',
    mfSpecialApproval: '',
    mfManagedBy: 'erm_checker1,erm_checker1,erm_checker1',
    mfBackupUser: 'Master ENBD_robust_maker1',
    mfRelationshipManagerName: '',
    mfAssestRelshipManagerName: '',
    mfTeamLeadName: '',
    assetRegisterDTO: {
      id: 0,
    },
    mfStatusDTO: {
      id: 0,
    },
    mfTypeDTO: {
      id: 0,
    },
    mfAccountStatusDTO: {
      id: 0,
    },
    mfConstructionCostCurrencyDTO: {
      id: 0,
    },
    status: null,
    mfBlockPaymentTypeDTO: null,
    accounts: [
      {
        trustAccountNumber: '102800280',
        ibanNumber: '12345678',
        dateOpened: dayjs('2025-06-30'),
        accountTitle: 'Account value',
        currency: 'Currency value',
      },
      {
        trustAccountNumber: '',
        ibanNumber: '',
        dateOpened: null,
        accountTitle: '',
        currency: 'AED',
      },
      {
        trustAccountNumber: '',
        ibanNumber: '',
        dateOpened: null,
        accountTitle: '',
        currency: 'AED',
      },
      {
        trustAccountNumber: '',
        ibanNumber: '',
        dateOpened: null,
        accountTitle: '',
        currency: 'AED',
      },
    ],
    fees: [
      {
        feeType: 'Project Registration Fee',
        frequency: 'One-time',
        debitAmount: '50,000',
        feeToBeCollected: '50,000',
        nextRecoveryDate: dayjs('2025-11-05'),
        feePercentage: '2%',
        amount: '50,000',
        vatPercentage: '18%',
        currency: 'AED',
        debitAccount: '',
      },
      {
        feeType: 'Management Fee',
        frequency: 'Quarterly',
        debitAmount: '1,25,000',
        feeToBeCollected: '1,25,000',
        nextRecoveryDate: dayjs('2025-07-30'),
        feePercentage: '5%',
        amount: '1,25,000',
        vatPercentage: '5%',
        currency: 'AED',
        debitAccount: '',
      },
      {
        feeType: 'Maintenance',
        frequency: 'Monthly',
        debitAmount: '10,000',
        feeToBeCollected: '10,000',
        nextRecoveryDate: dayjs('2025-11-05'),
        feePercentage: '2%',
        amount: '10,000',
        vatPercentage: '18%',
        currency: 'AED',
        debitAccount: '',
      },
    ],
    beneficiaries: [
      {
        id: 'BEN7103',
        beneficiaryId: 'BEN7103',
        beneficiaryType: 'Contractor Payment',
        name: 'Shree Developers Pvt. Ltd.',
        bankName: 'HDFC Bank',
        swiftCode: 'HDFCINBBXXX',
        routingCode: 'HDFC',
        accountNumber: '',
        mfBeneficiaryId: 'BEN7103',
        mfBeneficiaryType: 'Contractor Payment',
        mfName: 'Shree Developers Pvt. Ltd.',
        mfBankName: 'HDFC Bank',
        mfSwiftCode: 'HDFCINBBXXX',
        mfRoutingCode: 'HDFC',
        mfAccountNumber: '',
      },
      {
        id: 'TXN-P002-CD107',
        beneficiaryId: 'TXN-P002-CD107',
        beneficiaryType: 'Contractor Disbursement',
        name: 'Mangal Buildcon LLP',
        bankName: 'ICICI Bank',
        swiftCode: 'ICICINBBRI',
        routingCode: 'ICIC0',
        accountNumber: '',
        mfBeneficiaryId: 'TXN-P002-CD107',
        mfBeneficiaryType: 'Contractor Disbursement',
        mfName: 'Mangal Buildcon LLP',
        mfBankName: 'ICICI Bank',
        mfSwiftCode: 'ICICINBBRI',
        mfRoutingCode: 'ICIC0',
        mfAccountNumber: '',
      },
      {
        id: 'TXN-P003-MKT902',
        beneficiaryId: 'TXN-P003-MKT902',
        beneficiaryType: 'Marketing Budget Release',
        name: 'Zenith Media Solutions',
        bankName: 'HSBC Bank',
        swiftCode: 'HSBCINBBXXX',
        routingCode: 'HSBC',
        accountNumber: '',
        mfBeneficiaryId: 'TXN-P003-MKT902',
        mfBeneficiaryType: 'Marketing Budget Release',
        mfName: 'Zenith Media Solutions',
        mfBankName: 'HSBC Bank',
        mfSwiftCode: 'HSBCINBBXXX',
        mfRoutingCode: 'HSBC',
        mfAccountNumber: '',
      },
    ],
    paymentPlan: [
      {
        installmentNumber: 1,
        installmentPercentage: '',
        projectCompletionPercentage: '',
      },
      {
        installmentNumber: 2,
        installmentPercentage: '',
        projectCompletionPercentage: '',
      },
      {
        installmentNumber: 3,
        installmentPercentage: '',
        projectCompletionPercentage: '',
      },
      {
        installmentNumber: 4,
        installmentPercentage: '',
        projectCompletionPercentage: '',
      },
    ],
    financialData: {
      projectEstimatedCost: '50,000.00',
      actualCost: '67,000.00',
      projectBudget: '',
    },
    closureData: {
      totalIncomeFund: '',
      totalPayment: '',
    },
  })

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Project Details
        return (
          <Step1
            initialData={projectData}
          />
        )

      case 1: // Documents (NEW STEP)
        const DocumentStep = () => {
          const methods = useForm({
            defaultValues: {
              documents: [],
            },
          })

          return (
            <FormProvider {...methods}>
              <DocumentUploadFactory
                type="MANAGEMENT_FIRMS"
                entityId={projectData.mfId || 'temp_project_id'}
                isOptional={true}
                onDocumentsChange={(documents: DocumentItem[]) => {
                  setProjectData((prev) => ({
                    ...prev,
                    documents,
                  }))
                }}
                formFieldName="documents"
              />
            </FormProvider>
          )
        }

        return <DocumentStep />

      case 2: // Account Details (shifted from step 1)
        return (
          <Step2
            accounts={projectData.accounts}
            onAccountsChange={(accounts) => {
              setProjectData((prev) => ({
                ...prev,
                accounts,
              }))
            }}
          />
        )

      case 3: // Fee Details (shifted from step 2)
        return (
          <Step3
            fees={projectData.fees}
            onFeesChange={(fees) => {
              setProjectData((prev) => ({
                ...prev,
                fees,
              }))
            }}
          />
        )

      case 4: // Beneficiary Details (shifted from step 3)
        return (
          <Step4
            beneficiaries={projectData.beneficiaries}
            onBeneficiariesChange={(beneficiaries) => {
              setProjectData((prev) => ({
                ...prev,
                beneficiaries,
              }))
            }}
          />
        )

      case 5: // Payment Plan (shifted from step 4)
        return (
          <Step5
            paymentPlan={projectData.paymentPlan}
            onPaymentPlanChange={(paymentPlan) => {
              setProjectData((prev) => ({
                ...prev,
                paymentPlan,
              }))
            }}
          />
        )

      case 6: // Financial (shifted from step 5)
        return (
          <Step6
            financialData={projectData.financialData}
            onFinancialDataChange={(financialData) => {
              setProjectData((prev) => ({
                ...prev,
                financialData,
              }))
            }}
          />
        )

      case 7: // Project Closure (shifted from step 6)
        return (
          <Step7 />
        )

      case 8: // Review (shifted from step 7)
        return <Step8 projectData={projectData} />

      default:
        return <Typography>Unknown step</Typography>
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', p: 3 }}>
        {/* Header */}
        <Box mb={3}>
          <Typography variant="h4" gutterBottom>
            Build Partner Assest Details
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Register your project step by step, on-mandatory fields and steps
            are easy to skip.
          </Typography>
          <Box display="flex" alignItems="center" mt={2}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Project Name
            </Typography>
            <Typography variant="body1" sx={{ mr: 4 }}>
              AI Madina
            </Typography>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Developer ID (RERA)
            </Typography>
            <Typography variant="body1">12345677</Typography>
          </Box>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        {activeStep === steps.length ? (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        ) : (
          <div>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep !== 0 && (
                <Button
                  variant="outlined"
                  onClick={() => setActiveStep(0)}
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="outlined"
                color="primary"
                type="submit"
                onClick={handleNext}
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: 0,
                  backgroundColor: '#2563EB',
                  color: '#fff',
                }}
              >
                {activeStep === steps.length - 1
                  ? 'Save and Next'
                  : 'Save and Next'}
              </Button>
            </Box>
          </div>
        )}
      </Box>
    </LocalizationProvider>
  )
}

export default ProjectDetailsStepper
export type { ProjectData, ProjectDetailsData } from './types'
