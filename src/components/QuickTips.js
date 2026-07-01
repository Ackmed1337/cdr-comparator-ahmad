import React from 'react'
import { makeStyles } from '@material-ui/core'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: 16,
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
  },
  heading: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#f59e0b',
  },
  details: {
    display: 'grid',
    gap: 8,
    padding: '12px 16px 16px',
  },
  tip: {
    padding: 10,
    background: '#fffbeb',
    border: '1px solid #fce7f3',
    borderLeft: '3px solid #f59e0b',
    borderRadius: 4,
    fontSize: '0.8rem',
    color: '#78350f',
    lineHeight: 1.5,
  },
}))

const QuickTips = () => {
  const classes = useStyles()

  const tips = [
    'Use Quick Filters (High Rates, No Fees, Digital Wallet) to instantly narrow down products',
    'Search product names to quickly find specific products',
    'Compare 2-4 products side-by-side using the checkboxes',
    'Use calculators to see real dollar impact of rate differences',
    'Check the Feature Matrix to see which products have the features you need',
    'Click the share button to send comparisons to friends or save for later',
    'Toggle dark mode in the header for comfortable reading',
    'Export comparisons as HTML, CSV, or text for easy sharing',
  ]

  return (
    <Accordion className={classes.root} defaultExpanded={false}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div className={classes.heading}>Quick Tips</div>
      </AccordionSummary>
      <AccordionDetails style={{ flexDirection: 'column', width: '100%' }}>
        <div className={classes.details}>
          {tips.map((tip, idx) => (
            <div key={idx} className={classes.tip}>
              {tip}
            </div>
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  )
}

export default QuickTips
