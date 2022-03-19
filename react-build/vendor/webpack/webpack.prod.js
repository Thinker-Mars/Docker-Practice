const path = require('path');
const cwd = process.cwd();
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = () => {
  return {
    mode: 'production',
    devtool: false,
    entry: './vendor/index.ts',
    target: ['web', 'es5'],
    output: {
      filename: 'vendor.prod.js',
      path: path.resolve(cwd, '../dest/assets/vendor'),
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
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    "@babel/preset-env",
                    {
                      "useBuiltIns": "usage",
                      "corejs": "3.18.2"
                    }
                  ]
                ]
              }
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use:['style-loader','css-loader']
        }
      ]
    },
    plugins: [
      new ProgressBarPlugin()
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