import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,

    // ✅ Chunk size warning limit
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        manualChunks(id) {

          // React core — sabse pehle load hoga
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'react-core'
          }

          // React Router — alag chunk
          if (id.includes('node_modules/react-router') ||
              id.includes('node_modules/@remix-run')) {
            return 'react-router'
          }

          // Lucide icons — bahut badi library, alag chunk
          if (id.includes('node_modules/lucide-react')) {
            return 'icons'
          }

          // PDF — sirf download pe load hoga
          if (id.includes('node_modules/html2pdf') ||
              id.includes('node_modules/html2canvas') ||
              id.includes('node_modules/jspdf')) {
            return 'pdf-vendor'
          }

          // Templates — alag chunk
          if (id.includes('/src/templates/')) {
            return 'templates'
          }

          // SEO pages — alag chunk
          if (id.includes('/src/pages/seo/')) {
            return 'seo-pages'
          }

          // Blog — alag chunk
          if (id.includes('/src/pages/Blog') ||
              id.includes('/src/pages/BlogPost')) {
            return 'blog'
          }

          // Baaki sab node_modules — vendor chunk
          if (id.includes('node_modules/')) {
            return 'vendor'
          }
        },
      },
    },
  },

  // ✅ Dev server optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['html2pdf.js'],
  },
})