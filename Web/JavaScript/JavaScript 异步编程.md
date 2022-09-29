# Javascript 异步编程

讽刺的是，虽然JavaScript提供了编写异步代码的语言特性（promise、async、await、for/await），但这些却没有一个是异步的。



JavaScript异步编程可以通过回调来实现的。先注册回调函数，然后当满足某种条件时回调函数就会被调用。典型的例子就是定时器。

另一个例子就是浏览器中的事件驱动模型，浏览器会为特定的事件注册回调函数，而事件发生时就会调用回调函数，这些回调函数称为**事件处理程序**或者**事件监听器**。

~~~JavaScript
let okay = document.querySelector(`#confirmUpdateDialog button.okey`);
okey.addEventListener('click', applyUpdate);		//使用addEventListener函数添加事件监听器，可以添加多个

let request = new XMLHyypRequest();
request.onload = HTTPOnolad						//在对象属性上添加事件监听器,只能添加一个

~~~

