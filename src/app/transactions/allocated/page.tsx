"use client";

/**
 * Allocated Transactions Page
 *
 * Displays allocated/processed transactions with dynamic labels from the API.
 * Uses Label Configuration API service with fallback to static labels.
 */

import React, { useState } from "react";
import { DashboardLayout } from "../../../components/templates/DashboardLayout";
import { PermissionAwareDataTable } from "../../../components/organisms/PermissionAwareDataTable";
import { useTableState } from "../../../hooks/useTableState";
import LeftSlidePanel from "@/components/organisms/LeftSlidePanel/LeftSlidePanel";
import { useProcessedTransactions } from "@/hooks/useProcessedTransactions";
import { getProcessedTransactionLabel } from "@/constants/mappings/processedTransactionMapping";
import { useAppStore } from "@/store";
import { useSidebarConfig } from "@/hooks/useSidebarConfig";
import { useLabelConfigApi } from "@/hooks/useLabelConfigApi";
import type { ProcessedTransactionUIData } from "@/services/api/processedTransactionService";
import { useDeleteConfirmation } from "@/store/confirmationDialogStore";

interface TransactionTableData
  extends ProcessedTransactionUIData,
    Record<string, unknown> {}

const AllocatedTransactionPage: React.FC = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const confirmDelete = useDeleteConfirmation();

  const currentLanguage = useAppStore((state) => state.language) || "EN";
  const { getLabelResolver } = useSidebarConfig();
  const allocatedTitle = getLabelResolver
    ? getLabelResolver("allocated", "Allocated")
    : "Allocated";
  const [currentApiPage, setCurrentApiPage] = useState(1);
  const [currentApiSize, setCurrentApiSize] = useState(20);

  // Use the new label configuration API
  const {
    getLabel: getLabelFromApi,
    isLoading: labelsLoading,
    error: labelsError,
  } = useLabelConfigApi();

  const {
    data: processedTransactionsData,
    loading: transactionsLoading,
    error: transactionsError,
    updatePagination,
    deleteTransaction,
  } = useProcessedTransactions(
    Math.max(0, currentApiPage - 1),
    currentApiSize,
    { isAllocated: true }
  );

  const getTransactionLabelDynamic = React.useCallback(
    (configId: string): string => {
      const apiLabel = getLabelFromApi(configId, currentLanguage);

      if (apiLabel !== configId) {
        return apiLabel;
      }

      const fallbackLabel = getProcessedTransactionLabel(configId);
      return fallbackLabel;
    },
    [getLabelFromApi, currentLanguage]
  );

  const tableColumns = [
    {
      key: "transactionPropertyNumber",
      label: getTransactionLabelDynamic("CDL_TRAN_PROPERTY_NUMBER"),
      type: "text" as const,
      width: "w-40",
      sortable: true,
    },
    {
      key: "transactionPropertyName",
      label: getTransactionLabelDynamic("CDL_TRAN_PROPERTY_NAME"),
      type: "text" as const,
      width: "w-40",
      sortable: true,
    },
    {
      key: "transactionUnitReferenceNumber",
      label: getTransactionLabelDynamic("CDL_TRAN_UNIT_REFERENCE_NUMBER"),
      type: "text" as const,
      width: "w-60",
      sortable: true,
    },
    {
      key: "transactionSplitAmount",
      label: getTransactionLabelDynamic("CDL_TRAN_SPLIT_AMOUNT"),
      type: "text" as const,
      width: "w-40",
      sortable: true,
    },
    {
      key: "transactionReceivableBucket",
      label: getTransactionLabelDynamic("CDL_TRAN_RECEIVABLE_BUCKET"),
      type: "text" as const,
      width: "w-40",
      sortable: true,
    },
    {
      key: "transactionDepositMode",
      label: getTransactionLabelDynamic("CDL_TRAN_DEPOSIT_MODE"),
      type: "text" as const,
      width: "w-40",
      sortable: true,
    },
    {
      key: "transactionReservePresentage",
      label: getTransactionLabelDynamic("CDL_TRAN_RESERVE_PRESENTAGE"),
      type: "text" as const,
      width: "w-50",
      sortable: true,
    },
    {
      key: "transactionReserveAmount",
      label: getTransactionLabelDynamic("CDL_TRAN_RESERVE_AMOUNT"),
      type: "text" as const,
      width: "w-40",
      sortable: true,
    },
    {
      key: "date",
      label: getTransactionLabelDynamic("CDL_TRAN_DATE"),
      type: "text" as const,
      width: "w-40",
      sortable: true,
    },
    {
      key: "transId",
      label: getTransactionLabelDynamic("CDL_TRAN_REFNO"),
      type: "text" as const,
      width: "w-40",
      sortable: true,
    },
 
    // {
    //   key: "projectName",
    //   label: getTransactionLabelDynamic("CDL_TRANS_BPA_NAME"),
    //   type: "text" as const,
    //   width: "w-48",
    //   sortable: true,
    // },
    {
      key: "projectRegulatorId",
      label: getTransactionLabelDynamic("CDL_TRANS_BPA_REGULATOR"),
      type: "text" as const,
      width: "w-40",
      sortable: true,
    },
    {
      key: "unitNo",
      label: getTransactionLabelDynamic("CDL_TRANS_UNIT_HOLDER"),
      type: "text" as const,
      width: "w-40",
      sortable: true,
    },
    {
      key: "receivableCategory",
      label: getTransactionLabelDynamic("CDL_TRAN_RECEIVABLE_CATEGORY"),
      type: "text" as const,
      width: "w-48",
      sortable: true,
    },
    {
      key: "tasCbsMatch",
      label: getTransactionLabelDynamic("CDL_TRAN_MATCHING_STATUS"),
      type: "text" as const,
      width: "w-32",
      sortable: true,
    },
    {
      key: "amount",
      label: getTransactionLabelDynamic("CDL_TRAN_AMOUNT"),
      type: "custom" as const,
      width: "w-40",
      sortable: true,
    },
    {
      key: "narration",
      label: getTransactionLabelDynamic("CDL_TRAN_NOTES"),
      type: "text" as const,
      width: "w-48",
      sortable: true,
    },
    {
      key: "actions",
      label: getTransactionLabelDynamic("CDL_TRAN_ACTION"),
      type: "actions" as const,
      width: "w-20",
    },
  ];

  const tableData = React.useMemo(() => {
    if (!processedTransactionsData?.content) {
      return [];
    }

    const items = processedTransactionsData.content;

    return items.map((item) => {
      return {
        ...item,
        // New fields with fallback
        transactionPropertyNumber: item.transactionPropertyNumber || "-",
        transactionPropertyName: item.transactionPropertyName || "-",
        transactionUnitReferenceNumber: item.transactionUnitReferenceNumber || "-",
        transactionSplitAmount: item.transactionSplitAmount || "-",
        transactionReceivableBucket: item.transactionReceivableBucket || "-",
        transactionDepositMode: item.transactionDepositMode || "-",
        transactionReservePresentage: item.transactionReservePresentage || "-",
        transactionReserveAmount: item.transactionReserveAmount || "-",
        // Existing fields with fallback for safety
        date: item.date || "-",
        transId: item.transId || "-",
        projectAccountId: item.projectAccountId || "-",
        developerName: item.developerName || "-",
        projectName: item.projectName || "-",
        projectRegulatorId: item.projectRegulatorId || "-",
        unitNo: item.unitNo || "-",
        receivableCategory: item.receivableCategory || "-",
        tasCbsMatch: item.tasCbsMatch || "-",
        amount: item.amount || "-",
        narration: item.narration || "-",
        totalAmount: item.totalAmount || "-",
        currency: item.currency || "",
        description: item.description || "-",
        paymentStatus: item.paymentStatus || "-",
        allocated: item.allocated || "-",
      } as TransactionTableData;
    });
  }, [processedTransactionsData]);

  const {
    search,
    paginated,
    totalRows: localTotalRows,
    totalPages: localTotalPages,
    startItem,
    endItem,
    page: localPage,
    rowsPerPage,
    selectedRows,
    expandedRows,
    handleSearchChange,
    handlePageChange: localHandlePageChange,
    handleRowsPerPageChange: localHandleRowsPerPageChange,
    handleRowSelectionChange,
    handleRowExpansionChange,
    handleSort,
    sortConfig,
  } = useTableState({
    data: tableData,
    searchFields: [
      "date",
      "transId",
      "projectAccountId",
      "developerName",
      "projectName",
      "projectRegulatorId",
      "unitNo",
      "receivableCategory",
      "narration",
      "transactionPropertyNumber",
      "transactionPropertyName",
      "transactionUnitReferenceNumber",
      "transactionSplitAmount",
      "transactionReceivableBucket",
      "transactionDepositMode",
      "transactionReservePresentage",
      "transactionReserveAmount",
    ],
    initialRowsPerPage: currentApiSize,
  });

  const handlePageChange = (newPage: number) => {
    const hasSearch = Object.values(search).some((value) => value.trim());

    if (hasSearch) {
      localHandlePageChange(newPage);
    } else {
      setCurrentApiPage(newPage);
      updatePagination(Math.max(0, newPage - 1), currentApiSize);
    }
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setCurrentApiSize(newRowsPerPage);
    setCurrentApiPage(1);
    updatePagination(0, newRowsPerPage);
    localHandleRowsPerPageChange(newRowsPerPage);
  };

  const apiTotal = processedTransactionsData?.page?.totalElements || 0;
  const apiTotalPages = processedTransactionsData?.page?.totalPages || 1;

  const hasActiveSearch = Object.values(search).some((value) => value.trim());

  const effectiveTotalRows = hasActiveSearch ? localTotalRows : apiTotal;
  const effectiveTotalPages = hasActiveSearch ? localTotalPages : apiTotalPages;
  const effectivePage = hasActiveSearch ? localPage : currentApiPage;

  // Calculate effective startItem and endItem based on pagination type
  const effectiveStartItem = hasActiveSearch
    ? startItem
    : (currentApiPage - 1) * currentApiSize + 1;
  const effectiveEndItem = hasActiveSearch
    ? endItem
    : Math.min(currentApiPage * currentApiSize, apiTotal);

  const handleRowDelete = (row: TransactionTableData) => {
    if (isDeleting) {
      return;
    }

    confirmDelete({
      itemName: `transaction: ${row.transId}`,
      itemId: row.id.toString(),
      onConfirm: async () => {
        try {
          setIsDeleting(true);
          await deleteTransaction(row.id);
          console.log(
            `Transaction "${row.transId}" has been deleted successfully.`
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
          console.error(`Failed to delete transaction: ${errorMessage}`);
          throw error; // Re-throw to keep dialog open on error
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  // const renderExpandedContent = (row: TransactionTableData) => (
  //   <div className="grid grid-cols-2 gap-8">
  //     <div className="space-y-4">
  //       <h4 className="mb-4 text-sm font-semibold text-gray-900">
  //         Transaction Information
  //       </h4>
  //       <div className="grid grid-cols-2 gap-4 text-sm">
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRAN_PROPERTY_NUMBER")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">{row.transactionPropertyNumber || "-"}</span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRAN_PROPERTY_NAME")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">{row.transactionPropertyName || "-"}</span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRAN_UNIT_REFERENCE_NUMBER")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">{row.transactionUnitReferenceNumber || "-"}</span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRAN_SPLIT_AMOUNT")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">{row.transactionSplitAmount || "-"}</span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRAN_RECEIVABLE_BUCKET")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">{row.transactionReceivableBucket || "-"}</span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRAN_DEPOSIT_MODE")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">{row.transactionDepositMode || "-"}</span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRAN_RESERVE_PRESENTAGE")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">{row.transactionReservePresentage || "-"}</span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRAN_RESERVE_AMOUNT")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">{row.transactionReserveAmount || "-"}</span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRAN_DATE")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">{row.date || "-"}</span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRAN_REFNO")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {row.transId || "-"}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRANS_BP_CIF")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {row.projectAccountId || "-"}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRANS_BP_NAME")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {row.developerName || "-"}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRANS_BPA_NAME")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {row.projectName || "-"}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRANS_BPA_REGULATOR")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {row.projectRegulatorId || "-"}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRANS_UNIT_HOLDER")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">{row.unitNo || "-"}</span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRAN_RECEIVABLE_CATEGORY")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {row.receivableCategory || "-"}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRAN_MATCHING_STATUS")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {row.tasCbsMatch || "-"}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRAN_AMOUNT")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {row.amount || "-"} {row.currency || ""}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRAN_NOTES")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {row.narration || "-"}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRANS_APPROVAL_STATUS")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {row.paymentStatus || "-"}
  //           </span>
  //         </div>
  //         <div>
  //           <span className="text-gray-600">
  //             {getTransactionLabelDynamic("CDL_TRAN_TOTAL_AMT")}:
  //           </span>
  //           <span className="ml-2 font-medium text-gray-800">
  //             {row.totalAmount || "-"} {row.currency || ""}
  //           </span>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="space-y-4">
  //       <h4 className="mb-4 text-sm font-semibold text-gray-900">
  //         Transaction Actions
  //       </h4>
  //       <div className="space-y-3">
  //         <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
  //           {getTransactionLabelDynamic("CDL_TRAN_ACTION")} - View Details
  //         </button>
  //         <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
  //           {getTransactionLabelDynamic("CDL_TRAN_TEMPLATE_DOWNLOAD")} - Report
  //         </button>
  //         <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
  //           {getTransactionLabelDynamic("CDL_TRAN_ROLLBACK")} - Deallocate
  //         </button>
  //         <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
  //           Export Transaction Data
  //         </button>
  //       </div>

  //       <div className="pt-4 mt-4 border-t border-gray-200">
  //         <h5 className="mb-2 text-xs font-semibold text-gray-700">
  //           Additional Details
  //         </h5>
  //         <div className="grid grid-cols-1 gap-2 text-xs">
  //           {row.narration && (
  //             <div>
  //               <span className="text-gray-600">
  //                 {getTransactionLabelDynamic("CDL_TRAN_NOTES")}:
  //               </span>
  //               <span className="ml-2 text-gray-800">{row.narration}</span>
  //             </div>
  //           )}
  //           {row.description && (
  //             <div>
  //               <span className="text-gray-600">
  //                 {getTransactionLabelDynamic("CDL_TRAN_DESC")}:
  //               </span>
  //               <span className="ml-2 text-gray-800">{row.description}</span>
  //             </div>
  //           )}
  //           <div>
  //             <span className="text-gray-600">Allocated:</span>
  //             <span className="ml-2 text-gray-800">{row.allocated}</span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  if (transactionsLoading || labelsLoading) {
    return (
      <DashboardLayout title={allocatedTitle}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">
              {transactionsLoading && labelsLoading
                ? "Loading..."
                : transactionsLoading
                  ? "Loading..."
                  : "Loading..."}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (transactionsError || labelsError) {
    return (
      <DashboardLayout title={allocatedTitle}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="mb-4 text-red-600">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {transactionsError && labelsError
                ? "Error Loading Transactions and Labels"
                : transactionsError
                  ? "Error Loading Transactions"
                  : "Error Loading Labels"}
            </h3>
            <p className="mb-4 text-gray-600">Please try refreshing the page</p>
            <div className="max-w-md p-4 mx-auto text-xs text-left border rounded bg-red-50">
              <p>
                <strong>Error Details:</strong>
              </p>
              {transactionsError && (
                <div className="mb-2">
                  <p>
                    <strong>Transactions:</strong> {transactionsError}
                  </p>
                </div>
              )}
              {labelsError && (
                <div className="mb-2">
                  <p>
                    <strong>Labels:</strong> {labelsError}
                  </p>
                </div>
              )}
              {process.env.NODE_ENV === "development" && (
                <pre className="mt-2 text-xs">
                  {JSON.stringify({ transactionsError, labelsError }, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      {isSidePanelOpen && (
        <LeftSlidePanel
          isOpen={isSidePanelOpen}
          onClose={() => setIsSidePanelOpen(false)}
        />
      )}

      <DashboardLayout title={allocatedTitle}>
        <div className="bg-[#FFFFFFBF] rounded-2xl flex flex-col h-full">
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-auto">
              <PermissionAwareDataTable<TransactionTableData>
                data={paginated}
                columns={tableColumns}
                searchState={search}
                onSearchChange={handleSearchChange}
                paginationState={{
                  page: effectivePage,
                  rowsPerPage: rowsPerPage,
                  totalRows: effectiveTotalRows,
                  totalPages: effectiveTotalPages,
                  startItem: effectiveStartItem,
                  endItem: effectiveEndItem,
                }}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                selectedRows={selectedRows}
                onRowSelectionChange={handleRowSelectionChange}
                expandedRows={expandedRows}
                onRowExpansionChange={handleRowExpansionChange}
                // renderExpandedContent={renderExpandedContent}
                onRowDelete={handleRowDelete}
                deletePermissions={["processed_tran_delete"]}
                viewPermissions={["processed_tran_view"]}
                updatePermissions={["processed_tran_update"]}
                showDeleteAction={true}
                showViewAction={true}
                onSort={handleSort}
                sortConfig={sortConfig}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AllocatedTransactionPage;
