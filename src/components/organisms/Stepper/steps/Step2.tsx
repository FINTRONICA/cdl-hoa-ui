"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Button,
  Divider,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Upload as UploadIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AccountData } from "../types";
import { Controller, useFormContext } from "react-hook-form";

interface Step2Props {
  accounts: AccountData[];
  onAccountsChange: (accounts: AccountData[]) => void;
}

const accountLabels = [
  "General Fund Account Number*",
  "Reserve Fund Account Number*",
  "Corporate Account Number",
];

const Step2: React.FC<Step2Props> = ({ accounts, onAccountsChange }) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<{ accounts: AccountData[] }>();

  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const [successIndex, setSuccessIndex] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "error"
  );

  const handleAccountChange = (
    index: number,
    field: keyof AccountData,
    value: any
  ) => {
    const updatedAccounts = [...accounts];
    updatedAccounts[index] = {
      ...updatedAccounts[index],
      [field]: value,
    } as AccountData;
    onAccountsChange(updatedAccounts);
  };

  const validateAccount = (account: AccountData, index: number) => {
    if (
      !account.trustAccountNumber ||
      !account.ibanNumber ||
      !account.dateOpened ||
      !account.accountTitle ||
      !account.isInterestBearing
    ) {
      setErrorIndex(index);
      setSuccessIndex(null);
      setSnackbarMessage("Some account details are incorrect");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return false;
    }
    setErrorIndex(null);
    setSuccessIndex(index);
    setSnackbarMessage("Account details are validated");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    return true;
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
          {accountLabels.map((label, index) => {
            return (
              <Box key={index} mb={4}>
                <Grid container spacing={3}>
                  {/* Trust Account Number */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name={`accounts.${index}.trustAccountNumber`}
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

                  {/* IBAN Number */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name={`accounts.${index}.ibanNumber`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="IBAN Number*"
                          InputLabelProps={{ sx: labelSx }}
                          InputProps={{ sx: valueSx }}
                          sx={commonFieldStyles}
                        />
                      )}
                    />
                  </Grid>

                  {/* Date Opened */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Controller
                      name={`accounts.${index}.dateOpened`}
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <DatePicker
                          label="Date Opened*"
                          value={field.value}
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

                  {/* Account Title */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Controller
                      name={`accounts.${index}.accountTitle`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Account Title*"
                          InputLabelProps={{ sx: labelSx }}
                          InputProps={{ sx: valueSx }}
                          sx={commonFieldStyles}
                        />
                      )}
                    />
                  </Grid>

                  {/* isInterestBearing + Validate */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box display="flex" alignItems="center">
                      <Controller
                        name={`accounts.${index}.isInterestBearing`}
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                checked={!!field.value} // ensure boolean
                                onChange={(e) =>
                                  field.onChange(e.target.checked)
                                }
                              />
                            }
                            label="Interest Bearing"
                          />
                        )}
                      />
                      <Button
                        variant="contained"
                        startIcon={
                          errorIndex === index ? (
                            <HighlightOffOutlinedIcon
                              sx={{ fontSize: 20, mt: "1px" }}
                            />
                          ) : successIndex === index ? (
                            <VerifiedOutlinedIcon
                              sx={{ fontSize: 20, mt: "1px" }}
                            />
                          ) : null
                        }
                        sx={{
                          ml: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "8px",
                          textTransform: "none",
                          boxShadow: "none",

                          fontFamily: "Outfit, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "20px",
                          letterSpacing: "0px",

                          backgroundColor:
                            errorIndex === index
                              ? "#FEE2E2"
                              : successIndex === index
                                ? "#D1FAE5"
                                : "#E6F0FF",
                          color:
                            errorIndex === index
                              ? "#EF4444"
                              : successIndex === index
                                ? "#059669"
                                : "#2563EB",
                          minWidth: "120px",
                          height: "40px",
                          "& .MuiButton-startIcon": {
                            marginRight: "8px",
                          },
                          "&:hover": {
                            backgroundColor:
                              errorIndex === index
                                ? "#FECACA"
                                : successIndex === index
                                  ? "#A7F3D0"
                                  : "#D0E3FF",
                          },
                        }}
                        onClick={() =>
                          validateAccount(watch(`accounts.${index}`), index)
                        }
                      >
                        {errorIndex === index
                          ? "Invalidate"
                          : successIndex === index
                            ? "Validated"
                            : "Validate"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>

                {index < accountLabels.length - 1 && (
                  <Divider sx={{ my: 3, mt: 4, mb: 4 }} />
                )}
              </Box>
            );
          })}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%", fontFamily: "Outfit, sans-serif" }}
          iconMapping={{
            success: <span style={{ fontSize: "1.2rem" }}>✅</span>,
            error: <span style={{ fontSize: "1.2rem" }}>❌</span>,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default Step2;
