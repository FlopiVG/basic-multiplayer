import * as path from "path";

module.exports = {
  entry: "./client/index.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public", "js")
  },
  mode: "development",
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }]
  },
  resolve: {
    extensions: [".ts"]
  }
};
