# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-07-02

### Added
- **拍子数功能**: 支持设置每小节拍子数 (beatsPerMeasure)
  - 支持二拍子、三拍子、四拍子、六拍子、八拍子等各种拍子
  - 在 BeatData 中添加 `beat` 和 `totalBeats` 字段标记当前拍子
  - 新增 `setBeatsPerMeasure()`, `getBeatsPerMeasure()`, `getCurrentBeat()`, `resetToFirstBeat()` 方法
  - 第一拍会有特殊标记，便于可视化区分
- **音频功能集成示例**: examples 中添加完整的节拍声音功能
  - 重拍/轻拍音色区分（重拍高音调，轻拍低音调）
  - 可调节音调频率、音量、音长等参数
  - 使用 Web Audio API 实现高质量音频效果
  - 音频包络控制，声音自然柔和
- 拍子功能演示示例 (`beat-counting-demo.ts`)
- 音频测试页面 (`examples/audio-test.html`) 用于单独测试音频功能
- 更新主演示页面 (`examples/index.html`) 集成完整音频控件

### Changed
- **BREAKING**: BeatData 接口增加了 `beat` 和 `totalBeats` 必需字段
- 默认配置增加 `beatsPerMeasure: 4`
- 优化演示页面UI，增加音频状态指示器
- 增强日志显示，更好地区分重拍和轻拍事件

## [2.0.0] - 2025-07-02

### Added
- Performance comparison benchmarks
- Memory usage testing

### Changed
- **BREAKING**: Replaced custom EventEmitter with high-performance tseep-based implementation
- Improved event emission performance by 67%
- Enhanced memory efficiency for large numbers of listeners

### Fixed
- Node.js environment compatibility for timer-based mode

## [Unreleased]

## [1.1.0] - 2025-07-02

### Added
- Timer-based mode for BPM-driven beat emission
- Dynamic BPM adjustment with `setBPM()` method
- Beat counting and state management
- Dual-mode support (timer-based and audio-analysis)
- Cross-platform compatibility (Browser + Node.js)
- Extended API with additional EventEmitter methods

### Changed
- Default mode is now 'timer-based' for better usability
- Updated documentation with comprehensive examples
- Enhanced TypeScript type definitions

## [1.0.0] - 2025-07-02

### Added
- First release of js-beat-emitter
- Real-time beat detection
- Rhythm analysis
- TypeScript definitions
- Comprehensive documentation
- Example applications
