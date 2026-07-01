import React from 'react'

export const Card = ({
  children,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg transition-all duration-200 ${hoverable ? 'hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-lg hover:shadow-blue-500/20' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
