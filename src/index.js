import React, { useState, createContext } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Page from './components/Page'
import * as serviceWorker from './serviceWorker'
import { Provider as StoreProvider } from 'react-redux'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import store from './store'

const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
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
      root: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.875rem',
        letterSpacing: '0.25px',
      },
    },
  },
})

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: { main: '#3b82f6', dark: '#2563eb', light: '#60a5fa', contrastText: '#fff' },
    secondary: { main: '#06b6d4', contrastText: '#000' },
    background: { default: '#0f172a', paper: '#1e293b' },
    text: { primary: '#f1f5f9', secondary: '#cbd5e1' },
    error: { main: '#ef4444' },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    useNextVariants: true,
  },
  shape: { borderRadius: 10 },
  overrides: {
    MuiPaper: {
      rounded: { borderRadius: 10 },
      elevation1: { boxShadow: '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)' },
    },
    MuiAccordion: {
      root: {
        borderRadius: '10px !important',
        marginBottom: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        backgroundColor: '#1e293b',
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
      root: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.875rem',
        letterSpacing: '0.25px',
      },
    },
  },
})

export const ThemeContext = createContext()

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      localStorage.setItem('darkMode', JSON.stringify(!prev))
      return !prev
    })
  }

  const theme = darkMode ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>
        <div style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
          <Page />
        </div>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

ReactDOM.render(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>,
  document.getElementById('root')
)

serviceWorker.register()
