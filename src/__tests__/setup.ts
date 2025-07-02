// Jest测试环境设置
import 'jest-environment-jsdom';

// Mock Web Audio API
const mockAudioContext = {
  createAnalyser: jest.fn(() => ({
    fftSize: 2048,
    smoothingTimeConstant: 0.8,
    frequencyBinCount: 1024,
    getFloatFrequencyData: jest.fn(),
    getFloatTimeDomainData: jest.fn(),
  })),
  createMediaStreamSource: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
  })),
  sampleRate: 44100,
  close: jest.fn(),
};

// 这是一个配置文件，不包含测试
describe('setup', () => {
  it('should setup testing environment', () => {
    expect(true).toBe(true);
  });
});

const mockGetUserMedia = jest.fn(() => 
  Promise.resolve({
    getTracks: () => [],
    active: true,
    id: 'test-stream',
  } as unknown as MediaStream)
);

// 设置全局mock
Object.defineProperty(global, 'AudioContext', {
  writable: true,
  value: jest.fn(() => mockAudioContext),
});

Object.defineProperty(global, 'webkitAudioContext', {
  writable: true,
  value: jest.fn(() => mockAudioContext),
});

Object.defineProperty(global, 'navigator', {
  value: {
    mediaDevices: {
      getUserMedia: mockGetUserMedia,
    },
  },
  writable: true,
});

Object.defineProperty(global, 'requestAnimationFrame', {
  writable: true,
  value: jest.fn((callback) => {
    setTimeout(callback, 16);
    return 1;
  }),
});

Object.defineProperty(global, 'cancelAnimationFrame', {
  writable: true,
  value: jest.fn(),
});
