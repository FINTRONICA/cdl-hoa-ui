'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '../../../components/templates/DashboardLayout'
import {
  PackageOpen,
  Box,
  IndianRupee,
  FileUser,
  SquareChartGantt,
  SquareUser,
  FileChartLine,
  FolderKanban,
  PcCase,
} from 'lucide-react'
import { ReportCard, RightSlidePanel } from '@/components'

const reportsData = [
  {
    id: 'account-opening',
    title: 'Account Opening Letter Report',
    icon: <PackageOpen className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'account-closure',
    title: 'Account Closure Report',
    icon: <Box className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'balance-confirmation',
    title: 'Balance Confirmation Letter',
    icon: <IndianRupee className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'beneficiary',
    title: 'Beneficiary Report',
    icon: <FileUser className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'charges',
    title: 'Charges Report',
    icon: (
      <SquareChartGantt className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />
    ),
  },
  {
    id: 'investor-audit',
    title: 'Investor Audit Report',
    icon: <SquareUser className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'deposit-audit',
    title: 'Deposit Audit Report',
    icon: <FileChartLine className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'deposit-discard',
    title: 'Deposit Discard Report',
    icon: <FolderKanban className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'developer-audit',
    title: 'Developer Audit Report',
    icon: <SquareUser className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'payment-discard',
    title: 'Payment Discard Report',
    icon: <FileUser className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'developer',
    title: 'Developer Report',
    icon: <PackageOpen className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'escrow-transaction',
    title: 'Escrow Transaction Detailed Report',
    icon: <IndianRupee className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'escrow-regulatory',
    title: 'Escrow Regulatory Tas Report',
    icon: <SquareUser className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'financial-data',
    title: 'Financial Data Report',
    icon: <PcCase className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'guarantee',
    title: 'Guarantee Report',
    icon: <FolderKanban className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'guarantee-audit',
    title: 'Guarantee Audit Report',
    icon: <FileChartLine className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'monthly-rera',
    title: 'Monthly Rera Report',
    icon: <Box className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'monthly-tas',
    title: 'Monthly Tas Report',
    icon: <PackageOpen className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'project',
    title: 'Project Report',
    icon: <IndianRupee className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'project-audit',
    title: 'Project Audit Report',
    icon: <FileUser className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'project-financial',
    title: 'Project Financial Report',
    icon: <SquareUser className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'payment-master',
    title: 'Payment Master Report',
    icon: <FolderKanban className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'payment-audit',
    title: 'Payment Audit Report',
    icon: <PcCase className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'retention-transfer',
    title: 'Retention Transfer Report',
    icon: <FileChartLine className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'tas-batch-status',
    title: 'Tas Batch Status Report',
    icon: <SquareUser className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'trust-report',
    title: 'R/T/04 (Trust Report)',
    icon: <PcCase className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'staff-productivity',
    title: 'Staff Productivity Report',
    icon: <FolderKanban className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
  {
    id: 'unit-history',
    title: 'Unit History Report',
    icon: <FileChartLine className="w-8 h-8 text-[#1E2939]" strokeWidth={2} />,
  },
]

const BusinessReportPage = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)

  const handleReportClick = (reportId: string) => {
    const report = reportsData.find(r => r.id === reportId)
    setSelectedReport(report)
    setSelectedReportId(reportId)
    setIsPanelOpen(true)
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setSelectedReport(null)
    setSelectedReportId(null)
  }

  return (
    <DashboardLayout title="Business Report">
      <div className="flex flex-col gap-4 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportsData.map((report) => (
            <ReportCard
              key={report.id}
              title={report.title}
              icon={report.icon}
              onClick={() => handleReportClick(report.id)}
              isSelected={selectedReportId === report.id}
            />
          ))}
        </div>
      </div>
      
      <RightSlidePanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        title={selectedReport?.title || ''}
        reportData={selectedReport}
      />
    </DashboardLayout>
  )
}

export default BusinessReportPage