"use client";

import React, { useState } from "react";
import { DashboardLayout } from "../../../components/templates/DashboardLayout";
import { ExpandableDataTable } from "../../../components/organisms/ExpandableDataTable";
import { useTableState } from "../../../hooks/useTableState";
import LeftSlidePanel from "@/components/organisms/LeftSlidePanel/LeftSlidePanel";
import FilterListIcon from "@mui/icons-material/FilterList";

// Define the transaction data structure
interface TransactionData extends Record<string, unknown> {
  propertyNumber: string;
  propertyName: string;
  transactionReferenceNumber: string;
  unitReferenceNumberInvestorName: string;
  splitAmount: number;
  receivableBucket: string;
  depositMode: string;
  reservePercentage: number;
  reserveAmount: number;
}

// Sample transaction data from the original page
const transactionsData: TransactionData[] = [
  {
    propertyNumber: "PROP-001",
    propertyName: "Palm Residency Tower A",
    transactionReferenceNumber: "TRX-9001",
    unitReferenceNumberInvestorName: "UNIT-101 / John Smith",
    splitAmount: 250000,
    receivableBucket: "Bucket A",
    depositMode: "Bank Transfer",
    reservePercentage: 10,
    reserveAmount: 25000,
  },
  {
    propertyNumber: "PROP-002",
    propertyName: "Ocean View Apartments",
    transactionReferenceNumber: "TRX-9002",
    unitReferenceNumberInvestorName: "UNIT-305 / Sarah Johnson",
    splitAmount: 450000,
    receivableBucket: "Bucket B",
    depositMode: "Cheque",
    reservePercentage: 8,
    reserveAmount: 36000,
  },
  {
    propertyNumber: "PROP-003",
    propertyName: "Green Heights",
    transactionReferenceNumber: "TRX-9003",
    unitReferenceNumberInvestorName: "UNIT-208 / Michael Brown",
    splitAmount: 320000,
    receivableBucket: "Bucket A",
    depositMode: "Cash",
    reservePercentage: 5,
    reserveAmount: 16000,
  },
  {
    propertyNumber: "PROP-004",
    propertyName: "Sunrise Villas",
    transactionReferenceNumber: "TRX-9004",
    unitReferenceNumberInvestorName: "UNIT-512 / Emily Davis",
    splitAmount: 600000,
    receivableBucket: "Bucket C",
    depositMode: "Bank Transfer",
    reservePercentage: 12,
    reserveAmount: 72000,
  },
  {
    propertyNumber: "PROP-005",
    propertyName: "City Center Plaza",
    transactionReferenceNumber: "TRX-9005",
    unitReferenceNumberInvestorName: "UNIT-109 / William Taylor",
    splitAmount: 150000,
    receivableBucket: "Bucket B",
    depositMode: "Online Payment",
    reservePercentage: 7,
    reserveAmount: 10500,
  },
  {
    propertyNumber: "PROP-006",
    propertyName: "Lakeside Residency",
    transactionReferenceNumber: "TRX-9006",
    unitReferenceNumberInvestorName: "UNIT-220 / Olivia Martin",
    splitAmount: 275000,
    receivableBucket: "Bucket A",
    depositMode: "Bank Transfer",
    reservePercentage: 9,
    reserveAmount: 24750,
  },
  {
    propertyNumber: "PROP-007",
    propertyName: "Hilltop Towers",
    transactionReferenceNumber: "TRX-9007",
    unitReferenceNumberInvestorName: "UNIT-702 / Daniel Garcia",
    splitAmount: 500000,
    receivableBucket: "Bucket C",
    depositMode: "Cheque",
    reservePercentage: 6,
    reserveAmount: 30000,
  },
  {
    propertyNumber: "PROP-008",
    propertyName: "Maple Garden Estate",
    transactionReferenceNumber: "TRX-9008",
    unitReferenceNumberInvestorName: "UNIT-405 / Sophia Lee",
    splitAmount: 380000,
    receivableBucket: "Bucket B",
    depositMode: "Cash",
    reservePercentage: 11,
    reserveAmount: 41800,
  },
  {
    propertyNumber: "PROP-009",
    propertyName: "Royal Court Plaza",
    transactionReferenceNumber: "TRX-9009",
    unitReferenceNumberInvestorName: "UNIT-303 / James Anderson",
    splitAmount: 290000,
    receivableBucket: "Bucket A",
    depositMode: "Online Payment",
    reservePercentage: 4,
    reserveAmount: 11600,
  },
  {
    propertyNumber: "PROP-010",
    propertyName: "Harbor View Residences",
    transactionReferenceNumber: "TRX-9010",
    unitReferenceNumberInvestorName: "UNIT-120 / Isabella White",
    splitAmount: 420000,
    receivableBucket: "Bucket C",
    depositMode: "Bank Transfer",
    reservePercentage: 10,
    reserveAmount: 42000,
  },
];

const tableColumns = [
  {
    key: "propertyNumber",
    label: "Property Number",
    type: "text" as const,
    width: "w-40",
    sortable: true,
  },
  {
    key: "propertyName",
    label: "Property Name",
    type: "text" as const,
    width: "w-40",
    sortable: true,
  },
  {
    key: "transactionReferenceNumber",
    label: "Transaction Reference Number",
    type: "text" as const,
    width: "w-40",
    sortable: true,
  },
  {
    key: "unitReferenceNumberInvestorName",
    label: "Unit Reference Number & Investor/Buyer Name",
    type: "text" as const,
    width: "w-48",
    sortable: true,
  },
  {
    key: "splitAmount",
    label: "Split Amount",
    type: "text" as const,
    width: "w-40",
    sortable: true,
  },
  {
    key: "receivableBucket",
    label: "Receivable Bucket",
    type: "text" as const,
    width: "w-48",
    sortable: true,
  },
  {
    key: "depositMode",
    label: "Deposit Mode",
    type: "text" as const,
    width: "w-40",
    sortable: true,
  },
  {
    key: "reservePercentage",
    label: "Reserve Percentage",
    type: "text" as const,
    width: "w-30",
    sortable: true,
  },
  {
    key: "reserveAmount",
    label: "Reserve Amount",
    type: "text" as const,
    width: "w-30",
    sortable: true,
  },
];

const AllocatedTransactionPage: React.FC = () => {
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
    data: transactionsData,
    searchFields: [
      "propertyNumber",
      "propertyName",
      "transactionReferenceNumber",
      "unitReferenceNumberInvestorName",
      "splitAmount",
      "receivableBucket",
      "depositMode",
      "reservePercentage",
      "reserveAmount",
    ],
    initialRowsPerPage: 20,
  });

  // Render expanded content for transaction details
  const renderExpandedContent = (row: TransactionData) => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Property Number:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.propertyNumber}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Property Name:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.propertyName}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Transaction Reference Number:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.transactionReferenceNumber}
            </span>
          </div>
          <div>
            <span className="text-gray-600">
              Unit Reference Number & Investor/Buyer Name:
            </span>
            <span className="ml-2 font-medium text-gray-800">
              {row.unitReferenceNumberInvestorName}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Split Amount:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.splitAmount}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Receivable Bucket:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.receivableBucket}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Deposit Mode:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.depositMode}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Reserve Percentage:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.reservePercentage}%
            </span>
          </div>
          <div>
            <span className="text-gray-600">Reserve Amount:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.reserveAmount}
            </span>
          </div>
        </div>

        {/* <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Date:</span>
            <span className="ml-2 font-medium text-gray-800">{row.date}</span>
          </div>
          <div>
            <span className="text-gray-600">Transaction ID:</span>
            <span className="ml-2 font-medium text-gray-800">{row.transId}</span>
          </div>
          <div>
            <span className="text-gray-600">Project Account (CIF):</span>
            <span className="ml-2 font-medium text-gray-800">{row.projectAccountId}</span>
          </div>
          <div>
            <span className="text-gray-600">Developer Name:</span>
            <span className="ml-2 font-medium text-gray-800">{row.developerName}</span>
          </div>
          <div>
            <span className="text-gray-600">Project Name:</span>
            <span className="ml-2 font-medium text-gray-800">{row.projectName}</span>
          </div>
          <div>
            <span className="text-gray-600">Project Regulator ID:</span>
            <span className="ml-2 font-medium text-gray-800">{row.projectRegulatorId}</span>
          </div>
          <div>
            <span className="text-gray-600">Unit No. Oqood Format:</span>
            <span className="ml-2 font-medium text-gray-800">{row.unitNo}</span>
          </div>
          <div>
            <span className="text-gray-600">Status:</span>
            <span className="ml-2 font-medium text-gray-800">Allocated</span>
          </div>
        </div> */}
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
            Download Transaction Report
          </button>
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Deallocate Transaction
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

      <DashboardLayout title="Allocated  Transaction">
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
              <ExpandableDataTable<TransactionData>
                data={paginated}
                columns={tableColumns}
                searchState={search}
                showAllSearch={showAllSearch}
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
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AllocatedTransactionPage;
