# JS执行上下文和执行栈 & 作用域

## JS执行上下文和执行栈

### 执行上下文

执行上下文就是当前 JavaScript 代码被解析和执行时所在环境的抽象概念， JavaScript 中运行任何的代码都是在执行上下文中运行

### 执行上下文的分类

 - **全局执行上下文：** 一个程序只有一个全局对象即 window 对象（浏览器的情况下），全局对象所处的执行上下文就是全局执行上下文。

- **函数执行上下文：** 每当一个函数被调用时, 都会为该函数创建一个新的上下文。每个函数都有它自己的执行上下文，不过是在函数被调用时创建的。

- **Eval 函数执行上下文：** 执行在 eval 函数内部的代码也会有它属于自己的执行上下文（永远不要使用 eval！—— [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval)）

### 执行上下文的产生

执行上下文的**产生**涉及两个阶段：

- JS 代码的编译阶段：创建全局执行上下文
- JS 代码的执行阶段：函数被调用的时候创建函数执行上下文

### JS 代码的编译阶段

一段 JavaScript 代码在执行之前需要被编译，编译完成之后，才会进入执行阶段。

从 JavaScript 层面来讲，输入一段代码，经过编译后，会生成两部分内容：**执行上下文**（Execution Context）和可执行代码。

![javascript代码编译流程](../.vuepress/public/images/javascript/js-execution-context-stack-scope/javascript%E4%BB%A3%E7%A0%81%E7%BC%96%E8%AF%91%E8%BF%87%E7%A8%8B.png)

由上图可知，执行上下文在创建过程中还创建了两个对象：

- 词法环境（Lexical Environment）
- 变量环境（Viriable Environment）

所以执行上下文可以用伪代码表示如下:

```js
ExecutionContext = {
  LexicalEnvironment = <ref. to LexicalEnvironment in memory>,
  VariableEnvironment = <ref. to VariableEnvironment in  memory>,
}
```

#### 词法环境（Lexical Environment）

##### 1）定义

词法环境是一个包含**标识符变量映射**的结构。

**标识符：** 变量/函数的名字

**变量：** 对实际对象或原始数据的引用

##### 2）结构

词法环境由三个部分组成：

- **环境记录**（enviroment record）：存储变量和函数声明，它分为两种：

    - **声明式环境记录**（主要用于函数环境）： 存储变量、函数和参数，主要用于函数。（函数环境下会存储 arguments 的值，形式 {idx1:val1, idx2:val2, ..., length:num}）

    - **对象环境记录**（主要用于全局环境）：除了变量和函数声明，还存储了一个全局对象 window（浏览器中）以及该全局对象提供的属性和方法。

- **对外部环境的引用**（outer）：可以通过它访问外部词法环境，**也就是作用域链的原理**。

- **This 绑定**：

    - 全局执行上下文中，this 值指向全局变量（浏览器中是 window 对象）

    - 函数执行上下文中，this 的值的指向取决于函数的调用方式

        - 被对象调用：this＝对象

        - 否则：this=全局对象（非严格模式），this=undefined（严格模式）

##### 3）类型

词法环境有两种类型：

- 全局环境：在全局执行上下文中
    - 拥有内建的 Object、Array 等
    - 在环境记录内还有任何用户定义的全局变量和函数
    - 外部环境引用是 null
    - this 指向全局对象

- 函数环境：在函数执行上下文中
    - 用户在函数内部定义的变量储存在环境记录中
    - 对外部环境的引用可以是全局环境，也可以是任何包含此内部函数的外部函数


##### 4）特点

通过 let 和 const 声明的变量，在编译阶段会被存放到词法环境中。

注意「[暂时性死区](https://es6.ruanyifeng.com/#docs/let)」问题：在代码块内，使用 let 命令声明变量之前，该变量都是不可用的（哪怕存在同名全局变量）。


#### 变量环境（Viriable Environment）

##### 1）定义

**变量环境也是词法环境**，它具有上面定义的词法环境的所有属性和组件，主要的区别在于：

在 ES6 中的区别：

- 词法环境（Lexical Environment）用于存储函数声明和变量（通过 `let` 和 `const` 声明的变量）。

- 变量环境（Variable Environment）仅用于存储变量（通过 `var` 声明的变量）。

##### 2）特点

在编译阶段，会声明所有 `var` 变量（初始值设为 `undefined`），然后将这些变量存放到变量环境的环境记录中。

这也是变量提升现象产生的原因：在一个变量定义之前使用它，不会报错，但是该变量的值此时为 `undefined`，而不是定义时的值。

**变量提升**

所谓变量提升，是指在 JavaScript 代码执行过程中，JavaScript 引擎把变量的声明部分和函数的声明部分提升到代码开头的「行为」。变量被提升后，会给变量设置默认值 `undefined`

### JS 代码的执行阶段

JavaScript 引擎按照顺序逐行执行编译生成的可执行代码。

对所有变量的分配（赋值）也是在这个过程按照一行一行的执行顺序完成的。

#### 调用栈：用来管理执行上下文

调用栈，也叫执行栈，它是一种用来管理执行上下文的数据结构，存储了在代码执行期间创建的所有执行上下文。因为是栈，所以遵循 `LIFO（后进先出）` 的原则。

当 JavaScript 引擎第一次遇到 JS 脚本时，它会创建一个全局的执行上下文并且压入当前调用栈。每当引擎遇到一个函数调用，它会为该函数创建一个新的执行上下文并压入栈的顶部。

引擎会执行那些执行上下文位于栈顶的函数。当该函数执行结束时，执行上下文从栈中弹出，控制流程到达当前栈中的下一个上下文。

#### 调用栈运行过程

- 首先创建全局执行上下文，压入栈底。
- 每当调用一个函数时，创建函数的函数执行上下文，并且压入栈顶。
- 当函数执行完成后，会从调用栈中弹出，JS 引擎继续执栈顶的函数。
- 程序执行结束时，全局执行上下文弹出调用栈。

以如下代码为例：

```js
function foo(i) {
  if (i < 0) return;
  console.log('begin:' + i);
  foo(i - 1);
  console.log('end:' + i);
}
foo(2);
```

当 JavaScript 引擎首次读取该脚本时，它会创建一个全局执行上下文并将其推入当前的调用栈底部。当调用一个函数时，引擎会为该函数创建一个新的执行上下文并将其推到当前调用栈的顶端。

在新的执行上下文中，如果继续发生一个新函数调用，则继续创建新的执行上下文并推到当前调用栈的顶端，直到再无新函数调用。

引擎会运行执行上下文在调用栈顶端的函数，当此函数运行完成后，其对应的执行上下文将会从调用栈中弹出，上下文控制权将移到当前调用栈的下一个执行上下文，直到全局执行上下文。

当程序或浏览器关闭时，全局执行上下文也将退出并销毁。

![javascript调用栈运行过程](../.vuepress/public/images/javascript/js-execution-context-stack-scope/javascript%E8%B0%83%E7%94%A8%E6%A0%88%E8%BF%90%E8%A1%8C%E8%BF%87%E7%A8%8B.png)

最后输出结果：

```js
"begin:2"
"begin:1"
"begin:0"
"end:0"
"end:1"
"end:2"

```

#### 调用栈大小

调用栈是有大小的，当入栈的执行上下文超过一定数目，或达到最大**调用深度**，就会出现栈溢出（Stack Overflow）的问题，这在递归代码中很容易出现。

如下代码所示，会抛出错误信息：超过了最大栈调用大小（Maximum call stack size exceeded）。

```js
function division(a,b){
  return division(a,b);
}
console.log(division(1,2));

```

![递归调用栈溢出](../.vuepress/public/images/javascript/js-execution-context-stack-scope/%E9%80%92%E5%BD%92%E8%B0%83%E7%94%A8%E6%A0%88%E6%BA%A2%E5%87%BA.png)

那为什么会出现这个问题呢？这是因为当 JavaScript 引擎开始执行这段代码时，它首先调用函数 division，并创建执行环境，压入栈中；然而，这个函数是递归的，并且没有任何终止条件，所以它会一直创建新的函数执行环境，并反复将其压入栈中，但栈是有容量限制的，超过最大数量后就会出现栈溢出的错误。

理解了栈溢出原因后，你就可以使用一些方法来避免或者解决栈溢出的问题，比如把递归调用的形式改造成其他形式，或者使用加入定时器的方法来把当前任务拆分为其他很多小任务。

### 编译执行全流程

![javascript编译执行流程图](../.vuepress/public/images/javascript/js-execution-context-stack-scope/javascript%E7%BC%96%E8%AF%91%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B%E5%9B%BE.png)

以执行下面这段代码为例，用伪代码来模拟从编译到执行全过程中，全局执行上下文和函数执行上下文的结构变化：

```js
let a = 20;
const b = 30;
var c;

function multiply(e, f) {
 var g = 20;
 return e * f * g;
}

c = multiply(20, 30);
```

1、首先，上述代码在执行之前需要被编译，编译完成之后的全局执行上下文看起来像这样：

```js
// 全局执行上下文
GlobalExectionContext = {
  // 词法环境
  LexicalEnvironment: {
    // 对象环境记录(注意 Type 属性)
    EnvironmentRecord: {
      Type: "Object",
      // 在这里绑定标识符,
      // 注意到 let 和 const 声明的变量此时并没有任何初始值
      a: < uninitialized >,
      b: < uninitialized >,
      multiply: < func >
    }
    // 外部引用
    outer: <null>,
    // this 绑定
    ThisBinding: <Global Object>
  },
  // 变量环境
  VariableEnvironment: {
    // 对象环境记录(注意 Type 属性)
    EnvironmentRecord: {
      Type: "Object",
      // 在这里绑定标识符
      // 注意到 var 声明的变量此时被设置了初始值 undefined
      c: undefined,
    }
    // 外部引用
    outer: <null>,
    // this 绑定
    ThisBinding: <Global Object>
  }
}

```

2、在执行阶段，完成变量赋值。因此，在执行阶段，全局执行上下文看起来像这样：

```js
GlobalExectionContext = {
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 此时 let 和 const 声明的变量可以被访问了
      a: 20,
      b: 30,
      multiply: < func >
    }
    outer: <null>,
    ThisBinding: <Global Object>
  },
  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      c: undefined,
    }
    outer: <null>,
    ThisBinding: <Global Object>
  }
}

```

3、当函数 multiply(20,30) 被调用时，将创建一个新的函数执行上下文来执行函数代码。因此，在这个阶段函数执行上下文看起来像这样：

```js
// 函数执行上下文
FunctionExectionContext = {
  // 词法环境
  LexicalEnvironment: {
    // 声明式环境记录(注意 Type 属性)
    EnvironmentRecord: {
      Type: "Declarative",
      // 在这里绑定标识符
      // 函数的词法环境中必然会存在一个 arguments 对象
      Arguments: {0: 20, 1: 30, length: 2},
    },
    // 外部引用
    outer: <GlobalLexicalEnvironment>,
    // this 绑定
    ThisBinding: <Global Object or undefined>,
  },
  // 变量环境
  VariableEnvironment: {
    // 声明式环境记录(注意 Type 属性)
    EnvironmentRecord: {
      Type: "Declarative",
      // 在这里绑定标识符
      // 注意到 var 声明的变量此时被设置了初始值 undefined
      g: undefined
    },
    // 外部引用
    outer: <GlobalLexicalEnvironment>,
    // this 绑定
    ThisBinding: <Global Object or undefined>
  }
}

```

4、在此之后，执行上下文将经历执行阶段，这意味着完成对函数内变量的赋值。所以在执行阶段，函数执行上下文看起来像这样：

```js
FunctionExectionContext = {
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      Arguments: {0: 20, 1: 30, length: 2},
    },
    outer: <GlobalLexicalEnvironment>,
    ThisBinding: <Global Object or undefined>,
  },
  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 注意到 var 声明的变量此时被赋值了
      g: 20
    },
    outer: <GlobalLexicalEnvironment>,
    ThisBinding: <Global Object or undefined>
  }
}
```

函数完成后，返回值存储在 `c` 中。因此，更新全局词法环境。之后，全局代码完成，程序结束。

**注意**

- 只有在调用函数 multiply 时，函数执行上下文才会被创建。

- 在代码编译后执行前（**TODO，函数里面的代码是执行的时候编译还是一开始就编译好？**），let 和 const 定义的变量并没有关联任何值，但 var 定义的变量被设成了 undefined。

- 这是因为在创建阶段时，JS 引擎检查代码找出变量和函数声明，虽然函数声明完全存储在环境中，但是变量最初设置为 undefined（var 情况下），或者未初始化（let 和 const 情况下）。
这就是为什么你可以在声明之前访问 var 定义的变量（虽然是 undefined），但是在声明之前访问 let 和 const 的变量会得到一个引用错误。

- 这就是我们说的`变量声明提升`和`暂时性死区`。


### 曾经的 VO/AO

VO（变量对象）和 AO（活动对象）的概念是 ES3 提出的老概念，从 ES5 开始就用词法环境和变量环境替代了。

虽然是过时的知识点，但也需要整理一下，因为不仅仅是换了个名字，功能和执行过程也是不一样的。

#### VO 变量对象

- 在 JS 代码**执行前**，全局执行上下文进入调用栈底，此时会生成一个全局对象（window），它就是一个 VO（全局变量对象）。
    - 该对象所有的作用域（scope）都可以访问。
    - 里面会包含 Date、Array、String、Number、setTimeout、setInterval 等等。
    - 其中还有一个 window 属性指向自己。
    - 全局定义的变量、函数等也在这个 VO 中，但是并不会赋值 —— 变量提升。

- 在 JS 代码执行时，每一个函数执行上下文中都有一个自己的 VO（函数上下文中的变量对象）。
    - VO 用于存放当前上下文中（即当前函数中）定义的参数列表、内部变量和内部函数。

#### AO 活动对象
- 未进入执行阶段前，VO 中的属性不能直接访问。进入执行阶段后，AO 被创建并扮演 VO 的角色。
    - 函数上下文中，活动对象 AO 作为变量对象 VO 使用。
    - AO 中包含 VO、函数的形参、arguments

### 备注

参考文章

1. [执行上下文和调用栈](https://fedbook.cn/frontend-knowledge/javascript/execution-context/)



## 作用域

### 作用域的定义

作用域是指在程序中定义变量的区域，该位置决定了变量的生命周期。

通俗地理解，作用域就是变量与函数的可访问范围，即作用域控制着变量和函数的可见性和生命周期。


