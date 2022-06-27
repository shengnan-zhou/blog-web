const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.config");
const env = require("./config/prod.env");

module.exports = merge(common, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ["vue-loader"], //从右向左解析
        include: [path.resolve(__dirname, "src")],
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["autoprefixer"],
              },
            },
          },
          "sass-loader",
        ], //从右向左解析
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset",
        generator: {
          filename: "static/img/[name].[hash:7][ext]",
        },
      },
      {
        test: /(\.jsx|\.js)$/,
        use: ["babel-loader?cacheDirectory=true"],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": env,
    }),
    // new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
    }),
    new CompressionPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      name: "vendor",
      cacheGroups: {
        "echarts.vendor": {
          name: "echarts.vendor",
          priority: 40,
          test: /[\\/]node_modules[\\/](echarts|zrender)[\\/]/,
          chunks: "all",
        },
        lodash: {
          name: "lodash",
          chunks: "async",
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          priority: 40,
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,//不将注释提取到单独的文件中
      }),
      // 压缩Css代码
      new CssMinimizerPlugin()
    ],
  },
});
