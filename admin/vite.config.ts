import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// VITE_API_TARGET lets CI (and local dev with a remote backend) point the
// preview server's proxy at a different host without rebuilding the SPA.
const backendTarget = process.env.VITE_API_TARGET ?? 'http://localhost:8080'

const proxy = {
  '/api':     { target: backendTarget, changeOrigin: true },
  '/uploads': { target: backendTarget, changeOrigin: true },
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Dev server (local)
  server: { port: 4000, proxy },
  // Preview server used by Playwright E2E — must proxy so /api reaches the backend
  preview: { proxy },
  base: '/admin/',
})
