import React, { useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
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
  FormLabel,
  Radio,
  RadioGroup,
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

  const renderTextField = (
    name: string,
    label: string,
    gridSize = 6,
    defaultValue = ""
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
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

  const renderDatePickerField = (
    name: string,
    label: string,
    gridSize: number = 6
  ) => (
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
            slots={{
              openPickerIcon: StyledCalendarIcon,
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors[name],
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

  const renderTextFieldWithButton = (
    name: string,
    label: string,
    buttonText: string,
    gridSize: number = 6
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label={label}
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
                    onClick={() => {}}
                  >
                    {buttonText}
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
  );

  const renderCheckboxField = (
    name: string,
    label?: string,
    gridSize: number = 6
  ) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={!!field.value}
                sx={{
                  color: "#CAD5E2",
                  "&.Mui-checked": {
                    color: "#2563EB",
                  },
                }}
              />
            }
            label={
              label ??
              name
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())
            }
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
            {renderTextField("chargeTypeId", "Charge Type ID*")}
            {renderTextField("chargeType", "Charge Type*")}
            {renderTextField("groupName", "Group Name*")}
            {renderTextField("categoryCode", "Category Code*")}
            {renderTextField("categoryName", "Category Name*")}
            {renderTextField("categorySubCode", "Category Sub Code*")}
            {renderTextField("categorySubName", "Category Sub Name*")}
            {renderTextField("serviceName", "Service Name*")}
            {renderTextField("serviceCode", "Service Code*")}
            {renderTextField(
              "provisionalBudgetCode",
              "Provisional Budget Code*"
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
                Payment Documents
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
