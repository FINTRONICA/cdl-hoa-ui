'use client'

import React from 'react'
import { Trash2, Eye } from 'lucide-react'

interface ActionDropdownProps {
  onDelete?: (() => void) | undefined
  onView?: (() => void) | undefined
  showDelete?: boolean
  showView?: boolean
  className?: string
}

export const ActionDropdown: React.FC<ActionDropdownProps> = ({
  onDelete,
  onView,
  showDelete = true,
  showView = true,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showView && onView && (
        <button
          onClick={onView}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="View"
          title="View"
        >
          <Eye className="w-4 h-4 text-gray-600 hover:text-gray-800" />
        </button>
      )}
      {showDelete && onDelete && (
        <button
          onClick={onDelete}
          className="p-1 hover:bg-red-50 rounded transition-colors"
          aria-label="Delete"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-600 hover:text-red-800" />
        </button>
      )}
    </div>
  )
} 