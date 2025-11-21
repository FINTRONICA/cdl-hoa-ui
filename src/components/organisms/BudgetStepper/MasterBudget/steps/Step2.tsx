'use client'

import { useBudgetLabelsWithCache } from '@/hooks/budget/useBudgetLabelsWithCache'
import { useAppStore } from '@/store'
import React from 'react'
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { useRouter } from 'next/navigation'
import { useGetEnhanced } from '@/hooks/useApiEnhanced'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

import { GlobalLoading } from '@/components/atoms'
import { buildPartnerService } from '@/services/api/buildPartnerService'
import { MASTER_BUDGET_LABELS } from '@/constants/mappings/budgetLabels'
import { type BudgetCategoryResponse } from '@/services/api/budgetApi/budgetCategoryService'
import { useParams } from 'next/navigation'
import { formatDate } from '@/utils'
import type {
  ApiDocumentResponse,
  PaginatedDocumentResponse,
} from '../../../DeveloperStepper/developerTypes'

const labelSx = {
  color: '#6A7282',
  fontFamily: 'Outfit',
  fontWeight: 400,
  fontStyle: 'normal',
  fontSize: '12px',
  letterSpacing: 0,
}

const valueSx = {
  color: '#1E2939',
  fontFamily: 'Outfit',
  fontWeight: 400,
  fontStyle: 'normal',
  fontSize: '14px',
  letterSpacing: 0,
  wordBreak: 'break-word',
}

const fieldBoxSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
}

const renderDisplayField = (
  label: string,
  value: string | number | null = '-'
) => (
  <Box sx={fieldBoxSx}>
    <Typography sx={labelSx}>{label}</Typography>
    <Typography sx={valueSx}>{value || '-'}</Typography>
  </Box>
)

const SectionLoader = ({ sectionName }: { sectionName: string }) => (
  <Box
    sx={{
      backgroundColor: '#FFFFFFBF',
      borderRadius: '16px',
      margin: '0 auto',
      width: '100%',
      height: '120px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    aria-label={`${sectionName} loading`}
    role="status"
  >
    <GlobalLoading fullHeight className="min-h-[120px]" />
  </Box>
)

const SectionError = ({
  sectionName,
  error,
}: {
  sectionName: string
  error: Error
}) => (
  <Box
    sx={{
      border: '1px solid #FECACA',
      borderRadius: 1,
      backgroundColor: '#FEF2F2',
      p: 2,
    }}
  >
    <Typography variant="body2" color="error">
      Failed to load {sectionName}: {error.message}
    </Typography>
  </Box>
)

const renderSectionContent = (
  sectionName: string,
  isLoading: boolean,
  error: Error | null,
  content: React.ReactNode
) => {
  if (isLoading) {
    return <SectionLoader sectionName={sectionName} />
  }
  if (error) {
    return <SectionError sectionName={sectionName} error={error} />
  }
  return content
}

interface Step2Props {
  onEdit?: () => void
  onEditDocuments?: () => void
  isReadOnly?: boolean
  budgetId?: string | null
}

const Step2: React.FC<Step2Props> = ({
  onEdit,
  onEditDocuments,
  isReadOnly = false,
  budgetId: propBudgetId,
}) => {
  const router = useRouter()
  const params = useParams()
  const { getLabel } = useBudgetLabelsWithCache('EN')
  const currentLanguage = useAppStore((state) => state.language)

  // Get budgetId from prop (preferred) or from URL params (fallback)
  const budgetId = propBudgetId || (params?.id as string | undefined)

  const handleEditBasicDetails = () => {
    if (onEdit) {
      onEdit()
    } else if (budgetId) {
      router.push(`/budget/budget-master/new/${budgetId}?step=0`)
    }
  }




  const {
    data: budgetData,
    isLoading: isLoadingBasic,
    error: errorBasic,
  } = useGetEnhanced<BudgetCategoryResponse>(
    API_ENDPOINTS.BUDGET_CATEGORY.GET_BY_ID(budgetId?.toString() || ''),
    {},
    {
      enabled: !!budgetId,
      // Disable caching to always fetch fresh data
      gcTime: 0,
      staleTime: 0,
      // Always refetch when component mounts
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
    }
  )



  const [documents, setDocuments] = React.useState<DocumentData[]>([])
  const [isLoadingDocuments, setIsLoadingDocuments] = React.useState(false)
  const [documentsError, setDocumentsError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (!budgetId) {
      setDocuments([])
      setDocumentsError(null)
      return
    }

    const loadDocuments = async () => {
      setIsLoadingDocuments(true)
      setDocumentsError(null)

      try {
        console.log('[Step2] Fetching documents for budgetId:', budgetId, 'module: BUDGET_CATEGORY')
        console.log('[Step2] budgetId type:', typeof budgetId, 'value:', budgetId)
        
        // Ensure budgetId is a string (API expects string for recordId)
        const entityId = budgetId?.toString() || ''
        console.log('[Step2] Calling getBuildPartnerDocuments with entityId:', entityId)
        
        const response = await buildPartnerService.getBuildPartnerDocuments(
          entityId,
          'BUDGET_CATEGORY',
          0,
          1000
        )

        console.log('[Step2] Documents API response:', response)
        console.log('[Step2] Response type:', typeof response)
        console.log('[Step2] Is array?', Array.isArray(response))
        console.log('[Step2] Has content?', response && 'content' in response)

        let apiDocuments: ApiDocumentResponse[] = []

        if (Array.isArray(response)) {
          console.log('[Step2] Response is array, length:', response.length)
          apiDocuments = response as ApiDocumentResponse[]
        } else if (response && typeof response === 'object' && 'content' in response) {
          const paginated = response as PaginatedDocumentResponse
          console.log('[Step2] Response is paginated, content length:', paginated?.content?.length || 0)
          apiDocuments = Array.isArray(paginated?.content) ? paginated.content : []
        } else {
          console.warn('[Step2] Unexpected response format:', response)
        }

        console.log('[Step2] Extracted apiDocuments:', apiDocuments)
        console.log('[Step2] Number of documents:', apiDocuments.length)

        // Map documents similar to reference code
        const mappedDocuments: DocumentData[] = apiDocuments.map((doc, index) => {
          const mapped = {
            id: doc.id?.toString() || `doc-${index}`,
            fileName: doc.documentName || '',
            documentType: doc.documentTypeDTO?.languageTranslationId?.configValue || 
                         doc.documentType?.settingValue || 
                         '',
            uploadDate: doc.uploadDate || '',
            fileSize: parseInt(doc.documentSize?.replace(' bytes', '') || '0'),
          }
          console.log(`[Step2] Mapped document ${index}:`, mapped)
          return mapped
        })

        console.log('[Step2] Final mapped documents:', mappedDocuments)
        setDocuments(mappedDocuments)
      } catch (error) {
        console.error('[Step2] Error loading documents:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to load documents'
        console.error('[Step2] Error message:', errorMessage)
        setDocumentsError(new Error(errorMessage))
        setDocuments([]) // Clear documents on error
      } finally {
        setIsLoadingDocuments(false)
      }
    }

    loadDocuments()
  }, [budgetId])

  interface DocumentData {
    id: string
    fileName: string
    documentType: string
    uploadDate: string
    fileSize: number
  }

  const getBasicFields = () => {
    if (!budgetData) return []

    return [
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.CHARGE_TYPE,
          currentLanguage,
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CHARGE_TYPE
        ),
        value: budgetData.chargeType || '-',
      },
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.GROUP_NAME,
          currentLanguage,
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.GROUP_NAME
        ),
        value: budgetData.serviceChargeGroupName || '-',
      },
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_CODE,
          currentLanguage,
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_CODE
        ),
        value: budgetData.categoryCode || '-',
      },
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_NAME,
          currentLanguage,
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_NAME
        ),
        value: budgetData.categoryName || '-',
      },
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_CODE,
          currentLanguage,
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_SUB_CODE
        ),
        value: budgetData.categorySubCode || '-',
      },
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_NAME,
          currentLanguage,
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_SUB_NAME
        ),
        value: budgetData.categorySubName || '-',
      },
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_TO_SUB_CODE,
          currentLanguage,
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_SUB_TO_SUB_CODE
        ),
        value: budgetData.categorySubToSubCode || '-',
      },
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_SUB_TO_SUB_NAME,
          currentLanguage,
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_SUB_TO_SUB_NAME
        ),
        value: budgetData.categorySubToSubName || '-',
      },
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.SERVICE_CODE,
          currentLanguage,
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_CODE
        ),
        value: budgetData.serviceCode || '-',
      },
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.SERVICE_NAME,
          currentLanguage,
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_NAME
        ),
        value: budgetData.serviceName || '-',
      },
      {
        gridSize: 3,
        label: getLabel(
          MASTER_BUDGET_LABELS.FORM_FIELDS.PROVISIONAL_BUDGET_CODE,
          currentLanguage,
          MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.PROVISIONAL_BUDGET_CODE
        ),
        value: budgetData.provisionalBudgetCode || '-',
      },
    ]
  }

  const basicFields = getBasicFields()

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Card
        sx={{
          boxShadow: 'none',
          backgroundColor: '#FFFFFF',
          width: '100%',
          margin: '0 auto',
          mb: 3,
          border: '1px solid #E5E7EB',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
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
              {getLabel(
                MASTER_BUDGET_LABELS.SECTION_TITLES.GENERAL,
                currentLanguage,
                MASTER_BUDGET_LABELS.FALLBACKS.SECTION_TITLES.GENERAL
              )}
            </Typography>
            {!isReadOnly && (
              <Button
                startIcon={<EditIcon />}
                variant="outlined"
                onClick={handleEditBasicDetails}
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
          <Divider sx={{ mb: 3, borderColor: '#E5E7EB' }} />
          {renderSectionContent(
            getLabel(
              MASTER_BUDGET_LABELS.SECTION_TITLES.GENERAL,
              currentLanguage,
              MASTER_BUDGET_LABELS.FALLBACKS.SECTION_TITLES.GENERAL
            ),
            isLoadingBasic,
            errorBasic,
            <Grid container spacing={3}>
              {basicFields.map((field, idx) => (
                <Grid size={{ xs: 12, md: field.gridSize }} key={`basic-${idx}`}>
                  {renderDisplayField(field.label, field.value)}
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Submitted Documents Section - Always show, similar to reference */}
      <Card
        sx={{
          boxShadow: 'none',
          backgroundColor: '#FFFFFF',
          width: '100%',
          margin: '0 auto',
          mb: 3,
          border: '1px solid #E5E7EB',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
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
              {getLabel(
                MASTER_BUDGET_LABELS.DOCUMENTS.TITLE,
                currentLanguage,
                MASTER_BUDGET_LABELS.FALLBACKS.DOCUMENTS.TITLE
              )}
            </Typography>
            {!isReadOnly && budgetId && (
              <Button
                startIcon={<EditIcon />}
                variant="outlined"
                onClick={() => {
                  if (onEditDocuments) {
                    onEditDocuments()
                  } else {
                    router.push(`/budget/budget-master/${budgetId}?editing=true&step=1`)
                  }
                }}
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
          {renderSectionContent(
            getLabel(
              MASTER_BUDGET_LABELS.DOCUMENTS.TITLE,
              currentLanguage,
              MASTER_BUDGET_LABELS.FALLBACKS.DOCUMENTS.TITLE
            ),
            isLoadingDocuments,
            documentsError,
            documents.length > 0 ? (
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
                    {documents.map((doc, index) => (
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
                          {doc.documentType || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '14px',
                  color: '#6B7280',
                  p: 2,
                }}
              >
                {getLabel(
                  MASTER_BUDGET_LABELS.DOCUMENTS.DESCRIPTION,
                  currentLanguage,
                  'No documents uploaded.'
                )}
              </Typography>
            )
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default Step2
export type { Step2Props }
