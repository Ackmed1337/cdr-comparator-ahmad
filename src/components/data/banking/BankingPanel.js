import React, { useState } from 'react'
import { connect } from 'react-redux'
import BankingProductList from './BankingProductList'
import { compareProducts } from '../../../store/banking/comparison'

const BankingPanel = (props) => {
  const { dataSources, savedDataSourcesCount } = props
  const [expanded, setExpanded] = useState(true)

  const compare = () => {
    props.compareProducts(props.selectedProducts)
    setExpanded(false)
  }

  const selCount = props.selectedProducts.length
  const canCompare = selCount >= 2 && selCount <= 4

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-xl">
      {/* Panel Header/Accordion Summary */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-b border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Banking Products</h2>
          {savedDataSourcesCount > 0 && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-bold px-2 py-1 rounded-full">
              {savedDataSourcesCount} source{savedDataSourcesCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <svg
          className={`w-6 h-6 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* Panel Details/Content */}
      {expanded && (
        <div className="p-6 max-w-full mx-auto">
          {savedDataSourcesCount > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataSources.map((ds, index) =>
                isBankingDataSource(ds) && (
                  <div key={index} className="flex flex-col">
                    {/* Data Source Header */}
                    <div className="flex items-center gap-3 p-3 mb-4 bg-slate-50 dark:bg-slate-900 border-l-4 border-blue-500 rounded-lg border border-slate-200 dark:border-slate-700">
                      {ds.icon && <img src={ds.icon} alt="" className="w-7 h-7 object-contain flex-shrink-0" onError={e => { e.target.style.display = 'none' }} />}
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{ds.name}</span>
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
            <div className="py-8 px-6 text-center text-slate-500 dark:text-slate-400 text-sm">
              Add a data source above to load banking products.
            </div>
          )}
        </div>
      )}

      {/* Panel Footer/Actions */}
      <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selCount > 0 && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {selCount} product{selCount !== 1 ? 's' : ''} selected
                {selCount > 4 && <span className="text-red-500 ml-1">(max 4)</span>}
              </span>
            )}
          </div>

          {/* Floating Compare Button */}
          <button
            onClick={compare}
            disabled={!canCompare}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
              canCompare
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/50 cursor-pointer'
                : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Compare {canCompare ? `(${selCount})` : ''}
          </button>
        </div>
      </div>
    </div>
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
