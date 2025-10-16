'use client'

import React, { useState } from 'react'
import { Box, Card, CardContent, Button } from '@mui/material'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ContactData } from '../developerTypes'
import { RightSlideContactDetailsPanel } from '../../RightSlidePanel/RightSlideContactDetailsPanel'
import { ExpandableDataTable } from '../../ExpandableDataTable'
import { useTableState } from '@/hooks'
import { useDeleteConfirmation } from '@/store/confirmationDialogStore'
import {
  useDeleteBuildPartnerContact,
  useBuildPartnerContacts,
} from '@/hooks/useBuildPartners'
import { BuildPartnerContactResponse } from '@/services/api/buildPartnerService'

// Use ContactData directly from developerTypes

interface Step2Props {
  contactData: ContactData[]
  onFeesChange: (contactData: ContactData[]) => void
  buildPartnerId?: string
  isReadOnly?: boolean
}

// Helper function to convert API response to ContactData format
const mapApiContactToContactData = (
  apiContact: BuildPartnerContactResponse
): ContactData => {
  return {
    id: apiContact.id,
    name: `${apiContact.bpcFirstName} ${apiContact.bpcLastName}`,
    address:
      apiContact.bpcContactAddressLine1 +
      (apiContact.bpcContactAddressLine2
        ? ` ${apiContact.bpcContactAddressLine2}`
        : ''),
    email: apiContact.bpcContactEmail,
    pobox: apiContact.bpcContactPoBox,
    countrycode: apiContact.bpcCountryMobCode,
    mobileno: apiContact.bpcContactMobNo,
    telephoneno: apiContact.bpcContactTelNo,
    fax: apiContact.bpcContactFaxNo,
    ...(apiContact.buildPartnerDTO && {
      buildPartnerDTO: { id: apiContact.buildPartnerDTO.id },
    }),
  }
}

const Step2: React.FC<Step2Props> = ({
  contactData,
  onFeesChange,
  buildPartnerId,
  isReadOnly = false,
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [editMode, setEditMode] = useState<'add' | 'edit'>('add')
  const [selectedContact, setSelectedContact] = useState<ContactData | null>(
    null
  )
  const [selectedContactIndex, setSelectedContactIndex] = useState<
    number | null
  >(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentPageSize, setCurrentPageSize] = useState(20)

  const confirmDelete = useDeleteConfirmation()
  const deleteMutation = useDeleteBuildPartnerContact()

  // Fetch contacts from API with pagination when buildPartnerId is available
  const {
    data: apiContactsResponse,
    refetch: refetchContacts,
    updatePagination,
    apiPagination,
  } = useBuildPartnerContacts(buildPartnerId, currentPage, currentPageSize)

  // Use API data if available, otherwise use form data
  const contacts: ContactData[] =
    apiContactsResponse?.content && apiContactsResponse.content.length > 0
      ? apiContactsResponse.content.map(mapApiContactToContactData)
      : contactData || []

  const addContact = () => {
    setEditMode('add')
    setSelectedContact(null)
    setSelectedContactIndex(null)
    setIsPanelOpen(true)
  }

  const handleContactAdded = (newContact: unknown) => {
    const updatedContacts = [...contacts, newContact as ContactData]
    onFeesChange(updatedContacts)

    // Refresh API data if we have a buildPartnerId
    if (buildPartnerId) {
      refetchContacts()
    }
  }

  const handleContactUpdated = (updatedContact: unknown, index: number) => {
    const updatedContacts = [...contacts]
    updatedContacts[index] = updatedContact as ContactData
    onFeesChange(updatedContacts)

    // Refresh API data if we have a buildPartnerId
    if (buildPartnerId) {
      refetchContacts()
    }
  }

  const handleEdit = (row: ContactData, index: number) => {
    setEditMode('edit')
    setSelectedContact(row)
    setSelectedContactIndex(index)
    setIsPanelOpen(true)
  }

  const handleDelete = (row: ContactData, index: number) => {
    confirmDelete({
      itemName: `contact: ${row.name}`,
      onConfirm: async () => {
        try {
          // If contact has an ID, delete from API
          if (row.id) {
            await deleteMutation.mutateAsync(row.id)
          }

          // Remove from local state
          const updatedContacts = contacts.filter((_, i) => i !== index)
          onFeesChange(updatedContacts)

          // Refresh API data if we have a buildPartnerId
          if (buildPartnerId) {
            refetchContacts()
          }
        } catch (error) {
          console.error('Failed to delete contact:', error)
          throw error // Re-throw to keep dialog open on error
        }
      },
    })
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setEditMode('add')
    setSelectedContact(null)
    setSelectedContactIndex(null)
  }

  const tableColumns = [
    {
      key: 'name',
      label: 'Name',
      type: 'text' as const,
      width: 'w-40',
      sortable: true,
    },
    {
      key: 'address',
      label: 'Address',
      type: 'text' as const,
      width: 'w-40',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email ID',
      type: 'text' as const,
      width: 'w-40',
      sortable: true,
    },
    {
      key: 'pobox',
      label: 'PO Box',
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
    },
    {
      key: 'countrycode',
      label: 'Country Code',
      type: 'text' as const,
      width: 'w-20',
      sortable: true,
    },
    {
      key: 'mobileno',
      label: 'Mobile No',
      type: 'text' as const,
      width: 'w-26',
      sortable: true,
    },
    {
      key: 'telephoneno',
      label: 'Telephone No',
      type: 'text' as const,
      width: 'w-26',
      sortable: true,
    },
    {
      key: 'fax',
      label: 'FAX',
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
    : contacts.length
  const totalPages = buildPartnerId
    ? apiPagination.totalPages
    : Math.ceil(contacts.length / 20)

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
    data: contacts,
    searchFields: [
      'name',
      'address',
      'email',
      'pobox',
      'countrycode',
      'mobileno',
      'telephoneno',
      'fax',
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                onClick={addContact}
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
                Add Contact
              </Button>
            )}
          </Box>
          <ExpandableDataTable<ContactData>
            data={buildPartnerId ? contacts : paginated}
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
      </Card>
      <RightSlideContactDetailsPanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onContactAdded={handleContactAdded}
        onContactUpdated={handleContactUpdated}
        buildPartnerId={buildPartnerId}
        mode={editMode}
        {...(selectedContact && { contactData: selectedContact })}
        {...(selectedContactIndex !== null && {
          contactIndex: selectedContactIndex,
        })}
      />
    </LocalizationProvider>
  )
}

export default Step2
