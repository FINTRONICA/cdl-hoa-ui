'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material'
import { BeneficiaryData } from '../types'
import { RightSlideProjectBeneficiaryDetailsPanel } from '../../RightSlidePanel/RightSlideProjectBeneficiaryDetailsPanel'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import { PermissionAwareDataTable } from '@/components/organisms/PermissionAwareDataTable'
import { useTableState } from '@/hooks'
import { useBeneficiaryDropdowns } from '@/hooks/useBeneficiaryDropdowns'
import { cardStyles } from '../styles'
import { useProjectLabels } from '@/hooks/useProjectLabels'
import { realEstateAssetService } from '@/services/api/projectService'
import { PageActionButtons } from '@/components/molecules/PageActionButtons'


interface BeneficiaryDetails extends Record<string, unknown> {
  reaBeneficiaryId: string
  reaBeneficiaryType: string
  reaName: string
  reaBankName: string
  reaSwiftCode: string
  reaRoutingCode: string
  reaAccountNumber: string
  reaBeneficiaryTypeId?: string | number
  reaBankNameId?: string | number
  realEstateAssetDTO?: any
}

interface Step4Props {
  beneficiaries: BeneficiaryData[]
  onBeneficiariesChange: (beneficiaries: BeneficiaryData[]) => void
  projectId?: string
  buildPartnerId?: string
  isViewMode?: boolean
}

const Step4: React.FC<Step4Props> = ({
  beneficiaries,
  isViewMode = false,
  onBeneficiariesChange,
  projectId,
  buildPartnerId,
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [editingBeneficiary, setEditingBeneficiary] =
    useState<BeneficiaryDetails | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)



  // API-driven pagination state
  const [currentApiPage, setCurrentApiPage] = useState(1)
  const [currentApiSize, setCurrentApiSize] = useState(20)
  const [apiBeneficiariesData, setApiBeneficiariesData] = useState<BeneficiaryDetails[]>([])
  const [fullApiBeneficiariesData, setFullApiBeneficiariesData] = useState<BeneficiaryDetails[]>([])
  const [apiPagination, setApiPagination] = useState<{
    totalElements: number
    totalPages: number
  } | null>(null)

  const beneficiaryDetails = beneficiaries || []
  const [beneficiaryToDelete, setBeneficiaryToDelete] =
    useState<BeneficiaryDetails | null>(null)


  const { getLabel } = useProjectLabels()


  // Helper function to convert BeneficiaryDetails to BeneficiaryData
  const convertToBeneficiaryData = (beneficiaryDetails: BeneficiaryDetails[]): BeneficiaryData[] => {
    return beneficiaryDetails.map(beneficiary => ({
      id: beneficiary.id?.toString() || '',
      expenseType: beneficiary.reaBeneficiaryType || '',
      transferType: beneficiary.reaBeneficiaryType || '',
      name: beneficiary.reaName || '',
      bankName: beneficiary.reaBankName || '',
      swiftCode: beneficiary.reaSwiftCode || '',
      routingCode: beneficiary.reaRoutingCode || '',
      account: beneficiary.reaAccountNumber || '',
    }))
  }

  // Function to fetch beneficiaries from API with pagination
  const fetchBeneficiariesFromAPI = async (page: number, size: number) => {
    if (!projectId) return
    
    try {
      const response = await realEstateAssetService.getProjectBeneficiaries(projectId)
      
      if (response && typeof response === 'object') {
        const beneficiariesArray = (response as any)?.content || (Array.isArray(response) ? response : [])
        
        // Process all beneficiaries data first
        const allProcessedBeneficiaries = beneficiariesArray.map((beneficiary: any) => ({
          id: beneficiary.id?.toString() || '',
          reaBeneficiaryId: beneficiary.reabBeneficiaryId || '',
          reaBeneficiaryType: beneficiary.reabTranferTypeDTO?.languageTranslationId?.configValue || beneficiary.reabType || '',
          reaName: beneficiary.reabName || '',
          reaBankName: beneficiary.reabBank || '',
          reaSwiftCode: beneficiary.reabSwift || '',
          reaRoutingCode: beneficiary.reabRoutingCode || '',
          reaAccountNumber: beneficiary.reabBeneAccount || '',
          // Keep original field names for compatibility
          beneficiaryId: beneficiary.reabBeneficiaryId || '',
          beneficiaryType: beneficiary.reabType || '',
          name: beneficiary.reabName || '',
          bankName: beneficiary.reabBank || '',
          swiftCode: beneficiary.reabSwift || '',
          routingCode: beneficiary.reabRoutingCode || '',
          accountNumber: beneficiary.reabBeneAccount || '',
        }))
        
        // Store full data
        setFullApiBeneficiariesData(allProcessedBeneficiaries)
        
        // Apply client-side pagination
        const totalElements = allProcessedBeneficiaries.length
        const totalPages = Math.ceil(totalElements / size)
        const startIndex = (page - 1) * size
        const endIndex = startIndex + size
        const paginatedBeneficiaries = allProcessedBeneficiaries.slice(startIndex, endIndex)
        
        setApiBeneficiariesData(paginatedBeneficiaries)
        setApiPagination({ totalElements, totalPages })
        onBeneficiariesChange(convertToBeneficiaryData(paginatedBeneficiaries))
      }
    } catch (error) {
      console.error('Error fetching beneficiaries:', error)
    }
  }

  // Load beneficiaries on component mount and when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchBeneficiariesFromAPI(currentApiPage, currentApiSize)
    }
  }, [projectId, currentApiPage, currentApiSize])

  // Load dropdown data from API

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloading(true)
     
  
    } catch (error) {
      throw error
    } finally {
      setIsDownloading(false)
    }
  }


  const {
    bankNames,
    beneficiaryTypes,
    isLoading: dropdownsLoading,
    error: dropdownsError,
  } = useBeneficiaryDropdowns()

  const addBeneficiary = () => {
    setEditingBeneficiary(null)
    setIsPanelOpen(true)
  }

  const editBeneficiary = (beneficiary: BeneficiaryDetails) => {
    setEditingBeneficiary(beneficiary)
    setIsPanelOpen(true)
  }

  const handleBeneficiaryAdded = async (newBeneficiary: unknown) => {
    if (editingBeneficiary) {
    
      const updatedBeneficiaries = beneficiaryDetails.map((beneficiary) =>
        beneficiary.id === editingBeneficiary.id
          ? (newBeneficiary as BeneficiaryData)
          : beneficiary
      )
      onBeneficiariesChange(updatedBeneficiaries)
    } else {
      
      const updatedBeneficiaries = [
        ...beneficiaryDetails,
        newBeneficiary as BeneficiaryData,
      ]
      onBeneficiariesChange(updatedBeneficiaries)
    }

    setEditingBeneficiary(null)
    
    // Refresh the data from API to ensure consistency
    if (projectId) {
      await fetchBeneficiariesFromAPI(currentApiPage, currentApiSize)
    }
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setEditingBeneficiary(null)
  }

  const handleDeleteClick = (beneficiary: BeneficiaryDetails) => {
    setBeneficiaryToDelete(beneficiary)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (beneficiaryToDelete?.id) {
      try {
        // Call API to soft delete the beneficiary
        await realEstateAssetService.softDeleteProjectBeneficiary(beneficiaryToDelete.id.toString())
        
        // Remove the beneficiary from the local list after successful API call
        const updatedBeneficiaries = beneficiaryDetails.filter(
          (beneficiary) => beneficiary.id !== beneficiaryToDelete.id
        )
        onBeneficiariesChange(updatedBeneficiaries)
        
        setDeleteDialogOpen(false)
        setBeneficiaryToDelete(null)
        
        // Refresh the data from API to ensure consistency
        if (projectId) {
          await fetchBeneficiariesFromAPI(currentApiPage, currentApiSize)
        }
      } catch (error) {
        console.error('Error deleting beneficiary:', error)
        // You might want to show an error message to the user here
      }
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setBeneficiaryToDelete(null)
  }

  const tableColumns = [
    {
      key: 'reaBeneficiaryId',
      label: getLabel('CDL_BPA_BENEFICIARY_ID', 'Beneficiary ID'),
      type: 'text' as const,
      width: 'w-20',
      sortable: true,
    },
    {
      key: 'reaBeneficiaryType',
      label: getLabel('CDL_BPA_BENEFICIARY_TYPE', 'Transfer Type'),
      type: 'text' as const,
      width: 'w-28',
      sortable: true,
    },
    {
      key: 'reaName',
      label: getLabel('CDL_BPA_BENEFICIARY_NAME', 'Name'),
      type: 'text' as const,
      width: 'w-30',
      sortable: true,
    },
    {
      key: 'reaBankName',
      label: getLabel('CDL_BPA_BANK_NAME', 'Bank Name'),
      type: 'text' as const,
      width: 'w-32',
      sortable: true,
    },
    {
      key: 'reaSwiftCode',
      label: getLabel('CDL_BPA_SWIFT_CODE', 'Swift Code'),
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
    },
    {
      key: 'reaRoutingCode',
      label: getLabel('CDL_BPA_ROUTING_CODE', 'Routing Code'),
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
    },
    {
      key: 'reaAccountNumber',
      label: getLabel('CDL_BPA_ACCOUNT_NUMBER', 'Account Number'),
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
    },
    {
      key: 'actions',
      label: getLabel('CDL_BPA_ACTION', 'Actions'),
      type: 'actions' as const,
      width: 'w-24',
    },
  ]


  const {
    search,
    paginated: localPaginated,
    totalRows: localTotalRows,
    totalPages: localTotalPages,
    startItem: localStartItem,
    endItem: localEndItem,
    page: localPage,
    rowsPerPage,
    selectedRows,
    expandedRows,
    handleSearchChange,
    handlePageChange: localHandlePageChange,
    handleRowsPerPageChange: localHandleRowsPerPageChange,
    handleRowSelectionChange,
    handleRowExpansionChange,
  } = useTableState({
    data: beneficiaryDetails as unknown as BeneficiaryDetails[],
    searchFields: [
      'reaBeneficiaryId',
      'reaBeneficiaryType',
      'reaName',
      'reaBankName',
      'reaSwiftCode',
      'reaRoutingCode',
      'reaAccountNumber',
    ],
    initialRowsPerPage: currentApiSize,
  })


  // Update the table state when API size changes
  useEffect(() => {
    if (rowsPerPage !== currentApiSize) {
      localHandleRowsPerPageChange(currentApiSize)
    }
  }, [currentApiSize, rowsPerPage, localHandleRowsPerPageChange])

  // API pagination handlers
  const handlePageChange = (newPage: number) => {
    const hasSearch = Object.values(search).some((value) => value.trim())

    if (hasSearch) {
      localHandlePageChange(newPage)
    } else {
      setCurrentApiPage(newPage)
      // Apply client-side pagination to existing data
      const startIndex = (newPage - 1) * currentApiSize
      const endIndex = startIndex + currentApiSize
      const paginatedBeneficiaries = fullApiBeneficiariesData.slice(startIndex, endIndex)
      setApiBeneficiariesData(paginatedBeneficiaries)
      onBeneficiariesChange(convertToBeneficiaryData(paginatedBeneficiaries))
    }
  }

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setCurrentApiSize(newRowsPerPage)
    setCurrentApiPage(1)
    // Apply client-side pagination to existing data
    const startIndex = 0
    const endIndex = newRowsPerPage
    const paginatedBeneficiaries = fullApiBeneficiariesData.slice(startIndex, endIndex)
    setApiBeneficiariesData(paginatedBeneficiaries)
    onBeneficiariesChange(convertToBeneficiaryData(paginatedBeneficiaries))
    localHandleRowsPerPageChange(newRowsPerPage)
  }

  // Determine which data and pagination to use
  const hasActiveSearch = Object.values(search).some((value) => value.trim())
  const apiTotal = apiPagination?.totalElements || 0
  const apiTotalPages = apiPagination?.totalPages || 1

  const effectiveData = hasActiveSearch ? localPaginated : apiBeneficiariesData
  const effectiveTotalRows = hasActiveSearch ? localTotalRows : apiTotal
  const effectiveTotalPages = hasActiveSearch ? localTotalPages : apiTotalPages
  const effectivePage = hasActiveSearch ? localPage : currentApiPage

  // Calculate effective startItem and endItem based on pagination type
  const effectiveStartItem = hasActiveSearch
    ? localStartItem
    : (currentApiPage - 1) * currentApiSize + 1
  const effectiveEndItem = hasActiveSearch
    ? localEndItem
    : Math.min(currentApiPage * currentApiSize, apiTotal)

  // Show loading stat
  if (dropdownsLoading) {
    return (
      <Card sx={cardStyles}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    )
  }

  if (dropdownsError) {
    return (
      <Card sx={cardStyles}>
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load beneficiary data. Please try again.
            {dropdownsError && (
              <div>Dropdown error: {(dropdownsError as any).message}</div>
            )}
          </Alert>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Button
              variant="outlined"
              onClick={() => {
                // No need to refresh since we're using local state
              }}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 500,
                fontStyle: 'normal',
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '0.5px',
                verticalAlign: 'middle',
                boxShadow: 'none',
              }}
            >
              Retry
            </Button>
            {!isViewMode && (
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineOutlinedIcon />}
                onClick={addBeneficiary}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '0.5px',
                  verticalAlign: 'middle',
                  boxShadow: 'none',
                }}
              >
                {getLabel('CDL_BPA_ADD_BENEFICIARY', 'Add Beneficiary')}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      sx={{
        boxShadow: 'none',
        backgroundColor: '#FFFFFFBF',
        width: '94%',
        margin: '0 auto',
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="end" alignItems="center" mb={4}>
          <Box display="flex" gap={2} alignItems="center">
            <PageActionButtons
              entityType="developerBeneficiary"
              onDownloadTemplate={handleDownloadTemplate}
              isDownloading={isDownloading}
              showButtons={{
                downloadTemplate: true,
                uploadDetails: true,
                addNew: false
              }}
            />
            {!isViewMode && (
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineOutlinedIcon />}
                onClick={addBeneficiary}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '0.5px',
                  verticalAlign: 'middle',
                  boxShadow: 'none',
                }}
              >
                {getLabel('CDL_BPA_ADD_BENEFICIARY', 'Add Beneficiary')}
              </Button>
            )}
          </Box>
        </Box>

        <PermissionAwareDataTable<BeneficiaryDetails>
          data={effectiveData}
          columns={tableColumns}
          searchState={search}
          onSearchChange={handleSearchChange}
          paginationState={{
            page: effectivePage,
            rowsPerPage: currentApiSize,
            totalRows: effectiveTotalRows,
            totalPages: effectiveTotalPages,
            startItem: effectiveStartItem,
            endItem: effectiveEndItem,
          }}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          selectedRows={selectedRows}
          onRowSelectionChange={handleRowSelectionChange}
          expandedRows={expandedRows}
          onRowExpansionChange={handleRowExpansionChange}
          onRowDelete={handleDeleteClick}
          onRowEdit={editBeneficiary}
          deletePermissions={['bpa_beneficiary_delete']}
          editPermissions={['bpa_beneficiary_update']}
          showDeleteAction={true}
          showEditAction={true}
        />
      </CardContent>

      <RightSlideProjectBeneficiaryDetailsPanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onBeneficiaryAdded={handleBeneficiaryAdded}
        title={getLabel('CDL_BPA_BENEFICIARY', 'Beneficiary')}
        editingBeneficiary={editingBeneficiary}
        bankNames={bankNames}
        projectId={projectId || ''}
        beneficiaryTypes={beneficiaryTypes}
        dropdownsLoading={dropdownsLoading}
        dropdownsError={dropdownsError}
        {...(buildPartnerId && { buildPartnerId })}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            Confirm Delete
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the beneficiary &quot;
            {beneficiaryToDelete?.reaName}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default Step4
