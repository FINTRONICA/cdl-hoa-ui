'use client'

import { DashboardLayout } from '@/components/templates/DashboardLayout'
import StepperWrapper from '@/components/organisms/ProjectStepper'

export default function NewProjectPage() {
  return (
    <DashboardLayout
      title="Management Firms Details"
      subtitle="Register your Management Firms step by step, non-mandatory fields and steps are easy to skip."
    >
      <div className="px-3">
        <StepperWrapper />
      </div>
    </DashboardLayout>
  )
}
