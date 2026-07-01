import React from 'react'

export const Input = ({
  label,
  error,
  size = 'md',
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-slate-800 border rounded-lg text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
        } ${sizes[size]} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  )
}

export default Input
