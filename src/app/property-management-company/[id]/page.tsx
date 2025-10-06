'use client'

import { DashboardLayout } from '@/components/templates/DashboardLayout'
import PropertyManagementStepperWrapper from '@/components/organisms/PropertyManagementSteppers'

export default function NewPropertyManagementPage() {
  return (
    <DashboardLayout title="Property Management Company Details" subtitle='Register your Property Management Company step by step, on-mandatory fields and steps are easy to skip.'>
      <div className="flex items-start py-2 gap-7 px-7">
        <div className="flex flex-col min-w-[200px] gap-1">
          <label className="font-sans font-normal text-[12px] leading-[1] tracking-normal text-[#4A5565]">Property Management Company Name</label>
          <span className="font-outfit font-normal text-[16px] leading-[1] tracking-normal align-middle text-[#1E2939]">AI Madina</span>
        </div>
        <div className="flex flex-col min-w-[200px] gap-1">
          <label className='font-sans font-normal text-[12px] leading-[1] tracking-normal text-[#4A5565]' >Property ID (HOA)</label>
          <span className="font-outfit font-normal text-[16px] leading-[1] tracking-normal align-middle text-[#1E2939]">12345677</span>
        </div>
      </div>
      <div className="px-3 mt-[10px]">
        <PropertyManagementStepperWrapper />
      </div>
    </DashboardLayout>
  )
}