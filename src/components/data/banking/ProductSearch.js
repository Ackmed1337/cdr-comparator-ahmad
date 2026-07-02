import React from 'react'

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
        <div className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search products by name..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        {(search || activeFilters.length > 0) && (
          <button
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-3 top-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap mb-2">
        {QUICK_FILTERS.map(filter => (
          <button
            key={filter.key}
            onClick={() => onToggleFilter(filter.key)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeFilters.includes(filter.key)
                ? 'bg-blue-500 text-white border border-blue-500'
                : 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-400'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default React.memo(ProductSearch)
