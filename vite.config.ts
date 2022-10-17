import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { join } from 'path'
import react from '@vitejs/plugin-react'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'

const production = process.env.NODE_ENV === 'production'
const resolve = (dir: string) => join(__dirname, dir)

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
  build: {
    target: 'ES2022',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        // pure_funcs: ['console.log'],
        drop_debugger: true,
      },
    },
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    port: 8888,
    proxy: {
      '/api/': {
        target: 'https://url.devserver/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    react(),
    chunkSplitPlugin(),
    !production &&
      nodePolyfills({
        include: [
          'node_modules/**/*.js',
          new RegExp('node_modules/.vite/.*js'),
        ],
      }),
  ],
})
