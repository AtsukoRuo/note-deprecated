# Javascript 异步编程

[TOC]

## 概述

讽刺的是，虽然JavaScript提供了编写异步代码的语言特性（promise、async、await、for/await），但这些却没有一个是异步的，**因为Javascript是单线程的**。



JavaScript异步编程可以通过回调来实现的。**先注册回调函数**，然后当满足某种条件时回调函数就会被解释器自动调用。典型的例子就是定时器。

另一个例子就是浏览器中的事件驱动模型，浏览器会为特定的事件注册回调函数，而事件发生时就会调用回调函数，这些回调函数称为**事件处理程序**或者**事件监听器**。

~~~JavaScript
let okay = document.querySelector(`#confirmUpdateDialog button.okey`);
okey.addEventListener('click', applyUpdate);		//使用addEventListener函数添加事件监听器，可以添加多个

let request = new XMLHyypRequest();
request.onload = HTTPOnolad						//在对象属性上添加事件监听器,只能添加一个

~~~



回调函数不是异步编程，但异步编程一定是基于回调函数之上的。宿主环境提供一些API，封装系统的多线程库来供用户使用，例如setInterval。真正的异步代码会将我们的回调函数注册在某个地方。

## Promise

Promise期约是一种简化异步编程而设计的核心语言特性。



为什么要使用期约？

- 基于回调的异步编程进程会出现回调多层嵌套的情况，导致代码难以阅读，这种现象被称为**回调地狱**。而基于期约的异步编程可以让这种嵌套以一种线性期约链的形式表达出来。例如

	~~~JavaScript
	fetch(theURL)
		.then(callback1)
		.then(callback2)
	~~~

- 回调破坏了异常处理机制，因为调用回调函数时，它的调用者已经不在调用栈中，使得异常没办法抛出给异步操作的发起者，一个补救的方法就是使用C语言风格的异常处理。期约在异常处理这方面做得很好。



期约对象有两个**不可访问的**内部属性：**result**、**state**。其中result表示异步操作的计算结果，而state表示期约对象当前的状态，它的状态有：

- **fulfill：期约已兑现**，在执行器中调用resolve方法，或者在then方法中返回
- **reject：期约拒绝**，在执行器中调用reject方法，或者在then方法中抛出异常
- **pending：期约待定**，此时期约即没有兑现，也没有拒绝
- **settle：期约落定**，此时期约已兑现或者被拒绝

期约对象的result只能在then方法以及await表达式中隐式获取，但是从await获取值需要同步代码，而then方法返回期约对象，对于同步代码来说没有什么用。



**期约对象有一个then方法**，接受两个回调函数作为其两个参数，并注册这两个回调函数，其**返回值为新的期约对象**。如果解释器监听到到当期约对象从pending状态转变为fulfill状态，那么Javascript解释器就会调用then方法第一个参数指定的回调函数（**这是一个微任务**）。若转变为reject状态，则调用then方法第二个参数指定的回调函数。

在执行回调函数时，首先再将对象状态转变为pending

如果回调函数正常返回，那么新的期约对象的result属性为返回值，而state为fulfill，注意如果返回一个期约对象

如果回调函数返回一个期约对象，那么新的期约对象就是这个返回期约对象。

如果回调函数抛出异常，那么期约对象的result属性为异常对象，而state为reject。最后返回这个期约对象。实际上，生产环境中几乎不会使用then的第二个参数，通常用catch()方法来处理被拒绝的期约对象。

**期约的catch(c)方法实际上就是then(null, c)的简写**。**期约的finally(t)方法实际上就是then(t,t)的简写**。

从以上叙述，我们可知：

- 当一个 promise 被 reject 时，控制权将**直接**移交至最近的 rejection 处理程序。

再补充一点，**期约对象的内部属性result会传递回调函数**。



**如果一个 promise 的 reject 未在微任务队列为空之前进行处理，则会出现“未处理的 rejection”事件。**在任何情况下我们都应该有 `unhandledrejection` 事件处理程序（用于浏览器，以及其他环境的模拟），以跟踪未处理的 error 并告知用户（可能还有我们的服务器）有关信息。

~~~JavaScript
window.addEventListener('unhandledrejection', function(event) {
  // 这个事件对象有两个特殊的属性：
  alert(event.promise); // [object Promise] —— 生成该全局 error 的 promise
  alert(event.reason); // Error: Whoops! —— 未处理的 error 对象
});

new Promise(function() {
  throw new Error("Whoops!");
});
~~~



## 创建期约对象

使用Promise()构造方法来创建一个期约对象

~~~javascript
let promise = new Promise(function(resolve, reject) { });
~~~

传递给new Promise的函数被称为执行器（executor）。而执行器的resolve与reject两个参数是由JavaScript解释器预定义的回调函数，我们无需定义。调用resolve(value)，则从执此时期约对象的内部属性result就是resolve(value)，state内部属性就是fulfilled。调用reject(err)，则执行器立即完成，期约对象的内部属性result是error，状态是rejected。

执行器中不要用return或者new操作符，而且只能执行一次resolve或者reject，其余的将会被忽略掉。那么**不能使用期约表示重复的异步计算**，例如setInterval()、HTML的button上多次点击。

`Promise.resolve(value)` 用结果 `value` 创建一个 resolved 的 promise。

`Promise.reject(error)` 用 `error` 创建一个 rejected 的 promise。



## 期约API



`Promise.all`接受一个可迭代对象并返回一个新的期约对象，当所有给定的promise都resolve时，新的promise才会resolve。此时，新promise的result就是一个结果数组，结果数组内的元素就是promise的result或者原始值。注意可迭代对象中的元素未必都是期约对象，可以是其他值，那么它将被“按原样”传递给结果数组。

如果任意一个promise为reject，那么该函数立即结束，那么可能有些promise处于pending状态，其值未确定。

~~~JavaScript
let urls = [
  'https://api.github.com/users/iliakan',
  'https://api.github.com/users/remy',
  'https://api.github.com/users/jeresig'
];

// 将每个 url 映射（map）到 fetch 的 promise 中
let requests = urls.map(url => fetch(url));

// Promise.all 等待所有任务都 resolved
Promise.all(requests)
  .then(responses => responses.forEach(
    response => alert(`${response.url}: ${response.status}`)
  ));
~~~



 `Promise.allSettled`与`Promise.all`类似，但是其中一个期约对象reject时，该函数不会立即返回，而且结果数组中的元素具有以下形式：

- `{status:"fulfilled", value:result}` 
- `{status:"rejected", reason:error}`



与 `Promise.all` 类似，但只等待第一个 settled 的 promise 并获取其结果（或 error）。

与 `Promise.race` 类似，区别在于 `Promise.any` 只等待第一个 fulfilled 的 promise。如果给出的 promise 都 rejected，那么返回的 promise的result就是带有AggregateError函数类型的error。

## 期约化



最后讲一下期约化，它是将一个接受回调的函数转换为一个返回 promise 的函数。机理如下：

~~~JavaScript
function promisify(f, manyArgs = false) {
  return function (...args) {
       
    return new Promise((resolve, reject) => {
        //promisify 假设原始函数期望一个带有两个参数 (err, result) 的回调。这就是我们最常遇到的形式
        //回调函数的参数通常由使用回调的函数填写的
      function callback(err, ...results) { // 我们自定义的 f 的回调
        if (err) {
          reject(err);
        } else {
          // 如果 manyArgs 被指定，则使用所有回调的结果 resolve
          // 相当于中转，将参数中转到then方法中的回调函数。
          resolve(manyArgs ? results : results[0]);
        }
      }
        
	 //当函数f期约化后，原本所需的回调函数就需要放在then方法当中而空缺了一个参数，所以这里故需要补充上去
      args.push(callback);
      f.call(this, ...args);
    });
  };
}
// promisify(f, true) 来获取结果数组
// 用法：
f = promisify(f, true);
f(...).then(arrayOfResults => ..., err => ...);
~~~



## async/await

有了 `async/await` 之后，我们就几乎不需要使用 `promise.then/catch`，但是不要忘了它们是基于 promise 的

async关键字放置再一个函数的前面：

~~~JavaScript
async function f() {
    return 1;
}

async function f(x) { }

function f(x) {
	return new Promise(function(resolve, reject)) {
		try {
         	resolve(function(x){}(x));
		} catch(e) {
            reject(e);
        }
    }
}
~~~

async表示这个函数总是返回一个promise，如果返回值是期约对象，则直接返回。如果返回值是其他类型，则将其他值自动包装在一个resolved的promise中。如果抛出异常且在函数内未能捕捉则返回rejected的promise。



所以以下是等价的

~~~JavaScript
async function f() {
    return 1;
}
async function f() {
	return Promise.resolve(1);
}
~~~

await关键字只能再async函数中或者在浏览器的moudules顶层中使用。如果不支持moudules，那么可以使用匿名表达式

~~~javascript
(async ()=> {
    let response = await fetch('/articl/promise');
})();
~~~



await将求值后面的表达式，然后将await后面的代码加入到microtask中，然后就会跳出整个async函数来执行后面的代码，当期约对象落定后，将期约对象的result当作表达式的值，继续执行之后的代码，**即await与其他代码是同步的**。await关键字只对期约对象、async函数、Thenable对象起作用，其他情况就直接忽略await关键字。

Thenalbe对象内提供then方法，该方法接受resolve，reject。此时必须在then方法中调用resolve或者reject，以恢复await表达式的执行。否则会一直冻在await表达式处。

~~~JavaScript
class Thenable {
    constructor(num) { this.num = num; }
    then(resolve, reject) { setTimeout(()=>resolve(this.num * 2), 1000);}
}
async function f() { let result = await new Thenable(1); }
f();
~~~

await可以拆分期约链，使得代码编写的更优雅



await表达式求值出reject期约对象，那么直接以期约对象的result抛出异常

~~~javascript
async function f() {
	await Promise.reject(new Error("Whoops!"));
}
async function f() {
	throw new Error("Whoops!");
}

//处理异常
async function f() {
	try {
        let response = await fetch('/no-user-here');
	} catch(err) {
	
    }
}

f().catch()			//async f()必定会返回一个期约对象
~~~



## 异步迭代

异步迭代与迭代器的原理是一样的，但需要注意：

- 使用Symbol.asyncIterator取代Symbol.iterator，这样使用不了可扩展操作符了...
- next方法应该返回一个Pormise对象，使用关键字async可以轻而易举地做到这一点
- 必须使用`for await(let ietm of iterable)`循环迭代这样的对象。`for await`与其他代码是同步关系。因此需要在async函数中使用。

同时Javascript支持异步generator语法，只需在生成器前添加async即可。

~~~javascript
async function* generateSequence() { }
let o = {
    async *[Symbol.asyncIterator]() { }
}
for await(let item of generateSquenece());
~~~



对于异步generator、它的next方法也是异步的，返回promise，因此在一个异步 generator 中，我们应该添加 `await` 关键字，像这样：

~~~JavaScript
result = await generator.next(); 
~~~



下面我们来看一个实际的用例：分页数据

~~~JavaScript
//例如，GitHub 允许使用相同的分页提交（paginated fashion）的方式找回 commit：

//我们应该以 https://api.github.com/repos/<repo>/commits 格式创建进行 fetch 的网络请求。
//它返回一个包含 30 条 commit 的 JSON，并在返回的 Link header 中提供了指向下一页的链接。
//然后我们可以将该链接用于下一个请求，以获取更多 commit，以此类推。


~~~

