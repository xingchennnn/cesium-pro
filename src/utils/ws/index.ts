import { ElMessage } from 'element-plus';

// 封装 WebSocket 类
// 监听事件：open、close、message、error
// 发送消息：send
// 关闭连接：close

class WebSocketWrapper {
  private url: string;
  private websocket: WebSocket | null;
  private eventHandlers: { [key: string]: ((event: any) => void)[] };
  private reconnectTimeout: number | null;
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private reconnectAttempts: number;

  constructor(url: string, reconnectInterval = 3000, maxReconnectAttempts = 5) {
    this.url = url;
    this.websocket = new WebSocket(this.url);;
    this.reconnectTimeout = null;
    this.reconnectInterval = reconnectInterval;
    this.maxReconnectAttempts = maxReconnectAttempts;
    this.reconnectAttempts = 0;
    this.eventHandlers = {
      open: [],
      close: [],
      message: [],
      error: [],
    };
  }

  connect() {
    // this.websocket = new WebSocket(this.url);
    if(!this.websocket)return;
    this.websocket.onopen = (event) => {
      this.handleEvent('open', event);
      this.reconnectAttempts = 0;
    };
    this.websocket.onclose = (event) => this.handleEvent('close', event);

    this.websocket.onmessage = (event) => this.handleEvent('message', event);
    this.websocket.onerror = (event) => this.handleEvent('error', event);
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private handleEvent(eventType: string, event: any) {
    if (this.eventHandlers[eventType]) {
      this.eventHandlers[eventType].forEach((handler) => handler(event));
    }
  }

  on(eventType: 'open' | 'close' | 'message' | 'error', handler: (event: any) => void) {
    if (this.eventHandlers[eventType]) {
      return this.eventHandlers[eventType].push(handler);
    }
  }

  send(message: string) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(message);
    } else {
      try {
        console.log('%c重新连接WebSocket', 'color:green');
        this.attemptReconnect();
      } catch (e) {
        ElMessage.error('请检查网络连接');
      }
    }
  }

  close() {
    if (this.websocket) {
      this.websocket.close();
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private attemptReconnect() {
    this.reconnectAttempts++;
    if (this.reconnectAttempts >= this.maxReconnectAttempts){
      // return ElMessage.error('WebSocket连接失败，请检查网络连接');
      return console.log('WebSocket连接失败，请检查网络连接');
    }
    if (!this.reconnectTimeout) {
      this.reconnectTimeout = window.setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    }
  }
}

export default WebSocketWrapper;
