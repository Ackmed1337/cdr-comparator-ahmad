export const generatePDFComparison = (products, dataSources, format = 'html') => {
  const timestamp = new Date().toLocaleString()

  if (format === 'html') {
    const html = generateHTMLReport(products, dataSources, timestamp)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 60000)
    return
  }

  if (format === 'text') {
    const text = generateTextReport(products, dataSources, timestamp)
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `comparison-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }
}

const generateHTMLReport = (products, dataSources, timestamp) => {
  const productNames = products.map((p, i) => `
    <th style="padding: 12px; border-bottom: 2px solid #2563eb; background: #eff6ff;">
      <strong>${dataSources[p.dataSourceIdx]?.name}</strong><br/>
      ${p.product.name}
    </th>
  `).join('')

  const rows = [
    {
      label: 'Product Name',
      values: products.map(p => p.product.name)
    },
    {
      label: 'Description',
      values: products.map(p => p.product.description || '—')
    },
    {
      label: 'Max Deposit Rate',
      values: products.map(p => {
        const rates = p.product.depositRates || []
        if (!rates.length) return '—'
        const rateValues = rates.map(r => parseFloat(r.rate)).filter(r => !isNaN(r))
        return rateValues.length ? (Math.max(...rateValues) * 100).toFixed(2) + '%' : '—'
      })
    },
    {
      label: 'Min Lending Rate',
      values: products.map(p => {
        const rates = p.product.lendingRates || []
        if (!rates.length) return '—'
        const rateValues = rates.map(r => parseFloat(r.rate)).filter(r => !isNaN(r))
        return rateValues.length ? (Math.min(...rateValues) * 100).toFixed(2) + '%' : '—'
      })
    },
    {
      label: 'Features',
      values: products.map(p => {
        const features = (p.product.features || []).map(f => f.featureType).join(', ')
        return features || '—'
      })
    },
    {
      label: 'Fees',
      values: products.map(p => {
        const fees = (p.product.fees || []).map(f => f.name).join(', ')
        return fees || 'No fees'
      })
    },
  ]

  const rows_html = rows.map(row => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: 600; background: #f8fafc; min-width: 120px;">
        ${row.label}
      </td>
      ${row.values.map(val => `
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
          ${val}
        </td>
      `).join('')}
    </tr>
  `).join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CDR Comparator Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; background: #fff; }
    h1 { color: #1e293b; margin-bottom: 6px; }
    .meta { color: #64748b; font-size: 0.9rem; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { text-align: left; }
    td { vertical-align: top; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 0.8rem; }
  </style>
</head>
<body>
  <h1>💳 Banking Product Comparison Report</h1>
  <div class="meta">
    Generated: ${timestamp}<br/>
    Products Compared: ${products.length}
  </div>

  <table>
    <thead>
      <tr>
        <th style="padding: 12px; border-bottom: 2px solid #2563eb; background: #f1f5f9;">Attribute</th>
        ${productNames}
      </tr>
    </thead>
    <tbody>
      ${rows_html}
    </tbody>
  </table>

  <div class="footer">
    <p>This comparison was prepared by the CDR Comparator tool.</p>
    <p>All data sourced from registered CDR Data Holders.</p>
    <p>Please verify current rates and features with the financial institutions directly.</p>
  </div>
</body>
</html>
  `
}

const generateTextReport = (products, dataSources, timestamp) => {
  const maxLabelWidth = 20
  const colWidth = Math.max(20, Math.floor((80 - maxLabelWidth) / products.length))

  let text = `\n${'='.repeat(80)}\n`
  text += `BANKING PRODUCT COMPARISON REPORT\n`
  text += `${'='.repeat(80)}\n\n`
  text += `Generated: ${timestamp}\n`
  text += `Products Compared: ${products.length}\n\n`

  // Header
  text += `${'Attribute'.padEnd(maxLabelWidth)} | `
  text += products.map(p => (
    `${dataSources[p.dataSourceIdx]?.name} - ${p.product.name}`
  ).substring(0, colWidth).padEnd(colWidth)).join(' | ') + '\n'

  text += `${'-'.repeat(maxLabelWidth)}-+-${products.map(() => '-'.repeat(colWidth)).join('-+-')}\n`

  // Rows
  const rows = [
    { label: 'Max Deposit Rate', getter: p => {
      const rates = p.depositRates || []
      if (!rates.length) return '—'
      const rateValues = rates.map(r => parseFloat(r.rate)).filter(r => !isNaN(r))
      return rateValues.length ? (Math.max(...rateValues) * 100).toFixed(2) + '%' : '—'
    }},
    { label: 'Min Lending Rate', getter: p => {
      const rates = p.lendingRates || []
      if (!rates.length) return '—'
      const rateValues = rates.map(r => parseFloat(r.rate)).filter(r => !isNaN(r))
      return rateValues.length ? (Math.min(...rateValues) * 100).toFixed(2) + '%' : '—'
    }},
    { label: 'Features', getter: p => (p.features || []).map(f => f.featureType).slice(0, 2).join(', ') || '—' },
    { label: 'Has Fees', getter: p => (p.fees && p.fees.length > 0) ? 'Yes' : 'No' },
  ]

  rows.forEach(row => {
    const values = products.map(p => row.getter(p.product).substring(0, colWidth).padEnd(colWidth))
    text += `${row.label.padEnd(maxLabelWidth)} | ${values.join(' | ')}\n`
  })

  text += `\n${'='.repeat(80)}\n`
  text += `This comparison was prepared by the CDR Comparator tool.\n`
  text += `All data sourced from registered CDR Data Holders.\n`
  text += `Please verify current rates with institutions directly.\n`
  text += `${'='.repeat(80)}\n\n`

  return text
}
