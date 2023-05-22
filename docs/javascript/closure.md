# 闭包



## 闭包的定义

当函数可以 `记住` 并 `访问` 所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行

## 闭包产生的条件

### `记住`，即使闭包函数能一直引用 当前的词法作用域，即需要 闭包函数 在 当前词法作用域之外执行，实现的方式有如下几种：
1. 通过将 闭包函数 return 到外部作用域进行访问
2. 通过将 当前作用域的 上下文的变量 赋值给外部作用域，达到在外部作用域可以访问的目的

### `访问`，根据 词法作用域的查找规则，闭包函数的作用域可以访问的到 外层词法作用域

```javascript
let leakObject = null
function test() {
  const originLeakObject = leakObject
  const unused = function() {
    // if (originLeakObject) {
    //   console.log(originLeakObject)
    // }
  }

  leakObject = {
    leakStr: new Array(1e7).join("*"),
    leakMethod() {
      
    }
  }
}

test()
leakObject.leakMethod()
test()
leakObject.leakMethod()

```

因此有了这两个条件，即会产生闭包。leakObject.leakMethod持有对test内作用域的引用，即为闭包

### `访问` 存在争议，是 `可以访问` 就产生闭包，还是 `访问着`（TODO）

## 使用浏览器工具查看内存使用情况

![浏览器工具查看内存情况](../.vuepress/public/images/javascript/closure/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B7%A5%E5%85%B7%E6%9F%A5%E7%9C%8B%E5%86%85%E5%AD%98%E6%83%85%E5%86%B5.png)

### 闭包与内存泄漏的关系

**这个是假设 `可以访问` 即产生闭包的情况下**

> 但是产生了闭包，不一定会产生内存泄漏

#### 只有满足 `记住` ，并 `访问着` 即会产生内存泄漏

```javascript
let leakObject = null
setInterval(function test() {
  const originLeakObject = leakObject
  const unused = function() {
    if (originLeakObject) {
      console.log(originLeakObject)
    }
  }

  leakObject = {
    leakStr: new Array(1e7).join("*"),
    leakMethod() {
      debugger
    }
  }
}, 10);

```

通过浏览器工具查看内存情况，随着时间的推移，内存使用一直加大

![同时满足记住并访问着产生内存泄漏](../.vuepress/public/images/javascript/closure/%E5%90%8C%E6%97%B6%E6%BB%A1%E8%B6%B3%E8%AE%B0%E4%BD%8F%E5%B9%B6%E8%AE%BF%E9%97%AE%E7%9D%80%E4%BA%A7%E7%94%9F%E5%86%85%E5%AD%98%E6%B3%84%E6%BC%8F.png)

#### 只有 `记住`，没有 `访问着`

```javascript
let leakObject = null
function test() {
  const originLeakObject = leakObject
  const unused = function() {
    // if (originLeakObject) {
    //   console.log(originLeakObject)
    // }
  }

  leakObject = {
    leakStr: new Array(1e7).join("*"),
    leakMethod() {
      debugger
    }
  }
}

test()
leakObject.leakMethod()
test()
leakObject.leakMethod()

```

在 debugger 处可以看到访问 `originLeakObject` 出现报错，说明 `originLeakObject` 在函数执行完即被销毁了

侧面说明只有 `记住` 没有 `访问着`，不会产生内存泄漏

也可通过下列例子，然后通过浏览器工具查看内存使用情况

```javascript
let leakObject = null
setInterval(function test() {
  const originLeakObject = leakObject
  const unused = function() {
    // if (originLeakObject) {
    //   console.log(originLeakObject)
    // }
  }

  leakObject = {
    leakStr: new Array(1e7).join("*"),
    leakMethod() {
      debugger
    }
  }
}, 100)

```

![只有访问着没有记住内存使用情况](../.vuepress/public/images/javascript/closure/%E5%8F%AA%E6%9C%89%E8%AE%BF%E9%97%AE%E7%9D%80%E6%B2%A1%E6%9C%89%E8%AE%B0%E4%BD%8F%E5%86%85%E5%AD%98%E4%BD%BF%E7%94%A8%E6%83%85%E5%86%B5.png)

#### 只有 `访问着`，没有 `记住`

```javascript
let leakObject = null
setInterval(function test() {
  const originLeakObject = leakObject
  const unused = function() {
    if (originLeakObject) {
      console.log(originLeakObject)
    }
  }

  leakObject = {
    leakStr: new Array(1e7).join("*"),
    // leakMethod() {
    //   debugger
    // }
  }
}, 100)

```

通过浏览器工具查看内存情况，随着时间的推移，内存使用基本无太大变化

![只有访问着没有记住](../.vuepress/public/images/javascript/closure/%E5%8F%AA%E6%9C%89%E8%AE%BF%E9%97%AE%E7%9D%80%E6%B2%A1%E6%9C%89%E8%AE%B0%E4%BD%8F.png)

![只有访问着没有记住内存使用情况](../.vuepress/public/images/javascript/closure/%E5%8F%AA%E6%9C%89%E8%AE%BF%E9%97%AE%E7%9D%80%E6%B2%A1%E6%9C%89%E8%AE%B0%E4%BD%8F%E5%86%85%E5%AD%98%E4%BD%BF%E7%94%A8%E6%83%85%E5%86%B5.png)


## 疑问

例子
```javascript
let leakObject = null
setInterval(function test() {
  const originLeakObject = leakObject
  const unused = function() {
    if (originLeakObject) {
      console.log(originLeakObject)
    }
  }

  leakObject = {
    leakStr: new Array(1e7).join("*"),
    leakMethod() {
      debugger
    }
  }
}, 100)

```

为什么`leakObject.leakMethod`对test函数的作用域 没有 上下文（保存变量的地方）的引用，词法阶段不能对该情况做处理？即发现没有任何引用，则执行完test函数则test作用域的上下文直接释放掉？
