import React, { useState, useCallback, useMemo } from 'react'

const QUICK_FILTERS = [
  { label: 'High Rates', key: 'highRate', test: (p) => {
    const rates = [...(p.depositRates || []), ...(p.lendingRates || [])].map(r => parseFloat(r.rate)).filter(r => !isNaN(r))
    return rates.some(r => r > 0.04)
  }},
  { label: 'No Fees', key: 'noFees', test: (p) => !p.fees || p.fees.length === 0 },
  { label: 'Offset Account', key: 'offset', test: (p) => p.features?.some(f => f.featureType === 'OFFSET') },
  { label: 'Digital Wallet', key: 'wallet', test: (p) => p.features?.some(f => f.featureType === 'DIGITAL_WALLET') },
  { label: 'Cashback', key: 'cashback', test: (p) => p.features?.some(f => f.featureType === 'CASHBACK_OFFER') },
]

const ProductSearch = ({ products, onFilter }) => {
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState([])

  const handleToggleFilter = useCallback(filterKey => {
    setActiveFilters(prev => {
      const updated = prev.includes(filterKey)
        ? prev.filter(k => k !== filterKey)
        : [...prev, filterKey]

      const filtered = products.filter(p => {
        if (search && !p.name?.toLowerCase().includes(search.toLowerCase())) return false
        if (updated.length === 0) return true
        return updated.every(filterKey => {
          const filter = QUICK_FILTERS.find(f => f.key === filterKey)
          return filter?.test(p)
        })
      })

      onFilter(filtered)
      return updated
    })
  }, [products, search, onFilter])

  const handleSearchChange = useCallback(e => {
    const value = e.target.value
    setSearch(value)

    const filtered = products.filter(p => {
      if (value && !p.name?.toLowerCase().includes(value.toLowerCase())) return false
      if (activeFilters.length === 0) return true
      return activeFilters.every(filterKey => {
        const filter = QUICK_FILTERS.find(f => f.key === filterKey)
        return filter?.test(p)
      })
    })

    onFilter(filtered)
  }, [products, activeFilters, onFilter])

  const handleClear = useCallback(() => {
    setSearch('')
    setActiveFilters([])
    onFilter(products)
  }, [products, onFilter])

  const resultCount = useMemo(() => {
    if (!search && activeFilters.length === 0) return products.length
    return products.filter(p => {
      if (search && !p.name?.toLowerCase().includes(search.toLowerCase())) return false
      if (activeFilters.length === 0) return true
      return activeFilters.every(filterKey => {
        const filter = QUICK_FILTERS.find(f => f.key === filterKey)
        return filter?.test(p)
      })
    }).length
  }, [products, search, activeFilters])

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
          onChange={handleSearchChange}
          className="w-full pl-10 pr-10 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        {(search || activeFilters.length > 0) && (
          <button
            onClick={handleClear}
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
            onClick={() => handleToggleFilter(filter.key)}
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

      <div className="text-xs text-slate-500 dark:text-slate-400">
        {resultCount} product{resultCount !== 1 ? 's' : ''} found {activeFilters.length > 0 && `with ${activeFilters.length} filter(s)`}
      </div>
    </div>
  )
}

export default React.memo(ProductSearch)
