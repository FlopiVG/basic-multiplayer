import * as path from "path";
import * as webpack from "webpack";

module.exports = {
  entry: [
    "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true",
    "./client/index.ts"
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public", "js"),
    hotUpdateChunkFilename: ".hot/[id].[hash].hot-update.js",
    hotUpdateMainFilename: ".hot/[hash].hot-update.json"
  },
  mode: "development",
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};
