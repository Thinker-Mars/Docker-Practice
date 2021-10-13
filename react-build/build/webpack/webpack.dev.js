const path = require('path');
const cwd = process.cwd();
const HappyPack = require('happypack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathPlugin = require('case-sensitive-paths-webpack-plugin');
const cpuNum = require('os').cpus().length;

module.exports = ({ name, path: modulePath }) => {
  return {
    mode: 'development',
    entry: { [name]: modulePath },
    output: {
      path: path.resolve(cwd, `dest/${name}`),
      filename: '[name].js'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.jsx', '.js']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
              {
                  loader: 'babel-loader',
                  options: {
                      cacheDirectory: true
                  }
              },
              'happypack/loader?id=ts'
          ]
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                  cacheDirectory: true
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new HappyPack({
        id: 'ts',
        threads: cpuNum,
        loaders: [
          {
            loader: 'ts-loader',
            options: { happyPackMode: true, transpileOnly: true }
          }
        ]
      }),
      new ProgressBarPlugin(),
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: ['compile success'],
        },
        clearConsole: true,
        additionalFormatters: [],
        additionalTransformers: []
      }),
      new CaseSensitivePathPlugin()
    ]
  }
}