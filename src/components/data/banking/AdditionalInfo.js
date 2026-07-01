import React from 'react'
import AdditionalInformationUris from './AdditionalInformationUris'

const AdditionalInfo = (props) => {
  const {tableCell} = props
  const {overviewUri, termsUri, eligibilityUri, feesAndPricingUri, bundleUri,
    additionalOverviewUris, additionalTermsUris, additionalEligibilityUris, additionalFeesAndPricingUris, additionalBundleUris} = props.additionalInfo
  return (
    <ul className={tableCell ? "" : "bg-slate-100/30 dark:bg-slate-800/30 p-2 rounded border-l-2 border-blue-400 mb-1"}>
      {!!overviewUri && <li><a href={overviewUri} target='_blank' rel='noopener noreferrer' className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">Overview</a></li>}
      {!!termsUri && <li><a href={termsUri} target='_blank' rel='noopener noreferrer' className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">Terms</a></li>}
      {!!eligibilityUri && <li><a href={eligibilityUri} target='_blank' rel='noopener noreferrer' className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">Eligibility</a></li>}
      {!!feesAndPricingUri && <li><a href={feesAndPricingUri} target='_blank' rel='noopener noreferrer' className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">Fee and Pricing</a></li>}
      {!!bundleUri && <li><a href={bundleUri} target='_blank' rel='noopener noreferrer' className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">Bundle</a></li>}
      {!!additionalOverviewUris && <AdditionalInformationUris title="Additional Overview URIs" uris={additionalOverviewUris} />}
      {!!additionalTermsUris && <AdditionalInformationUris title="Additional Terms and Conditions URIs" uris={additionalTermsUris} />}
      {!!additionalEligibilityUris && <AdditionalInformationUris title="Additional Eligibility Rules and Criteria URIs" uris={additionalEligibilityUris} />}
      {!!additionalFeesAndPricingUris && <AdditionalInformationUris title="Additional Fees, Pricing, Discounts, Exemptions and Bonuses URIs" uris={additionalFeesAndPricingUris} />}
      {!!additionalBundleUris && <AdditionalInformationUris title="Additional Bundle URIs" uris={additionalBundleUris} />}
    </ul>
  )
}

export default AdditionalInfo
