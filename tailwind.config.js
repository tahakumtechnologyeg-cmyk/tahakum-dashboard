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
          bg:     '#EDE8DC',   // بيج دافي — خلفية
          panel:  '#F5F1E8',   // بيج أفتح — الكروت
          border: '#C8BFA8',   // بوردر بيج داكن شوية
          accent: '#2A7ABF',   // أزرق فاتح للأزرار
          green:  '#14532D',   // أخضر داكن
          amber:  '#C0392B',   // أحمر/كورال
          red:    '#E05444',   // كورال فاتح للتنبيهات
          dim:    '#D9D3C4',   // hover أغمق
          text:   '#1A1208',   // نص داكن جداً
          muted:  '#5C5040',   // نص ثانوي
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
