# CSS 解决方案

[TOC]

## 水平垂直居中方法

~~~html
<div class="outer">
        <div class="inner">
            hello, world;
        </div>
</div>
~~~



行级元素的居中，只需text-align : center即可

~~~css
.outer {
	text-align : center;
}
.inner {
	display : inline-block
}
/**/
~~~



如果显式设置子元素的宽度，则可以设置`margin : 0 auto`来居中，`margin:0 auto`只对块级元素生效

~~~css
.inner {
	width : fit-content;
   	margin : 0 auto;
}
~~~

CSS3支持fit-content属性值，使得宽度能够像高度那样自适应子元素的内容。



此外还可以通过flex布局实现水平居中

~~~css
.outer {
	display : flex;
    justify-content : center;
}
~~~



## 瀑布流

## 伸缩栏

## 高宽等比放缩

可以在高度上使用vw单位。但是如果html设置了min-width，这个方法可能不尽人意，因为此时高度依旧按照视口大小来计算。可以在该元素上使用min-width进行修正，这个方法可维护性差。

~~~css
img {
    height : 10vw;
    min-height: 110px;
}
~~~



或者使用CSS最新特性aspect-ratio

~~~css
img {
    width : 100%;
    height : auto;
    aspect-ratio : 16 / 10;
}
~~~

