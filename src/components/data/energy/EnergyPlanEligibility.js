import React from 'react'

const EnergyPlanEligibility = ({eligibility}) => {
  const {type, information, description} = eligibility
  return (
    <li className="bg-slate-800/30 p-2 rounded border-l-2 border-sky-500 mb-1">
      <div className="text-sm text-slate-200 mb-2">Type: <span className="text-slate-100">{type}</span></div>
      <div className="text-sm text-slate-200 mb-2">Information: <span className="text-slate-100">{information}</span></div>
      {description && (
        <div className="text-sm text-slate-200">Description: <span className="text-slate-100">{description}</span></div>
      )}
    </li>
  )
}

export default EnergyPlanEligibility
