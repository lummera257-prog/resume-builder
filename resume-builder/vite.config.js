import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change base to '/resume-forge/' when deploying to GitHub Pages
// Use '/' for Vercel/Netlify or local dev
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
