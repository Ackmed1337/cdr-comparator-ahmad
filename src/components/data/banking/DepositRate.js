import React from 'react'
import RateTier from './RateTier'
import Duration from '../Duration'
import {translateDepositRateType} from '../../../utils/dict'
import ecomp from '../../../utils/enum-comp'

const DepositRate = (props) => {
  const {
    rate,
    depositRateType,
    calculationFrequency,
    applicationFrequency,
    tiers,
    additionalValue,
    additionalInfo,
    additionalInfoUri
  } = props.depositRate
  return (
    <li className="bg-slate-800/30 p-2 rounded border-l-2 border-green-500 mb-1">
      <div className="text-base font-bold text-green-400">{(rate * 100).toFixed(2)}%</div>
      <div className="text-xs font-semibold text-slate-400">
        {translateDepositRateType(depositRateType)}
        {
          (depositRateType === 'FIXED' || depositRateType === 'INTRODUCTORY') && !!additionalValue &&
          <span> - <Duration prefix="every" value={additionalValue}/></span>
        }
        {
          ( depositRateType === 'BONUS' ||
            depositRateType === 'BUNDLE_BONUS' ||
            depositRateType === 'FLOATING' ||
            depositRateType === 'MARKET_LINKED') &&
          <span> - {additionalValue}</span>
        }
      </div>
      {!!calculationFrequency && <div className="text-xs text-slate-500">Calculated <Duration prefix="every" value={calculationFrequency}/></div>}
      {!!applicationFrequency && <div className="text-xs text-slate-500">Applied <Duration prefix="every" value={applicationFrequency}/></div>}
      {
        !!tiers && tiers.length > 0 &&
          <div>
            <div className="text-xs italic text-slate-500">Rate Tiers:</div>
            <ul className="pl-5">
              {tiers.sort((a, b)=>ecomp(a.name, b.name)).map((tier, index) => <RateTier key={index} tier={tier}/>)}
            </ul>
          </div>
      }
      {!!additionalInfo && <div className="text-xs text-slate-400">{additionalInfo}</div>}
      {!!additionalInfoUri && <div><a href={additionalInfoUri} target='_blank' rel='noopener noreferrer' className="text-xs text-green-400 hover:text-green-300">More info</a></div>}
    </li>
  )
}

export default React.memo(DepositRate)
