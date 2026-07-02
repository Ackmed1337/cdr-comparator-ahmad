import React from 'react'
import Product from './Product'
import { translateProductCategory } from '../../../utils/dict'
import { Badge } from '../../ui/Badge'

const ProductCategory = ({ category, products, dataSourceIndex }) => (
  <div className="mb-4 last:mb-0">
    <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 border-l-2 border-primary rounded-lg mb-3 transition-colors duration-200">
      <span className="text-xs uppercase tracking-widest font-bold text-foreground/80">
        {translateProductCategory(category)}
      </span>
      <Badge variant="primary" className="ml-auto">{products.length}</Badge>
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
