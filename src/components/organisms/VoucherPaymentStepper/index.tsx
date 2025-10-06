"use client";

import { useState } from "react";
import dayjs from "dayjs";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";

import { ProjectData } from "./voucherPaymentTypes";

const steps = ["Details", "Review"];

export default function VoucherPaymentStepperWrapper() {
  const [activeStep, setActiveStep] = useState(0);

  const methods = useForm<ProjectData>({
    defaultValues: {
      sectionId: "PROJ7102",
      developerId: "12345677",
      developerName: "",
      masterDeveloperName: "",
      projectName: "",
      projectLocation: "",
      projectAccountCif: "",
      projectStatus: "",
      projectAccountStatusDate: null,
      projectRegistrationDate: null,
      projectStartDate: null,
      projectCompletionDate: null,
      retention: "5.00",
      additionalRetention: "8.00",
      totalRetention: "13.00",
      retentionEffectiveStartDate: dayjs("2022-03-31"),
      projectManagementExpenses: "5.00",
      marketingExpenses: "10.00",
      realEstateBrokerExpense: "",
      advertisingExpense: "",
      landOwnerName: "",
      projectCompletionPercentage: "",
      currency: "AED",
      actualConstructionCost: "",
      noOfUnits: "12",
      remarks: "",
      specialApproval: "",
      paymentType: "",
      managedBy: "erm_checker1,erm_checker1,erm_checker1",
      backupRef: "Master ENBD_robust_maker1",
      relationshipManager: "",
      assistantRelationshipManager: "",
      teamLeaderName: "",

      accounts: [
        {
          trustAccountNumber: "",
          ibanNumber: "",
          dateOpened: null,
          accountTitle: "",
          currency: "AED",
        },
      ],

      fees: [
        {
          feeType: "",
          frequency: "",
          debitAmount: "",
          feeToBeCollected: "",
          nextRecoveryDate: null,
          feePercentage: "",
          amount: "",
          vatPercentage: "",
        },
      ],

      beneficiaries: [
        {
          id: "",
          expenseType: "",
          transferType: "",
          name: "",
          bankName: "",
          swiftCode: "",
          routingCode: "",
          account: "",
        },
      ],

      paymentPlan: [
        {
          installmentNumber: 1,
          installmentPercentage: "",
          projectCompletionPercentage: "",
        },
      ],

      financialData: {
        projectEstimatedCost: "",
        actualCost: "",
        projectBudget: "",
      },
    },
  });

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

  const onSubmit = (data: ProjectData) => {
    console.log("Form data:", data);
    // Handle form submission
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 />;
      default:
        return null;
    }
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
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "12px",
                      lineHeight: "100%",
                      letterSpacing: "0.36px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      textTransform: "uppercase",
                    }}
                  >
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
                    sx={{
                      mr: 2,
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "20px",
                      letterSpacing: 0,
                    }}
                    variant="outlined"
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{
                    fontFamily: "Outfit, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "14px",
                    lineHeight: "20px",
                    letterSpacing: 0,
                  }}
                >
                  {activeStep === steps.length - 1
                    ? "Submit"
                    : "Save and Review"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
}
