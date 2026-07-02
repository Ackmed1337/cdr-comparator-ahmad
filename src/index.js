import React, { useState, useEffect, createContext } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Page from './components/Page'
import * as serviceWorker from './serviceWorker'
import { Provider as StoreProvider } from 'react-redux'
import store from './store'

export const ThemeContext = createContext()

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : true
  })

  // The `dark` class must live on <html>, not an inner div: Radix components
  // (Select, Tooltip, etc.) render their popups via a portal appended directly
  // to <body>, which sits outside any inner div's subtree and would otherwise
  // never see the dark-mode CSS variables.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => {
    document.documentElement.classList.add('theme-switching')
    setDarkMode(prev => {
      localStorage.setItem('darkMode', JSON.stringify(!prev))
      return !prev
    })
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('theme-switching')
      })
    })
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className="bg-background text-foreground min-h-screen font-sans">
        <Page />
      </div>
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
