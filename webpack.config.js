const path = require('path');

module.exports = {
  entry: './src/platformer.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        exclude: /node_modules/
      },
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  output: {
    filename: 'platformer.js',
    path: path.resolve(__dirname, 'dist'),
  }
};
