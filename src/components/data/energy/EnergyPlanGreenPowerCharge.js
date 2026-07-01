import React from 'react'

const EnergyPlanGreenPowerCharge = ({greenPowerCharge}) => {
  const {displayName, description, scheme, type, tiers} = greenPowerCharge
  return (
    <li className="bg-slate-800/30 p-2 rounded border-l-2 border-lime-500 mb-1">
      <div className="text-sm text-slate-200 mb-2">Display Name: <span className="text-slate-100 font-medium">{displayName}</span></div>
      {description && (
        <div className="text-sm text-slate-200 mb-2">Description: <span className="text-slate-100">{description}</span></div>
      )}
      <div className="text-sm text-slate-200 mb-2">Scheme: <span className="text-slate-100">{scheme}</span></div>
      <div className="text-sm text-slate-200 mb-2">Type: <span className="text-slate-100">{type}</span></div>
      <>
        <div className="text-sm text-slate-200 italic mb-1">Tiers:</div>
        <ul className="mt-0 mb-0 pl-5">
        {tiers.map(({percentGreen, rate, amount}, index) => (
          <li key={index} className="text-xs text-slate-300 mb-1">
            {percentGreen && (
              <div>Percent Green: <span>{(percentGreen * 100).toFixed(2)}%</span></div>
            )}
            {rate && (
              <div>Rate: <span>{(rate * 100).toFixed(2)}%</span></div>
            )}
            {amount && (
              <div>Amount: <span>${amount}</span></div>
            )}
          </li>
        ))}
        </ul>
      </>
    </li>
  )
}

export default EnergyPlanGreenPowerCharge
