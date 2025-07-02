#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎵 初始化 JS Beat Emitter 项目...\n');

// 检查必要文件
const files = [
  'package.json',
  'tsconfig.json',
  'src/index.ts',
  'src/beat-emitter.ts',
  'README.md'
];

console.log('✅ 检查项目文件:');
files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✓ ${file}`);
  } else {
    console.log(`  ✗ ${file} (缺失)`);
  }
});

// 检查dist目录
if (fs.existsSync('dist')) {
  console.log('\n✅ 构建输出目录存在');
} else {
  console.log('\n❌ 构建输出目录不存在，请运行 npm run build');
}

console.log('\n📋 下一步操作:');
console.log('  1. 运行 "npm run build" 构建项目');
console.log('  2. 运行 "npm test" 执行测试');
console.log('  3. 查看 examples/index.html 了解使用示例');
console.log('  4. 阅读 README.md 获取更多信息');

console.log('\n🚀 项目已准备就绪!');
console.log('作者: gaozhe3321@gmail.com');
console.log('许可证: MIT');
