/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Orbitron"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
      },
      colors: {
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-bg': 'var(--color-primary-bg)',
        accent: 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        dark: 'var(--color-dark)',
        'dark-2': 'var(--color-dark-2)',
        scada: {
          bg:     'var(--scada-bg)',
          panel:  'var(--scada-panel)',
          border: 'var(--scada-border)',
          accent: 'var(--scada-accent)',
          green:  'var(--scada-green)',
          amber:  'var(--scada-amber)',
          red:    'var(--scada-red)',
          dim:    'var(--scada-dim)',
          text:   'var(--scada-text)',
          muted:  'var(--scada-muted)',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1.2s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        }
      },
    },
  },
  plugins: [],
}
