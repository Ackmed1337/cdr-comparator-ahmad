import React from 'react'
import Product from './Product'
import { translateProductCategory } from '../../../utils/dict'

const ProductCategory = ({ category, products, dataSourceIndex }) => (
  <div className="mb-3">
    <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/30 border-l-2 border-blue-500 rounded mb-1">
      <span className="text-xs uppercase tracking-widest font-bold text-slate-400">
        {translateProductCategory(category)}
      </span>
      <span className="text-blue-300 bg-blue-900/30 rounded-full text-xs font-bold px-2 py-0.5">
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
