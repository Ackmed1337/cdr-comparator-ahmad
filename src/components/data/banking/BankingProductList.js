import React from 'react'
import { connect } from 'react-redux'
import { START_RETRIEVE_PRODUCT_LIST, startRetrieveProductList, retrieveProductList } from '../../../store/banking/data'
import ProductCategory from './ProductCategory'
import ProductSearch, { QUICK_FILTERS } from './ProductSearch'
import FeatureFilter from './FeatureFilter'
import { normalise } from '../../../utils/url'
import { translateProductCategory } from '../../../utils/dict'

class BankingProductList extends React.Component {
  state = { activeCategory: null, search: '', activeQuickFilters: [], selectedFeatures: [] }

  componentDidMount() {
    const { dataSourceIndex, dataSource, versionInfo } = this.props
    const base = normalise(dataSource.url)
    this.props.startRetrieveProductList(dataSourceIndex)
    this.props.retrieveProductList(dataSourceIndex, base, base + '/banking/products', versionInfo.xV, versionInfo.xMinV)
  }

  handleResetCategory = () => this.setState({ activeCategory: null })

  handleToggleCategory = (cat) => {
    this.setState(prev => ({ activeCategory: prev.activeCategory === cat ? null : cat }))
  }

  handleFeatureFilterChange = (features) => {
    this.setState({ selectedFeatures: features })
  }

  handleSearchChange = (value) => this.setState({ search: value })

  handleToggleQuickFilter = (key) => {
    this.setState(prev => ({
      activeQuickFilters: prev.activeQuickFilters.includes(key)
        ? prev.activeQuickFilters.filter(k => k !== key)
        : [...prev.activeQuickFilters, key],
    }))
  }

  handleClearSearch = () => this.setState({ search: '', activeQuickFilters: [] })

  render() {
    const { dataSourceIndex } = this.props
    const { activeCategory, search, activeQuickFilters, selectedFeatures } = this.state
    const data = this.props.productList[dataSourceIndex] || {}
    const { progress, totalRecords, detailRecords = 0, failedDetailRecords = 0, products, productDetails } = data
    const processed = detailRecords + failedDetailRecords
    const done = !!totalRecords && totalRecords <= processed

    const byCategory = {}
    if (done) {
      const fallback = {}
      if (failedDetailRecords > 0) products.forEach(p => { fallback[p.productId] = p })
      productDetails?.forEach(pd => {
        if (!pd) return
        byCategory[pd.productCategory] = byCategory[pd.productCategory] || []
        byCategory[pd.productCategory].push(pd)
        delete fallback[pd.productId]
      })
      Object.values(fallback).forEach(p => {
        byCategory[p.productCategory] = byCategory[p.productCategory] || []
        byCategory[p.productCategory].push(p)
      })
    }

    const categories = Object.keys(byCategory).sort()

    const q = search.trim().toLowerCase()
    const filtered = {}
    if (done) {
      Object.entries(byCategory).forEach(([cat, prods]) => {
        if (activeCategory && cat !== activeCategory) return
        const matched = prods.filter(p => {
          if (q && !p.name?.toLowerCase().includes(q)) return false
          if (activeQuickFilters.length && !activeQuickFilters.every(k => QUICK_FILTERS.find(f => f.key === k)?.test(p))) return false
          if (selectedFeatures.length && !selectedFeatures.every(ft => p.features?.some(f => f.featureType === ft))) return false
          return true
        })
        if (matched.length) filtered[cat] = matched
      })
    }

    const totalFiltered = Object.values(filtered).reduce((s, a) => s + a.length, 0)
    const filtersActive = !!activeCategory || !!q || activeQuickFilters.length > 0 || selectedFeatures.length > 0
    const pct = totalRecords ? (processed / totalRecords) * 100 : 0

    return (
      <div className="pb-2">
        {progress === START_RETRIEVE_PRODUCT_LIST && (
          <div className="py-4 mb-6 px-1 animate-fadeIn">
            <div className="w-full h-2 bg-slate-300/50 dark:bg-slate-700/50 rounded-full mb-2 overflow-hidden shadow-sm">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 w-full rounded-full animate-pulse"></div>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fetching product list...</span>
          </div>
        )}
        {!!totalRecords && processed < totalRecords && (
          <div className="py-3 pb-3 mb-6 px-1 animate-fadeIn">
            <div className="w-full h-2 bg-slate-300/50 dark:bg-slate-700/50 rounded-full mb-1.5 overflow-hidden shadow-sm">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${pct}%` }}
              ></div>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Loading details {processed} / {totalRecords}
            </span>
          </div>
        )}
        {done && products && (
          <>
            {categories.length > 1 && (
              <div className="flex gap-3 flex-wrap mb-6 px-1 animate-fadeIn">
                <button
                  onClick={this.handleResetCategory}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                    activeCategory === null
                      ? 'bg-blue-600 text-white shadow-lg hover:shadow-xl hover:bg-blue-700'
                      : 'bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => this.handleToggleCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                      activeCategory === cat
                        ? 'bg-blue-600 text-white shadow-lg hover:shadow-xl hover:bg-blue-700'
                        : 'bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {translateProductCategory(cat)}
                  </button>
                ))}
              </div>
            )}
            <div className="px-1 mb-6 animate-fadeIn">
              <ProductSearch
                search={search}
                onSearchChange={this.handleSearchChange}
                activeFilters={activeQuickFilters}
                onToggleFilter={this.handleToggleQuickFilter}
                onClear={this.handleClearSearch}
              />
            </div>
            <div className="px-1 mb-6 animate-fadeIn">
              <FeatureFilter onFilterChange={this.handleFeatureFilterChange} />
            </div>
          </>
        )}
        {done && filtersActive && (
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 px-1 animate-fadeIn">
            {totalFiltered} product{totalFiltered !== 1 ? 's' : ''} found
          </div>
        )}
        {done && Object.keys(filtered).sort().map((cat, i) => (
          <div key={i} className="px-1 animate-fadeIn" style={{ animationDelay: `${i * 30}ms` }}>
            <ProductCategory category={cat} products={filtered[cat]} dataSourceIndex={dataSourceIndex} />
          </div>
        ))}
        {done && products && Object.keys(filtered).length === 0 && (
          <div className="py-8 text-sm text-slate-500 dark:text-slate-400 text-center animate-fadeIn">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {filtersActive ? 'No products match the selected filters.' : 'No products found.'}
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  productList: state.banking,
  versionInfo: state.versionInfo.vHeaders,
})

export default connect(mapStateToProps, { startRetrieveProductList, retrieveProductList })(BankingProductList)
