import React, { useState, useEffect } from 'react'
import { bestDepositRate } from '../../utils/rates'
import { Card } from '../ui/Card'
import { Label } from '../ui/Label'
import { Input } from '../ui/Input'
import { Slider } from '../ui/Slider'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/Select'

const RATE_MARKS = [0, 5, 10]

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
    <Card className="mb-4 p-5">
      <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-4">Savings Interest Calculator</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div>
          <Label htmlFor="savings-principal">Principal Amount</Label>
          <Input
            id="savings-principal"
            type="number"
            value={principalAmount}
            onChange={(e) => setPrincipalAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="savings-years">Years</Label>
          <Input
            id="savings-years"
            type="number"
            value={years}
            onChange={(e) => setYears(Math.max(1, parseInt(e.target.value) || 1))}
            className="mt-1"
          />
        </div>
        {products?.length > 1 && (
          <div>
            <Label htmlFor="savings-product">Select Product</Label>
            <Select value={selectedProduct?.productId} onValueChange={id => setSelectedProduct(products.find(p => p.productId === id))}>
              <SelectTrigger id="savings-product" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {products.map(p => (
                  <SelectItem key={p.productId} value={p.productId}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="text-sm font-semibold text-foreground/90 mb-3">
          Interest Rate: {(rate * 100).toFixed(2)}% per annum (compounded monthly)
          {productRate === null && (
            <span className="text-xs font-normal text-muted-foreground ml-2">
              (no rate published for this product — showing an estimate, drag to adjust)
            </span>
          )}
        </div>
        <Slider value={[rate * 100]} onValueChange={([val]) => setRate(val / 100)} min={0} max={10} step={0.05} />
        <div className="relative mt-2 h-4 text-xs text-muted-foreground">
          {RATE_MARKS.map(m => (
            <span key={m} className="absolute -translate-x-1/2" style={{ left: `${(m / 10) * 100}%` }}>{m}%</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card hoverable className="p-4">
          <div className="text-xs font-semibold text-muted-foreground mb-1">Interest Earned</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">${interestEarned.toFixed(0)}</div>
        </Card>
        <Card hoverable className="p-4">
          <div className="text-xs font-semibold text-muted-foreground mb-1">Final Balance</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">${futureValue.toFixed(0)}</div>
        </Card>
        <Card hoverable className="p-4">
          <div className="text-xs font-semibold text-muted-foreground mb-1">Total Return</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{((interestEarned / principalAmount) * 100).toFixed(2)}%</div>
        </Card>
        <Card hoverable className="p-4">
          <div className="text-xs font-semibold text-muted-foreground mb-1">Interest Rate</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{(rate * 100).toFixed(2)}%</div>
        </Card>
      </div>
    </Card>
  )
}

export default React.memo(SavingsCalculator)
