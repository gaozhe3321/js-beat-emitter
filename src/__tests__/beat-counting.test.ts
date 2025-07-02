import { BeatEmitter } from '../beat-emitter';

describe('Beat Counting Features', () => {
  let beatEmitter: BeatEmitter;

  afterEach(() => {
    if (beatEmitter) {
      beatEmitter.stop();
    }
  });

  test('should initialize with default 4 beats per measure', () => {
    beatEmitter = new BeatEmitter();
    expect(beatEmitter.getBeatsPerMeasure()).toBe(4);
    expect(beatEmitter.getCurrentBeat()).toBe(1);
  });

  test('should set custom beats per measure', () => {
    beatEmitter = new BeatEmitter({ beatsPerMeasure: 3 });
    expect(beatEmitter.getBeatsPerMeasure()).toBe(3);
  });

  test('should emit beat events with beat information', (done) => {
    beatEmitter = new BeatEmitter({
      mode: 'timer-based',
      bpm: 600, // Very fast BPM for quick testing
      beatsPerMeasure: 3
    });

    const beatEvents: any[] = [];
    let eventCount = 0;

    beatEmitter.on('beat', (beatData) => {
      beatEvents.push(beatData);
      eventCount++;

      // Check beat data structure
      expect(beatData.beat).toBeGreaterThan(0);
      expect(beatData.beat).toBeLessThanOrEqual(3);
      expect(beatData.totalBeats).toBe(3);
      expect(beatData.intensity).toBe(0.8); // default intensity
      expect(typeof beatData.timestamp).toBe('number');

      // After collecting 3 beats (1 complete measure), verify the pattern
      if (eventCount === 3) {
        expect(beatEvents[0].beat).toBe(1); // First beat
        expect(beatEvents[1].beat).toBe(2); // Second beat
        expect(beatEvents[2].beat).toBe(3); // Third beat
        done();
      }
    });

    beatEmitter.start();
  });

  test('should change beats per measure dynamically', () => {
    beatEmitter = new BeatEmitter({ beatsPerMeasure: 4 });
    
    expect(beatEmitter.getBeatsPerMeasure()).toBe(4);
    expect(beatEmitter.getCurrentBeat()).toBe(1);

    beatEmitter.setBeatsPerMeasure(3);
    expect(beatEmitter.getBeatsPerMeasure()).toBe(3);
    expect(beatEmitter.getCurrentBeat()).toBe(1); // Should still be 1
  });

  test('should reset to first beat when beats per measure changes and current beat exceeds new limit', () => {
    beatEmitter = new BeatEmitter({ beatsPerMeasure: 4 });
    
    // Manually set current beat to 3 (this would normally happen through beat events)
    beatEmitter['currentBeat'] = 3;
    expect(beatEmitter.getCurrentBeat()).toBe(3);

    // Change to 2 beats per measure
    beatEmitter.setBeatsPerMeasure(2);
    expect(beatEmitter.getCurrentBeat()).toBe(1); // Should reset to 1
  });

  test('should reset to first beat', () => {
    beatEmitter = new BeatEmitter();
    
    // Manually set current beat to 3
    beatEmitter['currentBeat'] = 3;
    expect(beatEmitter.getCurrentBeat()).toBe(3);

    beatEmitter.resetToFirstBeat();
    expect(beatEmitter.getCurrentBeat()).toBe(1);
  });

  test('should reset beat count and current beat', () => {
    beatEmitter = new BeatEmitter();
    
    // Simulate some beats
    beatEmitter['beatCount'] = 10;
    beatEmitter['currentBeat'] = 3;

    beatEmitter.resetBeatCount();
    expect(beatEmitter.getBeatCount()).toBe(0);
    expect(beatEmitter.getCurrentBeat()).toBe(1);
  });

  test('should throw error for invalid beats per measure', () => {
    beatEmitter = new BeatEmitter();
    
    expect(() => {
      beatEmitter.setBeatsPerMeasure(0);
    }).toThrow('Beats per measure must be greater than 0');

    expect(() => {
      beatEmitter.setBeatsPerMeasure(-1);
    }).toThrow('Beats per measure must be greater than 0');
  });

  test('should work with different beat patterns', (done) => {
    const testPatterns = [
      { beatsPerMeasure: 2, expectedPattern: [1, 2, 1, 2] },
      { beatsPerMeasure: 6, expectedPattern: [1, 2, 3, 4, 5, 6, 1, 2] }
    ];

    let currentTestIndex = 0;

    function testPattern(pattern: { beatsPerMeasure: number; expectedPattern: number[] }) {
      beatEmitter = new BeatEmitter({
        mode: 'timer-based',
        bpm: 300, // Very fast for quick testing
        beatsPerMeasure: pattern.beatsPerMeasure
      });

      const receivedBeats: number[] = [];

      beatEmitter.on('beat', (beatData) => {
        receivedBeats.push(beatData.beat);

        if (receivedBeats.length === pattern.expectedPattern.length) {
          expect(receivedBeats).toEqual(pattern.expectedPattern);
          beatEmitter.stop();

          currentTestIndex++;
          if (currentTestIndex < testPatterns.length) {
            setTimeout(() => testPattern(testPatterns[currentTestIndex]), 100);
          } else {
            done();
          }
        }
      });

      beatEmitter.start();
    }

    testPattern(testPatterns[0]);
  });
});
