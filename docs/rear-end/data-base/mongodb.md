# mongodb

## 安装指南

> 网上安装教程很多，可查阅安装，目前mongodb已不开源，个人开发用community版本也够用

### 恢复数据到mongo

```javascript
// 到mongodb安装目录下的bin目录，没有恢复工具则需要到官网下载mongoresotre工具
// -d 指定数据库名称
// 最后的路径为备份的数据文件路径
./mongorestore -d elm /Users/yusongh/Downloads/elm
```

### 启动

```javascript
// 指定数据库目录
mongod --dbpath /Users/yusongh/Applications/MongoDB/mongodb/data/db/
```


