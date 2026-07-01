import React, { useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: 12,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
  },
  heading: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#1e293b',
  },
  filterGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: 4,
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    }
  },
  checkbox: {
    padding: '4px 8px',
  },
  searchBox: {
    marginBottom: 8,
  }
}))

const FEATURE_TYPES = [
  'CARD_ACCESS', 'ADDITIONAL_CARDS', 'CASHBACK_OFFER', 'FREE_TXNS', 'UNLIMITED_TXNS',
  'OFFSET', 'OVERDRAFT', 'REDRAW', 'BALANCE_TRANSFERS', 'DIGITAL_BANKING',
  'DIGITAL_WALLET', 'LOYALTY_PROGRAM', 'NOTIFICATIONS', 'BONUS_REWARDS',
  'INSURANCE', 'RELATIONSHIP_MANAGEMENT', 'BILL_PAY', 'NPP', 'COMPLEMENTARY_PRODUCT_DISCOUNTS'
]

const FeatureFilter = ({ onFilterChange }) => {
  const classes = useStyles()
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const [search, setSearch] = useState('')

  const handleToggle = useCallback(feature => {
    setSelectedFeatures(prev => {
      const updated = prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
      onFilterChange(updated)
      return updated
    })
  }, [onFilterChange])

  const handleClearAll = useCallback(() => {
    setSelectedFeatures([])
    onFilterChange([])
  }, [onFilterChange])

  const filteredFeatures = FEATURE_TYPES.filter(f =>
    f.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Accordion defaultExpanded={false} className={classes.root}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div className={classes.heading}>
          Filter by Features {selectedFeatures.length > 0 && `(${selectedFeatures.length})`}
        </div>
      </AccordionSummary>
      <div style={{ padding: '12px' }}>
        <TextField
          className={classes.searchBox}
          placeholder="Search features..."
          size="small"
          fullWidth
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <div className={classes.filterGroup}>
          {filteredFeatures.map(feature => (
            <FormControlLabel
              key={feature}
              className={classes.checkbox}
              control={
                <Checkbox
                  checked={selectedFeatures.includes(feature)}
                  onChange={() => handleToggle(feature)}
                  size="small"
                />
              }
              label={<span style={{ fontSize: '0.75rem' }}>{feature.replace(/_/g, ' ')}</span>}
            />
          ))}
        </div>
        {selectedFeatures.length > 0 && (
          <button
            onClick={handleClearAll}
            style={{
              marginTop: 8,
              padding: '4px 12px',
              fontSize: '0.7rem',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Clear All
          </button>
        )}
      </div>
    </Accordion>
  )
}

export default React.memo(FeatureFilter)
