import { BeatEmitter } from '../src/index';

/**
 * 完整功能演示
 */
async function demo(): Promise<void> {
  console.log('🎵 JS Beat Emitter 完整功能演示\n');

  // 演示1: 基本定时器模式
  console.log('=== 演示1: 基本定时器模式 ===');
  const timerBeat = new BeatEmitter({
    mode: 'timer-based',
    bpm: 100,
    intensity: 0.7
  });

  let beatCount = 0;
  timerBeat.on('beat', (beatData) => {
    beatCount++;
    console.log(`🥁 节拍 ${beatCount}: ${beatData.bpm} BPM, 强度 ${beatData.intensity}`);
  });

  await timerBeat.start();
  console.log('✅ 启动100 BPM节拍器...');

  // 3秒后改变BPM
  setTimeout(() => {
    console.log('🔄 改变BPM到120...');
    timerBeat.setBPM(120);
  }, 3000);

  // 6秒后停止
  setTimeout(() => {
    timerBeat.stop();
    console.log(`⏹️ 停止，总共 ${timerBeat.getBeatCount()} 个节拍\n`);
    
    // 演示2: 不同BPM的比较
    demo2();
  }, 6000);
}

async function demo2(): Promise<void> {
  console.log('=== 演示2: 不同BPM速度比较 ===');
  
  const speeds = [80, 120, 160];
  let currentIndex = 0;

  const beatEmitter = new BeatEmitter({
    mode: 'timer-based',
    bpm: speeds[0],
    intensity: 0.8
  });

  beatEmitter.on('beat', (beatData) => {
    console.log(`⚡ ${beatData.bpm} BPM - 节拍 #${beatEmitter.getBeatCount()}`);
  });

  beatEmitter.on('tempo', (tempoData) => {
    console.log(`🎼 节奏变化: ${tempoData.bpm} BPM (置信度: ${(tempoData.confidence * 100).toFixed(0)}%)`);
  });

  await beatEmitter.start();

  const interval = setInterval(() => {
    currentIndex++;
    if (currentIndex < speeds.length) {
      const newBpm = speeds[currentIndex];
      console.log(`\n🔄 切换到 ${newBpm} BPM...`);
      beatEmitter.setBPM(newBpm);
    } else {
      clearInterval(interval);
      beatEmitter.stop();
      console.log('\n⏹️ 演示结束\n');
      
      // 演示3: 事件监听器管理
      demo3();
    }
  }, 4000);
}

function demo3(): void {
  console.log('=== 演示3: 事件监听器管理 ===');
  
  const beatEmitter = new BeatEmitter({
    mode: 'timer-based',
    bpm: 150
  });

  // 添加多个监听器
  const listener1 = (beatData: any) => console.log('🔴 监听器1:', beatData.timestamp);
  const listener2 = (beatData: any) => console.log('🔵 监听器2:', beatData.bpm);

  beatEmitter.on('beat', listener1);
  beatEmitter.on('beat', listener2);

  console.log(`监听器数量: ${beatEmitter.listenerCount('beat')}`);

  beatEmitter.start();

  setTimeout(() => {
    console.log('\n移除监听器1...');
    beatEmitter.off('beat', listener1);
    console.log(`剩余监听器数量: ${beatEmitter.listenerCount('beat')}`);
  }, 2000);

  setTimeout(() => {
    beatEmitter.stop();
    console.log('\n✅ 所有演示完成!');
    console.log('\n📋 总结:');
    console.log('- ✓ 定时器模式节拍触发');
    console.log('- ✓ 动态BPM调整');
    console.log('- ✓ 事件监听和管理');
    console.log('- ✓ 节拍计数和状态跟踪');
    console.log('\n🚀 js-beat-emitter 功能完善!');
  }, 4000);
}

// 如果直接运行
if (require.main === module) {
  demo().catch(console.error);
}

export { demo };
