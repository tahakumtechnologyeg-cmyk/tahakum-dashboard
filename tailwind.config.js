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
          bg:     '#EEF2F7',   // رمادي مزرق خفيف — مريح للعين
          panel:  '#F8FAFC',   // أبيض مايل للرمادي — مش صارخ
          border: '#D1DCE8',   // حدود رمادي مزرق
          accent: '#1D6FA4',   // أزرق بترولي داكن شوية
          green:  '#1A7F4B',   // أخضر داكن مقروء
          amber:  '#B45309',   // برتقالي داكن
          red:    '#B91C1C',   // أحمر داكن
          dim:    '#DDE6F0',   // hover خفيف
          text:   '#1E293B',   // نص داكن مريح
          muted:  '#546E8A',   // نص ثانوي
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
