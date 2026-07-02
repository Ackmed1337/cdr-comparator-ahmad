import React, { useMemo, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { ChevronDown, Link2, FileText, Download } from 'lucide-react'
import { productDataKeys } from '../../utils/dict'
import { format } from '../../utils/datetime'
import AdditionalInfo from '../data/banking/AdditionalInfo'
import ecomp from '../../utils/enum-comp'
import Bundle from '../data/banking/Bundle'
import Constraint from '../data/banking/Constraint'
import DepositRate from '../data/banking/DepositRate'
import LendingRate from '../data/banking/LendingRate'
import Eligibility from '../data/banking/Eligibility'
import Feature from '../data/banking/Feature'
import Fee from '../data/banking/Fee'
import CardArt from '../data/banking/CardArt'
import RateChart from './RateChart'
import ComparisonStats from './ComparisonStats'
import LoanCalculator from '../tools/LoanCalculator'
import SavingsCalculator from '../tools/SavingsCalculator'
import FeatureMatrix from './FeatureMatrix'
import { generatePDFComparison } from '../../utils/export'
import { encodeComparisonURL, copyToClipboard } from '../../utils/share'
import { bestDepositRate, bestLendingRate } from '../../utils/rates'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../ui/Tooltip'
import { cn } from '../../lib/utils'

const listStyle = { margin: 0, padding: '0 0 0 16px' }

const RATE_KEYS = new Set(['depositRates', 'lendingRates'])

const sortByName = (arr) => [...arr].sort((a, b) => ecomp(a.name, b.name))

const getRepresentativeRate = (product, key) => {
  return key === 'depositRates' ? bestDepositRate(product[key]) : bestLendingRate(product[key])
}

const getHighlight = (products, key) => {
  const higherIsBetter = key === 'depositRates'
  const values = products.map(pd => getRepresentativeRate(pd.product, key))
  const defined = values.filter(v => v !== null)
  if (defined.length < 2) return null
  const bestVal = higherIsBetter ? Math.max(...defined) : Math.min(...defined)
  const worstVal = higherIsBetter ? Math.min(...defined) : Math.max(...defined)
  if (bestVal === worstVal) return null
  return { bestIdx: values.indexOf(bestVal), worstIdx: values.indexOf(worstVal) }
}

const renderRow = (product, key) => {
  const val = product[key]
  switch (key) {
    case 'description':
    case 'brand':
    case 'brandName':
      return val || null
    case 'lastUpdated':
    case 'effectiveFrom':
    case 'effectiveTo':
      return val ? format(val) : null
    case 'isTailored':
      return val ? 'Yes' : 'No'
    case 'applicationUri':
      return val ? <a href={val} target="_blank" rel="noopener noreferrer">Apply →</a> : null
    case 'additionalInformation':
      return val ? <AdditionalInfo additionalInfo={val} tableCell /> : null
    case 'bundles':
      return val?.length > 0 ? <ul style={listStyle}>{sortByName(val).map((x, i) => <Bundle key={i} bundle={x} />)}</ul> : null
    case 'constraints':
      return val?.length > 0 ? <ul style={listStyle}>{sortByName(val).map((x, i) => <Constraint key={i} constraint={x} />)}</ul> : null
    case 'depositRates':
      return val?.length > 0 ? <ul style={listStyle}>{sortByName(val).map((x, i) => <DepositRate key={i} depositRate={x} compact />)}</ul> : null
    case 'lendingRates':
      return val?.length > 0 ? <ul style={listStyle}>{sortByName(val).map((x, i) => <LendingRate key={i} lendingRate={x} compact />)}</ul> : null
    case 'eligibility':
      return val?.length > 0 ? <ul style={listStyle}>{sortByName(val).map((x, i) => <Eligibility key={i} eligibility={x} />)}</ul> : null
    case 'features':
      return val?.length > 0 ? <ul style={listStyle}>{sortByName(val).map((x, i) => <Feature key={i} feature={x} />)}</ul> : null
    case 'fees':
      return val?.length > 0 ? <ul style={listStyle}>{sortByName(val.filter(Boolean)).map((x, i) => <Fee key={i} fee={x} />)}</ul> : null
    case 'cardArt':
      return val?.length > 0 ? <ul style={listStyle}>{val.map((x, i) => <CardArt key={i} cardArt={x} />)}</ul> : null
    default:
      return null
  }
}

const toText = (product, key) => {
  const val = product[key]
  if (val === null || val === undefined) return ''
  switch (key) {
    case 'lastUpdated': case 'effectiveFrom': case 'effectiveTo':
      return val ? format(val) : ''
    case 'isTailored':
      return val ? 'Yes' : 'No'
    case 'additionalInformation':
      return typeof val === 'object'
        ? Object.entries(val).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('; ')
        : String(val)
    case 'bundles':
      return val?.map(x => x.name).filter(Boolean).join('; ') || ''
    case 'constraints':
      return val?.map(x => [x.constraintType, x.additionalValue].filter(Boolean).join(' ')).join('; ') || ''
    case 'depositRates':
      return val?.map(x => `${x.depositRateType}${x.rate ? ' ' + (parseFloat(x.rate) * 100).toFixed(2) + '%' : ''}`).join('; ') || ''
    case 'lendingRates':
      return val?.map(x => `${x.lendingRateType}${x.rate ? ' ' + (parseFloat(x.rate) * 100).toFixed(2) + '%' : ''}`).join('; ') || ''
    case 'eligibility':
      return val?.map(x => [x.eligibilityType, x.additionalValue].filter(Boolean).join(': ')).join('; ') || ''
    case 'features':
      return val?.map(x => [x.featureType, x.additionalValue].filter(Boolean).join(': ')).join('; ') || ''
    case 'fees':
      return val?.filter(Boolean).map(x => [x.name, x.amount ? '$' + x.amount : '', x.feeType ? '(' + x.feeType + ')' : ''].filter(Boolean).join(' ')).join('; ') || ''
    case 'cardArt':
      return val?.length ? `${val.length} image(s)` : ''
    default:
      return val ? String(val) : ''
  }
}

const IconAction = ({ label, onClick, children }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline" size="icon" onClick={onClick} aria-label={label}>
        {children}
      </Button>
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
)

const BankingComparisonPanel = ({ dataSources, products }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const rowData = useMemo(() => {
    if (!products || products.length === 0) return []
    return productDataKeys.map(dataKey => {
      const cells = products.map(pd => renderRow(pd.product, dataKey.key))
      const hasAny = cells.some(c => c !== null && c !== undefined && c !== false)
      if (!hasAny) return null
      const highlight = RATE_KEYS.has(dataKey.key) ? getHighlight(products, dataKey.key) : null
      return { dataKey, cells, highlight }
    }).filter(Boolean)
  }, [products])

  const handleDownload = useCallback(() => {
    if (!products || products.length === 0) return
    const headers = ['Field', ...products.map(pd => `${dataSources[pd.dataSourceIdx]?.name} - ${pd.product.name}`)]
    const rows = productDataKeys
      .map(dk => {
        const cells = products.map(pd => toText(pd.product, dk.key))
        if (cells.every(c => !c)) return null
        return [dk.label, ...cells]
      })
      .filter(Boolean)
    const esc = v => `"${String(v).replace(/"/g, '""')}"`
    const csv = [headers, ...rows].map(row => row.map(esc).join(',')).join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `comparison-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [products, dataSources])

  const handleShare = useCallback(async () => {
    const url = encodeComparisonURL(products)
    await copyToClipboard(url)
    alert('Comparison link copied to clipboard! Share this link with anyone to show them your comparison.')
  }, [products])

  if (!products || products.length === 0) return null

  const colWidth = `${85 / products.length}%`

  return (
    <Card className="mb-4 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 hover:bg-accent/50 border-l-4 border-primary transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-primary">Product Comparison</span>
          <Badge variant="primary">{products.length} products</Badge>
        </div>
        <ChevronDown className={cn('w-5 h-5 text-primary transition-transform duration-300', isExpanded && 'rotate-180')} />
      </button>

      {isExpanded && (
        <div className="mx-auto my-5 w-11/12 rounded-lg border border-border bg-muted/30 p-4">
        <ComparisonStats products={products} />
        <RateChart products={products} dataSources={dataSources} />

        {products.some(p => p.product.lendingRates?.length) && (
          <LoanCalculator products={products.map(p => p.product)} dataSources={dataSources} />
        )}
        {products.some(p => p.product.depositRates?.length) && (
          <SavingsCalculator products={products.map(p => p.product)} />
        )}
        <FeatureMatrix products={products} dataSources={dataSources} />

        <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse border-spacing-0 hidden md:table">
          <thead>
            <tr>
              <th className="bg-muted/50 border-t-2 border-primary text-left text-xs font-bold text-foreground/90 p-3 px-3.5 border-r-2 border-border w-1/6 min-w-32" />
              {products.map((pd, i) => (
                <th key={i} className="bg-muted/50 border-t-2 border-primary px-3.5 py-3 border-r border-border last:border-r-0 text-center" style={{ width: colWidth }}>
                  <div className="text-xs font-bold text-primary">{dataSources[pd.dataSourceIdx]?.name}</div>
                  <div className="font-bold text-foreground text-sm">{pd.product.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowData.map(({ dataKey, cells, highlight }, rowIdx) => (
              <tr key={dataKey.key} className={cn('transition-colors duration-200 hover:bg-primary/5', rowIdx % 2 === 0 ? 'bg-card' : 'bg-muted/30')}>
                <td className={cn('text-left font-bold text-foreground/90 text-xs px-3.5 py-3 border-r-2 border-border sticky left-0 z-10 w-1/6 min-w-32', rowIdx % 2 === 0 ? 'bg-card' : 'bg-muted/30')}>
                  {dataKey.label}
                </td>
                {cells.map((cell, i) => {
                  const isBest = highlight?.bestIdx === i
                  const isWorst = highlight?.worstIdx === i
                  const accent = isBest ? 'border-l-2 border-emerald-500' :
                                 isWorst ? 'border-l-2 border-destructive' :
                                 'border-r border-border last:border-r-0'
                  return (
                    <td
                      key={i}
                      className={cn('align-top text-center text-sm p-3 px-3.5 text-foreground/90 transition-colors duration-200', accent, !cell && 'opacity-50')}
                    >
                      {(isBest || isWorst) && (
                        <span className={cn(
                          'inline-block mb-1.5 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded',
                          isBest ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-destructive bg-destructive/10'
                        )}>
                          {isBest ? 'Best' : 'Worst'}
                        </span>
                      )}
                      <div>{cell || '—'}</div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <div className="md:hidden px-2 py-4">
          {products.map((pd, prodIdx) => (
            <div key={prodIdx} className="mb-4 p-3 border border-border rounded-lg bg-card break-inside-avoid">
              <div className="font-bold text-sm text-foreground mb-3 pb-2 border-b-2 border-border">
                {dataSources[pd.dataSourceIdx]?.name} — {pd.product.name}
              </div>
              {rowData.map(({ dataKey, cells }) => {
                const cell = cells[prodIdx]
                if (!cell) return null
                return (
                  <div key={dataKey.key} className="grid grid-cols-[45%_1fr] gap-2 py-2 px-0 text-xs border-b border-border last:border-b-0">
                    <div className="font-semibold text-muted-foreground break-words">{dataKey.label}:</div>
                    <div className="text-foreground/90 text-right break-words">{cell}</div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      )}

      <div className="px-4 py-2 flex justify-between items-center flex-wrap gap-2 border-t border-border">
        <div className="flex gap-3 items-center text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-500/20 border border-emerald-500" />
            Best rate
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-destructive/20 border border-destructive" />
            Worst rate
          </span>
        </div>
        <TooltipProvider delayDuration={200}>
          <div className="flex gap-2">
            <IconAction label="Share comparison link" onClick={handleShare}>
              <Link2 className="w-4 h-4" />
            </IconAction>
            <IconAction label="Open report in a new tab" onClick={() => generatePDFComparison(products, dataSources, 'html')}>
              <FileText className="w-4 h-4" />
            </IconAction>
            <IconAction label="Export as CSV" onClick={handleDownload}>
              <Download className="w-4 h-4" />
            </IconAction>
          </div>
        </TooltipProvider>
      </div>
    </Card>
  )
}

const mapStateToProps = state => ({
  dataSources: state.dataSources,
  products: state.bankingComparison,
})

export default connect(mapStateToProps)(BankingComparisonPanel)
