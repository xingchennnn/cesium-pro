import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import cesium from 'vite-plugin-cesium';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 使用 vite-plugin-cesium 插件
    cesium(),
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
    },
  },
  build: {
    target: "esNext",
  },
});
