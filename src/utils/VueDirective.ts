import type { App, DirectiveBinding } from 'vue'

/**
 * 模块名: 自定义vue全局执行
 * 代码描述: vue全局指令封装
 * 作者:余洲
 * 创建时间:2024/01/31
 */
export default class VueDirective {
  private constructor() {}

  /**
   * vue全局指令初始化
   * @param app Vue
   */
  public static initDirective(app: App) {
    /**
     * 防连点指令 缺省值3s
     * Prevent repeated clicks
     */
    app.directive('prc', {
      /* ... */
      mounted(el, binding: DirectiveBinding<number>) {
        if (binding.value == undefined) {
          binding.value = 3000
        }
        el.addEventListener('click', () => {
          el.style.pointerEvents = 'none'
          setTimeout(() => {
            el.style.pointerEvents = ''
          }, binding.value)
        })
      }
    })
  }
}
