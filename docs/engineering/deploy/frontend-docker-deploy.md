# 前端docker部署

## 一、连接linux服务器

```bash
ssh root@81.71.165.226
```

## 二、安装docker

### 1、安装需要的安装包

```bash
#查看是否安装了docker
yum list installed | grep docker

yum install -y yum-utils device-mapper-persistent-data lvm2
```

### 2、设置镜像的仓库

- 默认镜像（国外的）

  ```bash
  yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
  ```

  

- 阿里云的镜像（推荐）

  ```bash
  yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
  ```

###  3、更新yum软件包的索引

```bash
yum makecache fast

yum makecache  #centos8
```

### 4、安装docker docker-ce社区版 ee是企业版

```bash
yum install docker-ce docker-ce-cli  containerd.io
```

### 5、启动docker

```bash
systemctl start docker
```

### 6、测试

```bash
docker run hello-world
```

### 7、查看docker服务状态

![image-20211014213935697](/Users/yusongh/Library/Application Support/typora-user-images/image-20211014213935697.png)



## 三、基于docker安装nginx

### 1、查看docker已有的images（镜像）

```bash
docker images
```

![image-20211015203159825](/Users/yusongh/Library/Application Support/typora-user-images/image-20211015203159825.png)

### 2、查询需要下载的nginx镜像

```bash
docker search nginx
```

![image-20211015203406242](/Users/yusongh/Library/Application Support/typora-user-images/image-20211015203406242.png)

### 3、拉取nginx镜像

```bash
docker pull nginx
```

![image-20211015203610786](/Users/yusongh/Library/Application Support/typora-user-images/image-20211015203610786.png)

### 4、查看是否拉取成功

```bash
docker images
```

![image-20211015203736477](/Users/yusongh/Library/Application Support/typora-user-images/image-20211015203736477.png)

### 5、启动镜像

> -d:表示在后台运行
> -p:端口映射 冒号前是本机端口，冒号后是容器端口
> --name=镜像名称 最后的nginx是创建的nginx镜像

```bash
docker run -d -p 8080:80 --name=iamgeName nginx
```

### 6、查看是否可以访问

>  输入服务器公网ip:8080，如果看到了以下界面就说明nginx已经安装成功了

![image-20211015205526089](/Users/yusongh/Library/Application Support/typora-user-images/image-20211015205526089.png)



### 7、如果没有看到这个界面，可能是购买的云服务器没有配置端口，下面以腾讯云为例，讲一下怎么配置

- 找到防火墙，然后点击添加规则，应用类型选择自定义

![image-20211015210126450](/Users/yusongh/Library/Application Support/typora-user-images/image-20211015210126450.png)

![image-20211015210205582](/Users/yusongh/Library/Application Support/typora-user-images/image-20211015210205582.png)

![image-20211015205502215](/Users/yusongh/Library/Application Support/typora-user-images/image-20211015205502215.png)

- 然后再访问服务器公网ip:8080



## 四、结合github action实现自动化CI

### 方案一：结合镜像容器服务托管镜像实现

#### 1、配置容器镜像服务

> 这里我选择的是[阿里云的容器镜像服务](https://cr.console.aliyun.com/cn-hangzhou/instances)

##### a. 创建实例

> 个人版免费，基本够用，运用于线上项目需要使用企业版

![image-20211018202903774](/Users/yusongh/Library/Application Support/typora-user-images/image-20211018202903774.png)

##### b. 设置登录密码

![image-20211018203057845](/Users/yusongh/Library/Application Support/typora-user-images/image-20211018203057845.png)

##### c. 创建镜像仓库

- 创建命名空间
- 创建镜像仓库
- 配置源代码
  - 我选择了本地仓库
    - 为了日志统一，可以在 Github Actions 看到所有日志，
    - 可以通过命令行直接推送镜像到镜像仓库，自由度比较高

![image-20211018204427051](/Users/yusongh/Library/Application Support/typora-user-images/image-20211018204427051.png)

##### d. 查看镜像仓库

> 点击仓库名称可以看到仓库的一些基本信息和操作指南

![image-20211018204921955](/Users/yusongh/Library/Application Support/typora-user-images/image-20211018204921955.png)

#### 2、在项目根目录下创建`nginx.conf`文件

```nginx
server {
  listen 80;
  server_name localhost;

  location / {
    root  /usr/share/nginx/html;
    index index.html index.htm;
    proxy_set_header Host $host;
    if (!-f $request_filename) {
      rewrite ^.*$ /index.html break;
    }
  }
  error_page 500 502 503 504 /50x.html;

  location = /50x.html {
    root /usr/share/nginx/html;
  }
}
```

#### 3、在项目根目录下创建`Dockerfile`文件

```dockerfile
# 指定基础镜像，必须为第一个命令
FROM nginx
# 复制构建文件到容器中
COPY ./dist/ /usr/share/nginx/html/
# 复制nginx配置到容器中
COPY ./nginx.conf /etc/nginx/conf.d/vue3-vite.conf
# 指定端口
EXPOSE 80
```

#### 4、在项目根目录下创建`dockerBootstrap.sh`文件

```sh
echo -e "---------登录镜像容器服务--------"
# 登录阿里云镜像容器服务
docker login --username=$1 registry.cn-hangzhou.aliyuncs.com --password=$2
echo -e "---------停掉镜像--------"
# 停掉容器
docker stop vue3-elm
echo -e "---------删除本地容器和镜像--------"
# 删除本地容器
docker rm vue3-elm
# 删除本地镜像
docker rmi registry.cn-hangzhou.aliyuncs.com/yusongh/vue3-elm:latest
echo -e "---------拉取镜像--------"
# 拉取镜像
docker pull registry.cn-hangzhou.aliyuncs.com/yusongh/vue3-elm:latest
echo -e "---------创建容器并运行容器--------"
# -rm: docker会在容器退出时删除与它关联的数据卷
# -d: 后台运行容器，并返回容器ID
# -p: 端口映射，本机端口:容器端口
# --name: 指定容器名称
# 最后一个为镜像名称
docker run --rm -d -p 8080:80 --name vue3-elm registry.cn-hangzhou.aliyuncs.com/yusongh/vue3-elm:latest
echo -e "---------执行完毕--------"
```

#### 5、在项目下创建`.github/workflows/test.yml`文件

```yaml
name: Docker Image CI # Actions名称

on: # 执行时机
  push:
    branches:
      - master

jobs:
  build:
    # runs-on 指定job任务运行所需要的虚拟机环境(必填字段)
    runs-on: ubuntu-latest
    steps:
      # 拉取代码
      - name: checkout # 步骤名字
        # 使用action库  actions/checkout拉取源码
        uses: actions/checkout@master

      # 安装依赖
      - name: install
        run: npm install

      # 打包
      - name: build project
        run: npm run build
        
      # 登录阿里云镜像容器服务，打包镜像，推送镜像
      - name: Build the Docker image
        run: |
          # 登录阿里云镜像容器服务
          docker login --username=${{ secrets.DOCKER_USERNAME }} registry.cn-hangzhou.aliyuncs.com --password=${{ secrets.DOCKER_PASSWORD }}
          # 使用当前目录的 Dockerfile 创建镜像，标签为 vue3-elm:latest
          docker build -t vue3-elm:latest . 
          # 打标签
          docker tag vue3-elm registry.cn-hangzhou.aliyuncs.com/yusongh/vue3-elm:latest
          # 推送到阿里云镜像容器服务
          docker push registry.cn-hangzhou.aliyuncs.com/yusongh/vue3-elm:latest
      # 登录服务器执行脚本
      - name: ssh docker login
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          password: ${{ secrets.SSH_PASSWORD }}
          script: cd /home/vue3-elm/ && sh vue3-elm.sh ${{ secrets.DOCKER_USERNAME }} ${{ secrets.DOCKER_PASSWORD }}
```

#### 6、配置Actions secrets

![image-20211021212435172](/Users/yusongh/Library/Application Support/typora-user-images/image-20211021212435172.png)

> 完成以上步骤，当提交代码到master分支时，就会触发github action的workflow。自动拉取代码，构建镜像到镜像容器服务，并登录服务器拉取镜像启动镜像。



### 方案二：映射服务器本机目录到容器（测试环境使用比较合适）

> 该方案省去了构建镜像到镜像服务，拉取打包代码后，直接覆盖服务器指定目录，该目录映射到容器中实现修改容器内资源

#### 1、映射本机目录到容器目录

> 解释一下标题
> 如果我们想修改nginx的配置，想更改nginx中的资源文件怎么办？就是将容器中的目录和本机目录做映射，以达到修改本机目录文件就影响到容器中的文件。

### 1、本机创建文件夹

- 大致目录

```bash
/home
    |---yusong
           |----nginx
                  |----conf.d
                  |----html
```

### 2、在conf.d文件夹下新建default.conf文件

```bash
server {
    listen       80;
    server_name  localhost;
    # 原来的配置，匹配根路径
    #location / {
    #    root   /usr/share/nginx/html;
    #    index  index.html index.htm;
    #}
    # 更该配置，匹配/路径，修改index.html的名字，用于区分该配置文件替换了容器中的配置文件
    location / {
        root   /usr/share/nginx/html;
        index  index-test.html index.htm;
    }
}
```

### 3、在html中编写index-test.html，用以判断文件夹映射成功

```html
<html>
  <body>
    <h1>this is homePage1</h2>
  </body>
</html>
```

#### 4、启动nginx(8080)，映射路径

```shell
docker run -d -p 8080:80 -v /home/panwei/nginx/conf.d:/etc/nginx/conf.d  -v /home/panwei/nginx/html:/usr/share/nginx/html nginx
```

> -v，-v的意思就是冒号前面代表本机路径，冒号后面代表容器内的路径，两个路径进行了映射，本机路径中的文件会覆盖容器内的文件。
> nginx容器内的一些文件位置：
> 日志位置：/var/log/nginx/
> 配置文件位置：/etc/nginx/
> 项目位置：/usr/share/nginx/html

