# JavaScript 面向对象机制

[TOC]

## 概述

JavaScript中的对象是一个属性的无序集合，每个属性都有名字和值。因此可以把对象看为从字符串到值的映射，这与“散列”、“字典”、**"关联数组"**相似。实际上，经常将对象当作关联数组来使用。

但JavaScript中的对象可以从其他对象中继承属性，这个其他对象称为其**原型**。为了与继承过来的属性相区分，JavaScript将非继承属性称为**“自有属性”**。

JavaScript中的对象是引用类型、可修改的。

对对象的操作包括：创建、设置、查询、删除、测试、枚举

每个属性除了有名字和值之外，还有三个属性特性（property attribute）：

- writable（可写）：是否可以设置属性的值
- enumerable（可枚举）：是否可以在for/in循环中返回属性的名字
- configurable（可配置）：是否可以删除该属性，以及是否可以修改该属性特性

很多 JavaScript 内置对象拥有只读、不可枚举或不可配置的属性。不过，默认情况下，我们所创建对象的所有属性都是可写、可枚举和可配置的。·																																																																					



## 机制

### 原型

几乎每一个JavaScript对象都有另一个与之相关联的对象，这另一个对象被称为原型（prototype），并从原型中继承属性。

通过对象字面量创建的对象都有相同的原型——`Object.prototype`。使用构造函数创建的对象，它们的原型是`构造函数.prototype`。例如通过new Array()所创建的对象是以`Array.prototype`为原型的。

`Object.prototype`是为数不多的没有原型的对象，因为它不继承任何属性。而大多数内置构造函数的原型都是`Object.prototype`。因此通过new Array()创建的对象从`Date.prototype`以及`Object.prototype`中继承属性。

实际上对象通过其prototype属性创建了一个用于继承属性的链表，这被称作**原型链**。但是大多数对象都没有prototype属性，即便不能通过代码访问到对象的原型，JavaScript继承机制任然照常运作，这背后的工作原理就是元编程。







## 创建对象

### 对象字面量

~~~javascript
let book = {
    "main title" : "JavaScript",
    for : "all audiences",
    author : {
        firstname : "David",
        surname : "Flanagan"
    },
}
~~~

最后一个逗号会自动忽略，这是一种编程风格。每次对字面量求值都会创建一个新的、不一样的对象。



### 构造函数

new关键字后跟一个函数调用，将这个函数调用称为构造函数。JavaScript为内置对象提供了构造函数，我们也可以自己定义构造函数

~~~JavaScript
let o = new Object();
let a = new Array();
~~~

### Object.create()

Object.create()用于创建一个新对象，使用其第一个参数作为新对象的原型：

~~~javascript
let o1 = Object.create({x : 1, y : 2});
let o2 = Object.create(null);
let o3 = Object.create(Object.prototype);
~~~

注意o2将会创建没有任何属性的对象，甚至连prototype、toString属性都没有。而o3是一个普通的空对象。

Object还可以接受可选的第二个参数，用于描述新对象的属性。

> 可以用Object.create()对对象进行深复制。但是有副作用，即返回对象的原型是参数对象。

## 查询和设置属性

通过.或者[]来查询对象的属性，.访问符的右操作数必须是一个简单的标识符。而[]访问符，其中的操作数期望着字符串或者符号

~~~javascript
let o1 = {
    "cold water" : "MaiDong";
}
o1["cold water"] //只能通过这种方式访问到cold water属性，点访问符是不可以的
~~~



下面讨论继承对属性的影响。JavaScript对象除了有一组“自有属性”外，同时也从它们原型对象中继承了一组属性。**查询（读取）属性时会用到原型链。但是设置（写入）属性时却不影响原型链，即只会在原始对象上创建或设置属性，而不会修改该原型链中的对象，此时会屏蔽原型链中同名的属性（这是因为会优先找到它）。这是一个很重要的Javascript特性！！**

~~~javascript
let p = Object.create(Object.prototype);
p.y = 2;
let q = Object.create(p);
q.z = 3;

p.y = 10;
console.log(q.y);		//10
q.y = 1;
console.log(p.y)		//10
~~~



如果查询不到属性，则表达式返回undefined。但是继续查询null或undefined的属性是错误的，会抛出TypeErr异常。推荐使用?.运算符避免这种问题。



而且设置属性并不总是会成功的，以下情况会失败的

- 只读属性
- 对象原本没有该属性，且对象的extensible特性为false。

在严格模式下，设置属性失败会抛出TypeError，在非严格模式下，这些失败是静默的

## 删除属性

通过delete操作符从对象中移除属性，操作数应该是一个属性访问表达式。

~~~javascript
delete book.author
delete book["main title"];
~~~



delete操作符只会删除自有属性，不能删除继承属性以及configurable特性为false的属性。

## 测试属性 & 枚举属性 & 扩展对象 & 序列化对象

测试属性就是查询一个属性是否在该对象中，不管它的值是否为undefined。可以认为是查询（读取）属性的子步骤。

有in操作符、hasOwnProperty()、propertyIsEnumberable()来测试属性

~~~javascript
let o = {x : 1, y : undefined}
"x" in o 	//true
o.hasOwnProperty("x")	//对继承属性返回false
o.propertyIsEnumberable("x")		//在hasOwnProperty属性的基础上，进一步判断该属性是否可枚举
~~~





Object.keys()，返回对象可枚举、自有的、字符串类型的属性数组

Object.getOwnPropertyNames()，返回自有的、字符串类型的属性数组

Object.getOwnPropertySymbols()，返回自有的、符号类型的属性数组

Reflect.ownKeys()，返回自有的属性数组

它们先列出非负整数形式的字符串，再按添加顺序列出字符串类型的属性，最后按添加顺序列出符号类型的属性。



使用Object.assign()来**扩展对象**。该方法接受两个或多个对象作为其参数，第一个参数是目的对象，而其余参数都是源对象。它会把源对象中可枚举的自有属性（包括符号类型的属性）按参数顺序依次复制到目的对象，注意！同名属性会被覆盖。



**对象序列化（serialization）**是把对象的状态转换为字符串的过程，之后可以从中恢复对象的状态。

通过函数JSON.stringify()和JSON.parse()序列化和恢复JavaScript对象。JSON是JavaScript语法的子集。