import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

let devtoolsPlugin = null
try {
	// top-level await works in ESM vite config
	const mod = await import('vite-plugin-vue-devtools')
	devtoolsPlugin = mod.default || mod
} catch (e) {
	console.warn('vite-plugin-vue-devtools not found — continuing without it.')
}

export default defineConfig({
  plugins: [
    vue(),
    // add devtools only when available
    devtoolsPlugin ? devtoolsPlugin() : null,
		tailwindcss(),
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    proxy: {
      '/api-sportmonks': {
        target: 'https://api.sportmonks.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-sportmonks/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {

          })
        },
      },
    },
  },
})
