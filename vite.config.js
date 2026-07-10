import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    // This helps Vite prefer .jsx over .css
    mainFields: ['module', 'main'],
  },
  css: {
    modules: {
      // If using CSS modules
      localsConvention: 'camelCase',
    },
  },
})