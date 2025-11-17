'use client'

import React, { useState, useCallback, useMemo } from 'react'
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
import { useBuildPartnerLabelsWithCache } from '@/hooks/useBuildPartnerLabelsWithCache'
import { getBuildPartnerLabel } from '@/constants/mappings/buildPartnerMapping'
import { useAppStore } from '@/store'

interface Step2Props {
  contactData: ContactData[]
  onFeesChange: (contactData: ContactData[]) => void
  buildPartnerId?: string
  isReadOnly?: boolean
}

const mapApiContactToContactData = (
  apiContact: BuildPartnerContactResponse
): ContactData => ({
  id: apiContact.id,
  arcContactName: apiContact.arcContactName ?? null,
  arcFirstName: apiContact.arcFirstName ?? null,
  arcLastName: apiContact.arcLastName ?? null,
  arcContactTelCode: apiContact.arcContactTelCode ?? null,
  arcContactTelNo: apiContact.arcContactTelNo ?? null,
  arcCountryMobCode: apiContact.arcCountryMobCode ?? null,
  arcContactMobNo: apiContact.arcContactMobNo ?? null,
  arcContactEmail: apiContact.arcContactEmail ?? null,
  arcContactAddress: apiContact.arcContactAddress ?? null,
  arcContactAddressLine1: apiContact.arcContactAddressLine1 ?? null,
  arcContactAddressLine2: apiContact.arcContactAddressLine2 ?? null,
  arcContactPoBox: apiContact.arcContactPoBox ?? null,
  arcContactFaxNo: apiContact.arcContactFaxNo ?? null,
  enabled: apiContact.enabled ?? false,
  workflowStatus: apiContact.workflowStatus ?? null,
  deleted: apiContact.deleted ?? null,
  ...(apiContact.assetRegisterDTO && {
    assetRegisterDTO: {
      id: apiContact.assetRegisterDTO.id,
      enabled:
        (apiContact.assetRegisterDTO as { enabled?: boolean }).enabled ?? true,
      deleted:
        (apiContact.assetRegisterDTO as { deleted?: boolean }).deleted ?? false,
    },
  }),
})

type ContactTableRow = {
  id: number | string | null
  name: string
  address: string
  email: string
  pobox: string
  countrycode: string
  mobileno: string
  telephoneno: string
  fax: string
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

  const { data: buildPartnerLabels, getLabel } =
    useBuildPartnerLabelsWithCache()
  const currentLanguage = useAppStore((state) => state.language) || 'EN'

  const getBuildPartnerLabelDynamic = useCallback(
    (configId: string): string => {
      const fallback = getBuildPartnerLabel(configId)

      if (buildPartnerLabels) {
        return getLabel(configId, currentLanguage, fallback)
      }
      return fallback
    },
    [buildPartnerLabels, currentLanguage, getLabel]
  )

  const {
    data: apiContactsResponse,
    refetch: refetchContacts,
    updatePagination,
    apiPagination,
  } = useBuildPartnerContacts(buildPartnerId, currentPage, currentPageSize)

  const contacts: ContactData[] = useMemo(() => {
    if (apiContactsResponse?.content && apiContactsResponse.content.length > 0) {
      return apiContactsResponse.content.map(mapApiContactToContactData)
    }
    return contactData || []
  }, [apiContactsResponse, contactData])

  const tableRows: ContactTableRow[] = useMemo(
    () =>
      contacts.map((contact) => {
        const first = contact.arcFirstName ?? ''
        const last = contact.arcLastName ?? ''
        const name =
          contact.arcContactName ||
          `${first} ${last}`.trim() ||
          'N/A'
        const addressLine1 =
          contact.arcContactAddressLine1 || contact.arcContactAddress || ''
        const addressLine2 = contact.arcContactAddressLine2 || ''
        const address = `${addressLine1} ${addressLine2}`.trim() || 'N/A'
        return {
          id: contact.id ?? null,
          name,
          address,
          email: contact.arcContactEmail || 'N/A',
          pobox: contact.arcContactPoBox || '',
          countrycode:
            contact.arcContactTelCode || contact.arcCountryMobCode || '',
          mobileno: contact.arcContactMobNo || '',
          telephoneno: contact.arcContactTelNo || '',
          fax: contact.arcContactFaxNo || '',
        }
      }),
    [contacts]
  )

  const addContact = () => {
    setEditMode('add')
    setSelectedContact(null)
    setSelectedContactIndex(null)
    setIsPanelOpen(true)
  }

  const handleContactAdded = (newContact: unknown) => {
    const nextContact = newContact as ContactData
    const existing = contactData || []
    const existingIndex = existing.findIndex(
      (item) => item.id === nextContact.id
    )
    const updatedContacts =
      existingIndex === -1
        ? [...existing, nextContact]
        : existing.map((item, idx) =>
            idx === existingIndex ? nextContact : item
          )
    onFeesChange(updatedContacts)

    if (buildPartnerId) {
      refetchContacts()
    }
  }

  const handleContactUpdated = (updatedContact: unknown, index: number) => {
    const updatedContacts = [...(contactData || [])]
    const updated = updatedContact as ContactData
    const existingIndex = updatedContacts.findIndex(
      (item) => item.id === updated.id
    )
    if (existingIndex !== -1) {
      updatedContacts[existingIndex] = updated
    } else if (index >= 0 && index < updatedContacts.length) {
      updatedContacts[index] = updated
    } else {
      updatedContacts.push(updated)
    }
    onFeesChange(updatedContacts)

    if (buildPartnerId) {
      refetchContacts()
    }
  }

  const handleEdit = (row: ContactTableRow, index: number) => {
    const contact =
      contacts.find((item) => item.id === row.id) || null
    setEditMode('edit')
    setSelectedContact(contact)
    setSelectedContactIndex(index)
    setIsPanelOpen(true)
  }

  const handleDelete = (row: ContactTableRow, indexToRemove: number) => {
    confirmDelete({
      itemName: `contact: ${row.name}`,
      onConfirm: async () => {
        try {
          const contactId = row.id
          if (contactId) {
            await deleteMutation.mutateAsync(contactId)
          }

          const updatedContacts = (contactData || []).filter((item, idx) =>
            contactId !== null && contactId !== undefined
              ? item.id !== contactId
              : idx !== indexToRemove
          )
          onFeesChange(updatedContacts)

          if (buildPartnerId) {
            refetchContacts()
          }
        } catch (error) {
          throw error
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
      label: getBuildPartnerLabelDynamic('CDL_AR_AUTH_NAME'),
      type: 'text' as const,
      width: 'w-40',
      sortable: true,
    },
    {
      key: 'address',
      label: getBuildPartnerLabelDynamic('CDL_AR_BUSINESS_ADDRESS'),
      type: 'text' as const,
      width: 'w-40',
      sortable: true,
    },
    {
      key: 'email',
      label: getBuildPartnerLabelDynamic('CDL_AR_EMAIL_ADDRESS'),
      type: 'text' as const,
      width: 'w-40',
      sortable: true,
    },
    {
      key: 'pobox',
      label: getBuildPartnerLabelDynamic('CDL_AR_POBOX'),
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
    },
    {
      key: 'countrycode',
      label: getBuildPartnerLabelDynamic('CDL_AR_COUNTRY_CODE'),
      type: 'text' as const,
      width: 'w-20',
      sortable: true,
    },
    {
      key: 'mobileno',
      label: getBuildPartnerLabelDynamic('CDL_AR_MOBILE_NUMBER'),
      type: 'text' as const,
      width: 'w-26',
      sortable: true,
    },
    {
      key: 'telephoneno',
      label: getBuildPartnerLabelDynamic('CDL_AR_TELEPHONE_NUMBER'),
      type: 'text' as const,
      width: 'w-26',
      sortable: true,
    },
    {
      key: 'fax',
      label: getBuildPartnerLabelDynamic('CDL_AR_FAX_NUMBER'),
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
    },
    ...(isReadOnly
      ? []
      : [
          {
            key: 'actions',
            label: 'Action',
            type: 'actions' as const,
            width: 'w-20',
          },
        ]),
  ]

  const totalRows = buildPartnerId
    ? apiPagination.totalElements
    : tableRows.length
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
  } = useTableState<ContactTableRow>({
    data: tableRows,
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

  // Filter contacts based on search state when buildPartnerId exists (client-side filtering)
  const filteredContacts = useMemo(() => {
    if (!buildPartnerId) return tableRows

    // Check if there are any search values
    const hasSearchValues = Object.values(search).some(
      (val) => val.trim() !== ''
    )
    if (!hasSearchValues) return tableRows

    // Filter contacts based on search state (same logic as useTableState)
    return tableRows.filter((contact) => {
      return [
        'name',
        'address',
        'email',
        'pobox',
        'countrycode',
        'mobileno',
        'telephoneno',
        'fax',
      ].every((field) => {
        const searchVal = search[field]?.trim() || ''
        if (!searchVal) return true

        const value = contact[field as keyof ContactTableRow]
        const searchLower = searchVal.toLowerCase()
        const valueLower = String(value ?? '').toLowerCase()
        return valueLower.includes(searchLower)
      })
    })
  }, [tableRows, search, buildPartnerId])

  const page = buildPartnerId ? currentPage + 1 : localPage
  const rowsPerPage = buildPartnerId ? currentPageSize : localRowsPerPage

  const startItem = buildPartnerId
    ? currentPage * currentPageSize + 1
    : localStartItem
  const endItem = buildPartnerId
    ? Math.min((currentPage + 1) * currentPageSize, totalRows)
    : localEndItem

  const handlePageChange = (newPage: number) => {
    if (buildPartnerId) {
      const apiPage = newPage - 1
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
          <ExpandableDataTable<ContactTableRow>
            data={
              (buildPartnerId ? filteredContacts : paginated) as ContactTableRow[]
            }
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
