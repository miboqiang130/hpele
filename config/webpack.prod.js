const { DefinePlugin } = require("webpack");
const defaultConfig = require("./webpack.config.js");

defaultConfig.plugins.push(
  new DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify("production"),
  })
);
module.exports = Object.assign(defaultConfig, {
  mode: "production",
});
