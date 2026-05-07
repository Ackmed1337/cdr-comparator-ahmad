import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionActions from '@material-ui/core/AccordionActions'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import CompareIcon from '@material-ui/icons/Compare'
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid'
import BankingProductList from './BankingProductList'
import { compareProducts } from '../../../store/banking/comparison'

const useStyles = makeStyles(theme => ({
  panel: { backgroundColor: '#fff' },
  heading: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 600,
    color: '#1e293b',
  },
  details: {
    maxWidth: '98%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 16,
  },
  container: {
    marginLeft: theme.typography.pxToRem(8),
    marginRight: theme.typography.pxToRem(8),
  },
  sourceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 12px',
    marginBottom: 8,
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    borderLeft: '3px solid #2563eb',
  },
  sourceIcon: { width: 28, height: 28, objectFit: 'contain' },
  sourceName: {
    fontSize: theme.typography.pxToRem(13),
    fontWeight: 700,
    color: '#1e293b',
  },
  compareBtn: { margin: 8 },
}))

const BankingPanel = (props) => {
  const { dataSources, savedDataSourcesCount } = props
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(true)

  const compare = () => {
    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      alert('Screen too small — use a larger device to compare.')
      return
    }
    props.compareProducts(props.selectedProducts)
    setExpanded(false)
  }

  const colWidth = (count, min) => Math.max(12 / count, min)

  const selCount = props.selectedProducts.length
  const canCompare = selCount >= 2 && selCount <= 4

  return (
    <Accordion defaultExpanded className={classes.panel} expanded={expanded} onChange={(_, v) => setExpanded(v)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="banking-content">
        <div className={classes.heading}>
          <Typography style={{ fontWeight: 600, fontSize: '0.95rem' }}>Banking Products</Typography>
          {savedDataSourcesCount > 0 && (
            <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>
              {savedDataSourcesCount} source{savedDataSourcesCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </AccordionSummary>
      <div className={classes.details}>
        {savedDataSourcesCount > 0 && (
          <Grid container alignItems="flex-start" spacing={2} className={classes.container}>
            {dataSources.map((ds, index) =>
              isBankingDataSource(ds) && (
                <Grid item key={index}
                  xs={colWidth(savedDataSourcesCount, 12)}
                  sm={colWidth(savedDataSourcesCount, 12)}
                  md={colWidth(savedDataSourcesCount, 6)}
                  lg={colWidth(savedDataSourcesCount, 4)}
                  xl={colWidth(savedDataSourcesCount, 3)}
                >
                  <div className={classes.sourceHeader}>
                    {ds.icon && <img src={ds.icon} alt="" className={classes.sourceIcon} />}
                    <span className={classes.sourceName}>{ds.name}</span>
                  </div>
                  <BankingProductList dataSource={ds} dataSourceIndex={index} />
                </Grid>
              )
            )}
          </Grid>
        )}
        {savedDataSourcesCount === 0 && (
          <div style={{ padding: '24px 20px', color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center' }}>
            Add a data source above to load banking products.
          </div>
        )}
      </div>
      <Divider />
      <AccordionActions>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px' }}>
          {selCount > 0 && (
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {selCount} product{selCount !== 1 ? 's' : ''} selected
              {selCount > 4 && <span style={{ color: '#dc2626', marginLeft: 4 }}>(max 4)</span>}
            </span>
          )}
          <Fab
            variant="extended"
            size="medium"
            color="primary"
            disabled={!canCompare}
            onClick={compare}
            className={classes.compareBtn}
          >
            <CompareIcon style={{ marginRight: 8, fontSize: 18 }} />
            Compare {canCompare ? `(${selCount})` : ''}
          </Fab>
        </div>
      </AccordionActions>
    </Accordion>
  )
}

function isBankingDataSource(ds) {
  return !ds.unsaved && !ds.deleted && ds.enabled && (!ds.sectors || ds.sectors.includes('banking'))
}

const mapStateToProps = state => ({
  dataSources: state.dataSources,
  savedDataSourcesCount: state.dataSources.filter(isBankingDataSource).length,
  selectedProducts: state.bankingSelection,
})

export default connect(mapStateToProps, { compareProducts })(BankingPanel)
