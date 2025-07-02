import { EventEmitter } from '../event-emitter';

describe('EventEmitter', () => {
  let emitter: EventEmitter<{ test: string; number: number }>;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  test('should add and trigger event listeners', () => {
    const callback = jest.fn();
    emitter.on('test', callback);
    emitter.emit('test', 'hello');
    
    expect(callback).toHaveBeenCalledWith('hello');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should remove event listeners', () => {
    const callback = jest.fn();
    emitter.on('test', callback);
    emitter.off('test', callback);
    emitter.emit('test', 'hello');
    
    expect(callback).not.toHaveBeenCalled();
  });

  test('should handle once listeners', () => {
    const callback = jest.fn();
    emitter.once('test', callback);
    emitter.emit('test', 'hello');
    emitter.emit('test', 'world');
    
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('hello');
  });

  test('should count listeners', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    
    expect(emitter.listenerCount('test')).toBe(0);
    
    emitter.on('test', callback1);
    expect(emitter.listenerCount('test')).toBe(1);
    
    emitter.on('test', callback2);
    expect(emitter.listenerCount('test')).toBe(2);
    
    emitter.off('test', callback1);
    expect(emitter.listenerCount('test')).toBe(1);
  });

  test('should remove all listeners', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    
    emitter.on('test', callback1);
    emitter.on('number', callback2);
    
    emitter.removeAllListeners('test');
    expect(emitter.listenerCount('test')).toBe(0);
    expect(emitter.listenerCount('number')).toBe(1);
    
    emitter.removeAllListeners();
    expect(emitter.listenerCount('number')).toBe(0);
  });

  test('should handle errors in listeners gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const errorCallback = jest.fn(() => { throw new Error('Test error'); });
    const normalCallback = jest.fn();
    
    emitter.on('test', errorCallback);
    emitter.on('test', normalCallback);
    
    emitter.emit('test', 'hello');
    
    expect(errorCallback).toHaveBeenCalled();
    expect(normalCallback).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});
