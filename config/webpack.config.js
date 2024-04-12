const path = require("path");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const rootDir = path.resolve(__dirname, "..");
const htmlConfig = {
  inject: true,
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  },
};

module.exports = {
  entry: {
    options: rootDir + "/src/entry/options/options.js",
    popup: rootDir + "/src/entry/popup/popup.js",
    background: rootDir + "/src/entry/background.js",
  },
  output: {
    path: rootDir + "/dist",
    filename: function (item) {
      if (item.runtime === "background") return "background.js";
      else return "static/js/[name].js";
    },
    pathinfo: false,
    chunkFilename: "static/js/[name].[contenthash:8].chunk.js",
    assetModuleFilename: "static/media/[name].[hash][ext]",
  },
  plugins: [
    new HtmlPlugin(
      Object.assign(
        {
          filename: "options.html",
          template: rootDir + "/src/entry/options/options.html",
          chunks: ["options"],
        },
        htmlConfig
      )
    ),
    new HtmlPlugin(
      Object.assign(
        {
          filename: "popup.html",
          template: rootDir + "/src/entry/popup/popup.html",
          chunks: ["popup"],
        },
        htmlConfig
      )
    ),
    new CopyPlugin({
      patterns: [{ from: rootDir + "/public", to: "." }],
    }),
    new MonacoWebpackPlugin({
      filename: "static/js/[name].worker.js",
      languages: ["typescript", "javascript", "css", "less"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        type: "asset/resource",
      },
      { test: /\.svg$/i, type: "asset", resourceQuery: /url/ },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] },
        use: ["@svgr/webpack"],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", ["@babel/preset-react", { runtime: "automatic" }]],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@": rootDir + "/src",
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        parallel: true,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
  performance: false,
};
