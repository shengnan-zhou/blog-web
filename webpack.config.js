const path = require('path');
const chalk = require("chalk");
const HTMLWebPackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const {VueLoaderPlugin} = require('vue-loader'); // vue加载器

module.exports = {
    entry: path.resolve(__dirname, 'src/main.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].[hash].bundle.js",
        clean: true // 每次构建前清除
    },
    // module: {
    //     rules: [
    //         {
    //             test: /\.vue$/,
    //             use: ["vue-loader"], //从右向左解析
    //             include: [path.resolve(__dirname, 'src')]
    //         },
    //         {
    //             test: /\.(css|sass|scss)$/,
    //             use: [
    //                 "style-loader", 
    //                 "css-loader", 
    //                 {            
    //                     loader: "postcss-loader",            
    //                     options: {              
    //                       postcssOptions: {                
    //                         plugins: ["autoprefixer"],              
    //                       },            
    //                     },          
    //                 },
    //                 'sass-loader'], //从右向左解析
    //         },
    //         {
    //             test: /\.(png|svg|jpg|jpeg|gif)$/i,
    //             type: "asset",
    //             generator: {
    //               filename: "static/img/[name].[hash:7][ext]",
    //             },
    //         },
    //         {
    //             test: /(\.jsx|\.js)$/,
    //             use: ["babel-loader"],
    //             exclude: /node_modules/,
    //         },
    //     ]
    // },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.vue'],
        alias: {
            "@": path.resolve(__dirname, 'src')
        }
    },
    plugins: [
        new HTMLWebPackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
            filename: 'index.html'
        }),
        // 进度条
        new ProgressBarPlugin({
            format: `  :msg [:bar] ${chalk.green.bold(":percent")} (:elapsed s)`,
        }),
        new VueLoaderPlugin(),
        
    ],
    // externals: {
    //     'vue': 'Vue',
    //     'vue-router':'VueRouter'
    // }
}