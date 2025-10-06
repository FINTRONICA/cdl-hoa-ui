

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

const Step3 = () => {
  const basicFields = [
    { gridSize: 6, label: "Investor Name (English)", value: "Samari" },
    {
      gridSize: 6,
      label: "Investor Name (Arabic)",
      value: "Investor Name (Arabic)",
    },
    { gridSize: 6, label: "Ownership Percentage", value: "12" },
    { gridSize: 6, label: "Investor ID Type", value: "Passport" },
    { gridSize: 6, label: "Reserve Percentage", value: "8%" },
    { gridSize: 6, label: "ID Expiry Date", value: "01/01/2025" },
    { gridSize: 6, label: "ID Number", value: "dd" },
    { gridSize: 6, label: "Investor/Unit Mollak ID", value: "OWN7106" },
    { gridSize: 6, label: "Investor Contact No", value: "1223" },
    { gridSize: 6, label: "Investor Type", value: "Individual" },
    { gridSize: 6, label: "Nationality", value: "Saudi Arabia" },
    { gridSize: 6, label: "Investor Email Address", value: "aaa@gmail.com" },
    { gridSize: 6, label: "Floor", value: "Floor" },
    { gridSize: 6, label: "No of Bedroom", value: "No of Bedroom" },
    { gridSize: 6, label: "Joint Owner 2 Name", value: "Joint Owner 2 Name" },
    {
      gridSize: 6,
      label: "Nationality of Joint Owner 2",
      value: "Nationality of Joint Owner 2",
    },
    { gridSize: 6, label: "ID No Date of Expiry of Joint Owner 2", value: "-" },
    {
      gridSize: 6,
      label: "(ID) Date of Expiry of Joint Owner 2 ",
      value: "01/01/2025",
    },
    { gridSize: 6, label: "Joint Owner 3 Name", value: "Joint Owner 3 Name" },
    {
      gridSize: 6,
      label: "Nationality of Joint Owner 3",
      value: "Nationality of Joint Owner 3",
    },
    { gridSize: 6, label: "ID No Date of Expiry of Joint Owner 3", value: "-" },
    {
      gridSize: 6,
      label: "(ID) Date of Expiry of Joint Owner 3 ",
      value: "01/01/2025",
    },
    { gridSize: 6, label: "Joint Owner 4 Name", value: "Joint Owner 4 Name" },
    {
      gridSize: 6,
      label: "Nationality of Joint Owner 4",
      value: "Nationality of Joint Owner 4",
    },
    { gridSize: 6, label: "ID No Date of Expiry of Joint Owner 4", value: "-" },
    {
      gridSize: 6,
      label: "(ID) Date of Expiry of Joint Owner 4 ",
      value: "01/01/2025",
    },
    { gridSize: 6, label: "Joint Owner 5 Name", value: "Joint Owner 5 Name" },
    {
      gridSize: 6,
      label: "Nationality of Joint Owner 5",
      value: "Nationality of Joint Owner 5",
    },
    { gridSize: 6, label: "ID No Date of Expiry of Joint Owner 5", value: "-" },
    {
      gridSize: 6,
      label: "(ID) Date of Expiry of Joint Owner 5 ",
      value: "01/01/2025",
    },
  ];

  const unitFields = [
    { gridSize: 6, label: "Property ID", value: "Unit" },
    { gridSize: 6, label: "Property Name", value: "Pro Extention New test" },
    {
      gridSize: 6,
      label: "Management Company/Developer ID",
      value: "51283456",
    },
    {
      gridSize: 6,
      label: "Management Company/Developer Name",
      value: "Green Group",
    },
    {
      gridSize: 6,
      label: "Unit Reference Number",
      value: "Unit Reference Number",
    },
    { gridSize: 6, label: "Unit no.", value: "654323" },
    { gridSize: 6, label: "Unit Status", value: "Opened" },
    { gridSize: 6, label: "Tower/Building Name", value: "tower 1" },
    { gridSize: 6, label: "Unit/Plot size", value: "1000.0" },
    {
      gridSize: 6,
      label: "Property ID (Drop down User Selection)",
      value: "Property ID (Drop down User Selection)",
    },
    { gridSize: 6, label: "Unit IBAN", value: "342321" },
    { gridSize: 6, label: "Name of Agent", value: "Agent Name" },
    { gridSize: 6, label: "Agent National ID", value: "Agent National ID" },
    { gridSize: 6, label: "Gross Sale Price", value: "246,578.00" },
    { gridSize: 6, label: "Sale Price", value: "Sale Price" },
    { gridSize: 6, label: "VAT Applicable", value: "Yes" },
    { gridSize: 6, label: "Deed No.", value: "Deed No." },
    { gridSize: 6, label: "Agreement No./ Contract No.", value: "-" },
    { gridSize: 6, label: "Agreement Date", value: "10/09/2024" },
    { gridSize: 6, label: "World Check", value: "Yes" },
    {
      gridSize: 6,
      label:
        "Amount Paid to Management Company/Developer (AED) Within General Fund Escrow",
      value: "Amount Paid Company",
    },
    {
      gridSize: 6,
      label:
        "Amount Paid to Management Company/Developer (AED) Within General Fund Escrow",
      value: "Amount Paid Developer",
    },
    { gridSize: 6, label: "Total Amount Paid", value: "Total Amount Paid" },
    { gridSize: 6, label: "Unit Area Size", value: "Unit Area Size" },
    { gridSize: 6, label: "Remarks", value: "Remarks" },
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
            Basic Details
          </Typography>
          <Button
            startIcon={<EditIcon />}
            sx={{
              fontFamily: "Outfit, sans-serif",
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "24px",
              letterSpacing: "0.5px",
              verticalAlign: "middle",
            }}
          >
            Edit
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {basicFields.map((field, idx) => (
            <Grid size={{ xs: 12, md: field.gridSize }} key={`basic-${idx}`}>
              {renderDisplayField(field.label, field.value)}
            </Grid>
          ))}
        </Grid>
      </CardContent>

      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
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
            Unit Details
          </Typography>
          <Button
            startIcon={<EditIcon />}
            sx={{
              fontFamily: "Outfit, sans-serif",
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "24px",
              letterSpacing: "0.5px",
              verticalAlign: "middle",
            }}
          >
            Edit
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {unitFields.map((field, idx) => (
            <Grid size={{ xs: 12, md: field.gridSize }} key={`unit-${idx}`}>
              {renderDisplayField(field.label, field.value)}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Step3;
