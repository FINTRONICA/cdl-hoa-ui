'use client'

import React from 'react'
import Image from 'next/image'
import { DashboardLayout } from '../../components/templates/DashboardLayout'
import { TrendingUp, TrendingDown } from 'lucide-react'

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Description tex"
      showFilters={true}
    >
      <div className="flex flex-col gap-4">
        {/* Main Trust Account Summary */}
        <div className="pt-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-[85px] text-gray-600 text-sm font-normal uppercase leading-normal">
              Main Trust Account summary
            </div>
            <div className="flex items-start">
              <svg
                className="h-20 mr-2 w-7"
                viewBox="0 0 28 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.6008 47.4463C13.9447 47.8018 13.9447 48.378 13.6008 48.7334C13.257 49.0889 12.6995 49.0889 12.3557 48.7334L13.6008 47.4463ZM17.8696 31L17.8923 31.0003C18.368 31.0128 18.75 31.4153 18.75 31.9101C18.75 32.4049 18.368 32.8075 17.8923 32.8199L17.8696 32.8202H14.47C15.1211 33.5721 15.5735 34.5116 15.7421 35.5506H17.8696L17.8923 35.5509C18.368 35.5633 18.75 35.9659 18.75 36.4607C18.75 36.9555 18.368 37.358 17.8923 37.3705L17.8696 37.3708H15.7421C15.323 39.9534 13.1502 41.9213 10.5326 41.9213H8.256L13.6008 47.4463L12.3557 48.7334L5.50791 41.6548C5.25611 41.3945 5.18077 41.003 5.31704 40.6629C5.45331 40.3229 5.77436 40.1011 6.13046 40.1011H10.5326C12.1736 40.1011 13.5524 38.9409 13.9434 37.3708H6.13046C5.64421 37.3708 5.25003 36.9633 5.25003 36.4607C5.25003 35.958 5.64421 35.5506 6.13046 35.5506H13.9434C13.5524 33.9804 12.1736 32.8202 10.5326 32.8202H6.13046C5.64421 32.8202 5.25003 32.4128 5.25003 31.9101C5.25003 31.4075 5.64421 31 6.13046 31H17.8696Z"
                  fill="#4A5565"
                />
              </svg>
              <div className="text-gray-900 text-[64px] font-normal leading-normal tracking-[-0.64px]">
                7,20,10,60,80,97,20,10
              </div>
              <div className="flex flex-col justify-center gap-1 ml-4">
                <div className="text-base font-normal text-gray-600 uppercase">
                  CRORE
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs font-bold text-green-600">12%</span>
                  <span className="text-xs text-green-600"> vs last month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Accounts Section */}
        <div className="flex gap-4">
          {/* Sum AC Section */}
          <div className="flex gap-4">
            {/* Total Deposits */}
            <div className="w-[272px] h-[420px] p-4 flex flex-col gap-8 rounded-2xl border border-white bg-white/75 backdrop-blur-md">
              <div className="flex flex-col gap-4">
                <div className="text-sm font-normal text-gray-600 uppercase">
                  Total Deposits (Main A/c)
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-8 mr-1"
                      viewBox="0 0 20 33"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.06723 21.9642C9.29645 22.2012 9.29645 22.5853 9.06723 22.8223C8.83801 23.0592 8.46636 23.0592 8.23714 22.8223L9.06723 21.9642ZM11.913 11L11.9282 11.0002C12.2454 11.0085 12.5 11.2769 12.5 11.6067C12.5 11.9366 12.2454 12.205 11.9282 12.2133L11.913 12.2135H9.64668C10.0807 12.7148 10.3823 13.3411 10.4948 14.0337H11.913L11.9282 14.0339C12.2454 14.0422 12.5 14.3106 12.5 14.6404C12.5 14.9703 12.2454 15.2387 11.9282 15.247L11.913 15.2472H10.4948C10.2153 16.969 8.76678 18.2809 7.02175 18.2809H5.504L9.06723 21.9642L8.23714 22.8223L3.67194 18.1032C3.50407 17.9297 3.45384 17.6687 3.54469 17.442C3.63554 17.2152 3.84957 17.0674 4.08698 17.0674H7.02175C8.11575 17.0674 9.03496 16.294 9.29559 15.2472H4.08698C3.76281 15.2472 3.50002 14.9755 3.50002 14.6404C3.50002 14.3054 3.76281 14.0337 4.08698 14.0337H9.29559C9.03496 12.9869 8.11575 12.2135 7.02175 12.2135H4.08698C3.76281 12.2135 3.50002 11.9418 3.50002 11.6067C3.50002 11.2716 3.76281 11 4.08698 11H11.913Z"
                        fill="#4A5565"
                      />
                    </svg>
                    <div className="text-gray-900 text-[28px] font-normal tracking-[-0.56px]">
                      2,04,10,60,800
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs font-bold text-green-600">
                      12%
                    </span>
                    <span className="text-xs text-green-600">
                      {' '}
                      vs last month
                    </span>
                  </div>
                </div>
              </div>
              {/* Nested Pie Chart */}
              <div className="flex flex-col gap-4">
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/9a099a045feb0b039e9e83da4bc93f0e50a5aa8b?width=304"
                  alt="Deposits Pie Chart"
                  width={152}
                  height={152}
                  className="w-[152px] h-[152px]"
                />
                <div className="flex gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00BBA7]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        Equity Fund
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#009689]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        Investor Fund
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00786F]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        DLD
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#005F5A]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        Unit Instalment
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0B4F4A]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        VAT
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#CCFBF1]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        DLD
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#96F7E4]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        Unit Instalment
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#46ECD5]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        VAT
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00D5BE]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        Unit Instalment
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Payments */}
            <div className="w-[272px] h-[420px] p-4 flex flex-col gap-8 rounded-2xl border border-white bg-white/50 backdrop-blur-md">
              <div className="flex flex-col gap-4">
                <div className="text-sm font-normal text-gray-600 uppercase">
                  Total Payments (Main A/c)
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-8 mr-1"
                      viewBox="0 0 20 33"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.06723 21.9642C9.29645 22.2012 9.29645 22.5853 9.06723 22.8223C8.83801 23.0592 8.46636 23.0592 8.23714 22.8223L9.06723 21.9642ZM11.913 11L11.9282 11.0002C12.2454 11.0085 12.5 11.2769 12.5 11.6067C12.5 11.9366 12.2454 12.205 11.9282 12.2133L11.913 12.2135H9.64668C10.0807 12.7148 10.3823 13.3411 10.4948 14.0337H11.913L11.9282 14.0339C12.2454 14.0422 12.5 14.3106 12.5 14.6404C12.5 14.9703 12.2454 15.2387 11.9282 15.247L11.913 15.2472H10.4948C10.2153 16.969 8.76678 18.2809 7.02175 18.2809H5.504L9.06723 21.9642L8.23714 22.8223L3.67194 18.1032C3.50407 17.9297 3.45384 17.6687 3.54469 17.442C3.63554 17.2152 3.84957 17.0674 4.08698 17.0674H7.02175C8.11575 17.0674 9.03496 16.294 9.29559 15.2472H4.08698C3.76281 15.2472 3.50002 14.9755 3.50002 14.6404C3.50002 14.3054 3.76281 14.0337 4.08698 14.0337H9.29559C9.03496 12.9869 8.11575 12.2135 7.02175 12.2135H4.08698C3.76281 12.2135 3.50002 11.9418 3.50002 11.6067C3.50002 11.2716 3.76281 11 4.08698 11H11.913Z"
                        fill="#4A5565"
                      />
                    </svg>
                    <div className="text-gray-900 text-[28px] font-normal tracking-[-0.56px]">
                      2,04,10,60,800
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                    <span className="text-xs font-bold text-red-600">8 %</span>
                    <span className="text-xs text-red-600"> vs last month</span>
                  </div>
                </div>
              </div>
              {/* Nested Pie Chart */}
              <div className="flex flex-col gap-4">
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/729d6e608cde6844e89c2ee39d669d1e2950c723?width=304"
                  alt="Payments Pie Chart"
                  width={152}
                  height={152}
                  className="w-[152px] h-[152px]"
                />
                <div className="flex gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F8EDF4]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        Equity Fund
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F2DCE9]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        Investor Fund
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#E4B9D3]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        DLD
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#D796BC]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        Unit Instalment
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C973A6]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        VAT
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C973A6]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        DLD
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#BC5090]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        Unit Instalment
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#964073]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        VAT
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#713056]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        Unit Instalment
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#4B203A]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        VAT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Fees Collected */}
            <div className="w-[272px] h-[420px] p-4 flex flex-col gap-8 rounded-2xl border border-white bg-white/50 backdrop-blur-md">
              <div className="flex flex-col gap-4">
                <div className="text-sm font-normal text-gray-600 uppercase">
                  Total Fees Collected (Main A/c)
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-8 mr-1"
                      viewBox="0 0 20 33"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.06723 21.9642C9.29645 22.2012 9.29645 22.5853 9.06723 22.8223C8.83801 23.0592 8.46636 23.0592 8.23714 22.8223L9.06723 21.9642ZM11.913 11L11.9282 11.0002C12.2454 11.0085 12.5 11.2769 12.5 11.6067C12.5 11.9366 12.2454 12.205 11.9282 12.2133L11.913 12.2135H9.64668C10.0807 12.7148 10.3823 13.3411 10.4948 14.0337H11.913L11.9282 14.0339C12.2454 14.0422 12.5 14.3106 12.5 14.6404C12.5 14.9703 12.2454 15.2387 11.9282 15.247L11.913 15.2472H10.4948C10.2153 16.969 8.76678 18.2809 7.02175 18.2809H5.504L9.06723 21.9642L8.23714 22.8223L3.67194 18.1032C3.50407 17.9297 3.45384 17.6687 3.54469 17.442C3.63554 17.2152 3.84957 17.0674 4.08698 17.0674H7.02175C8.11575 17.0674 9.03496 16.294 9.29559 15.2472H4.08698C3.76281 15.2472 3.50002 14.9755 3.50002 14.6404C3.50002 14.3054 3.76281 14.0337 4.08698 14.0337H9.29559C9.03496 12.9869 8.11575 12.2135 7.02175 12.2135H4.08698C3.76281 12.2135 3.50002 11.9418 3.50002 11.6067C3.50002 11.2716 3.76281 11 4.08698 11H11.913Z"
                        fill="#4A5565"
                      />
                    </svg>
                    <div className="text-gray-900 text-[28px] font-normal tracking-[-0.56px]">
                      2,04,10,60,800
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs font-bold text-green-600">
                      12%
                    </span>
                    <span className="text-xs text-green-600">
                      {' '}
                      vs last month
                    </span>
                  </div>
                </div>
              </div>
              {/* Nested Pie Chart */}
              <div className="flex flex-col gap-4">
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/e134a806062039eee3b3b910d83cf2539fb5eb64?width=304"
                  alt="Fees Pie Chart"
                  width={152}
                  height={152}
                  className="w-[152px] h-[152px]"
                />
                <div className="flex gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#EDE9FE]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        Equity Fund
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#DDD6FE]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        Investor Fund
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C4B4FF]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        DLD
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#A684FF]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        Unit Instalment
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#8E51FF]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        DLD
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#7F22FE]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        Unit Instalment
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#7008E7]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        VAT
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#5D0EC0]"></div>
                      <span className="text-gray-600 text-xs tracking-[0.24px]">
                        Unit Instalment
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Child AC Section */}
          <div className="w-[271px] flex flex-col gap-4">
            {/* Retention Account */}
            <div className="h-[129px] p-4 flex items-start rounded-2xl border border-white bg-white/50 backdrop-blur-md">
              <div className="w-[238px] flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.875 20C11.9417 20 12.0083 19.9833 12.075 19.95C12.1417 19.9167 12.1917 19.8833 12.225 19.85L20.425 11.65C20.625 11.45 20.7708 11.225 20.8625 10.975C20.9542 10.725 21 10.475 21 10.225C21 9.95833 20.9542 9.70417 20.8625 9.4625C20.7708 9.22083 20.625 9.00833 20.425 8.825L16.175 4.575C15.9917 4.375 15.7792 4.22917 15.5375 4.1375C15.2958 4.04583 15.0417 4 14.775 4C14.525 4 14.275 4.04583 14.025 4.1375C13.775 4.22917 13.55 4.375 13.35 4.575L13.075 4.85L14.925 6.725C15.175 6.95833 15.3583 7.225 15.475 7.525C15.5917 7.825 15.65 8.14167 15.65 8.475C15.65 9.175 15.4125 9.7625 14.9375 10.2375C14.4625 10.7125 13.875 10.95 13.175 10.95C12.8417 10.95 12.5208 10.8917 12.2125 10.775C11.9042 10.6583 11.6333 10.4833 11.4 10.25L9.52499 8.4L5.14999 12.775C5.09999 12.825 5.06249 12.8792 5.03749 12.9375C5.01249 12.9958 4.99999 13.0583 4.99999 13.125C4.99999 13.2583 5.04999 13.3792 5.14999 13.4875C5.24999 13.5958 5.36666 13.65 5.49999 13.65C5.56666 13.65 5.63332 13.6333 5.69999 13.6C5.76666 13.5667 5.81666 13.5333 5.84999 13.5L9.24999 10.1L10.65 11.5L7.27499 14.9C7.22499 14.95 7.18749 15.0042 7.16249 15.0625C7.13749 15.1208 7.12499 15.1833 7.12499 15.25C7.12499 15.3833 7.17499 15.5 7.27499 15.6C7.37499 15.7 7.49166 15.75 7.62499 15.75C7.69166 15.75 7.75832 15.7333 7.82499 15.7C7.89166 15.6667 7.94166 15.6333 7.97499 15.6L11.375 12.225L12.775 13.625L9.39999 17.025C9.34999 17.0583 9.31249 17.1083 9.28749 17.175C9.26249 17.2417 9.24999 17.3083 9.24999 17.375C9.24999 17.5083 9.29999 17.625 9.39999 17.725C9.49999 17.825 9.61666 17.875 9.74999 17.875C9.81666 17.875 9.87916 17.8625 9.93749 17.8375C9.99582 17.8125 10.05 17.775 10.1 17.725L13.5 14.35L14.9 15.75L11.5 19.15C11.45 19.2 11.4125 19.2542 11.3875 19.3125C11.3625 19.3708 11.35 19.4333 11.35 19.5C11.35 19.6333 11.4042 19.75 11.5125 19.85C11.6208 19.95 11.7417 20 11.875 20ZM11.85 22C11.2333 22 10.6875 21.7958 10.2125 21.3875C9.73749 20.9792 9.45832 20.4667 9.37499 19.85C8.80832 19.7667 8.33332 19.5333 7.94999 19.15C7.56666 18.7667 7.33332 18.2917 7.24999 17.725C6.68332 17.6417 6.21249 17.4042 5.83749 17.0125C5.46249 16.6208 5.23332 16.15 5.14999 15.6C4.51666 15.5167 3.99999 15.2417 3.59999 14.775C3.19999 14.3083 2.99999 13.7583 2.99999 13.125C2.99999 12.7917 3.06249 12.4708 3.18749 12.1625C3.31249 11.8542 3.49166 11.5833 3.72499 11.35L9.52499 5.575L12.8 8.85C12.8333 8.9 12.8833 8.9375 12.95 8.9625C13.0167 8.9875 13.0833 9 13.15 9C13.3 9 13.425 8.95417 13.525 8.8625C13.625 8.77083 13.675 8.65 13.675 8.5C13.675 8.43333 13.6625 8.36667 13.6375 8.3C13.6125 8.23333 13.575 8.18333 13.525 8.15L9.94999 4.575C9.76666 4.375 9.55416 4.22917 9.31249 4.1375C9.07082 4.04583 8.81666 4 8.54999 4C8.29999 4 8.04999 4.04583 7.79999 4.1375C7.54999 4.22917 7.32499 4.375 7.12499 4.575L3.59999 8.125C3.44999 8.275 3.32499 8.45 3.22499 8.65C3.12499 8.85 3.05832 9.05 3.02499 9.25C2.99166 9.45 2.99166 9.65417 3.02499 9.8625C3.05832 10.0708 3.12499 10.2667 3.22499 10.45L1.77499 11.9C1.49166 11.5167 1.28332 11.0958 1.14999 10.6375C1.01666 10.1792 0.966657 9.71667 0.99999 9.25C1.03332 8.78333 1.14999 8.32917 1.34999 7.8875C1.54999 7.44583 1.82499 7.05 2.17499 6.7L5.69999 3.175C6.09999 2.79167 6.54582 2.5 7.03749 2.3C7.52916 2.1 8.03332 2 8.54999 2C9.06666 2 9.57082 2.1 10.0625 2.3C10.5542 2.5 10.9917 2.79167 11.375 3.175L11.65 3.45L11.925 3.175C12.325 2.79167 12.7708 2.5 13.2625 2.3C13.7542 2.1 14.2583 2 14.775 2C15.2917 2 15.7958 2.1 16.2875 2.3C16.7792 2.5 17.2167 2.79167 17.6 3.175L21.825 7.4C22.2083 7.78333 22.5 8.225 22.7 8.725C22.9 9.225 23 9.73333 23 10.25C23 10.7667 22.9 11.2708 22.7 11.7625C22.5 12.2542 22.2083 12.6917 21.825 13.075L13.625 21.25C13.3917 21.4833 13.1208 21.6667 12.8125 21.8C12.5042 21.9333 12.1833 22 11.85 22Z"
                      fill="#90A1B9"
                    />
                  </svg>
                  <span className="text-sm font-normal text-gray-600 uppercase">
                    Retention Account
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-8 mr-1"
                      viewBox="0 0 20 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.06723 20.9642C9.29645 21.2012 9.29645 21.5853 9.06723 21.8223C8.83801 22.0592 8.46636 22.0592 8.23714 21.8223L9.06723 20.9642ZM11.913 10L11.9282 10.0002C12.2454 10.0085 12.5 10.2769 12.5 10.6067C12.5 10.9366 12.2454 11.205 11.9282 11.2133L11.913 11.2135H9.64668C10.0807 11.7148 10.3823 12.3411 10.4948 13.0337H11.913L11.9282 13.0339C12.2454 13.0422 12.5 13.3106 12.5 13.6404C12.5 13.9703 12.2454 14.2387 11.9282 14.247L11.913 14.2472H10.4948C10.2153 15.969 8.76678 17.2809 7.02175 17.2809H5.504L9.06723 20.9642L8.23714 21.8223L3.67194 17.1032C3.50407 16.9297 3.45384 16.6687 3.54469 16.442C3.63554 16.2152 3.84957 16.0674 4.08698 16.0674H7.02175C8.11575 16.0674 9.03496 15.294 9.29559 14.2472H4.08698C3.76281 14.2472 3.50002 13.9755 3.50002 13.6404C3.50002 13.3054 3.76281 13.0337 4.08698 13.0337H9.29559C9.03496 11.9869 8.11575 12.2135 7.02175 12.2135H4.08698C3.76281 12.2135 3.50002 11.9418 3.50002 11.6067C3.50002 11.2716 3.76281 11 4.08698 11H11.913Z"
                        fill="#4A5565"
                      />
                    </svg>
                    <div className="text-gray-900 text-[32px] font-normal tracking-[-0.64px]">
                      2,42,10,60,800
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs font-bold text-green-600">
                      12%
                    </span>
                    <span className="text-xs text-green-600">
                      {' '}
                      vs last month
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wakala Account */}
            <div className="h-[129px] p-4 flex items-start rounded-2xl border border-white bg-white/50 backdrop-blur-md">
              <div className="w-[238px] flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 14V7.5L14 4L9 7.5V9H7V6.5L14 1.5L21 6.5V14H19ZM14.5 8H15.5V7H14.5V8ZM12.5 8H13.5V7H12.5V8ZM14.5 10H15.5V9H14.5V10ZM12.5 10H13.5V9H12.5V10ZM7 18.5L13.95 20.4L19.9 18.55C19.8167 18.4 19.6958 18.2708 19.5375 18.1625C19.3792 18.0542 19.2 18 19 18H13.95C13.5 18 13.1417 17.9833 12.875 17.95C12.6083 17.9167 12.3333 17.85 12.05 17.75L9.725 16.975L10.275 15.025L12.3 15.7C12.5833 15.7833 12.9167 15.85 13.3 15.9C13.6833 15.95 14.25 15.9833 15 16C15 15.8167 14.9458 15.6417 14.8375 15.475C14.7292 15.3083 14.6 15.2 14.45 15.15L8.6 13H7V18.5ZM1 22V11H8.6C8.71667 11 8.83333 11.0125 8.95 11.0375C9.06667 11.0625 9.175 11.0917 9.275 11.125L15.15 13.3C15.7 13.5 16.1458 13.85 16.4875 14.35C16.8292 14.85 17 15.4 17 16H19C19.8333 16 20.5417 16.275 21.125 16.825C21.7083 17.375 22 18.1 22 19V20L14 22.5L7 20.55V22H1ZM3 20H5V13H3V20Z"
                      fill="#90A1B9"
                    />
                  </svg>
                  <span className="text-sm font-normal text-gray-600 uppercase">
                    Wakala Account
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-8 mr-1"
                      viewBox="0 0 20 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.06723 20.9642C9.29645 21.2012 9.29645 21.5853 9.06723 21.8223C8.83801 22.0592 8.46636 22.0592 8.23714 21.8223L9.06723 20.9642ZM11.913 10L11.9282 10.0002C12.2454 10.0085 12.5 10.2769 12.5 10.6067C12.5 10.9366 12.2454 11.205 11.9282 11.2133L11.913 11.2135H9.64668C10.0807 11.7148 10.3823 12.3411 10.4948 13.0337H11.913L11.9282 13.0339C12.2454 13.0422 12.5 13.3106 12.5 13.6404C12.5 13.9703 12.2454 14.2387 11.9282 14.247L11.913 14.2472H10.4948C10.2153 15.969 8.76678 17.2809 7.02175 17.2809H5.504L9.06723 20.9642L8.23714 21.8223L3.67194 17.1032C3.50407 16.9297 3.45384 16.6687 3.54469 16.442C3.63554 16.2152 3.84957 16.0674 4.08698 16.0674H7.02175C8.11575 16.0674 9.03496 15.294 9.29559 14.2472H4.08698C3.76281 14.2472 3.50002 13.9755 3.50002 13.6404C3.50002 13.3054 3.76281 13.0337 4.08698 13.0337H9.29559C9.03496 11.9869 8.11575 12.2135 7.02175 12.2135H4.08698C3.76281 12.2135 3.50002 11.9418 3.50002 11.6067C3.50002 11.2716 3.76281 11 4.08698 11H11.913Z"
                        fill="#4A5565"
                      />
                    </svg>
                    <div className="text-gray-900 text-[32px] font-normal tracking-[-0.64px]">
                      6,42,10,60,800
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs font-bold text-green-600">
                      14%
                    </span>
                    <span className="text-xs text-green-600">
                      {' '}
                      vs last month
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Corporate Account */}
            <div className="h-[129px] p-4 flex items-start rounded-2xl border border-white bg-white/50 backdrop-blur-md">
              <div className="w-[238px] flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 21V3H12V7H22V21H2ZM4 19H10V17H4V19ZM4 15H10V13H4V15ZM4 11H10V9H4V11ZM4 7H10V5H4V7ZM12 19H20V9H12V19ZM14 13V11H18V13H14ZM14 17V15H18V17H14Z"
                      fill="#90A1B9"
                    />
                  </svg>
                  <span className="text-sm font-normal text-gray-600 uppercase">
                    Corporate Account
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-8 mr-1"
                      viewBox="0 0 20 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.06723 20.9642C9.29645 21.2012 9.29645 21.5853 9.06723 21.8223C8.83801 22.0592 8.46636 22.0592 8.23714 21.8223L9.06723 20.9642ZM11.913 10L11.9282 10.0002C12.2454 10.0085 12.5 10.2769 12.5 10.6067C12.5 10.9366 12.2454 11.205 11.9282 11.2133L11.913 11.2135H9.64668C10.0807 11.7148 10.3823 12.3411 10.4948 13.0337H11.913L11.9282 13.0339C12.2454 13.0422 12.5 13.3106 12.5 13.6404C12.5 13.9703 12.2454 14.2387 11.9282 14.247L11.913 14.2472H10.4948C10.2153 15.969 8.76678 17.2809 7.02175 17.2809H5.504L9.06723 20.9642L8.23714 21.8223L3.67194 17.1032C3.50407 16.9297 3.45384 16.6687 3.54469 16.442C3.63554 16.2152 3.84957 16.0674 4.08698 16.0674H7.02175C8.11575 16.0674 9.03496 15.294 9.29559 14.2472H4.08698C3.76281 14.2472 3.50002 13.9755 3.50002 13.6404C3.50002 13.3054 3.76281 13.0337 4.08698 13.0337H9.29559C9.03496 11.9869 8.11575 12.2135 7.02175 12.2135H4.08698C3.76281 12.2135 3.50002 11.9418 3.50002 11.6067C3.50002 11.2716 3.76281 11 4.08698 11H11.913Z"
                        fill="#4A5565"
                      />
                    </svg>
                    <div className="text-gray-900 text-[32px] font-normal tracking-[-0.64px]">
                      3,42,10,60,800
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                    <span className="text-xs font-bold text-red-600">8%</span>
                    <span className="text-xs text-red-600"> vs last month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mid Section */}
        <div className="flex gap-4">
          {/* Unit Status Count */}
          <div className="w-[561px] h-[300px] p-6 flex flex-col items-center gap-6 rounded-2xl border border-white bg-white/50 backdrop-blur-md">
            <div className="flex flex-col self-stretch gap-1">
              <div className="text-sm font-normal text-gray-600 uppercase">
                Unit Status Count
              </div>
              <div className="text-gray-900 text-[32px] font-normal">20678</div>
            </div>
            <div className="w-[400px] h-[180px] flex flex-col gap-1">
              {[
                { label: 'Sold', value: 98, color: '#DDD6FE' },
                { label: 'Unsold', value: 60, color: '#BE95FF' },
                { label: 'Freeze', value: 76, color: '#A56EFF' },
                { label: 'Resold', value: 44, color: '#8A3FFC' },
                { label: 'Cancelled', value: 56, color: '#6929C4' },
              ].map((item, index) => (
                <div key={index} className="flex items-start self-stretch h-8">
                  <div className="w-20 h-[30px] flex justify-center items-center text-gray-600 text-xs text-center font-normal leading-[14px] tracking-[0.24px]">
                    {item.label}
                  </div>
                  <div className="relative flex-1">
                    <div className="w-full h-8 bg-gray-200 rounded-r-lg"></div>
                    <div
                      className="absolute top-0 left-0 flex items-center justify-center h-8 rounded-r-lg"
                      style={{
                        backgroundColor: item.color,
                        width: `${Math.min(item.value, 80)}%`,
                      }}
                    >
                      <span className="text-base font-semibold text-white">
                        {item.value}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee Status */}
          <div className="w-[559px] h-[300px] p-6 flex flex-col gap-6 rounded-2xl border border-white bg-white/50 backdrop-blur-md">
            <div className="flex flex-col self-stretch gap-1">
              <div className="text-sm font-normal text-gray-600 uppercase">
                Guarantee Status
              </div>
              <div className="text-gray-900 text-[32px] font-normal">14679</div>
            </div>
            <div className="w-[510px] h-[166px] relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 w-[73px] h-[166px] flex flex-col justify-between">
                <div className="text-gray-600 text-[11px] text-right leading-[13px]">
                  40 Cr INR
                </div>
                <div className="text-gray-600 text-[11px] text-right leading-[13px]">
                  30 Cr INR
                </div>
                <div className="text-gray-600 text-[11px] text-right leading-[13px]">
                  20 Cr INR
                </div>
                <div className="text-gray-600 text-[11px] text-right leading-[13px]">
                  10 Cr INR
                </div>
                <div className="text-gray-600 text-[11px] text-right leading-[13px]">
                  0 Cr INR
                </div>
              </div>

              {/* Grid lines */}
              <div className="absolute left-[101px] top-[4px] w-[366px] h-[120px] flex flex-col justify-between">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full h-px bg-gray-300"></div>
                ))}
              </div>

              {/* Chart bars */}
               <div className="absolute left-[140px] bottom-[140px] w-[284px] h-[500px] flex items-end gap-6">
                {[
                  { value: 35, color: '#A56EFF' },
                  { value: 28, color: '#8A3FFC' },
                  { value: 12, color: '#7008E7' },
                ].map((item, index) => (
                  <div key={index} className="relative w-20">
                    <div className="w-20 h-[120px] bg-gray-200 rounded-t-lg absolute top-[-9px]"></div>
                    <div
                      className="absolute flex items-center justify-center w-20 text-base font-semibold text-white rounded-t-lg"
                      style={{
                        backgroundColor: item.color,
                        height: `${(item.value / 40) * 111}px`,
                        top: `${9 + 111 - (item.value / 40) * 111}px`,
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div> 

              {/* X-axis labels */}
              <div className="absolute left-[101px] top-35 w-[368px] h-6 flex justify-center items-center gap-[27px]">
                <div className="w-20 text-gray-600 text-xs text-center font-normal leading-[14px] tracking-[0.24px]">
                  Advanced
                  <br />
                  Guarantee
                </div>
                <div className="w-20 text-gray-600 text-xs text-center font-normal leading-[14px] tracking-[0.24px]">
                  Retention
                  <br />
                  Guarantee
                </div>
                <div className="w-20 text-gray-600 text-xs text-center font-normal leading-[14px] tracking-[0.24px]">
                  Performance
                  <br />
                  Guarantee
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="flex gap-4">
          {/* Total Developers */}
          <div className="w-[368px] h-[256px] p-6 flex flex-col gap-10 rounded-2xl border border-white bg-white/50 backdrop-blur-md">
            <div className="flex flex-col self-stretch gap-1">
              <div className="text-sm font-normal text-gray-600 uppercase">
                Total Developers
              </div>
              <div className="text-gray-900 text-[32px] font-normal">12048</div>
            </div>
            
            <div className="w-[325px] h-[109px] flex flex-col justify-end gap-1">
              <div className="h-[62px] flex items-center gap-4">
                <div className="w-[63px] flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#BE95FF]"></div>
                  <span className="w-[49px] text-gray-600 text-xs text-center font-normal leading-[14px] tracking-[0.24px]">
                    Rejected
                  </span>
                </div>
                <div className="w-[75px] flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8A3FFC]"></div>
                  <span className="text-gray-600 text-xs text-center font-normal leading-[14px] tracking-[0.24px]">
                    Incomplete
                  </span>
                </div>
                <div className="w-[67px] flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8A3FFC]"></div>
                  <span className="text-gray-600 text-xs text-center font-normal leading-[14px] tracking-[0.24px]">
                    In Review
                  </span>
                </div>
                <div className="w-[69px] flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#6929C4]"></div>
                  <span className="text-gray-600 text-xs text-center font-normal leading-[14px] tracking-[0.24px]">
                    Approved
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-12 h-12 p-2 bg-[#BE95FF] rounded-lg flex items-center text-white text-base font-semibold leading-[29px]">
                  374
                </div>
                <div className="w-[81px] h-12 p-2 bg-[#A56EFF] rounded-lg flex items-center text-white text-base font-semibold leading-[29px]">
                  81
                </div>
                <div className="w-[111px] h-12 p-2 bg-[#8A3FFC] rounded-lg flex items-center text-white text-base font-semibold leading-[29px]">
                  432
                </div>
                <div className="w-[75px] h-12 p-2 bg-[#6929C4] rounded-lg flex items-center text-white text-base font-semibold leading-[29px]">
                  242
                </div>
              </div>
            </div>
          </div>

          {/* Total Projects */}
          <div className="w-[368px] h-[256px] p-6 flex flex-col gap-12 rounded-2xl border border-white bg-white/50 backdrop-blur-md">
            <div className="flex flex-col self-stretch gap-1">
              <div className="text-sm font-normal text-gray-600 uppercase">
                Total Projects
              </div>
              <div className="text-gray-900 text-[32px] font-normal">13824</div>
            </div>
            <div className="w-[325px] h-[109px] flex gap-6">
              <div className="flex items-end gap-1">
                <div className="w-[100px] h-[108px] p-2 bg-[#A56EFF] rounded-lg flex items-start">
                  <div className="w-10 text-white text-base font-semibold leading-[29px]">
                    162
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <div className="w-[100px] h-[65px] p-2 bg-[#8A3FFC] rounded-lg flex items-start">
                    <div className="w-10 text-white text-base font-semibold leading-[29px]">
                      328
                    </div>
                  </div>
                  <div className="w-[100px] h-[39px] p-2 bg-[#7008E7] rounded-lg flex items-start">
                    <div className="w-10 text-white text-base font-semibold leading-[29px]">
                      624
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[90px] h-[108px] flex flex-col justify-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C4B4FF]"></div>
                  <span className="text-gray-600 text-xs tracking-[0.24px]">
                    In Review
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#7F22FE]"></div>
                  <span className="text-gray-600 text-xs tracking-[0.24px]">
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#7008E7]"></div>
                  <span className="text-gray-600 text-xs tracking-[0.24px]">
                    Approved
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Activities */}
          <div className="w-[368px] h-[256px] p-6 flex flex-col gap-12 rounded-2xl border border-white bg-white/50 backdrop-blur-md">
            <div className="flex flex-col self-stretch gap-1">
              <div className="text-sm font-normal text-gray-600 uppercase">
                Total Activities
              </div>
              <div className="text-gray-900 text-[32px] font-normal">824</div>
            </div>
            <div className="w-[325px] h-[109px] flex flex-col justify-end gap-1">
              <div className="h-[62px] flex items-center gap-4">
                <div className="w-[63px] flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#BE95FF]"></div>
                  <span className="w-[49px] text-gray-600 text-xs text-center font-normal leading-[14px] tracking-[0.24px]">
                    Rejected
                  </span>
                </div>
                <div className="w-[75px] flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8A3FFC]"></div>
                  <span className="text-gray-600 text-xs text-center font-normal leading-[14px] tracking-[0.24px]">
                    Incomplete
                  </span>
                </div>
                <div className="w-[67px] flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8A3FFC]"></div>
                  <span className="text-gray-600 text-xs text-center font-normal leading-[14px] tracking-[0.24px]">
                    In Review
                  </span>
                </div>
                <div className="w-[69px] flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#6929C4]"></div>
                  <span className="text-gray-600 text-xs text-center font-normal leading-[14px] tracking-[0.24px]">
                    Approved
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-12 h-12 p-2 bg-[#BE95FF] rounded-lg flex items-center text-white text-base font-semibold leading-[29px]">
                  62
                </div>
                <div className="w-[81px] h-12 p-2 bg-[#A56EFF] rounded-lg flex items-center text-white text-base font-semibold leading-[29px]">
                  281
                </div>
                <div className="w-[111px] h-12 p-2 bg-[#8A3FFC] rounded-lg flex items-center text-white text-base font-semibold leading-[29px]">
                  743
                </div>
                <div className="w-[75px] h-12 p-2 bg-[#6929C4] rounded-lg flex items-center text-white text-base font-semibold leading-[29px]">
                  564
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
