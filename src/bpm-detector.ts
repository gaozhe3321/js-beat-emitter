/**
 * BPM检测器类
 */
export class BPMDetector {
  private beatTimes: number[] = [];
  private readonly maxBeats: number = 20; // 保存最近20个节拍用于计算BPM

  /**
   * 记录节拍时间
   */
  recordBeat(timestamp: number): void {
    this.beatTimes.push(timestamp);
    
    // 只保留最近的节拍记录
    if (this.beatTimes.length > this.maxBeats) {
      this.beatTimes.shift();
    }
  }

  /**
   * 计算当前BPM
   */
  calculateBPM(): { bpm: number; confidence: number } {
    if (this.beatTimes.length < 2) {
      return { bpm: 0, confidence: 0 };
    }

    // 计算节拍间隔
    const intervals: number[] = [];
    for (let i = 1; i < this.beatTimes.length; i++) {
      intervals.push(this.beatTimes[i] - this.beatTimes[i - 1]);
    }

    if (intervals.length === 0) {
      return { bpm: 0, confidence: 0 };
    }

    // 过滤异常值 (太短或太长的间隔)
    const filteredIntervals = intervals.filter(interval => 
      interval > 300 && interval < 2000 // 30-200 BPM 范围
    );

    if (filteredIntervals.length === 0) {
      return { bpm: 0, confidence: 0 };
    }

    // 计算平均间隔
    const avgInterval = filteredIntervals.reduce((sum, interval) => sum + interval, 0) / filteredIntervals.length;
    
    // 转换为BPM
    const bpm = Math.round(60000 / avgInterval);

    // 计算置信度 (基于间隔的一致性)
    const variance = this.calculateVariance(filteredIntervals, avgInterval);
    const confidence = Math.max(0, 1 - (variance / (avgInterval * avgInterval)));

    return { bpm, confidence };
  }

  /**
   * 计算方差
   */
  private calculateVariance(values: number[], mean: number): number {
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }

  /**
   * 重置BPM检测器
   */
  reset(): void {
    this.beatTimes = [];
  }

  /**
   * 获取节拍历史数量
   */
  getBeatCount(): number {
    return this.beatTimes.length;
  }
}
