---
title: 使用Frp服务配置MCSManager远程节点
description: 使用Frp服务配置MCSManager远程节点
date: 2025-1-17
tags:
  - MCSManager
---



---

---

## 概述

此教程主要面向于使用 **Frp** 的家里云用户，在云服务商购买了一台有公网的云服务器，我将讲述多种配置方式实现 **MCSManager** 在非家庭公网的部署

> [!TIP] 提醒
>
> MCSManager分为**Web/Daemon(前端/后端)**，因此Web能检测到节点在线，**但并不证明**你可以**正常访问**其实例控制台，所以需要你开放23333/24444(或已自定义)端口
>
> (具体连通情况以 **节点** 界面的 **网页直连** 为准)

---

## 操作环境

两台服务器 (操作系统的差异与部署没有太大区别)，且都安装了 **MCSManager**

其中一台服务器(Linux)有公网 (在此文称 "**公网服务器**" )，一台服务器(Windows)无公网 (在此文称 "**物理机**" )

公网服务器只承担自身Daemon节点和 **Frps** 业务，物理机只需要通过 **Frpc** 将Web和Daemon映射出去即可

---

## 操作过程

### 一.公网服务器节点操作(Linux系统)

1.打开物理机内的MCSManager管理页面，进入 节点 页面，点击 新增节点 按钮，你会见到以下配置项:

```
备注信息(必须，任填):
远程节点IP地址(必须，若配置 SSL 则必须添加 wss://):
远程节点端口(必须，默认为24444):
远程节点密钥(必须，下文会讲如何找到):
路径前缀(特殊情况使用，不做过多解释):
```

> 远程节点密钥在 **Linux** 的默认存储位置一般位于:
>
> ***/opt/mcsmanager/daemon/data/Config/global.json***
>
> 打开 **global.json** 找到 **key** 并填入到 远程节点密钥 内，然后点击确定，等待界面刷新
>

> [!TIP] 提醒
>
> 如果刷新或节点状态显示异常，则你需要检查云服务器防火墙是否放行了对应端口

2.回到应用实例，随后点击 新建应用，实例类型选择: 部署任何控制台可执行程序，随后在选择机器界面选择 **你加入的新节点**，然后选择 **无需额外文件**(便于后续操作) ，名字任取，启动命令写:

```./frps -c frps.toml```

> **Frps/c** 下载地址: [Github Release](https://github.com/fatedier/frp/releases)
>
> 正常情况下，Linux 应下载 **linux-amd64**
>
> Windows 为 **windows-amd64**  (以硬件配置为准)

3.进入当前实例的文件管理，上传 **frps** 和 **frps.toml**，将 **frps** 的文件权限 **全部勾选(影响启动)**

4.打开 frps.toml 添加以下配置

```frps.toml
bindPort = 7000    #服务端监听端口，默认7000，按需修改
auth.method = "token"   #服务端连接身份认证，默认token
auth.token = "test123"   #服务端token密码
transport.tls.force = false   #是否只接受启用了TLS的客户端连接
```

配置完后点击保存

5.回到终端，点击 **事件任务**，将 **自动重启** 和 **自动启动** 打开，点击保存后开启实例

自此，公网服务器的配置已经大功告成

> [!IMPORTANT]提醒
>
> 本文所有自启动服务都将基于 **MCSManager** or **shell:startup(Windows)**，Linux用户可考虑使用 **systemctl** 或其他方式实现更好的开机自启动服务，或者直接使用 **MCSManager** 的 **事件任务** 代劳

---

### 二.物理机节点操作(Windows系统)

#### (一)Frpc配置

1.回到应用实例，随后点击 新建应用，实例类型选择: 部署任何控制台可执行程序，随后在选择机器界面选择 **你物理机的节点**，然后选择 **无需额外文件**(便于后续操作) ，名字任取，启动命令写:

```.\frpc.exe -c frpc.toml```

2.进入当前实例的文件管理，上传 **frpc** 和 **frpc.toml**

3.打开 frpc.toml 添加以下配置

以下为登录配置示例

```frpc.toml
serverAddr = "XXX"   #服务器地址
serverPort = 7000   #服务器端口
auth.method = "token"   #服务端连接身份认证，默认token
auth.token = "test123"   #服务端token密码，密码不正确将无法连接服务器
transport.tls.enable = false   #是否和服务端之间启用TLS连接
```

以下为穿透设置示例

```frpc.toml
[[proxies]]
name = "mcsm-web"   #隧道名称，可自定义，不能重复
type = "tcp"   #隧道类型，可用tcp, udp, http, https, tcpmux, stcp, sudp, xtcp
localIP = "127.0.0.1"   #本地IP地址，如果是本机就127.0.0.1
localPort = 23333   #本地端口，本地服务端口
remotePort = 23334    #远程端口，连接隧道时用的端口

[[proxies]]
name = "mcsm-daemon"
type = "tcp"
localIP = "127.0.0.1"
localPort = 24444
remotePort = 24445
```

其中，remotePort任意配置，**但不能再配置到23333/24444，因为云服务器的Web/Daemon占用了这两个端口**

配置完成后点击保存

4.回到终端，点击 **事件任务**，将 **自动重启** 和 **自动启动** 打开，点击保存后开启实例

自此，将物理机的 MCSM-Web/Daemon 穿透到公网服务器的操作完成

#### (二)节点配置

> 远程节点密钥在 **Windows** 的存储位置位于:
>
> ***/%MCSMamager所在目录%/mcsmanager/daemon/data/Config/global.json***

1.进入 **节点** 页面，点击 **新增节点** 按钮，公网服务器什么IP你写什么IP，你只需要注意 **远程节点端口** 和 **远程节点密钥** 即可

#### (三)开机自启动服务(通过shell:startup)

~~实际上是登录后自启动()~~

> [!IMPORTANT]再次提醒
>
> 本文所有自启动服务都将基于 **MCSManager** or **shell:startup(Windows)**，Linux用户可考虑使用 **systemctl** 或其他方式实现更好的开机自启动服务，或者直接使用 **MCSManager** 的 **事件任务** 代劳

1.打开 **MCSManager** 文件夹根目录，右键 **start.bat**，点击 **创建快捷方式**，生成一个快捷方式~~(废话)~~

2.**右键Windows开始**，点击 **启动** 或直接 **Win徽标键＋R**，输入

```
shell:startup
```

将 **start.bat** 快捷方式拖入到弹出的文件夹里

完成后，系统将在你 **首次登录** 后启动 MCSManager，然后通过 MCSManager 的 事件任务 启动 Frpc 服务

> 如果你需要在登录自启动的基础上实现开机自启动，请你参考微软官方的 [Autologon](https://learn.microsoft.com/zh-cn/sysinternals/downloads/autologon) 自动登录工具进行配置

