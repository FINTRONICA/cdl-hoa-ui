'use client'

import React from 'react'
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { ProjectData } from '../types'
// import { useProjectLabels } from '@/hooks/useProjectLabels'
import { useBuildPartnerAssetLabelsWithUtils } from '@/hooks/useBuildPartnerAssetLabels'
import { useProjectReview } from '@/hooks/useProjectReview'
import { labelSx, valueSx, fieldBoxSx, cardStyles } from '../styles'
import { GlobalLoading } from '@/components/atoms'
import { formatDate } from '@/utils'

const renderDisplayField = (
  label: string,
  value: string | number | null = '-'
) => (
  <Box sx={fieldBoxSx}>
    <Typography sx={labelSx}>{label}</Typography>
    <Typography sx={valueSx}>{value || '-'} </Typography>
  </Box>
)

interface Step8Props {
  projectData: ProjectData
  onEditStep?: (stepNumber: number) => void
  projectId?: string
  isViewMode?: boolean
}

const Step8: React.FC<Step8Props> = ({
  onEditStep,
  projectId,
  isViewMode = false,
}) => {
  const { getLabel } = useBuildPartnerAssetLabelsWithUtils()
  const language = 'EN'

  // Fetch real project data using the new hook
  const {
    projectData: reviewData,
    loading,
    error,
  } = useProjectReview(projectId || '')

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: '#FFFFFFBF',
          borderRadius: '16px',
          margin: '0 auto',
          width: '100%',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <GlobalLoading fullHeight className="min-h-[400px]" />
      </Box>
    )
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    )
  }

  // No data state
  if (!reviewData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No project data found.</Alert>
      </Box>
    )
  }

  // Project fields with real data from API
  const projectFields = [
    {
      gridSize: 6,
      label: 'System ID*',
      value: reviewData.projectDetails?.id || 'PROJ7102',
    },
    {
      gridSize: 6,
      // label: 'Developer CIF/Name*',
      label: getLabel('CDL_MF_AR_CIF', language, 'Management Firm CIF'),
      value: reviewData.projectDetails?.developerCif || '',
    },
    {
      gridSize: 6,
      // label: 'Developer ID (RERA)*',
      label: getLabel('CDL_MF_AR_ID', language, 'Management Firm ID'),
      value: reviewData.projectDetails?.developerId || '',
    },
    {
      gridSize: 6,
      // label: 'Developer Name',
      label: getLabel('CDL_MF_AR_NAME', language, 'Management Firm Name'),
      value: reviewData.projectDetails?.developerName || '',
    },
    {
      gridSize: 6,
      // label: 'Master Developer Name',
      label: getLabel('CDL_MF_AR_NAME', language, 'Master Management Firm Name'),
      value: reviewData.projectDetails?.masterDeveloperName || '',
    },
    {
      gridSize: 6,
      // label: 'Project RERA Number*',
      label: getLabel('CDL_MF_REGNO', language, 'HOA Regisntartion Number'),
      value: reviewData.projectDetails?.reraNumber || '',
    },
    {
      gridSize: 6,
      // label: 'Project Name*',
      label: getLabel('CDL_MF_NAME', language, 'Asset Name'),
      value: reviewData.projectDetails?.projectName || '',
    },
    {
      gridSize: 6,
      // label: 'Project Type*',
      label: getLabel('CDL_BPA_TP_TYPE', language, 'Assets Type'),
      value: reviewData.projectDetails?.projectType || '',
    },
    {
      gridSize: 12,
      // label: 'Project Location*',
      label: getLabel('CDL_MF_LOCATION', language, 'Asset Location'),
      value: reviewData.projectDetails?.projectLocation || '',
    },
    {
      gridSize: 3,
      // label: 'Project Account CIF*',
      label: getLabel(
        'CDL_MF_CIF',
        language,
        'Customer Information File (CIF) Number'
      ),
      value: reviewData.projectDetails?.projectAccountCif || '',
    },
    {
      gridSize: 3,
      // label: 'Project Status*',
      label: getLabel('CDL_MF_STATUS', language, 'Asset Status'),
      value: reviewData.projectDetails?.projectStatus || '',
    },
    {
      gridSize: 6,
      // label: 'Project Account Status*',
      label: getLabel('CDL_MF_ACC_STATUS', language, 'Asset Account Status'),
      value: reviewData.projectDetails?.projectAccountStatus || '',
    },
    {
      gridSize: 3,
      // label: 'Project Account Status Date',
      label: getLabel(
        'CDL_MF_ACC_STATUS_DATE',
        language,
        'Asset Account Status Date'
      ),
      value: reviewData.projectDetails?.projectAccountStatusDate
        ? formatDate(
            reviewData.projectDetails.projectAccountStatusDate,
            'DD/MM/YYYY'
          )
        : '',
    },
    {
      gridSize: 3,
      // label: 'Project Registration Date*',
      label: getLabel('CDL_MF_REG_DATE', language, 'Asset Registration Date'),
      value: reviewData.projectDetails?.projectRegistrationDate
        ? formatDate(
            reviewData.projectDetails.projectRegistrationDate,
            'DD/MM/YYYY'
          )
        : '',
    },
    {
      gridSize: 3,
      // label: 'Project Start Date Est.*',
      label: getLabel(
        'CDL_MF_EST_DATE',
        language,
        'Estimated Commencement Date'
      ),
      value: reviewData.projectDetails?.projectStartDateEst
        ? formatDate(
            reviewData.projectDetails.projectStartDateEst,
            'DD/MM/YYYY'
          )
        : '',
    },
    {
      gridSize: 3,
      // label: 'Project Start Date*',
      label: getLabel(
        'CDL_MF_RETENTION_START_DATE',
        language,
        'Retention Start Date'
      ),
      value: reviewData.projectDetails?.projectStartDate
        ? formatDate(reviewData.projectDetails.projectStartDate, 'DD/MM/YYYY')
        : '',
    },
    {
      gridSize: 3,
      // label: 'Retention %*',
      label: getLabel(
        'CDL_MF_PRIMARY_RETENTION',
        language,
        'Primary Retention(%)'
      ),
      value: reviewData.projectDetails?.retentionPercent || '5.00',
    },
    {
      gridSize: 3,
      // label: 'Additional Retention %',
      label: getLabel(
        'CDL_MF_SECONDARY_RETENTION',
        language,
        'Supplementary Retention(%)'
      ),
      value: reviewData.projectDetails?.additionalRetentionPercent || '8.00',
    },
    {
      gridSize: 3,
      // label: 'Total Retention %',
      label: getLabel(
        'CDL_MF_AGG_RETENTION',
        language,
        'Aggregate Retention(%)'
      ),
      value: reviewData.projectDetails?.totalRetentionPercent || '13.00',
    },
    {
      gridSize: 3,
      label: 'Retention Effective Start Date*',
      value: reviewData.projectDetails?.retentionEffectiveStartDate
        ? formatDate(
            reviewData.projectDetails.retentionEffectiveStartDate,
            'MM/DD/YYYY'
          )
        : '31/12/2022',
    },
    {
      gridSize: 6,
      label: 'Project Management Expenses (% of paid construction cost)*',
      value: reviewData.projectDetails?.projectManagementExpenses || '5.00',
    },
    {
      gridSize: 6,
      label: 'Marketing Expenses (% of sold value)*',
      value: reviewData.projectDetails?.marketingExpenses || '10.00',
    },
    {
      gridSize: 6,
      label: getLabel('CDL_MF_BROK_FEES', language, 'Brokerage Fees'),
      value: reviewData.projectDetails?.realEstateBrokerExpense || '',
    },
    {
      gridSize: 6,
      label: getLabel('CDL_MF_ADVTG_COST', language, 'Advertising Costs'),
      value: reviewData.projectDetails?.advertisingExpense || '',
    },
    {
      gridSize: 6,
      label: getLabel('CDL_MF_LANDOWNER_NAMEOST', language, 'Land Owner Name'),
      value: reviewData.projectDetails?.landOwnerName || '',
    },
    {
      gridSize: 6,
      label: 'Project Completion Percentage',
      value: reviewData.projectDetails?.projectCompletionPercentage || '',
    },
    {
      gridSize: 3,
      label: getLabel('CDL_MF_TRAN_CUR', language, 'Transaction Currency'),
      value: reviewData.projectDetails?.currency || 'AED',
    },
    {
      gridSize: 3,
      label: 'Actual Construction Cost',
      value: reviewData.projectDetails?.actualConstructionCost || '',
    },
    {
      gridSize: 6,
      label: 'No. of Units',
      value: reviewData.projectDetails?.noOfUnits || '12',
    },
    {
      gridSize: 12,
      label: getLabel('CDL_MF_ADD_NOTES', language, 'Additional Notes'),
      value: reviewData.projectDetails?.remarks || '',
    },
    {
      gridSize: 12,
      label: getLabel('CDL_MF_SP_REG_APPROVAL', language, 'Special Approval'),
      value: reviewData.projectDetails?.specialApproval || '',
    },
    {
      gridSize: 6,
      label: getLabel(
        'CDL_MF_RES_PAYMENT_TYPE',
        language,
        'Payment Type to be Blocked'
      ),
      value: reviewData.projectDetails?.paymentType || '',
    },
    {
      gridSize: 6,
      label: getLabel('CDL_MF_ASS_MANAGER', language, 'Asset Manager'),
      value:
        reviewData.projectDetails?.managedBy || 'ems_checker1, ems_checker1',
    },
    {
      gridSize: 6,
      label: getLabel('CDL_MF_BACKUP_MANAGER', language, 'Backup By*'),
      value: reviewData.projectDetails?.backupRef || 'Maker ENBD;[enbd_maker]',
    },
    {
      gridSize: 6,
      label: getLabel('CDL_BPA_REL_MANAGER', language, 'Relationship Manager'),
      value: reviewData.projectDetails?.relationshipManager || '',
    },
    {
      gridSize: 6,
      label: getLabel(
        'CDL_BPA_ASS_REL_MANAGER',
        language,
        'Assistant Relationship Manager'
      ),
      value: reviewData.projectDetails?.assistantRelationshipManager || '',
    },
    {
      gridSize: 6,
      label: getLabel('CDL_MF_TL', language, 'Team Leader Name'),
      value: reviewData.projectDetails?.teamLeaderName || '',
    },
  ]

  // Account fields with real data from API
  const accountFields = reviewData.accounts
    .map((account) => [
      {
        gridSize: 6,
        label: getLabel(
          'CDL_BPA_ACCOUNT_NUMBER',
          language,
          `${account.accountType || 'Account'} Number*`
        ),
        value: account.accountNumber || '',
      },
      {
        gridSize: 6,
        label: getLabel('CDL_BPA_IBAN_NUMBER', language, 'IBAN Number*'),
        value: account.ibanNumber || '',
      },
      {
        gridSize: 3,
        label: getLabel('CDL_BPA_DATE_OPENED', language, 'Date Opened*'),
        value: account.dateOpened
          ? formatDate(account.dateOpened, 'MM/DD/YYYY')
          : '-',
      },
      {
        gridSize: 3,
        label: getLabel('CDL_BPA_ACCOUNT_TITLE', language, 'Account Title*'),
        value: account.accountTitle || 'dev',
      },
      {
        gridSize: 6,
        label: getLabel('CDL_MF_TRAN_CUR', language, 'Currency'),
        value: account.currency || '-',
      },
    ])
    .flat()

  // If no accounts, show default structure
  if (accountFields.length === 0) {
    accountFields.push(
      { gridSize: 6, label: 'Trust Account Number*', value: '102800280' },
      { gridSize: 6, label: 'IBAN Number*', value: '12345678' },
      { gridSize: 3, label: 'Date Opened*', value: '-' },
      { gridSize: 3, label: 'Account Title*', value: 'dev' },
      { gridSize: 6, label: 'Currency*', value: '-' }
    )
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Project Details Section */}
      <Card sx={cardStyles}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 500,
                fontStyle: 'normal',
                fontSize: '18px',
                lineHeight: '28px',
                letterSpacing: '0.15px',
                verticalAlign: 'middle',
              }}
            >
              {getLabel(
                'CDL_MF_DETAILS',
                language,
                'Management Firm Details'
              )}
            </Typography>
            {!isViewMode && (
              <Button
                startIcon={<EditIcon />}
                onClick={() => onEditStep?.(0)} // Navigate to Step 1 (Project Details)
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#6B7280',
                  borderColor: '#D1D5DB',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#9CA3AF',
                    backgroundColor: '#F9FAFB',
                  },
                }}
              >
                Edit
              </Button>
            )}
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
      </Card>

      {/* Documents Section (placed after Project Details) */}
      {reviewData.documents.length > 0 && (
        <Card sx={cardStyles}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: '24px',
                  color: '#1E2939',
                }}
              >
                Submitted Documents
              </Typography>
              {!isViewMode && (
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => onEditStep?.(1)}
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#6B7280',
                    borderColor: '#D1D5DB',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#9CA3AF',
                      backgroundColor: '#F9FAFB',
                    },
                  }}
                >
                  Edit
                </Button>
              )}
            </Box>
            <Divider sx={{ mb: 2 }} />
            <TableContainer
              component={Paper}
              sx={{ boxShadow: 'none', border: '1px solid #E5E7EB' }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                    <TableCell
                      sx={{
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#374151',
                        borderBottom: '1px solid #E5E7EB',
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#374151',
                        borderBottom: '1px solid #E5E7EB',
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#374151',
                        borderBottom: '1px solid #E5E7EB',
                      }}
                    >
                      Type
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewData.documents.map((doc, index) => (
                    <TableRow
                      key={doc.id || index}
                      sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}
                    >
                      <TableCell
                        sx={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          color: '#374151',
                          borderBottom: '1px solid #E5E7EB',
                        }}
                      >
                        {doc.fileName}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          color: '#374151',
                          borderBottom: '1px solid #E5E7EB',
                        }}
                      >
                        {formatDate(doc.uploadDate, 'DD/MM/YYYY')}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          color: '#374151',
                          borderBottom: '1px solid #E5E7EB',
                        }}
                      >
                        {doc.documentType}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Account Details Section */}
      <Card sx={cardStyles}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 500,
                fontStyle: 'normal',
                fontSize: '18px',
                lineHeight: '28px',
                letterSpacing: '0.15px',
                verticalAlign: 'middle',
              }}
            >
              Account Details
            </Typography>
            {!isViewMode && (
              <Button
                startIcon={<EditIcon />}
                onClick={() => onEditStep?.(2)} // Navigate to Step 3 (Account)
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#6B7280',
                  borderColor: '#D1D5DB',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#9CA3AF',
                    backgroundColor: '#F9FAFB',
                  },
                }}
              >
                Edit
              </Button>
            )}
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
      </Card>

      {/* Fee Details Section */}
      {reviewData.fees.length > 0 && (
        <Card sx={cardStyles}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '18px',
                  lineHeight: '28px',
                  letterSpacing: '0.15px',
                  verticalAlign: 'middle',
                }}
              >
                Fee Details
              </Typography>
              {!isViewMode && (
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => onEditStep?.(3)} // Navigate to Step 4 (Fees)
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#6B7280',
                    borderColor: '#D1D5DB',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#9CA3AF',
                      backgroundColor: '#F9FAFB',
                    },
                  }}
                >
                  Edit
                </Button>
              )}
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={3}>
              {reviewData.fees.map((fee, index) => (
                <Grid size={{ xs: 12 }} key={index}>
                  <Typography variant="h6" sx={{ mb: 2, fontSize: '16px' }}>
                    Fee {index + 1}
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {renderDisplayField(
                        getLabel('CDL_BPA_FEES_TYPE', language, 'Type of Fee'),
                        fee.feeType
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {renderDisplayField(
                        getLabel(
                          'CDL_BPA_FEES_FREQUENCY',
                          language,
                          'Collection Frequency'
                        ),
                        fee.frequency
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {renderDisplayField(
                        getLabel(
                          'CDL_BPA_FEES_ACCOUNT',
                          language,
                          'Debit Amount'
                        ),
                        fee.debitAmount
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {renderDisplayField(
                        getLabel(
                          'CDL_BPA_FEE_COLLECTION_DATE',
                          language,
                          'Fee Collection Date'
                        ),
                        fee.feeToBeCollected
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {renderDisplayField(
                        getLabel(
                          'CDL_BPA_FEES_DATE',
                          language,
                          'Next Collection Date'
                        ),
                        fee.nextRecoveryDate
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {renderDisplayField(
                        getLabel('CDL_BPA_FEES_RATE', language, 'Fee Rate (%)'),
                        fee.feePercentage
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {renderDisplayField(
                        getLabel('CDL_BPA_FEES_AMOUNT', language, 'Fee Amount'),
                        fee.amount
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {renderDisplayField(
                        getLabel(
                          'CDL_BPA_FEES_VAT',
                          language,
                          'Applicable VAT (%)'
                        ),
                        fee.vatPercentage
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {renderDisplayField(
                        getLabel(
                          'CDL_BPA_FEES_CURRENCY',
                          language,
                          'Transaction Currency'
                        ),
                        fee.currency
                      )}
                    </Grid>
                  </Grid>
                  {index < reviewData.fees.length - 1 && (
                    <Divider sx={{ mt: 2, mb: 2 }} />
                  )}
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Beneficiary Details Section */}
      {reviewData.beneficiaries.length > 0 && (
        <Card sx={cardStyles}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '18px',
                  lineHeight: '28px',
                  letterSpacing: '0.15px',
                  verticalAlign: 'middle',
                }}
              >
                Beneficiary Details
              </Typography>
              {!isViewMode && (
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => onEditStep?.(4)} // Navigate to Step 5 (Beneficiaries)
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#6B7280',
                    borderColor: '#D1D5DB',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#9CA3AF',
                      backgroundColor: '#F9FAFB',
                    },
                  }}
                >
                  Edit
                </Button>
              )}
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={3}>
              {reviewData.beneficiaries.map((beneficiary, index) => (
                <Grid size={{ xs: 12 }} key={index}>
                  <Typography variant="h6" sx={{ mb: 2, fontSize: '16px' }}>
                    Beneficiary {index + 1}
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {renderDisplayField(
                        getLabel(
                          'CDL_MF_BENE_REFID',
                          language,
                          'Beneficiary Reference ID'
                        ),
                        beneficiary.beneficiaryId
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {renderDisplayField(
                        getLabel(
                          'CDL_MF_RES_PAYMENT_TYPE',
                          language,
                          'Restricted Payment Type'
                        ),
                        beneficiary.beneficiaryType
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {renderDisplayField(
                        getLabel(
                          'CDL_MF_BENE_NAME',
                          language,
                          'Beneficiary Full Name'
                        ),
                        beneficiary.name
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {renderDisplayField(
                        getLabel('CDL_MF_BENE_BANK', language, 'Bank Name'),
                        beneficiary.bankName
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {renderDisplayField(
                        getLabel(
                          'CDL_MF_BENE_ACC',
                          language,
                          'Bank Account Number'
                        ),
                        beneficiary.accountNumber
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {renderDisplayField(
                        getLabel(
                          'CDL_MF_BENE_BIC',
                          language,
                          'SWIFT/BIC Code'
                        ),
                        beneficiary.swiftCode
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      {renderDisplayField(
                        getLabel(
                          'CDL_MF_BENE_ROUTING',
                          language,
                          'Routing Number'
                        ),
                        beneficiary.routingCode
                      )}
                    </Grid>
                  </Grid>
                  {index < reviewData.beneficiaries.length - 1 && (
                    <Divider sx={{ mt: 2, mb: 2 }} />
                  )}
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Payment Plan Section */}
      {reviewData.paymentPlans.length > 0 && (
        <Card sx={cardStyles}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '18px',
                  lineHeight: '28px',
                  letterSpacing: '0.15px',
                  verticalAlign: 'middle',
                }}
              >
                Payment Plan
              </Typography>
              {!isViewMode && (
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => onEditStep?.(5)} // Navigate to Step 6 (Payment Plan)
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#6B7280',
                    borderColor: '#D1D5DB',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#9CA3AF',
                      backgroundColor: '#F9FAFB',
                    },
                  }}
                >
                  Edit
                </Button>
              )}
            </Box>
            <Divider sx={{ mb: 2 }} />

            <TableContainer
              component={Paper}
              sx={{ boxShadow: 'none', border: '1px solid #E5E7EB' }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                    <TableCell
                      sx={{
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#374151',
                        borderBottom: '1px solid #E5E7EB',
                      }}
                    >
                      {getLabel(
                        'CDL_MF_INSTALLMENT_NO',
                        language,
                        'Installment Sequence Number'
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#374151',
                        borderBottom: '1px solid #E5E7EB',
                      }}
                    >
                      {getLabel(
                        'CDL_MF_INSTALLMENT_PER',
                        language,
                        'Installment Percentage (%)'
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#374151',
                        borderBottom: '1px solid #E5E7EB',
                      }}
                    >
                      {getLabel(
                        'CDL_MF_ASST_COMP_PER',
                        language,
                        'Asset Completion Percentage'
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewData.paymentPlans.map((plan, index) => (
                    <TableRow
                      key={plan.id || index}
                      sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}
                    >
                      <TableCell
                        sx={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          color: '#374151',
                          borderBottom: '1px solid #E5E7EB',
                        }}
                      >
                        {plan.installmentNumber}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          color: '#374151',
                          borderBottom: '1px solid #E5E7EB',
                        }}
                      >
                        {plan.installmentPercentage}%
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '14px',
                          color: '#374151',
                          borderBottom: '1px solid #E5E7EB',
                        }}
                      >
                        {plan.projectCompletionPercentage}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Financial Summary Section */}
      {reviewData.financialData &&
        (() => {
          // Normalize API financial summary to the same structure used in Step 6
          const fd: any = reviewData.financialData as any
          const breakdownMap: Record<
            number,
            { out: string; within: string; total: string; except: string }
          > = {
            0: {
              out: 'mffsCurCashRecvdOutEscrow',
              within: 'mffsCurCashRecvdWithinEscrow',
              total: 'mffsCurCashRecvdTotal',
              except: 'mffsCurCashexceptCapVal',
            },
            1: {
              out: 'mffsCurLandCostOut',
              within: 'mffsCurLandCostWithin',
              total: 'mffsCurLandTotal',
              except: 'mffsCurLandexceptCapVal',
            },
            2: {
              out: 'mffsCurConsCostOut',
              within: 'mffsCurConsCostWithin',
              total: 'mffsCurConsCostTotal',
              except: 'mffsCurConsExcepCapVal',
            },
            3: {
              out: 'mffsCurrentMktgExpOut',
              within: 'mffsCurrentMktgExpWithin',
              total: 'mffsCurrentMktgExpTotal',
              except: 'mffsCurrentmktgExcepCapVal',
            },
            4: {
              out: 'mffsCurProjMgmtExpOut',
              within: 'mffsCurProjMgmtExpWithin',
              total: 'mffsCurProjMgmtExpTotal',
              except: 'mffsCurProjExcepCapVal',
            },
            5: {
              out: 'currentMortgageOut',
              within: 'mffsCurrentMortgageWithin',
              total: 'mffsCurrentMortgageTotal',
              except: 'mffsCurMortgageExceptCapVal',
            },
            6: {
              out: 'mffsCurrentVatPaymentOut',
              within: 'mffsCurrentVatPaymentWithin',
              total: 'mffsCurrentVatPaymentTotal',
              except: 'mffsCurVatExceptCapVal',
            },
            7: {
              out: 'mffsCurrentOqoodOut',
              within: 'mffsCurrentOqoodWithin',
              total: 'mffsCurrentOqoodTotal',
              except: 'mffsCurOqoodExceptCapVal',
            },
            8: {
              out: 'mffsCurrentRefundOut',
              within: 'mffsCurrentRefundWithin',
              total: 'mffsCurrentRefundTotal',
              except: 'mffsCurRefundExceptCapVal',
            },
            9: {
              out: 'mffsCurBalInRetenAccOut',
              within: 'mffsCurBalInRetenAccWithin',
              total: 'mffsCurBalInRetenAccTotal',
              except: 'mffsCurBalInRetenExceptCapVal',
            },
            10: {
              out: 'mffsCurBalInTrustAccOut',
              within: 'mffsCurBalInTrustAccWithin',
              total: 'mffsCurBalInTrustAccTotal',
              except: 'mffsCurBalInExceptCapVal',
            },
            11: {
              out: 'mffsCurBalInSubsConsOut',
              within: 'mffsCurBalInRSubsConsWithin',
              total: 'mffsCurBalInSubsConsTotal',
              except: 'mffsCurBalInSubsConsCapVal',
            },
            12: {
              out: 'mffsCurTechnFeeOut',
              within: 'mffsCurTechnFeeWithin',
              total: 'mffsCurTechnFeeTotal',
              except: 'mffsCurTechFeeExceptCapVal',
            },
            13: {
              out: 'mffsCurUnIdeFundOut',
              within: 'mffsCurUnIdeFundWithin',
              total: 'mffsCurUnIdeFundTotal',
              except: 'mffsCurUnIdeExceptCapVal',
            },
            14: {
              out: 'mffsCurLoanInstalOut',
              within: 'mffsCurLoanInstalWithin',
              total: 'mffsCurLoanInstalTotal',
              except: 'mffsCurLoanExceptCapVal',
            },
            15: {
              out: 'mffsCurInfraCostOut',
              within: 'mffsCurInfraCostWithin',
              total: 'mffsCurInfraCostTotal',
              except: 'mffsCurInfraExceptCapVal',
            },
            16: {
              out: 'mffsCurOthersCostOut',
              within: 'mffsCurOthersCostWithin',
              total: 'mffsCurOthersCostTotal',
              except: 'mffsCurOthersExceptCapVal',
            },
            17: {
              out: 'mffsCurTransferCostOut',
              within: 'mffsCurTransferCostWithin',
              total: 'mffsCurTransferCostTotal',
              except: 'mffsCurTransferExceptCapVal',
            },
            18: {
              out: 'mffsCurForfeitCostOut',
              within: 'mffsCurForfeitCostWithin',
              total: 'mffsCurForfeitCostTotal',
              except: 'mffsCurForfeitExceptCapVal',
            },
            19: {
              out: 'mffsCurDeveEqtycostOut',
              within: 'mffsCurDeveEqtycostWithin',
              total: 'mffsCurDeveEqtycostTotal',
              except: 'mffsCurDeveExceptCapVal',
            },
            20: {
              out: 'mffsCurAmntFundOut',
              within: 'mffsCurAmntFundWithin',
              total: 'mffsCurAmntFundTotal',
              except: 'mffsCurAmntExceptCapVal',
            },
            21: {
              out: 'mffsCurOtherWithdOut',
              within: 'mffsCurOtherWithdWithin',
              total: 'mffsCurOtherWithdTotal',
              except: 'mffsCurOtherExceptCapVal',
            },
            22: {
              out: 'mffsCurOqoodOthFeeOut',
              within: 'mffsCurOqoodOthFeeWithin',
              total: 'mffsCurOqoodOthFeeTotal',
              except: 'mffsOtherFeesAnPaymentExcepVal',
            },
            23: {
              out: 'mffsCurVatDepositOut',
              within: 'mffsCurVatDepositWithin',
              total: 'mffsCurVatDepositTotal',
              except: 'mffsCurVatDepositCapVal',
            },
          }

          const breakdown = Array(24)
            .fill(null)
            .map((_, index) => {
              const m = breakdownMap[index]
              if (!m) {
                return {
                  outOfEscrow: '',
                  withinEscrow: '',
                  total: '',
                  exceptionalCapValue: '',
                }
              }
              
              // Explicitly access each field to ensure we get the correct mapping
              const outValue = fd.hasOwnProperty(m.out) ? fd[m.out] : undefined
              const withinValue = fd.hasOwnProperty(m.within) ? fd[m.within] : undefined
              const totalValue = fd.hasOwnProperty(m.total) ? fd[m.total] : undefined
              const exceptValue = fd.hasOwnProperty(m.except) ? fd[m.except] : undefined
              
              return {
                outOfEscrow:
                  outValue != null && outValue !== undefined && outValue !== ''
                    ? String(outValue)
                    : '',
                withinEscrow:
                  withinValue != null && withinValue !== undefined && withinValue !== ''
                    ? String(withinValue)
                    : '',
                total:
                  totalValue != null && totalValue !== undefined && totalValue !== ''
                    ? String(totalValue)
                    : '',
                exceptionalCapValue:
                  exceptValue != null && exceptValue !== undefined && exceptValue !== ''
                    ? String(exceptValue)
                    : '',
              }
            })

          const normalized = {
            estimate: {
              revenue: fd.mffsEstRevenue?.toString() || '',
              constructionCost: fd.mffsEstConstructionCost?.toString() || '',
              projectManagementExpense:
                fd.mffsEstProjectMgmtExpense?.toString() || '',
              landCost: fd.mffsEstLandCost?.toString() || '',
              marketingExpense: fd.mffsEstMarketingExpense?.toString() || '',
              date: fd.mffsEstimatedDate
                ? new Date(fd.mffsEstimatedDate)
                : null,
            },
            actual: {
              soldValue: fd.mffsActualSoldValue?.toString() || '',
              constructionCost:
                fd.mffsActualConstructionCost?.toString() || '',
              infraCost: fd.mffsActualInfraCost?.toString() || '',
              landCost: fd.mffsActualLandCost?.toString() || '',
              projectManagementExpense:
                fd.mffsActualProjectMgmtExpense?.toString() || '',
              marketingExpense: fd.mffsActualMarketingExp?.toString() || '',
              date: fd.mffsActualDate ? new Date(fd.mffsActualDate) : null,
            },
            breakdown,
            additional: {
              creditInterestRetention: fd.mffsCreditInterest?.toString() || '',
              paymentsRetentionAccount:
                fd.mffsPaymentForRetentionAcc?.toString() || '',
              reimbursementsDeveloper:
                fd.mffsDeveloperReimburse?.toString() || '',
              unitRegistrationFees: fd.mffsUnitRegFees?.toString() || '',
              creditInterestEscrow:
                fd.mffsCreditInterestProfit?.toString() || '',
              vatCapped: fd.mffsVatCappedCost?.toString() || '',
            },
          }

          const breakdownSectionTitles = [
            getLabel(
              'CDL_MF_CASH_FROM_UNIT',
              language,
              'Cash Inflow from Unit Holders'
            ),
            getLabel(
              'CDL_MF_LAND_ACQ_COST',
              language,
              'Land Acquisition Cost'
            ),
            getLabel('CDL_MF_BUILD_COST', language, 'Build Cost'),
            getLabel('CDL_MF_MARK_EXP', language, 'Marketing Expense'),
            getLabel(
              'CDL_MF_ASST_MGMT_EXP',
              language,
              'Asset Management Expense'
            ),
            getLabel('CDL_MF_MORTGAGE_AMT', language, 'Mortgage Amount'),
            getLabel('CDL_MF_VAT_AMT', language, 'VAT Payment'),
            getLabel('CDL_MF_TOTAL_AMOUNT', language, 'Total Amount'),
            getLabel('CDL_MF_REFUND_AMT', language, 'Refund Amount'),
            getLabel(
              'CDL_MF_RETEN_ACC_BAL',
              language,
              'Retention Account Balance'
            ),
            getLabel(
              'CDL_MF_TRUST_ACC_BAL',
              language,
              'Trust Account Balance'
            ),
            getLabel(
              'CDL_MF_SUBCONS_ACC_BAL',
              language,
              'Sub-Construction Account Balance'
            ),
            getLabel('CDL_MF_TECH_FEES', language, 'Technical Fees'),
            getLabel('CDL_MF_UNALLO_COST', language, 'Unallocated Costs'),
            getLabel('CDL_MF_LOAN', language, 'Loan/Installment Payments'),
            getLabel(
              'CDL_MF_INFRA_COST',
              language,
              'Infrastructure Development Cost'
            ),
            getLabel('CDL_MF_OTHER_EXP', language, 'Other Expenses'),
            getLabel('CDL_MF_TRANS_AMT', language, 'Transferred Amount'),
            getLabel('CDL_MF_FORFEIT_AMT', language, 'Forfeited Amount'),
            getLabel(
              'CDL_MF_DEV_EQUITY_CONT',
              language,
              'Developer Equity Contribution'
            ),
            getLabel('CDL_MF_AMANAT_FUND', language, 'Amanat Fund Allocation'),
            getLabel('CDL_MF_OTHER_WITHDRAW', language, 'Other Withdrawals'),
            getLabel(
              'CDL_MF_OQOOD_OTHER_PMT',
              language,
              'Oqood and Other Payments'
            ),
            getLabel(
              'CDL_MF_VAT_DEPOSIT_AMT',
              language,
              'VAT Deposited Amount'
            ),
          ]

          return (
            <Card sx={cardStyles}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 500,
                      fontStyle: 'normal',
                      fontSize: '18px',
                      lineHeight: '28px',
                      letterSpacing: '0.15px',
                      verticalAlign: 'middle',
                    }}
                  >
                    {getLabel(
                      'CDL_MF_FINANCIAL',
                      language,
                      'Asset Financial Overview'
                    )}
                  </Typography>
                  {!isViewMode && (
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => onEditStep?.(6)}
                      sx={{
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#2563EB',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#F3F4F6' },
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
                <Divider sx={{ mb: 2 }} />

                {/* Estimated */}
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: '#374151', fontWeight: 600 }}
                    >
                      {getLabel(
                        'CDL_MF_FINANCIAL',
                        language,
                        'Asset Financial Overview'
                      )}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {renderDisplayField(
                      getLabel(
                        'CDL_MF_TOTAL_REVENUE',
                        language,
                        'Total Revenue'
                      ),
                      normalized.estimate.revenue || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {renderDisplayField(
                      getLabel('CDL_MF_BUILD_COST', language, 'Build Cost'),
                      normalized.estimate.constructionCost || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {renderDisplayField(
                      getLabel(
                        'CDL_MF_ASST_MGMT_EXP',
                        language,
                        'Asset Management Expense'
                      ),
                      normalized.estimate.projectManagementExpense || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {renderDisplayField(
                      getLabel(
                        'CDL_MF_LAND_ACQ_COST',
                        language,
                        'Land Acquisition Cost'
                      ),
                      normalized.estimate.landCost || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {renderDisplayField(
                      getLabel(
                        'CDL_MF_MARK_EXP',
                        language,
                        'Marketing Expense'
                      ),
                      normalized.estimate.marketingExpense || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {renderDisplayField(
                      getLabel(
                        'CDL_MF_TRAN_DATE',
                        language,
                        'Transaction Date'
                      ),
                      normalized.estimate.date
                        ? formatDate(
                            normalized.estimate.date as any,
                            'DD/MM/YYYY'
                          )
                        : 'N/A'
                    )}
                  </Grid>
                </Grid>

                {/* Actual */}
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: '#374151', fontWeight: 600, mt: 3 }}
                    >
                      {getLabel(
                        'CDL_MF_ACTUAL_ASSEST_COST',
                        language,
                        'Actual Asset Cost'
                      )}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {renderDisplayField(
                      getLabel(
                        'CDL_MF_TOTAL_UNIT_SOLD',
                        language,
                        'Total Units Sold Value'
                      ),
                      normalized.actual.soldValue || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {renderDisplayField(
                      getLabel('CDL_MF_BUILD_COST', language, 'Build Cost'),
                      normalized.actual.constructionCost || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    {renderDisplayField(
                      getLabel(
                        'CDL_MF_INFRA_COST',
                        language,
                        'Infrastructure Development Cost'
                      ),
                      normalized.actual.infraCost || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    {renderDisplayField(
                      getLabel(
                        'CDL_MF_LAND_ACQ_COST',
                        language,
                        'Land Acquisition Cost'
                      ),
                      normalized.actual.landCost || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    {renderDisplayField(
                      getLabel(
                        'CDL_MF_ASST_MGMT_EXP',
                        language,
                        'Asset Management Expense'
                      ),
                      normalized.actual.projectManagementExpense || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {renderDisplayField(
                      getLabel(
                        'CDL_MF_MARK_EXP',
                        language,
                        'Marketing Expense'
                      ),
                      normalized.actual.marketingExpense || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {renderDisplayField(
                      getLabel(
                        'CDL_MF_TRAN_DATE',
                        language,
                        'Transaction Date'
                      ),
                      normalized.actual.date
                        ? formatDate(
                            normalized.actual.date as any,
                            'DD/MM/YYYY'
                          )
                        : 'N/A'
                    )}
                  </Grid>
                </Grid>

                {/* Breakdown sections */}
                {normalized.breakdown.map((item, i) => (
                  <Box key={i} mb={4}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: '#1E2939',
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 500,
                        fontSize: '18px',
                        lineHeight: '28px',
                        letterSpacing: '0.15px',
                      }}
                    >
                      {breakdownSectionTitles[i]}
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 3 }}>
                        {renderDisplayField(
                          getLabel(
                            'CDL_MF_FUND_OUT_ESCROW',
                            language,
                            'Funds Outside Escrow'
                          ),
                          item.outOfEscrow && item.outOfEscrow.trim() !== '' ? item.outOfEscrow : 'N/A'
                        )}
                      </Grid>
                      <Grid size={{ xs: 12, md: 3 }}>
                        {renderDisplayField(
                          getLabel(
                            'CDL_MF_FUND_WITHIN_ESCROW',
                            language,
                            'Funds Within Escrow'
                          ),
                          item.withinEscrow && item.withinEscrow.trim() !== '' ? item.withinEscrow : 'N/A'
                        )}
                      </Grid>
                      <Grid size={{ xs: 12, md: 3 }}>
                        {renderDisplayField(
                          getLabel(
                            'CDL_MF_TOTAL_AMOUNT',
                            language,
                            'Total Amount'
                          ),
                          item.total && item.total.trim() !== '' ? item.total : 'N/A'
                        )}
                      </Grid>
                      <Grid size={{ xs: 12, md: 3 }}>
                        {renderDisplayField(
                          getLabel(
                            'CDL_MF_EXCEP_CAP_VAL',
                            language,
                            'Exceptional Capital Value'
                          ),
                          item.exceptionalCapValue && item.exceptionalCapValue.trim() !== '' ? item.exceptionalCapValue : 'N/A'
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                ))}

                {/* Additional */}
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {renderDisplayField(
                      getLabel(
                        'CDL_MF_PROFIT_ERND',
                        language,
                        'Credit Interest/Profit Earned for Retention A/c'
                      ),
                      normalized.additional.creditInterestRetention || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {renderDisplayField(
                      getLabel(
                        'CDL_MF_PMT_FRM_RETENTION',
                        language,
                        'Payments for Retention Account'
                      ),
                      normalized.additional.paymentsRetentionAccount || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {renderDisplayField(
                      getLabel(
                        'CDL_MF_REIMB_AMT',
                        language,
                        'Reimbursement Amount'
                      ),
                      normalized.additional.reimbursementsDeveloper || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {renderDisplayField(
                      getLabel(
                        'CDL_BPA_UNIT_REG_FEES',
                        language,
                        'Unit Registration Fees'
                      ),
                      normalized.additional.unitRegistrationFees || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {renderDisplayField(
                      getLabel(
                        'CDL_MF_INT_ERND_ESCROW',
                        language,
                        'Credit Interest/Profit Earned for ESCROW A/c'
                      ),
                      normalized.additional.creditInterestEscrow || 'N/A'
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {renderDisplayField(
                      getLabel('CDL_MF_CAP_VAT_AMT', language, 'VAT Capped*'),
                      normalized.additional.vatCapped || 'N/A'
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )
        })()}

      {/* Project Closure Section */}
      {reviewData.closureData && reviewData.closureData.length > 0 && (
        <Card sx={cardStyles}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '18px',
                  lineHeight: '28px',
                  letterSpacing: '0.15px',
                  verticalAlign: 'middle',
                }}
              >
                {getLabel('CDL_MF_CLOSURE', language, 'Asset Closure')}
              </Typography>
              {!isViewMode && (
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => onEditStep?.(7)} // Navigate to Step 8 (Project Closure)
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#2563EB',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#F3F4F6',
                    },
                  }}
                >
                  Edit
                </Button>
              )}
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                {renderDisplayField(
                  getLabel(
                    'CDL_BPA_TOTAL_INCOME_FUND',
                    language,
                    'Total Income Fund'
                  ),
                  reviewData.closureData[0]?.totalIncomeFund || 'N/A'
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                {renderDisplayField(
                  getLabel('CDL_BPA_TOTAL_PAYMENT', language, 'Total Payment'),
                  reviewData.closureData[0]?.totalPayment || 'N/A'
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default Step8
