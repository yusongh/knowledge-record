# 前端规范

## 命名相关规范

### 文件与文件夹

使用 kebab-case 命名规范。即全小写，单词间使用 - 连接

```javascript
// bad
myUtils
MyUtils

// good
my-utils
```

### 变量

使用驼峰命名法，即首字母小写，后面单词首字母大写

```javascript
// bad
const Obj = {}
const Testnumber = 1
const testnumber1 = 1

// good
const obj = {}
const testNumber = 1

```

### 常量

使用全大写，单词间使用 _ 连接

```javascript
// bad
const countnumber = 0

// good
const COUNT_NUMBER = 0

```

### 组件文件命名

使用 PascalCase，即每个单词首字母大写

```javascript
// bad
homePage.vue
homepage.vue
Homepage.vue

// good
HomePage.vue

```

### 组件引用时

使用 kebab-case，即全小写，单词之间用-连接

```vue
<template>
  // bad
  <HomePage></HomePage>

  // good
  <home-page></home-page>
</template>
```


## 路径引用规则

### 除当前目录外，都使用 `别名`
