import "./assets/css/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router/index";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import '@/utils/rem.ts'




// 引入自定义修改的element-plus样式
// import './assets/css/el-change.scss'


const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(ElementPlus, { locale: zhCn });
app.mount("#app");

