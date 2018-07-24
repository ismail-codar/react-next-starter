//https://webpack.github.io/docs/webpack-dev-server.html#combining-with-an-existing-server
var config = require("./webpack/common").appConfig;
var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var webpackConfig = require("./webpack/dev.config.js");
var compiler = webpack(webpackConfig);
const restServer = require("./webpack/util/rest-server");

//TODO HMR çalışmıyor...
var server = new WebpackDevServer(compiler, {
  open: true,
  hot: true,
  inline: true,
  historyApiFallback: {
    index: "./apps/" + config.appName + "/index.html"
  },
  stats: {
    colors: true
  },
  before(app) {
    restServer(app);
  }
});
server.listen(config.port);
