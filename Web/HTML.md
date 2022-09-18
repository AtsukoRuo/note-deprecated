# HTML

[TOC]

## 基本概念

**HTML (Hypertext Markup Language ，超文本标记语言)**是一种结构化Web以及其内容的语言。

**超文本（hypertext）**是指连接单个网站内或多个网站间网页的链接。

HTML 标签里的元素名不区分大小写。例如

~~~HTML
<title> <Title> <TITLE>
~~~







**元素**由以下三部分组成：

- 开始标签
- 结束标签
- 内容



<img src="figure/grumpy-cat-small.png" style="zoom: 50%;" />



值得注意的是，空元素并没有结束标签以及内容

~~~html
<img src="https://roy-tian.github.io/learning-area/extras/getting-started-web/beginner-html-site/images/firefox-icon.png" />
~~~



元素的类别有：

- 块级元素

- 内联元素



HTML5 重新定义了元素的类别：见 [元素内容分类](https://html.spec.whatwg.org/multipage/indices.html#element-content-categories)([译文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/Content_categories))。不应该与 [CSS 盒子的类型](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/The_box_model#块级盒子（block_box）_和_内联盒子（inline_box）)中的同名术语相混淆。尽管它们默认是相关的，但改变 CSS 显示类型并不会改变元素的分类，也不会影响它可以包含和被包含于哪些元素。防止这种混淆也是 HTML5 摒弃这些术语的原因之一。



元素之间可以嵌套，但是必须正确的嵌套，而且块级元素不允许嵌套在内联元素中

~~~html
<p>My cat is <strong>very grumpy.</p></strong>			//error
<em> <p>Test</p> </em>								//error
~~~

嵌套会生成相应的DOM树，使得元素之间存在着父子关系！

​	

元素的行为可由属性来决定：多个属性之间用空格分割，一般采用键值对的形式来描述属性。若没有属性值，则称该属性为**布尔属性**。属性值可以用一对单括号或者一对双括号括起来，但是单引号和双引号不能在一个属性值里面混用，甚至可以省略括号，但是不推荐

~~~html
<a href="http://www.example.com">示例站点链接</a>
<a href='http://www.example.com'>示例站点链接</a>
<a href=http://www.example.com>示例站点链接</a>
<a href="http://www.example.com'>示例站点链接</a> 	//错误语法
~~~



良好的HTML代码编写需要严格遵循语义化，这一方面有利于程序员维护、扩展项目，另一方面对[SEO](https://developer.mozilla.org/zh-CN/docs/Glossary/SEO)（搜索引擎优化）以及严重视力障碍者友好。全盲和视障人士约占世界人口（[约 70 亿](https://en.wikipedia.org/wiki/World_human_population#/media/File:World_population_history.svg)）的 13％（2015 年 [全球约有 9.4 亿人口存在视力问题](https://en.wikipedia.org/wiki/Visual_impairment)）。



URL可以是http://。引用本地文件系统中的资源时，只能

- picture.jpg

- images/picture.jpg
- /images/picture.jpg，/表示当前项目的根目录
- ../picture.jpg

通过文件系统的绝对路径来引用资源好像行不通....



HTML可以解决响应式的需求，但最好使用CSS，因为[CSS 是比 HTML 更好的响应式设计的工具](http://blog.cloudfour.com/responsive-images-101-part-8-css-images/)。

# 元素

## 转义字符以及空白符

无论你在 HTML 元素的内容中使用多少空格 (包括空白字符，包括换行)，当渲染这些代码的时候，HTML 解释器会将连续出现的空白字符减少为一个单独的空格符。

在HTML中，有些特殊字符不能直接使用，只能通过以下转义字符（在HTML中称为实体引用）间接使用它们：

|         |      |
| ------- | ---- |
| `&lt;`  | <    |
| `&gt;`  | >    |
| `&quot` | "    |

HTML 注释`<!-- -->`



## 文档元数据

`<!DOCTYPE html>`声明该文档类型，这并不是一个标签。只需要知道 `<!DOCTYPE html>` 是最短有效的文档声明。

`<html lang="zh-CN"></html>`: `<html>`元素。这个元素包裹了整个完整的页面，是一个根元素。lang属性设置文档语言，其属性值是根据[ISO 639-1](https://zh.wikipedia.org/wiki/ISO_639-1) 标准定义的

`<head></head>`: `<head>`元素：存放该文档的元信息。它的内容并不会在浏览器中显示。

`<title></title>`: 设置该文档的标题

`<body></body>`: `<body>`元素。包含了你访问页面时所有显示在页面上的内容。





### meta

- charset：例如charset="utf-8"，则以将浏览器以utf-8编码格式解释文档中的内容。字符集有国标GBXXX，ASCII、BIG5等。

- name：指定meta元素的类型，有预定的属性值，也可以自己设置。一些内置的属性值：

  - author：说明文档作者的名字

  - description：搜索引擎将描述显示在搜索结果中。例如

  	~~~html
  	<meta name="description" content="The MDN Web Docs site
  	  provides information about Open Web technologies
  	  including HTML, CSS, and APIs for both Web sites and
  	  progressive web apps.">
  	~~~

  	

  	<img src="https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML/mdn-search-result.png" alt="A Yahoo search result for &quot;Mozilla Developer Network&quot;" style="zoom:25%;" />

  - keywords：已弃用。提供关键词给搜索引擎，因为有些程序员恶意填充了大量关键词到 keyword，错误地引导搜索结果。

- content：指定内容，与name相匹配。

	~~~html
	<meta name="author" content="Chris Mills">
	<meta name="description" content="The MDN Web Docs Learning Area aims to provide
	complete beginners to the Web with all they need to know to get
	started with developing web sites and applications.">
	~~~



许多互联网大厂编写自己的元数据协议（Fackbook的[The Open Graph protocol (ogp.me)](https://ogp.me/)、Twitter的https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/abouts-cards），当从互联网大厂的网页A超链接到遵循该协议的其他网站B时，网页A会根据网页B的meta元素渲染出相应的界面。

~~~html
<meta property="og:image" content="https://developer.mozilla.org/static/img/opengraph-logo.png">
<meta property="og:description" content="The Mozilla Developer Network (MDN) provides
information about Open Web technologies including HTML, CSS, and APIs for both Web sites
and HTML5 Apps. It also documents Mozilla products, like Firefox OS.">
<meta property="og:title" content="Mozilla Developer Network">

~~~

在Facebook上将该超链接渲染为：

![](figure/facebook-output.png)



### link

- rel：说明所链接资源的类型
	- icon：图标
	
	- stylesheet：样式表
	
	- apple-touch-icon-precomposed：应用在苹果设备的图标
	
		
	
- href：URL资源的路径。



~~~html
<link rel="stylesheet" href="css/index.css ">
<link rel='icon' href="favicon.ico", type="image/x-icon">		//添加图标
~~~



### script

- src：外部脚本的路径
- defer：在解析完成 HTML 后再加载 JavaScript。这样可以确保在加载脚本之前浏览器已经加载了所有的 HTML 内容（如果脚本尝试访问某个不存在的元素，浏览器会报错）

内容是内部脚本的编写，并不推荐



~~~html
<script src="my-js-file.js" defer>
    
</script>
~~~



### style



## 内容分区

段落通过`<p>`元素进行标记。

标题通过`<h>`元素标记有六个标题元素标签 —— `<h1>`、`<h2>`、`<h3>`、`<h4>`、`<h5>`、`<h6>`。 `<h1>` 表示主标题（the main heading），`<h2>` 表示二级子标题（subheadings），`<h3>` 表示三级子标题（sub-subheadings），等等。

建议一个页面中使用一次`<h1>`，同时最好不要超过三个标题级别。



`<header>`标记页眉，`<footer>`标记页脚



`<nav>`标记导航栏，包含页面主导航功能，不应该包含二级链接等内容。一个网页也可能含有多个[`nav`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/nav)元素，例如一个是网站内的导航列表，另一个是本页面内的导航列表。



`<main>`标记主内容，每个页面上只能用一次`<main>`，且直接位于`<body>`中。最好不要把它嵌套在其他元素中。



`<article> `按内容进行分块 `<section>`按功能进行分块。



`<aside>`标记侧边栏，经常嵌套在`<main>`之中。包含间接信息，例如属于条目、作者简介、相关链接等等。它被认为是独立于该内容的一部分并且可以被单独的拆分出来而不会使整体受影响。



`<span>`是一个无语义内联元素，而`<div>`是一个无语义块级元素。`<div> `非常便利但容易被滥用。由于它们没有语义值，会使 HTML 代码变得混乱。要小心使用，只有在没有更好的语义方案时才选择它，而且要尽可能少用，否则文档的升级和维护工作会非常困难。



## 文本元素

`<ul> `标记整个无序列表，`<ol>`标记整个有序列表，而`<li>`标记列表项。 `<ul>`与`<ol>`之间可以相互嵌套 。

`<ol>`的`type`属性用于设置编号的类型，属性值有

- `a` 表示小写英文字母编号
- `A` 表示大写英文字母编号
- `i` 表示小写罗马数字编号
- `I` 表示大写罗马数字编号
- `1` 表示数字编号（默认）编号类型适用于整个列表

**最好使用CSS中的list-style-type属性代替type属性**。**`start`**属性指定了列表编号的起始值，属性值为整数。

上述我们讨论了基本的列表，现在我们介绍一下**描述列表（description list）**。例如术语和定义、问题和答案等都可以使用描述列表标记。整个列表用 `<dl>`标记，`<dt>`标记每一项，`<dd> `解释这一项。一个`<dt>`可以对应多个`<dd>`。





`<em>`元素表示强调某些词，从而改变整句话的意思（e.g. 反讽）。而`<strong>`仅仅强调某些词语。

`<i> ` `<b> ` `<u>`元素以前是**表象元素（presentational elements）**，在CSS 仍然不被完全支持的时期使用，无任何语义。而HTML5中又重新定义了它们的语义。

- [`i`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/i) 被用来传达传统上用斜体表达的意义：外国文字，分类名称，技术术语，一种思想……
- [`b`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/b) 被用来传达传统上用粗体表达的意义：关键字，产品名称，引导句……
- [`u`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/u) 被用来传达传统上用下划线表达的意义：专有名词，拼写错误……



用 `<blockquote>`元素标记块引用，`cite`属性用URL指向引用的资源。`<q>`元素标记行内引用。`<cite>`元素显式说明引用的来源（书名、URL等）。



`<abbr>`行内元素标记缩略语，`title`属性对该缩略语进行解释。



`<address>`块级元素标记联系方式。



`<sup>`元素标记上标，而`<sub>`元素标记下标。







有大量的 HTML 元素可以来标记计算机代码：

- [`code`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/code): 用于标记计算机通用代码。
- [`pre`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/pre): 用于保留空白字符（通常用于代码块）——如果您在文本中使用缩进或多余的空白，浏览器将忽略它，您将不会在呈现的页面上看到它。但是，如果您将文本包含在`<pre></pre>`标签中，那么空白将会以与你在文本编辑器中看到的相同的方式渲染出来。一般`code`元素嵌套在`pre`元素中 
- [`var`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/var): 用于标记具体变量名。
- [`kbd`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/kbd): 用于标记输入电脑的键盘（或其他类型）输入。
- [`samp`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/samp): 用于标记计算机程序的输出。



`<time>`元素用于标记时间，`<time>`元素中内容的格式多种多样，不易被机器识别。`datetime`属性中提供容易被机器识别的时间格式。



`<br>`空元素可以进行换行，`<hr>` 元素在文档中生成一条水平分割线。



HTML 的 **`<del>`** 标签表示一些被从文档中删除的文字内容。比如可以在需要显示修改记录或者源代码差异的情况使用这个标签。[`ins`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/ins)标签的作用恰恰于此相反：表示文档中添加的内容。

## 超链接



元素[<a>](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a)是锚，它使被标签包裹的内容（甚至是一个块级元素）成为一个超链接

~~~html
<a href='www.bilibili.com' titile='bilibili', target="_blank"> bilibili </a>

<a href="https://www.mozilla.org/zh-CN/">
  <img src="mozilla-image.png" alt="链接至 Mozilla 主页的 Mozilla 标志">
</a>
~~~



超链接属性

- href：声明该超链接的Web地址。可以提供URL（统一资源定位器），或者文档片段(#id)

	~~~html
	//contacts.html
	<h2 id="Mailing_address">邮寄地址</h2>
	
	//index.html
	<p>要提供意见和建议，请将信件邮寄至<a href="contacts.html#Mailing_address">我们的地址</a></p>
	~~~

	

	或者超链接到一个邮箱中，或者下载资源。

- title：超链接声明额外的信息。当鼠标悬停在超链接上面时，这部分信息将以工具提示的形式显示。
- target：
  - “_blank”，以新的标签页打开
  - _self：当前页面加载，此值是默认的
- download：使用该属性，在下载资源时提供一个默认的保存文件名



建议链接到非 HTML 资源——留下清晰的指示

~~~html
<p><a href="https://www.example.com/large-report.pdf">
  下载销售报告（PDF, 10MB）
</a></p>

<p><a href="https://www.example.com/video-stream/" target="_blank">
  观看视频（将在新标签页中播放，HD 画质）
</a></p>

<p><a href="https://www.example.com/car-game">
  进入汽车游戏（需要 Flash 插件）
</a></p>
~~~



## 表格

在一般业务中，表格经常用于展示数据。

## 多媒体元素

### 图片

`<img>`空元素用于插入图片

- src属性：说明图片的URL。
- alt属性：在无法显示图片时，HTML渲染alt属性的内容。推荐设置为空值`alt=""`。一般写入描有关图片内容的主要信息
- height、width属性，设置`<img>`的大小。默认情况下（不设置height、width属性）元素的内容和尺寸由外部资源（像是一个图片或视频文件）所定义。然而，你不应该使用 HTML 属性来改变图片的大小，在把图片放到你的网站页面之前，你应该使用图形编辑器使图片的尺寸正确。
- title属性：图片的额外信息。当鼠标悬停在`img`上面时，这部分信息将以工具提示的形式显示。



`<img>`元素相比CSS中的back-ground属性具有语义性。



`<figure>`元素描述一段独立的内容（图片，表格、代码片段等），经常与[`figcaption`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/figcaption) 配合使用。`figcaption` 描述`<figure>`内容的标题或简要描述。`<figcaption>` 元素必须是它的第一个或者最后一个子节点。

~~~html
<figure>
    <img src="" alt="">
    <figcaption>title or description of img</figcaption>
</figure>

<figure>
  <figcaption>Get browser details using <code>navigator</code>.</figcaption>
  <pre>
function NavigatorExample() {
  var txt;
  txt = "Browser CodeName: " + navigator.appCodeName;
}</pre>
</figure>

<figure>
  <p style="white-space:pre">
Bid me discourse, I will enchant thine ear,
  Or like a fairy trip upon the green,
Or, like a nymph, with long dishevell'd hair,
  Dance on the sands, and yet no footing seen:
Love is a spirit all compact of fire,
  Not gross to sink, but light, and will aspire.</p>
  <figcaption><cite>Venus and Adonis</cite>,
    by William Shakespeare</figcaption>
</figure>
~~~





### 音视频

`<video>`元素允许嵌入一段视频

~~~html
<video src="rabbit320.webm" controls>
  <p>你的浏览器不支持 HTML5 视频。可点击<a href="rabbit320.mp4">此链接</a>观看</p>
</video>
~~~

- src属性指明视频源

- controls布尔属性，使用浏览器提供的控件界面

- 当浏览器不支持 `<video>` 标签的时候吗，会渲染video的内容，这些内容因此称为后备内容。

- heigh、width

- autoplay，立即播放，不推荐使用该属性

- loop，循环播放

- poter，属性值是一个图像的URL，这个图像会在视频播放前显示，通常用于粗略的预览或者广告。

- preload用于缓冲较大文件

	- none：不缓冲
	- auto：页面加载后缓冲媒体文件
	- metadata，只缓冲文件的元数据
	
	

我们可以使用多个播放源以提高兼容性，通过`<source>`元素说明其中一个播放源，注意在`video`元素中使用`sourc`e元素时，就不要再设置`video`的`src`属性。

~~~html
<video controls>
  <source src="rabbit320.mp4" type="video/mp4">
  <source src="rabbit320.webm" type="video/webm">
  <p>你的浏览器不支持 HTML5 视频。可点击<a href="rabbit320.mp4">此链接</a>观看</p>
</video>
~~~

- `src`属性指明视频源
- `type`说明类型，浏览器会依次检查各个`source`元素的`type`属性，若发现不兼容该格式，就直接跳过。若不提供该属性，则浏览器就尝试加载该播放源，这浪费一部分宽带。type属性值[MIME types](https://developer.mozilla.org/zh-CN/docs/Glossary/MIME_type) 请参见https://www.iana.org/assignments/media-types/media-types.xhtml



`audio`元素和`video`元素的使用方式类似，但不支持`width`、`height`、`poster`等属性。



`<track>`元素用于显示视频的音轨文本（CC字幕）。`<track>` 标签需放在 `<audio>` 或 `<video> 标签当中`，同时需要放在所有 `<source> `标签之后。它必须链接到`.vtt `文件。

~~~html
<video controls>
    <source src="example.mp4" type="video/mp4">
    <source src="example.webm" type="video/webm">
    <track kind="subtitles" src="subtitles_en.vtt" srclang="en">
</video>
~~~

- `kind`属性，说明音轨文本属于哪种类型
	- `subtitles`，翻译字幕
	- `captions`，同步翻译对白，或是描述一些有重要信息的声音，来帮助那些不能听音频的人们理解音频中的内容。
	- `descriptions`，将文字转换为音频，用于服务那些有视觉障碍的人
- `srclang`属性说明用何种语言编写的`subtitles`



一个典型的vtt文件如下：

~~~html
WEBVTT

1
00:00:22.230 --> 00:00:24.606
第一段字幕

2
00:00:30.739 --> 00:00:34.074
第二段

  ...

~~~





### 嵌入元素以及其他

`<iframe>`, `<embed>` 和 `<object>` 元素。`<iframe>`用于嵌入其他网页，另外两个元素则允许你嵌入 PDF，SVG，甚至 Flash — 一种正在被淘汰的技术。



先介绍`<iframe>`元素

~~~HTML
<iframe src="https://developer.mozilla.org/zh-CN/docs/Glossary"
        width="100%" height="500"
        allowfullscreen sandbox>
  <p> <a href="https://developer.mozilla.org/zh-CN/docs/Glossary">
    Fallback link for browsers that don't support iframes
  </a> </p>
</iframe>
~~~

- `width`、`height`
- [`src`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe#attr-src)属性说明来源。为了提高速度，在主内容完成加载后，使用 JavaScript 设置 iframe 的 `src` 属性是个好主意。这使你的页面可以更快地被使用，并减少你的官方页面加载时间（重要的 [SEO](https://developer.mozilla.org/zh-CN/docs/Glossary/SEO) 指标）
- 支持备选内容
- sandbox：该属性对呈现在 iframe 框架中的内容启用一些额外的限制条件。属性值可以为空字符串（这种情况下会启用所有限制），也可以是用空格分隔的一系列指定的字符串。有效的值请见https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe#attr-sandbox



下面是`<object>`元素的例子

~~~html
<object data="mypdf.pdf" type="application/pdf"
        width="800" height="1200" typemustmatch>
  <p>You don't have a PDF plugin, but you can <a href="myfile.pdf">download the PDF file.</a></p>
</object>
~~~

更多请见(https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/object)、(https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/embed)



`<canvas>`元素可被用来通过 JavaScript（[Canvas](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API) API 或 [WebGL](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API) API）绘制图形及图形动画。

~~~html
<canvas id="canvas" width="300" height="300">
  抱歉，您的浏览器不支持 canvas 元素
 （这些内容将会在不支持<canvas>元素的浏览器或是禁用了 JavaScript 的浏览器内渲染并展现）
</canvas>
~~~



`<svg>`用于嵌入矢量图形，例子如下：

~~~html
<?xml version="1.0"?>
//意大利国旗
<svg xmlns="http://www.w3.org/2000/svg"
     width="150" height="100" viewBox="0 0 3 2">
  <rect width="1" height="2" x="0" fill="#008d46" />
  <rect width="1" height="2" x="1" fill="#ffffff" />
  <rect width="1" height="2" x="2" fill="#d2232c" />
</svg>
~~~

除了与JavaScript进行互操作之外，不推荐使用代码方式描述一个svg图片。最好是`<img src="index.svg">`。更多`<svg>`元素的使用请参见https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/svg。



### 响应式图片

处理响应式图片我们需要关注两个问题：

- 美术设计：当你想为不同布局提供不同剪裁的图片——比如在桌面布局上显示完整的、横向图片，而在手机布局上显示一张剪裁过的、突出重点的纵向图片，可以用 [`picture`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/picture) 元素来实现。



- 分辨率切换：当你想要为窄屏提供更小的图片时，因为小屏幕不需要像桌面端显示那么大的图片；以及你想为高/低分辨率屏幕提供不同分辨率的图片时，都可以通过 SVG images、 [`srcset`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#attr-srcset) 以及 [`sizes`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#attr-sizes) 属性来实现。



`<picture>`元素与`vedio`元素类似，例子如下：

~~~html
<picture>
  <source media="(max-width: 799px)" srcset="elva-480w-close-portrait.jpg">
  <source media="(min-width: 800px)" srcset="elva-800w.jpg">
  <source type="image/svg+xml" srcset="pyramid.svg">
  <source type="image/webp" srcset="pyramid.webp">
    
  <img src="elva-800w.jpg" alt="Chris standing up holding his daughter Elva">
</picture>
~~~

`<picture>`可以包含多个`<source>`元素。`source`元素的更详细介绍请见https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/source

`media`属性是媒体查询，在`CSS`中我们会详细介绍。`type`属性说明图片的类型，浏览器检查这一属性值，若不支持则不应用。`<source>`可以使用引用多个图像的`srcset`属性，还有`sizes`属性（在美术设计的语境下不常用）。最好在最后提供一个`<img>`元素。





利用`<image>`中的srcset、sizes属性处理分辨率问题，例子如下：

~~~html
<img srcset="elva-fairy-320w.jpg 320w,
             elva-fairy-480w.jpg 480w,
             elva-fairy-800w.jpg 800w"
     sizes="(max-width: 320px) 280px,
            (max-width: 480px) 440px,
            800px"			
     src="elva-fairy-800w.jpg" alt="Elva dressed as a fairy">
~~~



`srcset`定义了我们允许浏览器选择的图像集。`sizes`定义了一组媒体条件，当某个媒体条件真时，图像的宽度将设置为对应的值。注意这里使用的宽度单位是`w`，表示图像的真实大小。在上述例子中，如果媒体查询都失败时，就会应用800px宽度。在`picture`中`source`的`src`属性会失效。

所以，有了这些属性，浏览器会：

1. 查看设备宽度
2. 检查`sizes`列表中哪个媒体条件是第一个为真
3. 查看给予该媒体查询的宽度大小
4. 查看`srcset`列表，引用最接近所选宽度的图像。



老旧的浏览器不支持这些特性，它会忽略这些特征。并继续正常加载 [`src`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#attr-src)属性引用的图像文件。

你可以让浏览器通过`srcset`和 x 语法结合而不用`sizes`，来选择适当分辨率的图片。

~~~html
<img srcset="elva-fairy-320w.jpg,
             elva-fairy-480w.jpg 1.5x,
             elva-fairy-640w.jpg 2x"
     
     src="elva-fairy-640w.jpg" alt="Elva dressed as a fairy">
~~~



## 表格

`<td>`创建单元格

`<th>`创建表格的标题，它是一种特殊的单元格。

`<tr>`创建表格的一行

`<table>`描述一个表格



`<td>`、`<th>`中的`colspan`、`rowspan`分别允许单元格跨越多行多列，同时会挤占其他单元格的位置。属性值是一个整数

~~~html
<table>
        <tr>
              <th colspan="2">Animals</th>
        </tr>
        <tr>
              <th colspan="2">Hippopotamus</th>
        </tr>
        <tr>
              <th rowspan="2">Horse</th>
              <td>Mare</td>
        </tr>
    	<tr>
              <td>Stallion</td>
        </tr>
</table>
~~~



`colgroup`、`col`常用于为某一列设置样式，例子如下

~~~html
<table>
    <colgroup>
        <col span="2">
        <col>
    </colgroup>
</table>
~~~

在上述例子中，`col span='2'`为前两列设置样式，第二个`col`为第三列设置样式。如果一个单元格跨越多列，那么该单元格第一列所应用的样式作为整个单元格的样式。

为某一行设置样式，可以通过`<tr>`元素 + `CSS`来处理。



`<caption>`为表格增加一个标题，`summary` 被 HTML5 规范废除了。

使用`<thead>`、`<tfoot>`、`<tbody>`这些元素可以结构化表格。很有意思的一点是，编写代码时`<tbody>`元素必须位于`<tfoot>`元素下面，但是在实际渲染中，`<tfoot>`总是在最后一行。



下面讲解如何创建单元格之间的联系，这样做提供了更强的语义，同时有利于屏幕阅读器识别表格结构，来帮助视觉障碍人群理解表格的内容。

`<th>`元素的scope属性定义了该表头元素关联的单元格，属性值如下：

- row：关联一行中所有的单元格
- col：关联一列中所有的单元格
- rowgroup：当<th>跨多行时有意义
- colgroup：当<th>跨多列时有意义



如果要替代 `scope` 属性，可以使用 [`id`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes#attr-id) 和 [`headers`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/td#attr-headers) 属性来创造标题与单元格之间的联系。使用方法如下：

1. 为每个`<th>` 元素添加一个唯一的 `id` 。
2. 为每个 `<td>` 元素添加一个 `headers` 属性。每个单元格的`headers` 属性需要包含它从属于的所有标题的 id，之间用空格分隔开。

~~~html
<thead>
  <tr>
    <th id="purchase">Purchase</th>
    <th id="location">Location</th>
    <th id="date">Date</th>
    <th id="evaluation">Evaluation</th>
    <th id="cost">Cost (€)</th>
  </tr>
</thead>
<tbody>
<tr>
  <th id="haircut">Haircut</th>
  <td headers="location haircut">Hairdresser</td>
  <td headers="date haircut">12/09</td>
  <td headers="evaluation haircut">Great idea</td>
  <td headers="cost haircut">30</td>
</tr>
  ...
</tbody>
~~~



>id与headers在单元格之间创造了非常精确的联系。但是维护起来异常繁琐。使用 `scope` 的方法对于大多数表格来说，也够用了。



## 表单





