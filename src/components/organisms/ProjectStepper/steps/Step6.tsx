'use client'

import React from 'react'
import {
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  Box,
} from '@mui/material'
import { FinancialData } from '../types'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Controller, useFormContext } from 'react-hook-form'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import { useProjectLabels } from '@/hooks/useProjectLabels'
// Removed custom validation import - using React Hook Form validation instead
import {
  commonFieldStyles,
  datePickerStyles,
  labelSx,
  valueSx,
  cardStyles,
  calendarIconSx,
} from '../styles'

interface Step6Props {
  financialData: FinancialData
  onFinancialDataChange: (financialData: FinancialData) => void
  isViewMode?: boolean
}

const Step6: React.FC<Step6Props> = ({ isViewMode = false }) => {
  const { getLabel } = useProjectLabels()

  const StyledCalendarIcon = (
    props: React.ComponentProps<typeof CalendarTodayOutlinedIcon>
  ) => <CalendarTodayOutlinedIcon {...props} sx={calendarIconSx} />

  // Use parent form context instead of local form
  const { control } = useFormContext()

  const renderTextField = (name: string, label: string, gridSize = 3, required = false) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name as any}
        control={control}
        defaultValue=""
        rules={{
          required: required ? `${label} is required` : false,
          pattern: {
            value: /^[0-9,\s]*$/,
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
              label={label}
              required={required}
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
  )

  const renderDateField = (name: string, label: string, gridSize = 3) => (
    <Grid key={name} size={{ xs: 12, md: gridSize }}>
      <Controller
        name={name as any}
        control={control}
        defaultValue={undefined}
        rules={{
          // Date fields are optional, no validation needed
        }}
        render={({ field, fieldState: { error, isTouched } }) => {
          // Show validation error if field has been touched OR if there's an error (for form submission)
          const shouldShowError = (isTouched || !!error) && !!error
          return (
            <DatePicker
              label={label}
              value={field.value as any}
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
                    style: { height: '46px' },
                  },
                  error: shouldShowError,
                  helperText: shouldShowError ? error?.message : '',
                },
              }}
            />
          )
        }}
      />
    </Grid>
  )

  const groupedFields = [
    {
      title: getLabel('CDL_BPA_FINANCIAL', 'Asset Financial Overview'),
      fields: [
        renderTextField('estimate.revenue', getLabel('CDL_BPA_TOTAL_REVENUE', 'Total Revenue'), 6, true),
        renderTextField('estimate.constructionCost', getLabel('CDL_BPA_BUILD_COST', 'Build Cost'), 6, true),
        renderTextField(
          'estimate.projectManagementExpense',
          getLabel('CDL_BPA_ASST_MGMT_EXP', 'Asset Management Expense'),
          6,
          true
        ),
        renderTextField('estimate.landCost', getLabel('CDL_BPA_LAND_ACQ_COST', 'Land Acquisition Cost'), 6, true),
        renderTextField('estimate.marketingExpense', getLabel('CDL_BPA_MARK_EXP', 'Marketing Expense'), 6, true),
        renderDateField(
          'estimate.date',
          getLabel('CDL_BPA_TRAN_DATE', 'Transaction Date'),
          6
        ),
      ],
    },
    {
      title: getLabel('CDL_BPA_ACTUAL_ASSEST_COST', 'Actual Asset Cost'),
      fields: [
        renderTextField('actual.soldValue', getLabel('CDL_BPA_TOTAL_UNIT_SOLD', 'Total Units Sold Value'), 6, true),
        renderTextField('actual.constructionCost', getLabel('CDL_BPA_BUILD_COST', 'Build Cost'), 6, true),
        renderTextField('actual.infraCost', getLabel('CDL_BPA_INFRA_COST', 'Infrastructure Development Cost'), 4, false),
        renderTextField('actual.landCost', getLabel('CDL_BPA_LAND_ACQ_COST', 'Land Acquisition Cost'), 4, true),
        renderTextField(
          'actual.projectManagementExpense',
          getLabel('CDL_BPA_ASST_MGMT_EXP', 'Asset Management Expense'),
          4,
          true
        ),
        renderTextField('actual.marketingExpense', getLabel('CDL_BPA_MARK_EXP', 'Marketing Expense'), 6, true),
        renderDateField(
          'actual.date',
          getLabel('CDL_BPA_TRAN_DATE', 'Transaction Date'),
          6
        ),
      ],
    },
  ]

  const breakdownSections = [
    getLabel('CDL_BPA_CASH_FROM_UNIT', 'Cash Inflow from Unit Holders'),
    getLabel('CDL_BPA_LAND_ACQ_COST', 'Land Acquisition Cost'),
    getLabel('CDL_BPA_BUILD_COST', 'Build Cost'),
    getLabel('CDL_BPA_MARK_EXP', 'Marketing Expense'),
    getLabel('CDL_BPA_ASST_MGMT_EXP', 'Asset Management Expense'),
    getLabel('CDL_BPA_MORTGAGE_AMT', 'Mortgage Amount'),
    getLabel('CDL_BPA_VAT_AMT', 'VAT Payment'),
    getLabel('CDL_BPA_TOTAL_AMOUNT', 'Total Amount'),
    getLabel('CDL_BPA_REFUND_AMT', 'Refund Amount'),
    getLabel('CDL_BPA_RETEN_ACC_BAL', 'Retention Account Balance'),
    getLabel('CDL_BPA_TRUST_ACC_BAL', 'Trust Account Balance'),
    getLabel('CDL_BPA_SUBCONS_ACC_BAL', 'Sub-Construction Account Balance'),
    getLabel('CDL_BPA_TECH_FEES', 'Technical Fees'),
    getLabel('CDL_BPA_UNALLO_COST', 'Unallocated Costs'),
    getLabel('CDL_BPA_LOAN', 'Loan/Installment Payments'),
    getLabel('CDL_BPA_INFRA_COST', 'Infrastructure Development Cost'),
    getLabel('CDL_BPA_OTHER_EXP', 'Other Expenses'),
    getLabel('CDL_BPA_TRANS_AMT', 'Transferred Amount'),
    getLabel('CDL_BPA_FORFEIT_AMT', 'Forfeited Amount'),
    getLabel('CDL_BPA_DEV_EQUITY_CONT', 'Developer Equity Contribution'),
    getLabel('CDL_BPA_AMANAT_FUND', 'Amanat Fund Allocation'),
    getLabel('CDL_BPA_OTHER_WITHDRAW', 'Other Withdrawals'),
    getLabel('CDL_BPA_OQOOD_OTHER_PMT', 'Oqood and Other Payments'),
    getLabel('CDL_BPA_VAT_DEPOSIT_AMT', 'VAT Deposited Amount'),
    getLabel('CDL_BPA_PROFIT_ERND', 'Interest/Profit Earned on Retention Account'),
    getLabel('CDL_BPA_PMT_FRM_RETENTION', 'Payments from Retention Account'),
    getLabel('CDL_BPA_REIMB_AMT', 'Reimbursement Amount'),
    getLabel('CDL_BPA_INT_ERND_ESCROW', 'Interest/Profit Earned on Escrow Account'),
    getLabel('CDL_BPA_CAP_VAT_AMT', 'Capped VAT Amount'),
  ]

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={cardStyles}>
        <CardContent>
          {groupedFields.map(({ title, fields }, sectionIndex) => (
            <Box key={sectionIndex} mb={6}>
              <Typography
                variant="h6"
                mb={2}
                sx={{
                  color: '#1E2939',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '18px',
                  lineHeight: '28px',
                  letterSpacing: '0.15px',
                  verticalAlign: 'middle',
                }}
              >
                {title}
              </Typography>
              <Grid container spacing={3}>
                {fields}
              </Grid>
            </Box>
          ))}

          {breakdownSections.map((section, index) => (
            <Box key={index} mb={4}>
              <Typography
                variant="h6"
                mb={2}
                sx={{
                  color: '#1E2939',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '18px',
                  lineHeight: '28px',
                  letterSpacing: '0.15px',
                  verticalAlign: 'middle',
                }}
              >
                {section}
              </Typography>
              <Grid container spacing={3}>
                {renderTextField(
                  `breakdown.${index}.outOfEscrow`,
                  getLabel('CDL_BPA_FUND_OUT_ESCROW', 'Funds Outside Escrow'),
                  3
                )}
                {renderTextField(
                  `breakdown.${index}.withinEscrow`,
                  getLabel('CDL_BPA_FUND_WITHIN_ESCROW', 'Funds Within Escrow'),
                  3
                )}
                {renderTextField(`breakdown.${index}.total`, getLabel('CDL_BPA_TOTAL_AMOUNT', 'Total Amount'), 3)}
                {renderTextField(
                  `breakdown.${index}.exceptionalCapValue`,
                  getLabel('CDL_BPA_EXCEP_CAP_VAL', 'Exceptional Capital Value'),
                  3
                )}
              </Grid>
            </Box>
          ))}
        </CardContent>
      </Card>
    </LocalizationProvider>
  )
}

export default Step6
