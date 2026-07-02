import React, { useContext } from 'react'
import logo from '../header/CDS-logo.png'
import { ThemeContext } from '../../index'
import { Button } from '../ui/Button'

export default function Header({ title }) {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext)

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-300/50 dark:shadow-slate-950/50">
      <div className="flex items-center justify-between h-16 px-3 sm:px-6 gap-2 sm:gap-6">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <img
            src={logo}
            alt="CDS logo"
            className="h-7 w-7 sm:h-8 sm:w-8 object-contain opacity-90 dark:brightness-0 dark:invert flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="font-bold text-base sm:text-lg text-blue-600 dark:text-blue-400 leading-tight truncate">
              {title}
            </div>
            <div className="hidden sm:block text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-medium truncate">
              CDR Banking API Explorer
            </div>
          </div>
        </div>

        {/* Center: User Info */}
        <div className="hidden md:block text-slate-700 dark:text-slate-300 text-sm font-semibold whitespace-nowrap">
          Ahmad ElSayed — Ultradata Version
        </div>

        {/* Right: Demo Badge & Dark Mode Toggle */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto flex-shrink-0">
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 sm:px-3 py-1 rounded-full border border-blue-300 dark:border-blue-800/50 uppercase tracking-wider whitespace-nowrap">
            Demo
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleDarkMode}
            className="gap-2 !px-2 sm:!px-4"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span aria-hidden="true">{darkMode ? '☀️' : '🌙'}</span>
            <span className="hidden sm:inline">{darkMode ? 'Light mode' : 'Dark mode'}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
