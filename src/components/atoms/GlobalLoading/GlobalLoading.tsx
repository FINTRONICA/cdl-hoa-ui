import React from 'react'

interface GlobalLoadingProps {
  className?: string
  fullHeight?: boolean
}

export const GlobalLoading: React.FC<GlobalLoadingProps> = ({
  className = '',
  fullHeight = false
}) => {
  
  const displayMessage = 'Loading...'

  const containerClasses = fullHeight 
    ? 'flex items-center justify-center h-full w-full'
    : 'flex items-center justify-center'

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <div className="w-12 h-12 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 text-sm font-medium">
          {displayMessage}
        </p>
      </div>
    </div>
  )
}
