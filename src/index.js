import React, { useState, createContext, useMemo } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Page from './components/Page'
import * as serviceWorker from './serviceWorker'
import { Provider as StoreProvider } from 'react-redux'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import store from './store'

export const ThemeContext = createContext()

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : true
  })

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      localStorage.setItem('darkMode', JSON.stringify(!prev))
      return !prev
    })
  }

  const muiTheme = useMemo(() => createTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      background: { paper: darkMode ? '#1e293b' : '#ffffff', default: darkMode ? '#0f172a' : '#f1f5f9' },
    },
  }), [darkMode])

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={muiTheme}>
        <div className={darkMode ? 'dark' : ''}>
          <div className="bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen font-sans">
            <Page />
          </div>
        </div>
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

ReactDOM.render(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>,
  document.getElementById('root')
)

serviceWorker.unregister()
