import { defineConfig } from 'vite'

// base must match the GitHub repo name so assets resolve on
// https://<user>.github.io/telas-de-colombia/
export default defineConfig({
  base: '/telas-de-colombia/',
  build: {
    outDir: 'dist',
  },
})
