'use client'
import VoucherPaymentStepperWrapper from '@/components/organisms/VoucherPaymentStepper'
import { DashboardLayout } from '@/components/templates/DashboardLayout'

export default function NewVoucherPaymentPage() {
  return (
    <DashboardLayout title="Voucher Payment Details" subtitle='Register your Voucher Payment details step by step, non-mandatory fields and steps are easy to skip.'>
      <div className="px-3">
        <VoucherPaymentStepperWrapper />
      </div>
    </DashboardLayout>
  )
} 