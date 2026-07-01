import React from 'react'
import Product from './Product'
import { translateProductCategory } from '../../../utils/dict'

const ProductCategory = ({ category, products, dataSourceIndex }) => (
  <div className="mb-4 last:mb-0">
    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-100 dark:from-slate-800/50 to-slate-100/60 dark:to-slate-800/30 border-l-2 border-blue-500 rounded-lg mb-3 shadow-md hover:shadow-lg hover:from-slate-200 dark:hover:from-slate-800/60 hover:to-slate-200/60 dark:hover:to-slate-800/40 transition-all duration-200">
      <span className="text-xs uppercase tracking-widest font-bold text-slate-700 dark:text-slate-300">
        {translateProductCategory(category)}
      </span>
      <span className="ml-auto text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-900/60 border border-blue-300 dark:border-blue-500/30 hover:border-blue-400 dark:hover:border-blue-500/50 rounded-full text-xs font-bold px-3 py-1 transition-all duration-200 cursor-default">
        {products.length}
      </span>
    </div>
    <div className="space-y-2">
      {products
        .slice()
        .sort((a, b) => a.name < b.name ? -1 : 1)
        .map(product => (
          <div key={product.productId} className="animate-fadeIn">
            <Product product={product} dataSourceIndex={dataSourceIndex} />
          </div>
        ))
      }
    </div>
  </div>
)

export default React.memo(ProductCategory)
