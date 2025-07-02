import { BeatEmitter } from '../beat-emitter';

describe('BeatEmitter', () => {
  let beatEmitter: BeatEmitter;

  beforeEach(() => {
    jest.clearAllMocks();
    beatEmitter = new BeatEmitter();
  });

  afterEach(() => {
    if (beatEmitter.isActive()) {
      beatEmitter.stop();
    }
  });

  test('should initialize with default options', () => {
    const options = beatEmitter.getOptions();
    expect(options.minBpm).toBe(60);
    expect(options.maxBpm).toBe(180);
    expect(options.threshold).toBe(0.1);
    expect(options.autoGainControl).toBe(true);
  });

  test('should update options', () => {
    beatEmitter.updateOptions({ threshold: 0.2, minBpm: 80 });
    const options = beatEmitter.getOptions();
    expect(options.threshold).toBe(0.2);
    expect(options.minBpm).toBe(80);
    expect(options.maxBpm).toBe(180); // 保持默认值
  });

  test('should start and stop properly', async () => {
    const startedCallback = jest.fn();
    const stoppedCallback = jest.fn();
    
    beatEmitter.on('started', startedCallback);
    beatEmitter.on('stopped', stoppedCallback);
    
    expect(beatEmitter.isActive()).toBe(false);
    
    await beatEmitter.start();
    expect(beatEmitter.isActive()).toBe(true);
    expect(startedCallback).toHaveBeenCalled();
    
    beatEmitter.stop();
    expect(beatEmitter.isActive()).toBe(false);
    expect(stoppedCallback).toHaveBeenCalled();
  });

  test('should handle start errors', async () => {
    // Mock getUserMedia to reject
    const mockGetUserMedia = jest.fn(() => Promise.reject(new Error('Microphone access denied')));
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: mockGetUserMedia },
      writable: true,
    });
    
    const errorCallback = jest.fn();
    beatEmitter.on('error', errorCallback);
    
    await expect(beatEmitter.start()).rejects.toThrow('Microphone access denied');
    expect(errorCallback).toHaveBeenCalled();
  });

  test('should not start twice', async () => {
    await beatEmitter.start();
    const firstCallCount = (navigator.mediaDevices.getUserMedia as jest.Mock).mock.calls.length;
    
    await beatEmitter.start(); // 第二次调用
    const secondCallCount = (navigator.mediaDevices.getUserMedia as jest.Mock).mock.calls.length;
    
    expect(secondCallCount).toBe(firstCallCount);
  });
});
