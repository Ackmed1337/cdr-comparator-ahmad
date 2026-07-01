import React from 'react'
import RateTier from './RateTier'
import Duration from '../Duration'
import {translateInterestPaymentDue, translateLendingRateType, translateRepaymentType, translateloanPurpose} from '../../../utils/dict'
import ecomp from '../../../utils/enum-comp'

const LendingRate = (props) => {
  const {
    lendingRateType,
    rate,
    calculationFrequency,
    applicationFrequency,
    comparisonRate,
    interestPaymentDue,
    repaymentType,
    loanPurpose,
    tiers,
    additionalValue,
    additionalInfo,
    additionalInfoUri
  } = props.lendingRate
  return (
    <li className="bg-slate-800/30 p-2 rounded border-l-2 border-red-500 mb-1">
      <div className="text-base font-bold text-red-400">{(rate * 100).toFixed(2)}%</div>
      {!!comparisonRate && <div className="text-xs text-slate-500">Comparison rate: {(comparisonRate * 100).toFixed(2)}%</div>}
      <div className="text-xs font-semibold text-slate-400">
        {translateLendingRateType(lendingRateType)}
        {
          (lendingRateType === 'FIXED' || lendingRateType === 'INTRODUCTORY') && !!additionalValue &&
          <span> - <Duration prefix="every" value={additionalValue}/></span>
        }
        {
          ( lendingRateType === 'DISCOUNT' ||
            lendingRateType === 'PENALTY' ||
            lendingRateType === 'FLOATING' ||
            lendingRateType === 'MARKET_LINKED' ||
            lendingRateType === 'BUNDLE_DISCOUNT_FIXED' ||
            lendingRateType === 'BUNDLE_DISCOUNT_VARIABLE') &&
          <span> - {additionalValue}</span>
        }
        {
          ( lendingRateType === 'VARIABLE' ||
            lendingRateType === 'PURCHASE' ) && !!additionalValue &&
          <span> - {additionalValue}</span>
        }
      </div>
      {!!calculationFrequency && <div className="text-xs text-slate-500">Calculated <Duration prefix="every" value={calculationFrequency}/></div>}
      {!!applicationFrequency && <div className="text-xs text-slate-500">Applied <Duration prefix="every" value={applicationFrequency}/></div>}
      {!!interestPaymentDue && <div className="text-xs text-slate-500">Interest Payment {translateInterestPaymentDue(interestPaymentDue)}</div>}
      {!!repaymentType && <div className="text-xs text-slate-500">Repayment Type {translateRepaymentType(repaymentType)}</div>}
      {!!loanPurpose && <div className="text-xs text-slate-500">Loan Purpose {translateloanPurpose(loanPurpose)}</div>}
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
      {!!additionalInfoUri && <div><a href={additionalInfoUri} target='_blank' rel='noopener noreferrer' className="text-xs text-red-400 hover:text-red-300">More info</a></div>}
    </li>
  )
}

export default React.memo(LendingRate)
