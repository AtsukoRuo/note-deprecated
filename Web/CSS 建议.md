# CSS 建议

[TOC]

## 响应式设计

响应式三大原则：

- 移动优先：最先实现移动版的布局，然后**"渐进增强"（progressive enhancement）**到桌面版的布局。编写移动端页面时，要以内容为主的，这样才能满足移动端用户的需求。
- @media规则：设置断点——一个特殊的临界值，再利用媒体查询（media queries）语法编写样式。
- 流式布局：这种方式允许容器根据视口宽度缩放尺寸。



~~~css
<meta name="viewport" content="width=device-width, initial-scale=1">
~~~

这个 HTML 标签告诉移动设备，你已经特意将网页适配了小屏设备，如果不加这个标签，移动浏览器会假定网页不是响应式的，并且会尝试模拟桌面浏览器，那之前的移动端设计就白做了。有关视口 meta 标签的更多信息，请查看 MDN 文档：*Using the Viewport Meta Tag to Control* *Layout on Mobile Browsers*。



一个典型的媒体查询语句是

~~~css
@media (min-width: 560px) {
    .title > h1 {
		font-size : 2.25rem;
    }
}
~~~

@media 规则会进行条件检查，只有满足所有的条件时，才会将这些样式应用到页面上。否则将会忽略里面的所有规则并且不参与层叠决策。此时`560px`临界值就是一个断点。

~~~css
@media (min-width: 20em) and (max-width: 35em) { ... }
@media (max-width: 20em), (min-width: 35em) { ... }
~~~

and表示条件必须都满足，逗号`,`表示满足其中一个条件即可。



媒体查询的选项有两种：**媒体特征**、**媒体类型**。

min-width、max-width等统称为媒体特征（media feature），还有一些别的媒体特征

- min-height
- orientation : landscape
- min-resolution

完整的媒体特征列表请访问 MDN 文档：*@media*



> 媒体查询还可以放在`<link>`等标签中。
>
> 在网页里加入`<link rel="stylesheet" media="(min-width: 45em)" href="large-screen.css" />`，只有当 min-width媒体查询条件满足的时候才会将 large-screen.css 文件的样式应用到页面。然而不管视口宽度如何，样式表都会被下载。这种方式只是为了更好地组织代码，并不会节省网络流量。
>
> 此外，媒体查询是基于视口大小来实现响应式设计的。开发人员想要的特性是容器查询（container queries），起初叫作元素查询（element queries）。可以根据容器的宽度而不是视口宽度来定义媒体对象的响应式行为，这在一些场合下十分有用。



常见的两种媒体类型是 screen 和print。例如使用 print 媒体查询可以控制打印时的网页布局，这样 就能在打印时去掉背景图（节省墨水），隐藏不必要的导航栏。



对于使用断点的一些建议：

- 大断点要在小断点的基础上做增量更新

- 总是确保每个媒体查询都位于它要覆盖的样式之后，这样媒体查询内的样式就会有更高的优先级
- max-width 是用来排除某些规则的方式，而不是一个常规手段。过多使用max-width的话，得考虑是否良好地遵循了移动优先这条原则。
- 不要根据设备来设置断点，因为市场上有成千上百的屏幕标砖。无法逐一测试

~~~css 
main {

}
@media (min-width : 50em) {
    
}
@media (min-width : 70em) {
    
}
~~~



通过JavaScript动态添加class类，实现响应式

~~~html
	<div class='toggle-menu'>
    <script type="text/javascript">
        (function () {
            var button = document.getElementById('toggle-menu');
            button.addEventListener('click', function (event) {
                event.preventDefault();
                var menu = document.getElementById('main-menu');
                menu.classList.toggle('is-open');
            });
        })();
    </script>
    <style>
         .menu .menu-dropdown {
            display: none;
            position: absolute;
            right: 0;
            left: 0;
            margin: 0;
        
            
		.menu.is-open .menu-dropdown {
            display: block;
        }
    </style>
~~~



通过媒体查询，覆盖原先样式从而实现响应式

~~~css
.row {

}
.column {

}
@media (min-width : 35em) {
	.row {
	    display : flex;
	    margin-left : -.75em;
	    margin-right : -.75em;
	}
	.column {
	    flex : 1;
	    margin-right : 0.75em;
	    margin-left : 0.75em;
	}
}
~~~





## 模块化CSS

我们把样式表的每个组成部分称为**模块（module）**。模块化CSS本质上就是封装，每个模块独立负责自己的样式，不会影响其他模块内的样式。

每个样式表的开头都要写一些给整个网站使用的通用规则，模块化 CSS 也不例外。这些规则通常被称为**基础样式**，其他的样式是构建在这些基础样式之上的。基础样式本身并不是模块化的，但它会为后面编写模块化样式打好基础。我经常使用的基础样式为

~~~css
:root {
	box-sizing : border-box;
	/*各种变量的定义*/
}
*,
*::before,
*::after {
	box-sizing : inherit;
}

~~~

> 这里推荐一个叫作 normalize.css 的库，这个小样式表可以协助消除不同的客户端浏览器渲染上的不一致。可以从 https://necolas.github.io/normalize.css/下载该库。

模块化最重要的一点就是**选择器由单个类名构成的**，这样模块就可以在任意上下文中重复使用，没有任何约束。试想这样的`#sidebar.message`，那么message模块只能用在#sidebar元素的内容，使用场景就受限了。

如果一个模块要进一步满足特定的需求，那么就需要**修饰符（modifiers）**来实现，修饰符类样式不需要重新定义整个模块，只需覆盖要改变的部分。使用时把主模块类名和修饰符类名同时添加到元素上，就可以使用修饰符了。常用的写法是使用两个连字符来表示修饰符，比如 message--error。

~~~css
.message { } 
.message--success { } 
.message--warning { }
.message--error { }
~~~

~~~html
<div class="message message--error">Invalid password </div>
~~~



***千万不要使用基于页面位置的后代选择器来修改模块的样式***。假设我们已经有一个位于头部`header`的下拉菜单`.dropdown`，现在要将下拉菜单的颜色改为深色，我们倾向于这样写选择器`header .dropdown`，这样做会导致

- 要考虑代码放在哪里，跟头部header放在一起还是跟.dropdown放在一起。如果我们添加太多类似的单一目的的规则，样式之间毫无关联，到最后样式表会变得杂乱无章。
- 提升了选择器优先级，可扩展性差。
- 跟HTML结构绑定在一起，不可复用。

推荐使用修饰符约定：`dropdown--dark`



一个模块一般是由多个元素组成的，此时可以用子模块去描述各个元素。常用的写法是使用两个下划线来表示修饰符，比如media__image。

~~~html
<div class="media">
    <img class="media__image" src="runner.png">
    <div class="media__body">
        <h4></h4>
        <p></p>
    </div>
</div>
~~~



模块封装的一个非常重要的原则，我们把它叫作**单一职责原则（Single Responsibility Principle）**。尽可能把多种功能分散到不同的模块中，这样每个模块就可以保持高内聚、低耦合。

## 模式库



