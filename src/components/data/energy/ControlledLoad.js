import React from 'react'
import DateTime from '../DateTime'
import SingleRate from './SingleRate'
import TimeOfUseRate from './TimeOfUseRate'

const ControlledLoad = ({controlledLoad}) => {
  const {displayName, rateBlockUType, startDate, endDate, singleRate, timeOfUseRates} = controlledLoad
  return (
    <li className="bg-slate-800/30 p-2 rounded border-l-2 border-purple-500 mb-1">
      <div className="text-sm text-slate-200 mb-2">Display Name: <span className="text-slate-100 font-medium">{displayName}</span></div>
      <div className="text-sm text-slate-200 mb-2">Rate Type: <span className="text-slate-100">{rateBlockUType}</span></div>
      {startDate && <div className="text-sm text-slate-200 mb-2">Start Date: <DateTime rfc3339={startDate} /></div>}
      {endDate && <div className="text-sm text-slate-200 mb-2">End Date: <DateTime rfc3339={endDate} /></div>}
      {singleRate && (
        <>
          <div className="text-sm text-slate-200 italic mb-1">Single Rate:</div>
          <div className="pl-2">
            <SingleRate singleRate={singleRate} />
          </div>
        </>
      )}
      {timeOfUseRates && (
        <>
          <div className="text-sm text-slate-200 italic mb-1">Time Of Use Rates:</div>
          <ul className="mt-0 mb-0 pl-5">
            {timeOfUseRates.map((timeOfUseRate, index) => <TimeOfUseRate timeOfUseRate={timeOfUseRate} key={index} />)}
          </ul>
        </>
      )}
    </li>
  )
}

export default ControlledLoad
