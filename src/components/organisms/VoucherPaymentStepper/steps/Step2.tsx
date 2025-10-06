"use client";

import React from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const labelSx = {
  color: "#6A7282",
  fontFamily: "Outfit",
  fontWeight: 400,
  fontStyle: "normal",
  fontSize: "12px",
  letterSpacing: 0,
};

const valueSx = {
  color: "#1E2939",
  fontFamily: "Outfit",
  fontWeight: 400,
  fontStyle: "normal",
  fontSize: "14px",
  letterSpacing: 0,
  wordBreak: "break-word",
};

const fieldBoxSx = {
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
};

const renderDisplayField = (
  label: string,
  value: string | number | null = "-"
) => (
  <Box sx={fieldBoxSx}>
    <Typography sx={labelSx}>{label}</Typography>
    <Typography sx={valueSx}>{value || "-"}</Typography>
  </Box>
);

const renderCheckboxField = (label: string, checked: boolean) => (
  <FormControlLabel
    control={<Checkbox checked={checked} disabled />}
    label={label}
    sx={{
      "& .MuiFormControlLabel-label": {
        fontFamily: "Outfit, sans-serif",
        fontStyle: "normal",
        fontSize: "14px",
        lineHeight: "24px",
        letterSpacing: "0.5px",
        verticalAlign: "middle",
      },
    }}
  />
);

interface SectionProps {
  title: string;
  fields: {
    gridSize: number;
    label: string;
    value: string | number | boolean | null;
  }[];
}

const Section = ({ title, fields }: SectionProps) => (
  <Box mb={4}>
    <Typography
      variant="h6"
      fontWeight={600}
      gutterBottom
      sx={{
        fontFamily: "Outfit, sans-serif",
        fontWeight: 500,
        fontStyle: "normal",
        fontSize: "18px",
        lineHeight: "28px",
        letterSpacing: "0.15px",
        verticalAlign: "middle",
      }}
    >
      {title}
    </Typography>

    <Grid container spacing={3} mt={3}>
      {fields.map((field, idx) => (
        <Grid
          size={{ xs: 12, md: field.gridSize }}
          key={`field-${title}-${idx}`}
        >
          {typeof field.value === "boolean"
            ? renderCheckboxField(field.label, field.value)
            : renderDisplayField(field.label, field.value)}
        </Grid>
      ))}
    </Grid>
  </Box>
);

const Step2 = () => {
  const generalDetails = [
    { gridSize: 6, label: "Voucher Number*", value: "VCH12345" },
    {
      gridSize: 6,
      label: "Developer/Management Company Name*",
      value: "Sunrise Developers",
    },
    { gridSize: 6, label: "Property Name*", value: "Emerald Heights" },
    { gridSize: 6, label: "Project Account Status*", value: "Active" },
    { gridSize: 6, label: "Escrow Account No.*", value: "ESC001234" },
    { gridSize: 6, label: "Reserve Account No.*", value: "RES009876" },
    {
      gridSize: 6,
      label: "Current Balance in Escrow A/c*",
      value: "150000.00",
    },
    {
      gridSize: 6,
      label: "Current Balance in Reserve A/c*",
      value: "50000.00",
    },
    { gridSize: 6, label: "RERA Approval Ref No.", value: "RERA-REF-4567" },
    { gridSize: 6, label: "RERA Approval Date", value: "2025-08-12" },
    { gridSize: 6, label: "Partial Payment*", value: "Yes" },
    { gridSize: 6, label: "Invoice Ref No.*", value: "INV-2025-001" },
    { gridSize: 6, label: "Invoice Value*", value: "200000.00" },
    { gridSize: 6, label: "Invoice Currency Type", value: "AED" },
    { gridSize: 6, label: "Invoice Date*", value: "2025-08-10" },
    { gridSize: 6, label: "RT03", value: "RT03-9087" },
    {
      gridSize: 6,
      label: "Total Eligible Amount (Invoice)",
      value: "180000.00",
    },
    { gridSize: 6, label: "Amount Paid Against Invoice", value: "150000.00" },
    { gridSize: 6, label: "CAP Exceeded", value: true },
    {
      gridSize: 6,
      label: "Total Amount Paid (Payment Type)",
      value: "150000.00",
    },
    { gridSize: 6, label: "Payment Currency", value: "AED" },
    { gridSize: 6, label: "Debit from Escrow (AED)", value: "100000.00" },
    { gridSize: 6, label: "Current Eligible Amount", value: "80000.00" },
    { gridSize: 6, label: "Debit from Reserve (AED)", value: "50000.00" },
    { gridSize: 6, label: "Total Payout Amount", value: "150000.00" },
    { gridSize: 6, label: "Amount In Transit", value: "20000.00" },
  ];

  const budgetType = [
    { gridSize: 6, label: "Budget Year*", value: "2025" },
    { gridSize: 6, label: "Category*", value: "Infrastructure" },
    { gridSize: 6, label: "Subcategory*", value: "Road Maintenance" },
    { gridSize: 6, label: "Category Code", value: "CAT-001" },
    { gridSize: 6, label: "Subcategory Code", value: "SUB-045" },
    { gridSize: 6, label: "Service Name*", value: "Paving Services" },
    { gridSize: 6, label: "Service Code", value: "SRV-1002" },
    { gridSize: 6, label: "Provisional Budget", value: true },
    { gridSize: 6, label: "Provisional Budget Code", value: "PB-2025-01" },
    { gridSize: 6, label: "Available Budget Amount", value: 1500000 },
    { gridSize: 6, label: "Utilized Budget Amount", value: 450000 },
    { gridSize: 6, label: "Invoice Amount", value: 50000 },
    { gridSize: 6, label: "RERA Exception", value: true },
  ];

  const beneficiaryDetails = [
    { gridSize: 6, label: "Beneficiary Account Number", value: "1234567890" },
    { gridSize: 6, label: "Beneficiary Name", value: "John Doe Enterprises" },
    { gridSize: 6, label: "Beneficiary Bank", value: "ABC National Bank" },
    { gridSize: 6, label: "Beneficiary SWIFT", value: "ABCDEF12" },
    { gridSize: 6, label: "Beneficiary Routing Code", value: "RT123456" },
    {
      gridSize: 6,
      label: "Beneficiary Account No / IBAN",
      value: "AE070331234567890123456",
    },
    { gridSize: 6, label: "Transfer Type*", value: "International" },
    { gridSize: 6, label: "Routing Sort Code", value: "12-34-56" },
  ];

  const unitCancellation = [
    { gridSize: 6, label: "Unit No.*", value: "1896" },
    { gridSize: 6, label: "Tower Name", value: "0.00" },
    { gridSize: 6, label: "Unit Status", value: "Opened" },
    {
      gridSize: 6,
      label: "Amount received from Unit Holder*",
      value: "110.00",
    },
    { gridSize: 3, label: "Forfeit", value: true },
    { gridSize: 3, label: "Refund to unit holder", value: false },
    { gridSize: 6, label: "Transfer to other unit", value: false },
    { gridSize: 3, label: "Forfeit Amount", value: "110.14" },
    { gridSize: 3, label: "Regulator Approval Ref No.*", value: "877767" },
    { gridSize: 6, label: "Approval Date*", value: "15/01/2025" },
    { gridSize: 6, label: "Charge Code", value: "-" },
    { gridSize: 6, label: "Payment Mode*", value: "TR (Transfer)" },
    { gridSize: 6, label: "Transaction Type", value: "-" },
    { gridSize: 6, label: "Amount to be Released", value: "0.00" },
    { gridSize: 6, label: "Payment Date*", value: "15/01/2025" },
    { gridSize: 6, label: "VAT Payment Amount*", value: "0.00" },
    { gridSize: 6, label: "Engineer Fee Payment Needed", value: true },
    { gridSize: 6, label: "Engineer Fee Payment", value: "50.00" },
    { gridSize: 6, label: "Bank Charges", value: "100" },
    { gridSize: 6, label: "Payment to be made from CBSP", value: "No" },
    {
      gridSize: 12,
      label:
        "Please review the Guarantee details and Documents before submitting the payment",
      value: true,
    },
  ];

  return (
    <Card
      sx={{
        boxShadow: "none",
        backgroundColor: "#FFFFFFBF",
        width: "94%",
        margin: "0 auto",
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ fontFamily: "Outfit", fontSize: "20px" }}
          >
            Details
          </Typography>
          <Button
            startIcon={<EditIcon />}
            sx={{ fontSize: "14px", textTransform: "none" }}
          >
            Edit
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3} mb={4} mt={3}>
          {generalDetails.map((field, idx) => (
            <Grid
              size={{ xs: 12, md: field.gridSize }}
              key={`field-${field.label}-${idx}`}
            >
              {typeof field.value === "boolean"
                ? renderCheckboxField(field.label, field.value)
                : renderDisplayField(field.label, field.value)}
            </Grid>
          ))}
        </Grid>

        <Section title="Expense Type" fields={budgetType} />
        <Section title="Amount Details" fields={beneficiaryDetails} />
        <Section title="Unit Cancellation Details" fields={unitCancellation} />
      </CardContent>
    </Card>
  );
};

export default Step2;
