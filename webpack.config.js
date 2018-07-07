const path = require("path");
const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  context: __dirname,
  entry: {
    app: path.resolve(__dirname, "src/index")
  },
  output: {
    filename: "[name].js",
    path: "/dist"
  },
  mode: devMode ? "development" : "production",

  node: {
    fs: "empty",
    __dirname: false,
    __filename: false
  },

  resolve: {
    extensions: [
      ".ts",
      ".js",
      ".tsx",
      ".jsx",
      ".json",
      ".css",
      ".html",
      ".woff",
      ".woff2",
      ".ttf"
    ],
    alias: {
      react: path.resolve(path.join(__dirname, "./node_modules/react")),
      "babel-core": path.resolve(
        path.join(__dirname, "./node_modules/@babel/core")
      )
    }
  },

  devtool: devMode ? "source-map" : undefined,
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              experimentalWatchApi: true
            }
          }
        ]
      },
      {
        test: /\.(ttf2?|eot|svg|png|jpg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      },
      {
        test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin({ clearConsole: true }),
    // new CopyPlugin([{ from: "src/app/app.html", to: "" }]),
    new CleanWebpackPlugin("dist", { root: "/" }),
    // new BundleAnalyzerPlugin({
    //   // Can be `server`, `static` or `disabled`.
    //   // In `server` mode analyzer will activate HTTP server to show bundle report.
    //   // In `static` mode single HTML file with bundle report will be generated.
    //   // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
    //   analyzerMode: "static",
    //   reportFilename: "report.html",
    //   openAnalyzer: true,
    //   logLevel: "info"
    // })
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
    }),
    new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      title: "Progressive Web Application"
    }),
    new webpack.NamedModulesPlugin(),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    port: 3040,
    open: true,
    hot: true,
    inline: true,
    historyApiFallback: {
      index: "/public/"
    },
    watchOptions: {
      ignored: /node_modules/
    }
  }
};
