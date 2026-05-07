import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import DoneOutlineIcon from '@material-ui/icons/DoneOutline'
import DeleteIcon from '@material-ui/icons/Delete'
import Tooltip from '@material-ui/core/Tooltip'
import { connect } from 'react-redux'
import isUrl, { normalise } from '../../utils/url'
import {
  saveDataSource,
  deleteDataSource,
  enableDataSource,
  modifyDataSourceName,
  modifyDataSourceIcon,
  modifyDataSourceUrl,
  modifyDataSourceEnergyPrdUrl,
} from '../../store/data-source'
import { clearSelection } from '../../store/banking/selection'
import {
  startRetrieveProductList,
  retrieveProductList,
  deleteData,
  clearData,
  START_RETRIEVE_PRODUCT_LIST,
} from '../../store/banking/data'

const useStyles = makeStyles(() => ({
  '@keyframes pulse': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.25 },
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 0',
    borderBottom: '1px solid #f1f5f9',
    '&:last-child': { borderBottom: 'none' },
  },
  field: { flex: 1 },
  error: {
    fontSize: '0.72rem',
    color: '#dc2626',
    marginTop: 2,
    marginLeft: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
    cursor: 'help',
  },
  dotLoading: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
    cursor: 'help',
    animation: '$pulse 1.2s ease-in-out infinite',
  },
}))

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
  const classes = useStyles()
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
      <div className={classes.row} onClick={stop}>
        <Checkbox
          checked={dataSource.enabled}
          onChange={change('enabled')}
          color="primary"
          size="small"
          style={{ padding: 4, flexShrink: 0 }}
        />
        <div className={classes.field} style={{ flex: '0 0 22%' }}>
          <TextField
            error={!dataSource.name.trim().length}
            value={dataSource.name}
            onChange={change('name')}
            placeholder="e.g. Acme Bank"
            size="small"
            fullWidth
            inputProps={{ style: { fontSize: '0.82rem', padding: '6px 8px' } }}
          />
        </div>
        <div className={classes.field} style={{ flex: '0 0 34%' }}>
          <TextField
            error={!isUrl(dataSource.url)}
            value={dataSource.url}
            onChange={change('url')}
            placeholder="https://data.holder"
            size="small"
            fullWidth
            inputProps={{ style: { fontSize: '0.82rem', padding: '6px 8px' } }}
          />
        </div>
        <div className={classes.field} style={{ flex: '0 0 28%' }}>
          <TextField
            error={!!dataSource.icon && !isUrl(dataSource.icon)}
            value={dataSource.icon || ''}
            onChange={change('icon')}
            placeholder="https://...icon.png"
            size="small"
            fullWidth
            inputProps={{ style: { fontSize: '0.82rem', padding: '6px 8px' } }}
          />
        </div>
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          {status && (
            <Tooltip title={status.label}>
              <div
                className={status.loading ? classes.dotLoading : classes.dot}
                style={{ background: status.color }}
              />
            </Tooltip>
          )}
          {dataSource.unsaved ? (
            <Tooltip title="Save">
              <IconButton size="small" onClick={save}>
                <DoneOutlineIcon fontSize="small" color={valid() ? 'primary' : 'disabled'} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Remove">
              <IconButton size="small" onClick={del}>
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
      {error && <div className={classes.error}>{error}</div>}
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
  modifyDataSourceEnergyPrdUrl,
  modifyDataSourceIcon,
  clearSelection,
  startRetrieveProductList,
  retrieveProductList,
  deleteData,
  clearData,
}

export default connect(mapStateToProps, mapDispatchToProps)(DataSource)
