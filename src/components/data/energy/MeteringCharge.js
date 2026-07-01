import React from 'react'
import Duration from '../Duration'

const MeteringCharge = ({meteringCharge}) => {
  const {displayName, description, minimumValue, maximumValue, period} = meteringCharge
  return (
    <li className="bg-slate-800/30 p-2 rounded border-l-2 border-orange-500 mb-1">
      <div className="text-sm text-slate-200 mb-2">Display Name: <span className="text-slate-100 font-medium">{displayName}</span></div>
      {description && (
        <div className="text-sm text-slate-200 mb-2">Description: <span className="text-slate-100">{description}</span></div>
      )}
      <div className="text-sm text-slate-200 mb-2">Minimum Value: <span className="text-slate-100">{minimumValue}</span></div>
      {maximumValue && (
        <div className="text-sm text-slate-200 mb-2">Maximum Value: <span className="text-slate-100">{maximumValue}</span></div>
      )}
      {period && (
        <div className="text-sm text-slate-200">Period: <Duration value={period} /></div>
      )}
    </li>
  )
}

export default MeteringCharge
