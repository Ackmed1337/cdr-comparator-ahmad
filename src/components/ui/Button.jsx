import React from 'react'

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-lg inline-flex items-center justify-center'

  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95',
    secondary: 'bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700',
    ghost: 'text-slate-300 hover:bg-slate-800 hover:text-slate-100',
    danger: 'bg-red-500/10 text-red-300 border border-red-800/50 hover:bg-red-500/20',
    success: 'bg-green-500/10 text-green-300 border border-green-800/50 hover:bg-green-500/20',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
