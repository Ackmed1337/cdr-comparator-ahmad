import React, { useState, useCallback } from 'react'

const FEATURE_TYPES = [
  'CARD_ACCESS', 'ADDITIONAL_CARDS', 'CASHBACK_OFFER', 'FREE_TXNS', 'UNLIMITED_TXNS',
  'OFFSET', 'OVERDRAFT', 'REDRAW', 'BALANCE_TRANSFERS', 'DIGITAL_BANKING',
  'DIGITAL_WALLET', 'LOYALTY_PROGRAM', 'NOTIFICATIONS', 'BONUS_REWARDS',
  'INSURANCE', 'RELATIONSHIP_MANAGEMENT', 'BILL_PAY', 'NPP', 'COMPLEMENTARY_PRODUCT_DISCOUNTS'
]

const FeatureFilter = ({ onFilterChange }) => {
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = useCallback(feature => {
    setSelectedFeatures(prev => {
      const updated = prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
      onFilterChange(updated)
      return updated
    })
  }, [onFilterChange])

  const handleClearAll = useCallback(() => {
    setSelectedFeatures([])
    onFilterChange([])
  }, [onFilterChange])

  const filteredFeatures = FEATURE_TYPES.filter(f =>
    f.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mb-3 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
      >
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Filter by Features {selectedFeatures.length > 0 && `(${selectedFeatures.length})`}
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {isOpen && (
        <div className="border-t border-slate-300 dark:border-slate-700 p-3 bg-slate-100/50 dark:bg-slate-800/50">
          <input
            type="text"
            placeholder="Search features..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 mb-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 max-h-64 overflow-y-auto">
            {filteredFeatures.map(feature => (
              <label key={feature} className="flex items-center gap-2 cursor-pointer group">
                <div className="relative w-4 h-4 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feature)}
                    onChange={() => handleToggle(feature)}
                    className="absolute opacity-0 w-4 h-4"
                  />
                  <div className={`w-4 h-4 rounded border-2 transition-all duration-200 ${
                    selectedFeatures.includes(feature)
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900 group-hover:border-blue-500'
                  }`}>
                    {selectedFeatures.includes(feature) && (
                      <svg className="w-3 h-3 text-white absolute inset-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-200">
                  {feature.replace(/_/g, ' ')}
                </span>
              </label>
            ))}
          </div>

          {selectedFeatures.length > 0 && (
            <button
              onClick={handleClearAll}
              className="w-full px-3 py-2 bg-slate-200/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 text-xs font-medium rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200 border border-slate-400 dark:border-slate-600 hover:border-slate-500"
            >
              Clear All
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default React.memo(FeatureFilter)
