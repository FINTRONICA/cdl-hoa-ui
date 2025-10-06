'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '../../../components/templates/DashboardLayout'
import { ExpandableDataTable } from '../../../components/organisms/ExpandableDataTable'
import { useTableState } from '../../../hooks/useTableState'
import { PageActionButtons } from '../../../components/molecules/PageActionButtons'
import LeftSlidePanel from '@/components/organisms/LeftSlidePanel/LeftSlidePanel'
import { UserAvatarGroup } from '../../../components/atoms/UserAvatarGroup'
import { PermissionTags } from '../../../components/atoms/PermissionTags'

// Define the role management data structure
interface RoleManagementData extends Record<string, unknown> {
  roleName: string
  roleId: string
  usersAssigned: Array<{
    id: string
    name: string
    avatar?: string
    initials?: string
  }>
  activeUsers: number
  inactiveUsers: number
  permissions: string[]
  status: string
}

// Sample role management data matching the screenshot
const roleManagementData: RoleManagementData[] = [
  {
    roleName: 'Admin',
    roleId: '#ABA002',
    usersAssigned: [
      { id: '1', name: 'Admin User 1', initials: 'AU' },
      { id: '2', name: 'Admin User 2', initials: 'AU' },
      { id: '3', name: 'Admin User 3', initials: 'AU' },
      { id: '4', name: 'Admin User 4', initials: 'AU' },
    ],
    activeUsers: 3,
    inactiveUsers: 1,
    permissions: ['Admin Report View', 'ADMIN_SEC', 'User Management', 'Role Management'],
    status: 'ACTIVE',
  },
  {
    roleName: 'Sr. Admin',
    roleId: '#ABA001',
    usersAssigned: [
      { id: '5', name: 'AB User', initials: 'AB' },
      { id: '6', name: 'Sr Admin 1', initials: 'SA' },
      { id: '7', name: 'Sr Admin 2', initials: 'SA' },
      { id: '8', name: 'Sr Admin 3', initials: 'SA' },
      { id: '9', name: 'Sr Admin 4', initials: 'SA' },
    ],
    activeUsers: 2,
    inactiveUsers: 2,
    permissions: ['Admin Report View', 'ADMIN_SEC', 'System Settings', 'Audit Logs'],
    status: 'ACTIVE',
  },
  {
    roleName: 'Manager',
    roleId: '#ABA003',
    usersAssigned: [
      { id: '10', name: 'Manager 1', initials: 'M1' },
      { id: '11', name: 'Manager 2', initials: 'M2' },
      { id: '12', name: 'Manager 3', initials: 'M3' },
      { id: '13', name: 'Manager 4', initials: 'M4' },
      { id: '14', name: 'Manager 5', initials: 'M5' },
      { id: '15', name: 'Manager 6', initials: 'M6' },
      { id: '16', name: 'Manager 7', initials: 'M7' },
    ],
    activeUsers: 5,
    inactiveUsers: 3,
    permissions: ['Admin Report View', 'ADMIN_SEC', 'Project Management', 'Team Management', 'Reports'],
    status: 'CLOSED',
  },
  {
    roleName: 'Checker',
    roleId: '#ABA004',
    usersAssigned: [
      { id: '17', name: 'KR User', initials: 'KR' },
      { id: '18', name: 'Checker 1', initials: 'C1' },
      { id: '19', name: 'Checker 2', initials: 'C2' },
      { id: '20', name: 'Checker 3', initials: 'C3' },
      { id: '21', name: 'Checker 4', initials: 'C4' },
      { id: '22', name: 'Checker 5', initials: 'C5' },
      { id: '23', name: 'Checker 6', initials: 'C6' },
      { id: '24', name: 'Checker 7', initials: 'C7' },
      { id: '25', name: 'Checker 8', initials: 'C8' },
      { id: '26', name: 'Checker 9', initials: 'C9' },
      { id: '27', name: 'Checker 10', initials: 'C10' },
      { id: '28', name: 'Checker 11', initials: 'C11' },
      { id: '29', name: 'Checker 12', initials: 'C12' },
    ],
    activeUsers: 12,
    inactiveUsers: 4,
    permissions: ['Admin Report View', 'ADMIN_SEC', 'Data Validation', 'Quality Check', 'Approval Process', 'Audit Trail'],
    status: 'CLOSED',
  },
  {
    roleName: 'Assigner',
    roleId: '#ABA005',
    usersAssigned: [
      { id: '30', name: 'Assigner 1', initials: 'A1' },
      { id: '31', name: 'Assigner 2', initials: 'A2' },
      { id: '32', name: 'Assigner 3', initials: 'A3' },
      { id: '33', name: 'Assigner 4', initials: 'A4' },
      { id: '34', name: 'Assigner 5', initials: 'A5' },
      { id: '35', name: 'Assigner 6', initials: 'A6' },
      { id: '36', name: 'Assigner 7', initials: 'A7' },
      { id: '37', name: 'Assigner 8', initials: 'A8' },
      { id: '38', name: 'Assigner 9', initials: 'A9' },
      { id: '39', name: 'Assigner 10', initials: 'A10' },
      { id: '40', name: 'Assigner 11', initials: 'A11' },
      { id: '41', name: 'Assigner 12', initials: 'A12' },
      { id: '42', name: 'Assigner 13', initials: 'A13' },
      { id: '43', name: 'Assigner 14', initials: 'A14' },
      { id: '44', name: 'Assigner 15', initials: 'A15' },
      { id: '45', name: 'Assigner 16', initials: 'A16' },
      { id: '46', name: 'Assigner 17', initials: 'A17' },
      { id: '47', name: 'Assigner 18', initials: 'A18' },
    ],
    activeUsers: 13,
    inactiveUsers: 5,
    permissions: ['Admin Report View', 'ADMIN_SEC', 'Task Assignment', 'Resource Allocation', 'Workflow Management', 'Priority Setting', 'Deadline Management', 'Team Coordination'],
    status: 'ACTIVE',
  },
  {
    roleName: 'Reviewer',
    roleId: '#ABA006',
    usersAssigned: [
      { id: '48', name: 'Reviewer 1', initials: 'R1' },
      { id: '49', name: 'Reviewer 2', initials: 'R2' },
      { id: '50', name: 'Reviewer 3', initials: 'R3' },
      { id: '51', name: 'Reviewer 4', initials: 'R4' },
      { id: '52', name: 'Reviewer 5', initials: 'R5' },
      { id: '53', name: 'Reviewer 6', initials: 'R6' },
      { id: '54', name: 'Reviewer 7', initials: 'R7' },
      { id: '55', name: 'Reviewer 8', initials: 'R8' },
      { id: '56', name: 'Reviewer 9', initials: 'R9' },
      { id: '57', name: 'Reviewer 10', initials: 'R10' },
      { id: '58', name: 'Reviewer 11', initials: 'R11' },
    ],
    activeUsers: 5,
    inactiveUsers: 6,
    permissions: ['Admin Report View', 'ADMIN_SEC', 'Content Review'],
    status: 'CLOSED',
  },
  // Add more roles to match the 204 total mentioned in pagination
  ...Array.from({ length: 198 }, (_, i) => {
    const roleNames = ['Admin', 'Sr. Admin', 'Manager', 'Checker', 'Assigner', 'Reviewer'] as const
    const roleIndex = i % roleNames.length
    const statusIndex = i % 2 // Alternate between ACTIVE and CLOSED
    // Use deterministic values instead of Math.random() to prevent hydration mismatch
    const userCount = (i % 8) + 2 // 2-9 users per role
    const activeCount = (i % 12) + 3 // 3-14 active users
    const inactiveCount = (i % 8) + 1 // 1-8 inactive users
    return {
      roleName: roleNames[roleIndex]!,
      roleId: `#ABA${String(i + 7).padStart(3, '0')}`,
      usersAssigned: Array.from({ length: userCount }, (_, j) => ({
        id: `${i + 59}-${j}`,
        name: `User ${i + 59}-${j}`,
        initials: `U${i + 59}-${j}`,
      })),
      activeUsers: activeCount,
      inactiveUsers: inactiveCount,
      permissions: ['Admin Report View', 'ADMIN_SEC', 'Custom Permission'],
      status: statusIndex === 0 ? 'ACTIVE' : 'CLOSED',
    }
  }),
]

const statusOptions = ['ACTIVE', 'CLOSED']

const tableColumns = [
  
  { key: 'checkbox', label: '', type: 'checkbox' as const, width: 'w-8' },
  {
    key: 'roleName',
    label: 'Role Name',
    type: 'text' as const,
    width: 'w-48',
    sortable: true,
  },
  {
    key: 'roleId',
    label: 'Role ID',
    type: 'text' as const,
    width: 'w-40',
    sortable: true,
  },
  {
    key: 'usersAssigned',
    label: "User's Assigned",
    type: 'custom' as const,
    width: 'w-48',
    sortable: false,
  },
  {
    key: 'activeUsers',
    label: 'Active Users',
    type: 'text' as const,
    width: 'w-32',
    sortable: true,
  },
  {
    key: 'inactiveUsers',
    label: 'Inactive Users',
    type: 'text' as const,
    width: 'w-32',
    sortable: true,
  },
  {
    key: 'permissions',
    label: 'Permissions',
    type: 'custom' as const,
    width: 'w-48',
    sortable: false,
  },
  {
    key: 'status',
    label: 'Status',
    type: 'status' as const,
    width: 'w-32',
    sortable: true,
  },
  { key: 'actions', label: 'Actions', type: 'actions' as const, width: 'w-20' },
]

const RoleManagementPage: React.FC = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [roleData] = useState(roleManagementData)

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
    data: roleData,
    searchFields: [
      'roleName',
      'roleId',
      'activeUsers',
      'inactiveUsers',
      'status',
    ],
    initialRowsPerPage: 20,
  })

  // Render expanded content
  const renderExpandedContent = (row: RoleManagementData) => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          Role Information
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Role Name:</span>
            <span className="ml-2 text-gray-800 font-medium">{row.roleName as string}</span>
          </div>
          <div>
            <span className="text-gray-600">Role ID:</span>
            <span className="ml-2 text-gray-800 font-medium">{row.roleId as string}</span>
          </div>
          <div>
            <span className="text-gray-600">Active Users:</span>
            <span className="ml-2 text-gray-800 font-medium">{row.activeUsers as number}</span>
          </div>
          <div>
            <span className="text-gray-600">Inactive Users:</span>
            <span className="ml-2 text-gray-800 font-medium">{row.inactiveUsers as number}</span>
          </div>
          <div>
            <span className="text-gray-600">Status:</span>
            <span className="ml-2 text-gray-800 font-medium">{row.status as string}</span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          Role Actions
        </h4>
        <div className="space-y-3">
          <button className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 shadow-sm">
            Edit Role
          </button>
          <button className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 shadow-sm">
            View Permissions
          </button>
          <button className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 shadow-sm">
            Manage Users
          </button>
          <button className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 shadow-sm">
            Deactivate Role
          </button>
        </div>
      </div>
    </div>
  )

  // Action buttons for bulk operations
  const actionButtons = [
    {
      label: 'Deactivate',
      onClick: () => console.log('Deactivate selected roles'),
      disabled: selectedRows.length === 0,
      variant: 'secondary' as const,
    },
    {
      label: 'Activate',
      onClick: () => console.log('Activate selected roles'),
      disabled: selectedRows.length === 0,
      variant: 'primary' as const,
    },
    {
      label: 'Download',
      onClick: () => console.log('Download selected roles'),
      icon: '/download.svg',
      disabled: selectedRows.length === 0,
      iconAlt: 'download icon',
    },
  ]

  // Custom cell renderer for the table
  const renderCustomCell = (column: string, value: unknown) => {
    switch (column) {
      case 'usersAssigned':
        return (
          <UserAvatarGroup
            users={value as Array<{ id: string; name: string; avatar?: string; initials?: string }>}
            maxVisible={3}
            size="sm"
          />
        )
      case 'permissions':
        return (
          <PermissionTags
            permissions={value as string[]}
            maxVisible={2}
          />
        )
      default:
        return <span>{String(value)}</span>
    }
  }

  return (
    <>
      {isSidePanelOpen && (
        <LeftSlidePanel
          isOpen={isSidePanelOpen}
          onClose={() => setIsSidePanelOpen(false)}
        />
      )}

      <DashboardLayout title="Role Management">
        <div className="bg-[#FFFFFFBF] py-4 border rounded-2xl">
          {/* Action Buttons - positioned above status cards */}
          <PageActionButtons 
            entityType="roleManagement" 
            showButtons={{ addNew: true }}
          />

          {/* Bulk Action Buttons - shown when rows are selected */}
          {selectedRows.length > 0 && (
            <div className="flex justify-end gap-2 py-3.5 px-4 border-b border-gray-200">
              {actionButtons.map((button, index) => (
                <button
                  key={index}
                  onClick={button.onClick}
                  disabled={button.disabled}
                  className={`flex items-center h-8 py-1.5 px-2.5 gap-1.5 font-sans font-medium text-sm rounded-md transition-colors ${
                    button.variant === 'primary'
                      ? 'bg-[#155DFC] text-[#FAFAF9] hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${button.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {button.icon && <img src={button.icon} alt={button.iconAlt} />}
                  {button.label}
                </button>
              ))}
            </div>
          )}

          {/* Table Content */}
          <ExpandableDataTable<RoleManagementData>
            data={paginated}
            columns={tableColumns}
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
            renderCustomCell={renderCustomCell}
          />
        </div>
      </DashboardLayout>
    </>
  )
}

export default RoleManagementPage
