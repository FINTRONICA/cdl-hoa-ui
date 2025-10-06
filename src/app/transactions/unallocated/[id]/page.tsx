'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '../../../../components/templates/DashboardLayout'
import { Button } from '../../../../components/atoms/Button'
import { StatusBadge } from '../../../../components/atoms/StatusBadge'
import { Card } from '../../../../components/molecules/Card'
import { Input } from '../../../../components/atoms/Input'
import { ActionDropdown } from '../../../../components/molecules/ActionDropdown'
import { TextField } from '@mui/material'

// Define the transaction data structure
interface TransactionData {
  tranReference: string
  projectName: string
  developerName: string
  narration: string
  tranDate: string
  unitNoOqoodFormat: string
  tasUpdate: string
  tranAmount: number
  retentionToBeTaken: string
  status: string
}

// Define split amount data structure
interface SplitAmountData {
  splitAmount: number
  receivableCategory: string
  receivableSubCategory: string
  unitNoOqoodFormat: string
  investorName: string
  buildingName: string
  depositMode: string
  chequeNumber: string
}

// Sample transaction data - in a real app, this would come from an API
const getTransactionById = (id: string): TransactionData | null => {
  const transactionsData: TransactionData[] = [
    {
      tranReference: 'TRANS987980',
      projectName: 'Pro Extension New test',
      developerName: 'Green Group',
      narration: 'SEND TO CUSTOMER',
      tranDate: '2024-09-09T16:06:00+05:30',
      unitNoOqoodFormat: '-',
      tasUpdate: 'YES',
      tranAmount: 560000,
      retentionToBeTaken: 'YES',
      status: 'Pending Allocation',
    },
    {
      tranReference: 'TRANS123456',
      projectName: 'Marina Heights',
      developerName: 'Blue Horizon',
      narration: 'SEND TO CUSTOMER',
      tranDate: '2024-12-15T10:30:00+05:30',
      unitNoOqoodFormat: 'A-1501',
      tasUpdate: 'YES',
      tranAmount: 2500000,
      retentionToBeTaken: 'YES',
      status: 'Pending Allocation',
    },
    // Add more sample data as needed
  ]

  return transactionsData.find((t) => t.tranReference === id) || null
}

// Sample split amount data
const getSplitAmountData = (tranReference: string): SplitAmountData[] => {
  const splitData: SplitAmountData[] = [
    {
      splitAmount: 50000,
      receivableCategory: 'Keebler LLC',
      receivableSubCategory: 'ABC',
      unitNoOqoodFormat: '-',
      investorName: 'Investroop',
      buildingName: 'DAMAC Hills',
      depositMode: 'ABC',
      chequeNumber: '456987',
    },
  ]

  return splitData
}

// Sample document data
const getDocumentData = (tranReference: string) => {
  const documents = [
    {
      id: 1,
      documentName: 'Contract_Agreement.pdf',
      uploadedDate: '2024-01-15T10:30:00+05:30',
      documentType: 'Contract',
    },
    {
      id: 2,
      documentName: 'Payment_Receipt.pdf',
      uploadedDate: '2024-01-16T14:20:00+05:30',
      documentType: 'Receipt',
    },
    {
      id: 3,
      documentName: 'Property_Deed.pdf',
      uploadedDate: '2024-01-17T09:45:00+05:30',
      documentType: 'Legal',
    },
  ]
  return documents
}

const UnallocatedTransactionDetailsPage: React.FC<{
  params: Promise<{ id: string }>
}> = ({ params }) => {
  const router = useRouter()
  const resolvedParams = React.use(params)
  const transaction = getTransactionById(resolvedParams.id)
  const splitAmountData = transaction
    ? getSplitAmountData(transaction.tranReference)
    : []
  const documentData = transaction
    ? getDocumentData(transaction.tranReference)
    : []

  if (!transaction) {
    return (
      <DashboardLayout title="Transaction Not Found">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Transaction Not Found
          </h2>
          <p className="mb-6 text-gray-600">
            The transaction you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => router.push('/transactions/unallocated')}
            variant="primary"
          >
            Back to Unallocated Transactions
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const totalSplitAmount = splitAmountData.reduce(
    (sum, item) => sum + item.splitAmount,
    0
  )

  const handleAddPaymentPlan = () => {
    // TODO: Implement add payment plan logic
    console.log('Adding payment plan for:', transaction.tranReference)
  }

  const handleUploadDocuments = () => {
    // TODO: Implement upload documents logic
    console.log('Uploading documents for:', transaction.tranReference)
  }

  const handleSubmitForReview = () => {
    // TODO: Implement submit for review logic
    console.log('Submitting for review:', transaction.tranReference)
  }

  const handleCancel = () => {
    router.push('/transactions/unallocated')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US')
  }

  return (
    <DashboardLayout title="Unallocated Transaction">
      <div className="bg-[#FFFFFFBF] py-4 px-6 rounded-2xl">
        <div className="flex flex-col gap-12 ">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 pt-2 mt-5 sm:grid-cols-2 lg:grid-cols-4 ">
              <div className="flex flex-col gap-1">
                <div className="h-[17px]">
                  <p className="font-sans font-normal text-xs leading-none tracking-[0%] text-[#4A5565]">
                    Trans Reference:
                  </p>
                </div>
                <div className="h-[25px]">
                  <p className="font-sans font-normal text-xl leading-none tracking-[0%] align-middle text-[#1E2939]">
                    {transaction.tranReference}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="h-[17px]">
                  <p className="font-sans font-normal text-xs leading-none tracking-[0%] text-[#4A5565]">
                    Project Name
                  </p>
                </div>
                <div className="h-[25px]">
                  <p className="font-sans font-normal text-xl leading-none tracking-[0%] align-middle text-[#1E2939]">
                    {transaction.projectName}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-1 gap-6 py-2 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-1">
                  <div className="h-[17px]">
                    <p className="font-sans font-normal text-xs leading-none tracking-[0%] text-[#4A5565]">
                      Developer Name:
                    </p>
                  </div>
                  <div className="h-[25px]">
                    <p className="font-sans font-normal text-[16px] leading-none tracking-[0%] align-middle text-[#1E2939]">
                      {transaction.developerName}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="h-[17px]">
                    <p className="font-sans font-normal text-xs leading-none tracking-[0%] text-[#4A5565]">
                      Narration:
                    </p>
                  </div>
                  <div className="h-[25px]">
                    <p className="font-sans font-normal text-[16px] leading-none tracking-[0%] align-middle text-[#1E2939]">
                      ["{transaction.narration}"]
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="h-[17px]">
                    <p className="font-sans font-normal text-xs leading-none tracking-[0%] text-[#4A5565]">
                      TAS Update:
                    </p>
                  </div>
                  <div className="h-[25px]">
                    <p className="font-sans font-normal text-[16px] leading-none tracking-[0%] align-middle text-[#1E2939]">
                      {transaction.tasUpdate}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="h-[17px]">
                    <p className="font-sans font-normal text-xs leading-none tracking-[0%] text-[#4A5565]">
                      5% Retention to be Taken:
                    </p>
                  </div>
                  <div className="h-[25px]">
                    <p className="font-sans font-normal text-[16px] leading-none tracking-[0%] align-middle text-[#1E2939]">
                      {transaction.retentionToBeTaken}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 py-2 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-1">
                  <div className="h-[17px]">
                    <p className="font-sans font-normal text-xs leading-none tracking-[0%] text-[#4A5565]">
                      Tran Date:
                    </p>
                  </div>
                  <div className="h-[25px]">
                    <p className="font-sans font-normal text-[16px] leading-none tracking-[0%] align-middle text-[#1E2939]">
                      {transaction.tranDate}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="h-[17px]">
                    <p className="font-sans font-normal text-xs leading-none tracking-[0%] text-[#4A5565]">
                      Unit No. Oqood Format:
                    </p>
                  </div>
                  <div className="h-[25px]">
                    <p className="font-sans font-normal text-[16px] leading-none tracking-[0%] align-middle text-[#1E2939]">
                      {transaction.tranReference}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="h-[17px]">
                    <p className="font-sans font-normal text-xs leading-none tracking-[0%] text-[#4A5565]">
                      Tran Amount:
                    </p>
                  </div>
                  <div className="h-[25px]">
                    <p className="font-sans font-normal text-[16px] leading-none tracking-[0%] align-middle text-[#1E2939]">
                      {transaction.tranAmount.toLocaleString('en-US')}.00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-end px-4">
              <button className="w-[161px] h-8 gap-1.5 opacity-100 py-1.5 px-2.5 rounded-md border border-[#2563EB] flex   text-[#2563EB] font-sans  text-sm  font-medium leading-5 tracking-[0%]">
                <img src="/circle-plus-blue.svg" alt="plus icon" />
                Add Payment Plan
              </button>
            </div>
            <div>
              <div className="">
                <div className="grid grid-cols-9 gap-4 px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">
                    Split Amount*
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    Receivable Category*
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    Receivable Sub Category*
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    Unit no. Oqood Format
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    Investor Name
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    Building Name
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    Deposit Mode
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    Cheque Number
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    Action
                  </div>
                </div>
              </div>
              <div className="">
                <div className="grid grid-cols-9 gap-4 px-4 py-3">
                  <Input placeholder="Search" className="h-8 text-sm" />
                  <Input placeholder="Search" className="h-8 text-sm" />
                  <Input placeholder="Search" className="h-8 text-sm" />
                  <div></div>
                  <Input placeholder="Search" className="h-8 text-sm" />
                  <Input placeholder="Search" className="h-8 text-sm" />
                  <Input placeholder="Search" className="h-8 text-sm" />
                  <div></div>
                  <div></div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {splitAmountData.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-9 gap-4 px-4 py-3 hover:bg-gray-50"
                  >
                    <div className="text-sm text-gray-900">
                      {formatNumber(item.splitAmount)}.00
                    </div>
                    <div className="text-sm text-gray-900">
                      {item.receivableCategory}
                    </div>
                    <div className="text-sm text-gray-900">
                      {item.receivableSubCategory}
                    </div>
                    <div className="text-sm text-gray-900">
                      {item.unitNoOqoodFormat}
                    </div>
                    <div className="text-sm text-gray-900">
                      {item.investorName}
                    </div>
                    <div className="text-sm text-gray-900">
                      {item.buildingName}
                    </div>
                    <div className="text-sm text-gray-900">
                      {item.depositMode}
                    </div>
                    <div className="text-sm text-gray-900">
                      {item.chequeNumber}
                    </div>
                    <div className="flex items-center">
                      <button className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full hover:bg-blue-200">
                        <img
                          src="/ellipsis.svg"
                          alt="actions"
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <div className="text-sm font-medium text-gray-900">
                  Total Split Amount: {formatNumber(totalSplitAmount)}.00
                </div>
              </div>
            </div>
          </div>
          <div className="py-3">
            <TextField
              fullWidth
              label="Comment"
              variant="outlined"
              placeholder="Type"
              className="rounded-md"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '46px',
                  borderRadius: '8px',
                  border: '1px solid #CAD5E2',
                },
              }}
            />
          </div>
          <div>
            <div className="py-3.5 flex items-center justify-between">
              <p className="font-sans font-medium text-lg leading-7 tracking-normal align-middle text-[#1E2939]">
                Developer Documents
              </p>
              <button className="w-[165px] h-8 gap-1.5 opacity-100 py-1.5 px-2.5 rounded-md border border-[#2563EB] flex   text-[#2563EB] font-sans  text-sm  font-medium leading-5 tracking-[0%]">
                <img src="/upload.svg" alt="plus icon" />
                Upload Documents
              </button>
            </div>
            <div>
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      Document Name
                    </span>
                    <img
                      src="/arrow-down.svg"
                      alt="sort"
                      className="w-4 h-4 text-gray-400"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      Uploaded Date
                    </span>
                    <img
                      src="/arrow-down.svg"
                      alt="sort"
                      className="w-4 h-4 text-gray-400"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      Document Type
                    </span>
                    <img
                      src="/arrow-down.svg"
                      alt="sort"
                      className="w-4 h-4 text-gray-400"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      Actions
                    </span>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {documentData.length === 0 ? (
                  <div className="px-4 py-4">
                    <div className="text-sm text-center text-gray-500">
                      No documents uploaded yet
                    </div>
                  </div>
                ) : (
                  documentData.map((document) => (
                    <div
                      key={document.id}
                      className="px-4 py-3 hover:bg-gray-50"
                    >
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-sm text-gray-900">
                          {document.documentName}
                        </div>
                        <div className="text-sm text-gray-900">
                          {formatDate(document.uploadedDate)}
                        </div>
                        <div className="text-sm text-gray-900">
                          {document.documentType}
                        </div>
                        <div className="flex items-center">
                          <button className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full hover:bg-blue-200">
                            <img
                              src="/ellipsis.svg"
                              alt="actions"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default UnallocatedTransactionDetailsPage
