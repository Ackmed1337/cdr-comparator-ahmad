import React, { useState, useEffect } from 'react'
import { bestLendingRate } from '../../utils/rates'
import { Card } from '../ui/Card'
import { Label } from '../ui/Label'
import { Input } from '../ui/Input'
import { Slider } from '../ui/Slider'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/Select'

const RATE_MARKS = [1, 10, 20, 30]

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
    <Card className="mb-4 p-5">
      <div className="text-lg font-bold text-primary mb-4">Loan Repayment Calculator</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div>
          <Label htmlFor="loan-amount">Loan Amount</Label>
          <Input
            id="loan-amount"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="loan-term">Term (years)</Label>
          <Input
            id="loan-term"
            type="number"
            value={term}
            onChange={(e) => setTerm(Math.max(1, parseInt(e.target.value) || 1))}
            className="mt-1"
          />
        </div>
        {products?.length > 1 && (
          <div>
            <Label htmlFor="loan-product">Select Product</Label>
            <Select value={selectedProduct?.productId} onValueChange={id => setSelectedProduct(products.find(p => p.productId === id))}>
              <SelectTrigger id="loan-product" className="mt-1">
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
          Interest Rate: {(rate * 100).toFixed(2)}%
          {productRate === null && (
            <span className="text-xs font-normal text-muted-foreground ml-2">
              (no rate published for this product — showing an estimate, drag to adjust)
            </span>
          )}
        </div>
        <Slider value={[rate * 100]} onValueChange={([val]) => setRate(val / 100)} min={1} max={30} step={0.05} />
        <div className="relative mt-2 h-4 text-xs text-muted-foreground">
          {RATE_MARKS.map(m => (
            <span key={m} className="absolute -translate-x-1/2" style={{ left: `${((m - 1) / 29) * 100}%` }}>{m}%</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card hoverable className="p-4">
          <div className="text-xs font-semibold text-muted-foreground mb-1">Monthly Payment</div>
          <div className="text-xl font-bold text-primary">${monthlyPayment.toFixed(0)}</div>
        </Card>
        <Card hoverable className="p-4">
          <div className="text-xs font-semibold text-muted-foreground mb-1">Total Interest</div>
          <div className="text-xl font-bold text-primary">${totalInterest.toFixed(0)}</div>
        </Card>
        <Card hoverable className="p-4">
          <div className="text-xs font-semibold text-muted-foreground mb-1">Total Repaid</div>
          <div className="text-xl font-bold text-primary">${(loanAmount + totalInterest).toFixed(0)}</div>
        </Card>
        <Card hoverable className="p-4">
          <div className="text-xs font-semibold text-muted-foreground mb-1">Interest Rate</div>
          <div className="text-xl font-bold text-primary">{(rate * 100).toFixed(2)}%</div>
        </Card>
      </div>
    </Card>
  )
}

export default React.memo(LoanCalculator)
