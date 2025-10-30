  import { fileURLToPath, URL } from 'node:url'
  import { defineConfig } from 'vite'
  import vue from '@vitejs/plugin-vue'
  import vueDevTools from 'vite-plugin-vue-devtools'
  import tailwindcss from '@tailwindcss/vite'

  export default defineConfig({
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    //Dev server proxy — avoids CORS issues with SportMonks API
    server: {
      proxy: {
        '/api-sportmonks': {
          target: 'https://api.sportmonks.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-sportmonks/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              
            })
          }
        }
      }
    }
  })
