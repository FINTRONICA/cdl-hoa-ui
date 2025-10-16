'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { TablePageLayout } from '../../../components/templates/TablePageLayout'
import { ExpandableDataTable } from '../../../components/organisms/ExpandableDataTable'
import { useTableState } from '../../../hooks/useTableState'
import { Spinner } from '../../../components/atoms/Spinner'
import { CommentModal } from '@/components/molecules'
import { Tab } from '../../../types/activities'
import { RightSlideWorkflowTransactionStatePanel } from '@/components/organisms/RightSlidePanel'
import { type AwaitingActionsUIData } from '@/services/api/workflowApi/workflowRequestService'
import { displayValue } from '@/utils/nullHandling'
import { getLabelByConfigId as getWorkflowRequestLabel } from '@/constants/mappings/workflowMapping'
import { formatDateOnly, truncateWords } from '@/utils'
import { useAppStore } from '@/store'
import { useAwaitingActionsUIData } from '@/hooks/workflow/useWorkflowRequest'
import type { WorkflowRequestFilters } from '@/services/api/workflowApi/workflowRequestService'
import { useWorkflowRequestLabelsWithCache } from '@/hooks/workflow'
interface WorkflowRequestData
  extends AwaitingActionsUIData,
    Record<string, unknown> {
  payloadJson?: {
    bpName?: string
    bpCifrera?: string
    bpLicenseNo?: string
    [key: string]: unknown
  }
  payloadName?: string
  bpCifrera?: string
  bpLicenseNo?: string
  taskStatusName?: string
}

const tabs: Tab[] = [
  { id: 'buildPartner', label: 'Build Partner' },
  { id: 'buildPartnerAsset', label: 'Build Partner Asset' },
  { id: 'capitalPartner', label: 'Capital Partner' },
  { id: 'payments', label: 'Payments' },
  { id: 'suretyBond', label: 'Surety Bond' },
]
const statusOptions = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'IN_PROGRESS',
  'DRAFT',
  'INITIATED',
]

const TAB_TO_MODULE_MAP: Record<string, string> = {
  buildPartner: 'BUILD_PARTNER',
  buildPartnerAsset: 'BUILD_PARTNER_ASSET',
  capitalPartner: 'CAPITAL_PARTNER',
  payments: 'PAYMENTS',
  suretyBond: 'SURETY_BOND',
}

const PendingActivitiesPage: React.FC = () => {
  const router = useRouter()
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
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(20)
  const currentLanguage = useAppStore((state) => state.language)

  const workflowFilters = useMemo((): WorkflowRequestFilters => {
    const moduleName = TAB_TO_MODULE_MAP[activeTab]
    return moduleName ? { moduleName } : {}
  }, [activeTab])

  const {
    data: workflowResponse,
    isLoading: workflowLoading,
    error: workflowError,
    refetch: refetchWorkflow,
  } = useAwaitingActionsUIData(currentPage, pageSize, workflowFilters)

  const workflowData = useMemo((): WorkflowRequestData[] => {
    if (!workflowResponse?.content) return []

    return workflowResponse.content.map((item) => {
      const payloadJson = item.payloadJson as Record<string, unknown>
      const payloadName = (payloadJson?.bpName as string) || '-'
      const bpCifrera = (payloadJson?.bpCifrera as string) || '-'
      const bpLicenseNo = (payloadJson?.bpLicenseNo as string) || '-'
      const taskStatusName =
        ((payloadJson?.taskStatusDTO as Record<string, unknown>)
          ?.name as string) || '-'

      const result = {
        ...item,
        payloadJson: item.payloadJson,
        payloadName,
        bpCifrera,
        bpLicenseNo,
        taskStatusName,
        createdAt: formatDateOnly(item.createdAt), // Pre-format the date
      } as WorkflowRequestData

      return result
    })
  }, [workflowResponse])

  const hasNoDataForTab = workflowData.length === 0 && !workflowLoading

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId)
    setCurrentPage(0)
  }, [])

  const handleRowView = useCallback(
    async (row: WorkflowRequestData) => {
      try {
        const id = row.id.toString()
        let navigationPath = ''

        // Map active tab to the appropriate navigation path
        switch (activeTab) {
          case 'buildPartner':
            navigationPath = `/developers/${id}/step/1?mode=view`
            break
          case 'buildPartnerAsset':
            navigationPath = `/projects/${id}?view=true`
            break
          case 'capitalPartner':
            navigationPath = `/investors/new/${id}?step=1&mode=view`
            break
          case 'suretyBond':
            navigationPath = `/guarantee/new/${id}?step=0&mode=view`
            break
          case 'payments':
            navigationPath = `/transactions/manual/new/${id}?step=0&mode=view`
            break
          default:
            return
        }

        // Navigate to the appropriate path
        router.push(navigationPath)
      } catch (error) {
        console.log(error)
      }
    },
    [activeTab, router]
  )

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
      'moduleName',
      'amount',
      'currency',
      'stageKey',
      'createdAt',
      'taskStatus',
      'payloadName',
      'bpCifrera',
      'taskStatusName',
    ],
    initialRowsPerPage: 20,
  })

  const { data: workflowRequestLabels, getLabel } =
    useWorkflowRequestLabelsWithCache()

  const getWorkflowRequestLabelDynamic = useCallback(
    (configId: string): string => {
      if (workflowRequestLabels) {
        return getLabel(
          configId,
          currentLanguage,
          getWorkflowRequestLabel(configId)
        )
      }
      return getWorkflowRequestLabel(configId)
    },
    [workflowRequestLabels, currentLanguage, getLabel]
  )

  const tableColumns = [
    {
      key: 'moduleName',
      label: getWorkflowRequestLabelDynamic('MODULE_NAME'),
      type: 'text' as const,
      width: 'w-40',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        truncateWords(value, 15),
    },
    {
      key: 'stageKey',
      label: getWorkflowRequestLabelDynamic('STAGE_KEY'),
      type: 'text' as const,
      width: 'w-30',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'payloadName',
      label: getWorkflowRequestLabelDynamic('BP_NAME'),
      type: 'text' as const,
      width: 'w-40',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        truncateWords(value, 15),
    },
    {
      key: 'amount',
      label: getWorkflowRequestLabelDynamic('AMOUNT'),
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },

    {
      key: 'currency',
      label: getWorkflowRequestLabelDynamic('CURRENCY'),
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },

    {
      key: 'bpCifrera',
      label: getWorkflowRequestLabelDynamic('BP_CIFRERA'),
      type: 'text' as const,
      width: 'w-30',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'createdAt',
      label: getWorkflowRequestLabelDynamic('CREATED_AT'),
      type: 'text' as const,
      width: 'w-28',
      sortable: true,
      render: (value: string | number | null | undefined) => {
        return displayValue(value) // Since we pre-formatted the data
      },
    },
    {
      key: 'taskStatusName',
      label: getWorkflowRequestLabelDynamic('STAGE_STATUS'),
      type: 'status' as const,
      width: 'w-35',
      sortable: true,
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
        title={getDynamicPageTitle(activeTab, 'pending')}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </TablePageLayout>
    )
  }

  if (workflowError) {
    return (
      <TablePageLayout
        title={getDynamicPageTitle(activeTab, 'pending')}
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
        title={getDynamicPageTitle(activeTab, 'pending')}
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
            statusOptions={statusOptions}
            renderCustomCell={handleCommentClick}
            onRowTransaction={handleRowTransaction}
            onRowView={handleRowView}
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

export default PendingActivitiesPage
