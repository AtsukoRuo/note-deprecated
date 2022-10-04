# JavaScript 函数式编程

[TOC]

## 函数的声明以及特点

函数的声明如下：

~~~javascript
function identifier(variable1, variable2, ...) {
    
}
~~~

Javascript函数的特点：

- 函数的声明语句会被“提升”到函数块的顶部

- 解释器会在执行函数声明所在块中的任何代码之前定义该函数，这点也与var变量不同。

- 在函数没有返回值或者return不带有表达式时，函数调用表达式将会是undefined。

- Javascript函数不支持重载，并且允许同名函数，这样做的话会屏蔽之前的函数。
- 每个调用有**调用上下文（invocation context）**，也就是**this关键字**的值，通过this可引用调用它的对象。**Javascript不允许给this赋值**。
- **JavaScript中的函数是对象，即一等公民**。而且最好将函数名理解为变量名



## 函数调用

Javascript可以通过以下五种方式调用函数

- 作为函数

	调用表达式包括求值为函数的函数表达式以及参数列表

	~~~JavaScript
	printprops({x : 1});	 //普通调用
	f?.(x);					//条件调用
	~~~

	在非严格模式下的函数调用，this指向全局对象。在严格模式下，this是undefined。这种规则作用于任何嵌套函数

	~~~JavaScript
	let o {
	    m : function() {
	        this			//object o
			function f() {
				this	//global object
	        }
	    }
	}
	~~~

	上述的例子被认为是Javascript设计上的严重缺陷，这可以通过箭头函数或者在外部函数中定义一个变量（通常命名为self）来保存this来修正这个问题。

- 作为方法

	如果函数表达式是属性访问表达式，那么该函数就作为方法来被调用。方法调用与函数调用有一个重要区别：调用上下文。方法调用的this是当前调用它的对象，函数体可以通过this引用这个对象。

	如果方法返回this，那么就可以支持一种被称为方法调用链（method channing）的编程风格

	~~~javascript
	new Square().x(100).y(100).fill("blue").draw();
	doStepOne().then(doStepTwo).then(doStepThree).catch(handleErrors)
	~~~

	

- 作为构造函数

  任何一个函数或方法前添加一个关键字new，那么他就是构造函数。构造函数有以下特性：

  - 若参数列表为空，则可以省略

  	~~~JavaScript
  	o = new Object();
  	o = new Object;
  	~~~

  - 调用上下文是当前新创建的对象。

  - 构造函数会在函数体末尾时隐式返回这个对象。也可以显式使用return语句返回某个对象，如果return没有返回值或者返回一个原始类型，那么会忽略这些而直接返回正在构造的对象。

    

- call、apply方法 

	因为每个JavaScript函数都是对象类型，所以函数也有方法。其中call、apply方法可以间接调用这个函数，下一节会介绍这些只是。

- Javascript隐式调用

	比如对象的getter、setter函数，toString、valueOf方法、迭代器、标签模板字面量、代理对象等



## 函数表达式以及箭头函数



**在函数表达式中，可以省略函数名**，此时不可递归。下面给出例子：

~~~JavaScript
const square = function (x) { return x * x; }
[3, 2, 1].sort(function (a, b) { return a  - b; });
~~~

函数表达式与函数声明的区别是

- 赋值给const、let不会有声明提升，它会限制函数的作用域
- 在某些场合下编码方便，但远不如箭头函数方便。





~~~javascript
const fun = () => { }

const fun = (x) => { }
const fun = x => { }

const fun = x => { return expression; }
const fun = x => expression;
const fun = x => {{value : x}};
//const fun = x => { value : x} 
~~~

只有在一个参数时才可以省略`()`。只有一条return语句时时，才可以省略`{}`与return关键字，但是返回对象字面值时不能省略`{}`。

箭头函数有两个区别于普通函数的特性：

- 从定义自己的环境中继承this关键字的值，而不是像一其他方式定义的函数那样定义自己的this
- 没有prototype属性。这就意味着箭头函数不能作为构造函数。





## 嵌套函数以及闭包

理解嵌套函数（不是函数表达式）的根本就是理解它们的变量作用域规则，这使得它们能够访问外层函数的变量，这就引出了一个重要特性——**闭包**。

JavaScript采用的是词法作用域（Lexical Scope，静态作用域），因此函数的作用域在函数定义时候就决定了。下面给出一个例子来说明这一点：

~~~javascript
let scope = "global scope";
function checkscope() {
	let scope = "local scope";
    function f() { return scope; }
    return f();
}


function checkscope2() {
	lset scope = "local scope";
    function f() { return scope; }
    return f;
}
checkscope();			//local scope
checkscope2()();		//local scope
~~~

这就是闭包惊人而强大的本质：他们会捕获函数定义所在的外部函数的局部变量（以及参数）。这也就是说，函数对象的内部状态不仅要包括函数代码，还要包括函数定义所在作用域的引用（外部变量），注意与闭包关联的作用域是“活的”，不会截取外部变量的静态快照，下面给出一个例子。

~~~javascript
function constfuncs() {
    let funcs = [];
    for (var i = 0; i < 10; i++) funcs[i] = () => i;
    return funcs;
}
let funcs = constfuncs();
funcs[5]()		//10 不是5
~~~



只有在定义函数和调用函数的作用域不同时，才要考虑闭包。

基于闭包，我们可以创建函数的私有属性，并限制外部对其的访问，此时只有内部函数对其有访问权。这点与直接在函数上定义的属性不同，因为这些属性会被外部访问到。

~~~javascript
let uniqueInteger = ( function() {
 	let counter = 0;
    return function() { return counter++; }
}());
uniqueInteger();

function counter(n) {
	return {
		get count() { return n++; },
		set count(m) {
			if (m > n) n = m;
			else throw Error("count can only be set to a larger value");
		}
	};
}

let c = counter(100);
c.count();
//c.n error


//为对象o添加类get、set函数。其中set函数有断言
function addPrivateProperty(o, name, predicate) {
	let value;
	o[`get${name}`] = function() { return value};
	o[`set$(name)`] = function(v) {
		if (predicate && !predicate(v)) {
			throw new TypeError(`set${name}: invalid value ${v}`);
		} else {
			value = v;
		}
	};
}
let o = {};
addPrivateProperty(o, "Name", x => typeof x === "string");
o.setName("Frank");
o.setName(0);
o.getName();
~~~





## 函数的参数

Javascript中不会对参数类型进行检查，甚至连参数的个数也不会检查。如果你想要进行类型检查，那么可以考虑语言扩展Typescript或者typeof操作符 + 注释 + 异常

~~~javascript
function sum(a) {
	for (let element of a) {
		if (typeof element !== "number")
    		throw new TypeError("sum(): elements must be numbers");
    }
}
~~~







如果实参个数少于形参个数，那么未赋值的形参将会得到默认值——undefined。



JavaScript支持默认参数，对于默认参数的位置并没有要求。甚至默认参数可以是变量或者前面的形参。默认参数在调用时求值，而不是在编译时求值。

~~~javascript
function fun(a = 10, b, c = 30) { }
const rectangle = (width, height = width * 2) => ({width, height});
~~~



剩余实参（rest parameter）用于接受多余的实参。剩余实参实质上就是一个数组，即使没有多余的实参，剩余实参也是个空数组而不是undefined。

~~~javascript
function max(first = -Infintiy, ...rest) {
	let maxValue = first;
    for (let n of rest) {
		if (n > maxValue) maxValue = n;
    }
    return maxValue;
}
~~~



此外还有arguments对象它包含全部的参数，他是一个类数组对象，但是不推荐使用，除非你要维护老项目。

~~~javascript
function f(a, b, c) {
    console.log(arguments);	//{ '0': 1, '1': 2, '2': 3, '3': 4, '4': 5 }
}

f(1, 2, 3, 4, 5);
~~~





可以在函数调用中使用扩展操作符，将可迭代对象分解为多个参数。

~~~javascript
let numbers = [5, 2, 10, -1, 9, 100, 1];
Math.min(...number);
~~~

甚至可以在函数的参数中使用解构赋值技术

~~~javascript
function vectorAdd([x1, y1], [x2, y2]) {
	return [x1 + x2, y1 + y2];
}

function vectorMultiply({x, y}, scalar) {
	return {x : x * scalar, y : y *scalar };
}
vectorAdd([1, 2], [3, 4]);
vectorMultiply({x : 3, y : 3}, 10);
~~~







## 函数式编程

下面考察一个函数式编程的例子

~~~javascript
const sum = (x, y) => x + y;
const square = x => x * x;
const map = function(a, ...args) { return a.map(...args); };	//消除面向对象的痕迹
const reduce = function(a, ...args) { return a.reduce(...args); };

let data = [1, 1, 2, 4, 5];
let mean = reduce(data, sum) / data.length;
let deviations = map(data, x => x - mean);
let stddev = Math.sqrt(reduce(map(deviations, square), sum) / (data.length - 1));

~~~



高阶函数就是操作函数的函数，他接受类型为函数的实参，并返回一个新函数，例如：

~~~javascript
function not(f) {
    return function(...args) {
		let result = f.apply(this, args);
         return !result;
    }
}
const even = x => x % 2 === 0;
const odd = not(even);
[1, 1, 3, 5, 5].every(odd);

function compose(f, g) {
	return function(...args) {
		return f.call(this, g.apply(this, args));
    }
}
const sum = (x, y) => x + y;
const square = x => x * x;
compose(square, sum)(2, 3);
~~~



下面介绍函数的柯里化

~~~javascript
function partialLeft(f, ...outerArgs) {
	return function(...interArgs) {
        let args = [...outerArgs, ...innerArgs];	//创建了一个闭包
        return f.apply(this, args);
    }
}
function partialRight(f, outerArgs) {
	return function(...interArgs) {
		let args = [...innerArgs, outerArgs];
        return f.apply(this, args);
    }
}

function partial(f, ...outerArgs) {
	return function(...innerArgs) {
		let args = [...outerArgs];
        let innerIndex = 0;
        for (let i = 0; i < args.length; i++) {
			if (args[i] === undefined) args[i] = innerArgs[innerIndex++];
            //预留出的位置，用innerArgs填充
        }
        args.push(...innerArgs.slice(innerIndex));
        return f.apply(this, args);
    }
}

const product = (x, y) => x * y;
const neg = partial(produce, -1);
const sqrt = partial(Math.pow, undefined, .5);
const reciprocal = partial(Math.pow, undefined, neg(1));

let data = [1, 1, 3, 5, 5];
let mean = product(reduce(data, sum), reciprocal(data.length));
let stddev = sqrt(product(reduce(map(data,
                                    compose(square,
                                           partial(sum, neg(mean)))),
                                sum),
                         reciprocal(sum(data.length, neg(1)))));

~~~



## 函数属性

函数是一种特殊的对象，因此它也有属性。

为函数添加属性可以定义函数的静态变量。

~~~javascript
unqueInteger.counter = 0;		//函数声明会提升，因此在这里定义函数的属性是没有问题的

function uniqueInteger() {
	return uniqueInteger.counter++;
}
~~~



函数的length属性是只读属性，表示函数形参的个数，但不考虑剩余参数。

除了箭头函数，所有函数都有一个prototype属性，这个属性引用函数的原型对象。因此箭头函数本身没有this、需要从外层对象中继承this值。

call、apply方法将this调用上下文设置为第一个参数值，剩余的参数作为实参传递给被调用函数。值得注意的是，箭头函数本身没有this值，所以它会忽略掉第一个参数。

~~~javascript
f.call(o);
f.apply(o);
//等价于
o.m = f;		
o.m();
delete o.m;

f.call(o, 1, 2, 3);
f.apply(o, [1, 2, 3]);
~~~



bind方法

~~~javascript
function f(y) { return this.x + y; }
let o = {x : 1};
let g = f.bind(o);
g(2)				//3
let p = {x : 10, g1 : g};
p.g1(2);			//3
~~~

如果在函数f上调用bind方法，并且传入对象o，这个方法f会返回一个新的函数，这个新函数的this会永远绑定到对象o上，即使apply、call也改变不了。箭头函数是从定义他们的环境中继承this值，且这个值不能被bind覆盖，所以绑定并不起作用。不过，由于调用bind函数最常见的目的是让非箭头函数变得像箭头函数，因此这个限制通常也不是问题。

此外bind的额外参数用于固定方法f的参数值，这可以实现柯里化（currying）

~~~javascript
let sum = (x, y) => x + y;
let succ = sum.bind(null, 1);
succ(2)				//x = 1
~~~





Function构造函数可以允许在运行时动态创建和编译Javascript函数。而且它创建的函数不适用词法作用域，而是始终编译为如同顶级函数那样

~~~javascript
let scope = "global";
function constructFunction() {
    let scope = "local";
    return new Function("return scope");
}
constrcutFunction()()	//global
~~~



## 





