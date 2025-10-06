"use client";

import React, { useState } from "react";
import { DashboardLayout } from "../../components/templates/DashboardLayout";
import { ExpandableDataTable } from "../../components/organisms/ExpandableDataTable";
import { useTableState } from "../../hooks/useTableState";
import { getStatusCardConfig } from "../../utils/statusUtils";
import { StatusCards } from "../../components/molecules/StatusCards";
import { PageActionButtons } from "../../components/molecules/PageActionButtons";
import LeftSlidePanel from "@/components/organisms/LeftSlidePanel/LeftSlidePanel";

// Define the developer data structure
interface PropertyData extends Record<string, unknown> {
  name: string;
  propertyId: string;
  developerCif: string;
  localeNames: string;
  status: string;
}

// Sample developer data matching the screenshot
const propertysData: PropertyData[] = [
  {
    name: "Lodha Developers",
    propertyId: "2342342",
    developerCif: "2323434",
    localeNames: "---",
    status: "Approved",
  },
  {
    name: "Developer",
    propertyId: "65412",
    developerCif: "76654",
    localeNames: "---",
    status: "In Review",
  },
  {
    name: "Select Global",
    propertyId: "7665656",
    developerCif: "9087712",
    localeNames: "---",
    status: "Approved",
  },
  {
    name: "2323",
    propertyId: "121322",
    developerCif: "321213",
    localeNames: "---",
    status: "Approved",
  },
  {
    name: "Sunil Kumar",
    propertyId: "4339",
    developerCif: "475874",
    localeNames: "---",
    status: "Approved",
  },
  {
    name: "Audit New Retest Data",
    propertyId: "555555",
    developerCif: "655666",
    localeNames: "---",
    status: "In Review",
  },
  {
    name: "Infra Audit",
    propertyId: "7666687",
    developerCif: "88888",
    localeNames: "---",
    status: "Rejected",
  },
  {
    name: "Amit Admin",
    propertyId: "655554309",
    developerCif: "95444476",
    localeNames: "---",
    status: "Incomplete",
  },
  {
    name: "RBAC Test",
    propertyId: "666",
    developerCif: "665",
    localeNames: "---",
    status: "Approved",
  },
  {
    name: "Ascent",
    propertyId: "987324",
    developerCif: "9803421",
    localeNames: "---",
    status: "In Review",
  },
  {
    name: "Test Developer 1",
    propertyId: "123456",
    developerCif: "654321",
    localeNames: "---",
    status: "Approved",
  },
  {
    name: "Test Developer 2",
    propertyId: "789012",
    developerCif: "210987",
    localeNames: "---",
    status: "In Review",
  },
  {
    name: "Test Developer 3",
    propertyId: "345678",
    developerCif: "876543",
    localeNames: "---",
    status: "Rejected",
  },
  {
    name: "Test Developer 4",
    propertyId: "901234",
    developerCif: "432109",
    localeNames: "---",
    status: "Incomplete",
  },
  {
    name: "Test Developer 5",
    propertyId: "567890",
    developerCif: "098765",
    localeNames: "---",
    status: "Approved",
  },
  {
    name: "Test Developer 6",
    propertyId: "234567",
    developerCif: "765432",
    localeNames: "---",
    status: "In Review",
  },
  {
    name: "Test Developer 7",
    propertyId: "890123",
    developerCif: "321098",
    localeNames: "---",
    status: "Approved",
  },
  {
    name: "Test Developer 8",
    propertyId: "456789",
    developerCif: "987654",
    localeNames: "---",
    status: "Rejected",
  },
  {
    name: "Test Developer 9",
    propertyId: "012345",
    developerCif: "543210",
    localeNames: "---",
    status: "Incomplete",
  },
  {
    name: "Test Developer 10",
    propertyId: "678901",
    developerCif: "109876",
    localeNames: "---",
    status: "Approved",
  },
];
console.log("PropertyData", propertysData) 
const statusOptions = ["Approved", "In Review", "Rejected", "Incomplete"];

const tableColumns = [
  {
    key: "name",
    label: "Name",
    type: "text" as const,
    width: "w-40",
    sortable: true,
  },
  {
    key: "propertyId",
    label: "Developer ID (RERA)",
    type: "text" as const,
    width: "w-48",
    sortable: true,
  },
  {
    key: "developerCif",
    label: "Developer CIF",
    type: "text" as const,
    width: "w-40",
    sortable: true,
  },
  {
    key: "localeNames",
    label: "Locale Names",
    type: "text" as const,
    width: "w-40",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    type: "status" as const,
    width: "w-[129px]",
    sortable: true,
  },
  { key: "actions", label: "Actions", type: "actions" as const, width: "w-20" },
];

const PropertyPage: React.FC = () => {
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
    data: propertysData,
    searchFields: [
      "name",
      "propertyId",
      "developerCif",
      "localeNames",
      "status",
    ],
    initialRowsPerPage: 20,
  });

  // Generate status cards data
  const statusCards = [
    {
      label: "Rejected",
      count: propertysData.filter((item) => item.status === "Rejected").length,
      ...getStatusCardConfig("Rejected"),
    },
    {
      label: "Incomplete",
      count: propertysData.filter((item) => item.status === "Incomplete")
        .length,
      ...getStatusCardConfig("Incomplete"),
    },
    {
      label: "In Review",
      count: propertysData.filter((item) => item.status === "In Review").length,
      ...getStatusCardConfig("In Review"),
    },
    {
      label: "Approved",
      count: propertysData.filter((item) => item.status === "Approved").length,
      ...getStatusCardConfig("Approved"),
    },
  ];

  // Render expanded content
  const renderExpandedContent = (row: PropertyData) => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Developer Information
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Developer Name:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.name as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Property ID:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.propertyId as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Developer CIF:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.developerCif as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Locale Names:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.localeNames as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Status:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.status as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Registration Date:</span>
            <span className="ml-2 font-medium text-gray-800">15 Jan 2024</span>
          </div>
          <div>
            <span className="text-gray-600">Last Updated:</span>
            <span className="ml-2 font-medium text-gray-800">20 Mar 2024</span>
          </div>
          <div>
            <span className="text-gray-600">Contact Person:</span>
            <span className="ml-2 font-medium text-gray-800">John Doe</span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Documents & Compliance
        </h4>
        <div className="space-y-3">
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            RERA Registration Certificate
          </button>
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Company Registration Documents
          </button>
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Financial Statements
          </button>
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Compliance Certificates
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

      <DashboardLayout title="Property">
        <div className="bg-[#FFFFFFBF] border rounded-2xl flex flex-col h-full">
          {/* Sticky Header Section */}
          <div className="bg-[#FFFFFFBF] border-b border-gray-200 rounded-t-2xl">
            <div className="px-4 py-6">
              <StatusCards cards={statusCards} />
              <PageActionButtons
                entityType="propertys"
                showButtons={{
                  showAllSearch: true,
                  downloadTemplate: true,
                  uploadDetails: true,
                  addNew: true,
                }}
                showAllSearch={showAllSearch}
                onToggleAllSearch={() => setShowAllSearch((prev) => !prev)}
              />
            </div>
          </div>

          {/* Table Container with Fixed Pagination */}
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-auto">
              <ExpandableDataTable<PropertyData>
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

export default PropertyPage;
