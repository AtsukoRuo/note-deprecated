# Git Pro

[TOC]



## 基本原理

Git 保存的不是文件的变化或者差异，而是一系列不同时刻的 **快照** 。

### 工作区、暂存区、仓库、远程仓库

你工作目录下的每一个文件都不外乎这两种状态：

- **已跟踪** ：那些被纳入了版本控制的文件。
-  **未跟踪** ：未被Git跟踪的文件。



### 对象、引用

对象是Git中主要的资产，分为以下四种类型

- Blob
- Tree 
- Commit
- Tag

对象具有Immutable特性。在构建对象时，将对象所引用的资源使用Zlib进行压缩，同时用资源的内容以及自己的头部信息作为SHA-1算法的输入，将该算法输出40个字符长度的SHA-1值作为该对象的引用，在不冲突情况下，可以用至少6个字符长度的SHA-1作为引用。然后Git把对象存储在Git Object Database中，一般按以下规则组织存储：对象的SHA-1的前2位作为目录名，而后38位作为文件名。



### ./git

./git按照以下方式组织：

- 

## 常用命令

### 创建仓库 

- 使用命令`git init`将尚未进行版本控制的本地目录转换为Git仓库。若在创建仓库时，当前目录下有文件或者子目录，那么Git将这些标记为未跟踪的。创建一个本地仓库。

- 使用命令`git clone <url> `，从其他服务器中下载一个Git仓库到由Git自动在当前目录创建的子目录中，名称是仓库名。可以通过额外的参数`git clone <url> name`指定新的目录名。其中url可以是https、SSH、git等协议。默认创建一个名为`origin`的远程仓库。

远程仓库与本地仓库中的数据都放在`git object base`中。

### 合并

### 变基

### 标签

### 分支 & 远程分支 &  跟踪分支

- 创建分支：

	- `git branch <name>`在当前仓库上创建一个本地分支。

	- `git checkout -b <name>`创建并切换，它是以下两条命令的缩写：

		~~~shell
		$git branch iss53
		$git checkout iss53
		~~~

	- `git branch -u <remote>/<branch>`在当前分支上创建一个跟踪分支指向`<remote>/<branch>`

	- `git checkout -b <name> <remote>/<branch>`创建一个跟踪分支并切换。

- 查看分支：`git branch`，查看当前仓库的本地分支。`-a`查看当前仓库的本地分支和远程分支。`-vv`查看当前仓库的跟踪分支

- 删除分支：`git branch -d <name>`删除在当前仓库上本地分支。`git push <remote>:<remote_branch>`或者`git push <remote> --delete <branch>`删除远程分支并更新到服务器中。

- 切换分支：`git switch <name>`在本地仓库的本地分支切换，`git checkout <name>`可以随意地进行切换。切换分支时，工作目录以及暂存区都替换为当时的版本快照，以及切换到相应的仓库中。



跟踪分支是与一个远程分支绑定的本地分支，在一个跟踪分支上输入`git pull/fetch`，则自动从服务器上抓取数据，而不需要再指明`<remote_name>`。

远程分支必须通过`git fetch`命令进行更新。同时可以在远程仓库上创建本地分支，通过`git push`命令向远程仓库写入此本地分支。



### 工作目录、暂存区、仓库的相关命令

`git log`打印当前仓库的提交记录

-  `--graph`打印当前分支到根节点 。`--all`与`--graph`配合使用，以图的形式打印全部提交。

`git commit`：

- `--amend`：重新提交一次。避免修补小错误时而使提交记录混乱
- `-m`：必须要有的，说明提交信息
- `-a`：将工作区中所有已跟踪文件提交，相当于跳过git add。



要删除文件时，不要简单的在工作目录中执行本地删除命令，否则暂存区中的文件得不到删除。使用`git rm`命令，Git会同时在工作区以及暂存区中删除该文件。文件移动或者重命名也是如此，要使用`git mv`命令，git mv指令当于运行了下面三条命令：

~~~shel
$ mv README.md README
$ git rm README.md
$ git add README
~~~



`git add`命令将文件更新到暂存区。如果文件处于特殊状态（未跟踪、冲突），那么相应地Git将其标记为已跟踪的或者冲突已解决的。`git add .`将当前目录下的所有文件添加



`git status`



`git diff`



`git  reset`


​	

### pull & fetch & push & 远程仓库

`pull`、`fetch`命令用于从服务器上的远程仓库中读数据。而`push`命令用于向服务器上的远程仓库中写数据。对远程仓库的操作，可以`pull/fetch`到本地中进行，再通过`push`向服务器提交操作，或者直接在服务器上进行。



通过`git remote add <shortname> <url>`创建一个远程仓库，此时这个远程仓库中并没有任何数据。

`git remote`查看所有远程仓库的名称，`-v` 同时列出对应的URL以及权限。

`git remote rename <old_name> <new_name>`重命名

`git remote remove <name>`删除远程仓库所有数据以及相关信息。

Git允许创建多个远程仓库，它们之间互不干扰，并且可以通过切换分支`git checkout`来使用不同的远程仓库。

执行`git clone`命令时，会创建一个名为`origin`的远程仓库，并下载数据。





接着通过`git fetch <shortname / url>`仅仅从服务器的远程仓库中拉取全部分支到本地的远程仓库中。而`git fetch <shortname / url> <branch>`从服务器中拉取特定的分支到本地的远程仓库中。Git通过递归到根节点在本地上查找未拥有的数据，然后将这些数据下载到本地。

`git pull <shortname / url>` 从服务器中拉取数据后直接进行合并。



`git push <remote> <branch>`，将当前分支推送到服务器中，通过递归在服务器上查找未写入数据，然后将这些数据上传到服务器中。命令成功执行需要满足以下条件：

- 拥有写入权限
- 服务器上的分支可以快速推进到本地分支，或者写入新的本地分支。



本质上其实是`git push <remote> <local branch> : <remote branch>`，即用本地`.git/refs/heads/<local branch>`文件**更新**或**创建**服务器上的`.git/refs/heads/<remote branch>`。



## 分布式工作流程







