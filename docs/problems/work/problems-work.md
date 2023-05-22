# 工作中遇到的问题汇总

## 1、移动端访问需要安装证书
ios安装证书需要下载下来（存储到文件），然后才可以安装（到描述文件中安装），然后再到关于手机->证书信任设置中勾选

## 2、aes加密
```javascript
dst=dst.contact(ret)修改为dst.push(...ret)
```

## 3、解决vue-router@3.0.7版本意义上的报错（Uncaught (in promise) Error: Redirected when going from "/login" to "/homePage" via a navigation guard.）
```javascript
// 解决上面跳转加参数报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

// 修改路由replace方法,阻止重复点击报错
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err);
}
```

## 4、mock-server中间件中可以增加这个来校验是否是以/mock/开头的
```javascript
// 要以/mock/开头
if (!/^\/mock\//.test(url)) {
  throw new Error(`The request(${url}) does not start with '/mock/'`);
}
```

## 5、针对某个chunk怎加prefetch
```javascript
import(/* webpackPrefetch: true */ './someAsyncComponent.vue')
```

## 6、display:flex布局下，写的高度会失效

## 7、移动端模板的autoprefixer失效
需要在postcss.config.js加上autoprefixer，貌似是加的postcss.config.js覆盖了vue-cli的

## 8、由于babel的原因导致，export default 一个对象，无法直接在import 中结构，可以搜索（ES6 export default 和 import语句中的解构赋值）

## 9、html-webpack-plugin通过html生成一个不引入任何依赖的html，之前存在会自动引入依赖的问题，现在配置了inject为false，之前是自己写的一个plugin，现在可以直接使用以下配置
```javascript
// vue.config.js
new HtmlWebpackPlugin({
  title: "title",
  template: "./public/refresh.html", // 源模板文件
  filename: "refresh.html", // 输出文件【注意：这里的根路径是module.exports.output.path】
  showErrors: true,
  inject: false,
  templateParameters: {
    projectName: process.env.VUE_APP_PROJECT_NAME
  }
}),
```
	  
## 10、多页面（vue.config.js中配置了pages）情况下，配置了删除prefetch，但是没有生效bug，需配置为删除prefetch-{页面名称}
https://blog.csdn.net/m0_46468123/article/details/106547042

## 11、http请求重试放到后面不生效，是因为响应拦截器中return Promise.reject(errorInfo)，应该return Promise.reject(error)；因为重试的原理是增加一个响应拦截器，应该把error传递下去

## 12、动态表单复选框，必填校验失效问题。
（1）框架内部是这里的问题：修改form-item/base.vue。
```javascript
if (!(modelValue instanceof Array)) {
  // fix 如果是checkbox，则给空数组
  modelValue = modelValue.split(",");
  this.$set(this.models, this.record.model, modelValue);
}
```
（2）但是修改了敏感信息收集项目的DynamicForm.vue
```javascript
// 初始化数据字段
this.formTemplate.list.map(v => {
  if (!this.models[v.key]) {
    if (v.type === "checkbox") {
      this.$set(this.models, v.key, []);
    } else {
      this.$set(this.models, v.key, "");
    }
  }
});
```


## 13、ts下给window添加属性
### （1）有declare global {}，需要在声明文件加export {}，例如下面的写法
```javascript
declare global {
  interface Window {
    ga: (
      command: 'send',
      hitType: 'event' | 'pageview',
      fieldsObject: GAFieldsObject | string,
    ) => void;
    reloadAuthorized: () => void;
    userManager: Oidc.UserManager;
    settings: Oidc.UserManagerSettings;
    pageLoaded: boolean;
    routerBase: string | undefined;
  }
}
```
https://juejin.cn/post/6898710177969602574
如果不加export {}，会报「全局范围的扩大仅可直接嵌套在外部模块中或环境模块声明中」错误。增加export{}其实也就是为了让这个声明文件变成模块声明文件，而不是一个全局声明文件。

问题：但是转为模块文件会导致全局的声明失效，详看下面第二点，所以需要将window全局声明单独一个文件，才不会影响到其他全局声明。

### （2）第二种方法是去掉declare global {}，直接写interface Window {}，这种不用转为模块文件，也不会导致全局声明失效


## 14、声明文件中有import或者export语句，则会认为是模块
http://ts.xcatliu.com/basics/declaration-files#san-xie-xian-zhi-ling
在全局变量的声明文件中，是不允许出现 import, export 关键字的。一旦出现了，那么他就会被视为一个 npm 包或 UMD 库，就不再是全局变量的声明文件了。故当我们在书写一个全局变量的声明文件时，如果需要引用另一个库的类型，那么就必须用三斜线指令了


## 15、pc端模板项目中element-ui样式重复引入问题，是由于用了sdc-theme定义主题导致的。
https://github.com/ElemeFE/element/issues/11817
http://www.javashuo.com/article/p-kqntymhp-gk.html
https://blog.csdn.net/yijie_0_/article/details/120996637

> (1) 解决方案如下：（已在备份中弄了方案，后续如果修改则可以使用---该方案无法完美解决，还是会出现重复的）

> (2) 该方案能解决开发环境样式重复问题，但是热更新会失效（已在备份中弄了方案（D:\备份\模板项目\pc\样式重复问题-该方案能解决测试环境样式重复问题，但样式热更新会失效））
> 打包后的样式没有重复，只是在本地开发时会重复，因为打包进行了css压缩去重
> 热更新失效（https://cli.vuejs.org/zh/config/#css-extract）
```diff
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

+  const cssnanoOptions = {
+    preset: [
+      "default",
+      {
+        mergeLonghand: false,
+        cssDeclarationSorter: false
+      }
+    ]
+  };

module.exports = {
  //使用./后就不用修改那个index里面的内容了,也可以改成CDN地址
  publicPath: (() => {
    return process.env.VUE_APP_BASE_URL;
  })(),
  outputDir: `dist${process.env.VUE_APP_BASE_URL}`, //build输出地址
  assetsDir: "./assets/",
  lintOnSave: false,
  runtimeCompiler: false, //运行时编译,有性能损耗,去掉
  transpileDependencies: [], //babel-loader 默认会跳过 node_modules 依赖
  productionSourceMap: false, //生产环境是否构建生成source map
  css: {
    // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
    // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
+    extract: true,
    // 是否开启 CSS source map？
    sourceMap: false,
    // 为预处理器的 loader 传递自定义选项。比如传递给
    // sass-loader 时，使用 `{ sass: { ... } }`。
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
            hack: `true; @import "src/assets/css/mixins.less";`
          }
        }
      }
    }
    // 为所有的 CSS 及其预处理文件开启 CSS Modules。
    // 这个选项不会影响 `*.vue` 文件。
    // modules: false
  },
  devServer: {
    // 开发配置
    port: 8080, // 端口号
    disableHostCheck: true, // 禁用域名检查
    noInfo: true, // 启用 noInfo 后，诸如「启动时和每次保存之后，那些显示的 webpack 包(bundle)信息」的消息将被隐藏。错误和警告仍然会显示。
    hot: true, // 热更新
    compress: true, // 一切服务都启用 gzip 压缩
    inline: true,
    before: require("./mock/mock-server.js"), //在其他中间件之前执行自定义mock中间件
    // 代理api服务
    proxy: {
      "/api/*": {
        target: "https://test-g.growth.woa.com/ltiinfo/",
        pathRewrite: { "^/api/": "/api/" },
        changeOrigin: true,
        secure: false
      },
      "/time": {
        target: "https://test-g.growth.woa.com/",
        changeOrigin: true,
        secure: false
      }
    }
  },
  // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`
  // 在多核机器下会默认开启。
  parallel: require("os").cpus().length > 1,
  // PWA 插件的选项。
  // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli-plugin-pwa/README.md
  pwa: {},
  // 三方插件的选项
  pluginOptions: {},
  // 使用babel处理的依赖
  configureWebpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      assets: "@/assets",
      "sdc-webui": "@tencent/sdc-webui",
      "sdc-core": "@tencent/sdc-core",
      "sdc-theme": "@tencent/sdc-theme"
    };
    config.externals = {
      "oidc-client": "Oidc" // 配置使用CDN
    };

    config.plugins.push(
      // 生成refresh.html
      new HtmlWebpackPlugin({
        filename: "refresh.html",
        template: path.resolve(__dirname, "./public/refresh.html"),
        inject: false,
        VUE_APP_BASE_URL: process.env.VUE_APP_BASE_URL
      }),
      // 拷贝oidc-client
      new CopyWebpackPlugin([
        {
          from: path.resolve(
            __dirname,
            "./node_modules/oidc-client/dist/oidc-client.min.js"
          ),
          to: "assets/js/oidc-client.min.js"
        }
      ])
    );
  },
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete("prefetch");

+    config.when(process.env.NODE_ENV === "development", config => {
+      config
+        .plugin("optimize-css")
+        .use(require("@intervolga/optimize-cssnano-plugin"), [
+          {
+            sourceMap: true,
+            cssnanoOptions
+          }
+        ]);
+    });
  }
};

```



## 16、pc端项目直接修改全局滚动条导致下拉选择器底部显示滚动条，是设置的全局滚动条样式，只设置表格的就好了，只设置了height没有设置width，而且根据element-ui的源码，还需要改一下下面这个样式
```css
.el-table__body-wrapper::-webkit-scrollbar {
  width: 8px; /*滚动条宽度*/
  height: 8px; /*滚动条高度*/
}

.el-scrollbar__wrap > div {
  width: 92px !important; /*滚动条宽度*/
  height: 92px !important; /*滚动条高度*/
}
```

## 17、JSON.stringify()数据丢失的问题
### （1）undefined、函数以及symbol值的转换规则
- 这三者在非数组对象的属性值中会被忽略
```javascript
const a = JSON.stringify({
  name: 'aaa',
  des: undefined,
  key: Symbol('aaa'),
  fun() {
    console.log('aaa')
  }
})

console.log(a) // {"name":"aaa"}
```

- 在数组中时会被转换成 null
```javascript
const a = JSON.stringify([
  'aaa',
  undefined,
  Symbol('aaa'),
  function log() {
    console.log('aaa')
  }
])

console.log(a) // ["aaa",null,null,null]
```

- 被单独转换时，会返回 undefined
```javascript
const a = JSON.stringify(undefined)
const b = JSON.stringify(Symbol('aaa'))
const c = JSON.stringify(
  function log() {
    console.log('aaa')
  }
)

console.log(a, b, c) // undefined undefined undefined
```

### (2) 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值
```javascript
const a = JSON.stringify(new Number(0))
const b = JSON.stringify(new String('aaa'))
const c = JSON.stringify(new Boolean(false))

console.log(a, b, c) // 0 "aaa" false
```

### (3) 以symbol为属性键的属性会被忽略
```javascript
const a = JSON.stringify({
    [Symbol('aaa')]: 'aa'
})
console.log(a) // {}
```

### (4) NaN、Infinity 和 null 都会变成 null
```javascript
const a = JSON.stringify({
  a: NaN,
  b: Infinity,
  c: null
})
console.log(a) // {"a":null,"b":null,"c":null}
```

### (5) 如果有 toJSON() 方法，则将序列化该方法定义的值
```javascript
const a = JSON.stringify({
  a: NaN,
  b: Infinity,
  c: null,
  toJSON() {
    return 'tojson'
  }
})
console.log(a) // "tojson"
```

### (6) Date 日期会被当做字符串
Date 日期调用了 toJSON() 将其转换为了 string 字符串（同 Date.toISOString()），因此会被当做字符串处理
```javascript
const a = JSON.stringify({
  a: NaN,
  b: Infinity,
  c: null,
  date: new Date()
})
console.log(a) // {"a":null,"b":null,"c":null,"date":"2022-07-20T03:27:28.163Z"}
```

### (7) 无限循环对象会报错
```javascript
const a = {
  a: NaN,
  b: Infinity,
  c: null,
  date: new Date()
}
a.obj = a

console.log(JSON.stringify(a)) // Uncaught TypeError: Converting circular structure to JSON
```

### (8) 其他类型的对象仅会序列化可枚举的属性
包括 Map/Set/WeakMap/WeakSet
```javascript
const a = {}
Object.defineProperties(a, {
  name: {
    value: 123,
    enumerable: true
  },
  des: {
    value: 456,
    enumerable: false
  }
})

console.log(JSON.stringify(a)) // {"name":123}
```

### (9) BigInt会报错
```javascript
const a = BigInt(0)

console.log(JSON.stringify(a)) // Uncaught TypeError: Do not know how to serialize a BigInt
```


## 18、element-ui的table，使用fix配置，table会渲染两次


## 19、axios请求是否显示loading的setNoLoadingPath方案存在问题
```js
import Vue from 'vue'
import axios, { AxiosRequestConfig } from 'axios'
import store from '@/store'
import common from '@/assets/js/common'
import { MessageBox } from '@/assets/js/messagebox'
import Loading from '@/components/common/Common.Loading.vue'
import Mgr from '../../services/SecurityService'

axios.defaults.baseURL = process.env.type == 'dev-test' || process.env.type == 'dev' || process.env.type == 'dev-back' ? '/' : '/growthinfo/'
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"
const VueLoading = Vue.extend(Loading)
axios.install = install
axios.setNoLoadingPath = setNoLoadingPath
let self = null
const noLoadingPaths = []

function install(Vue) {
  Object.defineProperties(Vue.prototype, {
    $http: {
      get() {
        if (!self) {
          self = this
        }
        return axios
      }
    }
  })
}

function setNoLoadingPath(path) {
  if (noLoadingPaths.indexOf(path) < 0) {
    noLoadingPaths.push(path)
  }
}

axios.interceptors.request.use(function (request) {
  axios.defaults.withCredentials = true;
  if (request.method === 'get') {
    if (request.url.indexOf('?') < 0) {
      request.url += '?rand=' + new Date().getTime()
    } else {
      request.url += '&rand=' + new Date().getTime()
    }
    request.headers.timestamp = new Date().getTime().toString()
  } else {
    var timeStamp = new Date().getTime().toString()
    request.headers['assess-timestamp'] = timeStamp
    request.headers['Content-Type'] = "application/json"
  }
  if (window.userManager) {
    var user = new Mgr(window.userManager)
    let promisefresh = new Promise(function (resolve, reject) {
      getEncryptDataRequest(request).then(req => {
        user.getAcessToken2().then(
          acessToken => {
            req.headers['Authorization'] = 'Bearer ' + acessToken
            var noLoading = (noLoadingPaths.indexOf(req.url.split('?')[0].replace(axios.defaults.baseURL.substr(0, axios.defaults.baseURL.length - 1), '')) >= 0)
            if (noLoading) {
              resolve(req)
            } else {
              openLoadingBlock()
              resolve(req)
            }
          }, err => {
            console.log(err)
          })
      }, err => {
        console.log(err)
      })

    })
    return promisefresh
  } else {
    return new getEncryptDataRequest(request)
  }
  // return request
}, function (error) {
  return Promise.reject(error)
})
// axios.defaults.headers.common['Authorization'] = 'Bearer ' + 'acessToken'
const needProtect = process.env.type == 'prod' || process.env.type == 'back' ? true : false
axios.interceptors.response.use(function (res) {
  if (res.config.needProtect) {
    if (needProtect) {
      res.data = JSON.parse(common.aesDecrypt(res.data, res.config.aesKey));
    }
  }
  if (noLoadingPaths.indexOf(res.config.url.split('?')[0].replace(axios.defaults.baseURL.substr(0, axios.defaults.baseURL.length - 1), '')) >= 0) {
    return res
  }
  // if (store.state.userName != common.getUserName()) {
  //   store.dispatch('setUserByCookie')
  // }
  closeLoadingBlock()
  if (res.data && res.data.code && res.data.code !== 200) {
    let errorsMsg = "";
    if ( res.data.errorsMsg) {
      res.data.errorsMsg.forEach((ele) => {
        errorsMsg += `${window.ESOP_BackstagePrompt_MultiLanguage[ele] ? window.ESOP_BackstagePrompt_MultiLanguage[ele] : ele}
        `;
      });
    }
    let message = window.ESOP_BackstagePrompt_MultiLanguage[res.data.message] ? window.ESOP_BackstagePrompt_MultiLanguage[res.data.message] : res.data.message
    MessageBox.warn(
      message,
      errorsMsg,
      { boxWidth: 580 }
    );
  }
  // if (res.headers['x-data-protect'] == 1) {
  //   console.log(res, 999999999999999)
  // }

  return res
}, function (error) {
  closeLoadingBlock()
  let errorInfo = ''
  switch (error.response.status) {
    case 401:
      errorInfo =
        localStorage.lang == "cn"
          ? "未授权，请重新登录(401)"
          : "Sign In Required (401)";
      break;
    case 403:
      errorInfo =
        localStorage.lang == "cn"
          ? "抱歉，权限验证失败(403)"
          : "Access Denied(403)";
      break;
    case 404:
      errorInfo =
        localStorage.lang == "cn"
          ? "请求资源不存在(404)"
          : "Resource Not Found(404)";
      break;
    case 500:
      errorInfo =
        localStorage.lang == "cn"
          ? "服务器错误(500)"
          : "Internal Server Error (500)";
      break;
    case 504:
      errorInfo =
        localStorage.lang == "cn"
          ? "网关超时(504)"
          : "Gateway Timeout(504)";
      break;
    case 502:
      errorInfo =
        localStorage.lang == "cn" ? "网关错误(502)" : "Bad Gateway(502)";
      break;
    default:
      errorInfo =
        (localStorage.lang == "cn" ? "出错了" : "Error") +
        error.response.statusText;
  }
  if (noLoadingPaths.indexOf(error.response.config.url) >= 0) {
    console.log(error)
    return Promise.reject(errorInfo)
  }
  if (error.response.status === 401) { // 401跳转登录页
    if (!flag) {
      flag = true
      user.getAcessToken().then(
        acessToken => {
          //acessToken
        })
    }
  } else {
    let errMsg = ''
    if (error.response.data && error.response.data.errors) {
      errMsg = JSON.stringify(error.response.data.errors)
    }
    MessageBox.warn(errorInfo, errMsg)
  }
  return Promise.reject(errorInfo)
}
)

let flag = false
// 用于控制同时执行多个AJAX请求时，第一个执行时就打开遮罩，最后一个执行完才关闭遮罩
var loadingBlockCount = 0

var loading = null

function openLoadingBlock() {
  loadingBlockCount++
  if (loadingBlockCount == 1) {
    // 打开loading

    // 第一次调用
    if (!loading) {
      loading = new VueLoading()
      // 手动创建一个未挂载的实例
      loading.$mount()
      // 挂载
      document.querySelector('body').appendChild(loading.$el)
    }
    // 显示loading
    Vue.nextTick(() => {
      loading.show()
    })
  }
}

function closeLoadingBlock() {
  if (loadingBlockCount > 0) {
    loadingBlockCount--
  }
  if (loadingBlockCount == 0) {
    // 关闭loading
    if (!loading || !loading.isShow) {
      return
    }
    let header = axios.defaults.headers.common
    delete header['x-data-protect-key'];
    // delete header['Authorization'];
    loading.hide()
  }
}
/**
 * 获取加密请求
 * @param {AxiosRequestConfig} request
 */
function getEncryptDataRequest(request) {
  if (request.needProtect) {
    if (needProtect) {
      let encryptKey = "";
      let curTime = new Date().getTime();
      let keyC = common.genKey();
      request.aesKey = keyC;
      if (request.method !== "get" && request.data !== null) {
        request.data = common.aesEncrypt(
          JSON.stringify(request.data),
          request.aesKey
        );
      }
      // 添加x-data-protect-key
      return new Promise((resolve, reject) => {
        if (!window.expireTime || curTime > window.expireTime) {
          let url = "/api/mng/public/get_key";
          axios
            .get(url)
            .then(res => {
              window.modulus = res.data.modulus;
              window.exponent = res.data.exponent;
              window.expireTime = new Date(res.data.expireTime).getTime();
              encryptKey = common.rsaEncrypt(
                window.modulus,
                window.exponent,
                request.aesKey
              );
              request.headers.common["x-data-protect-key"] = encryptKey;
              resolve(request);
            })
            .catch(function (err) {
              return reject(err);
            });
        } else {
          encryptKey = common.rsaEncrypt(
            window.modulus,
            window.exponent,
            request.aesKey
          );
          request.headers.common["x-data-protect-key"] = encryptKey;
          resolve(request);
        }
      });
    } else {
      return new Promise((resolve) => resolve(request));
    }
  } else {
    return new Promise((resolve) => resolve(request));
  }
}
axios.sendByHead = function (params) {
  const obj = Object.assign({}, params)
  var instance = axios.create({
    baseURL: axios.defaults.baseURL,
    headers: {
      EventTrack: encodeURI(JSON.stringify(obj))
    }
  })
  instance.head('api/EventTrack', { method: 'head' })
}
export default { axios, install }

```
有些项目中采用了旧的方案，即用noLoadingPaths记录哪个接口不需要显示loading。但是会出现loading不消失的情况。

如果多个页面或组件（组件1，组件2）中用到同一个接口，组件的渲染顺序是组件1 -> 组件2。如果在组件2中设置该接口为不显示loading，会偶现loading不消失问题。

因为组件1首先调用了该接口，但是接口还没响应回来。组件2把该接口设置为了不显示loading。所以组件1调用的该接口执行了请求拦截器中的openLoadingBlock，却没有执行响应拦截器中的closeLoadingBlock。导致loading不会消失。


## 20、组件渲染前调用接口，显示loading，会是一片灰色，不好看，解决方案如下
动态的插入样式与移除样式

```js
/**
 * 由于获取子应用配置时，页面还未渲染，此时显示loading会出现灰色蒙层，因此动态的修改loading样式
 */
class HandleStyleSheet {
  constructor() {
    this.styleNode = null;
  }
  insert(content) {
    this.styleNode = document.createElement("style");
    this.styleNode.setAttribute("type", "text/css");
    this.styleNode.innerHTML = content;
    const headNode = document.querySelector("head");
    headNode.appendChild(this.styleNode);
  }
  remove() {
    const headNode = document.querySelector("head");
    headNode.removeChild(this.styleNode);
  }
}

// 请求前
const styleSheet = new HandleStyleSheet()
styleSheet.insert(`
  .sdc-loading .mask {
    background-color: #fff !important;
  }
  .sdc-loading .mask .text {
    color: #000 !important;
  }
`)

// 请求后
styleSheet.remove()
```


## 21、乾坤框架需要注意的问题
(1) 注册子应用的activeRule要和子应用的路由的base一致
https://qiankun.umijs.org/zh/guide/tutorial#vue-%E5%BE%AE%E5%BA%94%E7%94%A8

(2) entry,activeRule,url,等参数的配置规则总结
一,entry :'http://localhost:8080/app1'
含义:是子应用的真实访问路径
路径最后面的 / 不可省略，否则 publicPath 会设置错误
例如子项的访问路径是 http://localhost:8080/app1,那么 entry 就是 http://localhost:8080/app1/
二,activeRule :'/name/' 
含义:是被激活的子应用的路由
当配置为字符串时会直接跟 url 中的路径部分做前缀匹配，匹配成功表明当前应用会被激活
1,不能和微应用的真实访问路径(entry)一样，否则在主应用页面刷新会直接变成微应用页面
2,同一个子应用,不同路由的activeRule 不能相同(针对sim这个项目的)
3,一个子应用应该只有一个activeRule ,而且跟菜单不是对等关系的不用每个菜单都有activeRule ,目前项目是之前的设计每一个菜单都有activeRule,其实可以更简单
三,url :'/name/router'|| null  ( null时没有跳转功能,一般为菜单的顶级菜单)
含义:是跳转的路由地址 
例如本次 配置的 (/sim/simRouter)
四,其他补充
name是对应子应用的打包name[图片]qiankun文档参考https://qiankun.umijs.org/zh/api#registermicroappsapps-lifecycles

(3) 如果多个activeRules对应同一个entry，entry需要完全一致才不会多次拉取entry。
例如 '//localhost:8081/' 与 '//localhost:8081' 最后差一个斜杠，也会被判断为entry不一样，而重新请求localhost:8081


## 22、乾坤子应用，希望可以请求子应用自己的devServer。但是目前会有问题。

具体代码记录在 D:\备份\模板项目\pc\乾坤微前端下，子应用请求自己的devServer的代理出现的跨域问题

(1) 问题一：请求非mock数据接口
原因分析：因为是跨域请求，会发送一个option请求。option请求会返回404，所以需要在devServer里面对option请求做一个特殊处理，详细可以查看https://github.com/umijs/qiankun/issues/1040
```diff
devServer: {
  // 代理api服务
  proxy: {
    "/api/*": {
      target: "XXX",
      pathRewrite: { "^/api/": "/api/" },
      changeOrigin: true,
      secure: false,
+     bypass: function(req, res) {
+       if (req.method === "OPTIONS") {
+         res.statusCode = 204;
+         // 根据文档，bypass 只能返回 null, undefined, false, path, 但是 null 和 undefined 会继续走 proxy, false 会直接返回 404，path 感觉又和我的需求不符, 最后试了直接返回 a, 既返回了 204，又不会接着走 proxy，完美解决了这个问题
+         return "a"; // <----  这个a我也不知道干嘛的
+       }
+     }
    }
  }
},
```

(1) 问题一：请求mock数据接口

需要在`/mock/mock-server.js`，中增加以下配置
```diff
// for mock server
const responseFake = (url, type, respond) => {
  return {
    url: new RegExp(url),
    type: type || "get",
    response(req, res) {
      console.log("request invoke:" + req.path);
+     res.header("Access-Control-Allow-Origin", "*")
+     res.header("Access-Control-Allow-Methods", "*")
+     res.header("Access-Control-Allow-Headers", "*")
      res.json(
        Mock.mock(respond instanceof Function ? respond(req, res) : respond)
      );
    }
  };
};

```

## 23、乾坤框架下，loose模式下。从子项目页面跳转到主项目自身的页面时，主项目页面的css未加载

问题：首先进入了子应用页面，然后再跳到主应用页面。比如404页面，404页面样式会出现丢失情况。前提是404页面以路由懒加载的方式引入

详情问题可查看 [从子项目页面跳转到主项目自身的页面时，主项目页面的css未加载](https://github.com/umijs/qiankun/issues/578)

尝试了一下，以下方案应该是有效
```js
const childRoute = ['/app-vue-hash','/app-vue-history'];
const isChildRoute = path => childRoute.some(item => path.startsWith(item))
const rawAppendChild = HTMLHeadElement.prototype.appendChild;
const rawAddEventListener = window.addEventListener;
router.beforeEach((to, from, next) => {
  // 从子项目跳转到主项目
  if(isChildRoute(from.path) && !isChildRoute(to.path)){
    HTMLHeadElement.prototype.appendChild = rawAppendChild;
    window.addEventListener = rawAddEventListener;
  }
  next();
});
```


## 24、safari浏览器正则兼容性问题，导致整个页面都是空白状态

报错：SyntaxError: Invalid regular expression: invalid group specifier name

原因：safari浏览器不兼容正则表达式-零宽断言（?=,?<=,?!,?<!）

在使用正则表达式时，有时我们需要捕获的内容前后必须是特定内容，但又不捕获这些特定内容的时候，零宽断言就起到作用了

解决方法：
（1）1、不再使用零宽断言即可

（2）2、使用new RegExp


## 25、项目样式重复，出现两份样式，一份是style scoped生效的，一份是style scoped不生效的

原因是下面的img标签使用了require()

```css
<img
  v-if="item.img"
  :src="require('@/' + item.img.src)"
  alt=""
  style="width: 120px"
/>
```


## 26、项目node版面限制

1. npm

(1)npm下需要增加`.npmrc`文件

```
// .npmrc
engine-strict = true
```

(2)`package.json`增加`engines`配置

```json
{
  "engines": {
    "node": "14.x"
  },
}
```

问题：
node版本校验不是在最前置，也就是说可能在一些node版本导致的报错后面才进行node版本检查


## 27、webpack 3.x 项目，需要配置prefetch。需要使用 preload-webpack-plugin

注意：webpack 3.x 需要使用 preload-webpack-plugin@2.x的版本。preload-webpack-plugin@3.x只支持 webpack 4.x

```js
// webpack.config.js
const PreloadWebpackPlugin = require('preload-webpack-plugin');

module.exports = {
  plugin: [
    new PreloadWebpackPlugin({
      rel: 'prefetch',
      include: ["AgreementConfirmInfo"]
    })
  ]
}

```

## 28、特殊激励PC端中，使用 /* webpackChunkName: "testtest" */ 魔法注释不生效问题

```js
// Exit.AcceptPopup.vue

const AgreementConfirmInfo = () => ({
  // 异步加载
  component: import(/* webpackChunkName: "testtest" */ "./Exit.AgreementConfirmInfo.vue"),
});

```

```js
// SlotLoader.vue

() => import(/* webpackChunkName: "[request]" */`@/views/${this.getSlotid(this.slotid)}`)

() => import(/* webpackChunkName: "[request]" */`@/components/${this.getSlotid(this.slotid)}`

```

是因为 `SlotLoader.vue` 中使用了动态的引入路径（`@/views/${this.getSlotid(this.slotid)}`）

导致`webpack`把该目录下的所有组件到打包了，并且使用了 `/* webpackChunkName: "[request]" */` 命名chunkName

即 `Exit.AgreementConfirmInfo.vue` 组件已经 `SlotLoader.vue` 组件 引用 打包了

导致在其他地方（`Exit.AcceptPopup.vue`）再引用 `Exit.AgreementConfirmInfo.vue` 组件（使用`/* webpackChunkName: "testtest" */`）就失效了。

## 29、git从某一提交切除分支

（1）git log ：找出想拉出分支的最后提交的commitid并复制

（2）git checkout commitid(值为第一步查到的commitid) -b branchName(本地新拉出分支的名称)

## 30、本地使用 npm link 开发组件库时出现的问题

webpack的resolve.symlink配置

https://zhuanlan.zhihu.com/p/372989254
