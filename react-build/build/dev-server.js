const express = require('express');
const compression = require('compression');
const middleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

const devServer = async ({ hot = true, port = 9000 }, compiler) => {
  const devMiddleware = middleware(compiler, {
    publicPath: '/',
    stats: false
  });
  const app = express();
  app
    .use(compression({ filter: () => true })) // 进行gzip压缩
    .use(devMiddleware)
    .use(hot ? hotMiddleware(compiler, { log: false }) : (req, res, next) => next());

  app.listen(port, () => {
    console.log('Server Running At: %s', `127.0.0.1:${port}`);
  });
  return app;
};

module.exports = devServer;
