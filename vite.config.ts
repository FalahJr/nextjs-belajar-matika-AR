import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Chunk MindAR (+ TensorFlow.js) besar, tetapi dimuat malas hanya saat pengguna menekan Mulai Scan.
    chunkSizeWarningLimit: 2500,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
