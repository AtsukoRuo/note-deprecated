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



