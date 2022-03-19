const path = require('path');
const cwd = process.cwd();
const HappyPack = require('happypack');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathPlugin = require('case-sensitive-paths-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const cpuNum = require('os').cpus().length;

module.exports = ({ name, path: modulePath }) => {
  return {
    mode: 'production',
    target: ['web', 'es5'],
    devtool: false,
    entry: { [name]: modulePath },
    output: {
      path: path.resolve(cwd, `../dest/assets/${name}`),
      filename: '[name].prod.js'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.jsx', '.js'],
      alias: {
        'common': path.resolve(cwd, 'app/common'),
      }
    },
    externals: {
      react: 'window.vendor.react',
      'react-dom': 'window.vendor.reactDom',
      redux: 'window.vendor.redux',
      'react-redux': 'window.vendor.reactRedux',
      'redux-thunk': 'window.vendor.reduxThunk',
      'redux-actions': 'window.vendor.reduxActions',
      'react-router-dom': 'window.vendor.reactRouterDom',
      'app/common/utils': 'window.vendorUtils',
      'app/common/helpers': 'window.vendorHelpers',
      'app/common/hooks': 'window.vendorHooks',
      'common/constants': 'window.vendorConstants'
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
                    retainLines: true,
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
                retainLines: true,
                cacheDirectory: false
              }
            }
          ]
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: require.resolve('url-loader'),
          options: {
            limit: 1024, // 图片大于1M就走CDN
            name: 'image/[name].[hash].[ext]'
          }
        },
        {
          test: /\.svg$/,
          use: [
            'url-loader',
            'svg-transform-loader',
            {
              loader: 'svgo-loader',
              options: {
                plugins: []
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
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
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
      // new BundleAnalyzerPlugin({
      //   openAnalyzer: false
      // })
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false
            }
          }, // 构建时删除注释
          extractComments: false
        })
      ]
    }
  }
}