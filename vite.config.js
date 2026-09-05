import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
<<<<<<< HEAD
=======
  // Relative base so the built app (and bundled backdrop) works from file:// in the Electron shell
  base: './',
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
})
