





# 集合

[TOC]

Java集合类库采用“持有对象（holding objects）”的思想，并将其分为两个不同的概念：

- 集合（Collection），集合中的元素符合某些规则，例如，List以插入顺序保存元素，Set不能包含重复元素等
- 映射（Map）：元素以键值对的形式保存。ArrayList使用索引查找对象，Map也被称为关联数组（associative array），或者称为字典（dictionary）。

注：集合与映射会复制一份对象，并不影响原生对象。


![](figure/Java集合框架.gif)

注意LinkedList实现了Queue接口，但图中并未体现。



可以看到，实际上只有四个基本的集合组件： **Map** ， **List** ， **Set** 和 **Queue** ，它们各有两到三个实现版本HashMap、LinkedHashMap、TreeSet、ArrayList等。


Arrays.asList()，接受一个数组或者是可变参数，并返回List对象。List类的底层实现是一个固定大小的数组，对其调用add等方法会抛出异常，将在其子类中覆写该方法并将子类对象赋值给List从而解决这个问题。

Collection.addAll()，接受一个Collection类型的对象，以及一个数组或者可变参数。

collection.addAll()，所有的collection对象也包含一个addAll方法，该方法接受一个一个数组或者可变参数。


使用Collection接口的一个理由是它可以使我们创建更通用的代码。通过针对接口而非具体实现来编写代码，我们的代码可以应用于更多类型的对象。标准 C++ 类库中的集合并没有共同的基类——集合之间的所有共性都是通过迭代器实现的。但是，在Java中这两种方法（迭代器、基类）绑定在了一起，因为实现 **Collection** 就意味着需要提供 `iterator()` 方法。

下面给出重载AbstractCollection类的代码

~~~java
import java.util.*;
public class CollectionSequence 
extends AbstractCollection<Integer>{
    private Integer[] datas;
    @Override
    public int size() { return datas.length; }
    @Override
    public Iterator<Integer> iterator() {
        return new Iterator<Integer>() {
            private int index = 0;
            @Override
            public boolean hasNext() {
                return index < datas.length;
            }
            @Override
            public Integer next() {return datas[index++]; }
            @Override
            public void remove() {
                throw new UnsupportedOperationException();
            }
        };
    }
}
~~~



## List

有两种类型的LIST：

- ArrayList，随机访问代价低，在中间插入删除元素代价高。

- LinkedList，中间插入删除元素代价低，随机访问代价高。

它们有以下方法
- contains()
- containsAll()，集合中
- remove(Object o)
- removeAll()
- indexOf()，返回指定对象在集合中的索引，没有返回-1。
- subList()
- retainAll()，集合交集∩操作
- set(int index, Object o )，替换索引处的元素
- clear()
- isEmpty()
- addAll()
- toArray()
- get()，获取元素

注：contains等方法会调用对象equals()。

### LinkedList

- `getFirst()` 和 `element()` 是相同的，它们都返回列表的头部（第一个元素）而并不删除它，如果 **List** 为空，则抛出 **NoSuchElementException** 异常。 `peek()` 方法与这两个方法只是稍有差异，它在列表为空时返回 **null** 
- `removeFirst()` 和 `remove()` 也是相同的，它们删除并返回列表的头部元素，并在列表为空时抛出 **NoSuchElementException** 异常。 `poll()` 稍有差异，它在列表为空时返回 **null** 
- `removeLast()` 删除并返回列表的最后一个元素
- `addFirst()` 在列表的开头插入一个元素
- `offer()` 与 `add()` 和 `addLast()` 相同。 它们都在列表的尾部（末尾）添加一个元素。

这些具有差异的名称是为了在特定用法（栈、队列）中的上下文环境更加符合语境。



### stack

Java1.0版本栈的实现很糟糕，推荐使用ArrayDeque类，它是Deque的子类，部分方法如下

- pop()，返回栈顶元素，并删除
- push()
- isEmpty()
- peek()，返回栈顶元素，并不删除

~~~java
Deque<Type> q = new ArrayDeque<>();
~~~



## Set

**Set** 不保存重复的元素，**Set** 最常见的用途是测试某个对象是否在一个 **Set** 中。**Set** 具有与 **Collection** 相同的接口，因此没有任何额外的功能。**HashSet** 使用了散列函数、**TreeSet** 将元素存储在红-黑树数据结构。**HashSet** 提供最快的查询速度，而 **TreeSet** 保持元素处于排序状态。 **LinkedHashSet** 按插入顺序保存其元素，但使用散列提供快速访问的能力

~~~java
Set<Integer> s = new HashSet<>();
~~~



## Map

- get()
- put()
- containsKey()
- containsValue()
- values()，返回一个Collection对象
- keySet()，返回一个Set对象



**HashMap** 专为快速访问而设计，而 **TreeMap** 保持键始终处于排序状态，所以没有 **HashMap** 快。 **LinkedHashMap** 按插入顺序保存其元素，但使用散列提供快速访问的能力

## Queue

参考LinkedList的接口

~~~java
Queue<integer> queue = new LinkedList<>();
~~~



### PriorityQueue

**PriorityQueue** 上调用 `offer()` 方法来插入一个对象时，该对象会在队列中被排序，默认的排序使用队列中对象的*自然顺序*（natural order），但是可以通过提供自己的 **Comparator** 来修改这个顺序。**PriorityQueue** 确保在调用 `peek()` ， `poll()` 或 `remove()` 方法时，获得的元素将是队列中优先级最高的元素

~~~java
PriorityQueue priorityQueue = new PriorityQueue<>();
~~~



## 迭代器

迭代器分离了遍历集合的操作与集合本身的底层结构。即统一了对集合的访问方式。

使用对象的iterator方法获取到一个迭代器，此时iterator并未指向任何集合中的任何元素，可认为它所指向元素的索引为-1（这是种假设，只要逻辑自洽就行）。

- next()，iterator先向前移动，再返回所指向的对象。
- hasNext() ,判断iterator是否还能向前移动。
- remove()，删除iterator所指向的对象，这是一个可选操作，实现与否取决于具体实现。



ListIterator是Iterator的子类型，它只能由List类对象通过调用listIterator来获取。ListIterator能双向移动。它扩展了以下方法

- set()
- previous()
- previousIndex()
- nextIndex()
- hasPrevious()
- hasNext()



for-in语法主要用于数组，但是也适用于任何Collection对象。这是因为Java 5 引入了一个名为 **Iterable** 的接口，该接口包含一个返回类型为 **Iterator** 的 `iterator()` 方法。*for-in* 使用此 **Iterable** 接口来遍历序列。因此，如果创建了任何实现了 **Iterable**接口 的类，都可以将它的对象用于 *for-in* 语句中，综上for-in语句期望一个数组或者Iterable接口对象。

~~~java

import java.util.*;
public class IterableClass implements Iterable<String> {
  protected String[] words = ("And that is how " +
    "we know the Earth to be banana-shaped."
    ).split(" ");
  @Override
  public Iterator<String> iterator() {
    return new Iterator<String>() {
      private int index = 0;
      @Override
      public boolean hasNext() {
        return index < words.length;
      }
      @Override
      public String next() { return words[index++]; }
      @Override
      public void remove() { // Not implemented
        throw new UnsupportedOperationException();
      }
    };
  }
  public static void main(String[] args) {
    for(String s : new IterableClass())
      System.out.print(s + " ");
  }
}
/* Output:
And that is how we know the Earth to be banana-shaped.
*/

~~~



尝试将数组作为一个 **Iterable** 参数传递会导致失败。这说明不存在任何从数组到 **Iterable** 的自动转换（装箱）; 必须手工执行这种转换Arrays.asList();

~~~java
import java.util.*;
public class ArrayIsNotIterable {
  static <T> void test(Iterable<T> ib) {
    for(T t : ib)
      System.out.print(t + " ");
  }
  public static void main(String[] args) {
    test(Arrays.asList(1, 2, 3));
    String[] strings = { "A", "B", "C" };
    // An array works in for-in, but it's not Iterable:
    //- test(strings);
    // You must explicitly convert it to an Iterable:
    test(Arrays.asList(strings));
  }
}
/* Output:
1 2 3 A B C
*/
~~~



## 比较器

java中实现对象排序的方式主要有两种：Comparator接口与Comparable接口

内部实现用Comparable接口，需重载int compareTo(Object o)，

1. 如果当前对象 this 大于形参对象 o ，则返回正整数，
2. 如果当前对象 this 小于形参对象 o ，则返回负整数，
3. 如果当前对象 this 等于形参对象 o ，则返回零。



外部实现用Comparator接口，需要重载int compare(Object o1, Object o2); 、boolean equals(Object obj);后者会从Object基类隐式继承。

一般来讲，Comparator会屏蔽Comparable的，这种行为具体取决于实现。

~~~java
int cmp;
Entry<K, V> parent;
Comparator<? super K> cpr = comparator;
if (cpr != null) {							//如果实现了Comparator接口
    
} else {
    										//没有实现的话使用Comparable
}
~~~



 
