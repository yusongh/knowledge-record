# CSS

## 1、margin塌陷
父子元素塌陷，就算父元素没有给margin，也会导致塌陷
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />

    <style>
      * {
        margin: 0;
        padding: 0;
      }
      body,
      html,
      .page {
        height: 100%;
        background-color: #fff;
      }

      .header {
        height: 60px;
        background-color: red;
      }

      .content {
        height: calc(100% - 60px);
        overflow-y: auto;
      }

      .container {
        height: 100%;
        background-color: blue;
      }

      .inner {
        background-color: green;
        margin: 50px 100px;
      }
    </style>
  </head>

  <div class="page">
    <div class="header"></div>
    <div class="content">
      <div class="container">
          <div class="inner">
            <p>678678678</p>
            <p>678678678</p>
          </div>
      </div>
    </div>
  </div>
</html>

```

## 2、子元素挤出滚动条的时候，不会把margin-bottom算到高度里面(没有找到根本问题所在，大概率是margin塌陷问题，因为用margin塌陷的方案都可以解决(可看第二个例子))
导致高度小于元素高度+margin-bottom，不能挤出滚动条
[DIV内部的最后一个元素的margin-bottom不算高度](https://blog.csdn.net/sd2131512/article/details/6568197)
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />

    <style>
      * {
        margin: 0;
        padding: 0;
      }
      body,
      html,
      .page {
        height: 100%;
        background-color: #fff;
        padding-top: 1px;
        box-sizing: border-box;
      }

      .container {
        height: 300px;
        background-color: red;
        margin-bottom: 100px;
        border-top: 1px;
        margin-top: 100px;
      }
    </style>
  </head>

  <div class="page">
    <div class="container">
      <div class="inner"></div>
    </div>
  </div>
</html>

```

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />

    <style>
      * {
        margin: 0;
        padding: 0;
      }
      body,
      html,
      .page {
        height: 100%;
        background-color: #fff;
        padding-top: 1px;
        box-sizing: border-box;
        
      }
      .abc {
        /* overflow: hidden; */
        /* padding: 1px */
        /* border: 1px solid green; */
        display: table-cell;
        width: 200px;
        /* float: left */
      }
      .container {
        height: 300px;
        background-color: red;
        margin-bottom: 100px;
        border-top: 1px;
        margin-top: 100px;
        width: 200px;
      }
      .bottom {
        clear: both;
      }
    </style>
  </head>

  <div class="page">
    <div class="abc">
      <div class="container">
        <div class="inner"></div>
      </div>
    </div>
    <div class="bottom"></div>
  </div>
</html>

```

## 3、使用了width: display: flex;fit-content; min-width: 60px，子元素为flex: 1，动态的给input加行内样式width，大于min-width则为添加的行内样式width的宽度，否则为min-width的宽度
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
            display: flex;
            width: fit-content;
            min-width: 60px;
        }
        .input {
            flex: 1;
        }
    </style>
</head>
<body>
    <div class="box">
        <input style="width: 0" class="input" type="text">
    </div>
</body>
</html>
```

## 4、flex两部分固定（不用给父元素写死高度），其中一个滚动布局

```css
.father {
  display: flex;
  flex-direction: column;
}

.top {
  flex-grow: 0;
  flex-shrink: 0;
}

.center {
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
  /* 或者 */
  overflow: scroll;
}

.bottom {
  flex-grow: 0;
  flex-shrink: 0;
}

```

