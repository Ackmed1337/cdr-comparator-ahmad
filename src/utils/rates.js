const parseRates = (rates) => (rates || []).map(r => parseFloat(r.rate)).filter(r => !isNaN(r))

// The "best" rate for a saver is the highest deposit rate on offer;
// for a borrower it's the lowest lending rate. Used consistently across
// the comparison table, chart, exports, and calculators so every part
// of the app agrees on which rate represents a product.
export const bestDepositRate = (rates) => {
  const values = parseRates(rates)
  return values.length ? Math.max(...values) : null
}

export const bestLendingRate = (rates) => {
  const values = parseRates(rates)
  return values.length ? Math.min(...values) : null
}
