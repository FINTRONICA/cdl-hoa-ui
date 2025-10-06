"use client";

import React, { useState } from "react";
import { DashboardLayout } from "../../components/templates/DashboardLayout";
import { ExpandableDataTable } from "../../components/organisms/ExpandableDataTable";
import { useTableState } from "../../hooks/useTableState";
import { PageActionButtons } from "../../components/molecules/PageActionButtons";
import LeftSlidePanel from "@/components/organisms/LeftSlidePanel/LeftSlidePanel";

// Define the fee repush data structure
interface FeeRepushData extends Record<string, unknown> {
  projectName: string;
  feeType: string;
  amount: string;
  transactionDate: string;
  approvalStatus: string;
  paymentType: string;
}

// Sample fee repush data matching the screenshot
const feeRepushData: FeeRepushData[] = [
  {
    projectName: "Swastik Apartment",
    feeType: "Account Maintenance Charges",
    amount: "500",
    transactionDate: "25-04-2025",
    approvalStatus: "Failed",
    paymentType: "Credit Card",
  },
  {
    projectName: "Swastik Apartment",
    feeType: "Account Maintenance Charges",
    amount: "500",
    transactionDate: "25-04-2025",
    approvalStatus: "Failed",
    paymentType: "Credit Card",
  },
  {
    projectName: "Swastik Apartment",
    feeType: "Account Maintenance Charges",
    amount: "500",
    transactionDate: "25-04-2025",
    approvalStatus: "Failed",
    paymentType: "Credit Card",
  },
  {
    projectName: "Pro Extention New Test",
    feeType: "Account Opening Fee",
    amount: "100",
    transactionDate: "24-04-2025",
    approvalStatus: "Failed",
    paymentType: "Bank Transfer",
  },
  {
    projectName: "Pro Extention New Test",
    feeType: "Unit Registration Fee",
    amount: "100",
    transactionDate: "24-04-2025",
    approvalStatus: "Failed",
    paymentType: "Bank Transfer",
  },
  {
    projectName: "Dubai Residentials",
    feeType: "Account Opening Fee",
    amount: "10000",
    transactionDate: "23-04-2025",
    approvalStatus: "Failed",
    paymentType: "Credit Card",
  },
  {
    projectName: "Swastik Apartment",
    feeType: "Unit Modification Charges",
    amount: "200",
    transactionDate: "22-04-2025",
    approvalStatus: "Failed",
    paymentType: "Credit Card",
  },
  {
    projectName: "Swastik Hills",
    feeType: "Account Opening Fee",
    amount: "400",
    transactionDate: "21-04-2025",
    approvalStatus: "Failed",
    paymentType: "Bank Transfer",
  },
  {
    projectName: "Swastik Apartment",
    feeType: "Account Opening Fee",
    amount: "200",
    transactionDate: "20-04-2025",
    approvalStatus: "Failed",
    paymentType: "Credit Card",
  },
  {
    projectName: "Pro Extention New Test",
    feeType: "Unit Registration Fee",
    amount: "100",
    transactionDate: "19-04-2025",
    approvalStatus: "Failed",
    paymentType: "Bank Transfer",
  },
  {
    projectName: "Swastik Apartment",
    feeType: "Account Maintenance Charges",
    amount: "500",
    transactionDate: "18-04-2025",
    approvalStatus: "Failed",
    paymentType: "Credit Card",
  },
  {
    projectName: "Dubai Residentials",
    feeType: "Unit Registration Fee",
    amount: "5000",
    transactionDate: "17-04-2025",
    approvalStatus: "Failed",
    paymentType: "Credit Card",
  },
  {
    projectName: "Swastik Hills",
    feeType: "Account Maintenance Charges",
    amount: "300",
    transactionDate: "16-04-2025",
    approvalStatus: "Failed",
    paymentType: "Bank Transfer",
  },
  {
    projectName: "Pro Extention New Test",
    feeType: "Unit Modification Charges",
    amount: "150",
    transactionDate: "15-04-2025",
    approvalStatus: "Failed",
    paymentType: "Credit Card",
  },
  {
    projectName: "Swastik Apartment",
    feeType: "Account Opening Fee",
    amount: "300",
    transactionDate: "14-04-2025",
    approvalStatus: "Failed",
    paymentType: "Bank Transfer",
  },
  {
    projectName: "Dubai Residentials",
    feeType: "Account Maintenance Charges",
    amount: "800",
    transactionDate: "13-04-2025",
    approvalStatus: "Failed",
    paymentType: "Credit Card",
  },
  {
    projectName: "Swastik Hills",
    feeType: "Unit Registration Fee",
    amount: "250",
    transactionDate: "12-04-2025",
    approvalStatus: "Failed",
    paymentType: "Bank Transfer",
  },
  {
    projectName: "Pro Extention New Test",
    feeType: "Account Opening Fee",
    amount: "75",
    transactionDate: "11-04-2025",
    approvalStatus: "Failed",
    paymentType: "Credit Card",
  },
  {
    projectName: "Swastik Apartment",
    feeType: "Unit Modification Charges",
    amount: "180",
    transactionDate: "10-04-2025",
    approvalStatus: "Failed",
    paymentType: "Bank Transfer",
  },
  {
    projectName: "Dubai Residentials",
    feeType: "Account Maintenance Charges",
    amount: "1200",
    transactionDate: "09-04-2025",
    approvalStatus: "Failed",
    paymentType: "Credit Card",
  },
];

const statusOptions = ["Failed", "Pending", "Approved", "Rejected"];

const tableColumns = [
  {
    key: "projectName",
    label: "Project Name",
    type: "text" as const,
    width: "w-48",
    sortable: true,
  },
  {
    key: "feeType",
    label: "Fee Type",
    type: "text" as const,
    width: "w-48",
    sortable: true,
  },
  {
    key: "amount",
    label: "Amount",
    type: "text" as const,
    width: "w-32",
    sortable: true,
  },
  {
    key: "transactionDate",
    label: "Transaction Date",
    type: "text" as const,
    width: "w-40",
    sortable: true,
  },
  {
    key: "approvalStatus",
    label: "Approval Status",
    type: "status" as const,
    width: "w-40",
    sortable: true,
  },
  {
    key: "paymentType",
    label: "Payment Type",
    type: "text" as const,
    width: "w-40",
    sortable: true,
  },
  { key: "actions", label: "Actions", type: "actions" as const, width: "w-20" },
];

const FeeRepushPage: React.FC = () => {
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
    data: feeRepushData,
    searchFields: [
      "projectName",
      "feeType",
      "amount",
      "transactionDate",
      "approvalStatus",
      "paymentType",
    ],
    initialRowsPerPage: 20,
  });

  // Render expanded content
  const renderExpandedContent = (row: FeeRepushData) => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Fee Information
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Project Name:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.projectName as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Fee Type:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.feeType as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Amount:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.amount as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Transaction Date:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.transactionDate as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Approval Status:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.approvalStatus as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Payment Type:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.paymentType as string}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Fee Details & Actions
        </h4>
        <div className="space-y-3">
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Fee Invoice
          </button>
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Transaction History
          </button>
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Retry Payment
          </button>
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            View Error Details
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

      <DashboardLayout title="Fee Repush">
        <div className="bg-[#FFFFFFBF] border rounded-2xl flex flex-col h-full">
          {/* Sticky Header Section */}
          <div className="sticky top-0 z-10 bg-[#FFFFFFBF] border-b border-gray-200 rounded-t-2xl">
            {/* Action Buttons */}
            <PageActionButtons 
              entityType="feeRepush" 
              showButtons={{ addNew: true }}
            />

            {/* <PageActionButtons
              entityType="feeRepush"
              showButtons={{
                showAllSearch: true,

                addNew: true,
              }}
              showAllSearch={showAllSearch}
              onToggleAllSearch={() => setShowAllSearch((prev) => !prev)}
            /> */}
          </div>

          {/* Table Container with Fixed Pagination */}
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-auto">
              <ExpandableDataTable<FeeRepushData>
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
                statusOptions={statusOptions}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default FeeRepushPage;
