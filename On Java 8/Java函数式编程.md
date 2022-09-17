# Java函数式编程

[TOC]



FP的意义参阅这篇文章 [新旧对比 (njuics.github.io)](https://njuics.github.io/OnJava8/#/book/13-Functional-Programming?id=lambda表达式)

OO（object oriented，面向对象）是抽象数据，FP（functional programming，函数式编程）是抽象行为。纯粹的函数式语言在安全性方面更进一步。它强加了额外的约束，即所有数据必须是不可变的：设置一次，永不改变。将值传递给函数，该函数然后生成新值但从不修改自身外部的任何东西（包括其参数或该函数范围之外的元素）。当强制执行此操作时，你知道任何错误都不是由所谓的副作用引起的，因为该函数仅创建并返回结果，而不是其他任何错误。更好的是，“不可变对象和无副作用”范式解决了并发编程中最基本和最棘手的问题之一（当程序的某些部分同时在多个处理器上运行时）。这是可变共享状态的问题。 因此，经常提出纯函数式语言作为并行编程的解决方案（还有其他可行的解决方案）。

Java中函数式编程基本思路如下：一般用java.util.java.util.function包中的接口作为行为的承受者，因此该接口类型常常作为参数或者返回类型，通过调用接口中抽象方法来执行具有差异化的行为。可以把Lambda表达式或者方法引用赋值给接口实例，并且把Lambda表达式视为匿名方法，而方法引用视为具名方法，而底层实现上却是将它们俩视为对象。实际编写业务代码时，关注点主要放在接口上，次要放在lambda的实现逻辑上。



在Java中，为了将行为传递给方法，即实现方法调用时行为不同，我们经常采用策略模式：

~~~java
interface Strategy {			//策略，暴露给其他类，用于辅助实现行为上的差异
    int approach();
}

class Soft implements Strategy { //实现具体的差异化行为
    @Override
    int approach() { }
}

public class Strategize {		//策略类，实现具体的业务逻辑，并接受差异化的行为
	Strategy strategy;
    Strategize() { strategy = new Soft(); }	//默认行为
    
    void changeStrategy(Strategy strategy) {
    	this.strategy = strategy;
  	}
    
    int run() { return strategy.approach(); }
    
    public static void main(String[] args) {
    	Strategy[] strategies = {
            new Soft(),								
            new Strategy() {
                @Override
                int approach() { }
            }
        };
        Strategize s = new Strategize();
        for (Strategy newStrategy : strategies) {
            s.chageStrategy(newStrategy);
            s.run();       
        }
	}
}
~~~



在Java8中，引入了lambda表达式以及方法引用这两种语法糖，帮助我们减少代码量。





## Lambda表达式

而在JVM上，Lambda 表达式是类，但是JVM执行各种操作让 Lambda在程序员的视角下像是函数。

Lambda表达式只能用在一个**期望单方法接口**的地方，它的语法例子如下：

~~~java
() -> i;
(i) -> i * 2;
i -> i * 2;
(i, j) -> i + j;
(i, j) -> {
    //code
    return expression;
}
~~~

- 参数：除了只有一个参数的情况，其他都必须需要括号。这里仅提供参数名即可，并不能像C++那样直接捕获参数。
- ->
- 必须要有return语句的方法体或者单个表达式，类型必须可以转换为接口方法中的返回类型



## 方法引用

Lambda创建的是匿名方法，但是我们可以通过方法引用指向具有签名的方法。语法如下:

~~~java
Object/Var::Method
~~~

方法引用也只能用在一个**期望单方法接口**的地方。被引用方法的签名要与接口方法中的一样（有例外情况）。此外，被引用方法的返回类型必须可以转换为接口方法中的返回类型。

~~~java
import java.util.*;
public class MethodReferences {
    static void hello(String name) {    //3
        System.out.println("Hello, " + name);
    }
    static class Description {
        String about;
        Description(String desc) { about = desc; }
        void help(String msg) { //4
            System.out.println(about + " " + msg);
        }
    }
    static class Helper {
        static void assist(String msg) {    //5
            System.out.println(msg);
        }
    }
    void Joke(String msg) { }
    public static void main(String[] args) {
        Describe d = new Describe();
        Callable c = d::show; // [6]					//实例化绑定引用
        c.call("call()"); // [7]						//静态绑定引用
        c = MethodReferences::hello; // [8]
        c.call("Bob");
        c = new Description("valuable")::help; // [9]		//实例化绑定引用
        c.call("information");
        c = Helper::assist; // [10]
        c.call("Help!");
    }
}

interface Callable {
    void call(String s);    //1
}
class Describe {
    int show(String msg) {  //2
        System.out.println(msg);
        return 1;
    }
}
~~~



未绑定的方法引用是指没有关联对象的普通（非静态）方法。 使用未绑定的引用时，我们必须先提供对象；使用未绑定的引用时，函数式方法的签名（接口中的单个方法）不再与方法引用的签名完全匹配，此时接口方法中的第一个参数要提供对象的引用。这样做的原因是普通方法和对象是强相关联的。

~~~java

class A {
    public static void main(String[] args) {
        C c = B::f;            
        C cc = new B()::h;	//要与实例化绑定引用做区分。
        //C ccc = B::h;		错误
        B b = new B();
        c.g(b, 1);
    }
}
class B {
    void f(int i) { }
    void h(B b, int i) {}
}
interface C {
    void g(B b, int i);
}
~~~

此外，还可以捕获构造函数的引用，语法如下：

~~~java
Object::new
~~~



## 函数式接口

先看下面这个例子：

~~~java
@FunctionalInterface
interface Functional {
  String goodbye(String arg);
}
@FunctionalInterface
interface FunctionalNoAnn {
  String goodbye(String arg);
}
public class FunctionalAnnotation {
  public String goodbye(String arg) {
    return "Goodbye, " + arg;
  }
public static void main(String[] args) {
    FunctionalAnnotation fa = new FunctionalAnnotation();
    Functional f = fa::goodbye;
    FunctionalNoAnn fna = fa::goodbye;
    // Functional fac = fa; // Incompatible
    Functional fl = a -> "Goodbye, " + a;
    FunctionalNoAnn fnal = a -> "Goodbye, " + a;
  }
}
~~~

注意到Functional以及FunctionalNoAnn接口都包含一个String func(String arg)方法，从理论上讲，它们的方法类型（返回类型与参数决定的，这和方法签名不同）是一样的，但这两个接口的实例对象fa、fac之间却不可赋值。为了解决这种问题，Java创建一组完整的目标接口，使得我们一般情况下不需再定义自己的接口，按照接口的约定使用即可。Java 8 引入了 `java.util.function` 包。它包含一组接口，这些接口是 Lambda 表达式和方法引用的目标类型。 每个接口只包含一个抽象方法，称为 *函数式方法*。以下是命名准则：

- 如果只处理对象而非基本类型，名称则为 `Function`，`Consumer`，`Predicate` 等。参数类型通过泛型添加。
- 如果接收的参数是基本类型，则由名称的第一部分表示，如 `LongConsumer`，`DoubleFunction`，`IntPredicate` 等，但返回基本类型的 `Supplier` 接口例外。
- 如果返回值为基本类型，则用 `To` 表示，如 `ToLongFunction <T>` 和 `IntToLongFunction`
- 如果返回值类型与参数类型相同，则是一个 `Operator` ：单个参数使用 `UnaryOperator`，两个参数使用 `BinaryOperator`
- 如果接收参数并返回一个布尔值，则是一个 **谓词** (`Predicate`)
- 如果接收的两个参数类型不同，则名称中有一个 `Bi`



下表描述了 `java.util.function` 中的目标类型（包括例外情况）：

| **特征**                                                     | **函数式方法名**                                             | **示例**                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 无参数； 无返回值                                            | **Runnable** (java.lang) `run()`                             | **Runnable**                                                 |
| 无参数； 返回类型任意                                        | **Supplier** `get()` `getAs类型()`                           | **Supplier`<T>` BooleanSupplier IntSupplier LongSupplier DoubleSupplier** |
| 无参数； 返回类型任意                                        | **Callable** (java.util.concurrent) `call()`                 | **Callable`<V>`**                                            |
| 1 参数； 无返回值                                            | **Consumer** `accept()`                                      | **`Consumer<T>` IntConsumer LongConsumer DoubleConsumer**    |
| 2 参数 **Consumer**                                          | **BiConsumer** `accept()`                                    | **`BiConsumer<T,U>`**                                        |
| 2 参数 **Consumer**； 第一个参数是 引用； 第二个参数是 基本类型 | **Obj类型Consumer** `accept()`                               | **`ObjIntConsumer<T>` `ObjLongConsumer<T>` `ObjDoubleConsumer<T>`** |
| 1 参数； 返回类型不同                                        | **Function** `apply()` **To类型** 和 **类型To类型** `applyAs类型()` | **Function`<T,R>` IntFunction`<R>` `LongFunction<R>` DoubleFunction`<R>` ToIntFunction`<T>` `ToLongFunction<T>` `ToDoubleFunction<T>` IntToLongFunction IntToDoubleFunction LongToIntFunction LongToDoubleFunction DoubleToIntFunction DoubleToLongFunction** |
| 1 参数； 返回类型相同                                        | **UnaryOperator** `apply()`                                  | **`UnaryOperator<T>` IntUnaryOperator LongUnaryOperator DoubleUnaryOperator** |
| 2 参数，类型相同； 返回类型相同                              | **BinaryOperator** `apply()`                                 | **`BinaryOperator<T>` IntBinaryOperator LongBinaryOperator DoubleBinaryOperator** |
| 2 参数，类型相同; 返回整型                                   | Comparator (java.util) `compare()`                           | **`Comparator<T>`**                                          |
| 2 参数； 返回布尔型                                          | **Predicate** `test()`                                       | **`Predicate<T>` `BiPredicate<T,U>` IntPredicate LongPredicate DoublePredicate** |
| 参数基本类型； 返回基本类型                                  | **类型To类型Function** `applyAs类型()`                       | **IntToLongFunction IntToDoubleFunction LongToIntFunction LongToDoubleFunction DoubleToIntFunction DoubleToLongFunction** |
| 2 参数； 类型不同                                            | **Bi操作** (不同方法名)                                      | **`BiFunction<T,U,R>` `BiConsumer<T,U>` `BiPredicate<T,U>` `ToIntBiFunction<T,U>` `ToLongBiFunction<T,U>` `ToDoubleBiFunction<T>`** |

此表仅提供些常规方案。通过上表，你应该或多或少能自行推导出你所需要的函数式接口。但是却没有 `IntComparator`，`LongComparator` 和 `DoubleComparator` 呢？有 `BooleanSupplier` 却没有其他表示 **Boolean** 的接口；有通用的 `BiConsumer` 却没有用于 **int**，**long** 和 **double** 的 `BiConsumers` 变体。遗憾的是，Java 设计者并没有尽最大努力去消除基本类型。现在，在语言的生命周期里，我们一直忍受语言设计的糟糕选择所带来的影响。

`java.util.functional` 中的接口是有限的，如果需要三参数函数的接口怎么办？那就按照命名规则自行创建。

此外，任何实现这些接口的类所创建的对象都可以像Lambda以及方法引用那样传递。

~~~java
class A implements Supplier<String>{
    @Override
    public String get() { return ""; }
    
    public static void main(String[] args) {
        A a = new A();
        f(a);
        f(() -> "")
    }
    void f(Supplier<T> t) {}
}

~~~





在编写接口时，可以使用 `@FunctionalInterface` 注解强制执行此“函数式方法”模式，即当接口中抽象方法多于一个时产生编译期错误。但是它是可选的



## 高阶函数

概念很简单，就是接受一个方法作为参数或者返回返回类型。直接给出例子
~~~java
import java.util.function.*;

public class TransformFunction {
    static Function<I, O> transform(Function<I, O> in) {
        return in.andThen(
            o -> {
                System.out.println(o);
                return o;
            });
    }

    public static void main(String[] args) {
        Function<I, O> f2 = transform(i -> {
            System.out.println(i);
            return new O();
        });
        O o = f2.apply(new I());
    }
   
}

class I {
    @Override
    public String toString() { return "I"; }
}

class O {
    @Override
    public String toString() { return "O"; }
}
/* Output:
* I
* O
* /
~~~

## 闭包

从对象的一个方法中返回lambda表达式，本质上仍是匿名内部类，所以之前对匿名内部类的讨论全都适用于方法中的lambda表达式，包括但不限于共享变量、final语法限制、访问所有字段等。在这里不过多赘述。



## 函数组合

函数组合（Function Composition）意为“多个函数组合成新函数”。它通常是函数式编程的基本组成部分，在接口中以默认方法的形式实现。

| 组合方法                                                    | 支持接口                                                     |
| ----------------------------------------------------------- | ------------------------------------------------------------ |
| `andThen(argument)` 执行原操作,再执行参数操作               | **Function BiFunction Consumer BiConsumer IntConsumer LongConsumer DoubleConsumer UnaryOperator IntUnaryOperator LongUnaryOperator DoubleUnaryOperator BinaryOperator** |
| `compose(argument)` 执行参数操作,再执行原操作               | **Function UnaryOperator IntUnaryOperator LongUnaryOperator DoubleUnaryOperator** |
| `and(argument)` 原谓词(Predicate)和参数谓词的短路**逻辑与** | **Predicate BiPredicate IntPredicate LongPredicate DoublePredicate** |
| `or(argument)` 原谓词和参数谓词的短路**逻辑或**             | **Predicate BiPredicate IntPredicate LongPredicate DoublePredicate** |
| `negate()` 该谓词的**逻辑非**                               | **Predicate BiPredicate IntPredicate LongPredicate DoublePredicate** |



下面给出几个例子说明：

~~~java
import java.util.function.*;

public class FuntionComposition {
    static Function<String, String>
        f1 = s -> {
            System.out.println(s);
            return s.replace('A', '_');
        },
        f2 = s -> s.substring(3),
        f3 = s -> s.toLowerCase(),
        f4 = f1.compose(f2).andThen(f3);
    
    public static void main(String[] args) {
        System.out.println(f4.apply("Go AFTER ALL AMBULANCES"));
    }
}


import java.util.function.*;
import java.util.stream.*;

public class PredicateComposition {
    static Predicate<String>
        p1 = s -> s.contains("bar"),
        p2 = s -> s.length() < 5,
        p3 = s -> s.contains("foo"),
        p4 = p1.negate().and(p2).or(p3);
    public static void main(String[] args) {
        Stream.of("bar", "foobar", "foobaz", "fongopuckey")
        .filter(p4)
        .forEach(System.out::println);
    }
}
~~~





## 柯里化（Currying）

将一个多参数的函数，转换为一系列单参数函数

~~~java
import java.util.function.*;

public class Curry3Args {
   public static void main(String[] args) {
      Function<String,
        Function<String,
          Function<String, String>>> sum =
            a -> b -> c -> a + b + c;
      Function<String,
        Function<String, String>> hi =
          sum.apply("Hi ");
      Function<String, String> ho =
        hi.apply("Ho ");
      System.out.println(ho.apply("Hup"));
   }
}
~~~

 注意到这一连串的箭头很巧妙，现在有了一些“带参函数”和剩下的 “自由函数”（free argument） 

