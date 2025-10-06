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
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { BeneficiaryData } from "../types";
import { RightSlideBeneficiaryDetailsPanel } from "../../RightSlidePanel/RightSlideBeneficiaryDetailsPanel";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DatePicker } from "@mui/x-date-pickers";

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

interface Step4Props {
  beneficiaries: BeneficiaryData[];
  onBeneficiariesChange: (beneficiaries: BeneficiaryData[]) => void;
}

const Step4: React.FC<Step4Props> = ({
  beneficiaries,
  onBeneficiariesChange,
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const handleBeneficiaryChange = (
    index: number,
    field: keyof BeneficiaryData,
    value: any
  ) => {
    const updatedBeneficiaries = [...beneficiaries];
    updatedBeneficiaries[index] = {
      ...updatedBeneficiaries[index],
      [field]: value,
    } as BeneficiaryData;
    onBeneficiariesChange(updatedBeneficiaries);
  };

  const addBeneficiary = () => {
    setIsPanelOpen(true);
    // onBeneficiariesChange([
    //   ...beneficiaries,
    //   {
    //     id: '',
    //     expenseType: '',
    //     transferType: '',
    //     name: '',
    //     bankName: '',
    //     swiftCode: '',
    //     routingCode: '',
    //     account: '',
    //   },
    // ])
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  const deleteBeneficiary = (index: number) => {
    const updatedBeneficiaries = beneficiaries.filter((_, i) => i !== index);
    onBeneficiariesChange(updatedBeneficiaries);
  };
  const handleFeeChange = () => {
    // const updatedFees = [...beneficiaries];
    // updatedFees[index] = { ...updatedFees[index], [field]: value } as beneficiaries;
  };

  return (
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
          {/* <Typography variant="h6">Beneficiary Details</Typography> */}
          <Box>
            <Button
              variant="text"
              startIcon={<FileDownloadOutlinedIcon />}
              sx={{
                mr: 1,
                borderRadius: "8px",
                textTransform: "none",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0.5px",
                verticalAlign: "middle",
              }}
            >
              Download Template
            </Button>
            <Button
              variant="contained"
              startIcon={<FileUploadOutlinedIcon />}
              sx={{
                mr: 1,
                borderRadius: "8px",
                textTransform: "none",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0.5px",
                verticalAlign: "middle",
              }}
            >
              Upload XLS
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              onClick={addBeneficiary}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0.5px",
                verticalAlign: "middle",
                boxShadow: "none",
              }}
            >
              Add Beneficiary
            </Button>
          </Box>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ boxShadow: "none", borderRadius: "8px" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Beneficiary Swift</TableCell>
                <TableCell>Transfer Type</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Bank Name</TableCell>
                <TableCell>Trade License Number</TableCell>
                <TableCell>Trade License Expiry</TableCell>
                <TableCell>Beneficiary AccountIban</TableCell>
                <TableCell>Routing Code</TableCell>
                <TableCell>Place Of ssue</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {beneficiaries.map((beneficiary, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      size="small"
                      value={beneficiary.id}
                      onChange={(e) =>
                        handleBeneficiaryChange(index, "id", e.target.value)
                      }
                      InputLabelProps={{ sx: labelSx }}
                      InputProps={{ sx: valueSx }}
                      sx={commonFieldStyles}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={beneficiary.beneficiarySwift}
                      onChange={(e) =>
                        handleBeneficiaryChange(
                          index,
                          "beneficiarySwift",
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
                      value={beneficiary.transferType}
                      onChange={(e) =>
                        handleBeneficiaryChange(
                          index,
                          "transferType",
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
                      value={beneficiary.name}
                      onChange={(e) =>
                        handleBeneficiaryChange(index, "name", e.target.value)
                      }
                      InputLabelProps={{ sx: labelSx }}
                      InputProps={{ sx: valueSx }}
                      sx={commonFieldStyles}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={beneficiary.bankName}
                      onChange={(e) =>
                        handleBeneficiaryChange(
                          index,
                          "bankName",
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
                      value={beneficiary.tradeLicenseNumber}
                      onChange={(e) =>
                        handleBeneficiaryChange(
                          index,
                          "tradeLicenseNumber",
                          e.target.value
                        )
                      }
                      InputLabelProps={{ sx: labelSx }}
                      InputProps={{ sx: valueSx }}
                      sx={commonFieldStyles}
                    />
                  </TableCell>
                  <TableCell>
                    {/* <DatePicker
                      value={beneficiary.tradeLicenseExpiry}
                      onChange={() => handleFeeChange()}
                      slotProps={{
                        textField: {
                          size: "small",
                          sx: datePickerStyles,
                          InputLabelProps: { sx: labelSx },
                          InputProps: {
                            sx: valueSx,
                            style: { height: "46px" },
                          },
                        },
                      }}
                    /> */}
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={beneficiary.beneficiaryAccountIban}
                      onChange={(e) =>
                        handleBeneficiaryChange(
                          index,
                          "beneficiaryAccountIban",
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
                      value={beneficiary.routingCode}
                      onChange={(e) =>
                        handleBeneficiaryChange(
                          index,
                          "routingCode",
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
                      value={beneficiary.placeOfIssue}
                      onChange={(e) =>
                        handleBeneficiaryChange(
                          index,
                          "placeOfIssue",
                          e.target.value
                        )
                      }
                      InputLabelProps={{ sx: labelSx }}
                      InputProps={{ sx: valueSx }}
                      sx={commonFieldStyles}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => deleteBeneficiary(index)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <RightSlideBeneficiaryDetailsPanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />
    </Card>
  );
};

export default Step4;
