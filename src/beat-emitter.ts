import { EventEmitter } from './event-emitter';
import { AudioAnalyzer } from './audio-analyzer';
import { BPMDetector } from './bpm-detector';
import { 
  BeatEmitterOptions, 
  BeatData, 
  TempoData, 
  BeatEmitterEvents,
  AudioAnalysisData,
  BeatEmitterMode
} from './types';

/**
 * 默认配置选项
 */
const DEFAULT_OPTIONS: Required<BeatEmitterOptions> = {
  mode: 'timer-based',
  bpm: 120,
  beatsPerMeasure: 4, // 默认四拍子
  minBpm: 60,
  maxBpm: 180,
  windowSize: 1024,
  threshold: 0.1,
  autoGainControl: true,
  intensity: 0.8
};

/**
 * 主要的节拍发射器类
 */
export class BeatEmitter extends EventEmitter<BeatEmitterEvents> {
  private audioAnalyzer: AudioAnalyzer | null = null;
  private bpmDetector: BPMDetector | null = null;
  private options: Required<BeatEmitterOptions>;
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;
  private timerId: number | null = null;
  private lastBeatTime: number = 0;
  private energyHistory: number[] = [];
  private readonly energyHistorySize: number = 10;
  private beatCount: number = 0;
  private currentBeat: number = 1; // 当前拍子 (1-based)
  
  // 精准定时器相关
  private timerStartTime: number = 0;
  private nextBeatTime: number = 0;
  private beatInterval: number = 0;

  constructor(options: BeatEmitterOptions = {}) {
    super();
    this.options = { ...DEFAULT_OPTIONS, ...options };
    
    // 根据模式初始化相应的组件
    if (this.options.mode === 'audio-analysis') {
      this.audioAnalyzer = new AudioAnalyzer();
      this.bpmDetector = new BPMDetector();
    }
  }

  /**
   * 开始节拍检测/触发
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    try {
      this.isRunning = true;
      this.beatCount = 0;
      this.currentBeat = 1; // 重置到第一拍

      if (this.options.mode === 'audio-analysis') {
        await this.startAudioAnalysisMode();
      } else {
        this.startTimerMode();
      }

      this.emit('started', undefined);
    } catch (error) {
      this.isRunning = false;
      this.emit('error', error as Error);
      throw error;
    }
  }

  /**
   * 停止节拍检测/触发
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    
    // 清理定时器
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    // 清理动画帧
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // 清理音频分析器
    if (this.audioAnalyzer) {
      this.audioAnalyzer.destroy();
    }

    // 重置状态
    if (this.bpmDetector) {
      this.bpmDetector.reset();
    }
    this.energyHistory = [];
    this.beatCount = 0;
    this.currentBeat = 1; // 重置到第一拍
    this.timerStartTime = 0;
    this.nextBeatTime = 0;
    
    this.emit('stopped', undefined);
  }

  /**
   * 启动定时器模式
   */
  private startTimerMode(): void {
    if (!this.options.bpm || this.options.bpm <= 0) {
      throw new Error('BPM must be greater than 0 for timer mode');
    }

    // 计算间隔时间 (毫秒)
    this.beatInterval = 60000 / this.options.bpm;
    
    // 使用高精度时间戳
    this.timerStartTime = this.getHighResolutionTime();
    this.nextBeatTime = this.timerStartTime;

    // 立即触发第一个节拍
    this.triggerBeat();
    this.nextBeatTime += this.beatInterval;

    // 启动精准定时循环
    this.startPrecisionTimer();

    // 发射初始节奏事件
    const tempoData: TempoData = {
      bpm: this.options.bpm,
      confidence: 1.0, // 定时器模式下置信度为100%
      timestamp: Date.now()
    };
    this.emit('tempo', tempoData);
  }

  /**
   * 获取高精度时间戳
   */
  private getHighResolutionTime(): number {
    // 浏览器环境优先使用 performance.now()
    if (typeof performance !== 'undefined' && performance.now) {
      return performance.now();
    }
    // Node.js 环境使用 process.hrtime.bigint() 转换为毫秒
    if (typeof process !== 'undefined' && process.hrtime && process.hrtime.bigint) {
      return Number(process.hrtime.bigint()) / 1000000;
    }
    // 回退到 Date.now()
    return Date.now();
  }

  /**
   * 启动精准定时器循环
   */
  private startPrecisionTimer(): void {
    const timerLoop = (): void => {
      if (!this.isRunning) {
        return;
      }

      const currentTime = this.getHighResolutionTime();
      
      // 检查是否到了下一个节拍时间
      if (currentTime >= this.nextBeatTime) {
        this.triggerBeat();
        
        // 计算下一个节拍时间，避免累积误差
        this.nextBeatTime += this.beatInterval;
        
        // 如果由于某种原因落后太多，重新同步
        if (currentTime - this.nextBeatTime > this.beatInterval) {
          this.nextBeatTime = currentTime + this.beatInterval;
        }
      }

      // 计算到下一个节拍的时间差
      const timeToNextBeat = this.nextBeatTime - currentTime;
      
      // 动态调整检查间隔：离下一个节拍越近，检查越频繁
      let checkInterval: number;
      if (timeToNextBeat <= 10) {
        checkInterval = 1; // 10ms内每1ms检查一次
      } else if (timeToNextBeat <= 50) {
        checkInterval = 5; // 50ms内每5ms检查一次
      } else {
        checkInterval = Math.min(20, timeToNextBeat / 4); // 其他情况适度检查
      }

      // 使用 setTimeout 继续循环，支持浏览器和 Node.js
      this.timerId = setTimeout(timerLoop, checkInterval) as unknown as number;
    };

    timerLoop();
  }

  /**
   * 触发节拍事件（定时器模式）
   */
  private triggerBeat(): void {
    this.beatCount++;
    const timestamp = Date.now();

    const beatData: BeatData = {
      timestamp,
      intensity: this.options.intensity,
      bpm: this.options.bpm,
      beat: this.currentBeat,
      totalBeats: this.options.beatsPerMeasure
    };

    this.emit('beat', beatData);

    // 更新当前拍子
    this.currentBeat = (this.currentBeat % this.options.beatsPerMeasure) + 1;
  }

  /**
   * 启动音频分析模式
   */
  private async startAudioAnalysisMode(): Promise<void> {
    if (!this.audioAnalyzer) {
      throw new Error('Audio analyzer not initialized for audio-analysis mode');
    }

    await this.audioAnalyzer.initialize();
    this.startAnalysisLoop();
  }

  /**
   * 开始分析循环
   */
  private startAnalysisLoop(): void {
    const analyze = (): void => {
      if (!this.isRunning || !this.audioAnalyzer) {
        return;
      }

      try {
        const analysisData = this.audioAnalyzer.getAnalysisData();
        if (analysisData) {
          this.processAudioData(analysisData);
        }
      } catch (error) {
        this.emit('error', error as Error);
      }

      this.animationFrameId = requestAnimationFrame(analyze);
    };

    analyze();
  }

  /**
   * 处理音频数据
   */
  private processAudioData(analysisData: AudioAnalysisData): void {
    if (!this.audioAnalyzer) return;

    const currentTime = Date.now();
    const energy = this.audioAnalyzer.calculateEnergy(analysisData);

    // 维护能量历史
    this.energyHistory.push(energy);
    if (this.energyHistory.length > this.energyHistorySize) {
      this.energyHistory.shift();
    }

    // 动态阈值检测
    const threshold = this.calculateDynamicThreshold();
    const isBeat = this.detectBeat(energy, threshold, currentTime);

    if (isBeat) {
      this.handleBeatDetected(currentTime, energy);
    }
  }

  /**
   * 计算动态阈值
   */
  private calculateDynamicThreshold(): number {
    if (this.energyHistory.length < 3) {
      return this.options.threshold;
    }

    const avgEnergy = this.energyHistory.reduce((sum, e) => sum + e, 0) / this.energyHistory.length;
    const maxEnergy = Math.max(...this.energyHistory);
    
    // 基于平均能量和最大能量的动态阈值
    return Math.min(this.options.threshold, avgEnergy * 1.5, maxEnergy * 0.7);
  }

  /**
   * 检测节拍
   */
  private detectBeat(energy: number, threshold: number, currentTime: number): boolean {
    // 基本能量阈值检测
    if (energy < threshold) {
      return false;
    }

    // 防止过于频繁的节拍检测 (最小间隔 300ms)
    if (currentTime - this.lastBeatTime < 300) {
      return false;
    }

    // 检查能量是否明显高于最近的平均值
    if (this.energyHistory.length >= 3) {
      const recentAvg = this.energyHistory.slice(-3).reduce((sum, e) => sum + e, 0) / 3;
      return energy > recentAvg * 1.3;
    }

    return true;
  }

  /**
   * 处理检测到的节拍
   */
  private handleBeatDetected(timestamp: number, intensity: number): void {
    if (!this.bpmDetector) return;

    this.lastBeatTime = timestamp;
    this.beatCount++;
    this.bpmDetector.recordBeat(timestamp);

    const { bpm, confidence } = this.bpmDetector.calculateBPM();

    // 发射节拍事件
    const beatData: BeatData = {
      timestamp,
      intensity: Math.min(1, intensity * 10), // 归一化强度
      beat: this.currentBeat,
      totalBeats: this.options.beatsPerMeasure,
      ...(bpm > 0 && { bpm })
    };

    this.emit('beat', beatData);

    // 更新当前拍子
    this.currentBeat = (this.currentBeat % this.options.beatsPerMeasure) + 1;

    // 如果BPM检测有足够的置信度，发射节奏事件
    if (bpm > 0 && confidence > 0.5 && this.bpmDetector.getBeatCount() >= 4) {
      const tempoData: TempoData = {
        bpm,
        confidence,
        timestamp
      };

      this.emit('tempo', tempoData);
    }
  }

  /**
   * 设置BPM（定时器模式下动态修改）
   */
  setBPM(bpm: number): void {
    if (bpm <= 0) {
      throw new Error('BPM must be greater than 0');
    }

    this.options.bpm = bpm;

    // 如果正在运行定时器模式，重新计算间隔和同步时间
    if (this.isRunning && this.options.mode === 'timer-based') {
      // 更新节拍间隔
      this.beatInterval = 60000 / bpm;
      
      // 重新同步下一个节拍时间，避免突然的时间跳跃
      const currentTime = this.getHighResolutionTime();
      this.nextBeatTime = currentTime + this.beatInterval;

      // 发射节奏更新事件
      const tempoData: TempoData = {
        bpm,
        confidence: 1.0,
        timestamp: Date.now()
      };
      this.emit('tempo', tempoData);
    }
  }

  /**
   * 获取当前BPM
   */
  getCurrentBPM(): number {
    return this.options.bpm;
  }

  /**
   * 获取节拍计数
   */
  getBeatCount(): number {
    return this.beatCount;
  }

  /**
   * 重置节拍计数
   */
  resetBeatCount(): void {
    this.beatCount = 0;
    this.currentBeat = 1; // 重置到第一拍
    if (this.bpmDetector) {
      this.bpmDetector.reset();
    }
  }

  /**
   * 获取当前状态
   */
  isActive(): boolean {
    return this.isRunning;
  }

  /**
   * 获取当前模式
   */
  getMode(): BeatEmitterMode {
    return this.options.mode;
  }

  /**
   * 更新配置选项
   */
  updateOptions(options: Partial<BeatEmitterOptions>): void {
    const oldBpm = this.options.bpm;
    this.options = { ...this.options, ...options };

    // 如果BPM变化且正在运行定时器模式，更新定时器
    if (options.bpm && options.bpm !== oldBpm && this.isRunning && this.options.mode === 'timer-based') {
      this.setBPM(options.bpm);
    }
  }

  /**
   * 获取当前配置
   */
  getOptions(): Required<BeatEmitterOptions> {
    return { ...this.options };
  }

  /**
   * 获取当前拍子 (1-based)
   */
  getCurrentBeat(): number {
    return this.currentBeat;
  }

  /**
   * 获取每小节拍子数
   */
  getBeatsPerMeasure(): number {
    return this.options.beatsPerMeasure;
  }

  /**
   * 设置每小节拍子数
   */
  setBeatsPerMeasure(beatsPerMeasure: number): void {
    if (beatsPerMeasure <= 0) {
      throw new Error('Beats per measure must be greater than 0');
    }

    this.options.beatsPerMeasure = beatsPerMeasure;
    
    // 如果当前拍子超过了新的拍子数，重置到第一拍
    if (this.currentBeat > beatsPerMeasure) {
      this.currentBeat = 1;
    }
  }

  /**
   * 重置到第一拍
   */
  resetToFirstBeat(): void {
    this.currentBeat = 1;
  }
}
