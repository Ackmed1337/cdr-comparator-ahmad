import React from 'react'
import {format} from '../../utils/datetime'

const DateTime = ({rfc3339, className = 'text-slate-700 dark:text-slate-300'}) => {
  const formatted = format(rfc3339)
  if (!formatted || formatted === 'Invalid Date') return null
  return <span className={className}>{formatted}</span>
}

export default DateTime
