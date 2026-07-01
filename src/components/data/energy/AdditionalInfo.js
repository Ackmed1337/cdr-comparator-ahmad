import React from 'react'
import ExternalLink from './ExternalLink'

const AdditionalInfo = ({tableCell, additionalInfo}) => {
  const {overviewUri, termsUri, eligibilityUri, pricingUri, bundleUri} = additionalInfo
  return (
    <ul className={!!tableCell ? "mt-0 mb-0 p-0" : "bg-slate-800/30 p-2 rounded border-l-2 border-pink-500 mb-1 mt-0 mb-0"}>
      {!!overviewUri && <li><ExternalLink link={overviewUri}>Overview</ExternalLink></li>}
      {!!termsUri && <li><ExternalLink link={termsUri}>Terms and Conditions</ExternalLink></li>}
      {!!eligibilityUri && <li><ExternalLink link={eligibilityUri}>Eligibility</ExternalLink></li>}
      {!!pricingUri && <li><ExternalLink link={pricingUri}>Pricing</ExternalLink></li>}
      {!!bundleUri && <li><ExternalLink link={bundleUri}>Bundle</ExternalLink></li>}
    </ul>
  )
}

export default AdditionalInfo
