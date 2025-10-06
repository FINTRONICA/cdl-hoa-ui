'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '../../../components/templates/DashboardLayout'
import { ExpandableDataTable } from '../../../components/organisms/ExpandableDataTable'
import { useTableState } from '../../../hooks/useTableState'
import LeftSlidePanel from '@/components/organisms/LeftSlidePanel/LeftSlidePanel'

// Define the transaction data structure
interface TransactionData extends Record<string, unknown> {
  date: string
  transId: string
  projectAccountId: string
  developerName: string
  projectName: string
  projectRegulatorId: string
  unitNo: string
  amount: number
  status: string
  tranReference: string
}

// Sample unallocated transaction data
const transactionsData: TransactionData[] = [
  {
    date: '15-12-2024 10:30:00',
    transId: 'TRANS123456',
    tranReference: 'TRANS123456',
    projectAccountId: 'L009349934343434',
    developerName: 'Blue Horizon',
    projectName: 'Marina Heights',
    projectRegulatorId: '445566778',
    unitNo: 'A-1501',
    amount: 2500000,
    status: 'Pending Allocation',
  },
  {
    date: '14-12-2024 14:22:00',
    transId: 'TRANS123457',
    tranReference: 'TRANS123457',
    projectAccountId: 'L009349934343435',
    developerName: 'Red Stone',
    projectName: 'Palm Gardens',
    projectRegulatorId: '445566779',
    unitNo: 'B-2203',
    amount: 1800000,
    status: 'Pending Allocation',
  },
  {
    date: '13-12-2024 09:15:00',
    transId: 'TRANS123458',
    tranReference: 'TRANS123458',
    projectAccountId: 'L009349934343436',
    developerName: 'Golden Sands',
    projectName: 'Desert Oasis',
    projectRegulatorId: '445566780',
    unitNo: 'C-0805',
    amount: 3200000,
    status: 'Pending Allocation',
  },
  {
    date: '12-12-2024 16:45:00',
    transId: 'TRANS123459',
    tranReference: 'TRANS123459',
    projectAccountId: 'L009349934343437',
    developerName: 'Silver Tower',
    projectName: 'Skyline Plaza',
    projectRegulatorId: '445566781',
    unitNo: 'D-1207',
    amount: 4100000,
    status: 'Pending Allocation',
  },
  {
    date: '11-12-2024 11:30:00',
    transId: 'TRANS123460',
    tranReference: 'TRANS123460',
    projectAccountId: 'L009349934343438',
    developerName: 'Green Group',
    projectName: 'Pro Extention New test',
    projectRegulatorId: '333499334',
    unitNo: 'E-0902',
    amount: 1950000,
    status: 'Pending Allocation',
  },
  {
    date: '10-12-2024 13:20:00',
    transId: 'TRANS123461',
    tranReference: 'TRANS123461',
    projectAccountId: 'L009349934343439',
    developerName: 'Blue Horizon',
    projectName: 'Marina Heights',
    projectRegulatorId: '445566778',
    unitNo: 'A-1602',
    amount: 2750000,
    status: 'Pending Allocation',
  },
  {
    date: '09-12-2024 08:45:00',
    transId: 'TRANS123462',
    tranReference: 'TRANS123462',
    projectAccountId: 'L009349934343440',
    developerName: 'Red Stone',
    projectName: 'Palm Gardens',
    projectRegulatorId: '445566779',
    unitNo: 'B-2301',
    amount: 2100000,
    status: 'Pending Allocation',
  },
  {
    date: '08-12-2024 15:10:00',
    transId: 'TRANS123463',
    tranReference: 'TRANS123463',
    projectAccountId: 'L009349934343441',
    developerName: 'Golden Sands',
    projectName: 'Desert Oasis',
    projectRegulatorId: '445566780',
    unitNo: 'C-0906',
    amount: 2800000,
    status: 'Pending Allocation',
  },
  {
    date: '07-12-2024 12:30:00',
    transId: 'TRANS123464',
    tranReference: 'TRANS123464',
    projectAccountId: 'L009349934343442',
    developerName: 'Silver Tower',
    projectName: 'Skyline Plaza',
    projectRegulatorId: '445566781',
    unitNo: 'D-1308',
    amount: 3600000,
    status: 'Pending Allocation',
  },
  {
    date: '06-12-2024 10:15:00',
    transId: 'TRANS123465',
    tranReference: 'TRANS123465',
    projectAccountId: 'L009349934343443',
    developerName: 'Green Group',
    projectName: 'Pro Extention New test',
    projectRegulatorId: '333499334',
    unitNo: 'E-1003',
    amount: 2300000,
    status: 'Pending Allocation',
  },
  {
    date: '05-12-2024 14:50:00',
    transId: 'TRANS123466',
    tranReference: 'TRANS123466',
    projectAccountId: 'L009349934343444',
    developerName: 'Blue Horizon',
    projectName: 'Marina Heights',
    projectRegulatorId: '445566778',
    unitNo: 'A-1703',
    amount: 2900000,
    status: 'Pending Allocation',
  },
  {
    date: '04-12-2024 09:25:00',
    transId: 'TRANS123467',
    tranReference: 'TRANS123467',
    projectAccountId: 'L009349934343445',
    developerName: 'Red Stone',
    projectName: 'Palm Gardens',
    projectRegulatorId: '445566779',
    unitNo: 'B-2402',
    amount: 1700000,
    status: 'Pending Allocation',
  },
  {
    date: '03-12-2024 16:40:00',
    transId: 'TRANS123468',
    tranReference: 'TRANS123468',
    projectAccountId: 'L009349934343446',
    developerName: 'Golden Sands',
    projectName: 'Desert Oasis',
    projectRegulatorId: '445566780',
    unitNo: 'C-1007',
    amount: 3400000,
    status: 'Pending Allocation',
  },
  {
    date: '02-12-2024 11:55:00',
    transId: 'TRANS123469',
    tranReference: 'TRANS123469',
    projectAccountId: 'L009349934343447',
    developerName: 'Silver Tower',
    projectName: 'Skyline Plaza',
    projectRegulatorId: '445566781',
    unitNo: 'D-1409',
    amount: 4500000,
    status: 'Pending Allocation',
  },
  {
    date: '01-12-2024 13:15:00',
    transId: 'TRANS123470',
    tranReference: 'TRANS123470',
    projectAccountId: 'L009349934343448',
    developerName: 'Green Group',
    projectName: 'Pro Extention New test',
    projectRegulatorId: '333499334',
    unitNo: 'E-1104',
    amount: 2150000,
    status: 'Pending Allocation',
  },
  {
    date: '30-11-2024 10:45:00',
    transId: 'TRANS123471',
    tranReference: 'TRANS123471',
    projectAccountId: 'L009349934343449',
    developerName: 'Blue Horizon',
    projectName: 'Marina Heights',
    projectRegulatorId: '445566778',
    unitNo: 'A-1804',
    amount: 3100000,
    status: 'Pending Allocation',
  },
  {
    date: '29-11-2024 15:30:00',
    transId: 'TRANS123472',
    tranReference: 'TRANS123472',
    projectAccountId: 'L009349934343450',
    developerName: 'Red Stone',
    projectName: 'Palm Gardens',
    projectRegulatorId: '445566779',
    unitNo: 'B-2503',
    amount: 1900000,
    status: 'Pending Allocation',
  },
  {
    date: '28-11-2024 08:20:00',
    transId: 'TRANS123473',
    tranReference: 'TRANS123473',
    projectAccountId: 'L009349934343451',
    developerName: 'Golden Sands',
    projectName: 'Desert Oasis',
    projectRegulatorId: '445566780',
    unitNo: 'C-1108',
    amount: 2600000,
    status: 'Pending Allocation',
  },
  {
    date: '27-11-2024 12:10:00',
    transId: 'TRANS123474',
    tranReference: 'TRANS123474',
    projectAccountId: 'L009349934343452',
    developerName: 'Silver Tower',
    projectName: 'Skyline Plaza',
    projectRegulatorId: '445566781',
    unitNo: 'D-1510',
    amount: 3800000,
    status: 'Pending Allocation',
  },
  {
    date: '26-11-2024 14:35:00',
    transId: 'TRANS123475',
    tranReference: 'TRANS123475',
    projectAccountId: 'L009349934343453',
    developerName: 'Green Group',
    projectName: 'Pro Extention New test',
    projectRegulatorId: '333499334',
    unitNo: 'E-1205',
    amount: 2450000,
    status: 'Pending Allocation',
  },
  {
    date: '25-11-2024 09:50:00',
    transId: 'TRANS123476',
    tranReference: 'TRANS123476',
    projectAccountId: 'L009349934343454',
    developerName: 'Blue Horizon',
    projectName: 'Marina Heights',
    projectRegulatorId: '445566778',
    unitNo: 'A-1905',
    amount: 2700000,
    status: 'Pending Allocation',
  },
]

const tableColumns = [
  {
    key: 'date',
    label: 'Date',
    type: 'text' as const,
    width: 'w-40',
    sortable: true,
  },
  {
    key: 'transId',
    label: 'Tran Id',
    type: 'text' as const,
    width: 'w-40',
    sortable: true,
  },
  {
    key: 'projectAccountId',
    label: 'Project Account (CIF)',
    type: 'text' as const,
    width: 'w-48',
    sortable: true,
  },
  {
    key: 'developerName',
    label: 'Developer Name',
    type: 'text' as const,
    width: 'w-48',
    sortable: true,
  },
  {
    key: 'projectName',
    label: 'Project Name',
    type: 'text' as const,
    width: 'w-48',
    sortable: true,
  },
  {
    key: 'projectRegulatorId',
    label: 'Project Regulator ID',
    type: 'text' as const,
    width: 'w-40',
    sortable: true,
  },
  {
    key: 'unitNo',
    label: 'Unit No. Oqood Format',
    type: 'text' as const,
    width: 'w-40',
    sortable: true,
  },
  {
    key: 'amount',
    label: 'Amount',
    type: 'custom' as const,
    width: 'w-40',
    sortable: true,
  },
  { key: 'actions', label: 'Action', type: 'actions' as const, width: 'w-20' },
]

const UnallocatedTransactionPage: React.FC = () => {
  const router = useRouter()
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US')
  }

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
      'date',
      'transId',
      'projectAccountId',
      'developerName',
      'projectName',
      'projectRegulatorId',
      'unitNo',
    ],
    initialRowsPerPage: 20,
  })

  // Handle row view action - navigate to details page
  const handleRowView = (row: TransactionData) => {
    console.log('row', row)
    router.push(`/transactions/unallocated/${row.tranReference}`)
  }

  // Handle row click - navigate to details page
  const handleRowClick = (row: TransactionData) => {
    console.log('row', row)
    router.push(`/transactions/unallocated/${row.tranReference}`)
  }

  // Custom cell renderer for amount column
  const renderCustomCell = (column: string, value: unknown) => {
    if (column === 'amount' && typeof value === 'number') {
      return `AED ${formatNumber(value)}`
    }
    return String(value || '')
  }

  // Render expanded content for transaction details
  const renderExpandedContent = (row: TransactionData) => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h4 className="mb-4 text-sm font-semibold text-gray-900">
          Transaction Information
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
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
            <span className="text-gray-600">Amount:</span>
            <span className="ml-2 font-medium text-gray-800">AED {formatNumber(row.amount)}</span>
          </div>
          <div>
            <span className="text-gray-600">Status:</span>
            <span className="ml-2 font-medium text-gray-800">{row.status}</span>
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
  )

  return (
    <>
      {isSidePanelOpen && (
        <LeftSlidePanel
          isOpen={isSidePanelOpen}
          onClose={() => setIsSidePanelOpen(false)}
        />
      )}

      <DashboardLayout title="Unallocated Transaction">
        <div className="bg-[#FFFFFFBF] border rounded-2xl flex flex-col h-full">
          {/* Sticky Header Section */}
          <div className="sticky top-0 z-10 bg-[#FFFFFFBF] border-b border-gray-200 rounded-t-2xl">
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
  )
}

export default UnallocatedTransactionPage
