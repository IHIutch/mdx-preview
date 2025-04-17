import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from '@tanstack/react-start/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    preset: 'vercel',
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: ['node_modules/@uswds/uswds/packages'],
          quietDeps: true,
        },
      },
    },
    plugins: [
      tailwindcss(),
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
})
