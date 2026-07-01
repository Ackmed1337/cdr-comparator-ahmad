import React from 'react'
import Rate from './Rate'
import Duration from '../Duration'

const EnergyPlanSolarFeedInTariff = ({solarFeedInTariff}) => {
  const {displayName, description, startTime, endTime, scheme, payerType, tariffUType, singleTariff, timeVaryingTariffs} = solarFeedInTariff
  return (
    <li className="bg-slate-800/30 p-2 rounded border-l-2 border-yellow-500 mb-1">
      <div className="text-sm text-slate-200 mb-2">Display Name: <span className="text-slate-100 font-medium">{displayName}</span></div>
      {description && (
        <div className="text-sm text-slate-200 mb-2">Description: <span className="text-slate-100">{description}</span></div>
      )}
      {startTime && (
        <div className="text-sm text-slate-200 mb-2">Start Time: <span className="text-slate-100">{startTime}</span></div>
      )}
      {endTime && (
        <div className="text-sm text-slate-200 mb-2">End Time: <span className="text-slate-100">{endTime}</span></div>
      )}
      <div className="text-sm text-slate-200 mb-2">Scheme: <span className="text-slate-100">{scheme}</span></div>
      <div className="text-sm text-slate-200 mb-2">Payer Type: <span className="text-slate-100">{payerType}</span></div>
      <div className="text-sm text-slate-200 mb-2">Tariff Type: <span className="text-slate-100">{tariffUType}</span></div>
      {singleTariff && (
        <div className="mb-2">
          <div className="text-sm text-slate-200 italic mb-1">Single Tariff:</div>
          <div className="text-sm text-slate-200 mb-1">Rates:</div>
            <ul className="mt-0 mb-1 pl-5">
              {singleTariff.rates.map((rate, index) => <Rate key={index} rate={rate} />)}
            </ul>
            <div className="text-sm text-slate-200">Period: <Duration value={singleTariff.period || 'P1Y'} /></div>
        </div>
      )}
      {timeVaryingTariffs && (
        <>
          <div className="text-sm text-slate-200 italic mb-1">Time Varying Tariffs:</div>
          <ul className="mt-0 mb-0 pl-5">
            {timeVaryingTariffs.map(({type, displayName, rates, period, timeVariations}, index) => (
            <li key={index} className="bg-slate-700/30 p-1 rounded mb-1">
              {type && (
                <div className="text-xs text-slate-200">Type: <span className="text-slate-100">{type}</span></div>
              )}
              <div className="text-xs text-slate-200">Display Name: <span className="text-slate-100">{displayName}</span></div>
              {rates && (
                <>
                  <div className="text-xs text-slate-200 italic mb-1">Rates:</div>
                  <ul className="mt-0 mb-1 pl-3">
                    {rates.map((rate, index) => <Rate key={index} rate={rate} />)}
                  </ul>
                </>
              )}
            <div className="text-xs text-slate-200 mb-1">Period: <Duration value={period || 'P1Y'} /></div>
              <>
                <div className="text-xs text-slate-200 italic mb-1">Time Variations:</div>
                <ul className="mt-0 mb-0 pl-3">
                  {timeVariations.map(({days, startTime, endTime}, index) => (
                  <li key={index} className="text-xs text-slate-300">
                    <div>Days: <span>{days.join(', ')}</span></div>
                    {startTime && (
                      <div>Start Time: <span>{startTime}</span></div>
                    )}
                    {endTime && (
                      <div>End Time: <span>{endTime}</span></div>
                    )}
                  </li>
                  ))}
                </ul>
              </>
            </li>
            ))}
          </ul>
        </>
      )}
    </li>
  )
}

export default EnergyPlanSolarFeedInTariff
