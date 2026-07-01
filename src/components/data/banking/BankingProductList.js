import React from 'react'
import { connect } from 'react-redux'
import { START_RETRIEVE_PRODUCT_LIST, startRetrieveProductList, retrieveProductList } from '../../../store/banking/data'
import ProductCategory from './ProductCategory'
import ProductSearch from './ProductSearch'
import FeatureFilter from './FeatureFilter'
import { normalise } from '../../../utils/url'
import { translateProductCategory } from '../../../utils/dict'

class BankingProductList extends React.Component {
  state = { inputValue: '', search: '', activeCategory: null, filteredProducts: [], selectedFeatures: [] }
  _debounceTimer = null

  componentDidMount() {
    const { dataSourceIndex, dataSource, versionInfo } = this.props
    const base = normalise(dataSource.url)
    this.props.startRetrieveProductList(dataSourceIndex)
    this.props.retrieveProductList(dataSourceIndex, base, base + '/banking/products', versionInfo.xV, versionInfo.xMinV)
  }

  componentWillUnmount() {
    clearTimeout(this._debounceTimer)
  }

  handleResetCategory = () => this.setState({ activeCategory: null })

  handleToggleCategory = (cat) => {
    this.setState(prev => ({ activeCategory: prev.activeCategory === cat ? null : cat }))
  }

  handleSearchChange = (e) => {
    const value = e.target.value
    this.setState({ inputValue: value })
    clearTimeout(this._debounceTimer)
    this._debounceTimer = setTimeout(() => {
      this.setState({ search: value })
    }, 250)
  }

  handleFeatureFilterChange = (features) => {
    this.setState({ selectedFeatures: features })
  }

  handleProductSearchFilter = (filtered) => {
    this.setState({ filteredProducts: filtered })
  }

  render() {
    const { dataSourceIndex } = this.props
    const { search, inputValue, activeCategory, filteredProducts } = this.state
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

    // First filter by category and search
    let filtered = {}
    if (done) {
      const q = search.trim().toLowerCase()
      Object.entries(byCategory).forEach(([cat, prods]) => {
        if (activeCategory && cat !== activeCategory) return
        const matched = q ? prods.filter(p => p.name?.toLowerCase().includes(q)) : prods
        if (matched.length) filtered[cat] = matched
      })
    }

    // Then apply ProductSearch filters if active
    if (filteredProducts && filteredProducts.length > 0) {
      const filteredIds = new Set(filteredProducts.map(p => p.productId))
      const result = {}
      Object.entries(filtered).forEach(([cat, prods]) => {
        const matched = prods.filter(p => filteredIds.has(p.productId))
        if (matched.length) result[cat] = matched
      })
      filtered = result
    }

    const totalFiltered = Object.values(filtered).reduce((s, a) => s + a.length, 0)
    const pct = totalRecords ? (processed / totalRecords) * 100 : 0

    return (
      <div className="max-h-[420px] overflow-auto pr-1">
        {progress === START_RETRIEVE_PRODUCT_LIST && (
          <div className="py-3 mb-6">
            <div className="w-full h-2 bg-slate-700/50 rounded-full mb-2 overflow-hidden">
              <div className="h-full bg-blue-500 w-full"></div>
            </div>
            <span className="text-xs text-slate-400">Fetching product list...</span>
          </div>
        )}
        {!!totalRecords && processed < totalRecords && (
          <div className="py-1 pb-2 mb-6">
            <div className="w-full h-2 bg-slate-700/50 rounded-full mb-1.5 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${pct}%` }}
              ></div>
            </div>
            <span className="text-xs text-slate-400">
              Loading details {processed} / {totalRecords}
            </span>
          </div>
        )}
        {done && products && (
          <>
            {categories.length > 1 && (
              <div className="flex gap-2 flex-wrap mb-6">
                <button
                  onClick={this.handleResetCategory}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeCategory === null
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => this.handleToggleCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      activeCategory === cat
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {translateProductCategory(cat)}
                  </button>
                ))}
              </div>
            )}
            <ProductSearch
              products={Object.values(filtered).flat()}
              onFilter={this.handleProductSearchFilter}
            />
            <FeatureFilter onFilterChange={this.handleFeatureFilterChange} />
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Filter products..."
                value={inputValue}
                onChange={this.handleSearchChange}
                className="w-full px-3 py-2 pr-8 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
              />
              {inputValue && (
                <button
                  onClick={() => this.setState({ inputValue: '', search: '' })}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-none border-none cursor-pointer text-slate-500 hover:text-slate-300 text-lg leading-none p-1 transition-colors duration-200"
                >
                  ✕
                </button>
              )}
            </div>
          </>
        )}
        {done && Object.keys(filtered).sort().map((cat, i) => (
          <ProductCategory key={i} category={cat} products={filtered[cat]} dataSourceIndex={dataSourceIndex} />
        ))}
        {done && products && Object.keys(filtered).length === 0 && (
          <div className="py-3 text-sm text-slate-400 text-center">
            {search.trim() ? `No products matching "${search}"` : 'No products found.'}
          </div>
        )}
        {done && (search.trim() || activeCategory) && totalFiltered > 0 && (
          <div className="text-xs text-slate-400 py-1 px-0.5">
            {totalFiltered} result{totalFiltered !== 1 ? 's' : ''}
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
