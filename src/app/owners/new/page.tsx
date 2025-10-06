"use client";

import OwnerStepperWrapper from "@/components/organisms/OwnerStepper";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

export default function NewInvestorPage() {
  return (
    <DashboardLayout
      title="Owner Details"
      subtitle="Register your Owner step by step, non-mandatory fields and steps are easy to skip."
    >
      <div className="px-3">
        <OwnerStepperWrapper />
      </div>
    </DashboardLayout>
  );
}
