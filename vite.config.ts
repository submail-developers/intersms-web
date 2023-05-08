import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 设置别名
    },
  },
  server: {
    proxy: {
      '/pet': {
        target: 'https://petstore-demo.apifox.com/',
        changeOrigin: true,
      },
      '/apis': {
        target: 'http://zjhtest.submail.intersms.com/console/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apis/, ''),
      },
    },
  },
})
