import React from 'react'
import { useRouter } from 'next/navigation'
import { UserProfile } from '../../molecules/UserProfile'
import { useAuthStore } from '@/store/authStore'
import { useLogout } from '@/hooks/useAuthQuery'

interface HeaderProps {
  title: string
  subtitle?: string
  showActions?: boolean
  showFilters?: boolean
  className?: string
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
  className = '',
}) => {
  const router = useRouter()
  const { user } = useAuthStore()
  const logoutMutation = useLogout()

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      router.push('/login')
    } catch (error) {
      // Even if logout fails, redirect to login
      router.push('/login')
    }
  }

  // Fallback user data if user is not available
  const displayName = user?.name || 'User'
  const displayEmail = user?.email

  return (
    <header className={`bg-white/0 px-5 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col justify-center">
          <h1 className="text-[32px] font-sans text-[#1E2939] font-semibold leading-normal">
            {title}
          </h1>
          <p className="mt-1 text-base text-gray-600">{subtitle}</p>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Right side - Controls */}
        <div className="flex items-center gap-6">
          <div className="inline-flex items-center justify-center min-h-0 px-0.5 text-xs font-semibold text-white bg-blue-500 rounded-md shadow-sm aspect-square min-w-2">
            HOA
          </div>
          <UserProfile
            name={displayName}
            {...(displayEmail && { email: displayEmail })}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  )
}
