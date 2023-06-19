# webWorkers

## 目标

1. 掌握进程与线程的工作原理
2. 掌握多线程工作原理
3. 掌握管道通讯机制
4. webWorker 能解决那些场景下的问题
5. 使用 webWorker 实现跨窗口通讯
6. webWorker 性能压测

## 进程VS线程

### 进程

![进程的例子](../.vuepress/public/images/javascript/webworker/%E8%BF%9B%E7%A8%8B%E4%BE%8B%E5%AD%90.png)

以上都是进程

进程具体包括了 代码、数据、堆栈等资源，每个进程都有自己独立的空间，相互之间不会干扰，彼此间可以通讯和协作。

### 线程

![线程的例子](../.vuepress/public/images/javascript/webworker/%E7%BA%BF%E7%A8%8B%E4%BE%8B%E5%AD%90.png)

线程是CPU执行指令的最小单位

### 区别

- 进程是CPU`分配资源`的基本单位
- 线程是CPU`执行程序`的基本单位

### 程序

程序是完成用户功能的指令集及数据集。指令集就是一行一行的代码，因为代码会被V8引擎加息为机器码给到CPU执行

### 单进程的组成结构

![进程的组成](../.vuepress/public/images/javascript/webworker/%E8%BF%9B%E7%A8%8B%E7%9A%84%E7%BB%84%E6%88%90.png)

#### 控制块：操作系统对进程管理所需的所有信息

进程控制信息
- 进程id
- 用户id
- 进程状态，就绪、运行、等待。
  - 满足运行条件的进程会从等待状态切换到就绪状态
- 调度参数，用于确定运行进程的条件
- 执行上下文信息，进程暂定的断点信息。
  - 保存在CPU对应的内存里，也就是系统的内存。
- 程序物理地址
- 消息队列指针
- 进程队列指针

#### 文件描述符

文件描述符记录着该进程依赖的文件句柄

### 进程的状态

![进程的状态流转](../.vuepress/public/images/javascript/webworker/%E8%BF%9B%E7%A8%8B%E7%9A%84%E7%8A%B6%E6%80%81%E6%B5%81%E8%BD%AC.png)

#### 进程队列

- 就绪队列：处于就绪态的进程按照链表方式连接在一起
- 等待队列：当某事件发生时，进入与该事件相关的就绪队列中
- 运行队列：从就绪队列中调度进程到运行队列中执行

### CPU执行队任务的整体流程

#### 单核CPU

![单核CPU执行任务整体流程](../.vuepress/public/images/javascript/webworker/%E5%8D%95%E6%A0%B8CPU%E6%89%A7%E8%A1%8C%E4%BB%BB%E5%8A%A1%E6%95%B4%E4%BD%93%E6%B5%81%E7%A8%8B.png)

#### 多核CPU

![多核CPU执行任务整体流程](../.vuepress/public/images/javascript/webworker/%E5%A4%9A%E6%A0%B8CPU%E6%89%A7%E8%A1%8C%E4%BB%BB%E5%8A%A1%E6%95%B4%E4%BD%93%E6%B5%81%E7%A8%8B.png)

TODO: 既然每个CPU都有自己对应的执行队列，为什么还需要内核调度器来分配任务？

### 多线程运行机制

#### 线程的数据结构

![线程的数据结构](../.vuepress/public/images/javascript/webworker/%E7%BA%BF%E7%A8%8B%E7%9A%84%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84.png)

#### 进程&线程的模型

进程 = 线程1 + 线程2 + ...

### CPU执行过程

![CPU执行任务过程](../.vuepress/public/images/javascript/webworker/CPU%E6%89%A7%E8%A1%8C%E4%BB%BB%E5%8A%A1%E8%BF%87%E7%A8%8B.png)

### 多线程的优势与劣势

#### 优势

可以充分利用CPU资源，将多个任务同时往前推进

#### 劣势

1. 后面的线程等待的时间会过长
2. 线程切换需要保存当前上下文信息及加载下一个线程的上下文的信息，需要一点程度的资源开销

### IPC通讯机制（进程间通讯）

![进程间通讯](../.vuepress/public/images/javascript/webworker/%E8%BF%9B%E7%A8%8B%E9%97%B4%E9%80%9A%E8%AE%AF.png)

通过线程1id来注册一个消息队列，然后线程2调用postMessage时可以拿到进程1的句柄，找到对应的消息队列，往消息队列中添加消息，待有机会执行的时候拿出来执行。

消息队列等待消息时处于等待状态，然后接收到消息转换为就绪状态，执行时就会调用onMessage的回调函数，将消息传给回调函数

## JS多线程编程

将需要大量计算的操作交给其他线程（worker）执行，通过线程间通讯将计算结果交给主线程。主线程执行任务量小的简单的任务，防止阻塞主线程的任务。

### HTML5 提供的多线程API

#### webWorker （非共享线程）



#### sharedWorker （共享线程）


### 计算1加到1亿的性能优化方案

#### 正常执行情况下

会出现UI无响应情况，即操作以下例子中的输入框无响应。因为主线程与UI线程是互斥的，该计算会占用主线程

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
  <div>
    <span>1加到1亿的结果是：</span>
    <span id="result"></span>
  </div>
  <button id="compute-btn">计算</button>
  <input type="text">

  <script>
    const resultDom = document.getElementById('result')
    const computeBtn = document.getElementById('compute-btn')

    const from = 1
    const to = 100000000
    let result = 0

    computeBtn.addEventListener('click', () => {
      for (let i = from; i <= to; i++) {
        result += i
      }

      resultDom.innerHTML = result
    })
  </script>
</body>
</html>
```


性能表现

![同步执行1加到1亿的性能](../.vuepress/public/images/javascript/webworker/%E5%90%8C%E6%AD%A5%E6%89%A7%E8%A1%8C1%E5%8A%A0%E5%88%B01%E4%BA%BF%E7%9A%84%E6%80%A7%E8%83%BD.png)

#### 分片

使用 `requestAnimationFrame` API，该API会在屏幕刷新的每一帧的dom渲染之前进行执行回调。

然后通过将计算拆解成一个个小任务，在`requestAnimationFrame`回调中执行执行小任务，这样 UI 线程在每一个任务之间就有时间执行 UI 渲染，使得页面不会出现卡顿

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
  <div>
    <span>1加到1亿的结果是：</span>
    <span id="result"></span>
  </div>
  <button id="compute-btn">计算</button>
  <input type="text">

  <script>
    const resultDom = document.getElementById('result')
    const computeBtn = document.getElementById('compute-btn')

    const from = 0
    const to = 100000000
    let result = 0
    const tasks = []
    const sliceLimit = 1000000

    computeBtn.addEventListener('click', () => {
      let taskIndex = 0
      const compute = () => {
        if (taskIndex === tasks.length) {
          resultDom.innerHTML = result
          return
        }
        requestAnimationFrame(() => {
          const task = tasks[taskIndex]
          for (let i = task.from; i <= task.to; i++) {
           result += i
          }
          taskIndex++ 
          compute()
        })

      }
      
      compute()
    })

    // 将任务拆解
    const handleTask = () => {
      for (let i = from; i < to; i+= sliceLimit) {
        tasks.push({
          from: i,
          to: i + sliceLimit
        })
      }

      console.log('task', tasks)
    }

    handleTask()
  </script>
</body>
</html>
```

性能表现

![分片执行1加到1亿的性能1](../.vuepress/public/images/javascript/webworker/%E5%88%86%E7%89%87%E6%89%A7%E8%A1%8C1%E5%8A%A0%E5%88%B01%E4%BA%BF%E7%9A%84%E6%80%A7%E8%83%BD1.png)

![分片执行1加到1亿的性能2](../.vuepress/public/images/javascript/webworker/%E5%88%86%E7%89%87%E6%89%A7%E8%A1%8C1%E5%8A%A0%E5%88%B01%E4%BA%BF%E7%9A%84%E6%80%A7%E8%83%BD2.png)


### webWorkers

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
  <div>
    <span>1加到1亿的结果是：</span>
    <span id="result"></span>
  </div>
  <button id="compute-btn">计算</button>
  <input type="text">

  <script>
    const resultDom = document.getElementById('result')
    const computeBtn = document.getElementById('compute-btn')

    const from = 0
    const to = 100000000
    let result = 0
    const workerPool = []
    const workerCount = 1

    // 创建 worker
    const createWorker = () => {
      const n = to / workerCount
      for (let i = 0; i < workerCount; i++) {
        workerPool.push({
          worker: new Worker('./webWorker.js'),
          from: i * n,
          to: (i + 1) * n
        })
      }
    }

    createWorker()

    computeBtn.addEventListener('click', () => {
      let addCount = 0
      for (let i = 0; i < workerPool.length; i++) {
        const item = workerPool[i]
        item.worker.postMessage({
          to: item.to,
          from: item.from
        })

        item.worker.addEventListener('message', (e) => {
          const data = e.data
          result += data.result
          addCount++
          if (addCount === workerPool.length) {
            resultDom.innerHTML = result
          }
        })
      }
    })

    
  </script>
</body>
</html>

```

```js
// webWorker.js
addEventListener('message', e => {
    const data = e.data
    
    let result = 0
    for (let i = data.from; i <= data.to; i++) {
        result += i
    }
    
    postMessage({
        result: result
    })
})
```

#### 问题：为什么一个 worker 计算会比在主线程中快很多？

因为 worker 的线程，`CPU` 与`内存`之间的传输速率高很多，即内存的带宽大很多。

这是由于 webWorker 的特性决定的，因为它被设计出来就是为了解决大数据量计算的，因为给它分配的内存的带宽就大一些。

- 主线程

![主线程的CPU与内存传输速率](../.vuepress/public/images/javascript/webworker/%E4%B8%BB%E7%BA%BF%E7%A8%8B%E7%9A%84CPU%E4%B8%8E%E5%86%85%E5%AD%98%E4%BC%A0%E8%BE%93%E9%80%9F%E7%8E%87.png)

- worker 子线程

![worker线程的CPU与内存的传输速率](../.vuepress/public/images/javascript/webworker/worker%E7%BA%BF%E7%A8%8B%E7%9A%84CPU%E4%B8%8E%E5%86%85%E5%AD%98%E7%9A%84%E4%BC%A0%E8%BE%93%E9%80%9F%E7%8E%87.png)

#### 如何终止一个 webWorker？

可以使用 Worker.terminate() 方法终止 webWorker 进程，当需要重新启动线程时，只能创建一个新的 webWorker 实例来代替之前的线程

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
  <button id="stop">停止</button>

  <script>
    const stopDom = document.getElementById('stop')

    const worker = new Worker('./webWorker.js')

    worker.postMessage('hello')

    stopDom.addEventListener('click', () => {
      worker.terminate()
      worker.postMessage('haha')
    })
  </script>
</body>
</html>
```

```js
// webWorker.js
addEventListener('message', e => {
    console.log(e.data)
})
```

#### 为什么子线程及时收到终止消息无法立即停止？

主要原因是：js 的线程特性决定的，一但子线程处于运行阶段是无法立即终止的，直到线程上的主要任务执行完才能被真正终止。就比如一段 js 代码运行，是没有方法终端这段 js 代码执行的

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
  <button id="stop">停止</button>

  <script>
    const stopDom = document.getElementById('stop')

    const worker = new Worker('./webWorker.js')

    worker.postMessage('hello')

    stopDom.addEventListener('click', () => {
      worker.terminate()
      worker.postMessage('haha')
    })
  </script>
</body>
</html>
```

```js
addEventListener('message', e => {
  const start = performance.now()
  console.log('start', start);
  while(performance.now() - start < 1000) {
    console.log('test')
  }
  console.log(e.data)
})
```

#### 如何模拟子线程的暂停和继续？

![模拟子线程的暂停与继续](../.vuepress/public/images/javascript/webworker/%E6%A8%A1%E6%8B%9F%E5%AD%90%E7%BA%BF%E7%A8%8B%E7%9A%84%E6%9A%82%E5%81%9C%E4%B8%8E%E7%BB%A7%E7%BB%AD.png)

#### worker 中的 this

不是 window，因为子线程不能访问 dom，没有与 dom 相关的东西

也可以通过 self 访问

![子线程中的this](../.vuepress/public/images/javascript/webworker/%E5%AD%90%E7%BA%BF%E7%A8%8B%E4%B8%AD%E7%9A%84this.png)

#### 异常处理

1. 在 webWorker 内部，可以使用 onerror 事件处理程序来捕获运行时错误并将其传递给主线程

在主线程中注册 error 事件即可捕获到 worker 子线程的错误

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
    const worker = new Worker('./webWorker.js')
    
    // 在主线程中注册 error 事件即可捕获到 worker 子线程的错误
    window.addEventListener('error', e => {
      console.log(e)
    })

    worker.postMessage('error')
  </script>
</body>
</html>

```

```js
// webWorker.js
addEventListener('message', e => {
  console.log(x)
})
```


#### webWorker 如何导入脚本

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
    const worker = new Worker('./webWorker.js')

    worker.postMessage("test")
  </script>
</body>
</html>
```

```js
// webWorker.js
const importFn = () => {
  importScripts("./other.js")
}

addEventListener('message', e => {
  importFn()
  console.log(a)
})
```

```js
// other.js
const a = 1
```

1. 官方提供了 `importScripts()` 方法
由于子线程无法访问 `document` 对象，所以无法通过 `<script>` 标签加载 js 文件，因此必须使用 `importScripts` 函数进行导入操作，注意 `跨域`

2. `importScripts()` 是在子线程的全局作用域下执行的，相当于使用 `window.eval()` 执行代码

3. 注意点

- importScripts 导入脚本是由 webWorker 发起的网络请求
- 脚本请求是同步进行的，一旦加载过慢会导致子线程阻塞
- 脚本加载完成后，子线程底层 js 解析器会在当前全局作用于调用 eval 执行脚本


### 跨窗口的 sharedWorker

```html
<!-- client1 -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <button onclick="send()"> 发送消息</button>

  <script>
    const userInfo = {
      userId: 1,
      userName: '张三'
    }
    const sw = new SharedWorker("./shared-worker.js")
    const port = sw.port

    port.postMessage({
      type: 'connect',
      userId: userInfo.userId,
      userName: userInfo.userName
    })
    
    // 一定要使用 onmessage
    port.onmessage = (e) => {
      console.log(e.data)
    } 
    
    const send = () => {
      port.postMessage({
        type: 'time',
        userId: userInfo.userId,
        message: '几点上课？'
      })
    }
  </script>
</body>
</html>
```

```html
<!-- client2 -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <button onclick="send()"> 发送消息</button>

  <script>
    const userInfo = {
      userId: 2,
      userName: '王五'
    }
    const sw = new SharedWorker("./shared-worker.js")
    const port = sw.port

    port.postMessage({
      type: 'connect',
      userId: userInfo.userId,
      userName: userInfo.userName
    })
    
    // 一定要使用 onmessage
    port.onmessage = (e) => {
      console.log(e.data)
    } 
    
    const send = () => {
      port.postMessage({
        type: 'time',
        userId: userInfo.userId,
        message: '几点上课？'
      })
    }
  </script>
</body>
</html>
```

```js
// shared-worker.js
const clientPool = {}

addEventListener('connect', (e) => {
  const client = e.ports[0]

  // 广播
  const boardcast = (event) => {
    Object.keys(clientPool).map((userId) => {
      const clientObj = clientPool[userId]
      console.log(clientObj.client);
      clientObj.client.postMessage(`${event.data.userName}上线啦！`) 
    })
  }

  // 必须使用 onmessage 监听，不能用 addEventListener
  client.onmessage = (e) => {
    const data = e.data

    if (data.type === 'connect') {
      clientPool[data.userId] = {
        userName: data.userName,
        client: client
      }

      boardcast(e)
    }

    if (data.type === 'time') {
      const clientObj = clientPool[data.userId]
      clientObj.client.postMessage(`${clientObj.userName}: 8点上课！`) 
    } 
  }
})
```

#### sharedWorker 定义

sharedWorker 本质上是一个`线程`，可以在后台运行，并与多个客户端窗口进行通讯

**是单例模式，在浏览器的生命周期中一有一个**

#### 工作原理

1. sharedWorker -> 客户端消息通讯过程

![sharedWorker往客户端通讯过程原理](../.vuepress/public/images/javascript/webworker/sharedWorker%E5%BE%80%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%80%9A%E8%AE%AF%E8%BF%87%E7%A8%8B%E5%8E%9F%E7%90%86.png)


2. 客户端 -> sharedWorker通讯消息过程

![客户端往sharedWorker通讯消息](../.vuepress/public/images/javascript/webworker/%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%BE%80sharedWorker%E9%80%9A%E8%AE%AF%E6%B6%88%E6%81%AF.png)


#### 如何调试

chrome://inspect/#workers


#### 注意事项

- 浏览器兼容性，并非所有浏览器都支持，需要判断

- 加载 sharedWorker 脚本有跨域限制

- sharedWorker 单例，在多个页面中共享


### worker 传递的是 `消息的拷贝`

可通过传递一个带有方法的对象，会报克隆错误，说明传递过去会进行`拷贝`，当然也可以进行相等判断来验证
