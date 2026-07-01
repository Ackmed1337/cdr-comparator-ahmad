import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import DataSourcePanel from './data-source/DataSourcePanel'
import BankingPanel from './data/banking/BankingPanel'
import ConsolePanel from './data/ConsolePanel'
import Header from './header'
import BankingComparisonPanel from './comparison/BankingComparisonPanel'
import DiscoveryInfo from './data/discovery/DiscoveryInfo'
import QuickTips from './QuickTips'

const useStyles = makeStyles(() => ({
  hidden: { display: 'none' },
  content: { padding: '0 20px 48px' },
  tabRow: {
    display: 'inline-flex',
    gap: 3,
    padding: 4,
    background: '#fff',
    borderRadius: 10,
    boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
    marginBottom: 14,
  },
  tab: {
    padding: '8px 22px',
    border: 'none',
    borderRadius: 7,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
    outline: 'none',
  },
  activeTab: {
    background: '#2563eb',
    color: '#fff',
    boxShadow: '0 1px 3px rgba(37,99,235,0.35)',
  },
  inactiveTab: {
    background: 'transparent',
    color: '#64748b',
    '&:hover': { background: '#f1f5f9', color: '#1e293b' },
  },
}))

const tabs = ['Banking', 'Status & Outages']

function Page() {
  const [tab, setTab] = React.useState(0)
  const classes = useStyles()

  return (
    <>
      <Header title="Comparator" />
      <div className={classes.content}>
        <DataSourcePanel />
        <QuickTips />
        <ConsolePanel />
        <div className={classes.tabRow}>
          {tabs.map((label, i) => (
            <button
              key={i}
              className={`${classes.tab} ${tab === i ? classes.activeTab : classes.inactiveTab}`}
              onClick={() => setTab(i)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className={tab !== 0 ? classes.hidden : ''}>
          <BankingPanel />
          <BankingComparisonPanel />
        </div>
        <div className={tab !== 1 ? classes.hidden : ''}>
          <DiscoveryInfo />
        </div>
      </div>
    </>
  )
}

export default Page
