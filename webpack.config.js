const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: "./src/main/ts/index.tsx",
  output: {
    path: path.join(__dirname, "build/assets"),
    filename: "bundle.[contenthash].js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".scss"],
    modules: ["node_modules"],
    fallback: { "process/browser": require.resolve("process/browser") },
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|png|svg|json)$/,
        type: "asset/resource",
      },
      {
        test: /\.js(\.map)?$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      path: path.join(__dirname, "build/assets"),
      filename: "index.html",
      template: "./src/main/html/index.html",
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
  devServer: {
    static: {
      directory: "./build/assets",
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
    historyApiFallback: true,
    compress: true,
    port: 8081,
    server: "https",
  },
};
