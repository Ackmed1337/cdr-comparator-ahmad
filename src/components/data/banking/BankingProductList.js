import React from 'react'
import { connect } from 'react-redux'
import { SearchX } from 'lucide-react'
import { START_RETRIEVE_PRODUCT_LIST, startRetrieveProductList, retrieveProductList } from '../../../store/banking/data'
import ProductCategory from './ProductCategory'
import ProductSearch, { QUICK_FILTERS } from './ProductSearch'
import FeatureFilter from './FeatureFilter'
import { normalise } from '../../../utils/url'
import { translateProductCategory } from '../../../utils/dict'
import { Progress } from '../../ui/Progress'
import { Button } from '../../ui/Button'

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
            <Progress value={100} className="mb-2 animate-pulse" />
            <span className="text-xs text-muted-foreground font-medium">Fetching product list...</span>
          </div>
        )}
        {!!totalRecords && processed < totalRecords && (
          <div className="py-3 pb-3 mb-6 px-1 animate-fadeIn">
            <Progress value={pct} className="mb-1.5" />
            <span className="text-xs text-muted-foreground font-medium">
              Loading details {processed} / {totalRecords}
            </span>
          </div>
        )}
        {done && products && (
          <>
            {categories.length > 1 && (
              <div className="flex gap-2 flex-wrap mb-6 px-1 animate-fadeIn">
                <Button
                  size="sm"
                  variant={activeCategory === null ? 'primary' : 'outline'}
                  className="rounded-full"
                  onClick={this.handleResetCategory}
                >
                  All
                </Button>
                {categories.map(cat => (
                  <Button
                    key={cat}
                    size="sm"
                    variant={activeCategory === cat ? 'primary' : 'outline'}
                    className="rounded-full"
                    onClick={() => this.handleToggleCategory(cat)}
                  >
                    {translateProductCategory(cat)}
                  </Button>
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
          <div className="text-xs text-muted-foreground mb-3 px-1 animate-fadeIn">
            {totalFiltered} product{totalFiltered !== 1 ? 's' : ''} found
          </div>
        )}
        {done && Object.keys(filtered).sort().map((cat, i) => (
          <div key={i} className="px-1 animate-fadeIn" style={{ animationDelay: `${i * 30}ms` }}>
            <ProductCategory category={cat} products={filtered[cat]} dataSourceIndex={dataSourceIndex} />
          </div>
        ))}
        {done && products && Object.keys(filtered).length === 0 && (
          <div className="py-8 text-sm text-muted-foreground text-center animate-fadeIn">
            <SearchX className="w-10 h-10 mx-auto mb-2 opacity-50" strokeWidth={1.5} />
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
