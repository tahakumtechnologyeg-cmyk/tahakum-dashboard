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
          bg:     '#F0F4F8',   // خلفية رمادي فاتح جداً
          panel:  '#FFFFFF',   // الكروت بيضاء
          border: '#CBD5E1',   // حدود رمادي ناعم
          accent: '#0284C7',   // أزرق بترولي
          green:  '#16A34A',   // أخضر واضح
          amber:  '#D97706',   // برتقالي دافي
          red:    '#DC2626',   // أحمر واضح
          dim:    '#E2E8F0',   // رمادي خفيف للـ hover
          text:   '#334155',   // نص داكن مريح
          muted:  '#64748B',   // نص ثانوي
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
