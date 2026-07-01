import React from 'react'
import { connect } from 'react-redux'
import EnergyPlanList from './EnergyPlanList'
import { startRetrievePlanList, retrievePlanList, clearData } from '../../../store/energy/data'
import { normalise } from '../../../utils/url'
import { comparePlans } from '../../../store/energy/comparison'

const EnergyPanel = (props) => {
  const { dataSources, savedDataSourcesCount, versionInfo } = props
  const [expanded, setExpanded] = React.useState(true)
  const [effective, setEffective] = React.useState('CURRENT')
  const [fuelType, setFuelType] = React.useState('GAS')

  const compare = () => {
    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      alert('Screen too small — please use a larger device to compare.')
      return
    }
    props.comparePlans(props.selectedPlans)
    setExpanded(false)
  }

  React.useEffect(() => {
    dataSources.forEach((ds, i) => {
      if (isEnergyDataSource(ds)) {
        props.startRetrievePlanList(i)
        const base = normalise(ds.energyPrd || ds.url)
        props.retrievePlanList(i, base, `${base}/energy/plans?effective=${effective}&fuelType=${fuelType}`, versionInfo.xV, versionInfo.xMinV, effective, fuelType)
      }
    })
    return () => {
      dataSources.forEach((ds, i) => {
        if (isEnergyDataSource(ds)) props.clearData(i)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effective, fuelType, versionInfo.xV, versionInfo.xMinV, savedDataSourcesCount])

  const selCount = props.selectedPlans.length
  const canCompare = selCount >= 2 && selCount <= 4

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-xl">
      {/* Panel Header/Accordion Summary */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 bg-slate-800 hover:bg-slate-700 transition-colors border-b border-slate-700"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-slate-100">Energy Plans</h2>
          {savedDataSourcesCount > 0 && (
            <span className="bg-blue-900 text-blue-200 text-xs font-bold px-2 py-1 rounded-full">
              {savedDataSourcesCount} source{savedDataSourcesCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <svg
          className={`w-6 h-6 text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* Panel Details/Content */}
      {expanded && (
        <div className="p-6 max-w-full mx-auto">
          {/* Filters Section */}
          <div className="mb-6 p-4 bg-slate-750 border border-slate-700 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Effective Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Effective</label>
                <div className="flex gap-4">
                  {['CURRENT', 'FUTURE', 'ALL'].map(value => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="effective"
                        value={value}
                        checked={effective === value}
                        onChange={e => setEffective(e.target.value)}
                        className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 cursor-pointer"
                      />
                      <span className="text-sm text-slate-300">{value.charAt(0) + value.slice(1).toLowerCase()}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fuel Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Fuel Type</label>
                <div className="flex gap-4 flex-wrap">
                  {['ELECTRICITY', 'GAS', 'DUAL', 'ALL'].map(value => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="fuelType"
                        value={value}
                        checked={fuelType === value}
                        onChange={e => setFuelType(e.target.value)}
                        className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 cursor-pointer"
                      />
                      <span className="text-sm text-slate-300">{value.charAt(0) + value.slice(1).toLowerCase()}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Data Sources Grid */}
          {savedDataSourcesCount > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataSources.map((ds, index) =>
                isEnergyDataSource(ds) && (
                  <div key={index} className="flex flex-col">
                    {/* Data Source Header */}
                    <div className="flex items-center gap-3 p-3 mb-4 bg-slate-750 border-l-4 border-blue-500 rounded-lg border border-slate-700">
                      {ds.icon && <img src={ds.icon} alt="" className="w-7 h-7 object-contain flex-shrink-0" />}
                      <span className="text-sm font-bold text-slate-100">{ds.name}</span>
                    </div>
                    {/* Plan List */}
                    <div className="flex-1">
                      <EnergyPlanList dataSourceIndex={index} />
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="py-8 px-6 text-center text-slate-400 text-sm">
              Add a data source above to load energy plans.
            </div>
          )}
        </div>
      )}

      {/* Panel Footer/Actions */}
      <div className="border-t border-slate-700 bg-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selCount > 0 && (
              <span className="text-sm text-slate-400">
                {selCount} plan{selCount !== 1 ? 's' : ''} selected
                {selCount > 4 && <span className="text-red-500 ml-1">(max 4)</span>}
              </span>
            )}
          </div>

          {/* Compare Button */}
          <button
            onClick={compare}
            disabled={!canCompare}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
              canCompare
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/50 cursor-pointer'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Compare {canCompare ? `(${selCount})` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}

function isEnergyDataSource(ds) {
  return !ds.unsaved && !ds.deleted && ds.enabled && (!ds.sectors || ds.sectors.includes('energy'))
}

const mapStateToProps = state => ({
  dataSources: state.dataSources,
  savedDataSourcesCount: state.dataSources.filter(isEnergyDataSource).length,
  selectedPlans: state.energySelection,
  versionInfo: state.versionInfo.vHeaders,
})

export default connect(mapStateToProps, { startRetrievePlanList, retrievePlanList, clearData, comparePlans })(EnergyPanel)

export default connect(mapStateToProps, { startRetrievePlanList, retrievePlanList, clearData, comparePlans })(EnergyPanel)
