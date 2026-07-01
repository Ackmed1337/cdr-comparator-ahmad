import React, { useMemo } from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  chart: {
    padding: '12px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  section: {
    paddingBottom: 12,
    borderBottom: '1px solid #e2e8f0',
  },
  title: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 8,
  },
  bars: {
    display: 'flex',
    gap: 6,
    alignItems: 'flex-end',
    height: 80,
    [theme.breakpoints.down('sm')]: {
      height: 60,
      gap: 4,
    }
  },
  bar: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 0,
  },
  barFill: {
    width: '100%',
    background: '#3b82f6',
    borderRadius: '4px 4px 0 0',
    minHeight: 4,
  },
  barLabel: {
    fontSize: '0.65rem',
    fontWeight: 600,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
    wordBreak: 'break-word',
    maxWidth: '100%',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.6rem',
      marginTop: 2,
    }
  },
  barValue: {
    fontSize: '0.7rem',
    color: '#374151',
    fontWeight: 700,
    marginTop: 2,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.65rem',
      marginTop: 1,
    }
  },
}))

const RateChart = ({ products, dataSources }) => {
  const classes = useStyles()

  const depositRates = useMemo(() => {
    return products.map(pd => {
      const rates = pd.product.depositRates || []
      if (!rates.length) return null
      const rateValues = rates.map(r => parseFloat(r.rate)).filter(r => !isNaN(r))
      return rateValues.length ? Math.max(...rateValues) : null
    })
  }, [products])

  const lendingRates = useMemo(() => {
    return products.map(pd => {
      const rates = pd.product.lendingRates || []
      if (!rates.length) return null
      const rateValues = rates.map(r => parseFloat(r.rate)).filter(r => !isNaN(r))
      return rateValues.length ? Math.min(...rateValues) : null
    })
  }, [products])

  const hasDeposit = depositRates.some(r => r !== null)
  const hasLending = lendingRates.some(r => r !== null)

  if (!hasDeposit && !hasLending) return null

  const renderBars = (rates, label, isDeposit) => {
    const validRates = rates.filter(r => r !== null)
    if (!validRates.length) return null

    const maxRate = Math.max(...validRates)
    const minRate = Math.min(...validRates)
    const range = maxRate - minRate || 0.001

    return (
      <div key={label} className={classes.section}>
        <div className={classes.title}>{label}</div>
        <div className={classes.bars}>
          {rates.map((rate, i) => (
            <div key={i} className={classes.bar}>
              {rate !== null ? (
                <>
                  <div
                    className={classes.barFill}
                    style={{
                      height: `${((rate - minRate) / range) * 90 + 10}px`,
                      background: isDeposit ? '#10b981' : '#ef4444',
                    }}
                  />
                  <div className={classes.barValue}>{(rate * 100).toFixed(2)}%</div>
                </>
              ) : (
                <div style={{ height: '10px', color: '#d1d5db', fontSize: '0.7rem' }}>N/A</div>
              )}
              <div className={classes.barLabel}>
                {dataSources[products[i].dataSourceIdx]?.name || 'Source'}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={classes.chart}>
      {hasDeposit && renderBars(depositRates, 'Max Deposit Rate (%)', true)}
      {hasLending && renderBars(lendingRates, 'Min Lending Rate (%)', false)}
    </div>
  )
}

export default React.memo(RateChart)
