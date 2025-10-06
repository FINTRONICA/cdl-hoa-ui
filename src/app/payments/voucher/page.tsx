"use client";

import React, { useState } from "react";
import { DashboardLayout } from "../../../components/templates/DashboardLayout";
import { ExpandableDataTable } from "../../../components/organisms/ExpandableDataTable";
import { useTableState } from "../../../hooks/useTableState";
import FilterListIcon from "@mui/icons-material/FilterList";
import { PageActionButtons } from "../../../components/molecules/PageActionButtons";
import LeftSlidePanel from "@/components/organisms/LeftSlidePanel/LeftSlidePanel";

// Define the voucher payment data structure
interface VoucherPaymentData extends Record<string, unknown> {
  date: string;
  takermsPaymentRefNo: string;
  developerName: string;
  projectName: string;
  paymentType: string;
  approvalStatus: string;
}

// Sample voucher payment data matching the screenshot
const voucherPaymentsData: VoucherPaymentData[] = [
  {
    date: "25-04-2025",
    takermsPaymentRefNo: "INV7075",
    developerName: "Select Global",
    projectName: "Tulip Building",
    paymentType: "Construction Cost",
    approvalStatus: "In Review",
  },
  {
    date: "25-04-2025",
    takermsPaymentRefNo: "INV7074",
    developerName: "Select Global",
    projectName: "Tulip Building",
    paymentType: "Construction Cost",
    approvalStatus: "In Review",
  },
  {
    date: "06-02-2025",
    takermsPaymentRefNo: "INV6839",
    developerName: "Select Global",
    projectName: "Tulip Building",
    paymentType: "Infrastructure Payment",
    approvalStatus: "Partial Payment",
  },
  {
    date: "06-02-2025",
    takermsPaymentRefNo: "INV6832",
    developerName: "Select Global",
    projectName: "Tulip Building",
    paymentType: "Construction Cost",
    approvalStatus: "Approved",
  },
  {
    date: "15-01-2025",
    takermsPaymentRefNo: "INV6794",
    developerName: "Green Group",
    projectName: "Pro Extention New test",
    paymentType: "Unit Cancellation Tran",
    approvalStatus: "Incomplete",
  },
  {
    date: "15-01-2025",
    takermsPaymentRefNo: "INV6793",
    developerName: "Green Group",
    projectName: "Pro Extention New test",
    paymentType: "Unit Cancellation Tran",
    approvalStatus: "Incomplete",
  },
  {
    date: "04-10-2024",
    takermsPaymentRefNo: "INV6707",
    developerName: "AlNaboodah Construction Group LLC",
    projectName: "All Hazrat Tower",
    paymentType: "Construction Cost",
    approvalStatus: "Partial Payment",
  },
  {
    date: "09-09-2024",
    takermsPaymentRefNo: "INV6677",
    developerName: "Hill International Construction",
    projectName: "Akhtar Villa Town",
    paymentType: "Construction Cost",
    approvalStatus: "Approved",
  },
  {
    date: "28-08-2024",
    takermsPaymentRefNo: "INV6648",
    developerName: "Wasl Properties",
    projectName: "wasl green park",
    paymentType: "Construction Cost",
    approvalStatus: "Approved",
  },
  {
    date: "28-08-2024",
    takermsPaymentRefNo: "INV6640",
    developerName: "MAG PROPERTY DEVELOPMENT",
    projectName: "MAG 5 Boulevard",
    paymentType: "RERA Fees",
    approvalStatus: "Approved",
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
    key: "date",
    label: "Date",
    type: "text" as const,
    width: "w-32",
    sortable: true,
  },
  {
    key: "takermsPaymentRefNo",
    label: "TAS/EMS Payment Ref. No.",
    type: "text" as const,
    width: "w-48",
    sortable: true,
  },
  {
    key: "developerName",
    label: "Developer Name",
    type: "text" as const,
    width: "w-48",
    sortable: true,
  },
  {
    key: "projectName",
    label: "Project Name",
    type: "text" as const,
    width: "w-48",
    sortable: true,
  },
  {
    key: "paymentType",
    label: "Payment Type",
    type: "text" as const,
    width: "w-48",
    sortable: true,
  },
  {
    key: "approvalStatus",
    label: "Approval Status",
    type: "status" as const,
    width: "w-32",
    sortable: true,
  },
  { key: "actions", label: "Actions", type: "actions" as const, width: "w-20" },
];

const VoucherPaymentPage: React.FC = () => {
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
    data: voucherPaymentsData,
    searchFields: [
      "date",
      "takermsPaymentRefNo",
      "developerName",
      "projectName",
      "paymentType",
      "approvalStatus",
    ],
    initialRowsPerPage: 20,
  });

  // Render expanded content
  const renderExpandedContent = (row: VoucherPaymentData) => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Payment Information
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Date:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.date as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">TAS/EMS Payment Ref. No.:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.takermsPaymentRefNo as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Developer Name:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.developerName as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Project Name:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.projectName as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Payment Type:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.paymentType as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Approval Status:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.approvalStatus as string}
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
      <DashboardLayout title="Voucher Payment">
        <div className="bg-[#FFFFFFBF] border rounded-2xl  flex-col h-full flex justify-end">
          {/* Sticky Header Section */}
          <div className="sticky top-0 bg-[#FFFFFFBF] border-b border-gray-200 rounded-t-1xl p-3 flex justify-end gap-1">
           
            {/* Action Buttons */}
            {/* <PageActionButtons
              entityType="voucherPayment"
              showButtons={{ addNew: true }}
            /> */}
            <PageActionButtons
              entityType="voucherPayment"
              showButtons={{ addNew: true, showAllSearch: true }}
              showAllSearch={showAllSearch}
              onToggleAllSearch={() => setShowAllSearch((prev) => !prev)}
            />{" "}
          </div>

          {/* Table Container with Fixed Pagination */}
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-auto">
              <ExpandableDataTable<VoucherPaymentData>
                data={paginated}
                columns={tableColumns}
                searchState={search}
                onSearchChange={handleSearchChange}
                showAllSearch={showAllSearch}
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

export default VoucherPaymentPage;
