import React from 'react'
import Rate from './Rate'
import SingleRate from './SingleRate'
import TimeOfUseRate from './TimeOfUseRate'

const EnergyPlanTariffPeriod = ({tariffPeriod}) => {
  const {type, displayName, startDate, endDate, dailySupplyChargeType, dailySupplyCharge, bandedDailySupplyCharges, timeZone, rateBlockUType, singleRate, timeOfUseRates, demandCharges} = tariffPeriod
  return (
    <li className="bg-slate-800/30 p-2 rounded border-l-2 border-indigo-500 mb-1">
      {type && (
        <div className="text-sm text-slate-200 mb-2">Type: <span className="text-slate-100">{type}</span></div>
      )}
      <div className="text-sm text-slate-200 mb-2">Display Name: <span className="text-slate-100 font-medium">{displayName}</span></div>
      <div className="text-sm text-slate-200 mb-2">Start Date: <span className="text-slate-100">{startDate}</span></div>
      <div className="text-sm text-slate-200 mb-2">End Date: <span className="text-slate-100">{endDate}</span></div>
      {dailySupplyChargeType && (
        <div className="text-sm text-slate-200 mb-2">Daily Supply Charge Type: <span className="text-slate-100">{dailySupplyChargeType}</span></div>
      )}
      {dailySupplyCharge && (
        <div className="text-sm text-slate-200 mb-2">Daily Supply Charge: <span className="text-slate-100">${dailySupplyCharge}</span></div>
      )}
      {bandedDailySupplyCharges && (
        <>
          <div className="text-sm text-slate-200 italic mb-1">Banded Daily Supply Charges:</div>
          <ul className="mt-0 mb-2 pl-5">
            {bandedDailySupplyCharges.map((dailySupplyCharge, index) => <Rate key={index} rate={dailySupplyCharge} defaultUnit="DAYS" />)}
          </ul>
        </>
      )}
      {timeZone && (
        <div className="text-sm text-slate-200 mb-2">Time Zone: <span className="text-slate-100">{timeZone}</span></div>
      )}
      <div className="text-sm text-slate-200 mb-2">Rate Block Type: <span className="text-slate-100">{rateBlockUType}</span></div>
      {singleRate && (
        <>
          <div className="text-sm text-slate-200 italic mb-1">Single Rate:</div>
          <div className="pl-2 mb-2"><SingleRate singleRate={singleRate} /></div>
        </>
      )}
      {timeOfUseRates && (
        <>
          <div className="text-sm text-slate-200 italic mb-1">Time Of Use Rates:</div>
          <ul className="mt-0 mb-2 pl-5">
            {timeOfUseRates.map((timeOfUseRate, index) => <TimeOfUseRate timeOfUseRate={timeOfUseRate} key={index} />)}
          </ul>
        </>
      )}
      {demandCharges && (
        <>
          <div className="text-sm text-slate-200 italic mb-1">Demand Charges:</div>
          <ul className="mt-0 mb-0 pl-5">
            {demandCharges.map(({displayName, description, amount, measureUnit, startTime, endTime, days, minDemand, maxDemand, measurementPeriod, chargePeriod}, index) => (
            <li key={index} className="bg-slate-700/30 p-1 rounded mb-1">
              <div className="text-xs text-slate-200">Display Name: <span className="text-slate-100">{displayName}</span></div>
              {description && (
                <div className="text-xs text-slate-200">Description: <span className="text-slate-100">{description}</span></div>
              )}
              <div className="text-xs text-slate-200">Amount: <span className="text-slate-100">${amount} (exclusive of GST)</span></div>
              {measureUnit && (
                <div className="text-xs text-slate-200">Measure Unit: <span className="text-slate-100">{measureUnit}</span></div>
              )}
              {startTime && (
                <div className="text-xs text-slate-200">Start Time: <span className="text-slate-100">{startTime}</span></div>
              )}
              {endTime && (
                <div className="text-xs text-slate-200">End Time: <span className="text-slate-100">{endTime}</span></div>
              )}
              {days && (
                <div className="text-xs text-slate-200">Days: <span className="text-slate-100">{days.join(', ')}</span></div>
              )}
              <div className="text-xs text-slate-200">Min Demand: <span className="text-slate-100">{minDemand || '0.00'}kW</span></div>
              {maxDemand && (
                <div className="text-xs text-slate-200">Max Demand: <span className="text-slate-100">{maxDemand}kW</span></div>
              )}
              <div className="text-xs text-slate-200">Measurement Period: <span className="text-slate-100">{measurementPeriod}</span></div>
              <div className="text-xs text-slate-200">Charge Period: <span className="text-slate-100">{chargePeriod}</span></div>
            </li>
            ))}
          </ul>
        </>
      )}
    </li>
  )
}

export default EnergyPlanTariffPeriod
