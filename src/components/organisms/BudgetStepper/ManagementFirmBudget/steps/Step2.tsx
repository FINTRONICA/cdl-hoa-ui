'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'

import { managementFirmBudgetService } from '@/services/api/budget/managementFirmBudgetService'
import type { BudgetData } from './BudgetType'
import { useBudgetLabels } from '@/hooks/budget/useBudgetLabels'
import { BUDGET_LABELS } from '@/constants/mappings/budgetLabels'
import { buildPartnerService } from '@/services/api/buildPartnerService'
import type { DocumentItem } from '../../../DeveloperStepper/developerTypes'
import { mapApiToBudgetDocumentItem } from '../../../DocumentUpload/configs/budgetConfig'

interface Step2Props {
  onEdit: () => void
  onEditDocuments?: () => void
  isReadOnly?: boolean
}

const formatDate = (value?: string | null) => {
  if (!value) return '-'
  const parsed = dayjs(value)
  return parsed.isValid() ? parsed.format('DD/MM/YYYY') : '-'
}

const Step2: React.FC<Step2Props> = ({
  onEdit,
  onEditDocuments,
  isReadOnly = false,
}) => {
  const params = useParams()
  const [budget, setBudget] = useState<BudgetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [documentsLoading, setDocumentsLoading] = useState(false)
  const [documentsError, setDocumentsError] = useState<string | null>(null)
  const { getLabel } = useBudgetLabels('EN')
  const editLabel = getLabel('CDL_GENERIC_EDIT', 'EN', 'Edit')
  const manageDocumentsLabel = getLabel(
    'CDL_GENERIC_MANAGE_DOCUMENTS',
    'EN',
    'Manage Documents'
  )

  const labelSx = useMemo(
    () => ({
      color: '#6A7282',
      fontFamily: 'Outfit, sans-serif',
      fontWeight: 400,
      fontSize: '12px',
      letterSpacing: 0,
    }),
    []
  )

  const valueSx = useMemo(
    () => ({
      color: '#1E2939',
      fontFamily: 'Outfit, sans-serif',
      fontWeight: 400,
      fontSize: '14px',
      letterSpacing: 0,
      wordBreak: 'break-word',
    }),
    []
  )

  useEffect(() => {
    const loadBudget = async () => {
      const id = params?.id as string | undefined
      if (!id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const result = await managementFirmBudgetService.getBudgetById(id)
        setBudget(result)

        try {
          setDocumentsLoading(true)
          setDocumentsError(null)
          const response = await buildPartnerService.getBudgetDocuments(
            id,
            'BUDGET',
            0,
            100
          )
          const mapped = response.content.map(mapApiToBudgetDocumentItem)
          setDocuments(mapped)
        } catch (docError) {
          setDocumentsError(
            docError instanceof Error
              ? docError.message
              : 'Failed to load documents.'
          )
        } finally {
          setDocumentsLoading(false)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load budget data')
      } finally {
        setLoading(false)
      }
    }

    loadBudget()
  }, [params?.id])

  const fieldBoxSx = useMemo(
    () => ({
      display: 'flex',
      flexDirection: 'column',
      gap: 0.5,
    }),
    []
  )

  const generalInformation = useMemo(() => {
    if (!budget) return []

    return [
      {
        gridSize: 4,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_FIRM_GROUP_ID,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_FIRM_GROUP_ID
        ),
        value: budget.managementFirmGroupId,
      },
      {
        gridSize: 4,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_FIRM_GROUP_NAME,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_FIRM_GROUP_NAME
        ),
        value: budget.managementFirmGroupName,
      },
      {
        gridSize: 4,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_FIRM_GROUP_LOCAL_NAME,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_FIRM_GROUP_LOCAL_NAME
        ),
        value: budget.managementFirmGroupLocalName,
      },
      {
        gridSize: 4,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.MASTER_COMMUNITY_NAME,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MASTER_COMMUNITY_NAME
        ),
        value: budget.masterCommunityName,
      },
      {
        gridSize: 4,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.MASTER_COMMUNITY_LOCAL_NAME,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MASTER_COMMUNITY_LOCAL_NAME
        ),
        value: budget.masterCommunityLocalName,
      },
      {
        gridSize: 4,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_COMPANY_ID,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_COMPANY_ID
        ),
        value: budget.managementCompanyId,
      },
      {
        gridSize: 4,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_COMPANY_NAME,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_COMPANY_NAME
        ),
        value: budget.managementCompanyName,
      },
      {
        gridSize: 4,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_COMPANY_LOCAL_NAME,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_COMPANY_LOCAL_NAME
        ),
        value: budget.managementCompanyLocalName,
      },
      {
        gridSize: 4,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_FIRM_MANAGER_EMAIL,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_FIRM_MANAGER_EMAIL
        ),
        value: budget.managementFirmManagerEmail,
      },
      {
        gridSize: 4,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.SERVICE_CHARGE_GROUP_NAME,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_CHARGE_GROUP_NAME
        ),
        value: budget.serviceChargeGroupName,
      },
      {
        gridSize: 4,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.SERVICE_CHARGE_GROUP_LOCAL_NAME,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_CHARGE_GROUP_LOCAL_NAME
        ),
        value: budget.serviceChargeGroupLocalName,
      },
    ]
  }, [budget, getLabel])

  const budgetPeriod = useMemo(() => {
    if (!budget) return []

    return [
      {
        gridSize: 3,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_CODE,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.BUDGET_PERIOD_CODE
        ),
        value: budget.budgetPeriodCode,
      },
      {
        gridSize: 3,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_TITLE,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.BUDGET_PERIOD_TITLE
        ),
        value: budget.budgetPeriodTitle,
      },
      {
        gridSize: 3,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_FROM,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.BUDGET_PERIOD_FROM
        ),
        value: formatDate(budget.budgetPeriodFrom),
      },
      {
        gridSize: 3,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_TO,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.BUDGET_PERIOD_TO
        ),
        value: formatDate(budget.budgetPeriodTo),
      },
    ]
  }, [budget, getLabel])

  const categorisation = useMemo(() => {
    if (!budget) return []

    return [
      {
        gridSize: 3,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.CATEGORY_CODE,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_CODE
        ),
        value: budget.categoryCode,
      },
      {
        gridSize: 3,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.CATEGORY_NAME,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_NAME
        ),
        value: budget.categoryName,
      },
      {
        gridSize: 3,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.CATEGORY_LOCAL_NAME,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_LOCAL_NAME
        ),
        value: budget.categoryLocalName,
      },
      {
        gridSize: 3,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.SUB_CATEGORY_CODE,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SUB_CATEGORY_CODE
        ),
        value: budget.subCategoryCode,
      },
      {
        gridSize: 3,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.SUB_CATEGORY_NAME,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SUB_CATEGORY_NAME
        ),
        value: budget.subCategoryName,
      },
      {
        gridSize: 3,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.SUB_CATEGORY_LOCAL_NAME,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SUB_CATEGORY_LOCAL_NAME
        ),
        value: budget.subCategoryLocalName,
      },
      {
        gridSize: 3,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.SERVICE_CODE,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_CODE
        ),
        value: budget.serviceCode,
      },
      {
        gridSize: 3,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.SERVICE_NAME,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_NAME
        ),
        value: budget.serviceName,
      },
      {
        gridSize: 3,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.SERVICE_LOCAL_NAME,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_LOCAL_NAME
        ),
        value: budget.serviceLocalName,
      },
    ]
  }, [budget, getLabel])

  const formatNumber = useCallback((value?: string | number | null) => {
    if (value === null || value === undefined || value === '') {
      return '-'
    }

    const numericValue = typeof value === 'string' ? Number(value) : value

    if (Number.isNaN(numericValue as number)) {
      return value?.toString() ?? '-'
    }

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(numericValue))
  }, [])

  const formatFileSize = useCallback((size?: number) => {
    if (!size) return '-'
    if (size < 1024) {
      return `${size} B`
    }
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`
    }
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }, [])

  const financials = useMemo(() => {
    if (!budget) return []

    return [
      {
        gridSize: 3,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.TOTAL_COST,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.TOTAL_COST
        ),
        value: formatNumber(budget.totalCost),
      },
      {
        gridSize: 3,
        label: getLabel(
          BUDGET_LABELS.FORM_FIELDS.VAT_AMOUNT,
          'EN',
          BUDGET_LABELS.FALLBACKS.FORM_FIELDS.VAT_AMOUNT
        ),
        value: formatNumber(budget.vatAmount),
      },
      {
        gridSize: 3,
        label: 'Created At',
        value: budget.createdAt ? formatDate(budget.createdAt) : '-',
      },
      {
        gridSize: 3,
        label: 'Last Updated',
        value: budget.updatedAt ? formatDate(budget.updatedAt) : '-',
      },
    ]
  }, [budget, formatNumber, getLabel])

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight={320}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading budget summary...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight={320}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  if (!budget) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight={320}>
        <Typography>
          {getLabel(
            BUDGET_LABELS.LIST.EMPTY_STATE,
            'EN',
            BUDGET_LABELS.FALLBACKS.LIST.EMPTY_STATE
          )}
        </Typography>
      </Box>
    )
  }

  const renderDisplayField = (
    label: string,
    value: string | number | null | undefined = '-'
  ) => (
    <Box sx={fieldBoxSx}>
      <Typography sx={labelSx}>{label}</Typography>
      <Typography sx={valueSx}>{value ?? '-'}</Typography>
    </Box>
  )

  const renderCheckboxField = (label: string, checked: boolean) => (
    <FormControlLabel
      control={<Checkbox checked={checked} disabled />}
      label={label}
      sx={{
        '& .MuiFormControlLabel-label': {
          fontFamily: 'Outfit, sans-serif',
          fontSize: '14px',
          lineHeight: '24px',
          letterSpacing: '0.5px',
        },
      }}
    />
  )

  const Section = ({
    title,
    fields,
  }: {
    title: string
    fields: {
      gridSize: number
      label: string
      value: string | number | boolean | null
    }[]
  }) => (
    <Box mb={4}>
      <Typography
        variant="h6"
        fontWeight={600}
        sx={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '18px',
          lineHeight: '28px',
        }}
        gutterBottom
      >
        {title}
      </Typography>
      <Grid container rowSpacing={3} columnSpacing={3} sx={{ mt: 1 }}>
        {fields.map((field, idx) => (
          <Grid size={{ xs: 12, md: field.gridSize }} key={`${title}-${idx}`}>
            {typeof field.value === 'boolean'
              ? renderCheckboxField(field.label, field.value)
              : renderDisplayField(field.label, field.value as string | number | null)}
          </Grid>
        ))}
      </Grid>
    </Box>
  )

  return (
    <Card
      sx={{
        backgroundColor: '#FFFFFFBF',
        boxShadow: 'none',
        width: '94%',
        margin: '0 auto',
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={600} sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px' }}>
            {getLabel(
              BUDGET_LABELS.REVIEW.SUMMARY_TITLE,
              'EN',
              BUDGET_LABELS.FALLBACKS.REVIEW.SUMMARY_TITLE
            )}
          </Typography>
          {!isReadOnly && (
            <Box display="flex" gap={1}>
              <Button
                startIcon={<EditIcon />}
                onClick={onEdit}
                sx={{ textTransform: 'none', color: '#2563EB', '&:hover': { backgroundColor: '#DBEAFE' } }}
              >
                {editLabel}
              </Button>
              {onEditDocuments && (
                <Button
                  startIcon={<EditIcon />}
                  onClick={onEditDocuments}
                  sx={{ textTransform: 'none', color: '#2563EB', '&:hover': { backgroundColor: '#DBEAFE' } }}
                >
                  {manageDocumentsLabel}
                </Button>
              )}
            </Box>
          )}
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Section
          title={getLabel(
            BUDGET_LABELS.REVIEW.GENERAL_SECTION,
            'EN',
            BUDGET_LABELS.FALLBACKS.REVIEW.GENERAL_SECTION
          )}
          fields={generalInformation}
        />

        <Section
          title={getLabel(
            BUDGET_LABELS.REVIEW.PERIOD_SECTION,
            'EN',
            BUDGET_LABELS.FALLBACKS.REVIEW.PERIOD_SECTION
          )}
          fields={budgetPeriod}
        />

        <Section
          title={getLabel(
            BUDGET_LABELS.REVIEW.CATEGORIZATION_SECTION,
            'EN',
            BUDGET_LABELS.FALLBACKS.REVIEW.CATEGORIZATION_SECTION
          )}
          fields={categorisation}
        />

        <Section
          title={getLabel(
            BUDGET_LABELS.REVIEW.FINANCIALS_SECTION,
            'EN',
            BUDGET_LABELS.FALLBACKS.REVIEW.FINANCIALS_SECTION
          )}
          fields={financials}
        />

        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', lineHeight: '28px' }}
            >
              {getLabel(
                BUDGET_LABELS.DOCUMENTS.TITLE,
                'EN',
                BUDGET_LABELS.FALLBACKS.DOCUMENTS.TITLE
              )}
            </Typography>
            {!isReadOnly && onEditDocuments && (
              <Button
                startIcon={<EditIcon />}
                onClick={onEditDocuments}
                sx={{ textTransform: 'none', color: '#2563EB', '&:hover': { backgroundColor: '#DBEAFE' } }}
              >
                {manageDocumentsLabel}
              </Button>
            )}
          </Box>
          <Divider sx={{ mt: 1, mb: 3 }} />

          {documentsLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress size={24} />
              <Typography sx={{ ml: 2 }}>Loading documents...</Typography>
            </Box>
          ) : documentsError ? (
            <Typography variant="body2" color="error">
              {documentsError}
            </Typography>
          ) : documents.length > 0 ? (
            <TableContainer component={Paper} sx={{ boxShadow: 'none', backgroundColor: '#FFFFFFBF' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ ...labelSx, fontWeight: 600 }}>Document Name</TableCell>
                    <TableCell sx={{ ...labelSx, fontWeight: 600 }}>Document Type</TableCell>
                    <TableCell sx={{ ...labelSx, fontWeight: 600 }}>Upload Date</TableCell>
                    <TableCell sx={{ ...labelSx, fontWeight: 600 }} align="right">
                      Size
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell sx={valueSx}>{document.name}</TableCell>
                      <TableCell sx={valueSx}>{document.classification ?? 'N/A'}</TableCell>
                      <TableCell sx={valueSx}>
                        {document.uploadDate
                          ? formatDate(document.uploadDate.toISOString())
                          : '-'}
                      </TableCell>
                      <TableCell sx={valueSx} align="right">
                        {formatFileSize(document.size)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography sx={{ ...valueSx, py: 2 }}>
              {getLabel(
                'CDL_GENERIC_NO_DOCUMENTS',
                'EN',
                'No documents uploaded yet.'
              )}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default Step2
