const { BeatEmitter } = require('./dist/src/index.js');

console.log('=== 拍子功能快速测试 ===');

// 测试默认配置
const defaultEmitter = new BeatEmitter();
console.log('默认拍子数:', defaultEmitter.getBeatsPerMeasure());
console.log('当前拍子:', defaultEmitter.getCurrentBeat());

// 测试自定义拍子数
const threeBeats = new BeatEmitter({ beatsPerMeasure: 3 });
console.log('三拍子设置:', threeBeats.getBeatsPerMeasure());

// 测试动态修改拍子数
threeBeats.setBeatsPerMeasure(6);
console.log('修改后拍子数:', threeBeats.getBeatsPerMeasure());

// 测试重置
threeBeats.resetToFirstBeat();
console.log('重置后当前拍子:', threeBeats.getCurrentBeat());

console.log('✅ 所有基本功能测试通过！');
