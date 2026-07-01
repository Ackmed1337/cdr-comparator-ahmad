import React from 'react'

const QuickTips = () => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const tips = [
    'Use Quick Filters (High Rates, No Fees, Digital Wallet) to instantly narrow down products',
    'Search product names to quickly find specific products',
    'Compare 2-4 products side-by-side using the checkboxes',
    'Use calculators to see real dollar impact of rate differences',
    'Check the Feature Matrix to see which products have the features you need',
    'Click the share button to send comparisons to friends or save for later',
    'Toggle dark mode in the header for comfortable reading',
    'Export comparisons as HTML, CSV, or text for easy sharing',
  ]

  return (
    <div className="bg-slate-800 border border-slate-700 rounded mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-900 hover:bg-slate-800 border-l-4 border-blue-500 transition-all duration-200"
      >
        <span className="text-sm font-semibold text-blue-400">Quick Tips</span>
        <svg
          className={`ml-auto w-5 h-5 text-blue-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {isExpanded && (
        <div className="bg-slate-800 p-4 transition-all duration-300">
          <div className="grid gap-3">
            {tips.map((tip, idx) => (
              <div key={idx} className="bg-slate-900 border-l-4 border-blue-500 p-3 text-xs text-slate-300 rounded-r transition-all duration-200 hover:bg-slate-800">
                {tip}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default QuickTips
