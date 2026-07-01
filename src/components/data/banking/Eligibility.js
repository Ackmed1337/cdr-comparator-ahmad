import React from 'react'
import {translateEligibilityType} from '../../../utils/dict'

const Eligibility = (props) => {
  const {eligibilityType, additionalValue, additionalInfo, additionalInfoUri} = props.eligibility
  return (
    <li className="bg-slate-100/30 dark:bg-slate-800/30 p-2 rounded border-l-2 border-teal-500 mb-1">
      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {translateEligibilityType(eligibilityType)}
        {eligibilityType === 'OTHER' && <span className="text-slate-500 dark:text-slate-400"> - {additionalInfo}</span>}
        {
          ( eligibilityType === 'MIN_AGE' ||
            eligibilityType === 'MAX_AGE' ||
            eligibilityType === 'EMPLOYMENT_STATUS' ||
            eligibilityType === 'RESIDENCY_STATUS') &&
          <span className="text-slate-500 dark:text-slate-400"> - {additionalValue}</span>
        }
        {
          ( eligibilityType === 'BUSINESS' ||
            eligibilityType === 'PENSION_RECIPIENT' ||
            eligibilityType === 'STAFF' ||
            eligibilityType === 'STUDENT' ||
            eligibilityType === 'NATURAL_PERSON') && !!additionalValue &&
          <span className="text-slate-500 dark:text-slate-400"> - {additionalValue}</span>
        }
        {
          ( eligibilityType === 'BUSINESS' ||
            eligibilityType === 'PENSION_RECIPIENT' ||
            eligibilityType === 'STAFF' ||
            eligibilityType === 'STUDENT' ||
            eligibilityType === 'NATURAL_PERSON') && !!additionalInfo &&
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{additionalInfo}</div>
        }
        {(eligibilityType === 'MIN_INCOME' || eligibilityType === 'MIN_TURNOVER') && <span className="text-slate-500 dark:text-slate-400"> - ${additionalValue}</span>}
      </div>
      {!!additionalInfoUri && <div className="mt-1"><a href={additionalInfoUri} target='_blank' rel='noopener noreferrer' className="text-xs text-teal-400 hover:text-teal-300 transition-colors">More info</a></div>}
    </li>
  )
}

export default React.memo(Eligibility)
