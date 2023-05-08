# 指定基础镜像，必须为第一个命令
FROM nginx
# 复制构建文件到容器中
COPY ./docs/.vuepress/dist/ /usr/share/nginx/www/
# 复制nginx配置到容器中
COPY ./nginx.conf /etc/nginx/conf.d/knowledge-record.conf
# 指定端口
EXPOSE 80
