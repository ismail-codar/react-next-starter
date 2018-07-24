const path = require("path");
const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { GenerateSW, InjectManifest } = require("workbox-webpack-plugin");
const restServer = require("./scripts/rest-server");
const devMode = process.env.NODE_ENV !== "production";

const plugins = [
  new webpack.NamedModulesPlugin(),
  new HtmlWebpackPlugin({
    title: "Progressive Web Application"
  }),
  new MiniCssExtractPlugin({
    filename: devMode ? "[name].css" : "[name].[hash].css",
    chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
  })
];

if (devMode) {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin({ clearConsole: true }),
    new ForkTsCheckerWebpackPlugin()
  );
} else {
  plugins.push(
    new CleanWebpackPlugin("dist", { root: "/" }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "report.html",
      openAnalyzer: true,
      logLevel: "info"
    }),
    new CopyPlugin([{ from: "src/app/app.html", to: "" }]),
    new CleanWebpackPlugin(["dist"]),
    new GenerateSW({
      swDest: "sw.js",
      clientsClaim: true,
      skipWaiting: true
    }),
    new InjectManifest({ swSrc: "sw.js" })
  );
}

module.exports = {
  context: __dirname,
  entry: {
    app: path.resolve(__dirname, "src/index")
  },
  output: {
    filename: "[name].[hash].bundle.js",
    path: path.resolve(__dirname, "dist")
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
      ".scss",
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
  optimization: devMode
    ? undefined
    : {
        chunks: "all"
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
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },

  plugins: plugins,
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
    },
    setup(app) {
      restServer(app);
    }
  }
};
