import React from 'react'

const ComparisonStats = ({ products }) => {
  if (!products || products.length < 2) return null

  const stats = {
    productsCompared: products.length,
    avgDepositRate: products.reduce((sum, pd) => {
      const rates = (pd.product.depositRates || [])
        .map(r => parseFloat(r.rate))
        .filter(r => !isNaN(r))
      return sum + (rates.length ? Math.max(...rates) : 0)
    }, 0) / products.length,
    avgLendingRate: products.reduce((sum, pd) => {
      const rates = (pd.product.lendingRates || [])
        .map(r => parseFloat(r.rate))
        .filter(r => !isNaN(r))
      return sum + (rates.length ? Math.min(...rates) : 0)
    }, 0) / products.length,
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-3 p-0 pb-3 border-b border-slate-700">
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 sm:p-2 transition-all duration-200 hover:border-blue-500/50">
        <div className="text-xs font-semibold text-slate-400 uppercase mb-1.5 sm:mb-1">Products</div>
        <div className="text-2xl font-bold text-blue-400">{stats.productsCompared}</div>
      </div>
      {stats.avgDepositRate > 0 && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 sm:p-2 transition-all duration-200 hover:border-green-500/50">
          <div className="text-xs font-semibold text-slate-400 uppercase mb-1.5 sm:mb-1">Avg Deposit</div>
          <div className="text-2xl font-bold text-green-400">{(stats.avgDepositRate * 100).toFixed(2)}%</div>
        </div>
      )}
      {stats.avgLendingRate > 0 && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 sm:p-2 transition-all duration-200 hover:border-red-500/50">
          <div className="text-xs font-semibold text-slate-400 uppercase mb-1.5 sm:mb-1">Avg Lending</div>
          <div className="text-2xl font-bold text-red-400">{(stats.avgLendingRate * 100).toFixed(2)}%</div>
        </div>
      )}
    </div>
  )
}

export default React.memo(ComparisonStats)
