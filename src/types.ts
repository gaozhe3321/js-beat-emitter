/**
 * 节拍数据接口
 */
export interface BeatData {
  /** 节拍时间戳 */
  timestamp: number;
  /** 节拍强度 (0-1) */
  intensity: number;
  /** 当前BPM */
  bpm?: number;
  /** 当前是第几拍 (1-based) */
  beat: number;
  /** 总拍子数 */
  totalBeats: number;
}

/**
 * 节奏数据接口
 */
export interface TempoData {
  /** BPM (每分钟节拍数) */
  bpm: number;
  /** 置信度 (0-1) */
  confidence: number;
  /** 检测时间戳 */
  timestamp: number;
}

/**
 * BeatEmitter工作模式
 */
export type BeatEmitterMode = 'audio-analysis' | 'timer-based';

/**
 * BeatEmitter配置选项
 */
export interface BeatEmitterOptions {
  /** 工作模式 */
  mode?: BeatEmitterMode;
  /** 设定的BPM（定时器模式下使用） */
  bpm?: number;
  /** 拍子数 (例如: 4表示四拍子, 3表示三拍子) */
  beatsPerMeasure?: number;
  /** 最小BPM（音频分析模式下使用） */
  minBpm?: number;
  /** 最大BPM（音频分析模式下使用） */
  maxBpm?: number;
  /** 分析窗口大小 (毫秒) */
  windowSize?: number;
  /** 节拍检测阈值 (0-1) */
  threshold?: number;
  /** 是否启用自动增益控制 */
  autoGainControl?: boolean;
  /** 节拍强度（定时器模式下的固定强度值） */
  intensity?: number;
}

/**
 * 音频分析数据接口
 */
export interface AudioAnalysisData {
  /** 频域数据 */
  frequencyData: Float32Array;
  /** 时域数据 */
  timeData: Float32Array;
  /** 采样率 */
  sampleRate: number;
}

/**
 * 事件类型定义
 */
export type BeatEmitterEvents = {
  beat: BeatData;
  tempo: TempoData;
  error: Error;
  started: void;
  stopped: void;
};
