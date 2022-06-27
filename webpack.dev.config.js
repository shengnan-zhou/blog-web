const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.config');
const env = require("./config/dev.env");

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        host: 'local.shengnan.com',
        port: '8081',
        open: true, // 自动打开浏览器
        hot: true // 热加载
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ["vue-loader"], //从右向左解析
                include: [path.resolve(__dirname, 'src')]
            },
            {
                test: /\.(css|sass|scss)$/,
                use: [
                    "style-loader", 
                    "css-loader", 
                    {            
                        loader: "postcss-loader",            
                        options: {              
                          postcssOptions: {                
                            plugins: ["autoprefixer"],              
                          },            
                        },          
                    },
                    'sass-loader'], //从右向左解析
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
                use: ["babel-loader"],
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": env
        })
    ]
})