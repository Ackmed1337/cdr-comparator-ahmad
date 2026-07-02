import React, { useMemo, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import Tooltip from '@material-ui/core/Tooltip'
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

const listStyle = { margin: 0, padding: '0 0 0 16px' }

const RATE_KEYS = new Set(['depositRates', 'lendingRates'])

const sortByName = (arr) => [...arr].sort((a, b) => ecomp(a.name, b.name))

const getRepresentativeRate = (product, key) => {
  const val = product[key]
  if (!val?.length) return null
  const rates = val.map(r => parseFloat(r.rate)).filter(r => !isNaN(r))
  if (!rates.length) return null
  return key === 'depositRates' ? Math.max(...rates) : Math.min(...rates)
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
      return val?.length > 0 ? <ul style={listStyle}>{sortByName(val).map((x, i) => <DepositRate key={i} depositRate={x} />)}</ul> : null
    case 'lendingRates':
      return val?.length > 0 ? <ul style={listStyle}>{sortByName(val).map((x, i) => <LendingRate key={i} lendingRate={x} />)}</ul> : null
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
    <div className="mb-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border-l-4 border-blue-500 transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-blue-600 dark:text-blue-400">Product Comparison</span>
          <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full">
            {products.length} products
          </span>
        </div>
        <svg className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mx-auto my-5 w-11/12 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 p-4">
        <ComparisonStats products={products} />
        <RateChart products={products} dataSources={dataSources} />

        {products.some(p => p.product.lendingRates?.length) && (
          <LoanCalculator products={products.map(p => p.product)} dataSources={dataSources} />
        )}
        {products.some(p => p.product.depositRates?.length) && (
          <SavingsCalculator products={products.map(p => p.product)} />
        )}
        <FeatureMatrix products={products} dataSources={dataSources} />

        <div className="overflow-x-auto rounded-lg border border-slate-300 dark:border-slate-700">
        <table className="w-full border-collapse border-spacing-0 hidden md:table">
          <thead>
            <tr>
              <th className="sticky top-16 z-40 bg-gradient-to-r from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 border-t-2 border-blue-500 text-left text-xs font-bold text-slate-700 dark:text-slate-300 p-3 px-3.5 border-r-2 border-slate-300 dark:border-slate-700 w-1/6 min-w-32" />
              {products.map((pd, i) => (
                <th key={i} className="sticky top-16 z-40 bg-gradient-to-r from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 border-t-2 border-blue-500 px-3.5 py-3 border-r border-slate-300 dark:border-slate-700 last:border-r-0 text-center" style={{ width: colWidth }}>
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{dataSources[pd.dataSourceIdx]?.name}</div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{pd.product.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowData.map(({ dataKey, cells, highlight }, rowIdx) => (
              <tr key={dataKey.key} className={`transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 ${rowIdx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-100 dark:bg-slate-800'}`}>
                <td className={`text-left font-bold text-slate-700 dark:text-slate-300 text-xs px-3.5 py-3 border-r-2 border-slate-300 dark:border-slate-700 sticky left-0 z-10 w-1/6 min-w-32 ${rowIdx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  {dataKey.label}
                </td>
                {cells.map((cell, i) => {
                  const isBest = highlight?.bestIdx === i
                  const isWorst = highlight?.worstIdx === i
                  const bgColor = isBest ? 'bg-green-100 dark:bg-green-900/40 border-l-4 border-t-4 border-green-500 text-green-700 dark:text-green-300' :
                                 isWorst ? 'bg-red-100 dark:bg-red-900/40 border-l-4 border-t-4 border-red-500 text-red-700 dark:text-red-300' :
                                 'text-slate-700 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700 last:border-r-0'
                  return (
                    <td
                      key={i}
                      className={`text-center text-sm p-3 px-3.5 transition-colors duration-200 ${bgColor} ${!cell ? 'opacity-50' : ''}`}
                    >
                      {cell || '—'}
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
            <div key={prodIdx} className="mb-4 p-3 border border-slate-400 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 break-inside-avoid">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-3 pb-2 border-b-2 border-slate-300 dark:border-slate-700">
                {dataSources[pd.dataSourceIdx]?.name} — {pd.product.name}
              </div>
              {rowData.map(({ dataKey, cells }) => {
                const cell = cells[prodIdx]
                if (!cell) return null
                return (
                  <div key={dataKey.key} className="grid grid-cols-[45%_1fr] gap-2 py-2 px-0 text-xs border-b border-slate-300 dark:border-slate-700 last:border-b-0">
                    <div className="font-semibold text-slate-500 dark:text-slate-400 break-words">{dataKey.label}:</div>
                    <div className="text-slate-700 dark:text-slate-300 text-right break-words">{cell}</div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      )}

      <div className="px-4 py-2 flex justify-between items-center flex-wrap gap-2 border-t border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="flex gap-3 items-center text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-900/50 border border-green-500" />
            Best rate
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-900/50 border border-red-500" />
            Worst rate
          </span>
        </div>
        <div className="flex gap-2">
          <Tooltip title="Share this comparison">
            <button
              onClick={handleShare}
              aria-label="Share comparison link"
              className="p-2 rounded-full bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 transition-colors duration-200 hover:shadow-lg"
            >
              🔗
            </button>
          </Tooltip>
          <Tooltip title="Open report in a new tab">
            <button
              onClick={() => generatePDFComparison(products, dataSources, 'html')}
              aria-label="Open comparison report in a new tab"
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 transition-colors duration-200 hover:shadow-lg"
            >
              📄
            </button>
          </Tooltip>
          <Tooltip title="Export as CSV">
            <button
              onClick={handleDownload}
              aria-label="Export comparison as CSV"
              className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 hover:shadow-lg"
            >
              📥
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  dataSources: state.dataSources,
  products: state.bankingComparison,
})

export default connect(mapStateToProps)(BankingComparisonPanel)
