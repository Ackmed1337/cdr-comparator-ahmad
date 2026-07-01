import React from 'react'
import Product from './Product'
import { translateProductCategory } from '../../../utils/dict'

const containerStyle = { marginBottom: 10 }

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '5px 10px',
  background: '#eff6ff',
  borderLeft: '3px solid #2563eb',
  borderRadius: '0 6px 6px 0',
  marginBottom: 4,
}

const titleStyle = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '#1d4ed8',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const badgeStyle = {
  background: '#2563eb',
  color: '#fff',
  borderRadius: 20,
  padding: '1px 8px',
  fontSize: '0.68rem',
  fontWeight: 700,
}

const ProductCategory = ({ category, products, dataSourceIndex }) => (
  <div style={containerStyle}>
    <div style={headerStyle}>
      <span style={titleStyle}>
        {translateProductCategory(category)}
      </span>
      <span style={badgeStyle}>
        {products.length}
      </span>
    </div>
    {products
      .slice()
      .sort((a, b) => a.name < b.name ? -1 : 1)
      .map(product => <Product key={product.productId} product={product} dataSourceIndex={dataSourceIndex} />)
    }
  </div>
)

export default React.memo(ProductCategory)
