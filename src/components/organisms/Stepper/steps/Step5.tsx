"use client";

import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { KeyboardArrowDown as KeyboardArrowDownIcon } from "@mui/icons-material";
import { FinancialData } from "../types";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Controller, useFormContext } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

interface Step5Props {
  financialData: FinancialData;
  onFinancialDataChange: (financialData: FinancialData) => void;
}

const Step5: React.FC<Step5Props> = ({
  financialData,
  onFinancialDataChange,
}) => {
  const handleFinancialDataChange = (
    field: keyof FinancialData,
    value: string
  ) => {
    onFinancialDataChange({
      ...financialData,
      [field]: value,
    });
  };

  // Common styles for form components
  const commonFieldStyles = {
    "& .MuiOutlinedInput-root": {
      height: "46px",
      borderRadius: "8px",
      "& fieldset": {
        borderColor: "#CAD5E2",
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: "#CAD5E2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2563EB",
      },
    },
  };

  const errorFieldStyles = {
    "& .MuiOutlinedInput-root": {
      height: "46px",
      borderRadius: "8px",
      "& fieldset": {
        borderColor: "red",
        borderWidth: "1px",
      },
    },
  };

  const selectStyles = {
    height: "46px",
    "& .MuiOutlinedInput-root": {
      height: "46px",
      borderRadius: "8px",
      "& fieldset": {
        borderColor: "#CAD5E2",
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: "#CAD5E2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2563EB",
      },
    },
    "& .MuiSelect-icon": {
      color: "#666",
    },
  };

  const datePickerStyles = {
    height: "46px",
    "& .MuiOutlinedInput-root": {
      height: "46px",
      borderRadius: "8px",
      "& fieldset": {
        borderColor: "#CAD5E2",
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: "#CAD5E2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2563EB",
      },
    },
  };

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

  const StyledCalendarIcon = (props: any) => (
    <CalendarTodayOutlinedIcon
      {...props}
      sx={{
        width: "18px",
        height: "20px",
        position: "relative",
        top: "2px",
        left: "3px",
        transform: "rotate(0deg)",
        opacity: 1,
      }}
    />
  );

  const { control } = useFormContext();

const renderTextField = (name: string, label: string, gridSize = 3, index?: number) => (
  <Grid key={`${name}-${index ?? label}`} size={{ xs: 12, md: gridSize }}>
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          label={label}
          InputLabelProps={{ sx: labelSx }}
          InputProps={{ sx: valueSx }}
          sx={commonFieldStyles}
        />
      )}
    />
  </Grid>
);

  const renderSelectField = (
    name: string,
    label: string,
    options: { value: string; label: string }[],
    gridSize = 3
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel sx={labelSx}>{label}</InputLabel>
            <Select
              {...field}
              label={label}
              IconComponent={KeyboardArrowDownIcon}
              sx={{ ...selectStyles, ...valueSx }}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
    </Grid>
  );

  const renderDateField = (name: string, label: string, gridSize = 3) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <DatePicker
            label={label}
            value={field.value}
            onChange={field.onChange}
            format="DD/MM/YYYY"
            slots={{ openPickerIcon: StyledCalendarIcon }}
            slotProps={{
              textField: {
                fullWidth: true,
                sx: datePickerStyles,
                InputLabelProps: { sx: labelSx },
                InputProps: {
                  sx: valueSx,
                  style: { height: "46px" },
                },
              },
            }}
          />
        )}
      />
    </Grid>
  );

  const groupedFields = [
    {
      title: "Account/Property Estimate (AED)",
      fields: [
        renderTextField("actual.soldValue", "Sold Value*", 6),
        renderTextField("actual.constructionCost", "Construction Cost*", 6),
        renderTextField("actual.infraCost", "Infra Cost*", 4),
        renderTextField("actual.landCost", "Land Cost*", 4),
        renderTextField(
          "actual.projectManagementExpense",
          "Project Management Expense*",
          4
        ),
        renderTextField("actual.marketingExpense", "Marketing Expense*", 6),
        renderDateField("actual.date", "Date*", 6),
      ],
    },

    {
      title: "Project Actual (AED)",
      fields: [
        renderTextField("actual.soldValue", "Sold Value*", 6),
        renderTextField("actual.constructionCost", "Construction Cost*", 6),
        renderTextField("actual.infraCost", "Infra Cost*", 4),
        renderTextField("actual.landCost", "Land Cost*", 4),
        renderTextField(
          "actual.projectManagementExpense",
          "Project Management Expense*",
          4
        ),
        renderTextField("actual.marketingExpense", "Marketing Expense*", 6),
        renderDateField("actual.date", "Date*", 6),
      ],
    },
    {
      title: "Current Balance (AED)",
      fields: [
        renderSelectField(
          "estimate.currentBalanceCategory",
          "Category*",
          [
            {
              value: "cash_received",
              label: "Cash Received from the unit holder",
            },
            { value: "marketing_expenses", label: "Marketing Expenses" },
            {
              value: "project_management_expense",
              label: "Project Management Expense",
            },
            { value: "vat_payment", label: "VAT payment" },
            { value: "refund", label: "Refund" },
            { value: "balance_in_reserve_ac", label: "Balance in Reserve A/C" },
            {
              value: "balance_in_management_company_ac",
              label: "Balance in Management Company/Body Corporate A/C",
            },
            { value: "technical_fees", label: "Technical Fees" },
            { value: "unidentified_funds", label: "Unidentified Funds" },
            { value: "loans_instalments", label: "Loans/ Instalments" },
            { value: "infrastructure_cost", label: "Infrastructure Cost" },
            { value: "transferred", label: "Transferred" },
            { value: "others_withdrawals", label: "Others Withdrawals" },
            { value: "service_charges", label: "Service Charges" },
            {
              value: "other_income_security_deposit",
              label: "Other Income / Security Deposit",
            },
            { value: "bounced_cheque", label: "Bounced Cheque" },
            { value: "insurance_claim", label: "Insurance Claim" },
            {
              value: "naqoodi_charges",
              label: "Naqoodi/Payment gateway charges",
            },
            { value: "reserve_fund", label: "Reserve Fund" },
            {
              value: "credit_interest_profit",
              label: "Credit interest/Profit",
            },
            { value: "unallocated", label: "Unallocated" },
            { value: "erroneous_credit", label: "Erroneous credit" },
            { value: "others", label: "Others" },
          ],
          6
        ),
        renderTextField(
          "actual.outOfGeneralFundsEscrow",
          "Out of General Funds Escrow",
          6
        ),
        renderTextField(
          "actual.withInGeneralFundsEscrow",
          "With In General Funds Escrow*",
          6
        ),
        renderTextField("actual.total", "Total", 6),
        renderTextField(
          "actual.outOfReserveFundsEscrow",
          "Out of Reserve Funds Escrow",
          6
        ),
        renderTextField(
          "actual.withInReserveFundsEscrow",
          "With In Reserve Funds Escrow*",
          6
        ),
        renderTextField("actual.total", "Total", 6),

        renderTextField(
          "actual.creditInterestProfitEarnedForReserveAC",
          "Credit Interest Profit Earned For Reserve AC",
          6
        ),
        renderTextField(
          "actual.paymentsFromReserveA/c ",
          "Payments From Reserve A/c",
          6
        ),
        renderTextField(
          "actual.creditInterestProfitEarnedFromESCROWA/C ",
          "Credit Interest Profit Earned From ESCROWA/C ",
          6
        ),
      ],
    },
    {
      fields: [
        renderSelectField(
          "estimate.CompanyName ",
          "Company Name*",
          [
            { value: "company1", label: "Company1" },
            { value: "company2", label: "Company2" },
            { value: "company3", label: "Company3" },
          ],
          6
        ),
        renderSelectField(
          "estimate.propertyName",
          "Property Name*",
          [
            { value: "propert1", label: "Propert 1" },
            { value: "propert2", label: "Propert 2" },
            { value: "propert3", label: "Propert 3" },
          ],
          6
        ),

        renderDateField("estimate.propertyInitiatedDate", "Date*", 6),
      ],
    },
  ];


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card
        sx={{
          boxShadow: "none",
          backgroundColor: "#FFFFFFBF",
          width: "94%",
          margin: "0 auto",
        }}
      >
        <CardContent>
          {groupedFields.map(({ title, fields }, sectionIndex) => (
            <Box key={sectionIndex} mb={6}>
              <Typography
                variant="h6"
                mb={2}
                sx={{
                  color: "#1E2939",
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
              <Grid container spacing={3}>
                {fields}
              </Grid>
            </Box>
          ))}
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default Step5;
