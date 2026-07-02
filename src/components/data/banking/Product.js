import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ChevronDown } from 'lucide-react'
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
import { Checkbox } from '../../ui/Checkbox'
import { Button } from '../../ui/Button'
import { cn } from '../../../lib/utils'

const Field = ({ label, value }) => {
  if (!value && value !== 0 && value !== false) return null
  return (
    <div className="mb-2">
      <span className="text-muted-foreground font-medium mr-4">{label}:</span>
      {value}
    </div>
  )
}

const Section = ({ title, children }) => {
  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="text-xs font-bold text-primary uppercase tracking-wide mb-2">{title}</div>
      <ul className="m-0 pl-4">{children}</ul>
    </div>
  )
}

const sortArray = (arr, key) => [...arr].sort((a, b) => ecomp(a[key], b[key]))

const Product = (props) => {
  const { product, dataSourceIndex, selectedProducts } = props
  const [expanded, setExpanded] = useState(false)
  const selected = selectedProducts.some(p => p.dataSourceIdx === dataSourceIndex && p.product.productId === product.productId)

  const toggle = checked => checked
    ? props.selectProduct(dataSourceIndex, product)
    : props.deselectProduct(dataSourceIndex, product)

  const viewJSON = () => {
    const blob = new Blob([JSON.stringify(product, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 60000)
  }

  return (
    <div className="flex items-start gap-3 mb-2 px-3 py-2.5 bg-card border border-border rounded-md hover:border-primary/50 transition-colors duration-200">
      {/* Selection Checkbox */}
      <Checkbox checked={selected} onCheckedChange={toggle} className="mt-1.5 flex-shrink-0" />

      {/* Accordion Content */}
      <div className="flex-1 min-w-0">
        {/* Summary/Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'w-full flex items-center justify-between py-0.5 text-left font-semibold text-sm transition-colors duration-200 hover:text-primary',
            selected ? 'text-primary' : 'text-foreground'
          )}
        >
          <span className="line-height-1.4">{product.name}</span>
          <ChevronDown className={cn('w-4 h-4 transition-transform duration-200 flex-shrink-0 ml-2', expanded && 'rotate-180')} />
        </button>

        {/* Body Content */}
        {expanded && (
          <div className="mt-4 pl-0 text-foreground/90 text-sm leading-relaxed space-y-2">
            {product.description && (
              <div className="text-muted-foreground mb-3 text-xs leading-normal">
                {product.description}
              </div>
            )}
            <Field label="Brand" value={product.brand} />
            <Field label="Last updated" value={
              <span className="text-foreground/90">
                <DateTime rfc3339={product.lastUpdated} /> &nbsp;
                <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={viewJSON}>View JSON</Button>
              </span>
            } />
            <Field label="Tailored" value={product.isTailored ? 'Yes' : 'No'} />
            {product.effectiveFrom && <Field label="Effective from" value={<DateTime rfc3339={product.effectiveFrom} />} />}
            {product.effectiveTo && <Field label="Effective to" value={<DateTime rfc3339={product.effectiveTo} />} />}
            {product.applicationUri && (
              <div className="mb-2">
                <a
                  href={product.applicationUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold text-sm"
                >
                  Apply here →
                </a>
              </div>
            )}
            {product.additionalInformation && (
              <div className="mt-8 pt-6 border-t border-border">
                <div className="text-xs font-bold text-primary uppercase tracking-wide mb-2">Additional Info</div>
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
        )}
      </div>
    </div>
  )
}

const mapStateToProps = state => ({ selectedProducts: state.bankingSelection })

export default connect(mapStateToProps, { selectProduct, deselectProduct })(Product)
