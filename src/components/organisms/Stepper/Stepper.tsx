// 'use client'

// import React, { useState } from 'react'
// import {
//   Stepper,
//   Step,
//   StepLabel,
//   Box,
//   Button,
//   Typography,
//   Paper,
// } from '@mui/material'
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// import dayjs, { Dayjs } from 'dayjs'
// import {
//   Step1,
//   Step2,
//   Step3,
//   Step4,
//   Step5,
//   Step6,
//   Step7,
//   Step8,
// } from './steps'
// import { ProjectData, ProjectDetailsData } from './types'

// const steps = [
//   'Project Details',
//   'Account',
//   'Fee Details',
//   'Beneficiary Details',
//   'Payment Plan',
//   'Financial',
//   'Project Closure',
//   'Review',
// ]

// const ProjectDetailsStepper: React.FC = () => {
//   const [activeStep, setActiveStep] = useState(0)
//   const [projectData, setProjectData] = useState<ProjectData>({
//     sectionId: 'PROJ7102',
//     developerId: '12345677',
//     developerName: '',
//     masterDeveloperName: '',
//     projectName: '',
//     projectLocation: '',
//     projectAccountCif: '',
//     projectStatus: '',
//     projectAccountStatusDate: null,
//     projectRegistrationDate: null,
//     projectStartDate: null,
//     projectCompletionDate: null,
//     retention: '5.00',
//     additionalRetention: '8.00',
//     totalRetention: '13.00',
//     retentionEffectiveStartDate: dayjs('2022-03-31'),
//     projectManagementExpenses: '5.00',
//     marketingExpenses: '10.00',
//     realEstateBrokerExpense: '',
//     advertisingExpense: '',
//     landOwnerName: '',
//     projectCompletionPercentage: '',
//     currency: 'AED',
//     actualConstructionCost: '',
//     noOfUnits: '12',
//     remarks: '',
//     specialApproval: '',
//     paymentType: '',
//     managedBy: 'erm_checker1,erm_checker1,erm_checker1',
//     backupRef: 'Master ENBD_robust_maker1',
//     relationshipManager: '',
//     assistantRelationshipManager: '',
//     teamLeaderName: '',
//     accounts: [
//       {
//         trustAccountNumber: '102800280',
//         ibanNumber: '12345678',
//         dateOpened: dayjs('2025-06-30'),
//         accountTitle: 'Account value',
//         currency: 'Currency value',
//       },
//     ],
//     fees: [
//       {
//         feeType: 'Project Registration Fee',
//         frequency: 'One-time',
//         debitAmount: '50,000',
//         feeToBeCollected: '50,000',
//         nextRecoveryDate: dayjs('2025-11-05'),
//         feePercentage: '2%',
//         amount: '50,000',
//         vatPercentage: '18%',
//       },
//       {
//         feeType: 'Management Fee',
//         frequency: 'Quarterly',
//         debitAmount: '1,25,000',
//         feeToBeCollected: '1,25,000',
//         nextRecoveryDate: dayjs('2025-07-30'),
//         feePercentage: '5%',
//         amount: '1,25,000',
//         vatPercentage: '5%',
//       },
//       {
//         feeType: 'Maintenance',
//         frequency: 'Monthly',
//         debitAmount: '10,000',
//         feeToBeCollected: '10,000',
//         nextRecoveryDate: dayjs('2025-11-05'),
//         feePercentage: '2%',
//         amount: '10,000',
//         vatPercentage: '18%',
//       },
//     ],
//     beneficiaries: [
//       {
//         id: 'BEN7103',
//         expenseType: 'Contractor Payment',
//         transferType: 'NEFT',
//         name: 'Shree Developers Pvt. Ltd.',
//         bankName: 'HDFC Bank',
//         swiftCode: 'HDFCINBBXXX',
//         routingCode: 'HDFC',
//         account: '',
//       },
//       {
//         id: 'TXN-P002-CD107',
//         expenseType: 'Contractor Disbursement',
//         transferType: 'NEFT',
//         name: 'Mangal Buildcon LLP',
//         bankName: 'ICICI Bank',
//         swiftCode: 'ICICINBBRI',
//         routingCode: 'ICIC0',
//         account: '',
//       },
//       {
//         id: 'TXN-P003-MKT902',
//         expenseType: 'Marketing Budget Release',
//         transferType: 'International Wire Transfer',
//         name: 'Zenith Media Solutions',
//         bankName: 'HSBC Bank',
//         swiftCode: 'HSBCINBBXXX',
//         routingCode: 'HSBC',
//         account: '',
//       },
//     ],
//     paymentPlan: [
//       {
//         installmentNumber: 1,
//         installmentPercentage: '',
//         projectCompletionPercentage: '',
//       },
//       {
//         installmentNumber: 2,
//         installmentPercentage: '',
//         projectCompletionPercentage: '',
//       },
//       {
//         installmentNumber: 3,
//         installmentPercentage: '',
//         projectCompletionPercentage: '',
//       },
//       {
//         installmentNumber: 4,
//         installmentPercentage: '',
//         projectCompletionPercentage: '',
//       },
//     ],
//     financialData: {
//       projectEstimatedCost: '50,000.00',
//       actualCost: '67,000.00',
//       projectBudget: '',
//     },
//   })

//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1)
//   }

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1)
//   }

//   const handleReset = () => {
//     setActiveStep(0)
//   }

//   const renderStepContent = (step: number) => {
//     switch (step) {
//       case 0: // Project Details
//         return (
//           <Step1
//             initialData={projectData}
//             onDataChange={(data) => {
//               setProjectData((prev) => ({
//                 ...prev,
//                 ...data,
//               }))
//             }}
//           />
//         )

//       case 1: // Account Details
//         return (
//           <Step2
//             accounts={projectData.accounts}
//             onAccountsChange={(accounts) => {
//               setProjectData((prev) => ({
//                 ...prev,
//                 accounts,
//               }))
//             }}
//           />
//         )

//       case 2: // Fee Details
//         return (
//           <Step3
//             fees={projectData.fees}
//             onFeesChange={(fees) => {
//               setProjectData((prev) => ({
//                 ...prev,
//                 fees,
//               }))
//             }}
//           />
//         )

//       case 3: // Beneficiary Details
//         return (
//           <Step4
//             beneficiaries={projectData.beneficiaries}
//             onBeneficiariesChange={(beneficiaries) => {
//               setProjectData((prev) => ({
//                 ...prev,
//                 beneficiaries,
//               }))
//             }}
//           />
//         )

//       case 4: // Payment Plan
//         return (
//           <Step5
//             paymentPlan={projectData.paymentPlan}
//             onPaymentPlanChange={(paymentPlan) => {
//               setProjectData((prev) => ({
//                 ...prev,
//                 paymentPlan,
//               }))
//             }}
//           />
//         )

//       case 5: // Financial
//         return (
//           <Step6
//             financialData={projectData.financialData}
//             onFinancialDataChange={(financialData) => {
//               setProjectData((prev) => ({
//                 ...prev,
//                 financialData,
//               }))
//             }}
//           />
//         )

//       case 6: // Project Closure
//         return (
//           <Step7
//             projectEstimatedCost={projectData.financialData.projectEstimatedCost}
//             actualCost={projectData.financialData.actualCost}
//           />
//         )

//       case 7: // Review
//         return <Step8 projectData={projectData} />

//       default:
//         return <Typography>Unknown step</Typography>
//     }
//   }

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box sx={{ width: '100%', p: 3 }}>
//         {/* Header */}
//         <Box mb={3}>
//           <Typography variant="h4" gutterBottom>
//             Project Details
//           </Typography>
//           <Typography variant="body1" color="textSecondary">
//             Register your project step by step, on-mandatory fields and steps
//             are easy to skip.
//           </Typography>
//           <Box display="flex" alignItems="center" mt={2}>
//             <Typography variant="body2" sx={{ mr: 2 }}>
//               Project Name
//             </Typography>
//             <Typography variant="body1" sx={{ mr: 4 }}>
//               AI Madina
//             </Typography>
//             <Typography variant="body2" sx={{ mr: 2 }}>
//               Developer ID (RERA)
//             </Typography>
//             <Typography variant="body1">12345677</Typography>
//           </Box>
//         </Box>

//         {/* Stepper */}
//         <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
//           {steps.map((label, index) => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>

//         {/* Step Content */}
//         {activeStep === steps.length ? (
//           <Paper square elevation={0} sx={{ p: 3 }}>
//             <Typography>All steps completed - you&apos;re finished</Typography>
//             <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
//               Reset
//             </Button>
//           </Paper>
//         ) : (
//           <div>
//             {renderStepContent(activeStep)}
//             <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
//               <Button
//                 color="inherit"
//                 disabled={activeStep === 0}
//                 onClick={handleBack}
//                 sx={{ mr: 1 }}
//               >
//                 Back
//               </Button>
//               <Box sx={{ flex: '1 1 auto' }} />
//               {activeStep !== 0 && (
//                 <Button
//                   variant="outlined"
//                   onClick={() => setActiveStep(0)}
//                   sx={{ mr: 1 }}
//                 >
//                   Cancel
//                 </Button>
//               )}
//               <Button variant="contained" onClick={handleNext}>
//                 {activeStep === steps.length - 1
//                   ? 'Save and Next'
//                   : 'Save and Next'}
//               </Button>
//             </Box>
//           </div>
//         )}
//       </Box>
//     </LocalizationProvider>
//   )
// }

// export default ProjectDetailsStepper
// export type { ProjectData, ProjectDetailsData } from './types'

"use client";

import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
 
} from "./steps";
import { PropertyData, PropertyManagementData } from "./types";



const steps = [
  "Basic Details",
  "Account",
  "Fee Details",
  "Beneficiary Details",
  "Financial",
  "Review",
];

const ProjectDetailsStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [projectData, setProjectData] = useState<PropertyManagementData>({
    propertyId: "PROP-001",
    propertyReraOrDifcNumber: "RERA-12345",
    typeOfEscrow: "Residential",
    propertyAccountCifBank: "CIF-98765",
    propertyName: "Palm View Apartments",
    accountType: "Savings",
    propertyType: "Apartment",
    propertyLocation: "Dubai Marina",
    companyNumber: "COMP-456",
    companyName: "Blue Sky Developers",
    propertyGroupId: "GRP-789",
    projectName: "Sunset Residences",
    projectNameArabic: "شقق الغروب",
    masterCommunityName: "Palm Jumeirah",
    masterCommunityNameArabic: "نخلة جميرا",
    developerOrManagementCompanyId: "DEV-111",
    developerOrManagementCompanyName: "Skyline Management",
    masterDeveloperName: "Emirates Developers",
    propertyStatus: "Under Construction",
    propertyAccountStatus: "Active",
    propertyAccountStatusDate: new Date("2025-01-10"),
    propertyRegistrationDate: new Date("2025-01-12"),
    propertyStartDateEstimated: new Date("2025-01-15"),
    propertyCompletionDate: new Date("2026-06-20"),
    reservePercentage: 10,
    additionalReservePercentage: 5,
    totalReservePercentage: 15,
    reserveAccountEffectiveStartDate: new Date("2025-01-18"),
    currency: "AED",
    remarks: "Priority client",
    specialApproval: "High value project",
    rmName: "John Smith",
    assistantRm: "Mary Johnson",
    paymentTypeToBeBlocked: "Cheque",
    teamLeader: "David Brown",
    accountOwnerBackup: "Michael Clark",
    accountOwner: "Sophia Taylor",
    emailNotificationsInternal: "enabled",
    accounts: [
      {
        trustAccountNumber: "",
        ibanNumber: "",
        dateOpened: null,
        accountTitle: "",
        isInterestBearing: false,
      },
    ],
    fees: [
      {
        feeCategory: "Registration Fee",
        frequency: "One-time",
        vatPercentage: 18,
        corporateTax: 5,
        amount: 125000,
        debitAccountType: "",
        debitAccountNumber: "10,000",
        feeCollectionDate: dayjs("2025-11-05").toDate(),
        nextRecoveryDate: dayjs("2025-11-05").toDate(),
      },
    ],
    beneficiaries: [
      {
        id: "BEN7103",
        transferType: "TR (Transfer)",
        name: "Shree Developers Pvt. Ltd.",
        bankName: "HDFC Bank",
        routingCode: "HDFC",
        tradeLicenseNumber: "",
        placeOfIssue: "Abu Dhabi",
        tradeLicenseExpiry: dayjs("2025-11-05").toDate(),
        beneficiaryAccountIban: "",
        beneficiarySwift: "",
      },
      {
        id: "BEN7103",
        transferType: "TR (Transfer)",
        name: "Shree Developers Pvt. Ltd.",
        bankName: "HDFC Bank",
        routingCode: "HDFC",
        tradeLicenseNumber: "",
        placeOfIssue: "Abu Dhabi",
        tradeLicenseExpiry: dayjs("2025-11-05").toDate(),
        beneficiaryAccountIban: "",
        beneficiarySwift: "",
      },
      {
        id: "BEN7103",
        transferType: "TR (Transfer)",
        name: "Shree Developers Pvt. Ltd.",
        bankName: "HDFC Bank",
        routingCode: "HDFC",
        tradeLicenseNumber: "",
        placeOfIssue: "Abu Dhabi",
        tradeLicenseExpiry: dayjs("2025-11-05").toDate(),
        beneficiaryAccountIban: "",
        beneficiarySwift: "",
      },
    ],
    paymentPlan: [
      {
        installmentNumber: 1,
        installmentPercentage: "",
        projectCompletionPercentage: "",
      },
      {
        installmentNumber: 2,
        installmentPercentage: "",
        projectCompletionPercentage: "",
      },
      {
        installmentNumber: 3,
        installmentPercentage: "",
        projectCompletionPercentage: "",
      },
      {
        installmentNumber: 4,
        installmentPercentage: "",
        projectCompletionPercentage: "",
      },
    ],
    financialData: {
      projectActualCost: "50,000.00",
      actualCost: "67,000.00",
      projectBudget: "",
    },
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Project Details
        return (
          <Step1
            initialData={projectData}
            onDataChange={(data) => {
              setProjectData((prev) => ({
                ...prev,
                ...data,
              }));
            }}
          />
        );

      case 1: // Account Details
        return (
          <Step2
            accounts={projectData.accounts}
            onAccountsChange={(accounts) => {
              setProjectData((prev) => ({
                ...prev,
                accounts,
              }));
            }}
          />
        );

      case 2: // Fee Details
        return (
          <Step3
            fees={projectData.fees}
            onFeesChange={(fees) => {
              setProjectData((prev) => ({
                ...prev,
                fees,
              }));
            }}
          />
        );

      case 3: // Beneficiary Details
        return (
          <Step4
            beneficiaries={projectData.beneficiaries}
            onBeneficiariesChange={(beneficiaries) => {
              setProjectData((prev) => ({
                ...prev,
                beneficiaries,
              }));
            }}
          />
        );


      case 4: // Financial
        return (
          <Step5
            financialData={projectData.financialData}
            onFinancialDataChange={(financialData) => {
              setProjectData((prev) => ({
                ...prev,
                financialData,
              }));
            }}
          />
        );

     

      case 5: // Review
        return <Step6 PropertyData={PropertyManagementData} />;

      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%", p: 3 }}>
        {/* Header */}
        <Box mb={3}>
          <Typography variant="h4" gutterBottom>
            Project Details
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
          {steps.map((label, index) => (
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
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              {activeStep !== 0 && (
                <Button
                  variant="outlined"
                  onClick={() => setActiveStep(0)}
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button>
              )}
              <Button variant="contained" onClick={handleNext}>
                {activeStep === steps.length - 1
                  ? "Save and Next"
                  : "Save and Next"}
              </Button>
            </Box>
          </div>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default ProjectDetailsStepper;
export type { PropertyData, PropertyDetailsData } from "./types";
