import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: 16,
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
  },
  title: {
    fontSize: '0.9rem',
    fontWeight: 700,
    marginBottom: 12,
    color: '#2563eb',
  },
  inputGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 12,
    marginBottom: 16,
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    }
  },
  input: {
    '& input': {
      fontSize: '0.85rem',
    }
  },
  results: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 12,
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    }
  },
  resultBox: {
    padding: 12,
    background: '#f0f9ff',
    border: '1px solid #93c5fd',
    borderRadius: 6,
  },
  resultLabel: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#1e40af',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#2563eb',
  },
}))

const SavingsCalculator = ({ products }) => {
  const classes = useStyles()
  const [principalAmount, setPrincipalAmount] = useState(100000)
  const [years, setYears] = useState(5)
  const [selectedProduct, setSelectedProduct] = useState(products?.[0])

  const product = selectedProduct || products?.[0]
  const rate = product ? (product.depositRates?.[0]?.rate || 0.02) : 0.02

  // Simple compound interest: A = P(1 + r/n)^(nt)
  // Monthly compounding (n=12)
  const months = years * 12
  const monthlyRate = rate / 12
  const futureValue = principalAmount * Math.pow(1 + monthlyRate, months)
  const interestEarned = futureValue - principalAmount

  return (
    <Card className={classes.root}>
      <CardContent>
        <div className={classes.title}>📈 Savings Interest Calculator</div>

        <div className={classes.inputGroup}>
          <TextField
            className={classes.input}
            label="Principal Amount"
            type="number"
            value={principalAmount}
            onChange={(e) => setPrincipalAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            size="small"
            InputProps={{ startAdornment: '$' }}
          />
          <TextField
            className={classes.input}
            label="Years"
            type="number"
            value={years}
            onChange={(e) => setYears(Math.max(1, parseInt(e.target.value) || 1))}
            size="small"
          />
          {products?.length > 1 && (
            <TextField
              className={classes.input}
              select
              label="Select Product"
              value={selectedProduct?.productId || ''}
              onChange={(e) => setSelectedProduct(products.find(p => p.productId === e.target.value))}
              SelectProps={{ native: true }}
              size="small"
            >
              {products.map(p => (
                <option key={p.productId} value={p.productId}>{p.name}</option>
              ))}
            </TextField>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <Typography variant="caption" display="block" style={{ marginBottom: 8, color: '#1e40af', fontWeight: 600 }}>
            Interest Rate: {(rate * 100).toFixed(2)}% per annum (compounded monthly)
          </Typography>
        </div>

        <div className={classes.results}>
          <div className={classes.resultBox}>
            <div className={classes.resultLabel}>Interest Earned</div>
            <div className={classes.resultValue}>${interestEarned.toFixed(0)}</div>
          </div>
          <div className={classes.resultBox}>
            <div className={classes.resultLabel}>Final Balance</div>
            <div className={classes.resultValue}>${futureValue.toFixed(0)}</div>
          </div>
          <div className={classes.resultBox}>
            <div className={classes.resultLabel}>Total Return</div>
            <div className={classes.resultValue}>{((interestEarned / principalAmount) * 100).toFixed(2)}%</div>
          </div>
          <div className={classes.resultBox}>
            <div className={classes.resultLabel}>Interest Rate</div>
            <div className={classes.resultValue}>{(rate * 100).toFixed(2)}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default React.memo(SavingsCalculator)
