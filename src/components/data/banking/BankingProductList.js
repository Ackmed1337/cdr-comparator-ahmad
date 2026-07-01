import React from 'react'
import { connect } from 'react-redux'
import { START_RETRIEVE_PRODUCT_LIST, startRetrieveProductList, retrieveProductList } from '../../../store/banking/data'
import LinearProgress from '@material-ui/core/LinearProgress'
import ProductCategory from './ProductCategory'
import { normalise } from '../../../utils/url'
import { translateProductCategory } from '../../../utils/dict'

const pillBase = {
  border: 'none',
  borderRadius: 20,
  padding: '3px 10px',
  fontSize: '0.7rem',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'all 0.1s',
  whiteSpace: 'nowrap',
}

class BankingProductList extends React.Component {
  state = { inputValue: '', search: '', activeCategory: null }
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

  render() {
    const { dataSourceIndex } = this.props
    const { search, inputValue, activeCategory } = this.state
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

    const filtered = {}
    if (done) {
      const q = search.trim().toLowerCase()
      Object.entries(byCategory).forEach(([cat, prods]) => {
        if (activeCategory && cat !== activeCategory) return
        const matched = q ? prods.filter(p => p.name?.toLowerCase().includes(q)) : prods
        if (matched.length) filtered[cat] = matched
      })
    }

    const totalFiltered = Object.values(filtered).reduce((s, a) => s + a.length, 0)
    const pct = totalRecords ? (processed / totalRecords) * 100 : 0

    return (
      <div style={{ maxHeight: 420, overflow: 'auto', paddingRight: 4 }}>
        {progress === START_RETRIEVE_PRODUCT_LIST && (
          <div style={{ padding: '12px 0' }}>
            <LinearProgress style={{ width: '100%', marginBottom: 8 }} />
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Fetching product list...</span>
          </div>
        )}
        {!!totalRecords && processed < totalRecords && (
          <div style={{ padding: '4px 0 8px' }}>
            <LinearProgress variant="determinate" value={pct} style={{ width: '100%', marginBottom: 6 }} />
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Loading details {processed} / {totalRecords}
            </span>
          </div>
        )}
        {done && products && (
          <>
            {categories.length > 1 && (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                <button
                  onClick={this.handleResetCategory}
                  style={{
                    ...pillBase,
                    background: activeCategory === null ? '#2563eb' : '#f1f5f9',
                    color: activeCategory === null ? '#fff' : '#475569',
                  }}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => this.handleToggleCategory(cat)}
                    style={{
                      ...pillBase,
                      background: activeCategory === cat ? '#2563eb' : '#f1f5f9',
                      color: activeCategory === cat ? '#fff' : '#475569',
                    }}
                  >
                    {translateProductCategory(cat)}
                  </button>
                ))}
              </div>
            )}
            <div style={{ position: 'relative', marginBottom: 8 }}>
              <input
                type="text"
                placeholder="Filter products..."
                value={inputValue}
                onChange={this.handleSearchChange}
                style={{
                  width: '100%',
                  padding: '6px 28px 6px 10px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  fontSize: '0.82rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#1e293b',
                  background: '#fff',
                }}
              />
              {inputValue && (
                <button
                  onClick={() => this.setState({ inputValue: '', search: '' })}
                  style={{
                    position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8',
                    fontSize: 14, lineHeight: 1, padding: 2,
                  }}
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
          <div style={{ padding: '12px 0', fontSize: '0.82rem', color: '#94a3b8' }}>
            {search.trim() ? `No products matching "${search}"` : 'No products found.'}
          </div>
        )}
        {done && (search.trim() || activeCategory) && totalFiltered > 0 && (
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', padding: '4px 2px' }}>
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
