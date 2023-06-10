# 浏览器组成原理

## 目标问题

1. 浏览器有哪些主流内核？

2. 浏览器核心组成部分有哪些？

3. 浏览器是多进程应用程序还是单进程应用程序？有那些核心进程？

4. 那些操作会阻塞浏览器渲染？

5. 样式在head中引入和body中有什么区别？

6. 如何通过工具分析资源的加载，解析，渲染性能？

7. 资源加载是否有优先级？是怎么划分的？

## 浏览器核心组成

![浏览器组成](../.vuepress/public/images/javascript/principles-of-browser-composition/%E6%B5%8F%E8%A7%88%E5%99%A8%E7%BB%84%E6%88%90.png)

### 浏览器内核分类

- IE: Trident
- Firefox: Gecko
- Chrome: 以前是webkit，现在是Blink内核
- safari: webkit
- Opera: 以前是webkit，现在是Blink内核

## 整体架构

![浏览器整体架构](../.vuepress/public/images/javascript/principles-of-browser-composition/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%95%B4%E4%BD%93%E6%9E%B6%E6%9E%84.png)

## 工作原理
