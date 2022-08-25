import type { UserConfig, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import eslintPlugin from 'vite-plugin-eslint'
import { loadEnv } from 'vite'

const resolve = (p: string) => path.resolve(__dirname, p)

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  console.log('command', command, mode, env)

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
    plugins: [vue(), vueJsx(), eslintPlugin()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/styles/mixins.scss";`
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 8440,
      open: false,
      https: false,
      cors: true,
      proxy: {
        '/business-web': {
          // target: 'http://localhost:3301', // 模拟
          target: 'http://nzf.qimiaowa.com:30356', //正式开发/
          changeOrigin: true
        },
        '/ftp': {
          target: 'http://imgserver.qimiaowa.com:30358',
          changeOrigin: true
        },
        '/img': {
          target: 'http://img.qimiaowa.com:30359',
          changeOrigin: true
        }
      }
    }
  }
}
