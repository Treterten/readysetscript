const path = require('path');

module.exports = {
  entry: './client/app/index.ts',
  devtool: 'inline-source-map',
  watch: false,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './client/src/dist'),
  },
};
