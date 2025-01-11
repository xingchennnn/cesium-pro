// import { type Events } from './Events';
import mitt, { type Emitter } from 'mitt';

/**
 * 事件分发器
 */
class EventBus {
  /**
   * 事件组件
   */
  private _emitter: Emitter<Record<symbol | string, any>>;

  /**
   * 私有构造函数
   */
  private constructor() {
    this._emitter = mitt<Record<symbol | string, any>>();
  }

  /**
   * 事件总线实例
   */
  private static _instance: EventBus | null = null;

  /**
   * 事件总线实例
   */
  public static get instance(): EventBus {
    return this._instance || (this._instance = new EventBus());
  }

  /**
   * 订阅事件
   * @param eventName 事件名称
   * @param handler   事件回调
   */
  public on(eventName: string, handler: (res: any) => void): void {

    this._emitter.on(eventName, (res) => {
      if(res == null)return;
      // console.log('事件总线=========>>>>>>>', `【${String(eventName)}】触发！！参数：`, res)
      handler(res);
    });
  }


  /**
   * 推送事件
   * @param eventName  事件名称
   * @param event       事件参数
   */
  public emit(eventName:string, event: any=''): void {
    this._emitter.emit(eventName, event);
  }

  /**
   * 取消 监听/取消订阅 事件
   * @param eventName 事件名称
   * @param handler   事件回调
   */
  public off(eventName: string, handler?: (res: any) => void): void {
    this._emitter.off(eventName, handler);
  }

  /**
   * 取消所有事件的监听
   */
  public clear(): void {
    this._emitter.all.clear();
    EventBus._instance = null;
  }

}

export default EventBus.instance;

