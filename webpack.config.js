const path = require('path');

module.exports = {
  mode: 'production',
  entry: './browser.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js-beat-emitter.browser.js',
    library: {
      name: 'BeatEmitter',
      type: 'umd',
      export: 'BeatEmitter'
    },
    globalObject: 'this'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    // 不将 tseep 打包进来，而是作为外部依赖
  }
};
