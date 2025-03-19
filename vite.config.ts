import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import cesium from 'vite-plugin-cesium';
import { VueMcp } from 'vite-plugin-vue-mcp'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 使用 vite-plugin-cesium 插件
    cesium(),
    // 使用 vite-plugin-vue-mcp 插件
    VueMcp({
      // port: 10087, // mcp服务端口号
      // printUrl: true, // 是否打印服务地址
    })
  ],
  define: {
    CESIUM_BASE_URL: JSON.stringify(""),  // 在这里定义cesium的全局变量
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 10086,
    host: true,
    proxy: {
      "/api": {
        target: "http://192.168.200.205:3000", 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      '/icon': {
        target: 'http://49.234.58.117:9000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/icon/, ''),
        
      }
    },
  },
  build: {
    target: "esNext",
  },
});
