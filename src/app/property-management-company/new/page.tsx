'use client'

import { DashboardLayout } from '@/components/templates/DashboardLayout'
import PropertyManagementStepperWrapper from '@/components/organisms/PropertyManagementSteppers'

export default function NewPropertyManagementPage() {
  return (
    <DashboardLayout title="Property Management Company Details" subtitle='Register your property management company step by step, on-mandatory fields and steps are easy to skip.'>
      <div className="px-3">
        <PropertyManagementStepperWrapper />
      </div>
    </DashboardLayout>
  )
}