# Kotlin

## 类型系统

在Java中有这样一条编码建议：除非一个变量明确允许被修改，否则都应该给它加上final关键字。这样防止别人意外地修改该变量。

==Kotlin设计思想：必须显式指定变量的不可变性。==Kotlin提供`var`、`val`关键字来指定变量的不可变性。

小诀窍：一开始使用`val`声明变量，当`val`无法满足需求时，再使用`var`。这样设计出来的程序会更加健壮，也更加符合高质量的编码规范。



Kotlin只支持静态类型，但具有强大的类型自动推导系统。

### 字符串的处理

字符串内嵌表达式

~~~kotlin
"str ${exrepssion}";
"str $variable";
~~~



### 可空类型系统

据某项统计表明，Android系统上崩溃率最高的异常类型就是**空指针异常（NullPointerException）**。所以==在Kotlin中，所有类型都默认是不可空类型的==。

通过在类型后添加？，来使用可空类型系统。

~~~kotlin
var num : Int?
~~~



此时语法分析器**仍会在编译期之前做空指针异常检查**，只有程序逻辑正确地处理了空指针异常，程序才能通过编译。

~~~kotlin
fun doStudy(study : Study?) {
    if (study != null) {
        study.readBooks();
        study.doHomework();
    }
}
~~~



在某些情况下（例如，全局变量判空），语法分析器会失效

~~~kotlin
val study : Study? = null;
fun main() {
    if (study != null) doStudy(study);
}
fun doStudy(study : Study?) {
    study.readBooks();			//报错
    
}
~~~

此时使用`!!.`操作符，让语法分析器跳过对此处的检查。这里由程序员负责，即使在运行期会抛出空指针异常。
~~~kotlin
study!!.readBooks();
~~~



下面介绍一些判空工具，用于简化代码的编写。

- ?.
- ?:
- let

## 语句

`if`语句具有返回值，此时每一个分支路径上的最后一条路径必须都是表达式

~~~kotlin
val value = if (num1 > num2) num1 else num2;
~~~



## 函数

在Kotlin，形参类型都是`val`的。



默认参数的使用

~~~kotlin
fun fun1(name : String = "GaoRuofan", age : Int) {}
fun fun2(name : String, age :Int = 12) {}
fun main() {
    fun1(age = 15);
    fun2("GaoRuofan");
}
~~~



## 类

==Kotlin设计思想：类默认是不可变的==，即类不允许是被继承的，这一点与`val`变量的设计理念是一样。在类前添加`open`关键字，可允许类被继承。

~~~kotlin
open class Person { }
class Student : Person() { }
~~~





Kotlin将构造函数分为**主构造函数**和**次构造函数**。主构造函数中说明在实例化对象时必须要传入的参数。而次构造函数与Java中的构造函数一样。

相关语法要点总结：

- `init`代码块用于执行主构造函数中的逻辑。
- 次构造函数中的参数是`val`的。所以不用显式声明是`var`还是`val`。而主构造函数中的参数列表要同时声明该类的成员（字段），故要声明`var`或`val`。
- 至多一个主构造函数，任意个次构造函数。
- 若程序员没有编写任意一个构造函数，那么编译器为该类生成一个无任何参数的默认构造函数。

~~~kotlin
class Student(val son:String, val grade :Int) : Person() {
    init {
        println("main constructor");
    }
    constructor(name :String, age :Int) :this("", 0, name, age) {
        //次构造函数的执行逻辑
    }
}
class Teacher : Person() {} //无主构造函数
~~~





==`Kotlin`中子类中的构造函数必须调用父类中的构造函数==。==当一个类既有主构造函数又有次构造函数，那么必须此构造函数必须调用主构造函数。==

~~~kotlin
class Student(val son:String, val grade :Int) : Person() {
    constructor(name :String, age :Int) : this("", 0, name, age) {} //调用主构造函数
    constructor(name :String) : this(name, 18) {} //调用constructor(name :String, age :Int)
}

class Student : Person { //没有主构造函数
    constructor(name :String, age :Int) : super(name, age) {}
}

~~~







| 修饰符    | Java               | Kotlin             |
| --------- | ------------------ | ------------------ |
| public    | 所有类可见         | 所有类可见（默认） |
| protected | 同包以及子类中可见 | 子类中可见         |
| default   | 同包中可见（默认） | 无                 |
| private   | 本类可见           | 本类中可见         |
| internal  | 无                 | 同模块可见         |



data声明一个数据类，此时会根据主构造函数中的参数，为类生成equals()（判断是否相等）、hashCode()（使HashMap能正常工作）、toString()（打印日志）方法。

```kotlin
data class Phone(val number:String, val ID :Int) {}
```

> 数据类用于将数据映射到内存中，为程序逻辑提供数据模型的支持



单例类是采用单例模式的类。在Java，通常这样实现单例类

~~~java
public class Singleton {
    private Singleton() {}
    private static Singleton instance;
    public synchronized static Singleton getinstance() { return instance; }
}
~~~

而在Kotlin中，只需：

~~~kotlin
object class Singleton { } 
~~~



## 集合

listOf创建一个不可变的集合，而mutableListOf()创建一个可变集合。



## Lambda

Lambda表达式简要来说就是可以当作参数传递的一段代码。

Lambda表达式的语法结构：

~~~kotlin
{参数名1 : 参数类型, ... , 参数名n : 参数类型 -> 函数体}
~~~

函数体内的最后一条语句（必须为表达式语句）作为Lambda的返回值。在Lambda内不允许直接使用return语句，而是使用return@label语句。

