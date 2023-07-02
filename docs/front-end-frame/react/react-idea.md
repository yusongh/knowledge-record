# react 理念

## 理念分析
### 渲染原理

#### 先论事件循环

![事件循环](../../.vuepress/public/images/front-end-frame/react/react-idea/%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF.png)

注意点：

1. 网络模块会有一定的线程并发量，例如chrome并发量为6个。因此js里面发送请求，不是立马发出去，而是会放到网络请求队列后按照并发量依次请求

2. UI模块收集事件，是收集`捕获`到`目标`到`冒泡`这一过程涉及到的事件，按照顺序一并放到宏任务队列。例如事件冒泡就会去分析其父代元素是否有绑定事件

3. 在执行完一个宏任务，不是立马去清空微任务队列，而是先去定时器延时队列中check有没有过期的任务，如果有则推入宏任务队列

#### 再论渲染流程

![渲染流程](../../.vuepress/public/images/front-end-frame/react/react-idea/%E6%B8%B2%E6%9F%93%E6%B5%81%E7%A8%8B.png)

注意点：

1. 几何属性就是不涉及到宽高、位置的属性

2. paint 是收集指令的过程，收集好指令集后给到合成线程 TODO：还需要深入理解

3. 第三个不涉及到重排、重绘的属性会直接到合成步骤。例如旋转，会把图像矩阵旋转180度，例如修改透明度，只需要将矩阵rgba的最后一个数值修改即可

4. GPU加速就是图中的最后一种，跳过中间的环节，直接到合成


### react哲学

React 是用 javascript 构建快速响应的大型 web 应用

#### 制约快速响应的因素有哪些？

![快速响应的制约因素](../../.vuepress/public/images/front-end-frame/react/react-idea/%E5%BF%AB%E9%80%9F%E5%93%8D%E5%BA%94%E7%9A%84%E5%88%B6%E7%BA%A6%E5%9B%A0%E7%B4%A0.png)

> 并发与并行的区别
> 并行：两个CPU同时干两件事情
> 并发：一个CPU在两件事情间来回切换

#### 如何理解CPU瓶颈？

当执行大量计算的操作或者设备性能不足时，页面就会出现掉帧，从而出现卡顿现象

案例

```jsx
// App.jsx
import {useState} from 'react'

const App = () => {
  let [count, update] = useState(1)

  const change = () => {
    update(count + 10000)
  }

  return (
    <>
      <input type="text" onInput={change} />
      <ul>
        {
          Array.from({length: count}).fill(0).map((_, index) => {
            return <li key={index}>{index}</li>
          })
        }
      </ul>
    </>
  )
}

export default App
```

#### React 如何优化CPU瓶颈？

![react如何优化CPU瓶颈](../../.vuepress/public/images/front-end-frame/react/react-idea/react%E5%A6%82%E4%BD%95%E4%BC%98%E5%8C%96CPU%E7%93%B6%E9%A2%88.png)

1. 开启了并发渲染，并不是所有代码都是立马按照这个模式去运行。需要使用并发特性，在并发渲染模式下通过这些特性去开启并发渲染

2. 因为开启并发渲染会出现一些副作用
> 比如一个组件的渲染任务正在运行，另一个组件突然用户进行了交互输入了文字。由于用户的交互属于优先级更高的任务，因此会将低优先级的渲染任务打断，去执行响应用户交互的任务
> 加入执行渲染的组件执行了声明周期钩子，被打断了回来再执行渲染，如果不断的被打断则会出现统一声明周期钩子被多次执行的情况


#### 如何理解IO瓶颈？

将人机交互的研究成果整合到UI中，将用户对于`不同事件卡顿的感知程度`进行优先级排序

##### 如何理解副作用？

react 可以用以下表达式表示

UI = f(state)

例如 UI = f(state) 这个f函数执行完之后是为了影响UI，但是它有可能处理一些`与UI无关的逻辑`，即处理了一些该模块职责范围之外的东西

```jsx
import {useState, useEffect} from 'react'

const App = () => {
  let [count, update] = useState(1)

  useEffect(() => {
    document.title = count
  }, [count])

  const changeCount = () => {
    update(++count)
  }

  return (
    <>
      <button onClick={changeCount}>更新title</button>
    </>
  )
}

export default App
```

例如上面案例中的，useEffect修改了document.title


#### 通过案例理解react开启并发模式以及优先级处理

以下案例通过定时器模拟用户点击行为，useTransition则可以开启并发模式

正常的执行顺序下，应该是先显示一万条列表，然后再显示 `end`

由于用户的点击行为的响应优先级高于渲染，因此渲染会被打断，先响应点击事件

因此出现先显示 `end`，再显示一万条列表的现象

```jsx
// App.jsx
import {useState, useRef, useTransition, useEffect} from 'react'

const App = () => {
  const [isPedding, startTransition] = useTransition()
  const [tips, setTips] = useState('start')
  const [flag, setFlag] = useState(false)
  const [count] = useState(10000)
  const btnRef = useRef()

  useEffect(() => {
    startTransition(() => setFlag(true))
    setTimeout(() => {
      // 模拟用户的点击行为
      btnRef.current.click()
    }, 80);
  }, [])

  const change = () => {
    setTips('end')
  }

  return (
    <>
      <div>{ tips }</div>
      <button onClick={change} ref={btnRef}>显示tips为end</button>
      {
        flag && count.map((_, index) => <li>{index}</li>)
      }
    </>
  )
}

export default App

```

通过性能录制可以看出，定时器触发的点击事件插入列表渲染前面

![并发模式及事件优先级处理的性能录制](../../.vuepress/public/images/front-end-frame/react/react-idea/%E5%B9%B6%E5%8F%91%E6%A8%A1%E5%BC%8F%E5%8F%8A%E4%BA%8B%E4%BB%B6%E4%BC%98%E5%85%88%E7%BA%A7%E5%A4%84%E7%90%86%E7%9A%84%E6%80%A7%E8%83%BD%E5%BD%95%E5%88%B6.png)

#### 总结

1. 为不同的操作造成的"自变量变化"赋予不同的优先级

2. 同一优先级的任务批量进行更新

3. 如果更新正在进行，有更高的优先级任务插队，则中断当前更新，优先处理更高优先级的任务


### 底层架构的演进 TODO: 还需要深入理解

老架构

![老架构](../../.vuepress/public/images/front-end-frame/react/react-idea/%E8%80%81%E6%9E%B6%E6%9E%84.png)

新架构

![新架构](../../.vuepress/public/images/front-end-frame/react/react-idea/%E6%96%B0%E6%9E%B6%E6%9E%84.png)

注意点：

1. 虚线框起来的环节是可以被打断的，但是Renderer阶段是同步进行的，不能被打断

2. 被打断了是`从头开始`生成新的fiber树，因为高优先级任务可能存在修改树的操作，因此需要重新生成fiber树

## 高频面试题

1. react18 相比于 react15 以及以前的版本有哪些重大的改动？

增加了调度器、时间分片、新增hooks可以开启并发模式、引入fiber结构

2. 什么是 react 的并发模式？

任务可中断，两个任务来回切换

3. react 的时间分片主要解决了什么问题？

（1）解决CPU密集型任务。因为CPU密集型任务会占用主线程，UI线程无法得到响应，导致页面卡顿

（2）解决IO密集型任务。可中断，更高优先级的任务可插进来。更高的优先级任务之所以能插队，是基于分片实现的，因为它是一个单线程，执行停不下来，因此在各个分片中间有插入的时机。
