import React from 'react'
import {connect} from 'react-redux'
import DateTime from '../DateTime'
import AdditionalInfo from './AdditionalInfo'
import {deselectPlan, selectPlan} from '../../../store/energy/selection'
import Type from './Type'
import FuelType from './FuelType'
import CustomerType from './CustomerType'
import ExternalLink from './ExternalLink'
import Geography from './Geography'
import PlanContract from './PlanContract'
import MeteringCharge from './MeteringCharge'

const Plan = (props) => {
  const {plan, dataSourceIndex, selectedPlans} = props
  const [expanded, setExpanded] = React.useState(false)
  const selected = selectedPlans.some(selection => (selection.dataSourceIdx === dataSourceIndex && selection.plan.planId === plan.planId))
  const handleChange = event => event.target.checked ? props.selectPlan(dataSourceIndex, plan) : props.deselectPlan(dataSourceIndex, plan)
  const blob = new Blob([JSON.stringify(plan, null, 2)], {type : 'application/json'})

  return (
    <div className="flex items-start gap-4 mb-4 p-4 bg-slate-800 border-l-4 border-blue-500 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
      {/* Modern Toggle Checkbox */}
      <div className="flex-shrink-0 mt-1">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selected}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
        </label>
      </div>

      {/* Accordion Content */}
      <div className="flex-1 min-w-0">
        {/* Summary/Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full flex items-center justify-between py-2 text-left font-semibold text-sm transition-colors duration-200 ${
            selected ? 'text-blue-300' : 'text-slate-100'
          } hover:text-blue-300`}
        >
          <span className="line-height-1.4">{plan.displayName}</span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ml-2 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>

        {/* Body Content */}
        {expanded && (
          <div className="mt-4 pl-0 text-slate-300 text-sm leading-relaxed space-y-2">
            {plan.description && (
              <div className="text-slate-400 mb-3 text-xs leading-normal">
                {plan.description}
              </div>
            )}
            {plan.brand && (
              <div className="mb-2">
                <span className="text-slate-400 font-medium mr-4">Brand:</span>
                <span>{plan.brand}</span>
                {!!plan.brandName && <span> ({plan.brandName})</span>}
              </div>
            )}
            <div className="mb-2">
              <span className="text-slate-400 font-medium mr-4">Type:</span>
              <Type type={plan.type} />
            </div>
            <div className="mb-2">
              <span className="text-slate-400 font-medium mr-4">Fuel Type:</span>
              <FuelType fuelType={plan.fuelType} />
            </div>
            {plan.planId && (
              <div className="mb-2">
                <span className="text-slate-400 font-medium mr-4">Plan ID:</span>
                <span className="text-slate-300 text-xs font-mono">{plan.planId}</span>
              </div>
            )}
            <div className="mb-2">
              <span className="text-slate-400 font-medium mr-4">Last updated:</span>
              <span className="text-slate-300">
                <DateTime rfc3339={plan.lastUpdated} /> &nbsp;
                <a
                  href={URL.createObjectURL(blob)}
                  download={`${plan.planId}.json`}
                  className="text-blue-400 hover:text-blue-300 text-xs font-semibold underline cursor-pointer"
                >
                  JSON
                </a>
              </span>
            </div>
            {!!plan.effectiveFrom && (
              <div className="mb-2">
                <span className="text-slate-400 font-medium mr-4">Effective from:</span>
                <DateTime rfc3339={plan.effectiveFrom} />
              </div>
            )}
            {!!plan.effectiveTo && (
              <div className="mb-2">
                <span className="text-slate-400 font-medium mr-4">Effective to:</span>
                <DateTime rfc3339={plan.effectiveTo} />
              </div>
            )}
            {!!plan.applicationUri && (
              <div className="mb-2">
                <a
                  href={plan.applicationUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-semibold text-sm"
                >
                  Apply here →
                </a>
              </div>
            )}
            {
              !!plan.additionalInformation &&
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-2">Additional Information</div>
                <AdditionalInfo additionalInfo={plan.additionalInformation} />
              </div>
            }
            {!!plan.customerType &&
              <div className="mb-2">
                <span className="text-slate-400 font-medium mr-4">Customer Type:</span>
                <CustomerType customerType={plan.customerType} />
              </div>
            }
            {
              !!plan.geography &&
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-2">Geography</div>
                <div className="pl-4">
                  <Geography geography={plan.geography} />
                </div>
              </div>
            }
            {
              !!plan.meteringCharges &&
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-2">Metering Charges</div>
                <ul className="m-0 pl-4">
                  {plan.meteringCharges.map((meteringCharge, index) => <MeteringCharge meteringCharge={meteringCharge} key={index} />)}
                </ul>
              </div>
            }
            {
              !!plan.gasContract &&
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-2">Gas Contract</div>
                <div className="pl-4">
                  <PlanContract contract={plan.gasContract} />
                </div>
              </div>
            }
            {
              !!plan.electricityContract &&
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-2">Electricity Contract</div>
                <div className="pl-4">
                  <PlanContract contract={plan.electricityContract} />
                </div>
              </div>
            }
          </div>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  selectedPlans: state.energySelection
})

const mapDispatchToProps = { selectPlan, deselectPlan }

export default connect(mapStateToProps, mapDispatchToProps)(Plan)

const mapStateToProps = state => ({
  selectedPlans: state.energySelection
})

const mapDispatchToProps = { selectPlan, deselectPlan }

export default connect(mapStateToProps, mapDispatchToProps)(Plan)
