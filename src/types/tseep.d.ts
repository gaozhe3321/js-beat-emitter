// 为 tseep 库提供的类型定义
declare module 'tseep' {
  export class EventEmitter {
    constructor();
    
    // 基本事件方法
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    off(event: string | symbol, listener: (...args: any[]) => void): this;
    emit(event: string | symbol, ...args: any[]): boolean;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    
    // 监听器管理
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string | symbol): this;
    
    // 查询方法
    listeners(event: string | symbol): Function[];
    listenerCount(event: string | symbol): number;
    eventNames(): Array<string | symbol>;
    
    // 配置方法
    setMaxListeners(n: number): this;
    getMaxListeners(): number;
    
    // 前置监听器
    prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
    
    // 静态方法
    static listenerCount(emitter: EventEmitter, event: string | symbol): number;
    static defaultMaxListeners: number;
  }
}
