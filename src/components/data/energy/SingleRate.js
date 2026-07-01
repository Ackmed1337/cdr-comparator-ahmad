import React from 'react'
import Rate from './Rate'
import Duration from '../Duration'

const SingleRate = ({singleRate}) => {
  const {displayName, description, dailySupplyCharge, generalUnitPrice, rates, period} = singleRate
  return (
    <div className="bg-slate-800/30 p-2 rounded border-l-2 border-green-500 mb-1">
      <div className="text-sm text-slate-200 mb-2">Display Name: <span className="text-slate-100 font-medium">{displayName}</span></div>
      {description && (
        <div className="text-sm text-slate-200 mb-2">Description: <span className="text-slate-100">{description}</span></div>
      )}
      {dailySupplyCharge && (
        <div className="text-sm text-slate-200 mb-2">Daily Supply Charge: <span className="text-slate-100">${dailySupplyCharge} (exclusive of GST)</span></div>
      )}
      {generalUnitPrice && (
        <div className="text-sm text-slate-200 mb-2">General Unit Price: <span className="text-slate-100">${generalUnitPrice} (exclusive of GST)</span></div>
      )}
      <div className="text-sm text-slate-200 mb-1">Rates:</div>
      <ul className="mt-0 mb-0 pl-5">
        {rates.map((rate, index) => <Rate key={index} rate={rate} />)}
      </ul>
      <div className="text-sm text-slate-200 mt-2">Period: <Duration value={period || 'P1Y'} /></div>
    </div>
  )
}

export default SingleRate
