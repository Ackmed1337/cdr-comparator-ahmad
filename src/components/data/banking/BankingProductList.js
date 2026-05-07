import React from 'react'
import { connect } from 'react-redux'
import { START_RETRIEVE_PRODUCT_LIST, startRetrieveProductList, retrieveProductList } from '../../../store/banking/data'
import LinearProgress from '@material-ui/core/LinearProgress'
import ProductCategory from './ProductCategory'
import { normalise } from '../../../utils/url'

class BankingProductList extends React.Component {
  state = { search: '' }

  componentDidMount() {
    const { dataSourceIndex, dataSource, versionInfo } = this.props
    const base = normalise(dataSource.url)
    this.props.startRetrieveProductList(dataSourceIndex)
    this.props.retrieveProductList(dataSourceIndex, base, base + '/banking/products', versionInfo.xV, versionInfo.xMinV)
  }

  render() {
    const { dataSourceIndex } = this.props
    const { search } = this.state
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

    const filtered = {}
    if (done) {
      const q = search.trim().toLowerCase()
      Object.entries(byCategory).forEach(([cat, prods]) => {
        const matched = q ? prods.filter(p => p.name?.toLowerCase().includes(q)) : prods
        if (matched.length) filtered[cat] = matched
      })
    }

    const totalFiltered = Object.values(filtered).reduce((s, a) => s + a.length, 0)
    const pct = totalRecords ? (processed / totalRecords) * 100 : 0

    return (
      <div style={{ maxHeight: 380, overflow: 'auto', paddingRight: 4 }}>
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
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Filter products..."
              value={search}
              onChange={e => this.setState({ search: e.target.value })}
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
            {search && (
              <button
                onClick={() => this.setState({ search: '' })}
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
        )}
        {done && Object.keys(filtered).sort().map((cat, i) => (
          <ProductCategory key={i} category={cat} products={filtered[cat]} dataSourceIndex={dataSourceIndex} />
        ))}
        {done && products && Object.keys(filtered).length === 0 && (
          <div style={{ padding: '12px 0', fontSize: '0.82rem', color: '#94a3b8' }}>
            {search.trim() ? `No products matching "${search}"` : 'No products found.'}
          </div>
        )}
        {done && search.trim() && totalFiltered > 0 && (
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
