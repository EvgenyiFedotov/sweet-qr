const path = require("path");
const NodemonPlugin = require("nodemon-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

console.log(path.resolve("./src"));

module.exports = {
  entry: "./src/server/index.ts",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack", "url-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [{ loader: "url-loader" }],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: [path.resolve("./src")],
  },
  target: "node",
  externals: [nodeExternals()],
  output: {
    filename: "index.js",
    path: path.resolve(process.cwd(), "dist/server"),
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new NodemonPlugin({
      script: "./dist/server/index.js",
      watch: path.resolve("./dist"),
      ext: "js,njk,json,ts,tsx",
    }),
  ],
};
