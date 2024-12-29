import axios from "axios";
import router from "@/router";
import { TokenUtil } from "./TokenUtil";
import { ElMessage } from "element-plus";

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";

/**
 * 模块名: http请求封装
 * 代码描述: 拦截请求 前/后 处理
 * 作者:余洲
 * 创建时间:2024-01-31
 */
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL:
    import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 50000,
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;

    config.headers["Authorization"] = "Basic c2FiZXI6c2FiZXJfc2VjcmV0";

    //请求头添加token
    if (TokenUtil.getToken() && !isToken) {
      config.headers["Bridata-Auth"] = TokenUtil.getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }

    // get请求映射params参数
    if (config.method === "get" && config.params) {
      let url = config.url + "?" + RequestUtil.tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }

    if (
      !isRepeatSubmit &&
      (config.method === "post" || config.method === "put")
    ) {
      const requestObj = {
        url: config.url!,
        data:
          typeof config.data === "object"
            ? JSON.stringify(config.data)
            : config.data,
        time: new Date().getTime(),
      };
      const sessionObj = RequestUtil.getJSON("sessionObj");
      if (
        sessionObj === undefined ||
        sessionObj === null ||
        sessionObj === ""
      ) {
        RequestUtil.setJSON("sessionObj", requestObj);
      } else {
        const s_url = sessionObj.url;                  // 请求地址
        const s_data = sessionObj.data;                // 请求数据
        const s_time = sessionObj.time;                // 请求时间
        const interval = 100;                         // 间隔时间(ms)，小于此时间视为重复提交
        if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
          const message = '数据正在处理，请勿重复提交';
          console.warn(`[${s_url}]: ` + message)
          return Promise.reject(new Error(message))
        } else {
          // Cache.sessionCache.setJSON('sessionObj', requestObj)
        }
      }
    }
    return config;
  },
  (error: any) => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    const errorCode: any = {
      "401": "认证失败，无法访问系统资源",
      "403": "当前操作没有权限",
      "404": "访问资源不存在",
      default: "系统未知错误，请反馈给管理员",
    };
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode["default"];
    // 二进制数据则直接返回
    if (
      res.request.responseType === "blob" ||
      res.request.responseType === "arraybuffer"
    ) {
      return res.data;
    }
    if (code === 401) {
      if (router.currentRoute.value.name == "login") {
        return;
      }
      TokenUtil.cleanToken();
      // return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
      return Promise.reject(new Error(msg));
    } else if (code === 500) {
      ElMessage.error("服务器繁忙!")
      return Promise.reject(new Error(msg));
    } else if (code === 600 || code === 400) {
      ElMessage.error(msg)
      return Promise.reject(res.data);
    } else if (code !== 200 && code !== 1) {
      return Promise.reject(res.data);
    } else {
      return res.data;
    }
  },
  (error: any) => {
    console.log("err" + error);
    let { message } = error;
    if (message == undefined || message == null) {
      message = "未知异常";
    } else if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
   
    return Promise.reject(error);
  }
);

export default service;

export class RequestUtil {
  /**
   * 参数处理
   * @param {*} params  参数
   */
  public static tansParams(params: { [x: string]: any }) {
    let result = "";
    for (const propName of Object.keys(params)) {
      const value = params[propName];
      const part = encodeURIComponent(propName) + "=";
      if (value !== null && value !== "" && typeof value !== "undefined") {
        if (typeof value === "object") {
          for (const key of Object.keys(value)) {
            if (
              value[key] !== null &&
              value[key] !== "" &&
              typeof value[key] !== "undefined"
            ) {
              const params = propName + "[" + key + "]";
              const subPart = encodeURIComponent(params) + "=";
              result += subPart + encodeURIComponent(value[key]) + "&";
            }
          }
        } else {
          result += part + encodeURIComponent(value) + "&";
        }
      }
    }
    return result;
  }

  public static set(key: string | null, value: string | null) {
    if (!sessionStorage) {
      return;
    }
    if (key != null && value != null) {
      sessionStorage.setItem(key, value);
    }
  }

  public static get(key: string | null) {
    if (!sessionStorage) {
      return null;
    }
    if (key == null) {
      return null;
    }
    return sessionStorage.getItem(key);
  }

  public static setJSON(
    key: string,
    jsonValue: { url: string; data: any; time: number } | null
  ) {
    if (jsonValue != null) {
      this.set(key, JSON.stringify(jsonValue));
    }
  }

  public static getJSON(key: string) {
    const value = this.get(key);
    if (value != null) {
      return JSON.parse(value);
    }
  }
}



