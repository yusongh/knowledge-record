# html5 拖拽

## 目标

- 拖放发展史
- 认识浏览器绝对坐标系及相对坐标系
- html5拖放api详解
- 单文件拖放vs多文件拖放

## 认识拖放

拖放就是通过鼠标放在一个物体上，按住鼠标不放就可以把一个物体托动到另一个位置。

### 拖拽发展史

![拖拽发展史](../.vuepress/public/images/javascript/html5-drag/%E6%8B%96%E6%8B%BD%E5%8F%91%E5%B1%95%E5%8F%B2.png)

### 拖拽事件发生流程

![拖拽发展史](../.vuepress/public/images/javascript/html5-drag/%E6%8B%96%E6%8B%BD%E4%BA%8B%E4%BB%B6%E5%8F%91%E7%94%9F%E6%B5%81%E7%A8%8B.png)

#### 原生DOM事件拖放过程

## 拖放原理

### 浏览器坐标系

![浏览器坐标系](../.vuepress/public/images/javascript/html5-drag/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%9D%90%E6%A0%87%E7%B3%BB.png)

#### screenX, screenY

- screenX：以`显示器`左上角为原点的X轴坐标
- screenY：以`显示器`左上角为原点的Y轴坐标

#### clientX, clientY

- clientX：以浏览器`视口`左上角为原点的X轴坐标
- clientY：以浏览器`视口`左上角为原点的Y轴坐标

#### pageX, pageY

- pageX：以 `document 对象`（即文档窗口）左上角为原点的X轴坐标
- pageY：以 `document 对象`（即文档窗口）左上角为原点的Y轴坐标

> 注意点：需要把滚动条算进去，即需要算上已经滚动出去的部分

#### offsetX, offsetY

- offsetX：以 当前事件的目标对象的左上顶点 为原点的X轴坐标
- offsetY：以 当前事件的目标对象的左上顶点 为原点的Y轴坐标

#### layerX, layerY

- offsetX：最近的绝对定位的父元素（如果没有，则为 document 对象）左上顶角为原点的X坐标
- offsetY：最近的绝对定位的父元素（如果没有，则为 document 对象）左上顶角为原点的Y坐标

> 可通过浏览器的`层`功能查看分层

#### X，Y

- X：以浏览器左上角为原点的X轴坐标
- Y：以浏览器左上角为原点的Y轴坐标

> 与 `clientX、clientY` 一样，相当于简写

### 原生js实现拖拽效果

![原生js实现拖拽效果](../.vuepress/public/images/javascript/html5-drag/%E5%8E%9F%E7%94%9Fjs%E5%AE%9E%E7%8E%B0%E6%8B%96%E6%8B%BD%E6%95%88%E6%9E%9C.png)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .box {
      width: 100px;
      height: 100px;
      position: absolute;
      background-color: red;
    }
    .parent {
      position: relative;
      width: 300px;
      height: 300px;
      background-color: green;
    }
  </style>
</head>
<body>
  <div class="parent">
    <div class="box" id="box"></div>
  </div>

  <script>
    let x = 0
    let y = 0
    const box = document.getElementById("box")

    const onDragging = (e) => {
      box.style.left = (e.pageX - x) + 'px'
      box.style.top = (e.pageY - y) + 'px'
    }

    const onDragEnd = () => {
      document.removeEventListener("mousemove", onDragging) 
      document.removeEventListener("mouseup", onDragEnd)
    }

    const onDragStart = (e) => {
      x = e.pageX - e.target.offsetLeft 
      y = e.pageY - e.target.offsetTop

      document.addEventListener("mousemove", onDragging)
      document.addEventListener("mouseup", onDragEnd)
    }
    
    box.addEventListener("mousedown", onDragStart)
  </script>
</body>
</html>
```

#### 拖放性能录制

![原生js拖拽的性能录制](../.vuepress/public/images/javascript/html5-drag/%E5%8E%9F%E7%94%9Fjs%E6%8B%96%E6%8B%BD%E7%9A%84%E6%80%A7%E8%83%BD%E5%BD%95%E5%88%B6.png)

由上图可以看出，产生了多次的 `layout`， **原生js拖拽是比较耗性能的**，因此最好使用 `HTML5` 提供的原生拖拽能力

### HTML5拖拽

#### 默认拖拽

1. 默认可拖拽的元素

图像、链接默认可拖动，而其余的元素若想要被拖动，必须将 draggable 属性设置为 true

- 图片

```html
<html>
  <body>
    <img src="xxx" width="100px" />
  </body>
</html>
```

- 链接

2. 浏览器对于拖拽的默认行为表现

- dragover 事件的默认行为是 `阻止触发 drop 事件`

浏览器是默认行为是`阻止放置目标的任何响应`的，例如给一个div元素添加 `dragabble` 为 `true` ，但是拖动到目标元素时如果没有在 `dragover` 中`阻止默认行为`，是不会触发 `drop`。换句话说就是`dropover事件` 的默认行为 阻止触发 `drop` 的

- drop 事件的默认行为

  - 同一文档流中的默认行为为 `无任何默认行为表现`

  - 外部图片、文件

    - 图片与链接

    在用户松开鼠标完成拖放操作时，如果没有将元素拖到任何个放置目标中，则浏览器会在浏览器窗口中打开拖动元素表示的链接(如果有)

> 以上两种默认行为都可以通过，在放置目标中调用e.preventDefault()禁止此种行为

#### 拖拽过程

将博士装到笼子需要经过哪些步骤？

![将博士撞到笼子里的步骤](../.vuepress/public/images/javascript/html5-drag/%E5%B0%86%E5%8D%9A%E5%A3%AB%E6%92%9E%E5%88%B0%E7%AC%BC%E5%AD%90%E9%87%8C%E7%9A%84%E6%AD%A5%E9%AA%A4.png)

#### dragEvent（事件）

- 拖动源（被拖动的元素）
  - dragstart:  `鼠标点击元素并移动时`触发（可以理解为mousedown与mousemove事件的结合），并只会`触发一次`
  - drag: 拖动源被拖动的过程中`一直`被触发
  - dragend: `鼠标松开时`触发

- 目标元素（接收拖动源的元素）
  - dragenter: 当`拖动源正在拖拽`并`鼠标进入目标元素`时触发
  - drageover: 当`拖动源正在拖拽`并`在目标元素上时`时`一直`触发
  - dragleave: 当`拖动源正在拖拽`并`鼠标移出目标元素`时触发，注意当拖动源在目标元素上放开鼠标时也会触发
  - drop: 当拖动源在`目标元素上`并`松开鼠标`时触发

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .drag-block {
      width: 50px;
      height: 50px;
      background-color: red;
    }
    .target1,
    .target2 {
      width: 200px;
      height: 400px;
      background-color: green;
      margin: 10px;
      position: absolute;
      top: 200px;
    }
    .target1 {
      left: 50px;
    }
    .target2 {
      left: 300px;
    }
  </style>
</head>
<body>
  <div class="drag-block" draggable="true"></div>

  <div class="target1"></div>
  <div class="target2"></div>

  <script>
    const dragEle = document.querySelector(".drag-block")
    const target1Ele = document.querySelector(".target1")
    const target2Ele = document.querySelector(".target2")

    dragEle.addEventListener("dragstart", () => {
      console.log('dragstart')
    })
    dragEle.addEventListener("drag", () => {
      console.log('drag')
    })
    dragEle.addEventListener("dragend", () => {
      console.log('dragend')
    })

    target1Ele.addEventListener("dragenter", () => {
      console.log("dragenter")
    }) 
    target1Ele.addEventListener("dragover", () => {
      console.log("dragover")
    }) 
    target1Ele.addEventListener("dragleave", () => {
      console.log("dragleave")
    }) 

    target2Ele.addEventListener("dragover", e => {
      e.preventDefault()
    })
    target2Ele.addEventListener("drop", e => {
      console.log('drop')
      const cloneELe = dragEle.cloneNode()
      e.target.appendChild(cloneELe)
    })
  </script>
</body>
</html>
```

#### 文件拖拽

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    fieldset {
      width: 200px;
      height: 200px;
    } 
  </style>
</head>
<body>
  <fieldset>
    <legend>文件</legend>
  </fieldset> 

  <div id="status"></div>

  <script>
    const fieldset = document.querySelector("fieldset")
    const status = document.getElementById("status")
    fieldset.addEventListener('dragover', e => {
      e.preventDefault()
    })

    fieldset.addEventListener('drop', e => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      console.log('status', status);
      
      status.innerHTML = `
        名称：${file.name}
        类型：${file.type}
        大小：${file.size}
      ` 
    })
  </script>
</body>
</html>
```

#### dataTransfer 对象

1. 作用

主要的作用就是从被拖放元素向目标元素`传递元数据`

2. 属性与方法

- dataTransfer.setData(type, data) 设置元数据类型与元数据
- dataTransfer.getData(type) 通过元数据类型获取元数据

> type 参数及`MIME`类型，MIME 类型是一种标准化资源的类型格式，比如文本（text/plain）、图片（image/x）、文件（application/x）等，通过这种标准化格式，就可以即系出拖拽源的类型，方便后续的处理。

3. 接收的数据类型

- 字符串
- 二进制

4. 孪生属性

- effectAllowed: 只能用于指示那些类型的行为是被允许，在源上进行设置。指定它的值可以改变拖拽源拖动到目标元素上时`鼠标的指示图标`，可以设置以下的值：
  - copy：代表在目标元素上显示赋值效果
  - move：代表在目标元素上显示移动效果
  - link：代表在目标于是怒上显示链接跳转的效果
  - none：代表无法将数据放置到接收元素上

- dropEffect: 只能用于指示哪些类型的行为是推荐的，在目标上设置。需要`与拖动源 effectAllowed 保持一致或者不设置`

#### 拖放事件触发流程

![拖放事件触发流程](../.vuepress/public/images/javascript/html5-drag/%E6%8B%96%E6%94%BE%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91%E6%B5%81%E7%A8%8B.png)

#### 拖动源要完成目标放置需要满足哪些必要条件？

1. 拖动源需要把 dragabble 设置为 true
2. 拖动源在 dragstart 事件中
  - 设置 e.dataTransfer.effectAllowed
  - e.dataTransfer.setData() 放置数据
3. 目标在 dragover 事件中
  - 阻止默认行为，e.preventDefault()
  - 设置 e.dataTransfer.dropEffect 与 e.dataTransfer.effectAllowed 一致
4. 目标在 drop 事件中
  - e.dataTransfer.getData() 获取数据，获取数据的类型与设置的类型需要保持一致

![拖动源要完成目标放置需要满足哪些必要条件](../.vuepress/public/images/javascript/html5-drag/%E6%8B%96%E5%8A%A8%E6%94%BE%E7%BD%AE%E7%9A%84%E5%BF%85%E8%A6%81%E6%9D%A1%E4%BB%B6.png)

## 拖放实战

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    #box {
      width: 200px;
      height: 200px;
      border: 4px solid red;
      position: absolute;
      top: 200px;
      left: 200px;
    }
    #image {
      width: 50px;
    }
  </style>
</head>
<body>
  <img id="image" src="./image.png" />
  <div id="box"></div>

  <script>
    const imgEle = document.getElementById('image')
    const boxEle = document.getElementById('box')

    imgEle.addEventListener('dragstart', e => {
      e.dataTransfer.effectAllowed = 'copy'
      e.dataTransfer.setData('image/png', './image.png')
    })

    boxEle.addEventListener('dragover', e => {
      e.dataTransfer.dropEffect = 'copy'
      e.preventDefault()
    })
    boxEle.addEventListener('drop', e => {
      const url = e.dataTransfer.getData('image/png')
      const img = document.createElement('img')
      img.width = 50
      img.src = url
      
      e.target.appendChild(img)
    })
  </script>
</body>
</html>
```
