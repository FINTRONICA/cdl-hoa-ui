"use client";

import React, { useState } from "react";
// import { DashboardLayout } from "../../../components/templates/DashboardLayout";
// import { ExpandableDataTable } from "../../../components/organisms/ExpandableDataTable";
// import { useTableState } from "../../../hooks/useTableState";
import FilterListIcon from "@mui/icons-material/FilterList";

// import { PageActionButtons } from "../../../components/molecules/PageActionButtons";
import LeftSlidePanel from "@/components/organisms/LeftSlidePanel/LeftSlidePanel";
import { useTableState } from "@/hooks";
import { DashboardLayout, ExpandableDataTable } from "@/components";
import { PageActionButtons } from "@/components/molecules/PageActionButtons";

// Define the budget payment data structure
interface MasterBudgetData extends Record<string, unknown> {
  budgetId: string;
  managementCompanyId: string;
  propertyName: string;
  budgetYear: string;
  totalBudgetAmount: number;
  totalAvailableAmount: number;
  totalUtilizedAmount: number;
}

// Sample budget payment data matching the screenshot
const masterBudgetsData: MasterBudgetData[] = [
  {
    budgetId: "BUDG26412",
    managementCompanyId: "MC346488",
    propertyName: "Al Manzel General",
    budgetYear: "2021-2022",
    totalBudgetAmount: 100000,
    totalAvailableAmount: 64000,
    totalUtilizedAmount: 36000,
  },
  {
    budgetId: "BUDG26413",
    managementCompanyId: "MC346488",
    propertyName: "Future Project",
    budgetYear: "2021-2022",
    totalBudgetAmount: 90000,
    totalAvailableAmount: 50000,
    totalUtilizedAmount: 40000,
  },
  {
    budgetId: "BUDG26414",
    managementCompanyId: "MC346488",
    propertyName: "ADGM Project",
    budgetYear: "2021-2022",
    totalBudgetAmount: 95000,
    totalAvailableAmount: 55000,
    totalUtilizedAmount: 40000,
  },
  {
    budgetId: "BUDG26415",
    managementCompanyId: "MC346489",
    propertyName: "Sunrise Tower",
    budgetYear: "2022-2023",
    totalBudgetAmount: 120000,
    totalAvailableAmount: 80000,
    totalUtilizedAmount: 40000,
  },
  {
    budgetId: "BUDG26416",
    managementCompanyId: "MC346489",
    propertyName: "Blue Horizon",
    budgetYear: "2022-2023",
    totalBudgetAmount: 110000,
    totalAvailableAmount: 70000,
    totalUtilizedAmount: 40000,
  },
  {
    budgetId: "BUDG26417",
    managementCompanyId: "MC346490",
    propertyName: "Marina View",
    budgetYear: "2022-2023",
    totalBudgetAmount: 130000,
    totalAvailableAmount: 90000,
    totalUtilizedAmount: 40000,
  },
  {
    budgetId: "BUDG26418",
    managementCompanyId: "MC346491",
    propertyName: "Palm Residences",
    budgetYear: "2023-2024",
    totalBudgetAmount: 140000,
    totalAvailableAmount: 95000,
    totalUtilizedAmount: 45000,
  },
  {
    budgetId: "BUDG26419",
    managementCompanyId: "MC346492",
    propertyName: "City Center Plaza",
    budgetYear: "2023-2024",
    totalBudgetAmount: 125000,
    totalAvailableAmount: 85000,
    totalUtilizedAmount: 40000,
  },
  {
    budgetId: "BUDG26420",
    managementCompanyId: "MC346493",
    propertyName: "Emerald Heights",
    budgetYear: "2023-2024",
    totalBudgetAmount: 150000,
    totalAvailableAmount: 100000,
    totalUtilizedAmount: 50000,
  },
  {
    budgetId: "BUDG26421",
    managementCompanyId: "MC346494",
    propertyName: "Royal Garden Villas",
    budgetYear: "2024-2025",
    totalBudgetAmount: 160000,
    totalAvailableAmount: 110000,
    totalUtilizedAmount: 50000,
  },
];

const statusOptions = [
  "Approved",
  "In Review",
  "Partial Payment",
  "Incomplete",
];

const tableColumns = [
  {
    key: "budgetId",
    label: "Budget ID",
    type: "text" as const,
    width: "w-32",
    sortable: true,
  },
  {
    key: "managementCompanyId",
    label: "Management Company ID",
    type: "text" as const,
    width: "w-48",
    sortable: true,
  },
  {
    key: "propertyName",
    label: "Property Name",
    type: "text" as const,
    width: "w-48",
    sortable: true,
  },
  {
    key: "budgetYear",
    label: "Budget Year",
    type: "text" as const,
    width: "w-32",
    sortable: true,
  },
  {
    key: "totalBudgetAmount",
    label: "Total Budget Amount",
    type: "number" as const,
    width: "w-48",
    sortable: true,
  },
  {
    key: "totalAvailableAmount",
    label: "Total Available Amount",
    type: "number" as const,
    width: "w-48",
    sortable: true,
  },
  {
    key: "totalUtilizedAmount",
    label: "Total Utilized Amount",
    type: "number" as const,
    width: "w-48",
    sortable: true,
  },
  {
    key: "actions",
    label: "Actions",
    type: "actions" as const,
    width: "w-20",
  },
];

const MasterBudgetPage: React.FC = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [showAllSearch, setShowAllSearch] = useState(false);

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
    data: masterBudgetsData,
    searchFields: [
      "budgetId",
      "managementCompanyId",
      "propertyName",
      "budgetYear",
      "totalBudgetAmount",
      "totalAvailableAmount",
      "totalUtilizedAmount",
    ],
    initialRowsPerPage: 20,
  });

  // Render expanded content
  const renderExpandedContent = (row: MasterBudgetData) => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Master Budget Information
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Budget ID:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.budgetId as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Management Company ID:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.managementCompanyId as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Property Name:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.propertyName as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Budget Year:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.budgetYear as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Total Budget Amount:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.totalBudgetAmount as number}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Total Available Amount:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.totalAvailableAmount as number}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Total Utilized Amount:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.totalUtilizedAmount as number}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Payment Details & Documents
        </h4>
        <div className="space-y-3">
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Payment Invoice
          </button>
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Construction Progress Report
          </button>
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Approval Documents
          </button>
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Payment History
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isSidePanelOpen && (
        <LeftSlidePanel
          isOpen={isSidePanelOpen}
          onClose={() => setIsSidePanelOpen(false)}
        />
      )}

      <DashboardLayout title="Master Budget">
        <div className="bg-[#FFFFFFBF] border rounded-2xl  flex-col h-full flex justify-end">
          {/* Sticky Header Section */}
          <div className="sticky top-0 bg-[#FFFFFFBF] border-b border-gray-200 rounded-t-1xl p-3 flex justify-end gap-1">
            {/* Hide/Show Search Button */}

            {/* <PageActionButtons
              entityType="masterBudget"
              showButtons={{ addNew: true }}
            /> */}

            <PageActionButtons
              entityType="masterBudget"
              showButtons={{ addNew: true, showAllSearch: true }}
              showAllSearch={showAllSearch}
              onToggleAllSearch={() => setShowAllSearch((prev) => !prev)}
            />
          </div>

          {/* Table Container with Fixed Pagination */}
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-auto">
              <ExpandableDataTable<MasterBudgetData>
                data={paginated}
                columns={tableColumns}
                showAllSearch={showAllSearch}
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
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default MasterBudgetPage;
