import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'
import { bestDepositRate } from '../../utils/rates'

const SavingsCalculator = ({ products }) => {
  const [principalAmount, setPrincipalAmount] = useState(100000)
  const [years, setYears] = useState(5)
  const [selectedProduct, setSelectedProduct] = useState(products?.[0])
  const [rate, setRate] = useState(0.02)

  const product = selectedProduct || products?.[0]
  const productRate = product ? bestDepositRate(product.depositRates) : null

  // Re-sync the rate to the selected product's published rate, but keep it in
  // its own state so the slider below can still be dragged to model other scenarios.
  useEffect(() => {
    setRate(productRate ?? 0.02)
  }, [productRate])

  // Simple compound interest: A = P(1 + r/n)^(nt)
  // Monthly compounding (n=12)
  const months = years * 12
  const monthlyRate = rate / 12
  const futureValue = principalAmount * Math.pow(1 + monthlyRate, months)
  const interestEarned = futureValue - principalAmount

  return (
    <div className="mb-4 bg-gradient-to-b from-white via-slate-100 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-5 transition-all duration-300">
      <div className="text-lg font-bold text-green-600 dark:text-green-400 mb-4">Savings Interest Calculator</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div>
          <TextField
            label="Principal Amount"
            type="number"
            value={principalAmount}
            onChange={(e) => setPrincipalAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            size="small"
            InputProps={{ startAdornment: '$' }}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <TextField
            label="Years"
            type="number"
            value={years}
            onChange={(e) => setYears(Math.max(1, parseInt(e.target.value) || 1))}
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
          Interest Rate: {(rate * 100).toFixed(2)}% per annum (compounded monthly)
          {productRate === null && (
            <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-2">
              (no rate published for this product — showing an estimate, drag to adjust)
            </span>
          )}
        </div>
        <Slider
          value={rate * 100}
          onChange={(_, val) => setRate(val / 100)}
          min={0}
          max={10}
          step={0.05}
          marks={[{ value: 0, label: '0%' }, { value: 5, label: '5%' }, { value: 10, label: '10%' }]}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-100/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg p-4 hover:border-green-500/50 transition-colors duration-200">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Interest Earned</div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400">${interestEarned.toFixed(0)}</div>
        </div>
        <div className="bg-slate-100/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg p-4 hover:border-green-500/50 transition-colors duration-200">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Final Balance</div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400">${futureValue.toFixed(0)}</div>
        </div>
        <div className="bg-slate-100/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg p-4 hover:border-green-500/50 transition-colors duration-200">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Total Return</div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400">{((interestEarned / principalAmount) * 100).toFixed(2)}%</div>
        </div>
        <div className="bg-slate-100/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg p-4 hover:border-green-500/50 transition-colors duration-200">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Interest Rate</div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400">{(rate * 100).toFixed(2)}%</div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(SavingsCalculator)
