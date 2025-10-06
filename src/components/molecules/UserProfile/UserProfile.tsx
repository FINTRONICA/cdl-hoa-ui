import React from 'react'
import { Avatar } from '../../atoms/Avatar'
import { ChevronDown } from 'lucide-react'

interface UserProfileProps {
  name: string
  avatar?: string
}

export const UserProfile: React.FC<UserProfileProps> = ({
  name,
  avatar,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <span className="text-sm text-gray-900 leading-3">{name}</span>
      <div className="flex items-center gap-0">
        <Avatar {...(avatar && { src: avatar })} initials={initials} size="md" />
        <ChevronDown className="w-4 h-4 text-gray-600 -ml-1" />
      </div>
    </div>
  )
}
