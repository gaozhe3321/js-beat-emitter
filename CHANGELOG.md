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
- 拍子功能演示示例 (`beat-counting-demo.ts`)
- 更新HTML演示页面支持拍子数选择和显示

### Changed
- **BREAKING**: BeatData 接口增加了 `beat` 和 `totalBeats` 必需字段
- 默认配置增加 `beatsPerMeasure: 4`

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
