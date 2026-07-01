import React from 'react'

export const Badge = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-blue-900/30 text-blue-300 border-blue-800/50',
    success: 'bg-green-900/30 text-green-300 border-green-800/50',
    danger: 'bg-red-900/30 text-red-300 border-red-800/50',
    warning: 'bg-amber-900/30 text-amber-300 border-amber-800/50',
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
