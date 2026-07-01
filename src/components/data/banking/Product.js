import React from 'react'
import { connect } from 'react-redux'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import { makeStyles, withStyles } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Checkbox from '@material-ui/core/Checkbox'
import Bundle from './Bundle'
import Constraint from './Constraint'
import DepositRate from './DepositRate'
import LendingRate from './LendingRate'
import Eligibility from './Eligibility'
import Feature from './Feature'
import Fee from './Fee'
import CardArt from './CardArt'
import { deselectProduct, selectProduct } from '../../../store/banking/selection'
import DateTime from '../DateTime'
import AdditionalInfo from './AdditionalInfo'
import ecomp from '../../../utils/enum-comp'

const useStyles = makeStyles(() => ({
  root: { display: 'flex', alignItems: 'flex-start', marginBottom: 2 },
  body: {
    fontSize: '0.8rem',
    lineHeight: 1.8,
    paddingRight: 8,
    paddingBottom: 8,
    color: '#374151',
  },
  field: { marginBottom: 2 },
  label: { color: '#9ca3af', fontWeight: 500, marginRight: 4 },
  section: {
    marginTop: 8,
    paddingTop: 6,
    borderTop: '1px solid #f1f5f9',
  },
  sectionTitle: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#6366f1',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 2,
  },
  list: { margin: '0 0 0 0', padding: '0 0 0 16px' },
}))

const Accordion = withStyles({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    '&:not(:last-child)': { borderBottom: 0 },
    '&:before': { display: 'none' },
    '&$expanded': { margin: 'auto' },
  },
  expanded: {},
})(MuiAccordion)

const AccordionSummary = withStyles({
  root: {
    paddingLeft: 0,
    paddingRight: 20,
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    minHeight: 36,
    '&$expanded': { minHeight: 36 },
  },
  content: {
    margin: '8px 0',
    '&$expanded': { margin: '8px 0' },
  },
  expandIcon: { paddingTop: 8, '&$expanded': { paddingTop: 8 } },
  expanded: {},
})(MuiAccordionSummary)

const Field = ({ label, value }) => {
  const classes = useStyles()
  if (!value && value !== 0 && value !== false) return null
  return (
    <div className={classes.field}>
      <span className={classes.label}>{label}:</span>
      {value}
    </div>
  )
}

const Section = ({ title, children }) => {
  const classes = useStyles()
  return (
    <div className={classes.section}>
      <div className={classes.sectionTitle}>{title}</div>
      <ul className={classes.list}>{children}</ul>
    </div>
  )
}

const sortArray = (arr, key) => [...arr].sort((a, b) => ecomp(a[key], b[key]))

const Product = (props) => {
  const classes = useStyles()
  const { product, dataSourceIndex, selectedProducts } = props
  const selected = selectedProducts.some(p => p.dataSourceIdx === dataSourceIndex && p.product.productId === product.productId)

  const toggle = e => e.target.checked
    ? props.selectProduct(dataSourceIndex, product)
    : props.deselectProduct(dataSourceIndex, product)

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(product, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${product.productId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={classes.root}>
      <Checkbox checked={selected} onChange={toggle} color="primary" size="small" style={{ padding: 4, marginTop: 6 }} />
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ fontSize: 16 }} />}>
          <span style={{ fontSize: '0.82rem', fontWeight: selected ? 600 : 400, color: selected ? '#2563eb' : '#374151', lineHeight: 1.4 }}>
            {product.name}
          </span>
        </AccordionSummary>
        <div className={classes.body}>
          {product.description && (
            <div style={{ color: '#6b7280', marginBottom: 6, fontSize: '0.78rem', lineHeight: 1.5 }}>
              {product.description}
            </div>
          )}
          <Field label="Brand" value={product.brand} />
          <Field label="Last updated" value={<><DateTime rfc3339={product.lastUpdated} /> &nbsp;<button onClick={downloadJSON} style={{ cursor: 'pointer', fontSize: '0.72rem', color: '#2563eb', border: 'none', padding: 0, background: 'none', textDecoration: 'underline' }}>JSON</button></>} />
          <Field label="Tailored" value={product.isTailored ? 'Yes' : 'No'} />
          {product.effectiveFrom && <Field label="Effective from" value={<DateTime rfc3339={product.effectiveFrom} />} />}
          {product.effectiveTo && <Field label="Effective to" value={<DateTime rfc3339={product.effectiveTo} />} />}
          {product.applicationUri && <div className={classes.field}><a href={product.applicationUri} target="_blank" rel="noopener noreferrer">Apply here →</a></div>}
          {product.additionalInformation && (
            <div className={classes.section}>
              <div className={classes.sectionTitle}>Additional Info</div>
              <AdditionalInfo additionalInfo={product.additionalInformation} />
            </div>
          )}
          {product.bundles?.length > 0 && (
            <Section title="Bundles">
              {sortArray(product.bundles, 'name').map((b, i) => <Bundle key={i} bundle={b} />)}
            </Section>
          )}
          {product.constraints?.length > 0 && (
            <Section title="Constraints">
              {sortArray(product.constraints, 'constraintType').map((c, i) => <Constraint key={i} constraint={c} />)}
            </Section>
          )}
          {product.depositRates?.length > 0 && (
            <Section title="Deposit Rates">
              {sortArray(product.depositRates, 'depositRateType').map((r, i) => <DepositRate key={i} depositRate={r} />)}
            </Section>
          )}
          {product.lendingRates?.length > 0 && (
            <Section title="Lending Rates">
              {sortArray(product.lendingRates, 'lendingRateType').map((r, i) => <LendingRate key={i} lendingRate={r} />)}
            </Section>
          )}
          {product.eligibility?.length > 0 && (
            <Section title="Eligibility">
              {sortArray(product.eligibility, 'eligibilityType').map((e, i) => <Eligibility key={i} eligibility={e} />)}
            </Section>
          )}
          {product.features?.length > 0 && (
            <Section title="Features">
              {sortArray(product.features, 'featureType').map((f, i) => <Feature key={i} feature={f} />)}
            </Section>
          )}
          {product.fees?.length > 0 && (
            <Section title="Fees">
              {sortArray(product.fees.filter(Boolean), 'feeType').map((f, i) => <Fee key={i} fee={f} />)}
            </Section>
          )}
          {product.cardArt?.length > 0 && (
            <Section title="Card Art">
              {product.cardArt.map((c, i) => <CardArt key={i} cardArt={c} />)}
            </Section>
          )}
        </div>
      </Accordion>
    </div>
  )
}

const mapStateToProps = state => ({ selectedProducts: state.bankingSelection })

export default connect(mapStateToProps, { selectProduct, deselectProduct })(Product)
