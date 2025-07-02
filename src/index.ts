// 主入口文件
export { BeatEmitter } from './beat-emitter';
export { EventEmitter } from './event-emitter';
export { AudioAnalyzer } from './audio-analyzer';
export { BPMDetector } from './bpm-detector';

// 导出类型定义
export type {
  BeatData,
  TempoData,
  BeatEmitterOptions,
  AudioAnalysisData,
  BeatEmitterEvents
} from './types';

// 版本信息
export const VERSION = '1.0.0';

// 默认导出
import { BeatEmitter } from './beat-emitter';
export default BeatEmitter;
