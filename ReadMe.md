## 说明
Webpack5搭建项目基础配置
# 起步
## 1. 基本安装
(1)  创建blog-web文件夹，用vscode打开，通过终端运行：
```
npm init -y
npm install -g yarn //如果安装过yarn就不用运行了
yarn add webpack webpack-cli -D
```

(2) 在blog-web目录下新建 src, 新建src/main.js文件, 添加如下语句
```
console.log('success');
```
## 2. 配置出入口
新建webpack.config.js文件
(1) 配置入口
可配置多个入口, 但开发中一般是react或者vue,一般配置一个入口即可
```
// webpack.config.js
const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src/main.js')
}
```
(2) 配置出口
只能有一个出口, 这里指定输出路径为dist
```
const path = require('path');
//webpack.config.js
module.exports = {
  output: {
    path:path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean:true //每次构建清除dist包
  },
}

```
现在，我们具有了最低配置。在package.json中，我们创建一个运行webpack命令构建脚本
```
"scripts": {
  "build":"webpack --config webpack.config.js",
}
```
现在在终端可以运行了
```
npm run build
```
在dist文件夹下会生成main.bundle.js
目录结构：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2976651/1656050776620-e0653e92-9db7-4722-a1d6-4262b082cf1b.png#clientId=u52bc5c64-9899-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=303&id=u5b8e75a7&margin=%5Bobject%20Object%5D&name=image.png&originHeight=606&originWidth=584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=140505&status=done&style=none&taskId=u7b56e044-5021-4bfe-ba0d-c9ab633fea5&title=&width=292)

# plugin
插件（Plugins）是用来拓展Webpack功能的，包括：打包优化、资源管理、注入环境变量
插件使用：只需要require()它，然后把它添加到plugins数组中

## 1. html-webpack-plugin
html-webpack-plugin将为你生成一个HTML5文件，在body中使用script标签引入你所有webpack生成的bundle
(1) 安装
```
yarn add -D html-webpack-plugin
```

(2）新建 public/index.html
(3)  配置
```
//webpack.common.js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        filename: 'index.html', 
    }),
  ]
}
```
（4）运行
## 2. progress-bar-webpack-plugin
作用：增加编译进度条
(1) 安装：
```
yarn add progress-bar-webpack-plugin
```
(2) 配置：
```
// webpack.config.js
const chalk = require("chalk");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

module.exports = {
  plugins: [
    // 进度条
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(":percent")} (:elapsed s)`,
    }),
  ]
}
```
# loader
## 1. css-loader与style-loader
作用：加载css
css-loader：会对@import和url()进行处理
style-loader：将CSS注入到JavaScript中，通过DOM操作控制css
(1) 安装
```
yarn add css-loader style-loader -D
```
(2) 在webpack.config.js中进行配置
```
module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], //从右向左解析
      },
    ],
 }
```

(3) 示例
新建src/assets/styles/style.css
```
body{
    background-color: aqua;
}
```
在main.js中引入
```
import './assets/styles/style.css'
```
重新编译 npm run build，在浏览器中打开 dist/index.html，可以看到css已生效
## 2. url-loader与file-loader
webpack5内置了资源模块（asset module），代替了file-loader和url-loader
例：加载图片资源
## 3. sass-loader
(1) 安装
```
yarn add sass-loader node-sass -D 
```
(2) 修改原先的css规则，改为：
```
{
    test: /\.(css|scss|sass)$/,    
    use: ['style-loader', 'css-loader', 'sass-loader'] //从右往左编译的
},
```
（3）新建src/assets/blue.scss文件
```
$blue: blue;
body{
    color: $blue;
} 
```
(4) 在main.js中引入blue.scss
```
import './assets/styles/blue.scss'
```
重新编译，打开dist/index.html，可以看到页面中的123已变成蓝色
## 4. postcss-loader
作用：处理css的loader
配合autoprefixer，增加厂商前缀（css增加浏览器内核前缀）
tip：面试的时候被问到两次（关键词：postcss-loader，autoprefixer，browserslist）
(1）安装：
```
yarn add -D postcss-loader autoprefixer
```

（2）修改原先的css规则：
postcss-loader在css-loader和style-loader之前，在sass-loader或less-loader之后（从右往左解析）
```
{        
  test: /\.(css|scss|sass)$/,        
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
    "sass-loader",        
   ]    
 }


```
(3）在package.json新增browserslist配置
```
"browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
```
在style.css中增加以下样式：
```
/* style.css */
body {
    background: #999;
}

#app div{
    width: 200px;
    margin-top: 50px;
    transform: rotate(45deg); /* 这个属性会产生浏览器内核前缀如 -webkit*/
}
```
重新编译，打开dist/index.html查看效果
## 5. babel-loader
作用：解析ES6，JSX
(1）安装
现在babel已到7的版本，使用@区分其他非官方包
Babel其实是几个模块化的包：
@babel/core：babel核心库
babel-loader：webpack的babel插件，让我们可以在webpack中运行babel
@babel/preset-env：将ES6转换为向后兼容的JavaScript
@babel/plugin-transform-runtime：处理async，await、import()等语法关键字的帮助函数
运行命令：
```
yarn add @babel/core babel-loader @babel/preset-env @babel/plugin-transform-runtime -D
```
（2）配置
```
//webpack.common.js
//在rules下增加配置
{
    test: /(\.jsx|\.js)$/,
    use: ["babel-loader"],
    exclude: /node_modules/,
},
```
(3）增加babel额外配置项
根目录新建.babelrc
```
{
  "presets": ["@babel/preset-env"],
  "plugins": ["@babel/plugin-transform-runtime"]
}
```
(4）注意点
babel-loader 8.x 对应@babel/core（7.x）
babel-loader 7.x 对应babel-core 6.x

(5）测试
public/index.html
使用es6的箭头语法
```
<button>按钮</button>    <script>      document.querySelector("button").onclick = () => {        console.log("es6");      };    </script>
```
重新编译，打开dist/index.html。通过点击可以看到信息被打印出来，说明es6解析成功
# 搭建环境
### 1. 开发环境与生产环境
新建webpack.dev.config.js，webpack.prod.config.js
(1) 安装webpack-dev-server
```
yarn add webpack-dev-server -D
```
(2) 安装webpack-merge
```
yarn add webpack-merge -D
```
(3) webpack.dev.js
```
const { merge } = require("webpack-merge");
const common = require("./webpack.config.js");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  // 打包后文件与源文件映射
  devtool: 'inline-source-map',
  devServer: {
    hot: true, //热更新
    open: true, //编译完自动打开浏览器
    compress: true, //开启gzip压缩
    port: 8080, //开启端口号
    //托管的静态资源文件
    //可通过数组的方式托管多个静态资源文件
    static: {
      directory: path.join(__dirname, "public"),
    },
  },
});
```
(4) webpack.prod.js
```
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
});
```
(5) 修改package.json
```
"scripts": {
    "dev": "webpack serve --config webpack.dev.config.js",
    "build": "webpack --config webpack.prod.config.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```
运行npm run dev查看效果，更改index.html内容，可以看到页面进行了热更新

### 2. 配置别名
resolve与entry同级：
```
//webpack.config.js
  resolve: {
    extensions: [".js", ".jsx", ".json", ".vue"], //省略文件后缀
    alias: { //配置别名
      "@": path.resolve(__dirname, "src"),
    },
  }
```
# 定义全局环境变量
## 1. 定义编译时全局变量
(1）安装：
```
yarn add cross-env -D
```
(2）配置：
```
"scripts": {
    "dev": "cross-env NODE_ENV=development webpack serve --config build/webpack.dev.js",
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.prod.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },

//webpack.common.js
console.log('process.env.NODE_ENV',process.env.NODE_ENV)
```
## 2. 定义编译后全局变量
通过DefinePlugin实现
新建 src/config/dev.env.js
```
module.exports = {
    NODE_ENV:'"development"',
}

//webpck.dev.config.js
const env = require("../config/dev.env");
const webpack =require("webpack")

module.exports = merge(common,{
  plugins: [
    new webpack.DefinePlugin({
      "process.env": env,
    }),
  ],
})


//main.js
console.log(process.env)
```
# 配置Vue
(1）安装：
```
yarn add -D vue-template-compiler@2.6.14 vue-loader@15.9.8
```
注意 vue和vue-template-compiler版本号一定要一样，如果要更新vue，vue-template-compiler也要进行相应的更新
也要注意vue-loader的版本，这里使用vue2，安装15.9.8版本
vue-loader，用于解析.vue文件
vue-template-compiler，用于模板编译
(2）配置：
webpack.config.js
```
const { VueLoaderPlugin } = require('vue-loader'); // vue加载器

module.exports={
    module:{
        rules:[
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                include: [path.resolve(__dirname, 'src')]
            },
        ]
    },
    plugins:[
        new VueLoaderPlugin(),
    ]
}
```

vue-loader要放在匹配规则的第一个，否则会报错
(3）配置externals
// index.html
```
<script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.14/vue.min.js"></script>

<script src="https://cdn.bootcdn.net/ajax/libs/vue-router/3.5.3/vue-router.min.js"></script>

```
// webpack.config.js
```
externals: {
    'vue': 'Vue',
    'vue-router':'VueRouter'
}
```

(4）使用
新建src/App.vue
```
<template>    <div class="app">        <router-link to="/">home</router-link>        <router-link to="/about">about</router-link>        <router-view/>    </div></template><script>export default {    name: "App"}</script><style scoped>.app {    font-size: 14px;    color: aquamarine;}</style>
```
新建src/views/about.vue
```
<template>    <div>        about页面    </div></template>
```
新建src/views/home.vue
```
<template>    <div>        Home页面    </div></template>
```
新建router/index.js
```
Vue.use(VueRouter);const Home = () => import( /* webpackChunkName: "Home" */ '@/views/home.vue')const About = () => import( /* webpackChunkName: "About" */ '@/views/about.vue')const routes = [{    path: '/',    component: Home}, {    path: '/about',    component: About}]const router = new VueRouter({    routes})export default router
```
修改main.js
```
import App from './App.vue';
import router from './router';
Vue.config.productionTip = false;

new Vue({
    router,
    render: (h) => h(App)
}).$mount('#app');
```
重启项目，查看运行效果
# 代码分离
## 1. webpack-bundle-analyzer
它将bundle内容展示为一个便捷的、交互式、可缩放的树状图形式。方便我们更直观了解代码的分离
(1）安装
```
yarn add webpack-bundle-analyzer -D
```
(2）配置
```
//webpack.prod.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; 

plugins:[
    new BundleAnalyzerPlugin()
]
```

(3）运行 npm run build ，编译结束新开一个页面，可以看到bundle之间的关系

## 2. splitChunks（分离chunks）
作用：拆分chunk
```
//webpack.prod.config.js
  // 与plugins同级
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
        "async-common": {
          chunks: "async",
          minChunks: 2,
          name: "async-commons",
          priority: 30,
        },
        commons: {
          name: "commons",
          chunks: "all",
          minChunks: 2,
          priority: 20,
        },
      },
    },
  }
```
(1）chunks：all / async
all：把动态和非动态模块同时进行优化打包，所有模块都扔到vendors.bundle.js里面
async：把动态模块打包进vender，非动态模块保持原样（不优化）
(2）cacheGroups（缓存组）
cacheGroups的作用是将chunks按照cacheGroups中给定的条件分组输出
(3）test
正则匹配，[\\/] 来表示路径分隔符的原因，是为了适配window与Linux系统。可通过(antd|@ant-design)匹配多个文件夹，达到将特定几个文件放入一个chunk中
(4）priority
优先级，默认组的优先级为负，自定义组的默认值为0
(5）非动态导入（直接通过import引入）
安装echarts
```
yarn add echarts -S
```
修改src/views/about.vue文件
```vue
<template>
    <div id="main" style="width: 600px; height: 400px"></div>
</template>
<script>
  import * as echarts from "echarts";
  export default {
    data() {
      return {};
    },
    mounted() {
      const myChart = echarts.init(document.getElementById("main"));
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: "ECharts 入门示例",
        },
        tooltip: {},
        legend: {
          data: ["销量"],
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      };
      myChart.setOption(option);
    },
  };
</script>

```

## 3. 动态导入（按需加载chunks）
按需下载资源，如路由懒加载。可以提升首屏加载速度
(1）安装lodash
```vue
yarn add lodash -S
```
(2）通过import()语法实现动态导入
```javascript
//在main.js添加
function getComponent() {
  // Lodash, now imported by this script
  return import("lodash")
    .then(({ default: _ }) => {
    const element = document.createElement("div");
    
    element.innerHTML = _.join(["Hello", "webpack"], " ");
    
    return element;
  })
    .catch((error) => "An error occurred while loading the component");
}

const button = document.createElement("button");

button.innerHTML = "Click me ";

button.onclick = () => {
  getComponent().then((component) => {
    document.body.appendChild(component);
  });
};

document.body.appendChild(button);
```
(3）在webpack.prod.js中cacheGroups下添加
```javascript
lodash: {
  name: "lodash",
  chunks: "async",
  test: /[\\/]node_modules[\\/]lodash[\\/]/,
  priority: 40,
}
```
运行npm run build，只有点击按钮，lodash.bundle.js包才会被加载
## 4. mini-css-extract-plugin（分离css）
(1）安装
```javascript
yarn add -D mini-css-extract-plugin
```
(2）配置
将webpack.config.js下面的代码剪贴到webpack.dev.config.js
```javascript
//webpack.dev.js
//开发环境不需要样式分离
  module: {    
    rules: [      
      {        
        test: /\.(css|scss|sass)$/,        
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
          "sass-loader",        
        ],      
      },    
    ],  
  },

```
修改webpack.prod.config.js
```javascript
//webpack.prod.js
//生产环境进行样式分离
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports={
    plugins: [  
         new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash:8].css",
          })
    ],
  module: {    
    rules: [      
      {        
        test: /\.(css|scss|sass)$/,        
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
        ],      
      },    
    ],  
  },
}

```
用MiniCssExtractPlugin.loader代替style-loader，配合MiniCssExtractPlugin使用。
(3）拓展：在webpack:5.38.1中，MiniCssExtractPlugin.loader需额外指定publicPath，来引用css资源。因为css样式分离到static/css文件夹下，会多两个层级目录，会使css中的背景图片路径不对。
在webpack:5.68.0中无需下面的配置了，路径问题已经帮我们解决了
```javascript
//不再需要进行配置
{
        test: /\.(css|scss|sass)$/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: '../../'
            }
        }, 'css-loader', 'sass-loader']
 }
```
## 缓存
当把打包后dist目录部署到server上，浏览器就能够访问此server的网站及其资源。而获取资源是比较耗费时间的，这就是为什么浏览器使用一种名为缓存的技术。可以通过命中缓存，以降低网络流量，使网站加载速度更快，然后，如果我们在部署新版本时不更改资源的文件名，浏览器可能会认为它没有被更新，就会使用它的缓存版本。
所以我们需要将变动后的资源文件更改文件名，没有变动的资源（node_modules中的第三方文件）不更改包名称	
### 1. contenthash
[contenthash]将根据资源内容创建出唯一hash。当资源内容发生变化时，[contenthash]也会发生变化。
```javascript
// webpack.config.js
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash:8].js",
    clean: true, //每次构建清除dist包
  }
```
# 禁止生成License文件
[Webpack](https://so.csdn.net/so/search?q=Webpack&spm=1001.2101.3001.7020) 5 默认压缩代码工具为terser-webpack-plugin，无需安装，默认使用。其属性extractComments默认为true
由于Webpack5已经集成terser-webpack-plugin，无需单独安装，直接引入, 在webpack.prod.config.js中
```javascript
const TerserPlugin = require("terser-webpack-plugin");
```
然后加入如下配置, 与plugins同级：
```javascript
optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            extractComments: false,//不将注释提取到单独的文件中
          }),
        ],
      }
```
# Webpack优化
## 1. 如何提⾼**webpack**的打包速度**? **
### (1) 优化 Loader
对于 Loader 来说，影响打包效率首当其冲必属 Babel 了。因为 Babel 会将代码转为字符串生成 AST，然后对 AST 继续进行转变最后再生成新的代码，项目越大，**转换代码越多，效率就越低**。当然了，这是可以优化的。
首先我们**优化 Loader 的文件搜索范围**
```javascript
module.exports = {
  module: {
    rules: [
      {
        // js 文件才使用 babel
        test: /\.js$/,
        loader: 'babel-loader',
        // 只在 src 文件夹下查找
        include: [resolve('src')],
        // 不会去查找的路径
        exclude: /node_modules/
      }
    ]
  }
}
```
对于 Babel 来说，希望只作用在 JS 代码上的，然后 `node_modules` 中使用的代码都是编译过的，所以完全没有必要再去处理一遍。

当然这样做还不够，还可以将 Babel 编译过的文件**缓存**起来，下次只需要编译更改过的代码文件即可，这样可以大幅度加快打包时间
```javascript
loader: 'babel-loader?cacheDirectory=true'
```
(2）HappyPack
受限于 Node 是单线程运行的，所以 Webpack 在打包的过程中也是单线程的，特别是在执行 Loader 的时候，长时间编译的任务很多，这样就会导致等待的情况。
**HappyPack 可以将 Loader 的同步执行转换为并行的**，这样就能充分利用系统资源来加快打包效率了
# 优化打包体积
## 1. 开启gzip压缩
(1）安装
```javascript
yarn add compression-webpack-plugin -D
```
(2）配置：
```javascript
//webpack.prod.config.js
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  plugins: [new CompressionPlugin()],
};
```
## 2.css-minimizer-webpack-plugin
优化和压缩CSS
(1）安装：
```javascript
yarn add css-minimizer-webpack-plugin --save-dev
```
(2）配置：
```javascript
//webpack.prod.config.js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
},
```
## 3. externals
防止将外部资源包打包到自己的bundle中
示例：从cdn引入jQuery，而不是把它打包
(1）index.html
```javascript
<script      src="https://code.jquery.com/jquery-3.1.0.js"      integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="      crossorigin="anonymous"    ></script>

```
(2）webpack.config.js
```javascript
module.exports = {
  //...
  externals: {
    jquery: 'jQuery',
  },
};
```
(3）这样就剥离了那些不需要改		动的依赖模块
```javascript
import $ from 'jquery';
```
# 遇到的问题
## 1. 报错: [Vue warn]: Cannot find element: #app
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2976651/1656152601460-2e35f138-35c6-428f-af70-fd9f533454c3.png#clientId=u52bc5c64-9899-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=589&id=ue1989625&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1178&originWidth=2734&originalType=binary&ratio=1&rotation=0&showTitle=false&size=860688&status=done&style=none&taskId=u1553f21a-52b0-4243-9fc5-882bbb3ae6e&title=&width=1367)
问题原因: public/index.html中必须有id为app的dom节点
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2976651/1656152659016-7317eb6e-4dd4-47df-a0c8-d1834b008256.png#clientId=u52bc5c64-9899-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=376&id=u8374eac2&margin=%5Bobject%20Object%5D&name=image.png&originHeight=752&originWidth=2342&originalType=binary&ratio=1&rotation=0&showTitle=false&size=240385&status=done&style=none&taskId=udb09a860-8dc3-4c41-9621-b6f59aaed0f&title=&width=1171)
## 2. Uncaught Error: Cannot find module './named-references'
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2976651/1656301419172-fd496e45-06c2-4770-8199-17548e68f89d.png#clientId=u52bc5c64-9899-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=424&id=uf72fcf96&margin=%5Bobject%20Object%5D&name=image.png&originHeight=848&originWidth=2740&originalType=binary&ratio=1&rotation=0&showTitle=false&size=262939&status=done&style=none&taskId=u8c9b67d4-37fb-499c-b6e1-d18414748d3&title=&width=1370)
原因: reolsve extension 中指定的后缀名必须添加点
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2976651/1656301753117-5d8ede07-9936-4c29-94ed-2183bf40d9c7.png#clientId=u52bc5c64-9899-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=582&id=u919368bb&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1164&originWidth=2652&originalType=binary&ratio=1&rotation=0&showTitle=false&size=370312&status=done&style=none&taskId=ubfaff4e4-8d42-4440-8544-89969dd2cb3&title=&width=1326)
