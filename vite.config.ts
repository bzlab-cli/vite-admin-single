import type { UserConfig, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import eslintPlugin from 'vite-plugin-eslint'
import viteCompression from 'vite-plugin-compression'
// import { loadEnv } from 'vite'
const dynamicProxy = require('./build/proxy/index.ts')
const resolve = (p: string) => path.resolve(__dirname, p)

export default ({ command, mode }: ConfigEnv): UserConfig => {
  // const root = process.cwd()
  // const env = loadEnv(mode, root)
  console.log('command', command, mode)

  return {
    resolve: {
      alias: {
        '@': resolve('./src'),
        path: 'path-browserify'
      }
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, //打包时删除console
          drop_debugger: true, //打包时删除 debugger
          pure_funcs: ['console.log']
        }
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      eslintPlugin(),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 102400,
        algorithm: 'gzip',
        ext: '.gz'
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/styles/mixins.scss";`
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 8445,
      open: false,
      https: false,
      cors: true,
      proxy: dynamicProxy.proxy
    }
  }
}
