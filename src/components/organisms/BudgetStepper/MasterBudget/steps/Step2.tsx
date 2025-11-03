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
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'

import { masterBudgetService } from '@/services/api/budget/masterBudgetService'
import type { MasterBudgetData } from './MasterBudgetType'
import { useBudgetLabels } from '@/hooks/budget/useBudgetLabels'
import { MASTER_BUDGET_LABELS } from '@/constants/mappings/budgetLabels'
import { buildPartnerService } from '@/services/api/buildPartnerService'
import type { DocumentItem } from '../../../DeveloperStepper/developerTypes'
import { mapApiToBudgetDocumentItem } from '../../../DocumentUpload/configs/budgetConfig'

interface MasterBudgetStep2Props {
  onEdit: () => void
  onEditDocuments?: () => void
  isReadOnly?: boolean
}

const formatDate = (value?: string | null) => {
  if (!value) return '-'
  const parsed = dayjs(value)
  return parsed.isValid() ? parsed.format('DD/MM/YYYY') : '-'
}

const MasterBudgetStep2: React.FC<MasterBudgetStep2Props> = ({
  onEdit,
  onEditDocuments,
  isReadOnly = false,
}) => {
  const params = useParams()
  const [budget, setBudget] = useState<MasterBudgetData | null>(null)
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
        const result = await masterBudgetService.getBudgetById(id)
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
        setError(err instanceof Error ? err.message : 'Failed to load master budget data')
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
          MASTER_BUDGET_LABELS.FORM_FIELDS.CHARGE_TYPE_ID,
          'EN',
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CHARGE_TYPE_ID
        ),
        value: String(budget.chargeTypeId),
      },
      {
        gridSize: 4,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.CHARGE_TYPE,
          'EN',
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CHARGE_TYPE
        ),
        value: budget.chargeType,
      },
      {
        gridSize: 4,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.GROUP_NAME,
          'EN',
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.GROUP_NAME
        ),
        value: budget.groupName,
      },
    ]
  }, [budget, getLabel])

  const categorisation = useMemo(() => {
    if (!budget) return []

    return [
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_CODE,
          'EN',
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_CODE
        ),
        value: budget.categoryCode,
      },
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_NAME,
          'EN',
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_NAME
        ),
        value: budget.categoryName,
      },
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_CODE,
          'EN',
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_SUB_CODE
        ),
        value: budget.categorySubCode,
      },
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_NAME,
          'EN',
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_SUB_NAME
        ),
        value: budget.categorySubName,
      },
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_TO_SUB_CODE,
          'EN',
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_SUB_TO_SUB_CODE
        ),
        value: budget.categorySubToSubCode,
      },
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_TO_SUB_NAME,
          'EN',
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_SUB_TO_SUB_NAME
        ),
        value: budget.categorySubToSubName,
      },
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.SERVICE_CODE,
          'EN',
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_CODE
        ),
        value: budget.serviceCode,
      },
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.SERVICE_NAME,
          'EN',
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_NAME
        ),
        value: budget.serviceName,
      },
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.PROVISIONAL_BUDGET_CODE,
          'EN',
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.PROVISIONAL_BUDGET_CODE
        ),
        value: budget.provisionalBudgetCode,
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
  }, [budget, getLabel])

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

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight={320}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading master budget summary...</Typography>
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
            MASTER_BUDGET_LABELS.LIST.EMPTY_STATE,
            'EN',
            MASTER_BUDGET_LABELS.FALLBACKS.LIST.EMPTY_STATE
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

  const Section = ({
    title,
    fields,
  }: {
    title: string
    fields: {
      gridSize: number
      label: string
      value: string | number | null
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
            {renderDisplayField(field.label, field.value)}
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
              MASTER_BUDGET_LABELS.REVIEW.SUMMARY_TITLE,
              'EN',
              MASTER_BUDGET_LABELS.FALLBACKS.REVIEW.SUMMARY_TITLE
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
            MASTER_BUDGET_LABELS.REVIEW.GENERAL_SECTION,
            'EN',
            MASTER_BUDGET_LABELS.FALLBACKS.REVIEW.GENERAL_SECTION
          )}
          fields={generalInformation}
        />

        <Section
          title={getLabel(
            MASTER_BUDGET_LABELS.REVIEW.CATEGORIZATION_SECTION,
            'EN',
            MASTER_BUDGET_LABELS.FALLBACKS.REVIEW.CATEGORIZATION_SECTION
          )}
          fields={categorisation}
        />

        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', lineHeight: '28px' }}
            >
              {getLabel(
                MASTER_BUDGET_LABELS.DOCUMENTS.TITLE,
                'EN',
                MASTER_BUDGET_LABELS.FALLBACKS.DOCUMENTS.TITLE
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

export default MasterBudgetStep2

