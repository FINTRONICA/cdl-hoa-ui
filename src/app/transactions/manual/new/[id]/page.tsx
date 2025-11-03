'use client'
import { Suspense } from 'react'
import ManualPaymentStepperWrapper from '@/components/organisms/ManualPaymentStepper'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { useManualPaymentLabelsWithCache } from '@/hooks/useManualPaymentLabelsWithCache'
import { VOUCHER_LABELS } from '@/constants/mappings/manualPaymentLabels'
import { useSearchParams, useParams } from 'next/navigation'
import { fundEgressService } from '@/services/api/fundEgressService'
import { useState, useEffect } from 'react'
import { GlobalLoading, GlobalError } from '@/components/atoms'

function ManualPaymentWithIdContent() {
  const { getLabel } = useManualPaymentLabelsWithCache('EN')
  const searchParams = useSearchParams()
  const params = useParams()

  // Check if we're in view mode (read-only)
  const mode = searchParams.get('mode')
  const isViewMode = mode === 'view'

  // State for payment data
  const [paymentData, setPaymentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch payment data when ID is available
  useEffect(() => {
    const fetchPaymentData = async () => {
      if (params.id) {
        try {
          setLoading(true)
          setError(null)
          const data = await fundEgressService.getFundEgressById(
            params.id as string
          )
          setPaymentData(data)
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to load payment data')
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchPaymentData()
  }, [params.id])

  const pageTitle = getLabel(
    VOUCHER_LABELS.PAGE_TITLE,
    'EN',
    VOUCHER_LABELS.FALLBACKS.PAGE_TITLE
  )
  const pageSubtitle = isViewMode
    ? 'View Manual Payment details (Read-only mode)'
    : 'Register your Voucher  details step by step, non-mandatory fields and steps are easy to skip.'

  // Show loading state while fetching payment data
  if (loading && params.id) {
    return (
      <DashboardLayout title={pageTitle} subtitle="">
        <div className="bg-[#FFFFFFBF] rounded-2xl flex flex-col h-full">
          <GlobalLoading fullHeight />
        </div>
      </DashboardLayout>
    )
  }

  // Show error state if there was an error loading payment data
  if (error) {
    return (
      <DashboardLayout title={pageTitle} subtitle="">
        <div className="bg-[#FFFFFFBF] rounded-2xl flex flex-col h-full">
          <GlobalError 
            error={error} 
            onRetry={() => window.location.reload()}
            title="Error loading manual payment data"
            fullHeight
          />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={pageTitle} subtitle={pageSubtitle}>
      <div className="px-3">
        {/* Manual Payment Summary for Both View and Edit Mode */}
        {params.id && (
          <div className="flex gap-7 items-start px-7 py-2 mb-4  ">
            <div className="flex flex-col min-w-[200px] gap-1">
              <label className="font-sans font-normal text-[12px] leading-[1] tracking-normal text-[#4A5565]">
                {getLabel(
                  VOUCHER_LABELS.FORM_FIELDS.TAS_REFERENCE,
                  'EN',
                  VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.TAS_REFERENCE
                )}
                *
              </label>
              <span className="font-outfit font-normal text-[16px] leading-[1] tracking-normal align-middle text-[#1E2939]">
                {loading
                  ? 'Loading...'
                  : paymentData?.fePaymentRefNumber || 'N/A'}
              </span>
            </div>
            <div className="flex flex-col min-w-[200px] gap-1">
              <label className="font-sans font-normal text-[12px] leading-[1] tracking-normal text-[#4A5565]">
                {getLabel(
                  VOUCHER_LABELS.FORM_FIELDS.DEVELOPER_NAME,
                  'EN',
                  VOUCHER_LABELS.FALLBACKS.FORM_FIELDS.DEVELOPER_NAME
                )}
              </label>
              <span className="font-outfit font-normal text-[16px] leading-[1] tracking-normal align-middle text-[#1E2939]">
                {loading
                  ? 'Loading...'
                  : paymentData?.buildPartnerDTO?.bpName || 'N/A'}
              </span>
            </div>
          </div>
        )}

        <ManualPaymentStepperWrapper isReadOnly={isViewMode} />
      </div>
    </DashboardLayout>
  )
}

export default function ManualPaymentWithIdPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ManualPaymentWithIdContent />
    </Suspense>
  )
}
