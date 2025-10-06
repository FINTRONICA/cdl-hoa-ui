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

const Step2 = () => {
  const basicFields = [
    { gridSize: 6, label: "propertyManagement", value: "Samari" },

    { gridSize: 6, label: "companyId", value: "23232" },
    { gridSize: 6, label: "clientOrRegulatory", value: "-" },
    { gridSize: 6, label: "companyName", value: "HDFC" },
    { gridSize: 6, label: "companyNumber", value: "HDFC123" },

    { gridSize: 6, label: "project", value: "Mollak API" },
    { gridSize: 6, label: "masterDeveloper", value: "dd" },
    { gridSize: 6, label: "masterCommunity", value: "community" },
    { gridSize: 6, label: "IcifId", value: "1223" },
    { gridSize: 6, label: "managementType", value: "Developer" },
    { gridSize: 6, label: "companyNameArabic", value: "Saudi Arabia" },
    { gridSize: 6, label: "tradeLicenseNumber", value: "ztplic1" },
    { gridSize: 6, label: "tradeLicenseExpiry", value: "01/01/2025" },
    { gridSize: 6, label: "account1Mobile", value: "8899889988" },
    { gridSize: 6, label: "account1Tel", value: "11111" },
    {
      gridSize: 6,
      label: "account1Fax",
      value: "fax123",
    },
    { gridSize: 6, label: "ID No Date of Expiry of Joint Owner 2", value: "-" },
    {
      gridSize: 6,
      label: "account1Email",
      value: "account@1gmail.com",
    },
    {
      gridSize: 6,
      label: "account2Name",
      value: "-",
    },
    {
      gridSize: 6,
      label: "account2Tel",
      value: "-",
    },
    {
      gridSize: 6,
      label: "account2Mobile",
      value: "-",
    },
    {
      gridSize: 6,
      label: "account2Email",
      value: "account@1gmail.com",
    },
    {
      gridSize: 6,
      label: "account3Name",
      value: "",
    },
    {
      gridSize: 6,
      label: "account3Tel",
      value: "-",
    },
    {
      gridSize: 6,
      label: "account3Mobile",
      value: "-",
    },
    {
      gridSize: 6,
      label: "account3Email",
      value: "account@1gmail.com",
    },
    {
      gridSize: 6,
      label: "account4Name",
      value: "",
    },
    {
      gridSize: 6,
      label: "account4Tel",
      value: "-",
    },
    {
      gridSize: 6,
      label: "account4Mobile",
      value: "-",
    },
    {
      gridSize: 6,
      label: "account4Email",
      value: "account@1gmail.com",
    },

    {
      gridSize: 6,
      label: "account5Name",
      value: "",
    },
    {
      gridSize: 6,
      label: "account5Tel",
      value: "-",
    },
    {
      gridSize: 6,
      label: "account5Mobile",
      value: "-",
    },
    {
      gridSize: 6,
      label: "account5Email",
      value: "account@1gmail.com",
    },
    { gridSize: 6, label: "migratedData", value: "-" },
    { gridSize: 6, label: "remarks", value: "Yes" },
    { gridSize: 6, label: "notification", value: "No" },
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
    </Card>
  );
};

export default Step2;
