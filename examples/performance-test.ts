import { EventEmitter } from '../src/event-emitter';
import { EventEmitter as NodeEventEmitter } from 'events';

/**
 * 性能对比测试
 * 比较我们基于tseep的EventEmitter与Node.js原生EventEmitter的性能
 */

interface TestResult {
  name: string;
  duration: number;
  eventsPerSecond: number;
}

// 测试配置
const TEST_EVENTS = 100000;
const TEST_LISTENERS = 10;

async function performanceTest(): Promise<void> {
  console.log('🚀 EventEmitter 性能对比测试\n');
  console.log(`测试配置:`);
  console.log(`- 事件数量: ${TEST_EVENTS.toLocaleString()}`);
  console.log(`- 监听器数量: ${TEST_LISTENERS}`);
  console.log(`- 每个监听器会被触发 ${TEST_EVENTS.toLocaleString()} 次\n`);

  const results: TestResult[] = [];

  // 测试1: 我们的tseep-based EventEmitter
  console.log('📊 测试 1: Tseep-based EventEmitter');
  const tseepResult = await testTseepEventEmitter();
  results.push(tseepResult);

  // 测试2: Node.js 原生 EventEmitter
  console.log('📊 测试 2: Node.js 原生 EventEmitter');
  const nodeResult = await testNodeEventEmitter();
  results.push(nodeResult);

  // 输出结果
  console.log('\n📈 性能对比结果:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.name}`);
    console.log(`   ⏱️  执行时间: ${result.duration}ms`);
    console.log(`   🔥 事件/秒: ${result.eventsPerSecond.toLocaleString()}`);
    console.log('');
  });

  // 计算性能提升
  if (results.length === 2) {
    const [tseep, node] = results;
    const speedup = (node.duration / tseep.duration);
    const throughputImprovement = ((tseep.eventsPerSecond - node.eventsPerSecond) / node.eventsPerSecond * 100);
    
    console.log('🎯 性能提升:');
    console.log(`   🚀 速度提升: ${speedup.toFixed(2)}x`);
    if (throughputImprovement > 0) {
      console.log(`   📈 吞吐量提升: +${throughputImprovement.toFixed(1)}%`);
    } else {
      console.log(`   📉 吞吐量变化: ${throughputImprovement.toFixed(1)}%`);
    }
  }
}

async function testTseepEventEmitter(): Promise<TestResult> {
  const emitter = new EventEmitter<{ test: string }>();
  
  // 添加监听器
  for (let i = 0; i < TEST_LISTENERS; i++) {
    emitter.on('test', (data: string) => {
      // 简单处理，避免影响测试结果
      void data;
    });
  }

  // 性能测试
  const startTime = Date.now();
  
  for (let i = 0; i < TEST_EVENTS; i++) {
    emitter.emit('test', `event-${i}`);
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  const eventsPerSecond = Math.round(TEST_EVENTS / (duration / 1000));

  return {
    name: 'Tseep-based EventEmitter',
    duration,
    eventsPerSecond
  };
}

async function testNodeEventEmitter(): Promise<TestResult> {
  const emitter = new NodeEventEmitter();
  
  // 添加监听器
  for (let i = 0; i < TEST_LISTENERS; i++) {
    emitter.on('test', (data: string) => {
      // 简单处理，避免影响测试结果
      void data;
    });
  }

  // 性能测试
  const startTime = Date.now();
  
  for (let i = 0; i < TEST_EVENTS; i++) {
    emitter.emit('test', `event-${i}`);
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  const eventsPerSecond = Math.round(TEST_EVENTS / (duration / 1000));

  return {
    name: 'Node.js 原生 EventEmitter',
    duration,
    eventsPerSecond
  };
}

// 内存使用测试
async function memoryTest(): Promise<void> {
  console.log('\n🧠 内存使用对比测试');
  
  const getMemoryUsage = (): number => {
    const usage = process.memoryUsage();
    return usage.heapUsed / 1024 / 1024; // MB
  };

  // 测试大量监听器的内存使用
  const LISTENERS_COUNT = 10000;
  
  // Tseep EventEmitter
  const beforeTseep = getMemoryUsage();
  const tseepEmitter = new EventEmitter<{ test: string }>();
  
  for (let i = 0; i < LISTENERS_COUNT; i++) {
    tseepEmitter.on('test', () => {});
  }
  
  const afterTseep = getMemoryUsage();
  const tseepMemory = afterTseep - beforeTseep;

  // Node.js EventEmitter
  const beforeNode = getMemoryUsage();
  const nodeEmitter = new NodeEventEmitter();
  
  for (let i = 0; i < LISTENERS_COUNT; i++) {
    nodeEmitter.on('test', () => {});
  }
  
  const afterNode = getMemoryUsage();
  const nodeMemory = afterNode - beforeNode;

  console.log(`📊 ${LISTENERS_COUNT.toLocaleString()} 个监听器的内存使用:`);
  console.log(`   🔹 Tseep EventEmitter: ${tseepMemory.toFixed(2)} MB`);
  console.log(`   🔹 Node.js EventEmitter: ${nodeMemory.toFixed(2)} MB`);
  
  const memoryDiff = ((tseepMemory - nodeMemory) / nodeMemory * 100);
  if (memoryDiff < 0) {
    console.log(`   ✅ 内存节省: ${Math.abs(memoryDiff).toFixed(1)}%`);
  } else {
    console.log(`   ⚠️  内存增加: +${memoryDiff.toFixed(1)}%`);
  }
}

// 如果直接运行
if (require.main === module) {
  performanceTest()
    .then(() => memoryTest())
    .then(() => {
      console.log('\n✅ 性能测试完成！');
      console.log('💡 tseep 是一个专注于性能的事件发射器库');
      console.log('🔗 更多信息: https://github.com/Morglod/tseep');
    })
    .catch(console.error);
}

export { performanceTest, memoryTest };
