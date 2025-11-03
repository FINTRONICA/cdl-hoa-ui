'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { PermissionAwareDataTable } from '@/components/organisms/PermissionAwareDataTable'
import { PageActionButtons } from '@/components/molecules/PageActionButtons/PageActionButtons'
import LeftSlidePanel from '@/components/organisms/LeftSlidePanel/LeftSlidePanel'
import { useTableState } from '@/hooks/useTableState'
import { masterBudgetService } from '@/services/api/budget/masterBudgetService'
import type { MasterBudgetData } from '@/types/budget'
import { useBudgetLabels } from '@/hooks/budget/useBudgetLabels'
import { MASTER_BUDGET_LABELS } from '@/constants/mappings/budgetLabels'

interface MasterBudgetTableRow {
  [key: string]: string | number
  id: string
  chargeType: string
  chargeTypeId: number
  groupName: string
  categoryName: string
  serviceName: string
  provisionalBudgetCode: string
}

const transformMasterBudgetToRow = (budget: MasterBudgetData): MasterBudgetTableRow => {
  return {
    id: budget.id || `master-budget-${Date.now()}`,
    chargeType: budget.chargeType || '—',
    chargeTypeId: budget.chargeTypeId || 0,
    groupName: budget.groupName || '—',
    categoryName: budget.categoryName || '—',
    serviceName: budget.serviceName || '—',
    provisionalBudgetCode: budget.provisionalBudgetCode || '—',
  }
}

const createTableColumns = (
  getLabel: (configId: string, language?: string, fallback?: string) => string
) => [
  {
    key: 'chargeType',
    label: getLabel(
      MASTER_BUDGET_LABELS.LIST.TABLE_HEADERS.CHARGE_TYPE,
      'EN',
      MASTER_BUDGET_LABELS.FALLBACKS.LIST.TABLE_HEADERS.CHARGE_TYPE
    ),
    type: 'text' as const,
    width: 'w-48',
    sortable: true,
  },
  {
    key: 'groupName',
    label: getLabel(
      MASTER_BUDGET_LABELS.LIST.TABLE_HEADERS.GROUP_NAME,
      'EN',
      MASTER_BUDGET_LABELS.FALLBACKS.LIST.TABLE_HEADERS.GROUP_NAME
    ),
    type: 'text' as const,
    width: 'w-56',
    sortable: true,
  },
  {
    key: 'categoryName',
    label: getLabel(
      MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_NAME,
      'EN',
      MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_NAME
    ),
    type: 'text' as const,
    width: 'w-48',
    sortable: true,
  },
  {
    key: 'serviceName',
    label: getLabel(
      MASTER_BUDGET_LABELS.FORM_FIELDS.SERVICE_NAME,
      'EN',
      MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_NAME
    ),
    type: 'text' as const,
    width: 'w-56',
    sortable: true,
  },
  {
    key: 'provisionalBudgetCode',
    label: getLabel(
      MASTER_BUDGET_LABELS.LIST.TABLE_HEADERS.PROVISIONAL_CODE,
      'EN',
      MASTER_BUDGET_LABELS.FALLBACKS.LIST.TABLE_HEADERS.PROVISIONAL_CODE
    ),
    type: 'text' as const,
    width: 'w-48',
    sortable: true,
  },
  {
    key: 'actions',
    label: getLabel(
      MASTER_BUDGET_LABELS.LIST.TABLE_HEADERS.ACTIONS,
      'EN',
      MASTER_BUDGET_LABELS.FALLBACKS.LIST.TABLE_HEADERS.ACTIONS
    ),
    type: 'actions' as const,
    width: 'w-24',
  },
]

export default function MasterBudgetPage() {
  const router = useRouter()
  const { getLabel } = useBudgetLabels('EN')
  const [budgets, setBudgets] = useState<MasterBudgetTableRow[]>([])
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)

  useEffect(() => {
    masterBudgetService
      .listBudgets()
      .then((data) => setBudgets(data.map(transformMasterBudgetToRow)))
      .catch(() => setBudgets([]))
  }, [])

  const tableColumns = useMemo(() => createTableColumns(getLabel), [getLabel])

  const renderExpandedContent = useCallback(
    (row: MasterBudgetTableRow) => (
      <div className="grid grid-cols-3 gap-8 p-2">
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">
            {getLabel(
              MASTER_BUDGET_LABELS.SECTION_TITLES.GENERAL,
              'EN',
              MASTER_BUDGET_LABELS.FALLBACKS.SECTION_TITLES.GENERAL
            )}
          </h4>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div>
              <span className="text-gray-600">
                {getLabel(
                  MASTER_BUDGET_LABELS.FORM_FIELDS.CHARGE_TYPE,
                  'EN',
                  MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CHARGE_TYPE
                )}
                :
              </span>
              <span className="ml-2 font-medium text-gray-800">
                {row.chargeType}
              </span>
            </div>
            <div>
              <span className="text-gray-600">
                {getLabel(
                  MASTER_BUDGET_LABELS.FORM_FIELDS.GROUP_NAME,
                  'EN',
                  MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.GROUP_NAME
                )}
                :
              </span>
              <span className="ml-2 font-medium text-gray-800">
                {row.groupName}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">
            {getLabel(
              MASTER_BUDGET_LABELS.SECTION_TITLES.CATEGORIZATION,
              'EN',
              MASTER_BUDGET_LABELS.FALLBACKS.SECTION_TITLES.CATEGORIZATION
            )}
          </h4>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div>
              <span className="text-gray-600">
                {getLabel(
                  MASTER_BUDGET_LABELS.FORM_FIELDS.CATEGORY_NAME,
                  'EN',
                  MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.CATEGORY_NAME
                )}
                :
              </span>
              <span className="ml-2 font-medium text-gray-800">
                {row.categoryName}
              </span>
            </div>
            <div>
              <span className="text-gray-600">
                {getLabel(
                  MASTER_BUDGET_LABELS.FORM_FIELDS.SERVICE_NAME,
                  'EN',
                  MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_NAME
                )}
                :
              </span>
              <span className="ml-2 font-medium text-gray-800">
                {row.serviceName}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">
            {getLabel(
              MASTER_BUDGET_LABELS.FORM_FIELDS.PROVISIONAL_BUDGET_CODE,
              'EN',
              MASTER_BUDGET_LABELS.FALLBACKS.FORM_FIELDS.PROVISIONAL_BUDGET_CODE
            )}
          </h4>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div>
              <span className="ml-2 font-medium text-gray-800">
                {row.provisionalBudgetCode}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    [getLabel]
  )

  const {
    search,
    paginated,
    totalRows,
    totalPages,
    startItem,
    endItem,
    page,
    rowsPerPage,
    handleSearchChange,
    handlePageChange,
    handleRowsPerPageChange,
    selectedRows,
    expandedRows,
    handleRowSelectionChange,
    handleRowExpansionChange,
    handleSort,
    sortConfig,
  } = useTableState<MasterBudgetTableRow>({
    data: budgets,
    searchFields: [
      'chargeType',
      'groupName',
      'categoryName',
      'serviceName',
      'provisionalBudgetCode',
    ],
    initialRowsPerPage: 20,
  })

  const pageTitle = getLabel(
    MASTER_BUDGET_LABELS.PAGE_TITLE,
    'EN',
    MASTER_BUDGET_LABELS.FALLBACKS.PAGE_TITLE
  )
  const pageSubtitle = getLabel(
    MASTER_BUDGET_LABELS.PAGE_SUBTITLE,
    'EN',
    MASTER_BUDGET_LABELS.FALLBACKS.PAGE_SUBTITLE
  )

  const newBudgetLabel = getLabel(
    MASTER_BUDGET_LABELS.LIST.NEW_BUTTON,
    'EN',
    MASTER_BUDGET_LABELS.FALLBACKS.LIST.NEW_BUTTON
  )

  const emptyStateCopy = getLabel(
    MASTER_BUDGET_LABELS.LIST.EMPTY_STATE,
    'EN',
    MASTER_BUDGET_LABELS.FALLBACKS.LIST.EMPTY_STATE
  )

  const handleAddNewBudget = useCallback(() => {
    router.push('/budget/master-budget/new')
  }, [router])

  const handleViewBudget = useCallback(
    (row: MasterBudgetTableRow) => {
      router.push(`/budget/master-budget/new/${row.id}?mode=view`)
    },
    [router]
  )

  const handleEditBudget = useCallback(
    (row: MasterBudgetTableRow) => {
      router.push(`/budget/master-budget/new/${row.id}`)
    },
    [router]
  )

  return (
    <>
      {isSidePanelOpen && (
        <LeftSlidePanel
          isOpen={isSidePanelOpen}
          onClose={() => setIsSidePanelOpen(false)}
        />
      )}

      <DashboardLayout title={pageTitle} subtitle={pageSubtitle}>
        <div className="bg-[#FFFFFFBF] rounded-2xl flex flex-col h-full">
          <div className="sticky top-0 z-10 bg-[#FFFFFFBF] border-b border-gray-200 rounded-t-2xl">
            <PageActionButtons
              entityType="masterBudget"
              showButtons={{ addNew: false, uploadDetails: false, downloadTemplate: false }}
              customActionButtons={[
                {
                  label: newBudgetLabel,
                  onClick: handleAddNewBudget,
                },
              ]}
            />
          </div>

          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-auto">
              {budgets.length === 0 ? (
                <div className="p-6 text-sm text-gray-600">{emptyStateCopy}</div>
              ) : (
                <PermissionAwareDataTable<MasterBudgetTableRow>
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
                  onRowView={handleViewBudget}
                  onRowEdit={handleEditBudget}
                  editPermissions={['*']}
                  viewPermissions={['*']}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}

