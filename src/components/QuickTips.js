import React from 'react'
import { makeStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: 16,
    backgroundColor: '#fef3c7',
    border: '1px solid #fcd34d',
  },
  title: {
    fontSize: '0.9rem',
    fontWeight: 700,
    marginBottom: 12,
    color: '#92400e',
  },
  tips: {
    display: 'grid',
    gap: 8,
  },
  tip: {
    padding: 10,
    background: '#fffbeb',
    border: '1px solid #fce7f3',
    borderLeft: '3px solid #f59e0b',
    borderRadius: 4,
    fontSize: '0.8rem',
    color: '#78350f',
    lineHeight: 1.5,
  },
  icon: {
    marginRight: 6,
  }
}))

const QuickTips = () => {
  const classes = useStyles()

  const tips = [
    '💡 Use Quick Filters (High Rates, No Fees, Digital Wallet) to instantly narrow down products',
    '🔍 Search product names to quickly find specific products',
    '📊 Compare 2-4 products side-by-side using the checkboxes',
    '📈 Use calculators to see real dollar impact of rate differences',
    '✨ Check the Feature Matrix to see which products have the features you need',
    '🔗 Click the share button to send comparisons to friends or save for later',
    '🌙 Toggle dark mode in the header for comfortable reading',
    '📥 Export comparisons as HTML, CSV, or text for easy sharing',
  ]

  return (
    <Card className={classes.root}>
      <CardContent style={{ paddingBottom: 12 }}>
        <div className={classes.title}>🎯 Quick Tips</div>
        <div className={classes.tips}>
          {tips.map((tip, idx) => (
            <div key={idx} className={classes.tip}>
              {tip}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default React.memo(QuickTips)
