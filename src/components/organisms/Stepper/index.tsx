"use client";
import { useState } from "react";
import dayjs from "dayjs";
import { Step, StepLabel, Button, Box, Typography } from "@mui/material";
import Stepper from "@mui/material/Stepper";
import { FormProvider, useForm } from "react-hook-form";

import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";

import {
  PropertyDetailsData,
  AccountData,
  FeeData,
  BeneficiaryData,
  PaymentPlanData,
  FinancialData,
  PropertyData,
} from "./types";

const steps = [
  "Basic Details",
  "Account",
  "Fee Details",
  "Beneficiary Details",

  "Financial",

  "Review",
];

export default function StepperWrapper() {
  const [activeStep, setActiveStep] = useState(0);

  const methods = useForm<PropertyData>({
    defaultValues: {
      propertyId: "PROP123456",
      propertyReraOrDifcNumber: "RERA78910",
      typeOfEscrow: "Residential",
      propertyAccountCifBank: "CIF987654",
      propertyName: "Sunset Heights",
      accountType: "Savings",
      propertyType: "Apartment",
      propertyLocation: "Downtown Dubai",
      companyNumber: "COMP456789",
      companyName: "Bright Developers LLC",
      propertyGroupId: "GRP001",
      projectName: "Sunset Heights Tower A",
      projectNameArabic: "برج صن ست هايتس أ",
      masterCommunityName: "Palm Community",
      masterCommunityNameArabic: "مجتمع بالم",
      developerOrManagementCompanyId: "DEV102",
      masterDeveloperName: "Sunshine Developers",
      propertyStatus: "Under Construction",
      propertyAccountStatus: "Active",
      propertyAccountStatusDate: new Date("2025-03-01"),
      propertyRegistrationDate: new Date("2024-08-15"),
      propertyStartDateEstimated: new Date("2024-09-01"),
      propertyCompletionDate: new Date("2026-12-31"),
      reservePercentage: 10,
      additionalReservePercentage: 5,
      totalReservePercentage: 15,
      reserveAccountEffectiveStartDate: new Date("2024-09-15"),
      currency: "AED",
      remarks: "Project progressing as per plan.",
      specialApproval: "None",
      rmName: "Ali Khan",
      assistantRm: "Sara Ahmed",
      paymentTypeToBeBlocked: "Cheque",
      teamLeader: "John Doe",
      accountOwnerBackup: "Emma Smith",
      accountOwner: "Michael Johnson",
      emailNotificationsInternal: "internal@brightdev.com",

      accounts: [
        {
          trustAccountNumber: "TA-00012345",
          ibanNumber: "AE07 0331 2345 6789 0123 456",
          dateOpened: dayjs("2024-05-20"),
          accountTitle: "Sunset Heights Project Account",
          isInterestBearing: true,
        },
      ],

      fees: [
        {
          feeCategory: "Maintenance",
          frequency: "Monthly",
          vatPercentage: 5,
          corporateTax: 9,
          amount: 2500,
          debitAccountType: "Savings",
          debitAccountNumber: "ACC987654321",
          feeCollectionDate: new Date("2025-01-05"),
          nextRecoveryDate: new Date("2025-02-05"),
        },
      ],

      beneficiaries: [
        {
          id: "BEN001",
          transferType: "Wire Transfer",
          name: "Global Supplies Ltd.",
          bankName: "Dubai National Bank",
          routingCode: "DNB12345",
          tradeLicenseNumber: "TL987654",
          placeOfIssue: "Dubai",
          tradeLicenseExpiry: new Date("2026-06-30"),
          beneficiaryAccountIban: "AE98 7654 3210 9876 5432 109",
          beneficiarySwift: "DNBKAEAD",
        },
      ],

      financialData: {
        projectActualCost: "5000000",
        actualCost: "2000000",
        projectBudget: "6000000",
      },
    },
    mode: "onChange", // Enable real-time validation
  });

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <Step1 />;
      case 1:
        return (
          <Step2
            accounts={methods.watch("accounts")}
            onAccountsChange={(accounts) =>
              methods.setValue("accounts", accounts)
            }
          />
        );
      case 2:
        return (
          <Step3
            fees={methods.watch("fees")}
            onFeesChange={(fees) => methods.setValue("fees", fees)}
          />
        );
      case 3:
        return (
          <Step4
            beneficiaries={methods.watch("beneficiaries")}
            onBeneficiariesChange={(beneficiaries) =>
              methods.setValue("beneficiaries", beneficiaries)
            }
          />
        );

      case 4:
        return (
          <Step5
            financialData={methods.watch("financialData")}
            onFinancialDataChange={(financialData) =>
              methods.setValue("financialData", financialData)
            }
          />
        );

      case 5:
        return <Step6 PropertyData={methods.getValues()} />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    methods.reset();
  };

  const onSubmit = (data: PropertyData) => {
    console.log("Form data:", data);
    // Handle form submission
  };

  const labelSx = {
    fontFamily: "Outfit, sans-serif",
    fontWeight: 400,
    fontStyle: "normal",
    fontSize: "12px",
    lineHeight: "100%",
    letterSpacing: "0.36px",
    textAlign: "center",
    verticalAlign: "middle",
    textTransform: "uppercase",
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#FFFFFFBF",
            borderRadius: "16px",
            paddingTop: "16px",
            border: "1px solid #FFFFFF",
          }}
        >
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <Typography variant="caption" sx={labelSx}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ my: 4, backgroundColor: "#FFFFFFBF", boxShadow: "none" }}>
            {getStepContent(activeStep)}

            <Box
              display="flex"
              justifyContent="space-between"
              sx={{ backgroundColor: "#FFFFFFBF", mt: 3, mx: 6, mb: 2 }}
            >
              <Button
                onClick={handleReset}
                sx={{
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "20px",
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
                      mr: 2,
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "20px",
                      letterSpacing: 0,
                    }}
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  variant="contained"
                  disabled={activeStep === steps.length - 1}
                  sx={{
                    fontFamily: "Outfit, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "14px",
                    lineHeight: "20px",
                    letterSpacing: 0,
                  }}
                >
                  Save and Next
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
}
