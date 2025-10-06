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
    { gridSize: 6, label: "Charge Type ID*", value: 101 },
    { gridSize: 6, label: "Charge Type*", value: "Maintenance" },
    { gridSize: 6, label: "Group Name*", value: "Building Services" },
    { gridSize: 6, label: "Category Code*", value: "CAT001" },
    { gridSize: 6, label: "Category Name*", value: "Plumbing" },
    { gridSize: 6, label: "Category Sub Code*", value: "SUB001" },
    { gridSize: 6, label: "Category Sub Name*", value: "Water Supply" },
    { gridSize: 6, label: "Service Name*", value: "Leak Repair" },
    { gridSize: 6, label: "Service Code*", value: "SRV001" },
    { gridSize: 6, label: "Provisional Budget Code*", value: "BGT001" },
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
      </CardContent>
    </Card>
  );
};

export default Step2;
