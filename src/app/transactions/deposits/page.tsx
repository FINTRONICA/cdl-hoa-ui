"use client";

/**
 * Deposits Transactions Page
 *
 * Displays deposit transactions with dynamic labels from the API.
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

const DepositsTransactionPage: React.FC = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const confirmDelete = useDeleteConfirmation();

  const currentLanguage = useAppStore((state) => state.language) || "EN";
  const { getLabelResolver } = useSidebarConfig();
  const depositsTitle = getLabelResolver
    ? getLabelResolver("depositsTransactions", "Deposits Transactions")
    : "Deposits Transactions";
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
    { isAllocated: false } // Show unallocated transactions for deposits
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
      label: getTransactionLabelDynamic("CDL_TRAN_DEPOSITS_PROPERTY_NUMBER"),
      type: "text" as const,
      width: "w-40",
      sortable: true,
    },
    {
      key: "transactionPropertyName",
      label: getTransactionLabelDynamic("CDL_TRAN_DEPOSITS_PROPERTY_NAME"),
      type: "text" as const,
      width: "w-40",
      sortable: true,
    },
    {
      key: "transId",
      label: getTransactionLabelDynamic("CDL_TRAN_DEPOSITS_TRANSACTION_REFERENCE"),
      type: "text" as const,
      width: "w-40",
      sortable: true,
    },
    {
      key: "description",
      label: getTransactionLabelDynamic("CDL_TRAN_DEPOSITS_TRANSACTION_DESCRIPTION"),
      type: "text" as const,
      width: "w-48",
      sortable: true,
    },
    {
      key: "amount",
      label: getTransactionLabelDynamic("CDL_TRAN_DEPOSITS_TRANSACTION_AMOUNT"),
      type: "custom" as const,
      width: "w-40",
      sortable: true,
    },
    {
      key: "paymentStatus",
      label: getTransactionLabelDynamic("CDL_TRAN_DEPOSITS_TRANSACTION_STATUS"),
      type: "text" as const,
      width: "w-40",
      sortable: true,
    },
    {
      key: "date",
      label: getTransactionLabelDynamic("CDL_TRAN_DEPOSITS_TRANSACTION_DATE"),
      type: "text" as const,
      width: "w-40",
      sortable: true,
    },
    {
      key: "narration",
      label: getTransactionLabelDynamic("CDL_TRAN_DEPOSITS_TRANSACTION_NARRATION"),
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
        // Deposit-specific fields with fallback
        transactionPropertyNumber: item.transactionPropertyNumber || "-",
        transactionPropertyName: item.transactionPropertyName || "-",
        transId: item.transId || "-",
        description: item.description || "-",
        amount: item.amount || "-",
        paymentStatus: item.paymentStatus || "-",
        date: item.date || "-",
        narration: item.narration || "-",
        currency: item.currency || "",
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
      "transactionPropertyNumber",
      "transactionPropertyName",
      "transId",
      "description",
      "amount",
      "paymentStatus",
      "date",
      "narration",
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

  if (transactionsLoading || labelsLoading) {
    return (
      <DashboardLayout title={depositsTitle}>
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
      <DashboardLayout title={depositsTitle}>
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

      <DashboardLayout title={depositsTitle}>
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

export default DepositsTransactionPage;
