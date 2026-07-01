import React from 'react'
import FeeDiscount from './FeeDiscount'
import Duration from '../Duration'
import {translateFeeType} from '../../../utils/dict'
import ecomp from '../../../utils/enum-comp'
import {isDuration} from '../../../utils/datetime'

const Fee = (props) => {
  const {
    name,
    feeType,
    amount,
    balanceRate,
    transactionRate,
    accruedRate,
    accrualFrequency,
    currency,
    additionalValue,
    additionalInfo,
    additionalInfoUri,
    discounts
  } = props.fee
  return (
    <li className="bg-slate-100/30 dark:bg-slate-800/30 p-2 rounded border-l-2 border-amber-500 mb-1">
      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {name}
        {!!amount && <span className="text-sm font-bold text-amber-600 dark:text-amber-400"> - ${amount}</span>}
        {!!balanceRate && <span> - {(balanceRate * 100).toFixed(2)}%</span>}
        {!!transactionRate && <span> - {(transactionRate * 100).toFixed(2)}%</span>}
        {!!accruedRate && <span> - {(accruedRate * 100).toFixed(2)}%</span>}
        {!!accrualFrequency && <span> - <Duration prefix="every" value={accrualFrequency}/></span>}
      </div>
      <div className="text-xs text-slate-500">
        Fee Type - {translateFeeType(feeType)}
        {feeType === 'PERIODIC' && <span> - <Duration prefix="every" value={additionalValue}/></span>}
      </div>
      {!!currency && <div className="text-xs text-slate-500">Currency - {currency}</div>}
      {
        feeType !== 'PERIODIC' && !!additionalValue &&
        <div className="text-xs text-slate-500">
          {isDuration(additionalValue) ? <><Duration prefix="every" value={additionalValue}/></> : additionalValue}
        </div>}
      {!!additionalInfo && <div className="text-xs text-slate-500 dark:text-slate-400">{additionalInfo}</div>}
      {!!additionalInfoUri && <div><a href={additionalInfoUri} target='_blank' rel='noopener noreferrer' className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300">More info</a></div>}
      {
        !!discounts && discounts.length > 0 &&
          <div>
            <div className="text-xs italic text-slate-500">Discounts:</div>
            <ul className="pl-5">
              {discounts.sort((a, b)=>ecomp(a.discountType, b.discountType)).map(
                (discount, index) =><FeeDiscount key={index} discount={discount}/>)}
            </ul>
          </div>
      }
    </li>
  )
}

export default React.memo(Fee)
