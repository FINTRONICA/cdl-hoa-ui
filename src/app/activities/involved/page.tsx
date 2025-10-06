'use client'

import React, { useState } from 'react'
import { TablePageLayout } from '../../../components/templates/TablePageLayout'
import { ExpandableDataTable } from '../../../components/organisms/ExpandableDataTable'
import { useTableState } from '../../../hooks/useTableState'
import { ActivityData, Tab } from '../../../types/activities'
import { CommentModal } from '../../../components/molecules/CommentModal'

const tabs: Tab[] = [
  { id: 'property', label: 'Property' },
  { id: 'PropertManagement', label: 'PropertManagement' },
  { id: 'owner', label: 'Owner' },
  { id: 'guarantee', label: 'Guarantee' },
  { id: 'payment', label: 'Payment' },
  { id: 'partialPayments', label: 'Partial Payments' },
  { id: 'splitAllocate', label: 'Split & Allocate' },
  { id: 'tasDeposit', label: 'TAS Deposit' },
  { id: 'fundRollback', label: 'Fund Rollback' },
]

// Add mock fields to involvedActivitiesData to match ActivityData type
const rawInvolvedActivitiesData = [
  {
    developer: 'Ambhuja',
    comment: '3',
    createdDate: '3 June 2025 19:45',
    updatedDate: '4 June 2025 19:45',
    approvedDate: '4 June 2025 19:45',
    status: 'Approved',
  },
  {
    developer: 'LnT Ultra',
    comment: '7',
    createdDate: '1 June 2025 19:45',
    updatedDate: '2 June 2025 19:45',
    approvedDate: '2 June 2025 19:45',
    status: 'Approved',
  },
  {
    developer: 'DLF Infra',
    comment: '9',
    createdDate: '25 May 2025 19:45',
    updatedDate: '26 May 2025 19:45',
    approvedDate: '26 May 2025 19:45',
    status: 'Approved',
  },
  {
    developer: 'Bharat Infra',
    comment: '1',
    createdDate: '22 May 2025 19:45',
    updatedDate: '23 May 2025 19:45',
    approvedDate: '23 May 2025 19:45',
    status: 'Rejected',
  },
  {
    developer: 'Lodha Buildcom',
    comment: '5',
    createdDate: '21 May 2025 19:45',
    updatedDate: '22 May 2025 19:45',
    approvedDate: '22 May 2025 19:45',
    status: 'Approved',
  },
  {
    developer: 'Reliance infra',
    comment: '8',
    createdDate: '3 June 2025 19:45',
    updatedDate: '4 June 2025 19:45',
    approvedDate: '4 June 2025 19:45',
    status: 'Approved',
  },
  {
    developer: 'Godrej Properties',
    comment: '2',
    createdDate: '1 June 2025 19:45',
    updatedDate: '2 June 2025 19:45',
    approvedDate: '2 June 2025 19:45',
    status: 'Rejected',
  },
  {
    developer: 'Mahindra Lifespaces',
    comment: '6',
    createdDate: '25 May 2025 19:45',
    updatedDate: '26 May 2025 19:45',
    approvedDate: '26 May 2025 19:45',
    status: 'Approved',
  },
  {
    developer: 'Tata Infra',
    comment: '4',
    createdDate: '22 May 2025 19:45',
    updatedDate: '23 May 2025 19:45',
    approvedDate: '23 May 2025 19:45',
    status: 'Rejected',
  },
  {
    developer: 'Mahindra Lifespaces',
    comment: '10',
    createdDate: '21 May 2025 19:45',
    updatedDate: '22 May 2025 19:45',
    approvedDate: '22 May 2025 19:45',
    status: 'Approved',
  },
]

const involvedActivitiesData: ActivityData[] = rawInvolvedActivitiesData.map(
  (row, i) => ({
    ...row,
    maker: '',
    recentActor: '',
    activityId: `INVOLVED-${i + 1}`,
    activityType: 'Registration',
    projectName: `${row.developer} Project`,
    priority: 'Medium',
    dueDate: '',
    documents: [],
    recentActivity: [],
  })
)

const statusOptions = ['Incomplete', 'In Review', 'Rejected', 'Approved']

const tableColumns = [
  {
    key: 'developer',
    label: 'Developer Name',
    type: 'text' as const,
    width: 'w-40',
    sortable: true,
  },
  {
    key: 'comment',
    label: 'Comments',
    type: 'comment' as const,
    width: 'w-20',
    sortable: true,
  },
  {
    key: 'createdDate',
    label: 'Created Date',
    type: 'text' as const,
    width: 'w-40',
    sortable: true,
  },
  {
    key: 'updatedDate',
    label: 'Updated Date',
    type: 'text' as const,
    width: 'w-40',
    sortable: true,
  },
  {
    key: 'approvedDate',
    label: 'Approved Date',
    type: 'text' as const,
    width: 'w-40',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    type: 'status' as const,
    width: 'w-[129px]',
    sortable: true,
  },
]

const InvolvedActivitiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('developer')
  const [commentModalOpen, setCommentModalOpen] = useState(false)
  const [selectedComment, setSelectedComment] = useState<{ comment: string; developer: string; activityId?: string } | null>(null)

  // Use the generic table state hook
  const {
    search,
    paginated,
    totalRows,
    totalPages,
    startItem,
    endItem,
    page,
    rowsPerPage,
    selectedRows,
    expandedRows,
    handleSearchChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleRowSelectionChange,
    handleRowExpansionChange,
  } = useTableState({
    data: involvedActivitiesData,
    searchFields: [
      'developer',
      'maker',
      'recentActor',
      'comment',
      'createdDate',
      'updatedDate',
      'status',
    ],
    initialRowsPerPage: 20,
  })

  // Handle comment click
  const handleCommentClick = (column: string, value: unknown): React.ReactNode => {
    if (column === 'comment' && typeof value === 'object' && value !== null) {
      const { comment, row: rowData } = value as { comment: string; row: ActivityData }
      setSelectedComment({
        comment,
        developer: rowData.developer,
        activityId: rowData.activityId,
      })
      setCommentModalOpen(true)
    }
    return null
  }

  // Handle row actions
  const handleRowDelete = (row: ActivityData, index: number) => {
    console.log('Delete row:', row, 'at index:', index)


  }

  const handleRowView = (row: ActivityData, index: number) => {
    console.log('View row:', row, 'at index:', index)
    
  }

  // Render expanded content
  const renderExpandedContent = (row: ActivityData) => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Activity Info
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Activity ID:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.activityId}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Activity Type:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.activityType}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Activity Status:</span>
            <span className="ml-2 font-medium text-gray-800">{row.status}</span>
          </div>
          <div>
            <span className="text-gray-600">Developer:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.developer}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Project:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.projectName}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Investor:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.recentActor}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Guarantee:</span>
            <span className="ml-2 font-medium text-gray-800">Pending</span>
          </div>
          <div>
            <span className="text-gray-600">Payment:</span>
            <span className="ml-2 font-medium text-gray-800">Pending</span>
          </div>
          <div>
            <span className="text-gray-600">Partial Payment:</span>
            <span className="ml-2 font-medium text-gray-800">Pending</span>
          </div>
          <div>
            <span className="text-gray-600">Split & Allocate:</span>
            <span className="ml-2 font-medium text-gray-800">Pending</span>
          </div>
          <div>
            <span className="text-gray-600">TAS Deposit:</span>
            <span className="ml-2 font-medium text-gray-800">Pending</span>
          </div>
          <div>
            <span className="text-gray-600">Fund Rollback:</span>
            <span className="ml-2 font-medium text-gray-800">Pending</span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Documentation Status
        </h4>
        <div className="space-y-3">
          {row.documents?.map((doc, docIndex) => (
            <button
              key={docIndex}
              className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
            >
              {doc.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <TablePageLayout
        title="Involved Activities"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        statusCards={[]}
        actionButtons={[]}
      >
        <ExpandableDataTable<ActivityData>
          data={paginated}
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
          renderExpandedContent={renderExpandedContent}
          statusOptions={statusOptions}
          renderCustomCell={handleCommentClick}
          onRowDelete={handleRowDelete}
          onRowView={handleRowView}
          showDeleteAction={true}
          showViewAction={true}
        />
      </TablePageLayout>
      
      {/* Comment Modal */}
      {selectedComment && (
        <CommentModal
          open={commentModalOpen}
          onClose={() => {
            setCommentModalOpen(false)
            setSelectedComment(null)
          }}
          comment={selectedComment.comment}
          developer={selectedComment.developer}
          activityId={selectedComment.activityId || undefined}
        />
      )}
    </>
  )
}

export default InvolvedActivitiesPage
