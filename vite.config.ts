import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'i18next',
            'react-i18next',
            '@stripe/stripe-js',
            '@stripe/react-stripe-js',
            'firebase/app',
            'firebase/auth',
            'firebase/firestore'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
