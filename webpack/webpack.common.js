const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const srcDir = "../src/";
const publicDir = srcDir + "public/";
const assetsDir = srcDir + "assets/";

module.exports = {
  entry: {
    background: path.join(__dirname, srcDir + "background.ts"),
    content_script: path.join(__dirname, srcDir + "content_script.ts"),
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].bundle.js",
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      chunks: "initial",
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: ".", to: ".", context: path.join(__dirname, publicDir) },
        { from: ".", to: "assets/", context: path.join(__dirname, assetsDir) },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, publicDir + "popup.html"),
      filename: "popup.html",
      chunks: ["popup"],
    }),
  ],
};
