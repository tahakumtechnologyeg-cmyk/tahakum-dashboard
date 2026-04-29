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
          bg:     '#8C9BAA',   // Graphite — خلفية (محتفظ بيها)
          panel:  '#9EADB9',   // الكروت أفتح شوية (محتفظ بيها)
          border: '#7A8C99',   // حدود واضحة (محتفظ بيها)
          accent: '#2A7ABF',   // أزرق فاتح للأزرار
          green:  '#7F1D1D',   // أحمر داكن (بدل الأخضر)
          amber:  '#C0392B',   // أحمر/كورال (بدل البرتقالي)
          red:    '#E05444',   // كورال فاتح (للتنبيهات)
          dim:    '#7A8C99',   // hover أغمق (محتفظ بيها)
          text:   '#050C14',   // نص داكن جداً (محتفظ بيها)
          muted:  '#1E3448',   // نص ثانوي (محتفظ بيها)
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
