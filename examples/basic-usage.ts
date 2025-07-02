import { BeatEmitter } from '../src/index';

/**
 * 基本使用示例 - 定时器模式
 */
console.log('🎵 JS Beat Emitter - 基本使用示例\n');

// 创建一个120 BPM的节拍发射器
const beatEvent = new BeatEmitter({
  mode: 'timer-based',
  bpm: 120,
  intensity: 0.8
});

// 监听节拍事件
beatEvent.on('beat', (beatData) => {
  console.log(`♪ 节拍 #${beatEvent.getBeatCount()} - BPM: ${beatData.bpm}, 强度: ${beatData.intensity.toFixed(2)}, 时间: ${new Date(beatData.timestamp).toLocaleTimeString()}`);
});

// 监听节奏事件
beatEvent.on('tempo', (tempoData) => {
  console.log(`🎼 节奏更新 - BPM: ${tempoData.bpm}, 置信度: ${(tempoData.confidence * 100).toFixed(1)}%`);
});

// 监听开始/停止事件
beatEvent.on('started', () => {
  console.log('✅ 节拍器已启动');
});

beatEvent.on('stopped', () => {
  console.log('⏹️ 节拍器已停止');
});

// 监听错误事件
beatEvent.on('error', (error: Error) => {
  console.error('❌ 错误:', error.message);
});

// 启动节拍器
async function start(): Promise<void> {
  try {
    console.log('正在启动节拍器...');
    await beatEvent.start();
    
    // 运行5秒后改变BPM
    setTimeout(() => {
      console.log('\n--- 5秒后改变BPM到150 ---');
      beatEvent.setBPM(150);
    }, 5000);

    // 再运行5秒后停止
    setTimeout(() => {
      console.log('\n--- 停止节拍器 ---');
      beatEvent.stop();
      console.log(`总共触发了 ${beatEvent.getBeatCount()} 个节拍`);
    }, 10000);

  } catch (error) {
    console.error('启动失败:', error);
  }
}

// 处理程序退出
process.on('SIGINT', () => {
  console.log('\n正在关闭...');
  beatEvent.stop();
  process.exit(0);
});

// 如果是直接运行这个文件
if (require.main === module) {
  start();
}

export { beatEvent };

// 启动示例
start();
