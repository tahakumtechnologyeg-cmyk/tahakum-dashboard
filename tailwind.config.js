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
          bg:     '#CBD8E5',   // رمادي مزرق متوسط — خلفية هادية
          panel:  '#D8E4EF',   // الكروت أغمق شوية من الخلفية
          border: '#A8BDD0',   // حدود واضحة بس مش صارخة
          accent: '#1558A0',   // أزرق بترولي للأزرار
          green:  '#166534',   // أخضر داكن
          amber:  '#92400E',   // برتقالي داكن
          red:    '#991B1B',   // أحمر داكن
          dim:    '#B8CCDE',   // hover
          text:   '#0F1F2E',   // نص داكن جداً مقروء
          muted:  '#3D5A73',   // نص ثانوي
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
