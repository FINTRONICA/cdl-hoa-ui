'use client'

import React from 'react'
import { DashboardLayout } from '../../components/templates/DashboardLayout'

const GuaranteePage: React.FC = () => {
  return (
    <DashboardLayout title="Guarantee">
      <div className="bg-[#FFFFFFBF] py-4 border rounded-2xl">
        <div className="px-4 py-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Guarantee Management
          </h2>
          <p className="text-gray-600">
            This page is under development. Guarantee management features will be implemented here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default GuaranteePage
