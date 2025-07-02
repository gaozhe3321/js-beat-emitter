import { BeatEmitter } from '../src/index';

/**
 * 高性能应用示例 - 展示tseep EventEmitter的优势
 */
console.log('⚡ 高性能节拍应用示例\n');

class HighPerformanceBeatApp {
  private beatEmitters: BeatEmitter[] = [];
  private totalBeats: number = 0;
  private startTime: number = 0;

  /**
   * 创建多个并发的节拍器来测试性能
   */
  async startMultipleBeatEmitters(count: number = 5): Promise<void> {
    console.log(`🚀 启动 ${count} 个并发节拍器...`);
    this.startTime = Date.now();

    // 创建不同BPM的节拍器
    const bpms = [120, 140, 160, 180, 100];
    
    for (let i = 0; i < count; i++) {
      const beatEmitter = new BeatEmitter({
        mode: 'timer-based',
        bpm: bpms[i % bpms.length],
        intensity: 0.5 + (i * 0.1)
      });

      // 为每个节拍器添加多个监听器来测试性能
      for (let j = 0; j < 3; j++) {
        beatEmitter.on('beat', (_beatData) => {
          this.totalBeats++;
          if (this.totalBeats % 100 === 0) {
            this.updateStats();
          }
        });

        beatEmitter.on('tempo', (tempoData) => {
          // 监听器 - 高频事件处理
          void tempoData;
        });
      }

      this.beatEmitters.push(beatEmitter);
      await beatEmitter.start();
      
      console.log(`✅ 节拍器 ${i + 1} 启动 (${bpms[i % bpms.length]} BPM)`);
    }

    console.log(`\n🎵 所有节拍器已启动，开始性能监控...\n`);
  }

  /**
   * 更新性能统计
   */
  private updateStats(): void {
    const elapsed = (Date.now() - this.startTime) / 1000;
    const beatsPerSecond = Math.round(this.totalBeats / elapsed);
    
    console.log(`📊 性能统计: ${this.totalBeats} 节拍, ${beatsPerSecond} 节拍/秒, ${elapsed.toFixed(1)}s 运行时间`);
  }

  /**
   * 动态调整所有节拍器的BPM
   */
  adjustAllBPMs(newBpm: number): void {
    console.log(`🔄 将所有节拍器调整到 ${newBpm} BPM...`);
    
    this.beatEmitters.forEach((emitter, index) => {
      emitter.setBPM(newBpm + (index * 5)); // 每个节拍器略有不同
    });
  }

  /**
   * 停止所有节拍器
   */
  stopAll(): void {
    console.log(`\n⏹️ 停止所有节拍器...`);
    
    this.beatEmitters.forEach((emitter, index) => {
      emitter.stop();
      console.log(`✅ 节拍器 ${index + 1} 已停止，触发了 ${emitter.getBeatCount()} 个节拍`);
    });

    this.updateStats();
    console.log(`\n🏁 总性能: ${this.totalBeats} 个节拍事件被成功处理`);
    console.log(`💡 这展示了 tseep EventEmitter 在高并发场景下的优异性能！`);
  }

  /**
   * 压力测试 - 添加大量监听器
   */
  stressTest(): void {
    console.log(`\n🔥 开始压力测试...`);
    
    const emitter = this.beatEmitters[0];
    if (!emitter) return;

    // 添加大量监听器
    const listenerCount = 1000;
    console.log(`📈 添加 ${listenerCount} 个监听器...`);

    for (let i = 0; i < listenerCount; i++) {
      emitter.on('beat', (beatData) => {
        // 轻量级处理
        void beatData.timestamp;
      });
    }

    console.log(`✅ 成功添加 ${emitter.listenerCount('beat')} 个监听器`);
    console.log(`🎯 高性能事件系统能够轻松处理大量监听器！`);
  }
}

// 运行演示
async function runDemo(): Promise<void> {
  const app = new HighPerformanceBeatApp();

  try {
    // 启动多个节拍器
    await app.startMultipleBeatEmitters(3);

    // 运行5秒
    setTimeout(() => {
      app.adjustAllBPMs(200);
    }, 3000);

    // 压力测试
    setTimeout(() => {
      app.stressTest();
    }, 5000);

    // 7秒后停止
    setTimeout(() => {
      app.stopAll();
    }, 7000);

  } catch (error) {
    console.error('❌ 错误:', error);
  }
}

// 如果直接运行
if (require.main === module) {
  runDemo();
}

export { HighPerformanceBeatApp };
