import React, { useContext } from 'react'
import logo from './CDS-logo.png'
import { ThemeContext } from '../../index'
import IconButton from '@material-ui/core/IconButton'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'

export default function Header({ title }) {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext)

  return (
    <div style={{
      background: darkMode ? '#0f172a' : '#0f172a',
      padding: '0 24px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginBottom: 20,
    }}>
      <img
        src={logo}
        alt="CDS logo"
        style={{ height: 34, width: 34, objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.85 }}
      />
      <div>
        <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.2px', lineHeight: 1.2 }}>
          {title}
        </div>
        <div style={{ color: '#475569', fontSize: '0.7rem', letterSpacing: '0.4px', textTransform: 'uppercase', fontWeight: 500, marginTop: 1 }}>
          CDR Banking API Explorer
        </div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ color: '#f1f5f9', fontSize: '0.8rem', fontWeight: 600 }}>Ahmad ElSayed — Ultradata Version</div>
        <span style={{
          background: '#1e3a8a',
          color: '#93c5fd',
          fontSize: '0.68rem',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: 20,
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
        }}>
          Demo
        </span>
        <IconButton
          size="small"
          onClick={toggleDarkMode}
          style={{ color: '#93c5fd' }}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Brightness7Icon style={{ fontSize: 20 }} /> : <Brightness4Icon style={{ fontSize: 20 }} />}
        </IconButton>
      </div>
    </div>
  )
}
