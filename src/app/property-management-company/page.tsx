"use client";

import React, { useState } from "react";
import { DashboardLayout } from "../../components/templates/DashboardLayout";
import { ExpandableDataTable } from "../../components/organisms/ExpandableDataTable";
import { useTableState } from "../../hooks/useTableState";
import { getStatusCardConfig } from "../../utils/statusUtils";
import { StatusCards } from "../../components/molecules/StatusCards";
import { PageActionButtons } from "../../components/molecules/PageActionButtons";
import LeftSlidePanel from "@/components/organisms/LeftSlidePanel/LeftSlidePanel";

// Define the project data structure
interface PropertManagementData extends Record<string, unknown> {
  name: string;
  propertyID: string;
  developerCif: string;
  developerName: string;
  projectStatus: string;
  approvalStatus: string;
}

// Sample project data matching the screenshot
const projectsData: PropertManagementData[] = [
  {
    name: "Al Madina",
    propertyID: "12345677",
    developerCif: "656567",
    developerName: "AlNaboodah Construction Group",
    projectStatus: "ACTIVE",
    approvalStatus: "Approved",
  },
  {
    name: "Palm Residency",
    propertyID: "30303030",
    developerCif: "7623423",
    developerName: "Sobha Realty Test RR",
    projectStatus: "ACTIVE",
    approvalStatus: "Incomplete",
  },
  {
    name: "Beverly Hills Drive",
    propertyID: "78688888",
    developerCif: "2222222222222222",
    developerName: "Wasl Asset Management",
    projectStatus: "CLOSED",
    approvalStatus: "Approved",
  },
  {
    name: "Dubai Marina",
    propertyID: "78787878",
    developerCif: "767868",
    developerName: "Emaar Builder Pvt Ltd",
    projectStatus: "FREEZED",
    approvalStatus: "In Review",
  },
  {
    name: "Safa Two De Grisogono",
    propertyID: "12121212",
    developerCif: "1231231231",
    developerName: "Nakheel Properties",
    projectStatus: "ACTIVE",
    approvalStatus: "Approved",
  },
  {
    name: "Chic Tower",
    propertyID: "12131212",
    developerCif: "123120000",
    developerName: "Aziz Development",
    projectStatus: "CLOSED",
    approvalStatus: "Approved",
  },
  {
    name: "Saadiyat Island",
    propertyID: "12121212",
    developerCif: "1231231231",
    developerName: "Nakheel Properties",
    projectStatus: "ACTIVE",
    approvalStatus: "Incomplete",
  },
  {
    name: "Elegance Tower",
    propertyID: "98765430",
    developerCif: "34527890",
    developerName: "Ellington Properties",
    projectStatus: "CLOSED",
    approvalStatus: "Approved",
  },
  {
    name: "Pro Extention New Test",
    propertyID: "51283456",
    developerCif: "L0094934343434",
    developerName: "Green Group",
    projectStatus: "ACTIVE",
    approvalStatus: "Approved",
  },
  {
    name: "Yas Island",
    propertyID: "1235678",
    developerCif: "12345678",
    developerName: "Ellington Properties",
    projectStatus: "CLOSED",
    approvalStatus: "Approved",
  },
  {
    name: "Marina Heights",
    propertyID: "87654321",
    developerCif: "87654321",
    developerName: "Emaar Properties",
    projectStatus: "ACTIVE",
    approvalStatus: "Rejected",
  },
  {
    name: "Palm Jumeirah",
    propertyID: "11223344",
    developerCif: "11223344",
    developerName: "Nakheel Properties",
    projectStatus: "FREEZED",
    approvalStatus: "In Review",
  },
  {
    name: "Downtown Dubai",
    propertyID: "55667788",
    developerCif: "55667788",
    developerName: "Emaar Properties",
    projectStatus: "ACTIVE",
    approvalStatus: "Approved",
  },
  {
    name: "JBR Walk",
    propertyID: "99887766",
    developerCif: "99887766",
    developerName: "Meraas Holding",
    projectStatus: "CLOSED",
    approvalStatus: "Approved",
  },
  {
    name: "Bluewaters Island",
    propertyID: "44332211",
    developerCif: "44332211",
    developerName: "Meraas Holding",
    projectStatus: "ACTIVE",
    approvalStatus: "Incomplete",
  },
  {
    name: "City Walk",
    propertyID: "66778899",
    developerCif: "66778899",
    developerName: "Meraas Holding",
    projectStatus: "ACTIVE",
    approvalStatus: "Approved",
  },
  {
    name: "La Mer",
    propertyID: "22334455",
    developerCif: "22334455",
    developerName: "Meraas Holding",
    projectStatus: "CLOSED",
    approvalStatus: "Approved",
  },
  {
    name: "Dubai Hills Estate",
    propertyID: "77889900",
    developerCif: "77889900",
    developerName: "Emaar Properties",
    projectStatus: "ACTIVE",
    approvalStatus: "In Review",
  },
  {
    name: "Arabian Ranches",
    propertyID: "33445566",
    developerCif: "33445566",
    developerName: "Emaar Properties",
    projectStatus: "ACTIVE",
    approvalStatus: "Approved",
  },
  {
    name: "Emirates Hills",
    propertyID: "88990011",
    developerCif: "88990011",
    developerName: "Emaar Properties",
    projectStatus: "CLOSED",
    approvalStatus: "Approved",
  },
];

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
    key: "propertyID",
    label: "Property ID (HOA))",
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
    key: "developerName",
    label: "Developer Name",
    type: "text" as const,
    width: "w-48",
    sortable: true,
  },
  {
    key: "projectStatus",
    label: "Project Status",
    type: "status" as const,
    width: "w-32",
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

const ProjectsPage: React.FC = () => {
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
    data: projectsData,
    searchFields: [
      "name",
      "propertyID",
      "developerCif",
      "developerName",
      "projectStatus",
      "approvalStatus",
    ],
    initialRowsPerPage: 20,
  });

  // Generate status cards data
  const statusCards = [
    {
      label: "Rejected",
      count: projectsData.filter((item) => item.approvalStatus === "Rejected")
        .length,
      ...getStatusCardConfig("Rejected"),
    },
    {
      label: "Incomplete",
      count: projectsData.filter((item) => item.approvalStatus === "Incomplete")
        .length,
      ...getStatusCardConfig("Incomplete"),
    },
    {
      label: "In Review",
      count: projectsData.filter((item) => item.approvalStatus === "In Review")
        .length,
      ...getStatusCardConfig("In Review"),
    },
    {
      label: "Approved",
      count: projectsData.filter((item) => item.approvalStatus === "Approved")
        .length,
      ...getStatusCardConfig("Approved"),
    },
  ];

  // Render expanded content
  const renderExpandedContent = (row: PropertManagementData) => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Project Information
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Property Name:</span>
            <span className="ml-2 font-medium text-gray-800">{row.name}</span>
          </div>
          <div>
            <span className="text-gray-600">Property ID :</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.propertyID}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Developer CIF:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.developerCif}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Developer Name:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.developerName}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Project Status:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.projectStatus}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Approval Status:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.approvalStatus}
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
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Documents & Compliance
        </h4>
        <div className="space-y-3">
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Project Registration Certificate
          </button>
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Building Permits
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

      <DashboardLayout title="Property Management Company">
        <div className="bg-[#FFFFFFBF] border rounded-2xl flex flex-col h-full">
          {/* Sticky Header Section */}

          <div className="bg-[#FFFFFFBF] border-b border-gray-200 rounded-t-2xl">
            <div className="px-4 py-6">
              <StatusCards cards={statusCards} />
              <PageActionButtons
                entityType="propertyManagementCompany"
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
              <ExpandableDataTable<PropertManagementData>
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

export default ProjectsPage;
