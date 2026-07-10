import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.jsx', '.js', '.json'],  // .jsx first!
    // This tells Vite to look for .jsx files first
  },
  server: {
    // Force Vite to be case-sensitive (helps catch issues early)
    fs: {
      strict: true,
    },
  },
})