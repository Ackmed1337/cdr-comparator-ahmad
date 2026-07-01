import React from 'react'
import {connect} from 'react-redux'
import {format} from '../../utils/datetime'
import AdditionalInfo from '../data/energy/AdditionalInfo'
import Type from '../data/energy/Type'
import FuelType from '../data/energy/FuelType'
import ExternalLink from '../data/energy/ExternalLink'
import Geography from '../data/energy/Geography'
import CustomerType from '../data/energy/CustomerType'
import MeteringCharge from '../data/energy/MeteringCharge'
import PlanContract from '../data/energy/PlanContract'

const EnergyComparisonPanel = (props) => {
  const {dataSources, planSelections} = props
  const planDataKeys = [
    {key: 'displayName', label: 'Display Name'},
    {key: 'description', label: 'Description'},
    {key: 'type', label: 'Type'},
    {key: 'fuelType', label: 'Fuel Type'},
    {key: 'brand', label: 'Brand'},
    {key: 'brandName', label: 'Brand Name'},
    {key: 'lastUpdated', label: 'Last Updated'},
    {key: 'effectiveFrom', label: 'Effective From'},
    {key: 'effectiveTo', label: 'Effective To'},
    {key: 'applicationUri', label: 'Application Link'},
    {key: 'additionalInformation', label: 'Additional Information'},
    {key: 'customerType', label: 'Customer Type'},
    {key: 'geography', label: 'Geography'},
    {key: 'meteringCharges', label: 'Metering Charges'},
    {key: 'gasContract', label: 'Gas Contract'},
    {key: 'electricityContract', label: 'Electricity Contract'},
  ]

  const render = (plan, key) => {
    switch (key) {
      case 'displayName':
      case 'description':
      case 'brand':
      case 'brandName':
        return plan[key]
      case 'lastUpdated':
      case 'effectiveFrom':
      case 'effectiveTo':
        return !!plan[key] ? format(plan[key]) : ''
      case 'type':
        return <Type type={plan[key]} />
      case 'fuelType':
        return <FuelType fuelType={plan[key]} />
      case 'applicationUri':
        return !!plan[key] && <ExternalLink link={plan[key]}>Apply here</ExternalLink>
      case 'additionalInformation':
        return !!plan[key] && <AdditionalInfo additionalInfo={plan[key]} tableCell/>
      case 'customerType':
        return !!plan[key] && <CustomerType customerType={plan[key]} />
      case 'geography':
        return !!plan[key] && <Geography geography={plan[key]} />
      case 'meteringCharges':
        return !!plan[key] &&
          <ul className="m-0 p-0">
            {plan[key].map((meteringCharge, index) => <MeteringCharge meteringCharge={meteringCharge} key={index} />)}
          </ul>
      case 'gasContract':
      case 'electricityContract':
        return !!plan[key] && <PlanContract contract={plan[key]} />
      default:
        return ''
    }
  }

  if (!planSelections || planSelections.length === 0) return null

  const colWidth = `${85 / planSelections.length}%`

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4" />
          </svg>
          <h2 className="text-base font-semibold text-slate-100">Energy Comparison</h2>
          <span className="bg-blue-900 text-blue-200 text-xs font-bold px-2 py-1 rounded-full">
            {planSelections.length} plans
          </span>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="w-11/12 mx-auto my-4 overflow-auto max-h-160 rounded-lg border border-slate-700 bg-slate-950">
        {/* Desktop Table */}
        <table className="w-full border-collapse border-spacing-0 hidden md:table">
          <thead>
            <tr>
              <th className="sticky top-0 z-40 bg-gradient-to-r from-slate-900 to-slate-800 border-b-2 border-blue-500 text-left text-xs font-bold text-slate-300 p-3 px-3.5 border-r border-slate-700 w-1/6 min-w-32" />
              {planSelections.map((selection, index) =>
                <th key={index} className="sticky top-0 z-40 bg-gradient-to-r from-slate-900 to-slate-800 border-b-2 border-blue-500 px-3.5 py-3 border-r border-slate-700 last:border-r-0 text-center" style={{ width: colWidth }}>
                  <div className="text-xs font-bold text-indigo-400">{dataSources[selection.dataSourceIdx].name}</div>
                  <div className="font-bold text-slate-100 text-sm">{selection.plan.displayName}</div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {planDataKeys.map((dataKey, rowIdx) => (
              <tr key={dataKey.key} className={`transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 ${rowIdx % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800'}`}>
                <td className={`text-left font-bold text-slate-300 text-xs px-3.5 py-3 border-r border-slate-700 sticky left-0 z-10 w-1/6 min-w-32 ${rowIdx % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800'}`}>
                  {dataKey.label}
                </td>
                {planSelections.map((selection, index) =>
                  <td
                    key={index}
                    className={`text-center text-sm p-3 px-3.5 transition-colors duration-200 text-slate-300 border-r border-slate-700 last:border-r-0 ${!render(selection.plan, dataKey.key) ? 'opacity-50' : ''}`}
                  >
                    {render(selection.plan, dataKey.key) || '—'}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile View */}
        <div className="md:hidden px-2 py-4">
          {planSelections.map((selection, prodIdx) => (
            <div key={prodIdx} className="mb-4 p-3 border border-slate-600 rounded-lg bg-slate-900 break-inside-avoid">
              <div className="font-bold text-sm text-slate-100 mb-3 pb-2 border-b-2 border-slate-700">
                {dataSources[selection.dataSourceIdx].name} — {selection.plan.displayName}
              </div>
              {planDataKeys.map((dataKey) => {
                const cell = render(selection.plan, dataKey.key)
                if (!cell) return null
                return (
                  <div key={dataKey.key} className="grid grid-cols-[45%_1fr] gap-2 py-2 px-0 text-xs border-b border-slate-700 last:border-b-0">
                    <div className="font-semibold text-slate-400 break-words">{dataKey.label}:</div>
                    <div className="text-slate-300 text-right break-words">{cell}</div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-700 bg-slate-800">
        <div className="text-xs text-slate-400 text-center">
          Displaying {planSelections.length} energy plan{planSelections.length !== 1 ? 's' : ''} for comparison
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  dataSources: state.dataSources,
  planSelections: state.energyComparison
})

export default connect(mapStateToProps)(EnergyComparisonPanel)

export default connect(mapStateToProps)(EnergyComparisonPanel)
