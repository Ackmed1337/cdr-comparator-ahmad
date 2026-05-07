import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Page from './components/Page'
import * as serviceWorker from './serviceWorker'
import { Provider as StoreProvider } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import store from './store'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#2563eb', dark: '#1d4ed8', light: '#60a5fa', contrastText: '#fff' },
    secondary: { main: '#0891b2', contrastText: '#fff' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#1e293b', secondary: '#64748b' },
    error: { main: '#dc2626' },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    useNextVariants: true,
  },
  shape: { borderRadius: 10 },
  overrides: {
    MuiPaper: {
      rounded: { borderRadius: 10 },
      elevation1: { boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)' },
    },
    MuiAccordion: {
      root: {
        borderRadius: '10px !important',
        marginBottom: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
        '&:before': { display: 'none' },
        '&$expanded': { marginBottom: 10 },
      },
      expanded: {},
    },
    MuiAccordionSummary: {
      root: {
        minHeight: 52,
        padding: '0 20px',
        '&$expanded': { minHeight: 52 },
      },
      content: {
        margin: '14px 0',
        '&$expanded': { margin: '14px 0' },
      },
      expanded: {},
    },
    MuiFab: {
      root: { boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textTransform: 'none' },
      extended: { fontWeight: 600, fontSize: '0.875rem' },
    },
    MuiLinearProgress: {
      root: { borderRadius: 4, height: 5 },
      bar: { borderRadius: 4 },
    },
    MuiTab: {
      root: { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem' },
    },
    MuiTableCell: {
      root: { borderColor: '#f1f5f9', fontSize: '0.82rem', padding: '10px 16px' },
      head: { fontWeight: 700, color: '#1e293b', backgroundColor: '#f8fafc' },
    },
    MuiDivider: { root: { backgroundColor: '#f1f5f9' } },
    MuiTooltip: {
      tooltip: { borderRadius: 6, fontSize: '0.78rem', backgroundColor: '#1e293b' },
    },
    MuiCheckbox: { root: { color: '#94a3b8' } },
    MuiFormLabel: { root: { fontSize: '0.82rem', fontWeight: 600, color: '#64748b' } },
  },
})

const App = () => (
  <StoreProvider store={store}>
    <MuiThemeProvider theme={theme}>
      <Page />
    </MuiThemeProvider>
  </StoreProvider>
)

ReactDOM.render(<App />, document.getElementById('root'))
serviceWorker.unregister()
