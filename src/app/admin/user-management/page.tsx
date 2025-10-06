"use client";

import React, { useState } from "react";
import { DashboardLayout } from "../../../components/templates/DashboardLayout";
import { ExpandableDataTable } from "../../../components/organisms/ExpandableDataTable";
import { useTableState } from "../../../hooks/useTableState";
import { PageActionButtons } from "../../../components/molecules/PageActionButtons";
import { RightSlideUserPanel } from "../../../components/organisms/RightSlidePanel";
import LeftSlidePanel from "@/components/organisms/LeftSlidePanel/LeftSlidePanel";

// Define the user management data structure
interface UserManagementData extends Record<string, unknown> {
  userName: string;
  userId: string;
  emailId: string;
  roleName: string[]; // Changed to array to support multiple roles
  status: string;
}

// Define the edit user data structure for the panel
interface EditUserData {
  firstName: string;
  lastName: string;
  emailId: string;
  status: string;
  username: string;
  userId: string;
  selectedRoles: string[];
  rolePermissions: Record<string, any>;
  roleEnabled: Record<string, boolean>;
}

// Sample user management data matching the screenshot
const userManagementData: UserManagementData[] = [
  {
    userName: "Pradeep Kumar",
    userId: "Prad87900",
    emailId: "pradeep.kumar@email.com",
    roleName: ["Admin"],
    status: "ACTIVE",
  },
  {
    userName: "Aniket Shetty",
    userId: "ShettyS9879",
    emailId: "ani.shetty@email.com",
    roleName: ["Checker", "Assigner"],
    status: "ACTIVE",
  },
  {
    userName: "Sayali Shinde",
    userId: "Sayali793",
    emailId: "sshinde@email.com",
    roleName: ["Assigner"],
    status: "CLOSED",
  },
  {
    userName: "Raksha Trivedi",
    userId: "RakshalBANA",
    emailId: "rtrivedi@email.com",
    roleName: ["Reviewer"],
    status: "CLOSED",
  },
  {
    userName: "Tanmay Joshi",
    userId: "Joshi09IBAN",
    emailId: "Jotanmay@email.com",
    roleName: ["Admin"],
    status: "ACTIVE",
  },
  {
    userName: "Pradip Trivedi",
    userId: "PradipANS9879",
    emailId: "pradip.tri@email.com",
    roleName: ["Manager", "Reviewer"],
    status: "CLOSED",
  },
  {
    userName: "Manoj Gupte",
    userId: "GupteNMIBA",
    emailId: "manoj.gupte@email.com",
    roleName: ["Reviewer"],
    status: "ACTIVE",
  },
  {
    userName: "Rahul Sutar",
    userId: "SutarRA887",
    emailId: "sutar.rahul@email.com",
    roleName: ["Checker"],
    status: "CLOSED",
  },
  {
    userName: "Dinesh Gupta",
    userId: "Dinesh78761B",
    emailId: "gupta.dinesh@email.com",
    roleName: ["Reviewer"],
    status: "ACTIVE",
  },
  {
    userName: "Rakesh Varma",
    userId: "Varma87661B",
    emailId: "rakesh.varma@email.com",
    roleName: ["Assigner"],
    status: "CLOSED",
  },
  // Add more users to match the 204 total mentioned in pagination
  ...Array.from({ length: 194 }, (_, i) => {
    const roles = [
      "Admin",
      "Checker",
      "Assigner",
      "Reviewer",
      "Manager",
    ] as const;
    // Use deterministic selection based on index to avoid hydration issues
    const roleIndex = i % roles.length;
    const statusIndex = i % 2; // Alternate between ACTIVE and CLOSED
    return {
      userName: `User ${i + 11}`,
      userId: `UserID${String(i + 11).padStart(5, "0")}`,
      emailId: `user${i + 11}@email.com`,
      roleName: [roles[roleIndex]!],
      status: statusIndex === 0 ? "ACTIVE" : "CLOSED",
    };
  }),
];

const statusOptions = ["ACTIVE", "CLOSED"];

const tableColumns = [
  {
    key: "userName",
    label: "User Name",
    type: "user" as const,
    width: "w-48",
    sortable: true,
  },
  {
    key: "userId",
    label: "User ID",
    type: "text" as const,
    width: "w-40",
    sortable: true,
  },
  {
    key: "emailId",
    label: "Email ID",
    type: "text" as const,
    width: "w-56",
    sortable: true,
  },
  {
    key: "roleName",
    label: "Role Name",
    type: "select" as const,
    width: "w-48",
    sortable: true,
    options: [
      { value: "Sr. Admin", label: "Sr. Admin" },
      { value: "Checker", label: "Checker" },
      { value: "Assigner", label: "Assigner" },
      { value: "Reviewer", label: "Reviewer" },
      { value: "Admin", label: "Admin" },
      { value: "Manager", label: "Manager" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "status" as const,
    width: "w-32",
    sortable: true,
  },
  { key: "actions", label: "Actions", type: "actions" as const, width: "w-20" },
];

const UserManagementPage: React.FC = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [userData, setUserData] = useState(userManagementData);
  const [selectedUserForEdit, setSelectedUserForEdit] =
    useState<EditUserData | null>(null);
  const [showAllSearch, setShowAllSearch] = useState(false);

  // Function to update user data
  const handleDataChange = (
    rowIndex: number,
    field: string,
    value: string | string[]
  ) => {
    if (field === "roleName") {
      const user = userData[rowIndex];
      if (user) {
        const userId = user.userId;
        setUserData((prevData) =>
          prevData.map((u) =>
            u.userId === userId
              ? { ...u, roleName: Array.isArray(value) ? value : [value] }
              : u
          )
        );
      }
    }
  };

  // Function to handle row click for editing
  const handleRowClick = (user: UserManagementData) => {
    // Convert user data to the format expected by RightSlideUserPanel
    const userForEdit = {
      firstName: user.userName.split(" ")[0] || "",
      lastName: user.userName.split(" ").slice(1).join(" ") || "",
      emailId: user.emailId,
      status: user.status.toLowerCase(),
      username: user.userName,
      userId: user.userId,
      selectedRoles: user.roleName,
      rolePermissions: {
        // Initialize with default permissions for selected roles
        ...user.roleName.reduce(
          (acc, role) => {
            const roleId = role.toLowerCase().replace(" ", "-");
            acc[roleId] = [
              {
                id: "permission_1",
                name: "Permission 1",
                description: "General permission 1",
                enabled: true,
              },
              {
                id: "permission_2",
                name: "Permission 2",
                description: "General permission 2",
                enabled: false,
              },
            ];
            return acc;
          },
          {} as Record<string, any>
        ),
      },
      roleEnabled: {
        // Enable all selected roles by default
        ...user.roleName.reduce(
          (acc, role) => {
            const roleId = role.toLowerCase().replace(" ", "-");
            acc[roleId] = true;
            return acc;
          },
          {} as Record<string, boolean>
        ),
      },
    };

    setSelectedUserForEdit(userForEdit);
    setIsUserPanelOpen(true);
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
    data: userData,
    searchFields: ["userName", "userId", "emailId", "roleName", "status"],
    initialRowsPerPage: 20,
  });

  // Render expanded content
  const renderExpandedContent = (row: UserManagementData) => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          User Information
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">User Name:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.userName as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">User ID:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.userId as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Email ID:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.emailId as string}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Role Name:</span>
            <span className="ml-2 font-medium text-gray-800">
              {Array.isArray(row.roleName)
                ? row.roleName.join(", ")
                : row.roleName}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Status:</span>
            <span className="ml-2 font-medium text-gray-800">
              {row.status as string}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          User Actions
        </h4>
        <div className="space-y-3">
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Edit User
          </button>
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            View Profile
          </button>
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Reset Password
          </button>
          <button className="w-full p-3 text-sm text-left text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            Deactivate User
          </button>
        </div>
      </div>
    </div>
  );

  // Action buttons for bulk operations
  const actionButtons = [
    {
      label: "Deactivate",
      onClick: () => console.log("Deactivate selected users"),
      disabled: selectedRows.length === 0,
      variant: "secondary" as const,
    },
    {
      label: "Activate",
      onClick: () => console.log("Activate selected users"),
      disabled: selectedRows.length === 0,
      variant: "primary" as const,
    },
    {
      label: "Download",
      onClick: () => console.log("Download selected users"),
      icon: "/download.svg",
      disabled: selectedRows.length === 0,
      iconAlt: "download icon",
    },
  ];

  return (
    <>
      {isSidePanelOpen && (
        <LeftSlidePanel
          isOpen={isSidePanelOpen}
          onClose={() => setIsSidePanelOpen(false)}
        />
      )}

      <RightSlideUserPanel
        isOpen={isUserPanelOpen}
        onClose={() => setIsUserPanelOpen(false)}
        mode={selectedUserForEdit ? "edit" : "add"}
        userData={selectedUserForEdit}
      />

      <DashboardLayout title="User Management">
        <div className="bg-[#FFFFFFBF] border rounded-2xl flex flex-col h-full">
          {/* Sticky Header Section */}
          <div className="sticky top-0 z-10 bg-[#FFFFFFBF] border-b border-gray-200 rounded-t-2xl">
            {/* Action Buttons */}
            {/* <PageActionButtons
              entityType="userManagement"
              showButtons={{ addNew: true }}
              onAddNew={() => setIsUserPanelOpen(true)}
            /> */}
            <PageActionButtons
              entityType="userManagement"
              showButtons={{ addNew: true, showAllSearch: true }}
              showAllSearch={showAllSearch}
              onToggleAllSearch={() => setShowAllSearch((prev) => !prev)}
              onAddNew={() => setIsUserPanelOpen(true)}
            />{" "}
            {/* Bulk Action Buttons - shown when rows are selected */}
            {selectedRows.length > 0 && (
              <div className="flex justify-end gap-2 py-3.5 px-4 border-b border-gray-200">
                {actionButtons.map((button, index) => (
                  <button
                    key={index}
                    onClick={button.onClick}
                    disabled={button.disabled}
                    className={`flex items-center h-8 py-1.5 px-2.5 gap-1.5 font-sans font-medium text-sm rounded-md transition-colors ${
                      button.variant === "primary"
                        ? "bg-[#155DFC] text-[#FAFAF9] hover:bg-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } ${button.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {button.icon && (
                      <img src={button.icon} alt={button.iconAlt} />
                    )}
                    {button.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Table Container with Fixed Pagination */}
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-auto">
              <ExpandableDataTable<UserManagementData>
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
                onDataChange={handleDataChange}
                onRowClick={handleRowClick}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default UserManagementPage;
