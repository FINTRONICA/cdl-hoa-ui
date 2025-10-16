'use client'

import React, { useState, useEffect } from 'react'
import { Box, Card, CardContent, Button } from '@mui/material'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import { FeeData } from '../developerTypes'
import { RightSlideFeeDetailsPanel } from '../../RightSlidePanel/RightSlideFeeDetailsPanel'
import { ExpandableDataTable } from '../../ExpandableDataTable'
import { useTableState } from '@/hooks'
import { useBuildPartnerFees } from '@/hooks/useBuildPartners'
import { FeeUIData } from '@/services/api/buildPartnerService'
import { formatDate } from '@/utils'
import { useDeleteConfirmation } from '@/store/confirmationDialogStore'
import { useDeleteBuildPartnerFee } from '@/hooks/useBuildPartners'

interface Step3Props {
  fees: FeeData[]
  onFeesChange: (fees: FeeData[]) => void
  buildPartnerId?: string
  isReadOnly?: boolean
}

const Step3: React.FC<Step3Props> = ({
  fees,
  onFeesChange,
  buildPartnerId,
  isReadOnly = false,
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [editMode, setEditMode] = useState<'add' | 'edit'>('add')
  const [selectedFee, setSelectedFee] = useState<FeeData | FeeUIData | null>(
    null
  )
  const [selectedFeeIndex, setSelectedFeeIndex] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentPageSize, setCurrentPageSize] = useState(20)

  const confirmDelete = useDeleteConfirmation()
  const deleteMutation = useDeleteBuildPartnerFee()

  // Fetch fee data from API with pagination when buildPartnerId is available
  const {
    data: apiFeeResponse,
    isLoading: isLoadingFees,
    error: feeError,
    refetch: refetchFees,
    updatePagination,
    apiPagination,
  } = useBuildPartnerFees(buildPartnerId, currentPage, currentPageSize)

  // Transform API data to table format
  const transformedApiData: FeeUIData[] =
    apiFeeResponse?.content?.map((fee: FeeUIData) => ({
      ...fee,
      feeToBeCollected: fee.feeToBeCollected
        ? formatDate(fee.feeToBeCollected, 'MMM DD, YYYY')
        : '',
      nextRecoveryDate: fee.nextRecoveryDate
        ? formatDate(fee.nextRecoveryDate, 'MMM DD, YYYY')
        : '',
    })) || []

  // Use API data if available, otherwise use form data
  const feeDetails: (FeeData | FeeUIData)[] =
    transformedApiData.length > 0 ? transformedApiData : fees || []

  const addFee = () => {
    setEditMode('add')
    setSelectedFee(null)
    setSelectedFeeIndex(null)
    setIsPanelOpen(true)
  }

  const handleFeeAdded = (newFee: unknown) => {
    // Convert FeeUIData back to FeeData format for form
    const convertedFee = newFee as FeeData
    const updatedFees = [...(fees || []), convertedFee]
    onFeesChange(updatedFees)

    // Refresh API data if we have a buildPartnerId
    if (buildPartnerId) {
      refetchFees()
    }
  }

  const handleFeeUpdated = (updatedFee: unknown, index: number) => {
    const updatedFees = [...(fees || [])]
    updatedFees[index] = updatedFee as FeeData
    onFeesChange(updatedFees)

    // Refresh API data if we have a buildPartnerId
    if (buildPartnerId) {
      refetchFees()
    }
  }

  const handleEdit = (row: FeeData | FeeUIData, index: number) => {
    setEditMode('edit')
    setSelectedFee(row)
    setSelectedFeeIndex(index)
    setIsPanelOpen(true)
  }

  const handleDelete = (row: FeeData | FeeUIData, index: number) => {
    const feeId = (row as any).id || (row as any).feeId
    const feeType = row.feeType || 'fee'

    confirmDelete({
      itemName: `fee: ${feeType}`,
      onConfirm: async () => {
        try {
          // If fee has an ID, delete from API
          if (feeId) {
            await deleteMutation.mutateAsync(feeId)
          }

          // Remove from local state
          const updatedFees = (fees || []).filter((_, i) => i !== index)
          onFeesChange(updatedFees)

          // Refresh API data if we have a buildPartnerId
          if (buildPartnerId) {
            refetchFees()
          }
        } catch (error) {
          console.error('Failed to delete fee:', error)
          throw error
        }
      },
    })
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setEditMode('add')
    setSelectedFee(null)
    setSelectedFeeIndex(null)
  }

  // Debug logging
  useEffect(() => {}, [
    buildPartnerId,
    fees,
    transformedApiData,
    feeDetails,
    isLoadingFees,
    feeError,
  ])

  const tableColumns = [
    {
      key: 'feeType',
      label: 'Fee Type',
      type: 'text' as const,
      width: 'w-40',
      sortable: true,
    },
    {
      key: 'frequency',
      label: 'Frequency',
      type: 'text' as const,
      width: 'w-28',
      sortable: true,
    },
    {
      key: 'debitAmount',
      label: 'Debit Amount',
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
    },
    {
      key: 'feeToBeCollected',
      label: 'Fee to be Collected',
      type: 'text' as const,
      width: 'w-30',
      sortable: true,
    },
    {
      key: 'nextRecoveryDate',
      label: 'Next Recovery Date',
      type: 'text' as const,
      width: 'w-32',
      sortable: true,
    },
    {
      key: 'feePercentage',
      label: 'Fee Percentage',
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
    },
    {
      key: 'amount',
      label: 'Amount',
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
    },
    {
      key: 'vatPercentage',
      label: 'VAT Percentage',
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
    },
    {
      key: 'currency',
      label: 'Currency',
      type: 'text' as const,
      width: 'w-20',
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      type: 'actions' as const,
      width: 'w-20',
    },
  ]

  // Get pagination data from API response if available
  const totalRows = buildPartnerId
    ? apiPagination.totalElements
    : feeDetails.length
  const totalPages = buildPartnerId
    ? apiPagination.totalPages
    : Math.ceil(feeDetails.length / 20)

  // Use the generic table state hook
  const {
    search,
    paginated,
    startItem: localStartItem,
    endItem: localEndItem,
    page: localPage,
    rowsPerPage: localRowsPerPage,
    handleSearchChange,
    handlePageChange: handleLocalPageChange,
    handleRowsPerPageChange: handleLocalRowsPerPageChange,
  } = useTableState({
    data: feeDetails,
    searchFields: [
      'feeType',
      'frequency',
      'debitAmount',
      'feeToBeCollected',
      'nextRecoveryDate',
      'feePercentage',
      'amount',
      'vatPercentage',
      'currency',
    ],
    initialRowsPerPage: 20,
  })

  // Use API pagination state when buildPartnerId exists, otherwise use local state
  // Note: useTableState uses 1-based pages (1, 2, 3...), API uses 0-based (0, 1, 2...)
  const page = buildPartnerId ? currentPage + 1 : localPage // Convert API 0-based to UI 1-based
  const rowsPerPage = buildPartnerId ? currentPageSize : localRowsPerPage

  // Calculate start and end items for API pagination
  const startItem = buildPartnerId
    ? currentPage * currentPageSize + 1
    : localStartItem
  const endItem = buildPartnerId
    ? Math.min((currentPage + 1) * currentPageSize, totalRows)
    : localEndItem

  // Wrap pagination handlers to update API pagination
  const handlePageChange = (newPage: number) => {
    if (buildPartnerId) {
      const apiPage = newPage - 1 // Convert UI 1-based to API 0-based
      setCurrentPage(apiPage)
      updatePagination(apiPage, currentPageSize)
    } else {
      handleLocalPageChange(newPage)
    }
  }

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    if (buildPartnerId) {
      setCurrentPage(0)
      setCurrentPageSize(newRowsPerPage)
      updatePagination(0, newRowsPerPage)
    } else {
      handleLocalRowsPerPageChange(newRowsPerPage)
    }
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
          {!isReadOnly && (
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              onClick={addFee}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: 'none',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 500,
                fontStyle: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '0.5px',
                verticalAlign: 'middle',
              }}
            >
              Add Fee
            </Button>
          )}
        </Box>
        <ExpandableDataTable<FeeData | FeeUIData>
          data={buildPartnerId ? feeDetails : paginated}
          columns={tableColumns}
          searchState={search}
          onSearchChange={handleSearchChange}
          paginationState={{
            page,
            rowsPerPage,
            totalRows,
            totalPages,
            startItem,
            endItem,
          }}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          selectedRows={[]}
          onRowSelectionChange={() => {}}
          expandedRows={[]}
          onRowExpansionChange={() => {}}
          {...(!isReadOnly && {
            onRowEdit: handleEdit,
            onRowDelete: handleDelete,
          })}
          showEditAction={!isReadOnly}
          showDeleteAction={!isReadOnly}
          showViewAction={false}
        />
      </CardContent>
      {buildPartnerId && (
        <RightSlideFeeDetailsPanel
          isOpen={isPanelOpen}
          onClose={handleClosePanel}
          onFeeAdded={handleFeeAdded}
          onFeeUpdated={handleFeeUpdated}
          buildPartnerId={buildPartnerId}
          mode={editMode}
          {...(selectedFee && { feeData: selectedFee })}
          {...(selectedFeeIndex !== null && { feeIndex: selectedFeeIndex })}
        />
      )}
    </Card>
  )
}

export default Step3
