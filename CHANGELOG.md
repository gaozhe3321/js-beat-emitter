# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Performance comparison benchmarks
- Memory usage testing

### Changed
- **BREAKING**: Replaced custom EventEmitter with high-performance tseep-based implementation
- Improved event emission performance by 67%
- Enhanced memory efficiency for large numbers of listeners

### Fixed
- Node.js environment compatibility for timer-based mode

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
