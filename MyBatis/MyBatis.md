# MyBatis

官方文档：https://mybatis.net.cn/getting-started.html

MyBatis是一个持久层框架，包括Maps和Data Access Object。

JavaBean对象是可重复使用的Java组件，它是满足以下条件的类：

- 所有的JavaBean必须放在一个包(Package)中
- JavaBean必须是public class类
- 所有属性必须都是private
- 所有的属性必须都有对应的getter与setter
- 具有默认构造函数

[TOC]
## 基本
### 示例

创建一个新项目，删除src文件夹并添加一个子项目（模块）。父模块的pom.xml如下

~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <!--项目描述-->
    <groupId>com.AtsukoRuo</groupId>
    <artifactId>Demo8</artifactId>
    <packaging>pom</packaging>
    <version>1.0-SNAPSHOT</version>
    
	<!--该项目的子模块-->
    <modules>
        <module>mybatis-01</module>
    </modules>

    <properties>
        <maven.compiler.source>19</maven.compiler.source>
        <maven.compiler.target>19</maven.compiler.target>
    </properties>
    
    <!--导入依赖-->
    <dependencies>
        <!--mysql驱动-->
        <!-- https://mvnrepository.com/artifact/mysql/mysql-connector-java -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.30</version>
        </dependency>
        <dependency>
            <!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.11</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
        </dependency>
    </dependencies>
    
    <!--记得刷新Maven-->
    <!--过滤文件-->
    <build>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/*.properties</include>
                    <include>**/*.xml</include>
                </includes>
                <filtering>false</filtering>
            </resource>
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.properties</include>
                    <include>**/*.xml</include>
                </includes>
                <filtering>false</filtering>
            </resource>
        </resources>
    </build>
</project>
~~~

在子项目中创建一个工具类

~~~java
public class MybatisUnit {
    private static SqlSessionFactory sqlSessionFactory;
    
    static {
        try {
            //配置文件的命名和位置是随意的，只要能获取到文件的输入流即可
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
          	
            //通过SqlSessionFactoryBuilder解析配置文件并返回一个session工厂
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
            inputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    public static SqlSession getSqlSession() {
        //再通过session工厂获取到与配置文件绑定的session对象
        return sqlSessionFactory.openSession();
    }
}
~~~

注意：这里有三个对象：

- SqlSessionFactoryBuilder
- SqlSessionFactory
- SqlSession：通过Session对象与数据库进行交互。注意它不是线程安全的



配置文件（推荐命名mybatis-config.xml）如下：

~~~xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<!--核心配置文件-->
<configuration>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <!--&的转义字符 &amp;-->
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis?useSSL=true&amp;useUnicode=true&amp;characterEncoding=UTF-8"/>
                <property name="username" value="root"/>
                <property name="password" value="grf.2001"/>
            </dataSource>
        </environment>
    </environments>
    
    <!--每一个Mapper.xml都需要在MapperRegistry注册-->
    <mappers>
        <!--resource的路径是相对根目录的-->
        <mapper resource="com/AtsukoRuo/DAO/UserMapper.xml" />
    </mappers>
</configuration>
~~~

这些配置都会SqlSession对象中，通过调试可以观察到。



再编写一个**POJO（Plain Old Java Object）**，与数据库返回结果对应！。POJO的成员名必须和字段名相同，但是不区分大小写！

然后再编写**DAO（Data Access Object）**，该对象是数据持久化层与业务逻辑层之间的接口对象。这里推荐使用接口来实现该对象！例如：

~~~java
public interface UserDao {
    List<User> getUserList();
}
~~~

然后再编写mapper文件，例如：

~~~xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<!--由原来编写UserDaoImpl类转换为Mapper配置文件-->
<!--namespace绑定一个对应的DAO-->
<mapper namespace="com.AtsukoRuo.DAO.UserDao">
    <!--查询语句-->
    <!--id一定要对应方法的名字-->
    <select id="getUserList" resultType="com.AtsukoRuo.pojo.User">
        select * from mybatis.user;
    </select>
</mapper>
~~~

最后就可以使用了，使用方法如下：

~~~java
//获取SqlSession对象
SqlSession sqlSession = MybatisUnit.getSqlSession();
//方式一 面向接口编程 推荐
//从session得到指定UserDao.class的mapper
UserDao mapper = sqlSession.getMapper(UserDao.class);
List<User> userList = mapper.getUserList();
//方式二
List<User> userList = sqlSession.selectList("com.AtsukoRuo.DAO.UserDao.getUserList");
//关闭SqlSession
sqlSession.close();
~~~



### Maven的路径问题

默认情况下，构建完Maven后，src/main/java与src/main.resources会组织在项目的CLASS_PATH下，但不包括这两个文件本身！此时必须通过`getClass().getResource("/")`获取到该类所属的CLASS_PATH。

java与resources下同路径的文件夹会合并在一起。

而文件的相对路径是相对工作目录的，可以通过`System.getProperty("user.dir")`获取到工作目录，一般和CLASS_PATH不一样。

jvm根据CLASS_PATH查找类，而JRE是Java Running Environment，包括基本类库以及Java虚拟机。而JDK是java development kit，包括编译器以及调试器的。

一般来说，Maven路径和其他Tomcat路径规范并不冲突！使用各自的API就可以了

### CRUD

~~~java
public interface UserMapper {
    User getUserById(int id);
    int addUser(User user);
    int updateUser(User user);
    int deleteUser(int id);
    Map<String, Object> getUserMap();
}
~~~

该接口对应的mapper

~~~XML
<mapper namespace="com.AtsukoRuo.DAO.UserMapper">
    <!--查询语句-->
    <!--id对应方法的名字-->
    <!--只设置与select返回的字段相匹配的成员，其他未匹配到的成员设置为null 而且字段的类型与成员的类型要相匹配。-->

    <select id="getUserList" resultType="com.AtsukoRuo.pojo.User">
        <!--如果返回的是Class或者List<Class> 或者多条Map 那么resultType="Class", 如果单条Map就写resultType="map"。注意对应的接口的方法返回类型是Map<String, Object>-->
        select * from mybatis.user;
    </select>
    <select id="getUserById" parameterType="int" resultType="com.AtsukoRuo.pojo.User">
        <!--只有一个基本类型可以随便起名-->
        select * from mybatis.user where id = #{a};
    </select>
    <insert id="addUser" parameterType="com.AtsukoRuo.pojo.User">
        <!--对象类型可以直接取成员名-->
        insert into mybatis.user (id, name, pwd) value(#{id}, #{name}, #{pwd});
    </insert>
    <update id="updateUser" parameterType="com.AtsukoRuo.pojo.User">
        update mybatis.user set name=#{name}, pwd=#{pwd} where id=#{id};
    </update>
    <delete id="deleteUser" parameterType="int">
        delete from mybatis.user where id=#{id};
    </delete>
</mapper>
~~~

> 增删改必须要提交事务 session.commit();
>
> sqlSessionFactory.openSession(true)可以设置自动提交。

只有一个参数，且参数类型为基本类型时，可以随便命名。其他情况必须配合@Param注解来给这个参数起个名字：

~~~java
@Select("select * from user where id=#{id}")
User getUserByID(@Param("id") int id, @Param("name") String name);
~~~

建议一直使用@Param注解！



一定要注意属性的setter、getter方法除第一个字符不区分大小写，其他都要与字段名相匹配，否则获取不到相应的值



 #{}与${}区别：

- #{}是占位符，在预编译时解析，而${}时拼接符，在编译时解析。
- #{}对应的变量会自动加上引号，而${}不会
- #{}防止SQL注入。



这里有个小技巧：当表单字段过多，而更改或者查询时所需的字段却很少，那么可以向mapper传递map对象，而不是构造出具有很多成员的POJO对象。此时，在mapper中可以直接使用map的键作为变量名。

~~~xml
<select id="getUser" parameterType="map">
        select * from user where id=#{userId};
</select>
~~~

~~~java
map.put("userId", 5);
mapper.addUser(map);
~~~



获取自动增长的键值

~~~xml
<insert id="addBook" parameterType="com.BookedBook.POJO.BookRecord" useGeneratedKeys="true" keyProperty="id">
        insert into book(title, time_issue, num_word, price, time_in, status, author, img_src)
        VALUES (#{title}, #{time_issue}, #{num_word}, #{price}, #{time_in}, #{status}, #{author}, #{img_src})
    </insert>
~~~

- keyProperty是用主键值更改的成员

~~~java
book.id = 10;
addBook(book);
book.id; 	//此时为主键值
~~~





### 核心配置文件 mybatis-config.xml

- 环境

  ~~~xml
  <!--default 选择的默认环境-->
  <environments default="test">
          <environment id="development">
              
              <!--事务管理器-->
              <!--
                  JDBC： 提供JDBC 的提交和回滚设施
                  MANAGED：这个配置几乎没做什么，而是让容器来管理事务的整个生命周期，默认情况下它会关闭连接
              -->
              <transactionManager type="JDBC"/>
              
              <!--数据源：提供了应用程序所需要数据的位置-->
              <!--
  				数据源会负责维持一个数据库连接池，就可避免频繁的获取数据库连接、关闭数据库连接所导致的性能下降。目前常用的数据源主要有dbcp、c3p0、Proxool、Druid。
  				UNPOOLED：关闭池子
  				POOLED：开启池子
  				JNDI：JNDI粗俗点来说就是资源的别名
  			-->
              <dataSource type="POOLED">
                  <property name="url" value="hdbc:mysql://localhost:3306"/>
              </dataSource>
          </environment>
      
          <environment id="test"></environment>
      </environments>
  ~~~

- 属性

	我们可以用过properties属性来实现引用配置文件

	~~~properties
	driver=com.mysql.cj.jdbc.Driver
	url=jdbc:mysql://localhost:3306/mybatis?useSSL=true&useUnicode=true&characterEncoding=UTF-8
	username=root
	password=grf.2001
	//注意 &amp;更换为&
	~~~

	~~~xml
	<properties resource="db.properties">
	    <property name="username" value="root" />
	    <property name="pwd" value="grf.2001CN" />
	</properties>
	<!--注意，xml标签有顺序问题！ properties标签必须放在environment标签前-->
	<dataSource type="POOLED">
	                <property name="driver" value="${driver}"/>
	                <property name="url" value="${url}"/>
	                <property name="username" value="${username}"/>
	                <property name="password" value="${password}"/>
	</dataSource>
	~~~

	- 可以在properties标签中设置内部标签，如果两个文件有同一个标签，优先使用外部配置文件的

- 类型别名（TypeAliases）

	减少类完全限定名的冗余

	~~~xml
	<typeAliases>
	    <!--给指定类设置一个别名-->
	    <typeAlias alias="User" type="com.AtsukoRuo.POJO.User" />
	    
	    <!--Mybatis在指定包中扫描类，默认使用类的小写作为别名，可以通过@Alias注解来设置别名-->
	    <package name="com.AtsukoRuo.POJO" />
	</typeAliases>
	~~~
	
	Mybatis有一些默认别名，例如：
	
	| 别名 | Java类型 |
	| ---- | -------- |
	| int  | Integer  |
	| _int | int      |
	| map  | Map      |
	| list | List     |
	
- 设置

	设置Mybatis的运行时行为

	https://mybatis.net.cn/configuration.html#settings

  | 设置名                   | 描述                                                     | 有效值                  | 默认值 |
  | :----------------------- | :------------------------------------------------------- | :---------------------- | :----- |
  | cacheEnabled             | 全局性地开启或关闭所有映射器配置文件中已配置的任何缓存。 | true \| false           | true   |
  | useGenerateKeys          |                                                          |                         |        |
  | mapUnderscoreToCamelCase |                                                          |                         | False  |
  | logImpl                  | 日志                                                     | STDOUT_LOGGING \| LOG4J | 未设置 |
  | lazyLoadingEnabled       |                                                          |                         |        |

    数据库里命名通常是用下划线分割的，而Java命名是用驼峰命名。
  
- 其他配置：typeHandlers、objectFactory、plugins（mybatis-plus、通用mapper）

- 映射器：

  ~~~xml
  <mappers>
      <!--resource xml文件位置随意-->
      <mapper resource="org/mybatis/builder/mapper.xml" />
      <mapper resource="org/mybatis/builder/*.xml" />
      
      <!--mapper.xml必须和类在一个包（文件夹）下 而且 必须同名-->
      <mapper class="com.AtsukoRuo.DAO.UserMapper" />
      <mapper package="com.AtsukoRuo.DAO" />
  </mappers>
  ~~~

  
  
  

### 生命周期和作用域

错误的生命周期会导致并发问题。

- 一旦创建SqlSessionFactoryBuilder，就不再需要它了
- SqlSessionFactory可以认为是连接池。SqlSessionFactory的作用域是应用作用域，在应用运行期间一直存在。使用单例模式
- SqlSession可以认为是连接池的一次请求。需要close()。SqlSession的实例不是线程安全的，因此不能被共享，它的作用域是方法作用域。不能将它设置为类成员对象，甚至不能放在任何的托管作用域中，例如HttpSession。



## ResultMap

用结果集映射来解决属性名和字段名不一致的问题。

Mybatis只设置与select返回的字段相匹配的成员，其他未匹配到的成员设置为null。而且字段的类型与成员的类型要相匹配。

举个例子

~~~java
public class User {
    int id;
    String name;
    String password;
}
//pwd与password不一致
~~~

~~~mysql
select id, name pwd from user;
~~~

解决方法一：

~~~mysql
select id, name pwd as password from user;
~~~

解决方法二：

~~~xml
<resultMap id="UserMap" type="User">
    <!--type就是resultType-->
   
    <!-- 主键  property为实体类属性 column为数据库字段 jdbcType为实体类对应的jdbc类型，例如Date等-->
    <id property="id" column="b_id" jdbcType="VARCHAR" />
	<!-- 普通属性 -->
    <result column="pwd" property="password" />
</resultMap>

<select id="getUserById" parameterType="int" resultMap="UserMap">
    select * from mybatis.user where id = #{a};
</select>
~~~



### 映射一个对象

~~~java
public class Student {
    private int id;
    private String name;
    private Teacher teacher;			//这里映射一个对象
}
~~~



#### 按照查询嵌套处理

~~~xml
<resultMap id="StudentInfo" type="com.AtsukoRuo.POJO.Student">
    <result property="id" column="id" />
    <result property="name" column="name" />
    <!--javaType是java中的类类型-->
    <association property="teacher" column="tid" javaType="com.AtsukoRuo.POJO.Teacher" select="getTeacher"/>
</resultMap>

<select id="getStudent" resultMap="StudentInfo">
    select * from student;
</select>

<select id="getTeacher" resultType="com.AtsukoRuo.POJO.Teacher">
    select * from teacher where id=#{id}
</select>
~~~

这里`association`的`column`当作参数传递给`getTeacher`的`select`，这就相当于MySQL中的子查询。

~~~xml
<!--column传多个参数-->
<!--在处理组合键时，您可以使用column= “{prop1=col1,prop2=col2}”这样的语法，设置多个列名传入到嵌套查询语句。这就会把prop1和prop2设置到目标嵌套选择语句的参数对象中。-->
<association property="fncg_PD_QRY_MANAGE" column="
                                                   {COD_FN_ENT = COD_FN_ENT,
                                                   COD_PD_LINE = COD_PD_LINE,
                                                   ID_GRP_PD = ID_GRP_PD,
                                                   NUM_TARF = NUM_TARF}" select="sql123" />

 <select id="sql123" parameterType="java.util.Map" resultMap="">
          SELECT * FROM FNCG_PD_QRY_MANAGE WHERE COD_FN_ENT = #{COD_FN_ENT} AND COD_PD_LINE = #{COD_PD_LINE} AND ID_GRP_PD = #{ID_GRP_PD} AND NUM_TARF = #{NUM_TARF}
</select>
~~~



#### 按照结果嵌套处理

~~~xml
<resultMap id="StudentInfo" type="com.AtsukoRuo.POJO.Student">
    <result property="id" column="sid" />
    <result property="name" column="sname" />
    <association property="teacher"  javaType="com.AtsukoRuo.POJO.Teacher">
        <result property="name" column="tname" />
    </association>
</resultMap>

<select id="getStudent" resultMap="StudentInfo">
    select s.id sid, s.name sname, t.name tname
    from student s, teacher t
    where s.tid = t.id;
</select>
~~~

相当于MySQL中的联表查询。

### 映射多个对象

~~~java
public class Teacher {
    private int id;
    private String name;
    private List<Student> studentList;			//这里映射多个对象
}
~~~



#### 按照结果嵌套处理

~~~xml
<select id="getTeacher" resultMap="TeacherStudent">
    select s.id sid, s.name sname, t.name tname, t.id tid
    from student s, teacher t
    where s.tid = t.id and t.id = #{tid}
</select>

<resultMap id="TeacherStudent" type="com.AtsukoRuo.POJO.Teacher">
    <result property="id" column="tid" />
    <result property="name" column="tname" />
	<!--注意这里用ofType获取集合泛型中的约束类型，而javaType是集合的类型-->
    <collection property="studentList" ofType="com.AtsukoRuo.POJO.Student" javaType="ArrayList">
        <result property="id" column="sid" />
        <result property="name" column="sname" />
        <result property="tid" column="tid" />
    </collection>
</resultMap>
~~~



#### 按照查询嵌套处理

~~~xml
<select id="getTeacher2" resultMap="TeacherStudent">
    select * from teacher where id=#{tid}
</select>

<resultMap id="TeacherStudent" type="com.AtsukoRuo.POJO.Teacher">
    <collection property="studentList" javaType="ArrayList" ofType="com.AtsukoRuo.POJO.Student" select="getStudentByTeacherId" column="id"></collection>
</resultMap>

<select id="getStudentByTeacherId" resultType="com.AtsukoRuo.POJO.Student">
    select * from student where tid=#{tid}
</select>
~~~



## 动态SQL

### if

~~~xml
<select id="queryBlogIF" parameterType="map" resultType="com.AtsukoRuo.POJO.Blog">
    select * from mybatis.blog where 1=1
    <if test="title != null">
        and title=#{title}
    </if>
    <if test="author != null">
        and author = #{author}
    </if>
</select>
~~~

~~~java
HashMap map = new HashMap();
map.put("title", "Java");
List<Blog> blogs = mapper.queryBlogIF(map);
~~~



IF判断对象中是否有该成员，如果有的话就拼接SQL语句。

### choose，when，otherwise

choose类似与Java中的switch语句

~~~xml
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG WHERE state = ‘ACTIVE’
  <choose>
    <when test="title != null">
      AND title like #{title}
    </when>
    <when test="author != null and author.name != null">
      AND author_name like #{author.name}
    </when>
    <otherwise>
      AND featured = 1
    </otherwise>
  </choose>
</select>
~~~



### trim，where，set

### foreach



## 缓存



## 其他

### 日志

STDOUT_LOGGING标准日志输出

Log4j的主要组成部分：

- loggers：负责捕获记录信息
- appenders：负责发布日志信息
- layouts：负责格式化日志信息



Log4j的级别（从小到大）：

- ALL : 各级包括自定义级别 ;

- TRACE : 指定细粒度比DEBUG更低的信息事件 ;

- **DEBUG** : 调试级别 ;

- **INFO** : 表明消息在粗粒度级别上突出强调应用程序是非常有帮助的 , 也就是输出一些提示信息 ;    

- **WARN** : 输出潜在的有可能出错的情形 , 也就是输出警告信息 

- **ERROR** : 指出发生的不影响系统继续运行的错误信息 

- FATAL : 指出严重的错误 , 这些错误将会导致系统终止运行 

- OFF : 为最高级别 , 用于关闭所有日志信息的输出 ;

	

**核心规则 : log4j只会输出级别大于或者等于指定级别的信息 ;**



resource/log4j.properties

~~~properties
log4j.rootLogger=DEBUG,file

#文件输出的相关设置
log4j.appender.file = org.apache.log4j.RollingFileAppender
log4j.appender.file.File=log/test.log						     #输出目标，相对工作目录
log4j.appender.file.Threshold=DEBUG									#阈值
log4j.appender.file.layout=org.apache.log4j.PatternLayout
log4j.appender.file.layout.ConversionPattern=[%p][%d{yy-MM-dd}][%c]%m%n	#格式
~~~

https://blog.csdn.net/dyz4001/article/details/81103863

### 分页

方式一：SQL + Map法

~~~sql
SELECT * from user limit startIndex, pageSize;
~~~

~~~xml
<select id="getUserByLimit" parameterType="map" resultMap="User">
    select * from mybatis.user limit #{start}, #{end}
</select>
~~~



方法二：RowBounds 在Java代码层次中实现 （不太推荐....）

~~~java
RowBounds rowBounds = new RowBounds(1, 2);
List<User> users = sqlSession.selectList("com.AtsukoRuo.DAO.UserMapper.getUserByRowBounds", null, rowBounds);
~~~

方法三：插件https://pagehelper.github.io/                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         

### Lombok

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.24</version>
    <scope>provided</scope>
</dependency>
```

自动生成代码工具

开发中常用的：@Getter、@Setter、@ToString、@EqualsAndHashCode、@AllArgsConstructor、@NoArgsConstructor、**@Data（yyds）**、@Log

### 注解开发

面向接口编程实质上就是面向对象编程的变种，弥补Java语言本身设计缺陷的。

注解使用简单的sql语句编写，复杂一点的，例如ResultMap就显得力不从心了

~~~java
public interface UserMapper {
    @Select("select * from user")
    List<User> getUsers();
}
~~~

~~~xml
<mappers>
    <mapper class="AtsukoRuo.DAO.UserMapper" />
</mappers>
~~~

@Insert、@Update、@Delete

