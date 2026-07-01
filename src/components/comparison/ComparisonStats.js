import React from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 8,
    marginBottom: 12,
    padding: '0 0 12px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  stat: {
    padding: '8px 12px',
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: 6,
    fontSize: '0.75rem',
  },
  statLabel: {
    color: '#6b7280',
    fontWeight: 600,
    marginBottom: 2,
  },
  statValue: {
    color: '#059669',
    fontWeight: 700,
    fontSize: '1rem',
  },
})

const ComparisonStats = ({ products }) => {
  const classes = useStyles()

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
    <div className={classes.stats}>
      <div className={classes.stat}>
        <div className={classes.statLabel}>Products</div>
        <div className={classes.statValue}>{stats.productsCompared}</div>
      </div>
      {stats.avgDepositRate > 0 && (
        <div className={classes.stat}>
          <div className={classes.statLabel}>Avg Deposit</div>
          <div className={classes.statValue}>{(stats.avgDepositRate * 100).toFixed(2)}%</div>
        </div>
      )}
      {stats.avgLendingRate > 0 && (
        <div className={classes.stat}>
          <div className={classes.statLabel}>Avg Lending</div>
          <div className={classes.statValue}>{(stats.avgLendingRate * 100).toFixed(2)}%</div>
        </div>
      )}
    </div>
  )
}

export default React.memo(ComparisonStats)
