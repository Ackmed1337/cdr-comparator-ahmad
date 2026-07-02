import React, { useContext } from 'react'
import { Sun, Moon } from 'lucide-react'
import logo from '../header/CDS-logo.png'
import { ThemeContext } from '../../index'
import { Switch } from '../ui/Switch'
import { Badge } from '../ui/Badge'
import { Separator } from '../ui/Separator'

export default function Header({ title }) {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="flex items-center justify-between h-16 px-3 sm:px-6 gap-2 sm:gap-6">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <img
            src={logo}
            alt="CDS logo"
            className="h-7 w-7 sm:h-8 sm:w-8 object-contain opacity-90 dark:brightness-0 dark:invert flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="font-bold text-base sm:text-lg text-primary leading-tight truncate">
              {title}
            </div>
            <div className="hidden sm:block text-muted-foreground text-xs uppercase tracking-widest font-medium truncate">
              CDR Banking API Explorer
            </div>
          </div>
        </div>

        {/* Center: User Info */}
        <div className="hidden md:block text-foreground/80 text-sm font-semibold whitespace-nowrap">
          Ahmad ElSayed — Ultradata Version
        </div>

        {/* Right: Demo Badge & Dark Mode Toggle */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto flex-shrink-0">
          <Badge variant="primary" className="whitespace-nowrap">Demo</Badge>
          <Separator orientation="vertical" className="hidden sm:block h-5" />
          <div
            className="flex items-center gap-1.5 sm:gap-2"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Sun className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Switch
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            />
            <Moon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
        </div>
      </div>
    </header>
  )
}
