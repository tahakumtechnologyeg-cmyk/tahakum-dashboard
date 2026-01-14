import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Takamul/', // ضيف السطر ده بالظبط (تأكد من الحروف الكبيرة والصغيرة لاسم الريبو)
})