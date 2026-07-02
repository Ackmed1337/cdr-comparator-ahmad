import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'
import { bestLendingRate } from '../../utils/rates'

const LoanCalculator = ({ products, dataSources }) => {
  const [loanAmount, setLoanAmount] = useState(300000)
  const [term, setTerm] = useState(25)
  const [selectedProduct, setSelectedProduct] = useState(products?.[0])
  const [rate, setRate] = useState(0.05)

  const product = selectedProduct || products?.[0]
  const productRate = product ? bestLendingRate(product.lendingRates) : null

  // Re-sync the rate to the selected product's published rate, but keep it in
  // its own state so the slider below can still be dragged to model other scenarios.
  useEffect(() => {
    setRate(productRate ?? 0.05)
  }, [productRate])

  const monthlyRate = rate / 12
  const numPayments = term * 12
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
  const totalInterest = monthlyPayment * numPayments - loanAmount

  return (
    <div className="mb-4 bg-gradient-to-b from-white via-slate-100 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-5 transition-all duration-300">
      <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">Loan Repayment Calculator</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div>
          <TextField
            label="Loan Amount"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            size="small"
            InputProps={{ startAdornment: '$' }}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <TextField
            label="Term (years)"
            type="number"
            value={term}
            onChange={(e) => setTerm(Math.max(1, parseInt(e.target.value) || 1))}
            size="small"
            style={{ width: '100%' }}
          />
        </div>
        {products?.length > 1 && (
          <div>
            <TextField
              select
              label="Select Product"
              value={selectedProduct?.productId || ''}
              onChange={(e) => setSelectedProduct(products.find(p => p.productId === e.target.value))}
              SelectProps={{ native: true }}
              size="small"
              style={{ width: '100%' }}
            >
              {products.map(p => (
                <option key={p.productId} value={p.productId}>{p.name}</option>
              ))}
            </TextField>
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Interest Rate: {(rate * 100).toFixed(2)}%
          {productRate === null && (
            <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-2">
              (no rate published for this product — showing an estimate, drag to adjust)
            </span>
          )}
        </div>
        <Slider
          value={rate * 100}
          onChange={(_, val) => setRate(val / 100)}
          min={1}
          max={30}
          step={0.05}
          marks={[{ value: 1, label: '1%' }, { value: 10, label: '10%' }, { value: 20, label: '20%' }, { value: 30, label: '30%' }]}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-100/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors duration-200">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Monthly Payment</div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">${monthlyPayment.toFixed(0)}</div>
        </div>
        <div className="bg-slate-100/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors duration-200">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Total Interest</div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">${totalInterest.toFixed(0)}</div>
        </div>
        <div className="bg-slate-100/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors duration-200">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Total Repaid</div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">${(loanAmount + totalInterest).toFixed(0)}</div>
        </div>
        <div className="bg-slate-100/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors duration-200">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Interest Rate</div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{(rate * 100).toFixed(2)}%</div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(LoanCalculator)
