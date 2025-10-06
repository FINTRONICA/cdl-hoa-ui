'use client'

import React from 'react'
import { Box, Grid, Typography, Card, CardContent, Divider, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { PropertyData } from '../types'

const labelSx = {
  color: '#6A7282',
  fontFamily: 'Outfit',
  fontWeight: 400,
  fontStyle: 'normal',
  fontSize: '12px',
  letterSpacing: 0,
};

const valueSx = {
  color: '#1E2939',
  fontFamily: 'Outfit',
  fontWeight: 400,
  fontStyle: 'normal',
  fontSize: '14px',
  letterSpacing: 0,
  wordBreak: 'break-word',
};

const fieldBoxSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
};

const renderDisplayField = (label: string, value: string | number | null = '-') => (
  <Box sx={fieldBoxSx}>
    <Typography sx={labelSx}>{label}</Typography>
    <Typography sx={valueSx}>{value || '-'} </Typography>
  </Box>
);

interface Step6Props {
  PropertyData: PropertyData
}

const Step6: React.FC<Step6Props> = ({ PropertyData }) => {
  const projectFields = [
    { gridSize: 6, label: 'System ID*', value: 'PROJ7102' },
    { gridSize: 6, label: 'Developer CIF/Name*' },
    { gridSize: 6, label: 'Developer ID (RERA)*' },
    { gridSize: 6, label: 'Developer Name' },
    { gridSize: 6, label: 'Master Developer Name' },
    { gridSize: 6, label: 'Project RERA Number*' },
    { gridSize: 6, label: 'Project Name*' },
    { gridSize: 6, label: 'Project Type*' },
    { gridSize: 12, label: 'Project Location*' },
    { gridSize: 3, label: 'Project Account CIF*' },
    { gridSize: 3, label: 'Project Status*' },
    { gridSize: 6, label: 'Project Account Status*' },
    { gridSize: 3, label: 'Project Account Status Date' },
    { gridSize: 3, label: 'Project Registration Date*' },
    { gridSize: 3, label: 'Project Start Date Est.*' },
    { gridSize: 3, label: 'Project Start Date*' },
    { gridSize: 3, label: 'Retention %*', value: '5.00' },
    { gridSize: 3, label: 'Additional Retention %', value: '8.00' },
    { gridSize: 3, label: 'Total Retention %', value: '13.00' },
    { gridSize: 3, label: 'Retention Effective Start Date*', value: '31/12/2022' },
    { gridSize: 6, label: 'Project Management Expenses (% of paid construction cost)*', value: '5.00' },
    { gridSize: 6, label: 'Marketing Expenses (% of sold value)*', value: '10.00' },
    { gridSize: 6, label: 'Real Estate Broker Expense' },
    { gridSize: 6, label: 'Advertising Expense' },
    { gridSize: 6, label: 'Land Owner Name' },
    { gridSize: 6, label: 'Project Completion Percentage' },
    { gridSize: 3, label: 'Currency', value: 'AED' },
    { gridSize: 3, label: 'Actual Construction Cost' },
    { gridSize: 6, label: 'No. of Units', value: '12' },
    { gridSize: 12, label: 'Remarks' },
    { gridSize: 12, label: 'Special Approval' },
    { gridSize: 6, label: 'Payment Type to be Blocked' },
    { gridSize: 6, label: 'Managed By*', value: 'ems_checker1, ems_checker1' },
    { gridSize: 6, label: 'Backup By', value: 'Maker ENBD;[enbd_maker]' },
    { gridSize: 6, label: 'Relationship Manager' },
    { gridSize: 6, label: 'Assistant Relationship Manager' },
    { gridSize: 6, label: 'Team Leader Name' },
  ];

  const accountFields = [
    { gridSize: 6, label: 'Trust Account Number*', value: '102800280' },
    { gridSize: 6, label: 'IBAN Number*', value: '12345678' },
    { gridSize: 3, label: 'Date Opened*', value: '-' },
    { gridSize: 3, label: 'Account Title*', value: 'dev' },
    { gridSize: 6, label: 'Currency*', value: '-' },
    { gridSize: 6, label: 'Retention Account*', value: '2080920809' },
    { gridSize: 6, label: 'IBAN Number*', value: '234567890' },
    { gridSize: 3, label: 'Date Opened*', value: '-' },
    { gridSize: 3, label: 'Account Title*', value: 'dev' },
    { gridSize: 6, label: 'Currency*', value: '-' },
    { gridSize: 6, label: 'Sub Construction Account', value: '3080930809' },
    { gridSize: 6, label: 'IBAN Number*', value: '10231023' },
    { gridSize: 3, label: 'Date Opened*', value: '-' },
    { gridSize: 3, label: 'Account Title*', value: 'dev' },
    { gridSize: 6, label: 'Currency*', value: '-' },
    { gridSize: 6, label: 'Corporate Account Number', value: '4080940809' },
    { gridSize: 6, label: 'IBAN Number*', value: '30983098' },
    { gridSize: 3, label: 'Date Opened*', value: '-' },
    { gridSize: 3, label: 'Account Title*', value: 'dev' },
    { gridSize: 6, label: 'Currency*', value: '-' },
  ];

  return (
    <Card sx={{ boxShadow: 'none', backgroundColor: '#FFFFFFBF', width: '94%', margin: '0 auto' }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 500,
            fontStyle: 'normal',
            fontSize: '18px',
            lineHeight: '28px',        // Assuming "Title Large" line height
            letterSpacing: '0.15px',   // Conservative tracking
            verticalAlign: 'middle',
          }}>
            Project Details
          </Typography>
          <Button startIcon={<EditIcon />} sx={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 500,
            fontStyle: 'normal',
            fontSize: '14px',
            lineHeight: '24px',
            letterSpacing: '0.5px',
            verticalAlign: 'middle',
          }}>
            Edit
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {projectFields.map((field, idx) => (
            <Grid size={{ xs: 12, md: field.gridSize }} key={idx}>
              {renderDisplayField(field.label, field.value)}
            </Grid>
          ))}
        </Grid>
      </CardContent>

      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 500,
            fontStyle: 'normal',
            fontSize: '18px',
            lineHeight: '28px',        // Assuming "Title Large" line height
            letterSpacing: '0.15px',   // Conservative tracking
            verticalAlign: 'middle',
          }}>
            Account
          </Typography>
          <Button startIcon={<EditIcon />} sx={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 500,
            fontStyle: 'normal',
            fontSize: '14px',
            lineHeight: '24px',
            letterSpacing: '0.5px',
            verticalAlign: 'middle',
          }} >
            Edit
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          {accountFields.map((field, idx) => (
            <Grid size={{ xs: 12, md: field.gridSize }} key={idx}>
              {renderDisplayField(field.label, field.value)}
            </Grid>
          ))}
        </Grid>

      </CardContent>
      <Divider sx={{ mt: 2, mb: 2 }} />
    </Card>
  )
}

export default Step6
