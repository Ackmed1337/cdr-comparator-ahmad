module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#030712',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
        },
        blue: {
          600: '#2563eb',
          500: '#3b82f6',
          400: '#60a5fa',
          300: '#93c5fd',
        },
        green: {
          600: '#059669',
          500: '#10b981',
          400: '#34d399',
        },
        red: {
          600: '#dc2626',
          500: '#ef4444',
          400: '#f87171',
        },
        amber: {
          500: '#f59e0b',
          400: '#fbbf24',
        },
        cyan: {
          500: '#06b6d4',
          400: '#22d3ee',
        },
      },
      fontSize: {
        'display-lg': ['2.25rem', { lineHeight: '2.75rem', fontWeight: '700' }],
        'display-md': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        'h1': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        'h2': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'h3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'body': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'label': ['0.75rem', { lineHeight: '1rem', fontWeight: '600' }],
        'xs': ['0.75rem', { lineHeight: '1rem', fontWeight: '500' }],
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
      maxHeight: {
        '160': '40rem',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      backgroundImage: {
        'gradient-slate': 'linear-gradient(to right, rgba(15, 23, 42, 1), rgba(30, 41, 59, 1), rgba(15, 23, 42, 1))',
      },
    },
  },
  plugins: [],
}
