import { BeatEmitter } from '../beat-emitter';

describe('BeatEmitter - Timer Mode', () => {
  let beatEmitter: BeatEmitter;

  beforeEach(() => {
    jest.clearAllMocks();
    beatEmitter = new BeatEmitter({
      mode: 'timer-based',
      bpm: 120,
      intensity: 0.8
    });
  });

  afterEach(() => {
    if (beatEmitter.isActive()) {
      beatEmitter.stop();
    }
  });

  test('should initialize with timer mode options', () => {
    const options = beatEmitter.getOptions();
    expect(options.mode).toBe('timer-based');
    expect(options.bpm).toBe(120);
    expect(options.intensity).toBe(0.8);
  });

  test('should start and emit beat events in timer mode', (done) => {
    let beatCount = 0;
    
    beatEmitter.on('beat', (beatData) => {
      beatCount++;
      expect(beatData.bpm).toBe(120);
      expect(beatData.intensity).toBe(0.8);
      expect(typeof beatData.timestamp).toBe('number');
      
      if (beatCount >= 2) {
        beatEmitter.stop();
        done();
      }
    });

    beatEmitter.on('tempo', (tempoData) => {
      expect(tempoData.bpm).toBe(120);
      expect(tempoData.confidence).toBe(1.0);
    });

    beatEmitter.start();
  });

  test('should change BPM dynamically', (done) => {
    let beatCount = 0;
    
    beatEmitter.on('beat', (beatData) => {
      beatCount++;
      
      if (beatCount === 1) {
        expect(beatData.bpm).toBe(120);
        // 改变BPM
        beatEmitter.setBPM(150);
      } else if (beatCount === 2) {
        expect(beatData.bpm).toBe(150);
        beatEmitter.stop();
        done();
      }
    });

    beatEmitter.start();
  });

  test('should track beat count correctly', (done) => {
    let expectedCount = 0;
    
    beatEmitter.on('beat', () => {
      expectedCount++;
      expect(beatEmitter.getBeatCount()).toBe(expectedCount);
      
      if (expectedCount >= 3) {
        beatEmitter.stop();
        done();
      }
    });

    beatEmitter.start();
  });

  test('should reset beat count', async () => {
    beatEmitter.on('beat', () => {
      if (beatEmitter.getBeatCount() >= 2) {
        beatEmitter.resetBeatCount();
        expect(beatEmitter.getBeatCount()).toBe(0);
        beatEmitter.stop();
      }
    });

    await beatEmitter.start();
    
    // 等待一些节拍
    await new Promise(resolve => setTimeout(resolve, 1500));
  });

  test('should get current mode', () => {
    expect(beatEmitter.getMode()).toBe('timer-based');
  });

  test('should throw error for invalid BPM', () => {
    expect(() => {
      beatEmitter.setBPM(0);
    }).toThrow('BPM must be greater than 0');

    expect(() => {
      beatEmitter.setBPM(-10);
    }).toThrow('BPM must be greater than 0');
  });
});
