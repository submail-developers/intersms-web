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
  build: {
    // outDir: 'dist',
    // assetsDir: 'asset',
    sourcemap: false,
    target: 'modules',
    cssCodeSplit: true, // 是否拆分css，false-所有css打包到一个文件，true-单独打包，默认为true
    cssTarget: 'chrome61',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // 最小化拆分包
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString()
          }
        },
        // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
        entryFileNames: 'assets/js/[name].[hash].js',
        // 用于命名代码拆分时创建的共享块的输出命名
        // 　　chunkFileNames: 'js/[name].[hash].js',
        // 用于输出静态资源的命名，[ext]表示文件扩展名
        assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
        // 拆分js到模块文件夹
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/')
            : []
          const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]'
          return `assets/js/${fileName}/[name].[hash].js`
        },
      },
      // external: [/node_modules/],
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
