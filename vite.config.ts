import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/app.tsx'],
      refresh: true,
    }),
    react({
      jsxRuntime: 'automatic',
      include: /\.([jt]sx?)$/, // necessário para evitar falha de detecção
    }),
  ],
})