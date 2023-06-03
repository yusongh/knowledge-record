[[toc]]

# 问题记录

## 1、给类型声明文件目录设置别名的时候，不能使用`types`、`@types`
使用上面这两个会报找不到的错误`Cannot import type declaration files. Consider importing 'store' instead of '@types/store'`

直接导致原因暂时还没找到


## 2、在vue3中，strictNullChecks为false时，如果接口的所有属性都为可选，则会被推导类型为unknown

tdesign-vue-next issues（https://github.com/Tencent/tdesign-vue-next/issues/2148）

## 3、在`tsx`文件中给箭头函数添加泛型参数，会与`jsx`语法冲突

以下语法在ts中不会报错

```ts
const foo = <T>(myObject: T) => console.log(myObject);
```

但在tsx中则会报错

```tsx
// JSX element 'T' has no corresponding closing tag.ts(17008)
// Cannot find name 'T'.ts(2304)
const foo = <T>(myObject: T) => console.log(myObject);

```

解决方法
- 不使用箭头函数，使用function
- 在泛型参数后面加个逗号
```tsx
const foo = <T,>(myObject: T) => console.log(myObject);
```
- 使用extends进行约束
```tsx
const foo = <T extends unknown>(myObject: T) => console.log(myObject);
```

## 4、typescript 使用references引用了子工程，为什么不会自动识别子工程的.d.ts文件中声明的类型

TypeScript 的 references 功能可以将一个 TypeScript 项目引用另一个 TypeScript 项目，以便在编译时自动处理依赖关系。当TypeScript项目使用references引用子工程时，TypeScript编译器将会编译整个项目以及所有被引用的子工程。然而，这并不意味着 TypeScript 会自动识别子工程的 .d.ts 文件中声明的类型。

当使用 references 引用子工程时，TypeScript 只会在父项目中检查子项目的 .ts 文件，并在编译时自动处理依赖关系。但是，`.d.ts` 文件不会被自动处理，因为它们只是类型声明文件，不是可执行的代码。

要在主项目中正确地使用子工程中的类型声明，有以下三种方法：

（1）手动将子项目的 .d.ts 文件复制到父项目中，并在父项目中进行引用

（2）在主项目的某个 TypeScript 文件中使用 import 或 /// <reference path="..." /> 指令来引用子工程的.d.ts文件。

例如，如果子工程的 .d.ts 文件位于 subproject/dist/subproject.d.ts，可以在主项目中的 TypeScript 文件中添加以下代码：

```typescript
/// <reference path="../subproject/dist/subproject.d.ts" />

```

（3）将子项目编译为一个独立的库，并在需要使用该库的父项目中引用该库


## 5、react context 使用 const visible 报错

有可能是有 `unocss` 给自动给属性添加上 ="" 导致


## 6、函数的，声明变量传参，与直接传参之间的区别

例子1

```typescript
interface Rule<T> {
  key: keyof T
  message: string
}

type Rules<T> = Rule<T>[]

interface FormDataTest {
  email: string
  code: string
}

const validate = <T extends unknown>(formData: T, rules: Rules<T>) => {
  console.log(formData, rules)
}

const data = {
  email: '123',
  code: '123'
}

const rules = [{ key: 'email', message: '请输入邮箱地址' }]

validate<FormDataTest>(data, rules) // 报错！！！

validate<FormDataTest>(data, [{ key: 'email', message: '请输入邮箱地址' }])


```

例子2

```typescript
interface Obj {
  a: string
}

const a = (obj: Obj) => {
  console.log(obj)
}

const obj = {
  a: '1233',
  b: '1233'
}

a(obj)

a({
  a: '1233',
  b: '1233' // 报错
})
```

### 1、前置知识

（1）声明变量，ts会先推断出该变量的类型，赋值时，会判断`该变量类型`是否与`被赋值变量`是否`类型兼容`

（2）直接赋值，则是直接赋的`值`是否满足`被赋值变量`的类型

```typescript
interface Obj {
  a: string
}

// obj的类型为 { a: string; b: string }
const obj = {
  a: '1233',
  b: '1233'
}

// (1) 类型兼容
const obj1: Obj = obj

// (2) 直接赋值，报错
const obj2: Obj = {
  a: '1233',
  b: '1233' // 报错！！！
}

```

### 2、函数的参数实际是一次变量定义的过程

参考[TS中函数传参绕过编译器检查的探究](https://aiyou.life/post/aanhFpuGI)

`function createSquare(config: SquareConfig)`该代码实际会表现为下列代码

```typescript
const t: SquareConfig = config
function createSquare(t){
  ...
}
```

### 3、看函数中的参数定义的变量能不能走通，即第一点的`const t: SquareConfig = config`

分解例子1

```typescript
interface Rule<T> {
 interface Rule<T> {
  key: keyof T
  message: string
}

type Rules<T> = Rule<T>[]

interface FormDataTest {
  email: string
  code: string
}

const validate = <T extends unknown>(formData: T, rules: Rules<T>) => {
  console.log(formData, rules)
}

const data = {
  email: '123',
  code: '123'
}

// rules 类型推断为 
// {key: string; message: string;}[]
const rules = [{ key: 'email', message: '请输入邮箱地址' }]

// (1) 声明变量赋值，类型不兼容，因此传参报错
const rules1: Rules<FormDataTest> = rules
validate<FormDataTest>(data, rules1) // 报错！！！

// (2) 直接赋值，没有报错，因此传参不报错
const rules2: Rules<FormDataTest> = [{ key: 'email', message: '请输入邮箱地址' }]
validate<FormDataTest>(data, rules2)

```

分解例子2

```typescript
interface Obj {
  a: string
}

const a = (obj: Obj) => {
  console.log(obj)
}

// （1）声明变量（传参）
// obj的类型为 { a: string; b: string } 
const obj = {
  a: '1233',
  b: '1233'
}

// 类型兼容
const obj1: Obj = obj
a(obj1)

// （2）直接赋值（传参）
const obj2: Obj = {
  a: '1233',
  b: '1233' // 报错！！！
}
a(obj2)
```

## 7、TS中的type、interface关于索引签名的区别

```ts
interface Test {
  [k: string]: string
}

interface Test1 {
  email: string
}

type Test2 = {
  email: string
}

let test: Test = { email: '123' }

const test1: Test1 = {
  email: '123'
}
const test2: Test2 = {
  email: '123'
}

test = test1 // 报错
test = test2

```

https://juejin.cn/post/7057471253279408135

总结： 

interface定义类型的状态都不是`最终态`，因为会发生声明合并

例如声明多一个`interface Test1 {code: number}`，`Test1`则声明合并为`interface Test1 {email: string; code: number}`

因此不能赋值给类型为`Test`的索引签名类型，`Test`索引签名的的值的类型为`string`

type声明的类型是不可变的，因此为`最终态`

## 8、isolatedModules（孤立模块）配置项的作用

但是为啥配置了这个选项，就必须把文件变成模块，即需要写`export/import`？？？

独立的模块，配置了就不能使用 `const enum` 的导入导出和隐式的导入

因为

```ts
const enum Num { 
  Zero = 0,
  One = 1
}
console.log(Num.Zero + Num.One)

```

编译后是会被抹去的

```js
console.log(0 + 1)

```

因此不能导入导出，因此设置了isolatedModules: true,最好不要使用`const enum`，不然会引起运行时报错

TypeScript 中的隐式类型导入（Implicitly inferred module types）是指，当一个模块中只有默认导出并且未声明类型时，TypeScript 会通过推断该模块的类型为一个包含了默认导出类型的对象，并将其作为导入该模块时的类型。例如：

```typescript
// module.ts
export default function add(a: number, b: number) {
  return a + b;
}

// consumer.ts
import add from './module'; // 推断 add 的类型为 (a: number, b: number) => number

```

隐式类型导入非常方便，因为无需显式地定义类型，就可以直接使用默认导出的函数或类等内容。但是，当启用 TypeScript 中的 isolatedModules 选项时，这种隐式类型导入就不能使用了。因为在单独编译模块时，其他模块无法访问到该模块的类型信息，也就无法推断默认导出的类型了。

因此，如果需要在 TypeScript 中启用 isolatedModules 选项，就需要显式地给每个模块声明类型，避免依赖于隐式类型导入。为了解决上面的例子，在 module.ts 中显式声明类型，如下所示：

```typescript
// module.ts
const add: (a: number, b: number) => number = (a, b) => a + b;
export default add;

// consumer.ts
import add from './module'; // 正常使用 add

```

这样，在启用 isolatedModules 选项的情况下，TypeScript 就能够正确地推断出默认导出类型了。



## 9、在全局的`.d.ts`文件中使用type声明了一个类型，在其他文件中使用type声明了一个同名的类型，没有报错

但是在同一个文件中使用 type 声明同名类型则报错，即不可以重新赋值
