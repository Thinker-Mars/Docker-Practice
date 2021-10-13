const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const devWebpackConfig = require('./webpack/webpack.dev');
const destPath = path.resolve(cwd, 'dest');

/**
 * 配置文件的路径
 */
const buildConfigPath = path.resolve(cwd, 'buildConfig.js');

/**
 * 获取配置文件
 */
function getBuildConfig() {
  if (!fs.existsSync(buildConfigPath)) {
    console.error('❌ 请指定配置文件');
  }
  return require(buildConfigPath);
}

/**
 * 检查模块（应用）是否存在
 * @param {string} moduleName 模块（应用）名称
 * @returns 
 */
function existModule(moduleName) {
  const modulePath = path.resolve(cwd, `app/${moduleName}`);
  return fs.existsSync(modulePath);
}

/**
 * 根据配置文件，生成编译入口配置
 * @param {object} config 自定义的配置文件
 * @returns 
 */
function generateEntry(config) {
  const entries = [];
  const { modules } = config;
  modules.forEach((module) => {
    if (existModule(module)) {
      entries.push({
        name: module,
        path: path.resolve(cwd, `app/${module}`)
      })
    }
  });
  if (entries.length === 0) {
    console.error('❌ 请指定想要编译的模块');
  }
  return entries;
}

/**
 * 根据编译入口，生成 webpack 的配置
 * @param {array} buildEntries 编译入口 
 * @returns 
 */
function getWebpackConfigs(buildEntries) {
  return buildEntries.map((buildEntry) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('本次编译的模块有: %s', buildEntry.name);
      return devWebpackConfig(buildEntry);
    }
    console.error('❌ 暂不支持该编译模式: %s', process.env.NODE_ENV);
  })
}

/**
 * 删除指定文件夹
 * @param {string} path 要删除的文件夹路径
 */
function deleteFolder(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file) {
      const curPath = `${path}/${file}`;
      if (fs.statSync(curPath).isDirectory()) {
        deleteFolder(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

function runProdCompiler(compiler) {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      if (stats.hasErrors()) {
        console.error(
          stats.toString({
            chunks: false,
            colors: true
          })
        );
        throw new Error(stats.errors);
      }
      resolve();
      // fs.writeFileSync(`${buildPath}/stats`, stats.toString(), 'utf-8');
    });
  });
}

function runDevCompiler(compiler) {
  compiler.watch(
    {
      aggregateTimeout: 200,
      poll: 1000
    },
    (err, stats) => {
      if (err) {
        console.error(err);
      }
      if (stats.hasErrors()) {
        console.error(
          stats.toString({
            chunks: false,
            colors: true
          })
        );
        throw new Error(stats.errors);
      }
      // fs.writeFileSync(`${destPath}/stats`, stats.toString(), 'utf-8');
    }
  );
}

function buildDevelopment(webpackConfigs) {
  const compiler = webpack(webpackConfigs);
  runDevCompiler(compiler);
}

async function buildProduction(webpackConfigs) {
  if (fs.existsSync(destPath)) {
    deleteFolder(destPath);
  }
  fs.mkdirSync(destPath);
  for (const config of webpackConfigs) {
    const compiler = webpack(config);
    await runProdCompiler(compiler);
  }
  console.log('done');
}

function build() {
  const buildConfig = getBuildConfig();
  const buildEntries = generateEntry(buildConfig);
  const webpackConfigs = getWebpackConfigs(buildEntries);
  if (process.env.NODE_ENV === 'development') {
    buildDevelopment(webpackConfigs);
  } else if (process.env.NODE_ENV === 'production') {
    buildProduction(webpackConfigs);
  }

}

build();