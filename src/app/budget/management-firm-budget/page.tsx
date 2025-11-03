'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { PermissionAwareDataTable } from '@/components/organisms/PermissionAwareDataTable'
import { PageActionButtons } from '@/components/molecules/PageActionButtons/PageActionButtons'
import LeftSlidePanel from '@/components/organisms/LeftSlidePanel/LeftSlidePanel'
import { useTableState } from '@/hooks/useTableState'
import { managementFirmBudgetService } from '@/services/api/budget/managementFirmBudgetService'
import type { BudgetData } from '@/types/budget'
import { useBudgetLabels } from '@/hooks/budget/useBudgetLabels'
import { BUDGET_LABELS } from '@/constants/mappings/budgetLabels'

interface BudgetTableRow {
  [key: string]: string | number
  id: string
  managementFirmGroupName: string
  masterCommunityName: string
  managementCompanyName: string
  serviceChargeGroupName: string
  budgetPeriodTitle: string
  budgetPeriodCode: string
  budgetPeriodRange: string
  totalCostDisplay: string
  vatAmountDisplay: string
  totalCost: number
  vatAmount: number
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0)

const transformBudgetToRow = (budget: BudgetData): BudgetTableRow => {
  const from = budget.budgetPeriodFrom
    ? new Date(budget.budgetPeriodFrom).toLocaleDateString('en-GB')
    : '—'
  const to = budget.budgetPeriodTo
    ? new Date(budget.budgetPeriodTo).toLocaleDateString('en-GB')
    : '—'

  return {
    id:
      budget.id ||
      `${budget.managementFirmGroupId || 'budget'}-${budget.budgetPeriodCode || Date.now()}`,
    managementFirmGroupName: budget.managementFirmGroupName || '—',
    masterCommunityName: budget.masterCommunityName || '—',
    managementCompanyName: budget.managementCompanyName || '—',
    serviceChargeGroupName: budget.serviceChargeGroupName || '—',
    budgetPeriodTitle: budget.budgetPeriodTitle || '—',
    budgetPeriodCode: budget.budgetPeriodCode || '—',
    budgetPeriodRange: `${from} - ${to}`,
    totalCostDisplay: formatCurrency(budget.totalCost || 0),
    vatAmountDisplay: formatCurrency(budget.vatAmount || 0),
    totalCost: budget.totalCost || 0,
    vatAmount: budget.vatAmount || 0,
  }
}

const createTableColumns = (
  getLabel: (configId: string, language?: string, fallback?: string) => string
) => [
  {
    key: 'managementFirmGroupName',
    label: getLabel(
      BUDGET_LABELS.LIST.TABLE_HEADERS.MANAGEMENT_FIRM,
      'EN',
      BUDGET_LABELS.FALLBACKS.LIST.TABLE_HEADERS.MANAGEMENT_FIRM
    ),
    type: 'text' as const,
    width: 'w-56',
    sortable: true,
  },
  {
    key: 'budgetPeriodTitle',
    label: getLabel(
      BUDGET_LABELS.LIST.TABLE_HEADERS.BUDGET_PERIOD,
      'EN',
      BUDGET_LABELS.FALLBACKS.LIST.TABLE_HEADERS.BUDGET_PERIOD
    ),
    type: 'text' as const,
    width: 'w-40',
    sortable: true,
  },
  {
    key: 'budgetPeriodRange',
    label: getLabel(
      BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_CODE,
      'EN',
      BUDGET_LABELS.FALLBACKS.FORM_FIELDS.BUDGET_PERIOD_CODE
    ),
    type: 'text' as const,
    width: 'w-44',
  },
  {
    key: 'managementCompanyName',
    label: getLabel(
      BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_COMPANY_NAME,
      'EN',
      BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_COMPANY_NAME
    ),
    type: 'text' as const,
    width: 'w-48',
    sortable: true,
  },
  {
    key: 'serviceChargeGroupName',
    label: getLabel(
      BUDGET_LABELS.FORM_FIELDS.SERVICE_CHARGE_GROUP_NAME,
      'EN',
      BUDGET_LABELS.FALLBACKS.FORM_FIELDS.SERVICE_CHARGE_GROUP_NAME
    ),
    type: 'text' as const,
    width: 'w-48',
    sortable: true,
  },
  {
    key: 'totalCostDisplay',
    label: getLabel(
      BUDGET_LABELS.LIST.TABLE_HEADERS.TOTAL_COST,
      'EN',
      BUDGET_LABELS.FALLBACKS.LIST.TABLE_HEADERS.TOTAL_COST
    ),
    type: 'text' as const,
    width: 'w-36',
    sortable: true,
  },
  {
    key: 'vatAmountDisplay',
    label: getLabel(
      BUDGET_LABELS.FORM_FIELDS.VAT_AMOUNT,
      'EN',
      BUDGET_LABELS.FALLBACKS.FORM_FIELDS.VAT_AMOUNT
    ),
    type: 'text' as const,
    width: 'w-32',
    sortable: true,
  },
  {
    key: 'actions',
    label: getLabel(
      BUDGET_LABELS.LIST.TABLE_HEADERS.ACTIONS,
      'EN',
      BUDGET_LABELS.FALLBACKS.LIST.TABLE_HEADERS.ACTIONS
    ),
    type: 'actions' as const,
    width: 'w-24',
  },
]

export default function ManagementFirmBudgetPage() {
  const router = useRouter()
  const { getLabel } = useBudgetLabels('EN')
  const [budgets, setBudgets] = useState<BudgetTableRow[]>([])
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)

  useEffect(() => {
    managementFirmBudgetService
      .listBudgets()
      .then((data) => setBudgets(data.map(transformBudgetToRow)))
      .catch(() => setBudgets([]))
  }, [])

  const tableColumns = useMemo(() => createTableColumns(getLabel), [getLabel])

  const renderExpandedContent = useCallback(
    (row: BudgetTableRow) => (
      <div className="grid grid-cols-3 gap-8 p-2">
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">
            {getLabel(
              BUDGET_LABELS.SECTION_TITLES.GENERAL,
              'EN',
              BUDGET_LABELS.FALLBACKS.SECTION_TITLES.GENERAL
            )}
          </h4>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div>
              <span className="text-gray-600">
                {getLabel(
                  BUDGET_LABELS.FORM_FIELDS.MANAGEMENT_FIRM_GROUP_NAME,
                  'EN',
                  BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MANAGEMENT_FIRM_GROUP_NAME
                )}
                :
              </span>
              <span className="ml-2 font-medium text-gray-800">
                {row.managementFirmGroupName}
              </span>
            </div>
            <div>
              <span className="text-gray-600">
                {getLabel(
                  BUDGET_LABELS.FORM_FIELDS.MASTER_COMMUNITY_NAME,
                  'EN',
                  BUDGET_LABELS.FALLBACKS.FORM_FIELDS.MASTER_COMMUNITY_NAME
                )}
                :
              </span>
              <span className="ml-2 font-medium text-gray-800">
                {row.masterCommunityName}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">
            {getLabel(
              BUDGET_LABELS.SECTION_TITLES.PERIOD,
              'EN',
              BUDGET_LABELS.FALLBACKS.SECTION_TITLES.PERIOD
            )}
          </h4>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div>
              <span className="text-gray-600">
                {getLabel(
                  BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_TITLE,
                  'EN',
                  BUDGET_LABELS.FALLBACKS.FORM_FIELDS.BUDGET_PERIOD_TITLE
                )}
                :
              </span>
              <span className="ml-2 font-medium text-gray-800">
                {row.budgetPeriodTitle}
              </span>
            </div>
            <div>
              <span className="text-gray-600">
                {getLabel(
                  BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_CODE,
                  'EN',
                  BUDGET_LABELS.FALLBACKS.FORM_FIELDS.BUDGET_PERIOD_CODE
                )}
                :
              </span>
              <span className="ml-2 font-medium text-gray-800">
                {row.budgetPeriodCode}
              </span>
            </div>
            <div>
              <span className="text-gray-600">
                {getLabel(
                  BUDGET_LABELS.FORM_FIELDS.BUDGET_PERIOD_FROM,
                  'EN',
                  BUDGET_LABELS.FALLBACKS.FORM_FIELDS.BUDGET_PERIOD_FROM
                )}
                :
              </span>
              <span className="ml-2 font-medium text-gray-800">
                {row.budgetPeriodRange}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">
            {getLabel(
              BUDGET_LABELS.SECTION_TITLES.FINANCIALS,
              'EN',
              BUDGET_LABELS.FALLBACKS.SECTION_TITLES.FINANCIALS
            )}
          </h4>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div>
              <span className="text-gray-600">
                {getLabel(
                  BUDGET_LABELS.FORM_FIELDS.TOTAL_COST,
                  'EN',
                  BUDGET_LABELS.FALLBACKS.FORM_FIELDS.TOTAL_COST
                )}
                :
              </span>
              <span className="ml-2 font-medium text-gray-800">
                {row.totalCostDisplay}
              </span>
            </div>
            <div>
              <span className="text-gray-600">
                {getLabel(
                  BUDGET_LABELS.FORM_FIELDS.VAT_AMOUNT,
                  'EN',
                  BUDGET_LABELS.FALLBACKS.FORM_FIELDS.VAT_AMOUNT
                )}
                :
              </span>
              <span className="ml-2 font-medium text-gray-800">
                {row.vatAmountDisplay}
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
  } = useTableState<BudgetTableRow>({
    data: budgets,
    searchFields: [
      'managementFirmGroupName',
      'managementCompanyName',
      'serviceChargeGroupName',
      'budgetPeriodTitle',
      'budgetPeriodCode',
      'totalCostDisplay',
      'vatAmountDisplay',
    ],
    initialRowsPerPage: 20,
  })

  const pageTitle = getLabel(
    BUDGET_LABELS.PAGE_TITLE,
    'EN',
    BUDGET_LABELS.FALLBACKS.PAGE_TITLE
  )
  const pageSubtitle = getLabel(
    BUDGET_LABELS.PAGE_SUBTITLE,
    'EN',
    BUDGET_LABELS.FALLBACKS.PAGE_SUBTITLE
  )

  const newBudgetLabel = getLabel(
    BUDGET_LABELS.LIST.NEW_BUTTON,
    'EN',
    BUDGET_LABELS.FALLBACKS.LIST.NEW_BUTTON
  )

  const emptyStateCopy = getLabel(
    BUDGET_LABELS.LIST.EMPTY_STATE,
    'EN',
    BUDGET_LABELS.FALLBACKS.LIST.EMPTY_STATE
  )

  const handleAddNewBudget = useCallback(() => {
    router.push('/budget/management-firm-budget/new')
  }, [router])

  const handleViewBudget = useCallback(
    (row: BudgetTableRow) => {
      router.push(`/budget/management-firm-budget/new/${row.id}?mode=view`)
    },
    [router]
  )

  const handleEditBudget = useCallback(
    (row: BudgetTableRow) => {
      router.push(`/budget/management-firm-budget/new/${row.id}`)
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
              entityType="budgetManagement"
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
                <PermissionAwareDataTable<BudgetTableRow>
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
