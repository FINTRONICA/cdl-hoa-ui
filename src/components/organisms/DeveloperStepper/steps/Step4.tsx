'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material'
import { BeneficiaryData } from '../developerTypes'
import { RightSlideBeneficiaryDetailsPanel } from '../../RightSlidePanel/RightSlideBeneficiaryDetailsPanel'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import { ExpandableDataTable } from '../../ExpandableDataTable'
import {
  useTableState,
  useDeleteBuildPartnerBeneficiary,
  useBuildPartnerBeneficiaries,
} from '@/hooks'
import { useBeneficiaryDropdowns } from '@/hooks/useBeneficiaryDropdowns'
import { useTemplateDownload } from '@/hooks/useRealEstateDocumentTemplate'
import { TEMPLATE_FILES } from '@/constants'
import { PageActionButtons } from '@/components/molecules/PageActionButtons'
import { useDeleteConfirmation } from '@/store/confirmationDialogStore'
interface BeneficiaryDetails extends Record<string, unknown> {
  id?: string | number
  bpbBeneficiaryId: string
  bpbBeneficiaryType: string
  bpbName: string
  bpbBankName: string
  bpbSwiftCode: string
  bpbRoutingCode?: string
  bpbAccountNumber: string
  buildPartnerId?: number
  createdAt?: string
  updatedAt?: string
  status?: string
  enabled?: boolean
}

interface Step4Props {
  beneficiaries: BeneficiaryData[]
  onBeneficiariesChange: (beneficiaries: BeneficiaryData[]) => void
  buildPartnerId?: string
  isReadOnly?: boolean
}

// Helper function to convert API response to BeneficiaryData format
const mapApiBeneficiaryToBeneficiaryData = (
  apiBeneficiary: any
): BeneficiaryData => {
  return {
    id: String(apiBeneficiary.id || ''),
    transferType: apiBeneficiary.bpbBeneficiaryType || '',
    name: apiBeneficiary.bpbName || '',
    bankName: apiBeneficiary.bpbBankName || '',
    swiftCode: apiBeneficiary.bpbSwiftCode || '',
    routingCode: apiBeneficiary.bpbRoutingCode || '',
    account: apiBeneficiary.bpbAccountNumber || '',
    buildPartnerDTO:
      apiBeneficiary.buildPartnerDTO || apiBeneficiary.buildPartnerDTO?.[0],
  }
}

const Step4: React.FC<Step4Props> = ({
  beneficiaries: _beneficiaries,
  onBeneficiariesChange,
  buildPartnerId,
  isReadOnly = false,
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [editMode, setEditMode] = useState<'add' | 'edit'>('add')
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<BeneficiaryDetails | null>(null)
  const [selectedBeneficiaryIndex, setSelectedBeneficiaryIndex] = useState<
    number | null
  >(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentPageSize, setCurrentPageSize] = useState(20)

  const confirmDelete = useDeleteConfirmation()
  const deleteMutation = useDeleteBuildPartnerBeneficiary()

  // Fetch beneficiaries from API with pagination
  const {
    data: apiBeneficiariesResponse,
    isLoading: isLoadingData,
    error: dataError,
    refetch: refetchBeneficiaries,
    updatePagination,
    apiPagination,
  } = useBuildPartnerBeneficiaries(buildPartnerId, currentPage, currentPageSize)

  // Use beneficiaries from API (as BeneficiaryDetails[])
  const beneficiaryDetails: BeneficiaryDetails[] =
    (apiBeneficiariesResponse?.content as BeneficiaryDetails[]) || []

  // Load dropdown data from API (this works)
  const {
    bankNames,
    beneficiaryTypes,
    isLoading: dropdownsLoading,
    error: dropdownsError,
  } = useBeneficiaryDropdowns()

  // Template download hook
  const { downloadTemplate, isLoading: isDownloading } = useTemplateDownload()

  // Use ref to track if we've already synced the data
  const hasSyncedRef = useRef(false)
  const lastSyncedDataRef = useRef<string>('')

  // Sync fetched beneficiaries with parent component
  useEffect(() => {
    if (
      apiBeneficiariesResponse?.content &&
      apiBeneficiariesResponse.content.length > 0
    ) {
      const mappedBeneficiaries = apiBeneficiariesResponse.content.map(
        mapApiBeneficiaryToBeneficiaryData
      )

      // Create a string representation of the data to check if it has changed
      const dataString = JSON.stringify(mappedBeneficiaries)

      // Only call onBeneficiariesChange if the data has actually changed
      if (dataString !== lastSyncedDataRef.current) {
        onBeneficiariesChange(mappedBeneficiaries)
        lastSyncedDataRef.current = dataString
        hasSyncedRef.current = true
      }
    }
  }, [apiBeneficiariesResponse?.content]) // Remove onBeneficiariesChange from dependencies to prevent infinite loop

  const addBeneficiary = () => {
    setEditMode('add')
    setSelectedBeneficiary(null)
    setSelectedBeneficiaryIndex(null)
    setIsPanelOpen(true)
  }

  // Template download handler
  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplate(TEMPLATE_FILES.BUILD_PARTNER_BENEFICIARY)
    } catch (error) {}
  }

  const handleBeneficiaryAdded = (newBeneficiary: unknown) => {
    // Convert to BeneficiaryData format for form
    const convertedBeneficiary = newBeneficiary as BeneficiaryData
    const updatedBeneficiaries = [
      ...(_beneficiaries || []),
      convertedBeneficiary,
    ]
    onBeneficiariesChange(updatedBeneficiaries)

    // Refresh API data if we have a buildPartnerId
    if (buildPartnerId) {
      refetchBeneficiaries()
    }
  }

  const handleBeneficiaryUpdated = (
    updatedBeneficiary: unknown,
    index: number
  ) => {
    const updatedBeneficiaries = [...(_beneficiaries || [])]
    updatedBeneficiaries[index] = updatedBeneficiary as BeneficiaryData
    onBeneficiariesChange(updatedBeneficiaries)

    // Refresh API data if we have a buildPartnerId
    if (buildPartnerId) {
      refetchBeneficiaries()
    }
  }

  const handleEdit = (row: BeneficiaryDetails, index: number) => {
    setEditMode('edit')
    setSelectedBeneficiary(row)
    setSelectedBeneficiaryIndex(index)
    setIsPanelOpen(true)
  }

  const handleDelete = (row: BeneficiaryDetails, index: number) => {
    const beneficiaryId = row.id
    const beneficiaryName = row.bpbName || 'beneficiary'

    confirmDelete({
      itemName: `beneficiary: ${beneficiaryName}`,
      onConfirm: async () => {
        try {
          // If beneficiary has an ID, delete from API
          if (beneficiaryId) {
            await deleteMutation.mutateAsync(String(beneficiaryId))
          }

          // Remove from local state
          const updatedBeneficiaries = (_beneficiaries || []).filter(
            (_, i) => i !== index
          )
          onBeneficiariesChange(updatedBeneficiaries)

          // Refresh API data if we have a buildPartnerId
          if (buildPartnerId) {
            refetchBeneficiaries()
          }
        } catch (error) {
          console.error('Failed to delete beneficiary:', error)
          throw error
        }
      },
    })
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setEditMode('add')
    setSelectedBeneficiary(null)
    setSelectedBeneficiaryIndex(null)
  }

  const tableColumns = [
    {
      key: 'bpbBeneficiaryId',
      label: 'ID',
      type: 'text' as const,
      width: 'w-20',
      sortable: true,
    },
    {
      key: 'bpbBeneficiaryType',
      label: 'Beneficiary Type',
      type: 'text' as const,
      width: 'w-28',
      sortable: true,
    },
    {
      key: 'bpbName',
      label: 'Name',
      type: 'text' as const,
      width: 'w-30',
      sortable: true,
    },
    {
      key: 'bpbBankName',
      label: 'Bank Name',
      type: 'text' as const,
      width: 'w-32',
      sortable: true,
    },
    {
      key: 'bpbSwiftCode',
      label: 'Swift Code',
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
    },
    {
      key: 'bpbRoutingCode',
      label: 'Routing Code',
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
    },
    {
      key: 'bpbAccountNumber',
      label: 'Account Number',
      type: 'text' as const,
      width: 'w-24',
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
    : beneficiaryDetails.length
  const totalPages = buildPartnerId
    ? apiPagination.totalPages
    : Math.ceil(beneficiaryDetails.length / 20)

  // Use the generic table state hook
  const {
    search,
    paginated,
    startItem: localStartItem,
    endItem: localEndItem,
    page: localPage,
    rowsPerPage: localRowsPerPage,
    selectedRows,
    expandedRows,
    handleSearchChange,
    handlePageChange: handleLocalPageChange,
    handleRowsPerPageChange: handleLocalRowsPerPageChange,
    handleRowSelectionChange,
    handleRowExpansionChange,
  } = useTableState({
    data: beneficiaryDetails,
    searchFields: [
      'bpbBeneficiaryId',
      'bpbBeneficiaryType',
      'bpbName',
      'bpbBankName',
      'bpbSwiftCode',
      'bpbRoutingCode',
      'bpbAccountNumber',
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

  // Show loading state
  if (isLoadingData || dropdownsLoading) {
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

  // Show error state
  if (dataError || dropdownsError) {
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
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load beneficiary data. Please try again.
            {dataError && (
              <div>Step data error: {(dataError as any).message}</div>
            )}
            {dropdownsError && (
              <div>Dropdown error: {dropdownsError.message}</div>
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
                refetchBeneficiaries()
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
              Add Beneficiary
            </Button>
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
                addNew: false,
              }}
            />
            {!isReadOnly && (
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
                Add Beneficiary
              </Button>
            )}
          </Box>
        </Box>

        <ExpandableDataTable<BeneficiaryDetails>
          data={buildPartnerId ? beneficiaryDetails : paginated}
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
          selectedRows={selectedRows}
          onRowSelectionChange={handleRowSelectionChange}
          expandedRows={expandedRows}
          onRowExpansionChange={handleRowExpansionChange}
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
        <RightSlideBeneficiaryDetailsPanel
          isOpen={isPanelOpen}
          onClose={handleClosePanel}
          onBeneficiaryAdded={handleBeneficiaryAdded}
          onBeneficiaryUpdated={handleBeneficiaryUpdated}
          title="Beneficiary"
          mode={editMode}
          {...(selectedBeneficiary && {
            beneficiaryData: {
              ...selectedBeneficiary,
              bpbRoutingCode: selectedBeneficiary.bpbRoutingCode || '',
            } as any,
          })}
          {...(selectedBeneficiaryIndex !== null && {
            beneficiaryIndex: selectedBeneficiaryIndex,
          })}
          bankNames={bankNames}
          buildPartnerId={buildPartnerId}
          beneficiaryTypes={beneficiaryTypes}
          dropdownsLoading={dropdownsLoading}
          dropdownsError={dropdownsError}
        />
      )}
    </Card>
  )
}

export default Step4
