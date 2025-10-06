'use client'

import React from 'react'
import { DashboardLayout } from '../../../components/templates/DashboardLayout'
import { ArrowDown, ChevronDown } from 'lucide-react'

// Fee type data matching the Figma design
const feeTypesData = [
  {
    feeType: 'Smart Business Subscription',
    frequency: '',
  },
  {
    feeType: 'Transaction Charges TT (FCY)',
    frequency: 'Per Request',
  },
  {
    feeType: 'Transaction Charges MC',
    frequency: 'Per Request',
  },
  {
    feeType: 'Transaction Charges TR',
    frequency: 'Per Request',
  },
  {
    feeType: 'Transaction Charges TT',
    frequency: 'Per Request',
  },
  {
    feeType: 'Other Services (Not listed above)',
    frequency: '',
  },
  {
    feeType: 'Any Certificate',
    frequency: 'Per Certificate, Per Visit',
  },
  {
    feeType: 'Any Audit Report',
    frequency: 'Per Request',
  },
]

const FeeTypePage = () => {
  return (
    <DashboardLayout title="Fee Type">
      <div className="flex flex-col h-full px-6">
        {/* Table Container with exact glassmorphism styling */}
        <div className="flex flex-col h-full p-4 rounded-2xl border border-white bg-white/75 backdrop-blur-[5px]">
          {/* Table Structure */}
          <div className="flex flex-1">
            {/* Fee Type Column */}
            <div className="flex flex-col flex-1">
              {/* Column Header */}
              <div className="flex items-center border-b border-[#E5E7EB]">
                <div className="flex items-center px-4 py-[14px] border-b border-[#E5E7EB]">
                  <span
                    className="text-xs font-normal text-[#1E2939] leading-4"
                    style={{
                      fontFamily:
                        'Outfit, -apple-system, Roboto, Helvetica, sans-serif',
                    }}
                  >
                    Fee Type
                  </span>
                </div>
                <div className="flex items-center justify-center w-6 h-[44px] px-1">
                  <ArrowDown
                    className="w-[18px] h-[18px] text-[#99A1AF]"
                    strokeWidth={2}
                  />
                </div>
              </div>

              {/* Data Rows */}
              {feeTypesData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center h-[60px] px-4 gap-3 border-b border-[#E5E7EB]"
                >
                  <span
                    className="text-sm font-normal text-[#1E2939] leading-4"
                    style={{
                      fontFamily:
                        'Outfit, -apple-system, Roboto, Helvetica, sans-serif',
                    }}
                  >
                    {item.feeType}
                  </span>
                </div>
              ))}
            </div>

            {/* Frequency Column */}
            <div className="flex flex-col flex-1">
              {/* Column Header */}
              <div className="flex items-center border-b border-[#E5E7EB]">
                <div className="flex items-center px-4 py-[14px] border-b border-[#E5E7EB]">
                  <span
                    className="text-xs font-normal text-[#1E2939] leading-4"
                    style={{
                      fontFamily:
                        'Outfit, -apple-system, Roboto, Helvetica, sans-serif',
                    }}
                  >
                    Frequency
                  </span>
                </div>
                <ArrowDown
                  className="w-[18px] h-[18px] text-[#99A1AF]"
                  strokeWidth={2}
                />
              </div>

              {/* Data Rows */}
              {feeTypesData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center h-[60px] border-b border-[#E5E7EB]"
                >
                  <div className="flex items-center flex-1 px-4 gap-3">
                    <span
                      className="text-sm font-normal text-[#1E2939] leading-4"
                      style={{
                        fontFamily:
                          'Outfit, -apple-system, Roboto, Helvetica, sans-serif',
                      }}
                    >
                      {item.frequency}
                    </span>
                  </div>
                  <div className="flex items-center justify-center w-6 h-[44px] px-2 relative -mr-[27px] top-2">
                    <ChevronDown
                      className="w-[18px] h-[18px] text-[#90A1B9]"
                      strokeWidth={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default FeeTypePage
