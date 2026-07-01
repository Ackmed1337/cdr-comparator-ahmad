import React from 'react'

const EnergyPlanFee = ({fee}) => {
  const {type, term, amount, rate, description} = fee
  return (
    <li className="bg-slate-800/30 p-2 rounded border-l-2 border-fuchsia-500 mb-1">
      <div className="text-sm text-slate-200 mb-2">Type: <span className="text-slate-100">{type}</span></div>
      <div className="text-sm text-slate-200 mb-2">Term: <span className="text-slate-100">{term}</span></div>
      {amount && (
        <div className="text-sm text-slate-200 mb-2">Amount: <span className="text-slate-100">${amount}</span></div>
      )}
      {rate && (
        <div className="text-sm text-slate-200 mb-2">Rate: <span className="text-slate-100">{(rate * 100).toFixed(2)}%</span></div>
      )}
      {description && (
        <div className="text-sm text-slate-200">Description: <span className="text-slate-100">{description}</span></div>
      )}
    </li>
  )
}

export default EnergyPlanFee
