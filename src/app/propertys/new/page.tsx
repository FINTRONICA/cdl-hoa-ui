'use client'

import { DashboardLayout } from '@/components/templates/DashboardLayout'
import StepperWrapper from '@/components/organisms/Stepper'

export default function NewPropertyPage() {
  return (
    <DashboardLayout title="Property Details" subtitle='Register your Property step by step, non-mandatory fields and steps are easy to skip.'>
      <div className="px-3">
        <StepperWrapper />
      </div>
    </DashboardLayout>
  )
} 