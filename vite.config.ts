import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// import {VitePluginCopy} from "vite-plugin-copy"; // 引入 vite-plugin-copy
// import staticCopy from 'vite-plugin-static-copy';
// const path = require("path");
// const webpack = require("webpack");
// CesiumJS源代码的路径
// const cesiumSource = "node_modules/cesium/Source";
// const cesiumWorkers = "../Build/Cesium/Workers";
import cesium from 'vite-plugin-cesium';

// const { defineConfig } = require('@vue/cli-service')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 第一个方案
    // 复制Cesium的Assets、Widgets和Workers到一个静态目录
    //  VitePluginCopy({
    //   patterns: [
    //     { from: path.join(cesiumSource, cesiumWorkers), to: "Workers" },
    //     { from: path.join(cesiumSource, "Assets"), to: "Assets" },
    //     { from: path.join(cesiumSource, "Widgets"), to: "Widgets" },
    //     { from: path.join(cesiumSource, "ThirdParty"), to: "ThirdParty" },
    //   ],
    // }),
    // new webpack.DefinePlugin({
    //   //在Cesium中定义一个相对基本路径来加载资源
    //   CESIUM_BASE_URL: JSON.stringify(""),
    // }),
    // 第二个弃用的方案
    // 使用 vite-plugin-copy 插件替代 copy-webpack-plugin
    // staticCopy({
    //   patterns: [
    //     { src: `${cesiumSource}/${cesiumWorkers}`, dest: "Workers" },
    //     { src: `${cesiumSource}/Assets`, dest: "Assets" },
    //     { src: `${cesiumSource}/Widgets`, dest: "Widgets" },
    //     { src: `${cesiumSource}/ThirdParty`, dest: "ThirdParty" },
    //   ],
    // }),
    // 第三个方案
    // 使用 vite-plugin-cesium 插件
    cesium(),
  ],
  define: {
    CESIUM_BASE_URL: JSON.stringify(""),  // 在这里定义全局变量
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 10088,
    host: true,
    proxy: {
      "/api": {
        target: "http://192.168.200.205:3000", // "http://192.168.110.204:8083",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    target: "ES2022",
  },
});
