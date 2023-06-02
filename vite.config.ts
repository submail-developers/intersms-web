import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite'
import { wrapperEnv } from './src/viteConf/utils'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv): UserConfig => {
  const env = loadEnv(mode.mode, process.cwd())
  const viteEnv = wrapperEnv(env)
  return {
    base: '/',
    plugins: [
      react(),
      createHtmlPlugin({
        minify: false, // 是否开启压缩html
        /**
         * 在这里写entry后，你将不需要在`index.html`内添加 script 标签，原有标签需要删除
         * @default src/main.ts
         */
        entry: 'src/main.tsx',
        inject: {
          data: {
            title: viteEnv.VITE_GLOB_APP_TITLE, // 网站title
            injectScript: ``, // 添加额外的script标签
            // injectScript: `<script src="./inject.js"></script>`, // 添加额外的script标签
          },
        },
      }),
      // * 是否生成包预览
      viteEnv.VITE_REPORT &&
        visualizer({
          emitFile: false, // 生成的分析文件位置，true-打包文件下，false-项目根目录下
          filename: 'stats.html', // 分析文件的文件名
          open: true, // 打包后自动打开分析文件
          title: '依赖分析表',
        }),
      // * gzip compress
      viteCompression({
        verbose: true, // 是否在控制台输出压缩结果
        disable: !viteEnv.VITE_BUILD_GZIP, // 是否禁用,相当于开关在这里
        threshold: 10240, // 体积大于 该值时 才会被压缩，1024 约为 1kb
        algorithm: 'gzip', // 压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
        ext: '.gz', // 文件后缀
        deleteOriginFile: true, // 是否删除源文件，只保留.gz
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // 设置别名
      },
    },
    esbuild: {
      // 线上环境清空console和debugger
      pure: viteEnv.VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
      // 是否开启摇树
      treeShaking: true,
    },
    build: {
      // outDir: 'dist',
      // assetsDir: 'asset',
      sourcemap: false,
      target: 'modules',
      cssCodeSplit: false, // 是否拆分css，false-所有css打包到一个文件，true-单独打包
      cssTarget: 'chrome61',
      chunkSizeWarningLimit: 1500, // kbs
      assetsInlineLimit: 1024 * 4, // 4kb 小于此阈值的导入或引用资源将内联为 base64 编码
      minify: 'esbuild', // 使用esbuild打包
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
            const fileName =
              facadeModuleId[facadeModuleId.length - 2] || '[name]'
            return `assets/js/${fileName}/[name].[hash].js`
          },
        },
        // external: [/node_modules/],
      },
    },
    server: {
      host: '0.0.0.0', // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
      port: viteEnv.VITE_PORT, // 默认端口号
      open: viteEnv.VITE_OPEN, // 项目启动后，是否自动打开浏览器
      proxy: {
        '/mytest/': {
          // 测试接口
          target: 'https://petstore-demo.apifox.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/mytest/, ''),
        },
        '/apis/': {
          target: 'http://zjhtest.submail.intersms.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/apis/, ''),
          // secure: false,
        },
      },
    },
  }
})
