# Java

## 基础语法

### 数据类型

1. int 整数，取值范围在 -2^31 ~ 2^31

### 标示符

- 由大小写英文字符，数字和下划线_组成的，区分大小写的，不以数字开头的文字
- 可以用作Java中的各种东西的名字，比如类名、方法名等
- 标示符是区分大小写的

```java
public class MathCalc {
  public static void main(String[] args) {
    // a 就是标示符，也可以理解为js的变量
    int a = 3
  }
}
```

### 字面值

```java
public class MathCalc {
  public static void main(String[] args) {
    // 3 就是字面值，可以理解为js中的值 
    int a = 3
  }
}
```

### 关键字

关键字是java语法的保留字，不能用来做名字

- public
- void
- class
- int


### 表达式（expression）

java 中最基本的一个运算。比如一个加法运算表达式 `1+2`是一个表达式，`a+b`也是

```java
// 表达式
int a

// 赋值表达式
a = 0
int b = 0

```

### 语句（statement）

类似于平时说话时的一句话，由表达式组成，以`;`结束。

int a = 3; y = a +9; System.out.println(y); 都是语句

```java
int a = 0;

int b;
b = 0;
```

### 代码块

一对大括号括起来的就是一个代码块，代码块里面可以包含0个或多个语句

### 注意点

#### Java 是区分大小写的

- `关键字`和`标示符`都是区分大小写的
- `类名`必须与`文件名`一致，包括大小写要求
- 使用`变量`时，`名字`必须和`声明变量时的标示符`大小写一致
- `方法名`也区分大小写。main 和 Main 是两个名字
- `类型`也是区分大小写的，int 是数据类型， Int则不是
- `System.out.println` 可以被 Java 识别， SYSTEM.Out.Println 就不可以

#### 字面值不简单

- 整数的字面值类型默认是 `int`
- 超过 int 的范围会怎么样？`需要使用取值范围更大的数据类型`

### 思考题

1. int x = 5; int y = x + 1;包含多少个语法点

- int x = 5;
 - 关键字 int
 - 标示符 int、x
 - 运算符 = 
 - 字面值 5
 - 数据类型，Java 中的数据都是有数据类型的，数据类型有其取值范围
 - 变量的创建和赋值

2. int y = x + 1;

- 除上面列出来的
- 变量的使用，标示符区分大小写
- 加法运算符
- 表达式，语句和代码块（上面没有写出大括号）


## 基本数据类型

### 认识二进制

- 十进制
  - 每一位可以是0~9折10个值，到10进位。一百用十进制十进制表示就是100，十就是10

- 二进制
  - 每一位可以是0和1这两个值，到2进位。一百用二进制表示就是1100100，十就是1010

- 十六进制
  - 每一位可以是0~F这十六个值，到16进位。一百用十六进制表示就是64，是就是A

- bit 和 byte
  - 一个二进制的位叫做一个 bit。网络带宽中的单位，都是 bit
  - 八个二进制的位，组成一个 byte。硬盘等存储的单位，都是 byte
  - byte 是计算机中基本的衡量存储的单位，计算机在对外使用时不会用 bit 作为划分存储的单位


### 数字的基本数据类型

- 整数类型

  - byte 占用1个 byte，值域是-128~127
  - short 占用2个byte，值域是-32768~32767
  - int 占用4个 byte，值域是-2147483648~2147433647。Java 中整数缺省是 int类型
  - long 占用8个 byte， 值域是-9223372036854774808 ~ 9223372036854774307

- 浮点（小数）类型

  - float 占用4个byte，有精度 ，值域复杂 ±340282346638528859811704183484516925440
  - double 精度是float 的两倍 ，占用8个byte。java 中浮点数缺省是double类型

- 符号位


### 布尔和字符串数据类型

- boolean 占用1个 byte，值域是 true，false
- chart 占用2个 byte，值域是所有字符

```java
public class MathCalc {
  public static void main(String[] args) {
    System.out.println('A');
    System.out.println("ABC");
  }
}
```

> 注意：`一个字符`需要用`单引号`引起来，而`字符串`则需要用`双引号`引起来

### 使用各种基本数据类型

```java
public class MathCalc {
  public static void main(String[] args) {
    byte byteVar = 127;
    System.out.println(byteVar);

    short shortVar = 30000;
    System.out.println(shortVar);

    int intVar = 99;
    System.out.println(intVar);

    long longVar = 999999999;
    System.out.println(longVar);
    long bigLongVar = 99999999999999L;
    System.out.println(bigLongVar);

    float floatVar = 100.1111111111F;
    System.out.println(floatVar);

    double doubleVar = 100.1111111111;
    System.out.println(doubleVar);

    boolean condition = true;
    System.out.println(condition);
    boolean fcondition = false;
    System.out.println(fcondition);

    char charVar = 'A';
    System.out.println(charVar);
  }
}

```

- 例程

- L后缀

- 感受浮点数精度

- 帧数缺省是 int 类型，浮点数缺省是 double 类型

- 编译错误的定位与修正





## 环境搭建和工具使用

## 编程语言基础

## 编程语言和概念难点解析


## 常用库（工具箱）


## 面相对象的思想


## 各种大小练兵的例子


## 做出一个小游戏
