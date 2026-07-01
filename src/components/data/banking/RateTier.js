import React from 'react'
import RateCondition from './RateCondition'
import RateSubTier from './RateSubTier'
import {translateRateApplicationMethod, translateUnitOfMeasure} from '../../../utils/dict'

const RateTier = (props) => {
  const {name, unitOfMeasure, minimumValue, maximumValue, rateApplicationMethod, applicabilityConditions, subTier,
    additionalInfo, additionalInfoUri} = props.tier
  return (
    <li className="bg-slate-100/30 dark:bg-slate-800/30 p-2 rounded border-l-2 border-violet-500 mb-1">
      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{name}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400">Minimum {minimumValue} {translateUnitOfMeasure(unitOfMeasure)}</div>
      {!!maximumValue && <div className="text-xs text-slate-500 dark:text-slate-400">Maximum {maximumValue} {translateUnitOfMeasure(unitOfMeasure)}</div>}
      {!!rateApplicationMethod && <div className="text-xs text-slate-500 dark:text-slate-400">Applied on {translateRateApplicationMethod(rateApplicationMethod)}</div>}
      {!!applicabilityConditions && <RateCondition rateCondition={applicabilityConditions}/>}
      {
        !!subTier &&
        <div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 italic">Sub Tier: </div>
          <div className="pl-5">
            <RateSubTier subTier={subTier}/>
          </div>
        </div>
      }
      {!!additionalInfo && <div className="text-xs text-slate-500 dark:text-slate-400">{additionalInfo}</div>}
      {!!additionalInfoUri && <div className="text-xs text-slate-500 dark:text-slate-400"><a href={additionalInfoUri} target='_blank' rel='noopener noreferrer'>More info</a></div>}
    </li>
  )
}

export default RateTier
