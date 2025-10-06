import React from 'react'
import { UserProfile } from '../../molecules/UserProfile'

interface HeaderProps {
  title: string
  subtitle?: string
  showActions?: boolean
  showFilters?: boolean
  actions?: {
    label: string
    icon?: React.ComponentType<{ className?: string }>
    onClick: () => void
    variant?: 'primary' | 'secondary'
  }[]
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle = 'Description text',
}) => {
  return (
    <header className="bg-white/0 px-5 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Title and description */}
        <div className="flex flex-col justify-center">
          <h1 className="text-[32px] font-sans text-[#1E2939] font-semibold leading-normal">
            {title}
          </h1>
          <p className="text-gray-600 text-base mt-1">{subtitle}</p>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Right side - Controls */}
        <div className="flex items-center gap-6">
          <UserProfile name="Rakesh Raushan" />
        </div>
      </div>
    </header>
  )
}
