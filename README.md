# JS Beat Emitter

一个用于音频节拍检测和节奏分析的TypeScript库，支持两种工作模式：**定时器模式**和**音频分析模式**。

## 特性

- 🎵 **定时器模式**: 根据设定的BPM自动触发节拍事件
- 🎙️ **音频分析模式**: 实时音频节拍检测
- 📊 节奏分析和BPM计算
- 🎯 事件驱动的API
- 📦 完整的TypeScript支持
- 🔧 易于集成
- 🌐 支持浏览器和Node.js环境
- ⚡ **高性能**: 基于 [tseep](https://github.com/Morglod/tseep) 的事件系统，比Node.js原生EventEmitter快67%

## 安装

```bash
npm install js-beat-emitter
```

## 快速开始

### 定时器模式（推荐）

```typescript
import { BeatEmitter } from 'js-beat-emitter';

// 创建一个120 BPM的四拍子节拍发射器
const beatEvent = new BeatEmitter({
  mode: 'timer-based',
  bpm: 120,
  beatsPerMeasure: 4, // 四拍子
  intensity: 0.8
});

// 监听节拍事件
beatEvent.on('beat', (beatData) => {
  const isFirstBeat = beatData.beat === 1;
  const beatMarker = isFirstBeat ? '🔴' : '⚪';
  console.log(`${beatMarker} 第${beatData.beat}拍/${beatData.totalBeats}拍 - BPM: ${beatData.bpm}, 强度: ${beatData.intensity}`);
});

// 监听节奏变化事件
beatEvent.on('tempo', (tempoData) => {
  console.log(`节奏: ${tempoData.bpm} BPM, 置信度: ${tempoData.confidence}`);
});

// 开始节拍器
await beatEvent.start();

// 动态修改BPM
beatEvent.setBPM(140);

// 动态修改拍子数（切换到三拍子）
beatEvent.setBeatsPerMeasure(3);

// 停止节拍器
beatEvent.stop();
```

### 不同拍子示例

```typescript
// 二拍子节拍器
const twoBeat = new BeatEmitter({
  mode: 'timer-based',
  bpm: 100,
  beatsPerMeasure: 2
});

// 三拍子节拍器（华尔兹）
const threeBeat = new BeatEmitter({
  mode: 'timer-based',
  bpm: 180,
  beatsPerMeasure: 3
});

// 六拍子节拍器
const sixBeat = new BeatEmitter({
  mode: 'timer-based',
  bpm: 120,
  beatsPerMeasure: 6
});
```

### 音频分析模式

```typescript
const beatEmitter = new BeatEmitter({
  mode: 'audio-analysis',
  threshold: 0.1,
  minBpm: 80,
  maxBpm: 180
});

// 监听检测到的节拍
beatEmitter.on('beat', (beatData) => {
  console.log('检测到节拍:', beatData);
});

// 开始音频分析（需要麦克风权限）
await beatEmitter.start();
```

## API文档

### BeatEmitter

主要的节拍发射器类，支持两种工作模式。

#### 构造函数

```typescript
new BeatEmitter(options?: BeatEmitterOptions)
```

#### 配置选项 (BeatEmitterOptions)

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `mode` | `'timer-based' \| 'audio-analysis'` | `'timer-based'` | 工作模式 |
| `bpm` | `number` | `120` | 设定的BPM（定时器模式） |
| `beatsPerMeasure` | `number` | `4` | 每小节拍子数（2=二拍子, 3=三拍子, 4=四拍子, 等） |
| `intensity` | `number` | `0.8` | 节拍强度（定时器模式） |
| `threshold` | `number` | `0.1` | 检测阈值（音频分析模式） |
| `minBpm` | `number` | `60` | 最小BPM（音频分析模式） |
| `maxBpm` | `number` | `180` | 最大BPM（音频分析模式） |
| `autoGainControl` | `boolean` | `true` | 自动增益控制 |

#### 方法

| 方法 | 返回值 | 描述 |
|------|--------|------|
| `start()` | `Promise<void>` | 开始节拍检测/触发 |
| `stop()` | `void` | 停止节拍检测/触发 |
| `setBPM(bpm: number)` | `void` | 设置BPM（定时器模式） |
| `getCurrentBPM()` | `number` | 获取当前BPM |
| `setBeatsPerMeasure(beats: number)` | `void` | 设置每小节拍子数 |
| `getBeatsPerMeasure()` | `number` | 获取每小节拍子数 |
| `getCurrentBeat()` | `number` | 获取当前拍子 (1-based) |
| `resetToFirstBeat()` | `void` | 重置到第一拍 |
| `getBeatCount()` | `number` | 获取节拍计数 |
| `resetBeatCount()` | `void` | 重置节拍计数 |
| `isActive()` | `boolean` | 检查是否正在运行 |
| `getMode()` | `BeatEmitterMode` | 获取当前模式 |
| `updateOptions(options)` | `void` | 更新配置选项 |
| `getOptions()` | `BeatEmitterOptions` | 获取当前配置 |

#### 事件

| 事件 | 数据类型 | 描述 |
|------|----------|------|
| `beat` | `BeatData` | 节拍触发时 |
| `tempo` | `TempoData` | 节奏变化时 |
| `started` | `void` | 开始时 |
| `stopped` | `void` | 停止时 |
| `error` | `Error` | 错误时 |

#### 数据类型

```typescript
interface BeatData {
  timestamp: number;    // 时间戳
  intensity: number;    // 强度 (0-1)
  bpm?: number;        // BPM（如果可用）
  beat: number;        // 当前是第几拍 (1-based)
  totalBeats: number;  // 总拍子数
}

interface TempoData {
  bpm: number;         // BPM
  confidence: number;  // 置信度 (0-1)
  timestamp: number;   // 时间戳
}
```

## 使用示例

### 创建节拍器应用

```typescript
import { BeatEmitter } from 'js-beat-emitter';

class Metronome {
  private beatEmitter: BeatEmitter;
  private isPlaying: boolean = false;

  constructor(bpm: number = 120) {
    this.beatEmitter = new BeatEmitter({
      mode: 'timer-based',
      bpm,
      intensity: 0.8
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.beatEmitter.on('beat', (beatData) => {
      this.playClick(beatData.intensity);
      this.updateUI(beatData);
    });

    this.beatEmitter.on('tempo', (tempoData) => {
      console.log(`节拍器设置为 ${tempoData.bpm} BPM`);
    });
  }

  async play(): Promise<void> {
    if (!this.isPlaying) {
      await this.beatEmitter.start();
      this.isPlaying = true;
    }
  }

  stop(): void {
    if (this.isPlaying) {
      this.beatEmitter.stop();
      this.isPlaying = false;
    }
  }

  setBPM(bpm: number): void {
    this.beatEmitter.setBPM(bpm);
  }

  private playClick(intensity: number): void {
    // 播放节拍声音
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    gainNode.gain.value = intensity * 0.1;

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  private updateUI(beatData: BeatData): void {
    // 更新界面
    console.log(`♪ ${beatData.bpm} BPM`);
  }
}

// 使用示例
const metronome = new Metronome(120);
await metronome.play();

// 改变速度
setTimeout(() => metronome.setBPM(140), 5000);
```

### 音乐节奏游戏

```typescript
class RhythmGame {
  private beatEmitter: BeatEmitter;
  private score: number = 0;
  private expectedBeats: number[] = [];

  constructor() {
    this.beatEmitter = new BeatEmitter({
      mode: 'timer-based',
      bpm: 120
    });

    this.beatEmitter.on('beat', (beatData) => {
      this.expectedBeats.push(beatData.timestamp);
      this.showBeatIndicator();
    });
  }

  startGame(): void {
    this.beatEmitter.start();
    this.setupPlayerInput();
  }

  private setupPlayerInput(): void {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        this.handlePlayerBeat(Date.now());
      }
    });
  }

  private handlePlayerBeat(timestamp: number): void {
    const tolerance = 100; // 100ms 容错
    const nearestBeat = this.expectedBeats.find(beat => 
      Math.abs(beat - timestamp) < tolerance
    );

    if (nearestBeat) {
      this.score += 10;
      console.log(`好的! 得分: ${this.score}`);
      this.expectedBeats = this.expectedBeats.filter(beat => beat !== nearestBeat);
    } else {
      console.log('错过了!');
    }
  }

  private showBeatIndicator(): void {
    // 显示节拍指示器
    const indicator = document.getElementById('beat-indicator');
    if (indicator) {
      indicator.classList.add('active');
      setTimeout(() => indicator.classList.remove('active'), 100);
    }
  }
}
```

## 开发

```bash
# 安装依赖
npm install

# 开发模式（监听文件变化）
npm run dev

# 构建项目
npm run build

# 运行测试
npm test

# 运行测试（监听模式）
npm run test:watch

# 生成测试覆盖率报告
npm run test:coverage

# 代码检查
npm run lint

# 自动修复代码风格
npm run lint:fix

# 清理构建文件
npm run clean
```

### 示例

查看 `examples/` 目录获取更多使用示例：

- `examples/index.html` - 浏览器中的完整演示
- `examples/basic-usage.ts` - Node.js基本使用示例

## 浏览器支持

- Chrome 66+
- Firefox 60+
- Safari 12+
- Edge 79+

## Node.js支持

- Node.js 14+

## 性能考虑

- **定时器模式**: 极低的CPU使用率，推荐用于节拍器应用
- **音频分析模式**: 需要实时音频处理，CPU使用率较高
- **事件系统**: 使用 [tseep](https://github.com/Morglod/tseep) 高性能事件发射器
  - 比Node.js原生EventEmitter快 **1.67倍**
  - 吞吐量提升 **66.7%**
  - 内存使用更加高效

### 性能基准测试

运行性能对比测试：

```bash
npm run build
node dist/examples/performance-test.js
```

典型结果（100,000事件 × 10监听器）：
- **Tseep EventEmitter**: ~11,111,111 事件/秒
- **Node.js EventEmitter**: ~6,666,667 事件/秒

## 故障排除

### 音频分析模式无法工作

1. 确保已授予麦克风权限
2. 检查浏览器是否支持Web Audio API
3. 确保使用HTTPS协议（音频权限要求）

### 定时器不准确

定时器模式使用JavaScript的`setInterval`，在高负载情况下可能有轻微偏差。对于要求极高精度的应用，建议使用Web Audio API的时钟。

## 贡献

欢迎提交 Pull Request 和 Issue！

请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解贡献指南。

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件。

## 作者

gaozhe3321@gmail.com

## 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解版本更新记录。
