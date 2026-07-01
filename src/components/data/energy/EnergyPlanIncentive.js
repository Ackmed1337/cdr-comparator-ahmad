import React from 'react'

const EnergyPlanIncentive = ({incentive}) => {
  const {displayName, description, category, eligibility} = incentive
  return (
    <li className="bg-slate-800/30 p-2 rounded border-l-2 border-rose-500 mb-1">
      <div className="text-sm text-slate-200 mb-2">Display Name: <span className="text-slate-100 font-medium">{displayName}</span></div>
      <div className="text-sm text-slate-200 mb-2">Description: <span className="text-slate-100">{description}</span></div>
      <div className="text-sm text-slate-200 mb-2">Category: <span className="text-slate-100">{category}</span></div>
      {eligibility && (
        <div className="text-sm text-slate-200">Eligibility: <span className="text-slate-100">{eligibility}</span></div>
      )}
    </li>
  )
}

export default EnergyPlanIncentive
