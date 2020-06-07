const merge = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.js");
const ZipPlugin = require("zip-webpack-plugin");
const releaseDir = "../releases/";

module.exports = merge(common, {
  mode: "production",
  plugins: [
    ...common.plugins,
    new ZipPlugin({
      path: path.join(__dirname, releaseDir),
      filename: `hv-${process.env.npm_package_version}.zip`,
    }),
  ],
});
