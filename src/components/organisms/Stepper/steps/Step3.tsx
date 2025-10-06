"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FeeData } from "../types";
import { RightSlideFeeDetailsPanel } from "../../RightSlidePanel/RightSlideFeeDetailsPanel";

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

interface Step3Props {
  fees: FeeData[];
  onFeesChange: (fees: FeeData[]) => void;
}

const Step3: React.FC<Step3Props> = ({ fees, onFeesChange }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const handleFeeChange = (index: number, field: keyof FeeData, value: any) => {
    const updatedFees = [...fees];
    updatedFees[index] = { ...updatedFees[index], [field]: value } as FeeData;
    onFeesChange(updatedFees);
  };

  const addFee = () => {
    setIsPanelOpen(true);
    // onFeesChange([
    //   ...fees,
    //   {
    //     feeType: '',
    //     frequency: '',
    //     debitAmount: '',
    //     feeToBeCollected: '',
    //     nextRecoveryDate: null,
    //     feePercentage: '',
    //     amount: '',
    //     vatPercentage: '',
    //   },
    // ])
  };

  const deleteFee = (index: number) => {
    const updatedFees = fees.filter((_, i) => i !== index);
    onFeesChange(updatedFees);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedReport(null);
  };

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
          <Box display="flex" justifyContent="end" alignItems="center" mb={4}>
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              onClick={addFee}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                boxShadow: "none",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0.5px",
                verticalAlign: "middle",
              }}
            >
              Add Fee
            </Button>
          </Box>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: "none", borderRadius: "8px" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>fee Category</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell>Debit Account Type</TableCell>
                  <TableCell>Debit Account Number</TableCell>
                  
                  <TableCell>Fee Collection Date</TableCell>
                  <TableCell>Next Recovery Date</TableCell>
                  <TableCell>CorporateTax</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>VAT Percentage</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fees.map((fee, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        size="small"
                        value={fee.feeCategory}
                        onChange={(e) =>
                          handleFeeChange(index, "feeCategory", e.target.value)
                        }
                        InputLabelProps={{ sx: labelSx }}
                        InputProps={{ sx: valueSx }}
                        sx={commonFieldStyles}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={fee.frequency}
                        onChange={(e) =>
                          handleFeeChange(index, "frequency", e.target.value)
                        }
                        InputLabelProps={{ sx: labelSx }}
                        InputProps={{ sx: valueSx }}
                        sx={commonFieldStyles}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={fee.debitAccountType}
                        onChange={(e) =>
                          handleFeeChange(
                            index,
                            "debitAccountType",
                            e.target.value
                          )
                        }
                        InputLabelProps={{ sx: labelSx }}
                        InputProps={{ sx: valueSx }}
                        sx={commonFieldStyles}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={fee.debitAccountNumber}
                        onChange={(e) =>
                          handleFeeChange(
                            index,
                            "debitAccountNumber",
                            e.target.value
                          )
                        }
                        InputLabelProps={{ sx: labelSx }}
                        InputProps={{ sx: valueSx }}
                        sx={commonFieldStyles}
                      />
                    </TableCell>
                    <TableCell>
                      {/* <TableCell>
                        <DatePicker
                        value={fee.feeCollectionDate}
                        onChange={(newValue) => handleFeeChange(index, 'feeCollectionDate', newValue)}
                        slotProps={{ 
                          textField: { 
                            size: 'small', 
                            sx: datePickerStyles, 
                            InputLabelProps: { sx: labelSx },
                            InputProps: { 
                              sx: valueSx,
                              style: { height: '46px' } 
                            } 
                          } 
                        }}
                      />
                      </TableCell> */}
                    </TableCell>
                    <TableCell>
                      {/* <DatePicker
                        value={fee.nextRecoveryDate}
                        onChange={(newValue) => handleFeeChange(index, 'nextRecoveryDate', newValue)}
                        slotProps={{ 
                          textField: { 
                            size: 'small', 
                            sx: datePickerStyles, 
                            InputLabelProps: { sx: labelSx },
                            InputProps: { 
                              sx: valueSx,
                              style: { height: '46px' } 
                            } 
                          } 
                        }}
                      /> */}
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={fee.corporateTax}
                        onChange={(e) =>
                          handleFeeChange(index, "corporateTax", e.target.value)
                        }
                        InputLabelProps={{ sx: labelSx }}
                        InputProps={{ sx: valueSx }}
                        sx={commonFieldStyles}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={fee.amount}
                        onChange={(e) =>
                          handleFeeChange(index, "amount", e.target.value)
                        }
                        InputLabelProps={{ sx: labelSx }}
                        InputProps={{ sx: valueSx }}
                        sx={commonFieldStyles}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={fee.vatPercentage}
                        onChange={(e) =>
                          handleFeeChange(
                            index,
                            "vatPercentage",
                            e.target.value
                          )
                        }
                        InputLabelProps={{ sx: labelSx }}
                        InputProps={{ sx: valueSx }}
                        sx={commonFieldStyles}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => {}}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <RightSlideFeeDetailsPanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />
    </LocalizationProvider>
  );
};

export default Step3;
