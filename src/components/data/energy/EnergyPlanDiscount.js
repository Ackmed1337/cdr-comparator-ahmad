import React from 'react'
import DateTime from '../DateTime'

const EnergyPlanDiscount = ({discount}) => {
  const {displayName, description, type, category, endDate, methodUType, percentOfBill, percentOfUse, fixedAmount, percentOverThreshold} = discount
  return (
    <li className="bg-slate-800/30 p-2 rounded border-l-2 border-violet-500 mb-1">
      <div className="text-sm text-slate-200 mb-2">Display Name: <span className="text-slate-100 font-medium">{displayName}</span></div>
      {description && (
        <div className="text-sm text-slate-200 mb-2">Description: <span className="text-slate-100">{description}</span></div>
      )}
      <div className="text-sm text-slate-200 mb-2">Type: <span className="text-slate-100">{type}</span></div>
      {category && (
        <div className="text-sm text-slate-200 mb-2">Category: <span className="text-slate-100">{category}</span></div>
      )}
      {endDate && <div className="text-sm text-slate-200 mb-2">End Date: <DateTime rfc3339={endDate} /></div>}
      <div className="text-sm text-slate-200 mb-2">Method: <span className="text-slate-100">{methodUType}</span></div>
      {percentOfBill && (
        <div className="text-sm text-slate-200 mb-2">Percent Of Bill: <span className="text-slate-100">{(percentOfBill.rate * 100).toFixed(2)}%</span></div>
      )}
      {percentOfUse && (
        <div className="text-sm text-slate-200 mb-2">Percent Of Use: <span className="text-slate-100">{(percentOfUse.rate * 100).toFixed(2)}%</span></div>
      )}
      {fixedAmount && (
        <div className="text-sm text-slate-200 mb-2">Fixed Amount: <span className="text-slate-100">${fixedAmount.amount}</span></div>
      )}
      {percentOverThreshold && (
        <div className="text-sm text-slate-200">Percent Over Threshold (${percentOverThreshold.usageAmount}): <span className="text-slate-100">{(percentOverThreshold.rate * 100).toFixed(2)}%</span></div>
      )}
    </li>
  )
}

export default EnergyPlanDiscount
