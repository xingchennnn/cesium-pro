import { ViteEnvEnum } from "@/enums/ViteEnvEnums";

/**
 * 模块名: 环境工具类
 * 代码描述: 获取当前运行环境相关信息
 * 作者:YZ
 * 创建时间:2024-01-31
 */
export default class EnvUtils {
  /**
   * 测试环境
   */
  public static readonly TEST: boolean =
    import.meta.env.VITE_APP_ENV === ViteEnvEnum.TEST;

  /**
   * 正式环境
   */
  public static readonly PROD: boolean =
    import.meta.env.VITE_APP_ENV === ViteEnvEnum.PROD;

  /**
   * 开发环境
   */
  public static readonly DEV: boolean =
    import.meta.env.VITE_APP_ENV === ViteEnvEnum.DEV;

  /**
   * 获取当前设备信息
   */
  public static get deviceEnv(): DeviceEnv {
    return DeviceEnv.devicetype;
  }

  /**
   * 获取设备渠道
   */
  public static get channelType(): string {
    if (DeviceEnv.devicetype.wxmini) {
      return "WX_MINI_APP";
    }

    if (DeviceEnv.devicetype.weixin) {
      return "WX_WEB";
    }

    return "WEB";
  }
}

/**
 * 模块名: 设备环境
 * 代码描述: 获取当前设备环境信息
 * 作者:YZ
 * 创建时间:2022/11/30 22:21:16
 */
class DeviceEnv {
  private static instance: DeviceEnv | null = null;
  // 获取单例
  static getInstance(): DeviceEnv {
    // 判断系统是否已经有这个单例
    if (DeviceEnv.instance === null) {
      DeviceEnv.instance = new DeviceEnv();
    }
    // 单例模式
    return DeviceEnv.instance;
  }

  private constructor() {
    const u = navigator.userAgent;
    this._env = u;
    this._trident = u.indexOf("Trident") > -1;
    this._presto = u.indexOf("Presto") > -1;
    this._webKit = u.indexOf("AppleWebKit") > -1;
    this._gecko = u.indexOf("Gecko") > -1 && u.indexOf("KHTML") > -1;
    this._mobile = !!u.match(/AppleWebKit.*Mobile.*/);
    this._ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    this._android = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1;
    this._iPhone = u.indexOf("iPhone") > -1;
    this._iPad = u.indexOf("iPad") > -1;
    this._webApp = u.indexOf("Safari") > -1;
    this._weixin =
      u.indexOf("MicroMessenger") > -1 &&
        u
          .replace(/.*(MicroMessenger\/[^\s]*).*/, "$1")
          .replace("MicroMessenger/", "")
        ? true
        : false;
    this._appVersion =
      u.indexOf("bocapp(") > -1
        ? u.match(/bocapp\(\S+\)/)![0].slice(7, -1)
        : "3.0.0";
    this._wxmini = u.toLocaleUpperCase().indexOf("MINI") > -1;

    //开发环境下才能使用
    if (EnvUtils.DEV) {
      //模拟微信环境
      if (import.meta.env.VITE_APP_MOCK_WX == 'true') {
        this._weixin = true;
      }

      //模拟微信小程序环境
      if (import.meta.env.VITE_APP_MOCK_WX_MINI == 'true') {
        this._weixin = true;
        this._wxmini = true;
      }
    }

  }

  private readonly _env: string;
  public get env(): string {
    return this._env;
  }


  private readonly _trident: boolean;
  public get trident(): boolean {
    return this._trident;
  }

  private readonly _presto: boolean;
  public get presto(): boolean {
    return this._presto;
  }

  private readonly _webKit: boolean;
  public get webKit(): boolean {
    return this._webKit;
  }

  private readonly _gecko: boolean;
  public get gecko(): boolean {
    return this._gecko;
  }

  private readonly _mobile: boolean;
  public get mobile(): boolean {
    return this._mobile;
  }

  private readonly _ios: boolean;
  public get ios(): boolean {
    return this._ios;
  }

  private readonly _android: boolean;
  public get android(): boolean {
    return this._android;
  }

  private readonly _iPhone: boolean;
  public get iPhone(): boolean {
    return this._iPhone;
  }

  private readonly _iPad: boolean;
  public get iPad(): boolean {
    return this._iPad;
  }

  private readonly _webApp: boolean;
  public get webApp(): boolean {
    return this._webApp;
  }

  private readonly _weixin: boolean;
  public get weixin(): boolean {
    return this._weixin;
  }

  private readonly _appVersion: string;
  public get appVersion(): string {
    return this._appVersion;
  }

  private readonly _wxmini: boolean;
  public get wxmini() {
    return this._wxmini;
  }

  /**
   * 设备信息
   */
  public static get devicetype(): DeviceEnv {
    return DeviceEnv.getInstance();
  }
}
