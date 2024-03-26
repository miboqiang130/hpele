const defaultConfig = require("./webpack.config.js");

module.exports = Object.assign(defaultConfig, {
  mode: "development",
  devServer: {
    port: 9000,
  },
});
