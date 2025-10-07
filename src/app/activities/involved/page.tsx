'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { TablePageLayout } from '../../../components/templates/TablePageLayout'
import { ExpandableDataTable } from '../../../components/organisms/ExpandableDataTable'
import { useTableState } from '../../../hooks/useTableState'
import { Spinner } from '../../../components/atoms/Spinner'
import { CommentModal } from '@/components/molecules'
import { Tab } from '../../../types/activities'
import { RightSlideWorkflowTransactionStatePanel } from '@/components/organisms/RightSlidePanel'
import { type EngagementsActionsUIData } from '@/services/api/workflowApi/workflowRequestService'
import { displayValue } from '@/utils/nullHandling'
import { useAppStore } from '@/store'
import {
  useEngagementsActionsUIData,
  useDeleteWorkflowRequest,
} from '@/hooks/workflow/useWorkflowRequest'
import { workflowRequestService } from '@/services/api/workflowApi/workflowRequestService'
import type { WorkflowRequestFilters } from '@/services/api/workflowApi/workflowRequestService'
// Removed unused imports - now using queue APIs directly in the panel

export const WORKFLOW_REQUEST_LABELS = {
  ID: 'ID',
  REFERENCE_ID: 'Reference ID',
  REFERENCE_TYPE: 'Reference Type',
  MODULE_NAME: 'Module Name',
  ACTION_KEY: 'Action Key',
  AMOUNT: 'Amount',
  CURRENCY: 'Currency',
  PAYLOAD_JSON: 'Payload',
  CURRENT_STAGE_ORDER: 'Current Stage Order',
  CREATED_BY: 'Created By',
  CREATED_AT: 'Created At',
  LAST_UPDATED_AT: 'Last Updated At',
  VERSION: 'Version',
  WORKFLOW_DEFINITION_DTO: 'Workflow Definition',
  WORKFLOW_REQUEST_STAGE_DTOS: 'Workflow Request Stages',
  TASK_STATUS_DTO: 'Task Status',
}
interface WorkflowRequestData
  extends EngagementsActionsUIData,
    Record<string, unknown> {
  payloadJson?: {
    bpName?: string
    [key: string]: unknown
  }
  payloadName?: string
}

const tabs: Tab[] = [
  { id: 'buildPartner', label: 'Build Partner' },
  { id: 'buildPartnerAsset', label: 'Build Partner Asset' },
  { id: 'capitalPartner', label: 'Capital Partner' },
  { id: 'payments', label: 'Payments' },
  { id: 'suretyBond', label: 'Surety Bond' },
]
const statusOptions = [
  'Incomplete',
  'In Review',
  'Rejected',
  'Approved',
  'Pending',
]

const TAB_TO_MODULE_MAP: Record<string, string> = {
  buildPartner: 'BUILD_PARTNER',
  buildPartnerAsset: 'BUILD_PARTNER_ASSET',
  capitalPartner: 'CAPITAL_PARTNER',
  payments: 'PAYMENTS',
  suretyBond: 'SURETY_BOND',
}

const InvolvedActivitiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('buildPartner')
  const [commentModalOpen, setCommentModalOpen] = useState(false)
  const [isTxnPanelOpen, setIsTxnPanelOpen] = useState(false)
  const [selectedComment, setSelectedComment] = useState<{
    comment: string
    developer: string
    activityId?: string
  } | null>(null)
  const [selectedTxnId, setSelectedTxnId] = useState<
    string | number | undefined
  >()
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(20)
  // Removed unused state - now using queue APIs directly in the panel

  const currentLanguage = useAppStore((state) => state.language)

  const getDynamicPageTitle = (
    activeTab: string,
    pageType: 'pending' | 'involved'
  ): string => {
    const tab = tabs.find((t) => t.id === activeTab)
    const moduleName = tab?.label || 'Unknown Module'

    if (pageType === 'pending') {
      return `Pending Activities: ${moduleName}`
    } else {
      return `Involved Activities: ${moduleName}`
    }
  }

  const workflowFilters = useMemo((): WorkflowRequestFilters => {
    const moduleName = TAB_TO_MODULE_MAP[activeTab]
    return moduleName ? { moduleName } : {}
  }, [activeTab])

  const {
    data: workflowResponse,
    isLoading: workflowLoading,
    error: workflowError,
    refetch: refetchWorkflow,
  } = useEngagementsActionsUIData(currentPage, pageSize, workflowFilters)

  const workflowRequestLabels = null
  const getLabel = useCallback(
    (_configId: string, _language: string, fallback: string) => fallback,
    []
  )

  const deleteMutation = useDeleteWorkflowRequest()

  const workflowData = useMemo((): WorkflowRequestData[] => {
    if (!workflowResponse?.content) return []

    return workflowResponse.content.map((item) => {
      // Extract BP Name from payloadJson if available
      const payloadName =
        ((item.payloadJson as Record<string, unknown>)?.bpName as string) || '-'

      return {
        ...item,
        payloadJson: item.payloadJson,
        payloadName,
      } as WorkflowRequestData
    })
  }, [workflowResponse])

  const hasNoDataForTab = workflowData.length === 0 && !workflowLoading

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId)
    setCurrentPage(0)
  }, [])

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
    data: workflowData,
    searchFields: [
      'referenceId',
      'referenceType',
      'moduleName',
      'actionKey',
      'payloadName',
      'createdBy',
      'workflowDefinitionName',
      'taskStatus',
      'stageKey',
      'requiredApprovals',
      'approvalsObtained',
      'pendingApprovals',
    ],
    initialRowsPerPage: 20,
  })

  const handleCommentClick = (
    _column: string,
    value: unknown
  ): React.ReactNode => {
    return <span>{displayValue(value)}</span>
  }

  const handleRowTransaction = async (
    row: WorkflowRequestData,
    index: number
  ) => {
    try {
      const id = row?.id ?? `temp-${index}`

      // Just set the ID and open the panel - the panel will fetch data using the new queue APIs
      setSelectedTxnId(id)
      setIsTxnPanelOpen(true)
    } catch (error) {
      console.log(error)
      const id = row?.id ?? `temp-${index}`
      setSelectedTxnId(id)
      setIsTxnPanelOpen(true)
    }
  }

  const handleRowDelete = useCallback(async () => {
    if (isDeleting || deleteMutation.isPending) {
      return
    }

    try {
      setIsDeleting(true)
      deleteMutation.mutate()

      refetchWorkflow()
    } catch (error) {
      console.log(error)
    } finally {
      setIsDeleting(false)
    }
  }, [isDeleting, deleteMutation, refetchWorkflow])

  const handleRowView = useCallback(async (row: WorkflowRequestData) => {
    try {
      const workflowRequest =
        await workflowRequestService.getWorkflowRequestById(row.id.toString())
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getWorkflowRequestLabelDynamic = useCallback(
    (configId: string): string => {
      if (workflowRequestLabels) {
        return getLabel(
          configId,
          currentLanguage,
          WORKFLOW_REQUEST_LABELS[
            configId as keyof typeof WORKFLOW_REQUEST_LABELS
          ] || configId
        )
      }
      return (
        WORKFLOW_REQUEST_LABELS[
          configId as keyof typeof WORKFLOW_REQUEST_LABELS
        ] || configId
      )
    },
    [workflowRequestLabels, currentLanguage, getLabel]
  )

  // const renderExpandedContent = (row: WorkflowRequestData) => (
  //   <div className="grid grid-cols-2 gap-8">
  //     <div className="space-y-4">
  //       <h4 className="mb-4 text-sm font-semibold text-gray-900">Details</h4>
  //       <div className="grid grid-cols-2 gap-4 text-sm">
  //         <div>
  //           <span className="text-gray-600">
  //             {getWorkflowRequestLabelDynamic('ID')}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {displayValue(row.id)}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getWorkflowRequestLabelDynamic('REFERENCE_ID')}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {displayValue(row.referenceId)}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getWorkflowRequestLabelDynamic('REFERENCE_TYPE')}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {displayValue(row.referenceType)}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getWorkflowRequestLabelDynamic('MODULE_NAME')}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {displayValue(row.moduleName)}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getWorkflowRequestLabelDynamic('ACTION_KEY')}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {displayValue(row.actionKey)}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">BP Name:</span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {displayValue((row as WorkflowRequestData).payloadName)}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getWorkflowRequestLabelDynamic('CURRENT_STAGE_ORDER')}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {displayValue(row.currentStageOrder)}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">Stage Key:</span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {displayValue(row.stageKey)}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">Required Approvals:</span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {displayValue(row.requiredApprovals)}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">Approvals Obtained:</span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {displayValue(row.approvalsObtained)}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">Pending Approvals:</span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {displayValue(row.pendingApprovals)}
  //           </span>
  //         </div>
  //         <div>
  //           <div>
  //             <span className="text-gray-600">
  //               {getWorkflowRequestLabelDynamic('CDL_WD_CREATED_AT')}:
  //             </span>
  //             <span className="ml-2 font-medium text-gray-800">
  //               {row?.createdAt &&
  //               row.createdAt !== '-' &&
  //               row.createdAt !== 'null'
  //                 ? (() => {
  //                     const date = new Date(row.createdAt)
  //                     if (isNaN(date.getTime())) {
  //                       return displayValue(row?.createdAt)
  //                     }
  //                     const day = date.getDate()
  //                     const month = date.toLocaleString('en-US', {
  //                       month: 'long',
  //                     })
  //                     const year = date.getFullYear()
  //                     const hours = date.getHours()
  //                     const minutes = date
  //                       .getMinutes()
  //                       .toString()
  //                       .padStart(2, '0')
  //                     const ampm = hours >= 12 ? 'PM' : 'AM'
  //                     const displayHours = hours % 12 || 12
  //                     return `${day} ${month} ${year} ${displayHours}:${minutes} ${ampm}`
  //                   })()
  //                 : displayValue(row?.createdAt)}
  //             </span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="space-y-4">
  //       <h4 className="mb-4 text-sm font-semibold text-gray-900">Actions</h4>
  //       <div className="space-y-3">
  //         <button
  //           onClick={() => handleRowView(row)}
  //           className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
  //         >
  //           View Workflow Request
  //         </button>
  //         <button
  //           onClick={() => handleRowDelete()}
  //           className="w-full p-3 text-sm text-left text-red-700 transition-colors bg-white border border-red-200 rounded-lg shadow-sm hover:bg-red-50"
  //         >
  //           Delete Workflow Request
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // )

  const tableColumns = [
    {
      key: 'id',
      label: getWorkflowRequestLabelDynamic('ID'),
      type: 'text' as const,
      width: 'w-20',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'referenceId',
      label: getWorkflowRequestLabelDynamic('REFERENCE_ID'),
      type: 'text' as const,
      width: 'w-32',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'referenceType',
      label: getWorkflowRequestLabelDynamic('REFERENCE_TYPE'),
      type: 'text' as const,
      width: 'w-32',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'moduleName',
      label: getWorkflowRequestLabelDynamic('MODULE_NAME'),
      type: 'text' as const,
      width: 'w-32',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'actionKey',
      label: getWorkflowRequestLabelDynamic('ACTION_KEY'),
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'payloadName',
      label: 'BP Name',
      type: 'text' as const,
      width: 'w-48',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'currentStageOrder',
      label: getWorkflowRequestLabelDynamic('CURRENT_STAGE_ORDER'),
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'stageKey',
      label: 'Stage Key',
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'requiredApprovals',
      label: 'Required Approvals',
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'approvalsObtained',
      label: 'Approvals Obtained',
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'pendingApprovals',
      label: 'Pending Approvals',
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'taskStatus',
      label: getWorkflowRequestLabelDynamic('TASK_STATUS_DTO'),
      type: 'status' as const,
      width: 'w-30',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },

    {
      key: 'createdAt',
      label: getWorkflowRequestLabelDynamic('CREATED_AT'),
      type: 'text' as const,
      width: 'w-40',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },

    {
      key: 'actions',
      label: 'Actions',
      type: 'actions' as const,
      width: 'w-20',
    },
  ]

  if (workflowLoading) {
    return (
      <TablePageLayout
        title={getDynamicPageTitle(activeTab, 'involved')}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Loading engagement requests...</p>
          </div>
        </div>
      </TablePageLayout>
    )
  }

  if (workflowError) {
    return (
      <TablePageLayout
        title={getDynamicPageTitle(activeTab, 'involved')}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="mb-2 text-lg text-red-500">
              Error loading workflow requests
            </div>
            <p className="text-gray-600">{workflowError.message}</p>
            <button
              onClick={() => refetchWorkflow()}
              className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </TablePageLayout>
    )
  }

  return (
    <>
      {commentModalOpen && selectedComment && (
        <CommentModal
          open={commentModalOpen}
          onClose={() => setCommentModalOpen(false)}
        />
      )}

      <TablePageLayout
        title="Pending Activities"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      >
        {hasNoDataForTab ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No data available
              </h3>
              <p className="text-gray-600">
                There are no workflow requests for the selected tab &ldquo;
                {tabs.find((tab) => tab.id === activeTab)?.label}&rdquo;.
              </p>
            </div>
          </div>
        ) : (
          <ExpandableDataTable<WorkflowRequestData>
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
            // renderExpandedContent={renderExpandedContent}
            statusOptions={statusOptions}
            renderCustomCell={handleCommentClick}
            onRowTransaction={handleRowTransaction}
            // onRowDelete={handleRowDelete}
            onRowView={handleRowView}
            // showDeleteAction={true}
            showViewAction={true}
          />
        )}
      </TablePageLayout>
      <RightSlideWorkflowTransactionStatePanel
        isOpen={isTxnPanelOpen}
        onClose={() => {
          setIsTxnPanelOpen(false)
        }}
        transactionId={selectedTxnId ?? ''}
        activeTab={activeTab}
        onApprove={() => {}}
        onReject={() => {}}
      />
      {selectedComment && (
        <CommentModal
          open={commentModalOpen}
          onClose={() => {
            setCommentModalOpen(false)
            setSelectedComment(null)
          }}
        />
      )}
    </>
  )
}

export default InvolvedActivitiesPage
