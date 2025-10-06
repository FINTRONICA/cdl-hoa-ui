"use client";

import { useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  InputAdornment,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import {
  Upload as UploadIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { Controller, useFormContext } from "react-hook-form";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Step2 = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const renderTextField = (
    name: string,
    label: string,
    defaultValue = "",
    gridMd = 6
  ) => (
    <Grid size={{ xs: 12, md: gridMd }}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <TextField
            {...field}
            label={label}
            fullWidth
            InputLabelProps={{ sx: labelSx }}
            InputProps={{ sx: valueSx }}
            sx={commonFieldStyles}
          />
        )}
      />
    </Grid>
  );
  const renderRadioField = (
    name: string,
    label: string,
    options: string[],
    defaultVal: string = "",
    gridMd = 6
  ) => (
    <Grid size={{ xs: 12, md: gridMd }}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultVal}
        render={({ field }) => (
          <FormControl component="fieldset">
            <FormLabel component="legend">{label}</FormLabel>
            <RadioGroup
              row
              {...field}
              onChange={(e) => field.onChange(e.target.value)}
            >
              {options.map((opt) => (
                <FormControlLabel
                  key={opt}
                  value={opt}
                  control={<Radio />}
                  label={opt}
                />
              ))}
            </RadioGroup>
          </FormControl>
        )}
      />
    </Grid>
  );

  const renderSelectField = (
    name: string,
    label: string,
    options: string[],
    defaultVal: string = "Open",
    gridMd = 6
  ) => (
    <Grid size={{ xs: 12, md: gridMd }}>
      <Controller
        name={name}
        control={control}
        rules={{ required: `${label} is required` }}
        defaultValue={defaultVal}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel sx={labelSx}>{label}</InputLabel>
            <Select
              {...field}
              label={label}
              sx={{ ...selectStyles, ...valueSx }}
              IconComponent={KeyboardArrowDownIcon}
            >
              {options.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>

            {field.value === "Others" && (
              <TextField
                label="Please specify"
                fullWidth
                sx={{ mt: 2 }}
                onChange={(e) => {
                  console.log("Other value:", e.target.value);
                }}
              />
            )}
          </FormControl>
        )}
      />
    </Grid>
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
            {renderTextField(
              "projectNameDropdown",
              "Project Name*",
              "Pro Extention New test",
              6
            )}
            {renderTextField("projectId", "Project ID*", "PROJ1761", 6)}
            {renderTextField(
              "managementCompanyDeveloperId",
              "Management Company DeveloperId",
              "51283456",
              6
            )}
            {renderTextField(
              "managementCompanyDeveloperName",
              "Management Company Developer Name",
              "51283456",
              6
            )}
            {renderTextField(
              "unitReferenceNumber",
              "Unit Reference Number",
              "53456",
              6
            )}
            {renderTextField("unitNo", "Unit NO", "53433356", 6)}
            {renderSelectField(
              "PropertyID",
              "Unit Status",
              [
                "Open",
                "Transfer",
                "Cancel",
                "Transfer Joint",
                "Cancellation under process",
                "Others",
              ],
              "Open"
            )}
            {renderTextField(
              "Tower/Building Name",
              "Tower/BuildingName*",
              "Green Group",
              6
            )}
            {renderTextField("Unit/Plot size", "Unit/Plot size", "", 6)}
            {renderSelectField(
              "propertyIdValue",
              "property Id Value",
              ["Land", "Villa", "Unit"],
              "Land"
            )}

            {renderTextField("unitIban", "Unit IBAN", "53433356", 6)}
            {renderTextField("nameOfAgent", "Name Of Agent", "", 6)}
            {renderTextField("agentNationalId", "Agent National Id", "", 6)}
            {renderTextField("grossSalePrice", "Gross Sale Price", "", 6)}
            {renderTextField("salePrice", "Sale Price", "", 6)}
            {renderTextField("vatApplicable", "VAT Applicable", "", 6)}
            {renderTextField("deedNo", "Deed No", "", 6)}
            {renderTextField(
              "agreementNoContractNo",
              "Agreement No Contract No",
              "",
              6
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="agreementDate"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    label="Agreementc Date"
                    value={field.value}
                    onChange={field.onChange}
                    format="DD/MM/YYYY"
                    slots={{
                      openPickerIcon: StyledCalendarIcon,
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.agreementDates,
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

            {renderTextField(
              "amountPaidToDeveloperGeneralFundEscrow",
              "Amount Paid To Developer General Fund Escrow",
              "",
              6
            )}
            {renderTextField(
              "amountPaidToDeveloperOtherFundEscrow",
              "Amount Paid To Developer Other Fund Escrow",
              "",
              6
            )}
            {renderTextField("totalAmountPaid", "Total Amount Paid", "", 6)}
            {renderTextField("unitAreaSize", "Unit Area Size", "", 6)}

            {renderTextField("remarks", "Remarks", "afa", 6)}
            {renderRadioField(
              "worldCheck",
              "World Check",
              ["Yes", "No"],
              "Yes"
            )}
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
                Investors Documents
              </Typography>
              <Button
                variant="outlined"
                startIcon={<FileUploadOutlinedIcon />}
                onClick={() => {
                  fileInputRef.current?.click();
                }}
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
                    <TableCell>Document Name</TableCell>
                    <TableCell>Upload Date</TableCell>
                    <TableCell>Document Type</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} align="center">
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

export default Step2;
