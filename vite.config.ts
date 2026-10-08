import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served from https://nicoiodice.github.io/game-night-on/ (GitHub Pages)
  base: '/game-night-on/',
})
