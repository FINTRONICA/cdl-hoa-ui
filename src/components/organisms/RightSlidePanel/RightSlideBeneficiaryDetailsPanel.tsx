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
  InputAdornment,
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

export const RightSlideBeneficiaryDetailsPanel: React.FC<
  RightSlidePanelProps
> = ({ isOpen, onClose }) => {
  const { control } = useForm();
  const locations = [
    { value: "Abu Dhabi", label: "Abu Dhabi" },
    { value: "Dubai", label: "Dubai" },
    { value: "Sharjah", label: "Sharjah" },
    { value: "Ajman", label: "Ajman" },
    { value: "Umm Al Quwain", label: "Umm Al Quwain" },
    { value: "Ras Al Khaimah", label: "Ras Al Khaimah" },
    { value: "Fujairah", label: "Fujairah" },
    { value: "Freezone", label: "Freezone" },
  ];
  const transferTypes = [
    { value: "TR", label: "TR (Transfer)" },
    { value: "TT", label: "TT (Telegraphic Transfer)" },
    { value: "MC", label: "MC (Manager's Cheque)" },
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

  // const errorFieldStyles = {
  //   "& .MuiOutlinedInput-root": {
  //     height: "46px",
  //     borderRadius: "8px",
  //     "& fieldset": {
  //       borderColor: "red",
  //       borderWidth: "1px",
  //     },
  //   },
  // };

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

  const StyledCalendarIcon = (props:  any) => (
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
          Add Beneficiary Details
          <IconButton onClick={onClose}>
            <CancelOutlinedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container rowSpacing={4} columnSpacing={2} mt={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="Place Of Issue*"
                control={control}
                defaultValue={"Abu Dhabi"}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel sx={labelSx}>Place Of Issue*</InputLabel>
                    <Select
                      {...field}
                      label="Place Of Issue*"
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{ ...selectStyles, ...valueSx }}
                    >
                      {locations.map((location) => (
                        <MenuItem key={location.value} value={location.value}>
                          {location.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="Transfer Type*"
                control={control}
                defaultValue={"TR"}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel sx={labelSx}>Transfer Type*</InputLabel>
                    <Select
                      {...field}
                      label="Transfer Type*"
                      IconComponent={KeyboardArrowDownIcon}
                      sx={{ ...selectStyles, ...valueSx }}
                    >
                      {transferTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="ID*"
                defaultValue="1234"
                InputLabelProps={{ sx: labelSx }}
                InputProps={{ sx: valueSx }}
                sx={commonFieldStyles}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Name*"
                defaultValue={null}
                InputLabelProps={{ sx: labelSx }}
                InputProps={{ sx: valueSx }}
                sx={commonFieldStyles}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Bank Name*"
                defaultValue="SBI"
                InputLabelProps={{ sx: labelSx }}
                InputProps={{ sx: valueSx }}
                sx={commonFieldStyles}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Routing Code"
                defaultValue={null}
                InputLabelProps={{ sx: labelSx }}
                InputProps={{ sx: valueSx }}
                sx={commonFieldStyles}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Trade License Number"
                defaultValue="50203040"
                InputLabelProps={{ sx: labelSx }}
                InputProps={{ sx: valueSx }}
                sx={commonFieldStyles}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="tradeLicenseExpiry"
                control={control}
                defaultValue={dayjs("2022-03-31")}
                render={({ field }) => (
                  <DatePicker
                    label="Trade License Expiry"
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
            <Grid size={{ xs: 12 }}>
              <Controller
                name="beneficiaryAccountIBAN"
                control={control}
                defaultValue={""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Beneficiary Account IBAN*"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="contained"
                            sx={{
                              color: "#2563EB",
                              borderRadius: "24px",
                              textTransform: "none",
                              background: "var(--UIColors-Blue-100, #DBEAFE)",

                              boxShadow: "none",
                              "&:hover": {
                                background: "#D0E3FF",
                                boxShadow: "none",
                              },
                              minWidth: "120px",
                              height: "36px",

                              fontFamily: "Outfit, sans-serif",
                              fontWeight: 500,
                              fontStyle: "normal",
                              fontSize: "14px",
                              lineHeight: "24px",
                              letterSpacing: "0.5px",
                              verticalAlign: "middle",
                            }}
                            onClick={() => {
                              // Add your fetch logic here
                            }}
                          >
                            Validate Account
                          </Button>
                        </InputAdornment>
                      ),
                      sx: valueSx,
                    }}
                    InputLabelProps={{ sx: labelSx }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="beneficiarySwift"
                control={control}
                defaultValue={""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Beneficiary Swift*"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="contained"
                            sx={{
                              color: "#2563EB",
                              borderRadius: "24px",
                              textTransform: "none",
                              background: "var(--UIColors-Blue-100, #DBEAFE)",

                              boxShadow: "none",
                              "&:hover": {
                                background: "#D0E3FF",
                                boxShadow: "none",
                              },
                              minWidth: "120px",
                              height: "36px",

                              fontFamily: "Outfit, sans-serif",
                              fontWeight: 500,
                              fontStyle: "normal",
                              fontSize: "14px",
                              lineHeight: "24px",
                              letterSpacing: "0.5px",
                              verticalAlign: "middle",
                            }}
                            onClick={() => {
                              // Add your fetch logic here
                            }}
                          >
                            Validate BIC
                          </Button>
                        </InputAdornment>
                      ),
                      sx: valueSx,
                    }}
                    InputLabelProps={{ sx: labelSx }}
                    sx={commonFieldStyles}
                  />
                )}
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
