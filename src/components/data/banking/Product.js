import React, { useState } from 'react'
import { connect } from 'react-redux'
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

const Field = ({ label, value }) => {
  if (!value && value !== 0 && value !== false) return null
  return (
    <div className="mb-2">
      <span className="text-slate-500 dark:text-slate-400 font-medium mr-4">{label}:</span>
      {value}
    </div>
  )
}

const Section = ({ title, children }) => {
  return (
    <div className="mt-8 pt-6 border-t border-slate-300 dark:border-slate-700">
      <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2">{title}</div>
      <ul className="m-0 pl-4">{children}</ul>
    </div>
  )
}

const sortArray = (arr, key) => [...arr].sort((a, b) => ecomp(a[key], b[key]))

const Product = (props) => {
  const { product, dataSourceIndex, selectedProducts } = props
  const [expanded, setExpanded] = useState(false)
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
    <div className="flex items-start gap-3 mb-2 px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:border-blue-400 dark:hover:border-blue-500/50 transition-colors duration-200">
      {/* Selection Checkbox */}
      <label className="relative flex-shrink-0 mt-1.5 w-4 h-4 cursor-pointer group">
        <input
          type="checkbox"
          checked={selected}
          onChange={toggle}
          className="absolute opacity-0 w-4 h-4 cursor-pointer"
        />
        <div className={`w-4 h-4 rounded border-2 transition-colors duration-200 ${
          selected
            ? 'bg-blue-500 border-blue-500'
            : 'border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900 group-hover:border-blue-500'
        }`}>
          {selected && (
            <svg className="w-3 h-3 text-white absolute inset-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </label>

      {/* Accordion Content */}
      <div className="flex-1 min-w-0">
        {/* Summary/Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full flex items-center justify-between py-0.5 text-left font-semibold text-sm transition-colors duration-200 ${
            selected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-slate-100'
          } hover:text-blue-500 dark:hover:text-blue-300`}
        >
          <span className="line-height-1.4">{product.name}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ml-2 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>

        {/* Body Content */}
        {expanded && (
          <div className="mt-4 pl-0 text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-2">
            {product.description && (
              <div className="text-slate-500 dark:text-slate-400 mb-3 text-xs leading-normal">
                {product.description}
              </div>
            )}
            <Field label="Brand" value={product.brand} />
            <Field label="Last updated" value={
              <span className="text-slate-700 dark:text-slate-300">
                <DateTime rfc3339={product.lastUpdated} /> &nbsp;
                <button
                  onClick={downloadJSON}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-xs font-semibold underline cursor-pointer bg-transparent border-none p-0"
                >
                  JSON
                </button>
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
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-semibold text-sm"
                >
                  Apply here →
                </a>
              </div>
            )}
            {product.additionalInformation && (
              <div className="mt-8 pt-6 border-t border-slate-300 dark:border-slate-700">
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2">Additional Info</div>
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
