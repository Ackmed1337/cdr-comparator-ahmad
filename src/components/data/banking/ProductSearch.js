import React from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '../../ui/Input'
import { Badge } from '../../ui/Badge'
import { cn } from '../../../lib/utils'

export const QUICK_FILTERS = [
  { label: 'High Rates', key: 'highRate', test: (p) => {
    const rates = [...(p.depositRates || []), ...(p.lendingRates || [])].map(r => parseFloat(r.rate)).filter(r => !isNaN(r))
    return rates.some(r => r > 0.04)
  }},
  { label: 'No Fees', key: 'noFees', test: (p) => !p.fees || p.fees.length === 0 },
  { label: 'Offset Account', key: 'offset', test: (p) => p.features?.some(f => f.featureType === 'OFFSET') },
  { label: 'Digital Wallet', key: 'wallet', test: (p) => p.features?.some(f => f.featureType === 'DIGITAL_WALLET') },
  { label: 'Cashback', key: 'cashback', test: (p) => p.features?.some(f => f.featureType === 'CASHBACK_OFFER') },
]

const ProductSearch = ({ search, onSearchChange, activeFilters, onToggleFilter, onClear }) => {
  return (
    <div className="mb-3">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search products by name..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="pl-10 pr-10 h-10"
        />
        {(search || activeFilters.length > 0) && (
          <button
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap mb-2">
        {QUICK_FILTERS.map(filter => (
          <Badge
            key={filter.key}
            variant={activeFilters.includes(filter.key) ? 'primary' : 'outline'}
            onClick={() => onToggleFilter(filter.key)}
            className={cn(
              'cursor-pointer select-none',
              activeFilters.includes(filter.key) && 'ring-1 ring-primary'
            )}
          >
            {filter.label}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export default React.memo(ProductSearch)
