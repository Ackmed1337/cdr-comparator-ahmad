export const encodeComparisonURL = (products) => {
  if (!products || products.length === 0) return window.location.origin + window.location.pathname

  const encoded = products
    .map(p => `${p.dataSourceIdx}:${encodeURIComponent(p.product.productId)}`)
    .join(',')

  const url = new URL(window.location)
  url.searchParams.set('compare', encoded)
  return url.toString()
}

export const decodeComparisonURL = (searchParams) => {
  const compareParam = searchParams.get('compare')
  if (!compareParam) return null

  try {
    return compareParam
      .split(',')
      .map(item => {
        const [dataSourceIdx, productId] = item.split(':')
        return {
          dataSourceIdx: parseInt(dataSourceIdx),
          productId: decodeURIComponent(productId)
        }
      })
  } catch (e) {
    console.error('Failed to decode comparison URL:', e)
    return null
  }
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}
