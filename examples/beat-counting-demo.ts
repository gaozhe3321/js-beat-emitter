import { BeatEmitter } from '../src';

console.log('=== JS Beat Emitter 拍子功能演示 ===\n');

// 创建一个四拍子节拍器
const fourBeatEmitter = new BeatEmitter({
  mode: 'timer-based',
  bpm: 120,
  beatsPerMeasure: 4,
  intensity: 0.8
});

console.log('🎵 四拍子节拍器演示 (4/4拍, 120 BPM)\n');

// 监听节拍事件
fourBeatEmitter.on('beat', (beatData) => {
  const { beat, totalBeats, intensity, timestamp } = beatData;
  const isFirstBeat = beat === 1;
  const beatMarker = isFirstBeat ? '🔴' : '⚪'; // 第一拍用红色标记
  const beatDisplay = `${beatMarker} 第${beat}拍/${totalBeats}拍`;
  
  console.log(`${beatDisplay} - 强度: ${intensity.toFixed(2)} - 时间: ${new Date(timestamp).toLocaleTimeString()}`);
});

// 监听节奏事件
fourBeatEmitter.on('tempo', (tempoData) => {
  console.log(`🎼 节奏: ${tempoData.bpm} BPM (置信度: ${(tempoData.confidence * 100).toFixed(1)}%)`);
});

// 启动四拍子演示
fourBeatEmitter.start().then(() => {
  console.log('✅ 四拍子节拍器已启动\n');
  
  // 运行8秒后切换到三拍子
  setTimeout(() => {
    fourBeatEmitter.stop();
    console.log('\n⏹️ 停止四拍子节拍器\n');
    
    // 创建三拍子节拍器演示
    demonstrateThreeBeat();
  }, 8000);
}).catch(console.error);

function demonstrateThreeBeat(): void {
  console.log('🎵 三拍子节拍器演示 (3/4拍, 150 BPM)\n');
  
  const threeBeatEmitter = new BeatEmitter({
    mode: 'timer-based',
    bpm: 150,
    beatsPerMeasure: 3,
    intensity: 0.9
  });

  threeBeatEmitter.on('beat', (beatData) => {
    const { beat, totalBeats, intensity } = beatData;
    const isFirstBeat = beat === 1;
    const beatMarker = isFirstBeat ? '🔵' : '⚪'; // 第一拍用蓝色标记
    const beatDisplay = `${beatMarker} 第${beat}拍/${totalBeats}拍`;
    
    console.log(`${beatDisplay} - 强度: ${intensity.toFixed(2)}`);
  });

  threeBeatEmitter.start().then(() => {
    console.log('✅ 三拍子节拍器已启动\n');
    
    // 运行6秒后演示动态修改拍子数
    setTimeout(() => {
      console.log('\n🔄 动态切换到二拍子 (2/4拍)\n');
      threeBeatEmitter.setBeatsPerMeasure(2);
      
      // 再运行4秒后结束演示
      setTimeout(() => {
        threeBeatEmitter.stop();
        console.log('\n⏹️ 演示结束');
        
        // 显示最终状态信息
        console.log(`\n📊 最终状态:`);
        console.log(`   当前拍子: ${threeBeatEmitter.getCurrentBeat()}`);
        console.log(`   每小节拍数: ${threeBeatEmitter.getBeatsPerMeasure()}`);
        console.log(`   总节拍数: ${threeBeatEmitter.getBeatCount()}`);
        console.log(`   当前BPM: ${threeBeatEmitter.getCurrentBPM()}`);
      }, 4000);
    }, 6000);
  }).catch(console.error);
}

// 错误处理
process.on('unhandledRejection', (error) => {
  console.error('❌ 未处理的错误:', error);
  process.exit(1);
});
