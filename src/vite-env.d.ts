/// <reference types="vite/client" />


/**
 * 为 element Plus 国际化 提供声明
 */
declare module "element-plus/dist/locale/zh-cn.mjs";

/**
 * 为.vue文件的导入提供声明
 */
declare module "*.vue" {
  import { App, defineComponent } from "vue";
  const component: ReturnType<typeof defineComponent> & {
    install(app: App): void;
  };
  export default component;
}

declare module 'popoload' {
  // 根据你需要的实际功能来定义类型
  // 例如，如果 popoload 模块有一个默认导出，可以定义如下:
  const popoload: any;
  export default popoload;
}