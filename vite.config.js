import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')?.[1]
const defaultBase = repoName ? `/${repoName}/` : '/'
const basePath = process.env.VITE_BASE_PATH ?? (process.env.GH_PAGES ? defaultBase : '/')

// https://vite.dev/config/
export default defineConfig({
  base: basePath,
  plugins: [react()],
})
