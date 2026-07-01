import React from 'react'
import StatusOutages from './StatusOutages'
import { connect } from 'react-redux'
import { normalise } from '../../../utils/url'
import { retrieveStatus, retrieveOutages } from '../../../store/discovery'

const DiscoveryInfo = (props) => {
  const { dataSources, savedDataSourcesCount } = props
  const [expanded, setExpanded] = React.useState(true)

  const refresh = () => {
    const { versionInfo } = props
    props.dataSources.forEach((ds, i) => {
      if (!ds.unsaved && ds.enabled && !ds.deleted) {
        const url = normalise(ds.url)
        props.retrieveStatus(i, url, versionInfo.xV, versionInfo.xMinV)
        props.retrieveOutages(i, url, versionInfo.xV, versionInfo.xMinV)
      }
    })
  }

  React.useEffect(() => {
    refresh()
    // eslint-disable-next-line
  }, [props.dataSources])

  const colWidth = (count) => {
    if (count === 1) return 'w-full'
    if (count === 2) return 'w-1/2'
    if (count === 3) return 'w-1/3'
    return 'w-1/4'
  }

  return (
    <div className="bg-white dark:bg-slate-900 border-l-4 border-blue-500 mb-4">
      {/* Header */}
      <div
        className="bg-white dark:bg-slate-900 border-l-4 border-blue-500 p-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Status & Outages</h3>
          {savedDataSourcesCount > 0 && (
            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-full">
              {savedDataSourcesCount} source{savedDataSourcesCount !== 1 ? 's' : ''}
            </span>
          )}
          <span className={`ml-auto text-slate-500 dark:text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </div>

      {/* Content */}
      {expanded && (
        <div className="bg-slate-100 dark:bg-slate-800 p-4 text-slate-700 dark:text-slate-300 text-sm border-t border-slate-300 dark:border-slate-700">
          {savedDataSourcesCount > 0 ? (
            <div className="flex flex-wrap gap-3">
              {dataSources.map((ds, i) => {
                const data = props.data[i]
                if (!data || ds.unsaved || !ds.enabled || ds.deleted) return null
                return (
                  <div key={i} className={`${colWidth(savedDataSourcesCount)} min-w-xs`}>
                    <div className="bg-slate-100/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-300 dark:border-slate-700">
                        {ds.icon && <img src={ds.icon} alt="" className="w-7 h-7 object-contain flex-shrink-0" onError={e => { e.target.style.display = 'none' }} />}
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{ds.name}</span>
                      </div>
                      <StatusOutages statusDetails={data.statusDetails} outagesDetails={data.outagesDetails} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-6 px-5 text-center text-slate-500 dark:text-slate-400">
              Add a data source above to check status.
            </div>
          )}
        </div>
      )}

      {/* Footer with Refresh Button */}
      <div className="bg-slate-100/50 dark:bg-slate-800/50 border-t border-slate-300 dark:border-slate-700 px-4 py-3 flex justify-center">
        <button
          onClick={refresh}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors"
          title="Refresh status"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  dataSources: state.dataSources,
  savedDataSourcesCount: state.dataSources.filter(ds => !ds.unsaved && !ds.deleted && ds.enabled).length,
  versionInfo: state.versionInfo.vHeaders,
  data: state.discovery,
})

export default connect(mapStateToProps, { retrieveStatus, retrieveOutages })(DiscoveryInfo)
