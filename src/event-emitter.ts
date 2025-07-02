import { EventEmitter as TseepEventEmitter } from 'tseep';

/**
 * 高性能事件发射器类
 * 基于 tseep 库实现，提供更好的性能
 */
export class EventEmitter<T extends Record<string, any> = Record<string, any>> {
  private emitter: TseepEventEmitter;

  constructor() {
    this.emitter = new TseepEventEmitter();
  }

  /**
   * 监听事件
   */
  on<K extends keyof T>(event: K, callback: (data: T[K]) => void): this {
    this.emitter.on(event as string, callback);
    return this;
  }

  /**
   * 移除事件监听器
   */
  off<K extends keyof T>(event: K, callback: (data: T[K]) => void): this {
    this.emitter.off(event as string, callback);
    return this;
  }

  /**
   * 触发事件
   */
  emit<K extends keyof T>(event: K, data: T[K]): this {
    try {
      this.emitter.emit(event as string, data);
    } catch (error) {
      console.error(`Error in event listener for ${String(event)}:`, error);
    }
    return this;
  }

  /**
   * 一次性监听事件
   */
  once<K extends keyof T>(event: K, callback: (data: T[K]) => void): this {
    this.emitter.once(event as string, callback);
    return this;
  }

  /**
   * 移除所有监听器
   */
  removeAllListeners<K extends keyof T>(event?: K): this {
    if (event) {
      this.emitter.removeAllListeners(event as string);
    } else {
      this.emitter.removeAllListeners();
    }
    return this;
  }

  /**
   * 获取事件监听器数量
   */
  listenerCount<K extends keyof T>(event: K): number {
    return this.emitter.listenerCount(event as string);
  }

  /**
   * 获取所有事件名称
   */
  eventNames(): Array<keyof T> {
    return this.emitter.eventNames() as Array<keyof T>;
  }

  /**
   * 获取指定事件的所有监听器
   */
  listeners<K extends keyof T>(event: K): Array<(data: T[K]) => void> {
    return this.emitter.listeners(event as string) as Array<(data: T[K]) => void>;
  }

  /**
   * 设置最大监听器数量
   */
  setMaxListeners(n: number): this {
    this.emitter.setMaxListeners(n);
    return this;
  }

  /**
   * 获取最大监听器数量
   */
  getMaxListeners(): number {
    return this.emitter.getMaxListeners();
  }

  /**
   * 在指定事件的监听器列表开头添加监听器
   */
  prependListener<K extends keyof T>(event: K, callback: (data: T[K]) => void): this {
    this.emitter.prependListener(event as string, callback);
    return this;
  }

  /**
   * 在指定事件的监听器列表开头添加一次性监听器
   */
  prependOnceListener<K extends keyof T>(event: K, callback: (data: T[K]) => void): this {
    this.emitter.prependOnceListener(event as string, callback);
    return this;
  }
}
