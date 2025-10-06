import React from 'react'

interface PermissionTagsProps {
  permissions: string[]
  maxVisible?: number
}

export const PermissionTags: React.FC<PermissionTagsProps> = ({
  permissions,
  maxVisible = 2,
}) => {
  const visiblePermissions = permissions.slice(0, maxVisible)
  const remainingCount = permissions.length - maxVisible

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visiblePermissions.map((permission, index) => (
        <span
          key={index}
          className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 transition-colors bg-blue-100 rounded-md cursor-pointer hover:bg-blue-200"
        >
          {permission}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md">
          +{remainingCount}
        </span>
      )}
    </div>
  )
} 