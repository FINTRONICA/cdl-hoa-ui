import React from "react";
import {
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Drawer,
  Box,
} from "@mui/material";
import { KeyboardArrowDown as KeyboardArrowDownIcon } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import dayjs from "dayjs";

interface RightSlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const RightSlideFeeDetailsPanel: React.FC<RightSlidePanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { control } = useForm();
  const feeCategories = [
    { value: "accountOpeningFees", label: "Account Opening Fees" },
    { value: "engineersFees", label: "Engineer's Fees" },
    { value: "unitCancellation", label: "Unit Cancellation" },
    { value: "accountClosure", label: "Account Closure" },
    { value: "accountTransfer", label: "Account Transfer" },
    {
      value: "accountMaintenanceCharges",
      label: "Account Maintenance Charges",
    },
    { value: "transactionCharges", label: "Transaction Charges" },
    { value: "unitModificationCharges", label: "Unit Modification Charges" },
    { value: "chequeReturn", label: "Cheque Return" },
    { value: "accountStatementCharge", label: "Account Statement Charge" },
    {
      value: "balanceConfirmationCharge",
      label: "Balance Confirmation Charge",
    },
    {
      value: "corporateCertificationEngineersFees",
      label: "Corporate Certification Engineer Fees",
    },
    { value: "anyAuditReport", label: "Any Audit Report" },
    { value: "anyCertificate", label: "Any Certificate" },
    { value: "otherServices", label: "Other Services (Not listed above)" },
    { value: "unitRegistrationFees", label: "Unit Registration Fees" },
    {
      value: "smartBusinessSubscription",
      label: "Smart Business Subscription",
    },
    { value: "courierPickupDocuments", label: "Courier Pickup for Documents" },
    {
      value: "onlineAccessViewingStatementOnly",
      label: "Online Access for Viewing Statement Only",
    },
    { value: "pdc", label: "PDC" },
  ];
  const frequencyOptions = [
    { value: "oneTime", label: "One time" },
    { value: "daily", label: "Daily" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "semiAnnually", label: "Semi-Annually" },
    { value: "annually", label: "Annually" },
    { value: "perRequest", label: "Per Request" },
  ];

  const debitAccountTypeOptions = [
    { value: "generalFundAccountNumber", label: "General Fund Account Number" },
    { value: "reserveFundAccountNumber", label: "Reserve Fund Account Number" },
    { value: "corporateAccountNumber", label: "Corporate Account Number" },
  ];

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: 460,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(15px)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Outfit, sans-serif",
            fontWeight: 500,
            fontStyle: "normal",
            fontSize: "20px",
            lineHeight: "28px",
            letterSpacing: "0.15px",
            verticalAlign: "middle",
          }}
        >
          Add Fee Details
          <IconButton onClick={onClose}>
            <CancelOutlinedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container rowSpacing={4} columnSpacing={2} mt={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="feeCategory"
                control={control}
                defaultValue="accountOpeningFees"
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel sx={labelSx}>Fee Category*</InputLabel>
                    <Select
                      {...field}
                      onBlur={field.onBlur}
                      label="Fee Category*"
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{ ...selectStyles, ...valueSx }}
                    >
                      {feeCategories.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="frequency *"
                control={control}
                defaultValue="oneTime"
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel sx={labelSx}>Frequency*</InputLabel>
                    <Select
                      {...field}
                      onBlur={field.onBlur}
                      label="Frequency*"
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{ ...selectStyles, ...valueSx }}
                    >
                      {frequencyOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="debitAccountType"
                control={control}
                defaultValue="generalFundAccountNumber"
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel sx={labelSx}>Debit Account Type*</InputLabel>
                    <Select
                      {...field}
                      onBlur={field.onBlur}
                      label="Debit Account Type*"
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{ ...selectStyles, ...valueSx }}
                    >
                      {debitAccountTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="feeCollectionDate"
                control={control}
                defaultValue={dayjs("2022-03-31")}
                render={({ field }) => (
                  <DatePicker
                    label="Fee Collection Date*"
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

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="nextRecoveryDate"
                control={control}
                defaultValue={dayjs("2022-03-31")}
                render={({ field }) => (
                  <DatePicker
                    label="Next Recovery Date"
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

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Corporate Tax"
                defaultValue="2%"
                InputLabelProps={{ sx: labelSx }}
                InputProps={{ sx: valueSx }}
                sx={commonFieldStyles}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Debit Account Number"
                defaultValue="50203040"
                InputLabelProps={{ sx: labelSx }}
                InputProps={{ sx: valueSx }}
                sx={commonFieldStyles}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="VAT Percentage"
                defaultValue="18%"
                InputLabelProps={{ sx: labelSx }}
                InputProps={{ sx: valueSx }}
                sx={commonFieldStyles}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Amount"
                defaultValue="50,000"
                InputLabelProps={{ sx: labelSx }}
                InputProps={{ sx: valueSx }}
                sx={commonFieldStyles}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 2,
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Button
                fullWidth
                variant="outlined"
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
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "20px",
                  letterSpacing: 0,
                }}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </LocalizationProvider>
  );
};
