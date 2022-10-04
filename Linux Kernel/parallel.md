# 并行

[TOC]

创建并行程序：

- 通过脚本的后台运行语法(&)，将多个串行程序由操作系统并行地（可以的话）调度

	~~~shell
	$./compute_job 1 > compute_job1.out &
	$./compute_job 2 > compute_job2.out &
	~~~

	此外，make脚本语言有-j选项，可以指定在编译程序时执行多个少并行任务

- POSIX

	- 通过fork、wait、kill等函数，使得多个进程并发执行，通过IPC技术（包括管道、信号、内存映射等）进行通信。但是这种方法的开销是不可接受。而且并行是粗粒度的。
	- pthread_create()创建并执行线程，pthread_join()等待线程执行完成，pthread_exit()退出线程。pthread_t
	- 锁，避免数据竞争（data race）。pthread_mutex_lock()获取锁，pthread_mutex_unlock()释放锁，pthread_mutex_t锁的类型，必须使用PTHREAD_MUTEX_INITIALIZER静态变量或者pthread_mutex_init()进行初始化。
	- 读写锁：pthread_rwlock_t数据结构代表读写锁。PTHREAD_RWLOCK_INITILIZER静态初始化，或者pthread_rwlock_init()初始化。pthread_rwlock_rdlock()获取读锁，pthread_rwlocK_wrlock()获取写锁，pthread_rwlock_unlock释放锁。在任何时刻，只有一个线程持有写锁，或者多个线程持有读锁。

