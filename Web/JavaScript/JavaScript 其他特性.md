[TOC]

## 迭代器与生成器

### 迭代器

迭代器可用在

~~~javascript
for (let i of [1, 2, 3]) { }
let chars = [..."abcd"];
Math.max(...[1, 2, 3]);
~~~



**迭代器有两种使用方式**：

- 使用可迭代对象，此时解释器会自动帮你迭代。
- 使用迭代器对象，此时需要手动next迭代。



迭代器的工作原理必须涉及到以下三个对象

- 可迭代对象具有一个名为`Symbol.iterator`专用迭代器方法，且该方法返回迭代器对象
- **迭代器对象**，具有next()方法，且该方法返回迭代结果对象。**这是重点考虑的对象！！！**
- 迭代结果对象，具有value或done属性的对象。注意**value与done是互斥的**，value属性有定义，那么done属性未定义或者为false。如果done是true，那么value就是未定义的。

要迭代一个可迭代对象，首先解释器自动调用其迭代器方法Symbol.iterator获取一个迭代器对象。然会重复调用这个迭代器对象的next方法，直至返回done属性为true的迭代结果对象，否则返回value属性。

以上这些工作都是解释器自动完成的，使用时只需直接用可迭代对象即可。

~~~JavaScript
class Range {
	constructor(from, to) {
		this.from = from;
		this.to = to;
	}

	has(x) { return typeof x === "number" 
            && this.from <= x 
            && x <= this.to; }
    
	toString() { return `{x | ${this.from} <= x <= ${this.to}}`; }

	[Symbol.iterator]() {						//可迭代对象
		let next = Math.ceil(this.from);
		let last = this.to;						//以闭包的形式保存一些迭代信息！很重要的
		return {								//返回迭代器对象
			next() {
				return (next <= last) ?
					{value : next++}			//返回迭代结果对象
					: {done : true};
			},
			
			[Symbol.iterator]() { return this; }		//通常来说，迭代器对象本身也是可迭代对象
            return() { console.log("提前退出"); }
		};
	};
}
for (let x of new Range(1, 10)) console.log(x);
[...new Range(-2, 2)]
~~~



如果迭代器对象在next()返回done属性为true的迭代结果之前停止了（例如，break提前退出for/or循环、数组个数较少）,那么解释器会检查迭代器对象是否有return方法，如果有的话就调用它。这个return()方法必须放回一个迭代器结果对象。

### 生成器

**生成器是**是定义迭代器另一种方式，适用于迭代的值是计算结果的场景，而不是迭代某个数据结构中的元素值。而且生成器绝对不是上述迭器的语法糖！

生成器要配合yield语句使用。调用生成器的next()方法时，生成器函数会一直执行直到遇到yield表达式。然后yield关键字后的表达式会被求值，并且返回将该值给调用者，此时控制权转交给调用者。下一次调用生成器的next方法时，传递给next方法的参数会当作yield表达式的值，此时控制权转交给生成器。也就是说生成器和调用者是两个独立的执行流，它们交替传值和控制权。

~~~javascript
function* smallNumbers() {
	console.log("next() 第一次调用：参数被丢弃");
    let y1 = yield 1;
    console.log("next() 第二次调用，参数是", y1);
    let y2 = yield 2;
    console.log("next() 第二次调用，参数是", y2);
    let y2 = yield 3;
    console.log("next() 第二次调用，参数是", y3);
    return 4;
}

let g = smallNumbers();
let n1 = g.next("a");
console.log("生成器回送", n1.value);
let n2 = g.next("a");
console.log("生成器回送", n2.value);
let n3 = g.next("a");
console.log("生成器回送", n3.value);
let n4 = g.next("a");
console.log("生成器回送", n4.value);
~~~



生成器的返回值具有Symbol.iterator方法以及next()方法，该**返回值即是可迭代对象，也是迭代器对象**。

在函数名前添加*即可声明生成器，但是**不允许在任何箭头函数上声明生成器以及使用yield语句。**

~~~javascript
function *oneDigitPrimes() {
	yield 2;
	yield 3;
	yield 5;
}

let primes = oneDigitPrimes();			

primes.next().value;
primes.next().value;
primes[Symbol.iterator]().next().value;
primes.next().done;

[...oneDigitPrimes()]
for (let prime of oneDigitPrimes());

let f = function *() { }
let o = {
    *g() {}
    *[Symbol(' ')]() {}
}
~~~



下面是使用生成器的使用场景：

~~~javascript
function *fibonacciSequence() {
	let x = 0, y = 1;
	for (;;) {
		yield y;
		[x, y] = [y, x + y];
	}
}
//限制迭代的步骤
function *take(n, iterable) {
	let it = iterable[Symbol.iterator]();
	while (n-- > 0) {
		let next = it.next();
		if (next.done) return;
		else yield next.value;
	}
}
//多个迭代器交叉输出
function* zip(...iterables) {
	let iterators = iterables.map(i => i[Symbol.iterator]());
	let index = 0;
	while (iterators.length > 0) {
		if (index >= iterators.length) index = 0;
		let item = iterators[index].next();
		if (item.done) {
			iterators.splice(index, 1);
		} else {
			yield item.value;
			index++;
		}
	}
}
console.log([...zip(oneDigitPrimes(), "ab", [true])]);	

console.log([...take(5, fibonacciSequence())]);
~~~



yield *语句并不返回一个值，而是迭代可迭代对象并依次返回得到的每个值

~~~JavaScript
function *sequence(...iterables) {
    for (let iterator of iterables) {
		for (let item of iterator) yield item;
    }
}

function* sequence(...iterables) {
	for (let iterator of iterables) yield* iterator;
}
~~~



前面我们提及到value与done属性是互斥的，如果在生成器中返回值的话，那么value、done属性就同时有定义

~~~JavaScript
function *oneAndDone() {
	yield : 1;
    return "done";
}
[...oneAndDone()]	//正常迭代是获取不到返回值的

//必须通过显式调用next获取到返回值
let generator = oneAndDone();	
generator.next();				//{value : 1, done : false}
generator.next();				//{value : "done", done : true}
generator.next();				//{value : undefined, done : true}
~~~





## 模块

### 基于类、对象、和闭包

使用类和对象实现模块化是Javascript中常见且有用地技术，但是没有提供任何方式来隐藏模块内部实现细节。而基于闭包的模块可以在一定程度上隐藏实现细节：

~~~JavaScript
const BitSet = (function() {
   function isValid(set, n) { ... }			//私有实现细节
   function has(set, byte, bit) { ... }
   const BITS = new Uint8Array([1, 2]);
   return class BitSet extends AbstractWriteableSet {
     	...  //暴露给用户的方法
   };
}());
~~~





### 基于export、import

ES6模块与常规Javascript脚本有很多重要区别。最显著的区别就是在常规脚本中，顶级声明的变量会进入所有脚本共享的全局上下文中，而在模块中，每个文件都有自己的私有上下文。此外，模块自动应用严格模式，并且普通函数的this是undefined的，而浏览器和Node中的脚本都将this设置为全局对象。

ES6模块使用过特殊的`<script type="module">`标签添加到HTML页面的

要从ES6模块中导出常量、变量、函数、类，只需要在声明前加上export关键字即可。

~~~javascript
export const PI = Math.PI;
export function degressToRadians(d) { return d * PI / 180; }
export class Circle {
    constructor(r) { this.r = r; }
    area() { return PI * this.r * rhis.r; }
}
export {PI, degressToRadians, Circle};	//这里不是对象字面值
export default {PI, degressToRandians, Circle};	//这里时对象字面值，export defualt
~~~



如果一个模块中，您只需要导出一个对象，那么用export default代替export，此外，默认导出支持任意表达式。一个模块中同时使用exprot与exprot default虽然合法，但不常见。

**导出导入语句必须位于顶级声明中**，且可以声明提升



~~~javascript
import BitSet from './bitset.js'			//将bitset中的默认导出到bitset中
import {mean, stddev} from './stats.js';		//把stats.js中的mean、stddev导入
import Histogram, {mean, stddev} from './histogram-stat.js'	//同时导出默认导出值以及mean、stddev。 

import * as stats from "./stat.js"			//构建stat对象，并把所有属性导入到该对象中
import {reader as renderImage} from "./imageutils.js"		//重命名
import {default as Histogram, mean, stddev} from "./hostogram.stats.js";	//给默认导出命名为Histogram

export {
	layout as calculateLayout,
    render as renderLayout
};	//导出时重命名，这不是对象字面值
~~~



Javascript还支持再导出语法

~~~javascript
export {mean, mean as average} from "./stats/mean.js";	//再导出
export * from "./stat/mean.js"
export { default as mean } from "./stat/mean.js";	//将mean.js中的默认导出值当作mean再导出
export { mean as default } from "./stats/mean.js";		//将stats.js中的mean当作默认导出值再导出。
export {default} from "./stats/mean.js"
~~~



 ES6模块一个非常棒的特性就是**每个模块的导入都是静态的**，即会递归地加载所有模块





## API

> 为了好用，每种语言都必须有 个平台或标准库，用于执行包括基本输入和输出在内的基本操作。核 JavaScript 言定义了最小限度的 PI ，可以操作数值、文本、数组集合、映射等，但不包含任何输入和输出功能。输入和输出（以及更复杂的特性 ，如联网、存储和图形处理）是内嵌 JavaScript 的“宿主环境”的责任。浏览器是 JavaScript 最早的宿主环境，JavaScript 代码又有了另 个宿主环境——Node.js。Node 给予了 JavaScript 访问整个操作系统的权限，允许 JavaScript程序读写文件、通过网络发送和接收数据，以及发送和处理 HTTP 请求。

### 集合与映射

集合Set与数组类似，但与数组不同的是，集合没有索引或顺序，也不允许有重复的值

~~~JavaScript
let s = new Set();							//空对象
let t = new Set([1, s]);					//数组
let t1 = new Set(s);						//复制一个集合s
let unique = new Set("Mississippi")			 //可迭代对象
unique.size 			//4
s.add(1)				//添加时会获取当前参数值的快照，而不是对参数的引用
s.add([1, 2, 3])		//添加了一个数组，类型不同也是可以的
s.delete(1)			//删除成功
s.delete("1")		//删除失败返回false，因为没有成员“test”，这里是基于===比较的
s.clear()				//清空集合
~~~

### 正则表达式

### 日期与时间

~~~JavaScript
let now = new Date();		//获取当前时间
~~~



### 计时器

浏览器以及Node都支持setTimeout()、以及setInterval()函数，但是这两个函数至今也没进入javascript标准。

setTimeout是再指定的事件时间过后调用一个函数。注意该函数是非阻塞的，调用该函数在向注册中心提交该函数后立即返回。

setInterval是没经过一定时间就重复调用一次某个函数。这个函数页式非阻塞的

~~~JavaScript
setTimeout(()=>{console.log("Ready...");}, 1000);
~~~



上述两个函数都会返回一个值，这个值用在clearTimeout()或者clearInterval以取消使用setTimeout()注册的函数调用。

~~~JavaScript
let clock = setInterval(() => {
    console.clear();
    console.log(new Date().toLocaleTimeString());
}, 1000);
setTimeout(()=>{clearInterval(clock);}, 10000);
~~~



### Error类

Error类能够捕获Javascript的栈状态，栈跟踪信息会参数创建Error对象的地方，而不是throw语句抛出它的地方。Error有两个属性：message、name。message属性的值就是我们传给Error()构造函数的值，name是"Error"构造函数的名字。Node和现代浏览器都在Error对象上定义了stack属性，包含了栈跟踪信息。

Error还定义了它的子类，例如EvalError、RangeError。此外我们还可以根据需求，自定义我们的Error子类，一般更好封装自己程序的错误信息。例如HTTPError类

~~~javascript
class HTTPError extends Error {
	constructor(status, statusText, url) {
        super(`${status} ${statusText} : ${url}`);
        this.status = status;
        this.url = url
    }
}
let error = new HTTPError(404, "Not Found", "http://example.com/");
~~~



### 二进制数据



## 元编程

### 对象

每个属性除了有名字和值（value）之外，还有三个属性特性（property attribute）：

- writable（可写）：是否可以设置属性的值
- enumerable（可枚举）：是否可以在for/in循环中返回属性的名字
- configurable（可配置）：是否可以删除该属性，以及是否可以修改该属性特性，除了value属性以及writable由true修改为false
- value：属性的值

访问器的属性特性区别于数据属性的：

- get：
- set
- enumberable
- configurable

很多 JavaScript 内置对象拥有只读、不可枚举或不可配置的属性。不过，默认情况下，我们所创建对象的所有属性都是可写、可枚举和可配置的。·



使用属性描述符对象（property descriptor）获取并设置属性特性。

Object.getOwnPropertyDescriptor允许查询属性的特征。obj：需要从中获取信息的对象。propertyName：属性的名称。对于propertyName不存在或者继承过来的，该函数返回undefined

~~~javascript
let descriptor = Object.getOwnPropertyDescriptor(obj, propertyName);
//if no propertyName exists，then desriptor is set by undefined
//inherited proertyName is set by undefined too
let o = { attr : 2 };
let d = Object.getOwnPropertyDescriptor(o, "attr");		//d = { value: 2, writable: true, enumerable: true, configurable: true }
~~~

Object.defineProperty()可以修改对象的属性特性。如果对象中没有该属性，则自动添加该属性，此时若某个属性特性没指定，则默认是false的。

~~~javascript


let user = {};
Object.defineProperty(user, "name", {
    value : "John"
})

let p = Object.defineProperties({}, {
    x : {value : 1, writable : true, enumberable : true, configurable : true},
    y : {value : 1, writable : true, enumberable : true, configurable : true},
        get() {return Math.sqrt(this.x)},
        enumberable : true,
        configurable : true
    }
})
~~~



Object.preventExtensions()让对象不可扩展，即不允许向该对象添加属性。这项操作是不可逆的，而且给不可扩展对象的原型添加新属性，则不可扩展对象仍然会继承这些属性

Object.seal与object.preventExtensions类似，它不能给对象添加新属性，也不能删除或配置已有自有属性。Object.freeze会让对象不可扩展，也不能删除或配置已有自有属性，而且将所有的自有属性变为只读的，但这不影响访问器属性发挥作用。

### 反射与代理

一个 `Proxy` 对象包装另一个对象并拦截诸如读取/写入属性和其他操作，可以选择自行处理它们，或者透明地允许该对象处理它们。代理对象有一个局限性，就是它会抛弃包装对象的内部插槽或者内部方法，在某些情况下会导致错误，不过仍有补救的方法。

声明语法如下：

~~~javascript
let proxy = new Proxy(target, handler);
~~~

- target：是要包装的对象
- handler：`handler` —— 代理配置。带有“捕捉器”（“traps”，即拦截操作的方法）的对象。比如 `get` 捕捉器用于读取 `target` 的属性，`set` 捕捉器用于写入 `target` 的属性，等等。

对 `proxy` 进行操作，如果在 `handler` 中存在相应的捕捉器，则它将运行，并且 Proxy 有机会对其进行处理，否则将直接对 target 进行处理。此外，**代理对象不是被包装对象**，所以===它们并不相等，但是可以影响到包装对象。



~~~javascript
let target = {};
let proxy = new Proxy(target, {});
proxy.test = 5;
console.log(target.test);		//这里test不是继承属性，而是自有属性
console.log(proxy.test);
~~~



对于对象的大多数操作，Javascript规范中有一个“内部方法”，它**描述最底层的工作方式**。例如 `[[Get]]`，用于读取属性的内部方法，`[[Set]]`，用于写入属性的内部方法，等等。这些方法仅在规范中使用，我们不能直接通过方法名调用它们。

对于每个内部方法，此表中都有一个捕捉器：可用于添加到 `new Proxy` 的 `handler` 参数中以拦截操作的方法名称：

| 内部方法                | Handler 方法               | 何时触发                                                     |
| :---------------------- | :------------------------- | :----------------------------------------------------------- |
| `[[Get]]`               | `get`                      | 读取属性                                                     |
| `[[Set]]`               | `set`                      | 写入属性                                                     |
| `[[HasProperty]]`       | `has`                      | `in` 操作符                                                  |
| `[[Delete]]`            | `deleteProperty`           | `delete` 操作符                                              |
| `[[Call]]`              | `apply`                    | 函数调用                                                     |
| `[[Construct]]`         | `construct`                | `new` 操作符                                                 |
| `[[GetPrototypeOf]]`    | `getPrototypeOf`           | [Object.getPrototypeOf](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) |
| `[[SetPrototypeOf]]`    | `setPrototypeOf`           | [Object.setPrototypeOf](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) |
| `[[IsExtensible]]`      | `isExtensible`             | [Object.isExtensible](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible) |
| `[[PreventExtensions]]` | `preventExtensions`        | [Object.preventExtensions](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions) |
| `[[DefineOwnProperty]]` | `defineProperty`           | [Object.defineProperty](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty), [Object.defineProperties](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) |
| `[[GetOwnProperty]]`    | `getOwnPropertyDescriptor` | [Object.getOwnPropertyDescriptor](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor), `for..in`, `Object.keys/values/entries` |
| `[[OwnPropertyKeys]]`   | `ownKeys`                  | [Object.getOwnPropertyNames](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames), [Object.getOwnPropertySymbols](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols), `for..in`, `Object.keys/values/entries` |

JavaScript 强制执行某些不变量 —— 内部方法和捕捉器必须满足的条件。

其中大多数用于返回值：

- `[[Set]]` 如果值已成功写入，则必须返回 `true`，否则返回 `false`。
- `[[Delete]]` 如果已成功删除该值，则必须返回 `true`，否则返回 `false`。

还有其他一些不变量，例如：

- 应用于代理（proxy）对象的 `[[GetPrototypeOf]]`，必须返回与应用于被代理对象的 `[[GetPrototypeOf]]` 相同的值。换句话说，读取代理对象的原型必须始终返回被代理对象的原型。

捕捉器可以拦截这些操作，但是必须遵循上面这些规则。



下面给出get、set、ownKeys、apply的捕捉器用例：

要拦截读取操作，`handler` 应该有 `get(target, property, receiver)` 方法。

- target 目标对象
- property 目标属性名
- receiver 

~~~javascript
let numbers = [0, 1, 2];
//代理应该在所有地方都完全替代目标对象。目标对象被代理后，任何人都不应该再引用目标对象。否则很容易搞砸。
numbers = new Proxy(numbers, {
    get(target, prop) {
        if (prop in target) return target[prop];
        return 0;
    }
})
~~~



当写入属性时 `set` 捕捉器被触发。

`set(target, property, value, receiver)`：

- `target` —— 是目标对象，该对象就是 `new Proxy`的第一个参数。
- `property` —— 目标属性名称，
- `value` —— 目标属性的值，
- `receiver` —— 与 `get` 捕捉器类似，仅与 setter 访问器属性相关。



~~~JavaScript
let numbers = [];
numbers = new Proxy(numbers, { // (*)
  set(target, prop, val) { // 拦截写入属性操作
    if (typeof val == 'number') {
      target[prop] = val;
      return true;
    }
    return false;
  }
});
numbers.push(1); // 添加成功
numbers.push("test"); // TypeError（proxy 的 'set' 返回 false）
~~~



`Object.keys`，`for..in` 循环和大多数其他遍历对象属性的方法都使用内部方法 `[[OwnPropertyKeys]]`（由 `ownKeys` 捕捉器拦截) 来获取属性列表。

这些方法在细节上有所不同：

- `Object.getOwnPropertyNames(obj)` 返回非 symbol 键。
- `Object.getOwnPropertySymbols(obj)` 返回 symbol 键。
- `Object.keys/values()` 返回带有 `enumerable` 标志的非 symbol 键/值（属性标志在 [属性标志和属性描述符](https://zh.javascript.info/property-descriptors) 一章有详细讲解)。
- `for..in` 循环遍历所有带有 `enumerable` 标志的非 symbol 键，以及原型对象的键。



`apply(target, thisArg, args)` 捕捉器能使代理以函数的方式被调用：

- `target` 是目标对象（在 JavaScript 中，函数就是一个对象），
- `thisArg` 是 `this` 的值。
- `args` 是参数列表。

虽然闭包也可以捕捉函数的内部状态，但是用闭包进行包装后，就失去了对原始函数属性的访问，但是创建代理对象可以解决这个问题

~~~javascript
function delay(f, ms) {
	return function() {
        setImteout(() => f.apply(this, arguments), ms);
    }
}

function delay(f, ms) {
	return new Proxy(f, {
        apply(target, thisArg, args) {
			setImteout(() => f.apply(this, arguments), ms);
        }
    })
}
~~~



`Reflect` 是一个内建对象，可简化 `Proxy` 的创建。前面所讲过的内部方法，例如 `[[Get]]` 和 `[[Set]]` 等，都只是规范性的，不能直接调用。`Reflect` 对象使调用这些内部方法成为了可能。以下是执行相同操作和 `Reflect` 调用的示例：

| 操作                | `Reflect` 调用                      | 内部方法        |
| :------------------ | :---------------------------------- | :-------------- |
| `obj[prop]`         | `Reflect.get(obj, prop)`            | `[[Get]]`       |
| `obj[prop] = value` | `Reflect.set(obj, prop, value)`     | `[[Set]]`       |
| `delete obj[prop]`  | `Reflect.deleteProperty(obj, prop)` | `[[Delete]]`    |
| `new F(value)`      | `Reflect.construct(F, value)`       | `[[Construct]]` |
| …                   | …                                   | …               |

**对于每个可被 `Proxy` 捕获的内部方法，在 `Reflect` 中都有一个对应的方法，其名称和参数与 `Proxy` 捕捉器相同。**所以，我们可以在捕捉器中使用 `Reflect` 来将操作转发给原始对象。





下面我们说明一个很严重的问题

~~~javascript
let user = {
    _name : "Guest",
    get name() {
        return this._name;
    }
};

let userProxy = new Proxy(user, {
    get(target, prop, receiver) {
        return target[prop];
    }
});

let admin = {
    __proto__ : userProxy,
    _name : "Admin"
};

console.log(admin.name);
~~~

问：输出是什么？答：Guest，不是期望的Admin。这是因为return target[prop];此时调用getter时，this指向了target，即user。所以get捕捉器提供了receiver参数，保存正确的this。而getter不能被显式调用，因此不能使用call、apply方法。此时可以使用Reflect.get。综上，修正后的代码是：

~~~javascript
let userProxy = new Proxy(user, {
  get(target, prop, receiver) { // receiver = admin
    return Reflect.get(target, prop, receiver); // (*)
  }
});
~~~



许多内建对象，例如 `Map`，`Set`，`Date`，`Promise` 等，都使用了所谓的“内部插槽”。例如，`Map` 将项目（item）存储在 `[[MapData]]` 中。内建方法可以直接访问它们，而不通过 `[[Get]]/[[Set]]` 内部方法。所以 `Proxy` 无法拦截它们。这也就是Proxy的局限性。下面就是个例子

~~~javascript
let map = new Map();
let proxy = new Proxy(map, {});
proxy.set('test', 1);		//Error
~~~

在内部，一个 `Map` 将所有数据存储在其 `[[MapData]]` 内部插槽中。代理对象没有这样的插槽。Map.prototype.set方法试图访问内部属性 `this.[[MapData]]`，但由于 `this=proxy`，在 `proxy` 中无法找到它，只能失败。

这里是一种解决方法：

~~~javascript
let map = new Map();
let proxy = new Proxy(map, {
    get(target, prop, receiver) {
		let value = Reflect.get(...arguments);
        return typeof value == 'function' ? value.bind(target) : value;
    }
})
~~~



注意类的私有字段也是通过内部插槽实现的，JavaScript 在访问它们时不使用 `[[Get]]/[[Set]]`

~~~javascript
class User {
  #name = "Guest";
  getName() {
    return this.#name;
  }
}
let user = new User();
user = new Proxy(user, {});
alert(user.getName()); // Error
~~~

在调用 `getName()` 时，`this` 的值是代理后的 `user`，它没有带有私有字段的插槽。





### 其他

对象的prototype特性指向了对象的原型。对象的[[prototype]]是在对象创建时设定的。

可以通过getPrototypeOf获得对象的原型

~~~javascript
Object.getPrototypeOf({});		//Object.prototype
Object.prototpye.isPrototypeOf(o)	//判读o对象的原型是不是Object.prototype
Object.setPrototypeOf(o, p)		//设置对象o的原型为p
~~~

Javascript通过`__proto__`属性暴露对象的内部属性prototype。这个`__proto__`属性已经被废弃了

 

如果instanceof的右侧是一个有[Symbol.hasInstance]方法的对象，那么左操作数作为该方法的参数，表达式的值就是该方法的返回值。

~~~JavaScript
let uint8 = {
    [Symbol.hasinstance](x) {
        return Number.isInteger(x) && x >= 0 && x <= 255
    }
}
~~~





## 内部属性和内部方法

这些属性和方法由Javascript引擎所实现，JavaScript运行时没有直接暴露于这些内部插槽，并且内部方法仅限于ECMAScript规范文档与引擎，可以用`Reflect`对象间接访问这些内部方法。这些内部属性和方法在ECMAScript标准中通常以 `[[name]]` 这样的形式来表示。内部属性称为内插槽，它包含与该对象关联的值，以表示对象的某些状态。
