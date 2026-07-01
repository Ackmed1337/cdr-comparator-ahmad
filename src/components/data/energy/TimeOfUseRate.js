import React from 'react'
import Rate from './Rate'
import Duration from '../Duration'

const TimeOfUseRate = ({timeOfUseRate}) => {
  const {displayName, description, dailySupplyCharge, rates, period, timeOfUse, type} = timeOfUseRate
  return (
    <li className="bg-slate-800/30 p-2 rounded border-l-2 border-blue-500 mb-1">
      <div className="text-sm text-slate-200 mb-2">Display Name: <span className="text-slate-100 font-medium">{displayName}</span></div>
      {description && (
        <div className="text-sm text-slate-200 mb-2">Description: <span className="text-slate-100">{description}</span></div>
      )}
      {dailySupplyCharge && (
        <div className="text-sm text-slate-200 mb-2">Daily Supply Charge: <span className="text-slate-100">${dailySupplyCharge} (exclusive of GST)</span></div>
      )}
      <div className="mb-2">
        <div className="text-sm text-slate-200 italic mb-1">Rates:</div>
        <ul className="mt-0 mb-0 pl-5">
          {rates.map((rate, index) => <Rate key={index} rate={rate} />)}
        </ul>
      </div>
      <div className="text-sm text-slate-200 mb-2">Period: <Duration value={period || 'P1Y'} /></div>
      <div className="text-sm text-slate-200 italic mb-1">Time Of Use:</div>
      <ul className="mt-0 mb-0 pl-5">
        {timeOfUse.map(({days, startTime, endTime, additionalInfo, additionalInfoUri}, index) => (
          <li key={index} className="text-xs text-slate-400">
            {days && (
              <div>Days: <span>{days.join(', ')}</span></div>
            )}
            {startTime && (
              <div>Start Time: <span>{startTime}</span></div>
            )}
            {endTime && (
              <div>End Time: <span>{endTime}</span></div>
            )}
            {additionalInfo && (
              <div>Additional Info: <span>{additionalInfo}</span></div>
            )}
            {additionalInfoUri && (
              <div><a href={additionalInfoUri} target='_blank' rel='noopener noreferrer' className="text-blue-400 hover:text-blue-300">More info</a></div>
            )}
          </li>
        ))}
      </ul>
      <div className="text-sm text-slate-200 mt-2">Type: <span className="text-slate-100">{type}</span></div>
    </li>
  )
}

export default TimeOfUseRate
