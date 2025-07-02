import { AudioAnalysisData } from './types';

/**
 * 音频分析工具类
 */
export class AudioAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private frequencyData: Float32Array | null = null;
  private timeData: Float32Array | null = null;

  /**
   * 初始化音频分析器
   */
  async initialize(): Promise<void> {
    try {
      // 创建音频上下文
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // 创建分析器节点
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;

      // 初始化数据数组
      this.frequencyData = new Float32Array(this.analyser.frequencyBinCount);
      this.timeData = new Float32Array(this.analyser.fftSize);

      // 获取麦克风访问权限
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);

    } catch (error) {
      throw new Error(`Failed to initialize audio analyzer: ${error}`);
    }
  }

  /**
   * 获取当前音频分析数据
   */
  getAnalysisData(): AudioAnalysisData | null {
    if (!this.analyser || !this.frequencyData || !this.timeData || !this.audioContext) {
      return null;
    }

    // 获取频域和时域数据
    this.analyser.getFloatFrequencyData(this.frequencyData);
    this.analyser.getFloatTimeDomainData(this.timeData);

    return {
      frequencyData: this.frequencyData.slice(),
      timeData: this.timeData.slice(),
      sampleRate: this.audioContext.sampleRate
    };
  }

  /**
   * 计算音频能量
   */
  calculateEnergy(analysisData: AudioAnalysisData): number {
    let energy = 0;
    for (let i = 0; i < analysisData.timeData.length; i++) {
      energy += analysisData.timeData[i] * analysisData.timeData[i];
    }
    return energy / analysisData.timeData.length;
  }

  /**
   * 计算特定频率范围的能量
   */
  calculateFrequencyRangeEnergy(
    analysisData: AudioAnalysisData,
    lowFreq: number,
    highFreq: number
  ): number {
    const nyquist = analysisData.sampleRate / 2;
    const lowBin = Math.floor((lowFreq / nyquist) * analysisData.frequencyData.length);
    const highBin = Math.floor((highFreq / nyquist) * analysisData.frequencyData.length);

    let energy = 0;
    for (let i = lowBin; i <= highBin; i++) {
      const db = analysisData.frequencyData[i];
      energy += Math.pow(10, db / 10); // 转换为线性能量
    }

    return energy / (highBin - lowBin + 1);
  }

  /**
   * 检测节拍 (简单的能量阈值检测)
   */
  detectBeat(analysisData: AudioAnalysisData, threshold: number = 0.1): boolean {
    // 重点关注低频范围 (20-200 Hz) 进行节拍检测
    const bassEnergy = this.calculateFrequencyRangeEnergy(analysisData, 20, 200);
    return bassEnergy > threshold;
  }

  /**
   * 销毁音频分析器
   */
  destroy(): void {
    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
    this.frequencyData = null;
    this.timeData = null;
  }
}
