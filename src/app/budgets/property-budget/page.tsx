"use client";

import React, { useState } from "react";

import LeftSlidePanel from "@/components/organisms/LeftSlidePanel/LeftSlidePanel";
import { DashboardLayout, ExpandableDataTable } from "@/components";
import { PageActionButtons } from "@/components/molecules/PageActionButtons";
import { useTableState } from "@/hooks";
import FilterListIcon from "@mui/icons-material/FilterList";

// Define the budget payment data structure
interface PropertyBudgetData extends Record<string, unknown> {
  category: string;
  subcategory: string;
  code: string;
  totalBudget: number;
  availableBudget: number;
  utilizedBudget: number;
  invoiceAmount: number;
  invoiceNumbers: string[];
  remarks: string;
}

// Sample budget payment data matching the screenshot
const propertyBudgetsData: PropertyBudgetData[] = [
  {
    category: "Services",
    subcategory: "Cleaning",
    code: "CLN001",
    totalBudget: 100000,
    availableBudget: 80000,
    utilizedBudget: 20000,
    invoiceAmount: 0,
    invoiceNumbers: [],
    remarks: "No invoices yet",
  },
  {
    category: "Services",
    subcategory: "Security",
    code: "SEC002",
    totalBudget: 150000,
    availableBudget: 120000,
    utilizedBudget: 30000,
    invoiceAmount: 15000,
    invoiceNumbers: ["INV-1001"],
    remarks: "Partial payment done",
  },
  {
    category: "Maintenance",
    subcategory: "Electrical",
    code: "ELE003",
    totalBudget: 200000,
    availableBudget: 150000,
    utilizedBudget: 50000,
    invoiceAmount: 50000,
    invoiceNumbers: ["INV-2001", "INV-2002"],
    remarks: "Two invoices paid",
  },
  {
    category: "Maintenance",
    subcategory: "Plumbing",
    code: "PLM004",
    totalBudget: 80000,
    availableBudget: 60000,
    utilizedBudget: 20000,
    invoiceAmount: 20000,
    invoiceNumbers: ["INV-3001"],
    remarks: "Completed minor repairs",
  },
  {
    category: "Supplies",
    subcategory: "Office Stationery",
    code: "STN005",
    totalBudget: 50000,
    availableBudget: 35000,
    utilizedBudget: 15000,
    invoiceAmount: 15000,
    invoiceNumbers: ["INV-4001"],
    remarks: "Q1 stationery restock",
  },
  {
    category: "Supplies",
    subcategory: "Cleaning Materials",
    code: "CLM006",
    totalBudget: 60000,
    availableBudget: 40000,
    utilizedBudget: 20000,
    invoiceAmount: 20000,
    invoiceNumbers: ["INV-5001"],
    remarks: "Monthly cleaning supplies",
  },
  {
    category: "Projects",
    subcategory: "Renovation",
    code: "REN007",
    totalBudget: 500000,
    availableBudget: 300000,
    utilizedBudget: 200000,
    invoiceAmount: 180000,
    invoiceNumbers: ["INV-6001", "INV-6002", "INV-6003"],
    remarks: "Phase 1 completed",
  },
  {
    category: "Projects",
    subcategory: "New Construction",
    code: "CON008",
    totalBudget: 1000000,
    availableBudget: 700000,
    utilizedBudget: 300000,
    invoiceAmount: 250000,
    invoiceNumbers: ["INV-7001", "INV-7002"],
    remarks: "Foundation work completed",
  },
  {
    category: "Events",
    subcategory: "Annual Meeting",
    code: "EVT009",
    totalBudget: 120000,
    availableBudget: 90000,
    utilizedBudget: 30000,
    invoiceAmount: 28000,
    invoiceNumbers: ["INV-8001"],
    remarks: "Venue booked and catering paid",
  },
  {
    category: "Training",
    subcategory: "Safety Workshop",
    code: "TRN010",
    totalBudget: 40000,
    availableBudget: 25000,
    utilizedBudget: 15000,
    invoiceAmount: 15000,
    invoiceNumbers: ["INV-9001"],
    remarks: "Completed Q2 safety session",
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
    key: "category",
    label: "Category",
    type: "text" as const,
    width: "w-32",
    sortable: true,
  },
  {
    key: "subcategory",
    label: "Subcategory",
    type: "text" as const,
    width: "w-40",
    sortable: true,
  },
  {
    key: "code",
    label: "Code",
    type: "text" as const,
    width: "w-24",
    sortable: true,
  },
  {
    key: "totalBudget",
    label: "Total Budget",
    type: "number" as const,
    width: "w-32",
    sortable: true,
  },
  {
    key: "availableBudget",
    label: "Available Budget",
    type: "number" as const,
    width: "w-36",
    sortable: true,
  },
  {
    key: "utilizedBudget",
    label: "Utilized Budget",
    type: "number" as const,
    width: "w-36",
    sortable: true,
  },
  {
    key: "invoiceAmount",
    label: "Invoice Amount",
    type: "number" as const,
    width: "w-32",
    sortable: true,
  },
  {
    key: "invoiceNumbers",
    label: "Invoice Numbers",
    type: "text" as const,
    width: "w-40",
    sortable: false,
  },
  {
    key: "remarks",
    label: "Remarks",
    type: "text" as const,
    width: "w-48",
    sortable: false,
  },
];

const PropertBudgetPage: React.FC = () => {
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
    data: propertyBudgetsData,
    searchFields: [
      "category",
      "subcategory",
      "code",
      "totalBudget",
      "availableBudget",
      "utilizedBudget",
      "invoiceAmount",
      "invoiceNumbers",
      "remarks",
    ],
    initialRowsPerPage: 20,
  });

  // Render expanded content
  const renderExpandedContent = (row: PropertyBudgetData) => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Property Budget Information
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Category:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.category as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Subcategory:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.subcategory as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Code:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.code as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Total Budget:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.totalBudget as number}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Available Budget:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.availableBudget as number}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Utilized Budget:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.utilizedBudget as number}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Invoice Amount:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.invoiceAmount as number}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Invoice Numbers:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.invoiceNumbers?.join(", ")}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">Remarks:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.remarks as string}
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

      <DashboardLayout title="Property Budget">
        <div className="bg-[#FFFFFFBF] border rounded-2xl flex flex-col h-full">
          {/* Sticky Header Section */}
          <div className="sticky top-0 bg-[#FFFFFFBF] border-b border-gray-200 rounded-t-1xl p-3 flex justify-end gap-1">
            {/* Hide/Show Search Button */}

           
            {/* <PageActionButtons
              entityType="propertyBudget"
              showButtons={{ addNew: true }}
            /> */}
            <PageActionButtons
              entityType="propertyBudget"
              showButtons={{ addNew: true, showAllSearch: true }}
              showAllSearch={showAllSearch}
              onToggleAllSearch={() => setShowAllSearch((prev) => !prev)}
            />
          </div>

          {/* Table Container with Fixed Pagination */}
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-auto">
              <ExpandableDataTable<PropertyBudgetData>
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

export default PropertBudgetPage;
