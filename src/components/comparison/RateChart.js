import React, { useMemo } from 'react'
import { bestDepositRate, bestLendingRate } from '../../utils/rates'

const RateChart = ({ products, dataSources }) => {
  const depositRates = useMemo(() => {
    return products.map(pd => bestDepositRate(pd.product.depositRates))
  }, [products])

  const lendingRates = useMemo(() => {
    return products.map(pd => bestLendingRate(pd.product.lendingRates))
  }, [products])

  const hasDeposit = depositRates.some(r => r !== null)
  const hasLending = lendingRates.some(r => r !== null)

  if (!hasDeposit && !hasLending) return null

  const renderBars = (rates, label, isDeposit) => {
    const validRates = rates.filter(r => r !== null)
    if (!validRates.length) return null

    const maxRate = Math.max(...validRates)

    return (
      <div key={label} className="pb-3 mb-4 border-b border-slate-300/50 dark:border-slate-700/50 last:border-b-0 last:mb-0 last:pb-0">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">{label}</div>
        <div className="flex gap-1.5 sm:gap-1 items-end h-20 sm:h-16">
          {rates.map((rate, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end min-w-0">
              {rate !== null ? (
                <>
                  <div
                    className="w-full rounded-t-sm min-h-1 transition-all duration-200"
                    style={{
                      height: `${(rate / maxRate) * 90 + 10}px`,
                      background: isDeposit ? '#10b981' : '#ef4444',
                    }}
                  />
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-bold mt-1 sm:mt-0.5">{(rate * 100).toFixed(2)}%</div>
                </>
              ) : (
                <div className="h-3 text-slate-500 text-xs">N/A</div>
              )}
              <div className="text-xs sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 sm:mt-0.5 text-center break-words max-w-full">
                {dataSources[products[i].dataSourceIdx]?.name || 'Source'}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="py-3 flex flex-col gap-4">
      {hasDeposit && renderBars(depositRates, 'Max Deposit Rate (%)', true)}
      {hasLending && renderBars(lendingRates, 'Min Lending Rate (%)', false)}
    </div>
  )
}

export default React.memo(RateChart)
