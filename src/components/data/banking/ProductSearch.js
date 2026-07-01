import React, { useState, useCallback, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
import IconButton from '@material-ui/core/IconButton'

const useStyles = makeStyles(theme => ({
  searchBox: {
    marginBottom: 12,
  },
  quickFilters: {
    display: 'flex',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  filterPill: {
    padding: '4px 12px',
    fontSize: '0.7rem',
    fontWeight: 600,
    border: '1px solid #cbd5e1',
    borderRadius: 16,
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      borderColor: '#2563eb',
      color: '#2563eb',
    },
    '&.active': {
      background: '#2563eb',
      color: '#fff',
      borderColor: '#2563eb',
    }
  },
  results: {
    fontSize: '0.7rem',
    color: '#64748b',
  }
}))

const QUICK_FILTERS = [
  { label: 'High Rates', key: 'highRate', test: (p) => {
    const rates = [...(p.depositRates || []), ...(p.lendingRates || [])].map(r => parseFloat(r.rate)).filter(r => !isNaN(r))
    return rates.some(r => r > 0.04)
  }},
  { label: 'No Fees', key: 'noFees', test: (p) => !p.fees || p.fees.length === 0 },
  { label: 'Offset Account', key: 'offset', test: (p) => p.features?.some(f => f.featureType === 'OFFSET') },
  { label: 'Digital Wallet', key: 'wallet', test: (p) => p.features?.some(f => f.featureType === 'DIGITAL_WALLET') },
  { label: 'Cashback', key: 'cashback', test: (p) => p.features?.some(f => f.featureType === 'CASHBACK_OFFER') },
]

const ProductSearch = ({ products, onFilter }) => {
  const classes = useStyles()
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState([])

  const handleToggleFilter = useCallback(filterKey => {
    setActiveFilters(prev => {
      const updated = prev.includes(filterKey)
        ? prev.filter(k => k !== filterKey)
        : [...prev, filterKey]

      const filtered = products.filter(p => {
        if (search && !p.name?.toLowerCase().includes(search.toLowerCase())) return false
        if (updated.length === 0) return true
        return updated.every(filterKey => {
          const filter = QUICK_FILTERS.find(f => f.key === filterKey)
          return filter?.test(p)
        })
      })

      onFilter(filtered)
      return updated
    })
  }, [products, search, onFilter])

  const handleSearchChange = useCallback(e => {
    const value = e.target.value
    setSearch(value)

    const filtered = products.filter(p => {
      if (value && !p.name?.toLowerCase().includes(value.toLowerCase())) return false
      if (activeFilters.length === 0) return true
      return activeFilters.every(filterKey => {
        const filter = QUICK_FILTERS.find(f => f.key === filterKey)
        return filter?.test(p)
      })
    })

    onFilter(filtered)
  }, [products, activeFilters, onFilter])

  const handleClear = useCallback(() => {
    setSearch('')
    setActiveFilters([])
    onFilter(products)
  }, [products, onFilter])

  const resultCount = useMemo(() => {
    if (!search && activeFilters.length === 0) return products.length
    return products.filter(p => {
      if (search && !p.name?.toLowerCase().includes(search.toLowerCase())) return false
      if (activeFilters.length === 0) return true
      return activeFilters.every(filterKey => {
        const filter = QUICK_FILTERS.find(f => f.key === filterKey)
        return filter?.test(p)
      })
    }).length
  }, [products, search, activeFilters])

  return (
    <div className={classes.searchBox}>
      <TextField
        fullWidth
        placeholder="Search products by name..."
        size="small"
        value={search}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon style={{ fontSize: 18 }} /></InputAdornment>,
          endAdornment: (search || activeFilters.length > 0) && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear} style={{ padding: 0 }}>
                <ClearIcon style={{ fontSize: 18 }} />
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <div className={classes.quickFilters}>
        {QUICK_FILTERS.map(filter => (
          <button
            key={filter.key}
            className={`${classes.filterPill} ${activeFilters.includes(filter.key) ? 'active' : ''}`}
            onClick={() => handleToggleFilter(filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className={classes.results}>
        {resultCount} product{resultCount !== 1 ? 's' : ''} found {activeFilters.length > 0 && `with ${activeFilters.length} filter(s)`}
      </div>
    </div>
  )
}

export default React.memo(ProductSearch)
