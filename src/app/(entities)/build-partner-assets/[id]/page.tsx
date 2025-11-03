'use client'

import { Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import StepperWrapper from '@/components/organisms/ProjectStepper'
import { GlobalLoading } from '@/components/atoms'
import { useProject } from '@/hooks/useProjects'
import { useBuildPartnerAssetLabelsWithUtils } from '@/hooks/useBuildPartnerAssetLabels'

function ProjectDetailsPageContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isValidating, setIsValidating] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const projectId = params.id as string
  const mode = searchParams.get('mode') // 'view' or null
  const editing = searchParams.get('editing') // 'true' or null

  const { getLabel } = useBuildPartnerAssetLabelsWithUtils()
  const language = 'EN'

  // Fetch project data using the existing hook
  const {
    data: projectData,
    isLoading: isLoadingData,
    error: projectError,
  } = useProject(projectId)

  // Validate project ID and set validation state
  useEffect(() => {
    if (!projectId || isNaN(parseInt(projectId))) {
      router.push('/build-partner-assets')
      return
    }
    setIsValidating(false)
  }, [projectId, router])

  // Handle project error
  useEffect(() => {
    if (projectError) {
      setError(projectError.message || 'Failed to fetch project data')
    }
  }, [projectError])

  if (isValidating || isLoadingData) {
    return (
      <DashboardLayout
        title={getLabel(
          'CDL_BPA_DETAILS',
          language,
          'Build Partner Assets Details'
        )}
        subtitle=""
      >
        <div className="bg-[#FFFFFFBF] rounded-2xl flex flex-col h-full">
          <GlobalLoading fullHeight />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        title={getLabel(
          'CDL_BPA_DETAILS',
          language,
          'Build Partner Assets Details'
        )}
        subtitle="Error loading build partner assets details"
      >
        <div className="p-6 text-red-600">
          <p>Error: {error}</p>
          <button
            onClick={() => router.push('/build-partner-assets')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Projects
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title={getLabel(
        'CDL_BPA_DETAILS',
        language,
        'Build Partner Assets Details'
      )}
      subtitle={
        mode === 'view'
          ? 'View build partner assets details and configuration (Read-only)'
          : editing === 'true'
            ? 'Edit build partner assets details and configuration'
            : 'Manage your build partner assets details and configuration'
      }
    >
      <div className="flex gap-7 items-start px-7 py-2">
        <div className="flex flex-col min-w-[200px] gap-1">
          <label className="font-sans font-normal text-[12px] leading-[1] tracking-normal text-[#4A5565]">
            {getLabel('CDL_BPA_NAME', language, 'Asset Name')}
          </label>
          <span className="font-outfit font-normal text-[16px] leading-[1] tracking-normal align-middle text-[#1E2939]">
            {projectData?.reaName || 'N/A'}
          </span>
        </div>
        <div className="flex flex-col min-w-[200px] gap-1">
          <label className="font-sans font-normal text-[12px] leading-[1] tracking-normal text-[#4A5565]">
            {getLabel('CDL_BPA_REGNO', language, 'RERA Registration Number')}
          </label>
          <span className="font-outfit font-normal text-[16px] leading-[1] tracking-normal align-middle text-[#1E2939]">
            {projectData?.reaReraNumber || 'N/A'}
          </span>
        </div>
        <div className="flex flex-col min-w-[200px] gap-1">
          <label className="font-sans font-normal text-[12px] leading-[1] tracking-normal text-[#4A5565]">
            {getLabel(
              'CDL_BPA_CIF',
              language,
              'Customer Information File (CIF) Number'
            )}
          </label>
          <span className="font-outfit font-normal text-[16px] leading-[1] tracking-normal align-middle text-[#1E2939]">
            {projectData?.reaCif || 'N/A'}
          </span>
        </div>
      </div>
      <div className="px-3 mt-[10px]">
        <StepperWrapper projectId={projectId} isViewMode={mode === 'view'} />
      </div>
    </DashboardLayout>
  )
}

export default function ProjectDetailsPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout title="Build Partner Assets Details" subtitle="">
          <div className="bg-[#FFFFFFBF] rounded-2xl flex flex-col h-full">
            <GlobalLoading fullHeight />
          </div>
        </DashboardLayout>
      }
    >
      <ProjectDetailsPageContent />
    </Suspense>
  )
}
