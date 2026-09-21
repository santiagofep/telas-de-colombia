import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { globSync } from 'node:fs'

// The site is served from the custom domain telascolombia.com.co
// (root path), so base is '/'. If it ever goes back to
// <user>.github.io/telas-de-colombia/, set base to '/telas-de-colombia/'.
//
// Every *.html file in the project root becomes a build entry point
// automatically, so new category pages don't need to be added here by hand.
const htmlEntries = Object.fromEntries(
  globSync('*.html', { cwd: __dirname }).map((file) => [file.replace(/\.html$/, ''), resolve(__dirname, file)])
)

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: htmlEntries,
    },
  },
})
