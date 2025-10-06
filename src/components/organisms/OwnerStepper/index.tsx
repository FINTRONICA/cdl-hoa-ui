"use client";

import { useState } from "react";
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
import Step3 from "./steps/Step3";
import { OwnerData } from "./ownersTypes";
const steps = ["Basic Details", "Unit Details", "Review"];

export default function InvestorsStepperWrapper() {
  const [activeStep, setActiveStep] = useState(0);

  const methods = useForm<OwnerData>({
    defaultValues: {
      investor: {
        investorNameEnglish: "",
        investorNameArabic: "",
        ownershipPercentage: 0,
        investorIdType: "",
        reservePercentage: 0,
        idExpiryDate: null,
        idNumber: "",
        investorUnitMollakId: "",
        investorContactNo: "",
        investorType: "",
        nationality: "",
        investorEmailAddress: "",
        floor: "",
        noOfBedroom: "",
        jointOwner2Name: "",
        nationalityJointOwner2: "",
        idNoDateOfExpiryJointOwner2: "",
        dateOfExpiryJointOwner2Calendar: null,
        jointOwner3Name: "",
        nationalityJointOwner3: "",
        idNoDateOfExpiryJointOwner3: "",
        dateOfExpiryJointOwner3Calendar: null,
        jointOwner4Name: "",
        nationalityJointOwner4: "",
        idNoDateOfExpiryJointOwner4: "",
        dateOfExpiryJointOwner4Calendar: null,
        jointOwner5Name: "",
        nationalityJointOwner5: "",
        idNoDateOfExpiryJointOwner5: "",
        dateOfExpiryJointOwner5Calendar: null,
      },
      unity: {
        propertyId: "",
        propertyName: "",
        managementCompanyDeveloperId: "",
        managementCompanyDeveloperName: "",
        unitReferenceNumber: "",
        unitNo: "",
        unitStatus: "",
        towerBuildingName: "",
        unitPlotSize: 0,
        propertyIdDropdown: "",
        unitIban: "",
        nameOfAgent: "",
        agentNationalId: "",
        grossSalePrice: 0,
        salePrice: 0,
        vatApplicable: "",
        deedNo: "",
        agreementNo: "",
        agreementDate: null,
        worldCheck: "Yes", // default to Yes
        amountPaidWithinGeneralFundEscrow1: 0,
        amountPaidWithinGeneralFundEscrow2: 0,
        totalAmountPaid: 0,
        unitAreaSize: 0,
        remarks: "",
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

  const onSubmit = (data: OwnerData) => {
    console.log("Form data:", data);
    // Handle form submission
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 />;
      case 2:
        return <Step3 />;
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
