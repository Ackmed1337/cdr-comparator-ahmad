import React from 'react'
import DiscountEligibility from './DiscountEligibility'
import {translateDiscountType} from '../../../utils/dict'
import Duration from '../Duration'
import ecomp from '../../../utils/enum-comp'

const FeeDiscount = (props) => {
  const {
    description,
    discountType,
    amount,
    balanceRate,
    transactionRate,
    accruedRate,
    feeRate,
    additionalValue,
    additionalInfo,
    additionalInfoUri,
    eligibility
  } = props.discount
  return (
    <li className="bg-slate-100/30 dark:bg-slate-800/30 p-2 rounded border-l-2 border-yellow-500 mb-1">
      {!!amount && <div className="text-xs text-slate-500 dark:text-slate-400">${amount}</div>}
      {!!balanceRate && <div className="text-xs text-slate-500 dark:text-slate-400">Balance rate: {(balanceRate * 100).toFixed(2)}%</div>}
      {!!transactionRate && <div className="text-xs text-slate-500 dark:text-slate-400">Transaction rate: {(transactionRate * 100).toFixed(2)}%</div>}
      {!!accruedRate && <div className="text-xs text-slate-500 dark:text-slate-400">Accrued rate: {(accruedRate * 100).toFixed(2)}%</div>}
      {!!feeRate && <div className="text-xs text-slate-500 dark:text-slate-400">Fee rate: {(feeRate * 100).toFixed(2)}%</div>}
      <div className="text-xs text-slate-500 dark:text-slate-400">
        Discount Type - {translateDiscountType(discountType)}
        {
          (discountType === 'BALANCE' ||
            discountType === 'DEPOSITS' ||
            discountType === 'PAYMENTS') &&
          <span> - ${additionalValue}</span>
        }
        {
          discountType === 'FEE_CAP' &&
          <span> - <Duration prefix="every" value={additionalValue}/></span>
        }
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{description}</div>
      {discountType === 'ELIGIBILITY_ONLY' && additionalValue && <div className="text-xs text-slate-500 dark:text-slate-400">{additionalValue}</div>}
      {!!additionalInfo && <div className="text-xs text-slate-500 dark:text-slate-400">{additionalInfo}</div>}
      {!!additionalInfoUri && <div className="text-xs text-slate-500 dark:text-slate-400"><a href={additionalInfoUri} target='_blank' rel='noopener noreferrer'>More info</a></div>}
      {
        !!eligibility && eligibility.length > 0 &&
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 italic">Discount Eligibilities</div>
          <ul className="pl-5">
            {[...eligibility].sort((a, b)=>ecomp(a.discountEligibilityType, b.discountEligibilityType)).map(
              (discountEligibility, index) => <DiscountEligibility key={index} eligibility={discountEligibility}/>)}
          </ul>
        </div>
      }
    </li>
  )
}

export default FeeDiscount
