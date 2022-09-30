[TOC]

## 进程凭证（process credentials）

每个进程都有与之相关联的UID和GID。这些ID被称为**进程凭证**，它们有以下分类：

- real user ID
- effective use ID
- saved set-user-ID
- file-system user ID
- 辅助组ID（Supplementary group IDs）

### 实际UID

当进程尝试调用系统函数时，或者访问系统资源（例如文件、System V IPC对象），操作系统会根据进程的有效UID来决定对资源是否有访问权限。

### 有效UID

有效UID为0的进程拥有管理员的所有权限，这样的进程又被称为特权级进程（privileged process），而某些系统调用只能由特权级进程执行。一般实际UID与有效UID是相同的。



~~~shell
$ls -l proc
-rwxr--r-x
$chmod u+s proc
$chmod g+s proc
-rwsr-sr-x
~~~

### saved set-UID

当进程exec设置了Set-User-ID权限位的可执行文件时，那么系统将进程的有效UID设置为文件所有者的UID，以便有权限执行该文件。Linux中使用set-user-ID的程序包括：passwd、mount、su等。

saved set-user-ID与设置set-user-ID特权位的程序配合使用。当exec可执行文件时，会依次发生如下事件：

- 若已设置可执行文件的set-user-ID，则进程的有效UID设置为可执行文件的实际UID，否则进程的有效UID保持不变
- 进程的saved set-user-ID设置为进程的有效UID。

### file system UID

此外。在Linux系统中file system UID，它决定了进程是否有权限对文件执行操作（例如，打开文件、改变文件属主、修改该文件权限）。通常，file system UID是随着有效UID变化的，但是Linux特有的两个系统调用setfsuid()以及setfsgid()可以使file system UID与有效UID不同。

由于历史原因，Linux设计出了文件系统ID。现在Linux严格遵循SUSv3标准，当时的问题得到了解决，所以在编写新程序时无需再考虑文件系统ID。



由于实际或有效GID只能表示进程所属的一个组，所以设计出辅助组ID用于表示进程所属的多个组。

proc/PID/status文件包含了进程的UID、GID等信息。



### 获取并修改ID

具有CAP_SETUID能力允许进程任意修改UID、而具有CAP_SETGID能力允许进程任意修改GID。



以下函数声明用于获取实际UID以及有效UID

~~~c
#include <unistd.h>
uid_t getuid(void);
uid_t geteuid(void);
gid_t getgid(void);
git_t getegid(void);
~~~



setuid()修改进程的有效UID，它的函数声明如下：

~~~c
#include <unistd.h>
int setuid(uid_t uid);
int setgid(gid_t gid);
							//Both return 0 on success, or -1 on error
~~~

当非特权进程（euid != 0）调用setuid()时，仅能修改该进程的有效UID。而且有效UID只能修改为进程的实际UID或saved-user-ID，否则调用失败。当特权进程（euid == 0）调用setuid时，实际UID、有效UID、saved set-user-ID均被设置为uid实参。



seteuid()修改进程的有效UID，它的函数声明如下：

~~~c
#include <unistd.h>
int seteuid(uid_t euid);
int setegid(gid_t egid);
							//Both return 0 on success, or -1 on error
~~~

对于非特权进程，有效UID只能修改为进程的实际UID或saved-user-ID，否则调用失败，这点与setuid()相同。但是对于特权进程，仅将有效UID设置为任意值，而不改变实际uid以及saved set-uid。



setreuid()修改进程的有效UID和实际UID。它的函数声明如下：
~~~c
#include <unistd.h>
int setreuid(uid_t ruid, uid_t euid);
int setregid(gid_t rgid, gid_t egid);
						//Both return 0 on success, or -1 on error
~~~

如果只想修改其中一个ID，那么将另一个ID指定为-1。对于非特权进程只能将其实际U ID 设置为当前实际UID 值（即保持不变）或有效用户ID 值，且只能将有效用户 ID 设置为当前实际用户 ID、有效用户 ID（即无变化）或保存set-user-ID。特权级进程能够设置其实际UID 和有效UID 为任意值。只要以下任意一条条件成立。那么saved set-user-ID就设置为有效UID

- ruid不为-1
- 有效UID设置为不同于系统调用之前的实际UID。



此外，Linux提供了两个非SUS标准的系统调用getresuid()和getresgid()获取saved set-*-ID，它们的函数声明如下

~~~c
#define _GNU_SOURCE
#include <unistd.h>

int getresuid(uid_t *ruid, uid_t *euid, uid_t *suid);
int getresgid(gid_t *rgid, gid_t *egid, gid_t *sgid);
								//Both return - on success, or -1 on error
~~~

同时使用setresuid进行修改，函数声明如下：

~~~c
#define _GNU_SOURCE
#include <unistd.h>

int setresuid(uid_t ruid, uid_t euid, uid_t suid);
int setresgid(gid_t rgid, gid_t egid, gid_t sgid);
								//Both return - on success, or -1 on error
~~~

如果不想修改某个ID，那么将其指定为-1即可。非特权进程能够将实际UID、有效UID 和saved set-user-ID 中的任一 ID 设置为实际UID、有效UID 或saved set-user-ID 之中的任一当前值。特权级进程能够对其实际UID、有效UID 和saved set-user-ID 设置为任意值。要么全都设置成功，那么都失败。



getgroups()获取当前进程所属组的集合

~~~c
#include <unistd.h>

int getgroups(int gidsetsize, gid_t grouplist[])
    //Returns number of group IDs placed in grouplist on success, or -1 on error
~~~

其中gidsetsize指定grouplist数组的大小，如果gidsetsize小于组个数，那么调用会失败。因此通常将gidsetsize设置为NGROUPS_MAX + 1。如果gidsetsize设置为0，那么只返回组个数。

setgroups以及initgroups用于修改该辅助组ID，它们的函数声明如下：

~~~c
#define _BSD_SOURCE
#include <grp.h>

int setgroups(size_t gidsetsize, const gid_t *grouplist);
int initgroups(const char *user, gid_t group);
					//Both return 0 on success, or -1 on error
~~~



## 能力（capability）

Linux将管理员权限划分为多个各不相同能力（capability）。每个能力表示对不同操作的权限。