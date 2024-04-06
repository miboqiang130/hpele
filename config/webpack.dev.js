const { DefinePlugin } = require("webpack");
const defaultConfig = require("./webpack.config.js");

defaultConfig.plugins.push(
  new DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify("development"),
  })
);
module.exports = Object.assign(defaultConfig, {
  mode: "development",
  devServer: {
    port: 9000,
  },
});
