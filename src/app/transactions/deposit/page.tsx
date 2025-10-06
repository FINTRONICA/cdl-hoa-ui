"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "../../../components/templates/DashboardLayout";
import { ExpandableDataTable } from "../../../components/organisms/ExpandableDataTable";
import { useTableState } from "../../../hooks/useTableState";
import LeftSlidePanel from "@/components/organisms/LeftSlidePanel/LeftSlidePanel";
import FilterListIcon from "@mui/icons-material/FilterList";

// Define the transaction data structure
interface DepositTransactionData extends Record<string, unknown> {
  developerManagementCompanyName: string; // EMS
  propertyName: string; // EMS
  propertyNumber: string; // EMS
  transactionReference: string; // Core Banking
  transactionDescription: string; // Core Banking
  transactionAmount: number; // Core Banking
  transactionDate: string; // Core Banking
  narration: string; // Core Banking
}

// Sample unallocated transaction data

const depositTransactionsData: DepositTransactionData[] = [
  {
    developerManagementCompanyName: "Green Group Developers",
    propertyName: "Palm Residency Tower A",
    propertyNumber: "PROP-001",
    transactionReference: "TRX-9001",
    transactionDescription: "Initial Deposit",
    transactionAmount: 250000,
    transactionDate: "2024-09-09",
    narration: "Deposit by John Smith",
  },
  {
    developerManagementCompanyName: "Oceanic Builders",
    propertyName: "Ocean View Apartments",
    propertyNumber: "PROP-002",
    transactionReference: "TRX-9002",
    transactionDescription: "Installment Payment",
    transactionAmount: 450000,
    transactionDate: "2024-09-15",
    narration: "Second-in by Sarah",
  },
  {
    developerManagementCompanyName: "Evergreen Estates",
    propertyName: "Green Heights",
    propertyNumber: "PROP-003",
    transactionReference: "TRX-9003",
    transactionDescription: "Final Settlement",
    transactionAmount: 320000,
    transactionDate: "2024-09-18",
    narration: "Final by Michael Brown",
  },
  {
    developerManagementCompanyName: "Sunrise Properties",
    propertyName: "Sunrise Villas",
    propertyNumber: "PROP-004",
    transactionReference: "TRX-9004",
    transactionDescription: "Deposit Transfer",
    transactionAmount: 600000,
    transactionDate: "2024-09-20",
    narration: "Transfer  by Emily Davis",
  },
  {
    developerManagementCompanyName: "Metro Realty",
    propertyName: "City Center Plaza",
    propertyNumber: "PROP-005",
    transactionReference: "TRX-9005",
    transactionDescription: "Advance Payment",
    transactionAmount: 150000,
    transactionDate: "2024-09-22",
    narration: "Advance-pay by William",
  },
  {
    developerManagementCompanyName: "Lakeside Developments",
    propertyName: "Lakeside Residency",
    propertyNumber: "PROP-006",
    transactionReference: "TRX-9006",
    transactionDescription: "Booking Deposit",
    transactionAmount: 275000,
    transactionDate: "2024-09-25",
    narration: "Booking deposit by Olivia",
  },
  {
    developerManagementCompanyName: "Hilltop Realty",
    propertyName: "Hilltop Towers",
    propertyNumber: "PROP-007",
    transactionReference: "TRX-9007",
    transactionDescription: "Installment Payment",
    transactionAmount: 500000,
    transactionDate: "2024-09-28",
    narration: "Third installment by Daniel",
  },
  {
    developerManagementCompanyName: "Maple Developers",
    propertyName: "Maple Garden Estate",
    propertyNumber: "PROP-008",
    transactionReference: "TRX-9008",
    transactionDescription: "Deposit Transfer",
    transactionAmount: 380000,
    transactionDate: "2024-10-01",
    narration: "Transfer for ophia Lee",
  },
  {
    developerManagementCompanyName: "Royal Properties",
    propertyName: "Royal Court Plaza",
    propertyNumber: "PROP-009",
    transactionReference: "TRX-9009",
    transactionDescription: "Advance Payment",
    transactionAmount: 290000,
    transactionDate: "2024-10-05",
    narration: "Advance for James ",
  },
  {
    developerManagementCompanyName: "Harbor View Estates",
    propertyName: "Harbor View Residences",
    propertyNumber: "PROP-010",
    transactionReference: "TRX-9010",
    transactionDescription: "Final Settlement",
    transactionAmount: 420000,
    transactionDate: "2024-10-10",
    narration: "Final settlement",
  },
];

const tableColumns = [
  {
    key: "developerManagementCompanyName",
    label: "Company Name",
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
    key: "propertyNumber",
    label: "Property Number",
    type: "text" as const,
    width: "w-35",
    sortable: true,
  },
  {
    key: "transactionReference",
    label: "Transaction Reference",
    type: "text" as const,
    width: "w-48",
    sortable: true,
  },
  {
    key: "transactionDescription",
    label: "Transaction Description",
    type: "text" as const,
    width: "w-40",
    sortable: true,
  },
  {
    key: "transactionAmount",
    label: "Transaction Amount",
    type: "number" as const,
    width: "w-40",
    sortable: true,
  },
  {
    key: "transactionDate",
    label: "Transaction Date",
    type: "date" as const,
    width: "w-35",
    sortable: true,
  },
  {
    key: "narration",
    label: "Narration",
    type: "text" as const,
    width: "w-48",
    sortable: true,
  },
  // { key: 'actions', label: 'Action', type: 'actions' as const, width: 'w-20' },
];

const DepositTransactionPage: React.FC = () => {
  const router = useRouter();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [showAllSearch, setShowAllSearch] = useState(false);

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US");
  };

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
    data: depositTransactionsData,
    searchFields: [
      "date",
      "transId",
      "projectAccountId",
      "developerName",
      "projectName",
      "projectRegulatorId",
      "unitNo",
    ],
    initialRowsPerPage: 20,
  });

  // Handle row view action - navigate to details page
  const handleRowView = (row: DepositTransactionData) => {
    console.log("row", row);
    router.push(`/transactions/unallocated/${row.transactionReference}`);
  };

  // Handle row click - navigate to details page
  const handleRowClick = (row: DepositTransactionData) => {
    console.log("row", row);
    router.push(`/transactions/unallocated/${row.transactionReference}`);
  };

  // Custom cell renderer for amount column
  const renderCustomCell = (column: string, value: unknown) => {
    if (column === "amount" && typeof value === "number") {
      return `AED ${formatNumber(value)}`;
    }
    return String(value || "");
  };

  // Render expanded content for transaction details
  const renderExpandedContent = (row: DepositTransactionData) => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Deposit Transactions Information
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">
              Developer/Management Company Name:
            </span>
            <span className="ml-2 font-medium text-gray-800">
              {row.developerManagementCompanyName}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Property Name:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.propertyName}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Property Number:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.propertyNumber}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Transaction Reference:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.transactionReference}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Transaction Description:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.transactionDescription}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Transaction Amount:</span>
            <span className="ml-2 font-medium text-gray-800">
              AED {formatNumber(row.transactionAmount)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Transaction Date:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.transactionDate}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">Narration:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.narration}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Transaction Actions
        </h4>
        <div className="space-y-3">
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            View Transaction Details
          </button>
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Allocate Transaction
          </button>
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Download Transaction Report
          </button>
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Export Transaction Data
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

      <DashboardLayout title="Deposit Transaction">
        <div className="bg-[#FFFFFFBF] border rounded-2xl flex flex-col h-full">
          {/* Sticky Header Section */}
          <div className="sticky top-0 bg-[#FFFFFFBF] border-b border-gray-200 rounded-t-1xl p-3 flex justify-end gap-1">
            {/* Hide/Show Search Button */}

            <button
              onClick={() => setShowAllSearch((prev) => !prev)}
              className="flex items-center h-8 px-4 mt-3.5 py-2  bg-[#155DFC] rounded-md gap-1.5 text-[#FAFAF9] font-sans font-medium text-sm hover:bg-blue-700 transition-colors"
            >
              <FilterListIcon fontSize="small" className="text-[#FAFAF9]" />
              {showAllSearch ? "Hide All Search" : "Show All Search"}
            </button>
            {/* Action Buttons */}
            <div className="flex justify-end gap-2 py-3.5 px-4">
              <button className="flex items-center h-8 py-1.5 px-2.5 gap-1.5 text-[#155DFC] font-sans font-medium text-sm hover:bg-blue-50 rounded-md transition-colors">
                <img src="/download icon.svg" alt="download icon" />
                Download Template
              </button>
              <button className="flex items-center h-8 py-1.5 bg-[#DBEAFE] rounded-md px-2.5 gap-1.5 text-[#155DFC] font-sans font-medium text-sm hover:bg-blue-100 transition-colors">
                <img src="/upload.svg" alt="upload icon" />
                Upload
              </button>
            </div>
          </div>

          {/* Table Container with Fixed Pagination */}
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-auto">
              <ExpandableDataTable<DepositTransactionData>
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
                onRowView={handleRowView}
                onRowClick={handleRowClick}
                renderCustomCell={renderCustomCell}
                showViewAction={true}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default DepositTransactionPage;
