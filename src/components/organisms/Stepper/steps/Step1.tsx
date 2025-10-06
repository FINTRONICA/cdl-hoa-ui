"use client";

import React, { useRef } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Upload as UploadIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormContext, Controller } from "react-hook-form";
import { PropertyDetailsData } from "../types";

interface Step1Props {
  initialData?: Partial<PropertyDetailsData>;
}

const Step1: React.FC<Step1Props> = ({ initialData }) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PropertyDetailsData>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Watch values for calculations
  const retention = watch("retention");
  const additionalRetention = watch("additionalRetention");

  // Calculate total retention when either value changes
  React.useEffect(() => {
    const retentionNum = parseFloat(retention) || 0;
    const additionalRetentionNum = parseFloat(additionalRetention) || 0;
    const total = retentionNum + additionalRetentionNum;
    setValue("totalRetention", total.toFixed(2));
  }, [retention, additionalRetention, setValue]);

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
  const propertyStatusOptions = [
    "Active",
    "Cancelled",
    "Conditional Active",
    "Closed",
    "Completed",
    "Freeze",
    "Under cancellation",
    "Converted to corporate",
    "Transferred",
  ];

  const currencyStatusOptions = [
    "AED - UAE Dirham",
    "USD - US Dollar",
    "EUR - Euro",
    "INR - Indian Rupee",
    "GBP - British Pound",
    "SAR - Saudi Riyal",
    "QAR - Qatari Riyal",
  ];
  const accountStatusOptions = ["Active", "Close", "Freeze", "Transfer"];

  // Watch the selected status
  const selectedStatus = watch("propertyAccountStatus");

  // Example: Logic to check payment/deposit stop condition
  const stopPayments = ["Close", "Freeze", "Transfer"].includes(selectedStatus);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card
        sx={{
          boxShadow: "none",
          backgroundColor: "#FFFFFFBF",
          width: "84%",
          margin: "0 auto",
        }}
      >
        <CardContent>
          <Grid container rowSpacing={4} columnSpacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="propertyId"
                control={control}
                defaultValue={initialData?.propertyId || "PMOJ7102"}
                disabled
                rules={{
                  required: "Property  id  is required",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Property  ID*"
                    error={!!errors.propertyId}
                    helperText={errors.propertyId?.message}
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={
                      errors.propertyId ? errorFieldStyles : commonFieldStyles
                    }
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="propertyReraOrDifcNumber"
                control={control}
                defaultValue={
                  initialData?.propertyReraOrDifcNumber || "12345677"
                }
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Property Reranumber (HOA)*"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="typeOfEscrow"
                control={control}
                defaultValue={initialData?.typeOfEscrow || ""}
                rules={{ required: " Type  oOf  Escrow is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.typeOfEscrow}>
                    <InputLabel sx={labelSx}>Type Of Escrow *</InputLabel>
                    <Select
                      {...field}
                      label="Type Of Escrow*"
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{ ...selectStyles, ...valueSx }}
                    >
                      <MenuItem value="management1">
                        Common Area Escrow
                      </MenuItem>
                      <MenuItem value="management2">
                        Body Corporate Escrow
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="propertyAccountCifBank"
                control={control}
                defaultValue={initialData?.propertyAccountCifBank || ""}
                rules={{ required: "Property Account Cif Bank" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Property Account Cif Bank"
                    error={!!errors.propertyAccountCifBank}
                    helperText={errors.propertyAccountCifBank?.message}
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={
                      errors.propertyAccountCifBank
                        ? errorFieldStyles
                        : commonFieldStyles
                    }
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="propertyName"
                control={control}
                defaultValue={initialData?.propertyName || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Property Name"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="accountType"
                control={control}
                defaultValue={initialData?.accountType || ""}
                rules={{ required: "Account Type is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.accountType}>
                    <InputLabel sx={labelSx}>Account Type*</InputLabel>
                    <Select
                      {...field}
                      label="Type Of Escrow*"
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{ ...selectStyles, ...valueSx }}
                    >
                      <MenuItem value="management1">
                        {" "}
                        Dubai-Conventional
                      </MenuItem>
                      <MenuItem value="management2">
                        Body Corporate Escrow
                      </MenuItem>
                      <MenuItem value="management2">
                        Abu Dhabi- Conventional
                      </MenuItem>

                      <MenuItem value="management2">RAK</MenuItem>

                      <MenuItem value="management2">Ajman</MenuItem>

                      <MenuItem value="management2">
                        Abu Dhabi- Islamic
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="propertyType"
                control={control}
                defaultValue={initialData?.propertyType || ""}
                rules={{ required: "property Type is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.propertyType}>
                    <InputLabel sx={labelSx}>Account Type*</InputLabel>
                    <Select
                      {...field}
                      label="Type Of Escrow*"
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{ ...selectStyles, ...valueSx }}
                    >
                      <MenuItem value="management1"> Office</MenuItem>
                      <MenuItem value="management2">Residential</MenuItem>
                      <MenuItem value="management2">Commercial</MenuItem>
                      <MenuItem value="management2">Retail</MenuItem>
                      <MenuItem value="management2">Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="propertyLocation"
                control={control}
                defaultValue={initialData?.propertyLocation || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Property Location"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="companyNumber"
                control={control}
                defaultValue={initialData?.companyNumber || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="companyNumber"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="companyName"
                control={control}
                defaultValue={initialData?.companyName || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="companyName"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="propertyGroupId"
                control={control}
                defaultValue={initialData?.propertyGroupId || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Property GroupId"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="projectName"
                control={control}
                defaultValue={initialData?.projectName || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Property Name"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="projectNameArabic"
                control={control}
                defaultValue={initialData?.projectNameArabic || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Project Name Arabic"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="masterCommunityName"
                control={control}
                defaultValue={initialData?.masterCommunityName || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Master Community Name"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="masterCommunityNameArabic"
                control={control}
                defaultValue={initialData?.masterCommunityNameArabic || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Master Community Name Arabic"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="developerOrManagementCompanyId"
                control={control}
                defaultValue={initialData?.developerOrManagementCompanyId || ""}
                rules={{ required: "property Type is required" }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={!!errors.developerOrManagementCompanyId}
                  >
                    <InputLabel sx={labelSx}>
                      Developer Or Management CompanyId*
                    </InputLabel>
                    <Select
                      {...field}
                      label="Type Of Escrow*"
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{ ...selectStyles, ...valueSx }}
                    >
                      <MenuItem value="management1">
                        {" "}
                        Developer/Management{" "}
                      </MenuItem>
                      <MenuItem value="management2">
                        Company ID and name{" "}
                      </MenuItem>
                      <MenuItem value="management2">Commercial</MenuItem>

                      <MenuItem value="management2">concatenated</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="developerOrManagementCompanyName"
                control={control}
                defaultValue={
                  initialData?.developerOrManagementCompanyName || ""
                }
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Developer Or Management CompanyName"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="masterDeveloperName"
                control={control}
                defaultValue={initialData?.masterDeveloperName || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Master Developer Name"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="propertyStatus"
                control={control}
                defaultValue={initialData?.propertyStatus || ""}
                rules={{ required: "property Status Type is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.propertyStatus}>
                    <InputLabel sx={labelSx}>Property Status*</InputLabel>
                    <Select
                      {...field}
                      label="Property Status*"
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{ ...selectStyles, ...valueSx }}
                    >
                      {propertyStatusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="propertyAccountStatus"
                control={control}
                defaultValue={initialData?.propertyAccountStatus || ""}
                rules={{ required: "property Status Type is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.propertyAccountStatus}>
                    <InputLabel sx={labelSx}>Property Status*</InputLabel>
                    <Select
                      {...field}
                      label="Property Account  Status*"
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{ ...selectStyles, ...valueSx }}
                    >
                      {accountStatusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              {stopPayments && (
                <p style={{ color: "red", marginTop: "8px" }}>
                  Payments and deposit allocation are stopped for this status.
                </p>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name={`propertyAccountStatusDate`}
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    label="Property Account StatusDate *"
                    onChange={field.onChange}
                    format="DD/MM/YYYY"
                    slots={{
                      openPickerIcon: StyledCalendarIcon,
                    }}
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

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name={`propertyRegistrationDate`}
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    label="Property Registration Date*"
                    onChange={field.onChange}
                    format="DD/MM/YYYY"
                    slots={{
                      openPickerIcon: StyledCalendarIcon,
                    }}
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

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name={`propertyStartDateEstimated`}
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    label="Property Start Date Estimated *"
                    onChange={field.onChange}
                    format="DD/MM/YYYY"
                    slots={{
                      openPickerIcon: StyledCalendarIcon,
                    }}
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

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name={`propertyCompletionDate`}
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    label="Property Completion Date *"
                    onChange={field.onChange}
                    format="DD/MM/YYYY"
                    slots={{
                      openPickerIcon: StyledCalendarIcon,
                    }}
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

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="reservePercentage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    label="Reserve Percentage"
                    InputLabelProps={{ sx: labelSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="additionalReservePercentage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    label="Additional Reserve Percentage"
                    InputLabelProps={{ sx: labelSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="totalReservePercentage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    label="Total Reserve Percentage"
                    InputLabelProps={{ sx: labelSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name={`reserveAccountEffectiveStartDate`}
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    label=" Reserve Account Effective Start Date*"
                    onChange={field.onChange}
                    format="DD/MM/YYYY"
                    slots={{
                      openPickerIcon: StyledCalendarIcon,
                    }}
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

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="currency"
                control={control}
                defaultValue={initialData?.currency || ""}
                rules={{ required: "Currency Type is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.currency}>
                    <InputLabel sx={labelSx}>Currency*</InputLabel>
                    <Select
                      {...field}
                      label="Property Status*"
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{ ...selectStyles, ...valueSx }}
                    >
                      {currencyStatusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="remarks"
                control={control}
                defaultValue={initialData?.remarks || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Remarks"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="specialApproval"
                control={control}
                defaultValue={initialData?.specialApproval || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Special Approval"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="rmName"
                control={control}
                defaultValue={initialData?.rmName || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="RmName"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="assistantRm"
                control={control}
                defaultValue={initialData?.assistantRm || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="assistantRm"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="paymentTypeToBeBlocked"
                control={control}
                defaultValue={initialData?.paymentTypeToBeBlocked || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Payment Type To BeBlocked"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="teamLeader"
                control={control}
                defaultValue={initialData?.teamLeader || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Team Leader"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="accountOwnerBackup"
                control={control}
                defaultValue={initialData?.accountOwnerBackup || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Account Owner Backup"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="accountOwner"
                control={control}
                defaultValue={initialData?.accountOwner || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Account Owner"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="emailNotificationsInternal"
                control={control}
                defaultValue={initialData?.emailNotificationsInternal || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Notiications Internal"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box mt={6}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={3}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "18px",
                  lineHeight: "28px", // Assuming "Title Large" line height
                  letterSpacing: "0.15px", // Conservative tracking
                  verticalAlign: "middle",
                }}
              >
                Project Documents
              </Typography>
              <Button
                variant="outlined"
                startIcon={<FileUploadOutlinedIcon />}
                onClick={handleUploadClick}
                sx={{
                  textTransform: "none",
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 500, // Medium
                  fontStyle: "normal",
                  fontSize: "14px", // text-sm
                  lineHeight: "20px", // from design token for text-sm
                  letterSpacing: "0px",
                }}
              >
                Upload Documents
              </Button>
            </Box>
            <input type="file" ref={fileInputRef} style={{ display: "none" }} />
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ fontFamily: "Outfit", fontWeight: "normal" }}
                    >
                      Document Name
                    </TableCell>
                    <TableCell
                      sx={{ fontFamily: "Outfit", fontWeight: "normal" }}
                    >
                      Upload Date
                    </TableCell>
                    <TableCell
                      sx={{ fontFamily: "Outfit", fontWeight: "normal" }}
                    >
                      Document Type
                    </TableCell>
                    <TableCell
                      sx={{ fontFamily: "Outfit", fontWeight: "normal" }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{ fontFamily: "Outfit", fontWeight: "normal" }}
                      colSpan={4}
                      align="center"
                    >
                      No documents uploaded
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default Step1;
