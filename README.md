# JS Beat Emitter

[![npm version](https://badge.fury.io/js/js-beat-emitter.svg)](https://badge.fury.io/js/js-beat-emitter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](README.md) | [中文文档](README.cn.md)

A high-performance JavaScript/TypeScript library for beat detection and rhythm analysis. Supports both timer-based and audio-analysis modes with configurable beats per measure.

## Features

- 🎵 **Dual Mode Support**: Timer-based and audio-analysis modes
- 🎼 **Beat Counting**: Configurable beats per measure (2/4, 3/4, 4/4, 6/8, 8/8, etc.)
- 🎯 **High Performance**: Optimized with tseep-based event system
- 🌐 **Cross Platform**: Works in both Node.js and browsers
- 📊 **Real-time Analysis**: Live BPM detection and tempo tracking
- 🔧 **TypeScript Support**: Full type definitions included
- 🎨 **Audio Integration**: Complete audio examples with accent/beat distinction

## Installation

```bash
npm install js-beat-emitter
```

## Quick Start

### Timer-Based Mode (Metronome)

```typescript
import { BeatEmitter } from 'js-beat-emitter';

const beatEmitter = new BeatEmitter({
  mode: 'timer-based',
  bpm: 120,
  beatsPerMeasure: 4,
  intensity: 0.8
});

beatEmitter.on('beat', (beatData) => {
  const isAccent = beatData.beat === 1; // First beat is accent
  console.log(`Beat ${beatData.beat}/${beatData.totalBeats}`, isAccent ? '(ACCENT)' : '');
});

beatEmitter.start();
```

### Audio Analysis Mode

```typescript
const beatEmitter = new BeatEmitter({
  mode: 'audio-analysis',
  beatsPerMeasure: 4,
  threshold: 0.1,
  minBpm: 60,
  maxBpm: 180
});

beatEmitter.on('beat', (beatData) => {
  console.log(`Detected beat: ${beatData.beat}/${beatData.totalBeats}, BPM: ${beatData.bpm}`);
});

beatEmitter.on('tempo', (tempoData) => {
  console.log(`Tempo: ${tempoData.bpm} BPM (confidence: ${tempoData.confidence})`);
});

await beatEmitter.start(); // Requires microphone permission
```

## API Reference

### Constructor Options

```typescript
interface BeatEmitterOptions {
  mode: 'timer-based' | 'audio-analysis';
  beatsPerMeasure?: number;  // Default: 4
  
  // Timer-based mode options
  bpm?: number;              // Default: 120
  intensity?: number;        // Default: 0.8 (0-1)
  
  // Audio-analysis mode options
  threshold?: number;        // Default: 0.1 (0-1)
  minBpm?: number;          // Default: 60
  maxBpm?: number;          // Default: 180
}
```

### Methods

| Method | Description |
|--------|-------------|
| `start()` | Start beat detection |
| `stop()` | Stop beat detection |
| `setBPM(bpm: number)` | Set BPM (timer mode only) |
| `setBeatsPerMeasure(beats: number)` | Set beats per measure |
| `getBeatsPerMeasure()` | Get current beats per measure |
| `getCurrentBeat()` | Get current beat position (1-based) |
| `resetToFirstBeat()` | Reset to first beat |
| `updateOptions(options)` | Update configuration |
| `isActive()` | Check if currently running |
| `getMode()` | Get current mode |

### Events

| Event | Data Type | Description |
|-------|-----------|-------------|
| `beat` | `BeatData` | Triggered on each beat |
| `tempo` | `TempoData` | Triggered on tempo changes |
| `started` | `void` | Triggered when started |
| `stopped` | `void` | Triggered when stopped |
| `error` | `Error` | Triggered on errors |

### Data Types

```typescript
interface BeatData {
  timestamp: number;    // Timestamp
  intensity: number;    // Intensity (0-1)
  bpm?: number;        // BPM (if available)
  beat: number;        // Current beat position (1-based)
  totalBeats: number;  // Total beats per measure
}

interface TempoData {
  bpm: number;         // Beats per minute
  confidence: number;  // Confidence level (0-1)
  timestamp: number;   // Timestamp
}
```

## Audio Integration

The library itself doesn't include audio playback, but provides complete audio integration examples using Web Audio API:

### Audio Features

- **Accent/Beat Distinction**: Accents use higher pitch (default 800Hz), beats use lower pitch (default 400Hz)
- **Customizable Parameters**: Adjustable pitch frequency, volume, and duration
- **Audio Envelope**: Progressive volume control for natural sound
- **Browser Compatible**: Uses standard Web Audio API

### Audio Integration Example

```javascript
// Initialize audio context
let audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Play beat sound
function playBeatSound(isAccent = false) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Use higher pitch for accents, lower for beats
    oscillator.frequency.setValueAtTime(isAccent ? 800 : 400, audioContext.currentTime);
    oscillator.type = 'sine';
    
    // Set volume envelope
    const now = audioContext.currentTime;
    const duration = 0.15; // 150ms
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.5, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    oscillator.start(now);
    oscillator.stop(now + duration);
}

// Integrate with beat events
beatEmitter.on('beat', (beatData) => {
    const isAccent = beatData.beat === 1;
    playBeatSound(isAccent); // true for accent, false for beat
});
```

See `examples/index.html` and `examples/audio-test.html` for complete audio integration implementations.

## Examples

### Creating a Metronome App

```typescript
import { BeatEmitter } from 'js-beat-emitter';

class Metronome {
  private beatEmitter: BeatEmitter;
  private isPlaying: boolean = false;

  constructor(bpm: number = 120) {
    this.beatEmitter = new BeatEmitter({
      mode: 'timer-based',
      bpm,
      beatsPerMeasure: 4,
      intensity: 0.8
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.beatEmitter.on('beat', (beatData) => {
      const isAccent = beatData.beat === 1;
      this.playClick(isAccent);
      this.updateUI(beatData);
    });

    this.beatEmitter.on('error', (error) => {
      console.error('Metronome error:', error);
      this.stop();
    });
  }

  public async start(): Promise<void> {
    if (!this.isPlaying) {
      await this.beatEmitter.start();
      this.isPlaying = true;
    }
  }

  public stop(): void {
    if (this.isPlaying) {
      this.beatEmitter.stop();
      this.isPlaying = false;
    }
  }

  public setBPM(bpm: number): void {
    this.beatEmitter.setBPM(bpm);
  }

  public setTimeSignature(beats: number): void {
    this.beatEmitter.setBeatsPerMeasure(beats);
  }

  private playClick(isAccent: boolean): void {
    // Implement audio playback (see audio integration example)
  }

  private updateUI(beatData: BeatData): void {
    // Update visual indicators
  }
}
```

### Real-time Audio Analysis

```typescript
import { BeatEmitter } from 'js-beat-emitter';

class BeatDetector {
  private beatEmitter: BeatEmitter;
  private onBeatCallback?: (beatData: BeatData) => void;

  constructor() {
    this.beatEmitter = new BeatEmitter({
      mode: 'audio-analysis',
      beatsPerMeasure: 4,
      threshold: 0.15,
      minBpm: 80,
      maxBpm: 160
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.beatEmitter.on('beat', (beatData) => {
      console.log(`Beat detected: ${beatData.beat}/${beatData.totalBeats}`);
      console.log(`Intensity: ${beatData.intensity.toFixed(3)}`);
      
      if (this.onBeatCallback) {
        this.onBeatCallback(beatData);
      }
    });

    this.beatEmitter.on('tempo', (tempoData) => {
      console.log(`Tempo: ${tempoData.bpm} BPM`);
      console.log(`Confidence: ${(tempoData.confidence * 100).toFixed(1)}%`);
    });
  }

  public async startDetection(): Promise<void> {
    try {
      await this.beatEmitter.start();
      console.log('Beat detection started');
    } catch (error) {
      console.error('Failed to start beat detection:', error);
    }
  }

  public stopDetection(): void {
    this.beatEmitter.stop();
    console.log('Beat detection stopped');
  }

  public onBeat(callback: (beatData: BeatData) => void): void {
    this.onBeatCallback = callback;
  }
}
```

## Browser Usage

For browser environments, use the pre-built UMD bundle:

```html
<script src="node_modules/js-beat-emitter/dist/js-beat-emitter.browser.js"></script>
<script>
  const beatEmitter = new BeatEmitter({
    mode: 'timer-based',
    bpm: 120,
    beatsPerMeasure: 4
  });

  beatEmitter.on('beat', (beatData) => {
    console.log(`Beat ${beatData.beat}/${beatData.totalBeats}`);
  });

  beatEmitter.start();
</script>
```

## Performance

JS Beat Emitter is optimized for high performance:

- **Low Latency**: Sub-millisecond timing precision in timer mode
- **Memory Efficient**: Minimal memory footprint with smart event handling
- **CPU Optimized**: Efficient algorithms for real-time audio processing
- **Scalable**: Supports multiple concurrent instances

### Benchmarks

- Timer mode: ~0.1ms average latency
- Audio analysis: ~5ms processing time per frame
- Memory usage: <1MB baseline
- CPU usage: <2% on modern devices

## Browser Compatibility

- **Modern Browsers**: Chrome 66+, Firefox 60+, Safari 11.1+, Edge 79+
- **Audio Analysis**: Requires getUserMedia API support
- **Web Audio**: Requires Web Audio API for audio integration examples

## Node.js Compatibility

- **Node.js**: 14.0+ (ES2020 support required)
- **Audio Analysis**: Requires additional audio input setup (not included)

## Examples and Demos

Check out the `examples/` directory for:

- **Basic Usage**: Simple timer and audio analysis examples
- **Interactive Demo**: Full-featured web interface with audio
- **Audio Integration**: Complete metronome with sound
- **Performance Tests**: Benchmarking and stress tests

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Links

- **Documentation**: [中文文档](README.cn.md)
- **Repository**: [GitHub](https://github.com/gaozhe3321/js-beat-emitter)
- **NPM Package**: [js-beat-emitter](https://www.npmjs.com/package/js-beat-emitter)
- **Issues**: [Bug Reports](https://github.com/gaozhe3321/js-beat-emitter/issues)

---

Built with ❤️ for the music and rhythm community.
