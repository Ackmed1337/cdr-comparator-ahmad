import React from 'react'
import { ChevronDown, RefreshCw, Landmark } from 'lucide-react'
import StatusOutages from './StatusOutages'
import { connect } from 'react-redux'
import { normalise } from '../../../utils/url'
import { retrieveStatus, retrieveOutages } from '../../../store/discovery'
import { Card } from '../../ui/Card'
import { Badge } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { cn } from '../../../lib/utils'

const DiscoveryInfo = (props) => {
  const { dataSources, savedDataSourcesCount } = props
  const [expanded, setExpanded] = React.useState(true)
  const [refreshing, setRefreshing] = React.useState(false)

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

  // retrieveStatus/retrieveOutages are fire-and-forget thunks (they don't hand back a
  // promise to await), so tie the spin to a fixed visible duration instead — it's about
  // confirming the click registered, not tracking exact network completion.
  const handleRefreshClick = () => {
    refresh()
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 900)
  }

  const gridCols = (count) => {
    if (count <= 1) return 'grid-cols-1'
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2'
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  }

  return (
    <Card className="mb-4 overflow-hidden">
      {/* Header */}
      <div
        className="border-l-4 border-primary p-4 cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-foreground/90">Status & Outages</h3>
          {savedDataSourcesCount > 0 && (
            <Badge variant="primary">{savedDataSourcesCount} source{savedDataSourcesCount !== 1 ? 's' : ''}</Badge>
          )}
          <ChevronDown className={cn('ml-auto w-5 h-5 text-muted-foreground transition-transform', expanded && 'rotate-180')} />
        </div>
      </div>

      {/* Content */}
      {expanded && (
        <div className="bg-muted/30 p-4 text-sm border-t border-border">
          {savedDataSourcesCount > 0 ? (
            <div className={cn('grid gap-3', gridCols(savedDataSourcesCount))}>
              {dataSources.map((ds, i) => {
                const data = props.data[i]
                if (!data || ds.unsaved || !ds.enabled || ds.deleted) return null
                return (
                  <div key={i} className="min-w-0">
                    <Card className="p-3">
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                        {ds.icon
                          ? <img src={ds.icon} alt="" className="w-7 h-7 object-contain flex-shrink-0" onError={e => { e.target.style.display = 'none' }} />
                          : <Landmark className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                        <span className="text-xs font-bold text-foreground/90">{ds.name}</span>
                      </div>
                      <StatusOutages statusDetails={data.statusDetails} outagesDetails={data.outagesDetails} />
                    </Card>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-6 px-5 text-center text-muted-foreground">
              Add a data source above to check status.
            </div>
          )}
        </div>
      )}

      {/* Footer with Refresh Button */}
      <div className="border-t border-border px-4 py-3 flex justify-center">
        <Button
          onClick={handleRefreshClick}
          disabled={refreshing}
          size="icon"
          className="rounded-full"
          title="Refresh status"
          aria-label="Refresh status and outages"
        >
          <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
        </Button>
      </div>
    </Card>
  )
}

const mapStateToProps = state => ({
  dataSources: state.dataSources,
  savedDataSourcesCount: state.dataSources.filter(ds => !ds.unsaved && !ds.deleted && ds.enabled).length,
  versionInfo: state.versionInfo.vHeaders,
  data: state.discovery,
})

export default connect(mapStateToProps, { retrieveStatus, retrieveOutages })(DiscoveryInfo)
