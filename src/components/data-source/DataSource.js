import React from 'react'
import { connect } from 'react-redux'
import isUrl, { normalise } from '../../utils/url'
import {
  saveDataSource,
  deleteDataSource,
  enableDataSource,
  modifyDataSourceName,
  modifyDataSourceIcon,
  modifyDataSourceUrl,
} from '../../store/data-source'
import { clearSelection } from '../../store/banking/selection'
import {
  startRetrieveProductList,
  retrieveProductList,
  deleteData,
  clearData,
  START_RETRIEVE_PRODUCT_LIST,
} from '../../store/banking/data'

const getStatus = (dataSource, index, banking) => {
  if (!dataSource.enabled || dataSource.unsaved) return null
  const d = banking[index] || {}
  const processed = (d.detailRecords || 0) + (d.failedDetailRecords || 0)
  const done = !!d.totalRecords && d.totalRecords <= processed

  if (d.progress === START_RETRIEVE_PRODUCT_LIST || (d.totalRecords > 0 && !done))
    return { color: '#3b82f6', label: d.totalRecords ? `Loading ${processed} / ${d.totalRecords}` : 'Fetching...', loading: true }
  if (done && !d.failedDetailRecords)
    return { color: '#16a34a', label: `${d.totalRecords} product${d.totalRecords !== 1 ? 's' : ''} loaded` }
  if (done && d.failedDetailRecords > 0)
    return { color: '#f59e0b', label: `${d.detailRecords} loaded, ${d.failedDetailRecords} failed` }
  if (d.products !== undefined && d.totalRecords === 0)
    return { color: '#dc2626', label: 'Failed to load — check console' }
  return { color: '#94a3b8', label: 'Not yet fetched' }
}

const DataSource = (props) => {
  const { dataSource, index, vHeaders, banking } = props
  const [error, setError] = React.useState('')

  const status = getStatus(dataSource, index, banking)

  const change = name => e => {
    const val = name === 'enabled' ? e.target.checked : e.target.value
    if (name === 'name') props.modifyDataSourceName(index, { ...dataSource, [name]: val })
    else if (name === 'url') {
      props.modifyDataSourceUrl(index, { ...dataSource, [name]: val })
      if (!dataSource.unsaved) { props.clearSelection(index); props.clearData(index) }
    } else if (name === 'icon') {
      props.modifyDataSourceIcon(index, { ...dataSource, [name]: val })
    } else if (name === 'enabled') {
      props.enableDataSource(index, { ...dataSource, [name]: val })
      if (dataSource.enabled) {
        props.clearSelection(index)
        props.clearData(index)
      } else if (!dataSource.unsaved) {
        const url = normalise(dataSource.url)
        props.startRetrieveProductList(index)
        props.retrieveProductList(index, url, url + '/banking/products', vHeaders.xV, vHeaders.xMinV)
      }
    }
  }

  const valid = () => dataSource.name.trim().length > 0 && isUrl(dataSource.url)

  const save = e => {
    e.stopPropagation()
    e.preventDefault()
    if (!valid()) {
      const msgs = []
      if (!dataSource.name.trim()) msgs.push('Name required')
      if (!isUrl(dataSource.url)) msgs.push('URL invalid')
      setError(msgs.join(' · '))
    } else {
      setError('')
      props.saveDataSource(index, { ...dataSource })
    }
  }

  const del = () => {
    props.deleteDataSource(index)
    props.deleteData(index)
    props.clearSelection(index)
  }

  const stop = e => e.stopPropagation()

  return (
    <div>
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-colors duration-200" onClick={stop}>
        <input
          type="checkbox"
          checked={dataSource.enabled}
          onChange={change('enabled')}
          className="w-4 h-4 accent-blue-500 cursor-pointer flex-shrink-0 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200"
        />
        <div className="flex-shrink-0 w-[22%]">
          <input
            type="text"
            value={dataSource.name}
            onChange={change('name')}
            placeholder="e.g. Acme Bank"
            className={`w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border rounded text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              !dataSource.name.trim().length ? 'border-red-500/50' : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
            }`}
          />
        </div>
        <div className="flex-shrink-0 w-[34%]">
          <input
            type="text"
            value={dataSource.url}
            onChange={change('url')}
            placeholder="https://data.holder"
            className={`w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border rounded text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              !isUrl(dataSource.url) ? 'border-red-500/50' : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
            }`}
          />
        </div>
        <div className="flex-shrink-0 w-[28%]">
          <input
            type="text"
            value={dataSource.icon || ''}
            onChange={change('icon')}
            placeholder="https://...icon.png"
            className={`w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border rounded text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              !!dataSource.icon && !isUrl(dataSource.icon) ? 'border-red-500/50' : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
            }`}
          />
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          {status && (
            <div
              className={`flex-shrink-0 rounded-full cursor-help transition-all duration-200 ${status.loading ? 'animate-pulse' : ''}`}
              style={{
                width: '8px',
                height: '8px',
                background: status.color,
                boxShadow: `0 0 8px ${status.color}`,
              }}
              title={status.label}
            />
          )}
          {dataSource.unsaved ? (
            <button
              onClick={save}
              className={`px-3 py-1.5 rounded text-sm font-semibold flex items-center gap-2 transition-all duration-200 active:scale-95 ${
                valid()
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
              }`}
              title="Save"
              aria-label="Save data source"
              disabled={!valid()}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={del}
              className="px-3 py-1.5 rounded text-sm font-semibold bg-red-600/20 hover:bg-red-600/30 text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 border border-red-300 hover:border-red-400 dark:border-red-600/30 dark:hover:border-red-600/50 transition-all duration-200 active:scale-95 flex items-center gap-2"
              title="Remove"
              aria-label="Remove data source"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {error && <div className="px-4 py-2 text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 border-b border-red-300 dark:border-red-600/30">{error}</div>}
    </div>
  )
}

const mapStateToProps = state => ({
  vHeaders: state.versionInfo.vHeaders,
  banking: state.banking,
})

const mapDispatchToProps = {
  saveDataSource,
  deleteDataSource,
  enableDataSource,
  modifyDataSourceName,
  modifyDataSourceUrl,
  modifyDataSourceIcon,
  clearSelection,
  startRetrieveProductList,
  retrieveProductList,
  deleteData,
  clearData,
}

export default connect(mapStateToProps, mapDispatchToProps)(DataSource)
