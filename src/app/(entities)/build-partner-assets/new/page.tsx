'use client'

import { DashboardLayout } from '@/components/templates/DashboardLayout'
import StepperWrapper from '@/components/organisms/ProjectStepper'
import { useBuildPartnerAssetLabelsWithCache } from '@/hooks/useBuildPartnerAssetLabelsWithCache'
import { useAppStore } from '@/store'
import { useSidebarConfig } from '@/hooks'

export default function NewProjectPage() {
  const { getLabel } = useBuildPartnerAssetLabelsWithCache()
  const currentLanguage = useAppStore((state) => state.language)
  const { getLabelResolver } = useSidebarConfig()
  const managementFirmsTitle = getLabelResolver
    ? getLabelResolver('management-firms', 'Management Firm')
    : 'Management Firm'

  const managementFirmsStepperTitle = getLabel('CDL_MF_DETAILS', currentLanguage, 'Management Firm  Details')

  return (
    <DashboardLayout
      title={managementFirmsStepperTitle}
      subtitle={`Register your ${managementFirmsTitle} step by step, non-mandatory fields and steps are easy to skip.`}
    >
      <div className="px-3">
        <StepperWrapper />
      </div>
    </DashboardLayout>
  )
}
