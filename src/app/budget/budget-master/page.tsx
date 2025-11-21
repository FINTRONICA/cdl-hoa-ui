'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { PermissionAwareDataTable } from '@/components/organisms/PermissionAwareDataTable'
import { PageActionButtons } from '@/components/molecules/PageActionButtons/PageActionButtons'
import LeftSlidePanel from '@/components/organisms/LeftSlidePanel/LeftSlidePanel'
import { useTableState } from '@/hooks/useTableState'
import { masterBudgetService } from '@/services/api/budgetApi/budgetService'
import type { MasterBudgetData } from '@/types/budget'
import { useBudgetLabelsWithCache } from '@/hooks/budget/useBudgetLabelsWithCache'
import { MASTER_BUDGET_LABELS } from '@/constants/mappings/budgetLabels'
import { GlobalLoading } from '@/components/atoms'
import { useDeleteConfirmation } from '@/store/confirmationDialogStore'

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
  const { getLabel } = useBudgetLabelsWithCache('EN')
  const [budgets, setBudgets] = useState<MasterBudgetTableRow[]>([])
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [tableKey, setTableKey] = useState(0)
  const confirmDelete = useDeleteConfirmation()

  const fetchBudgets = useCallback(async () => {
    try {
      console.log('[MasterBudgetPage] fetchBudgets called')
      setIsLoading(true)
      console.log('[MasterBudgetPage] Calling masterBudgetService.listBudgets()')
      const data = await masterBudgetService.listBudgets()
      console.log('[MasterBudgetPage] Received data:', data)
      const transformedData = data.map(transformMasterBudgetToRow)
      console.log('[MasterBudgetPage] Transformed data:', transformedData)
      setBudgets(transformedData)
    } catch (error) {
      console.error('[MasterBudgetPage] Error fetching master budgets:', error)
      setBudgets([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBudgets()
  }, [fetchBudgets])

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
    router.push('/budget/budget-master/new')
  }, [router])

  const handleViewBudget = useCallback(
    (row: MasterBudgetTableRow) => {
      router.push(`/budget/budget-master/new/${row.id}?mode=view`)
    },
    [router]
  )

  const handleEditBudget = useCallback(
    (row: MasterBudgetTableRow) => {
      router.push(`/budget/budget-master/${row.id}?editing=true`)
    },
    [router]
  )

  const handleRowDelete = useCallback(
    (row: MasterBudgetTableRow) => {
      if (isDeleting) {
        return
      }

      if (!row.id) {
        alert('Cannot delete: No ID found for this Master Budget')
        return
      }

      confirmDelete({
        itemName: `Master Budget: ${row.categoryName} - ${row.serviceName}`,
        onConfirm: async () => {
          try {
            setIsDeleting(true)
            await masterBudgetService.deleteBudget(row.id)
            
            // Clear selected and expanded rows
            handleRowSelectionChange([])
            handleRowExpansionChange([])
            
            // Immediately remove from local state for instant UI feedback
            setBudgets((prevBudgets) => 
              prevBudgets.filter((budget) => budget.id !== row.id)
            )
            
            // Wait a bit before refreshing to ensure the API has processed the deletion
            await new Promise((resolve) => setTimeout(resolve, 300))
            
            // Refresh the budget list from API to ensure consistency
            await fetchBudgets()
            
            // Force table re-render by updating the key
            setTableKey((prev) => prev + 1)
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error occurred'
            console.error(`Failed to delete Master Budget: ${errorMessage}`)
            alert(`Failed to delete Master Budget: ${errorMessage}`)
          } finally {
            setIsDeleting(false)
          }
        },
      })
    },
    [isDeleting, confirmDelete, fetchBudgets, handleRowSelectionChange, handleRowExpansionChange]
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
              entityType="budgetMaster"
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
              {isLoading ? (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  <GlobalLoading fullHeight />
                </div>
              ) : budgets.length === 0 ? (
                <div className="p-6 text-sm text-gray-600">{emptyStateCopy}</div>
              ) : (
                <PermissionAwareDataTable<MasterBudgetTableRow>
                  key={`master-budgets-table-${tableKey}`}
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
                  onRowDelete={handleRowDelete}
                  onRowView={handleViewBudget}
                  onRowEdit={handleEditBudget}
                  editPermissions={['*']}
                  viewPermissions={['*']}
                  deletePermissions={['*']}
                  updatePermissions={['*']}
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

// 'use client'

// import React, { useCallback, useEffect, useMemo, useState } from 'react'
// import { useRouter } from 'next/navigation'

// import { DashboardLayout } from '@/components/templates/DashboardLayout'
// import { PermissionAwareDataTable } from '@/components/organisms/PermissionAwareDataTable'
// import { PageActionButtons } from '@/components/molecules/PageActionButtons/PageActionButtons'
// import LeftSlidePanel from '@/components/organisms/LeftSlidePanel/LeftSlidePanel'
// import { useTableState } from '@/hooks/useTableState'
// import { masterBudgetService } from '@/services/api/budgetApi/budgetService'
// import type { MasterBudgetData } from '@/types/budget'
// import { useBudgetLabelsWithCache } from '@/hooks/budget/useBudgetLabelsWithCache'
// import { MASTER_BUDGET_LABELS } from '@/constants/mappings/budgetLabels'
// import { GlobalLoading } from '@/components/atoms'
// import { useDeleteConfirmation } from '@/store/confirmationDialogStore'
// import { useAppStore } from '@/store'

// interface MasterBudgetTableRow {
//   [key: string]: string | number
//   id: string
//   chargeType: string
//   chargeTypeId: number
//   groupName: string
//   categoryName: string
//   serviceName: string
//   provisionalBudgetCode: string
// }

// const transformMasterBudgetToRow = (budget: MasterBudgetData): MasterBudgetTableRow => {
//   return {
//     id: budget.id || `master-budget-${Date.now()}`,
//     chargeType: budget.chargeType || '—',
//     chargeTypeId: budget.chargeTypeId || 0,
//     groupName: budget.groupName || '—',
//     categoryName: budget.categoryName || '—',
//     serviceName: budget.serviceName || '—',
//     provisionalBudgetCode: budget.provisionalBudgetCode || '—',
//   }
// }

// const getTableColumns = (
//   getLabel: (configId: string, language?: string, fallback?: string) => string
// ) => [
//   {
//     key: 'chargeType',
//     label: getLabel(
//      'CHARGE_TYPE',
//     ),
//     type: 'text' as const,
//     width: 'w-48',
//     sortable: true,
//   },
//   {
//     key: 'groupName',
//     label: getLabel(
//      'GROUP_NAME',
//     ),
//     type: 'text' as const,
//     width: 'w-56',
//     sortable: true,
//   },
//   {
//     key: 'categoryName',
//     label: getLabel(
//      'CATEGORY_NAME',
//     ),
//     type: 'text' as const,
//     width: 'w-48',
//     sortable: true,
//   },
//   {
//     key: 'serviceName',
//     label: getLabel(
//      'SERVICE_NAME',
//     ),
//     type: 'text' as const,
//     width: 'w-56',
//     sortable: true,
//   },
//   {
//     key: 'provisionalBudgetCode',
//     label: getLabel(
//     'PROVISIONAL_BUDGET_CODE',
//     ),
//     type: 'text' as const,
//     width: 'w-48',
//     sortable: true,
//   },
//   {
//     key: 'actions',
//     label: getLabel(
//     'ACTIONS',
//     ),
//     type: 'actions' as const,
//     width: 'w-24',
//   },
// ]

// export default function MasterBudgetPage() {
//   const router = useRouter()
//   const { getLabel } = useBudgetLabelsWithCache('EN')
//   const [budgets, setBudgets] = useState<MasterBudgetTableRow[]>([])
//   const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isDeleting, setIsDeleting] = useState(false)
//   const [tableKey, setTableKey] = useState(0)
//   const confirmDelete = useDeleteConfirmation()
//     const currentLanguage = useAppStore((state) => state.language)


//   const fetchBudgets = useCallback(async () => {
//     try {
//       console.log('[MasterBudgetPage] fetchBudgets called')
//       setIsLoading(true)
//       console.log('[MasterBudgetPage] Calling masterBudgetService.listBudgets()')
//       const data = await masterBudgetService.listBudgets()
//       console.log('[MasterBudgetPage] Received data:', data)
//       const transformedData = data.map(transformMasterBudgetToRow)
//       console.log('[MasterBudgetPage] Transformed data:', transformedData)
//       setBudgets(transformedData)
//     } catch (error) {
//       console.error('[MasterBudgetPage] Error fetching master budgets:', error)
//       setBudgets([])
//     } finally {
//       setIsLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchBudgets()
//   }, [fetchBudgets])

//   // const tableColumns = useMemo(() => createTableColumns(getLabel), [getLabel])
//   const getCapitalPartnerLabelDynamic = useCallback(
//     (configId: string): string => {
//       return getLabel(configId, currentLanguage, configId)
//     },
//     [getLabel, currentLanguage]
//   )

//   const tableColumns = useMemo(
//     () => getTableColumns(getCapitalPartnerLabelDynamic),
//     [getCapitalPartnerLabelDynamic]
//   )
//   const renderExpandedContent = useCallback(
//     (row: MasterBudgetTableRow) => (
//       <div className="grid grid-cols-3 gap-8 p-2">
//         <div className="space-y-4">
//           <h4 className="text-sm font-semibold text-gray-900">
//             {getCapitalPartnerLabelDynamic('CDL_MASTER_BDG_SECTION_GENERAL_TITLE')}
//           </h4>
//           <div className="grid grid-cols-1 gap-3 text-sm">
//             <div>
//               <span className="text-gray-600">
//                 {getCapitalPartnerLabelDynamic(
//                   'CHARGE_TYPE',
//                 )}
//                 :
//               </span>
//               <span className="ml-2 font-medium text-gray-800">
//                 {row.chargeType}
//               </span>
//             </div>
//             <div>
//               <span className="text-gray-600">
//                 {getCapitalPartnerLabelDynamic('GROUP_NAME')}
//                 :
//               </span>
//               <span className="ml-2 font-medium text-gray-800">
//                 {row.groupName}
//               </span>
//             </div>
//           </div>
//         </div>
//         <div className="space-y-4">
//           <h4 className="text-sm font-semibold text-gray-900">
//             {getCapitalPartnerLabelDynamic('CDL_MASTER_BDG_SECTION_CATEGORIZATION_TITLE')}
//           </h4>
//           <div className="grid grid-cols-1 gap-3 text-sm">
//             <div>
//               <span className="text-gray-600">
//                 {getCapitalPartnerLabelDynamic('CATEGORY_NAME')}
//                 :
//               </span>
//               <span className="ml-2 font-medium text-gray-800">
//                 {row.categoryName}
//               </span>
//             </div>
//             <div>
//               <span className="text-gray-600">
//                 {getCapitalPartnerLabelDynamic('SERVICE_NAME')}
//                 :
//               </span>
//               <span className="ml-2 font-medium text-gray-800">
//                 {row.serviceName}
//               </span>
//             </div>
//           </div>
//         </div>
//         <div className="space-y-4">
//           <h4 className="text-sm font-semibold text-gray-900">
//             {getCapitalPartnerLabelDynamic('CDL_MASTER_BDG_SECTION_PROVISIONAL_BUDGET_TITLE')}      
//           </h4>
//           <div className="grid grid-cols-1 gap-3 text-sm">
//             <div>
//               <span className="ml-2 font-medium text-gray-800">
//                 {row.provisionalBudgetCode}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     ),
//     [getCapitalPartnerLabelDynamic]
//   )

//   const {
//     search,
//     paginated,
//     totalRows,
//     totalPages,
//     startItem,
//     endItem,
//     page,
//     rowsPerPage,
//     handleSearchChange,
//     handlePageChange,
//     handleRowsPerPageChange,
//     selectedRows,
//     expandedRows,
//     handleRowSelectionChange,
//     handleRowExpansionChange,
//     handleSort,
//     sortConfig,
//   } = useTableState<MasterBudgetTableRow>({
//     data: budgets,
//     searchFields: [
//       'chargeType',
//       'groupName',
//       'categoryName',
//       'serviceName',
//       'provisionalBudgetCode',
//     ],
//     initialRowsPerPage: 20,
//   })


//   const pageTitle = getCapitalPartnerLabelDynamic('CDL_MASTER_BDG_PAGE_TITLE')                
//   const pageSubtitle = getCapitalPartnerLabelDynamic('CDL_MASTER_BDG_PAGE_SUBTITLE')

//   const newBudgetLabel = getCapitalPartnerLabelDynamic('CDL_MASTER_BDG_LIST_NEW_BUTTON')
      
//   const emptyStateCopy = getCapitalPartnerLabelDynamic('CDL_MASTER_BDG_LIST_EMPTY_STATE')


//   const handleAddNewBudget = useCallback(() => {
//     router.push('/budget/budget-master/new')
//   }, [router])

//   const handleViewBudget = useCallback(
//     (row: MasterBudgetTableRow) => {
//       router.push(`/budget/budget-master/new/${row.id}?mode=view`)
//     },
//     [router]
//   )

//   const handleEditBudget = useCallback(
//     (row: MasterBudgetTableRow) => {
//       router.push(`/budget/budget-master/${row.id}?editing=true`)
//     },
//     [router]
//   )

//   const handleRowDelete = useCallback(
//     (row: MasterBudgetTableRow) => {
//       if (isDeleting) {
//         return
//       }

//       if (!row.id) {
//         alert('Cannot delete: No ID found for this Master Budget')
//         return
//       }

//       confirmDelete({
//         itemName: `Master Budget: ${row.categoryName} - ${row.serviceName}`,
//         onConfirm: async () => {
//           try {
//             setIsDeleting(true)
//             await masterBudgetService.deleteBudget(row.id)
            
//             // Clear selected and expanded rows
//             handleRowSelectionChange([])
//             handleRowExpansionChange([])
            
//             // Immediately remove from local state for instant UI feedback
//             setBudgets((prevBudgets) => 
//               prevBudgets.filter((budget) => budget.id !== row.id)
//             )
            
//             // Wait a bit before refreshing to ensure the API has processed the deletion
//             await new Promise((resolve) => setTimeout(resolve, 300))
            
//             // Refresh the budget list from API to ensure consistency
//             await fetchBudgets()
            
//             // Force table re-render by updating the key
//             setTableKey((prev) => prev + 1)
//           } catch (error) {
//             const errorMessage =
//               error instanceof Error ? error.message : 'Unknown error occurred'
//             console.error(`Failed to delete Master Budget: ${errorMessage}`)
//             alert(`Failed to delete Master Budget: ${errorMessage}`)
//           } finally {
//             setIsDeleting(false)
//           }
//         },
//       })
//     },
//     [isDeleting, confirmDelete, fetchBudgets, handleRowSelectionChange, handleRowExpansionChange]
//   )

//   return (
//     <>
//       {isSidePanelOpen && (
//         <LeftSlidePanel
//           isOpen={isSidePanelOpen}
//           onClose={() => setIsSidePanelOpen(false)}
//         />
//       )}

//       <DashboardLayout title={pageTitle} subtitle={pageSubtitle}>
//         <div className="bg-[#FFFFFFBF] rounded-2xl flex flex-col h-full">
//           <div className="sticky top-0 z-10 bg-[#FFFFFFBF] border-b border-gray-200 rounded-t-2xl">
//             <PageActionButtons
//               entityType="budgetMaster"
//               showButtons={{ addNew: false, uploadDetails: false, downloadTemplate: false }}
//               customActionButtons={[
//                 {
//                   label: newBudgetLabel,
//                   onClick: handleAddNewBudget,
//                 },
//               ]}
//             />
//           </div>

//           <div className="flex flex-col flex-1 min-h-0">
//             <div className="flex-1 overflow-auto">
//               {isLoading ? (
//                 <div className="flex items-center justify-center h-full min-h-[400px]">
//                   <GlobalLoading fullHeight />
//                 </div>
//               ) : budgets.length === 0 ? (
//                 <div className="p-6 text-sm text-gray-600">{emptyStateCopy}</div>
//               ) : (
//                 <PermissionAwareDataTable<MasterBudgetTableRow>
//                   key={`master-budgets-table-${tableKey}`}
//                   data={paginated}
//                   columns={tableColumns}
//                   searchState={search}
//                   onSearchChange={handleSearchChange}
//                   paginationState={{
//                     page,
//                     rowsPerPage,
//                     totalRows,
//                     totalPages,
//                     startItem,
//                     endItem,
//                   }}
//                   onPageChange={handlePageChange}
//                   onRowsPerPageChange={handleRowsPerPageChange}
//                   selectedRows={selectedRows}
//                   onRowSelectionChange={handleRowSelectionChange}
//                   expandedRows={expandedRows}
//                   onRowExpansionChange={handleRowExpansionChange}
//                   renderExpandedContent={renderExpandedContent}
//                   onRowDelete={handleRowDelete}
//                   onRowView={handleViewBudget}
//                   onRowEdit={handleEditBudget}
//                   editPermissions={['*']}
//                   viewPermissions={['*']}
//                   deletePermissions={['*']}
//                   updatePermissions={['*']}
//                   sortConfig={sortConfig}
//                   onSort={handleSort}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </DashboardLayout>
//     </>
//   )
// }

// // 