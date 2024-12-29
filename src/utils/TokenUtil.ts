import Cookies from 'js-cookie'

/*
 * 模块名: Token工具
 * 代码描述: 缓存用户token至cookie;
 * 作者: 余洲
 * 创建时间: 2024-01-31 15:18:21
 */
export class TokenUtil {
  private static _token: string | undefined

  private static readonly key: string =
    import.meta.env.VITE_APP_PROJECT_NAME + '-auth-token-' + import.meta.env.VITE_APP_ENV

  /**
   * 获取token
   * @returns
   */
  public static getToken(): string | undefined {
    if (!this._token) {
      this._token = Cookies.get(this.key)
    }
    return this._token
  }

  /**
   * 设置token 过期时间 7天
   * @param token
   */
  public static setToken(token: string) {
    Cookies.set(this.key, token, { expires: 7 })
    this._token = token
  }

  /**
   * 清空token
   * @param token
   */
  public static cleanToken() {
    Cookies.remove(this.key)
    this._token = undefined
  }
}
