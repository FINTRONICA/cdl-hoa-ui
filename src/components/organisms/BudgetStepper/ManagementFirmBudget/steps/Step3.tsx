'use client'

import { useBudgetManagementFirmLabelsApi } from '@/hooks/useBudgetManagementFirmLabelsApi'
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
  Alert,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { useRouter } from 'next/navigation'
import { GlobalLoading } from '@/components/atoms'
import { budgetService } from '@/services/api/budgetApi/budgetService'
import type { BudgetUIData } from '@/services/api/budgetApi/budgetService'
import { BUDGET_LABELS } from '@/constants/mappings/budgetLabels'

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

interface Step3Props {
  budgetId?: number | null
  isViewMode?: boolean
}

const Step3: React.FC<Step3Props> = ({
  budgetId,
  isViewMode = false,
}) => {
  const router = useRouter()
  const { getLabel } = useBudgetManagementFirmLabelsApi()
  const currentLanguage = useAppStore((state) => state.language)
  const [budgetData, setBudgetData] = React.useState<BudgetUIData | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    const loadBudgetData = async () => {
      if (budgetId) {
        try {
          setIsLoading(true)
          setError(null)
          const data = await budgetService.getBudgetById(budgetId)
          setBudgetData(data)
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to load budget'))
        } finally {
          setIsLoading(false)
        }
      }
    }
    loadBudgetData()
  }, [budgetId])

  const handleEditBasicDetails = () => {
    if (budgetId) {
      router.push(`/budget/budget-management-firm/${budgetId}/step/1?editing=true`)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <GlobalLoading />
      </Box>
    )
  }

  if (error) {
    return (
      <Card sx={{ boxShadow: 'none', backgroundColor: '#FFFFFFBF', width: '84%', margin: '0 auto' }}>
        <CardContent>
          <Alert severity="error">
            {error.message}
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!budgetData) {
    return (
      <Card sx={{ boxShadow: 'none', backgroundColor: '#FFFFFFBF', width: '84%', margin: '0 auto' }}>
        <CardContent>
          <Alert severity="info">
            No budget data available. Please complete Step 1 and Step 2 first.
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      sx={{
        boxShadow: 'none',
        backgroundColor: '#FFFFFFBF',
        width: '84%',
        margin: '0 auto',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E2939' }}>
            {getLabel(BUDGET_LABELS.SECTION_TITLES.GENERAL, currentLanguage, 'Review Budget Details')}
          </Typography>
          {!isViewMode && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEditBasicDetails}
              sx={{
                textTransform: 'none',
                borderColor: '#2563EB',
                color: '#2563EB',
                '&:hover': {
                  borderColor: '#1D4ED8',
                  backgroundColor: '#EFF6FF',
                },
              }}
            >
              Edit Details
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ ...labelSx, mb: 2, fontWeight: 600 }}>
              {getLabel(BUDGET_LABELS.SECTION_TITLES.GENERAL, currentLanguage, 'General Information')}
          </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography sx={labelSx}>
                  {getLabel(BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_CODE, currentLanguage, 'Budget ID')}:
                </Typography>
                <Typography sx={valueSx}>{budgetData.budgetId || 'N/A'}</Typography>
        </Box>
              <Box>
                <Typography sx={labelSx}>
                  {getLabel(BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_TITLE, currentLanguage, 'Budget Name')}:
            </Typography>
                <Typography sx={valueSx}>{budgetData.budgetName || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography sx={labelSx}>
                  {getLabel(BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_CODE, currentLanguage, 'Budget Period Code')}:
          </Typography>
                <Typography sx={valueSx}>{budgetData.budgetPeriodCode || 'N/A'}</Typography>
        </Box>
              <Box>
                <Typography sx={labelSx}>
                  {getLabel(BUDGET_LABELS.FORM_FIELDS.MASTER_COMMUNITY_NAME, currentLanguage, 'Master Community Name')}:
                </Typography>
                <Typography sx={valueSx}>{budgetData.masterCommunityName || 'N/A'}</Typography>
              </Box>
            </Box>
              </Grid>

          {/* Management Firm Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ ...labelSx, mb: 2, fontWeight: 600 }}>
              {getLabel(BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_COMPANY_NAME, currentLanguage, 'Management Firm')}
          </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography sx={labelSx}>
                  {getLabel(BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_COMPANY_NAME, currentLanguage, 'Management Company Name')}:
                </Typography>
                <Typography sx={valueSx}>
                  {budgetData.managementFirmDTO?.mfName || budgetData.managementCompanyName || 'N/A'}
                </Typography>
        </Box>
              <Box>
                <Typography sx={labelSx}>
                  {getLabel(BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_FIRM_MANAGER_EMAIL, currentLanguage, 'Property Manager Email')}:
                </Typography>
                <Typography sx={valueSx}>{budgetData.propertyManagerEmail || 'N/A'}</Typography>
            </Box>
              <Box>
                <Typography sx={labelSx}>
                  {getLabel(BUDGET_LABELS.FORM_FIELDS.SERVICE_CHARGE_GROUP_NAME, currentLanguage, 'Service Charge Group')}:
            </Typography>
                <Typography sx={valueSx}>{budgetData.serviceChargeGroupName || 'N/A'}</Typography>
        </Box>
              <Box>
                <Typography sx={labelSx}>Total Cost:</Typography>
                <Typography sx={valueSx}>{budgetData.totalCostDisplay || 0}</Typography>
              </Box>
            </Box>
                </Grid>
            </Grid>
      </CardContent>
    </Card>
  )
}

export default Step3
