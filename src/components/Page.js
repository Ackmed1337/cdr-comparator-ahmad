import React from 'react'
import DataSourcePanel from './data-source/DataSourcePanel'
import BankingPanel from './data/banking/BankingPanel'
import ConsolePanel from './data/ConsolePanel'
import Header from './layout/Header'
import BankingComparisonPanel from './comparison/BankingComparisonPanel'
import DiscoveryInfo from './data/discovery/DiscoveryInfo'

const tabs = ['Banking', 'Status & Outages']

function Page() {
  const [tab, setTab] = React.useState(0)

  return (
    <>
      <Header title="Comparator" />
      <div className="dark:bg-slate-950 bg-slate-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <DataSourcePanel />
          <ConsolePanel />

          {/* Tab Navigation */}
          <div className="flex gap-8 border-b border-slate-300 dark:border-slate-800 pt-2">
            {tabs.map((label, i) => (
              <button
                key={i}
                onClick={() => setTab(i)}
                className={`pb-3 font-semibold text-sm transition-all duration-200 ${
                  tab === i
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-b-2 border-transparent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className={`space-y-6 ${tab !== 0 ? 'hidden' : ''}`}>
            <BankingPanel />
            <BankingComparisonPanel />
          </div>
          <div className={tab !== 1 ? 'hidden' : ''}>
            <DiscoveryInfo />
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
