import React from 'react'
import {format} from '../../utils/datetime'

const DateTime = ({rfc3339}) => {
  return (
    <div className="bg-slate-800/30 p-2 rounded border-l-2 border-gray-500 mb-1">
      <span className="text-xs font-semibold text-slate-400">Date: </span>
      <span className="text-xs text-slate-300">{format(rfc3339)}</span>
    </div>
  )
}

export default DateTime
