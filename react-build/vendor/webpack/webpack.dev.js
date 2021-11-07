const path = require('path');
const cwd = process.cwd();
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = () => {
  return {
    mode: 'development',
    entry: './vendor/index.ts',
    output: {
      filename: 'vendor.js',
      path: path.resolve(cwd, 'dest/vendor'),
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.jsx', '.js']
    },
    module: {
      rules: [
        {
          test: /\.tsx?/,
          use: [
            {
              loader: 'babel-loader'
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new ProgressBarPlugin()
    ]
  }
};