# xv6实验报告

## 环境安装

推荐安装WSL。

~~~shell
$ sudo apt-get update && sudo apt-get upgrade
$ sudo apt-get install git build-essential gdb-multiarch qemu-system-misc gcc-riscv64-linux-gnu binutils-riscv64-linux-gnu 
~~~



To quit qemu type: Ctrl-a x 

## Lab0 Util

~~~shell
$ git clone git://g.csail.mit.edu/xv6-labs-2022
~~~

### xv6

xv6内核提供了传统Unix内核所提供的服务和系统调用的一个子集。图1.2列出了xv6的所有系统调用。

| 系统调用                                    | 描述                                                         |
| ------------------------------------------- | ------------------------------------------------------------ |
| **int fork()**                              | 创建一个进程，返回子进程的PID。                              |
| **int exit(int status)**                    | 终止当前进程，并将status传递给wait()。不会返回。             |
| **int wait(int \*status)**                  | 等待子进程结束，并将status接收到参数*status中，返回其PID。   |
| **int kill(int pid)**                       | 终止给定PID的进程，成功返回0，失败返回-1。                   |
| **int getpid()**                            | 返回当前进程的PID。                                          |
| **int sleep(int n)**                        | 睡眠n个时钟周期。                                            |
| **int exec(char \*file, char \*argv[])**    | 通过给定参数加载并执行一个文件；只在错误时返回。             |
| **char \*sbrk(int n)**                      | 使进程内存增加n字节，返回新内存的起始地址。                  |
| **int open(char \*file, int flags)**        | 打开一个文件，flags表示读或写，返回fd（文件描述符）。        |
| **int write(int fd, char \*buf, int n)**    | 将buf中n字节写入到文件描述符中；返回n。                      |
| **int read(int fd, char \*buf, int n)**     | 从文件描述符中读取n字节到buf；返回读取字节数，文件结束返回0。 |
| **int close(int fd)**                       | 释放文件描述符fd。                                           |
| **int dup(int fd)**                         | 返回一个新文件描述符，其引用与fd相同的文件。                 |
| **int pipe(int p[])**                       | 创建管道，将读/写文件描述符放置在p[0]和p[1]。                |
| **int chdir(char \*dir)**                   | 改变当前目录。                                               |
| **int mkdir(char \*dir)**                   | 创建新目录。                                                 |
| **int mknod(char \*file, int, int)**        | 创建新设备文件。                                             |
| **int fstat(int fd, struct stat \*st)**     | 将打开的文件的信息放置在*st中。                              |
| **int stat(char \*file, struct stat \*st)** | 将命名文件的信息放置在*st中。                                |
| **int link(char \*file1, char \* file2)**   | 为文件file1创建一个新的名称(file2)。                         |
| **int unlink(char \*file)**                 | 移除一个文件。                                               |

图1.2  xv6系统调用. 如果没有特别说明, 这些调用成功时返回0，失败时返回-1。



xv6文件系统包含了数据文件（拥有字节数组）和目录（拥有对数据文件和其他目录的命名引用）。这些目录形成一棵树，从一个被称为根目录的特殊目录开始。像**/a/b/c**这样的路径指的是根目录**/**中的**a**目录中的**b**目录中的名为**c**的文件或目录。不以**/**开头的路径是相对于调用进程的当前目录进行计算其绝对位置的，可以通过**chdir**系统调用来改变进程的当前目录。下面两个**open**打开了同一个文件（假设所有涉及的目录都存在）。

``` c
chdir("/a");
chdir("b");
open("c", O_RDONLY);
open("/a/b/c", O_RDONLY);
```

前两行将进程的当前目录改为**/a/b**；后面两行既不引用也不改变进程的当前目录。

有一些系统调用来可以创建新的文件和目录：**mkdir**创建一个新的**目录**，用**open**加上**O_CREATE**标志创建并打开一个新的数据**文件**，以及**mknod**创建一个新的**设备文件**。这个例子说明了这三个系统调用的使用。

```c
mkdir("/dir");
fd = open("/dir/file", O_CREATE | O_WRONLY);
close(fd);

mknod("/console", 1, 1);
```

**mknod**创建了一个引用设备的特殊文件。与设备文件相关联的是主要设备号和次要设备号(**mknod**的两个参数)，它们唯一地标识一个内核设备。当一个进程打开设备文件后，内核会将系统的读写调用转移到内核设备实现上，而不是将它们传递给文件系统。

文件名称与文件是不同的；底层文件（非磁盘上的文件）被称为**inode**，一个inode可以有多个名称，称为**链接**。每个链接由目录中的一个项组成；该项包含一个文件名和对inode的引用。inode保存着一个文件的***metadata\***（元数据），包括它的类型（文件或目录或设备），它的长度，文件内容在磁盘上的位置，以及文件的链接数量。

**fstat**系统调用从文件描述符引用的inode中检索信息。它定义在**stat.h** (kernel/stat.h)的 **stat** 结构中：

``` c
#include "kernel/stat.h"
#define T_DIR 1    	// Directory
#define T_FILE 2   	// File
#define T_DEVICE 3 	// Device
struct stat
{
    int dev;     	// File system’s disk device
    uint ino;    	// Inode number
    short type;  	// Type of file
    short nlink; 	// Number of links to file
    uint64 size; 	// Size of file in bytes
};
```



目录项的数据结构，目录文件中包含若干个目录项

~~~C
#include "kernel/fs.h"
// Directory is a file containing a sequence of dirent structures.
#define DIRSIZ 14

struct dirent {
  ushort inum;
  char name[DIRSIZ];
};
~~~



**link**系统调用创建了一个引用了同一个inode的文件（文件名）。下面的片段创建了引用了同一个inode两个文件a和b。

```c
open("a", O_CREATE | O_WRONLY);
link("a", "b");
```

读写a与读写b是一样的，每个inode都有一个唯一的inode号来标识。经过上面的代码序列后，可以通过检查fstat的结果来确定a和b指的是同一个底层内容：两者将返回相同的inode号（**ino**），并且nlink计数为2。

**unlink**系统调用会从文件系统中删除一个文件名。只有当文件的链接数为零且没有文件描述符引用它时，文件的inode和存放其内容的磁盘空间才会被释放。

``` c
unlink("a");
```

上面这行代码会删除a，此时只有b会引用inode。

``` c
fd = open("/tmp/xyz", O_CREATE | O_RDWR);
unlink("/tmp/xyz");
```



有一个例外，那就是cd，它是在shell中实现的 (user/sh.c:160)。cd 必须改变 shell 自身的当前工作目录。

### sleep

在user/中创建sleep.c文件，代码如下：

~~~c
#include "kernel/types.h"
#include "user/user.h"
int main(int argc, char* argv[])
{
    if (argc != 2) {
        fprintf(2, "Usage: sleep <ticks> ...\n");
        exit(-1);
    }
    int ticks = atoi(argv[1]);
    sleep(ticks);
    exit(0);
}
~~~

在makefile文件中的UPROGS添加sleep。然后在模拟器中验证（ctrl + A X 退出终端）：

~~~shell
$ make qemu
$ sleep 10
~~~

 make grade runs all tests。如果你想评判一个测试，则

~~~shell
$ ./grade-lab-util sleep
$ make GRADEFLAGS=sleep grade		# or you can type
~~~



### pingpong

管道的使用

~~~c
#include "kernel/types.h"
#include "user/user.h"

int main(int argc, char* argv[])
{
    int pid = 0;
    int fds_father[2];
    int fds_child[2];
    pipe(fds_father);
    pipe(fds_child);
    char buf[5];
    switch (pid = fork()) {
        case 0:
            read(fds_child[0], buf, 5);
            printf("%d: received %s\n", getpid(), buf);
            write(fds_father[1], "pong", 5);
            break;
        default :
            write(fds_child[1], "ping", 5);
            read(fds_father[0], buf, 5);
            printf("%d: received %s\n", getpid(), buf);
            
    }
    exit(0);
}
~~~



### primes

~~~c
#include "kernel/types.h"
#include "user/user.h"
void worker(int *fds);
int main(int argc, char *argv[])
{
    int pid = 0;
    int fds[2];
    pipe(fds);
    switch (pid = fork()) {
        case 0 : 
            worker(fds);
            break;
        default :
            close(fds[0]);
            printf("prime %d\n", 2);
            for (int i = 3; i <= 31; i++) {
                if (i % 2 != 0) write(fds[1], &i, sizeof(int));
            }
            close(fds[1]);
            wait(0);
    }
    exit(0);
}

void worker(int *fds)
{
    close(fds[1]); 
    int n = 0;
    if (read(fds[0], &n, sizeof(int)) == 0) {
        close(fds[0]);
        return;
    }
    printf("prime %d\n", n);

    int pid = 0;
    int fds2[2];
    pipe(fds2);
    int num = 0;
    switch (pid = fork()) {
        case 0:
            worker(fds2);
            break;
        default:
            close(fds2[0]);
            while (read(fds[0], &num, sizeof(int)) != 0) {
                if (num % n != 0) write(fds2[1], &num, sizeof(int));
            }  
            close(fds2[1]);
            wait(0);
    }
    close(fds[0]);
}
~~~

一定要调用wait(0)，否则当第一个进程退出时还有运行的子进程，测试就获取不到这些子进程的输出值了。

- Hint: `read` returns zero when the write-side of a pipe is closed.



### find

- Look at user/ls.c to see how to read directories.
- Don't recurse into "." and "..".
- to get a clean file system run make clean and then make qemu.





~~~c
#include "kernel/types.h"
#include "kernel/stat.h"
#include "kernel/fs.h"
#include "user/user.h"

const char *target_filename;
int find(const char *directory_name)
{
    
    int fd = 0;
    if ((fd = open(directory_name, 0)) == -1) return -1;

    struct dirent ent;
    while (read(fd, &ent, sizeof(struct dirent)) == sizeof(struct dirent)) {
        char buf[512];
        char *p;
        int len = strlen(directory_name);
        memmove(buf, directory_name, len);
        p = buf + len;
        if (buf[len - 1] != '/') {
            buf[len] = '/';
   			p++;
        }
        memmove(p, ent.name, DIRSIZ);
        p[DIRSIZ] = 0; 
        
	    struct stat st;
        if (stat(buf, &st) < 0) return -1;
		
        if (st.type != T_DIR) {
            if (strcmp(target_filename, ent.name) == 0) printf("%s\n", buf);
        } else {
            if (strlen(ent.name) == 0) continue;
            if (strcmp(".", ent.name) == 0) continue;
            if (strcmp("..", ent.name) == 0) continue;
            char buf_copy[512];
            memmove(buf_copy, buf, 512);
            find(buf_copy);
        }
    }
    return 0;
}

int main(int argc, char* argv[])
{
    if (argc != 3) {
        fprintf(2, "Usage: find <directory> <file>");
        exit(-1);
    }
    target_filename = argv[2];
    find(argv[1]);
    exit(0);
}
~~~



- 注意：一定要注意工作目录，执行这些系统函数时并不会切换工作目录！！！
- `ent.name`以`\0`结尾。



### xargs

直接就有代码是怎么回事？

~~~c
#include "kernel/types.h"
#include "user/user.h"
#include "kernel/param.h"

char* strdup(const char *src)
{
    int len = strlen(src) + 1;
    char* ret = malloc(len);
    if (ret == 0) return 0;
    return memcpy(ret, src, len);
}

char* getline(char *buf)
{
    int index = 0;
    char ch;
    while (read(0, &ch, 1) > 0) {
        if (ch == '\n') break;
        buf[index++] = ch;
    }
    buf[index] = 0;
    return index == 0 ? 0 : buf;
}

int main(int argc, char* argv[])
{

    if (argc < 2) {
        fprintf(2, "usage: xargs command\n");
        exit(1);
    }

    char* args[MAXARG];
    int arg_num = 0;

    char command[10];
    strcpy(command, argv[1]);

    const int SIZE = 100;
    char buf[SIZE];

    for (int i = 1; i < argc; i++) {
        args[arg_num++] = strdup(argv[i]);
    }

    while (getline(buf) != 0) {
        args[arg_num++] = strdup(buf);
    }
    
    args[arg_num] = 0;

    if (fork() == 0) {
        if (exec(command, args) == -1) {
            fprintf(2, "fatal error!");
        };
    } else {
        wait((int *)0);
    }

    for (int i = 1; i < arg_num; i++) {
        free(args[i]);
    }

    exit(0);
}

~~~

### 提交

API-keys：RPOE8D2WD63C2WNYUQYBDM7E09ED5HCS

https://6828.scripts.mit.edu/2022/handin.py/api/RPOE8D2WD63C2WNYUQYBDM7E09ED5HCS

本地提交：./grade-lab-util
