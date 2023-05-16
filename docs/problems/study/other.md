# 其他

## （1）在 package.json 中的 script 中添加命令，如执行目录，需要加双引号（双引号要加转义符）

例如：

```json
"scripts": {
    "format": "prettier --write \"./**/*.{html,vue,ts,js,json,md}\"",
    "lint:style": "stylelint \"./**/*.{css,less,vue,html}\" --fix"
}
```

## (2)vite 项目添加环境变量，怎么让 ts 支持智能提示（即自己新增的自定义环境变量）

```
// .env.development
VITE_REQUEST_BASE_URL = "XXXX"
```

在根目录下的`env.d.ts`声明文件中加入以下声明

```typescript
interface ImportMetaEnv {
  readonly VITE_REQUEST_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

