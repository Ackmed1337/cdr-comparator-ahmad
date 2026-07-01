import React from 'react'
import { connect } from 'react-redux'
import SyncIcon from '@material-ui/icons/Sync'
import EditIcon from '@material-ui/icons/Edit'
import DoneOutlineIcon from '@material-ui/icons/DoneOutline'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import PlayListAddIcon from '@material-ui/icons/PlaylistAdd'
import DataSource from './DataSource'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { loadDataSource, addDataSource, syncDataSources } from '../../store/data-source'
import { loadVersionInfo, saveVersionInfo, setVersionsEditable, setVersionsReadOnly } from '../../store/version-info'
import { startRetrieveProductList, retrieveProductList, clearData } from '../../store/banking/data'
import { clearSelection } from '../../store/banking/selection'
import { normalise } from '../../utils/url'

const xMinVVersions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
const xVVersions = ['999', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

const DataSourcePanel = (props) => {
  const { dataSources, addDataSource, syncDataSources, vHeaders, readOnly, setVersionsEditable, setVersionsReadOnly, saveVersionInfo, clearSelection, clearData, startRetrieveProductList, retrieveProductList, loadDataSource, loadVersionInfo } = props
  const [isExpanded, setIsExpanded] = React.useState(false)
  let { xV, xMinV } = vHeaders

  React.useEffect(() => {
    loadDataSource()
    loadVersionInfo()
  }, [loadDataSource, loadVersionInfo])

  const applyVersions = () => {
    if (xV && xMinV && (xV !== vHeaders.xV || xMinV !== vHeaders.xMinV)) {
      saveVersionInfo({ xV, xMinV })
      dataSources.forEach((ds, i) => {
        if (!ds.unsaved && !ds.deleted && ds.enabled) {
          clearSelection(i)
          clearData(i)
          startRetrieveProductList(i)
          const url = normalise(ds.url)
          retrieveProductList(i, url, url + '/banking/products', xV, xMinV)
        }
      })
    } else {
      setVersionsReadOnly()
    }
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-900 hover:bg-slate-800 border-l-4 border-blue-500 transition-all duration-200"
      >
        <AccountBalanceIcon style={{ fontSize: 20 }} />
        <span className="font-bold text-slate-300 text-sm uppercase tracking-wider">Data Sources</span>
        <svg
          className={`ml-auto w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {isExpanded && (
        <div className="transition-all duration-300">
          <div className="max-h-72 overflow-y-auto bg-slate-800">
            {dataSources.length > 0 && (
              <div>
                <div className="flex gap-2 px-9 py-2 text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
                  <div className="flex-0 w-[22%]">Name</div>
                  <div className="flex-0 w-[34%]">API base URL</div>
                  <div className="flex-0 w-[28%]">Icon URL</div>
                </div>
                {dataSources.map((ds, i) => !ds.deleted && <DataSource key={i} dataSource={ds} index={i} />)}
              </div>
            )}
          </div>

          <div className="border-t border-slate-700 bg-slate-800 p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={syncDataSources}
                title="Sync with CDR Register"
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
              >
                <SyncIcon style={{ fontSize: 20 }} />
              </button>

              <div className="flex-1 text-center">
                {readOnly ? (
                  <div className="flex items-center justify-center gap-4">
                    <div>
                      <TextField value={xMinV} label="x-min-v" InputProps={{ readOnly: true }} size="small" />
                      <div className="text-xs text-slate-400 mt-1">Min version</div>
                    </div>
                    <div>
                      <TextField value={xV === '999' ? 'Auto' : xV} label="x-v" InputProps={{ readOnly: true }} size="small" />
                      <div className="text-xs text-slate-400 mt-1">{xV === '999' ? 'Auto-negotiates best version' : 'Preferred version'}</div>
                    </div>
                    <button
                      onClick={setVersionsEditable}
                      title="Edit API versions"
                      className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 ml-2"
                    >
                      <EditIcon style={{ fontSize: 18 }} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-4">
                    <div style={{ display: 'inline-block' }}>
                      <Autocomplete
                        freeSolo
                        options={xMinVVersions}
                        value={xMinV}
                        renderInput={params => <TextField {...params} label="x-min-v" size="small" />}
                        onInputChange={(_, v) => { xMinV = v }}
                        style={{ width: 120 }}
                      />
                      <div className="text-xs text-slate-400 mt-1">Min version</div>
                    </div>
                    <div style={{ display: 'inline-block' }}>
                      <Autocomplete
                        freeSolo
                        options={xVVersions}
                        value={xV}
                        getOptionLabel={o => o === '999' ? 'Auto (999)' : o}
                        renderInput={params => <TextField {...params} label="x-v" size="small" />}
                        onInputChange={(_, v) => { xV = v === 'Auto (999)' ? '999' : v }}
                        style={{ width: 120 }}
                      />
                      <div className="text-xs text-slate-400 mt-1">999 = auto</div>
                    </div>
                    <button
                      onClick={applyVersions}
                      title="Apply versions"
                      className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 ml-2"
                    >
                      <DoneOutlineIcon style={{ fontSize: 18 }} />
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={addDataSource}
                title="Add data source"
                className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
              >
                <PlayListAddIcon style={{ fontSize: 20 }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const mapStateToProps = state => ({
  dataSources: state.dataSources,
  vHeaders: state.versionInfo.vHeaders,
  readOnly: !state.versionInfo.editable,
})

const mapDispatchToProps = {
  loadDataSource,
  addDataSource,
  syncDataSources,
  loadVersionInfo,
  saveVersionInfo,
  setVersionsEditable,
  setVersionsReadOnly,
  startRetrieveProductList,
  retrieveProductList,
  clearSelection,
  clearData,
}

export default connect(mapStateToProps, mapDispatchToProps)(DataSourcePanel)
