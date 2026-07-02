import React from 'react'
import { connect } from 'react-redux'
import { RefreshCw, Pencil, Check, Landmark, Plus, ChevronDown } from 'lucide-react'
import DataSource from './DataSource'
import { loadDataSource, addDataSource, syncDataSources } from '../../store/data-source'
import { loadVersionInfo, saveVersionInfo, setVersionsEditable, setVersionsReadOnly } from '../../store/version-info'
import { startRetrieveProductList, retrieveProductList, clearData } from '../../store/banking/data'
import { clearSelection } from '../../store/banking/selection'
import { normalise } from '../../utils/url'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { cn } from '../../lib/utils'

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
    <Card>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/50 border-l-4 border-primary transition-all duration-200"
      >
        <Landmark className="w-5 h-5 text-foreground/80" />
        <span className="font-bold text-foreground/90 text-sm uppercase tracking-wider">Data Sources</span>
        <ChevronDown className={cn('ml-auto w-5 h-5 text-muted-foreground transition-transform duration-300', isExpanded && 'rotate-180')} />
      </button>

      {isExpanded && (
        <div className="transition-all duration-300">
          <div className="max-h-72 overflow-y-auto border-t border-border">
            {dataSources.length > 0 && (
              <div>
                <div className="hidden sm:flex gap-2 px-9 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest border-b border-border sticky top-0 bg-card z-10">
                  <div className="flex-0 w-[22%]">Name</div>
                  <div className="flex-0 w-[34%]">API base URL</div>
                  <div className="flex-0 w-[28%]">Icon URL</div>
                </div>
                {dataSources.map((ds, i) => !ds.deleted && <DataSource key={i} dataSource={ds} index={i} />)}
              </div>
            )}
          </div>

          <div className="border-t border-border p-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={syncDataSources}
                size="icon"
                className="rounded-full"
                title="Sync with CDR Register"
                aria-label="Sync data sources with CDR Register"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>

              <div className="flex-1 flex items-center justify-center gap-4">
                {readOnly ? (
                  <>
                    <div>
                      <Input value={xMinV} readOnly className="w-28 text-center" />
                      <div className="text-xs text-muted-foreground mt-1 text-center">Min version</div>
                    </div>
                    <div>
                      <Input value={xV === '999' ? 'Auto' : xV} readOnly className="w-28 text-center" />
                      <div className="text-xs text-muted-foreground mt-1 text-center">{xV === '999' ? 'Auto-negotiates best version' : 'Preferred version'}</div>
                    </div>
                    <Button
                      onClick={setVersionsEditable}
                      size="icon"
                      variant="secondary"
                      title="Edit API versions"
                      aria-label="Edit API versions"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="x-min-v" className="sr-only">x-min-v</Label>
                      <Input
                        id="x-min-v"
                        list="x-min-v-options"
                        defaultValue={xMinV}
                        onChange={e => { xMinV = e.target.value }}
                        className="w-28 text-center"
                      />
                      <datalist id="x-min-v-options">
                        {xMinVVersions.map(v => <option key={v} value={v} />)}
                      </datalist>
                      <div className="text-xs text-muted-foreground mt-1 text-center">Min version</div>
                    </div>
                    <div>
                      <Label htmlFor="x-v" className="sr-only">x-v</Label>
                      <Input
                        id="x-v"
                        list="x-v-options"
                        defaultValue={xV}
                        onChange={e => { xV = e.target.value === 'Auto (999)' ? '999' : e.target.value }}
                        className="w-28 text-center"
                      />
                      <datalist id="x-v-options">
                        {xVVersions.map(v => <option key={v} value={v === '999' ? 'Auto (999)' : v} />)}
                      </datalist>
                      <div className="text-xs text-muted-foreground mt-1 text-center">999 = auto</div>
                    </div>
                    <Button
                      onClick={applyVersions}
                      size="icon"
                      variant="secondary"
                      title="Apply versions"
                      aria-label="Apply API versions"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>

              <Button
                onClick={addDataSource}
                size="icon"
                className="rounded-full"
                title="Add data source"
                aria-label="Add data source"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
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
