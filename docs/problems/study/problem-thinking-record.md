# 问题思考记录

## 1、ES6 中的 let 有块级作用域，那 ES5 是如何实现块级作用域的呢

利用自执行函数创建函数作用域，可通过babell编译let的实现来学习

https://www.cnblogs.com/liuyongjia/p/10623665.html

```javascript
function print (arr) {
    for (var i = 0; i < arr.length; i++) {
        (function (index) {
            setTimeout(() => {
                console.log(arr[index])
            }, 1000 * index);
        })(i);    
    }
}
```

## 2、Chrome 如何检测内存泄漏，怎么定位到哪一行
