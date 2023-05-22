# 较深入学习-2022-03-06

## 类型

### 基础类型

- boolean（布尔类型）
- number（数值类型）
- string（字符串类型）
- 数组类型

```typescript
// [1, 2, 3]

// 写法一
let arr1: number[];
let arr2: (number | string)[];

// 写法二
let arr3: Array<number>;
let arr4: Array<number | string>;
```

- Tuple 元组类型（固定长度、固定每个元素类型）

```typescript
// ts 2.6版本前，越界元素只要是指定的类型中的就不会报错
// ts 2.6版本后，存在越界元素就报错，即只能是固定的长度

let tuple: [string, number, boolean];
```

- 枚举类型

```typescript
// 枚举命名习惯于首字母大写
// 1、如果不直接给定一个值，默认是从0开始
enum Roles {
  SUPER_ADMIN, // 0
  ADMIN, // 1
  USER, // 2
}

// 2、直接给定一个值
enum Roles {
  SUPER_ADMIN = 1, // 1
  ADMIN = 3, // 3
  USER = 4, // 4
}

// 3、如果给定一个值，后面的枚举会依次递增
enum Roles {
  SUPER_ADMIN = 1, // 1
  ADMIN, // 2
  USER, // 3
}

// 4、从中间的开始给定一个值，后面的枚举依次递增
enum Roles {
  SUPER_ADMIN, // 0
  ADMIN = 4, // 4
  USER, // 5
}

// 5、取值
enum Roles {
  SUPER_ADMIN, // 0
  ADMIN, // 1
  USER, // 2
}
console.log(Roles.SUPER_ADMIN); // 0

// 6、通过索引值来取元素值
enum Roles {
  SUPER_ADMIN, // 0
  ADMIN, // 1
  USER, // 2
}
console.log(Roles[0]); // SUPER_ADMIN
```

- any 类型

```typescript
let value: any;
value = 123;
value = "abc";
value = false;

const arr: any[] = [1, "v"];
```

- void 类型

```typescript
// 函数没有return就可以指定返回值为void
const consoleText = (text: string): void => {
  console.log(text);
};

let a: void;
v = undefined;
v = null; // tsconfig.json中如果配置了严格模式，则会报错
```

- null 和 undefined

```typescript
// 1、ts中null和undefined即使类型，也是值
let a: null;
a = null;
// a = 123 // 报错

let b: undefined;
b = undefined;
// b = 123 // 报错

// 2、null和undefined是其他类型的子类型（没有设置严格模式的情况下，如果设置了strictNullChecks为true，则会报错）
let c = 123;
c = undefined;
c = null;
```

- never 类型

```typescript
// 1、never类型表示永远不存在的类型

// 2、抛错误的函数，返回值是never类型
const errorFunc = (message: string): never => {
  throw new Error(message);
};

// 3、死循环的函数，返回值是never类型
const infiniteFunc = (): never => {
  while (true) {}
};

// 4、never类型是任意类型的子类型，但是没有任何类型是never的子类型
let neverVal = (() => {
  while (true) {}
})();

// neverVal = 123 // 报错

let num: number = 123;
num = neverVal;
```

- object 类型

```typescript
function getObject(obj: object): void {
  console.log(obj);
}

// getObject(123) // 报错
getObject({
  name: "yusong",
});
```

### 类型断言

```typescript
// 类型断言的两种写法
// 1、<类型>变量

// 2、变量 as 类型

// 3、如果使用jsx，只能使用第二种写法（as）

const getLength = (target: string | number): number => {
  if ((<string>target).length || (target as string).length === 0) {
    return (target as string).length;
  } else {
    return target.toString().length;
  }
};
```

## symbol

### 基础

#### 概述

- symbol 为基础类型，表示唯一的值

#### 基本使用

```typescript
// 注意：由于symbol是es6的新特性，所以要在tsconfig.json中的compilerOptions的lib配置中增加es6或者es2015
const s1 = Symbol()

const s2 = Symbol('yusong')

// 1、如果传入数字类型，内部会将数字先调用toString()转为字符串
const s3 = Symbol(123)

// 2、symbol类型是不可以与其他类型进行运算的

// 3、可以调用toString()方法转为字符串
const s4 = Symbol('yusongH')
console.log(s4.toString()) // Symbol(yusongH)
console.log(Boolean(s4) // true
console.log(!s4) // false
```

#### symbol 作为属性名

- es6 的动态属性名特性

```typescript
const prop = "name";
const info = {
  [`my${prop}is`]: "yusong",
};
console.log(info);
```

- symbol 作为属性名可以保证属性名不会被覆盖

```typescript
const s5 = Symbol("name");
const info2 = {
  [s5]: "yusong",
};
console.log(info2);
console.log(info2[s5]); // yusong
```

- for in 无法遍历到 symbol 的属性名

```typescript
const info3 = {
  [s5]: "yusong",
  age: 18,
  sex: "man",
};
for (const key in info2) {
  console.log(key);
}
```

- Object.keys()方法无法获取到 symbol 属性名

```typescript
console.log(Object.keys(info3));
```

- Object.getOwnPropertyNames()方法无法获取到 symbol 属性名

```typescript
console.log(Object.getOwnPropertyNames(info3));
```

- JSON.stringify()方法无法获取到 symbol 属性名

```typescript
console.log(JSON.stringify(info3));
```

- Object.getOwnPropertySymbols()方法只会打印 symbol 的属性名

```typescript
console.log(Object.getOwnPropertySymbols(info3));
```

- Reflect.ownKeys()方法可以获取所有类型的属性名组成的数组

```typescript
console.log(Reflect.ownKeys(info3));
```

#### symbol 的两个静态方法

- Symbol.for()

```typescript
// 1、该方法与Symbol方法类似，是用于创建一个symbol值

// 2、不同的是，Symbol创建的是唯一值
const s1 = Symbol("yusong");
const s2 = Symbol("yusong");
console.log(s1 === s2); // false

// 3、但是Symbol.for()方法创建symbol值之前，会先在全局范围看是否存在相同symbol值（即以Symbol.for()方法以相同的key来创建的symbol值），如果有则直接返回已创建的symbol值，没有则创建
// 上面说到的全局范围，包括当前页面、iframe、server work
const s3 = Symbol.for("yusongH");
const s4 = Symbol.for("yusongH");
console.log(s3 === s4); // true
```

- Symbol.keyFor()

```typescript
// 用于获取使用Symbol.for()创建的symbol值的key
const s = Symbol.for("yusong");
console.log(Symbol.keyFor(s)); // yusong
```

#### js 内置的 11 个 Symbol 值

- Symbol.hasInstance

```typescript
// 对象的Symbol.hasInstance属性，指向一个内部方法。当其他对象使用instanceof运算符，判断是否为该对象的实例时，会调用这个方法。

// 比如，foo instanceof Foo在语言内部，实际调用的是Foo[Symbol.hasInstance](foo)

class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}

[1, 2, 3] instanceof new MyClass(); // true

// 上面代码中，MyClass是一个类，new MyClass()会返回一个实例。该实例的Symbol.hasInstance方法，会在进行instanceof运算时自动调用，判断左侧的运算子是否为Array的实例
```

- Symbol.isConcatSpreadable

```typescript
// 对象的Symbol.isConcatSpreadable属性等于一个布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开

let arr1 = ["c", "d"];
["a", "b"].concat(arr1, "e"); // ['a', 'b', 'c', 'd', 'e']
arr1[Symbol.isConcatSpreadable]; // undefined

let arr2 = ["c", "d"];
arr2[Symbol.isConcatSpreadable] = false;
["a", "b"].concat(arr2, "e"); // ['a', 'b', ['c','d'], 'e']

// 上面代码说明，数组的默认行为是可以展开，Symbol.isConcatSpreadable默认等于undefined。该属性等于true时，也有展开的效果。

// 类似数组的对象正好相反，默认不展开。它的Symbol.isConcatSpreadable属性设为true，才可以展开。
```

- Symbol.species

```typescript
// 对象的Symbol.species属性，指向一个构造函数。创建衍生对象时，会使用该属性

class MyArray extends Array {}

const a = new MyArray(1, 2, 3);
const b = a.map((x) => x);
const c = a.filter((x) => x > 1);

b instanceof MyArray; // true
c instanceof MyArray; // true

// 上面代码中，子类MyArray继承了父类Array，a是MyArray的实例，b和c是a的衍生对象。你可能会认为，b和c都是调用数组方法生成的，所以应该是数组（Array的实例），但实际上它们也是MyArray的实例。

// Symbol.species属性就是为了解决这个问题而提供的。现在，我们可以为MyArray设置Symbol.species属性。

class MyArray extends Array {
  static get [Symbol.species]() {
    return Array;
  }
}

class MyArray extends Array {
  static get [Symbol.species]() {
    return Array;
  }
}

const a = new MyArray();
const b = a.map((x) => x);

b instanceof MyArray; // !!1需要注意js中是false，ts中是true
b instanceof Array; // true

// 上面代码中，a.map(x => x)生成的衍生对象，就不是MyArray的实例，而直接就是Array的实例。
```

- Symbol.match

```typescript
// 对象的Symbol.match属性，指向一个函数。当执行str.match(myObject)时，如果该属性存在，会调用它，返回该方法的返回值。

String.prototype.match(regexp);
// 等同于
regexp[Symbol.match](this);

class MyMatcher {
  [Symbol.match](string) {
    return "hello world".indexOf(string);
  }
}

"e".match(new MyMatcher()); // 1
```

- Symbol.replace

```typescript
// 对象的Symbol.replace属性，指向一个方法，当该对象被String.prototype.replace方法调用时，会返回该方法的返回值。

tring.prototype.replace(searchValue, replaceValue);
// 等同于
searchValue[Symbol.replace](this, replaceValue);

const x = {};
x[Symbol.replace] = (...s) => console.log(s);

"Hello".replace(x, "World"); // ["Hello", "World"]

// Symbol.replace方法会收到两个参数，第一个参数是replace方法正在作用的对象，上面例子是Hello，第二个参数是替换后的值，上面例子是World。
```

- Symbol.search

```typescript
// 对象的Symbol.search属性，指向一个方法，当该对象被String.prototype.search方法调用时，会返回该方法的返回值。

String.prototype.search(regexp);
// 等同于
regexp[Symbol.search](this);

class MySearch {
  constructor(value) {
    this.value = value;
  }
  [Symbol.search](string) {
    return string.indexOf(this.value);
  }
}
"foobar".search(new MySearch("foo")); // 0
```

- Symbol.split

```typescript
// 对象的Symbol.split属性，指向一个方法，当该对象被String.prototype.split方法调用时，会返回该方法的返回值。

String.prototype.split(separator, limit);
// 等同于
separator[Symbol.split](this, limit);

class MySplitter {
  constructor(value) {
    this.value = value;
  }
  [Symbol.split](string) {
    let index = string.indexOf(this.value);
    if (index === -1) {
      return string;
    }
    return [string.substr(0, index), string.substr(index + this.value.length)];
  }
}

"foobar".split(new MySplitter("foo"));
// ['', 'bar']

"foobar".split(new MySplitter("bar"));
// ['foo', '']

"foobar".split(new MySplitter("baz"));
// 'foobar'

// 上面方法使用Symbol.split方法，重新定义了字符串对象的split方法的行为，
```

- Symbol.iterator

```typescript
// 对象的Symbol.iterator属性，指向该对象的默认遍历器方法。

const myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

[...myIterable]; // [1, 2, 3]

// 对象进行for...of循环时，会调用Symbol.iterator方法，返回该对象的默认遍历器。

class Collection {
  *[Symbol.iterator]() {
    let i = 0;
    while (this[i] !== undefined) {
      yield this[i];
      ++i;
    }
  }
}

let myCollection = new Collection();
myCollection[0] = 1;
myCollection[1] = 2;

for (let value of myCollection) {
  console.log(value);
}
// 1
// 2
```

- Symbol.toPrimitive

```typescript
// 对象的Symbol.toPrimitive属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。

// Symbol.toPrimitive被调用时，会接受一个字符串参数，表示当前运算的模式，一共有三种模式。

// - Number：该场合需要转成数值
// - String：该场合需要转成字符串
// - Default：该场合可以转成数值，也可以转成字符串

let obj = {
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case "number":
        return 123;
      case "string":
        return "str";
      case "default":
        return "default";
      default:
        throw new Error();
    }
  },
};

2 * obj; // 246
3 + obj; // '3default'
obj == "default"; // true
String(obj); // 'str'
```

- Symbol.toStringTag

```typescript
// 对象的Symbol.toStringTag属性，指向一个方法。在该对象上面调用Object.prototype.toString方法时，如果这个属性存在，它的返回值会出现在toString方法返回的字符串之中，表示对象的类型。也就是说，这个属性可以用来定制[object Object]或[object Array]中object后面的那个字符串。

// 例一
({[Symbol.toStringTag]: 'Foo'}.toString())
// "[object Foo]"

// 例二
class Collection {
  get [Symbol.toStringTag]() {
    return 'xxx';
  }
}
let x = new Collection();
Object.prototype.toString.call(x) // "[object xxx]"

// ES6 新增内置对象的Symbol.toStringTag属性值如下。

JSON[Symbol.toStringTag]：'JSON'
Math[Symbol.toStringTag]：'Math'
Module 对象M[Symbol.toStringTag]：'Module'
ArrayBuffer.prototype[Symbol.toStringTag]：'ArrayBuffer'
DataView.prototype[Symbol.toStringTag]：'DataView'
Map.prototype[Symbol.toStringTag]：'Map'
Promise.prototype[Symbol.toStringTag]：'Promise'
Set.prototype[Symbol.toStringTag]：'Set'
%TypedArray%.prototype[Symbol.toStringTag]：'Uint8Array'等
WeakMap.prototype[Symbol.toStringTag]：'WeakMap'
WeakSet.prototype[Symbol.toStringTag]：'WeakSet'
%MapIteratorPrototype%[Symbol.toStringTag]：'Map Iterator'
%SetIteratorPrototype%[Symbol.toStringTag]：'Set Iterator'
%StringIteratorPrototype%[Symbol.toStringTag]：'String Iterator'
Symbol.prototype[Symbol.toStringTag]：'Symbol'
Generator.prototype[Symbol.toStringTag]：'Generator'
GeneratorFunction.prototype[Symbol.toStringTag]：'GeneratorFunction'
```

- Symbol.unscopables

```typescript
// 对象的Symbol.unscopables属性，指向一个对象。该对象指定了使用with关键字时，哪些属性会被with环境排除。

Array.prototype[Symbol.unscopables];
// {
//   copyWithin: true,
//   entries: true,
//   fill: true,
//   find: true,
//   findIndex: true,
//   includes: true,
//   keys: true
// }

Object.keys(Array.prototype[Symbol.unscopables]);
// ['copyWithin', 'entries', 'fill', 'find', 'findIndex', 'includes', 'keys']

// 上面代码说明，数组有 7 个属性，会被with命令排除。

// 没有 unscopables 时
class MyClass {
  foo() {
    return 1;
  }
}

var foo = function () {
  return 2;
};

with (MyClass.prototype) {
  foo(); // 1
}

// 有 unscopables 时
class MyClass {
  foo() {
    return 1;
  }
  get [Symbol.unscopables]() {
    return { foo: true };
  }
}

var foo = function () {
  return 2;
};

with (MyClass.prototype) {
  foo(); // 2
}

// 上面代码通过指定Symbol.unscopables属性，使得with语法块不会在当前作用域寻找foo属性，即foo将指向外层作用域的变量。
```

## 接口

### 基本使用

```typescript
const getFullName = ({ firstName, lastName }) => {
  return `${firstName} ${lastName}`;
};

getFullName({
  firstName: "huang",
  lastName: 18,
}); // 这样传也不会报错，但是不是我们想要的，我们想要的是firstName和lastName都是字符串类型

// 1、定义姓名信息接口，来约束传入的参数
interface NameInfo {
  firstName: string;
  lastName: string;
}

const getFullName1 = ({ firstName, lastName }: NameInfo): string => {
  return `${firstName} ${lastName}`;
};

getFullName1({
  firstName: "huang",
  lastName: 18,
}); // 报错，不能将number类型赋值给string类型
getFullName1({
  firstName: "huang",
  lastName: "yusong",
}); // huang yusong
```

### 函数类型

```typescript
// 使用接口定义
interface AddFunc {
  (num1: number, num2: number): number;
}

const addFn: AddFunc = (n1, n2) => n1 + n2;

// 类型别名定义
type AddFunc1 = (num1: number, num2: number) => number;
```

### 可选属性

```typescript
// 可选属性，在属性后面加问号
interface Vegetables {
  color?: string;
  type: string;
}

const getVegetables = ({ color, type }: Vegetables): string => {
  return `A ${color ? color + " " : " "}${type}`;
};
getVegetables({
  type: "tomato",
}); // A tomato
getVegetables({
  color: "red",
  type: "tomato",
}); // A tomato
```

### 索引类型

```typescript
interface RoleDic {
  [id: number]: string;
}

const r1: RoleDic = {
  1: "abc",
  a: "def", // 报错，属性名需要为number类型
};

// 属性名为字符串
interface RoleDic2 {
  [id: string]: string;
}
const r2: RoleDic2 = {
  a: "abc",
  1: "def", // 这里会发现，写数字也不会报错。是因为js的属性名都是会转为字符串的
};
```

### 多余属性检查

```typescript
interface Vegetables {
  color?: string;
  type: string;
}

const getVegetables = ({ color, type }: Vegetables): string => {
  return `A ${color ? color + " " : " "}${type}`;
};

getVegetables({
  type: "tomato",
  size: 2, // 这里会报错，因为接口中没有定义
});
```

### 继承接口

```typescript
// 使用extends关键字
interface Vegetables {
  color: string;
}

interface Tomato extends Vegetables {
  redius: number;
}

interface Carrot {
  length: number;
}

const tomato: Tomato = {
  color: "red",
  redius: 1,
};

const carrot: Carrot = {
  length: 2,
};
```

### 绕开多余属性检查

1. 使用类型断言，告诉编译器，我传的就是 Vegetables 接口类型

```typescript
// 使用类型断言，告诉编译器，我传的就是Vegetables接口类型
interface Vegetables {
  color?: string;
  type: string;
}

const getVegetables = ({ color, type }: Vegetables): string => {
  return `A ${color ? color + " " : " "}${type}`;
};

// 返回结果：A tomato
getVegetables({
  type: "tomato",
  size: 2,
} as Vegetables); // 类型断言
```

2. 使用索引签名

```typescript
// 使用索引签名
interface Vegetables {
  color?: string;
  type: string;
  [prop: string]: any; // 索引签名
}

const getVegetables = ({ color, type }: Vegetables): string => {
  return `A ${color ? color + " " : " "}${type}`;
};

getVegetables({
  color: "red",
  type: "tomato",
  size: 2, // 不会报错
}); // A red tomato
```

3. 使用类型兼容性（todo）

```typescript
// 使用类型兼容性
interface Vegetables {
  color?: string;
  type: string;
}

const getVegetables = ({ color, type }: Vegetables): string => {
  return `A ${color ? color + " " : " "}${type}`;
};

// 类型兼容性
interface Named {
  name: string;
}

let x: Named;
// y's inferred type is { name: string; location: string; }
let y = { name: "Alice", location: "Seattle" };
x = y;
// TypeScript结构化类型系统的基本规则是，如果x要兼容y，那么y至少具有与x相同的属性
// https://www.tslang.cn/docs/handbook/type-compatibility.html
const vegetablesObj = {
  color: "red",
  type: "tomato",
  size: 2,
};

getVegetables(vegetablesObj); // A red tomato
```

### 混合类型接口

```typescript
// 函数类型上添加属性
interface Counter {
  (): void;
  count: number;
}

const getCounter = (): Counter => {
  const c = () => c.count++;
  c.count = 0;
  return c;
};

const counter: Counter = getCounter();
counter();
console.log(counter.c); // 1
counter();
console.log(counter.c); // 2
counter();
console.log(counter.c); // 3
```

### 只读属性

1. 使用 readonly 修饰符定义只读属性

```typescript
// 使用readonly修饰符定义只读属性
interface Vegetables {
  color?: string;
  readonly type: string;
}

const vegetableObj: Vegetables = {
  type: "tomato",
};

vegetableObj.type = "carrot"; // 报错，只读属性不能修改
```

2. 限制数组的元素为只读属性

```typescript
interface ArrInter {
  0: number;
  readonly 1: string;
}

const arr: ArrInter = ["abc"]; // 报错，不能将string类型分配给number
const arr2: ArrInter = [123, "abc"];
arr2[1] = "abc2"; // 只读属性不能修改
```

## 5、函数

### 函数类型

#### 为函数定义类型

```typescript
function addFn(x: number, y: number): number {
  return x + y;
}
```

#### 完整的函数类型

```typescript
// 定义函数类型
let add: (x: number, y: number) => number;

add = (arg1: number, arg2: number): number => arg1 + arg2;

// 报错，arg1不能为string类型
add = (arg1: string, arg2: number): number => arg1 + arg2;
```

#### 使用接口定义函数类型

```typescript
interface Add {
  (x: number, y: number): number;
}
```

#### 使用类型别名

```typescript
type Add = (x: number, y: number) => number;

let addFn: Add;
addFn = (arg1: string, arg2: number): number => arg1 + arg2;
```

### 参数

#### 可选参数

```typescript
// 1、使用？来表示可选参数
// 2、可选参必须在必选参数后面

// arg3位可选参
type AddFunction = (arg1: number, arg2: number, arg3?: number) => number;

let addFn: AddFunction;
addFn = (x: number, y: number): number => x + y;

addFn = (x: number, y: number, z: number): number => x + y + z;
```

#### 默认参数

```typescript
// 与es6的默认参数语法一致
type AddFunction = (arg1: number, arg2: number) => number;

let addFn: AddFunction;
addFn = (x: number, y: number = 3): number => x + y;

addFn(1); // 4
addFn(1, 2); // 3
```

#### 剩余参数

```typescript
// 跟es6一致，使用...args获取剩余参数
const handleData = (x: number, ...args: number[]) => {
  // ...
};
```

### 重载

```typescript
// 根据传入不同的参数而返回不同类型的数据
// 方法是为同一个函数提供多个函数类型定义来进行函数重载。 编译器会根据这个列表去处理函数的调用。

function handleData(x: string): string[];
function handleData(x: number): number[];
function handleData(x: any): any {
  if (typeof x === "string") {
    return x.split("");
  } else {
    return x
      .toString()
      .split("")
      .map((item) => Number(item));
  }
}

handleData("abc"); // 如果传入的是字符串，则函数类型则是函数重载function handleData(x: string): string[]
handleData(123); // 如果传入的是数字，则函数类型则是函数重载function handleData(x: number): number[]

handleData("abc").map((item) => {
  return item.toFixed(); // 报错，因为string类型上没有toFixed方法
});
```

## 泛型

### 简单使用

```typescript
// 问题
const getArray = (value: any, times: number): any[] => {
  return new Array(times).fill(value);
};

//
getArray(1, 4); // [1, 1, 1, 1]
getArray(1, 4).map((item) => item.length); // 由于数字没有length属性，所以返回的结果是[undefined, undefined, undefined, undefined]，这样ts无法起到类型检测的作用

// 使用泛型解决，即value的类型，使用的时候再传进来
const getArray1 = <T>(value: T, times: number): T[] => {
  return new Array(times).fill(value);
};

getArray1<number>(1, 4).map((item) => item.length); // 报错
```

### 泛型变量

```typescript
const getArray = <T, U>(param1: T, param2: U, times: number): Array<[T, U]> => {
  return new Array(times).fill([param1, param2]);
};

getArray<number, string>(1, "a", 3);
```

### 泛型类型

```typescript
// 直接定义函数类型
let getArray: <T>(arg: T, times: number) => T[];
getArray = (arg: any, times: number) => {
  return new Array(times).fill(arg);
};

getArray(123, 3).map((item) => item.length); // 报错，因为数值没有length属性

// 类型别名
type GetArray = <T>(arg: T, times: number) => T[];

// 接口
interface InGetArray {
  <T>(arg: T, times: number): T[];
}
// 可以将泛型变量提到最顶层,这样接口里面所有地方都可以用
interface InGetArray1<T> {
  (arg: T, times: number): T[];
  array: T[];
}
```

### 泛型约束

```typescript
// 即是对泛型变量的约束

// 约束条件：现在希望泛型变量T是含有length属性的
// 可以让泛型T继承接口，在接口中定义约束
interface ValueWithLength {
  length: number;
}
const getArray = <T extends ValueWithLength>(arg: T, times: number): T[] => {
  return new Array(times).fill(arg);
};

getArray(23, 2); // 报错，数字没有length属性
getArray("abc", 2);
```

### 在泛型约束中使用类型参数

```typescript
const getProps = (obj, propName) => {
  return obj[propName];
};
const objs = {
  a: "a",
  b: "b",
};
getProps(objs, "a"); // 'a'
getProps(objs, "c"); // 由于objcs没有'c'属性，所以返回undefined，我们希望在编译阶段就是报出这个错误

// 改造上面例子，keyof为索引类型。这里的K继承keyof T的意思是K是T的其中一员
const getProps1 = <T, K extends keyof T>(obj: T, propName: K) => {
  return obj[propName];
};
getProps(objs, "c"); // 报错
```

## ES6 中的类

### ES5 和 ES6 实现创建实例

1. ES5

```typescript
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.getPosition = function () {
  return "(" + this.x + ", " + this.y + ")";
};

var p1 = new Point(1, 2);
console.log(p1); // { x: 1, y: 2 }
console.log(p1.getPosition()); // (1, 2)
```

2. ES6

```typescript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getPosition() {
    return `(${(this.x, this.y)})`;
  }
}

const p1 = new Point();
console.log(p1);
```

### 静态方法

```typescript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getPosition() {
    return `(${this.x}, ${this.y})`;
  }

  static getClassName() {
    return Point.name;
  }
}

const p = new Point(1, 2);
p.getPosition(); // (1, 2)
p.getClassName(); // 调用静态方法，所以报错
Point.getClassName(); // Point
```

### constructor 方法

参考第一点 es6 的实现

### 实例属性其他写法

```typescript
class Point {
  // 在这可以定义其他属性
  z = 10; // 给默认值
  h; // 也可以不给默认值
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getPosition() {
    return `(${this.x}, ${this.y})`;
  }

  static getClassName() {
    return Point.name;
  }
}

// 给类添加静态属性，目前ES6没有静态属性。即static关键字只能给方法用。但是新的提案有提出static给属性使用，但是还没有通过。所以可以使用一下方法来实现静态属性
Point.a = 1;
const p = new Point(1, 3);
p.a; // undefined
```

### 类的实例

参考第一点

### 实现私有方法

```typescript
// es6中没有实现私有方法
// 1、私有方法以_开头，来约定该方法为私有

// 2、将私有方法定义在类的外面，然后不把_func2方法导出，外部则获取不到
const _fun2 = () => {};
class Pint {
  fun1() {
    _fun2.call(this);
  }
}

// 3、使用symbol定义方法名，然后不把该symbol值导出，外部则获取不到
const func3 = Symbol("func3");
class Point1 {
  static [func3]() {}
}
```

### 取值函数和存值函数（存取器）

1. ES5

```typescript
var info = {
  _age: 18,
  get age() {
    console.log("取值器");
    return this._age;
  },
  set age(newVal) {
    if (newVal > 18) {
      this._age = newVal - 1;
    } else {
      this._age = newVal + 1;
    }
    console.log("存值器");
  },
};

info.age; // 取值器
info.age = 20; // 存值器
```

2. ES6

```typescript
class Info {
  constructor(age) {
    this._age = age;
  }

  set age(newVal) {
    if (newVal > 18) {
      this._age = newVal - 1;
    } else {
      this._age = newVal + 1;
    }
    console.log("存值器");
  }

  get age() {
    console.log("取值器");
    return this._age;
  }
}

const info = new Info(18);
info.age; // 取值器
info.age = 20; // 存值器
```

### class 表达式

```typescript
// 写法一：Info才是实际的类名
const Info = class C {
  constructor() {}
};

// 写法二：
const Info1 = class {
  constructor() {}
};

const testInfo = new C(); // 报错
const testInfo = new Info();
```

### new.target

```typescript
// 1、构造函数
function Point1() {
  console.log(new.target);
}

const p1 = new Point(); // 打印该构造函数
const p2 = Point(); // 直接调用打印undefined

// 2、类
class Point1 {
  constructor() {
    console.log(new.target);
  }
}

const p3 = new Point1(); // 打印该类

// 3、子类
class Parent {
  constructor() {}
}

class Child extends Parent {
  constructor() {
    super();
  }
}

const c = new Child(); // 打印的是子类

// 4、基于这个特点可以实现ts中的抽象类
class Parent1 {
  constructor() {
    if (new.target === Parent1) {
      throw new Error("不能实例化父类");
    }
  }
}

class Child1 extends Parent1 {
  constructor() {
    super();
  }
}

const c1 = new Parent1(); // 报错
```

## ES6 中的类（进阶）

### ES5 中的继承

> 先创建子构造函数的实例 this，再把父构造函数方法和属性挂载在 this

```typescript
function Food() {
  this.type = "food";
}

Food.prototype.getType = function () {
  return this.type;
};

function Vegetables(name) {
  this.name = name;
}

// 现在让Vegetables继承Food，因此可以把Food的实例对象挂到Vegetables的原型上
Vegetables.prototype = new Food();

const tomato = new Vegetables("tomato");
tomato.getType(); // food
```

### ES6 中的类的继承

> 先从父类中取到实例对象 this，然后在调用 super 方法后，再把子类的方法和属性挂载到 this 上

- `super`在这里表示父类的构造函数，用来新建一个父类的实例对象。
- ES6 规定，子类必须在`constructor()`方法中调用`super()`，否则就会报错。这是因为子类自己的`this`对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，添加子类自己的实例属性和方法。如果不调用`super()`方法，子类就得不到自己的`this`对象。

```typescript
class Parent {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
}

const c = new Child("yusong", 18);
console.log(c); // {name: 'yusong', age； 18}
console.log(c.getName()); // yusong
```

### ES6 中继承原生的构造函数（ES5 中无法继承）

- Boolean
- Number
- String
- Array
- Date
- Function
- RegExp
- Error
- Object

```typescript
class CustomArray extends Array {
  custructor(...args) {
    super(...args);
  }
}

const arr = new CustomArray(3);
arr.fill("yusong"); // ['yusong', 'yusong', 'yusong']
console.log(arr.join("_")); // 'yusong_yusong_yusong'
```

### 类的 prototype 属性和**proto**属性

- ES5

```typescript
var obj = new Object();
obj.__proto__ === Object.prototype; // true
```

- ES6 中的类
  - 子类的`__proto__`指向父类本身
  - 子类的`prototype`属性的`__proto__`指向父类的`prototype`属性
  - 实例的`__proto__`属性的`__proto__`指向父类实例的`__proto__`

```typescript
todo;
```

### Object.getPrototypeOf

> 该方法可以获取构造函数的原型对象

```typescript
class Parent {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
}

console.log(Object.getPrototypeOf(Child) === Parent); // true
```

### super

- 不能直接访问 super，但是又不是当做函数，又不是当做对象访问其属性。比如直接打印 super 则会报错

#### 作为函数

> 代表父类的构造函数 constructor
>
> - 在继承父类的子类的构造函数 constructor 中，必须调用 super()，这样才能使用 this
> - 只能在构造函数 constructor 中调用，在其他函数中调用会报错
> - 父类的构造函数 constructor 中的 this 指向子类的实例

```typescript
class Parent {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
}

const c = new Child("yusong", 18);
console.log(c); // {name: 'yusong', age: 18}
```

#### 作为对象

- 在普通方法中，指向父类的原型对象

```typescript
class Parent {
  constructor(type) {
    this.type = type;
  }

  getName() {
    return this.type;
  }
}

Parent.getType = () => {
  return "parent";
};

class Child extends Parent {
  constructor(type, age) {
    super(type);
    this.age = age;
  }

  getParentName() {
    return super.getName();
  }

  getParentType() {
    return super.getType();
  }
}

const c = new Child("yusong", 18);
c.getParentName(); // 'yusong'
c.getParentType(); // 报错
```

- 在静态方法（即 static 修饰的方法），指向父类

```typescript
class Parent {
  constructor(type) {
    this.type = type;
  }

  getName() {
    return this.type;
  }
}

Parent.getType = () => {
  return "parent";
};

class Child extends Parent {
  constructor(type, age) {
    super(type);
    this.age = age;
  }

  getParentName() {
    return super.getName();
  }

  static getParentType() {
    // 执行父类对象上的getType方法
    return super.getType();
  }
}

const c = new Child("yusong", 18);
c.getParentName(); // 'yusong'
c.getParentType(); // 'parent'
```

## TS 中的类

### 基础

```typescript
class Point {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public getPosition() {
    return `(${(this, x)}, ${this.y})`;
  }
}

const point = new Point(1, 2);

class Parent {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Child extends Parent {
  constructor(name: string) {
    super(name);
  }
}
```

### 修饰符

- public 公共

  - 默认，不指定则为 public

- private 私有

  - 只能在类中访问
  - 子类中不能访问父类的

  ```typescript
  class Parent {
    private name: string;
    constructor(name: string) {
      this.name = name;
    }
  }

  const p = new Parent("yusong");
  p.name; // 报错
  Parent.name; // 报错

  class Child extends Parent {
    constructor(name: string) {
      super(name);
      console.log(super.name); // 报错
    }
  }
  ```

- protected 受保护

  - 子类中可以访问父类的方法，但是不能访问属性
  - 父类的构造函数添加 protected 修饰符，则该类只能被继承，而不能被实例化

  ```typescript
  class Parent {
    protected name: string;
    constructor(name: string) {
      this.name = name;
    }

    protected getName() {
      return this.name;
    }
  }

  class Child extends Parent {
    constructor(name: string) {
      super(name);
      console.log(super.getName());
      console.log(super.name); // 报错
    }
  }
  ```

### readonly 修饰符

```typescript
class UserInfo {
  public readonly name: string;
  constructor(name: string) {
    this.name = name;
  }
}

const userInfo = new UserInfo("yusong");
userInfo.name = "haha"; // 报错，只读属性不能修改
```

### 参数属性

> 直接在构造函数中的参数前面加修饰符
>
> - 在参数前加的事 public 修饰符，既会起到 public 的作用，也会把该参数挂到 this 上也就是实例上

```typescript
class A {
  constructor(public name: string) {}
}

const a = new A("yusong");
console.log(a); // {name: 'yusong'}
```

### 静态属性

> 使用 static 修饰符，实例不会添加静态属性和方法，也不会继承静态属性和方法

```typescript
class Parent {
  public static age: number = 18;
  public static getAge() {
    return Parent.age;
  }
  constructor() {}
}

const p = new Parent();
p.age; // 报错，静态属性实例访问不了
Parent.age; // 18
```

### 可选类属性

> 2.x 版本中支持了

```typescript
class Info {
  public name: string;
  public age?: number;
  constructor(name: string, age?: number, public sex?: string) {
    this.name = name;
    this.age = age;
  }
}

const info1 = new Info("yusong");
console.log(info1);
const info2 = new Info("yusong", 18);
console.log(info2);
const info3 = new Info("yusong", 18, "man");
console.log(info3);
```

### 存取器

> 与 ES6 一致

```typescript
class Info {
  public name: string;
  public age?: number;
  private _infoStr: string;
  constructor(name: string, age?: number, public sex?: string) {
    this.name = name;
    this.age = age;
  }

  get infoStr() {
    return this._infoStr;
  }

  set infoStr(newVal) {
    this._infoStr = newVal;
  }
}

const info = new Info("yusong", 18);
info.infoStr = "yusong: 18";
console.log(info.infoStr); // yusong: 18
```

### 抽象类

使用 abstract 关键字修饰类和方法

- 抽象类只能被继承

```typescript
abstract class People {
  constructor(public name: string) {}
  public abstract printName(): void;
}
// const p1 = new People() // 报错

class Man extends People {
  constructor(name: string) {
    super(name);
    this.name = name;
  }
  public printName() {
    console.log(this.name);
  }
}

const m = new Man("yusong");
```

- abstract 还可以修饰类中的属性和存取器

```typescript
abstract class People {
  public abstract name: string;
  abstract get insideName(): string;
  abstract set insideName(value: string); // 不能定义返回值，否则会报错
}

class Man extends People {
  public name: string;
  public insideName: string;
}
```

### 实例属性

- 使用类创建的实例，该实例的类型就是创建她的类。也就是说类即是值，也是类型

### 对前面跳过知识的补充

#### 类的类型接口

> 使用接口来约束类的定义必须包含那些东西
>
> - 接口检测的是使用该类创建的实例

```typescript
interface FoodInterface {
  type: string;
  name: string;
}

class FoodClass implements FoodInterface {
  public type: string;
  public static name: string; // 使用static修饰符会报错，由于接口检测的是使用该类创建的实例。static修饰的是静态属性，是在FoodClass类上的。所以报错
}
```

#### 接口继承类

- 继承类的成员，但是不包括其实现。也就是只继承其成员和成员类型

- 接口会继承 private 和 protected 修饰的成员，该接口只能被该类或者其子类实现

```typescript
class A {
  protected name: string;
}

interface I extends A {}

class B extends A implements I {
  public name: string;
}
```

#### 在泛型中使用类类型

```typescript
// 接口一个类，返回该类创建的实例
// 参数中的new()表示这个类的构造函数 todo
const create = <T>(c: new () => T): T => {
  return new c();
};

class Info {
  public age: number;
}

create<Info>(Info);
```

## 枚举

### 数字枚举

#### 取值方式

```typescript
enum Status {
  Uploading,
  Success,
  Failed
}

// 获取方式一：
Status.Uploading // 0
// 获取方式二：
Status.['Success'] // 1
```

#### 特点

```typescript
// 1、可以指定首个枚举值，后面的以此递增
enum Status {
  Uploading = 1,
  Success,
  Failed,
}
Status.Uploading; // 1
Status.Success; // 2
Status.Failed; // 3

// 2、可以从中间开始指定，后面的依次递增
enum Status1 {
  Uploading,
  Success = 3,
  Failed,
}
Status1.Uploading; // 0
Status1.Success; // 3
Status1.Failed; // 4

// 3、可以给每一个指定枚举值
enum Status2 {
  Uploading = 6,
  Success = 3,
  Failed = 7,
}
Status2.Uploading; // 6
Status2.Success; // 3
Status2.Failed; // 7

// 4、可以使用变量或者函数返回值来指定枚举值，但是使用变量和函数返回值指定的枚举值后面必须给初始值
const num = 2;
enum Status3 {
  Uploading = num,
  // Success, // 此处会报错
  Success1 = 3,
  Failed,
}

const getNum = () => {
  return 3;
};
enum Status3 {
  Uploading = getNum(),
  // Success, // 此处会报错
  Success1 = 3,
  Failed,
}
```

### 反向映射

> 即可以通过枚举 key 获取枚举值，也可以通过枚举值获取 key
>
> - 可以直接打印枚举的对象看看
> - 通过 ts 官方文档的工具，可以看到编译后的结果

```typescript
enum Status {
  Uploading,
  Success,
  Failed,
}

Status.Uploading; // 0
Status[0]; // 'Uploading'

// 直接打印
console.log(Status);
//{
//  0: "Uploading"
//  1: "Success"
//  2: "Failed"
//  Failed: 2
//  Success: 1
//  Uploading: 0
//}

// 编译后的结果
var Status;
(function (Status) {
  Status[(Status["Uploading"] = 0)] = "Uploading";
  Status[(Status["Success"] = 1)] = "Success";
  Status[(Status["Failed"] = 2)] = "Failed";
})(Status || (Status = {}));
```

### 字符串枚举

> 2.4 版本增加
>
> - 字符串枚举要求每个字段必须是字符串字面量
> - 或者是该枚举值中的另一个字符串枚举成员

```typescript
enum Message {
  Error = "sorry, error", // 字符串字面量
  Success = "hoho, success", // 字符串字面量
  Failed = Error, // 该枚举值中的另一个字符串枚举成员
}
```

### 异构枚举

> 异构枚举，就是既有数字枚举，又有字符串枚举

```typescript
enum Result {
  Faild = 0,
  Success = "success",
}
```

### 枚举成员类型和联合枚举类型

#### 能作为类型使用的枚举应符合的三个条件

- 不带初始值的成员
- 成员的的值为字符串字面量
- 成员的值为数值字面量或者带有负号的数值字面量

#### 枚举成员类型

```typescript
// 1. enum E { A }
// 2. enum E { A = 'a' }
// 3. enum E { A = 1, A = -1 }

enum Animals {
  Dog = 1,
  Cat = 2,
}

interface Dog {
  type: Animals.Dog;
}

const dog: Dog = {
  type: Animals.Dog,
  // type: 1 // 也是可以的
};
```

#### 联合枚举类型

```typescript
enum Status {
  Off,
  On,
}

interface Light {
  status: Status;
}

const light: Light = {
  status: Status.Off,
  // status: Status.On // 或者是on
};
```

### 运行时的枚举

> 从枚举编译后的代码可以看出，其实它是一个对象。所以可以在运行时去使用他。
>
> 但是像接口这种定义类型的，他们在编译之后是没有实际的定西的，所以运行时的代码中不能使用

### const enum

> enum 前面加 const，则编译结果不会有一个实际的对象。

```typescript
const enum Status {
  success == 200
}
// 在代码中使用，模拟结果返回
cosnt res = { code: 200 }
if (res.code === Status.success) {
  console.log('success')
}

// 编译后的结果是，会被替换成对应的枚举值。而不会生成一个实际的对象
if (res.code === 200) {
  console.log('success')
}
```

## 类型推论和兼容性

### 类型推断

#### 基础

```typescript
let name = "yusong"; // TS会推断name的类型为string
name = 123; // 赋值number类型，报错
```

#### 多类联合类型

```typescript
let arr = [1, "a"]; // TS会推断arr的类型为(string | number)[]
arr = [1, 3, "d"];
arr = [1, 3, false]; // 报错
```

#### 上下文类型

```typescript
// 代码提示，就是因为有上下文类型
window.onmousedown = (event) => {
  // event. // 通过上下文类型，推断出event为mouseEvent，所以event.就会提示mouseEvent上所有属性
};
```

### 类型兼容性

#### 基础

```typescript
interface Info {
  name: string;
}
let infos: Info;
const infos1 = { name: "yusong" };
const infos2 = { age: 18 };
const infos3 = { name: "yusong", age: 18 };
infos = infos1; // 没有报错，因为符合Info接口定义
infos = infos2; // 没有name属性，报错
infos = infos3; // 没有报错，用于赋值的值必须有接口中定义的属性，多了属性无所谓，因为infos3有name属性。

// 该检测是递归的，嵌套的对象也会检测
interface Info1 {
  name: string;
  info: {
    age: number;
  };
}
let infos: Info1;
const infos4 = { name: "yusong", info: { age: "yusong" } };
const infos5 = { name: "yusong", age: 18 };
infos = infos1; // 报错，因为info4中的info中的age赋值了string类型的值
infos = infos3; // 没有报错
```

#### 函数兼容性

##### 参数个数 todo

```typescript
let x = (a: string) => 0;
let y = (b: string, c: number) => 0;

// 赋值的方法的参数范围要小于等于被赋值的函数
y = x;
x = y; // 报错
```

##### 参数类型

```typescript
let x = (a: string) => 0;
let y = (b: number) => 0;

x = y; // 报错，参数类型不一致
```

##### 返回值类型

```typescript
let x = (): string | number => 0;
let y = (): string => "a";

x = y; // 不会报错，因为y返回string类型，然后x既可以是string也可以是number
y = x; // 报错
```

##### 可选参数和剩余参数 todo

```typescript
const getSum = (
  arr: number[],
  callback: (...args: number[]) => number
): number => {
  return callback(...arr);
};

const res = getSum([1, 2, 3], (...args: number[]): number => {
  return args.reduce((a, b) => a + b, 0);
});

const res2 = getSum(
  [1, 2, 3],
  (arg1: number, arg2: number, arg3: number): number => {
    return arg1 + arg2 + arg3;
  }
);
```

##### 参数双向协变 todo

```typescript
let funcA = (arg: number | string): void => {};
let funcB = (arg: number): void => {};

// funcB = funcA
funcA = funcB;
// 双向赋值都不会报错，因为他们的参数类型都是可以为number，但是在严格模式下会报错 todo
```

##### 函数重载

```typescript
// 必须适应function关键字定义
function merge(arg1: number, arg2: number): number;
function merge(arg1: string, arg2: string): string;
function merge(arg1: any, arg2: any): any {
  return arg1 + agr2;
}

function sum(arg1: number, arg2: number): number;
function sum(arg1: any, arg2: any): any {
  return arg1 + arg2;
}

let func = merge;
func = sum; // 报错，因为func有两个函数重载，sum只有一个函数重载
```

#### 枚举

```typescript
// 数字枚举只与数字兼容，与不同数字枚举值之间是不兼容的
enum StatusEnum {
  On,
  Off,
}

enum AnimalEnum {
  Dog,
  Cat,
}

let s = StatusEmun.On;
s = 9; // 不会报错
let s1 = StatusEmun.On;
s1 = AnimalEnum.Dog; // 报错
```

#### 类

```typescript
// 类的兼容，不会比较类的静态成员和构造函数，只会去比较实例成员
// 1、static
class Animal {
  public static age: number;
  constructor(public name: string) {}
}

class People {
  public static age: string;
  constructor(public name: string) {}
}

class Food {
  constructor(public name: number) {}
}

let animal: Animal;
let people: People;
let food: Food;

animal = people; // 不会报错，因为只会检测实例成员，他们都有name属性，类型也都是string
animal = food; // 报错，因为food的实例属性name，是number类型

// 2、private
class Parent {
  private age: numebr;
  constructor() {}
}

class Children extends Parent {
  constructor() {
    super();
  }
}

class Other {
  private age: numebr;
  constructor() {}
}

const children: Parent = new Childnren(); // 不会报错
const other: Parent = new Other(); // 报错

// 3、protected
class Parent1 {
  protected age: numebr;
  constructor() {}
}

class Children1 extends Parent1 {
  constructor() {
    super();
  }
}

class Other1 {
  protected age: numebr;
  constructor() {}
}

const children1: Parent1 = new Childnren1(); // 不会报错
const other1: Parent1 = new Other1(); // 报错
```

#### 泛型

```typescript
interface Data<T> {}
let data1: Data<string>;
let data2: Data<number>;
data1 = data2; // 不会报错，因为现在接口是空的

interface Data1<T> {
  data: T;
}
let data3: Data1<string>;
let data4: Data1<number>;
data3 = data4; // 报错了
```

## 高级类型（1）

### 交叉类型

> 使用&符号连接，T & U

``` typescript
const mergeFunc = <T, U>(arg1: T, arg2: U): T & U => {
  let res = {} as T & U
  res = Object.assign(arg1, arg2)
  return res
}

mergeFunc({ a: 'a' }, { b: 'b' })
```

### 联合类型

> 使用|符号连接，type1 | type2 | type3

```typescript
const getLengthFunc = (content: string | number): number => {
  if (typeof content === "string") {
    return content.length;
  } else {
    return content.toString().length;
  }
};

getLengthFunc("abcd"); // 4
getLengthFunc(1234); // 4
getLengthFunc(false); // 报错
```

### 类型保护

```typescript
const list = [123, "abc"];
const getRandomValue = () => {
  const number = Math.random() * 10;
  if (number < 5) {
    return list[0];
  } else {
    return list[1];
  }
};
const item = getRandomValue();
// 1、使用以下判断，在js下是没有问题的，但是在ts下是有问题的
// if (item.length) {
//   console.log(item.length)
// } else {
//   console.log(item.toFixed())
// }

// 2、当然可以用类型断言，但是每个地方都要加，很麻烦
```

#### 函数

```typescript
// 3、使用类型保护，定义类型保护函数，返回一个布尔值
function isString(value: string | number): value is string {
  return typeof value === "string";
}

if (isString(item)) {
  console.log(itme.length);
} else {
  console.log(item.toFixed());
}
```

#### typeof

```typescript
// 4、3中的类型保护函数适用于情况比较复杂，判断比较多的情况下，如果是只有一个类型判断，可以直接用typeof类型保护
if (typeof item === "string") {
  console.log(itme.length);
} else {
  console.log(item.toFixed());
}

// 5、注意点：4中的类型保护使用typeof后面只能接 等于 或者不等来判断，不能方法之类的来判断，请看以下示例就会报错
if ((typeof item).includes("string")) {
  console.log(itme.length); // 报错
} else {
  console.log(item.toFixed()); // 报错
}

// 6、4中的类型保护，typeof 判断的类型只能是string/numebr/boolean/symbol四种中的其中一种
```

#### instanceof

```typescript
class CreateByClass1 {
  public age: number = 18
  constructor()
}

class CreateByClass2 {
  public name: string = 'yusong'
  constructor()
}

cosnt getRandomItem = () => {
	return Math.random() < 0.5 ? new CreateByClass1() : new CreateByClass2()
}

const item = getRandomItem()

if (item instanceof CreateByClass1) {
  console.log(item.age)
} else {
	console.log(item.name)
}
```

### null 和 undefined

> （1）不开启 nullcheck 模式的时候，null 和 undefined 是任意类型的子类型
>
> （2）以下四种联合类型是不一样的
>
> - string | undefined
> - string | null
> - string | undefined | null

```typescript
let values = "123";
values = undefined; // 没有开启nullcheck模式下，不会报错

// 开启nullcheck情况下，可选参数的类型和可选属性的类型会被加上undefined组成联合类型
const sumFunc = (x: number, y?: number) => {
  return x + (y || 0);
};
```

### 类型保护和类型断言

```typescript
// 类型保护，如果是含有null的联合类型或者是any类型这种不是唯一的类型
const getLengthFunc = (value: string | null): number => {
  // 以下两种方法都可以
  // if (value === null) return 0
  // else return value.length

  return (value || "").length;
};

// 类型断言
function getSplicedStr(num: number | null): string {
  function getRes(prefix: string) {
    return prefix + num!.toFixed().toString();
  }

  // 由于这一句在getRes函数后面执行，所以编译器无法判断是否为null，所以getRes里面给num加了一个不为null的断言
  num = num | 0.1;
  return getRes("yusong-");
}
```

### 类型别名

```typescript
type TypeString = string;
let str: TypeString;

// 使用泛型
type PositionType<T> = { x: T; y: T };
const p1: PositionType<number> = {
  x: 1,
  y: -1,
};
const p2: PositionType<string> = {
  x: "left",
  y: "top",
};
// 类型内使用该类型，即是树形结构
// 注意：只能在属性中使用
type Childs<T> = {
  current: T;
  child?: Childs<T>;
};
let c: Childs<string> = {
  current: "first",
  child: {
    current: "second",
    child: {
      current: "third",
    },
  },
};
```

> 注意：使用类型别名定义接口时，不能使用 extends、implements

#### 类型别名与接口是兼容的

```typescript
type Alias = {
  num: number;
};

interface Inter {
  num: number;
}

let _alias: Alias = {
  num: 123,
};
let _inter: Inter = {
  num: 321,
};

_alias = _inter; // 没有报错，是类型兼容的

// 当需要拓展的时候，即使用extends或者implements的时候，必须使用接口
// 当无法使用接口，并且需要使用联合类型或者元组类型的时候，用类型别名
```

### 字面量类型

> 字面量类型包含：字符串字面量、数值字面量

#### 字符串字面量

```typescript
type Name = "yusong";
const name: Name = "yusong";
const name1: Name = "haha"; // 报错
// 使用联合类型定义
type Direction = "north" | "east" | "south" | "west";
function getDirectionFirstLetter(direction: Direction) {
  return direction.substr(0, 1);
}
getDirectionFirstLetter("west"); // w
getDirectionFirstLetter("heihei"); // 报错
```

#### 数值字面量

```typescript
type Age = 18;
interface InfoInter {
  name: string;
  age: Age;
}

const info: InfoInter = {
  name: "yusong",
  // age: 20, // 报错
  age: 18,
};
```

### 枚举成员类型

参考上面枚举

### 可辨识联合

> todo 单例类型：枚举成员类型和字面量类型
>
> 单例类型、联合类型、类型保护和类型别名这几种类型合并，创建可辨识联合，也成为标签联合、代数数据类型
>
> 可辨识联合要求具备两个要素：
>
> - 具有普通的单例类型属性
> - 一个类型别名包含了哪些类型的联合

```typescript
interface Square {
  kind: "square";
  size: number;
}
interface Rectangle {
  kind: "rectangle";
  height: number;
  width: number;
}
interface Circle {
  kind: "circle";
  redius: number;
}
type Shape = Square | Rectangle | Circle;

// 满足的要素
// 1、具有普通的单例类型属性，即kind属性，作为可辨识特征
// 2、一个类型别名包含了哪些类型的联合，即Shape类型别名
function getArea(s: Shape): number {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
      break;
    case "rectangle":
      return s.height * s.width;
      break;
    case "circle":
      return Math.PI * s.radius ** 2;
  }
}

// 完整性检查
// 1、tsconfig.json开启nullcheck
// 像下面，如果少了一种情况，如果参数传入了Circle类型的参数，就会匹配不上，默认返回undefined，所以ts会报错
function getArea1(s: Shape): number {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
      break;
    case "rectangle":
      return s.height * s.width;
      break;
    // case 'circle': return Math.PI * s.radius ** 2
  }
}

// 2、使用never类型，定义一个函数
function assertNever(value: never): never {
  throw new Error("Unexpected object" + value);
}
function getArea2(s: Shape): number {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
      break;
    case "rectangle":
      return s.height * s.width;
      break;
    // case 'circle': return Math.PI * s.radius ** 2
    default:
      return assertNever(s); // 报错，需要把上一行注释放开
  }
}
```

## 高级类型（2）

### this 类型 todo

> 多态的 `this`类型表示的是某个包含类或接口的 _子类型_。 这被称做 _F_-bounded 多态性。 它能很容易的表现连贯接口间的继承。

```typescript
class Counter {
  constructor(public count: number = 0) {
    this.count = count;
  }
  public add(value) {
    this.count += value;
    return this;
  }

  public subtract(value) {
    this.count -= value;
    return this;
  }
}

const counter = new Counter(10);
// 可实现链式调用
console.log(counter.add(4).subtract(7)); // 7

class PowCounter extends Counter {
  constructor(public count: number = 0) {
    super(count);
  }

  public pow(value) {
    this.count = this.count ** value;
    return this;
  }
}

const p = new PowCounter(2);
consoloe.log(p.add(3).pow(2)); // 25
```

> 由于这个类使用了 `this`类型，你可以继承它，新的类可以直接使用之前的方法，不需要做任何的改变。
>
> 如果没有 `this`类型， `PowCounter`就不能够在继承 `Counter`的同时还保持接口的连贯性。 `add`将会返回 `Counter`，它并没有 `pow`方法。 然而，使用 `this`类型， `add`会返回 `this`，在这里就是 `PowCounter`。

### 索引类型

#### 索引类型查询操作符

> 连接一个类型，返回由这个类型的所有属性名组成的联合类型

```typescript
interface Infos {
  name: string;
  age: number;
}

let infoProp: keyof Infos; // infoProp的类型是Infos接口的属性名组成的联合类型："name" | "age"

infoProp = "name";
infoProp = "age";
infoProp = "sex"; // 报错

// 配合泛型约束
// 返回值为传入的ojb对象的属性值组成的数组
function getValue<T, K extends keyof T>(obj: T, props: K[]): Array<T[k]> {
  return props.map((p) => obj[p]);
}
const infoObj = {
  name: "yusong",
  age: 18,
};
let infoValues: Array<string | number> = getValue(infoObj, ["name", "age"]);
console.log(infoValues); // ['yusong', 18]
```

#### 索引访问操作符

> [] （索引访问操作符）

```typescript
// 例子一
interface Infos {
  name: string;
  age: number;
}

type NameTypes = Infos["name"];

// 例子二
function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
  return o[name];
}

// 例子三
interface Objs<T> {
  [key: string]: T;
}
const objs1: Objs<number> = {
  age: 18,
};
let key: Objs<number>["name"]; // 无论用索引访问操作符访问哪个属性，key都是number类型

// 例子四
interface Type {
  a: never;
  b: never;
  c: string;
  d: number;
  e: undefined;
  f: null;
  g: object;
}
// 所以访问操作符会返回除了never，undefined，null外的其他类型组成的联合类型
type Test = Type[keyof Type];
```

### 映射类型

#### 基础

```typescript
interface Info {
  age: number;
  name: string;
  sex: string;
}

type ReadonlyType<T> = {
  readonly [P in keyof T]: T[P];
};

type ReadonlyInfo = ReadonlyType<Info>;

const info: ReadonlyInfo = {
  age: 18,
  name: "yusong",
  sex: "man",
};
// info.age = 20 // 报错，readonly属性不能修改

// 内置映射类型
// Readonly Partial

// Pick Record
interface Info2 {
  name: string;
  age: number;
  address: string;
}
const info2: Info2 = {
  name: "yusong",
  age: 18,
  address: "shenzhen",
};
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const res: any = {};
  keys.map((key) => {
    res[key] = obj[key];
  });

  return res;
}

const nameAndAdree = pick(info2, ["name", "address"]);

// todo好好理解
function mapObject<K extends string | number, T, U>(
  obj: Record<K, T>,
  f: (x: T) => U
): Record<K, U> {
  const res: any = {};
  for (const key in obj) {
    res[key] = f(obj[key]);
  }

  return res;
}

const names = { 0: "name", 1: "123" };
const lengths = mapObject(names, (s) => s.length);
console.log(lengths);
```

#### 由映射类型进行推断

```typescript
type Proxy<T> = {
  get(): T;
  set(value: T): void;
};

type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>;
};

function proxify<T>(obj: T): Proxify<T> {
  const res = {} as Proxify<T>;
  for (const key in obj) {
    res[key] = {
      get: () => obj[key],
      set: (value) => (obj[key] = value),
    };
  }

  return res;
}

const props = {
  name: "yusong",
  age: 18,
};

const proxyProps = proxify(props);
proxyProps.name.set("huang");

function unProxify<T>(obj: Proxify<T>): T {
  const result = {} as T;
  for (const k in obj) {
    result[k] = obj[k].get();
  }

  return result;
}

const originProps = unProxify(proxyProps);
console.log(originProps);
```

#### 增加或移除特定修饰符

> 使用加号或者减号增加或者移除修饰符

```typescript
type Info = {
  name: string;
  age: number;
};

type Add<T> = {
  +readonly [P in keyof T]+?: T[P];
};

type AddInfo = Add<Info>;

type Remove<T> = {
  -readonly [P in keyof T]-?: T[P];
};

type RemoveInfo = Remove<AddInfo>;
```

#### keyof 和映射类型在 2.9 的升级

> 支持使用 number 和 symbol 作为属性名

```typescript
const stringIndex = "a";
const numberIndex = 1;
const symbolIndex = Symbol();

type Obj = {
  [stringIndex]: string;
  [numberIndex]: number;
  [symbolIndex]: symbol;
};

type KeyOfObj = keyof Obj;

type ReadonlyTypes<T> = {
  readonly [P in keyof T]: T[P];
};

const obj: ReadonlyTypes<Obj> = {
  a: "a",
  1: 1,
  [symbolIndex]: Symbol(),
};

obj.a = "123"; // 报错
```

#### 元组和数组上的映射类型

```typescript
type MapToPromise<T> = {
  [K in keyof T]: Promise<T[K]>;
};

type Tuple = [string, number, boolean];

type TupleToPromise = MapToPromise<Tuple>;

const tuple: TupleToPromise = [
  new Promise((resolve) => resolve("a")),
  new Promise((resolve) => resolve(1)),
  new Promise((resolve) => resolve(false)),
];
```

#### unknown

1. 任何类型都可以赋值给 unknown 类型

   ```typescript
   let value: unknown;
   value = "abc";
   value = 1;
   ```

2. 如果没有类型断言或基于控制流的类型细化时，unknown 是不可以赋值给其他类型，此时它只能赋值给 unknown 和 any 类型 todo!

   ```typescript
   let value: unknown;
   let value2: unknown;
   let value3: string = value2; // error
   value = value2; // ok
   ```

3. 如果没有类型断言或基于控制流的类型细化时，不能在他上面进行任何操作

   ```typescript
   let value: unknown;
   value += 2; // error
   ```

4. unknown 与任何其他类型组成的交叉类型，最后都等于其他类型

   ```typescript
   type type1 = string & unknown;
   type type2 = number & unknown;
   type type3 = unknown & unknown;
   type type4 = unknown & string[];
   ```

5. nuknown 与其他类型（除了 any）组成的联合类型，都等于 unknown 类型

   ```typescript
   type type1 = unknown | string;
   type type2 = any | unknown; // 还是any类型
   type type3 = number[] | unknown;
   ```

6. never 类型是 unknown 的子类型

   ```typescript
   // 条件类型，后续会讲到，与三元表达式类似
   type type1 = never extends unknown ? true : false; // true
   ```

7. keyof unknown 等于类型 never

   ```typescript
   type type9 = keyof unknown;
   ```

8. 只能对 unknown 进行等于或不但能操作，不能进行其他操作

   ```typescript
   let value1: unknown;
   let value2: unknown;
   value1 === value2;
   value1 !== value2;
   value1 += value2; // error
   ```

9. unknown 类型的值不能访问他的属性、作为函数调用和作为类创建实例

   ```typescript
   let value: unknown;
   value.age; // 报错
   value(); // 报错
   new value(); // 报错
   ```

10. 使用映射类型时，如果遍历的事 unknown 类型，则不会映射任何属性

    ```typescript
    type Type<T> = {
      [P in keyof T]: number;
    };
    type type1 = Type1<any>;
    type type2 = Type<unknown>; // type为{}类型
    ```

### 条件类型（v2.8 引入）

#### 基础

> T extends U ? X : Y 类似于三元表达式

```typescript
type Type2<T> = T extends string ? string : number;
let index: Type2<123>; // index类型为number
```

#### 分布式条件类型

> 当待检测的类型为联合类型时，该条件类型称为分布式条件类型，在实例化的时候 ts 会自动的分化为联合类型

```typescript
// 分布式条件类型例子
type TypeName<T> = T extends any ? T : never;
type Type3 = TYpeName<string | number>;

// 官方文档例子
type TypeName1 = T extends string
  ? string
  : T extends numebr
  ? number
  : T extends boolean
  ? boolean
  : T extends undefined
  ? undefined
  : T extends () => void
  ? () => void
  : object;

type Type4 = TypeName<() => void>; // Type4为函数类型
type Type5 = TypeName<string[]>; // Type5为object类型
type Type6 = TypeName<(() => void) | string[]>; // Type6 为函数类型与object类型组成的联合类型

// 实际例子
type Diff<T, U> = T extends U ? never : T;
type Text1 = Diff<string | number | boolean, undefined | number>; // Text1为string与boolean组成的联合类型

// 条件类型与映射类型结合的例子
type Type7<T> = {
  [K in keyof T]: K[T] extends Function ? K : never;
}[keyof T]; // 最后的方括号为索引访问类型，keyof使用方括号，则是返回属性值类型不为never的属性名
interface Part {
  id: number;
  name: string;
  subParts: Part[];
  undatePart(newName: string): void;
}
type Test1 = Type7<Part>; // Test1的类型为"undatePart"
```

#### 条件类型的类型推断-infer

> 如果是数组类型，则返回数组的元素的类型，否则返回原本的类型

```typescript
// 不使用infer
type Type8<T> = T extends any[] ? T[number] : T;
type Test3 = Type8<string[]>; // 为string类型
type Test4 = Type8<string>; // 为string类型

// 使用infer
type Type9<T> = T extends Array<infer U> ? U : T; // infer会推断出数组元素的类型，并记录在U中
type Test5 = Type9<string[]>;
type Test6 = Type9<string>;
```

#### TS 预定义条件类型

1. `Exclude<T, U>`

   > 返回 T 中不存在于 U 的类型

   ```typescript
   type Type = Exclude<"a" | "b" | "c", "c" | "a">; // 'b'
   ```

2. `Extract<T, U>`

   > 返回 T 中的类型可以赋值给 U 的类型

   ```typescript
   type Type = Extract<"a" | "b" | "c", "c" | "b">; // 'c' | 'b'
   ```

3. `NonNullable<T>`

   > 去掉 null 和 undefined 类型

   ```typescript
   type Type = NonNullable<string | number | null | undefined>; // string | number
   ```

4. `ReturnType<T>`

   > 返回函数返回值的类型

   ```typescript
   type Type13 = ReturnType<() => string>; // string
   ```

5. `InstanceType<T>`

   > 返回构造函数的实例的类型

   ```typescript
   class AClass {
     constructor() {}
   }
   type T1 = InstanceType<typeof AClass>; // AClass
   type T2 = InstanceType<typeof any>; // any 为任意类型的子类型
   type T3 = InstanceType<typeof never>; // never
   type T4 = InstanceType<string>; // 报错，因为string不是构造函数类型或者构造函数的子类型
   ```

## ES6 和 Nodejs 中的模块

### ES6 的模块

#### export

#### import

#### export default

#### import 和 export 的符合写法

### Node.js 的模块

#### exports

#### modules.exports

## ts 模块和命名空间

### 模块

#### export

#### import

#### export default

#### export = 和 import xx = require()

### 命名空间

#### 定义和使用

```typescript
namespace Validation {
  const isLetterReg = /^[A-Za-z]+$/;
  export const isNumberReg = /^[0-9]+$/;
  export const checkLetter = (text: string) => {
    return isLetterReg.test(text);
  };
}
```

#### 拆分为多个文件

### 别名

### 模块解析

#### 相对和非相对模块导入

#### 模块解析策略

#### 模块解析配置项

## 声明合并

### 补充知识

| 声明类型            | 创建了命名空间 | 创建了类型 | 创建了值 |
| ------------------- | -------------- | ---------- | -------- |
| namespace           | √              |            | √        |
| class               |                | √          | √        |
| enum                |                | √          | √        |
| interface           |                | √          |          |
| type alias 类型别名 |                | √          |          |
| function            |                |            | √        |
| variable            |                |            | √        |

### 合并接口

> 定义的非函数成员，不能重复，如果重复，类型必须一致，否则报错

```typescript
interface InfoInter {
  name: string;
  getRes(input: string): number;
}
interface InfoInter {
  age: number;
  getRes(input: number): string;
}
let info: InfoInter;
info = {
  name: "yusong",
  age: 18,
  getRes(text: any): any {
    if (typeof text === "string") {
      return text.length;
    } else {
      return String(text);
    }
  },
};
```

### 合并命名空间

```typescript
namespace Validations {
  export const numberReg = /^[0-9]+$/;
  export const checkNumber = () => {};
}

namespace Validations {
  // 因为合并了，并且上面导出了。这里可以访问到
  console.log(numberReg);
  export const checkLetter = () => {};
}
```

### 不同类型合并

#### 命名空间和类合并（类必须在命名空间的前面）

```typescript
class Validations {
  constructor() {}
  public checkType() {}
}
namespace Validations {
  // 最后合并为类的静态属性
  export const numberReg = /^[0-9]+$/;
}
console.dir(Validations);
console.dir(Validations.numberReg);
```

#### 命名空间和函数合并（类必须在命名空间的前面）

```typescript
function countUp() {
  countUp.count++;
}

namespace countUp {
  export let count = 0;
}

console.log(countUp.count);
countUp();
console.log(countUp.count);
countUp();
console.log(countUp.count);
```

#### 命名空间和枚举（不要求顺序）

```typescript
enum Colors {
  red,
  green,
  blue,
}

namespace Colors {
  export const yellow = 3;
}

console.log(Colors);
```

## 装饰器

### 基础

#### 装饰器定义

> 随着 TypeScript 和 ES6 里引入了类，在一些场景下我们需要额外的特性来支持标注或修改类及其成员。 装饰器（Decorators）为我们在类的声明及成员上通过元编程语法添加标注提供了一种方式
> 若要启用实验性的装饰器特性，你必须在命令行或 tsconfig.json 里启用 experimentalDecorators 编译器选项
> 装饰器为一个函数，或者是返回一个函数

```typescript
function setProp(target) {

}

// 使用@符号加函数名
@setProp
```

#### 装饰器工厂

```typescript
function setProp() {
  return function (target) {

  }
}

// 装饰器工厂，这里需要调用
@setProp()
```

#### 装饰器组合

> 注意装饰器调用的顺序，装饰器工厂函数的调用是从上往下的。装饰器工厂返回的装饰器和直接写的装饰器是从下往上执行的

```typescript
function setName() {
  console.log("get setName");
  return function (target) {
    console.log("setName");
  };
}
function setAge() {
  console.log("get setAge");
  return function (target) {
    console.log("setAge");
  };
}

@setName()
@setAge()
class Dec {}
```

#### 装饰器求值

> 类的定义中，不同声明上的装饰器是有规定的顺序的进行引用
> 首先是方法装饰器、参数装饰器、访问符装饰器、属性装饰器运用到每个实例成员上，然后是方法装饰器、参数装饰器、访问符装饰器、属性装饰器运用到每个静态成员上，再然后参数装饰器运用到构造函数上，最后类装饰器运用到类上

### 类装饰器

> 装饰器只有一个参数，就是构造函数

```typescript
// 1、
let sign = null
function setName(name: string) {
  return (target: new() => any) => {
    sign = target
    console.log(target.name) // 'ClassDec'
  }
}
@setName('yusong')
class ClassDec {
  constructor() {}
}
console.log(sign === ClassDec)
console.log(sign === ClassDec.prototype.constructor)


// 2、
function addName(constructor: new() => any) {
  constructor.prototype.name = 'yusong'
}

@addName
class ClassD {}
interface ClassD {
  name: string
}

const d = new ClassD()
console.log(d.name) // 会报错，需定义类的同名接口，通过类型合并解决该问题

// 3、通过装饰器返回一个类来修改类
// (1)最终得到的类是装饰器返回的类与被装饰类的结合
function classDecorator<T extends { new(...args: any[]) => {} }> (target: T) {
  return class extends target {
    public newProperty = 'new property'
    public hello = 'override'
  }
}

@classDecorator
class Greeter {
  public property = 'property'
  public hello: string
  constructor(m: string) {
    this.hello = m
  }
}
console.log(new Creeter('world'))

// (2)最终得到的类为，装饰器返回的类（等于把被装饰的类替换掉）
function classDecorator1(target: any): any {
  return class {
    public newProperty = 'new property'
    public hello = 'override'
  }
}

@classDecorator1
class Greeter1 {
  public property = 'property'
  public hello: string
  constructor(m: string) {
    this.hello = m
  }
}
console.log(new Creeter1('world'))
```

### 方法装饰器

> 处理类中的方法，可以处理方法的属性描述符，可以处理方法的定义
> 方法装饰器的参数有三个：
> 1、第一个
> (1)如果装饰的是静态成员，参数是类的构造函数
> (2)如果装饰的是实例成员，参数是类的原型对象
> 2、第二个是成员的名字
> 3、第三个是成员的属性描述符

> 属性描述符
> 对象的属性为函数时叫方法，定义方法是会伴随着三个属性描述符
> 1、configurable 可配置
> 2、writeable 可写
> 3、enumerable 可枚举

```typescript
interface Obj {
  [key: string]: any;
}
let obj: Obj = {
  name: "yusong",
};
Object.defineProperty(obj, "age", {
  value: 18,
  // writable: false,
  writable: true,
  configurable: false,
  enumerable: false,
});
Object.defineProperty(obj, "age", {
  value: 18,
  // writable: false,
  writable: false, // configurable: false，这里把writable改为true报错，但是重新赋值了age则不会报错
});
console.log(obj);
obj.age = 20; // writable: false,报错，不可写
console.log(obj);

for (const key in obj) {
  console.log(key); // enumerable: false，只打印name
}
```

#### 装饰器的基本使用

> 如果装饰器方法放回一个对象，该对象会覆盖属性的描述符

```typescript
function enumerable(bool: boolean) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    console.log(target, propertyName);
    descriptor.enumerable = bool;
  };
}
// 返回对象例子
// function enumerable(bool: boolean) {
//   return function(target: any, propertyName: string, descriptor: PropertyDescriptor) {
//     console.log(target, propertyName)
//     return {
//       value() {
//         return 20
//       },
//       enumerable: bool
//     }
//   }
// }

class ClassF {
  constructor(public age: number) {}
  // 在方法前面修饰
  @enumerable(false)
  public getAge() {
    return this.age;
  }
}

const classF = new ClassF(18);

for (const key in classF) {
  console.log(key);
}
```

### 访问器装饰器

> 即 get、set 方法，在获取或者设置属性值的时候触发
> 不能对同名的 set、get 方法分别使用装饰器，只能使用一个装饰器，即把 get 和 set 当做一个整体
> 访问器装饰器有三个参数，与方法装饰器一模一样
> 如果装饰器方法放回一个对象，该对象会覆盖属性的描述符

```typescript
function enumerable(bool: boolean) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    console.log(target, propertyName);
    descriptor.enumerable = bool;
  };
}

class ClassG {
  private _name: string;
  constructor(name: string) {
    this._name = name;
  }
  // 在访问器前面修饰
  @enumerable(true)
  get name() {
    return this._name;
  }
  // @enumerable(false)
  set name(name: string) {
    this._name = name;
  }
}

const classG = new ClassG("yusong");
for (const key in classG) {
  console.log(key); // 装饰器函数传不同的值打印不同
}
```

### 属性装饰器

> 属性装饰器有两个参数，与方法装饰器的前两个参数一样

```typescript
function printPropertyName(target: any, propertyName: string) {
  console.log(propertyName);
}

class ClassH {
  @printPropertyName
  name: string = "";
}
```

### 参数装饰器

> 有三个参数，前两个与方法装饰器一样
> 第三个参数为该参数在参数列表中的索引
> 参数装饰器的返回值会被忽略

```typescript
function required(target: any, propertName: string, index: number) {
  console.log(propertName, index);
}

class ClassI {
  name: string = "yusong";
  age: number = 18;
  getInfo(prefix: string, @required infoType: string) {
    return prefix + " " + this[infoType];
  }
}

interface ClassI {
  [key: string]: any;
}

const classI = new ClassI();
classI.getInfo("haha", "age");
```

## 混入

### 对象的混入

```typescript
interface A {
  a: string;
}

interface B {
  b: string;
}

let Aa: A = {
  a: "a",
};

let Bb: B = {
  b: "b",
};

// 交叉类型
let Ab: A & B = Object.assign(Aa, Bb);

console.log(Ab);
```

### 类的混入

```typescript
class ClassAa {
  isA!: boolean;
  funcA() {}
}

class ClassBb {
  isB!: boolean;
  funcB() {}
}

class ClassAB implements ClassAa, ClassBb {
  isA: boolean = false;
  isB: boolean = false;
  funcA!: () => void;
  funcB!: () => void;
  constructor() {}
}

function mixins(base: any, from: any[]) {
  from.forEach((fromItem) => {
    Object.getOwnPropertyNames(fromItem.prototype).forEach((key) => {
      base.prototype[key] = fromItem.prototype[key];
    });
  });
}

mixins(ClassAB, [ClassAa, ClassBb]);

const ab = new ClassAB();

console.log(ab);
```

## 其他重要更新（v3.3）

### async 函数以及 Promise

### tsconfig.json 支持注释

> 1.8 版本开始支持

### 动态导入表达式

> 2.4 版本开始支持

### 弱类型探测

> 2.4 版本引入，所有属性都为可选属性，即为弱类型。当给弱类型的值赋值时，如果这个值的属性跟弱类型定义的没有任何重叠时，就会报错。

```typescript
interface Info {
  name?: string;
  age?: number;
}

function printInfo(info: Info) {
  console.log(info);
}
const obj = { sex: "1" };
printInfo(obj); // 报错
```

### ...操作符

> 3.2 版本之前，只能作用于对象的类型。3.2 版本开始可以对泛型使用

```typescript
function mergeOptions<T, U extends string>(op1: T, op2: U) {
  return { ...op1, op2 };
}

console.log(mergeOptions({ name: "yusong" }, "age"));

function getExculdeProp<T extends { prop: string }>(obj: T) {
  const { prop, ...rest } = obj;

  return rest;
}

console.log(getExculdeProp({ prop: "haha", name: "yusong", age: 18 }));
```

## 声明文件

### 识别已有的 js 库的类型

#### 全局库

#### 模块化库

#### UMD 库

### 处理库声明文件

#### 模块插件或者 UMD 插件

> 官方有提供参考[例子](https://www.tslang.cn/docs/handbook/declaration-files/templates.html)，可以查看`modules.d.ts`、`modules.function.ts`、`modules.class.ts`、`modules.plugin.ts`

#### 修改全局的模块

```javascript
String.prototype.getFirstLetter = function () {
  return this[0];
};
```

> index.d.ts

```typescript
interface String {
  getFirstLetter(): string;
}
```

#### 使用依赖

```typescript
// 引入全局库
/// <reference types="monent" />

// 引入模块化库
import * as moment from "moment";
```

#### 快捷外部模块声明

```typescript
declare module "monent";
```

## tsconfig.json 配置详解

```json
{
  "compileOnSave": false, // 设置保存文件的时候自动编译
  "compilerOptions": {
    "incremental": true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
    "tsBuildInfoFile": "./buildFile", // 增量编译文件的存储位置
    "diagnostics": true, // 打印诊断信息
    "target": "ES5", // 目标语言的版本
    "module": "CommonJS", // 生成代码的模板标准
    "outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
    "lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
    "allowJS": true, // 允许编译器编译JS，JSX文件
    "checkJs": true, // 允许在JS文件中报错，通常与allowJS一起使用
    "outDir": "./dist", // 指定输出目录
    "rootDir": "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
    "declaration": true, // 生成声明文件，开启后会自动生成声明文件
    "declarationDir": "./file", // 指定生成声明文件存放目录
    "emitDeclarationOnly": true, // 只生成声明文件，而不会生成js文件
    "sourceMap": true, // 生成目标文件的sourceMap文件
    "inlineSourceMap": true, // 生成目标文件的inline SourceMap，inline SourceMap会包含在生成的js文件中
    "declarationMap": true, // 为声明文件生成sourceMap
    "typeRoots": [], // 声明文件目录，默认时node_modules/@types
    "types": [], // 加载的声明文件包
    "removeComments":true, // 删除注释
    "noEmit": true, // 不输出文件,即编译后不会生成任何js文件
    "noEmitOnError": true, // 发送错误时不输出任何文件
    "noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
    "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块
    "downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
    "strict": true, // 开启所有严格的类型检查
    "alwaysStrict": true, // 在代码中注入'use strict'
    "noImplicitAny": true, // 不允许隐式的any类型
    "strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量
    "strictFunctionTypes": true, // 不允许函数参数双向协变
    "strictPropertyInitialization": true, // 类的实例属性必须初始化
    "strictBindCallApply": true, // 严格的bind/call/apply检查
    "noImplicitThis": true, // 不允许this有隐式的any类型
    "noUnusedLocals": true, // 检查只声明、未使用的局部变量(只提示不报错)
    "noUnusedParameters": true, // 检查未使用的函数参数(只提示不报错)
    "noFallthroughCasesInSwitch": true, // 防止switch语句贯穿(即如果没有break语句后面不会执行)
    "noImplicitReturns": true, //每个分支都会有返回值
    "esModuleInterop": true, // 允许export=导出，由import from 导入
    "allowUmdGlobalAccess": true, // 允许在模块中全局变量的方式访问umd模块
    "moduleResolution": "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
    "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
    "paths": { // 路径映射，相对于baseUrl
      // 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
      "jquery": ["node_modules/jquery/dist/jquery.min.js"]
    },
    "rootDirs": ["src","out"], // 将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化，这也设置可以虚拟src和out在同一个目录下，不用再去改变路径也不会报错
    "listEmittedFiles": true, // 打印输出文件
    "listFiles": true// 打印编译的文件(包括引用的声明文件)
  },
  // 指定编译器需要排除的文件或文件夹
  "exclude": [
    "src/lib" // 排除src目录下的lib文件夹下的文件不会编译
  ],
  // 引入其他配置文件，继承配置
	"extends": "./tsconfig.base.json", // 把基础配置抽离成tsconfig.base.json文件，然后引入
  "files": [
    // 指定编译文件是src目录下的leo.ts文件
    "src/leo.ts"
  ],
  // 指定编译需要编译的文件或目录
  // * 匹配0或多个字符（不包括目录分隔符）
  // ? 匹配一个任意字符（不包括目录分隔符）
  // **/ 递归匹配任意子目录
  "include": [
    // "scr" // 会编译src目录下的所有文件，包括子目录
    // "scr/*" // 只会编译scr一级目录下的文件
    "scr/*/*" // 只会编译scr二级目录下的文件
  ],
  "references": [ // 指定依赖的工程
    {"path": "./common"}
  ],
  // 设置自动引入库类型定义文件(.d.ts)相关
  "typeAcquisition": {
    "enable": false, // 布尔类型，是否开启自动引入库类型定义文件(.d.ts)，默认为 false
    "exclude": ["jquery"], // 数组类型，允许自动引入的库名，如：["jquery", "lodash"]
    "include": ["jest"] // 数组类型，排除的库名
  }
}

// 更详细的配置
{
  "compilerOptions": {
    // 编译性选项
    "target": "ES5", // target用于指定编译之后的版本目标 version：'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020' or 'ESNext'
    "module": "CommonJS", // 用来指定要使用的模块标准，'none', 'CommonJS', 'AMD', 'UMD', 'System', 'ES6', 'ES2015', 'ESNext'
    "lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // lib用于指定要包含在编译中的库文件，如果你要使用一些ES6的新语法，你需要引入ES6这个库，或者也可以写ES2015。
    "allowJS": true, // allowJS设置的值为true或false，用来指定是否允许编译JS文件，默认是false，即不编译js文件
    "checkJs": true, // checkJS的值为true或false，用来指定是否检查和报告JS文件中的错误，默认是false
    "jsx": "preserve", // 指定jsx代码用于的开发环境：'preserve', 'react', 'react-native'
    "declaration": true, // declaration的值为true或false，用于指定是否在编译的时候生成".d.ts"声明文件。如果设为true，编译每个ts文件之后会生成一个js文件和一个.d.ts声明文件。但是declaration和allowJs不能同时为true。
    "declarationMap": true, // 值为true或false，指定是否为声明文件".d.ts"生成map文件。
    "sourceMap": true, // sourceMap的值为true或false，用于指定编译时是否生成sourceMap文件。
    "outFile": "./", // outFile用于指定将输出文件合并为一个文件，他的值为一个文件路径名，比如设置为"./dist/main.js"，则输出的文件为一个main.js文件。但是要注意，只有设置module的值为amd和system模块时才支持这个配置。
    "outDir": "./dist", // outDir用来指定输出文件夹，值为一个文件夹路径字符串，输出的文件都将放置在这个文件夹。
    "rootDir": "./", // 用于指定编译文件的根目录，编译器会在根目录查找入口文件，如果编译器发现以rootDir的值作为根目录查找入口文件并不会把所有文件加载进去的话就会报错，但是不会停止编译。
    "composite": true, // 是否编译构建引用项目
    "removeComments":true, // removeComments的值为true或false，用于指定是否将编译后的文件中的注释删掉，设为true的话即删掉注释，默认为false。
    "noEmit": true, // 不生成编译文件，这个一般很少用
    "importHelpers": true, // importHelpers的值为true或false，指定是否引入tslib里的辅助工具函数，默认为false。
    "downlevelIteration": true, // 当target为"ES5"或"ES3"，为"for-of"、"spread"和"destructuring"中的迭代器提供完全支持。
    "isolatedModules": true, // isolatedModules的值为true或false，指定是否将每个文件作为单独的模块，默认为true，他不可以和declaration同时设定。

    // 严格检查选项
    "strict": true, // strict的值为true或false，用于指定是否启动所有类型检查，如果设为true则会同时开启下面这几个严格类型检查，默认为false。
    "noImplicitAny": true, // noImplicitAny的值为true或false，如果我们没有为一些值设置明确的类型，编译器会默认认为这个值为any类型，如果将noImplicitAny设为true，则如果没有设置明确的类型会报错，默认值为false。
    "strictNullChecks": true, // strictNullChecks的值为true或false，当设置为true时，null和undefined不能赋值给非null或undefined类型的变量，别的类型的值也不能赋给他们，除了any类型，还有个例外就是undefined可以赋值给void类型
    "strictFunctionTypes": true, // strictFunctionTypes的值为true或false，用来指定是否使用函数参数双向协变检查，默认为false。
    "strictBindCallApply": true, // strictBindCallApply的值为true或false，设为true后会对bind、call和apply绑定的方法的参数的检测是严格检测的
    "strictPropertyInitialization": true, // strictPropertyInitialization的值为true或false，设为true后悔检查类的非undefined属性是否在构造函数中被初始化，如果要开启这项，需要同事开启strictNullChecks，默认为false
    "noImplicitThis": true, // 当 this表达式的值为any类型的时候，生成一个错误
    "alwaysStrict": true, // alwaysStrict的值为true或false，指定始终以严格模式检查每个模块，并且在编译之后的js文件中计入"use strict"字符串，用于告诉浏览器该JS为严格模式

    // 额外检测选项
    "noUnusedLocals": true, // noUnusedLocals的值为true或false，用于检查是否定义了但是没有使用变量，对于这一点的检测，使用ESLint可以在你书写代码的时候做提示，你可以配合使用。他的默认值为false。
    "noUnusedParameters": true, // noUnusedParameters的值为true或false，用于检查是否有函数体中没有使用的参数，这个也可以配合ESLint来做检查，默认值为false。
    "noFallthroughCasesInSwitch": true, // noFallthroughCasesInSwitch的值为true或false，用于检查wsitch中是否有case没有使用break跳出switch，默认为false。
    "noImplicitReturns": true, // noImplicitReturns的值为true或false，用于检查函数否有返回值，设为true后，如果函数没有返回值则会提示，默认为false。

    // 关于模块的选项
    "moduleResolution": "node", // moduleResolution用于选择模块解析策略，有"node"和"classic"两种类型 todo
    "baseUrl": "./", // baseUrl用于设置解析非相对模块名称的基本目录，相对模块不会受baseUrl的影响
    "paths": {
      "*": ["node_modules/@types", "src/typings"]
    }, // paths用于设置模块名到基于baseUrl的路径映射
    "rootDirs": ["src","out"], // rootDirs可以指定一个路径列表，在构建时编译器会将这个路径列表中的路径中的内容放到一个文件夹中。
    "typeRoots": [], // typeRoots用于指定声明文件或者文件夹的路径列表，如果指定了此项，则只有在这里列出的声明文件才会被加载
    "types": [], // types用于指定需要包含的模块，只有在这里列出的模块声明文件才会被加载进来。
    "allowSyntheticDefaultImports": true, // allowSyntheticDefaultImports的值为true或false，用来指定允许从没有默认导出的模块中默认导入。
    "esModuleInterop": true, // 允许export=导出，由import from 导入，通过为导入内容创造命名空间，实现CommonJS和ES模块之间的互操作性。
    "preserveSymlinks": true, // 不把符号链接解析为其真实路径，具体可以了解下webpack和nodejs的symlink相关知识。

    // sourceMap选项
    "sourceRoot": "", // sourceRoot用于指定调试器应该找到Typescript文件而不是源文件位置，这个值会被写进.map文件里面。
    "mapRoot": "", // mapRoot用于指定调试器找到映射文件而非生成文件的位置，指定map文件的根路径，该选项会影响.map文件中sources属性。
    "inlineSourceMap": true, // inlineSourceMap的值为true或false，指定是否将map文件的内容和js文件编译在同一个js文件中，如果设为true，则map的内容会以//## sourceMappingURL=然后接base64字符串的形式插入js文件底部。
    "inlineSources": true, // inlineSources的值为true或false，用于指定是否进一步将.ts文件的内容也包含到输出文件中。

    // 实验性选项
    "experimentalDecorators": true, // experimentalDecorators的值为true或false，用于指定是否启用实验性的装饰器特性。
    "emitDecoratorMetadata": true, // emitDecoratorMetadata的值为true或false，用于指定是否为装饰器提供元数据支持，关于元数据，也是ES6的新标准，可以通过Reflect提供的静态方法获取元数据，如果需要使用Reflect的一些方法，需要引入ES2015.Reflect这个库。
  },
  "files": [], // files可以配置一个数组列表，里面包含指定文件的相对或绝对路径，编译器在编译的时候只会编译包含在files中列出的文件。如果不指定，则取决于有没有设置include选项，如果没有include选项，则默认会编译根目录以及所有子目录中的文件。这里列出的路径必须是指定文件，而不是某个文件夹，而且不能使用* ? **/ 等通配符
  "include": [], // include也可以指定要编译的路径列表，但是和files的区别在于，这里的路径可以是文件夹，也可以是文件，可以使用相对和绝对路径，而且可以通配符。比如"./src"即表示要编译src目录下的所有文件以及子目录的文件。
  "exclude": [], // exclude表示可以排除的、不编译的文件，他也可以指定一个列表，规则和include一样，可以是文件也可以是文件夹，可以是相对路径或绝对路径，可以使用通配符。
	"extends": "", // extends可以通过指定一个其他的tsconfig.json文件路径，来继承这个配置文件中的配置，继承来的文件的配置会覆盖当期那文件定义的配置。TS在3.2版本开始，支持继承一个来自于Node.js包的tsconfig.json配置文件。
  "compileOnSave": false, // compileOnSave的值是true或false，如果设为true，在我们编辑了项目中文件保存的时候，编译器会根据tsconfig.json的配置重新生成文件，不过这个要编译器支持。
  "references": [], // 一个对象数组，指定要引用的项目
  // 设置自动引入库类型定义文件(.d.ts)相关
  "typeAcquisition": {
    "enable": false, // 布尔类型，是否开启自动引入库类型定义文件(.d.ts)，默认为 false
    "exclude": ["jquery"], // 数组类型，允许自动引入的库名，如：["jquery", "lodash"]
    "include": ["jest"] // 数组类型，排除的库名
  }
}
```

## 封装并发布一个 npm 包

## 为第三方库写声明文件

## TS+Express+Mysql 搭建后端服务

## TS-Vue 开发一个 Todo 应用
