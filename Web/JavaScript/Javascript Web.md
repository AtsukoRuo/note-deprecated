# Javascript Web

[TOC]



## 基本部分

现在，我们来讨论以浏览器为平台的Javascript。

Javascript在浏览器运行时，解释器会提供一个**window全局对象**，任何顶级函数、var变量声明都会成为window全局对象的属性。此外，它还代表了浏览器窗口，在Window大小和滚动一小节我们会用到这个对象。



**文档对象模型（Document Object Model）**，简称 DOM，描述文档的结构、操作和事件。`document` 对象是页面的主要“入口点”。我们可以使用它来更改或创建页面上的任何内容。[https://dom.spec.whatwg.org](https://dom.spec.whatwg.org/)。

> 另外也有一份针对 CSS 规则和样式表的、单独的规范 [CSS Object Model (CSSOM)](https://www.w3.org/TR/cssom-1/)，这份规范解释了如何将 CSS 表示为对象，以及如何读写这些对象。我们很少需要从 JavaScript 中修改 CSS 规则（我们通常只是添加/移除一些 CSS 类，而不是直接修改其中的 CSS 规则）



**浏览器对象模型（Browser Object Model）**，简称 BOM，表示由浏览器（主机环境）提供的用于处理文档（document）之外的所有内容的其他对象。例如

- [navigator](https://developer.mozilla.org/zh/docs/Web/API/Window/navigator) 对象提供了有关浏览器和操作系统的背景信息
- [location](https://developer.mozilla.org/zh/docs/Web/API/Window/location) 对象允许我们读取当前 URL
- 各种浏览器函数：`setTimeout`，`alert`，`location` 等



每个 HTML 标签都是一个对象，标签内的文本也是一个对象。

~~~html
<!DOCTYPE HTML>
<html>
<head>
  <title>About elk</title>
</head>
<body>
  The truth about elk.
</body>
</html>
~~~

DOM 将 HTML 表示为标签的树形结构。它看起来如下所示：

<img src="figure/DOM Tree.png" style="zoom: 67%;" />

标签被称为 **元素节点**（或者仅仅是元素）。元素内的文本形成 **文本节点**，它总是树的叶子。此外注释作为**comment 节点**也会添加到DOM中，**甚至标签之间的空白符也会作为文本节点添加到DOM Tree中**。



### 遍历DOM

用于遍历的属性称为**导航（navigation）属性**。

***本节介绍的所有属性都是实时的、只读的***

`<html> = document.documentElement`

`<body> = document.body`

`<head> = document.head`

需要导航方法或者搜索方法来获取其他标签。

脚本无法访问在运行时不存在的元素。尤其是，如果一个脚本是在 `<head>` 中，那么脚本是访问不到 `document.body` 元素的，因为浏览器还没有读到它。

> 规范下术语：子节点指的是直接子元素。而子孙节点是所有后代元素，子元素，子子元素。祖先，是指父亲、父亲的父亲....

**childNode**属性列出所有子节点，包括文本节点，注意**甚至标签之间的空白符也会作为文本节点添加到DOM Tree中**。childNodes实际上是一个类数组的可迭代对象。

~~~javascript
for (let i = 0; i < document.body.childNodes.length; i++) {
      alert( document.body.childNodes[i] ); 
}

elem.childNodes[0] === elem.firstChild
elem.childNodes[elem.childNodes.length - 1] === elem.lastChild
~~~

下一个兄弟节点在 `nextSibling` 属性中，上一个是在 `previousSibling` 属性中。可以通过 `parentNode` 来访问父节点。

![](figure/遍历DOM.png)





有时候，我们只关心元素节点。为此DOM提供了以下方法：

- `children` —— 仅那些作为元素节点的子代的节点。
- `firstElementChild`，`lastElementChild` —— 第一个和最后一个子元素。
- `previousElementSibling`，`nextElementSibling` —— 兄弟元素。
- `parentElement` —— 父元素。

![](figure/遍历DOM2.png)



这里有一个细节需要值得注意：parentElement、parentNode。这两个属性只对document.documentElement有区别

~~~javascript
alert( document.documentElement.parentNode ); // document
alert( document.documentElement.parentElement ); // null
~~~



此外，可以用于特定元素的导航属性，例如表格。

<table> 元素支持 (除了上面给出的，之外) 以下属性:

- `table.rows` —— `<tr>` 元素的集合。
- `table.caption/tHead/tFoot` —— 引用元素 `<caption>`，`<thead>`，`<tfoot>`。
- `table.tBodies` —— `<tbody>` 元素的集合（根据标准还有很多元素，但是这里至少会有一个 —— 即使没有被写在 HTML 源文件中，浏览器也会将其放入 DOM 中）。

**`<thead>`，`<tfoot>`，`<tbody>`** 元素提供了 `rows` 属性：

- `tbody.rows` —— 表格内部 `<tr>` 元素的集合。

**`<tr>`：**

- `tr.cells` —— 在给定 `<tr>` 中的 `<td>` 和 `<th>` 单元格的集合。



### 搜索元素节点：getElement\*，querySelector\*

| 方法名                   | 搜索方式     | 可以在元素上调用？ | 实时的？ |
| ------------------------ | ------------ | ------------------ | -------- |
| `querySelector`          | CSS-selector | ✔                  | -        |
| `querySelectorAll`       | CSS-selector | ✔                  | -        |
| `getElementById`         | `id`         | -                  | -        |
| `getElementsByName`      | `name`       | -                  | ✔        |
| `getElementsByTagName`   | tag or `'*'` | ✔                  | ✔        |
| `getElementsByClassName` | class        | ✔                  | ✔        |

- `elem.matches(css)` 用于检查 `elem` 与给定的 CSS 选择器是否匹配。
- `elem.closest(css)` 用于查找与给定 CSS 选择器相匹配的最近的祖先。`elem` 本身也会被检查。
- 如果 `elemB` 在 `elemA` 内（`elemA` 的后代）或者 `elemA==elemB`，`elemA.contains(elemB)` 将返回 true。

目前为止，最常用的是 `querySelector` 和`querySelectorAll`。



**获取指定ID的标签**

- document.getElementById('id')
- 以`id` 命名的全局变量，如果与Javascript中的变量重名，则屏蔽这个全局变量。这种方式不推荐



**获取与给定 CSS 选择器匹配的所有元素****

~~~JavaScript
let elements = document.querySelectorAll('ul > li:last-child')
~~~

注意也可以匹配伪类:hover :active。`document.querySelectorAll(':hover')` 将会返回鼠标指针正处于其上方的元素的集合（按嵌套顺序：从最外层 `<html>` 到嵌套最多的元素。**这个是最常用的选择函数！**此外，`document.querySelector(css)` 调用会返回给定 CSS 选择器的第一个元素。

### 节点属性：type、tag、content

不同的DOM节点可能有不同的属性。标签 `<a>` 相对应的元素节点具有链接相关的（link-related）属性，标签 `<input>` 相对应的元素节点具有与输入相关的属性。但是所有这些标签对应的 DOM 节点之间也存在共有的属性和方法。因为所有类型的 DOM 节点都形成了一个单一层次的结构（single hierarchy）。该层次结构（hierarchy）的根节点是 [EventTarget](https://dom.spec.whatwg.org/#eventtarget)，[Node](https://dom.spec.whatwg.org/#interface-node) 继承自它，其他 DOM 节点继承自 Node。

![](figure/DOM继承.png)

- [EventTarget](https://dom.spec.whatwg.org/#eventtarget) —— 是一切的根“抽象（abstract）”类。

	该类的对象从未被创建。它作为一个基础，以便让所有 DOM 节点都支持所谓的“事件（event）”

- [Node](http://dom.spec.whatwg.org/#interface-node) —— 也是一个“抽象”类，充当 DOM 节点的基础。

	它提供了树的核心功能：`parentNode`，`nextSibling`，`childNodes` 等（它们都是 getter）。`Node` 类的对象从未被创建。但是还有一些继承自它的其他类（因此继承了 `Node` 的功能）。

- [Document](https://dom.spec.whatwg.org/#interface-document) 由于历史原因通常被 `HTMLDocument` 继承（尽管最新的规范没有规定）—— 是一个整体的文档。

	全局变量 `document` 就是属于这个类。它作为 DOM 的入口。

- [CharacterData](https://dom.spec.whatwg.org/#interface-characterdata) —— 一个“抽象”类，被下述类继承：

	- [Text](https://dom.spec.whatwg.org/#interface-text) —— 对应于元素内部文本的类，例如 `<p>Hello</p>` 中的 `Hello`。
	- [Comment](https://dom.spec.whatwg.org/#interface-comment) —— 注释类。它们不会被展示出来，但每个注释都会成为 DOM 中的一员。

- [Element](http://dom.spec.whatwg.org/#interface-element) —— 是 DOM 元素的基础类。

	它提供了元素级导航（navigation），如 `nextElementSibling`，`children`，以及搜索方法，如 `getElementsByTagName` 和 `querySelector`。

	浏览器不仅支持 HTML，还支持 XML 和 SVG。因此，`Element` 类充当的是更具体的类的基础：`SVGElement`，`XMLElement`（我们在这里不需要它）和 `HTMLElement`。

- 最后，[HTMLElement](https://html.spec.whatwg.org/multipage/dom.html#htmlelement) —— 是所有 HTML 元素的基础类。我们大部分时候都会用到它。

	它会被更具体的 HTML 元素继承：

	- [HTMLInputElement](https://html.spec.whatwg.org/multipage/forms.html#htmlinputelement) —— `<input>` 元素的类，
	- [HTMLBodyElement](https://html.spec.whatwg.org/multipage/semantics.html#htmlbodyelement) —— `<body>` 元素的类，
	- [HTMLAnchorElement](https://html.spec.whatwg.org/multipage/semantics.html#htmlanchorelement) —— `<a>` 元素的类，
	- ……等。



>大多数浏览器在其开发者工具中都支持这两个命令：`console.log` 和 `console.dir`。
>
>- `console.log(elem)` 显示元素的 DOM 树。
>- `console.dir(elem)` 将元素显示为 DOM 对象，并列出其全部属性。

`nodeType` 属性提供了另一种“过时的”用来获取 DOM 节点类型的方法。我们只能读取 `nodeType` 而不能修改它。

它有一个数值型值（numeric value）：

- 对于元素节点 `elem.nodeType == 1`，
- 对于文本节点 `elem.nodeType == 3`，
- 对于 document 对象 `elem.nodeType == 9`，
- 在 [规范](https://dom.spec.whatwg.org/#node) 中还有一些其他值。

> 一般用instanceof操作符来
>
> 判断类型

给定一个 DOM 节点，我们可以从 `nodeName` （定义在Node类）或者 `tagName` （定义在Element类）属性中读取它的标签名。



[innerHTML](https://w3c.github.io/DOM-Parsing/#the-innerhtml-mixin) 属性允许将元素中的 HTML 获取为字符串形式。我们也可以修改它。因此，它是更改页面最有效的方法之一。如果 `innerHTML` 将一个 `<script>` 标签插入到 document 中 —— 它会成为 HTML 的一部分，但是不会执行。

~~~javascript
document.body.innerHTML += '...'; 
~~~

注意：+= 并不是追加内容，而是先移除旧的，在写入新旧结合的内容，**这会重新加载其他资源的。**

`outerHTML` 属性包含了元素的完整 HTML。就像 `innerHTML` 加上元素本身一样。**写入 `outerHTML` 不会改变元素。而是在 DOM 中替换它。**

~~~javascript
<div>Hello, world!</div>

<script>
  let div = document.querySelector('div');

  // 使用 <p>...</p> 替换 div.outerHTML
  div.outerHTML = '<p>A new element</p>'; // (*)

  alert(div.outerHTML); // <div>Hello, world!</div> (**)
</script>
~~~



在 `div.outerHTML=...` 中发生的事情是：

- `div` 被从文档（document）中移除。
- 另一个 HTML 片段 `<p>A new element</p>` 被插入到其位置上。
- `div` 仍拥有其旧的值。新的 HTML 没有被赋值给任何变量。



`innerHTML` 属性仅对元素节点有效。其他节点类型，例如文本节点，具有它们的对应项：`nodeValue` 和 `data` 属性。

假设我们有一个用户输入的任意字符串，我们希望将其显示出来。使用 innerHTML，我们将其“作为 HTML”插入，带有所有 HTML 标签。使用 textContent，我们将其“作为文本”插入，所有符号（symbol）均按字面意义处理。比较两者：提供了对元素内的 **文本** 的访问权限：仅文本，去掉所有 `<tags>`。

~~~JavaScript
<div id="elem1"></div>
<div id="elem2"></div>

<script>
  let name = prompt("What's your name?", "<b>Winnie-the-Pooh!</b>");

  elem1.innerHTML = name;
  elem2.textContent = name;
</script>
~~~





### 特性和属性（Attributes and properties）

当一个元素有 `id` 或其他 **标准的** 特性，那么就会生成对应的 DOM 属性。**而且它们两者之间是实时同步的**。

> 注意：
>
> - HTML的class特性对应的属性是className
>
> - 但这里也有些例外，例如 `input.value` 只能从特性同步到属性，反过来则不行

~~~JavaScript
<a></a>
<script>
    let ele = document.querySelector('a');
	a.href = "www.bilibili.com";
</script>
~~~

当然，我们可以自定义元素的属性：

~~~JavaScript
document.body.myData = { name : 'Caesar', title : 'Imperator'};
document.body.sayTagName = function() {};
Element.prototype.sayHi = function() {};	//为所有元素添加
~~~



对于标签的非标准特性，我们可以通过以下方法进行访问：（以下有更好的dataset属性）

- `elem.hasAttribute(name)` —— 检查特性是否存在。
- `elem.getAttribute(name)` —— 获取这个特性值。
- `elem.setAttribute(name, value)` —— 设置这个特性值。value是一个字符串
- `elem.removeAttribute(name)` —— 移除这个特性。

我们也可以使用 `elem.attributes` 读取所有特性：属于内建 [Attr](https://dom.spec.whatwg.org/#attr) 类的对象的集合，具有 `name` 和 `value` 属性。

注意：对参数name对大小写并不敏感。



我们使用非标准的特性，但是可能会与之后HTML添加的标准特性命名冲突。为了避免这种情况，HTML规范提供了`data-*`特性供程序员使用。它们可在 `dataset` 属性中使用。

~~~html
<div id='item' data-about="Elephants">
<script>
    item.dataset.about = "apple";
</script>
~~~

像 `data-order-state` 这样的多词特性可以以驼峰式进行调用：`dataset.orderState`。

非标准特性更容易管理。我们可以轻松地更改状态：在CSS中也能访问到这些非标准特性。

### 修改文档

- 创建新节点的方法：

	- `document.createElement(tag)` —— 用给定的标签创建一个元素节点，
	- `document.createTextNode(value)` —— 创建一个文本节点（很少使用），
	- `elem.cloneNode(deep)` —— 深克隆元素，如果 `deep==true` 则与其后代一起克隆。

- 插入和移除节点的方法：

	- `node.append(...nodes or strings)` —— 在 `node` 末尾插入，
	- `node.prepend(...nodes or strings)` —— 在 `node` 开头插入，
	- `node.before(...nodes or strings)` —— 在 `node` 之前插入，
	- `node.after(...nodes or strings)` —— 在 `node` 之后插入，
	- `node.replaceWith(...nodes or strings)` —— 替换 `node`以及其子孙元素。
	- `node.remove()` —— 移除 `node`以及子孙元素。

	~~~html
	    <ol id="ol">
	        <li>0</li>
	    </ol>
	    <script>
	        ol.before(`before`, document.createElement('li'), 'hello');
	    </script>
	~~~

	文本字符串被“作为文本”插入。

	**所有插入方法都会自动从旧位置删除该节点。**

	~~~html
	<!--元素交换-->
	<div id="first">First</div>
	<div id="second">Second</div>
	<script>
	  // 无需调用 remove
	  second.after(first); // 获取 #second，并在其后面插入 #first
	</script>
	
	~~~

	

- 在 `html` 中给定一些 HTML，`elem.insertAdjacentHTML(where, html)` 会根据 `where` 的值来插入它：

	- `"beforebegin"` —— 将 `html` 插入到 `elem` 前面，
	- `"afterbegin"` —— 将 `html` 插入到 `elem` 的开头，
	- `"beforeend"` —— 将 `html` 插入到 `elem` 的末尾，
	- `"afterend"` —— 将 `html` 插入到 `elem` 后面。

另外，还有类似的方法，`elem.insertAdjacentText(where, text)` 和 `elem.insertAdjacentElement(where, elem)`，它们会插入文本字符串和元素，但很少使用。

~~~html
<div id="div"></div>
<script>
  div.insertAdjacentHTML('beforebegin', '<p>Hello</p>');
  div.insertAdjacentHTML('afterend', '<p>Bye</p>');
</script>
~~~



![](figure/insertAdjacentElement.png)

- 要在页面加载完成之前将 HTML 附加到页面：

	- `document.write(html)`

	页面加载完成后，这样的调用将会擦除文档。多见于旧脚本。因此，如果我们需要向 HTML 动态地添加大量文本，并且我们正处于页面加载阶段，并且速度很重要，那么它可能会有帮助。

- 这里还有“旧式”的方法：

	- `parent.appendChild(node)`
	- `parent.insertBefore(node, nextSibling)`
	- `parent.removeChild(node)`
	- `parent.replaceChild(newElem, node)`

	这些方法都返回 `node`。



### 样式与类

要管理 class，有两个 DOM 属性：

- `className` —— 字符串值，可以很好地管理整个类的集合。

- `classList` —— 具有 `add/remove/toggle/contains` 方法的对象，可以很好地支持单个类。`toggle `表示如果类不存在就添加类，存在就移除它。它是可迭代对象。

	~~~JavaScript
	//<body class="main page">
	for (let name of document.body.classList) {
	      alert(name); // main，然后是 page
	}
	~~~

	

要改变样式：

- `elem.style` 属性是一个只读对象，它对应于 `"style"` 特性（attribute）中所写的内容。

	

	`elem.style.width="100px"`（**不能是数值，只能是字符串**） 的效果等价于我们在 `style` 特性中有一个 `width:100px` 字符串。这对应了一个特殊方法`elem.style.setProperty('width','100px')`

	

	如果`elem.style.display=""`，那么就应用浏览器的默认样式。这还对应了一个特殊方法` elem.style.removeProperty(' property')`。

	

	对于多词（multi-word）属性，使用驼峰式 camelCase：连字符 `-` 表示大写。

	~~~text
	background-color  => elem.style.backgroundColor
	z-index           => elem.style.zIndex
	border-left-width => elem.style.borderLeftWidth
	-moz-border-radius => elem.style.MozBorderRadius
	~~~

	

- 通常，我们使用 `style.*` 来对各个样式属性进行赋值。我们不能像这样的 `div.style="color: red; width: 100px"` 设置完整的属性，因为 `div.style` 是一个对象，并且它是只读的。想要以字符串的形式设置完整的样式，可以使用特殊属性 `style.cssText`：

	~~~JavaScript
	div.style.cssText=`color: red !important;
	    background-color: yellow;
	    width: 100px;
	    text-align: center;
	  `;
	~~~

	我们很少使用这个属性，因为这样的赋值会删除所有现有样式：它不是进行添加，而是替换它们。

	

要读取已解析的（resolved）样式（对于所有类，在应用所有 CSS 并计算最终值之后）：

- **`style` 属性仅对 `"style"` 特性（attribute）值起作用，而没有任何 CSS 级联（cascade）**。`getComputedStyle(elem, [pseudo])` 返回与 `style` 对象类似的。但是可以解决上述问题。

	~~~JavaScript
	//body { color: red; margin: 5px }
	let computedStyle = getComputedStyle(document.body);
	// 现在我们可以读取它的 margin 和 color 了
	//computedStyle.marginTop = "100px";	ERROR
	alert( computedStyle.marginTop ); // 5px 对简写属性不起作用
	alert( computedStyle.color ); // rgb(255, 0, 0)
	~~~

	

	> 不论是style、还是getComputedStyle，它们无法读取到简写属性，只能用具体的属性marginTop来访问。
	>
	> 此外不要使用getComputedStyle来获取 width/height，下面有更好的方法！

### 元素大小和滚动

元素具有以下几何属性：不考虑外边距

- `offsetParent` —— 是最接近的 CSS 定位的BFC祖先，例如是 `td`，`th`，`table`，`body`。offsetParent的值可能为null

- `offsetLeft/offsetTop` —— 是相对于 `offsetParent` 的左上角`x/y`坐标。

- `offsetWidth/offsetHeight` —— 元素“外部”的 width/height，即边框 + 内边距 + 内容的尺寸大小。

- `clientLeft/clientTop` ——可以近似认为是边框（border）的大小 。

- `clientWidth/clientHeight` —— 内容 + 内边距的尺寸大小，但不包括滚动条（scrollbar）占用内容的空间。

- `scrollWidth/scrollHeight` —— clientWidth + 滚动出（隐藏）的部分。但仍不包括滚动条。

	~~~JavaScript
	// 将元素展开（expand）到完整的内容高度
	element.style.height = `${element.scrollHeight}px`;
	~~~

- `scrollLeft/scrollTop` 是元素的隐藏、滚动部分的 width/height。换句话说，`scrollTop` 就是“已经滚动了多少”。



除了 `scrollLeft/scrollTop` 外，所有属性都是只读的。如果我们修改 `scrollLeft/scrollTop`，浏览器会滚动对应的元素。基于这一点，我们可以自定义滚动条，想想就挺激动的！

![](figure/元素的集合属性.png)



注意一些浏览器（并非全部）通过从width中获取空间来为滚动条保留空间，且还将滚动条放在边框外。

![](figure/元素的布局.png)

### window大小和滚动

几何：

- 文档可见部分的 width/height（内容部分的 width/height）：`document.documentElement.clientWidth/clientHeight`

- 整个文档的 width/height，其中包括滚动出去的部分：

	```javascript
	let scrollHeight = Math.max(
	  document.body.scrollHeight, document.documentElement.scrollHeight,
	  document.body.offsetHeight, document.documentElement.offsetHeight,
	  document.body.clientHeight, document.documentElement.clientHeight
	);
	```
	
	​		为什么这样？最好不要问。这些不一致来源于远古时代，而不是“聪明”的逻辑。

window.screen.width可以获取到当前显示器的分辨率



虽然document.documentElement的scroll*属性可以处理滚动，但还是推荐使用window对象的滚动属性

滚动：

- 读取当前的滚动：`window.pageYOffset/pageXOffset`。
- 更改当前的滚动：
	- `window.scrollTo(pageX,pageY)` —— 根据绝对坐标进行滚动
	- `window.scrollBy(x,y)` —— 相对当前位置进行滚动，
	- `elem.scrollIntoView(top=true)` —— 滚动以使 `elem` 可见（`elem` 与窗口的顶部/底部对齐）。
	- 要使文档不可滚动，只需要设置 `document.body.style.overflow = "hidden"`。该页面将“冻结”在其当前滚动位置上。

### 坐标

页面上的任何点都有坐标：

1. 相对于窗口的坐标 ：clientX/clientY
2. 相对于文档的坐标 ： `pageX/pageY`

![](figure/坐标.png)

窗口坐标非常适合和 `position:fixed` 一起使用，文档坐标非常适合和 `position:absolute` 一起使用。



方法 `elem.getBoundingClientRect()` 返回最小矩形的窗口坐标，该矩形将 `elem` 作为内建 [DOMRect](https://www.w3.org/TR/geometry-1/#domrect) 类的对象。

主要的 `DOMRect` 属性：

- `x/y` —— 矩形原点相对于窗口的 X/Y 坐标，
- `width/height` —— 矩形的 width/height（可以为负）。

此外，还有派生（derived）属性：

- `top/bottom` —— 顶部/底部矩形边缘的 Y 坐标，
- `left/right` —— 左/右矩形边缘的 X 坐标。

![](figure/getBindingClientRect.png)



`document.elementFromPoint(x, y)` 的调用会返回在窗口坐标 `(x, y)` 处嵌套最多（the most nested）的元素。它只对在可见区域内的坐标 `(x,y)` 起作用。

## 事件

### 事件概述

这是最有用的 DOM 事件的列表，你可以浏览一下：

**鼠标事件：**

- `click` —— 当鼠标点击一个元素时（触摸屏设备会在点击时生成）。
- `contextmenu` —— 当鼠标右键点击一个元素时。
- `mouseover` / `mouseout` —— 当鼠标指针移入/离开一个元素时。
- `mousedown` / `mouseup` —— 当在元素上按下/释放鼠标按钮时。
- `mousemove` —— 当鼠标移动时。

**键盘事件**：

- `keydown` 和 `keyup` —— 当按下和松开一个按键时。

**表单（form）元素事件**：

- `submit` —— 当访问者提交了一个 `<form>` 时。
- `focus` —— 当访问者聚焦于一个元素时，例如聚焦于一个 `<input>`。

**Document 事件**：

- `DOMContentLoaded` —— 当 HTML 的加载和处理均完成，DOM 被完全构建完成时。

**CSS 事件**：

- `transitionend` —— 当一个 CSS 动画完成时。



这里有 3 种分配事件处理程序的方式：

1. HTML 特性（attribute）：`onclick="..."`。HTML 特性很少使用，因为 HTML 标签中的 JavaScript 看起来有些奇怪且陌生。而且也不能在里面写太多代码。

	~~~html
	<input value="Click me" onclick="alert(`Click!`)" type="button">
	<input type="button" onclick="countRabbits()" value="Count rabbits!">
	~~~

	

2. DOM 属性（property）`on<event>`：`elem.onclick = function`。这个方法可以为特定事件**添加一个**事件处理程序。HTML特性就是基于DOM属性来实现的，例如

	~~~javascript
	<input type="button" id="button" onclick="sayThanks()">
	//等价于
	button.onclick = function() {
	  sayThanks(); // <-- 特性（attribute）中的内容变到了这里
	};    
	~~~

	

3. 方法（method）：`elem.addEventListener(event, handler[, options])` 用于添加removeEventListener` 用于移除。这个方法可以为特定事件**添加多个**事件处理程序。

	其中`options`是具有以下属性的附加可选对象：

	- `once`：如果为 `true`，那么会在被触发后自动删除监听器。
	- `capture`：事件处理的阶段。由于历史原因，`options` 也可以是 `false/true`，它与 `{capture: false/true}` 是等价的。
	- `passive`：如果为 `true`，那么处理程序将不会调用 `preventDefault()`

	`handler`既可以是`Function`，也可以是带有`handleEvent`方法的`Object`。

	

	推荐采取以下更加现代的方法给元素编写事件处理器：

	~~~JavaScript
	//事件集中在一块处理		
	class Menu {
		handleEvent(event) {
			let method = 'on' + event.type[0].toUpperCase() + event.tpye.slice(1);
			this[method](event);	//转发事件
		}
	
		onMousedown() {
			elem.innerHTML = "Mouse button pressed";
		}
		onMouseup() {
			elem.innerHTML += "...and released.";
		}
	}
	
	let menu = new Menu();
	elem.addEventListener('mousedown', menu);
	elem.addEventListener('mouseup', menu);
	~~~

	现在事件处理程序已经明确地分离了出来，这样更容易进行代码编写和后续维护。

	

	有些事件无法通过 DOM 属性进行分配。只能使用 `addEventListener`。例如，`DOMContentLoaded` 事件



一般来说函数之间的赋值会丢失this值，但是Javascript事件机制对this做了特殊处理，因此可以在事件处理器函数中使用this来访问产生事件的元素。



当事件发生时，浏览器会创建一个 **`event` 对象**，将详细信息放入其中，并将其作为参数传递给处理程序。

`event` 对象的一些属性：

- `event.type`事件类型。
- `event.currentTarget`处理事件的元素。这与 `this` 相同，除非处理程序是一个箭头函数，或者它的 `this` 被绑定到了其他东西上，之后我们就可以从 `event.currentTarget` 获取元素了。

还有很多属性。其中很多都取决于事件类型，例如

- `event.clientX / event.clientY`，指针事件（pointer event）的指针的窗口相对坐标。





### 冒泡和捕捉

**当一个事件发生在一个元素上，它会首先运行在该元素上的处理程序，然后运行其父元素上的处理程序，然后一直向上到其他祖先上的处理程序。**

![](figure/冒泡.png)

> `focus` 事件不会冒泡。但这仍然是例外，而不是规则。



### 事件委托



### 默认行为



### 创建自定义事件



## UI事件

### 鼠标事件

### 移动鼠标

### 鼠标拖放事件

### 指针事件

### 键盘

### 滚动



