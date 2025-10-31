import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

let devtoolsPlugin = null
try {
  const mod = await import('vite-plugin-vue-devtools')
  devtoolsPlugin = mod.default || mod
} catch (e) {
  console.warn('vite-plugin-vue-devtools not found — continuing without it.')
}

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    devtoolsPlugin ? devtoolsPlugin() : null
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  build: {
    outDir: 'dist',        
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },

  server: {
    proxy: {
      '/api-sportmonks': {
        target: 'https://api.sportmonks.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-sportmonks/, '')
      }
    }
  }
})
