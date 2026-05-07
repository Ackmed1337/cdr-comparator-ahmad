import React from 'react'
import { connect } from 'react-redux'
import { START_RETRIEVE_PRODUCT_LIST, startRetrieveProductList, retrieveProductList } from '../../../store/banking/data'
import LinearProgress from '@material-ui/core/LinearProgress'
import ProductCategory from './ProductCategory'
import { normalise } from '../../../utils/url'

class BankingProductList extends React.Component {
  componentDidMount() {
    const { dataSourceIndex, dataSource, versionInfo } = this.props
    const base = normalise(dataSource.url)
    this.props.startRetrieveProductList(dataSourceIndex)
    this.props.retrieveProductList(dataSourceIndex, base, base + '/banking/products', versionInfo.xV, versionInfo.xMinV)
  }

  render() {
    const { dataSourceIndex } = this.props
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
        {products && done && Object.keys(byCategory).sort().map((cat, i) => (
          <ProductCategory key={i} category={cat} products={byCategory[cat]} dataSourceIndex={dataSourceIndex} />
        ))}
        {products && done && Object.keys(byCategory).length === 0 && (
          <div style={{ padding: '12px 0', fontSize: '0.82rem', color: '#94a3b8' }}>No products found.</div>
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
