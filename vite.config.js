import { defineConfig } from 'vite'

// The site is served from the custom domain telascolombia.com.co
// (root path), so base is '/'. If it ever goes back to
// <user>.github.io/telas-de-colombia/, set base to '/telas-de-colombia/'.
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
  },
})
