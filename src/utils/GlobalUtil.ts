// import Cookies from "js-cookie";

/**
 * 模块名:  全面工具封装
 * 代码描述: 聚合性工具箱,主要为一些便捷操作；
 * 作者:余洲
 * 创建时间:2024/01/31
 */
export default class GlobalUtils {
  static pxToRem(px: number): number {
    const screenWidth = document.documentElement.clientWidth;
    return px / (screenWidth / 100);
  }

  static remToPx(rem: number): number {
    const screenWidth = document.documentElement.clientWidth;
    return rem * (screenWidth / 100);
  }
  /**
   *
   * @param st 单点登录
   */
  static setST(st: string): void {
    localStorage.setItem("ST", st);
  }
  /**
   * 获取单点登录st
   */
  static getST(): string {
    return localStorage.getItem("ST") || "";
  }
  /**
   * 清除单点登录st
   */
  static cleanST(): void {
    localStorage.removeItem("ST");
  }

  /**
   * 获取静态图片资源
   * @param url
   */
  static getImageUrl(url: string): string {
    url = url.replace('@/assets/image/', '')
    return new URL(`../assets/image/${url}`, import.meta.url).href
  }
}
