'use client'

import React from 'react'
import { Card, CardContent, Grid, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { commonFieldStyles, labelSx, valueSx, cardStyles } from '../styles'
import { useProjectLabels } from '@/hooks/useProjectLabels'
import { ProjectData } from '../types'

interface Step7Props {
  projectId?: string
  isViewMode?: boolean
}

const Step7: React.FC<Step7Props> = ({ isViewMode = false }) => {
  const { control } = useFormContext<ProjectData>()
  const { getLabel } = useProjectLabels()

  return (
    <Card sx={cardStyles}>
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="closureData.totalIncomeFund"
              control={control}
              rules={{
                required: 'Total Income Received is required',
                pattern: {
                  value: /^[0-9,\s]+$/,
                  message: 'Must contain only numbers and commas'
                },
                maxLength: {
                  value: 20,
                  message: 'Maximum 20 characters allowed'
                }
              }}
              render={({ field, fieldState: { error, isTouched } }) => {
                // Show validation error if field has been touched OR if there's an error (for form submission)
                const shouldShowError = (isTouched || !!error) && !!error
                return (
                  <TextField
                    {...field}
                    fullWidth
                    disabled={isViewMode}
                    required
                    label={getLabel('CDL_BPA_TOTAL_AMT_RECEIVED', 'Total Income Received')}
                    error={shouldShowError}
                    helperText={shouldShowError ? error?.message : ''}
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="closureData.totalPayment"
              control={control}
              rules={{
                required: 'Total Disbursed Payments is required',
                pattern: {
                  value: /^[0-9,\s]+$/,
                  message: 'Must contain only numbers and commas'
                },
                maxLength: {
                  value: 20,
                  message: 'Maximum 20 characters allowed'
                }
              }}
              render={({ field, fieldState: { error, isTouched } }) => {
                // Show validation error if field has been touched OR if there's an error (for form submission)
                const shouldShowError = (isTouched || !!error) && !!error
                return (
                  <TextField
                    {...field}
                    fullWidth
                    disabled={isViewMode}
                    required
                    label={getLabel('CDL_BPA_TOTAL_DIS_PMT', 'Total Disbursed Payments')}
                    error={shouldShowError}
                    helperText={shouldShowError ? error?.message : ''}
                    InputLabelProps={{ sx: labelSx }}
                    InputProps={{ sx: valueSx }}
                    sx={commonFieldStyles}
                  />
                )
              }}
            />
          </Grid>
        </Grid>

        {/* <Box mt={6}>
          <DocumentUploadFactory
            type="BUILD_PARTNER_ASSET"
            entityId={projectId}
            isOptional={true}
            formFieldName="projectClosureDocuments"
          />
        </Box> */}
      </CardContent>
    </Card>
  )
}

export default Step7
