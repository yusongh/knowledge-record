# 走进react

## react原理全景图

![react原理全景图](../../.vuepress/public/images/front-end-frame/react/entering-react/react%E5%8E%9F%E7%90%86%E5%85%A8%E6%99%AF%E5%9B%BE.png)

### 事件优先级

连续性事件比非联系性事件优先级高

1. 连续性事件

例如滚动事件

2. 非连续性事件

例如点击事件

### update 与 task 不是一一对应的关系

因为update可以被多次调用，最终同一优先级的update会被合并为一个task，通过将多个update进行计算而合并成一个task

### task队列是按照小顶堆的算法排序的 TODO

### 构建新的fiber树过程

首先从当前节点递归往上找到根节点，再从根节点网上构建新的fiber树

#### 问题：diff过程中，为什么需要从根节点从新构建一遍完整的树，而不是直接对比发生改变的节点

原因分析：只有重新完整的构建一遍新树，才能保证数据的正确性。例如通过状态管理工具（redux、mobx）改变了数据，然后有兄弟节点依赖了，如果不重新构建新树，该兄弟节点是不知道全局状态是否发生变化了的

与vue不同，vue数据为响应式，因此可以进行依赖收集，因此可以兄弟节点可以监听到全局状态数据发生了改变，换句话说就是该全局状态是知道哪些组件使用到了的

### beginWork

找差异

### completeWork

记录差异

### 时间分片发生在 react-reconcile 阶段

## 熟悉react

![熟悉react](../../.vuepress/public/images/front-end-frame/react/entering-react/%E7%86%9F%E6%82%89react.png)

### npx create-react-app

npx：会去`环境变量`中查找当前是否有该命令，如果有则执行，如果没有就会下载后并执行

### JavaScript 库

摘至react官方文档：React 是一个用于构建用户界面的 JavaScript 库

1. 框架 VS 库

框架是处理控制前端开发整个生命周期，因此通过一个框架即可搭建一个完整的前端开发项目。框架会包含很多库，库的职责会相对单一

2. react只处理了视图层

视图层也就是UI层

## 官方文档的核心概念

![官方文档的核心概念](../../.vuepress/public/images/front-end-frame/react/entering-react/react%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5.png)

### Hello World

#### 文件查找规则

> 如果只写了目录，没有写具体的模块名，则会按照以下顺序进行查找
> - 首先查看与目录名相同的文件
> - 再查看index文件

### JSX

#### jsx打印的结果

![jsx打印](../../.vuepress/public/images/front-end-frame/react/entering-react/jsx%E6%89%93%E5%8D%B0.png)

#### 是否可以不引入react

18版本以后可以不手动引入，原因是因为`babel`编译的时候帮我们引入了

可以将以下代码放到[编译器](https://www.babeljs.cn/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=Q&debug=false&forceAllTransforms=false&modules=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=false&targets=&version=7.22.5&externalPlugins=&assumptions=%7B%7D)中查看

```js
const App = () => {
  return (
    <div>hello world</div>
  )
}

export default App
```

会得到以下代码

```js
import { jsx as _jsx } from "react/jsx-runtime";
const App = () => {
  return /*#__PURE__*/_jsx("div", {
    children: "hello world"
  });
};
export default App;
```

由上面代码可以看出，babel自动引入了`react/jsx-runtime`这个模块，该模块在以往版本中是在react内部的，在18版本中独立出来


#### jsx最终被编译的结果

如[是否可以不引入react](#是否可以不引入react)的例子所示，最终被编译成 `createElement` 函数

因此使用以下代码是等价的

```js
const App = () => {
  return (
    <div>hello world</div>
  )
}

export default App
```

```js
const App = () => {
  return _jsx("div", {children: "hello world"})
}

export default App
```

#### 真实dom与react之间的关联

![真实dom与react之间的关联](../../.vuepress/public/images/front-end-frame/react/entering-react/%E7%9C%9F%E5%AE%9Edom%E4%B8%8Ereact%E4%B9%8B%E9%97%B4%E7%9A%84%E5%85%B3%E8%81%94.png)

![真实dom与react之间的关联1](../../.vuepress/public/images/front-end-frame/react/entering-react/%E7%9C%9F%E5%AE%9Edom%E4%B8%8Ereact%E4%B9%8B%E9%97%B4%E7%9A%84%E5%85%B3%E8%81%941.png)

![真实dom与react之间的关联2](../../.vuepress/public/images/front-end-frame/react/entering-react/%E7%9C%9F%E5%AE%9Edom%E4%B8%8Ereact%E4%B9%8B%E9%97%B4%E7%9A%84%E5%85%B3%E8%81%942.png)

### 元素渲染

通过 `root.render` 方法渲染

#### 多次调用 `root.render` 方法会不会全部重新渲染

```js
// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

setInterval(() => {
  root.render(
    <App time={new Date().valueOf()} />
  );
}, 1000)

```

```js
// App.js
const App = (prop) => {
  return (
    <>
      <div>test</div>
      <div id="text">{prop.time}</div>
    </>
  )
}

export default App
```

由上面的例子可以看出，`<div>test</div>` 是不会被重新渲染的。因为react内部会进行虚拟dom的diff比对，只有发生改变的元素会被path到页面上。

### 组件和props

#### 类组件

##### 写`construct`时，必须使用`super`

super() 相当于 React.Component.call(this)

#### 函数组件


#### props

props 为`只读`的

react 是遵循单向数据流的，因此 `props` 从 父组件传递到子组件，子组件是无法修改的。如果可以修改，这将变得非常难预测

从另一个角度想，组件的本质就是一个函数，子组件相当于父组件的子函数，复函数调用子函数传参，是你希望参数被子函数修改的

### state和生命周期

#### setState 设置的值与之前的值相等时的两个问题

问题：

1. 还是会触发 `componentWillUpdate`与`componentDidUpdate`声明周期

2. 如果手动在控制台修改state对应的dom，setState也不会更新dom

原因分析：



#### 生命周期

```js
import React from 'react'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: 'yusong'
    }
  }
  // 即将挂载，组件初始化阶段
  componentWillMount() {
    console.log('componentWillMount')
  }
  // 挂载后，挂载阶段
  componentDidMount() {
    console.log('componentDidMount')
  }

  // 是否需要更新，交互阶段
  shouldComponentUpdate() {
    return true // 性能优化
  }

  // 即将更新，交互阶段
  componentWillUpdate() {
    console.log('componentWillUpdate')
  }
  // 更新后，交互阶段
  componentDidUpdate() {
    console.log('componentDidUpdate')
  }

  change() {
    this.setState({
      username: 'yusong1'
    })
  }

  render() {
    return <div onClick={this.change.bind(this)}>{this.state.username}</div>
  }
}
```

### 事件处理

#### 事件的 `this` 的指向

一般绑定事件需要 `bind(this)`，因为不绑定this，则该事件函数内部的this指向则`不是当前组件实例`

### 条件渲染

jsx就是js的扩展语法，因此可以直接使用js的条件语句来返回jsx，jsx就是一个表达式

### 列表 & key

key是react进行diff过程中的对比标识

#### 在一个列表的后面增加元素

```js
import {useState} from 'react'

const App = () => {
  const [list, updateList] = useState([1, 2, 3, 4])

  const ui = list.map((item) => {
    return <div>{item}</div>
  })

  const change = () => {
    updateList([...list, 9])
  }

  return <div onClick={change}>{ui}</div>
}

export default App
```

通过在控制台手动将2改成8，然后点击div，往最后填一个元素9，会发现8并没有被修改为2

![列表最后添加元素](../../.vuepress/public/images/front-end-frame/react/entering-react/%E5%88%97%E8%A1%A8%E6%9C%80%E5%90%8E%E6%B7%BB%E5%8A%A0%E5%85%83%E7%B4%A0.png)

原因：是因为改例子没有写key，默认是以index作为key，往后面添加元素，前面的元素的key没有发生改变

#### 在一个列表的前面增加元素

```js
import {useState} from 'react'

const App = () => {
  const [list, updateList] = useState([1, 2, 3, 4])

  const ui = list.map((item) => {
    return <div>{item}</div>
  })

  const change = () => {
    updateList([9, ...list])
  }

  return <div onClick={change}>{ui}</div>
}

export default App
```

通过在控制台手动将2改成8，然后点击div，往列表前面添加一个9，会发现8被修改为2了

![列表前面添加元素](../../.vuepress/public/images/front-end-frame/react/entering-react/%E5%BE%80%E5%88%97%E8%A1%A8%E5%89%8D%E9%9D%A2%E6%B7%BB%E5%8A%A0%E5%85%83%E7%B4%A0.png)

原因：是因为改例子没有写key，默认是以index作为key，往前面添加元素，后面的元素的key都发生改变了


### 表单

### 状态提升

### 组合和继承

### React 哲学

## 其他问题

### hooks的意义

增强函数式组件

1. 类组件是有状态的

类组件虽然最终也是被编译成一个函数，但是类组件会new一个实例，在函数执行完之后这个实例是不会被销毁的，因此可以保留状态

2. 函数式组件是无状态的

函数执行完，退栈后，函数内的局部变量是会被销毁的

3. 例子

  - useState

  useState 是用于函数式组件保存状态的，useState内部其实就是通过闭包来保存状态，使得多次执行 useState 返回的是保存的 state

