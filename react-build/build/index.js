const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const ejs = require("ejs");
const devServer = require('./dev-server');
const devWebpackConfig = require('./webpack/webpack.dev');
const prodWebpackConfig = require('./webpack/webpack.prod');
/**
 * 开发模式构建产物目录
 */
const destPath = path.resolve(cwd, 'dest');
/**
 * ejs模板目录
 */
const ejsTemplate = path.resolve(cwd, 'template/index.ejs');
/**
 * 配置文件的路径
 */
const buildConfigPath = path.resolve(cwd, 'customBuild.js');
/**
 * 无需生成html的模块
 */
const noNeedHtmlModule = ['common'];

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
 * 生成dev模式下打包配置
 * @param {Object} buildConfig 
 */
function getDevWebpackConfig(buildConfig) {
  return devWebpackConfig(buildConfig);
}

/**
 * 生成prod模式下打包配置
 * @param {string[]} buildEntries 
 * @returns 
 */
function getProdWebpackConfigs(buildEntries) {
  return buildEntries.map((buildEntry) => {
    return prodWebpackConfig(buildEntry);
  });
}

/**
 * copy css文件至打包目录
 * @param {string} entry 
 */
function copyCss(entry) {
  const originCssPath = path.resolve(cwd, `app/${entry}/assets/css/${entry}.css`);
  const copyCssFolder = path.resolve(cwd, `../dest/assets/${entry}/css`);
  const copyCssPath = path.resolve(cwd, `../dest/assets/${entry}/css/${entry}.css`);
  if (fs.existsSync(originCssPath)) {
    if (!fs.existsSync(copyCssFolder)) {
      fs.mkdirSync(copyCssFolder);
    }
    fs.writeFileSync(copyCssPath, fs.readFileSync(originCssPath));
  }
}

/**
 * ejs to html
 * @param {string} entry 本次构建的模块
 */
function generateBusinessHtml(entry) {
  const htmlPath = path.resolve(cwd, `../dest/html/${entry}.html`);
  ejs.renderFile(
    ejsTemplate,
    {
      busuness: entry,
      businessJS: `../assets/${entry}/${entry}.prod.js`,
      businessCss: `../assets/${entry}/css/${entry}.css`
    },
    function(err, str) {
      if (err) {
        console.error('❌ 模板生成失败: %s', err);
      }
      if (str) {
        fs.writeFileSync(htmlPath, str);
      }
    }
  );
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

function runProdCompiler(entryName, compiler) {
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
      if (!noNeedHtmlModule.includes(entryName)) {
        copyCss(entryName);
        generateBusinessHtml(entryName);
      }
      resolve();
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
    }
  );
}

async function buildProduction(webpackConfigs) {
  if (fs.existsSync(destPath)) {
    deleteFolder(destPath);
  }
  fs.mkdirSync(destPath);
  for (const config of webpackConfigs) {
    const entryName = Object.keys(config.entry)[0];
    const compiler = webpack(config);
    await runProdCompiler(entryName, compiler);
  }
}

function build() {
  if (process.env.NODE_ENV === 'development') {
    runDevBuild();
  } else if (process.env.NODE_ENV === 'production') {
    runProdBuild();
  }
}

async function runDevBuild() {
  const buildConfig = getBuildConfig();
  if (buildConfig.modules.length === 0) {
    console.error('❌ 请指定想要编译的模块');
    return;
  }
  console.log('本次编译的模块有: %s', buildConfig.modules.join(','));
  const webpackConfig = getDevWebpackConfig(buildConfig);
  const compiler = webpack(webpackConfig);
  await devServer(buildConfig, compiler);
}

function runProdBuild() {
  const buildConfig = getBuildConfig();
  const buildEntries = generateEntry(buildConfig);
  const webpackConfigs = getProdWebpackConfigs(buildEntries);
  buildProduction(webpackConfigs);
}

build();