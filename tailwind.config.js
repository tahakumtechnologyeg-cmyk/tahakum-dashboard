/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Orbitron"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
      },
      colors: {
        scada: {
          bg:     '#8C9BAA',   // Graphite — خلفية
          panel:  '#9EADB9',   // الكروت أفتح شوية
          border: '#7A8C99',   // حدود واضحة
          accent: '#1A4F7A',   // أزرق داكن للأزرار
          green:  '#14532D',   // أخضر داكن
          amber:  '#78350F',   // برتقالي داكن
          red:    '#7F1D1D',   // أحمر داكن
          dim:    '#7A8C99',   // hover أغمق
          text:   '#050C14',   // نص داكن جداً
          muted:  '#1E3448',   // نص ثانوي
        }
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
      }
    },
  },
  plugins: [],
}
