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
import { PropertyManagementData } from "../propertyManagementType";

interface Step1Props {
  initialData?: Partial<PropertyManagementData>;
}

const Step1: React.FC<Step1Props> = ({ initialData }) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PropertyManagementData>();
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
                name="propertyManagement"
                control={control}
                defaultValue={initialData?.propertyManagement || "PMOJ7102"}
                disabled
                rules={{
                  required: "Property management id  is required",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Property Management ID*"
                    error={!!errors.propertyManagement}
                    helperText={errors.propertyManagement?.message}
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={
                      errors.propertyManagement
                        ? errorFieldStyles
                        : commonFieldStyles
                    }
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="companyId"
                control={control}
                defaultValue={initialData?.companyId || "12345677"}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="CompanyId (HOA)*"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            {/* <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="clientOrRegulatory"
                control={control}
                defaultValue={initialData?.clientOrRegulatory || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Client Or Regulatory"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid> */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="companyName"
                control={control}
                defaultValue={initialData?.companyName || ""}
                rules={{ required: "Company Name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Company Name*"
                    error={!!errors.companyName}
                    helperText={errors.companyName?.message}
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={
                      errors.companyName ? errorFieldStyles : commonFieldStyles
                    }
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
                    label=" Company Number"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="project"
                control={control}
                defaultValue={initialData?.project || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Project"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="masterDeveloper"
                control={control}
                defaultValue={initialData?.masterDeveloper || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Master Developer"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="masterCommunity"
                control={control}
                defaultValue={initialData?.masterCommunity || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Master Community"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="cifId"
                control={control}
                defaultValue={initialData?.cifId || ""}
                rules={{ required: "Project Location is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Cif Id*"
                    error={!!errors.cifId}
                    helperText={errors.cifId?.message}
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={errors.cifId ? errorFieldStyles : commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="managementType"
                control={control}
                defaultValue={initialData?.managementType || ""}
                rules={{ required: "Management Type is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.managementType}>
                    <InputLabel sx={labelSx}>Management Type*</InputLabel>
                    <Select
                      {...field}
                      label="Management Type*"
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{ ...selectStyles, ...valueSx }}
                    >
                      <MenuItem value="management1">Management 1</MenuItem>
                      <MenuItem value="management2">Management 2</MenuItem>
                      <MenuItem value="management3">Management 3</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="companyNameArabic"
                control={control}
                defaultValue={initialData?.companyNameArabic || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Company Name Arabic"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            {/* {watch("managementType") === "Management Company" && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="companyNameArabic"
                  control={control}
                  defaultValue={initialData?.companyNameArabic || ""}
                  rules={{
                    maxLength: {
                      value: 50,
                      message: "Maximum 50 characters allowed",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Company Name (Arabic)"
                      InputLabelProps={{ sx: labelSx }}
                      InputProps={{ sx: valueSx }}
                      sx={commonFieldStyles}
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </Grid>
              )} */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="tradeLicenseNumber"
                control={control}
                defaultValue={initialData?.tradeLicenseNumber || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Trade License Number"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name={`tradeLicenseExpiry`}
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    label="Trade License Expiry*"
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
                name="account1Mobile"
                control={control}
                defaultValue={initialData?.account1Mobile || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 1 Mobile"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account1Tel"
                control={control}
                defaultValue={initialData?.account1Tel || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 1 Tel"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account1Fax"
                control={control}
                defaultValue={initialData?.account1Fax || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 1 Fax"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account1Email"
                control={control}
                defaultValue={initialData?.account1Email || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 1 Email"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account2Name"
                control={control}
                defaultValue={initialData?.account2Name || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 2 Name"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account2Tel"
                control={control}
                defaultValue={initialData?.account2Tel || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 2 Tel"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account2Mobile"
                control={control}
                defaultValue={initialData?.account2Mobile || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" account 2 Mobile"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account2Email"
                control={control}
                defaultValue={initialData?.account2Email || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 2 Email"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account3Name"
                control={control}
                defaultValue={initialData?.account3Name || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 3 Name"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account3Tel"
                control={control}
                defaultValue={initialData?.account3Tel || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 3 Tel"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account3Mobile"
                control={control}
                defaultValue={initialData?.account3Mobile || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 3 Mobile"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account3Email"
                control={control}
                defaultValue={initialData?.account3Email || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 3 Email"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account4Name"
                control={control}
                defaultValue={initialData?.account4Name || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 4 Name"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account4Tel"
                control={control}
                defaultValue={initialData?.account4Tel || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 4 Tel"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account4Mobile"
                control={control}
                defaultValue={initialData?.account4Mobile || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 4 Mobile"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account4Email"
                control={control}
                defaultValue={initialData?.account4Email || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 4 Email"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account5Name"
                control={control}
                defaultValue={initialData?.account5Name || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 5 Name"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account5Tel"
                control={control}
                defaultValue={initialData?.account5Tel || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 5 Tel"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account5Mobile"
                control={control}
                defaultValue={initialData?.account5Mobile || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 5 Mobile"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="account5Email"
                control={control}
                defaultValue={initialData?.account5Email || ""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label=" Account 5 Email"
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
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
                name="migratedData"
                control={control}
                defaultValue={
                  initialData?.migratedData ? initialData?.migratedData : false
                }
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={!!field.value} // ensure boolean
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Migrated Data"
                  />
                )}
              />

              <Controller
                name="notification"
                control={control}
                defaultValue={
                  initialData?.notification ? initialData?.notification : false
                }
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={!!field.value} // ensure boolean
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Notification"
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
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => {
                // You can handle the file here if needed
                // e.target.files[0]
              }}
            />
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
