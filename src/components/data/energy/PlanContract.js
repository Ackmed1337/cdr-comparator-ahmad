import React from 'react'
import IntrinsicGreenPower from './IntrinsicGreenPower'
import ControlledLoad from './ControlledLoad'
import EnergyPlanIncentive from './EnergyPlanIncentive'
import EnergyPlanDiscount from './EnergyPlanDiscount'
import EnergyPlanGreenPowerCharge from './EnergyPlanGreenPowerCharge'
import EnergyPlanEligibility from './EnergyPlanEligibility'
import EnergyPlanFee from './EnergyPlanFee'
import EnergyPlanSolarFeedInTariff from './EnergyPlanSolarFeedInTariff'
import EnergyPlanTariffPeriod from './EnergyPlanTariffPeriod'
import Duration from '../Duration'

const PlanContract = ({contract}) => {
  const {additionalFeeInformation, pricingModel, timeZone, isFixed, variation, onExpiryDescription, paymentOption,
    intrinsicGreenPower, controlledLoad, incentives, discounts, greenPowerCharges, eligibility, fees, solarFeedInTariff,
    tariffPeriod, termType, benefitPeriod, terms, meterTypes, coolingOffDays, billFrequency} = contract
  return (
    <div className="bg-slate-800/30 p-2 rounded border-l-2 border-amber-500 mb-1">
      {additionalFeeInformation && (
        <div className="text-sm text-slate-200 mb-2">Additional Fee Information: <span className="text-slate-100">{additionalFeeInformation}</span></div>
      )}
      <div className="text-sm text-slate-200 mb-2">Pricing Model: <span className="text-slate-100">{pricingModel}</span></div>
      <div className="text-sm text-slate-200 mb-2">Time Zone: <span className="text-slate-100">{timeZone || 'AEST'}</span></div>
      <div className="text-sm text-slate-200 mb-2">Is Fixed: <span className="text-slate-100">{isFixed + ''}</span></div>
      {variation && (
        <div className="text-sm text-slate-200 mb-2">Variation: <span className="text-slate-100">{variation}</span></div>
      )}
      {onExpiryDescription && (
        <div className="text-sm text-slate-200 mb-2">On Expiry Description: <span className="text-slate-100">{onExpiryDescription}</span></div>
      )}
      <div className="text-sm text-slate-200 mb-2">Payment Option: <span className="text-slate-100">{paymentOption.join(', ')}</span></div>
      {intrinsicGreenPower && (
        <>
          <div className="text-sm text-slate-200 italic mb-1">Intrinsic Green Power:</div>
          <div className="pl-2 mb-2">
            <IntrinsicGreenPower intrinsicGreenPower={intrinsicGreenPower} />
          </div>
        </>
      )}
      {controlledLoad && (
        <>
          <div className="text-sm text-slate-200 italic mb-1">Controlled Load:</div>
          <ul className="mt-0 mb-2 pl-5">
            {controlledLoad.map((cl, index) => <ControlledLoad controlledLoad={cl} key={index} />)}
          </ul>
        </>
      )}
      {incentives && (
        <>
          <div className="text-sm text-slate-200 italic mb-1">Incentives:</div>
          <ul className="mt-0 mb-2 pl-5">
            {incentives.map((incentive, index) => <EnergyPlanIncentive incentive={incentive} key={index} />)}
          </ul>
        </>
      )}
      {discounts && (
        <>
          <div className="text-sm text-slate-200 italic mb-1">Discounts:</div>
          <ul className="mt-0 mb-2 pl-5">
            {discounts.map((discount, index) => <EnergyPlanDiscount discount={discount} key={index} />)}
          </ul>
        </>
      )}
      {greenPowerCharges && (
        <>
          <div className="text-sm text-slate-200 italic mb-1">Green Power Charges:</div>
          <ul className="mt-0 mb-2 pl-5">
            {greenPowerCharges.map((greenPowerCharge, index) => <EnergyPlanGreenPowerCharge greenPowerCharge={greenPowerCharge} key={index} />)}
          </ul>
        </>
      )}
      {eligibility && (
        <>
          <div className="text-sm text-slate-200 italic mb-1">Eligibility:</div>
          <ul className="mt-0 mb-2 pl-5">
            {eligibility.map((el, index) => <EnergyPlanEligibility eligibility={el} key={index} />)}
          </ul>
        </>
      )}
      {fees && (
        <>
          <div className="text-sm text-slate-200 italic mb-1">Fees:</div>
          <ul className="mt-0 mb-2 pl-5">
            {fees.map((fee, index) => <EnergyPlanFee fee={fee} key={index} />)}
          </ul>
        </>
      )}
      {solarFeedInTariff && (
        <>
          <div className="text-sm text-slate-200 italic mb-1">Solar Feed-in Tariff:</div>
          <ul className="mt-0 mb-2 pl-5">
            {solarFeedInTariff.map((tariff, index) => <EnergyPlanSolarFeedInTariff solarFeedInTariff={tariff} key={index} />)}
          </ul>
        </>
      )}
      <>
        <div className="text-sm text-slate-200 italic mb-1">Tariff Period:</div>
        <ul className="mt-0 mb-2 pl-5">
          {tariffPeriod.map((period, index) => <EnergyPlanTariffPeriod tariffPeriod={period} key={index} />)}
        </ul>
      </>
      {termType && (
        <div className="text-sm text-slate-200 mb-2">Term Type: <span className="text-slate-100">{termType}</span></div>
      )}
      {benefitPeriod && (
        <div className="text-sm text-slate-200 mb-2">Benefit Period: <span className="text-slate-100">{benefitPeriod}</span></div>
      )}
      {terms && (
        <div className="text-sm text-slate-200 mb-2">Terms: <span className="text-slate-100">{terms}</span></div>
      )}
      {meterTypes && (
        <div className="text-sm text-slate-200 mb-2">Meter Types: <span className="text-slate-100">{meterTypes.join(', ')}</span></div>
      )}
      {coolingOffDays && (
        <div className="text-sm text-slate-200 mb-2">Cooling Off: <span className="text-slate-100">{coolingOffDays} days</span></div>
      )}
      <div className="text-sm text-slate-200">
        Bill Frequency:
        <span className="text-slate-100">
          {billFrequency.map((billingSchedule, index) => (<>{!!index && <>, </>}<Duration value={billingSchedule} /></>))}
        </span>
      </div>
    </div>
  )
}

export default PlanContract
