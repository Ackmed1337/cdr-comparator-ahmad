import React from 'react'
import {translateFeatureType} from '../../../utils/dict'
import Duration from '../Duration'

const Feature = (props) => {
  const {featureType, additionalValue, additionalInfo, additionalInfoUri} = props.feature
  return (
    <li className="bg-slate-800/30 p-2 rounded border-l-2 border-cyan-500 mb-1">
      <div className="text-sm font-semibold text-slate-300">
        {translateFeatureType(featureType)}
        {featureType === 'OTHER' && <span> - {additionalInfo}</span>}
        {
          ( featureType === 'CARD_ACCESS' ||
            featureType === 'FREE_TXNS' ||
            featureType === 'LOYALTY_PROGRAM' ||
            featureType === 'INSURANCE' ||
            featureType === 'DIGITAL_WALLET' ||
            featureType === 'COMPLEMENTARY_PRODUCT_DISCOUNTS' ||
            featureType === 'NOTIFICATIONS' ||
            featureType === 'BONUS_REWARDS' ) &&
          <span> - {additionalValue}</span>
        }
        {
          ( featureType === 'ADDITIONAL_CARDS' ||
            featureType === 'UNLIMITED_TXNS' ||
            featureType === 'OFFSET' ||
            featureType === 'OVERDRAFT' ||
            featureType === 'REDRAW' ||
            featureType === 'BALANCE_TRANSFERS' ||
            featureType === 'DIGITAL_BANKING' ||
            featureType === 'NPP_PAYID' ||
            featureType === 'NPP_ENABLED' ||
            featureType === 'DONATE_INTEREST' ||
            featureType === 'BILL_PAYMENT') && !!additionalValue &&
          <span> - {additionalValue}</span>
        }
        {
          (featureType === 'INTEREST_FREE' || featureType === 'INTEREST_FREE_TRANSFERS') &&
          <span> - <Duration prefix="every" value={additionalValue}/></span>
        }
        {
          ( featureType === 'CASHBACK_OFFER' ||
            featureType === 'FREE_TXNS_ALLOWANCE') &&
          <span> - ${additionalValue}</span>
        }
      </div>
      {
        ( featureType === 'ADDITIONAL_CARDS' ||
          featureType === 'UNLIMITED_TXNS' ||
          featureType === 'OFFSET' ||
          featureType === 'OVERDRAFT' ||
          featureType === 'REDRAW' ||
          featureType === 'BALANCE_TRANSFERS' ||
          featureType === 'DIGITAL_BANKING' ||
          featureType === 'NPP_PAYID' ||
          featureType === 'NPP_ENABLED' ||
          featureType === 'DONATE_INTEREST' ||
          featureType === 'BILL_PAYMENT') && !!additionalInfo &&
        <div className="text-xs text-slate-400">{additionalInfo}</div>
      }
      {!!additionalInfoUri && <div><a href={additionalInfoUri} target='_blank' rel='noopener noreferrer' className="text-xs text-cyan-400 hover:text-cyan-300">More info</a></div>}
    </li>
  )
}

export default React.memo(Feature)
