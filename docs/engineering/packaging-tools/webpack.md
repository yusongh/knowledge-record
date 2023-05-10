# webpack

## 什么是 webpack

webpack is a module bundler（模块打包工具）

Webpack 可以看做是模块的打包机：他做的事情是，分析你的项目结构，找到 JavaScript 模块以及其他的一些浏览器不能直接运行的扩展语言（scss，Typescript 等），并将其打包为合适的格式以供浏览器使用。

## 安装

- 全局安装（不推荐）

  ```js
  npm install webpack webpack-cli -g
  //webpack-cli 可以帮助我们在命令行里使用npx ,webpack等相关指令

  webpack -v

  npm uninstall webpack webpack-cli -g
  ```

- 局部安装

  ```javascript
  npm install webpack webpack-cli --save-dev // -D

  webpack -v // command not found 默认在全局环境中查找

  npx webpack -v // npx帮助我们在项目中的node_module里查找webpack
  ```

- 安装指定版本

  ```javascript
  npm info webpack // 查看webpack的历史发布信息

  npm install webpack@x.xx webpack-cli -D
  ```

原因：全局安装只能安装一个版本，局部安装可以不同项目维护不同的版本

## 概念

- chunk：代码片段，代码块
  - 一个 chunk 可以由一个模块和多个模块构成
  - 用于代码合并和分割
- chunks：代码片段组
- bundle 文件：资源经过 webpack 流程解析编译后最终输出的成果文件
- module：模块
- entry：入口起点，用来告诉 webpack 用哪个文件作为构建依赖图的起点。webpack 会根据 entry 递归的去寻找依赖，每个依赖都将会被它处理，最后输出到打包的成果文件。
- output：output 配置描述了 webpack 打包的输出配置，包括输出文件的命名、位置等信息。
- loader：默认情况下，webpack 只支持`.js/.json`模块，通过 loader，可以让 webpack 解析其他类型的文件，充当翻译官的角色。理论上只要有性对应的 loader，就可以处理任何类型的文件。
- plugin：loader 主要的职责是让 webpack 能识别更多类型的文件，而 plugin 的职责这是让其可以控制构建流程，而执行一些特殊的任务。plugin 的功能非常强大，可以完成各种各样的任务。
  - webpack 的功能补充
- mode：4.0 开始，webpack 支持零配置，旨在为开发人员减少上手难度，同时加入 mode 的概念，用于指定打包的目标环境，以便在打包的过程中启用 webpack 针对不同的环境下内置的优化。

## 项目结构

```javascript
dist;
// 打包后的资源目录
node_modules;
// 第三方模块
src;
// 源代码
css;
images;
index.js;

package.json;
webpack.config.js;
```

## 入口文件

- 默认入口文件

  src/index.js

- 指定入口文件

  npx webpack index.js（指定入口文件）

## webpack 执行构建命令的方式

```js
// npx方式
npx webpack

// npm script
npm run test
// 修改package.json
"script": {
  "test": "webpack"
}
// 原理是通过shell脚本在node_modules/.bin目录下创建一个软链接
```

## webpack 配置文件

当我们使用 npx webpack index.js 命令时，表示的是使用 webpack 处理打包，名为 index.js 的入口模块，默认放在当前目录下的 dist 目录，打包后的模块名称为 main.js。当然我们也可以对其修改

> webpack 有默认的配置文件，叫 webpack.config.js。我们可以对这个文件进行修改，进行个性化的配置

- 默认配置文件： webpack.config.js

  ```js
  npx webpack //执行命令后，webpack会找到默认的配置文件，并使用执行
  ```

- 不使用默认的配置文件：webpackConfig.js

  ```javascript
  npx webpack --config webpackConfig.js
  // 指定webpack使用webpackConfig.js文件来作为配置文件并执行
  ```

- 使用 package.json 里面的 script 字段制定脚本命令

  ```javascript
  "scripts": {
    "bundle": "webpack" // 然后直接就可以用npm run bundle
  }
  // 原理是通过shell脚本在node_modules/.bin目录下创建一个软链接
  ```

### 默认配置

- webpack 默认支持 JS 模块和 JSON 模块
- 支持 CommonJS、ES module、AMD 等模块的支持

### 配置项

#### entry

> 入口文件配置（默认的入口为`src/index.js`）,可以指定三种类型
>
> 字符串和数组对应的单页面应用，只有对象可以是单页面应用也可以是多页面应用

- string

  ```javascript
  entry: "./src/index.js";
  ```

- object

  ```javascript
  entry: {
    // index为打包的文件名
    // key(index)对应output的filename中的[name]
    // 注意：多入口对应多出口
    index: "./src/index.js";
  }
  ```

- array

  ```javascript
  entry: ["./src/index/js", "./src/a.js"];
  ```

#### output

> 是一个 Object

```js
path: path.resolve(__dirname, "dist"); // 必须为绝对路径
```

- path

  - 打包后要放在哪个目录
  - 使用绝对路径，所以通常使用 node 的 path 模块

- filename

  ```javascript
  // []占位符
  filename: "[name].js"; // name为入口中定义的打包文件名。默认为main，根据入口的key
  ```

- publicPath

#### mode

> 有三个取值：none development production

#### loader

> 模块转化器，用于把模块原内容按照需求转换为新内容
>
> webpack 是模块打包工具，而模块不仅仅是 js，还可以是 css、图片或者其他格式
>
> 但是 webpack 默认只知道如何处理 js 模块，那么其他格式的模块处理，和处理方式就需要 loader 了

##### file-loader：处理理静态资源模块

> 原理：是把打包入口中识别出的资源模块，移动到输出目录，并且返回一个地址名称

> 所以我们什么时候用 file-loader 呢？
>
> 场景：就是当我们需要模块，仅仅是从资源代码挪移到打包⽬录，就可以使用 file-loader 来处理， txt，svg，csv，excel，图片资源等等

```js
npm install file-loader -D
```

**案例**

```js
module: {
    rules: [
        {
            test: /\.(png|jpe?g|gif)$/,
            //use使⽤用一个loader可以⽤用对象，字符串，两个loader需要⽤数组
            use: {
                loader: "file-loader",
                // options额外的配置，比如资源名称
                options: {
                    //  placeholder 占位符
                    //  [name]老资源模块的名称
                    //  [ext]老资源模块的后缀
                    //  https://webpack.js.org/loaders/file-loader#placeholders
                    name: "[name]_[hash].[ext]",
                    //  打包后的存放位置
                    outputPath: "images",
                  	// 引用路径，引入图片路径
                  	publicPath: "../images"
                }
            }
        }
    ]
},
```

##### url-loader

> 可以处理理 file-loader 所有的事情，但是遇到 jpg 格式的模块，会把该图片转换成 base64 格式字符串，并打包到 js 里。对小体积的图片比较合适，大图片不合适。

```js
npm install url-loader -D
```

**案例**

```js
module: {
  rules: [
    {
      test: /\.(png|jpe?g|gif)$/,
      use: {
        loader: "url-loader",
        options: {
          name: "[name]_[hash].[ext]",
          outputPath: "images",
          // 小于2048，才转换成base64，单位为字节
          // 一般情况下，是根据是否大于3kb来判断是否需要转为base64
          limit: 2048,
        },
      },
    },
  ];
}
```

##### 样式处理

> Css-loader 分析 css 模块之间的关系，并合成⼀个 css
>
> Style-loader 会把 css-loader 生成的内容，以 style 挂载到页面的 header 部分

```js
//  安装命令
npm install style-loader css-loader -D
```

**案例**

```js
{
    test: /\.css$/,
    use: ["style-loader", "css-loader"]
}
```

##### sass 样式处理理

> sass-load 把 sass 语法转换成 css ，依赖 node-sass 模块

```js
// 安装命令
npm install sass-loader node-sass -D
```

**案例**

**loader 有顺序，从右到左，从下到上**

```js
{
    test: /\.scss$/,
    use: ["style-loader", "css-loader", "sass-loader"]
}

```

##### 样式自动添加前缀

> Postcss-loader

```js
//  安装命令
npm i -D postcss-loader
```

**案例**

```js
{
    test: /\.css$/,
    use: ["style-loader", "css-loader", "postcss-loader"]
}

//  新建postcss.config.js
//  安装autoprefixer
//  安装命令：npm i autoprefixer -D
module.exports = {
    plugins: [require("autoprefixer")]
}
```

##### postcss

> postcss 为预处理器，针对 css。是一个平台，包含很多插件。

1. autoprefixer

> 其中 autoprefixer，可以为新的 css 特性自动添加前缀。

- 需要定义 browserslist 来指定需要适配那些浏览器（其中的数据来源是[can i use](https://caniuse.com/)）（更加详细的可查看当前目录下的 browserslist 文档）
  - `last 2 versions`所有浏览器的最近两个大版本
  - `> 1%`市场份额大于百分之一的浏览器

2. cssnano

> css 代码压缩

#### module

> 模块，在 webpack 里面一切皆模块，一个模块对应着一个文件，webpack 会从配置的`entry`开始递归找出所有依赖的模块。

```js
modules: {
    rules: [
        test: /\.xxx$/,
        use: {
        	loader: 'xxx-load'
        }
    ]
}

// 当webpack处理到不认识的模块时，需要在webpack中的module处进行配置，当检测到是什么格式的模块，使用什么loader来处理。
```

#### Plugins

> plugin 可以在 webpack 运行到某个阶段的时候，帮你做⼀些事情，类似于生命周期的概念扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。

##### HtmlWebpackPlugin

> htmlwebpackplugin 会在打包结束后，⾃自动⽣生成一个 html 文件，并把打包生成的 js 模块引入到该 html 中。

```js
// 安装命令
npm install --save-dev html-webpack-plugin
```

**配置**

```js
title: // ⽤用来⽣生成⻚页⾯面的 title 元素

filename: // 输出的 HTML ⽂文件名，默认是 index.html, 也可以直接配置带有⼦子⽬目录。

template: // 模板⽂文件路路径，⽀支持加载器器，⽐比如 html!./index.html

inject: true | 'head' | 'body' | false  // 注⼊入所有的资源到特定的 template 或者 templateContent 中，如果设置为 true 或者 body，所有的 javascript 资源将被放置到 body 元素的底部，'head' 将放置到 head 元素中。

favicon: // 添加特定的 favicon 路路径到输出的 HTML ⽂文件中。

minify: {} | false // 传递 html-minifier 选项给 minify 输出

hash: true | false // 如果为 true, 将添加⼀一个唯⼀一的 webpack 编译 hash 到所有包含的脚本和 CSS ⽂文件，对于解除 cache 很有⽤用。

cache: true | false // 如果为 true, 这是默认值，仅仅在⽂文件修改之后才会发布⽂文件。

showErrors: true | false // 如果为 true, 这是默认值，错误信息会写⼊入到 HTML ⻚页⾯面中

chunks: // 允许只添加某些块 (⽐比如，仅仅 unit test 块)

chunksSortMode: // 允许控制块在添加到⻚页⾯面之前的排序⽅方式，⽀支持的值：'none' | 'default' | {function}-default:'auto'

excludeChunks: // 允许跳过某些块，(⽐比如，跳过单元测试的块)
```

**案例**

```js
const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    // ...省略
    plugins: [
        new htmlWebpackPlugin({
            title: "My App",
            filename: "app.html",
            template: "./src/index.html"
        })
    ]
};

//index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>

```

##### clean-webpack-plugin

> 帮助我们打包的时候先清除我们的 dist 目录

```js
// 安装命令
npm install --save-dev clean-webpack-plugin
```

**案例**

```js
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// ...省略
plugins: [new CleanWebpackPlugin()];
```

##### mini-css-extract-plugin

> 打包生成 css 文件并在 html 中引入，而 style-css-loader 是通过 js 动态引入样式

**案例**

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

//  module配置
{
    test: /\.css$/,
    use: [MiniCssExtractPlugin.loader, "css-loader"]
}

// plugins配置
new MiniCssExtractPlugin({   filename: "[name].css" })

```

#### 配置（configuration）

##### sourceMap

> 源代码与打包后的代码的映射关系

在 dev 模式中，默认开启，关闭的话可以在配置文件里

```js
devtool: "none";
```

devtool 的介绍：[https://webpack.js.org/configuration/devtool#devtool](https://webpack.js.org/configuration/devtool#devtool)

- eval:速度最快,使用 eval 包裹模块代码
- source-map： 产生.map ⽂文件
- cheap:较快，不用管列的信息（错误不会精确到列，只会精确到行）,也不包含 loader 的 sourcemap
- Module：第三方模块，包含 loader 的 sourcemap（比如 jsx to js ，babel 的 sourcemap）
- inline： 将.map 作为 DataURI 嵌入，不单独生成.map ⽂文件

**推荐配置**

```js
devtool:"cheap-module-eval-source-map", // 开发环境配置
devtool:"cheap-module-source-map",   // 线上⽣生成配置
```

##### WebpackDevServer

- 提升开发效率的利器

- 每次改完代码都需要重新打包一次，打开浏览器，刷新一次，很麻烦
- 我们可以安装使用 webpackdevserver 来改善这块的体验
- 启动服务后，会发现 dist ⽬目录没有了，这是因为 devServer 把打包后的模块不会放在 dist 目录下，而是放到内存中，从而提升速度

**安装**

```js
npm install webpack-dev-server -D
```

**修改 packag.json**

```js
"scripts": {
    "server": "webpack-dev-server"
},
```

**在 webpack.config.js 配置**

```js
devServer: {
    contentBase: "./dist",   // 静态文件目录
    open: true,    // 是否自动打开浏览器
    port: 8081  // 端口号
},
```

- **解决跨域问题**

> 联调期间，前后端分离，直接获取数据会跨域，上线后我们使用 nginx 转发，开发期间，webpack 就可以搞定这件事

**1、启动一个服务器，mock 一个接口**

```js
// npm i express -D
// 创建⼀一个server.js 修改scripts "server":"node server.js"

//server.js
const express = require('express')
const app = express()
app.get('/api/info', (req,res)=>{
    res.json({
        name: 'webpack',
        age: 5,
        msg: 'hello webpack'
    })
})

app.listen(

//node server.js
http://localhost:9092/api/info
```

**2、项目中安装 axios 工具**

```js
//npm i axios -S
//index.js
import axios from 'axios' axios.get('http://localhost:9092/api/info').then(res=>{
    console.log(res)
})

```

**3、会有跨域问题**

**4、修改 webpack.config.js 设置服务器代理**

```js
proxy: {
    "/api": {
        target: "http://localhost:9092"
    }
}

```

**5、修改 index.js**

```js
axios.get("/api/info").then((res) => {
  console.log(res);
});
```

##### Hot Module Replacement (HMR:热模块替换）

**1、启动 HMR**

```js
devServer: {
    contentBase: "./dist",
    open: true,
    hot:true,
    // 即便HMR不⽣效，浏览器也不自动刷新，就开启hotOnly
    hotOnly:true
},

```

**2、配置⽂文件头部引⼊入 webpack**

```js
//const path = require("path");
//const HtmlWebpackPlugin = require("html-webpack-plugin");
//const CleanWebpackPlugin = require("clean-webpack-plugin");

const webpack = require("webpack");
```

**3、在插件配置处添加**

```js
plugins: [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: "src/index.html",
  }),
  new webpack.HotModuleReplacementPlugin(),
];
```

**案例：css 热更新**

```js
//index.js
import "./css/index.css";
var btn = document.createElement("button");
btn.innerHTML = "新增";
document.body.appendChild(btn);

btn.onclick = function () {
  var div = document.createElement("div");
  console.log("1");
  div.innerHTML = "item";
  document.body.appendChild(div);
};


//index.css
div:nth-of-type(odd) {
  background: yellow;
}
```

**处理 js 模块 HMR**

**需要使用 module.hot.accept 来观察模块更新从而更新**

**案例**

```js
//counter.js
function counter() {
  var div = document.createElement("div");
  div.setAttribute("id", "counter");
  div.innerHTML = 1;
  div.onclick = function () {
    div.innerHTML = parseInt(div.innerHTML, 10) + 1;
  };
  document.body.appendChild(div);
}
export default counter;


//number.js
function number() {
  var div = document.createElement("div");
  div.setAttribute("id", "number");
  div.innerHTML = 13000;
  document.body.appendChild(div);
}
export default number;


//index.js
import counter from "./counter";
import number from "./number";

counter();
number();

if (module.hot) {
  module.hot.accept("./b", function () {
    document.body.removeChild(document.getElementById("number"));
    number();
  });
}

```

##### Babel 处理 ES6

官方⽹站：https://babeljs.io/

中文⽹站：https://www.babeljs.cn/

- 1、预设（Presets）

**官方 presets**

- @babel/presets-env （专门处理 javascript）
- @babel/presets-flow（专门处理 flow 语法）
- @babel/presets-react（专门处理 jsx 语法）
- @babel/presets-typescript（专门处理 typescript 语法）

```js
npm i babel-loader @babel/core @babel/preset-env -D

//babel-loader是webpack 与 babel的通信桥梁，不会做把es6转成es5的工作，这部分工作需要用到@babel/preset-env来做

//@babel/preset-env里包含了了es6转es5的转换规则

//index.js const
const arr = [new Promise(() => {}), new Promise(() => {})];
arr.map(item => {  console.log(item); });

```

**通过上面的几步 还不够，Promise 等一些还有转换过来，这时候需要借助@babel/polyfill，把 es 的新特性都装进来，来弥补低版本浏览器中缺失的特性**

- 2、@babel/polyfill

以全局变量的方式注入进来的。windows.Promise，它会造成全局对象的污染

```js
npm install --save @babel/polyfill

// Webpack.config.js
{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "babel-loader",
    options: {
        presets: ["@babel/preset-env"]
    }
}

//index.js 顶部
import "@babel/polyfill";

```

**会发现打包的体积大了很多，这是因为 polyfill 默认会把所有特性注入进来，假如我想我用到的 es6+，才会注入，没用到的不注入，从而减少打包的体积，可不可以呢**

**当然可以**

**修改 Webpack.config.js**

```js
options: {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          edge: "17",
          firefox: "60",
          chrome: "67",
          safari: "11.1",
        },
        corejs: 2, // 新版本需要指定核心库版本
        useBuiltIns: "usage", // 按需注⼊ entry usage false
      },
    ],
  ];
}
// useBuiltIns 选项是 babel 7 的新功能，这个选项告诉 babel 如何配置 @babel/polyfill 。
// 它有三个参数可以使⽤：
// （1）entry: 需要在 webpack 的⼊⼝⽂件⾥ import"@babel/polyfill" ⼀次。 babel会根据你的使⽤情况导⼊垫⽚，没有使⽤的功能不会被导⼊相应的垫⽚。
// （2）usage: 不需要 import ，全⾃动检测，但是要安装@babel/polyfill 。
// （3）false: 如果你 import "@babel/polyfill" ，它不会排除掉没有使⽤的垫⽚，程序体积会庞⼤。(不推荐)
```

**优化点：如果不设置 option 属性，则可以通过配置.babelrc 文件配置**

- 注意点：babel 7.4.0 后的版本后注意的问题

> 官方不再推荐使用 polyfill，因为 polyfill 是依赖`core-js/stable`和`regenerator-runtime/runtime`这两个库，所以 7.4.0 后的版本，官方推荐直接引入这两个包即可。所以，直接安装的 polyfill 中的 core-js 是 2.x 版本的。详细的可以查看[官方文档](https://www.babeljs.cn/docs/babel-polyfill)。
>
> 但是如果不希望使用官网的方案，而是想继续使用 polyfill，但是又想使用 3.x 的 core-js，则需要单独安装一下 3.x 的 core-js，然后再 babel-loader 的配置中添加`corejs：3`的配置。

- 3、@babel/plugin-transform-runtime

> **当我们开发的是组件库，工具库这些场景的时候，polyfill 就不适合了，因为 polyfill 是注入到全局变量， window 下的，会污染全局环境，所以推荐闭包方式：@babel/plugin-transform-runtime**

**它不会造成全局污染**

```js
npm install --save-dev @babel/plugin-transform-runtime

npm install --save @babel/runtime

```

**使用步骤**

1、先注释掉 index.js 里的 polyfill

```js
//import "@babel/polyfill";
const arr = [new Promise(() => {}), new Promise(() => {})];

arr.map((item) => {
  console.log(item);
});
```

2、修改配置文件：添加 plugins

```js
"options": {
    "presets": [
      [
        "@babel/preset-env",
        {
          "targets": {
            "edge": "17",
            "firefox": "60",
            "chrome": "67",
            "safari": "11.1"
          },
          "useBuiltIns": "usage",
          "corejs": 2
        }
      ]
    ],
    "plugins": [
      [
        "@babel/plugin-transform-runtime",
        {
          "absoluteRuntime": false,
          "corejs": 2,
          "helpers": true,
          "regenerator": true,
          "useESModules": false
        }
      ]
    ]
  }
```

注意点：

useBuiltIns 选项是 babel 7 的新功能，这个选项告诉 babel 如何配置@babel/polyfill。 它有三个参数可以使用：

- ①entry: 需要在 webpack 的入口文件里 import "@babel/polyfill"一 次。babel 会根据你的使用情况导入垫片，没有使用的功能不会被导入相应的垫片。

- ②usage: 不需要 import，全自动检测，但是要安装@babel/polyfill。（试验阶段）

- ③false: 如果你 import "@babel/polyfill"，它不会排除掉没有使用的垫片，程序体积会庞大。(不推荐)

**请注意： usage 的行为类似 babel-transform-runtime，不会造成全局污染，因此也不会对类似 Array.prototype.includes() 进行 polyfill。**

##### 扩展

**babelrc 文件：**

新建.babelrc 文件，把 options 部分移入到该文件中，就可以了

```js
// .babelrc文件
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": 2,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  ]
}



//webpack.config.js
{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "babel-loader"
}

```

##### 配置 React 打包环境

**安装**

```js
npm install react react-dom --save
```

**编写 react 代码**

```js
//index.js import "@babel/polyfill";
import React, { Component } from "react";
import ReactDom from "react-dom";
class App extends Component {
  render() {
    return <div>hello world</div>;
  }
}
ReactDom.render(<App />, document.getElementById("app"));
```

**安装 babel 与 react 转换的插件**

```js
npm install --save-dev @babel/preset-react

```

**在 babelrc 文件里添加**

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1",
          "Android": "6.0"
        },
        "useBuiltIns": "usage" //按需注⼊入
      }
    ],
    "@babel/preset-react"
  ]
}
```

##### tree Shaking

**webpack2.x 开始⽀支持 tree shaking 概念，顾名思义，"摇树"，只⽀支持 ES module 的引⼊入⽅方式！！！！**

```js
//webpack.config.js
optimization: {    usedExports: true  }
//package.json
"sideEffects":false
// 正常对所有模块进⾏行行tree shaking  或者 "sideEffects": ['*.css','@babel/polyfill']

```

**开发模式设置后，不会帮助我们把没有用的代码去掉**

**案例**

```js
//expo.js
export const add = (a, b) => {
  console.log(a + b);
};
export const minus = (a, b) => {
  console.log(a - b);
};

//index.js
import { add } from "./expo";
add(1, 2);
```

##### development vs Production 模式区分打包

```js
npm install webpack-merge -D
```

**案例**

```js
const merge = require("webpack-merge")
const commonConfig =  require("./webpack.common.js")
const devConfig = {
    ...
}
module.exports = merge(commonConfig,devConfig)

//package.js
"scripts":{
    "dev":"webpack-dev-server --config ./build/webpack.dev.js",
    "build":"webpack --config ./build/webpack.prod.js"
}

```

**案例 2**

基于环境变量

```js
//外部传入的全局变量
module.exports = (env) => {
  if (env && env.production) {
    return merge(commonConfig, prodConfig);
  } else {
    return merge(commonConfig, devConfig);
  }
};

//外部传入变量
scripts: " --env.production";
```

##### 代码分割 code Splitting

```js
import _ from "lodash";

console.log(_.join(["a", "b", "c", "****"]));

// 假如我们引入一个第三方的工具库，体积为1mb，而我们的业务逻辑代码也有1mb，那么打包出来的体积大小会在2mb
// 导致问题：
// 体积大，加载时间长
// 业务逻辑会变化，第三方工具库不会，所以业务逻辑一变更，第三方⼯具库也要跟着变。
```

**引入代码分割的概念**

```js
//lodash.js
import _ from "lodash";

window._ = _;

//1、
//index.js 注释掉lodash引⽤用
//import _ from "lodash";

console.log(_.join(['a','b','c','****']))

// 2、
//webpack.config.js
entry: {
    lodash: "./lodash.js",
    index: "./index.js"
},
//指定打包后的资源位置
output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js"
}

```

**其实 code Splitting 概念 与 webpack 并没有直接的关系，只不过 webpack 中提供了一种更加方便的方法供我们实现代码分割**

基于[https://webpack.js.org/plugins/split-chunks-plugin/](https://webpack.js.org/plugins/split-chunks-plugin/)

```js
optimization: {
    splitChunks: {
    	chunks: 'async',// 对同步，异步，所有的模块有效
        minSize: 30000,// 当模块大于30kb
        maxSize: 0,// 对模块进行二次分割时使用，不推荐使用
        minChunks: 1,// 打包⽣生成的chunk文件最少有几个chunk引用了这个模块
        maxAsyncRequests: 5,// 模块请求5次
        maxInitialRequests: 3,// 入口文件同步请求3次
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10// 优先级数字越大，优先级越高
            },
            default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
            }
        }
    }
}

```

**使用下面的配置即可**

```js
optimization:{
    // 帮我们⾃自动做代码分割
    splitChunks:{
    	chunks:"all",// 默认是支持异步，我们使用all
    }
}

```

## 指定依赖安装源

> 根目录下创建.npmrc 文件

```javascript
registry=https://registry.npm.taobao.org
```

## 自定义 loader 的实现

- loader 本质上就是一个函数

- 但是不可以是箭头函数

  - 因为很多东西都挂在 this 上面获取

- loader 必须有返回值，需要返回一个 string、buffer

- loader 支持配置

  - 配置 loader 的时候传入 options 对象，在 loader 中通过 this.query 获取

- loader 如何返回多个信息

  ```javascript
  this.callback(
    err: Error | null,
    content: string | Buffer,
    sourceMap?: SourceMap,
    meta?: any
  );
  // 第一个参数必须是 Error 或者 null
  // 第二个参数是一个 string 或者 Buffer。
  // 可选的：第三个参数必须是一个可以被这个模块解析的 source map。
  // 可选的：第四个选项，会被 webpack 忽略，可以是任何东西（例如一些元数据）。
  ```

- loader 如何处理异步

  ```javascript
  // 告诉 loader-runner 这个 loader 将会异步地回调。返回 this.callback
  const callback = this.async();
  ```

- 如何处理多个 loader

- 自定义 loader 如何像第三方 loader 一样，不用写路径，直接写 loader 名称

  ```javascript
  resolveLoader: {
    modules: [
      "node_modules",
      "./myLoaders", // 自定义loader的目录
    ];
  }
  ```

案例

```javascript
// less-loader
// 把less 语法编译成css
const less = require("less");

module.exports = function (source) {
  less.render(source, (err, output) => {
    this.callback(err, output.css);
  });
};

// css-loader
// 将css序列化
module.exports = function (source) {
  return JSON.stringify(source);
};

// style-loader
// 将样式通过动态添加style标签添加到head中
// 创建style标签
// 将样式添加到style标签中
// 将style标签添加到head中
module.exports = function (source) {
  return `
    const tag = document.createElement("style");
    tag.innerHTML = ${source};
    document.head.appendChild(tag)
  `;
};
```

## webpack 文件指纹策略

### hash

> hash 策略是以项目为单位的，项目内容发生改变，则会生成新的 hash，项目内容不变则 hash 不变

> 每次打包生成的 hash 码，只有当代码发生改变时，该 hash 值才会改变，如果代码没有发生改变，则该 hash 值不会发生变化

```javascript
// webpack.config.js
output: {
  // hash占位符后面的冒号数字，表示去hash的多少位
  filename: "[name]_[hash:8].js";
}
```

### chunkhash（js 建议使用）

> chunkhash 以 chunk 为单位，当一个文件内容发生改变时，则整个 chunk 组的模块 hash 都会改变

### contenthash（css 建议使用）

> contenthash 以自身内容为单位

## 多页面打包通用方案

1. 定义多入口 entry

   ```javascript
   entry: {
     index: "./src/index.js",
     list: "./src/list/index.js"
   },
   ```

2. 实例化多个 htmlwebpackplugin

   ```javascript
   // chunks定义html关联的chunks，这样就不会把所有的chunks都在html中引入
   plugins: [
     new HtmlWebpackPlugin({
       template: "./src/index.html",
       filename: "index.html",
       chunks: ["index"],
     }),
     new HtmlWebpackPlugin({
       template: "./src/list/index.html",
       filename: "list.html",
       chunks: ["list"],
     }),
   ];
   ```

3. 但是手动去写多个 entry 和 htmlwebpackplugin 太麻烦，通过实现一个函数来自动生成 entry 和 htmlwebpackplugin

   ```javascript
   // 通过glob模块实现
   const setMap = () => {
     const entry = {};
     const htmlWebpackPlugins = [];

     // 通过glob的sync Api获取
     const entryFiles = glob.sync(path.join(__dirname, "./src/*/index.js"));

     entryFiles.map((item) => {
       const match = item.match(/\/src\/(.*)\/index\.js$/);
       const pageName = match[1];

       // 组装入口entry
       entry[pageName] = item;
       // 组装htmlWebpackPlugin
       htmlWebpackPlugins.push(
         new HtmlWebpackPlugin({
           template: `./src/${pageName}/index.html`,
           filename: `${pageName}.html`,
           chunks: [pageName],
         })
       );
     });

     return {
       entry,
       htmlWebpackPlugins,
     };
   };
   ```

## 集成 vue

> 可查看 vue[官方文档](https://vue-loader.vuejs.org/zh/guide/)，vue-loader，**更加详细的查看官方文档**。

1. 安装

   ```sh
   npm install -D vue-loader vue-template-compiler
   ```

2. webpack 配置

```javascript
// webpack.config.js
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  module: {
    rules: [
      // ... 其它规则
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
    ],
  },
  plugins: [
    // 请确保引入这个插件！
    new VueLoaderPlugin(),
  ],
};
```

3. 完整 webpack 配置示例

```javascript
// webpack.config.js
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      // 它会应用到普通的 `.js` 文件
      // 以及 `.vue` 文件中的 `<script>` 块
      {
        test: /\.js$/,
        loader: "babel-loader",
      },
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    // 请确保引入这个插件来施展魔法
    new VueLoaderPlugin(),
  ],
};
```

## plugin 相关

### 生命周期概念

**Webpack 在编译代码过程中，会触发一系列 Tapable 钩子事件，插件所做的，就是找到对应的钩子，往上面挂上自己的任务，也就是注册事件。这样，在 webpack 构建的时候，插件注册的事件就会随着钩子的触发而执行。**

1. 启动 webpack
2. 读取 webpack.config.js 中的配置
   - 读取 plugins 里面的插件，发现都是 new 一个构造函数，所以在读取 plugin 时，已经完成了插件的初始化了。
   - 插件初始化就是，插件告知 webpack 运行到哪个阶段触发我这个插件

```javascript
// 1.编写代码
// 将webpack生命周期钩子打印出来
const webpack = require("webpack");
// 获取webpack打包配置
const options = require("../webpack.config");
// 执行webpack方法会返回一个compiler对象
const compiler = webpack(options);

// 给webpack hooks注册事件
Object.keys(compiler.hooks).forEach((hookName) => {
  if (compiler.hooks[hookName].tap) {
    // 注册事件
    compiler.hooks[hookName].tap("anyString", () => {
      console.log(`run --> ${hookName}`);
    });
  }
});

// 执行构建
compiler.run();

// 2.直接node运行该js文件

// 3.打印结果
run --> beforeRun;
run --> run;
run --> normalModuleFactory;
run --> contextModuleFactory;
run --> beforeCompile;
run --> compile;
run --> thisCompilation;
run --> compilation;
run --> make;
run --> normalModuleFactory;
run --> contextModuleFactory;
run --> beforeCompile;
run --> compilation;
run --> afterCompile;
run --> done;
```

**以上打印的钩子不完整，完整的可查看[webpack 官方文档](https://www.webpackjs.com/api/compiler-hooks/)**

#### Compiler Hooks（比较重要的几个钩子）

？？Compiler 编译器模块是创建编译实例的主引擎。大多数面向用户的插件都是首先在 Compiler 上注册。

compiler 上暴露的一些常用的钩子

| 钩子         | 类型              | 调用时机                                                                |
| ------------ | ----------------- | ----------------------------------------------------------------------- |
| run          | AsyncSeriesHook   | 在编译器开始读取记录前执行                                              |
| compile      | SyncHook          | 在一个新的 compilation 创建之前执行                                     |
| compilation  | SyncHook          | 在一次的 compilation 创建之后执行                                       |
| make         | AsyncParallelHook | 完成一次编译之前执行                                                    |
| emit         | AsyncSeriesHook   | 在生成文件到 output 目录之前执行，回调参数：`compilation`               |
| afterEmit    | AsyncSeriesHook   | 在生成文件到 output 目录之后执行                                        |
| assetEmitted | AsyncSeriesHook   | 生成文件的时候执行，提供访问产出文件信息的入口，回调参数：`file`,`info` |
| done         | AsyncSeriesHook   | 一次编译完成后执行，回调参数：`state`                                   |

### 自定义插件

> 使用 plugin 的时候，都是通过 new 来实例化 plugin，所以 plugin 本质上就是一个类

- plugin 本质上就是一个类
- 内部必须实现一个 apply 方法
- 钩子主要分为两大类 同步钩子 异步钩子
  - 同步钩子
  - 异步钩子
    - 异步钩子一定要调用 cb()方法

**Demo**

```javascript
module.exports = class AddTxtWebpackPlugin {
  // 实现apply方法
  apply(compiler) {
    // 钩入hooks
    // 钩子主要分为两大类 同步钩子 异步钩子

    // 同步钩子
    compiler.hooks.compile.tap("addTxtWebpackPlugin", (compilation) => {
      // 打包出的产物文件列表
      console.log("sync", compilation.assets);
    });

    // 异步钩子
    compiler.hooks.emit.tapAsync("addTxtWebpackPlugin", (compilation, cb) => {
      console.log("async", compilation.assets);

      // 获取文件数量和文件名称
      let fileNum = 1;
      let fileNameStr = "file-list.txt\n";
      Object.keys(compilation.assets).forEach((item) => {
        fileNum++;
        fileNameStr += item + "\n";
      });

      // 往产物列表中添加txt文件
      compilation.assets["file-list.txt"] = {
        source: () => {
          return `fileList: ${fileNum}\n${fileNameStr}`;
        },
        size: () => {
          return 9;
        },
      };
      // 必须调用cb()
      cb();
    });
  }
};
```

## webpack 原理分析

const compiler = webpack(options);

compiler.run();

- 读取配置的入口

  - 入口模块的路径

  - 模块分析

    - 模块的依赖（依赖的路径）
      - 可以用递归的方式处理依赖模块
    - 内容处理（处理后的内容代码）
    - 依赖图谱对象

  - webpackBootstrap 函数

- 读取配置的处理

  - 生成文件
    - 文件存放的位置
    - 文件的名称
