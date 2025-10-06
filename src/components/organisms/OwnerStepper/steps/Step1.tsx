import React, { useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  Upload as UploadIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Controller, useForm, useFormContext } from "react-hook-form";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Step1 = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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

  const renderTextField = (name: string, label: string, defaultValue = "") => (
    <Grid key={name} size={{ xs: 12, md: 6 }}>
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
            {renderTextField("investorNameEnglish", "Investor Name (English)")}
            {renderTextField("investorNameArabic", "Investor Name (Arabic)")}
            {renderTextField("ownershipPercentage", "Ownership Percentage")}
            {renderSelectField(
              "investorIdType",
              "Investor ID Type",
              ["Passport", "Emirates ID", "Trade License"],
              "Passport"
            )}

            {renderTextField("reservePercentage", "Reserve Percentage")}

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="idExpiryDate"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    label="ID Expiry Date"
                    value={field.value}
                    onChange={field.onChange}
                    format="DD/MM/YYYY"
                    slots={{
                      openPickerIcon: StyledCalendarIcon,
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.idExpiryDate,
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
            {renderTextField("idNumber", "ID Number")}
            {renderTextField("investorUnitMollakId", "Investor/Unit Mollak ID")}
            {renderTextField("investorContactNo", "Investor Contact No")}
            {renderSelectField(
              "investorType",
              "Investor Type",
              ["Joint", "Company", "Individual"],
              "Individual"
            )}
            {renderSelectField(
              "nationality",
              "Nationality",
              ["Saudi Arabia", "UAE", "Other"],
              "Saudi Arabia"
            )}
            {renderTextField("investorEmailAddress", "Investor Email Address")}
            {renderTextField("floor", "Floor")}
            {renderTextField("noOfBedroom", "No of Bedroom")}

            {/* Joint Owner 2 */}
            {renderTextField("jointOwner2Name", "Joint Owner 2 Name")}
            {renderSelectField(
              "nationalityJointOwner2",
              "Nationality of Joint Owner 2",
              ["Saudi Arabia", "UAE", "Other"],
              "Saudi Arabia"
            )}
            {renderTextField("idNoJointOwner2", "ID NO of Joint Owner 2")}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="idExpiryDateJointOwner2"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    label="Id Expiry Date JointOwner2"
                    value={field.value}
                    onChange={field.onChange}
                    format="DD/MM/YYYY"
                    slots={{
                      openPickerIcon: StyledCalendarIcon,
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.idExpiryDate,
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

            {/* Joint Owner 3 */}
            {renderTextField("jointOwner3Name", "Joint Owner 3 Name")}
            {renderSelectField(
              "nationalityJointOwner3",
              "Nationality of Joint Owner 3",
              ["Saudi Arabia", "UAE", "Other"],
              "Saudi Arabia"
            )}
            {renderTextField("idNoJointOwner3", "ID NO of Joint Owner 3")}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="idExpiryDateJointOwner3"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    label="Id Expiry Date JointOwner3"
                    value={field.value}
                    onChange={field.onChange}
                    format="DD/MM/YYYY"
                    slots={{
                      openPickerIcon: StyledCalendarIcon,
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.idExpiryDate,
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

            {/* Joint Owner 4 */}
            {renderTextField("jointOwner4Name", "Joint Owner 4 Name")}
            {renderSelectField(
              "nationalityJointOwner4",
              "Nationality of Joint Owner 4",
              ["Saudi Arabia", "UAE", "Other"],
              "Saudi Arabia"
            )}
            {renderTextField("idNoJointOwner4", "ID NO of Joint Owner 4")}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="idExpiryDateJointOwner4"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    label="Id Expiry Date JointOwner 4"
                    value={field.value}
                    onChange={field.onChange}
                    format="DD/MM/YYYY"
                    slots={{
                      openPickerIcon: StyledCalendarIcon,
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.idExpiryDate,
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

            {/* Joint Owner 5 */}
            {renderTextField("jointOwner5Name", "Joint Owner 5 Name")}
            {renderSelectField(
              "nationalityJointOwner5",
              "Nationality of Joint Owner 5",
              ["Saudi Arabia", "UAE", "Other"],
              "Saudi Arabia"
            )}
            {renderTextField("idNoJointOwner5", "ID NO of Joint Owner 5")}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="idExpiryDateJointOwner5"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    label="Id Expiry Date JointOwner 5"
                    value={field.value}
                    onChange={field.onChange}
                    format="DD/MM/YYYY"
                    slots={{
                      openPickerIcon: StyledCalendarIcon,
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.idExpiryDate,
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

export default Step1;
