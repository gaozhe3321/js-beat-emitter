// 浏览器 UMD 版本入口文件
import { BeatEmitter } from './src/index';

// 将 BeatEmitter 暴露到全局对象
if (typeof window !== 'undefined') {
  (window as any).BeatEmitter = BeatEmitter;
}

export { BeatEmitter };
