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
          bg:     '#F5EFE4',   // أكريم دافي — خلفية
          panel:  '#FBF7EF',   // أكريم فاتح — الكروت
          border: '#D4C9B5',   // بيج رملي للبوردر
          accent: '#5B8DB8',   // أزرق هادي مش صارخ
          green:  '#3B6B45',   // أخضر زيتي دافي
          amber:  '#A0522D',   // بني طوبي — بديل الأحمر الصارخ
          red:    '#B94040',   // أحمر داكن دافي للتنبيهات
          dim:    '#EDE5D8',   // hover أغمق شوية
          text:   '#2C1F10',   // بني داكن جداً بدل الأسود
          muted:  '#6B5440',   // بني متوسط للنص الثانوي
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
