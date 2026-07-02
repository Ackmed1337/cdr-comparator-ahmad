import React from 'react'
import { Check, Trash2 } from 'lucide-react'
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
import { Checkbox } from '../ui/Checkbox'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

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
    const val = e.target.value
    if (name === 'name') props.modifyDataSourceName(index, { ...dataSource, [name]: val })
    else if (name === 'url') {
      props.modifyDataSourceUrl(index, { ...dataSource, [name]: val })
      if (!dataSource.unsaved) { props.clearSelection(index); props.clearData(index) }
    } else if (name === 'icon') {
      props.modifyDataSourceIcon(index, { ...dataSource, [name]: val })
    }
  }

  const changeEnabled = checked => {
    props.enableDataSource(index, { ...dataSource, enabled: checked })
    if (dataSource.enabled) {
      props.clearSelection(index)
      props.clearData(index)
    } else if (!dataSource.unsaved) {
      const url = normalise(dataSource.url)
      props.startRetrieveProductList(index)
      props.retrieveProductList(index, url, url + '/banking/products', vHeaders.xV, vHeaders.xMinV)
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
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 py-3 border-b border-border hover:bg-accent/30 transition-colors duration-200" onClick={stop}>
        <div className="flex items-center gap-3">
          <Checkbox checked={dataSource.enabled} onCheckedChange={changeEnabled} className="flex-shrink-0" />
          <div className="flex-1 sm:flex-shrink-0 sm:w-[22%]">
            <Input
              type="text"
              value={dataSource.name}
              onChange={change('name')}
              placeholder="e.g. Acme Bank"
              error={!dataSource.name.trim().length}
            />
          </div>
        </div>
        <div className="sm:flex-shrink-0 sm:w-[34%]">
          <Input
            type="text"
            value={dataSource.url}
            onChange={change('url')}
            placeholder="https://data.holder"
            error={!isUrl(dataSource.url)}
          />
        </div>
        <div className="sm:flex-shrink-0 sm:w-[28%]">
          <Input
            type="text"
            value={dataSource.icon || ''}
            onChange={change('icon')}
            placeholder="https://...icon.png"
            error={!!dataSource.icon && !isUrl(dataSource.icon)}
          />
        </div>
        <div className="flex-shrink-0 flex items-center justify-end sm:justify-start gap-2">
          {status && (
            <div
              className={cn('flex-shrink-0 rounded-full cursor-help transition-all duration-200', status.loading && 'animate-pulse')}
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
            <Button
              onClick={save}
              size="sm"
              variant="success"
              title="Save"
              aria-label="Save data source"
              disabled={!valid()}
            >
              <Check className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={del}
              size="sm"
              variant="danger"
              title="Remove"
              aria-label="Remove data source"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      {error && <div className="px-4 py-2 text-xs text-destructive bg-destructive/10 border-b border-destructive/20">{error}</div>}
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
