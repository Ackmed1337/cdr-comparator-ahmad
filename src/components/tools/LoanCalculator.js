import React, { useState, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: 16,
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
  },
  title: {
    fontSize: '0.9rem',
    fontWeight: 700,
    marginBottom: 12,
    color: '#059669',
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
    background: '#ecfdf5',
    border: '1px solid #86efac',
    borderRadius: 6,
  },
  resultLabel: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#047857',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#059669',
  },
  slider: {
    marginBottom: 12,
  }
}))

const LoanCalculator = ({ products, dataSources }) => {
  const classes = useStyles()
  const [loanAmount, setLoanAmount] = useState(300000)
  const [term, setTerm] = useState(25)
  const [selectedProduct, setSelectedProduct] = useState(products?.[0])

  const product = selectedProduct || products?.[0]
  const rate = product ? (product.lendingRates?.[0]?.rate || 0.05) : 0.05

  const monthlyRate = rate / 12
  const numPayments = term * 12
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
  const totalInterest = monthlyPayment * numPayments - loanAmount

  return (
    <Card className={classes.root}>
      <CardContent>
        <div className={classes.title}>💰 Loan Repayment Calculator</div>

        <div className={classes.inputGroup}>
          <TextField
            className={classes.input}
            label="Loan Amount"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            size="small"
            InputProps={{ startAdornment: '$' }}
          />
          <TextField
            className={classes.input}
            label="Term (years)"
            type="number"
            value={term}
            onChange={(e) => setTerm(Math.max(1, parseInt(e.target.value) || 1))}
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

        <div className={classes.slider}>
          <Typography variant="caption" display="block" style={{ marginBottom: 8, color: '#666' }}>
            Interest Rate: {(rate * 100).toFixed(2)}%
          </Typography>
          <Slider
            value={rate * 100}
            onChange={(_, val) => {}}
            min={1}
            max={10}
            step={0.1}
            marks={[{ value: 1, label: '1%' }, { value: 5, label: '5%' }, { value: 10, label: '10%' }]}
            disabled
          />
        </div>

        <div className={classes.results}>
          <div className={classes.resultBox}>
            <div className={classes.resultLabel}>Monthly Payment</div>
            <div className={classes.resultValue}>${monthlyPayment.toFixed(0)}</div>
          </div>
          <div className={classes.resultBox}>
            <div className={classes.resultLabel}>Total Interest</div>
            <div className={classes.resultValue}>${totalInterest.toFixed(0)}</div>
          </div>
          <div className={classes.resultBox}>
            <div className={classes.resultLabel}>Total Repaid</div>
            <div className={classes.resultValue}>${(loanAmount + totalInterest).toFixed(0)}</div>
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

export default React.memo(LoanCalculator)
