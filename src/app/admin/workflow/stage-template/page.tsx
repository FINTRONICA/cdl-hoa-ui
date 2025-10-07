'use client'
import dynamic from 'next/dynamic'
import React, { useCallback, useState, useMemo } from 'react'
import { getLabelByConfigId as getWorkflowStageTemplateLabel } from '@/constants/mappings/workflowMapping'
import { displayValue } from '@/utils/nullHandling'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { ExpandableDataTable } from '@/components/organisms/ExpandableDataTable'
import { useTableState } from '@/hooks/useTableState'
import { PageActionButtons } from '@/components/molecules/PageActionButtons'
import { Spinner } from '@/components/atoms/Spinner'
import { useAppStore } from '@/store'
import { toast } from 'react-hot-toast'
import {
  mapWorkflowStageTemplateData,
  WorkflowStageTemplateResponse,
  type WorkflowStageTemplate,
} from '@/services/api/workflowApi'
import { CommentModal } from '@/components/molecules'
import {
  useBuildWorkflowStageTemplateLabelsWithCache,
  useDeleteWorkflowStageTemplate,
  useWorkflowStageTemplates,
} from '@/hooks/workflow'
import { RightSlideWorkflowStageTemplatePanel } from '@/components/organisms/RightSlidePanel/RightSlideWorkflowStageTemplatePanel'

const ErrorMessage: React.FC<{ error: Error; onRetry?: () => void }> = ({
  error,
  onRetry,
}) => (
  <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
    <div className="w-full max-w-md text-center">
      <div className="mb-8">
        <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full">
          <svg
            className="w-12 h-12 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h1 className="mb-4 text-2xl font-semibold text-gray-900">
          Failed to load developers
        </h1>
        <p className="mb-4 text-gray-600">
          {error.message ||
            'An error occurred while loading the data. Please try again.'}
        </p>
        {process.env.NODE_ENV === 'development' && (
          <details className="text-left">
            <summary className="text-sm font-medium text-gray-600 cursor-pointer">
              Error Details (Development)
            </summary>
            <pre className="p-4 mt-2 overflow-auto text-xs text-gray-500 bg-gray-100 rounded">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="w-full px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
)

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <Spinner size="lg" />
    </div>
  </div>
)

const statusOptions = ['Active', 'Inactive']

type WorkflowStageTemplateRow = {
  id: string
  stageOrder: number
  stageKey: string
  keycloakGroup: string
  requiredApprovals: number
  name: string
  description: string
  slaHours: number
  workflowDefinitionDTO: string
  workflowDefinitionName?: string | undefined
  workflowDefinitionVersion?: number | undefined
  status?: string | undefined
  createdBy?: string | undefined
  createdAt?: string | undefined
  updatedBy?: string | undefined
  updatedAt?: string | undefined
}
type ViewRow = {
  _raw: WorkflowStageTemplateRow
} & {
  id?: string | undefined
  name: React.ReactNode
  stageOrder: React.ReactNode
  stageKey: React.ReactNode
  keycloakGroup: React.ReactNode
  requiredApprovals: React.ReactNode
  description: React.ReactNode
  slaHours: React.ReactNode
  workflowDefinition: React.ReactNode
  status: React.ReactNode
  createdAt: React.ReactNode
  actions: React.ReactNode
}

const WorkflowStageTemplatesPageImpl: React.FC = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteIds, setDeleteIds] = useState<(string | number)[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [selectedTemplateForEdit, setSelectedTemplateForEdit] =
    useState<WorkflowStageTemplate | null>(null)
  const currentLanguage = useAppStore((s) => s.language)

  const { data: workflowStageTemplateLabels, getLabel } =
    useBuildWorkflowStageTemplateLabelsWithCache()

  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useWorkflowStageTemplates(currentPage, pageSize)

  const deleteMutation = useDeleteWorkflowStageTemplate()

  const workflowStageTemplatesData: WorkflowStageTemplateRow[] = useMemo(() => {
    if (!apiResponse?.content) {
      return []
    }

    const mappedData = apiResponse.content.map(
      (item: WorkflowStageTemplateResponse) => {
        const uiData = mapWorkflowStageTemplateData(item)

        let status = 'Draft'
        if (uiData.slaHours > 0) {
          status = Math.random() > 0.5 ? 'Active' : 'Pending'
        } else {
          status = Math.random() > 0.5 ? 'Inactive' : 'Draft'
        }

        let workflowDefinitionName = `Workflow ${uiData.id}`
        let workflowDefinitionVersion = 1

        if (
          item.workflowDefinitionDTO &&
          typeof item.workflowDefinitionDTO === 'object'
        ) {
          workflowDefinitionName =
            item.workflowDefinitionDTO.name || `Workflow ${uiData.id}`
          workflowDefinitionVersion = item.workflowDefinitionDTO.version || 1
        }

        const rowData = {
          id: uiData.id.toString(),
          stageOrder: uiData.stageOrder,
          stageKey: uiData.stageKey,
          keycloakGroup: uiData.keycloakGroup,
          requiredApprovals: uiData.requiredApprovals,
          name: uiData.name,
          description: uiData.description,
          slaHours: uiData.slaHours,
          workflowDefinitionDTO: uiData.workflowDefinitionDTO,
          workflowDefinitionName: workflowDefinitionName,
          workflowDefinitionVersion: workflowDefinitionVersion,
          status: status,
          createdBy: uiData.createdBy || 'system',
          createdAt: uiData.createdAt || new Date().toISOString(),
          updatedBy: uiData.updatedBy || undefined,
          updatedAt: uiData.updatedAt || undefined,
        }

        return rowData
      }
    )

    const sortedData = mappedData.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime()
      const dateB = new Date(b.createdAt || 0).getTime()

      if (dateA !== dateB) {
        return dateB - dateA
      }

      return parseInt(b.id) - parseInt(a.id)
    })

    return sortedData
  }, [apiResponse])

  const getWorkflowStageTemplateLabelDynamic = useCallback(
    (configId: string): string => {
      if (workflowStageTemplateLabels && typeof getLabel === 'function') {
        return getLabel(
          configId,
          currentLanguage,
          getWorkflowStageTemplateLabel(configId)
        )
      }
      return getWorkflowStageTemplateLabel(configId)
    },
    [workflowStageTemplateLabels, currentLanguage, getLabel]
  )

  const confirmDelete = async () => {
    if (isDeleting || (deleteMutation as { isPending?: boolean })?.isPending) {
      return
    }

    if (!deleteIds?.length) {
      setIsDeleteModalOpen(false)
      return
    }

    setIsDeleting(true)
    let successCount = 0
    let errorCount = 0

    try {
      for (const id of Array.from(new Set(deleteIds))) {
        try {
          if (
            typeof (
              deleteMutation as {
                mutateAsync?: (id: string) => Promise<unknown>
              }
            ).mutateAsync === 'function'
          ) {
            await (
              deleteMutation as {
                mutateAsync: (id: string) => Promise<unknown>
              }
            ).mutateAsync(id.toString())
            successCount++
          } else if (
            typeof (deleteMutation as { mutate?: (id: string) => void })
              .mutate === 'function'
          ) {
            ;(deleteMutation as { mutate: (id: string) => void }).mutate(
              id.toString()
            )
            successCount++
          } else if (
            typeof (window as { deleteApi?: (id: string) => Promise<unknown> })
              .deleteApi === 'function'
          ) {
            const win = window as unknown as {
              deleteApi?: (id: string) => Promise<unknown>
            }
            if (typeof win.deleteApi === 'function') {
              await win.deleteApi(id.toString())
              successCount++
            } else {
              throw new Error(
                'No delete function available (mutateAsync/mutate/deleteApi)'
              )
            }
          }
        } catch (innerErr) {
          toast.error(`Delete workflow stage template error:: ${innerErr}`)

          errorCount++
        }
      }

      if (successCount > 0 && errorCount === 0) {
        toast.success(
          `Successfully deleted ${successCount} workflow stage template`
        )
      } else if (successCount > 0 && errorCount > 0) {
        toast.error(
          `Deleted ${successCount} workflow stage template, but ${errorCount} failed to delete`
        )
      } else if (errorCount > 0) {
        toast.error(`Failed to delete ${errorCount} workflow stage template`)
      }

      if (typeof refetch === 'function') {
        try {
          await refetch()
        } catch (refetchErr) {
          toast.error(
            `${refetchErr}Failed to refresh workflow stage templates `
          )
        }
      }
    } catch (err) {
      toast.error(`Failed to delete workflow stage template: ${err}`)
    } finally {
      setIsDeleteModalOpen(false)
      setDeleteIds([])
      setIsDeleting(false)
    }
  }

  const tableColumns = [
    {
      key: 'name',
      label: getWorkflowStageTemplateLabelDynamic('CDL_ST_NAME'),
      type: 'text' as const,
      width: 'w-40',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'stageOrder',
      label: getWorkflowStageTemplateLabelDynamic('CDL_ST_ORDER'),
      type: 'text' as const,
      width: 'w-20',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'stageKey',
      label: getWorkflowStageTemplateLabelDynamic('CDL_ST_KEY'),
      type: 'text' as const,
      width: 'w-32',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'keycloakGroup',
      label: getWorkflowStageTemplateLabelDynamic('CDL_ST_GROUP'),
      type: 'text' as const,
      width: 'w-32',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'requiredApprovals',
      label: getWorkflowStageTemplateLabelDynamic('CDL_ST_REQUIRED_APPROVALS'),
      type: 'text' as const,
      width: 'w-32',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'slaHours',
      label: getWorkflowStageTemplateLabelDynamic('CDL_ST_SLA_HOURS'),
      type: 'text' as const,
      width: 'w-24',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'description',
      label: getWorkflowStageTemplateLabelDynamic('CDL_ST_DESCRIPTION'),
      type: 'text' as const,
      width: 'w-65',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'workflowDefinition',
      label: getWorkflowStageTemplateLabelDynamic('CDL_ST_WORKFLOW_DEFINITION'),
      type: 'text' as const,
      width: 'w-65',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },

    // {
    //   key: 'createdBy',
    //   label: getWorkflowStageTemplateLabelDynamic('CDL_ST_CREATED_BY'),
    //   type: 'text' as const,
    //   width: 'w-32',
    //   sortable: true,
    //   render: (value: string | number | null | undefined) =>
    //     displayValue(value),
    // },
    {
      key: 'createdAt',
      label: getWorkflowStageTemplateLabelDynamic('CDL_ST_CREATED_AT'),
      type: 'text' as const,
      width: 'w-40',
      sortable: true,
      render: (value: string | number | null | undefined) =>
        displayValue(value),
    },
    {
      key: 'actions',
      label: getWorkflowStageTemplateLabelDynamic('CDL_ST_ACTIONS'),
      type: 'actions' as const,
      width: 'w-20',
    },
  ]

  const {
    search,
    paginated: paginatedData,
    selectedRows,
    expandedRows,
    handleSearchChange,
    handleRowSelectionChange,
    handleRowExpansionChange,
  } = useTableState({
    data: workflowStageTemplatesData,
    searchFields: [
      'id',
      'name',
      'stageOrder',
      'stageKey',
      'keycloakGroup',
      'requiredApprovals',
      'description',
      'slaHours',
      'workflowDefinitionDTO',
      'workflowDefinitionName',
      'createdAt',
      'status',
    ],
    initialRowsPerPage: pageSize,
  })

  const totalRows = paginatedData.length
  const totalPages = Math.ceil(totalRows / pageSize)

  const onPageChange = (nextPage: number) => setCurrentPage(nextPage)
  const onRowsPerPageChange = (nextSize: number) => {
    setPageSize(nextSize)
    setCurrentPage(0)
  }

  const handleRowDelete = (
    arg?: React.MouseEvent | (ViewRow | WorkflowStageTemplateRow)
  ) => {
    if (arg && 'stopPropagation' in arg) arg.stopPropagation()

    const singleId =
      arg && typeof (arg as ViewRow)?.id === 'string'
        ? (arg as ViewRow).id
        : (arg as WorkflowStageTemplateRow)?.id

    const ids: (string | number)[] =
      typeof singleId === 'string' || typeof singleId === 'number'
        ? [singleId]
        : selectedRows
            .map((idx: number) => viewRows[idx]?._raw?.id)
            .filter((v: string | undefined): v is string => v !== undefined)

    if (!ids.length) return

    setDeleteIds(ids)
    setIsDeleteModalOpen(true)
  }

  const handleRowClick = (row: WorkflowStageTemplateRow) => {
    if (!row.id || row.id === '0') {
      return
    }

    const uiData: WorkflowStageTemplate = {
      id: parseInt(row.id),
      stageOrder: row.stageOrder,
      stageKey: row.stageKey,
      keycloakGroup: row.keycloakGroup,
      requiredApprovals: row.requiredApprovals,
      name: row.name,
      description: row.description,
      slaHours: row.slaHours,
      workflowDefinitionDTO: row.workflowDefinitionDTO,
      workflowDefinitionName: row.workflowDefinitionName || '',
      workflowDefinitionVersion: row.workflowDefinitionVersion || 1,
      status: row.status || 'Draft',
      createdBy: row.createdBy ? row.createdBy : '-',
      createdAt: row.createdAt || new Date().toISOString(),
      updatedBy: row.updatedBy || '',
      updatedAt: row.updatedAt || '',
    }

    setSelectedTemplateForEdit(uiData)
    setIsSidePanelOpen(true)
  }

  if (isLoading) return <LoadingSpinner />

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />
  }

  const viewRows: ViewRow[] = paginatedData.map((row) => {
    return {
      _raw: row,
      id: row.id?.toString(),
      name: (
        <div className="w-auto px-4 py-3.5 text-sm text-[#1E2939]">
          {displayValue(row.name)}
        </div>
      ),
      stageOrder: (
        <div className="w-auto px-4 py-3.5 text-sm text-[#1E2939]">
          {displayValue(row.stageOrder)}
        </div>
      ),
      stageKey: (
        <div className="w-auto px-4 py-3.5 text-sm text-[#1E2939]">
          {displayValue(row.stageKey)}
        </div>
      ),
      keycloakGroup: (
        <div className="w-auto px-4 py-3.5 text-sm text-[#1E2939]">
          {displayValue(row.keycloakGroup)}
        </div>
      ),
      requiredApprovals: (
        <div className="w-auto px-4 py-3.5 text-sm text-[#1E2939]">
          {displayValue(row.requiredApprovals)}
        </div>
      ),
      description: (
        <div className="w-auto px-4 py-3.5 text-sm text-[#1E2939]">
          <div className="max-w-xs truncate" title={row.description}>
            {displayValue(row.description)}
          </div>
        </div>
      ),
      slaHours: (
        <div className="w-auto px-4 py-3.5 text-sm text-[#1E2939]">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {displayValue(row.slaHours)}h
          </span>
        </div>
      ),
      workflowDefinition: (
        <div className="w-auto px-4 py-3.5 text-sm text-[#1E2939]">
          <div
            className="max-w-xs truncate"
            title={row.workflowDefinitionName || row.workflowDefinitionDTO}
          >
            {displayValue(
              row.workflowDefinitionName || row.workflowDefinitionDTO
            )}
          </div>
        </div>
      ),
      status: (
        <span className="inline-flex items-center">
          {displayValue(row.status)}
        </span>
      ),
      createdBy: (
        <div className="w-auto px-4 py-3.5 text-sm text-[#1E2939]">
          {displayValue(row.createdBy)}
        </div>
      ),
      createdAt: (
        <div className="w-auto px-4 py-3.5 text-sm text-[#1E2939]">
          {row.createdAt
            ? (() => {
                const date = new Date(row.createdAt)
                const day = date.getDate()
                const month = date.toLocaleString('en-US', { month: 'long' })
                const year = date.getFullYear()
                const hours = date.getHours()
                const minutes = date.getMinutes().toString().padStart(2, '0')
                const ampm = hours >= 12 ? 'PM' : 'AM'
                const displayHours = hours % 12 || 12
                return (
                  <>
                    <div>
                      {day} {month} {year}
                    </div>
                    <div>
                      {displayHours}:{minutes} {ampm}
                    </div>
                  </>
                )
              })()
            : displayValue(row.createdAt)}
        </div>
      ),
      actions: (
        <div className="w-auto px-4 py-3.5 text-sm text-[#1E2939]">
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleRowClick(row)
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleRowDelete(row)
              }}
              className="text-sm font-medium text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      ),
    }
  })

  return (
    <>
      <RightSlideWorkflowStageTemplatePanel
        isOpen={isSidePanelOpen}
        onClose={() => {
          setIsSidePanelOpen(false)
          setSelectedTemplateForEdit(null)
        }}
        mode={selectedTemplateForEdit ? 'edit' : 'add'}
        templateData={selectedTemplateForEdit}
      />

      <DashboardLayout
        title={getWorkflowStageTemplateLabelDynamic('Workflow Stage Templates')}
      >
        <div className="bg-[#FFFFFFBF] rounded-2xl flex flex-col h-full">
          <div className="sticky top-0 z-10 bg-[#FFFFFFBF] border-b border-gray-200 rounded-t-2xl">
            <PageActionButtons
              entityType="workflowStageTemplate"
              customActionButtons={[]}
              showButtons={{ addNew: true }}
              onAddNew={() => {
                setSelectedTemplateForEdit(null)
                setIsSidePanelOpen(true)
              }}
            />
          </div>

          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-auto">
              <ExpandableDataTable<ViewRow>
                data={viewRows}
                columns={tableColumns}
                searchState={search}
                onSearchChange={handleSearchChange}
                paginationState={{
                  page: currentPage + 1,
                  rowsPerPage: pageSize,
                  totalRows,
                  totalPages,
                  startItem: currentPage * pageSize + 1,
                  endItem: Math.min((currentPage + 1) * pageSize, totalRows),
                }}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                selectedRows={selectedRows}
                onRowSelectionChange={handleRowSelectionChange}
                expandedRows={expandedRows}
                onRowExpansionChange={handleRowExpansionChange}
                statusOptions={statusOptions}
                onRowClick={() => {}}
                onRowDelete={handleRowDelete}
                onRowView={(row: ViewRow) => handleRowClick(row._raw)}
                showDeleteAction={true}
                showViewAction={true}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>

      <CommentModal
        open={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        title="Delete Workflow Stage Templates"
        message={`Are you sure you want to delete`}
        actions={[
          {
            label: 'Cancel',
            onClick: () => setIsDeleteModalOpen(false),
            color: 'secondary',
            disabled: isDeleting,
          },
          {
            label: isDeleting ? 'Deleting...' : 'Delete',
            onClick: confirmDelete,
            color: 'error',
            disabled: isDeleting,
          },
        ]}
      />
    </>
  )
}

const WorkflowStageTemplatesPageClient = dynamic(
  () => Promise.resolve(WorkflowStageTemplatesPageImpl),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    ),
  }
)

const WorkflowStageTemplatesPage: React.FC = () => {
  return <WorkflowStageTemplatesPageClient />
}

export default WorkflowStageTemplatesPage
