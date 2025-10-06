"use client";

import React, { useState } from "react";
import { DashboardLayout } from "../../components/templates/DashboardLayout";
import { ExpandableDataTable } from "../../components/organisms/ExpandableDataTable";
import { useTableState } from "../../hooks/useTableState";
import { getStatusCardConfig } from "../../utils/statusUtils";
import { StatusCards } from "../../components/molecules/StatusCards";
import { PageActionButtons } from "../../components/molecules/PageActionButtons";
import LeftSlidePanel from "@/components/organisms/LeftSlidePanel/LeftSlidePanel";

// Define the owner data structure
interface OwnerData extends Record<string, unknown> {
  owner: string;
  ownerId: string;
  developerName: string;
  developerIdRera: string;
  developerCif: string;
  projectName: string;
  projectAddress: string;
  approvalStatus: string;
}

// Sample owner data matching the screenshot
const ownersData: OwnerData[] = [
  {
    owner: "Ownerroop",
    ownerId: "OWN1918",
    developerName: "",
    developerIdRera: "",
    developerCif: "",
    projectName: "",
    projectAddress: "",
    approvalStatus: "In Review",
  },
  {
    owner: "Bashayr",
    ownerId: "OWN1831",
    developerName: "Damac Properties",
    developerIdRera: "399PO11",
    developerCif: "68834",
    projectName: "DAMAC Hills",
    projectAddress: "Dubai Hills Estate",
    approvalStatus: "In Review",
  },
  {
    owner: "Samari",
    ownerId: "OWN1754",
    developerName: "Green Group",
    developerIdRera: "57836456",
    developerCif: "L00954995434534",
    projectName: "Pro Extention New test",
    projectAddress: "Dubai Silicon Oasis",
    approvalStatus: "Approved",
  },
  {
    owner: "Abdullah",
    ownerId: "OWN1712",
    developerName: "Green Group",
    developerIdRera: "57836456",
    developerCif: "L00954995434534",
    projectName: "Pro Extention New test",
    projectAddress: "Dubai Silicon Oasis",
    approvalStatus: "Incomplete",
  },
  {
    owner: "Rayan",
    ownerId: "OWN1666",
    developerName: "Test",
    developerIdRera: "12345678",
    developerCif: "12345678",
    projectName: "Project Home",
    projectAddress: "Dubai Marina",
    approvalStatus: "Incomplete",
  },
  {
    owner: "Zain",
    ownerId: "OWN1859",
    developerName: "",
    developerIdRera: "",
    developerCif: "",
    projectName: "",
    projectAddress: "",
    approvalStatus: "In Review",
  },
  {
    owner: "Zahoor",
    ownerId: "OWN1819",
    developerName: "Fawaz Alhokair Group",
    developerIdRera: "2311906",
    developerCif: "12345",
    projectName: "Flamenco Building",
    projectAddress: "Dubai Creek Harbour",
    approvalStatus: "In Review",
  },
  {
    owner: "Mohammad",
    ownerId: "OWN1759",
    developerName: "Mebaraso Company",
    developerIdRera: "3636529",
    developerCif: "9875437",
    projectName: "Al Fatton Marine",
    projectAddress: "Palm Jumeirah",
    approvalStatus: "In Review",
  },
  {
    owner: "Benadar",
    ownerId: "OWN1647",
    developerName: "",
    developerIdRera: "",
    developerCif: "",
    projectName: "",
    projectAddress: "",
    approvalStatus: "In Review",
  },
  {
    owner: "Ahmed",
    ownerId: "OWN1600",
    developerName: "Emaar Properties",
    developerIdRera: "12345678",
    developerCif: "12345678",
    projectName: "Downtown Dubai",
    projectAddress: "Sheikh Mohammed Bin Rashid Boulevard",
    approvalStatus: "Rejected",
  },
  {
    owner: "Fatima",
    ownerId: "OWN1599",
    developerName: "Nakheel Properties",
    developerIdRera: "87654321",
    developerCif: "87654321",
    projectName: "Palm Jumeirah",
    projectAddress: "Palm Jumeirah Island",
    approvalStatus: "Approved",
  },
  {
    owner: "Omar",
    ownerId: "OWN1598",
    developerName: "Meraas Holding",
    developerIdRera: "11223344",
    developerCif: "11223344",
    projectName: "Bluewaters Island",
    projectAddress: "Bluewaters Island",
    approvalStatus: "In Review",
  },
  {
    owner: "Aisha",
    ownerId: "OWN1597",
    developerName: "Ellington Properties",
    developerIdRera: "55667788",
    developerCif: "55667788",
    projectName: "Yas Island",
    projectAddress: "Yas Island",
    approvalStatus: "Incomplete",
  },
  {
    owner: "Khalid",
    ownerId: "OWN1596",
    developerName: "Aziz Development",
    developerIdRera: "99887766",
    developerCif: "99887766",
    projectName: "Chic Tower",
    projectAddress: "Dubai Marina",
    approvalStatus: "Approved",
  },
  {
    owner: "Layla",
    ownerId: "OWN1595",
    developerName: "Wasl Asset Management",
    developerIdRera: "44332211",
    developerCif: "44332211",
    projectName: "Beverly Hills Drive",
    projectAddress: "Dubai Hills Estate",
    approvalStatus: "Rejected",
  },
  {
    owner: "Youssef",
    ownerId: "OWN1594",
    developerName: "Emaar Builder Pvt Ltd",
    developerIdRera: "66778899",
    developerCif: "66778899",
    projectName: "Dubai Marina",
    projectAddress: "Dubai Marina",
    approvalStatus: "In Review",
  },
  {
    owner: "Nour",
    ownerId: "OWN1593",
    developerName: "Nakeel Properties",
    developerIdRera: "22334455",
    developerCif: "22334455",
    projectName: "Safa Two De Grisogono",
    projectAddress: "Safa Park",
    approvalStatus: "Approved",
  },
  {
    owner: "Hassan",
    ownerId: "OWN1592",
    developerName: "Sobha Realty Test RR",
    developerIdRera: "77889900",
    developerCif: "77889900",
    projectName: "Palm Residency",
    projectAddress: "Palm Jumeirah",
    approvalStatus: "Incomplete",
  },
  {
    owner: "Mariam",
    ownerId: "OWN1591",
    developerName: "AlNaboodah Construction Group",
    developerIdRera: "33445566",
    developerCif: "33445566",
    projectName: "Al Madina",
    projectAddress: "Dubai Creek Harbour",
    approvalStatus: "Approved",
  },
  {
    owner: "Ali",
    ownerId: "OWN1590",
    developerName: "Ellington Properties",
    developerIdRera: "88990011",
    developerCif: "88990011",
    projectName: "Elegance Tower",
    projectAddress: "Dubai Hills Estate",
    approvalStatus: "Approved",
  },
];

const statusOptions = ["Approved", "In Review", "Rejected", "Incomplete"];

const tableColumns = [
  {
    key: "owner",
    label: "Owner",
    type: "text" as const,
    width: "w-40",
    sortable: true,
  },
  {
    key: "ownerId",
    label: "Owner ID",
    type: "text" as const,
    width: "w-32",
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
    key: "developerIdRera",
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
    key: "projectName",
    label: "Project Name",
    type: "text" as const,
    width: "w-48",
    sortable: true,
  },
  {
    key: "projectAddress",
    label: "Project Address",
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

const OwnersPage: React.FC = () => {
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
    data: ownersData,
    searchFields: [
      "owner",
      "ownerId",
      "developerName",
      "developerIdRera",
      "developerCif",
      "projectName",
      "projectAddress",
      "approvalStatus",
    ],
    initialRowsPerPage: 20,
  });

  // Generate status cards data
  const statusCards = [
    {
      label: "Rejected",
      count: ownersData.filter((item) => item.approvalStatus === "Rejected")
        .length,
      ...getStatusCardConfig("Rejected"),
    },
    {
      label: "Incomplete",
      count: ownersData.filter((item) => item.approvalStatus === "Incomplete")
        .length,
      ...getStatusCardConfig("Incomplete"),
    },
    {
      label: "In Review",
      count: ownersData.filter((item) => item.approvalStatus === "In Review")
        .length,
      ...getStatusCardConfig("In Review"),
    },
    {
      label: "Approved",
      count: ownersData.filter((item) => item.approvalStatus === "Approved")
        .length,
      ...getStatusCardConfig("Approved"),
    },
  ];

  // Render expanded content
  const renderExpandedContent = (row: OwnerData) => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Owner Information
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Owner Name:</span>
            <span className="ml-2 font-medium text-gray-800">{row.owner}</span>
          </div>
          <div>
            <span className="text-gray-600">Owner ID:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.ownerId}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Developer Name:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.developerName || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Developer ID (RERA):</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.developerIdRera || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Developer CIF:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.developerCif || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Project Name:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.projectName || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Project Address:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.projectAddress || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Approval Status:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.approvalStatus}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Documents & Compliance
        </h4>
        <div className="space-y-3">
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Owner Registration Certificate
          </button>
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Identity Documents
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

      <DashboardLayout title="Owners">
        <div className="bg-[#FFFFFFBF] border rounded-2xl flex flex-col h-full">
          {/* Sticky Header Section */}
          {/* <div className="sticky top-0 z-10 bg-[#FFFFFFBF] border-b border-gray-200 rounded-t-2xl ">
            <div className="px-4 py-6">
              <StatusCards cards={statusCards} />
            </div>
            <PageActionButtons entityType="owner" />
            
          </div> */}

          <div className="bg-[#FFFFFFBF] border-b border-gray-200 rounded-t-2xl">
            <div className="px-4 py-6">
              <StatusCards cards={statusCards} />

              <PageActionButtons
                entityType="owner"
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
              <ExpandableDataTable<OwnerData>
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

export default OwnersPage;
