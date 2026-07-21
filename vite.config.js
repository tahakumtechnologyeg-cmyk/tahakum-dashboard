import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Tahakom-v1-DashBoard/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
