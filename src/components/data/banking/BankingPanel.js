import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ChevronDown, Landmark, GitCompare } from 'lucide-react'
import BankingProductList from './BankingProductList'
import { compareProducts } from '../../../store/banking/comparison'
import { Card } from '../../ui/Card'
import { Badge } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { cn } from '../../../lib/utils'

const BankingPanel = (props) => {
  const { dataSources, savedDataSourcesCount } = props
  const [expanded, setExpanded] = useState(true)

  const compare = () => {
    props.compareProducts(props.selectedProducts)
    setExpanded(false)
  }

  const selCount = props.selectedProducts.length
  const canCompare = selCount >= 2 && selCount <= 4

  const gridCols = (count) => {
    if (count <= 1) return 'grid-cols-1'
    if (count === 2) return 'grid-cols-1 md:grid-cols-2'
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }

  return (
    <Card className="overflow-hidden shadow-md">
      {/* Panel Header/Accordion Summary */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-accent/50 transition-colors border-b border-border"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-foreground">Banking Products</h2>
          {savedDataSourcesCount > 0 && (
            <Badge variant="primary">{savedDataSourcesCount} source{savedDataSourcesCount !== 1 ? 's' : ''}</Badge>
          )}
        </div>
        <ChevronDown className={cn('w-5 h-5 text-muted-foreground transition-transform duration-200', expanded && 'rotate-180')} />
      </button>

      {/* Panel Details/Content */}
      {expanded && (
        <div className="p-6 max-w-full mx-auto">
          {savedDataSourcesCount > 0 ? (
            <div className={cn('grid gap-4', gridCols(savedDataSourcesCount))}>
              {dataSources.map((ds, index) =>
                isBankingDataSource(ds) && (
                  <div key={index} className="flex flex-col">
                    {/* Data Source Header */}
                    <div className="flex items-center gap-3 p-3 mb-4 bg-muted/50 border-l-4 border-primary rounded-lg border border-border">
                      {ds.icon
                        ? <img src={ds.icon} alt="" className="w-7 h-7 object-contain flex-shrink-0" onError={e => { e.target.style.display = 'none' }} />
                        : <Landmark className="w-6 h-6 text-muted-foreground flex-shrink-0" />}
                      <span className="text-sm font-bold text-foreground">{ds.name}</span>
                    </div>
                    {/* Product List */}
                    <div className="flex-1">
                      <BankingProductList dataSource={ds} dataSourceIndex={index} />
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="py-8 px-6 text-center text-muted-foreground text-sm">
              Add a data source above to load banking products.
            </div>
          )}
        </div>
      )}

      {/* Floating Compare Bar — stays on screen regardless of scroll position, since a bank's
          product list can be long enough that a footer-anchored button would be unreachable. */}
      {selCount > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 pl-5 pr-2 py-2 rounded-full border border-border bg-popover shadow-2xl">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {selCount} product{selCount !== 1 ? 's' : ''} selected
            {selCount > 4 && <span className="text-destructive ml-1">(max 4)</span>}
            {selCount === 1 && <span className="text-muted-foreground/70 ml-1">(select at least 2)</span>}
          </span>
          <Button onClick={compare} disabled={!canCompare} size="sm" className="rounded-full px-4">
            <GitCompare className="w-4 h-4" />
            Compare {canCompare ? `(${selCount})` : ''}
          </Button>
        </div>
      )}
    </Card>
  )
}

function isBankingDataSource(ds) {
  return !ds.unsaved && !ds.deleted && ds.enabled && (!ds.sectors || ds.sectors.includes('banking'))
}

const mapStateToProps = state => ({
  dataSources: state.dataSources,
  savedDataSourcesCount: state.dataSources.filter(isBankingDataSource).length,
  selectedProducts: state.bankingSelection,
})

export default connect(mapStateToProps, { compareProducts })(BankingPanel)
