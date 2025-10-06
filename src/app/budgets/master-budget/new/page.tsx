'use client'
import BudgetStepperWrapper from '@/components/organisms/BudgetStepper'
import { DashboardLayout } from '@/components/templates/DashboardLayout'

export default function NewMasterBudgetPage() {
  return (
    <DashboardLayout title="Master Budget Details" subtitle='Register your Master Budget details step by step, non-mandatory fields and steps are easy to skip.'>
      <div className="px-3">
        <BudgetStepperWrapper />
      </div>
    </DashboardLayout>
  )
} 