const path = require('path');
const cwd = process.cwd();
const webpack = require('webpack');
const HappyPack = require('happypack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathPlugin = require('case-sensitive-paths-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const cpuNum = require('os').cpus().length;

module.exports = ({ modules = ['common'], hot = true, analyze = false }) => {
  return {
    mode: 'development',
    devtool: 'eval-source-map',
    target: ['web', 'es5'],
    entry: {
      ...modules.reduce((acc, buildApp) => {
        const buildAppPath = path.resolve(cwd, `app/${buildApp}`);
        return {
          ...acc,
          [buildApp]: hot ? ['webpack-hot-middleware/client?reload=true', buildAppPath] : buildAppPath
        }
      }, {})
    },
    output: {
      path: path.resolve(cwd, 'dest'),
      filename: '[name].js'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.jsx', '.js'],
      alias: {
        'common': path.resolve(cwd, 'app/common')
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
      'common/utils': 'window.vendorUtils',
      'common/helpers': 'window.vendorHelpers',
      'common/hooks': 'window.vendorHooks',
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
                cacheDirectory: true
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use:['style-loader','css-loader']
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: require.resolve('url-loader'),
          options: {
            limit: 1024, // ????????????1M??????CDN
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
            options: {
              happyPackMode: true,
              transpileOnly: true
            }
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
      new CaseSensitivePathPlugin(),
      hot && new webpack.HotModuleReplacementPlugin(),
      // ???????????????????????????
      analyze && new BundleAnalyzerPlugin({
        openAnalyzer: false
      })
    ].filter(Boolean)
  }
}