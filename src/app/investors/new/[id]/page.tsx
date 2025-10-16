'use client'

import { Suspense, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import InvestorsStepperWrapper from '@/components/organisms/InvestorStepper'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import {
  capitalPartnerService,
  type CapitalPartnerResponse,
} from '@/services/api/capitalPartnerService'

function InvestorStepPageContent() {
  const params = useParams()
  const searchParams = useSearchParams()

  const capitalPartnerId = params.id as string
  const currentStep = searchParams.get('step')
    ? parseInt(searchParams.get('step')!) - 1
    : 0
  const isViewMode = searchParams.get('mode') === 'view'

  const [capitalPartnerData, setCapitalPartnerData] =
    useState<CapitalPartnerResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch capital partner data when component mounts
  useEffect(() => {
    const fetchCapitalPartnerData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await capitalPartnerService.getCapitalPartnerById(
          parseInt(capitalPartnerId)
        )
        setCapitalPartnerData(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch capital partner data')
      } finally {
        setIsLoading(false)
      }
    }

    if (capitalPartnerId) {
      fetchCapitalPartnerData()
    }
  }, [capitalPartnerId])

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout
        title="Owner Registry Details
"
        subtitle="Loading..."
      >
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    )
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout
        title="Owner Registry Details
"
        subtitle="Error loading Owner Registry Details
"
      >
        <div className="p-6 text-red-600">
          <p>Error: {error}</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Owner Registry Details
"
      subtitle="Register your investor step by step, non-mandatory fields and steps are easy to skip."
    >
      <div className="flex items-start py-2 gap-7 px-7">
        <div className="flex flex-col min-w-[200px] gap-1">
          <label className="font-sans font-normal text-[12px] leading-[1] tracking-normal text-[#4A5565]">
            Capital Partner Name
          </label>
          <span className="font-outfit font-normal text-[16px] leading-[1] tracking-normal align-middle text-[#1E2939]">
            {capitalPartnerData
              ? `${capitalPartnerData.capitalPartnerName || ''} ${capitalPartnerData.capitalPartnerMiddleName || ''} ${capitalPartnerData.capitalPartnerLastName || ''}`.trim() ||
                'N/A'
              : 'N/A'}
          </span>
        </div>
        <div className="flex flex-col min-w-[200px] gap-1">
          <label className="font-sans font-normal text-[12px] leading-[1] tracking-normal text-[#4A5565]">
            Capital Partner ID
          </label>
          <span className="font-outfit font-normal text-[16px] leading-[1] tracking-normal align-middle text-[#1E2939]">
            {capitalPartnerData?.capitalPartnerId || 'N/A'}
          </span>
        </div>
      </div>
      <div className="px-3 mt-[10px]">
        <InvestorsStepperWrapper
          initialCapitalPartnerId={
            capitalPartnerId ? parseInt(capitalPartnerId) : null
          }
          initialStep={currentStep}
          isViewMode={isViewMode}
        />
      </div>
    </DashboardLayout>
  )
}

export default function InvestorStepPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout title="Owner Registry Details
" subtitle="Loading...">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading...</div>
          </div>
        </DashboardLayout>
      }
    >
      <InvestorStepPageContent />
    </Suspense>
  )
}
