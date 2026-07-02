import React from 'react'
import { bestDepositRate, bestLendingRate } from '../../utils/rates'
import { Card } from '../ui/Card'

const StatTile = ({ label, value, accent }) => (
  <Card hoverable className="p-3">
    <div className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">{label}</div>
    <div className={`text-2xl font-bold ${accent}`}>{value}</div>
  </Card>
)

const ComparisonStats = ({ products }) => {
  if (!products || products.length < 2) return null

  const bestDepositRates = products.map(pd => bestDepositRate(pd.product.depositRates)).filter(r => r !== null)

  const bestLendingRates = products.map(pd => bestLendingRate(pd.product.lendingRates)).filter(r => r !== null)

  const average = arr => arr.length ? arr.reduce((sum, r) => sum + r, 0) / arr.length : 0

  const stats = {
    productsCompared: products.length,
    avgDepositRate: average(bestDepositRates),
    avgLendingRate: average(bestLendingRates),
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-3 pb-3 border-b border-border">
      <StatTile label="Products" value={stats.productsCompared} accent="text-primary" />
      {stats.avgDepositRate > 0 && (
        <StatTile label="Avg Deposit" value={`${(stats.avgDepositRate * 100).toFixed(2)}%`} accent="text-emerald-600 dark:text-emerald-400" />
      )}
      {stats.avgLendingRate > 0 && (
        <StatTile label="Avg Lending" value={`${(stats.avgLendingRate * 100).toFixed(2)}%`} accent="text-destructive" />
      )}
    </div>
  )
}

export default React.memo(ComparisonStats)
