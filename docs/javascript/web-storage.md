# webStorage

## 目标

- 掌握 webStorage 使用流程
- 分析 webStorage 使用场景
- webStorage 典型问题演绎
- 针对不同场景的本地存储方案多维度对比
- 实战训练
- 经验总结

## webStorage

### 定义

Web Storage 是 HTML5 中新增的一项浏览器存储技术，用于在客户端本地存储数据而无需向服务器发送请求

### 本地存储的分类

![本地存储的分类](../.vuepress/public/images/javascript/web-storage/%E6%9C%AC%E5%9C%B0%E5%AD%98%E5%82%A8%E7%9A%84%E5%88%86%E7%B1%BB.png)


## cookie

Cookie 是一种存储在客户端计算机`硬盘上`的小型文本`文件`，用户保存用户在访问网站时的一些信息，主要通过 http `请求头`进行传输，来保持客户端于服务端的状态

### cookie 中包含那些信息

- 名称和值
- 过期时间（一般由服务端设置，前端设置不安全）
- 路径
  - （默认是根路径（/），只有该路径下或者子路径下才能访问到，例如 path 为 /web-storage，只有在 /web-storage 或者 /we-storage/xxx 才能访问到）
  - 如需请求是携带上该 cookie，请求的接口路径需要与 path 匹配或者是他的子路径，否则会有以下问题导致 cookie 不会携带过去
  ![path不匹配请求时没有携带cookie问题](../.vuepress/public/images/javascript/web-storage/path%E4%B8%8D%E5%8C%B9%E9%85%8D%E8%AF%B7%E6%B1%82%E6%97%B6%E6%B2%A1%E6%9C%89%E6%90%BA%E5%B8%A6cookie%E9%97%AE%E9%A2%98.png)
- 域名
- HttpOnly（只有在请求的时候可以访问到，前端通过 document.cookie 访问不到）

### cookie 的使用

![本地存储的分类](../.vuepress/public/images/javascript/web-storage/cookie%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.png)

### cookie 的创建

#### 服务端创建

1. 客户端提交数据案例

token 一般存到服务器的缓存里面，以 token 为 key，userId 为 value 的形式存储

- 客户端

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script>
    const xmlHttp = new XMLHttpRequest()
    xmlHttp.withCredentials = true;
    xmlHttp.onreadystatechange = (e) => {
      if (e.readState === 4) {
        console.log(xmlHttp.responseText);
      }
    }

    xmlHttp.open('POST', 'http://localhost:7777', true)
    xmlHttp.send(JSON.stringify({username: 'yusong', password: '88888'}))
  </script>
</body>
</html>

```

- 服务端

```js
const http = require('http')

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081')
  res.setHeader('Access-Control-Allow-Header', 'Content-Type')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'POST') {
    let postData = ''

    req.on('data', (chunk) => {
      postData += chunk
    })

    req.on('end', () => {
      console.log(postData)
      res.setHeader('Set-Cookie', [`token=new${Date().valueOf()};HttpOnly;path=/web-storage;`])
      res.end(`{
        code: 0,
        message: 'ok'
      }`)
    })

  } else {
    res.writeHead(200)
    res.end()
  }
})

server.listen('7777')

```

2. 三个注意点：

- 服务端中设置 `Access-Control-Allow-Origin` 为 `*`，会报一个另外一个跨域错误。`Access to XMLHttpRequest at 'http://localhost:7777/' from origin 'http://localhost:8081' has been blocked by CORS policy: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.`。

原因：这是因为客户端设置了`xmlHttp.withCredentials = true`，允许携带 cookie。服务端中设置`Access-Control-Allow-Origin` 为 `*` 时不能传递 cookie。因此**需要传递 cookie 则需要写具体的域名**

解决办法：如果要写*，则客户端不能设置 `xmlHttp.withCredentials = true`

- 如果客户端设置了`xmlHttp.withCredentials = true`，服务端必须设置 `res.setHeader('Access-Control-Allow-Credentials', 'true')`。否则会报`Access to XMLHttpRequest at 'http://localhost:7777/' from origin 'http://localhost:8081' has been blocked by CORS policy: The value of the 'Access-Control-Allow-Credentials' header in the response is '' which must be 'true' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.`

- 如果客户端`没有`设置`xmlHttp.withCredentials = true`，则服务端设置的 cookie 无法写入客户端（响应中可以看到设置 cookie 的响应头，但是无法写入客户端），`但不会报错`。即请求时不会携带 cookie，并且服务端也无法设置 cookie 到客户端。即使服务端配置了 `res.setHeader('Access-Control-Allow-Credentials', 'true')`


#### 客户端创建

```html
<script>
  document.cookie = 'token=1234'
</script>
```

1. 设置多个 cookie，连续写多个

```html
<script>
  document.cookie = 'token=1234'
  document.cookie = 'token1=12834'
</script>
```

2. cookie 实现原理

```js
// 模拟磁盘
const disk = {}
const doc = {
  cookie: ""
}

Object.defineProperty(doc, 'cookie', {
  get() {
    let cookieStr = ''
    const diskKeys = Object.keys(disk)
    diskKeys.map((k, i) => {
      cookieStr += `${k}=${disk[k]}${i === diskKeys.length - 1 ? ''  : ';'}`
    })

    return cookieStr
  },
  set(cookieStr) {
    const pairs = cookieStr.split('=')
    disk[pairs[0]] = pairs[1]
  }
})

doc.cookie = 'token1=1234'
doc.cookie = 'token2=ha'
console.log(doc.cookie)

```


3. cookie 的写入磁盘是同步进行的

可通过以下代码进行验证

```html
<script>
  document.cookie = 'tokentest=1234'
  alert("卡住当前 tab 页面的主线程，然后到其他 tab 查看 cookie 是否落盘")
  document.cookie = 'token1=123456'
</script>
```

4. 清理 cookie，在设置 cookie 后面加上`Max-Age=-1`

```js
document.cookie = "token1='';Max-Age=-1"
```

> 注意点：设置了 HttpOnly 的客户端无法清除

#### 注意问题

1. 安全性问题，避免在 cookie 中存储敏感信息，例如密码等

可通过设置过期时间来增加安全性

2. 域名问题，cookie 的域名要与要与当前页面的域名兼容

主域名兼容子域名

3. 过期时间，cookie 在过期之后将自动失效，默认会话期（即存在内存中）

4. 大小问题：通常最大值为 4KB 左右，不同浏览器实现的限制不同

5. 性能问题：每次请求都会携带 cookie 浪费带宽和性能


## Storage 类结构模型

sessionStorage，localStorage 来自于 Storage 类

![Storage的继承验证](../.vuepress/public/images/javascript/web-storage/Storage%E7%9A%84%E7%BB%A7%E6%89%BF%E9%AA%8C%E8%AF%81.png)

![Storage类模型](../.vuepress/public/images/javascript/web-storage/Storage%E7%B1%BB%E6%A8%A1%E5%9E%8B.png)

> sessionStorage 存储在内存中，localStorage 存储在磁盘中

### 实现原理

模拟实现

```html
<script>
const Store = function(storeType) {
  if (storeType === 'sessionStorage') {
    // 返回内存存储设备
  } else {
    // 返回磁盘存储设备
  }
}

let sessionStorage$1 = null

let Storage$1 = function(storageType) {
  // 单例模式
  if (sessionStorage$1) {
    throw new Error('Uncaught TypeError: Illegal constructor')
  }

  if (storageType === 'sessionStorage') {
    this.store = new Store('sessionStorage')
  } else if (storageType === 'localStorage') {
    this.store = new Store('localStorage')
  }
}

Storage$1.prototype.clear = function() {}
Storage$1.prototype.getItem = function() {}
Storage$1.prototype.setItem = function() {}
Storage$1.prototype.removeItem = function() {}

const createBrowserSessionStorage = () => {
  sessionStorage$1 = new Storage$1('sessionStorage') // 构建 sessionStorage
}
createBrowserSessionStorage() // 浏览器自身调用 

new Storage$1() // 报错

</script>
```

## sessionStorage

sessionStorage 用于将数据存储在用户的`会话`中，但是数据的生命周期受到用户会话的限制，即当用户`关闭浏览器窗口`或者`标签页`时，sessionStorage 中的数据也就自动清空了

### sessionStorage 的本质

1. 是 Storage 的实例

![Storage类模型](../.vuepress/public/images/javascript/web-storage/sessionStorage%E4%B8%BAStorage%E7%9A%84%E5%AE%9E%E4%BE%8B.png)

2. sessionStorage是由渲染引擎管理

![sessionStorage是由渲染引擎管理](../.vuepress/public/images/javascript/web-storage/sessionStorage%E6%98%AF%E7%94%B1%E6%B8%B2%E6%9F%93%E5%BC%95%E6%93%8E%E7%AE%A1%E7%90%86.png)

- 一个 tab 只有一个渲染引擎，但是 js 引擎则不一定，如果有 iframe 则会有两个 js 引擎实例，但是渲染引擎是共用的（因此 iframe 的性能差是会影响到主窗口的性能）。

- 由于 sessionStorage 在一个 tab 的多个 同源iframe 之间是共享的，因此需要放在渲染引擎中，如果放在 js 引擎中则不能打到共享的目的。

![一个渲染引擎对应一个sessionStorage](../.vuepress/public/images/javascript/web-storage/%E4%B8%80%E4%B8%AA%E6%B8%B2%E6%9F%93%E5%BC%95%E6%93%8E%E5%AF%B9%E5%BA%94%E4%B8%80%E4%B8%AAsessionStorage.png)

以下例子可以验证 iframe 与主窗口共享 sessionStorage

主窗口

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <iframe src="./iframe.html" id="iframe"></iframe>
</head>
<body>
  <script>
    iframe.onload = () => {
      sessionStorage.setItem('test', 'test' + new Date().getTime())
    }
  </script>
</body>
</html>
```

子窗口

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script>
    window.addEventListener('storage', (e) => {
      console.log(e);
    })
  </script>
</body>
</html>
```

- 不同的 tab 页间的 sessionStorage 是不共享的，因为一个 tab 只有一个渲染引擎

- js 引擎需要通过 webApi 访问渲染引擎，因为两个是不同线程，因此需要通过线程间通讯。例如访问 document 对象

通过下面的例子可以看出操作 sessionStorage 要比直接操作一个对象要慢

```html
<script>
  const store = {}
  const computeStore = () => {
    for (let i = 0; i < 100000; i++) {
      let key = 'num_' + i
      store[key] = i
    } 
  }

  const computeSessionStorage = () => { 
    for (let i = 0; i < 100000; i++) {
      let key = 'num_' + i
      let value = i
      sessionStorage.setItem(key, value)
    }
  }
</script>
```

![sessionStorage存储性能](../.vuepress/public/images/javascript/web-storage/sessionStorage%E5%AD%98%E5%82%A8%E6%80%A7%E8%83%BD.png)

### 如何对共享内存进行监控

使用 Proxy 代理 sessionStorage 可以实时对 sessionStorage 中数据的拦截、监控和控制，从而增强其功能

由于 sessionStorage 是`只读`的，因此不能重新覆盖。可通过以下代码验证

```js
window.sessionStorage = 1;
console.log(window.sessionStorage);
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script>
    const handler = {
      get(target, prop, receiver) {
        if (prop === 'setItem') {
          return target[prop] // 如果不绑定 this 只想为 sessionStorage，则会报以下错误
          // Uncaught TypeError: Illegal invocation
        }
      },
      set(target, prop, value) {
        target[prop] = value
        return true
      }
    }

    const proxySessionStorage = new Proxy(sessionStorage, handler)

    proxySessionStorage.age = 1
    proxySessionStorage.setItem('test11', '123') // Uncaught TypeError: Illegal invocation
  </script>
</body>
</html>

```

> 以上方法只能通过代理对象进行访问，如果要实现拦截 sessionStorage 的拦截，可以改写 setItem 方法。但是无法拦截掉 `sessionStorage.age = 1` 这种情况


### 应用场景

1. 表单数据存储

2. 登录状态管理

3. 页面状态保持

4. 数据共享

### sessionStorage 的限制

1. 存储空间的限制，通常在 5-10 MB

2. 生命周期限制，关闭 tab 时数据销毁

3. 作用域限制，只能在当前 tab 中共享


## localStorage

localStorage 是一种客户端存储数据的方案，可以将数据存储在浏览器本地，以便后续使用，具有`持久化`的特性

### localStorage 原理

![localStorage原理](../.vuepress/public/images/javascript/web-storage/localStorage%E5%8E%9F%E7%90%86.png)

由图中可以看到，因为 localStorage 是通过与浏览器的`文件系统线程`进行数据传递，然后文件系统读写磁盘进行存储，以域名作为key来区分读取里面的内容（TODO这一块要深入去看下，是通过域名作为文件夹？），因此同源网站可以在不同的 tab 间共享

### 事件机制

同源网站的不同 tab 打开，可以监听到 不同 tab 的 storage 的改变

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <button onclick="setLocalStorage()"> 设置 localStorage</button>
</head>
<body>
  <script>
    const setLocalStorage = () => {
      localStorage.setItem('test', new Date().getTime())
    }

    window.addEventListener('storage', (e) => {
      console.log(e);
    })
  </script>
</body>
</html>
```

> 注意：只会在`非当前窗口触发`。因为加入当前页面页触发的话，在事件里面去修改 localStorage 就会出现递归（TODO：因为这只是猜测）

### 注意是想

1. 存储容量限制，通常为 5-10 MB

2. 数据类型限制，通常为序列化后的字符串

3. 数据被存储到浏览器本地磁盘中持久化有效

4. 只允许同域名共享数据

5. storage 事件只能在不同 tab 中触发


## indexDB

### 概念

indexDB 是一种客户端`数据库`，它提供了一种`非关系型`、支持`事务`和`索引`的存储机制，能够以异步方式存储和检索大量数据

#### 事务

一组对数据的原子性操作，他们要要么一起完成，要么一起失败被称为事务，事务可以确保数据操作的正确性和可靠性

> 注意：事务是基于存储空间进行原子性控制的，数据的操作是基于存储空间进行的。TODO：没太理解透

### indexDB的存储原理

![indexDB工作原理](../.vuepress/public/images/javascript/web-storage/indexDB%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86.png)

> 注意：文件模块是通过域名为key来区分和读取数据的，因此有同源限制（TODO这一块要深入去看下，是通过域名作为文件夹？）

### indexDB 使用流程

![indexDB的使用流程](../.vuepress/public/images/javascript/web-storage/indexDB%E7%9A%84%E4%BD%BF%E7%94%A8%E6%B5%81%E7%A8%8B.png)

#### 打开数据库

```js
// 第一个参数为要打开的库的名称
// 第二个为版本号，作为数据库升级的标志
let request = indexedDB.open('db', 2);

```

##### 打开数据库监听事件

1. onsuccess（打开数据库成功）
2. onerror（打开数据库失败）
3. onupgradeneeded（确认升级数据库）

#### 创建对象存储空间

#### 开启事物并操作数据

##### 事务相关的监听事件

1. oncomplete（事务执行成功触发）

##### 数据操作相关的监听事件

1. onerror（数据操作失败时触发）
2. onsuccess（数据操作成功时触发）

#### 关闭数据库

### 案例

1. 打开数据库

```js
// 打开一个名为db的文件夹
const request = indexedDB.open('db', 2)
// 监听版本号升级
request.onupgradeneeded = (e) => {
  // 拿到文件夹句柄
  const db = e.target.result
  // 创建名为store的文件，给它添加一个唯一key用于区分不同文件用
  const objectStore = db.createObjectStore('store', { keyPath: 'id' })
  // 创建索引，TODO：需要继续深入理解索引
  objectStore.createIndex('name', 'name', { unique: false })
}
```

2. 插入数据

```js
request.onsuccess = (e) => {
  // 拿到文件夹句柄
  const db = e.target.result
  // 创建事务
  const tx = db.transaction(['store'], 'readwrite')
  // 创建事务实例，拿到文件句柄
  const store = tx.objectStore('store1')
  // 增加数据
  const insertRequest = store.add({ id: 1, name: 'yusong' })
  // 由于插入数据是异步的，因此需要监听插入是否成功
  insertRequest.onerror = () => {
    // 回滚事务
    tx.abort()
  }
  insertRequest.onsuccess = () => {
    console.log('插入成功')
  }
  insertRequest.oncomplete = () => {
    // 关闭数据库，因为如果不关闭则一直会占用线程。线程池的线程是有限的
    db.close()
  }
}
```

3. 查询数据

```js
request.onsuccess = (e) => {
  // 拿到db，也就是文件夹句柄
  const db = e.target.result
  // 创建事务
  const tx = db.transaction(['store'], 'readonly')
  // 创建事务实例，拿到文件句柄
  const store = tx.objectStore('store')
  // 获取索引
  const index = store.index('name')
  // 获取数据
  const getRequest = index.get('yusong')
  // const getRequest = store.get(1)

  // 监听数据获取
  getRequest.onsuccess = (e) => {
    console.log(e.target.result)
  }
}
```

4. 删除数据

```js
request.onsuccess = (e) => {
  const db = e.target.result
  const tx = db.transaction(['store'], 'readwrite')
  const store = tx.objectStore('store')
  store.delete(1)
  tx.oncomplete = () => {
    console.log('删除成功')
  }
}
```


### B+树索引原理

通过将数据按照树型接口存储，减少查找的次数

例如下图的数据，如果挨个遍历，最坏的情况则需要查找6次，如果是B+树，只需要进行两次查找即可

比如要查找`xza`，先看第一位，因为 `x 比 a 大`，因此走右边。然后看第二位，因为 `z 比 y 大`，因此还是走右边，最后找到id为6，通过id即可查到对应的值

![B+树索引原理](../.vuepress/public/images/javascript/web-storage/%E7%B4%A2%E5%BC%95%E5%8E%9F%E7%90%86.png)

> 树的层级越少，查找的路径越短，查找的速度越快


## 方案分析

![案例分析](../.vuepress/public/images/javascript/web-storage/%E6%A1%88%E4%BE%8B%E5%88%86%E6%9E%90.png)

假设token的过期时间为5分钟

1. 获取到token时，在sessionStorage存一个当前时间戳
2. 每次请求时，在拦截器中，用当前时间减去获取token时间，判断token是否小于4分钟（预留一分钟的误差时间），如果小于则刷新token（使用老的token换取一个新的token）
