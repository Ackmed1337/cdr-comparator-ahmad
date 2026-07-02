import React, { useMemo } from 'react'
import { bestDepositRate, bestLendingRate } from '../../utils/rates'
import { cn } from '../../lib/utils'

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

  const renderRates = (rates, label, higherIsBetter) => {
    const validRates = rates.filter(r => r !== null)
    if (!validRates.length) return null

    const bestVal = higherIsBetter ? Math.max(...validRates) : Math.min(...validRates)
    const worstVal = higherIsBetter ? Math.min(...validRates) : Math.max(...validRates)
    const showRanking = validRates.length > 1 && bestVal !== worstVal

    return (
      <div key={label} className="pb-3 mb-4 border-b border-border/60 last:border-b-0 last:mb-0 last:pb-0">
        <div className="text-sm font-bold text-foreground/90 mb-3">{label}</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {rates.map((rate, i) => {
            const isBest = showRanking && rate === bestVal
            const isWorst = showRanking && rate === worstVal
            return (
              <div
                key={i}
                className={cn(
                  'rounded-md border p-2.5 text-center',
                  isBest ? 'border-emerald-500/50 bg-emerald-500/5' : isWorst ? 'border-destructive/50 bg-destructive/5' : 'border-border'
                )}
              >
                {(isBest || isWorst) && (
                  <span className={cn(
                    'inline-block mb-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded',
                    isBest ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-destructive bg-destructive/10'
                  )}>
                    {isBest ? 'Best' : 'Worst'}
                  </span>
                )}
                <div className={cn(
                  'text-lg font-bold',
                  rate === null ? 'text-muted-foreground' : isBest ? 'text-emerald-600 dark:text-emerald-400' : isWorst ? 'text-destructive' : 'text-foreground'
                )}>
                  {rate !== null ? `${(rate * 100).toFixed(2)}%` : 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 truncate">
                  {dataSources[products[i].dataSourceIdx]?.name || 'Source'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="py-3 flex flex-col gap-1">
      {hasDeposit && renderRates(depositRates, 'Max Deposit Rate', true)}
      {hasLending && renderRates(lendingRates, 'Min Lending Rate', false)}
    </div>
  )
}

export default React.memo(RateChart)
