import React from 'react'

const Logo: React.FC = () => {
  return (
    <div className="flex items-center w-full mt-2 mb-2">
      <img
        src="/Logo.png"
        alt="logo"
        width={100}
        height={40}
        className="object-contain"
      />
    </div>
  )
}

export default Logo
