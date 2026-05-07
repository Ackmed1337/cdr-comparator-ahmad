import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionActions from '@material-ui/core/AccordionActions'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import RefreshIcon from '@material-ui/icons/Refresh'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import Grid from '@material-ui/core/Grid'
import StatusOutages from './StatusOutages'
import { connect } from 'react-redux'
import { normalise } from '../../../utils/url'
import { retrieveStatus, retrieveOutages } from '../../../store/discovery'

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
  sourceCard: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '12px 14px',
  },
  sourceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: '1px solid #e2e8f0',
  },
  sourceIcon: { width: 28, height: 28, objectFit: 'contain' },
  sourceName: {
    fontSize: theme.typography.pxToRem(13),
    fontWeight: 700,
    color: '#1e293b',
  },
}))

const DiscoveryInfo = (props) => {
  const { dataSources, savedDataSourcesCount } = props
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(true)

  const refresh = () => {
    const { versionInfo } = props
    props.dataSources.forEach((ds, i) => {
      if (!ds.unsaved && ds.enabled && !ds.deleted) {
        const url = normalise(ds.url)
        props.retrieveStatus(i, url, versionInfo.xV, versionInfo.xMinV)
        props.retrieveOutages(i, url, versionInfo.xV, versionInfo.xMinV)
      }
    })
  }

  React.useEffect(() => {
    refresh()
    // eslint-disable-next-line
  }, [props.dataSources])

  const colWidth = (count, min) => Math.max(12 / count, min)

  return (
    <Accordion defaultExpanded className={classes.panel} expanded={expanded} onChange={(_, v) => setExpanded(v)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="discovery-content">
        <div className={classes.heading}>
          <Typography style={{ fontWeight: 600, fontSize: '0.95rem' }}>Status &amp; Outages</Typography>
          {savedDataSourcesCount > 0 && (
            <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>
              {savedDataSourcesCount} source{savedDataSourcesCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </AccordionSummary>
      <div className={classes.details}>
        {savedDataSourcesCount > 0 ? (
          <Grid container alignItems="flex-start" spacing={2} className={classes.container}>
            {dataSources.map((ds, i) => {
              const data = props.data[i]
              if (!data || ds.unsaved || !ds.enabled || ds.deleted) return null
              return (
                <Grid item key={i}
                  xs={colWidth(savedDataSourcesCount, 12)}
                  sm={colWidth(savedDataSourcesCount, 12)}
                  md={colWidth(savedDataSourcesCount, 6)}
                  lg={colWidth(savedDataSourcesCount, 4)}
                  xl={colWidth(savedDataSourcesCount, 3)}
                >
                  <div className={classes.sourceCard}>
                    <div className={classes.sourceHeader}>
                      {ds.icon && <img src={ds.icon} alt="" className={classes.sourceIcon} />}
                      <span className={classes.sourceName}>{ds.name}</span>
                    </div>
                    <StatusOutages statusDetails={data.statusDetails} outagesDetails={data.outagesDetails} />
                  </div>
                </Grid>
              )
            })}
          </Grid>
        ) : (
          <div style={{ padding: '24px 20px', color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center' }}>
            Add a data source above to check status.
          </div>
        )}
      </div>
      <Divider />
      <AccordionActions>
        <Tooltip title="Refresh status">
          <Fab size="small" color="primary" onClick={refresh} style={{ margin: 8 }}>
            <RefreshIcon style={{ fontSize: 18 }} />
          </Fab>
        </Tooltip>
      </AccordionActions>
    </Accordion>
  )
}

const mapStateToProps = state => ({
  dataSources: state.dataSources,
  savedDataSourcesCount: state.dataSources.filter(ds => !ds.unsaved && !ds.deleted && ds.enabled).length,
  versionInfo: state.versionInfo.vHeaders,
  data: state.discovery,
})

export default connect(mapStateToProps, { retrieveStatus, retrieveOutages })(DiscoveryInfo)
