import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // <--- Changed from '@vitejs/react-plugin'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})