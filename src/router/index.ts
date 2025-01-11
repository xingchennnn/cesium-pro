import { createRouter, createWebHistory } from "vue-router";
import Dispatch from "../views/Dispatch.vue";
import GlobalUtils from "@/utils/GlobalUtil";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Dispatch",
      component: Dispatch,
    },

    {
      path: "/home",
      name: "Home",
      component: () => import("@/views/home/index.vue"),
    },
    {
      path: "/test",
      name: "test",
      component: () => import("@/views/test/test.vue"),
    }
  ],
});

router.beforeEach((to, from, next) => {
  //单点登录是否带参数
  if (GlobalUtils.getST() === null || GlobalUtils.getST() === undefined) {
    //判定无效
    next();
  } else {
    next();
  }
});

export default router;
